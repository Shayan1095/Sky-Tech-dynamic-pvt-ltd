"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useLayoutEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { READY_EVENT } from "@/components/shared/Preloader";

// Runs before paint on the client so the reveal never flashes its end state.
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/* The drafting frame's vertical rules sit on this box; content is inset from
   it so type never touches a line. */
const FRAME = "mx-4 sm:mx-6 lg:mx-8 xl:mx-auto xl:max-w-6xl";
const INSET = "px-5 sm:px-8 lg:px-12";

function Cross({ side }: { side: "left" | "right" }) {
  return (
    <span
      aria-hidden="true"
      className={`about-cross absolute top-0 h-[11px] w-[11px] -translate-y-1/2 ${
        side === "left" ? "left-0 -translate-x-1/2" : "right-0 translate-x-1/2"
      }`}
    >
      <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-text/40" />
      <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-text/40" />
    </span>
  );
}

/* A full-bleed dotted rule with registration marks where it meets the frame. */
function Rule() {
  return (
    <div aria-hidden="true" className="relative">
      <div className="about-guide-h border-t border-dotted border-text/[0.16]" />
      <div className={`relative ${FRAME}`}>
        <Cross side="left" />
        <Cross side="right" />
      </div>
    </div>
  );
}

/* Each phrase rises out of its own mask. Phrases are React-rendered units that
   wrap as wholes, so the reveal follows the real line breaks without anything
   rewriting DOM that React owns. */
function Phrase({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span className="about-mask">
      <span className={`about-phrase ${className}`}>{children}</span>
    </span>
  );
}

export default function AboutHero() {
  const sectionRef = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    const root = sectionRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let fallback: number | undefined;
    let removeListener: (() => void) | undefined;
    const mm = gsap.matchMedia();

    const ctx = gsap.context(() => {
      const float = root.querySelector<HTMLElement>(".about-art-float");

      /* Very slow drift once the artwork has landed: 8px of lift and a
         ±0.3° sway on offset periods, so the two never visibly sync. */
      const startFloat = () => {
        if (!float) return;
        gsap.to(float, {
          y: -8,
          duration: 4,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        });
        gsap
          .timeline({ repeat: -1, yoyo: true })
          .fromTo(
            float,
            { rotation: -0.3 },
            { rotation: 0.3, duration: 4.5, ease: "sine.inOut" }
          );
      };

      /* Entrance, in four beats: frame and labels, headline, artwork rise,
         then the cue. Nothing arrives at the same moment as anything else. */
      const tl = gsap.timeline({ paused: true, onComplete: startFloat });
      tl.fromTo(
        ".about-guide-v",
        { scaleY: 0, transformOrigin: "top center" },
        { scaleY: 1, duration: 1.1, ease: "power3.inOut" },
        0
      )
        .fromTo(
          ".about-guide-h",
          { scaleX: 0, transformOrigin: "left center" },
          { scaleX: 1, duration: 1, stagger: 0.12, ease: "power3.inOut" },
          0.05
        )
        .fromTo(
          ".about-eyebrow > *, .about-crumbs",
          { opacity: 0, y: 8 },
          { opacity: 1, y: 0, duration: 0.6, stagger: 0.06, ease: "power3.out" },
          0.2
        )
        .fromTo(
          ".about-cross",
          { scale: 0, rotation: -90 },
          { scale: 1, rotation: 0, duration: 0.6, stagger: 0.05, ease: "power3.out" },
          0.45
        )
        .fromTo(
          ".about-phrase",
          { yPercent: 110 },
          { yPercent: 0, duration: 1.05, stagger: 0.09, ease: "power4.out" },
          0.5
        )
        .fromTo(
          ".about-art-enter",
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 1.6, ease: "power3.out" },
          0.95
        )
        .fromTo(
          ".about-hero-cue",
          { opacity: 0, y: 8 },
          { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" },
          1.35
        );

      /* Scroll depth: as the hero leaves, the artwork climbs faster than the
         headline; the grid stays put. Starts at the very top of the page, so
         the first pixel of scroll already reads as depth. */
      const depth = (target: string, y: number) =>
        gsap.to(target, {
          y,
          ease: "none",
          scrollTrigger: {
            trigger: root,
            start: 0,
            end: "bottom top",
            scrub: 0.6,
          },
        });
      depth(".about-art-scroll", -40);
      depth(".about-head-scroll", -15);

      // Hold until the preloader is gone, or the entrance plays unseen.
      const start = () => tl.play();
      if ((window as unknown as { __skyReady?: boolean }).__skyReady) {
        start();
      } else {
        window.addEventListener(READY_EVENT, start, { once: true });
        fallback = window.setTimeout(start, 4000);
        removeListener = () => window.removeEventListener(READY_EVENT, start);
      }

      /* Pointer depth: desktop with a real mouse only. The artwork leans a
         few pixels toward the cursor, smoothed, and eases home on leave. */
      mm.add(
        "(min-width: 1024px) and (hover: hover) and (pointer: fine)",
        () => {
          const layer = root.querySelector<HTMLElement>(".about-art-pointer");
          if (!layer) return;
          const toX = gsap.quickTo(layer, "x", { duration: 1.1, ease: "power3.out" });
          const toY = gsap.quickTo(layer, "y", { duration: 1.1, ease: "power3.out" });
          const toR = gsap.quickTo(layer, "rotation", {
            duration: 1.1,
            ease: "power3.out",
          });

          const onMove = (e: PointerEvent) => {
            const r = root.getBoundingClientRect();
            const nx = ((e.clientX - r.left) / r.width - 0.5) * 2;
            const ny = ((e.clientY - r.top) / r.height - 0.5) * 2;
            toX(nx * 10);
            toY(ny * 8);
            toR(nx * 1);
          };
          const onLeave = () => {
            toX(0);
            toY(0);
            toR(0);
          };

          root.addEventListener("pointermove", onMove);
          root.addEventListener("pointerleave", onLeave);
          return () => {
            root.removeEventListener("pointermove", onMove);
            root.removeEventListener("pointerleave", onLeave);
            gsap.set(layer, { x: 0, y: 0, rotation: 0 });
          };
        }
      );
    }, root);

    // Layout can shift once the artwork and fonts settle.
    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh);

    return () => {
      removeListener?.();
      if (fallback) window.clearTimeout(fallback);
      mm.revert();
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="about-heading"
      className="relative isolate overflow-hidden border-b border-accent bg-surface"
    >
      {/* Vertical frame rules */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div
          className={`about-guide-v h-full border-x border-dotted border-text/[0.16] ${FRAME}`}
        />
      </div>

      <div className={`relative ${FRAME}`}>
        <div
          className={`flex items-center justify-between gap-6 pb-6 pt-12 sm:pt-16 ${INSET}`}
        >
          <p className="about-eyebrow flex items-center gap-3">
            <span aria-hidden="true" className="block h-px w-8 bg-primary" />
            <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-primary sm:text-xs">
              About SKY Tech
            </span>
          </p>

          <nav aria-label="Breadcrumb" className="about-crumbs">
            <ol className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em]">
              <li>
                <Link
                  href="/"
                  className="text-text/65 transition-colors duration-300 hover:text-primary"
                >
                  Home
                </Link>
              </li>
              <li aria-hidden="true" className="text-text/35">
                /
              </li>
              <li aria-current="page" className="text-text">
                About
              </li>
            </ol>
          </nav>
        </div>
      </div>

      <Rule />

      <div className={`relative ${FRAME}`}>
        <div className={`about-hero-grid py-12 sm:py-16 lg:py-20 ${INSET}`}>
          <div className="about-hero-head">
            <div className="about-head-scroll">
              <h1 id="about-heading" className="about-h1">
                <span className="block text-text/[0.88]">
                  <Phrase>We&apos;re Not Just a</Phrase>{" "}
                  <Phrase>Software House.</Phrase>
                </span>
                <span className="block">
                  <Phrase className="text-text/[0.58]">We&apos;re Your</Phrase>{" "}
                  <Phrase className="text-primary">Growth Partner.</Phrase>
                </span>
              </h1>
            </div>
          </div>

          {/* Artwork, used exactly as supplied. Four nested layers so the
              scroll depth, pointer lean, idle float and entrance each own a
              transform and never fight over one. */}
          <div className="about-hero-art">
            <div className="about-art-scroll">
              <div className="about-art-pointer">
                <div className="about-art-float">
                  {/* 92% of its column: the artwork leads the right side
                      without crowding the frame or the headline. */}
                  <div className="about-art-enter mx-auto w-[92%] max-w-[34rem] lg:max-w-none">
                    <Image
                      src="/about/hero-ecosystem.png"
                      alt=""
                      width={1536}
                      height={1024}
                      preload
                      sizes="(max-width: 1023px) 92vw, 560px"
                      className="h-auto w-full object-contain"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="about-hero-cue">
            <Link
              href="#our-story"
              className="group inline-flex items-center gap-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.22em] text-text/70 transition-colors duration-300 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
            >
              Our Story
              <span
                aria-hidden="true"
                className="flex flex-col items-center gap-[1px] text-primary"
              >
                {[0, 1, 2].map((i) => (
                  <svg
                    key={i}
                    width="12"
                    height="7"
                    viewBox="0 0 12 7"
                    fill="none"
                    style={{
                      animation: "aboutCue 2.4s ease-in-out infinite",
                      animationDelay: `${i * 0.18}s`,
                    }}
                  >
                    <path
                      d="M1 1l5 5 5-5"
                      stroke="currentColor"
                      strokeWidth="1.3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ))}
              </span>
            </Link>
          </div>
        </div>
      </div>

      <Rule />

      <div aria-hidden="true" className="h-10 sm:h-14" />
    </section>
  );
}
