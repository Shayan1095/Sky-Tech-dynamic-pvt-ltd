"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { sql } from "drizzle-orm";

import { audit } from "@/lib/server/audit";
import { currentAdmin } from "@/lib/server/auth";
import { db } from "@/lib/server/db";
import { getHiddenSections, SECTIONS } from "@/lib/server/sections";
import { sectionVisibility } from "@/lib/server/schema";
import { getServicePage } from "@/lib/service-pages";

export type SectionsResult = { error: string } | { hidden: number } | null;

/* Saving which sections a phone visitor sees.

   Only the keys in SECTIONS are accepted. The hero, the packages and the
   closing call to action are not in that list and never reach this, so no
   amount of editing the form can produce a page that shows a phone visitor
   no price and no way to get in touch. */
export async function saveSections(
  _previous: SectionsResult,
  formData: FormData
): Promise<SectionsResult> {
  const admin = await currentAdmin();
  if (!admin) redirect("/admin/login");

  const slug = String(formData.get("slug") ?? "");
  if (!getServicePage(slug)) return { error: "That page does not exist." };

  const handle = db();
  if (!handle) return { error: "No database is connected." };

  const before = await getHiddenSections(slug);
  const changed: string[] = [];

  for (const section of SECTIONS) {
    // An unchecked checkbox sends nothing, so "shown" is the absence of a value.
    const hidden = formData.get(`hide::${section.key}`) === "on";
    if (hidden === before.has(section.key)) continue;

    await handle
      .insert(sectionVisibility)
      .values({
        pageKey: slug,
        sectionKey: section.key,
        device: "mobile",
        hidden: hidden ? 1 : 0,
        updatedAt: new Date(),
        updatedBy: admin.id,
      })
      .onDuplicateKeyUpdate({
        set: {
          hidden: hidden ? 1 : 0,
          updatedAt: sql`UTC_TIMESTAMP()`,
          updatedBy: admin.id,
        },
      });

    changed.push(`${section.label} ${hidden ? "hidden" : "shown"}`);
  }

  const after = await getHiddenSections(slug);

  if (changed.length > 0) {
    await audit({
      userId: admin.id,
      actor: admin.email,
      action: "sections.saved",
      target: slug,
      detail: changed.join(", "),
    });
    revalidatePath(`/services/${slug}`);
    revalidatePath(`/admin/mobile/${slug}`);
  }

  return { hidden: after.size };
}
