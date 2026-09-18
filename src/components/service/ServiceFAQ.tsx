"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { ScrollTrigger } from "@/lib/gsap";
import type { ServicePage } from "@/lib/service-pages/types";
import { Arrow, FRAME, FrameRules, H2, INSET, SectionLabel, consultationHref, Words } from "./parts";
import { revealHead, useSectionReveal, type RevealBuilder } from "./useSectionReveal";

/* Section 10 — questions.

   The same accordion rows as the Services FAQ (.faq-row, .svc-panel), so an
   answer opens and closes identically everywhere on the site. The layout is
   this page's own: with nine or more questions, the heading holds its place
   on the left while the list scrolls, and carries the one action a visitor
   with a question left over needs — a consultation.

   One answer open at a time, the first open to start. Every answer stays in
   the DOM (and is indexed); closed ones are inert. */

const build: RevealBuilder<HTMLElement> = (tl) => {
  revealHead(tl)
    .fromTo(".svf-aside", { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.7 }, 0.3)
    .fromTo(".faq-row", { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.05 }, 0.3);
};

export default function ServiceFAQ({ page }: { page: ServicePage }) {
  const ref = useSectionReveal(build);
  const [open, setOpen] = useState<number | null>(0);
  const baseId = useId();
  const { faq } = page;

  const toggle = (i: number) => {
    setOpen((current) => (current === i ? null : i));
    // The page's height changes; re-measure once the panel has settled.
    window.setTimeout(() => ScrollTrigger.refresh(), 600);
  };

  return (
    <section
      ref={ref}
      id="faq"
      aria-labelledby="faq-heading"
      className="sky-anchor relative isolate border-b border-accent bg-bg"
    >
      <FrameRules />

      <div className={`relative ${FRAME}`}>
        <div className={`grid grid-cols-[minmax(0,1fr)] gap-12 py-20 sm:py-24 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16 lg:py-28 ${INSET}`}>
          <div className="lg:sticky lg:top-40 lg:self-start">
            <SectionLabel count={`${faq.items.length} Questions`}>FAQ</SectionLabel>
            <h2 id="faq-heading" className={`${H2} mt-8 text-text`}>
              <Words text={faq.heading} />
            </h2>

            <Link
              href={consultationHref(page.contactName)}
              className="svf-aside group relative mt-10 inline-flex items-center gap-3 py-3 font-mono text-[11px] uppercase tracking-[0.2em] text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary sm:text-xs"
            >
              {page.hero.secondaryCta}
              <Arrow className="transition-transform duration-500 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1" />
              <span aria-hidden="true" className="absolute inset-x-0 bottom-1.5 h-px origin-left scale-x-0 bg-primary transition-transform duration-500 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100 group-focus-visible:scale-x-100" />
            </Link>
          </div>

          <ul className="faq-list min-w-0">
            {faq.items.map((item, i) => {
              const panelId = `${baseId}-panel-${i}`;
              const isOpen = open === i;
              return (
                <li key={item.question} className="faq-row">
                  <h3>
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => toggle(i)}
                      className="flex w-full items-start gap-5 py-6 text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary sm:gap-6"
                    >
                      <span aria-hidden="true" className="faq-num mt-[6px] font-mono text-[11px] tracking-[0.18em] text-text/30">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="faq-question min-w-0 flex-1 font-display text-[1.08rem] font-medium leading-snug tracking-[-0.015em] text-text [text-wrap:pretty] sm:text-[1.2rem]">
                        {item.question}
                      </span>
                      <span aria-hidden="true" className="svc-mark relative mt-[6px] block h-[13px] w-[13px] shrink-0 text-primary">
                        <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-current" />
                        <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-current" />
                      </span>
                    </button>
                  </h3>

                  <div id={panelId} className="svc-panel" data-open={isOpen} {...(isOpen ? {} : { inert: true })}>
                    <div>
                      <p className="max-w-2xl pb-7 pl-[calc(1.25rem+3ch)] text-[15px] leading-relaxed text-text/75 [text-wrap:pretty] sm:pl-[calc(1.5rem+3ch)] sm:text-base">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
