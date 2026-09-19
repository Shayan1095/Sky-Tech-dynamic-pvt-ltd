"use client";

import { useEffect, useLayoutEffect, useRef, type CSSProperties } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { PILLARS, TOTAL_SERVICES, pillarHref } from "@/lib/pillars";
import { Motif, bleedFor, identityFor } from "@/components/services/pillarIdentity";

// Runs before paint on the client so the reveal never flashes its end state.
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/* The site's drafting frame, shared with the hero. */
const FRAME = "mx-4 sm:mx-6 lg:mx-8 xl:mx-auto xl:max-w-6xl";
const INSET = "px-5 sm:px-8 lg:px-12";

export default function WhatWeDo() {
  const sectionRef = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    const root = sectionRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      /* One pass as the section arrives: the rule draws, the heading
         uncovers itself, then the three tiles rise in turn and their
         contents settle. Nothing here is scrubbed — the pillar sections
         below are long enough without adding scroll length above them. */
      const tl = gsap.timeline({
        scrollTrigger: { trigger: root, start: "top 78%", once: true },
      });

      tl.fromTo(".wwd-line", { scaleX: 0, transformOrigin: "left center" }, { scaleX: 1, duration: 0.55 }, 0)
        .fromTo(".wwd-eyebrow, .wwd-count", { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.55, stagger: 0.06 }, 0.06)
        .fromTo(".wwd-heading-line", { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", duration: 0.85, stagger: 0.1, ease: "power3.inOut" }, 0.15)
        .fromTo(".wwd-intro", { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.1 }, 0.35)
        .fromTo(".wwd-card", { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1.05, stagger: 0.13 }, 0.5)
        .fromTo(".wwd-motif", { opacity: 0, scale: 0.85, transformOrigin: "70% 30%" }, { opacity: 0.18, scale: 1, duration: 1.2, stagger: 0.13 }, 0.62)
        .fromTo(".wwd-card-rule", { scaleX: 0, transformOrigin: "left center" }, { scaleX: 1, duration: 0.7, stagger: 0.13 }, 0.8)
        .fromTo(".wwd-service", { opacity: 0, x: 10 }, { opacity: 1, x: 0, duration: 0.45, stagger: 0.03 }, 0.9);
    }, root);

    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="what-we-do"
      aria-labelledby="what-we-do-heading"
      className="sky-anchor relative isolate overflow-x-clip border-b border-accent bg-bg"
    >
      {/* Vertical frame rules */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className={`h-full border-x border-dotted border-text/[0.16] ${FRAME}`} />
      </div>

      <div className={`relative ${FRAME}`}>
        <div className={`py-20 sm:py-24 lg:py-28 ${INSET}`}>
          {/* Section label and the running count */}
          <div className="flex items-start justify-between gap-6">
            <p className="flex items-center gap-3">
              <span aria-hidden="true" className="wwd-line block h-px w-8 bg-primary" />
              <span className="wwd-eyebrow font-mono text-[11px] uppercase tracking-[0.22em] text-primary sm:text-xs">
                02
              </span>
            </p>
            <span aria-hidden="true" className="wwd-count shrink-0 font-mono text-[11px] uppercase tracking-[0.18em] text-text/45">
              {TOTAL_SERVICES} Services / 3 Pillars
            </span>
          </div>

          {/* The heading carries the weight and the first paragraph reads as
              a lead, with the second stepped down behind it. Before this the
              two paragraphs sat at identical size and colour, which gave the
              page's index no hierarchy of its own. */}
          <div className="mt-10 grid gap-10 lg:mt-12 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] lg:items-start lg:gap-16">
            <div>
              <h2
                id="what-we-do-heading"
                className="text-[2.6rem] font-semibold leading-[0.98] tracking-[-0.035em] text-text sm:text-[3.6rem] lg:text-[4.4rem]"
              >
                <span className="wwd-heading-line block">What We Do</span>
              </h2>

              <span aria-hidden="true" className="wwd-intro mt-8 block h-px w-full max-w-[9rem] bg-primary" />
            </div>

            <div className="max-w-2xl">
              {/* Lead: set in the display face so it reads as a statement
                  rather than as body copy. */}
              <p className="wwd-intro font-display text-[1.2rem] font-medium leading-[1.45] tracking-[-0.015em] text-text [text-wrap:pretty] sm:text-[1.4rem] lg:text-[1.5rem]">
                From websites and software development to digital marketing,
                creative design and event media, our services are designed to
                help you build a{" "}
                <span className="sky-mark">stronger digital presence</span>,
                improve operations and grow with confidence.
              </p>

              {/* Supporting: stepped down in size and weight so the lead is
                  unambiguously first. */}
              <p className="wwd-intro mt-7 max-w-xl text-[15px] leading-relaxed text-text/60 [text-wrap:pretty] sm:text-base">
                Whether you need a new website, a complete digital marketing
                strategy, professional content or ongoing technical support, we
                bring together the technology, creativity and expertise to help
                you move forward.
              </p>
            </div>
          </div>

          {/* The three pillars, each carrying the identity it will wear again
              further down the page. */}
          {/* On phones the tiles become a compact index — number, name and
              how many services — because each pillar follows right below
              with its full list. The list stays in the markup for search. */}
          <ul className="mt-10 grid gap-3 sm:mt-14 sm:grid-cols-2 sm:gap-5 lg:mt-16 lg:grid-cols-3 lg:gap-6">
            {PILLARS.map((pillar) => {
              const identity = identityFor(pillar.index);
              const bleed = bleedFor(identity);
              const style = {
                "--pil-spark": bleed.lead,
                "--pil-spark-2": bleed.support,
                "--pil-label": identity.label,
              } as CSSProperties;

              return (
                <li key={pillar.index} className="wwd-card flex" style={style}>
                  <a
                    href={pillarHref(pillar.anchor)}
                    data-bleed={identity.bleed}
                    className="wwd-tile group flex w-full flex-col rounded-[26px] p-7 text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary max-sm:grid max-sm:grid-cols-[auto_minmax(0,1fr)] max-sm:gap-x-4 max-sm:rounded-[22px] max-sm:px-5 max-sm:py-5 sm:p-8"
                  >
                    <Motif kind={identity.motif} className="wwd-motif" />

                    <div className="flex items-center justify-between gap-4 max-sm:row-span-2 max-sm:items-start max-sm:pt-[7px]">
                      <span
                        aria-hidden="true"
                        className="font-mono text-[11px] tracking-[0.18em]"
                        style={{ color: identity.label }}
                      >
                        {pillar.index}
                      </span>
                      <span aria-hidden="true" className="relative block h-[9px] w-[9px] text-white/30 max-sm:hidden transition-colors duration-500 group-hover:text-white/70">
                        <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-current" />
                        <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-current" />
                      </span>
                    </div>

                    <h3 className="mt-16 font-display text-[1.3rem] font-medium leading-snug tracking-[-0.02em] max-sm:mt-0 max-sm:pr-8 max-sm:text-[1.15rem] sm:text-[1.45rem]">
                      {pillar.name}
                    </h3>

                    <span aria-hidden="true" className="relative mt-6 block h-px bg-white/12 max-sm:hidden">
                      <span className="wwd-card-rule absolute inset-0 bg-white/25" />
                    </span>

                    <ul className="mt-5 space-y-3 max-sm:hidden">
                      {pillar.services.map((service) => (
                        <li key={service.name} className="wwd-service flex items-baseline gap-3 text-[14.5px] leading-snug text-white/80">
                          <span
                            aria-hidden="true"
                            className="mt-[2px] block h-1.5 w-1.5 shrink-0 rotate-45"
                            style={{ backgroundColor: identity.label }}
                          />
                          {service.name}
                        </li>
                      ))}
                    </ul>

                    {/* mt-auto keeps the three actions on one line across tiles
                        that hold five, five and three services. */}
                    <span
                      className="mt-auto flex items-center gap-3 pt-8 font-mono text-[11px] uppercase tracking-[0.2em] text-white/80 transition-colors duration-500 group-hover:text-white max-sm:mt-0 max-sm:pt-2.5"
                    >
                      <span className="sm:hidden">{pillar.services.length} Services</span>
                      <span className="max-sm:hidden">View Services</span>
                      <svg viewBox="0 0 16 16" className="h-[13px] w-[13px] transition-transform duration-500 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1" fill="none" aria-hidden="true">
                        <path d="M3 8h9.5M8.5 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
