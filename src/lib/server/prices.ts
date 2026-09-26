import "server-only";

import { SERVICE_GROUPS, type Package } from "@/lib/contact";
import type { ServicePage } from "@/lib/service-pages/types";

import { db } from "./db";
import { servicePrices } from "./schema";

/* ---------------------------------------------------------------------------
   Applying saved prices.

   A price lives in the repository as the default and in the database as an
   override. Nothing is ever deleted from the files, so the site is always
   correct even with an empty database — the override simply wins when there
   is one.

   The key is the service and the package name together. Both the contact
   form's package list and a service page's pricing tiers use the same names,
   which is what lets one edit change the price everywhere it appears rather
   than in one place and not the other.
   ------------------------------------------------------------------------ */

export type PriceMap = Record<string, string>;

export const priceKey = (service: string, packageName: string) =>
  `${service}::${packageName}`;

export async function getPriceMap(): Promise<PriceMap> {
  const handle = db();
  if (!handle) return {};
  try {
    const rows = await handle
      .select({
        service: servicePrices.serviceName,
        item: servicePrices.packageName,
        price: servicePrices.price,
      })
      .from(servicePrices);

    const map: PriceMap = {};
    for (const row of rows) map[priceKey(row.service, row.item)] = row.price;
    return map;
  } catch {
    // An unreachable database means the site shows its built-in prices, which
    // are correct — just possibly not the newest.
    return {};
  }
}

/** The contact form's service groups, with any saved prices applied. */
export function applyPricesToGroups(prices: PriceMap): typeof SERVICE_GROUPS {
  if (Object.keys(prices).length === 0) return SERVICE_GROUPS;

  return SERVICE_GROUPS.map((group) => ({
    ...group,
    services: group.services.map((service) => ({
      ...service,
      packages: service.packages.map((pkg): Package => {
        const override = prices[priceKey(service.name, pkg.name)];
        return override ? { ...pkg, price: override } : pkg;
      }),
    })),
  }));
}

/* A service page, with saved prices applied to its pricing tiers and to the
   plan cards inside its capability sections — the two places a page states a
   price that the contact form also carries.

   Add-on prices are deliberately left alone. They live in their own list,
   which the quote builder adds up; overriding them here and not there would
   put a different total on the page than in the enquiry it produces. */
export function applyPricesToPage(page: ServicePage, prices: PriceMap): ServicePage {
  if (Object.keys(prices).length === 0) return page;

  const service = page.contactName;
  const priced = (name: string, current: string) => prices[priceKey(service, name)] ?? current;

  return {
    ...page,
    packages: {
      ...page.packages,
      tiers: page.packages.tiers.map((tier) => ({
        ...tier,
        price: priced(tier.name, tier.price),
      })),
    },
    capabilities: page.capabilities?.map((capability) =>
      capability.plans
        ? {
            ...capability,
            plans: capability.plans.map((plan) => ({
              ...plan,
              price: priced(plan.name, plan.price),
            })),
          }
        : capability
    ),
  };
}

/* Every editable price, for the admin panel: the built-in value, the saved
   override if there is one, and whether a saved row no longer matches any
   package — so an orphan is visible rather than silently ignored. */
export type EditablePrice = {
  service: string;
  packageName: string;
  defaultPrice: string;
  savedPrice: string | null;
};

export function editablePrices(prices: PriceMap): {
  groups: { category: string; services: { name: string; items: EditablePrice[] }[] }[];
  orphans: { service: string; packageName: string; price: string }[];
} {
  const known = new Set<string>();

  const groups = SERVICE_GROUPS.map((group) => ({
    category: group.category,
    services: group.services.map((service) => ({
      name: service.name,
      items: service.packages.map((pkg) => {
        const key = priceKey(service.name, pkg.name);
        known.add(key);
        return {
          service: service.name,
          packageName: pkg.name,
          defaultPrice: pkg.price,
          savedPrice: prices[key] ?? null,
        };
      }),
    })),
  }));

  const orphans = Object.entries(prices)
    .filter(([key]) => !known.has(key))
    .map(([key, price]) => {
      const [service, packageName] = key.split("::");
      return { service, packageName, price };
    });

  return { groups, orphans };
}
