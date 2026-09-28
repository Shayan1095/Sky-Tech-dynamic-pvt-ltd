"use client";

import Link from "next/link";
import { useEffect, useLayoutEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { READY_EVENT } from "@/components/shared/Preloader";
import { BRAND, CONSULTATION_HREF, EVENT_CATEGORIES, SINGLE_EVENT, COMBINED } from "@/lib/media-events";
import { FRAME, INSET, Arrow } from "@/components/service/parts";

// Runs before paint on the client so the reveal never flashes its end state.
const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

function Cross({ side }: { side: "left" | "right" }) {
  return (
    <span
      aria-hidden="true"
      className={`eh-cross absolute top-0 h-[11px] w-[11px] -translate-y-1/2 ${
        side === "left" ? "left-0 -translate-x-1/2" : "right-0 translate-x-1/2"
      }`}
    >
      <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-white/40" />
      <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-white/40" />
    </span>
  );
}

function Phrase({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block overflow-hidden pb-[0.1em] pr-[0.06em] -mb-[0.1em] -mr-[0.06em] align-top">
      <span className="eh-phrase inline-block whitespace-nowrap">{children}</span>
    </span>
  );
}

/* The Media & Event hero.

   Navy, unlike the Services and Products heroes, because this is the one part
   of the business that happens in a room with the lights down. The palette is
   still the site's own — navy and cyan, the same drafting frame and
   registration marks. The source decks are gold and maroon; that is their
   print identity and it is not this site's.

   The two counts are worked out from the data rather than written down, so
   adding a package or a category cannot leave a stale number on the page. */

export default function EventsHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const packages = SINGLE_EVENT.length + COMBINED.length;

  useIsomorphicLayoutEffect(() => {
    const root = sectionRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let fallback: number | undefined;
    let removeListener: (() => void) | undefined;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ paused: true });
      tl.fromTo(".eh-frame", { scaleY: 0, transformOrigin: "top center" }, { scaleY: 1, duration: 1.1, ease: "power3.inOut" }, 0)
        .fromTo(".eh-rule", { scaleX: 0, transformOrigin: "left center" }, { scaleX: 1, duration: 1, stagger: 0.12, ease: "power3.inOut" }, 0.05)
        .fromTo(".eh-eyebrow > *", { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.06, ease: "power3.out" }, 0.2)
        .fromTo(".eh-cross", { scale: 0, rotation: -90 }, { scale: 1, rotation: 0, duration: 0.6, stagger: 0.05, ease: "power3.out" }, 0.45)
        .fromTo(".eh-phrase", { yPercent: 110 }, { yPercent: 0, duration: 1.05, stagger: 0.1, ease: "power4.out" }, 0.5)
        .fromTo(".eh-intro", { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" }, 0.95)
        .fromTo(".eh-stat", { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.7, stagger: 0.08, ease: "power3.out" }, 1.05)
        .fromTo(".eh-action", { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.7, stagger: 0.1, ease: "power3.out" }, 1.3);

      const start = () => tl.play();
      if ((window as unknown as { __skyReady?: boolean }).__skyReady) {
        start();
      } else {
        window.addEventListener(READY_EVENT, start, { once: true });
        fallback = window.setTimeout(start, 4000);
        removeListener = () => window.removeEventListener(READY_EVENT, start);
      }
    }, root);

    return () => {
      if (fallback) window.clearTimeout(fallback);
      removeListener?.();
      ctx.revert();
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative isolate overflow-x-clip bg-navy text-white">
      {/* Light from the top, and the drafting grid under it. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 [background-image:radial-gradient(75%_60%_at_20%_0%,rgb(0_107_184/0.55),transparent_70%),radial-gradient(50%_45%_at_90%_100%,rgb(0_194_255/0.1),transparent_70%)]"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.07] [background-image:linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] [background-size:34px_34px] [mask-image:radial-gradient(80%_70%_at_30%_0%,#000_0%,transparent_80%)]"
      />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className={`eh-frame h-full border-x border-dotted border-white/20 ${FRAME}`} />
      </div>

      <div className="pt-28 sm:pt-32 lg:pt-36">
        <div aria-hidden="true" className="relative">
          <div className="eh-rule border-t border-dotted border-white/20" />
          <div className={`relative ${FRAME}`}>
            <Cross side="left" />
            <Cross side="right" />
          </div>
        </div>
      </div>

      <div className={`relative ${FRAME}`}>
        <div className={`py-14 sm:py-16 lg:py-24 ${INSET}`}>
          <div className="eh-eyebrow flex items-center justify-between gap-6">
            <p className="flex items-center gap-3">
              <span aria-hidden="true" className="block h-px w-8 bg-cta" />
              <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-cta sm:text-xs">
                {BRAND}
              </span>
            </p>
            <span className="shrink-0 font-mono text-[11px] uppercase tracking-[0.18em] text-white/65">
              {TAG}
            </span>
          </div>

          <h1 className="mt-8 max-w-4xl text-[2.6rem] font-semibold leading-[1.02] tracking-[-0.032em] sm:text-[3.6rem] lg:text-[4.3rem]">
            <Phrase>Professional events.</Phrase> <Phrase>Powerful experiences.</Phrase>{" "}
            <Phrase>Memorable stories.</Phrase>
          </h1>

          <p className="eh-intro mt-8 max-w-2xl text-lg leading-relaxed text-white/85 [text-wrap:pretty] sm:text-xl">
            We plan, run and film events — a conference for four hundred, a
            graduation, a product launch, a three-day wedding. One team handles
            the room and the cameras, so the story of the day is captured by the
            people who know what is about to happen in it.
          </p>

          <dl className="mt-12 grid max-w-2xl grid-cols-3 border-y border-white/15">
            {[
              { n: String(EVENT_CATEGORIES.length), l: "Kinds of event" },
              { n: String(packages), l: "Wedding packages" },
              { n: "Karachi", l: "Based in" },
            ].map((stat, i) => (
              <div
                key={stat.l}
                className={`eh-stat py-6 ${i > 0 ? "border-l border-dotted border-white/25 pl-5" : "pr-5"}`}
              >
                <dt className="sr-only">{stat.l}</dt>
                <dd>
                  <span className="block font-mono text-2xl font-medium leading-none sm:text-3xl">
                    {stat.n}
                  </span>
                  <span className="mt-2 block text-[0.78rem] leading-tight text-white/70 sm:text-sm">
                    {stat.l}
                  </span>
                </dd>
              </div>
            ))}
          </dl>

          <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-4">
            <Link
              href={CONSULTATION_HREF}
              className="eh-action group relative isolate flex min-h-[56px] items-center justify-between gap-4 overflow-hidden rounded-full bg-white py-2 pl-6 pr-2 text-[13px] font-semibold uppercase tracking-[0.1em] text-navy [transition:scale_140ms_cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cta active:scale-[0.97]"
            >
              <span
                aria-hidden="true"
                className="absolute inset-0 -z-10 origin-left scale-x-0 bg-cta transition-transform duration-500 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100 group-focus-visible:scale-x-100"
              />
              Plan Your Event
              <span
                aria-hidden="true"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-navy/10"
              >
                <Arrow className="transition-transform duration-500 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0.5" />
              </span>
            </Link>

            <a
              href="#weddings"
              className="eh-action group relative inline-flex items-center gap-3 py-3.5 font-mono text-[11px] uppercase tracking-[0.2em] text-white/80 transition-colors duration-300 hover:text-cta focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cta sm:text-xs"
            >
              See Wedding Packages
              <Arrow className="transition-transform duration-500 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1" />
              <span
                aria-hidden="true"
                className="absolute inset-x-0 bottom-1.5 h-px origin-left scale-x-0 bg-cta transition-transform duration-500 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100 group-focus-visible:scale-x-100"
              />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* The deck's own line, kept as the page's promise. */
const TAG = "Making Every Moment Memorable";
