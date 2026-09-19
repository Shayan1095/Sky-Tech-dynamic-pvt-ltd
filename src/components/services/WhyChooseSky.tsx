"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { SwipeMeter, useSwipeIndex } from "@/components/shared/SwipeRow";

// Runs before paint on the client so the reveal never flashes its end state.
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/* The site's drafting frame, shared with the rest of the page. */
const FRAME = "mx-4 sm:mx-6 lg:mx-8 xl:mx-auto xl:max-w-6xl";
const INSET = "px-5 sm:px-8 lg:px-12";

/* The six reasons, worded exactly as in src/content/services/main.md. */
const REASONS = [
  {
    title: "Business-Focused Solutions",
    body: "We focus on creating solutions that support real business goals.",
  },
  {
    title: "Technology + Creativity",
    body: "Our services combine technical expertise with creative thinking.",
  },
  {
    title: "Scalable Approach",
    body: "We build solutions that can grow with your business.",
  },
  {
    title: "Transparent Scope",
    body: "We define deliverables, timelines and requirements clearly.",
  },
  {
    title: "Flexible Engagement",
    body: "Choose a one-time project, ongoing support or a customized service package.",
  },
  {
    title: "Long-Term Partnership",
    body: "We aim to support your business beyond a single project.",
  },
] as const;

/* A registration mark at each corner of the plate. Decorative, so the marks
   are drawn rather than made of characters — a "+" glyph would inherit the
   text colour and sit on the baseline. */
function Corner({ at }: { at: "tl" | "tr" | "bl" | "br" }) {
  const place = {
    tl: "-top-[5px] -left-[5px]",
    tr: "-top-[5px] -right-[5px]",
    bl: "-bottom-[5px] -left-[5px]",
    br: "-bottom-[5px] -right-[5px]",
  }[at];

  return (
    <span aria-hidden="true" className={`wc-corner ${place}`}>
      <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-current" />
      <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-current" />
    </span>
  );
}

export default function WhyChooseSky() {
  const sectionRef = useRef<HTMLElement>(null);
  const rowRef = useRef<HTMLUListElement>(null);
  const swipe = useSwipeIndex(rowRef, REASONS.length);

  useIsomorphicLayoutEffect(() => {
    const root = sectionRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: root, start: "top 78%", once: true },
      });
      tl.fromTo(".wc-line", { scaleX: 0, transformOrigin: "left center" }, { scaleX: 1, duration: 0.55 }, 0)
        .fromTo(".wc-eyebrow", { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.55 }, 0.06)
        .fromTo(".wc-heading", { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", duration: 0.85, ease: "power3.inOut" }, 0.12)
        .fromTo(".wc-plate", { opacity: 0, y: 26 }, { opacity: 1, y: 0, duration: 0.85, stagger: 0.08 }, 0.3);
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="why-sky-tech"
      aria-labelledby="why-sky-tech-heading"
      className="sky-anchor relative isolate overflow-x-clip border-b border-accent bg-surface"
    >
      {/* A drafting grid behind the plates, so they read as sheets laid on a
          board rather than boxes floating on a flat ground. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.55] [background-image:linear-gradient(to_right,rgb(18_18_18/0.045)_1px,transparent_1px),linear-gradient(to_bottom,rgb(18_18_18/0.045)_1px,transparent_1px)] [background-size:72px_72px] [mask-image:radial-gradient(120%_80%_at_50%_30%,#000_20%,transparent_78%)]"
      />

      {/* Vertical frame rules */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className={`h-full border-x border-dotted border-text/[0.16] ${FRAME}`} />
      </div>

      <div className={`relative ${FRAME}`}>
        <div className={`py-20 sm:py-24 lg:py-28 ${INSET}`}>
          <p className="flex items-center gap-3">
            <span aria-hidden="true" className="wc-line block h-px w-8 bg-primary" />
            <span className="wc-eyebrow font-mono text-[11px] uppercase tracking-[0.22em] text-primary sm:text-xs">
              04
            </span>
          </p>

          <h2
            id="why-sky-tech-heading"
            className="wc-heading mt-8 max-w-3xl text-[2.2rem] font-semibold leading-[1.04] tracking-[-0.028em] text-text sm:text-[3rem] lg:text-[3.4rem]"
          >
            Why Choose SKY Tech?
          </h2>

          {/* Phones: one plate at a time, swiped (see .swipe-row). */}
          <ul ref={rowRef} className="swipe-row mt-9 grid gap-6 sm:mt-16 sm:grid-cols-2 lg:mt-20 lg:grid-cols-3 lg:gap-7">
            {REASONS.map((reason, i) => (
              <li key={reason.title} className="wc-plate rounded-[22px] p-7 sm:p-8">
                {/* Printed on the sheet and trimmed by its edge. The
                    accessible numbering comes from the row below, so the
                    large numeral is purely graphic. */}
                <span aria-hidden="true" className="wc-clip">
                  <span className="wc-wash" />
                  <span className="wc-ghost">{String(i + 1).padStart(2, "0")}</span>
                </span>

                <Corner at="tl" />
                <Corner at="tr" />
                <Corner at="bl" />
                <Corner at="br" />

                <p className="font-mono text-[11px] tracking-[0.2em] text-primary">
                  {String(i + 1).padStart(2, "0")}
                  <span className="text-text/30"> / 06</span>
                </p>

                <h3 className="mt-14 font-display sm:mt-20 text-[1.25rem] font-medium leading-snug tracking-[-0.02em] text-text [text-wrap:balance] sm:text-[1.35rem]">
                  {reason.title}
                </h3>

                <span aria-hidden="true" className="mt-5 block h-px w-full bg-text/[0.09]" />

                <p className="mt-5 text-[14.5px] leading-relaxed text-text/65 [text-wrap:pretty]">
                  {reason.body}
                </p>
              </li>
            ))}
          </ul>

          <SwipeMeter {...swipe} count={REASONS.length} label="reason" className="mt-3" />
        </div>
      </div>
    </section>
  );
}
