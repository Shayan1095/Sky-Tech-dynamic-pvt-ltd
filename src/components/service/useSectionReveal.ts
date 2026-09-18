"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

// Runs before paint on the client so a reveal never flashes its end state.
const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

export type RevealBuilder<T extends HTMLElement> = (tl: gsap.core.Timeline, root: T) => void;

/* The entrance every service-page section shares: built once, as the section
   arrives, and skipped entirely under reduced motion so the content is simply
   there. `build` must be a module-level function — it is read once, on mount.

   The returned ref goes on the section element; selectors inside `build` are
   scoped to it by gsap.context, so identical class names in two sections
   never animate each other. */
export function useSectionReveal<T extends HTMLElement = HTMLElement>(
  build: RevealBuilder<T>,
  start = "top 78%"
) {
  const ref = useRef<T>(null);

  useIsomorphicLayoutEffect(() => {
    const root = ref.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: root, start, once: true } });
      build(tl, root);
    }, root);

    return () => ctx.revert();
  }, [build, start]);

  return ref;
}

/* The standard header entrance: the label's rule draws, the label rises, and
   the heading uncovers itself left to right. Sections add their own content
   after it, from about 0.3s. */
export function revealHead(tl: gsap.core.Timeline) {
  tl.fromTo(".sv-line", { scaleX: 0, transformOrigin: "left center" }, { scaleX: 1, duration: 0.55 }, 0)
    .fromTo(".sv-label", { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.55, stagger: 0.06 }, 0.06)
    .fromTo(
      ".sv-heading",
      { clipPath: "inset(0 100% 0 0)" },
      { clipPath: "inset(0 0% 0 0)", duration: 0.85, ease: "power3.inOut", stagger: 0.1 },
      0.12
    );
  return tl;
}
