"use client";

import { useActionState } from "react";

import { saveSettings, type SettingsResult } from "@/lib/actions/settings";
import { SETTING_FIELDS, type SiteSettings } from "@/lib/site-content";

const FIELD =
  "w-full rounded-lg border border-text/12 bg-panel px-4 py-2.5 text-[0.9rem] text-text outline-none transition-colors duration-200 placeholder:text-text/30 focus:border-primary focus:bg-card";

export default function SettingsForm({ settings }: { settings: SiteSettings }) {
  const [state, formAction, pending] = useActionState<SettingsResult, FormData>(
    saveSettings,
    null
  );

  const contact = SETTING_FIELDS.filter((f) => f.group === "contact");
  const social = SETTING_FIELDS.filter((f) => f.group === "social");

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <Section
        title="Contact details"
        note="Shown in the header, the footer, the contact page and the form."
      >
        {contact.map((field) => (
          <label key={field.key} className="flex flex-col gap-1.5">
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-text/40">
              {field.label}
            </span>
            <input
              name={field.key}
              type="text"
              maxLength={500}
              defaultValue={settings[field.key]}
              placeholder={field.placeholder}
              className={FIELD}
            />
            {field.hint && <span className="text-[0.75rem] text-text/35">{field.hint}</span>}
          </label>
        ))}
      </Section>

      <Section
        title="Social profiles"
        note="Leave one empty to hide its icon. An icon that links nowhere is worse than no icon."
      >
        {social.map((field) => (
          <label key={field.key} className="flex flex-col gap-1.5">
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-text/40">
              {field.label}
            </span>
            <input
              name={field.key}
              type="url"
              maxLength={500}
              defaultValue={settings[field.key]}
              placeholder={field.placeholder}
              className={FIELD}
            />
          </label>
        ))}
      </Section>

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
          className="rounded-lg border border-[#0a7c42]/25 bg-[#0a7c42]/[0.06] px-4 py-3 text-[0.875rem] leading-relaxed text-text"
        >
          {state.saved.length === 0
            ? "Nothing had changed, so nothing was saved."
            : `Saved: ${state.saved.join(", ")}. The website has been updated.`}
        </div>
      )}

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={pending}
          aria-busy={pending}
          className="inline-flex min-h-[46px] items-center justify-center rounded-lg bg-primary px-6 font-mono text-[10px] uppercase tracking-[0.16em] text-white transition-[transform,opacity] duration-150 ease-out active:scale-[0.98] disabled:cursor-wait disabled:opacity-70"
        >
          {pending ? "Saving..." : "Save Changes"}
        </button>
        <p className="text-[0.75rem] leading-relaxed text-text/35">
          Changes appear on the live site within a few seconds.
        </p>
      </div>
    </form>
  );
}

function Section({
  title,
  note,
  children,
}: {
  title: string;
  note: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-text/[0.09] bg-card p-5">
      <div className="mb-4">
        <h2 className="font-mono text-[10px] uppercase tracking-[0.18em] text-text/45">{title}</h2>
        <p className="mt-1.5 text-[0.8rem] leading-relaxed text-text/40">{note}</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">{children}</div>
    </div>
  );
}
