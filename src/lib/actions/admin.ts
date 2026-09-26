"use server";

import { redirect } from "next/navigation";
import { eq, sql } from "drizzle-orm";

import { audit } from "@/lib/server/audit";
import { createSession, destroySession, visitorHash } from "@/lib/server/auth";
import { db } from "@/lib/server/db";
import { hashPassword, needsRehash, verifyPassword } from "@/lib/server/password";
import { allow } from "@/lib/server/rate-limit";
import { adminUsers } from "@/lib/server/schema";
import { verifySecondFactor } from "@/lib/server/account";
import { isTrustedDevice, trustThisDevice } from "@/lib/server/trusted";

export type SignInResult = { error: string } | null;

/* Sign-in is deliberately one step: email, password and authenticator code
   together. A two-step flow has to hold "this password was correct" somewhere
   between the screens, and that halfway state is worth attacking. One step has
   no halfway.

   Every failure returns the same sentence. Telling someone that the email
   exists, or that only the code was wrong, hands them half the answer. */
const GENERIC = "Those details weren't right. Please try again.";

const LOCK_AFTER = 5;
const LOCK_MINUTES = 15;

export async function signIn(_previous: SignInResult, formData: FormData): Promise<SignInResult> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase().slice(0, 254);
  const password = String(formData.get("password") ?? "");
  // Accepts a six-digit authenticator code or a recovery code.
  const code = String(formData.get("code") ?? "");

  // The code may legitimately be empty on a browser that is already trusted.
  if (!email || !password) return { error: GENERIC };

  const handle = db();
  if (!handle) return { error: "The panel is not configured yet." };

  /* Two limits. One per address, so a single machine cannot work through a
     list of accounts; one per account, so a botnet cannot work through a list
     of passwords against one account. */
  const visitor = await visitorHash();
  if (!(await allow(`login-ip:${visitor}`, 10, 15 * 60))) return { error: GENERIC };
  if (!(await allow(`login-user:${email}`, 10, 15 * 60))) return { error: GENERIC };

  const [user] = await handle
    .select()
    .from(adminUsers)
    .where(eq(adminUsers.email, email))
    .limit(1);

  /* No early return on a missing account: the password is verified against a
     dummy hash so a wrong email and a wrong password take the same time. */
  const storedHash =
    user?.passwordHash ??
    "scrypt$32768$8$1$AAAAAAAAAAAAAAAAAAAAAA==$AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=";
  const passwordOk = await verifyPassword(password, storedHash);

  if (!user || user.isActive !== 1) return { error: GENERIC };

  if (user.lockedUntil && user.lockedUntil.getTime() > Date.now()) {
    await audit({ userId: user.id, actor: email, action: "login.locked", target: email });
    return { error: `Too many attempts. Try again in ${LOCK_MINUTES} minutes.` };
  }

  /* A browser this account has already proved itself on does not have to
     prove it again for thirty days. The password is still required — what is
     skipped is only the second factor, and only here. */
  const trusted = passwordOk ? await isTrustedDevice(user.id) : false;

  /* Either the six digits from the authenticator, or one of the recovery
     codes issued with it. A lost phone must not be a lost account. */
  const totpResult =
    trusted && code.trim() === ""
      ? ({ ok: true, step: null } as const)
      : user.totpSecret
        ? await verifySecondFactor(user, code)
        : ({ ok: false } as const);

  if (!passwordOk || !totpResult.ok) {
    const attempts = user.failedAttempts + 1;
    await handle
      .update(adminUsers)
      .set({
        failedAttempts: attempts,
        lockedUntil:
          attempts >= LOCK_AFTER
            ? sql`DATE_ADD(UTC_TIMESTAMP(), INTERVAL ${LOCK_MINUTES} MINUTE)`
            : null,
        updatedAt: new Date(),
      })
      .where(eq(adminUsers.id, user.id));

    await audit({
      userId: user.id,
      actor: email,
      action: "login.failed",
      target: email,
      // Which half failed is recorded for you, never shown to whoever tried.
      detail: passwordOk ? "code rejected" : "password rejected",
    });
    return { error: GENERIC };
  }

  // Correct password: the one moment it can be re-hashed if the cost has risen.
  const upgraded = needsRehash(user.passwordHash) ? await hashPassword(password) : undefined;

  await handle
    .update(adminUsers)
    .set({
      failedAttempts: 0,
      lockedUntil: null,
      // A recovery code has no step to remember; it is spent instead.
      ...(totpResult.ok && totpResult.step !== null ? { totpLastStep: totpResult.step } : {}),
      lastLoginAt: new Date(),
      updatedAt: new Date(),
      ...(upgraded ? { passwordHash: upgraded } : {}),
    })
    .where(eq(adminUsers.id, user.id));

  await createSession(user.id);

  // Asked for on the form, and only honoured once everything else has passed.
  if (formData.get("trust") === "on") await trustThisDevice(user.id);

  await audit({
    userId: user.id,
    actor: email,
    action: "login.success",
    target: email,
    detail: trusted ? "trusted device, second factor not required" : "",
  });

  redirect("/admin");
}

export async function signOut(): Promise<void> {
  await destroySession();
  redirect("/admin/login");
}
