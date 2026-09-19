"use client";

import Link from "next/link";
import { useRef } from "react";
import { SwipeMeter, useSwipeIndex } from "@/components/shared/SwipeRow";
import { PILLARS, serviceHref } from "@/lib/pillars";
import { headlineText, recurringExtras } from "@/lib/service-pages/quote";
import type { ServicePage } from "@/lib/service-pages/types";
import { Arrow, FRAME, FrameRules, H2, INSET, SectionLabel, Words } from "./parts";
import { quote } from "./quoteStore";
import { useSectionReveal, type RevealBuilder } from "./useSectionReveal";
import { useServiceQuote } from "./useServiceQuote";

/* Section 11 — the rest of the build.

   Not a "you may also like" strip: a visitor planning a website usually
   needs its hosting, its upkeep, often its design too. So the other services
   in this pillar are laid out as one connected system — this service on the
   left as a navy hub carrying the visitor's live quote, the related services
   on the right as rows, wired to it by drawn lines in the site's drafting
   vocabulary.

   Where a related service is also sold on this page as an add-on (UI/UX
   Design, Website Maintenance, Domain & Hosting Setup on Web Development),
   its row can be added to the quote directly and the hub's total follows.
   Every row also links to the service itself — its page once built, the
   contact form until then.

   Names, summaries and "What We Offer" lists come from the Services content
   (src/lib/pillars.ts). The wiring is drawn with plain elements so the
   entrance can draw it: trunk from the hub, a spine, a tick into each row.

   On phones the hub tightens to its name, the live estimate and the action,
   and the related services become a swipe row — the wiring, which needs
   rows stacked beside a hub, is left out there. */

const build: RevealBuilder<HTMLElement> = (tl) => {
  tl.fromTo(".sv-line", { scaleX: 0, transformOrigin: "left center" }, { scaleX: 1, duration: 0.55 }, 0)
    .fromTo(".sv-label", { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.55, stagger: 0.06 }, 0.06)
    .fromTo(".sv-heading", { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", duration: 0.85, ease: "power3.inOut" }, 0.12)
    .fromTo(".svr-sub", { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.7 }, 0.3)
    .fromTo(".svr-hub", { opacity: 0, y: 28 }, { opacity: 1, y: 0, duration: 0.9 }, 0.35)
    .fromTo(".svr-trunk", { scaleX: 0, transformOrigin: "left center" }, { scaleX: 1, duration: 0.45, ease: "power2.inOut" }, 0.8)
    .fromTo(".svr-seg", { scaleY: 0 }, { scaleY: 1, duration: 0.5, ease: "power2.inOut" }, 1.0)
    .fromTo(".svr-tick", { scaleX: 0, transformOrigin: "left center" }, { scaleX: 1, duration: 0.35, stagger: 0.08, ease: "power2.out" }, 1.25)
    .fromTo(".svr-row", { opacity: 0, x: 18 }, { opacity: 1, x: 0, duration: 0.7, stagger: 0.08, ease: "power3.out" }, 1.25);
};

const SHOWN_OFFERS = 4;

export default function ServiceRelated({ page }: { page: ServicePage }) {
  const ref = useSectionReveal(build);
  const { tier, addOns: chosen, selected, estimate, href } = useServiceQuote(page);
  const rowRef = useRef<HTMLUListElement>(null);

  const pillar = PILLARS.find((p) => p.services.some((s) => s.slug === page.slug));
  const self = pillar?.services.find((s) => s.slug === page.slug);
  const others = pillar?.services.filter((s) => s.slug !== page.slug) ?? [];
  const swipe = useSwipeIndex(rowRef, others.length);
  if (!pillar || !self || !others.length) return null;

  const firstTier = page.packages.tiers[0].id;
  const edited = tier.id !== firstTier || chosen.length > 0;

  return (
    <section ref={ref} aria-labelledby="related-heading" className="relative isolate overflow-x-clip bg-surface">
      <FrameRules />

      <div className={`relative ${FRAME}`}>
        <div className={`py-20 sm:py-24 lg:py-28 ${INSET}`}>
          <SectionLabel count={`${others.length + 1} Services`}>Related Services</SectionLabel>

          <div className="mt-8 flex flex-wrap items-end justify-between gap-x-10 gap-y-5">
            <div className="max-w-3xl">
              <h2 id="related-heading" className={`${H2} text-text`}>
                <Words text={pillar.name} />
              </h2>
              <p className="svr-sub mt-5 max-w-xl text-base leading-relaxed text-text/70 [text-wrap:pretty] sm:text-lg">
                {/* The website pillar's related services are the rest of
                    the visitor's website; other pillars' are simply more
                    from the same team. "Added to the same quote" only where
                    this page sells some of them as add-ons. */}
                {pillar.index === "01" ? "The rest of your website, from the same team" : "More from the same team"}
                {page.relatedAddOns && Object.keys(page.relatedAddOns).length > 0 ? ", and added to the same quote." : "."}
              </p>
            </div>
            <Link
              href="/services"
              className="svr-sub group inline-flex items-center gap-3 py-3 font-mono text-[11px] uppercase tracking-[0.2em] text-text/70 transition-colors duration-300 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary sm:text-xs"
            >
              All Services
              <Arrow className="transition-transform duration-500 group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="mt-9 grid grid-cols-[minmax(0,1fr)] gap-6 sm:mt-14 sm:gap-10 lg:mt-16 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.9fr)] lg:items-center lg:gap-x-12 lg:gap-y-0">
            {/* The hub: this service, and the visitor's quote so far */}
            <div className="svr-hub relative">
              <div className="pkg-panel p-6 text-white sm:p-8">
                <p className="flex items-center gap-3 font-mono text-[10.5px] uppercase tracking-[0.22em] text-white/70">
                  <span aria-hidden="true" className="block h-2 w-2 bg-cta" />
                  You&apos;re Viewing
                </p>
                <p className="mt-4 font-display text-[1.35rem] font-semibold leading-tight tracking-[-0.025em] sm:mt-5 sm:text-[1.6rem]">{self.name}</p>
                <p className="mt-3 text-[14px] leading-relaxed text-white/75 [text-wrap:pretty] max-sm:hidden">{self.summary}</p>

                <div className="mt-5 border-t border-white/12 pt-5 sm:mt-6">
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/55">
                    {edited ? "Your Estimate" : page.packages.priceLabel}
                  </p>
                  <p aria-live="polite" className="mt-1.5 font-mono text-[1.9rem] leading-none tracking-[-0.02em]">
                    {chosen.length ? headlineText(estimate) : tier.price}
                  </p>
                  <p className="mt-2 text-[12.5px] leading-relaxed text-white/60">
                    {tier.name}
                    {chosen.length > 0 && ` + ${chosen.length} add-on${chosen.length > 1 ? "s" : ""}`}
                    {chosen.length > 0 && recurringExtras(estimate).map((part) => `, + ${part}`)}
                  </p>
                </div>

                <Link
                  href={href}
                  className="group relative isolate mt-6 flex min-h-[50px] items-center justify-between gap-4 overflow-hidden rounded-full bg-white py-1.5 pl-5 pr-1.5 text-[12px] font-semibold uppercase tracking-[0.1em] text-navy [transition:scale_140ms_cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cta active:scale-[0.97]"
                >
                  <span aria-hidden="true" className="absolute inset-0 -z-10 origin-left scale-x-0 bg-cta transition-transform duration-500 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100 group-focus-visible:scale-x-100" />
                  Request Quote
                  <span aria-hidden="true" className="flex h-9 w-9 items-center justify-center rounded-full bg-navy/10">
                    <Arrow className="transition-transform duration-500 group-hover:translate-x-0.5" />
                  </span>
                </Link>
              </div>

              {/* Trunk: from the hub across to the spine (desktop) */}
              <span aria-hidden="true" className="svr-trunk absolute left-full top-1/2 hidden h-px w-6 bg-primary/40 lg:block" />
            </div>

            {/* The related services, wired to the hub */}
            <div>
            <ul ref={rowRef} className="swipe-row svr-list relative flex flex-col gap-4 pl-7 lg:pl-0">
              {others.map((service, i) => {
                const addOnName = page.relatedAddOns?.[service.name];
                const addOn = addOnName ? page.addOns?.items.find((a) => a.name === addOnName) : undefined;
                const added = !!addOn && selected.includes(addOn.name);
                const extra = service.offers.length - SHOWN_OFFERS;

                return (
                  <li key={service.slug} className="svr-row group relative" data-added={added || undefined}>
                    {/* Wiring: the spine's two halves and the tick into this row */}
                    {i > 0 && <span aria-hidden="true" className="svr-seg svr-seg-top" />}
                    {i < others.length - 1 && <span aria-hidden="true" className="svr-seg svr-seg-bottom" />}
                    <span aria-hidden="true" className="svr-tick" />
                    <span aria-hidden="true" className="svr-node" />

                    <div className="svr-card grid h-full min-w-0 gap-5 rounded-[20px] border border-text/[0.08] bg-bg p-6 sm:p-7 md:grid-cols-[minmax(0,1fr)_auto] md:items-center md:gap-8">
                      <div className="min-w-0">
                        <h3 className="font-display text-[1.2rem] font-medium leading-snug tracking-[-0.02em] text-text">
                          {service.name}
                        </h3>
                        <p className="mt-1.5 text-[14px] leading-relaxed text-text/65 [text-wrap:pretty]">{service.summary}</p>
                        <ul aria-label={`${service.name} includes`} className="mt-4 flex flex-wrap gap-1.5">
                          {service.offers.slice(0, SHOWN_OFFERS).map((o) => (
                            <li key={o} className="rounded-full border border-text/10 bg-surface px-2.5 py-1 text-[12px] text-text/70">
                              {o}
                            </li>
                          ))}
                          {extra > 0 && (
                            <li className="rounded-full px-1.5 py-1 font-mono text-[11px] text-text/45">+{extra} more</li>
                          )}
                        </ul>
                      </div>

                      <div className="flex flex-col items-start gap-2 md:items-end">
                        {addOn ? (
                          <>
                            <button
                              type="button"
                              aria-pressed={added}
                              onClick={() => quote.toggleAddOn(page.slug, firstTier, addOn.name)}
                              className={`inline-flex min-h-[44px] items-center gap-2.5 whitespace-nowrap rounded-full border px-4 text-[12px] font-semibold uppercase tracking-[0.08em] [transition:background-color_200ms_cubic-bezier(0.22,1,0.36,1),border-color_200ms_cubic-bezier(0.22,1,0.36,1),color_200ms_cubic-bezier(0.22,1,0.36,1),scale_140ms_cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary active:scale-[0.97] ${
                                added ? "border-primary bg-primary text-white" : "border-primary/35 text-primary hover:border-primary"
                              }`}
                            >
                              {added ? (
                                <svg aria-hidden="true" viewBox="0 0 16 16" className="h-3 w-3" fill="none">
                                  <path d="M3.5 8.5l3 3 6-7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                              ) : (
                                <svg aria-hidden="true" viewBox="0 0 16 16" className="h-3 w-3" fill="none">
                                  <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                              )}
                              {added ? "In your quote" : "Add to this quote"}
                              <span className={`font-mono text-[11.5px] font-normal normal-case tracking-normal ${added ? "text-white/85" : "text-text/60"}`}>
                                {addOn.price}
                              </span>
                            </button>
                            <Link
                              href={serviceHref(service)}
                              className="group/x inline-flex items-center gap-2 py-1.5 font-mono text-[10.5px] uppercase tracking-[0.18em] text-text/55 transition-colors duration-300 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                            >
                              Explore<span className="sr-only"> {service.name}</span>
                              <Arrow className="h-3 w-3 transition-transform duration-300 group-hover/x:translate-x-0.5" />
                            </Link>
                          </>
                        ) : (
                          <Link
                            href={serviceHref(service)}
                            className="group/x inline-flex min-h-[44px] items-center gap-2.5 whitespace-nowrap rounded-full border border-text/15 px-5 text-[12px] font-semibold uppercase tracking-[0.08em] text-text transition-colors duration-300 hover:border-primary hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                          >
                            Explore<span className="sr-only"> {service.name}</span>
                            <Arrow className="h-3 w-3 transition-transform duration-300 group-hover/x:translate-x-0.5" />
                          </Link>
                        )}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>

            <SwipeMeter {...swipe} count={others.length} label="service" className="mt-3" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
