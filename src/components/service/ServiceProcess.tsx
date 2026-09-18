"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import type { ServicePage } from "@/lib/service-pages/types";
import { FRAME, FrameRules, H2, INSET, SectionLabel, Words } from "./parts";

const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

const pad = (n: number) => String(n).padStart(2, "0");

/* Section 08 — process. The page's signature moment.

   A build log: the steps run down a rail that fills as the reader scrolls,
   each step's node lighting as the fill reaches it and its text coming up to
   full ink. On desktop the heading holds its place beside the log with a
   large live counter — "03 / 07" — so the reader always knows where they are
   in the build.

   Everything tracks real scroll position (scrubbed, not fired), because the
   point is that the reader is moving through the process.

   Built with sticky positioning and a plain scrubbed tween — no pin, so the
   section adds no scroll length and nothing below it is displaced. Scroll
   updates write to the DOM directly and only when the active step changes;
   React is not re-rendered while scrolling. */
export default function ServiceProcess({ page }: { page: ServicePage }) {
  const sectionRef = useRef<HTMLElement>(null);
  const { process } = page;
  const total = process.steps.length;

  useIsomorphicLayoutEffect(() => {
    const root = sectionRef.current;
    if (!root) return;

    const steps = Array.from(root.querySelectorAll<HTMLElement>(".svs-step"));
    const counter = root.querySelector<HTMLElement>(".svs-count");
    const current = root.querySelector<HTMLElement>(".svs-current");

    const setActive = (index: number) => {
      steps.forEach((step, i) => {
        step.dataset.state = i < index ? "done" : i === index ? "active" : "next";
      });
      if (counter) counter.textContent = pad(index + 1);
      if (current) current.textContent = process.steps[index]?.title ?? "";
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      steps.forEach((step) => (step.dataset.state = "done"));
      return;
    }

    /* Rendered fully inked, so the log reads without JavaScript. Once the
       scroll tracking is live it starts from the first step. */
    setActive(0);

    const ctx = gsap.context(() => {
      gsap
        .timeline({ scrollTrigger: { trigger: root, start: "top 78%", once: true } })
        .fromTo(".sv-line", { scaleX: 0, transformOrigin: "left center" }, { scaleX: 1, duration: 0.55 }, 0)
        .fromTo(".sv-label", { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.55, stagger: 0.06 }, 0.06)
        .fromTo(".sv-heading", { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", duration: 0.85, ease: "power3.inOut" }, 0.12)
        .fromTo(".svs-meter", { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.8 }, 0.3);

      /* The rail fills with the reader's progress through the list. */
      gsap.fromTo(
        ".svs-fill",
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: { trigger: ".svs-list", start: "top 55%", end: "bottom 55%", scrub: 0.4 },
        }
      );

      /* The active step is the last one whose top the reading line (55% down
         the screen) has passed. Worked out from the scroll position on every
         update rather than with a trigger per step: a jump — an anchor link,
         a hard fling on a phone — can carry a step from "not reached" to
         "passed" between two frames, and a per-step trigger never switches
         on, leaving the log stuck on an earlier step. */
      let tops: number[] = [];
      let last = 0;
      const measure = () => {
        tops = steps.map((step) => step.getBoundingClientRect().top + window.scrollY);
      };
      const sync = () => {
        const line = window.scrollY + window.innerHeight * 0.55;
        let index = 0;
        for (let i = 0; i < tops.length; i += 1) if (tops[i] <= line) index = i;
        if (index !== last) {
          last = index;
          setActive(index);
        }
      };
      measure();
      ScrollTrigger.create({
        trigger: ".svs-list",
        start: "top 55%",
        end: "bottom 55%",
        onRefresh: () => {
          measure();
          sync();
        },
        onUpdate: sync,
        onLeave: sync,
        onLeaveBack: () => {
          last = 0;
          setActive(0);
        },
      });
    }, root);

    return () => {
      ctx.revert();
      steps.forEach((step) => (step.dataset.state = "done"));
    };
  }, [process.steps]);

  return (
    <section
      ref={sectionRef}
      id="process"
      aria-labelledby="process-heading"
      className="sky-anchor relative isolate border-b border-accent bg-bg"
    >
      <FrameRules />

      <div className={`relative ${FRAME}`}>
        <div className={`grid grid-cols-[minmax(0,1fr)] gap-14 py-20 sm:py-24 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16 lg:py-32 ${INSET}`}>
          {/* Heading and live counter */}
          <div className="lg:sticky lg:top-40 lg:self-start">
            <SectionLabel count={`${total} Steps`}>Process</SectionLabel>
            <h2 id="process-heading" className={`${H2} mt-8 text-text`}>
              <Words text={process.heading} />
            </h2>

            <div aria-hidden="true" className="svs-meter mt-12 hidden lg:block">
              <p className="flex items-baseline gap-3 font-mono leading-none text-primary">
                <span className="svs-count text-[6.5rem] tracking-[-0.05em] xl:text-[7.5rem]">01</span>
                <span className="text-[1.4rem] tracking-[-0.02em] text-text/30">/ {pad(total)}</span>
              </p>
              <p className="svs-current mt-4 font-display text-[1.25rem] font-medium tracking-[-0.02em] text-text">
                {process.steps[0]?.title}
              </p>
            </div>
          </div>

          {/* The log */}
          <ol className="svs-list relative">
            {/* Rail: a hairline track with the fill running over it. */}
            <span aria-hidden="true" className="absolute bottom-6 left-[15px] top-6 w-px bg-text/12">
              <span className="svs-fill absolute inset-0 block origin-top bg-[linear-gradient(to_bottom,var(--color-primary),var(--color-cta))]" />
            </span>

            {process.steps.map((step, i) => (
              <li key={step.title} className="svs-step relative flex gap-7 pb-12 last:pb-0 sm:gap-9" data-state="done">
                <span aria-hidden="true" className="svs-node relative z-10 mt-1 flex h-[31px] w-[31px] shrink-0 items-center justify-center rounded-full border font-mono text-[10.5px] tracking-[0.04em]">
                  {pad(i + 1)}
                </span>
                <div className="min-w-0 pt-0.5">
                  <h3 className="svs-title font-display text-[1.45rem] font-medium leading-snug tracking-[-0.02em] sm:text-[1.7rem]">
                    <span className="sr-only">Step {i + 1}: </span>
                    {step.title}
                  </h3>
                  <p className="svs-body mt-2.5 max-w-lg text-[15px] leading-relaxed [text-wrap:pretty] sm:text-base">
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
