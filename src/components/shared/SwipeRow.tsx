"use client";

import { useCallback, useEffect, useState, type RefObject } from "react";

/* A row of cards that swipes sideways on phones.

   The list keeps its own markup and its desktop grid; below 640px the
   .swipe-row class (globals.css) turns it into a native horizontal scroller
   with snap points, so the swipe is the browser's own — momentum, rubber
   band and all — and costs no script while the finger moves. This file only
   reports which card is in front, for the meter, and lets the meter's
   buttons step through the cards for anyone not swiping. */

export function useSwipeIndex(ref: RefObject<HTMLElement | null>, count: number) {
  const [index, setIndex] = useState(0);

  const step = useCallback(() => {
    const row = ref.current;
    const first = row?.children[0] as HTMLElement | undefined;
    if (!row || !first) return 0;
    const gap = parseFloat(getComputedStyle(row).columnGap) || 0;
    return first.offsetWidth + gap;
  }, [ref]);

  useEffect(() => {
    const row = ref.current;
    if (!row) return;
    let frame = 0;
    const read = () => {
      frame = 0;
      const s = step();
      if (!s) return;
      const end = row.scrollLeft >= row.scrollWidth - row.clientWidth - 2;
      const next = end ? count - 1 : Math.round(row.scrollLeft / s);
      setIndex(Math.max(0, Math.min(count - 1, next)));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(read);
    };
    row.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      row.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [ref, count, step]);

  const go = useCallback(
    (to: number) => {
      const row = ref.current;
      if (!row) return;
      const target = Math.max(0, Math.min(count - 1, to));
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      row.scrollTo({ left: target * step(), behavior: reduce ? "auto" : "smooth" });
    },
    [ref, count, step]
  );

  return { index, go };
}

function Chevron({ back = false }: { back?: boolean }) {
  return (
    <svg viewBox="0 0 16 16" className={`h-[13px] w-[13px] ${back ? "rotate-180" : ""}`} fill="none" aria-hidden="true">
      <path d="M3 8h9.5M8.5 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* The meter under a swipe row: where you are (03 / 06), a segment per card,
   and a pair of step buttons. Phones only — above 640px the list is a grid
   and there is nothing to step through. */
export function SwipeMeter({
  index,
  count,
  go,
  label,
  tone = "ink",
  className = "",
}: {
  index: number;
  count: number;
  go: (to: number) => void;
  label: string;
  tone?: "ink" | "light";
  className?: string;
}) {
  const light = tone === "light";
  const pad = (n: number) => String(n).padStart(2, "0");
  const button = `grid h-11 w-11 place-items-center rounded-full border transition-[color,border-color,opacity,scale] duration-200 [transition-timing-function:cubic-bezier(0.23,1,0.32,1)] active:scale-[0.94] disabled:opacity-35 focus-visible:outline-2 focus-visible:outline-offset-2 ${
    light
      ? "border-white/20 text-white focus-visible:outline-cta"
      : "border-text/15 text-text focus-visible:outline-primary"
  }`;

  return (
    <div className={`swipe-meter flex items-center gap-4 sm:hidden ${className}`}>
      <p className={`shrink-0 font-mono text-[11px] tracking-[0.18em] ${light ? "text-white/60" : "text-text/45"}`}>
        <span className={light ? "text-white" : "text-text"}>{pad(index + 1)}</span> / {pad(count)}
      </p>

      <span aria-hidden="true" className="flex flex-1 gap-1.5">
        {Array.from({ length: count }, (_, i) => (
          <span
            key={i}
            className={`h-[2px] flex-1 rounded-full transition-colors duration-300 ${
              i === index ? (light ? "bg-cta" : "bg-primary") : light ? "bg-white/15" : "bg-text/[0.12]"
            }`}
          />
        ))}
      </span>

      <span className="flex shrink-0 gap-2">
        <button type="button" className={button} onClick={() => go(index - 1)} disabled={index === 0} aria-label={`Previous ${label}`}>
          <Chevron back />
        </button>
        <button type="button" className={button} onClick={() => go(index + 1)} disabled={index === count - 1} aria-label={`Next ${label}`}>
          <Chevron />
        </button>
      </span>
    </div>
  );
}
