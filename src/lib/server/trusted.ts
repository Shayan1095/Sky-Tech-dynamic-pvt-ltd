import "server-only";

import { createHash, randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { and, desc, eq, gt, lt, sql } from "drizzle-orm";

import { db } from "./db";
import { trustedDevices } from "./schema";
import { userAgent, visitorHash } from "./auth";

/* ---------------------------------------------------------------------------
   Remembering a browser that has already proved a second factor.

   The password is still asked for on every sign-in. What this removes is
   reaching for a phone thirty times a week to retype six digits on a machine
   that has already been proved once — which is the thing that makes people
   turn two-factor off altogether.

   Thirty days, then it asks again. Signing out does not end the trust; losing
   the laptop does, from the account screen.
   ------------------------------------------------------------------------ */

const COOKIE = "sky_trusted";
const DAYS = 30;

const hashToken = (token: string) => createHash("sha256").update(token).digest("hex");

/** True when this browser has been trusted by this account and is still in date. */
export async function isTrustedDevice(userId: number): Promise<boolean> {
  const handle = db();
  if (!handle) return false;

  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return false;

  const [row] = await handle
    .select({ hash: trustedDevices.tokenHash })
    .from(trustedDevices)
    .where(
      and(
        eq(trustedDevices.tokenHash, hashToken(token)),
        eq(trustedDevices.userId, userId),
        gt(trustedDevices.expiresAt, sql`UTC_TIMESTAMP()`)
      )
    )
    .limit(1);

  if (!row) return false;

  // Last used is kept so an old browser can be recognised on the account
  // screen and turned off deliberately.
  await handle
    .update(trustedDevices)
    .set({ lastUsedAt: new Date() })
    .where(eq(trustedDevices.tokenHash, row.hash));

  return true;
}

export async function trustThisDevice(userId: number): Promise<void> {
  const handle = db();
  if (!handle) return;

  const token = randomBytes(32).toString("base64url");
  const expires = new Date(Date.now() + DAYS * 24 * 60 * 60 * 1000);

  await handle.insert(trustedDevices).values({
    tokenHash: hashToken(token),
    userId,
    expiresAt: expires,
    ipHash: await visitorHash(),
    userAgent: await userAgent(),
    createdAt: new Date(),
  });

  // Expired rows are cleared opportunistically; there is no scheduled job to
  // depend on and the table stays small.
  await handle.delete(trustedDevices).where(lt(trustedDevices.expiresAt, sql`UTC_TIMESTAMP()`));

  const jar = await cookies();
  jar.set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/admin",
    expires,
  });
}

export async function listTrustedDevices(userId: number) {
  const handle = db();
  if (!handle) return [];
  return handle
    .select({
      userAgent: trustedDevices.userAgent,
      createdAt: trustedDevices.createdAt,
      lastUsedAt: trustedDevices.lastUsedAt,
      expiresAt: trustedDevices.expiresAt,
    })
    .from(trustedDevices)
    .where(and(eq(trustedDevices.userId, userId), gt(trustedDevices.expiresAt, sql`UTC_TIMESTAMP()`)))
    .orderBy(desc(trustedDevices.createdAt));
}

/* Every device at once. There is no "forget just this one" because the person
   reaching for this has usually lost something and wants all of it gone. */
export async function revokeTrustedDevices(userId: number): Promise<void> {
  const handle = db();
  if (!handle) return;
  await handle.delete(trustedDevices).where(eq(trustedDevices.userId, userId));
  (await cookies()).delete(COOKIE);
}
