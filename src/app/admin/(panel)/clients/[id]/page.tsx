import Link from "next/link";
import { notFound } from "next/navigation";
import { desc, eq } from "drizzle-orm";

import { ActionForm } from "@/components/admin/ActionForm";
import { Card, CardTitle, Page, Pill, money, shortDate } from "@/components/admin/ui";
import {
  addService,
  saveClientNotes,
  setClientStatus,
  setServiceStatus,
} from "@/lib/actions/clients";
import { db } from "@/lib/server/db";
import { SERVICE_GROUPS } from "@/lib/contact";
import { clientServices, clients, enquiries } from "@/lib/server/schema";

export const dynamic = "force-dynamic";

const CLIENT_STATUSES = ["lead", "active", "past", "lost"] as const;
const SERVICE_STATUSES = ["proposed", "active", "completed", "cancelled"] as const;

const ALL_SERVICES = SERVICE_GROUPS.flatMap((group) => group.services.map((s) => s.name));

export default async function ClientPage({ params }: PageProps<"/admin/clients/[id]">) {
  const { id } = await params;
  const handle = db();
  if (!handle) notFound();

  const [client] = await handle
    .select()
    .from(clients)
    .where(eq(clients.id, Number(id)))
    .limit(1);

  if (!client) notFound();

  const services = await handle
    .select()
    .from(clientServices)
    .where(eq(clientServices.clientId, client.id))
    .orderBy(desc(clientServices.createdAt));

  const origin = client.sourceEnquiryId
    ? (
        await handle
          .select({ id: enquiries.id, reference: enquiries.reference })
          .from(enquiries)
          .where(eq(enquiries.id, client.sourceEnquiryId))
          .limit(1)
      )[0]
    : undefined;

  /* Totals cover active work only. Proposed work has not been agreed and
     cancelled work is not happening; counting either would describe a business
     that does not exist. */
  const active = services.filter((s) => s.status === "active");
  const monthly = active.reduce((sum, s) => {
    const amount = Number(s.amount);
    if (s.billing === "monthly") return sum + amount;
    if (s.billing === "yearly") return sum + amount / 12;
    return sum;
  }, 0);
  const oneOff = active
    .filter((s) => s.billing === "once")
    .reduce((sum, s) => sum + Number(s.amount), 0);

  return (
    <Page
      eyebrow="Client"
      title={client.company || client.name}
      lead={`${client.name} · ${client.country}`}
      actions={
        <Link
          href="/admin/clients"
          className="font-mono text-[10px] uppercase tracking-[0.16em] text-text/45 transition-colors duration-200 hover:text-primary"
        >
          &larr; All clients
        </Link>
      }
    >
      <div className="grid gap-3 lg:grid-cols-[1.6fr_1fr]">
        <div className="flex flex-col gap-3">
          <Card>
            <CardTitle note={active.length > 0 ? "active work only" : undefined}>
              Services
            </CardTitle>

            {services.length === 0 ? (
              <p className="text-[0.875rem] text-text/45">
                Nothing recorded yet. Add the first below.
              </p>
            ) : (
              <ul className="flex flex-col">
                {services.map((service) => (
                  <li
                    key={service.id}
                    className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-text/[0.06] py-3 first:pt-0 last:border-b-0 last:pb-0"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <span className="text-[0.95rem] font-medium text-text">
                          {service.service}
                        </span>
                        <Pill status={service.status} />
                      </div>
                      {service.packageName && (
                        <p className="mt-0.5 text-[0.8rem] text-text/45">{service.packageName}</p>
                      )}
                      {service.startedOn && (
                        <p className="mt-0.5 font-mono text-[10px] tracking-[0.06em] text-text/30">
                          started {shortDate(service.startedOn)}
                          {service.endsOn ? ` · ended ${shortDate(service.endsOn)}` : ""}
                        </p>
                      )}
                    </div>

                    <p className="font-display text-[1rem] font-semibold tracking-[-0.01em] text-text">
                      {money(Number(service.amount))}
                      <span className="font-sans text-[0.75rem] font-normal text-text/40">
                        {service.billing === "monthly"
                          ? "/mo"
                          : service.billing === "yearly"
                            ? "/yr"
                            : ""}
                      </span>
                    </p>

                    <div className="flex flex-wrap gap-1.5">
                      {SERVICE_STATUSES.filter((s) => s !== service.status).map((status) => (
                        <ActionForm
                          key={status}
                          action={setServiceStatus}
                          message={`Service marked ${status}.`}
                        >
                          <input type="hidden" name="id" value={service.id} />
                          <input type="hidden" name="clientId" value={client.id} />
                          <input type="hidden" name="status" value={status} />
                          <button
                            type="submit"
                            className="rounded border border-text/12 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.12em] text-text/50 transition-[color,border-color,transform] duration-150 ease-out hover:border-primary hover:text-primary active:scale-[0.97]"
                          >
                            {status}
                          </button>
                        </ActionForm>
                      ))}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card>
            <CardTitle>Add a service</CardTitle>
            <ActionForm
              action={addService}
              message="Service added."
              className="grid gap-3 sm:grid-cols-2"
            >
              <input type="hidden" name="clientId" value={client.id} />

              <label className="flex flex-col gap-1.5 sm:col-span-2">
                <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-text/40">
                  Service
                </span>
                <select name="service" required className={FIELD}>
                  {ALL_SERVICES.map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
              </label>

              <label className="flex flex-col gap-1.5 sm:col-span-2">
                <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-text/40">
                  Package or description
                </span>
                <input
                  name="packageName"
                  type="text"
                  maxLength={160}
                  placeholder="Business Website, Content Growth..."
                  className={FIELD}
                />
              </label>

              <label className="flex flex-col gap-1.5">
                <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-text/40">
                  Amount (USD)
                </span>
                <input
                  name="amount"
                  type="text"
                  inputMode="decimal"
                  required
                  placeholder="500"
                  className={FIELD}
                />
              </label>

              <label className="flex flex-col gap-1.5">
                <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-text/40">
                  Billing
                </span>
                <select name="billing" className={FIELD}>
                  <option value="once">One-off</option>
                  <option value="monthly">Per month</option>
                  <option value="yearly">Per year</option>
                </select>
              </label>

              <label className="flex flex-col gap-1.5">
                <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-text/40">
                  Status
                </span>
                {/* Each option says what it does to the figures. Picking the
                    wrong one is silent otherwise: the service is saved, and
                    the revenue it was added to record stays at zero. */}
                <select name="status" className={FIELD} defaultValue="active">
                  <option value="proposed">Proposed — quoted, not counted</option>
                  <option value="active">Active — counts towards revenue</option>
                  <option value="completed">Completed — finished, stops counting</option>
                </select>
              </label>

              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full rounded-lg bg-primary px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.16em] text-white transition-transform duration-150 ease-out active:scale-[0.98]"
                >
                  Add Service
                </button>
              </div>
            </ActionForm>
          </Card>

          <Card>
            <CardTitle note="only you see these">Notes</CardTitle>
            <ActionForm action={saveClientNotes} message="Notes saved.">
              <input type="hidden" name="id" value={client.id} />
              <textarea
                name="notes"
                rows={4}
                defaultValue={client.notes ?? ""}
                placeholder="Account history, preferences, who to speak to..."
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
            <CardTitle note="active only">Value</CardTitle>
            <dl className="flex flex-col gap-3">
              <div className="flex items-baseline justify-between gap-4">
                <dt className="text-[0.875rem] text-text/60">Recurring</dt>
                <dd className="font-display text-[1.25rem] font-semibold tracking-[-0.015em] text-text">
                  {money(monthly)}
                  <span className="font-sans text-[0.8rem] font-normal text-text/40">/mo</span>
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-4">
                <dt className="text-[0.875rem] text-text/60">One-off</dt>
                <dd className="font-display text-[1.25rem] font-semibold tracking-[-0.015em] text-text">
                  {money(oneOff)}
                </dd>
              </div>
            </dl>
            <p className="mt-4 border-t border-text/[0.07] pt-3 text-[0.75rem] leading-relaxed text-text/35">
              Only work marked <strong className="font-semibold text-text/55">Active</strong>{" "}
              counts here — proposed, completed and cancelled are all left out, because this
              is what the client is worth now rather than what they have ever been worth. A
              yearly agreement is shown as a twelfth so it sits alongside monthly ones.
            </p>
          </Card>

          <Card>
            <CardTitle>Contact</CardTitle>
            <div className="flex flex-col gap-2.5">
              <a
                href={`mailto:${client.email}`}
                className="text-[0.9rem] text-primary underline-offset-4 hover:underline"
              >
                {client.email}
              </a>
              <a
                href={`tel:${client.phone.replace(/\s/g, "")}`}
                className="text-[0.9rem] text-text/75 transition-colors duration-200 hover:text-primary"
              >
                {client.phone}
              </a>
            </div>
            <Link
              href={{
                pathname: "/admin/email",
                query: { to: client.email, clientId: client.id },
              }}
              className="mt-4 inline-block rounded-lg border border-text/15 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.16em] text-text/65 transition-[color,border-color,transform] duration-150 ease-out hover:border-primary hover:text-primary active:scale-[0.98]"
            >
              Write An Email
            </Link>
            {origin && (
              <p className="mt-3 border-t border-text/[0.07] pt-3 text-[0.8rem] text-text/45">
                From enquiry{" "}
                <Link
                  href={`/admin/enquiries/${origin.id}`}
                  className="font-mono text-[11px] text-primary underline-offset-4 hover:underline"
                >
                  {origin.reference}
                </Link>
              </p>
            )}
          </Card>

          <Card>
            <CardTitle>Status</CardTitle>
            <div className="mb-3">
              <Pill status={client.status} />
            </div>
            <div className="flex flex-wrap gap-2">
              {CLIENT_STATUSES.filter((s) => s !== client.status).map((status) => (
                <ActionForm key={status} action={setClientStatus} message={`Marked ${status}.`}>
                  <input type="hidden" name="id" value={client.id} />
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
        </div>
      </div>
    </Page>
  );
}

const FIELD =
  "rounded-lg border border-text/12 bg-panel px-3 py-2.5 text-[0.9rem] text-text outline-none transition-colors duration-200 placeholder:text-text/30 focus:border-primary focus:bg-card";
