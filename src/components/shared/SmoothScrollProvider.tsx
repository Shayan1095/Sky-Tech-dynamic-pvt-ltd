"use client";

import { useEffect, useRef, useSyncExternalStore, type ReactNode } from "react";
import { ReactLenis, type LenisRef } from "lenis/react";
import { ScrollTrigger } from "@/lib/gsap";

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

  useEffect(() => {
    if (!smoothScrollEnabled) return;

    const lenis = lenisRef.current?.lenis;
    if (!lenis) return;

    // Push every Lenis scroll tick into ScrollTrigger so pinned/scrubbed
    // sections (e.g. the Process timeline) recalculate against Lenis's
    // smoothed scroll position instead of drifting from native scroll.
    // Lenis keeps driving its own rAF loop (autoRaf, default) — only the
    // ScrollTrigger sync is added here.
    lenis.on("scroll", ScrollTrigger.update);

    return () => {
      lenis.off("scroll", ScrollTrigger.update);
    };
  }, [smoothScrollEnabled]);

  if (!smoothScrollEnabled) {
    return <>{children}</>;
  }

  return (
    <ReactLenis root ref={lenisRef}>
      {children}
    </ReactLenis>
  );
}
