"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq, sql } from "drizzle-orm";

import { audit } from "@/lib/server/audit";
import { currentAdmin } from "@/lib/server/auth";
import { db } from "@/lib/server/db";
import { mailConfig } from "@/lib/server/env";
import { flushMail } from "@/lib/server/mail";
import { allow } from "@/lib/server/rate-limit";
import { emailQueue } from "@/lib/server/schema";
import { describePlaceholders, findPlaceholders } from "@/lib/placeholders";

/* Sending mail from the panel.

   Nothing is sent directly. A message is written to the queue and then an
   attempt is made, exactly as the automatic notifications are — so a message
   an admin wrote can never be silently lost to a mail outage, and the outbox
   shows the same truthful states for both.

   Sending on someone's behalf is one of the things worth being careful about:
   the address it leaves from is the business's own, so a mistake here reaches
   a real customer and cannot be recalled. Hence the explicit confirmation of
   the recipient in the form, the rate limit below, and the audit entry. */

export type SendResult =
  /* `placeholders` marks the one refusal the sender can overrule, so the form
     can arm a confirming second press without reading the message text. */
  | { error: string; placeholders?: string[] }
  | { sent: true; queued: boolean }
  | null;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function sendMessage(
  _previous: SendResult,
  formData: FormData
): Promise<SendResult> {
  const admin = await currentAdmin();
  if (!admin) redirect("/admin/login");

  const to = String(formData.get("to") ?? "").trim().slice(0, 254);
  const subject = String(formData.get("subject") ?? "").trim().slice(0, 255);
  const body = String(formData.get("body") ?? "").trim().slice(0, 20000);
  const clientId = Number(formData.get("clientId")) || null;
  const enquiryId = Number(formData.get("enquiryId")) || null;

  if (!EMAIL.test(to)) return { error: "That is not a valid email address." };
  if (!subject) return { error: "Please write a subject." };
  if (!body) return { error: "Please write a message." };

  /* A template that was never filled in is stopped here rather than in the
     form, because the form is not what sends the message. Confirming lets a
     message that genuinely contains brackets through, so this refuses a
     mistake without refusing a legitimate send. */
  if (formData.get("confirmed") !== "1") {
    const left = findPlaceholders(subject, body);
    if (left.length > 0) {
      return {
        error: `This still has ${left.length === 1 ? "a placeholder" : "placeholders"} in it: ${describePlaceholders(left)}. Fill ${left.length === 1 ? "it" : "them"} in, or press send again to send it as written.`,
        placeholders: left,
      };
    }
  }

  const handle = db();
  if (!handle) return { error: "No database is connected." };

  const config = mailConfig();

  /* A generous ceiling that still stops a compromised session from using the
     business's own mailbox to send a few thousand messages before anyone
     notices. */
  if (!(await allow(`send:${admin.id}`, 60, 60 * 60))) {
    return { error: "Too many messages sent in the last hour. Try again shortly." };
  }

  await handle.insert(emailQueue).values({
    enquiryId,
    clientId,
    sentBy: admin.id,
    kind: "reply",
    toAddress: to,
    // A reply goes back to the business mailbox, not to whoever pressed send.
    replyTo: config?.from ?? "",
    subject,
    bodyText: body,
    lastError: "",
    nextAttemptAt: sql`UTC_TIMESTAMP()`,
    createdAt: new Date(),
  });

  await audit({
    userId: admin.id,
    actor: admin.email,
    action: "email.sent",
    target: to,
    detail: subject,
  });

  // Never allowed to throw into the form: the message is already stored, so a
  // delivery problem is a queue state, not a lost message.
  const sent = await flushMail(5).catch(() => 0);

  revalidatePath("/admin/email");
  return { sent: true, queued: sent === 0 };
}

/* Puts a failed message back in the queue. The attempt count is kept so the
   history stays honest about how many times it has been tried. */
export async function retryMessage(formData: FormData): Promise<void> {
  const admin = await currentAdmin();
  if (!admin) redirect("/admin/login");

  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) return;

  const handle = db();
  if (!handle) return;

  await handle
    .update(emailQueue)
    .set({ status: "pending", nextAttemptAt: sql`UTC_TIMESTAMP()`, lastError: "" })
    .where(eq(emailQueue.id, id));

  await audit({
    userId: admin.id,
    actor: admin.email,
    action: "email.retry",
    target: `message:${id}`,
  });

  await flushMail(5).catch(() => 0);
  revalidatePath("/admin/email");
}
