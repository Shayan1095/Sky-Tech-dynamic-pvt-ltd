"use client";

import type { ServicePage } from "@/lib/service-pages/types";
import { estimate } from "@/lib/service-pages/quote";
import { quoteRequestHref } from "./parts";
import { useQuote } from "./quoteStore";

/* Everything a section needs to show the visitor's quote: the chosen
   package, the ticked add-ons (in the content's order), the estimate, and
   the contact-form link that carries all of it. */
export function useServiceQuote(page: ServicePage) {
  const tiers = page.packages.tiers;
  const q = useQuote(page.slug, tiers[0].id);
  const tier = tiers.find((t) => t.id === q.tierId) ?? tiers[0];
  const addOns = (page.addOns?.items ?? []).filter((a) => q.addOns.includes(a.name));
  return {
    tier,
    addOns,
    selected: q.addOns,
    estimate: estimate(tier.price, addOns),
    href: quoteRequestHref(page.contactName, tier.name, addOns.map((a) => a.name)),
  };
}
