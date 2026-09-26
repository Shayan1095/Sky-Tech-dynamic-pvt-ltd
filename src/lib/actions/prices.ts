"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { and, eq, sql } from "drizzle-orm";

import { audit } from "@/lib/server/audit";
import { currentAdmin } from "@/lib/server/auth";
import { db } from "@/lib/server/db";
import { getPriceMap, priceKey } from "@/lib/server/prices";
import { servicePrices } from "@/lib/server/schema";
import { SERVICE_GROUPS } from "@/lib/contact";

export type PriceResult = { error: string } | { saved: number; reset: number } | null;

/* Saving prices.

   A price is written only when it differs from what is currently shown, and a
   price set back to the content file's own value deletes its override rather
   than storing a duplicate of it. The database therefore holds the exceptions,
   not a second copy of every price — so it is always obvious what has actually
   been changed.

   Only packages the site really has can be priced. A form field naming
   anything else is ignored, so a tampered POST cannot invent a package. */
export async function savePrices(
  _previous: PriceResult,
  formData: FormData
): Promise<PriceResult> {
  const admin = await currentAdmin();
  if (!admin) redirect("/admin/login");

  const handle = db();
  if (!handle) return { error: "No database is connected." };

  // The packages the site actually offers, and their built-in prices.
  const defaults = new Map<string, string>();
  for (const group of SERVICE_GROUPS) {
    for (const service of group.services) {
      for (const pkg of service.packages) {
        defaults.set(priceKey(service.name, pkg.name), pkg.price);
      }
    }
  }

  const current = await getPriceMap();
  const changes: string[] = [];
  let saved = 0;
  let reset = 0;

  for (const [field, raw] of formData.entries()) {
    if (!field.startsWith("price::") || typeof raw !== "string") continue;
    const key = field.slice("price::".length);

    const fallback = defaults.get(key);
    if (fallback === undefined) continue; // Not a package this site has.

    const [serviceName, packageName] = key.split("::");
    const value = raw.trim().slice(0, 40);
    const showing = current[key] ?? fallback;
    if (value === showing) continue;

    if (value === "" || value === fallback) {
      // Back to the built-in price: drop the override instead of storing it.
      await handle
        .delete(servicePrices)
        .where(
          and(
            eq(servicePrices.serviceName, serviceName),
            eq(servicePrices.packageName, packageName)
          )
        );
      reset += 1;
      changes.push(`${packageName} reset to ${fallback}`);
      continue;
    }

    await handle
      .insert(servicePrices)
      .values({
        serviceName,
        packageName,
        price: value,
        updatedAt: new Date(),
        updatedBy: admin.id,
      })
      .onDuplicateKeyUpdate({
        set: { price: value, updatedAt: sql`UTC_TIMESTAMP()`, updatedBy: admin.id },
      });

    saved += 1;
    changes.push(`${packageName}: ${showing} to ${value}`);
  }

  if (saved === 0 && reset === 0) return { saved: 0, reset: 0 };

  await audit({
    userId: admin.id,
    actor: admin.email,
    action: "prices.saved",
    target: "services",
    detail: changes.join("; "),
  });

  /* Prices appear on the service pages and in the contact form, all of which
     are statically generated — every one of them has to be rebuilt. */
  revalidatePath("/", "layout");
  revalidatePath("/admin/prices");

  return { saved, reset };
}
