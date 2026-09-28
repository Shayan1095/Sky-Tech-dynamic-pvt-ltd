import "server-only";

import { and, desc, eq, isNull, lte, or, gte } from "drizzle-orm";

import { SERVICE_GROUPS } from "@/lib/contact";

import { db } from "./db";
import { serviceOffers } from "./schema";

/* ---------------------------------------------------------------------------
   Offers.

   A promotion attached to a service. The site asks for one by service name
   and gets back the one that should be showing right now, or nothing.

   Three things decide that, and they are all checked in SQL rather than in
   the page, so an expired offer is never fetched and then hidden — it is
   never fetched:

     active        switched on
     started       starts_at is null, or already passed
     not finished  ends_at is null, or still ahead

   Times are compared in UTC, like everything else in this database. An offer
   written for "the end of March" therefore ends at the same instant for a
   visitor in Karachi and one in London, which is the only version of that
   promise that can be kept.

   A row for "*" applies to every service. A service's own offer wins over it,
   so a general sale can run while one service advertises something better.
   ------------------------------------------------------------------------ */

export const ALL_SERVICES = "*";

/* Every service an offer may be attached to, plus the catch-all.

   This lives here rather than beside the actions because everything a
   "use server" module exports has to be an async function — a plain helper
   in that file is a build error, not a lint warning. It is only a list, so
   it belongs with the reading side anyway. */
export function offerTargets(): string[] {
  const names = new Set<string>();
  for (const group of SERVICE_GROUPS) {
    for (const service of group.services) names.add(service.name);
  }
  /* Named on the Media & Event page, which has no entry in the service
     groups but does have offers worth running. */
  names.add("Weddings");
  return [ALL_SERVICES, ...[...names].sort()];
}

export type Offer = {
  title: string;
  body: string;
  code: string;
  endsAt: Date | null;
};

/** The live offer for a service, or null. Never throws. */
export async function getOffer(serviceName: string): Promise<Offer | null> {
  const handle = db();
  if (!handle) return null;

  try {
    const now = new Date();
    const rows = await handle
      .select({
        serviceName: serviceOffers.serviceName,
        title: serviceOffers.title,
        body: serviceOffers.body,
        code: serviceOffers.code,
        endsAt: serviceOffers.endsAt,
      })
      .from(serviceOffers)
      .where(
        and(
          or(eq(serviceOffers.serviceName, serviceName), eq(serviceOffers.serviceName, ALL_SERVICES)),
          eq(serviceOffers.isActive, 1),
          or(isNull(serviceOffers.startsAt), lte(serviceOffers.startsAt, now)),
          or(isNull(serviceOffers.endsAt), gte(serviceOffers.endsAt, now))
        )
      )
      .orderBy(desc(serviceOffers.updatedAt));

    if (rows.length === 0) return null;

    /* The service's own offer in preference to the catch-all, and within
       either, the most recently edited. */
    const own = rows.find((row) => row.serviceName === serviceName);
    const row = own ?? rows[0];

    return { title: row.title, body: row.body, code: row.code, endsAt: row.endsAt };
  } catch {
    /* An offer is an extra, never the page. A database that cannot be reached
       costs a visitor a discount banner, not the thing they came to read. */
    return null;
  }
}

/* How many are actually showing on the site.

   A plain function rather than a few lines in the page: reading the clock is
   a side effect, and a server component's body is supposed to be pure — the
   same props must give the same output. Here the clock is read once, inside
   something that is honestly a function of the time. */
export function liveCount(
  rows: readonly { isActive: number; startsAt: Date | null; endsAt: Date | null }[]
): number {
  const now = Date.now();
  return rows.filter((row) => {
    if (row.isActive !== 1) return false;
    if (row.startsAt && row.startsAt.getTime() > now) return false;
    if (row.endsAt && row.endsAt.getTime() < now) return false;
    return true;
  }).length;
}

/** Every offer, newest first — for the panel, which shows expired ones too. */
export async function listOffers() {
  const handle = db();
  if (!handle) return [];
  try {
    return await handle.select().from(serviceOffers).orderBy(desc(serviceOffers.updatedAt));
  } catch {
    return [];
  }
}
