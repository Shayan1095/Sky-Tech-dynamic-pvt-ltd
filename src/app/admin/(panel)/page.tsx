import Link from "next/link";

import { Card, CardTitle, Empty, Page, Pill, Stat, money, shortDate } from "@/components/admin/ui";
import { Funnel, RevenueLine, WeeklyBars } from "@/components/admin/Charts";
import {
  funnel,
  getStats,
  recentEnquiries,
  revenueHistory,
  weeklyEnquiries,
} from "@/lib/server/stats";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [stats, recent, weekly, stages, revenueSeries] = await Promise.all([
    getStats(),
    recentEnquiries(5),
    weeklyEnquiries(12),
    funnel(),
    revenueHistory(6),
  ]);
  const { enquiries: e, pipeline, clients, revenue } = stats;

  const change = e.last30 - e.previous30;
  const busiest = Math.max(1, ...e.byService.map((s) => s.count));

  return (
    <Page
      eyebrow="Overview"
      title="Dashboard"
      lead="Every figure here is counted from records that exist. Nothing is projected or rounded up."
    >
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <Stat
          label="Enquiries"
          value={String(e.total)}
          trend={
            e.previous30 > 0 || e.last30 > 0
              ? { value: change, label: "vs prev 30d" }
              : undefined
          }
          note={`${e.last30} in last 30 days`}
        />
        <Stat label="Unread" value={String(e.unread)} note="waiting for a first reply" />
        {/* One-off work was counted and then never shown: a business doing
            project work saw "Monthly Recurring $0" and nothing else, and
            reasonably concluded the panel had lost it. The two are kept as
            separate figures because adding them would mean nothing. */}
        <Stat
          label="Monthly Recurring"
          value={money(revenue.monthlyRecurring)}
          note={`${revenue.activeServices} active service${revenue.activeServices === 1 ? "" : "s"}`}
        />
        <Stat
          label="One-off Work"
          value={money(revenue.oneOffTotal)}
          note="active, billed once"
        />
        <Stat
          label="Clients"
          value={String(clients.total)}
          note={`${clients.active} active · ${clients.leads} leads`}
        />
      </div>

      <div className="mt-3 grid gap-3 lg:grid-cols-2">
        <Card>
          <CardTitle note="last 12 weeks">Enquiries over time</CardTitle>
          <WeeklyBars buckets={weekly} />
        </Card>

        <Card>
          <CardTitle note="all time">Enquiry to customer</CardTitle>
          <Funnel stages={stages} />
        </Card>

        <Card>
          <CardTitle note="last 6 months">Recurring revenue</CardTitle>
          <RevenueLine points={revenueSeries} />
        </Card>

        <Card>
          <CardTitle note="excludes archived">Quoted pipeline</CardTitle>
          {pipeline.once === 0 && pipeline.monthly === 0 && pipeline.yearly === 0 ? (
            <p className="text-[0.875rem] text-text/45">No enquiry has carried a price yet.</p>
          ) : (
            <dl className="flex flex-col gap-3">
              <Row
                label="One-off work"
                value={money(pipeline.once)}
                note={
                  pipeline.openEnded > 0
                    ? `at least — ${pipeline.openEnded} quote${
                        pipeline.openEnded === 1 ? " was" : "s were"
                      } open-ended`
                    : undefined
                }
              />
              {pipeline.monthly > 0 && (
                <Row label="Monthly" value={`${money(pipeline.monthly)}/mo`} />
              )}
              {pipeline.yearly > 0 && <Row label="Yearly" value={`${money(pipeline.yearly)}/yr`} />}
            </dl>
          )}
          <p className="mt-4 border-t border-text/[0.07] pt-3 text-[0.75rem] leading-relaxed text-text/35">
            What has been asked about, not what has been won. Recurring and one-off
            figures are kept apart because adding them together would mean nothing.
          </p>
        </Card>

        <Card>
          <CardTitle note="all time">Most enquired services</CardTitle>
          {e.byService.length === 0 ? (
            <p className="text-[0.875rem] text-text/45">No service has been selected yet.</p>
          ) : (
            <ul className="flex flex-col gap-2.5">
              {e.byService.map((row) => (
                <li key={row.service}>
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="truncate text-[0.875rem] text-text/75">{row.service}</span>
                    <span className="font-mono text-[11px] text-text/45">{row.count}</span>
                  </div>
                  <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-text/[0.06]">
                    <div
                      className="h-full rounded-full bg-primary/70"
                      style={{ width: `${(row.count / busiest) * 100}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      <div className="mt-3">
        <Card>
          <CardTitle note={e.total > 5 ? "5 most recent" : undefined}>Latest enquiries</CardTitle>
          {recent.length === 0 ? (
            <Empty
              title="Nothing yet"
              body="When someone submits the contact form it appears here immediately."
            />
          ) : (
            <ul className="flex flex-col">
              {recent.map((row) => (
                <li key={row.id} className="border-b border-text/[0.06] last:border-b-0">
                  <Link
                    href={`/admin/enquiries/${row.id}`}
                    className="flex flex-wrap items-baseline gap-x-3 gap-y-1 rounded-lg px-2 py-3 transition-colors duration-200 hover:bg-text/[0.02]"
                  >
                    <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-text/30">
                      {row.reference}
                    </span>
                    <Pill status={row.status} />
                    <span className="text-[0.9rem] font-medium text-text">{row.name}</span>
                    <span className="text-[0.85rem] text-text/45">{row.company}</span>
                    <span className="ml-auto flex items-baseline gap-3">
                      {row.estimate && (
                        <span className="font-mono text-[11px] text-text/60">{row.estimate}</span>
                      )}
                      <span className="font-mono text-[10px] text-text/30">
                        {shortDate(row.createdAt)}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </Page>
  );
}

function Row({ label, value, note }: { label: string; value: string; note?: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className="text-[0.875rem] text-text/60">
        {label}
        {note && <span className="mt-0.5 block text-[0.75rem] text-text/35">{note}</span>}
      </dt>
      <dd className="font-display text-[1.15rem] font-semibold tracking-[-0.015em] text-text">
        {value}
      </dd>
    </div>
  );
}
