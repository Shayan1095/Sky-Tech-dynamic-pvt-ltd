"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq, sql } from "drizzle-orm";
import QRCode from "qrcode";

import { audit } from "@/lib/server/audit";
import {
  clearResetTokens,
  createResetToken,
  issueRecoveryCodes,
  resolveResetToken,
  spendResetToken,
  verifySecondFactor,
} from "@/lib/server/account";
import { createSession, currentAdmin, destroyAllSessions, visitorHash } from "@/lib/server/auth";
import { db } from "@/lib/server/db";
import { mailConfig } from "@/lib/server/env";
import { flushMail, queueEmail } from "@/lib/server/mail";
import { hashPassword, verifyPassword } from "@/lib/server/password";
import { allow } from "@/lib/server/rate-limit";
import { adminUsers } from "@/lib/server/schema";
import { enrolmentUri, newSecret, verifyTotp } from "@/lib/server/totp";
import { revokeTrustedDevices } from "@/lib/server/trusted";
import { SITE_URL } from "@/lib/site";

/* Everything an administrator can do to their own credentials, plus the way
   back in when they cannot sign in at all.

   One rule runs through all of it: changing a credential always requires
   proving the current one. A password change needs the old password and a
   second factor; a new authenticator needs the password. Without that, a
   session someone walked away from is enough to take the account permanently.
   ------------------------------------------------------------------------ */

const MIN_PASSWORD = 12;

export type TotpSetup =
  | { error: string }
  | { qr: string; secret: string }
  | { done: true; codes: string[] }
  | null;

/* Step one of enrolment: a secret is generated and held as "pending". It does
   not replace the current authenticator until a code from it has been typed
   back, so a mis-scanned QR cannot lock the account out of itself. */
export async function startTotpSetup(): Promise<TotpSetup> {
  const admin = await currentAdmin();
  if (!admin) redirect("/admin/login");

  const handle = db();
  if (!handle) return { error: "No database is connected." };

  const secret = newSecret();
  await handle
    .update(adminUsers)
    .set({ pendingTotpSecret: secret, updatedAt: new Date() })
    .where(eq(adminUsers.id, admin.id));

  const qr = await QRCode.toDataURL(enrolmentUri(secret, admin.email), {
    margin: 1,
    width: 220,
    color: { dark: "#0b1f35", light: "#ffffff" },
  });

  return { qr, secret };
}

/* Step two: the code proves the authenticator holds the same secret. Only
   then does it become the real one — and a fresh set of recovery codes is
   issued, because the old set belonged to the old authenticator. */
export async function confirmTotpSetup(
  _previous: TotpSetup,
  formData: FormData
): Promise<TotpSetup> {
  const admin = await currentAdmin();
  if (!admin) redirect("/admin/login");

  const handle = db();
  if (!handle) return { error: "No database is connected." };

  const code = String(formData.get("code") ?? "");
  const password = String(formData.get("password") ?? "");

  const [user] = await handle
    .select()
    .from(adminUsers)
    .where(eq(adminUsers.id, admin.id))
    .limit(1);
  if (!user?.pendingTotpSecret) return { error: "Start the setup again." };

  if (!(await verifyPassword(password, user.passwordHash))) {
    return { error: "That password is not right." };
  }

  const result = verifyTotp(user.pendingTotpSecret, code, null);
  if (!result.ok) {
    return { error: "That code did not match. Check the time on your phone and try again." };
  }

  await handle
    .update(adminUsers)
    .set({
      totpSecret: user.pendingTotpSecret,
      pendingTotpSecret: null,
      totpLastStep: result.step,
      updatedAt: new Date(),
    })
    .where(eq(adminUsers.id, admin.id));

  const codes = await issueRecoveryCodes(admin.id);

  await audit({
    userId: admin.id,
    actor: admin.email,
    action: "account.2fa_enrolled",
    target: admin.email,
  });

  revalidatePath("/admin/account");
  return { done: true, codes };
}

export type PasswordResult = { error: string } | { changed: true } | null;

export async function changePassword(
  _previous: PasswordResult,
  formData: FormData
): Promise<PasswordResult> {
  const admin = await currentAdmin();
  if (!admin) redirect("/admin/login");

  const handle = db();
  if (!handle) return { error: "No database is connected." };

  const current = String(formData.get("current") ?? "");
  const next = String(formData.get("next") ?? "");
  const confirm = String(formData.get("confirm") ?? "");
  const code = String(formData.get("code") ?? "");

  if (next.length < MIN_PASSWORD) {
    return { error: `Use at least ${MIN_PASSWORD} characters.` };
  }
  if (next !== confirm) return { error: "The two new passwords do not match." };
  /* Reached only when all three boxes hold the same text, which in practice
     means a password manager filled the new ones with the saved password
     rather than that someone typed it three times. Saying so is the
     difference between a dead end and a fix. */
  if (next === current) {
    return {
      error:
        "The new password is the same as the current one. If your browser filled these in for you, press Show on each box, clear the two new-password fields, and type the new one by hand.",
    };
  }

  if (!(await allow(`pwchange:${admin.id}`, 5, 60 * 60))) {
    return { error: "Too many attempts. Try again later." };
  }

  const [user] = await handle
    .select()
    .from(adminUsers)
    .where(eq(adminUsers.id, admin.id))
    .limit(1);
  if (!user) return { error: "Something went wrong. Sign in again." };

  if (!(await verifyPassword(current, user.passwordHash))) {
    await audit({
      userId: admin.id,
      actor: admin.email,
      action: "account.password_failed",
      target: admin.email,
    });
    return { error: "Your current password is not right." };
  }

  const second = await verifySecondFactor(user, code);
  if (!second.ok) return { error: "That authenticator or recovery code is not right." };

  await handle
    .update(adminUsers)
    .set({
      passwordHash: await hashPassword(next),
      // Whatever an owner generated is now gone; the account is theirs.
      mustChangePassword: 0,
      ...(second.step !== null ? { totpLastStep: second.step } : {}),
      updatedAt: new Date(),
    })
    .where(eq(adminUsers.id, admin.id));

  /* Every other device is signed out, then this one is signed back in. A
     password change is the moment to end any session you did not start. */
  await destroyAllSessions(admin.id);
  await createSession(admin.id);

  await audit({
    userId: admin.id,
    actor: admin.email,
    action: "account.password_changed",
    target: admin.email,
    detail: "all other sessions ended",
  });

  revalidatePath("/admin/account");
  return { changed: true };
}

export type CodesResult = { error: string } | { codes: string[] } | null;

export async function regenerateCodes(
  _previous: CodesResult,
  formData: FormData
): Promise<CodesResult> {
  const admin = await currentAdmin();
  if (!admin) redirect("/admin/login");

  const handle = db();
  if (!handle) return { error: "No database is connected." };

  const password = String(formData.get("password") ?? "");
  const [user] = await handle
    .select()
    .from(adminUsers)
    .where(eq(adminUsers.id, admin.id))
    .limit(1);
  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    return { error: "That password is not right." };
  }

  const codes = await issueRecoveryCodes(admin.id);
  await audit({
    userId: admin.id,
    actor: admin.email,
    action: "account.recovery_codes_issued",
    target: admin.email,
  });

  revalidatePath("/admin/account");
  return { codes };
}

/* Forgets every browser that was told to skip the second factor. The first
   thing to reach for when a laptop goes missing — and it takes effect on the
   next sign-in attempt, not whenever a session happens to expire. */
export async function forgetTrustedDevices(): Promise<void> {
  const admin = await currentAdmin();
  if (!admin) redirect("/admin/login");

  await revokeTrustedDevices(admin.id);
  await audit({
    userId: admin.id,
    actor: admin.email,
    action: "account.devices_forgotten",
    target: admin.email,
  });

  revalidatePath("/admin/account");
}

/* ---------------------------------------------------------------------------
   Forgotten password.
   ------------------------------------------------------------------------ */

export type ForgotResult = { sent: true } | { error: string } | null;

/* Always answers the same way. Whether an address has an account is exactly
   what someone probing the form wants to learn, so the response never says. */
export async function requestReset(
  _previous: ForgotResult,
  formData: FormData
): Promise<ForgotResult> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase().slice(0, 254);
  const handle = db();
  if (!handle) return { error: "The panel is not configured yet." };

  const visitor = await visitorHash();
  if (!(await allow(`reset-ip:${visitor}`, 5, 60 * 60))) return { sent: true };
  if (email) await allow(`reset-user:${email}`, 3, 60 * 60);

  const [user] = await handle
    .select({ id: adminUsers.id, email: adminUsers.email, isActive: adminUsers.isActive })
    .from(adminUsers)
    .where(eq(adminUsers.email, email))
    .limit(1);

  const config = mailConfig();

  if (user && user.isActive === 1 && config) {
    const token = await createResetToken(user.id, visitor);
    if (token) {
      const link = `${SITE_URL}/admin/reset?token=${token}`;
      await queueEmail({
        enquiryId: null,
        to: user.email,
        replyTo: config.from,
        subject: "Reset your SKY Tech admin password",
        text: [
          "Someone asked to reset the password on your SKY Tech Dynamic admin account.",
          "",
          "Open this link within 30 minutes to choose a new one:",
          link,
          "",
          "You will also need your authenticator code, or one of your recovery codes.",
          "",
          "If this was not you, you can ignore this email — nothing has changed, and the",
          "link cannot be used without your second factor.",
        ].join("\n"),
      });
      await flushMail(3).catch(() => 0);
    }

    await audit({
      userId: user.id,
      actor: user.email,
      action: "account.reset_requested",
      target: user.email,
    });
  }

  return { sent: true };
}

export type ResetResult = { error: string } | { done: true } | null;

export async function resetPassword(
  _previous: ResetResult,
  formData: FormData
): Promise<ResetResult> {
  const token = String(formData.get("token") ?? "");
  const next = String(formData.get("next") ?? "");
  const confirm = String(formData.get("confirm") ?? "");
  const code = String(formData.get("code") ?? "");

  if (next.length < MIN_PASSWORD) return { error: `Use at least ${MIN_PASSWORD} characters.` };
  if (next !== confirm) return { error: "The two passwords do not match." };

  const visitor = await visitorHash();
  if (!(await allow(`reset-use:${visitor}`, 10, 60 * 60))) {
    return { error: "Too many attempts. Try again later." };
  }

  const target = await resolveResetToken(token);
  if (!target) return { error: "That link has expired or has already been used." };

  /* The emailed link alone is not enough. Reaching the mailbox proves access
     to the mailbox, not to the business. */
  const second = await verifySecondFactor(
    { id: target.userId, totpSecret: target.totpSecret, totpLastStep: target.totpLastStep },
    code
  );
  if (!second.ok) return { error: "That authenticator or recovery code is not right." };

  const handle = db();
  if (!handle) return { error: "No database is connected." };

  await handle
    .update(adminUsers)
    .set({
      passwordHash: await hashPassword(next),
      mustChangePassword: 0,
      failedAttempts: 0,
      lockedUntil: null,
      ...(second.step !== null ? { totpLastStep: second.step } : {}),
      updatedAt: sql`UTC_TIMESTAMP()`,
    })
    .where(eq(adminUsers.id, target.userId));

  await spendResetToken(token);
  await clearResetTokens(target.userId);
  await destroyAllSessions(target.userId);

  await audit({
    userId: target.userId,
    actor: target.email,
    action: "account.password_reset",
    target: target.email,
    detail: "via emailed link",
  });

  return { done: true };
}
