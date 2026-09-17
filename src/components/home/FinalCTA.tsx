"use client";

import Link from "next/link";
import { useEffect, useLayoutEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

// Runs before paint on the client so the reveal never flashes its end state.
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

const CLOSED = "inset(0 100% 0 0)";
const OPEN = "inset(0 0% 0 0)";

const LABEL = "Book a Free Consultation";

const ArrowIcon = ({ className = "" }: { className?: string }) => (
  <svg
    viewBox="0 0 16 16"
    className={`h-[14px] w-[14px] ${className}`}
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M3 8h9.5M8.5 4l4 4-4 4"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function FinalCTA() {
  const sectionRef = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    const root = sectionRef.current;
    if (!root) return;
    // Animate from a visible default: with reduced motion (or no JS) the
    // section simply renders in place.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      // Paused timeline played by its own one-shot trigger, so a later
      // ScrollTrigger.refresh() elsewhere on the page can never rewind it.
      const tl = gsap.timeline({
        paused: true,
        onComplete: () =>
          gsap.set(".cta-heading-line", { clearProps: "willChange" }),
      });

      tl.fromTo(
        ".cta-line",
        { scaleX: 0, transformOrigin: "left center" },
        { scaleX: 1, duration: 0.5 },
        0
      )
        .fromTo(
          ".cta-eyebrow-text",
          { opacity: 0, y: 8 },
          { opacity: 1, y: 0, duration: 0.45 },
          0.05
        )
        .fromTo(
          ".cta-heading-line",
          { clipPath: CLOSED, willChange: "clip-path" },
          { clipPath: OPEN, duration: 0.7, stagger: 0.09 },
          0.12
        )
        .fromTo(
          ".cta-body",
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.6 },
          0.45
        )
        .fromTo(
          ".cta-action",
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.55 },
          0.58
        );

      ScrollTrigger.create({
        trigger: root,
        start: "top 80%",
        once: true,
        onEnter: () => tl.play(),
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="cta-heading"
      /* Exact brand blue at the top, resolving to the footer's navy at the
         bottom so the section flows into the footer without a seam. */
      className="relative isolate overflow-hidden bg-[linear-gradient(to_bottom_in_oklab,var(--color-primary)_0%,var(--color-navy)_100%)] px-4 py-24 sm:px-6 sm:py-32 lg:px-8"
    >
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:items-end lg:gap-16">
        <div>
          <p className="flex items-center gap-4">
            <span
              aria-hidden="true"
              className="cta-line block h-px w-10 bg-bg/70"
            />
            <span className="cta-eyebrow-text font-mono text-[11px] uppercase tracking-[0.22em] text-bg sm:text-xs">
              Let&apos;s Talk
            </span>
          </p>

          <h2
            id="cta-heading"
            className="mt-7 text-[2.1rem] font-medium leading-[1.08] tracking-tight text-bg sm:text-[2.7rem] lg:text-[3.15rem]"
          >
            <span className="cta-heading-line block">
              Have a Project in Mind?
            </span>
            <span className="cta-heading-line block">Let&apos;s Talk.</span>
          </h2>
        </div>

        <div className="lg:pb-2">
          <p className="cta-body max-w-md text-base leading-relaxed text-bg/90 sm:text-lg">
            Tell us what you&apos;re trying to achieve — we&apos;ll help you
            figure out the best way to get there. No obligation, no hard sell,
            just a conversation about your goals.
          </p>

          <div className="cta-action mt-8">
            {/* The brand-blue dot behind the arrow floods the whole pill on
                hover or keyboard focus, the label rolls to white, and the
                arrow is swapped for a fresh one. Pure CSS; Tailwind's hover
                variant only applies on devices that can hover, so touch
                screens never get a stuck state — they get the press. */}
            <Link
              href="/contact"
              className="group relative isolate inline-flex min-h-[56px] items-center gap-4 overflow-hidden rounded-full bg-bg py-2 pl-7 pr-2 text-sm font-semibold uppercase tracking-[0.08em] text-text shadow-[0_10px_28px_-14px_rgb(0_0_0/0.55)] ring-1 ring-transparent [transition:box-shadow_500ms_ease-out,transform_500ms_ease-out,scale_140ms_cubic-bezier(0.22,1,0.36,1)] hover:shadow-[0_18px_40px_-16px_rgb(0_0_0/0.65)] hover:ring-bg/45 focus-visible:ring-bg/45 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-bg active:scale-[0.98]"
            >
              {/* label roll */}
              <span className="relative z-10 block overflow-hidden">
                <span className="block transition-transform delay-[70ms] duration-500 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-full group-focus-visible:-translate-y-full">
                  {LABEL}
                </span>
                <span
                  aria-hidden="true"
                  className="absolute inset-0 block translate-y-full text-bg transition-transform delay-[70ms] duration-500 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0 group-focus-visible:translate-y-0"
                >
                  {LABEL}
                </span>
              </span>

              {/* arrow slot: the flood circle lives here and expands out */}
              <span aria-hidden="true" className="relative h-10 w-10 shrink-0">
                <span className="absolute inset-0 rounded-full bg-primary transition-transform duration-[650ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[17] group-focus-visible:scale-[17]" />
                <span className="absolute inset-0 z-10 flex items-center justify-center overflow-hidden rounded-full text-bg">
                  <ArrowIcon className="transition-transform duration-500 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-[180%] group-focus-visible:translate-x-[180%]" />
                  <ArrowIcon className="absolute -translate-x-[180%] transition-transform delay-[90ms] duration-500 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0 group-focus-visible:translate-x-0" />
                </span>
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
