"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import HeroBadge from "./HeroBadge";
import { HeroCornerBlockTopLeft, HeroCornerBlockBottomRight } from "./HeroDecor";
import HeroArrowRow from "./HeroArrowRow";
import HeroCTAButtons from "./HeroCTAButtons";
import { READY_EVENT } from "@/components/shared/Preloader";

// Runs before paint on the client so the wipe never flashes its end state.
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

const gradientTextStyle = {
  backgroundImage: "linear-gradient(135deg, rgba(18,18,18,0.55) 20%, #121212 80%)",
  WebkitBackgroundClip: "text" as const,
  backgroundClip: "text" as const,
  color: "transparent",
};

const CLOSED = "inset(0 100% 0 0)";
const OPEN = "inset(0 0% 0 0)";
const STAGGER = 0.06;

const LEFT_LINES = ["We Build", "Digital", "Products"];
const RIGHT_LINES = ["That Help", "Businesses", "Grow"];

const lineClass =
  "text-center text-[2.25rem] font-medium uppercase leading-tight tracking-tight sm:text-[2.75rem] lg:text-[3.5rem]";

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    const root = sectionRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let fallback: number | undefined;
    let cleanupListener: (() => void) | undefined;

    const ctx = gsap.context(() => {
      const wipe = (targets: string, at: number, stagger = 0) =>
        tl.fromTo(
          targets,
          { clipPath: CLOSED, willChange: "clip-path" },
          { clipPath: OPEN, duration: 0.5, stagger },
          at
        );

      const tl = gsap.timeline({
        paused: true,
        // Drop the compositor hint once the sweep is done — leaving elements
        // permanently promoted costs memory for no benefit.
        onComplete: () =>
          gsap.set(".hero-line-l, .hero-line-r, .hero-desc", {
            clearProps: "willChange",
          }),
      });

      // One continuous left-to-right sweep — overlapped so it reads as a
      // single gesture (~1s) rather than a queue of separate reveals.
      wipe(".hero-corner-tl", 0);
      wipe(".hero-line-l", 0.05, STAGGER);
      tl.fromTo(
        ".hero-badge",
        { opacity: 0, scale: 0.85 },
        { opacity: 1, scale: 1, duration: 0.45 },
        0.22
      );
      wipe(".hero-line-r", 0.3, STAGGER);
      wipe(".hero-corner-br", 0.4);
      wipe(".hero-desc", 0.5);
      tl.fromTo(
        ".hero-cta",
        { opacity: 0, y: 8 },
        { opacity: 1, y: 0, duration: 0.35, stagger: STAGGER },
        0.6
      );

      // Hold until the preloader is gone, or the sweep plays unseen behind it.
      const start = () => tl.play();
      const alreadyReady = (window as unknown as { __skyReady?: boolean })
        .__skyReady;

      if (alreadyReady) {
        start();
      } else {
        window.addEventListener(READY_EVENT, start, { once: true });
        fallback = window.setTimeout(start, 4000);
        cleanupListener = () =>
          window.removeEventListener(READY_EVENT, start);
      }
    }, root);

    return () => {
      cleanupListener?.();
      if (fallback) window.clearTimeout(fallback);
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden border-b border-accent bg-surface"
    >
      <HeroCornerBlockTopLeft />
      <HeroCornerBlockBottomRight />

      <div className="relative mx-auto max-w-5xl px-4 pt-28 sm:px-6 sm:pt-36 lg:px-8" />

      <div className="relative border-y border-dotted border-text/15 py-14 sm:py-20">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-1/2 block w-[100px] -translate-x-1/2 border-x border-dotted border-text/15"
        />

        <HeroArrowRow className="absolute inset-x-0 top-0 -translate-y-1/2" />
        <HeroArrowRow
          className="absolute inset-x-0 bottom-0 translate-y-1/2"
          reverse
        />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="flex flex-col items-center gap-6 sm:flex-row sm:items-center sm:justify-center sm:gap-6 lg:gap-10">
            <span className={`${lineClass} sm:text-right`}>
              {LEFT_LINES.map((line) => (
                <span key={line} className="block pb-[0.06em]">
                  <span
                    className="hero-line-l block whitespace-nowrap"
                    style={gradientTextStyle}
                  >
                    {line}
                  </span>
                </span>
              ))}
            </span>

            <div className="hero-badge shrink-0">
              <HeroBadge />
            </div>

            <span className={`${lineClass} sm:text-left`}>
              {RIGHT_LINES.map((line) => (
                <span key={line} className="block pb-[0.06em]">
                  <span
                    className="hero-line-r block whitespace-nowrap"
                    style={gradientTextStyle}
                  >
                    {line}
                  </span>
                </span>
              ))}
            </span>
          </h1>
        </div>
      </div>

      <div className="relative mx-auto max-w-5xl px-4 pb-28 sm:px-6 sm:pb-36 lg:px-8">
        <p className="hero-desc mx-auto mt-10 max-w-xl text-center text-lg text-text sm:text-xl">
          Custom software, high-performance websites, AI-powered solutions,
          and digital marketing strategies — built for ambitious businesses
          in the USA, UK, and beyond.
        </p>

        <HeroCTAButtons />
      </div>
    </section>
  );
}
