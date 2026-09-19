"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import type { ServicePage } from "@/lib/service-pages/types";
import { Arrow, FRAME, FrameRules, H2, INSET, SectionLabel, Words, consultationHref } from "./parts";
import { quote } from "./quoteStore";
import { useServiceQuote } from "./useServiceQuote";
import { revealHead, useSectionReveal, type RevealBuilder } from "./useSectionReveal";

/* Section 04 — packages. The page's conversion core.

   Five tiers with ten to fifteen inclusions each would be a wall if laid out
   side by side, and the comparison a visitor actually makes is "which one is
   me?", not "what does tier 3 have that tier 4 lacks?". So the tiers are a
   chooser — name, starting price and who it's for — and the chosen tier's
   full specification is a live panel beside it: the same chooser-and-panel
   the Services page uses for its service combinations, so it is already
   familiar by the time a visitor gets here.

   The chooser is a real radio group (arrow keys move through it), and the
   panel's action opens the contact form with this service and this package
   already selected.

   Phones get the same group as a row of tabs above the panel, so choosing a
   tier never pushes its details off screen.

   The chosen tier is the page's shared quote (see quoteStore), so the quote
   builder's total and both quote bars follow it. The hero's Package Index
   and the What We Build links select a tier directly; a #tier-<id> address
   does the same for anyone arriving from a shared link.

   Beneath the chooser, one line for the visitor who can't decide: the
   consultation, offered at the moment of hesitation. */

const build: RevealBuilder<HTMLElement> = (tl) => {
  revealHead(tl)
    .fromTo(".svk-opt", { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.06 }, 0.3)
    .fromTo(".svk-panel", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1 }, 0.4);
};

function Check() {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" className="mt-[3px] h-[14px] w-[14px] shrink-0 text-cta" fill="none">
      <path d="M3.5 8.5l3 3 6-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PanelLabel({ children }: { children: React.ReactNode }) {
  return <p className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-white/55">{children}</p>;
}

export default function ServicePackages({ page }: { page: ServicePage }) {
  const ref = useSectionReveal(build);
  const panelRef = useRef<HTMLDivElement>(null);
  const { packages, contactName } = page;
  const { tiers } = packages;

  const { tier, addOns, href } = useServiceQuote(page);
  const selectedId = tier.id;
  const index = Math.max(0, tiers.findIndex((t) => t.id === selectedId));

  /* A shared link to #tier-<id> opens with that package chosen. */
  useEffect(() => {
    const apply = () => {
      const match = tiers.find((t) => window.location.hash === `#tier-${t.id}`);
      if (match) quote.setTier(page.slug, match.id);
    };
    apply();
    window.addEventListener("hashchange", apply);
    return () => window.removeEventListener("hashchange", apply);
  }, [page.slug, tiers]);

  /* Each change of tier assembles the panel's contents again. The panel's
     height changes with the tier, so everything below is re-measured once
     it has settled. */
  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const panel = panelRef.current;
    if (!panel) return;
    const refresh = window.setTimeout(() => ScrollTrigger.refresh(), 450);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return () => window.clearTimeout(refresh);
    }
    const ctx = gsap.context(() => {
      gsap.fromTo(".svk-swap", { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.4, stagger: 0.04, ease: "power3.out" });
    }, panel);
    return () => {
      window.clearTimeout(refresh);
      ctx.revert();
    };
  }, [selectedId]);

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <section
      ref={ref}
      id="packages"
      aria-labelledby="packages-heading"
      className="sky-anchor relative isolate overflow-x-clip border-b border-accent bg-bg"
    >
      <FrameRules />

      <div className={`relative ${FRAME}`}>
        <div className={`py-20 sm:py-24 lg:py-28 ${INSET}`}>
          {/* Jump targets for the hero's Package Index, at the section's top
              so the visitor lands on the heading, not partway down. */}
          {tiers.map((t) => (
            <span key={t.id} id={`tier-${t.id}`} aria-hidden="true" className="sky-anchor absolute top-0" />
          ))}

          <SectionLabel count={`${tiers.length} Packages`}>Packages</SectionLabel>

          <h2 id="packages-heading" className={`${H2} mt-8 max-w-3xl text-text`}>
            <Words text={packages.heading} />
          </h2>

          <div className="mt-12 grid grid-cols-[minmax(0,1fr)] gap-8 lg:mt-16 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start lg:gap-x-12 lg:gap-y-8">
            {/* The chooser */}
            <fieldset className="min-w-0 lg:col-start-1 lg:row-start-1">
              <legend className="sr-only">Choose a package</legend>

              <div className="svk-options -mx-5 flex snap-x snap-mandatory scroll-px-5 gap-2.5 overflow-x-auto px-5 pb-2 sm:-mx-8 sm:scroll-px-8 sm:px-8 lg:mx-0 lg:block lg:overflow-visible lg:px-0 lg:pb-0">
                {tiers.map((t, i) => (
                  <label key={t.id} className="svk-opt snap-start">
                    <input
                      type="radio"
                      name={`${page.slug}-package`}
                      className="sr-only"
                      checked={t.id === selectedId}
                      onChange={() => quote.setTier(page.slug, t.id)}
                    />
                    <span className="flex items-start gap-4">
                      <span aria-hidden="true" className="svk-num mt-[3px] hidden font-mono text-[11px] tracking-[0.18em] lg:block">
                        {pad(i + 1)}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block whitespace-nowrap font-display text-[0.98rem] font-medium leading-snug tracking-[-0.015em] text-text lg:whitespace-normal lg:text-[1.15rem]">
                          {t.name}
                        </span>
                        <span className="mt-1.5 hidden text-[13.5px] leading-relaxed text-text/60 [text-wrap:pretty] lg:block">
                          {t.bestFor}
                        </span>
                      </span>
                      <span className="svk-price shrink-0 self-center whitespace-nowrap font-mono text-[0.9rem] tracking-[0.01em] lg:self-start lg:text-[1rem]">
                        {t.price}
                      </span>
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            {/* Undecided? — after the panel on phones, under the chooser on
                desktop, where the comparison is being made. */}
            <p className="svk-help order-3 flex items-start gap-3 text-[14px] leading-relaxed text-text/70 lg:order-none lg:col-start-1 lg:row-start-2 lg:pl-5">
              <span aria-hidden="true" className="mt-[7px] block h-1.5 w-1.5 shrink-0 rotate-45 bg-cta" />
              <span className="[text-wrap:pretty]">
                Not sure which package fits?{" "}
                <Link
                  href={consultationHref(contactName)}
                  className="font-medium text-primary underline decoration-primary/30 underline-offset-4 transition-colors duration-300 hover:decoration-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
                >
                  Book a free consultation
                </Link>{" "}
                and we&apos;ll recommend one.
              </span>
            </p>

            {/* The chosen package */}
            <div className="min-w-0 lg:sticky lg:top-40 lg:col-start-2 lg:row-span-2 lg:row-start-1">
              <div ref={panelRef} className="svk-panel pkg-panel p-7 text-white sm:p-9">
                <p className="sr-only" aria-live="polite">
                  {`${tier.name}, ${(tier.priceLabel ?? packages.priceLabel).toLowerCase()} ${tier.price}`}
                </p>

                <div className="flex items-center justify-between gap-4">
                  <p className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em] text-white/75">
                    <span aria-hidden="true" className="block h-2 w-2 bg-cta" />
                    Package {pad(index + 1)}
                    <span className="text-white/40">/ {pad(tiers.length)}</span>
                  </p>
                </div>

                <div className="svk-swap mt-8 flex flex-wrap items-end justify-between gap-x-8 gap-y-5">
                  <h3 className="max-w-[16ch] font-display text-[1.75rem] font-semibold leading-[1.08] tracking-[-0.03em] [text-wrap:balance] sm:text-[2.1rem]">
                    {tier.name}
                  </h3>
                  <div className="text-left sm:text-right">
                    <PanelLabel>{tier.priceLabel ?? packages.priceLabel}</PanelLabel>
                    <p className="mt-1 font-mono text-[2.3rem] leading-none tracking-[-0.02em] text-white sm:text-[2.6rem]">
                      {tier.price}
                    </p>
                  </div>
                </div>

                <div className="svk-swap mt-7 border-t border-white/12 pt-6">
                  <PanelLabel>Best For</PanelLabel>
                  <p className="mt-2 text-[15px] leading-relaxed text-white/85 [text-wrap:pretty]">{tier.bestFor}</p>
                </div>

                <div className="svk-swap mt-7">
                  <PanelLabel>{tier.includesLabel ?? "Includes"}</PanelLabel>
                  <ul className="mt-4 grid gap-x-6 gap-y-2.5 sm:grid-cols-2">
                    {tier.includes.map((item) => (
                      <li key={item} className="flex gap-2.5 text-[14px] leading-snug text-white/85">
                        <Check />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {tier.examples && (
                  <div className="svk-swap mt-7">
                    <PanelLabel>Examples</PanelLabel>
                    <ul className="mt-3 flex flex-wrap gap-2">
                      {tier.examples.map((item) => (
                        <li key={item} className="pkg-chip rounded-full px-3 py-1.5 text-[12.5px] text-white/85">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {tier.tech && (
                  <div className="svk-swap mt-7">
                    <PanelLabel>{tier.techLabel ?? "Technology Options"}</PanelLabel>
                    <ul className="mt-3 flex flex-wrap gap-2">
                      {tier.tech.map((item) => (
                        <li key={item} className="rounded-md border border-cta/30 bg-cta/[0.08] px-2.5 py-1 font-mono text-[11.5px] tracking-[0.02em] text-cta">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {tier.audience && (
                  <div className="svk-swap mt-7">
                    <PanelLabel>{tier.audience.label}</PanelLabel>
                    <p className="mt-2 text-[14px] leading-relaxed text-white/75 [text-wrap:pretty]">{tier.audience.text}</p>
                  </div>
                )}

                {tier.note && (
                  <p className="svk-swap mt-6 border-l-2 border-cta/60 pl-3.5 text-[13.5px] font-medium leading-relaxed text-white/85 [text-wrap:pretty]">
                    {tier.note}
                  </p>
                )}

                <div className="svk-swap">
                  <Link
                    href={href}
                    className="group relative isolate mt-9 flex min-h-[56px] items-center justify-between gap-4 overflow-hidden rounded-full bg-white py-2 pl-6 pr-2 text-[13px] font-semibold uppercase tracking-[0.1em] text-navy [transition:scale_140ms_cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cta active:scale-[0.97]"
                  >
                    <span aria-hidden="true" className="absolute inset-0 -z-10 origin-left scale-x-0 bg-cta transition-transform duration-500 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100 group-focus-visible:scale-x-100" />
                    {tier.cta}
                    <span aria-hidden="true" className="flex h-10 w-10 items-center justify-center rounded-full bg-navy/10">
                      <Arrow className="transition-transform duration-500 group-hover:translate-x-0.5" />
                    </span>
                  </Link>

                  <p className="mt-4 text-[13px] leading-relaxed text-white/55">
                    We&apos;ll receive <span className="text-white/80">{tier.name}</span>
                    {addOns.length > 0 && (
                      <>
                        {" "}and your{" "}
                        <a href="#add-ons" className="text-white/80 underline decoration-white/30 underline-offset-4 hover:decoration-white">
                          {addOns.length === 1 ? "add-on" : `${addOns.length} add-ons`}
                        </a>
                      </>
                    )}{" "}
                    with your enquiry.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
