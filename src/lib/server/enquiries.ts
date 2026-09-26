import "server-only";

import { randomInt } from "node:crypto";

import { eq } from "drizzle-orm";

import type { ContactValues } from "@/lib/contact";
import { CUSTOM_BUDGET } from "@/lib/contact";
import type { AddOn } from "@/lib/service-pages/addons";
import type { Estimate } from "@/lib/service-pages/quote";

import { db } from "./db";
import { queueEmail } from "./mail";
import { fillTemplate, getAutoReply } from "./auto-reply";
import { mailConfig } from "./env";
import { enquiries } from "./schema";

/* ---------------------------------------------------------------------------
   Storing an enquiry, and telling the business about it.

   Order matters: the row is written first, the notification is queued second.
   If mail is down the enquiry is still in the database and the admin inbox
   will show it; if the database is down nothing is claimed to have worked.
   ------------------------------------------------------------------------ */

export type EnquiryInput = {
  values: ContactValues;
  enquiryType: string;
  packageName: string;
  addOns: readonly AddOn[];
  estimate: string;
  /* The same quote as numbers, so the dashboard can total a pipeline that the
     display string alone could never be added up from. */
  figures: Estimate;
  ipHash: string;
  userAgent: string;
};

/* Reference shown to the business, e.g. SKY-7K2M9Q. Ambiguous characters are
   left out so it survives being read down a phone line. */
const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function reference(): string {
  let out = "";
  for (let i = 0; i < 6; i += 1) out += ALPHABET[randomInt(ALPHABET.length)];
  return `SKY-${out}`;
}

function notificationText(input: EnquiryInput, ref: string): string {
  const { values } = input;
  const budget =
    values.budget === CUSTOM_BUDGET
      ? `Custom — ${values.budgetCustom || "not specified"}`
      : values.budget || "Not specified";

  const lines = [
    `New enquiry — ${ref}`,
    "",
    `Name      ${values.name}`,
    `Company   ${values.company}`,
    `Email     ${values.email}`,
    `Phone     ${values.phone}`,
    `Country   ${values.country}`,
    "",
    `Service   ${values.need || "Not specified"}`,
  ];

  if (input.packageName) lines.push(`Package   ${input.packageName}`);
  lines.push(`Budget    ${budget}`);
  if (input.addOns.length > 0) {
    lines.push("Add-ons   " + input.addOns.map((a) => `${a.name} (${a.price})`).join(", "));
  }
  if (input.estimate) lines.push(`Estimate  ${input.estimate}`);
  lines.push(`Timeline  ${values.timeline || "Not specified"}`);
  if (input.enquiryType) lines.push(`Source    ${input.enquiryType}`);

  lines.push("", "Project details", "---------------", values.details || "(none given)");
  lines.push("", `Reply directly to this email to reach ${values.name}.`);

  return lines.join("\n");
}

/* Writes the enquiry and queues the notification. Returns false when there is
   no database — the caller reports that honestly rather than showing a
   success screen for a message that was never kept. */
export async function createEnquiry(input: EnquiryInput): Promise<boolean> {
  const handle = db();
  if (!handle) return false;

  const { values } = input;
  let ref = reference();

  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      await handle.insert(enquiries).values({
        reference: ref,
        name: values.name,
        company: values.company,
        email: values.email,
        phone: values.phone,
        country: values.country,
        service: values.need,
        details: values.details,
        budget: values.budget,
        budgetCustom: values.budgetCustom,
        timeline: values.timeline,
        enquiryType: input.enquiryType,
        packageName: input.packageName,
        addOns: JSON.stringify(input.addOns.map((a) => a.name)),
        estimate: input.estimate,
        estimateOnce: Math.round(input.figures.from),
        estimateMonthly: Math.round(input.figures.monthly),
        estimateYearly: Math.round(input.figures.yearly),
        estimateOpen: input.figures.open ? 1 : 0,
        ipHash: input.ipHash,
        userAgent: input.userAgent.slice(0, 255),
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      break;
    } catch (error) {
      // A duplicate reference is the one error worth retrying; anything else
      // is a real failure and the visitor must not be told it worked.
      const code = (error as { code?: string }).code;
      if (code === "ER_DUP_ENTRY" && attempt < 2) {
        ref = reference();
        continue;
      }
      throw error;
    }
  }

  const config = mailConfig();
  if (config) {
    const [row] = await handle
      .select({ id: enquiries.id })
      .from(enquiries)
      .where(eq(enquiries.reference, ref))
      .limit(1);

    const subject = input.packageName
      ? `${ref} — ${input.packageName} (${values.company})`
      : `${ref} — ${values.need || "General enquiry"} (${values.company})`;

    await queueEmail({
      enquiryId: row?.id ?? null,
      to: config.to,
      // Replying in the mail client reaches the visitor, not the site.
      replyTo: values.email,
      subject,
      text: notificationText(input, ref),
    });

    /* The visitor's own acknowledgement, if it has been switched on. It is
       queued after the business notification, never instead of it: if only
       one message can get out, it should be the one that wins the work. */
    const autoReply = await getAutoReply();
    if (autoReply.enabled) {
      const fields = {
        name: values.name,
        reference: ref,
        service: values.need,
        /* A multi-service package if they built one, otherwise the single
           package they picked. */
        packageName: input.packageName || values.budget,
        estimate: input.estimate,
        timeline: values.timeline,
        addOns: input.addOns.map((a) => a.name),
      };
      await queueEmail({
        enquiryId: row?.id ?? null,
        to: values.email,
        replyTo: config.to,
        subject: fillTemplate(autoReply.subject, fields),
        text: fillTemplate(autoReply.body, fields),
        kind: "reply",
      });
    }
  }

  return true;
}
