"use client";

import Link from "next/link";
import type { ServicePage } from "@/lib/service-pages/types";
import { Arrow, Cross, FRAME, consultationHref, quoteHref, Words } from "./parts";
import { useSectionReveal, type RevealBuilder } from "./useSectionReveal";

/* Section 12 — closing.

   The site's closing band — the full-bleed primary-to-navy gradient every
   page ends on, the centred register, the signature flood button — carrying
   this service's own close: the question as the kicker, the heading, and the
   content's plain-spoken promise set as the pull-quote.

   Contrast is handled as on the Services close: body copy and the quote sit
   at full white over the blue end of the gradient; translucency appears only
   in the coda, where the ground has resolved to navy. */

const build: RevealBuilder<HTMLElement> = (tl) => {
  tl.fromTo(".svz-rule", { scaleX: 0, transformOrigin: "center" }, { scaleX: 1, duration: 0.6 }, 0)
    .fromTo(".svz-kicker", { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.5 }, 0.08)
    .fromTo(".svz-heading", { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 1 }, 0.16)
    .fromTo(".svz-body", { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.8 }, 0.38)
    .fromTo(".svz-quote-rule", { scaleX: 0, transformOrigin: "center" }, { scaleX: 1, duration: 0.6 }, 0.5)
    .fromTo(".svz-quote", { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.8 }, 0.58)
    .fromTo(".svz-action", { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.7, stagger: 0.08 }, 0.74)
    .fromTo(".svz-coda", { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.7, stagger: 0.07 }, 0.92);
};

export default function ServiceClosing({ page }: { page: ServicePage }) {
  const ref = useSectionReveal(build, "top 75%");
  const { closing, contactName } = page;

  return (
    <section
      ref={ref}
      id="service-closing"
      aria-labelledby="service-closing-heading"
      className="sky-anchor relative isolate overflow-hidden bg-[linear-gradient(to_bottom_in_oklab,var(--color-primary)_0%,var(--color-navy)_100%)] text-white"
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.09] [background-image:linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] [background-size:30px_30px] [mask-image:radial-gradient(120%_70%_at_50%_0%,#000_0%,transparent_75%)]"
      />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className={`h-full border-x border-dotted border-white/20 ${FRAME}`} />
      </div>

      <div className={`relative ${FRAME}`}>
        <div className="flex flex-col items-center px-5 py-24 text-center sm:px-8 sm:py-28 lg:py-32">
          <p className="flex items-center gap-4">
            <span aria-hidden="true" className="svz-rule hidden h-px w-10 bg-cta sm:block" />
            <span className="svz-kicker font-mono text-[11px] uppercase tracking-[0.22em] text-white sm:text-xs">
              {closing.kicker}
            </span>
            <span aria-hidden="true" className="svz-rule hidden h-px w-10 bg-cta sm:block" />
          </p>

          <h2
            id="service-closing-heading"
            className="svz-heading mt-8 max-w-5xl font-display text-[2.1rem] font-semibold leading-[1.04] tracking-[-0.035em] [text-wrap:balance] sm:text-[3.2rem] lg:text-[4rem]"
          >
            <Words text={closing.heading} />
          </h2>

          <p className="svz-body mt-8 max-w-2xl text-base leading-relaxed text-white [text-wrap:pretty] sm:text-lg">
            {closing.body}
          </p>

          <blockquote className="relative mt-12 max-w-2xl">
            <span aria-hidden="true" className="svz-quote-rule mx-auto block h-px w-14 bg-cta" />
            <p className="svz-quote mt-7 font-display text-[1.3rem] font-medium leading-snug tracking-[-0.02em] text-white [text-wrap:balance] sm:text-[1.6rem] lg:text-[1.8rem]">
              {closing.promise}
            </p>
          </blockquote>

          <div className="mt-14 flex flex-col items-stretch gap-4 sm:flex-row sm:items-center sm:gap-5">
            {/* The site's signature CTA, as on the Home, About and Services
                closes: the disc floods the pill, the label swaps to its
                inverse, and the arrow hands over to its twin. */}
            <Link
              href={quoteHref(contactName)}
              className="svz-action group relative isolate flex min-h-[58px] items-center justify-between gap-5 overflow-hidden rounded-full bg-white py-2 pl-7 pr-2 text-[13px] font-semibold uppercase tracking-[0.1em] text-navy shadow-[0_16px_40px_-18px_rgb(0_0_0/0.55)] [transition:box-shadow_400ms_cubic-bezier(0.22,1,0.36,1),scale_140ms_cubic-bezier(0.22,1,0.36,1)] hover:shadow-[0_24px_52px_-20px_rgb(0_0_0/0.65)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white active:scale-[0.97]"
            >
              <span className="relative z-10 block overflow-hidden">
                <span className="block transition-transform delay-[60ms] duration-[420ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-full group-focus-visible:-translate-y-full">
                  {closing.primaryCta}
                </span>
                <span
                  aria-hidden="true"
                  className="absolute inset-0 block translate-y-full text-white transition-transform delay-[60ms] duration-[420ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0 group-focus-visible:translate-y-0"
                >
                  {closing.primaryCta}
                </span>
              </span>

              {/* No z-index on this wrapper: the flood inside it must paint
                  under the label (z-10), or the label vanishes on hover.
                  The waiting arrow is parked at 260% of its width: at 180%
                  its tip still fell inside the disc's circle and showed as a
                  sliver on the left edge (and the leaving one on the right). */}
              <span aria-hidden="true" className="relative h-11 w-11 shrink-0">
                <span className="absolute inset-0 rounded-full bg-navy transition-transform duration-[600ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[14] group-focus-visible:scale-[14]" />
                <span className="absolute inset-0 z-10 flex items-center justify-center overflow-hidden rounded-full text-white">
                  <Arrow className="transition-transform duration-[420ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-[260%] group-focus-visible:translate-x-[260%]" />
                  <Arrow className="absolute -translate-x-[260%] transition-transform delay-[60ms] duration-[420ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0 group-focus-visible:translate-x-0" />
                </span>
              </span>
            </Link>

            <Link
              href={consultationHref(contactName)}
              className="svz-action group flex min-h-[58px] items-center justify-center gap-3 rounded-full border border-white/40 px-7 text-[13px] font-semibold uppercase tracking-[0.1em] text-white [transition:background-color_200ms_cubic-bezier(0.22,1,0.36,1),border-color_200ms_cubic-bezier(0.22,1,0.36,1),scale_140ms_cubic-bezier(0.22,1,0.36,1)] hover:border-white/70 hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white active:scale-[0.97]"
            >
              {closing.secondaryCta}
              <Arrow className="transition-transform duration-200 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>

      {/* Ruled off, then the sign-off every page ends on. */}
      <div aria-hidden="true" className="relative">
        <div className="border-t border-dotted border-white/20" />
        <div className={`relative ${FRAME}`}>
          <Cross tone="light" className="left-0 top-0 -translate-x-1/2 -translate-y-1/2" />
          <Cross tone="light" className="right-0 top-0 -translate-y-1/2 translate-x-1/2" />
        </div>
      </div>

      <div className="relative border-b border-white/[0.14] bg-white/[0.03]">
        <div className={`relative ${FRAME}`}>
          <div className="flex flex-col items-center gap-3 px-5 py-12 text-center sm:px-8 sm:py-14">
            <p className="svz-coda font-display text-[1.05rem] font-medium tracking-[-0.015em] text-white sm:text-[1.2rem]">
              Build Better. Automate Smarter. Grow Faster.
            </p>
            <p className="svz-coda max-w-xl font-mono text-[11px] uppercase leading-relaxed tracking-[0.2em] text-white/70 sm:text-xs">
              SKY Tech — Your Digital Product, Technology &amp; Growth Partner.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
