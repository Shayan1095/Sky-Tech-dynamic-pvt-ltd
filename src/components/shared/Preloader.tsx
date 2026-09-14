"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";

// Page-entrance animations wait for this — otherwise they run and finish
// while the preloader is still covering the screen, and nobody sees them.
export const READY_EVENT = "sky:ready";

import { SEEN_KEY } from "@/lib/preloader";

// Runs before paint on the client so the intro never flashes its end state.
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

function announceReady() {
  if (typeof window === "undefined") return;
  (window as unknown as { __skyReady?: boolean }).__skyReady = true;
  window.dispatchEvent(new Event(READY_EVENT));
}

/* The "already seen this session" flag is set by a beforeInteractive script
   in the root layout (see src/lib/preloader.ts). It isn't rendered here: an
   inline <script> inside a component breaks React hydration. */

/* The same drafting frame as the page heroes, so the intro hands over to
   the hero without the frame lines moving. */
const FRAME = "mx-4 sm:mx-6 lg:mx-8 xl:mx-auto xl:max-w-6xl";
const INSET = "px-5 sm:px-8 lg:px-12";

function Cross({ side }: { side: "left" | "right" }) {
  return (
    <span
      className={`pl-cross absolute top-0 h-[11px] w-[11px] -translate-y-1/2 ${
        side === "left" ? "left-0 -translate-x-1/2" : "right-0 translate-x-1/2"
      }`}
    >
      <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-text/40" />
      <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-text/40" />
    </span>
  );
}

function Rule() {
  return (
    <div className="relative">
      <div className="pl-rule border-t border-dotted border-text/[0.16]" />
      <div className={`relative ${FRAME}`}>
        <Cross side="left" />
        <Cross side="right" />
      </div>
    </div>
  );
}

export default function Preloader() {
  const rootRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const [done, setDone] = useState(false);

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const seen = document.documentElement.hasAttribute("data-sky-seen");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (seen || reduced) {
      setDone(true);
      announceReady();
      return;
    }

    let cancelled = false;

    const ctx = gsap.context(() => {
      /* Intro: the frame draws, the rules sweep across, the registration
         marks turn in, and the wordmark wipes on. */
      gsap
        .timeline()
        .fromTo(".pl-frame", { scaleY: 0, transformOrigin: "top center" }, { scaleY: 1, duration: 0.9, ease: "power3.inOut" }, 0)
        .fromTo(".pl-rule", { scaleX: 0, transformOrigin: "left center" }, { scaleX: 1, duration: 0.9, stagger: 0.1, ease: "power3.inOut" }, 0.05)
        .fromTo(".pl-cross", { scale: 0, rotation: -90 }, { scale: 1, rotation: 0, duration: 0.5, stagger: 0.04, ease: "power3.out" }, 0.4)
        .fromTo(".pl-mark", { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", duration: 0.85, ease: "power3.inOut" }, 0.25)
        .fromTo(".pl-sub, .pl-meta", { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.08, ease: "power3.out" }, 0.55);

      /* Progress is real: it advances as fonts and the page's assets finish
         loading, eased so the counter never stutters. */
      const progress = { v: 0 };
      const render = () => {
        const v = Math.round(progress.v);
        if (countRef.current) countRef.current.textContent = String(v).padStart(3, "0");
        if (barRef.current) barRef.current.style.transform = `scaleX(${progress.v / 100})`;
      };
      const toward = (target: number, duration = 0.6) =>
        gsap.to(progress, { v: target, duration, ease: "power2.out", overwrite: true, onUpdate: render });

      toward(24, 0.8);
      const fonts = (document.fonts?.ready ?? Promise.resolve()).then(() => {
        if (!cancelled) toward(60);
      });
      const pageLoad = new Promise<void>((resolve) => {
        if (document.readyState === "complete") resolve();
        else window.addEventListener("load", () => resolve(), { once: true });
      }).then(() => {
        if (!cancelled) toward(88);
      });
      // Long enough for the intro to read, never the old fixed 2.2s hold.
      const minimum = new Promise<void>((resolve) => setTimeout(resolve, 950));
      // Slow networks still get the site; the page keeps loading behind.
      const ceiling = new Promise<void>((resolve) => setTimeout(resolve, 3000));

      const exit = () => {
        try {
          sessionStorage.setItem(SEEN_KEY, "1");
        } catch {
          /* private mode: the intro simply plays again next time */
        }
        gsap
          .timeline({ onComplete: () => setDone(true) })
          .to(".pl-content", { yPercent: -6, opacity: 0, duration: 0.55, ease: "power3.in" }, 0)
          .to(root, { clipPath: "inset(0 0 100% 0)", duration: 0.95, ease: "power4.inOut" }, 0.2)
          // The hero's entrance starts as the panel lifts, not after.
          .add(announceReady, 0.55);
      };

      Promise.race([Promise.all([fonts, pageLoad, minimum]), ceiling]).then(() => {
        if (cancelled) return;
        gsap.to(progress, {
          v: 100,
          duration: 0.4,
          ease: "power2.out",
          overwrite: true,
          onUpdate: render,
          onComplete: exit,
        });
      });
    }, root);

    return () => {
      cancelled = true;
      ctx.revert();
    };
  }, []);

  if (done) return null;

  return (
    <>
      <div
        ref={rootRef}
        aria-hidden="true"
        style={{ clipPath: "inset(0 0 0% 0)" }}
        className="sky-preloader fixed inset-0 z-[9999] overflow-hidden bg-surface"
      >
        {/* Frame rules */}
        <div className="pointer-events-none absolute inset-0">
          <div className={`pl-frame h-full border-x border-dotted border-text/[0.16] ${FRAME}`} />
        </div>

        <div className="pl-content relative flex h-full flex-col justify-center">
          {/* A plain block wrapper: inside a flex column, the frame's auto
              side margins would shrink these rows to their content and
              centre them, pulling them off the frame lines. */}
          <div className="w-full">
            <Rule />

            <div className={`relative ${FRAME}`}>
              <div className={`py-10 sm:py-14 ${INSET}`}>
                <p className="pl-mark font-display text-[2rem] font-semibold leading-none tracking-[-0.035em] text-primary sm:text-[3.4rem] lg:text-[5.2rem]">
                  SKY Tech Dynamic
                </p>
                <p className="pl-sub mt-4 font-mono text-[11px] uppercase tracking-[0.3em] text-text/55 sm:text-xs">
                  Pvt. Ltd.
                </p>
              </div>
            </div>

            <Rule />

            {/* Progress: a hairline across the frame and a live counter */}
            <div className={`pl-meta relative ${FRAME}`}>
              <div className={`flex items-center gap-6 pt-6 ${INSET}`}>
                <span className="relative block h-px flex-1 overflow-hidden bg-text/10">
                  <span
                    ref={barRef}
                    className="absolute inset-0 origin-left bg-primary"
                    style={{ transform: "scaleX(0)" }}
                  />
                </span>
                <span className="shrink-0 font-mono text-[12px] tracking-[0.18em] text-text/60">
                  <span ref={countRef}>000</span>%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
