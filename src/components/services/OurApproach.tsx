"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

// Runs before paint on the client so the reveal never flashes its end state.
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/* The site's drafting frame, shared with the rest of the page. */
const FRAME = "mx-4 sm:mx-6 lg:mx-8 xl:mx-auto xl:max-w-6xl";
const INSET = "px-5 sm:px-8 lg:px-12";

/* The five stages, worded exactly as in src/content/services/main.md. */
const STEPS = [
  {
    index: "01",
    stage: "Understand",
    body: "We begin by understanding your business, audience, goals and challenges.",
  },
  {
    index: "02",
    stage: "Plan",
    body: "We develop a practical strategy and define the right scope for your project.",
  },
  {
    index: "03",
    stage: "Create",
    body: "Our team brings together design, technology and content to build the solution.",
  },
  {
    index: "04",
    stage: "Launch",
    body: "We help you implement, launch or publish your project with attention to quality.",
  },
  {
    index: "05",
    stage: "Optimize",
    body: "We review performance, identify opportunities and support continuous improvement.",
  },
] as const;

export default function OurApproach() {
  const sectionRef = useRef<HTMLElement>(null);
  const railRef = useRef<HTMLOListElement>(null);
  const hTrackRef = useRef<HTMLSpanElement>(null);
  const vTrackRef = useRef<HTMLSpanElement>(null);

  useIsomorphicLayoutEffect(() => {
    const root = sectionRef.current;
    const rail = railRef.current;
    if (!root || !rail) return;

    const steps = Array.from(rail.querySelectorAll<HTMLElement>(".svc-step"));

    /* The track has to start at the first node's centre and stop at the
       last one's. Those positions depend on the column width and the gap,
       so they are measured rather than guessed at in percentages — a guess
       left the line starting a column-width right of stage 01. */
    const layoutTracks = () => {
      const nodes = Array.from(rail.querySelectorAll<HTMLElement>(".svc-node"));
      if (nodes.length < 2) return;
      const railBox = rail.getBoundingClientRect();
      const first = nodes[0].getBoundingClientRect();
      const lastNode = nodes[nodes.length - 1].getBoundingClientRect();

      const h = hTrackRef.current;
      if (h) {
        const x = first.left + first.width / 2 - railBox.left;
        h.style.left = `${x}px`;
        h.style.width = `${lastNode.left + lastNode.width / 2 - railBox.left - x}px`;
        h.style.right = "auto";
        h.style.top = `${first.top + first.height / 2 - railBox.top}px`;
      }

      const v = vTrackRef.current;
      if (v) {
        const y = first.top + first.height / 2 - railBox.top;
        v.style.top = `${y}px`;
        v.style.height = `${lastNode.top + lastNode.height / 2 - railBox.top - y}px`;
        v.style.bottom = "auto";
        v.style.left = `${first.left + first.width / 2 - railBox.left}px`;
      }
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      /* No scrubbing: the route is simply complete. */
      root.style.setProperty("--ap-p", "1");
      steps.forEach((s) => s.classList.add("is-lit"));
      layoutTracks();
      return;
    }

    const ctx = gsap.context(() => {
      /* The header arrives on its own, once. */
      const intro = gsap.timeline({
        scrollTrigger: { trigger: root, start: "top 78%", once: true },
      });
      intro
        .fromTo(".ap-line", { scaleX: 0, transformOrigin: "left center" }, { scaleX: 1, duration: 0.55 }, 0)
        .fromTo(".ap-eyebrow", { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.55 }, 0.06)
        .fromTo(".ap-heading", { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", duration: 0.85, ease: "power3.inOut" }, 0.12)
        .fromTo(".ap-statement", { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.1 }, 0.3)
        .fromTo(".svc-step", { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.09 }, 0.45);

      /* The route itself is scrubbed. Progress is written to a CSS variable
         once per frame — the fill is a transform, so no layout happens — and
         the lit classes are touched only when the count actually changes,
         which keeps the whole thing off React's hands entirely. */
      let lit = -1;

      ScrollTrigger.create({
        trigger: rail,
        start: "top 72%",
        end: "bottom 62%",
        scrub: 0.4,
        invalidateOnRefresh: true,
        onRefresh: layoutTracks,
        onUpdate: (self) => {
          const p = self.progress;
          root.style.setProperty("--ap-p", String(p));

          /* Stage 1 is lit from the start and stage 5 once the line has
             travelled the last leg, so every stage gets its moment. */
          const next = Math.min(STEPS.length, Math.floor(p * STEPS.length) + 1);
          if (next === lit) return;
          lit = next;
          steps.forEach((step, i) => step.classList.toggle("is-lit", i < next));
        },
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="our-approach"
      aria-labelledby="our-approach-heading"
      className="svc-approach sky-anchor relative isolate overflow-x-clip border-b border-accent bg-bg"
    >
      {/* Vertical frame rules */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className={`h-full border-x border-dotted border-text/[0.16] ${FRAME}`} />
      </div>

      <div className={`relative ${FRAME}`}>
        <div className={`py-20 sm:py-24 lg:py-28 ${INSET}`}>
          <p className="flex items-center gap-3">
            <span aria-hidden="true" className="ap-line block h-px w-8 bg-primary" />
            <span className="ap-eyebrow font-mono text-[11px] uppercase tracking-[0.22em] text-primary sm:text-xs">
              03
            </span>
          </p>

          <h2
            id="our-approach-heading"
            className="ap-heading mt-8 text-[2.2rem] font-semibold leading-[1.04] tracking-[-0.028em] text-text sm:text-[3rem] lg:text-[3.4rem]"
          >
            Our Approach
          </h2>

          <p className="ap-statement mt-7 max-w-3xl font-display text-xl font-medium leading-snug tracking-[-0.02em] text-text [text-wrap:balance] sm:text-2xl lg:text-[1.75rem]">
            One Partner. Multiple Capabilities. Better Outcomes.
          </p>

          <p className="ap-statement mt-5 max-w-2xl text-base leading-relaxed text-text/70 [text-wrap:pretty] sm:text-lg">
            We believe digital growth works best when technology, creativity and
            strategy work together.
          </p>

          {/* The route. One rule through five stages — horizontal on desktop,
              vertical on phones, never pinned: a pin here would add scroll
              length and push every section below it out of position. */}
          <ol ref={railRef} className="relative mt-16 grid gap-9 lg:mt-20 lg:grid-cols-5 lg:gap-6">
            {/* Desktop track: spans the first node centre to the last, which
                sit at 10% and 90% of a five-column grid. */}
            <span
              ref={hTrackRef}
              aria-hidden="true"
              className="svc-track hidden h-px lg:block"
            >
              <span className="svc-fill block h-px" />
            </span>

            {/* Phone track: down the left edge, node centre to node centre. */}
            <span
              ref={vTrackRef}
              aria-hidden="true"
              className="svc-track w-px lg:hidden"
            >
              <span className="svc-fill svc-fill--v block h-full w-px" />
            </span>

            {STEPS.map((step) => (
              <li key={step.index} className="svc-step relative grid grid-cols-[auto_minmax(0,1fr)] items-start gap-x-5 lg:block">
                <span className="svc-node lg:mb-7" />

                <div className="lg:contents">
                  <p className="svc-num font-mono text-[11px] tracking-[0.18em] lg:mt-0">
                    {step.index}
                  </p>
                  <h3 className="svc-stage mt-2 font-display text-[1.25rem] font-medium leading-snug tracking-[-0.02em] sm:text-[1.4rem]">
                    {step.stage}
                  </h3>
                  <p className="mt-3 max-w-sm text-[14.5px] leading-relaxed text-text/65 [text-wrap:pretty]">
                    {step.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
