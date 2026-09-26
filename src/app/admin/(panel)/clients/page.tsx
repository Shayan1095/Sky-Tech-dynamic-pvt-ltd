import Link from "next/link";
import { desc, eq, sql } from "drizzle-orm";

import { Card, Empty, Page, Pill, money, shortDate } from "@/components/admin/ui";
import { db } from "@/lib/server/db";
import { clientServices, clients } from "@/lib/server/schema";

export const dynamic = "force-dynamic";

export default async function ClientsPage() {
  const handle = db();

  if (!handle) {
    return (
      <Page eyebrow="Accounts" title="Clients">
        <Empty title="No database connected" body="Set DATABASE_URL and clients will appear here." />
      </Page>
    );
  }

  /* One query rather than one per client: the running totals are computed by
     the database, so a hundred clients costs the same round trip as one. */
  const rows = await handle
    .select({
      id: clients.id,
      name: clients.name,
      company: clients.company,
      email: clients.email,
      country: clients.country,
      status: clients.status,
      createdAt: clients.createdAt,
      services: sql<number>`COUNT(${clientServices.id})`,
      monthly: sql<number>`COALESCE(SUM(CASE
        WHEN ${clientServices.status} = 'active' AND ${clientServices.billing} = 'monthly'
          THEN ${clientServices.amount}
        WHEN ${clientServices.status} = 'active' AND ${clientServices.billing} = 'yearly'
          THEN ${clientServices.amount} / 12
        ELSE 0 END), 0)`,
      onceOff: sql<number>`COALESCE(SUM(CASE
        WHEN ${clientServices.status} = 'active' AND ${clientServices.billing} = 'once'
          THEN ${clientServices.amount}
        ELSE 0 END), 0)`,
    })
    .from(clients)
    .leftJoin(clientServices, eq(clientServices.clientId, clients.id))
    .groupBy(clients.id)
    .orderBy(desc(clients.createdAt))
    .limit(200);

  return (
    <Page
      eyebrow="Accounts"
      title="Clients"
      lead="People you are working with, and what they are paying for."
    >
      {rows.length === 0 ? (
        <Empty
          title="No clients yet"
          body="Open an enquiry and press Convert To Client to create the first one."
        />
      ) : (
        <Card className="p-0">
          <ul className="flex flex-col">
            {rows.map((row) => (
              <li key={row.id} className="border-b border-text/[0.06] last:border-b-0">
                <Link
                  href={`/admin/clients/${row.id}`}
                  className="flex flex-wrap items-center gap-x-4 gap-y-2 px-5 py-4 transition-colors duration-200 hover:bg-text/[0.02]"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="font-display text-[1rem] font-semibold tracking-[-0.01em] text-text">
                        {row.company || row.name}
                      </span>
                      <Pill status={row.status} />
                    </div>
                    <p className="mt-1 truncate text-[0.85rem] text-text/50">
                      {row.name} · {row.email} · {row.country}
                    </p>
                  </div>

                  <div className="text-right">
                    {Number(row.monthly) > 0 && (
                      <p className="font-display text-[1rem] font-semibold tracking-[-0.01em] text-text">
                        {money(Number(row.monthly))}
                        <span className="font-sans text-[0.75rem] font-normal text-text/40">/mo</span>
                      </p>
                    )}
                    {Number(row.onceOff) > 0 && (
                      <p className="font-mono text-[11px] text-text/55">
                        {money(Number(row.onceOff))} one-off
                      </p>
                    )}
                    <p className="mt-0.5 font-mono text-[10px] tracking-[0.06em] text-text/30">
                      {Number(row.services)} service{Number(row.services) === 1 ? "" : "s"} ·{" "}
                      {shortDate(row.createdAt)}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </Page>
  );
}
