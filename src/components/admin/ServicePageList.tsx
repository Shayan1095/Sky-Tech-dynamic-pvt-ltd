"use client";

import Link from "next/link";
import { useState } from "react";

/* The list of service pages, with a filter.

   Mobile layout and Page text are the same list of thirteen pages pointing at
   two different editors, so they share this rather than keeping two copies of
   a row that has to be changed twice.

   Unlike the price list, these rows can be filtered out of the DOM: this is
   navigation, not a form, so nothing is lost by not rendering a row. Matching
   is on the name and the slug, so "wordpress" and "meta-ads" both work. */

export type ServicePageRow = {
  slug: string;
  name: string;
  /* The count shown on the right, already worded — "3 hidden", "2 changed" —
     because the two pages count different things. Absent when there is
     nothing to say. */
  note?: string;
};

export default function ServicePageList({
  rows,
  hrefBase,
}: {
  rows: ServicePageRow[];
  hrefBase: string;
}) {
  const [query, setQuery] = useState("");
  const needle = query.trim().toLowerCase();
  const shown = needle
    ? rows.filter(
        (row) =>
          row.name.toLowerCase().includes(needle) || row.slug.toLowerCase().includes(needle)
      )
    : rows;

  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-xl border border-text/[0.09] bg-card p-4">
        <label className="flex items-center gap-3">
          <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.16em] text-text/45">
            Find
          </span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Service name or address…"
            aria-label="Filter the list of pages"
            className="w-full rounded-lg border border-text/12 bg-panel px-4 py-2 text-[0.9rem] text-text outline-none transition-colors duration-200 placeholder:text-text/30 focus:border-primary focus:bg-card"
          />
        </label>
      </div>

      {shown.length === 0 ? (
        <p className="rounded-xl border border-text/[0.09] bg-card px-5 py-4 text-[0.9rem] text-text/55">
          Nothing matches &ldquo;{query}&rdquo;.
        </p>
      ) : (
        <div className="rounded-xl border border-text/[0.09] bg-card">
          <ul className="flex flex-col">
            {shown.map((row) => (
              <li key={row.slug} className="border-b border-text/[0.06] last:border-b-0">
                <Link
                  href={`${hrefBase}/${row.slug}`}
                  className="flex flex-wrap items-center gap-x-4 gap-y-1 px-5 py-4 transition-colors duration-200 hover:bg-text/[0.02]"
                >
                  <span className="min-w-0 flex-1">
                    <span className="block font-display text-[1rem] font-semibold tracking-[-0.01em] text-text">
                      {row.name}
                    </span>
                    <span className="mt-0.5 block font-mono text-[10px] tracking-[0.06em] text-text/35">
                      /services/{row.slug}
                    </span>
                  </span>
                  {row.note && (
                    <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-primary">
                      {row.note}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
