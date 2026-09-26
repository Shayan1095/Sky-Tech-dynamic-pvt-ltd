"use client";

import { createContext, useContext, type ReactNode } from "react";

/* Carries prices saved in the admin panel to the contact form.

   The packages themselves — their names, what each includes, which service
   they belong to — stay in the repository. Only the price can be overridden,
   so this is a lookup of one string, not a second copy of the catalogue.

   The key is `service::package`, the same key the server uses, so a price
   edited once shows the same figure on the service page and in the form. */

export type PriceMap = Record<string, string>;

const PricesContext = createContext<PriceMap>({});

export function PricesProvider({ value, children }: { value: PriceMap; children: ReactNode }) {
  return <PricesContext.Provider value={value}>{children}</PricesContext.Provider>;
}

export const usePrices = () => useContext(PricesContext);

/** Applies any saved prices to one service's package list. */
export function withSavedPrices<T extends { name: string; price: string }>(
  packages: readonly T[],
  service: string,
  prices: PriceMap
): T[] {
  return packages.map((p) => {
    const saved = prices[`${service}::${p.name}`];
    return saved ? { ...p, price: saved } : p;
  });
}
