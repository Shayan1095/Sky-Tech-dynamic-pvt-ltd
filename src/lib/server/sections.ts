import "server-only";

import { and, eq } from "drizzle-orm";

import { db } from "./db";
import { sectionVisibility } from "./schema";

/* ---------------------------------------------------------------------------
   Which sections a service page shows on a phone.

   Hidden means hidden with CSS, not removed from the page. Three reasons, and
   all three matter:

   1. The desktop output stays byte-identical — nothing about the markup
      changes, only a class.
   2. There is no hydration mismatch, because the server and the browser render
      the same thing.
   3. Search engines still see the content. Google indexes the mobile page, so
      dropping a section from the markup would genuinely remove it from what
      the page is understood to be about.

   Some sections cannot be hidden at all. A page with no hero has no headline;
   a page with no packages and no closing has nothing to act on. Those are left
   out of the list rather than offered and then argued with.
   ------------------------------------------------------------------------ */

export type SectionKey =
  | "problem"
  | "offerings"
  | "capabilities"
  | "extras"
  | "technology"
  | "why"
  | "process"
  | "investment"
  | "faq"
  | "related";

export const SECTIONS: { key: SectionKey; label: string; note: string }[] = [
  { key: "problem", label: "The problem", note: "Why the service exists" },
  { key: "offerings", label: "What we offer", note: "The list of what is included" },
  { key: "capabilities", label: "Capabilities", note: "Detailed breakdown and plans" },
  { key: "extras", label: "Add-ons", note: "Optional extras and their prices" },
  { key: "technology", label: "Technology", note: "Tools and platforms used" },
  { key: "why", label: "Why us", note: "Reasons to choose SKY Tech" },
  { key: "process", label: "Process", note: "How the work runs, step by step" },
  { key: "investment", label: "Cost and timeline", note: "Budget guide and how long it takes" },
  { key: "faq", label: "Questions", note: "Frequently asked questions" },
  { key: "related", label: "Related services", note: "What else pairs with this" },
];

/* The hero, the packages and the closing call to action are not listed. A
   phone visitor who cannot see the price or the way to get in touch has been
   shown a brochure, not a page that sells. */

export type HiddenSections = Set<string>;

export async function getHiddenSections(slug: string): Promise<HiddenSections> {
  const handle = db();
  if (!handle) return new Set();
  try {
    const rows = await handle
      .select({ section: sectionVisibility.sectionKey, hidden: sectionVisibility.hidden })
      .from(sectionVisibility)
      .where(and(eq(sectionVisibility.pageKey, slug), eq(sectionVisibility.device, "mobile")));
    return new Set(rows.filter((row) => row.hidden === 1).map((row) => row.section));
  } catch {
    return new Set();
  }
}

/** How many sections are hidden on each page, for the overview list. */
export async function hiddenCounts(): Promise<Record<string, number>> {
  const handle = db();
  if (!handle) return {};
  try {
    const rows = await handle
      .select({ page: sectionVisibility.pageKey, hidden: sectionVisibility.hidden })
      .from(sectionVisibility)
      .where(eq(sectionVisibility.device, "mobile"));
    const counts: Record<string, number> = {};
    for (const row of rows) {
      if (row.hidden === 1) counts[row.page] = (counts[row.page] ?? 0) + 1;
    }
    return counts;
  } catch {
    return {};
  }
}

/* The class a section wrapper gets. `max-sm:hidden` is phone-only, so nothing
   above 640px is affected by any of this. */
export const sectionClass = (hidden: HiddenSections, key: SectionKey) =>
  hidden.has(key) ? "max-sm:hidden" : undefined;
