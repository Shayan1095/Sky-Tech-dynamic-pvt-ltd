"use client";

import Link from "next/link";
import { useEffect, useLayoutEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

// Runs before paint on the client so the reveal never flashes its end state.
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

const CLOSED = "inset(0 100% 0 0)";
const OPEN = "inset(0 0% 0 0)";

/* Shares the page's drafting frame, so the dotted rules run on to the end of
   the page — here in white over the gradient. */
const FRAME = "mx-4 sm:mx-6 lg:mx-8 xl:mx-auto xl:max-w-6xl";

/* The content line is "Get to Know Our Team — Book a Call": the first half
   is the invitation, the second the action. */
const LABEL = "Book a Call";

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

/* Concentric orbits behind the invitation — the team around the client.
   Decorative; one signal travels the middle orbit. */
const RINGS = [150, 250, 350];

export default function AboutCTA() {
  const sectionRef = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    const root = sectionRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      // Slow orbit of the signal, only while the section is on screen.
      const orbit = gsap.to(".cta-orbit", {
        rotation: 360,
        svgOrigin: "500 500",
        duration: 28,
        ease: "none",
        repeat: -1,
        paused: true,
      });

      // Paused timeline on its own one-shot trigger, so a later
      // ScrollTrigger.refresh() can never rewind it.
      const tl = gsap.timeline({
        paused: true,
        onComplete: () => {
          gsap.set(".cta-invite", { clearProps: "willChange" });
          ScrollTrigger.create({
            trigger: root,
            start: "top bottom",
            end: "bottom top",
            onToggle: (self) => (self.isActive ? orbit.play() : orbit.pause()),
          });
          orbit.play();
        },
      });

      tl.fromTo(
        ".cta-ring",
        { drawSVG: "50% 50%", opacity: 0 },
        { drawSVG: "0% 100%", opacity: 1, duration: 1.6, stagger: 0.18, ease: "power3.inOut" },
        0
      )
        .fromTo(
          ".cta-line",
          { scaleX: 0, transformOrigin: "center" },
          { scaleX: 1, duration: 0.6, ease: "power3.out" },
          0.2
        )
        .fromTo(
          ".cta-eyebrow-text",
          { opacity: 0, y: 8 },
          { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
          0.25
        )
        .fromTo(
          ".cta-invite",
          { clipPath: CLOSED, willChange: "clip-path" },
          { clipPath: OPEN, duration: 1, stagger: 0.12, ease: "power3.inOut" },
          0.35
        )
        .fromTo(
          ".cta-action",
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
          0.95
        )
        .fromTo(
          ".cta-signal",
          { opacity: 0, scale: 0, transformOrigin: "50% 50%" },
          { opacity: 1, scale: 1, duration: 0.5, ease: "power3.out" },
          1.3
        );

      ScrollTrigger.create({
        trigger: root,
        start: "top 75%",
        once: true,
        onEnter: () => tl.play(),
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="about-cta-heading"
      /* Brand blue at the top, resolving to the footer's navy so the page
         flows into the footer without a seam. */
      className="relative isolate overflow-hidden bg-[linear-gradient(to_bottom_in_oklab,var(--color-primary)_0%,var(--color-navy)_100%)] text-white"
    >
      {/* Frame rules, continued in white */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className={`h-full border-x border-dotted border-white/[0.16] ${FRAME}`} />
      </div>

      {/* Orbits */}
      <svg
        aria-hidden="true"
        viewBox="0 0 1000 1000"
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[150%] max-h-[1100px] w-auto -translate-x-1/2 -translate-y-1/2 sm:h-[160%]"
        fill="none"
      >
        {RINGS.map((r, i) => (
          <circle
            key={r}
            className="cta-ring"
            cx="500"
            cy="500"
            r={r}
            stroke="rgb(255 255 255 / 0.12)"
            strokeWidth="1"
            strokeDasharray={i === RINGS.length - 1 ? "2 8" : undefined}
            transform="rotate(-90 500 500)"
          />
        ))}
        <g className="cta-orbit">
          <g className="cta-signal">
            <circle cx="500" cy={500 - RINGS[1]} r="14" fill="#00c2ff" opacity="0.18" />
            <circle cx="500" cy={500 - RINGS[1]} r="5" fill="#00c2ff" />
          </g>
        </g>
      </svg>

      <div className={`relative ${FRAME}`}>
        <div className="flex flex-col items-center px-5 py-28 text-center sm:px-8 sm:py-36 lg:py-44">
          <p className="flex items-center gap-4">
            <span aria-hidden="true" className="cta-line block h-px w-10 bg-cta" />
            <span className="cta-eyebrow-text font-mono text-[11px] uppercase tracking-[0.22em] text-white sm:text-xs">
              05
            </span>
            <span aria-hidden="true" className="cta-line block h-px w-10 bg-cta" />
          </p>

          <h2
            id="about-cta-heading"
            className="mt-8 font-display text-[2.6rem] font-semibold leading-[1] tracking-[-0.035em] sm:text-[4rem] lg:text-[5.4rem]"
          >
            <span className="cta-invite block">Get to Know</span>
            <span className="cta-invite block">Our Team</span>
          </h2>

          <div className="cta-action mt-12">
            {/* Same button as the Home page's final CTA: the brand-blue dot
                behind the arrow floods the pill on hover or keyboard focus,
                the label rolls to white and the arrow is swapped. Pure CSS;
                hover only applies on devices that can hover. */}
            <Link
              href="/contact/"
              className="group relative isolate inline-flex min-h-[60px] items-center gap-5 overflow-hidden rounded-full bg-bg py-2 pl-8 pr-2 text-sm font-semibold uppercase tracking-[0.1em] text-text shadow-[0_14px_36px_-16px_rgb(0_0_0/0.6)] ring-1 ring-transparent [transition:box-shadow_500ms_ease-out,transform_500ms_ease-out,scale_140ms_cubic-bezier(0.22,1,0.36,1)] hover:shadow-[0_22px_48px_-18px_rgb(0_0_0/0.7)] hover:ring-bg/45 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-bg focus-visible:ring-bg/45 active:scale-[0.98]"
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
              <span aria-hidden="true" className="relative h-11 w-11 shrink-0">
                <span className="absolute inset-0 rounded-full bg-primary transition-transform duration-[650ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[14] group-focus-visible:scale-[14]" />
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
