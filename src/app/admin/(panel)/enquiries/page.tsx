import { and, desc, eq, like, or, sql, type SQL } from "drizzle-orm";

import { EnquiryFilters, EnquiryList } from "@/components/admin/EnquiryBrowser";
import { Empty, Page } from "@/components/admin/ui";
import { db } from "@/lib/server/db";
import { enquiries } from "@/lib/server/schema";

export const dynamic = "force-dynamic";

const STATUSES = ["new", "read", "replied", "archived"] as const;

/* Filtering happens in the database, not in the browser. A list that filters
   after loading everything is fine at ten rows and useless at a thousand. */
export default async function EnquiriesPage({ searchParams }: PageProps<"/admin/enquiries">) {
  const query = await searchParams;
  const first = (value: string | string[] | undefined) =>
    (Array.isArray(value) ? value[0] : value) ?? "";

  const status = first(query.status);
  const search = first(query.q).trim().slice(0, 80);

  const handle = db();
  if (!handle) {
    return (
      <Page eyebrow="Inbox" title="Enquiries">
        <Empty
          title="No database connected"
          body="Set DATABASE_URL and the enquiries will appear here."
        />
      </Page>
    );
  }

  const filters: SQL[] = [];
  if ((STATUSES as readonly string[]).includes(status)) {
    filters.push(eq(enquiries.status, status as (typeof STATUSES)[number]));
  }
  if (search) {
    /* Escaped so a % or _ typed into the box is searched for rather than
       treated as a wildcard that matches everything. */
    const term = `%${search.replace(/[\\%_]/g, (c) => `\\${c}`)}%`;
    const match = or(
      like(enquiries.name, term),
      like(enquiries.company, term),
      like(enquiries.email, term),
      like(enquiries.reference, term),
      like(enquiries.service, term),
      like(enquiries.details, term)
    );
    if (match) filters.push(match);
  }

  const where = filters.length > 0 ? and(...filters) : undefined;

  const rows = await handle
    .select({
      id: enquiries.id,
      reference: enquiries.reference,
      name: enquiries.name,
      company: enquiries.company,
      email: enquiries.email,
      phone: enquiries.phone,
      country: enquiries.country,
      service: enquiries.service,
      packageName: enquiries.packageName,
      budget: enquiries.budget,
      estimate: enquiries.estimate,
      details: enquiries.details,
      timeline: enquiries.timeline,
      status: enquiries.status,
      createdAt: enquiries.createdAt,
    })
    .from(enquiries)
    .where(where)
    .orderBy(desc(enquiries.createdAt))
    .limit(100);

  const [counts] = await handle
    .select({
      total: sql<number>`COUNT(*)`,
      unread: sql<number>`SUM(CASE WHEN ${enquiries.status} = 'new' THEN 1 ELSE 0 END)`,
    })
    .from(enquiries);

  const filtered = Boolean(status || search);

  return (
    <Page
      eyebrow="Inbox"
      title="Enquiries"
      actions={
        Number(counts?.unread ?? 0) > 0 ? (
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-text/45">
            {counts?.unread} new
          </p>
        ) : undefined
      }
    >
      <EnquiryFilters total={rows.length} />

      {rows.length === 0 ? (
        <Empty
          title={filtered ? "Nothing matches" : "No enquiries yet"}
          body={
            filtered
              ? "Try a different search, or clear the filters."
              : "When someone submits the contact form, it lands here immediately."
          }
        />
      ) : (
        <EnquiryList rows={rows} />
      )}

      {rows.length === 100 && (
        <p className="mt-5 text-center font-mono text-[10px] uppercase tracking-[0.14em] text-text/30">
          Showing the 100 most recent — search to narrow it down
        </p>
      )}
    </Page>
  );
}
