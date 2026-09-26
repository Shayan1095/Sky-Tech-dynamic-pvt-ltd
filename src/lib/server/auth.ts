import "server-only";

import { createHash, randomBytes } from "node:crypto";
import { cookies, headers } from "next/headers";
import { and, eq, gt, lt, sql } from "drizzle-orm";

import { db } from "./db";
import { identify } from "./rate-limit";
import { adminSessions, adminUsers } from "./schema";

/* ---------------------------------------------------------------------------
   Admin sessions.

   The cookie holds a random token; the database holds only its SHA-256. A
   stolen database backup therefore contains nothing that can be replayed as a
   signed-in admin — which is not true of storing the token itself.

   Sessions are absolute, not sliding: eight hours after signing in you sign in
   again, whatever you were doing. For a panel that can change prices and read
   customer details, a forgotten open tab should not stay powerful overnight.
   ------------------------------------------------------------------------ */

const COOKIE = "sky_admin";
const LIFETIME_HOURS = 8;

const hashToken = (token: string) => createHash("sha256").update(token).digest("hex");

export type Admin = {
  id: number;
  email: string;
  name: string;
  role: "owner" | "editor";
  hasTotp: boolean;
  /* True while the password is still the temporary one an owner generated. */
  mustChangePassword: boolean;
};

export async function visitorHash(): Promise<string> {
  const list = await headers();
  return identify(list.get("x-forwarded-for"), list.get("x-real-ip"));
}

export async function userAgent(): Promise<string> {
  const list = await headers();
  return (list.get("user-agent") ?? "").slice(0, 255);
}

/** Issues a session and sets the cookie. Returns nothing the caller can leak. */
export async function createSession(userId: number): Promise<void> {
  const handle = db();
  if (!handle) throw new Error("No database");

  const token = randomBytes(32).toString("base64url");
  const expires = new Date(Date.now() + LIFETIME_HOURS * 60 * 60 * 1000);

  await handle.insert(adminSessions).values({
    tokenHash: hashToken(token),
    userId,
    expiresAt: expires,
    ipHash: await visitorHash(),
    userAgent: await userAgent(),
    createdAt: new Date(),
  });

  // Expired rows are cleared opportunistically; there is no scheduled job to
  // depend on, and the table stays small enough that this costs nothing.
  await handle.delete(adminSessions).where(lt(adminSessions.expiresAt, sql`UTC_TIMESTAMP()`));

  const jar = await cookies();
  jar.set(COOKIE, token, {
    httpOnly: true,
    // Not readable by script, not sent to other sites, and over HTTPS only in
    // production — local development has no certificate.
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires,
  });
}

/** The signed-in admin, or null. Safe to call from any server component. */
export async function currentAdmin(): Promise<Admin | null> {
  const handle = db();
  if (!handle) return null;

  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (!token) return null;

  const [row] = await handle
    .select({
      id: adminUsers.id,
      email: adminUsers.email,
      name: adminUsers.name,
      role: adminUsers.role,
      isActive: adminUsers.isActive,
      totpSecret: adminUsers.totpSecret,
      mustChangePassword: adminUsers.mustChangePassword,
    })
    .from(adminSessions)
    .innerJoin(adminUsers, eq(adminUsers.id, adminSessions.userId))
    .where(
      and(
        eq(adminSessions.tokenHash, hashToken(token)),
        gt(adminSessions.expiresAt, sql`UTC_TIMESTAMP()`)
      )
    )
    .limit(1);

  // A deactivated account loses access immediately, without waiting for its
  // session to expire.
  if (!row || row.isActive !== 1) return null;

  return {
    id: row.id,
    email: row.email,
    name: row.name,
    role: row.role,
    hasTotp: Boolean(row.totpSecret),
    mustChangePassword: row.mustChangePassword === 1,
  };
}

export async function destroySession(): Promise<void> {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  const handle = db();
  if (token && handle) {
    await handle.delete(adminSessions).where(eq(adminSessions.tokenHash, hashToken(token)));
  }
  jar.delete(COOKIE);
}

/** Signs every device out of one account — after a password change, or a scare. */
export async function destroyAllSessions(userId: number): Promise<void> {
  const handle = db();
  if (handle) await handle.delete(adminSessions).where(eq(adminSessions.userId, userId));
}
