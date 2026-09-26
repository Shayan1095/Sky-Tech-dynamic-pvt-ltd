import "server-only";

import { eq } from "drizzle-orm";

import type { ServicePage } from "@/lib/service-pages/types";

import { db } from "./db";
import { pageText } from "./schema";

/* ---------------------------------------------------------------------------
   Editing the words on a service page.

   Which words are editable is a list, not a guess. Everything on this list is
   a sentence a person reads and a business might want to reword: a headline,
   an introduction, an answer to a question. Everything not on it — the
   structure, the feature lists, the technology names — stays in the content
   files, where a change is reviewed before it ships.

   That boundary is the point. A panel that lets any field be rewritten will
   eventually be used to paste a paragraph into a heading, and the page will
   have no way to refuse.
   ------------------------------------------------------------------------ */

export type TextMap = Record<string, string>;

export type EditableField = {
  key: string;
  label: string;
  group: string;
  value: string;
  original: string;
  multiline: boolean;
  /* Roughly what the design expects. Not enforced — a hard limit that
     truncates someone's sentence is worse than a line that wraps — but shown,
     so the effect of a much longer version is not a surprise. */
  guide?: number;
};

export async function getPageText(slug: string): Promise<TextMap> {
  const handle = db();
  if (!handle) return {};
  try {
    const rows = await handle
      .select({ field: pageText.fieldKey, value: pageText.value })
      .from(pageText)
      .where(eq(pageText.pageKey, slug));
    const map: TextMap = {};
    for (const row of rows) map[row.field] = row.value;
    return map;
  } catch {
    return {};
  }
}

/** How many fields have been changed on each page, for the overview list. */
export async function editedCounts(): Promise<Record<string, number>> {
  const handle = db();
  if (!handle) return {};
  try {
    const rows = await handle.select({ page: pageText.pageKey }).from(pageText);
    const counts: Record<string, number> = {};
    for (const row of rows) counts[row.page] = (counts[row.page] ?? 0) + 1;
    return counts;
  } catch {
    return {};
  }
}

/* The editable fields of a page, each with the words currently shown and the
   words the content file holds. Both are needed: one to edit, one to return
   to. */
export function editableFields(page: ServicePage, saved: TextMap): EditableField[] {
  const fields: EditableField[] = [];

  const add = (
    key: string,
    label: string,
    group: string,
    original: string,
    multiline = false,
    guide?: number
  ) => {
    if (typeof original !== "string") return;
    fields.push({ key, label, group, value: saved[key] ?? original, original, multiline, guide });
  };

  add("hero.label", "Label above the headline", "Hero", page.hero.label, false, 40);
  add("hero.h1", "Headline", "Hero", page.hero.h1, true, 70);
  add("hero.subheadline", "Subheadline", "Hero", page.hero.subheadline, true, 180);
  add("hero.primaryCta", "Main button", "Hero", page.hero.primaryCta, false, 28);
  add("hero.secondaryCta", "Second button", "Hero", page.hero.secondaryCta, false, 28);

  add("problem.heading", "Heading", "The problem", page.problem.heading, true, 80);
  page.problem.paragraphs.forEach((text, i) => {
    add(`problem.paragraphs.${i}`, `Paragraph ${i + 1}`, "The problem", text, true);
  });

  add("offerings.heading", "Heading", "What we offer", page.offerings.heading, true, 80);
  add("packages.heading", "Heading", "Packages", page.packages.heading, true, 80);

  page.faq.items.forEach((item, i) => {
    add(`faq.${i}.question`, `Question ${i + 1}`, "Questions", item.question, true, 100);
    add(`faq.${i}.answer`, `Answer ${i + 1}`, "Questions", item.answer, true);
  });

  add("closing.kicker", "Kicker", "Closing", page.closing.kicker, false, 40);
  add("closing.heading", "Heading", "Closing", page.closing.heading, true, 70);
  add("closing.body", "Body", "Closing", page.closing.body, true);
  add("closing.promise", "Promise", "Closing", page.closing.promise, true, 120);
  add("closing.primaryCta", "Main button", "Closing", page.closing.primaryCta, false, 28);
  add("closing.secondaryCta", "Second button", "Closing", page.closing.secondaryCta, false, 28);

  return fields;
}

/** The set of keys a page will accept, so a posted field can be checked. */
export function allowedKeys(page: ServicePage): Set<string> {
  return new Set(editableFields(page, {}).map((f) => f.key));
}

/* Applies saved words to a page. Only the fields listed above can be
   replaced; anything else in the table is ignored rather than merged in. */
export function applyTextToPage(page: ServicePage, saved: TextMap): ServicePage {
  if (Object.keys(saved).length === 0) return page;
  const pick = (key: string, current: string) => saved[key] ?? current;

  return {
    ...page,
    hero: {
      ...page.hero,
      label: pick("hero.label", page.hero.label),
      h1: pick("hero.h1", page.hero.h1),
      subheadline: pick("hero.subheadline", page.hero.subheadline),
      primaryCta: pick("hero.primaryCta", page.hero.primaryCta),
      secondaryCta: pick("hero.secondaryCta", page.hero.secondaryCta),
    },
    problem: {
      ...page.problem,
      heading: pick("problem.heading", page.problem.heading),
      paragraphs: page.problem.paragraphs.map((text, i) =>
        pick(`problem.paragraphs.${i}`, text)
      ),
    },
    offerings: {
      ...page.offerings,
      heading: pick("offerings.heading", page.offerings.heading),
    },
    packages: {
      ...page.packages,
      heading: pick("packages.heading", page.packages.heading),
    },
    faq: {
      ...page.faq,
      items: page.faq.items.map((item, i) => ({
        question: pick(`faq.${i}.question`, item.question),
        answer: pick(`faq.${i}.answer`, item.answer),
      })),
    },
    closing: {
      ...page.closing,
      kicker: pick("closing.kicker", page.closing.kicker),
      heading: pick("closing.heading", page.closing.heading),
      body: pick("closing.body", page.closing.body),
      promise: pick("closing.promise", page.closing.promise),
      primaryCta: pick("closing.primaryCta", page.closing.primaryCta),
      secondaryCta: pick("closing.secondaryCta", page.closing.secondaryCta),
    },
  };
}
