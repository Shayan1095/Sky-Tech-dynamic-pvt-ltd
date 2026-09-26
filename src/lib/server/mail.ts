import "server-only";

import { and, asc, eq, lte, sql } from "drizzle-orm";
import nodemailer, { type Transporter } from "nodemailer";

import { db } from "./db";
import { mailConfig } from "./env";
import { emailQueue } from "./schema";

/* ---------------------------------------------------------------------------
   Outgoing mail.

   Nothing sends directly. Every message is written to email_queue first and
   then attempted, so a mailbox outage delays a notification instead of losing
   the enquiry behind it. Failures are retried with a widening delay, driven
   either by the next submission or by the scheduled endpoint at
   /api/tasks/flush-mail.
   ------------------------------------------------------------------------ */

const MAX_ATTEMPTS = 8;
const BASE_DELAY_SECONDS = 300; // 5 minutes, doubling per attempt
const MAX_DELAY_SECONDS = 6 * 60 * 60;

const cache = globalThis as unknown as { __skyMail?: Transporter };

function transport(): Transporter | null {
  const config = mailConfig();
  if (!config) return null;
  if (!cache.__skyMail) {
    cache.__skyMail = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      // Port 465 is implicit TLS; anything else negotiates STARTTLS.
      secure: config.port === 465,
      auth: { user: config.user, pass: config.password },
      // A hung SMTP server must not hold a visitor's submission open. The
      // message is already stored, so a timeout just means it retries.
      connectionTimeout: 10_000,
      greetingTimeout: 10_000,
      socketTimeout: 20_000,
      pool: false,
    });
  }
  return cache.__skyMail;
}

export type QueuedEmail = {
  enquiryId: number | null;
  to: string;
  replyTo: string;
  subject: string;
  text: string;
  /* What this message is. The outbox shows both kinds together, and telling
     them apart is the difference between "our alert failed" and "a customer
     did not hear back". */
  kind?: "notification" | "reply";
};

/** Stores the message. Returns false only if there is no database. */
export async function queueEmail(email: QueuedEmail): Promise<boolean> {
  const handle = db();
  if (!handle) return false;
  await handle.insert(emailQueue).values({
    enquiryId: email.enquiryId,
    toAddress: email.to,
    replyTo: email.replyTo,
    subject: email.subject,
    bodyText: email.text,
    kind: email.kind ?? "notification",
    lastError: "",
    nextAttemptAt: sql`UTC_TIMESTAMP()`,
    createdAt: sql`UTC_TIMESTAMP()`,
  });
  return true;
}

/* Sends whatever is due. Never throws: it is called from the submission path,
   where a mail problem must not become the visitor's problem. Returns how
   many were sent. */
export async function flushMail(limit = 10): Promise<number> {
  const handle = db();
  const config = mailConfig();
  const mailer = transport();
  if (!handle || !config || !mailer) return 0;

  let due;
  try {
    due = await handle
      .select()
      .from(emailQueue)
      .where(
        and(eq(emailQueue.status, "pending"), lte(emailQueue.nextAttemptAt, sql`UTC_TIMESTAMP()`))
      )
      .orderBy(asc(emailQueue.nextAttemptAt))
      .limit(limit);
  } catch {
    return 0;
  }

  let sent = 0;
  for (const row of due) {
    try {
      await mailer.sendMail({
        from: config.from,
        to: row.toAddress,
        replyTo: row.replyTo || undefined,
        subject: row.subject,
        text: row.bodyText,
      });
      await handle
        .update(emailQueue)
        .set({ status: "sent", sentAt: sql`UTC_TIMESTAMP()`, lastError: "" })
        .where(eq(emailQueue.id, row.id));
      sent += 1;
    } catch (error) {
      const attempts = row.attempts + 1;
      const delay = Math.min(BASE_DELAY_SECONDS * 2 ** (attempts - 1), MAX_DELAY_SECONDS);
      // The reason is kept for the admin panel; it is never shown to a visitor
      // and never logged with the credentials it may quote.
      const reason = error instanceof Error ? error.message : "Unknown mail error";
      await handle
        .update(emailQueue)
        .set({
          attempts,
          status: attempts >= MAX_ATTEMPTS ? "failed" : "pending",
          lastError: reason.slice(0, 500),
          nextAttemptAt: sql`DATE_ADD(UTC_TIMESTAMP(), INTERVAL ${delay} SECOND)`,
        })
        .where(eq(emailQueue.id, row.id));
    }
  }
  return sent;
}
