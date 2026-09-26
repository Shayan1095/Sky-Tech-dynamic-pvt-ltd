"use client";

import { useActionState } from "react";

import { savePrices, type PriceResult } from "@/lib/actions/prices";
import type { EditablePrice } from "@/lib/server/prices";

type Group = {
  category: string;
  services: { name: string; items: EditablePrice[] }[];
};

export default function PricesForm({
  groups,
  orphans,
}: {
  groups: Group[];
  orphans: { service: string; packageName: string; price: string }[];
}) {
  const [state, formAction, pending] = useActionState<PriceResult, FormData>(savePrices, null);

  return (
    <form action={formAction} className="flex flex-col gap-3">
      {orphans.length > 0 && (
        <div className="rounded-xl border border-[#b06000]/25 bg-[#b06000]/[0.05] p-5">
          <h2 className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#b06000]">
            Not in use
          </h2>
          <p className="mt-1.5 text-[0.8rem] leading-relaxed text-text/55">
            These prices were saved against packages the site no longer has, so they are
            being ignored. They are shown here rather than deleted quietly.
          </p>
          <ul className="mt-3 flex flex-col gap-1">
            {orphans.map((o) => (
              <li key={`${o.service}::${o.packageName}`} className="text-[0.85rem] text-text/60">
                <span className="font-mono text-[11px] text-text/40">{o.service}</span>{" "}
                {o.packageName} — {o.price}
              </li>
            ))}
          </ul>
        </div>
      )}

      {groups.map((group) => (
        <div key={group.category} className="rounded-xl border border-text/[0.09] bg-card p-5">
          <h2 className="mb-4 font-mono text-[10px] uppercase tracking-[0.18em] text-text/45">
            {group.category}
          </h2>

          <div className="flex flex-col gap-6">
            {group.services.map((service) => (
              <div key={service.name}>
                <h3 className="font-display text-[1rem] font-semibold tracking-[-0.01em] text-text">
                  {service.name}
                </h3>

                <ul className="mt-2.5 flex flex-col">
                  {service.items.map((item) => {
                    const key = `${item.service}::${item.packageName}`;
                    const changed = item.savedPrice !== null;
                    return (
                      <li
                        key={key}
                        className="flex flex-wrap items-center gap-x-4 gap-y-1.5 border-b border-text/[0.06] py-2.5 last:border-b-0"
                      >
                        <span className="min-w-0 flex-1 text-[0.9rem] text-text/75">
                          {item.packageName}
                        </span>

                        {changed && (
                          <span className="font-mono text-[10px] tracking-[0.06em] text-text/30">
                            was {item.defaultPrice}
                          </span>
                        )}

                        <input
                          name={`price::${key}`}
                          type="text"
                          maxLength={40}
                          defaultValue={item.savedPrice ?? item.defaultPrice}
                          aria-label={`${item.service} — ${item.packageName} price`}
                          className={`w-32 rounded-lg border px-3 py-1.5 text-right font-mono text-[0.85rem] text-text outline-none transition-colors duration-200 focus:border-primary focus:bg-card ${
                            changed
                              ? "border-primary/40 bg-primary/[0.04]"
                              : "border-text/12 bg-panel"
                          }`}
                        />
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
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
            : `${state.saved} price${state.saved === 1 ? "" : "s"} updated` +
              (state.reset > 0
                ? `, ${state.reset} returned to the original.`
                : ". The website has been updated.")}
        </div>
      )}

      <div className="sticky bottom-0 -mx-1 flex items-center gap-4 rounded-xl border border-text/[0.09] bg-card/95 px-5 py-4 backdrop-blur">
        <button
          type="submit"
          disabled={pending}
          aria-busy={pending}
          className="inline-flex min-h-[46px] items-center justify-center rounded-lg bg-primary px-6 font-mono text-[10px] uppercase tracking-[0.16em] text-white transition-[transform,opacity] duration-150 ease-out active:scale-[0.98] disabled:cursor-wait disabled:opacity-70"
        >
          {pending ? "Saving..." : "Save Prices"}
        </button>
        <p className="text-[0.75rem] leading-relaxed text-text/35">
          Clear a box to return that package to its original price.
        </p>
      </div>
    </form>
  );
}
