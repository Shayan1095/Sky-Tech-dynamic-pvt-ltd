import "server-only";

import { createHash } from "node:crypto";
import { and, desc, gte, sql } from "drizzle-orm";

import { db } from "./db";
import { ipSalt } from "./env";
import { pageViews } from "./schema";

/* ---------------------------------------------------------------------------
   Counting visits.

   The identifier is a hash of the day, the address, the browser string and the
   server's own salt. Including the day is the point: the same browser hashes
   to something different tomorrow, so this can count people per day and
   cannot follow anybody between days. That is what makes it countable without
   being surveillance — and why it needs no cookie and no banner.
   ------------------------------------------------------------------------ */

const BOTS =
  /bot|crawler|spider|crawling|facebookexternalhit|slurp|bingpreview|headless|lighthouse|pingdom|gtmetrix|curl|wget|python-requests|node-fetch/i;

export const isBot = (userAgent: string) => BOTS.test(userAgent);

export function visitorFingerprint(
  day: string,
  address: string,
  userAgent: string
): string {
  return createHash("sha256")
    .update(`${ipSalt()}:${day}:${address}:${userAgent}`)
    .digest("hex");
}

/* Only the host, so a referring URL cannot carry a search term or a private
   address into the database. */
export function referrerHost(referrer: string): string {
  if (!referrer) return "";
  try {
    const host = new URL(referrer).hostname.replace(/^www\./, "");
    return host.slice(0, 120);
  } catch {
    return "";
  }
}

export async function recordView(input: {
  path: string;
  referrer: string;
  device: "mobile" | "desktop";
  address: string;
  userAgent: string;
}): Promise<void> {
  const handle = db();
  if (!handle) return;

  const day = new Date().toISOString().slice(0, 10);
  await handle.insert(pageViews).values({
    day,
    path: input.path.slice(0, 255),
    referrer: referrerHost(input.referrer),
    device: input.device,
    visitorHash: visitorFingerprint(day, input.address, input.userAgent),
    createdAt: new Date(),
  });
}

/* ---------------------------------------------------------------------------
   Reading it back.
   ------------------------------------------------------------------------ */

export type Traffic = {
  days: { label: string; day: string; views: number; visitors: number }[];
  totals: { views: number; visitors: number; mobileShare: number };
  pages: { path: string; views: number }[];
  referrers: { referrer: string; views: number }[];
};

const EMPTY: Traffic = {
  days: [],
  totals: { views: 0, visitors: 0, mobileShare: 0 },
  pages: [],
  referrers: [],
};

/* The window as a list of day strings, oldest first, built the same way
   recordView builds them — UTC, from toISOString — so they match the stored
   values character for character. A local-time helper here would silently
   miss rows either side of midnight. */
function daysInWindow(count: number): string[] {
  const today = Date.now();
  return Array.from({ length: count }, (_, i) => {
    const date = new Date(today - (count - 1 - i) * 24 * 60 * 60 * 1000);
    return date.toISOString().slice(0, 10);
  });
}

export async function getTraffic(days = 30): Promise<Traffic> {
  const handle = db();
  if (!handle) return EMPTY;

  /* Filtered on the day column rather than the timestamp, so the headline
     totals and the chart cover exactly the same days. An interval measured
     from the current time reaches back into a thirty-first day, and a visit
     from that morning would be counted in the totals while having no bar to
     sit in. Comparing YYYY-MM-DD as text is a correct date comparison, and
     there is an index on it. */
  const span = daysInWindow(days);
  const window = gte(pageViews.day, span[0]);

  try {
    // Four independent reads of the same table, issued together rather than
    // in a queue four deep.
    const [byDay, totalsRows, pages, referrers] = await Promise.all([
      handle
      .select({
        day: pageViews.day,
        views: sql<number>`COUNT(*)`,
        visitors: sql<number>`COUNT(DISTINCT ${pageViews.visitorHash})`,
      })
      .from(pageViews)
      .where(window)
      .groupBy(pageViews.day)
      .orderBy(pageViews.day),

      handle
      .select({
        views: sql<number>`COUNT(*)`,
        visitors: sql<number>`COUNT(DISTINCT ${pageViews.visitorHash})`,
        mobile: sql<number>`SUM(CASE WHEN ${pageViews.device} = 'mobile' THEN 1 ELSE 0 END)`,
      })
      .from(pageViews)
      .where(window),

      handle
      .select({ path: pageViews.path, views: sql<number>`COUNT(*)` })
      .from(pageViews)
      .where(window)
      .groupBy(pageViews.path)
      .orderBy(desc(sql`COUNT(*)`))
      .limit(10),

      handle
      .select({ referrer: pageViews.referrer, views: sql<number>`COUNT(*)` })
      .from(pageViews)
      .where(and(window, sql`${pageViews.referrer} <> ''`))
      .groupBy(pageViews.referrer)
      .orderBy(desc(sql`COUNT(*)`))
      .limit(8),
    ]);

    const totals = totalsRows[0];
    const totalViews = Number(totals?.views ?? 0);

    /* Grouping returns only the days that had a visit, so a quiet month came
       back as one row and the chart drew it as a single full-width bar
       labelled "last 30 days". Every day in the window is emitted, zeroes
       included: the gaps are the shape of the thing being measured. */
    const counted = new Map(byDay.map((row) => [row.day, row]));

    return {
      days: span.map((day) => {
        const row = counted.get(day);
        return {
          day,
          label: day.slice(8),
          views: Number(row?.views ?? 0),
          visitors: Number(row?.visitors ?? 0),
        };
      }),
      totals: {
        views: totalViews,
        visitors: Number(totals?.visitors ?? 0),
        mobileShare:
          totalViews > 0 ? Math.round((Number(totals?.mobile ?? 0) / totalViews) * 100) : 0,
      },
      pages: pages.map((row) => ({ path: row.path, views: Number(row.views) })),
      referrers: referrers.map((row) => ({
        referrer: row.referrer,
        views: Number(row.views),
      })),
    };
  } catch {
    return EMPTY;
  }
}
