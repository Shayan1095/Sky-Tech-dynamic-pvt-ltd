"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { and, eq, sql } from "drizzle-orm";

import { audit } from "@/lib/server/audit";
import { currentAdmin } from "@/lib/server/auth";
import { db } from "@/lib/server/db";
import { allowedKeys, editableFields, getPageText } from "@/lib/server/page-text";
import { pageText } from "@/lib/server/schema";
import { getServicePage } from "@/lib/service-pages";

export type TextResult = { error: string } | { saved: number; reset: number } | null;

/* Saving the words on a page.

   Like prices, the database holds the changes rather than a copy: text set
   back to what the content file says deletes its row, so what is stored is
   always exactly what has been altered.

   Two checks matter. Only fields the page actually offers are accepted, so a
   tampered POST cannot introduce a key the page never had; and only
   non-empty text is stored, because a heading cleared to nothing is far more
   likely to be a mistake than an intention. */
export async function savePageText(
  _previous: TextResult,
  formData: FormData
): Promise<TextResult> {
  const admin = await currentAdmin();
  if (!admin) redirect("/admin/login");

  const slug = String(formData.get("slug") ?? "");
  const page = getServicePage(slug);
  if (!page) return { error: "That page does not exist." };

  const handle = db();
  if (!handle) return { error: "No database is connected." };

  const allowed = allowedKeys(page);
  const current = await getPageText(slug);
  const originals = new Map(editableFields(page, {}).map((f) => [f.key, f.original]));

  const changed: string[] = [];
  let saved = 0;
  let reset = 0;

  for (const [field, raw] of formData.entries()) {
    if (!field.startsWith("text::") || typeof raw !== "string") continue;
    const key = field.slice("text::".length);
    if (!allowed.has(key)) continue;

    const original = originals.get(key) ?? "";
    // Normalised so a stray trailing space is not treated as an edit.
    const value = raw.replace(/\r\n/g, "\n").trim();
    const showing = current[key] ?? original;
    if (value === showing) continue;

    if (value === "" || value === original) {
      await handle
        .delete(pageText)
        .where(and(eq(pageText.pageKey, slug), eq(pageText.fieldKey, key)));
      reset += 1;
      changed.push(`${key} reset`);
      continue;
    }

    await handle
      .insert(pageText)
      .values({
        pageKey: slug,
        fieldKey: key,
        value,
        updatedAt: new Date(),
        updatedBy: admin.id,
      })
      .onDuplicateKeyUpdate({
        set: { value, updatedAt: sql`UTC_TIMESTAMP()`, updatedBy: admin.id },
      });

    saved += 1;
    changed.push(key);
  }

  if (saved === 0 && reset === 0) return { saved: 0, reset: 0 };

  await audit({
    userId: admin.id,
    actor: admin.email,
    action: "pagetext.saved",
    target: slug,
    detail: changed.join(", "),
  });

  revalidatePath(`/services/${slug}`);
  revalidatePath(`/admin/pages/${slug}`);

  return { saved, reset };
}
