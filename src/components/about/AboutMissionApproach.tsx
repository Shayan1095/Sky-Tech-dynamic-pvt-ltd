"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

// Runs before paint on the client so the reveal never flashes its end state.
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

const CLOSED = "inset(0 100% 0 0)";
const OPEN = "inset(0 0% 0 0)";

/* Shares the page's drafting frame, so the dotted rules run on unbroken from
   the hero and Our Story. */
const FRAME = "mx-4 sm:mx-6 lg:mx-8 xl:mx-auto xl:max-w-6xl";
const INSET = "px-5 sm:px-8 lg:px-12";

/* Mission: "turn technology into measurable growth" — a single rising line
   with three checkpoints, drawn once. Decorative. */
const GROWTH =
  "M4 98 C 70 95, 118 88, 176 82 S 276 68, 336 58 S 442 34, 512 24 S 566 14, 592 11";
const CHECKPOINTS: Array<[number, number]> = [
  [176, 82],
  [336, 58],
  [512, 24],
];

/* Approach, in the order the paragraph describes it. */
const STEPS = ["Goals", "Success", "Strategy"];

export default function AboutMissionApproach() {
  const sectionRef = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    const root = sectionRef.current;
    if (!root) return;
    // Markup is authored in its finished state, so reduced motion simply
    // shows both cards complete.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      // A paused timeline played by its own one-shot trigger, so a later
      // ScrollTrigger.refresh() elsewhere on the page can never rewind it.
      const tl = gsap.timeline({ paused: true });

      tl.fromTo(
        ".ma-line",
        { scaleX: 0, transformOrigin: "left center" },
        { scaleX: 1, duration: 0.6, ease: "power3.out" },
        0
      )
        .fromTo(
          ".ma-eyebrow",
          { opacity: 0, y: 8 },
          { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
          0.06
        )
        // The two cards rise in, the wider Mission card first.
        .fromTo(
          ".ma-card",
          { opacity: 0, y: 48 },
          { opacity: 1, y: 0, duration: 1.15, stagger: 0.14, ease: "power3.out" },
          0.1
        )
        .fromTo(
          ".ma-label",
          { opacity: 0, y: 8 },
          { opacity: 1, y: 0, duration: 0.6, stagger: 0.14, ease: "power3.out" },
          0.4
        )
        .fromTo(
          ".ma-statement",
          { clipPath: CLOSED },
          { clipPath: OPEN, duration: 1.1, ease: "power3.inOut" },
          0.5
        )
        .fromTo(
          ".ma-approach-copy > *",
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: 0.8, stagger: 0.08, ease: "power3.out" },
          0.6
        )
        .fromTo(
          ".ma-rule",
          { scaleX: 0, transformOrigin: "left center" },
          { scaleX: 1, duration: 1, ease: "power3.inOut" },
          0.55
        )
        // Mission: the growth line draws, checkpoints land along it.
        .fromTo(
          ".ma-growth",
          { drawSVG: "0%" },
          { drawSVG: "100%", duration: 1.6, ease: "power2.inOut" },
          1
        )
        .fromTo(
          ".ma-checkpoint",
          { scale: 0, transformOrigin: "center" },
          { scale: 1, duration: 0.45, stagger: 0.3, ease: "power3.out" },
          1.35
        )
        .fromTo(
          ".ma-end",
          { scale: 0, opacity: 0, transformOrigin: "center" },
          { scale: 1, opacity: 1, duration: 0.6, ease: "power3.out" },
          2.4
        )
        .fromTo(
          ".ma-mark",
          { backgroundSize: "0% 2px" },
          { backgroundSize: "100% 2px", duration: 0.8, ease: "power2.inOut" },
          1.5
        )
        // Approach: the three steps connect in order.
        .fromTo(
          ".ma-node",
          { scale: 0, transformOrigin: "center" },
          { scale: 1, duration: 0.45, stagger: 0.3, ease: "power3.out" },
          1.2
        )
        .fromTo(
          ".ma-seg",
          { scaleX: 0, transformOrigin: "left center" },
          { scaleX: 1, duration: 0.35, stagger: 0.3, ease: "power2.inOut" },
          1.4
        )
        .fromTo(
          ".ma-step-label",
          { opacity: 0, y: 6 },
          { opacity: 1, y: 0, duration: 0.5, stagger: 0.3, ease: "power3.out" },
          1.25
        );

      ScrollTrigger.create({
        trigger: root,
        start: "top 72%",
        once: true,
        onEnter: () => tl.play(),
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-label="Our Mission and Our Approach"
      className="relative bg-[#f8fafc]"
    >
      {/* Frame rules, continued from the sections above */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div
          className={`h-full border-x border-dotted border-text/[0.16] ${FRAME}`}
        />
      </div>

      <div className={`relative ${FRAME}`}>
        <div className={`py-20 sm:py-24 lg:py-28 ${INSET}`}>
          <p className="ma-eyebrow flex items-center gap-3">
            <span aria-hidden="true" className="ma-line block h-px w-8 bg-primary" />
            <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-primary sm:text-xs">
              02
            </span>
          </p>

          <div className="mt-8 grid gap-5 sm:gap-6 lg:grid-cols-12">
            {/* ------------------------------------------------ Mission */}
            <article
              id="our-mission"
              aria-labelledby="mission-heading"
              className="ma-card scroll-mt-28 lg:col-span-7"
            >
              <div className="relative isolate flex h-full min-h-[420px] flex-col overflow-hidden rounded-[28px] bg-[linear-gradient(140deg_in_oklab,var(--color-primary)_0%,var(--color-navy)_100%)] p-7 text-white shadow-[0_2px_4px_rgb(11_31_53/0.08),0_40px_80px_-40px_rgb(11_31_53/0.55)] sm:p-10">
                {/* Drafting grid, fading out from the top-right corner */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 -z-10 opacity-[0.09] [background-image:linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] [background-size:36px_36px] [mask-image:radial-gradient(120%_90%_at_100%_0%,#000_0%,transparent_70%)]"
                />

                <h2
                  id="mission-heading"
                  className="ma-label flex items-center gap-3 font-mono text-[11px] font-normal uppercase tracking-[0.22em] text-white sm:text-xs"
                >
                  <span aria-hidden="true" className="block h-px w-8 bg-white/60" />
                  Our Mission
                </h2>

                <p className="ma-statement mt-8 max-w-[30ch] font-display text-[1.6rem] font-medium leading-[1.2] tracking-[-0.02em] [text-wrap:pretty] sm:text-[2.1rem] lg:text-[2.2rem]">
                  To help businesses turn technology into{" "}
                  <span className="ma-mark">measurable growth</span> — through
                  websites, software, and marketing that are built around real
                  business outcomes, not just deliverables.
                </p>

                {/* Growth line */}
                <div aria-hidden="true" className="mt-auto pt-10">
                  <svg viewBox="0 0 600 112" className="h-auto w-full overflow-visible" fill="none">
                    <line x1="0" y1="106" x2="600" y2="106" stroke="rgb(255 255 255 / 0.18)" strokeDasharray="2 6" />
                    <path
                      className="ma-growth"
                      d={GROWTH}
                      stroke="rgb(255 255 255 / 0.7)"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                    />
                    {CHECKPOINTS.map(([x, y]) => (
                      <circle
                        key={x}
                        className="ma-checkpoint"
                        cx={x}
                        cy={y}
                        r="4"
                        fill="#0b1f35"
                        stroke="#ffffff"
                        strokeWidth="1.5"
                      />
                    ))}
                    <g className="ma-end">
                      <circle cx="592" cy="11" r="12" fill="#00c2ff" opacity="0.2" />
                      <circle cx="592" cy="11" r="5" fill="#00c2ff" />
                    </g>
                  </svg>
                </div>
              </div>
            </article>

            {/* ----------------------------------------------- Approach */}
            <article
              id="our-approach"
              aria-labelledby="approach-heading-about"
              className="ma-card scroll-mt-28 lg:col-span-5"
            >
              <div className="group relative flex h-full min-h-[420px] flex-col overflow-hidden rounded-[28px] border border-text/[0.08] bg-white p-7 shadow-[0_1px_2px_rgb(18_18_18/0.04),0_24px_48px_-32px_rgb(18_18_18/0.22)] transition-[transform,border-color,box-shadow] duration-500 ease-out hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_2px_6px_rgb(0_107_184/0.08),0_32px_60px_-34px_rgb(0_107_184/0.35)] sm:p-10">
                {/* Top rule */}
                <span aria-hidden="true" className="absolute inset-x-0 top-0 h-[3px] bg-text/[0.06]" />
                <span aria-hidden="true" className="ma-rule absolute left-0 top-0 h-[3px] w-full bg-primary" />

                <h2
                  id="approach-heading-about"
                  className="ma-label flex items-center gap-3 font-mono text-[11px] font-normal uppercase tracking-[0.22em] text-primary sm:text-xs"
                >
                  <span aria-hidden="true" className="block h-px w-8 bg-primary" />
                  Our Approach
                </h2>

                <div className="ma-approach-copy mt-8">
                  <p className="font-display text-[1.35rem] font-medium leading-[1.25] tracking-[-0.015em] text-text sm:text-[1.55rem]">
                    We start with your business goals, not a template.
                  </p>
                  <p className="mt-5 text-[0.98rem] leading-relaxed text-text">
                    Every project — whether it&apos;s a website, a custom
                    application, or a marketing campaign — begins with
                    understanding what success actually looks like for you,
                    then building toward it with the right combination of
                    technology and strategy.
                  </p>
                </div>

                {/* Goals → Success → Strategy */}
                <div aria-hidden="true" className="mt-auto pt-10">
                  <div className="grid grid-cols-3">
                    {STEPS.map((step, i) => (
                      <div key={step} className="relative flex flex-col items-start">
                        {i < STEPS.length - 1 && (
                          <span className="absolute left-[11px] right-0 top-[5px] h-px bg-text/10">
                            <span className="ma-seg absolute inset-0 bg-primary" />
                          </span>
                        )}
                        <span
                          className={`ma-node relative block h-[11px] w-[11px] rounded-full border-[1.5px] border-primary ${
                            i === STEPS.length - 1 ? "bg-primary" : "bg-white"
                          }`}
                        />
                        <span className="ma-step-label mt-3 font-mono text-[10px] uppercase tracking-[0.18em] text-text">
                          {step}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
