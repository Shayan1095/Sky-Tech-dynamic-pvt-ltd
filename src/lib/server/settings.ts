import "server-only";

import { SETTING_DEFAULTS, type SiteSettings } from "@/lib/site-content";

import { db } from "./db";
import { siteSettings } from "./schema";

/* ---------------------------------------------------------------------------
   Reading the editable site details.

   This is called from the public site's layout, which is statically generated.
   That is deliberate: the values are read once when the site is built rather
   than on every request, so editable content costs nothing in speed. Saving in
   the admin panel calls revalidatePath, which rebuilds the affected pages
   immediately — the change is live within seconds without the pages becoming
   dynamic.

   Anything missing falls back to the defaults, and a database that cannot be
   reached falls back entirely. A build on a machine with no database still
   produces a correct site.
   ------------------------------------------------------------------------ */

export async function getSettings(): Promise<SiteSettings> {
  const handle = db();
  if (!handle) return SETTING_DEFAULTS;

  try {
    const rows = await handle
      .select({ key: siteSettings.settingKey, value: siteSettings.value })
      .from(siteSettings);

    const settings = { ...SETTING_DEFAULTS };
    for (const row of rows) {
      // Only keys the site knows about are applied; a leftover row from an
      // older version is ignored rather than being trusted into the page.
      if (row.key in settings && typeof row.value === "string") {
        settings[row.key as keyof SiteSettings] = row.value;
      }
    }
    return settings;
  } catch {
    return SETTING_DEFAULTS;
  }
}
