"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

const CLOSED = "inset(0 100% 0 0)";
const OPEN = "inset(0 0% 0 0)";

const REASONS = [
  {
    index: "01",
    title: "Business-First Thinking",
    description: "We start with your goals, not just your tech stack.",
  },
  {
    index: "02",
    title: "One Partner, Multiple Capabilities",
    description: "Design, development, and marketing under one roof.",
  },
  {
    index: "03",
    title: "Transparent Communication",
    description: "Clear timelines, clear pricing, no hidden surprises.",
  },
  {
    index: "04",
    title: "Competitive, Honest Pricing",
    description: "High-quality delivery without inflated agency costs.",
  },
  {
    index: "05",
    title: "On-Time Delivery",
    description: "We respect deadlines and treat them as commitments.",
  },
];

export default function WhySkyTech() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = sectionRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      const rows = gsap.utils.toArray<HTMLElement>(".why-row");

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set(".why-line, .why-anchor", { scaleX: 1 });
        gsap.set(".why-rule", { scaleX: 0.1, transformOrigin: "left center" });
        return;
      }

      /* --- Header ------------------------------------------------------- */
      gsap.set(".why-line, .why-anchor", {
        scaleX: 0,
        transformOrigin: "left center",
      });

      const header = gsap.timeline({
        scrollTrigger: { trigger: root, start: "top 78%", once: true },
        onComplete: () =>
          gsap.set(".why-heading-line", { clearProps: "willChange" }),
      });

      header
        .to(".why-line", { scaleX: 1, duration: 0.5 }, 0)
        .fromTo(
          ".why-eyebrow > span:not(.why-line)",
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.5, stagger: 0.06 },
          0.05
        )
        .fromTo(
          ".why-heading-line",
          { clipPath: CLOSED, willChange: "clip-path" },
          { clipPath: OPEN, duration: 0.65, stagger: 0.09 },
          0.14
        )
        .to(".why-anchor", { scaleX: 1, duration: 0.6 }, 0.55);

      /* --- Rows ---------------------------------------------------------
         Each row owns its trigger rather than queueing behind the others, so
         a fast scroll never leaves the list half-played. The divider draws
         across in accent blue, then retracts to a tick at the left — the rule
         itself becomes the marker. */
      rows.forEach((row) => {
        const q = gsap.utils.selector(row);

        gsap
          .timeline({
            scrollTrigger: { trigger: row, start: "top 88%", once: true },
          })
          .fromTo(
            row,
            { opacity: 0, y: 26 },
            { opacity: 1, y: 0, duration: 0.7 },
            0
          )
          .fromTo(
            q(".why-rule"),
            { scaleX: 0, transformOrigin: "left center" },
            { scaleX: 1, duration: 0.55 },
            0.05
          )
          .to(q(".why-rule"), { scaleX: 0.1, duration: 0.5 }, 0.72);
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="why-heading"
      className="relative overflow-hidden bg-navy px-4 py-28 sm:px-6 sm:py-36 lg:px-8"
    >
      {/* A single soft wash so the navy reads as lit rather than flat */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_75%_at_12%_0%,rgb(0_194_255/0.09),transparent_62%)]"
      />

      <div className="relative mx-auto max-w-6xl lg:grid lg:grid-cols-[minmax(0,0.86fr)_minmax(0,1.14fr)] lg:gap-16 xl:gap-24">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <p className="why-eyebrow flex items-center gap-4">
            <span
              aria-hidden="true"
              className="why-line block h-px w-10 bg-cta"
            />
            <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-cta">
              Why SKY Tech
            </span>
            <span className="font-mono text-[11px] tracking-[0.18em] text-bg/35">
              / 05
            </span>
          </p>

          <h2
            id="why-heading"
            className="mt-7 text-[2rem] font-medium leading-[1.1] tracking-tight text-bg sm:text-[2.5rem] lg:text-[2.9rem]"
          >
            <span className="why-heading-line block">Why Businesses</span>
            <span className="why-heading-line block">
              Choose <span className="text-cta">SKY Tech</span>
            </span>
          </h2>

          <span
            aria-hidden="true"
            className="why-anchor mt-9 block h-px w-28 bg-bg/25"
          />
        </div>

        <ol className="mt-14 border-b border-bg/12 lg:mt-1">
          {REASONS.map((reason) => (
            <li
              key={reason.index}
              className="why-row group relative py-7 sm:py-8"
            >
              <span
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-px bg-bg/12"
              />
              <span
                aria-hidden="true"
                className="why-rule absolute inset-x-0 top-0 h-px origin-left bg-cta"
              />

              <div className="flex gap-5 transition-transform duration-500 ease-out group-hover:translate-x-2 sm:gap-7">
                <span className="mt-[7px] shrink-0 font-mono text-[11px] tracking-[0.18em] text-cta/70 transition-colors duration-500 group-hover:text-cta">
                  {reason.index}
                </span>

                <div className="min-w-0">
                  <h3 className="font-display text-[1.3rem] font-medium leading-snug tracking-tight text-bg sm:text-[1.45rem]">
                    {reason.title}
                  </h3>
                  <p className="mt-2 max-w-md text-[0.95rem] leading-relaxed text-bg/70 transition-colors duration-500 group-hover:text-bg/85 sm:text-base">
                    {reason.description}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
