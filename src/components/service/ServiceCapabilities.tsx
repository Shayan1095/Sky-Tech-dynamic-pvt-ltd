"use client";

import Link from "next/link";
import type { ServicePage } from "@/lib/service-pages/types";
import { Arrow, FRAME, FrameRules, INSET, Rich, quoteHref, Words } from "./parts";
import { useSectionReveal, type RevealBuilder } from "./useSectionReveal";

/* Section 05 — beyond the packages.

   The page's one navy band, and a deliberate change of scale: this is the
   offer for buyers whose project doesn't fit a package, so it is set apart
   from everything around it.

   The list of what the solution can include is drawn as a system board —
   each module a cell on a shared grid, with a node that powers on as the
   board arrives. The grid lines are the cells' own shared borders, so the
   board reads as one connected platform rather than a list of features.

   Services with one or two of these offers render each as a band. The
   services with many (Digital Marketing, Google Ads, Meta Ads…) will get a
   ledger variant when their pages are built; the data shape is the same. */

const build: RevealBuilder<HTMLElement> = (tl) => {
  tl.fromTo(".svc2-head > *", { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.08 }, 0)
    .fromTo(".svc2-heading", { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", duration: 0.9, ease: "power3.inOut" }, 0.1)
    .fromTo(".svc2-cell", { opacity: 0 }, { opacity: 1, duration: 0.5, stagger: { each: 0.045, grid: "auto", from: "start" } }, 0.35)
    .fromTo(".svc2-node", { scale: 0.4, backgroundColor: "rgba(255,255,255,0.2)" }, { scale: 1, backgroundColor: "#00c2ff", duration: 0.45, stagger: 0.045, ease: "power3.out" }, 0.5);
};

export default function ServiceCapabilities({ page }: { page: ServicePage }) {
  const ref = useSectionReveal(build, "top 72%");
  const caps = page.capabilities;
  if (!caps?.length) return null;

  return (
    <section
      ref={ref}
      aria-labelledby={`${caps[0].id}-heading`}
      className="relative isolate overflow-hidden bg-navy text-white"
    >
      {/* Light enters from the top-left corner, the same bleed the pillar
          panels on the Services page carry. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 [background-image:radial-gradient(90%_70%_at_0%_0%,rgb(0_107_184/0.55),transparent_62%),radial-gradient(60%_60%_at_100%_100%,rgb(0_194_255/0.12),transparent_60%)]"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.08] [background-image:linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] [background-size:32px_32px] [mask-image:radial-gradient(110%_80%_at_0%_0%,#000_0%,transparent_72%)]"
      />
      <FrameRules tone="light" />

      {caps.map((cap, i) => (
        <div key={cap.id} id={cap.id} className={`sky-anchor relative ${FRAME} ${i > 0 ? "border-t border-dotted border-white/20" : ""}`}>
          <div
            className={`grid grid-cols-[minmax(0,1fr)] gap-10 py-20 sm:gap-12 sm:py-24 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:gap-16 lg:py-28 ${INSET}`}
          >
            {/* The offer */}
            <div className="svc2-head lg:sticky lg:top-40 lg:self-start">
              <h2
                id={`${cap.id}-heading`}
                className="svc2-heading font-display text-[2.1rem] font-semibold leading-[1.05] tracking-[-0.03em] [text-wrap:balance] sm:text-[2.6rem] lg:text-[2.75rem]"
              >
                <Words text={cap.title} />
              </h2>

              {cap.body.map((paragraph, p) => (
                <p key={p} className="mt-6 max-w-lg text-base leading-relaxed text-white/80 [text-wrap:pretty] sm:text-lg">
                  <Rich text={paragraph} markClass="text-cta" />
                </p>
              ))}

              {cap.price && (
                <div className="mt-10 border-t border-white/15 pt-7">
                  {cap.priceLabel && (
                    <p className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-white/55">{cap.priceLabel}</p>
                  )}
                  <p className="mt-2 font-mono text-[2.6rem] leading-none tracking-[-0.02em] text-white sm:text-[3rem]">
                    {cap.price}
                  </p>
                  {cap.priceNote && (
                    <p className="mt-4 max-w-md text-[14px] leading-relaxed text-white/70 [text-wrap:pretty]">{cap.priceNote}</p>
                  )}
                </div>
              )}

              <Link
                href={quoteHref(page.contactName)}
                className="group relative isolate mt-10 inline-flex min-h-[56px] items-center justify-between gap-5 overflow-hidden rounded-full bg-white py-2 pl-6 pr-2 text-[13px] font-semibold uppercase tracking-[0.1em] text-navy [transition:scale_140ms_cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cta active:scale-[0.97]"
              >
                <span aria-hidden="true" className="absolute inset-0 -z-10 origin-left scale-x-0 bg-cta transition-transform duration-500 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100 group-focus-visible:scale-x-100" />
                {cap.cta}
                <span aria-hidden="true" className="flex h-10 w-10 items-center justify-center rounded-full bg-navy/10">
                  <Arrow className="transition-transform duration-500 group-hover:translate-x-0.5" />
                </span>
              </Link>
            </div>

            {/* The system board */}
            <div>
              <p className="svc2-head flex items-center gap-3">
                <span aria-hidden="true" className="block h-px w-8 bg-cta" />
                <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-cta sm:text-xs">{cap.listLabel}</span>
              </p>

              <ul className="svc2-board mt-7 grid grid-cols-2 sm:grid-cols-3">
                {cap.list.map((item) => (
                  <li key={item} className="svc2-cell flex min-h-[84px] flex-col justify-between gap-3 p-4 sm:min-h-[118px] sm:gap-4 sm:p-5">
                    <span aria-hidden="true" className="svc2-node block h-2 w-2 bg-cta" />
                    <span className="text-[14px] font-medium leading-snug text-white [text-wrap:balance] sm:text-[15px]">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}
