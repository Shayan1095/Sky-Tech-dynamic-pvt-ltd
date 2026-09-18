"use client";

import type { ServicePage } from "@/lib/service-pages/types";
import { Arrow, FRAME, FrameRules, H2, INSET, Words } from "./parts";
import { quote } from "./quoteStore";
import { revealHead, useSectionReveal, type RevealBuilder } from "./useSectionReveal";

/* Section 03 — what we build.

   Set as a ruled specification sheet, not a card grid: each entry is one
   thing the service delivers, its name set large and what it is beneath. Two
   columns, so a visitor checking "do they build my kind of site?" scans the
   names down two short columns instead of one long one — the section is the
   page's quietest, and should not be its longest.

   Each entry ends in its next step. A visitor thinks "I need a booking
   system", not "I need package four", so every build type names the package
   that delivers it — or the add-on, where it's sold as one — with its
   starting price. Following it selects that package (or ticks that add-on)
   and takes the visitor there, so the page answers "what will this cost?"
   from wherever the question comes up. */

const build: RevealBuilder<HTMLElement> = (tl) => {
  revealHead(tl)
    .fromTo(".svo-link", { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.6 }, 0.3)
    .fromTo(".svo-rule", { scaleX: 0, transformOrigin: "left center" }, { scaleX: 1, duration: 0.8, stagger: 0.05, ease: "power3.inOut" }, 0.3)
    .fromTo(".svo-row", { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.05 }, 0.4);
};

export default function ServiceOfferings({ page }: { page: ServicePage }) {
  const ref = useSectionReveal(build);
  const { offerings, packages, addOns, slug } = page;
  const firstTier = packages.tiers[0].id;

  return (
    <section
      ref={ref}
      id="what-we-build"
      aria-labelledby="offerings-heading"
      className="sky-anchor relative isolate overflow-x-clip border-b border-accent bg-surface"
    >
      <FrameRules />

      <div className={`relative ${FRAME}`}>
        <div className={`py-20 sm:py-24 lg:py-28 ${INSET}`}>
          <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-6">
            <h2 id="offerings-heading" className={`${H2} text-text`}>
              <Words text={offerings.heading} />
            </h2>

            <a
              href="#packages"
              className="svo-link group relative inline-flex items-center gap-3 py-3 font-mono text-[11px] uppercase tracking-[0.2em] text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary sm:text-xs"
            >
              Compare Packages
              <Arrow className="rotate-90 transition-transform duration-500 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0.5" />
              <span aria-hidden="true" className="absolute inset-x-0 bottom-1.5 h-px origin-left scale-x-0 bg-primary transition-transform duration-500 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100 group-focus-visible:scale-x-100" />
            </a>
          </div>

          <ul className="mt-14 grid border-b border-text/10 md:grid-cols-2 md:gap-x-12 lg:mt-16 lg:gap-x-16">
            {offerings.items.map((item) => (
              <li
                key={item.title}
                className="svo-row relative flex flex-col gap-2 py-5 sm:gap-2.5 sm:py-8"
              >
                <span aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-text/10">
                  <span className="svo-rule absolute left-0 top-0 block h-px w-16 bg-primary" />
                </span>

                <h3 className="font-display text-[1.3rem] font-medium leading-snug tracking-[-0.02em] text-text [text-wrap:balance] sm:text-[1.5rem]">
                  <Words text={item.title} />
                </h3>
                <p className="max-w-md text-[15px] leading-relaxed text-text/70 [text-wrap:pretty]">
                  {item.body}
                </p>

                {(() => {
                  const fit = item.fit;
                  if (!fit) return null;
                  const tier = "tier" in fit ? packages.tiers.find((t) => t.id === fit.tier) : undefined;
                  const addOn = "addOn" in fit ? addOns?.items.find((a) => a.name === fit.addOn) : undefined;
                  if (!tier && !addOn) return null;
                  return (
                    <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
                      <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-text/45">
                        {tier ? "Suggested package" : "Available as an add-on"}
                      </span>
                      <a
                        href={tier ? "#packages" : "#add-ons"}
                        onClick={() =>
                          tier ? quote.setTier(slug, tier.id) : addOn && quote.addAddOn(slug, firstTier, addOn.name)
                        }
                        className="svo-fit group inline-flex items-center gap-2 py-1.5 font-display text-[14px] font-medium tracking-[-0.01em] text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
                      >
                        <span className="underline decoration-primary/25 underline-offset-4 transition-colors duration-300 group-hover:decoration-primary">
                          {tier ? tier.name : addOn?.name}
                        </span>
                        <span className="font-mono text-[12.5px] text-text/55">{tier ? tier.price : addOn?.price}</span>
                        <Arrow className="h-3 w-3 rotate-90 transition-transform duration-300 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0.5" />
                      </a>
                    </p>
                  );
                })()}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
