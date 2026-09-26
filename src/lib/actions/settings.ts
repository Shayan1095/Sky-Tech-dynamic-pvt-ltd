"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { sql } from "drizzle-orm";

import { audit } from "@/lib/server/audit";
import { currentAdmin } from "@/lib/server/auth";
import { db } from "@/lib/server/db";
import { siteSettings } from "@/lib/server/schema";
import { getSettings } from "@/lib/server/settings";
import { SETTING_FIELDS, type SiteSettings } from "@/lib/site-content";

export type SettingsResult = { error: string } | { saved: string[] } | null;

/* Saving the editable site details.

   Two things happen on save. The values are written, and every public page is
   revalidated — the site is statically generated, so without that second step
   a new phone number would sit in the database while the pages kept showing
   the old one until something else rebuilt them.

   Only fields whose value actually changed are written, so the audit log
   records what was edited rather than a wall of identical entries every time
   the form is submitted. */
export async function saveSettings(
  _previous: SettingsResult,
  formData: FormData
): Promise<SettingsResult> {
  const admin = await currentAdmin();
  if (!admin) redirect("/admin/login");

  const handle = db();
  if (!handle) return { error: "No database is connected." };

  const current = await getSettings();
  const changed: string[] = [];

  for (const field of SETTING_FIELDS) {
    const raw = formData.get(field.key);
    if (typeof raw !== "string") continue;
    const value = raw.trim().slice(0, 500);
    if (value === current[field.key as keyof SiteSettings]) continue;

    await handle
      .insert(siteSettings)
      .values({
        settingKey: field.key,
        value,
        updatedAt: new Date(),
        updatedBy: admin.id,
      })
      .onDuplicateKeyUpdate({
        set: { value, updatedAt: sql`UTC_TIMESTAMP()`, updatedBy: admin.id },
      });

    changed.push(field.label);
  }

  if (changed.length === 0) return { saved: [] };

  await audit({
    userId: admin.id,
    actor: admin.email,
    action: "settings.saved",
    target: "site",
    detail: changed.join(", "),
  });

  /* Every public page carries the footer, so every public page has to be
     rebuilt. "layout" reaches all of them in one call. */
  revalidatePath("/", "layout");
  revalidatePath("/admin/settings");

  return { saved: changed };
}
