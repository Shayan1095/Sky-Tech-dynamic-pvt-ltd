"use client";

import { useActionState, useState } from "react";

import { saveAutoReply, type AutoReplyResult } from "@/lib/actions/auto-reply";
import type { AutoReply } from "@/lib/server/auto-reply";

const FIELD =
  "w-full rounded-lg border border-text/12 bg-panel px-4 py-2.5 text-[0.9rem] text-text outline-none transition-colors duration-200 focus:border-primary focus:bg-card";

export default function AutoReplyForm({ template }: { template: AutoReply }) {
  const [state, formAction, pending] = useActionState<AutoReplyResult, FormData>(
    saveAutoReply,
    null
  );
  const [enabled, setEnabled] = useState(template.enabled);

  /* Keyed on the saved text: after restoring, React rebuilds the boxes so the
     new wording appears instead of whatever was typed over it. */
  const version = `${template.subject.length}-${template.body.length}`;

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <label className="flex items-start gap-3 rounded-lg border border-text/[0.09] bg-panel p-4">
        <input
          name="enabled"
          type="checkbox"
          defaultChecked={template.enabled}
          onChange={(event) => setEnabled(event.currentTarget.checked)}
          className="mt-0.5 h-4 w-4 accent-[#006bb8]"
        />
        <span>
          <span className="block text-[0.9rem] font-medium text-text">
            Send an automatic reply to whoever enquires
          </span>
          <span className="mt-1 block text-[0.8rem] leading-relaxed text-text/50">
            {enabled
              ? "On. Everyone who submits the form receives this message straight away."
              : "Off. Nobody receives anything automatically; the enquiry still reaches your inbox."}
          </span>
        </span>
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-text/40">
          Subject
        </span>
        <input
          key={`s-${version}`}
          name="subject"
          type="text"
          maxLength={255}
          defaultValue={template.subject}
          className={FIELD}
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-text/40">
          Message
        </span>
        <textarea
          key={`b-${version}`}
          name="body"
          rows={16}
          maxLength={8000}
          defaultValue={template.body}
          className={`${FIELD} resize-y leading-relaxed`}
        />
      </label>

      <div className="rounded-lg border border-text/[0.09] bg-panel px-4 py-3">
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-text/40">
          Placeholders
        </p>
        <p className="mt-1.5 text-[0.8rem] leading-relaxed text-text/55">
          <code className="font-mono text-[0.78rem] text-primary">{"{{name}}"}</code>,{" "}
          <code className="font-mono text-[0.78rem] text-primary">{"{{reference}}"}</code>,{" "}
          <code className="font-mono text-[0.78rem] text-primary">{"{{service}}"}</code>,{" "}
          <code className="font-mono text-[0.78rem] text-primary">{"{{package}}"}</code>,{" "}
          <code className="font-mono text-[0.78rem] text-primary">{"{{estimate}}"}</code>,{" "}
          <code className="font-mono text-[0.78rem] text-primary">{"{{timeline}}"}</code> and{" "}
          <code className="font-mono text-[0.78rem] text-primary">{"{{addons}}"}</code> are
          replaced with the enquirer&apos;s details. Anything else in braces is left exactly
          as written.
        </p>
        <p className="mt-2 text-[0.8rem] leading-relaxed text-text/45">
          <code className="font-mono text-[0.78rem] text-primary">{"{{summary}}"}</code>{" "}
          writes all of them as one labelled block — the quickest way to show someone
          exactly what they chose.
        </p>
        <p className="mt-2 text-[0.8rem] leading-relaxed text-text/45">
          Each writes itself as a whole line and disappears entirely when there is nothing
          to put in it, so a general question never receives a label with nothing after it.
        </p>
      </div>

      {state && "error" in state && (
        <div
          role="alert"
          className="rounded-lg border border-[#b42318]/25 bg-[#b42318]/[0.05] px-4 py-3 text-[0.875rem] text-text"
        >
          {state.error}
        </div>
      )}

      {state && "saved" in state && (
        <div
          role="status"
          className="rounded-lg border border-[#0a7c42]/25 bg-[#0a7c42]/[0.06] px-4 py-3 text-[0.875rem] text-text"
        >
          Saved. Automatic replies are {state.enabled ? "on" : "off"}.
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          aria-busy={pending}
          className="inline-flex min-h-[46px] items-center justify-center rounded-lg bg-primary px-6 font-mono text-[10px] uppercase tracking-[0.16em] text-white transition-[transform,opacity] duration-150 ease-out active:scale-[0.98] disabled:cursor-wait disabled:opacity-70"
        >
          {pending ? "Saving..." : "Save Automatic Reply"}
        </button>

        {/* Submits the same form with restore=1, which discards whatever is in
            the boxes and writes the wording that ships with the site. */}
        <button
          type="submit"
          name="restore"
          value="1"
          disabled={pending}
          className="inline-flex min-h-[46px] items-center justify-center rounded-lg border border-text/15 px-5 font-mono text-[10px] uppercase tracking-[0.16em] text-text/60 transition-[color,border-color,transform] duration-150 ease-out hover:border-primary hover:text-primary active:scale-[0.98] disabled:opacity-60"
        >
          Restore standard wording
        </button>
      </div>
    </form>
  );
}
