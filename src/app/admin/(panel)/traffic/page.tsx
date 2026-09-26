import { Card, CardTitle, Empty, Page, Stat } from "@/components/admin/ui";
import { WeeklyBars } from "@/components/admin/Charts";
import { getTraffic } from "@/lib/server/analytics";

export const dynamic = "force-dynamic";

export default async function TrafficPage() {
  const traffic = await getTraffic(30);
  const busiest = Math.max(1, ...traffic.pages.map((p) => p.views));

  return (
    <Page
      eyebrow="Analytics"
      title="Traffic"
      lead="Counted on your own server. No third-party script, no cookies, and nothing sent to anyone else."
    >
      {traffic.totals.views === 0 ? (
        <Empty
          title="No visits recorded yet"
          body="Counting starts as soon as the site is deployed with this build. Your own visits to the panel are never counted."
        />
      ) : (
        <>
          <div className="grid gap-3 sm:grid-cols-3">
            <Stat label="Page views" value={String(traffic.totals.views)} note="last 30 days" />
            <Stat
              label="Visitors"
              value={String(traffic.totals.visitors)}
              note="counted per day, not followed between days"
            />
            <Stat
              label="On a phone"
              value={`${traffic.totals.mobileShare}%`}
              note="of all views"
            />
          </div>

          <div className="mt-3 grid gap-3 lg:grid-cols-2">
            <Card>
              <CardTitle note="views per day">Last 30 days</CardTitle>
              <WeeklyBars
                buckets={traffic.days.map((d) => ({ label: d.label, value: d.views }))}
                minWeeks={7}
              />
            </Card>

            <Card>
              <CardTitle note="last 30 days">Most read pages</CardTitle>
              <ul className="flex flex-col gap-2.5">
                {traffic.pages.map((page) => (
                  <li key={page.path}>
                    <div className="flex items-baseline justify-between gap-3">
                      <span className="truncate font-mono text-[0.8rem] text-text/75">
                        {page.path}
                      </span>
                      <span className="font-mono text-[11px] text-text/45">{page.views}</span>
                    </div>
                    <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-text/[0.06]">
                      <div
                        className="h-full rounded-full bg-primary/70"
                        style={{ width: `${(page.views / busiest) * 100}%` }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          <div className="mt-3">
            <Card>
              <CardTitle note="where people arrived from">Referrers</CardTitle>
              {traffic.referrers.length === 0 ? (
                <p className="text-[0.875rem] text-text/45">
                  Everyone so far arrived directly, or from a link that sent no referrer.
                </p>
              ) : (
                <ul className="flex flex-col">
                  {traffic.referrers.map((row) => (
                    <li
                      key={row.referrer}
                      className="flex items-baseline justify-between gap-4 border-b border-text/[0.06] py-2.5 last:border-b-0"
                    >
                      <span className="truncate text-[0.875rem] text-text/75">
                        {row.referrer}
                      </span>
                      <span className="font-mono text-[11px] text-text/45">{row.views}</span>
                    </li>
                  ))}
                </ul>
              )}
              <p className="mt-4 border-t border-text/[0.07] pt-3 text-[0.75rem] leading-relaxed text-text/35">
                Only the site someone came from is kept — never the full address, which
                can carry a search term or a private link.
              </p>
            </Card>
          </div>
        </>
      )}
    </Page>
  );
}
