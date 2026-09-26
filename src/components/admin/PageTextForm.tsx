"use client";

import { useActionState } from "react";

import { savePageText, type TextResult } from "@/lib/actions/page-text";
import type { EditableField } from "@/lib/server/page-text";

const BASE =
  "w-full rounded-lg border px-4 py-2.5 text-[0.9rem] leading-relaxed text-text outline-none transition-colors duration-200 focus:border-primary focus:bg-card";

export default function PageTextForm({
  slug,
  fields,
}: {
  slug: string;
  fields: EditableField[];
}) {
  const [state, formAction, pending] = useActionState<TextResult, FormData>(
    savePageText,
    null
  );

  // Fields arrive in page order; grouping keeps that order rather than
  // sorting, so the form reads down the page the way the page does.
  const groups: { name: string; items: EditableField[] }[] = [];
  for (const field of fields) {
    const last = groups[groups.length - 1];
    if (last && last.name === field.group) last.items.push(field);
    else groups.push({ name: field.group, items: [field] });
  }

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <input type="hidden" name="slug" value={slug} />

      {groups.map((group) => (
        <div key={group.name} className="rounded-xl border border-text/[0.09] bg-card p-5">
          <h2 className="mb-4 font-mono text-[10px] uppercase tracking-[0.18em] text-text/45">
            {group.name}
          </h2>

          <div className="flex flex-col gap-4">
            {group.items.map((field) => {
              const edited = field.value !== field.original;
              return (
                <label key={field.key} className="flex flex-col gap-1.5">
                  <span className="flex flex-wrap items-baseline gap-2">
                    <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-text/40">
                      {field.label}
                    </span>
                    {edited && (
                      <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-primary">
                        changed
                      </span>
                    )}
                    {field.guide && (
                      <span className="font-mono text-[9px] tracking-[0.06em] text-text/25">
                        around {field.guide} characters
                      </span>
                    )}
                  </span>

                  {field.multiline ? (
                    <textarea
                      name={`text::${field.key}`}
                      defaultValue={field.value}
                      rows={Math.min(8, Math.max(2, Math.ceil(field.value.length / 80)))}
                      className={`${BASE} resize-y ${
                        edited ? "border-primary/40 bg-primary/[0.03]" : "border-text/12 bg-panel"
                      }`}
                    />
                  ) : (
                    <input
                      name={`text::${field.key}`}
                      type="text"
                      defaultValue={field.value}
                      className={`${BASE} ${
                        edited ? "border-primary/40 bg-primary/[0.03]" : "border-text/12 bg-panel"
                      }`}
                    />
                  )}

                  {edited && (
                    <span className="text-[0.75rem] leading-relaxed text-text/35">
                      Originally: {field.original}
                    </span>
                  )}
                </label>
              );
            })}
          </div>
        </div>
      ))}

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
          {state.saved === 0 && state.reset === 0
            ? "Nothing had changed, so nothing was saved."
            : `${state.saved} change${state.saved === 1 ? "" : "s"} saved` +
              (state.reset > 0 ? `, ${state.reset} returned to the original.` : ". The page has been updated.")}
        </div>
      )}

      <div className="sticky bottom-0 flex flex-wrap items-center gap-4 rounded-xl border border-text/[0.09] bg-card/95 px-5 py-4 backdrop-blur">
        <button
          type="submit"
          disabled={pending}
          aria-busy={pending}
          className="inline-flex min-h-[46px] items-center justify-center rounded-lg bg-primary px-6 font-mono text-[10px] uppercase tracking-[0.16em] text-white transition-[transform,opacity] duration-150 ease-out active:scale-[0.98] disabled:cursor-wait disabled:opacity-70"
        >
          {pending ? "Saving..." : "Save Changes"}
        </button>
        <p className="text-[0.75rem] leading-relaxed text-text/35">
          Clear a box to return that line to the original wording.
        </p>
      </div>
    </form>
  );
}
