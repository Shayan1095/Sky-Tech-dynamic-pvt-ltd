import "server-only";

import { inArray } from "drizzle-orm";

import { db } from "./db";
import { siteSettings } from "./schema";

/* ---------------------------------------------------------------------------
   The automatic reply a visitor gets after using the contact form.

   Worth being careful with. The address it goes to is one nobody has verified
   — whoever filled the form typed it — so this is, in principle, a way to make
   the business's own mailbox send a message to a stranger. Three things keep
   that honest:

   1. It is sent only after an enquiry has been successfully stored, which
      happens only after the form's validation and the honeypot.
   2. The contact form's rate limit sits in front of it, so one visitor can
      trigger at most five in an hour.
   3. It says nothing except that the enquiry arrived, and repeats back only
      what that person themselves submitted.

   The wording is editable, because "we reply within one working day" is a
   promise the business has to be able to change without a developer.
   ------------------------------------------------------------------------ */

export type AutoReply = {
  enabled: boolean;
  subject: string;
  body: string;
};

/* Placeholders, replaced when the message is built:

     {{name}}       who wrote in
     {{reference}}  their reference, e.g. SKY-PMJQW4
     {{service}}    the service they chose
     {{package}}    the package, as a whole line
     {{estimate}}   the indicative price, as a whole line
     {{timeline}}   when they want it, as a whole line
     {{addons}}     any extras they ticked, as a whole line
     {{summary}}    all of the above as one labelled block

   The line-shaped ones disappear entirely when there is nothing to put in
   them, so somebody who asked a general question never receives a label with
   nothing after it. Anything else in braces is left exactly as written. */
export const AUTO_REPLY_DEFAULTS: AutoReply = {
  enabled: false,
  subject: "We've received your enquiry ({{reference}})",
  body: `Hi {{name}},

Thank you for contacting SKY Tech Dynamic. Your enquiry has reached the right person and we are looking at it now.

{{summary}}
Your reference is {{reference}} — quoting it in any reply helps us find your message quickly.

What happens next: we'll go through what you sent and come back to you with any questions, or with a proposal and a firm price. If your enquiry is urgent, you're welcome to call us directly.

Best regards,
SKY Tech Dynamic Private Limited`,
};

const KEYS = ["ack.enabled", "ack.subject", "ack.body"];

export async function getAutoReply(): Promise<AutoReply> {
  const handle = db();
  if (!handle) return AUTO_REPLY_DEFAULTS;

  try {
    const rows = await handle
      .select({ key: siteSettings.settingKey, value: siteSettings.value })
      .from(siteSettings)
      .where(inArray(siteSettings.settingKey, KEYS));

    const found = new Map(rows.map((row) => [row.key, row.value]));
    return {
      // Off unless explicitly switched on, so an upgrade never starts mailing
      // people on its own.
      enabled: found.get("ack.enabled") === "1",
      subject: found.get("ack.subject") ?? AUTO_REPLY_DEFAULTS.subject,
      body: found.get("ack.body") ?? AUTO_REPLY_DEFAULTS.body,
    };
  } catch {
    return AUTO_REPLY_DEFAULTS;
  }
}

export type TemplateValues = {
  name: string;
  reference: string;
  service: string;
  packageName: string;
  estimate: string;
  timeline: string;
  addOns: readonly string[];
};

/* A labelled block of everything the visitor chose, aligned so it reads as a
   record rather than a paragraph. Only the rows they actually filled in
   appear; if they filled in none, the whole block — and the blank line after
   it — disappears. */
function summaryBlock(values: TemplateValues): string {
  const rows: [string, string][] = [];
  if (values.service) rows.push(["Service", values.service]);
  if (values.packageName) rows.push(["Package", values.packageName]);
  if (values.addOns.length > 0) rows.push(["Add-ons", values.addOns.join(", ")]);
  if (values.estimate) rows.push(["Indicative price", values.estimate]);
  if (values.timeline) rows.push(["Timeline", values.timeline]);

  if (rows.length === 0) return "";

  const width = Math.max(...rows.map(([label]) => label.length));
  const lines = rows.map(([label, value]) => `  ${label.padEnd(width)}   ${value}`);

  return ["Here is what you told us:", "", ...lines, ""].join("\n");
}

/* Substitution is deliberately one-way and literal: values are pasted in, and
   nothing in a value is ever treated as a placeholder itself. A visitor who
   types "{{reference}}" as their name gets those characters back, not someone
   else's reference number. */
export function fillTemplate(template: string, values: TemplateValues): string {
  const line = (label: string, value: string) => (value ? `${label}: ${value}\n` : "");

  const replacements: Record<string, string> = {
    name: values.name,
    reference: values.reference,
    service: values.service || "your project",
    package: line("You asked about", values.packageName),
    estimate: line("Indicative price", values.estimate),
    timeline: line("Timeline", values.timeline),
    addons: line("Add-ons", values.addOns.join(", ")),
    summary: summaryBlock(values),
  };

  const filled = template.replace(
    /\{\{(name|reference|service|package|estimate|timeline|addons|summary)\}\}/g,
    (_match, key: string) => replacements[key] ?? ""
  );

  /* A placeholder that resolved to nothing leaves the blank line that was
     around it. Collapsing runs of blank lines means the message reads the
     same whether someone filled in everything or nothing. */
  return filled.replace(/\n{3,}/g, "\n\n").trim();
}
