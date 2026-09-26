import "server-only";

import { and, desc, eq, gte, ne, sql } from "drizzle-orm";

import { db } from "./db";
import { clientServices, clients, enquiries } from "./schema";

/* ---------------------------------------------------------------------------
   Dashboard figures.

   Every number here is counted from rows that exist. Nothing is projected,
   annualised from a single data point, or padded to look healthier than it is
   — a dashboard that flatters is worse than no dashboard, because decisions
   get made on it.

   Two honesty rules are carried through to the screen:

   1. An open-ended quote ("$2,500+") contributes its floor, and the count of
      such quotes travels with the total so it can be labelled as a minimum.
   2. Recurring and one-off money are never added together. They are different
      kinds of number and a combined figure means nothing.
   ------------------------------------------------------------------------ */

export type Stats = {
  enquiries: {
    total: number;
    unread: number;
    last30: number;
    previous30: number;
    byStatus: { status: string; count: number }[];
    byService: { service: string; count: number }[];
  };
  pipeline: {
    /* Quoted on enquiries not yet lost — what is being talked about, not what
       has been won. */
    once: number;
    monthly: number;
    yearly: number;
    openEnded: number;
  };
  clients: {
    total: number;
    active: number;
    leads: number;
  };
  revenue: {
    /* Signed work only: client_services with status "active". */
    monthlyRecurring: number;
    oneOffTotal: number;
    activeServices: number;
  };
};

const EMPTY: Stats = {
  enquiries: { total: 0, unread: 0, last30: 0, previous30: 0, byStatus: [], byService: [] },
  pipeline: { once: 0, monthly: 0, yearly: 0, openEnded: 0 },
  clients: { total: 0, active: 0, leads: 0 },
  revenue: { monthlyRecurring: 0, oneOffTotal: 0, activeServices: 0 },
};

const days = (n: number) => sql`DATE_SUB(UTC_TIMESTAMP(), INTERVAL ${n} DAY)`;
const num = (value: unknown) => Number(value ?? 0);

export async function getStats(): Promise<Stats> {
  const handle = db();
  if (!handle) return EMPTY;

  /* Six queries, none of which depends on another, were being awaited one
     after the next — so the page waited six network round-trips to build one
     screen. Issued together they cost roughly one. */
  const [totalsRows, byStatus, byService, pipelineRows, clientRows, revenueRows] =
    await Promise.all([
      handle
        .select({
          total: sql<number>`COUNT(*)`,
          unread: sql<number>`SUM(CASE WHEN ${enquiries.status} = 'new' THEN 1 ELSE 0 END)`,
          last30: sql<number>`SUM(CASE WHEN ${enquiries.createdAt} >= ${days(30)} THEN 1 ELSE 0 END)`,
          // The 30 days before that, so "last 30 days" has something to be
          // compared against rather than floating on its own.
          previous30: sql<number>`SUM(CASE WHEN ${enquiries.createdAt} >= ${days(60)} AND ${enquiries.createdAt} < ${days(30)} THEN 1 ELSE 0 END)`,
        })
        .from(enquiries),

      handle
        .select({ status: enquiries.status, count: sql<number>`COUNT(*)` })
        .from(enquiries)
        .groupBy(enquiries.status),

      handle
        .select({ service: enquiries.service, count: sql<number>`COUNT(*)` })
        .from(enquiries)
        .where(ne(enquiries.service, ""))
        .groupBy(enquiries.service)
        .orderBy(desc(sql`COUNT(*)`))
        .limit(6),

      handle
        .select({
          once: sql<number>`COALESCE(SUM(${enquiries.estimateOnce}), 0)`,
          monthly: sql<number>`COALESCE(SUM(${enquiries.estimateMonthly}), 0)`,
          yearly: sql<number>`COALESCE(SUM(${enquiries.estimateYearly}), 0)`,
          openEnded: sql<number>`COALESCE(SUM(${enquiries.estimateOpen}), 0)`,
        })
        .from(enquiries)
        .where(ne(enquiries.status, "archived")),

      handle
        .select({
          total: sql<number>`COUNT(*)`,
          active: sql<number>`SUM(CASE WHEN ${clients.status} = 'active' THEN 1 ELSE 0 END)`,
          leads: sql<number>`SUM(CASE WHEN ${clients.status} = 'lead' THEN 1 ELSE 0 END)`,
        })
        .from(clients),

      handle
        .select({
          // A yearly agreement is divided by twelve to sit alongside monthly ones.
          monthlyRecurring: sql<number>`COALESCE(SUM(CASE
            WHEN ${clientServices.billing} = 'monthly' THEN ${clientServices.amount}
            WHEN ${clientServices.billing} = 'yearly' THEN ${clientServices.amount} / 12
            ELSE 0 END), 0)`,
          oneOffTotal: sql<number>`COALESCE(SUM(CASE
            WHEN ${clientServices.billing} = 'once' THEN ${clientServices.amount}
            ELSE 0 END), 0)`,
          activeServices: sql<number>`COUNT(*)`,
        })
        .from(clientServices)
        .where(eq(clientServices.status, "active")),
    ]);

  const totals = totalsRows[0];
  const pipeline = pipelineRows[0];
  const clientTotals = clientRows[0];
  const revenue = revenueRows[0];

  return {
    enquiries: {
      total: num(totals?.total),
      unread: num(totals?.unread),
      last30: num(totals?.last30),
      previous30: num(totals?.previous30),
      byStatus: byStatus.map((r) => ({ status: r.status, count: num(r.count) })),
      byService: byService.map((r) => ({ service: r.service, count: num(r.count) })),
    },
    pipeline: {
      once: num(pipeline?.once),
      monthly: num(pipeline?.monthly),
      yearly: num(pipeline?.yearly),
      openEnded: num(pipeline?.openEnded),
    },
    clients: {
      total: num(clientTotals?.total),
      active: num(clientTotals?.active),
      leads: num(clientTotals?.leads),
    },
    revenue: {
      monthlyRecurring: num(revenue?.monthlyRecurring),
      oneOffTotal: num(revenue?.oneOffTotal),
      activeServices: num(revenue?.activeServices),
    },
  };
}

/* Recent enquiries for the dashboard's own short list. */
export async function recentEnquiries(limit = 5) {
  const handle = db();
  if (!handle) return [];
  return handle
    .select({
      id: enquiries.id,
      reference: enquiries.reference,
      name: enquiries.name,
      company: enquiries.company,
      service: enquiries.service,
      estimate: enquiries.estimate,
      status: enquiries.status,
      createdAt: enquiries.createdAt,
    })
    .from(enquiries)
    .where(and(gte(enquiries.id, 0)))
    .orderBy(desc(enquiries.createdAt))
    .limit(limit);
}

/* ---------------------------------------------------------------------------
   Series for the charts.

   Each is counted from rows, and each returns the empty weeks and months as
   zeroes rather than leaving them out. A chart that silently skips the quiet
   weeks makes a business look busier than it was.
   ------------------------------------------------------------------------ */

export type Bucket = { label: string; value: number };

/** Enquiries per week, oldest first, including weeks with none. */
export async function weeklyEnquiries(weeks = 12): Promise<Bucket[]> {
  const handle = db();
  const empty = Array.from({ length: weeks }, (_, i) => ({
    label: i === weeks - 1 ? "now" : `${weeks - 1 - i}w`,
    value: 0,
  }));
  if (!handle) return empty;

  try {
    const rows = await handle
      .select({
        bucket: sql<number>`FLOOR(DATEDIFF(UTC_TIMESTAMP(), ${enquiries.createdAt}) / 7)`,
        count: sql<number>`COUNT(*)`,
      })
      .from(enquiries)
      .where(gte(enquiries.createdAt, days(weeks * 7)))
      .groupBy(sql`FLOOR(DATEDIFF(UTC_TIMESTAMP(), ${enquiries.createdAt}) / 7)`);

    const series = [...empty];
    for (const row of rows) {
      // Bucket 0 is this week, which is the last column.
      const index = weeks - 1 - Number(row.bucket);
      if (index >= 0 && index < weeks) series[index] = { ...series[index], value: num(row.count) };
    }
    return series;
  } catch {
    return empty;
  }
}

export type FunnelStage = { label: string; value: number; note?: string };

/* Enquiry to client to paying. The two drops are the only numbers on the
   dashboard that say whether the website is doing its job. */
export async function funnel(): Promise<FunnelStage[]> {
  const handle = db();
  if (!handle) return [];

  // Three independent counts, so three round-trips became one wait.
  const [[enquiryCount], [clientCount], [payingCount]] = await Promise.all([
    handle.select({ n: sql<number>`COUNT(*)` }).from(enquiries),
    handle.select({ n: sql<number>`COUNT(*)` }).from(clients),
    handle
      .select({ n: sql<number>`COUNT(DISTINCT ${clientServices.clientId})` })
      .from(clientServices)
      .where(eq(clientServices.status, "active")),
  ]);

  return [
    { label: "Enquiries received", value: num(enquiryCount?.n) },
    { label: "Became a client", value: num(clientCount?.n) },
    {
      label: "Paying for something",
      value: num(payingCount?.n),
      note: "Clients with at least one active service",
    },
  ];
}

/* Monthly recurring revenue at the end of each of the last N months. A service
   counts in a month if it had started by then and had not ended before it. */
export async function revenueHistory(months = 6): Promise<Bucket[]> {
  const handle = db();
  const labels = Array.from({ length: months }, (_, i) => {
    const date = new Date();
    date.setUTCDate(1);
    date.setUTCMonth(date.getUTCMonth() - (months - 1 - i));
    return new Intl.DateTimeFormat("en-GB", { month: "short", timeZone: "UTC" }).format(date);
  });

  if (!handle) return labels.map((label) => ({ label, value: 0 }));

  try {
    /* This was a loop: one query per month, awaited in turn, so a six-month
       chart cost six round-trips to answer a question about a table that is
       almost always tiny. The rows are fetched once and the months counted
       here, where it costs nothing. */
    const rows = await handle
      .select({
        amount: clientServices.amount,
        billing: clientServices.billing,
        startedOn: clientServices.startedOn,
        endsOn: clientServices.endsOn,
      })
      .from(clientServices)
      .where(eq(clientServices.status, "active"));

    const now = new Date();
    return labels.map((label, index) => {
      /* The last day of the month this column represents, and the first —
         the same two boundaries the SQL used, so the figures are unchanged. */
      const back = months - 1 - index;
      const firstOfMonth = new Date(
        Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - back, 1)
      );
      const endOfMonth = new Date(
        Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - back + 1, 0, 23, 59, 59)
      );

      const value = rows.reduce((sum, row) => {
        const started = row.startedOn;
        const ended = row.endsOn;
        if (started && started > endOfMonth) return sum;
        if (ended && ended < firstOfMonth) return sum;

        const amount = Number(row.amount);
        if (row.billing === "monthly") return sum + amount;
        if (row.billing === "yearly") return sum + amount / 12;
        return sum;
      }, 0);

      return { label, value };
    });
  } catch {
    return labels.map((label) => ({ label, value: 0 }));
  }
}
