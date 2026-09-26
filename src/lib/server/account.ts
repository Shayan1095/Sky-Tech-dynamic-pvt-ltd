import "server-only";

import { createHash, randomBytes, randomInt, timingSafeEqual } from "node:crypto";
import { and, eq, isNull, sql } from "drizzle-orm";

import { db } from "./db";
import { adminRecoveryCodes, adminUsers, passwordResets } from "./schema";
import { verifyTotp } from "./totp";

/* ---------------------------------------------------------------------------
   Second factors, and the ways back in when one is lost.

   Two kinds of proof are accepted wherever a code is asked for: the six digits
   from an authenticator, or one of the ten recovery codes issued alongside it.
   Treating them as interchangeable is what stops a lost phone becoming a lost
   account — and what keeps the terminal out of the recovery path.
   ------------------------------------------------------------------------ */

const sha256 = (value: string) => createHash("sha256").update(value).digest("hex");

const RECOVERY_COUNT = 10;
/* No I, O, 0 or 1: these get read aloud and written down. */
const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function recoveryCode(): string {
  let out = "";
  for (let i = 0; i < 10; i += 1) out += ALPHABET[randomInt(ALPHABET.length)];
  return `${out.slice(0, 5)}-${out.slice(5)}`;
}

/* Issues a fresh set and returns them in plain text — the only moment they
   exist in readable form. Any previous set is destroyed, so codes written down
   before a reset cannot be used after it. */
export async function issueRecoveryCodes(userId: number): Promise<string[]> {
  const handle = db();
  if (!handle) return [];

  await handle.delete(adminRecoveryCodes).where(eq(adminRecoveryCodes.userId, userId));

  const codes = Array.from({ length: RECOVERY_COUNT }, recoveryCode);
  await handle.insert(adminRecoveryCodes).values(
    codes.map((code) => ({
      userId,
      codeHash: sha256(code.replace(/-/g, "").toUpperCase()),
      createdAt: new Date(),
    }))
  );
  return codes;
}

export async function countUnusedRecoveryCodes(userId: number): Promise<number> {
  const handle = db();
  if (!handle) return 0;
  const [row] = await handle
    .select({ n: sql<number>`COUNT(*)` })
    .from(adminRecoveryCodes)
    .where(and(eq(adminRecoveryCodes.userId, userId), isNull(adminRecoveryCodes.usedAt)));
  return Number(row?.n ?? 0);
}

/* Spends one recovery code. Returns false without spending anything if the
   code is unknown or already used. */
export async function spendRecoveryCode(userId: number, code: string): Promise<boolean> {
  const handle = db();
  if (!handle) return false;

  const normalised = code.replace(/[^A-Za-z0-9]/g, "").toUpperCase();
  if (normalised.length !== 10) return false;
  const wanted = sha256(normalised);

  const rows = await handle
    .select({ id: adminRecoveryCodes.id, hash: adminRecoveryCodes.codeHash })
    .from(adminRecoveryCodes)
    .where(and(eq(adminRecoveryCodes.userId, userId), isNull(adminRecoveryCodes.usedAt)));

  /* Every row is compared, and in constant time, so neither the number of
     codes left nor which one matched can be read from how long this took. */
  let matched: number | null = null;
  const wantedBuffer = Buffer.from(wanted);
  for (const row of rows) {
    const candidate = Buffer.from(row.hash);
    if (candidate.length === wantedBuffer.length && timingSafeEqual(candidate, wantedBuffer)) {
      matched = row.id;
    }
  }
  if (matched === null) return false;

  const result = await handle
    .update(adminRecoveryCodes)
    .set({ usedAt: new Date() })
    .where(and(eq(adminRecoveryCodes.id, matched), isNull(adminRecoveryCodes.usedAt)));

  // If it was spent between the read and the write, it does not count twice.
  const affected = (result as unknown as { affectedRows?: number }).affectedRows;
  return affected === undefined || affected > 0;
}

export type SecondFactor = { ok: false } | { ok: true; step: number | null };

/* Accepts either an authenticator code or a recovery code. The caller stores
   `step` against the account when one is returned, which is what stops a
   six-digit code being replayed inside its own window. */
export async function verifySecondFactor(
  user: { id: number; totpSecret: string | null; totpLastStep: number | null },
  code: string
): Promise<SecondFactor> {
  const trimmed = code.trim();

  if (user.totpSecret && /^\d{6}$/.test(trimmed.replace(/\s/g, ""))) {
    const result = verifyTotp(user.totpSecret, trimmed, user.totpLastStep);
    if (result.ok) return { ok: true, step: result.step };
    return { ok: false };
  }

  if (await spendRecoveryCode(user.id, trimmed)) return { ok: true, step: null };
  return { ok: false };
}

/* ---------------------------------------------------------------------------
   Password reset links.
   ------------------------------------------------------------------------ */

const RESET_MINUTES = 30;

/** Returns the token to put in the emailed link. Only its hash is stored. */
export async function createResetToken(userId: number, ipHash: string): Promise<string | null> {
  const handle = db();
  if (!handle) return null;

  const token = randomBytes(32).toString("base64url");
  await handle.insert(passwordResets).values({
    tokenHash: sha256(token),
    userId,
    expiresAt: new Date(Date.now() + RESET_MINUTES * 60 * 1000),
    ipHash,
    createdAt: new Date(),
  });
  return token;
}

export type ResetTarget = {
  userId: number;
  email: string;
  totpSecret: string | null;
  totpLastStep: number | null;
};

/* The account a token belongs to, or null when the token is unknown, expired,
   already spent, or its account has been deactivated. */
export async function resolveResetToken(token: string): Promise<ResetTarget | null> {
  const handle = db();
  if (!handle || !token) return null;

  const [row] = await handle
    .select({
      userId: passwordResets.userId,
      email: adminUsers.email,
      totpSecret: adminUsers.totpSecret,
      totpLastStep: adminUsers.totpLastStep,
      isActive: adminUsers.isActive,
    })
    .from(passwordResets)
    .innerJoin(adminUsers, eq(adminUsers.id, passwordResets.userId))
    .where(
      and(
        eq(passwordResets.tokenHash, sha256(token)),
        isNull(passwordResets.usedAt),
        sql`${passwordResets.expiresAt} > UTC_TIMESTAMP()`
      )
    )
    .limit(1);

  if (!row || row.isActive !== 1) return null;
  return {
    userId: row.userId,
    email: row.email,
    totpSecret: row.totpSecret,
    totpLastStep: row.totpLastStep,
  };
}

export async function spendResetToken(token: string): Promise<void> {
  const handle = db();
  if (!handle) return;
  await handle
    .update(passwordResets)
    .set({ usedAt: new Date() })
    .where(eq(passwordResets.tokenHash, sha256(token)));
}

/* Any other outstanding link for the same account stops working once one is
   used, so an older email cannot be replayed later. */
export async function clearResetTokens(userId: number): Promise<void> {
  const handle = db();
  if (!handle) return;
  await handle
    .update(passwordResets)
    .set({ usedAt: new Date() })
    .where(and(eq(passwordResets.userId, userId), isNull(passwordResets.usedAt)));
}
