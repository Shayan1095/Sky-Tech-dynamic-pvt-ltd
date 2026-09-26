"use client";

import { useActionState, useRef, useState } from "react";

import { sendMessage, type SendResult } from "@/lib/actions/email";

/* What the panel already knows about the person being written to, when the
   compose box was opened from their enquiry. */
export type About = {
  name: string;
  fullName: string;
  company: string;
  service: string;
  packageName: string;
  estimate: string;
  reference: string;
  addOns: string[];
};

/* Composing a message.

   The templates are starting points, not finished emails. Each one leaves the
   specifics in square brackets — a template that looks complete is how a
   customer ends up receiving "Hi [Name]".

   That did happen: this comment used to claim a bracketed message "cannot be
   sent without being read", and nothing checked. The check now lives in the
   send action, where the message actually goes out, and this form only mirrors
   it — the first press refuses and names what is left, the second sends it as
   written. A guard that existed solely here would be worth very little, since
   the form is not what sends the message. */

/* Templates.

   Square brackets mark the parts only a person can write — what you understood
   from their message, what you are promising and by when. Everything the panel
   already knows is filled in, so opening a reply from an enquiry does not mean
   retyping a name and a package that are on the screen behind it.

   What is deliberately never auto-written is a commitment. "By [day]" stays a
   bracket because the panel does not know when you will have it done, and a
   template that guesses would be making a promise on your behalf. */
function templatesFor(about?: About): { name: string; subject: string; body: string }[] {
  const first = about?.name || "[Name]";
  const service = about?.service || "[service]";
  const pkg = about?.packageName || "[package]";
  const price = about?.estimate || "[price]";
  const ref = about?.reference ? ` (${about.reference})` : "";
  const extras =
    about && about.addOns.length > 0 ? `
Add-ons: ${about.addOns.join(", ")}` : "";

  return [
    {
      name: "Acknowledge an enquiry",
      subject: `Thanks for getting in touch${ref}`,
      body: `Hi ${first},

Thanks for your enquiry about ${service}. I've read through what you sent.

[One or two lines on what you understood, so they know a person read it.]

I'll come back to you with [what you are sending] by [day]. If anything changes in the meantime, just reply to this email.

Best regards,
SKY Tech Dynamic Private Limited`,
    },
    {
      name: "Send a quote",
      subject: `Your quote from SKY Tech Dynamic${ref}`,
      body: `Hi ${first},

Here is the quote for ${service}.

${pkg} — ${price}${extras}

What is included:
- [item]
- [item]
- [item]

[What you need from them to start, and roughly how long it takes.]

Happy to talk any of it through — just reply or call.

Best regards,
SKY Tech Dynamic Private Limited`,
    },
    {
      name: "Follow up",
      subject: `Following up on your enquiry${ref}`,
      body: `Hi ${first},

I sent over [what you sent] on [date] and wanted to check it reached you.

No rush at all — if the timing is not right, just say so and I'll leave it with you.

Best regards,
SKY Tech Dynamic Private Limited`,
    },
    {
      name: "Ask for details",
      subject: `A few questions about your project${ref}`,
      body: `Hi ${first},

Thanks again for your enquiry about ${service}. To put together an accurate price, I need a little more detail:

1. [question]
2. [question]
3. [question]

Once I have those I can send a full quote.

Best regards,
SKY Tech Dynamic Private Limited`,
    },
  ];
}

const FIELD =
  "w-full rounded-lg border border-text/12 bg-panel px-4 py-2.5 text-[0.9rem] text-text outline-none transition-colors duration-200 placeholder:text-text/30 focus:border-primary focus:bg-card";

export default function ComposeForm({
  defaultTo = "",
  defaultSubject = "",
  clientId,
  enquiryId,
  mailReady,
  about,
}: {
  defaultTo?: string;
  defaultSubject?: string;
  clientId?: number;
  enquiryId?: number;
  mailReady: boolean;
  about?: About;
}) {
  const templates = templatesFor(about);
  const [state, formAction, pending] = useActionState<SendResult, FormData>(sendMessage, null);
  const subjectRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLTextAreaElement>(null);
  const [applied, setApplied] = useState("");

  /* A refused send arms the next press to go through as written. Editing the
     message — or applying a template — takes the arming away again, so the
     confirmation can only ever apply to the text it was shown for.

     `edited` is cleared whenever a new answer comes back, adjusted during
     render rather than in an effect: without that, editing once would leave
     the form permanently unable to confirm anything. */
  const [seen, setSeen] = useState(state);
  const [edited, setEdited] = useState(false);
  if (seen !== state) {
    setSeen(state);
    setEdited(false);
  }

  const refused = state !== null && "placeholders" in state && state.placeholders !== undefined;
  const confirming = refused && !edited;

  /* Templates fill the fields rather than replacing the form, so anything
     already typed is visible right up until it is overwritten. */
  const applyTemplate = (name: string) => {
    const template = templates.find((t) => t.name === name);
    if (!template) return;
    const body = bodyRef.current;
    const subject = subjectRef.current;
    if (body && body.value.trim() && !window.confirm("Replace what you have written?")) return;
    if (subject) subject.value = template.subject;
    if (body) body.value = template.body;
    setApplied(name);
    setEdited(true);
  };

  return (
    <div>
      {!mailReady && (
        <div
          role="status"
          className="mb-4 rounded-lg border border-[#b06000]/25 bg-[#b06000]/[0.06] px-4 py-3 text-[0.85rem] leading-relaxed text-text/75"
        >
          <strong className="font-semibold">Sending is not configured yet.</strong> Messages
          written here are saved and queued, and will go out as soon as the mailbox
          details are set. Nothing is lost in the meantime.
        </div>
      )}

      {about && (
        <p className="mb-3 text-[0.8rem] leading-relaxed text-text/50">
          Templates are filled in with {about.fullName}
          {about.company ? ` at ${about.company}` : ""}
          {about.service ? `, and their ${about.service} enquiry` : ""}. Square brackets
          mark what only you can write.
        </p>
      )}

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-text/40">
          Start from
        </span>
        {templates.map((template) => (
          <button
            key={template.name}
            type="button"
            onClick={() => applyTemplate(template.name)}
            className={`rounded-full border px-3 py-1.5 text-[0.8rem] transition-[color,border-color,transform] duration-150 ease-out active:scale-[0.97] ${
              applied === template.name
                ? "border-primary bg-primary/[0.06] text-primary"
                : "border-text/12 text-text/60 hover:border-primary hover:text-primary"
            }`}
          >
            {template.name}
          </button>
        ))}
      </div>

      <form action={formAction} className="flex flex-col gap-4">
        {clientId ? <input type="hidden" name="clientId" value={clientId} /> : null}
        {enquiryId ? <input type="hidden" name="enquiryId" value={enquiryId} /> : null}
        {/* Armed only by a refusal, and disarmed the moment the message is
            edited — so confirming applies to the message that was refused,
            never to whatever replaced it afterwards. */}
        <input type="hidden" name="confirmed" value={confirming ? "1" : "0"} />

        <label className="flex flex-col gap-1.5">
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-text/40">
            To
          </span>
          <input
            name="to"
            type="email"
            required
            defaultValue={defaultTo}
            placeholder="someone@example.com"
            className={FIELD}
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-text/40">
            Subject
          </span>
          <input
            ref={subjectRef}
            name="subject"
            type="text"
            required
            maxLength={255}
            defaultValue={defaultSubject}
            onChange={() => setEdited(true)}
            className={FIELD}
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-text/40">
            Message
          </span>
          <textarea
            ref={bodyRef}
            name="body"
            required
            rows={16}
            maxLength={20000}
            placeholder="Write your message, or pick a template above."
            onChange={() => setEdited(true)}
            className={`${FIELD} resize-y leading-relaxed`}
          />
        </label>

        {state && "error" in state && (
          <div
            role="alert"
            className="rounded-lg border border-[#b42318]/25 bg-[#b42318]/[0.05] px-4 py-3 text-[0.875rem] text-text"
          >
            {state.error}
          </div>
        )}

        {state && "sent" in state && (
          <div
            role="status"
            className="rounded-lg border border-[#0a7c42]/25 bg-[#0a7c42]/[0.06] px-4 py-3 text-[0.875rem] text-text"
          >
            {state.queued
              ? "Saved and queued. It will go out as soon as the mailbox is reachable."
              : "Sent."}
          </div>
        )}

        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={pending}
            aria-busy={pending}
            className="inline-flex min-h-[46px] items-center justify-center rounded-lg bg-primary px-6 font-mono text-[10px] uppercase tracking-[0.16em] text-white transition-[transform,opacity] duration-150 ease-out active:scale-[0.98] disabled:cursor-wait disabled:opacity-70"
          >
            {pending ? "Sending..." : confirming ? "Send As Written" : "Send Message"}
          </button>
          <p className="text-[0.75rem] leading-relaxed text-text/35">
            {confirming
              ? "Pressing again sends it with the brackets still in it."
              : "Sent from the business mailbox. Replies come back to it, not to you."}
          </p>
        </div>
      </form>
    </div>
  );
}
