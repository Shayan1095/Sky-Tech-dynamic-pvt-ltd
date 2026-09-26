"use client";

import { useEffect, useRef, useSyncExternalStore, type ReactNode } from "react";
import { ReactLenis, type LenisRef } from "lenis/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

function subscribeToMotionPreference(onChange: () => void) {
  const mediaQuery = window.matchMedia(REDUCED_MOTION);
  mediaQuery.addEventListener("change", onChange);
  return () => mediaQuery.removeEventListener("change", onChange);
}

export default function SmoothScrollProvider({
  children,
}: {
  children: ReactNode;
}) {
  // Smooth scrolling follows the visitor's reduced-motion setting, live.
  // The server snapshot assumes smooth scrolling, as before.
  const smoothScrollEnabled = useSyncExternalStore(
    subscribeToMotionPreference,
    () => !window.matchMedia(REDUCED_MOTION).matches,
    () => true
  );
  const lenisRef = useRef<LenisRef>(null);

  /* Sections measure their own scroll ranges as they mount, but the pinned
     sections (Approach, Services, Our Story) add their scroll length to the
     page afterwards, which pushes everything below them down. One refresh
     once the whole tree has mounted puts every range back where it belongs;
     a second one after web fonts settle covers text re-wrapping. Without
     this, sections below a pin animate against stale positions — the Process
     route finished ~2000px before the section was even on screen. */
  useEffect(() => {
    let cancelled = false;
    const refresh = () => {
      if (!cancelled) ScrollTrigger.refresh();
    };
    const frame = requestAnimationFrame(refresh);
    document.fonts?.ready.then(refresh);
    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
    };
  }, []);

  /* Lenis and GSAP both want to run an animation frame loop, and letting them
     each run their own is what made the pinned sections stutter: Lenis moved
     the page in its frame, GSAP read the position in its own, so every pinned
     or scrubbed section was working from a scroll position one frame stale.

     So there is one loop. Lenis is created with autoRaf false and stepped from
     GSAP's ticker, which means the scroll position is updated and then read in
     that order, in the same frame, every frame.

     lagSmoothing is switched off for the same reason. Left on, GSAP responds
     to a stalled main thread — hydration, an image decoding, a slow first
     response — by pretending less time passed than really did. For ordinary
     animation that hides a hiccup; for animation tied to scroll position it
     means the page has moved and the animation has not, which reads as the
     section freezing and then jumping to catch up. */
  useEffect(() => {
    if (!smoothScrollEnabled) return;

    /* The instance is read on every tick rather than captured once. React
       attaches child refs before a parent's effect runs, so it is there
       already — but nothing now scrolls the page except this callback, and a
       single missed frame at mount would mean a page that never scrolls at
       all. Reading it each time makes that impossible.

       GSAP's ticker passes seconds; Lenis expects milliseconds. */
    const step = (time: number) => {
      lenisRef.current?.lenis?.raf(time * 1000);
    };

    gsap.ticker.add(step);
    gsap.ticker.lagSmoothing(0);

    const lenis = lenisRef.current?.lenis;
    lenis?.on("scroll", ScrollTrigger.update);

    return () => {
      lenis?.off("scroll", ScrollTrigger.update);
      gsap.ticker.remove(step);
      /* Back to GSAP's own defaults, so nothing outside this provider — the
         admin panel, a page rendered with reduced motion — inherits a setting
         that only makes sense for scroll-linked work. */
      gsap.ticker.lagSmoothing(500, 33);
    };
  }, [smoothScrollEnabled]);

  if (!smoothScrollEnabled) {
    return <>{children}</>;
  }

  return (
    <ReactLenis root ref={lenisRef} options={{ autoRaf: false }}>
      {children}
    </ReactLenis>
  );
}
