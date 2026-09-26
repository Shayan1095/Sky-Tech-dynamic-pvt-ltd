import Link from "next/link";
import { eq } from "drizzle-orm";

import { ActionForm } from "@/components/admin/ActionForm";
import { Card, CardTitle, Pill, dateTime } from "@/components/admin/ui";
import { convertToClient, saveNotes, setStatus } from "@/lib/actions/enquiries";
import { db } from "@/lib/server/db";
import { clients, enquiries } from "@/lib/server/schema";

/* One enquiry, rendered the same way whether it is a page of its own or a
   drawer over the list. Shared rather than copied: two versions of this would
   drift, and the one nobody was looking at would be the one that broke. */

const STATUSES = ["new", "read", "replied", "archived"] as const;

export type Enquiry = typeof enquiries.$inferSelect;

export async function loadEnquiry(id: string | number) {
  const handle = db();
  if (!handle) return null;

  const [enquiry] = await handle
    .select()
    .from(enquiries)
    .where(eq(enquiries.id, Number(id)))
    .limit(1);
  if (!enquiry) return null;

  // Whether this person is already on the books changes the action offered.
  const [client] = await handle
    .select({ id: clients.id })
    .from(clients)
    .where(eq(clients.email, enquiry.email))
    .limit(1);

  return { enquiry, clientId: client?.id ?? null };
}

export function EnquiryDetail({
  enquiry,
  clientId,
  compact = false,
}: {
  enquiry: Enquiry;
  clientId: number | null;
  /* In the drawer everything is one column; the two-column layout needs room
     the drawer does not have. */
  compact?: boolean;
}) {
  // Stored as JSON so the list survives a service being renamed later.
  const addOns: string[] = (() => {
    try {
      const parsed = JSON.parse(enquiry.addOns);
      return Array.isArray(parsed) ? parsed.map(String) : [];
    } catch {
      return [];
    }
  })();

  return (
    <div className={`grid gap-3 ${compact ? "" : "lg:grid-cols-[1.6fr_1fr]"}`}>
      <div className="flex flex-col gap-3">
        <Card>
          <CardTitle note={dateTime(enquiry.createdAt)}>What they asked for</CardTitle>
          <dl className={`grid gap-x-6 gap-y-3 ${compact ? "" : "sm:grid-cols-2"}`}>
            <Detail label="Service" value={enquiry.service || "Not specified"} />
            <Detail label="Budget" value={budgetOf(enquiry.budget, enquiry.budgetCustom)} />
            {enquiry.packageName && <Detail label="Package" value={enquiry.packageName} />}
            <Detail label="Timeline" value={enquiry.timeline || "Not specified"} />
            {enquiry.estimate && <Detail label="Quoted" value={enquiry.estimate} />}
            {enquiry.enquiryType && <Detail label="Came from" value={enquiry.enquiryType} />}
          </dl>

          {addOns.length > 0 && (
            <div className="mt-4 border-t border-text/[0.07] pt-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-text/40">
                Add-ons
              </p>
              <ul className="mt-2 flex flex-wrap gap-2">
                {addOns.map((name) => (
                  <li
                    key={name}
                    className="rounded-full border border-text/12 px-3 py-1 text-[0.8rem] text-text/70"
                  >
                    {name}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Card>

        <Card>
          <CardTitle>Their message</CardTitle>
          {enquiry.details ? (
            <p className="whitespace-pre-wrap text-[0.95rem] leading-relaxed text-text/80">
              {enquiry.details}
            </p>
          ) : (
            <p className="text-[0.875rem] text-text/40">They did not write anything here.</p>
          )}
        </Card>

        <Card>
          <CardTitle note="only you see these">Your notes</CardTitle>
          <ActionForm action={saveNotes} message="Notes saved.">
            <input type="hidden" name="id" value={enquiry.id} />
            <textarea
              name="notes"
              rows={4}
              defaultValue={enquiry.adminNotes ?? ""}
              placeholder="What was agreed, what to chase, who it was passed to..."
              className="w-full resize-y rounded-lg border border-text/12 bg-panel px-4 py-3 text-[0.9rem] leading-relaxed text-text outline-none transition-colors duration-200 placeholder:text-text/30 focus:border-primary focus:bg-card"
            />
            <button
              type="submit"
              className="mt-3 rounded-lg border border-text/15 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.16em] text-text/65 transition-[color,border-color,transform] duration-150 ease-out hover:border-primary hover:text-primary active:scale-[0.98]"
            >
              Save Notes
            </button>
          </ActionForm>
        </Card>
      </div>

      <div className="flex flex-col gap-3">
        <Card>
          <CardTitle>Contact</CardTitle>
          <div className="flex flex-col gap-2.5">
            <a
              href={`mailto:${enquiry.email}`}
              className="text-[0.9rem] text-primary underline-offset-4 hover:underline"
            >
              {enquiry.email}
            </a>
            <a
              href={`tel:${enquiry.phone.replace(/\s/g, "")}`}
              className="text-[0.9rem] text-text/75 transition-colors duration-200 hover:text-primary"
            >
              {enquiry.phone}
            </a>
            <p className="text-[0.85rem] text-text/50">{enquiry.country}</p>
          </div>
          <Link
            href={{
              pathname: "/admin/email",
              query: {
                to: enquiry.email,
                subject: `Re: your enquiry (${enquiry.reference})`,
                enquiryId: enquiry.id,
              },
            }}
            className="mt-4 inline-block rounded-lg border border-text/15 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.16em] text-text/65 transition-[color,border-color,transform] duration-150 ease-out hover:border-primary hover:text-primary active:scale-[0.98]"
          >
            Write An Email
          </Link>
        </Card>

        <Card>
          <CardTitle>Status</CardTitle>
          <div className="mb-3">
            <Pill status={enquiry.status} />
          </div>
          <div className="flex flex-wrap gap-2">
            {STATUSES.filter((s) => s !== enquiry.status).map((status) => (
              <ActionForm key={status} action={setStatus} message={`Marked ${status}.`}>
                <input type="hidden" name="id" value={enquiry.id} />
                <input type="hidden" name="status" value={status} />
                <button
                  type="submit"
                  className="rounded-lg border border-text/15 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-text/60 transition-[color,border-color,transform] duration-150 ease-out hover:border-primary hover:text-primary active:scale-[0.98]"
                >
                  {status}
                </button>
              </ActionForm>
            ))}
          </div>
        </Card>

        <Card>
          <CardTitle>Client record</CardTitle>
          {clientId ? (
            <>
              <p className="mb-3 text-[0.85rem] leading-relaxed text-text/55">
                Already on the books.
              </p>
              <Link
                href={`/admin/clients/${clientId}`}
                className="inline-block rounded-lg bg-primary px-4 py-2 font-mono text-[10px] uppercase tracking-[0.16em] text-white transition-transform duration-150 ease-out active:scale-[0.98]"
              >
                Open Client
              </Link>
            </>
          ) : (
            <>
              <p className="mb-3 text-[0.85rem] leading-relaxed text-text/55">
                Create a client from this enquiry. The enquiry itself stays exactly as it
                was sent.
              </p>
              <form action={convertToClient}>
                {/* This one navigates to the new client, so the page change is
                    the confirmation. */}
                <input type="hidden" name="id" value={enquiry.id} />
                <button
                  type="submit"
                  className="rounded-lg bg-primary px-4 py-2 font-mono text-[10px] uppercase tracking-[0.16em] text-white transition-transform duration-150 ease-out active:scale-[0.98]"
                >
                  Convert To Client
                </button>
              </form>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}

function budgetOf(budget: string, custom: string): string {
  if (!budget) return "Not specified";
  if (budget === "Custom") return custom ? `Custom - ${custom}` : "Custom";
  return budget;
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-text/40">{label}</dt>
      <dd className="mt-1 text-[0.9rem] text-text/85">{value}</dd>
    </div>
  );
}
