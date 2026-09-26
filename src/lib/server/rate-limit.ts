import "server-only";

import { createHash } from "node:crypto";
import { eq, sql } from "drizzle-orm";

import { db } from "./db";
import { ipSalt } from "./env";
import { rateLimits } from "./schema";

/* ---------------------------------------------------------------------------
   Rate limiting, and the visitor identity it counts against.

   The address itself is never stored. It is hashed with a server-side salt,
   which is enough to recognise a repeat submission within the window and not
   enough to recover who sent it. Rotating IP_SALT resets every counter, which
   is the intended way to clear them.
   ------------------------------------------------------------------------ */

export function identify(forwardedFor: string | null, realIp: string | null): string {
  // x-forwarded-for is a list; the client is the first entry. Both proxies in
  // front of this site (Hostinger, Vercel) set it.
  const address = (forwardedFor?.split(",")[0] ?? realIp ?? "").trim();
  if (!address) return "unknown";
  return createHash("sha256").update(`${ipSalt()}:${address}`).digest("hex");
}

/* Returns true when the action may proceed. A database that is unreachable
   fails open: losing a genuine enquiry is worse than accepting a duplicate,
   and the submission has its own validation and honeypot ahead of this. */
export async function allow(
  bucket: string,
  limit: number,
  windowSeconds: number
): Promise<boolean> {
  const handle = db();
  if (!handle) return true;

  const cutoff = sql`DATE_SUB(UTC_TIMESTAMP(), INTERVAL ${windowSeconds} SECOND)`;

  try {
    /* One statement, so two simultaneous submissions cannot both read a stale
       count. An expired window resets the counter to 1 instead of being
       deleted, which keeps this to a single row per visitor. */
    await handle
      .insert(rateLimits)
      .values({ bucket, hits: 1, windowStartedAt: sql`UTC_TIMESTAMP()` })
      .onDuplicateKeyUpdate({
        set: {
          hits: sql`IF(${rateLimits.windowStartedAt} < ${cutoff}, 1, ${rateLimits.hits} + 1)`,
          windowStartedAt: sql`IF(${rateLimits.windowStartedAt} < ${cutoff}, UTC_TIMESTAMP(), ${rateLimits.windowStartedAt})`,
        },
      });

    const [row] = await handle
      .select({ hits: rateLimits.hits })
      .from(rateLimits)
      .where(eq(rateLimits.bucket, bucket))
      .limit(1);

    return !row || row.hits <= limit;
  } catch {
    return true;
  }
}
