"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useSyncExternalStore,
  type ReactNode,
  type RefObject,
} from "react";
import { usePathname } from "next/navigation";
import { ReactLenis, type LenisRef } from "lenis/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

/* Put the page back to the top before the new route measures itself.

   Next scrolls to the top on a navigation, but Lenis owns the scroll position
   here: it keeps its own animated value and writes it back to the window on
   the next tick, so a route arrived at from halfway down another page begins
   life with the window still at that offset. Lenis has to be told.

   Left untold, it is not only that the visitor lands mid-page. Every section
   of the incoming route builds its ScrollTriggers in a layout effect, and
   from a deep offset a whole run of them is already past its start, so each
   one fires as it is created and the `once` ones kill themselves while
   ScrollTrigger is still walking the list they are removing themselves from.
   It reads a property off the gap that leaves, throws, and — because this is
   a layout effect — React treats the throw as a failed render and unmounts
   the route. What the visitor gets is a blank page that will not scroll.
   Clicking any service in the footer did exactly this.

   This is a layout effect on a component rendered before the children, so it
   runs before any of their effects: by the time a section measures itself,
   the page is at the top, and nothing fires while it is being built. */
function ScrollTopOnRouteChange({ lenisRef }: { lenisRef: RefObject<LenisRef | null> }) {
  const pathname = usePathname();
  /* The first run is the page being loaded, not navigated to; the browser
     has already put it where it belongs, hash included. */
  const navigated = useRef(false);

  useLayoutEffect(() => {
    if (!navigated.current) {
      navigated.current = true;
      return;
    }
    /* A link to an anchor on another page is asking for that anchor, and the
       browser is about to honour it. Leave those alone. */
    if (window.location.hash) return;

    lenisRef.current?.lenis?.scrollTo(0, { immediate: true, force: true });
    window.scrollTo(0, 0);
  }, [pathname, lenisRef]);

  /* And then tell it how long the new page is.

     Lenis caches the scrollable length and will not scroll past it. Nothing
     recomputes that on a route change, so arriving at a page from a shorter
     one, the visitor could scroll exactly as far as the page they came from
     and no further: from Contact, which stops at 2,841px, a 15,822px service
     page came to a dead stop a fifth of the way down with eleven sections
     still below. Nothing was frozen — the page had simply been told it was
     2,841 pixels long.

     Measured after a frame, once the incoming route has laid out, and again
     when the web fonts land and the text re-wraps. ScrollTrigger is told at
     the same time, since every trigger on the new page was measured against
     the same stale height. */
  useEffect(() => {
    let cancelled = false;
    const remeasure = () => {
      if (cancelled) return;
      lenisRef.current?.lenis?.resize();
      ScrollTrigger.refresh();
    };
    const frame = requestAnimationFrame(remeasure);
    document.fonts?.ready.then(remeasure);
    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
    };
  }, [pathname, lenisRef]);

  return null;
}

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
      <ScrollTopOnRouteChange lenisRef={lenisRef} />
      {children}
    </ReactLenis>
  );
}
