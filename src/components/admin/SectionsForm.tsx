"use client";

import { useActionState, useState } from "react";

import { saveSections, type SectionsResult } from "@/lib/actions/sections";

export type SectionRow = { key: string; label: string; note: string; hidden: boolean };

export default function SectionsForm({
  slug,
  sections,
}: {
  slug: string;
  sections: SectionRow[];
}) {
  const [state, formAction, pending] = useActionState<SectionsResult, FormData>(
    saveSections,
    null
  );

  const [hidden, setHidden] = useState<Set<string>>(
    () => new Set(sections.filter((s) => s.hidden).map((s) => s.key))
  );

  const toggle = (key: string) => {
    setHidden((current) => {
      const next = new Set(current);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const count = hidden.size;

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <input type="hidden" name="slug" value={slug} />

      <div className="rounded-xl border border-text/[0.09] bg-card p-5">
        <ul className="flex flex-col">
          {sections.map((section) => {
            const off = hidden.has(section.key);
            return (
              <li
                key={section.key}
                className="flex items-center gap-4 border-b border-text/[0.06] py-3 first:pt-0 last:border-b-0 last:pb-0"
              >
                <div className="min-w-0 flex-1">
                  <p
                    className={`text-[0.95rem] font-medium transition-colors duration-200 ${
                      off ? "text-text/35" : "text-text"
                    }`}
                  >
                    {section.label}
                  </p>
                  <p className="mt-0.5 text-[0.8rem] text-text/45">{section.note}</p>
                </div>

                <label className="flex cursor-pointer items-center gap-2.5">
                  <span
                    className={`font-mono text-[10px] uppercase tracking-[0.14em] transition-colors duration-200 ${
                      off ? "text-text/35" : "text-primary"
                    }`}
                  >
                    {off ? "Hidden" : "Shown"}
                  </span>
                  <input
                    type="checkbox"
                    name={`hide::${section.key}`}
                    checked={off}
                    onChange={() => toggle(section.key)}
                    className="peer sr-only"
                    aria-label={`Hide ${section.label} on phones`}
                  />
                  <span
                    aria-hidden="true"
                    className={`relative h-6 w-11 rounded-full transition-colors duration-200 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-primary ${
                      off ? "bg-text/20" : "bg-primary"
                    }`}
                  >
                    <span
                      className={`absolute top-1 h-4 w-4 rounded-full bg-card transition-transform duration-200 ease-out ${
                        off ? "translate-x-1" : "translate-x-6"
                      }`}
                    />
                  </span>
                </label>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="rounded-xl border border-text/[0.09] bg-card p-5">
        <p className="text-[0.8rem] leading-relaxed text-text/50">
          Hidden sections are still on the page and still read by search engines — they
          are hidden with a style rule, not removed. Desktop is never affected.
        </p>
        <p className="mt-2 text-[0.8rem] leading-relaxed text-text/50">
          The headline, the packages and the closing call to action cannot be hidden. A
          phone visitor who cannot see a price or a way to get in touch has been shown a
          brochure.
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

      {state && "hidden" in state && (
        <div
          role="status"
          className="rounded-lg border border-[#0a7c42]/25 bg-[#0a7c42]/[0.06] px-4 py-3 text-[0.875rem] text-text"
        >
          Saved. {state.hidden === 0
            ? "Every section shows on phones."
            : `${state.hidden} section${state.hidden === 1 ? " is" : "s are"} hidden on phones.`}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex min-h-[46px] items-center justify-center rounded-lg bg-primary px-6 font-mono text-[10px] uppercase tracking-[0.16em] text-white transition-[transform,opacity] duration-150 ease-out active:scale-[0.98] disabled:cursor-wait disabled:opacity-70"
        >
          {pending ? "Saving..." : "Save"}
        </button>
        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-text/35">
          {count === 0 ? "Nothing hidden" : `${count} hidden on phones`}
        </p>
      </div>
    </form>
  );
}
