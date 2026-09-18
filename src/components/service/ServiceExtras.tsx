"use client";

import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { addOnId } from "@/lib/service-pages/addons";
import { money } from "@/lib/service-pages/quote";
import type { ServicePage } from "@/lib/service-pages/types";
import { Arrow, FRAME, FrameRules, H2, INSET, SectionLabel, Words } from "./parts";
import { quote } from "./quoteStore";
import { revealHead, useSectionReveal, type RevealBuilder } from "./useSectionReveal";
import { useServiceQuote } from "./useServiceQuote";

const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

/* Section 06 — the quote builder.

   The add-ons used to be a price list a visitor read and moved past. Here
   they are a checklist beside a live estimate: the package chosen above,
   plus whatever is ticked, totalled as the visitor goes — and one action
   that carries the whole selection into the contact form.

   Honest by construction. Every figure is a content "starting from" price,
   and the estimate keeps apart what the content keeps apart: a minimum
   ("$2,500+") stays a minimum, a monthly price is shown per month, and a
   "Custom Quote" item is listed as quoted separately rather than counted as
   nothing. The panel says plainly that it is an estimate.

   The technology the page builds with follows as its own navy section
   (ServiceTechnology). */

const build: RevealBuilder<HTMLElement> = (tl) => {
  revealHead(tl)
    .fromTo(".svx-intro", { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.7 }, 0.25)
    .fromTo(".svx-opt", { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.04 }, 0.3)
    .fromTo(".svx-estimate", { opacity: 0, y: 26 }, { opacity: 1, y: 0, duration: 0.9 }, 0.4);
};

function Tick() {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" className="h-3 w-3" fill="none">
      <path d="M3.5 8.5l3 3 6-7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* The estimate figure counts to its new value rather than jumping, so the
   visitor sees the ticked add-on land in the total. React renders the first
   value only; every later value is written here, so the two never fight. */
function Figure({ value, open }: { value: number; open: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);
  const shown = useRef(value);
  const [first] = useState(() => money(value) + (open ? "+" : ""));

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const suffix = open ? "+" : "";
    if (shown.current === value || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      shown.current = value;
      el.textContent = money(value) + suffix;
      return;
    }
    const counter = { v: shown.current };
    shown.current = value;
    const tween = gsap.to(counter, {
      v: value,
      duration: 0.45,
      ease: "power3.out",
      onUpdate: () => {
        el.textContent = money(Math.round(counter.v)) + suffix;
      },
    });
    return () => {
      tween.kill();
    };
  }, [value, open]);

  return (
    <span ref={ref} suppressHydrationWarning>
      {first}
    </span>
  );
}

export default function ServiceExtras({ page }: { page: ServicePage }) {
  const ref = useSectionReveal(build);
  const { addOns, slug, packages } = page;
  const firstTier = packages.tiers[0].id;
  const { tier, addOns: chosen, selected, estimate, href } = useServiceQuote(page);

  /* A shared link to #addon-<id> arrives with that add-on ticked. */
  useEffect(() => {
    if (!addOns) return;
    const apply = () => {
      const match = addOns.items.find((a) => window.location.hash === `#addon-${addOnId(a.name)}`);
      if (match) quote.addAddOn(slug, firstTier, match.name);
    };
    apply();
    window.addEventListener("hashchange", apply);
    return () => window.removeEventListener("hashchange", apply);
  }, [addOns, slug, firstTier]);

  if (!addOns) return null;

  return (
    <section
      ref={ref}
      id="add-ons"
      aria-labelledby="add-ons-heading"
      className="sky-anchor relative isolate overflow-x-clip border-b border-accent bg-bg"
    >
      <FrameRules />

      <div className={`relative ${FRAME}`}>
        <div className={`py-20 sm:py-24 lg:py-28 ${INSET}`}>
          {addOns && (
            <>
              <SectionLabel count={`${addOns.items.length} Add-ons`}>Build Your Quote</SectionLabel>

              <h2 id="add-ons-heading" className={`${H2} mt-8 max-w-3xl text-text`}>
                <Words text={addOns.heading} />
              </h2>
              <p className="svx-intro mt-6 max-w-xl text-base leading-relaxed text-text/70 [text-wrap:pretty] sm:text-lg">
                {addOns.intro}
              </p>

              <div className="mt-12 grid grid-cols-[minmax(0,1fr)] gap-10 lg:mt-14 lg:grid-cols-[minmax(0,1.12fr)_minmax(0,0.88fr)] lg:items-start lg:gap-14">
                {/* The checklist */}
                <fieldset className="min-w-0">
                  <legend className="sr-only">Choose add-ons for your quote</legend>

                  <div aria-hidden="true" className="flex items-end justify-between border-b border-text/15 pb-3 font-mono text-[10.5px] uppercase tracking-[0.2em] text-text/50">
                    <span>{addOns.columns[0]}</span>
                    <span>{addOns.columns[1]}</span>
                  </div>

                  <ul>
                    {addOns.items.map((item) => {
                      const checked = selected.includes(item.name);
                      const quoted = !/\d/.test(item.price);
                      return (
                        <li key={item.name} id={`addon-${addOnId(item.name)}`} className="sky-anchor">
                          <label className="svx-opt group flex cursor-pointer items-center gap-4 border-b border-text/[0.08] py-3.5 pl-1 pr-1 sm:pl-2">
                            <input
                              type="checkbox"
                              className="peer sr-only"
                              checked={checked}
                              onChange={() => quote.toggleAddOn(slug, firstTier, item.name)}
                            />
                            <span aria-hidden="true" className="svx-box flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[5px] border border-text/25 bg-bg text-white">
                              <Tick />
                            </span>
                            <span className="svx-leader flex min-w-0 flex-1 items-baseline gap-3 text-[15px] text-text">
                              <span className="min-w-0">{item.name}</span>
                            </span>
                            <span
                              className={`shrink-0 whitespace-nowrap font-mono text-[13.5px] tracking-[0.01em] ${
                                quoted ? "text-text/50" : "text-primary"
                              }`}
                            >
                              {item.price}
                            </span>
                          </label>
                        </li>
                      );
                    })}
                  </ul>
                </fieldset>

                {/* The estimate */}
                <div className="min-w-0 lg:sticky lg:top-40">
                  <div className="svx-estimate relative overflow-hidden rounded-[26px] border border-text/10 bg-surface p-7 shadow-[0_1px_2px_rgb(18_18_18/0.04),0_30px_60px_-40px_rgb(11_31_53/0.35)] sm:p-8">
                    <p className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em] text-primary">
                      <span aria-hidden="true" className="block h-2 w-2 bg-cta" />
                      Your Estimate
                    </p>

                    <dl className="mt-6 text-[14px]">
                      <div className="flex items-baseline justify-between gap-4 border-b border-text/10 pb-4">
                        <dt className="min-w-0">
                          <span className="block font-mono text-[10px] uppercase tracking-[0.18em] text-text/45">Package</span>
                          <span className="mt-1 block font-display text-[1.05rem] font-medium tracking-[-0.01em] text-text">
                            {tier.name}
                          </span>
                          <a
                            href="#packages"
                            className="mt-1 inline-block py-1 font-mono text-[10.5px] uppercase tracking-[0.18em] text-primary underline decoration-primary/30 underline-offset-4 hover:decoration-primary"
                          >
                            Change
                          </a>
                        </dt>
                        <dd className="shrink-0 font-mono text-[14px] text-text">{tier.price}</dd>
                      </div>

                      {chosen.length === 0 ? (
                        <div className="py-4">
                          <dt className="sr-only">Add-ons</dt>
                          <dd className="text-[13.5px] text-text/50">No add-ons selected yet.</dd>
                        </div>
                      ) : (
                        chosen.map((a) => (
                          <div key={a.name} className="flex items-baseline justify-between gap-4 border-b border-text/[0.07] py-2.5">
                            <dt className="min-w-0 text-text/80">{a.name}</dt>
                            <dd className={`shrink-0 font-mono text-[13px] ${/\d/.test(a.price) ? "text-text" : "text-text/50"}`}>{a.price}</dd>
                          </div>
                        ))
                      )}
                    </dl>

                    <div className="mt-6">
                      <p className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-text/50">Estimated From</p>
                      <p aria-live="polite" className="mt-1.5 font-mono text-[2.6rem] leading-none tracking-[-0.03em] text-text sm:text-[2.9rem]">
                        <Figure value={estimate.from} open={estimate.open} />
                      </p>
                      {(estimate.monthly > 0 || estimate.custom.length > 0) && (
                        <ul className="mt-3 space-y-1 text-[13px] leading-relaxed text-text/65">
                          {estimate.monthly > 0 && (
                            <li>
                              + <span className="font-mono text-primary">{money(estimate.monthly)}/month</span> ongoing
                            </li>
                          )}
                          {estimate.custom.length > 0 && (
                            <li>
                              + {estimate.custom.length === 1 ? estimate.custom[0] : `${estimate.custom.length} items`}, quoted after review
                            </li>
                          )}
                        </ul>
                      )}
                    </div>

                    <Link
                      href={href}
                      className="group relative isolate mt-7 flex min-h-[56px] items-center justify-between gap-4 overflow-hidden rounded-full bg-primary py-2 pl-6 pr-2 text-[13px] font-semibold uppercase tracking-[0.1em] text-white [transition:scale_140ms_cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary active:scale-[0.97]"
                    >
                      <span aria-hidden="true" className="absolute inset-0 -z-10 origin-left scale-x-0 bg-navy transition-transform duration-500 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100 group-focus-visible:scale-x-100" />
                      Request This Quote
                      <span aria-hidden="true" className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15">
                        <Arrow className="transition-transform duration-500 group-hover:translate-x-0.5" />
                      </span>
                    </Link>

                    <p className="mt-4 text-[12.5px] leading-relaxed text-text/55 [text-wrap:pretty]">
                      An estimate from starting prices, not a final quote. We confirm pricing once we&apos;ve reviewed your requirements.
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}

        </div>
      </div>
    </section>
  );
}
