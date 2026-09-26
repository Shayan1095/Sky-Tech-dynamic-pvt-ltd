import { desc, eq } from "drizzle-orm";

import AutoReplyForm from "@/components/admin/AutoReplyForm";
import ComposeForm from "@/components/admin/ComposeForm";
import { Card, CardTitle, Page, Pill, dateTime } from "@/components/admin/ui";
import { retryMessage } from "@/lib/actions/email";
import { db } from "@/lib/server/db";
import { getAutoReply } from "@/lib/server/auto-reply";
import { hasMail, mailConfig } from "@/lib/server/env";
import { emailQueue, enquiries } from "@/lib/server/schema";

export const dynamic = "force-dynamic";

/* The outbox shows automatic notifications and written replies together, in
   one list, with the same states. Splitting them would hide the thing that
   matters most — whether anything at all is failing to leave the building. */

export default async function EmailPage({ searchParams }: PageProps<"/admin/email">) {
  const query = await searchParams;
  const first = (value: string | string[] | undefined) =>
    Array.isArray(value) ? (value[0] ?? "") : (value ?? "");

  const handle = db();
  const config = mailConfig();

  const messages = handle
    ? await handle.select().from(emailQueue).orderBy(desc(emailQueue.createdAt)).limit(50)
    : [];

  const autoReply = await getAutoReply();

  /* When the compose box was opened from an enquiry, load it: the templates
     are then filled in with that person's details instead of leaving brackets
     for things the panel already knows. */
  const enquiryId = Number(first(query.enquiryId)) || undefined;
  const [enquiry] = enquiryId && handle
    ? await handle
        .select({
          name: enquiries.name,
          company: enquiries.company,
          service: enquiries.service,
          packageName: enquiries.packageName,
          budget: enquiries.budget,
          estimate: enquiries.estimate,
          reference: enquiries.reference,
          addOns: enquiries.addOns,
        })
        .from(enquiries)
        .where(eq(enquiries.id, enquiryId))
        .limit(1)
    : [];

  const pending = messages.filter((m) => m.status === "pending").length;
  const failed = messages.filter((m) => m.status === "failed").length;

  return (
    <Page
      eyebrow="Messages"
      title="Email"
      lead={
        config
          ? `Sent from ${config.from}. New enquiries are delivered to ${config.to}.`
          : "Write and queue messages now; they send once the mailbox is configured."
      }
    >
      <div className="grid gap-3 lg:grid-cols-[1.3fr_1fr]">
        <div className="flex flex-col gap-3">
        <Card>
          <CardTitle>Compose</CardTitle>
          <ComposeForm
            defaultTo={first(query.to)}
            defaultSubject={first(query.subject)}
            clientId={Number(first(query.clientId)) || undefined}
            enquiryId={enquiryId}
            mailReady={hasMail()}
            about={
              enquiry
                ? {
                    name: enquiry.name.split(" ")[0] || enquiry.name,
                    fullName: enquiry.name,
                    company: enquiry.company,
                    service: enquiry.service,
                    packageName: enquiry.packageName || enquiry.budget,
                    estimate: enquiry.estimate,
                    reference: enquiry.reference,
                    addOns: (() => {
                      try {
                        const parsed = JSON.parse(enquiry.addOns);
                        return Array.isArray(parsed) ? parsed.map(String) : [];
                      } catch {
                        return [];
                      }
                    })(),
                  }
                : undefined
            }
          />
        </Card>

        <Card>
          <CardTitle note={autoReply.enabled ? "on" : "off"}>Automatic reply</CardTitle>
          <p className="mb-4 text-[0.8rem] leading-relaxed text-text/50">
            What someone receives the moment they submit the contact form. It is sent
            after the enquiry has been stored, never instead of it.
          </p>
          <AutoReplyForm template={autoReply} />
        </Card>
        </div>

        <Card>
          <CardTitle
            note={
              failed > 0
                ? `${failed} failed`
                : pending > 0
                  ? `${pending} waiting`
                  : undefined
            }
          >
            Outbox
          </CardTitle>

          {messages.length === 0 ? (
            <p className="text-[0.875rem] text-text/45">Nothing has been sent yet.</p>
          ) : (
            <ul className="flex flex-col">
              {messages.map((message) => (
                <li
                  key={message.id}
                  className="border-b border-text/[0.06] py-3 first:pt-0 last:border-b-0 last:pb-0"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <Pill status={message.status} />
                    <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-text/30">
                      {message.kind}
                    </span>
                    <span className="ml-auto font-mono text-[10px] tracking-[0.06em] text-text/30">
                      {dateTime(message.sentAt ?? message.createdAt)}
                    </span>
                  </div>

                  <p className="mt-1.5 truncate text-[0.9rem] font-medium text-text">
                    {message.subject}
                  </p>
                  <p className="truncate text-[0.8rem] text-text/45">{message.toAddress}</p>

                  {/* A message that went through after retrying says so, quietly.
                      One that is still stuck says why, and says it in red. */}
                  {message.status === "sent" && message.attempts > 0 && (
                    <p className="mt-1 text-[0.75rem] text-text/35">
                      Delivered after {message.attempts + 1} attempt
                      {message.attempts === 0 ? "" : "s"}
                    </p>
                  )}

                  {message.status !== "sent" && message.attempts > 0 && (
                    <p className="mt-1 text-[0.75rem] leading-relaxed text-[#b42318]">
                      {message.attempts} failed attempt{message.attempts === 1 ? "" : "s"}
                      {message.lastError ? ` — ${message.lastError}` : ""}
                    </p>
                  )}

                  {message.status === "failed" && (
                    <form action={retryMessage} className="mt-2">
                      <input type="hidden" name="id" value={message.id} />
                      <button
                        type="submit"
                        className="rounded border border-text/15 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.12em] text-text/55 transition-[color,border-color,transform] duration-150 ease-out hover:border-primary hover:text-primary active:scale-[0.97]"
                      >
                        Try Again
                      </button>
                    </form>
                  )}
                </li>
              ))}
            </ul>
          )}

          <p className="mt-4 border-t border-text/[0.07] pt-3 text-[0.75rem] leading-relaxed text-text/35">
            Every message is stored before it is sent, so a mail outage delays
            delivery rather than losing the message. Failures retry on their own,
            with a widening gap between attempts.
          </p>
        </Card>
      </div>
    </Page>
  );
}
