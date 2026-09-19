"use client";

import Link from "next/link";
import { Fragment, useEffect, useLayoutEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { READY_EVENT } from "@/components/shared/Preloader";
import type { ServicePage } from "@/lib/service-pages/types";
import { Arrow, FRAME, INSET, Rule, consultationHref, quoteHref } from "./parts";
import { quote } from "./quoteStore";

const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

/* Section 01 — the hero.

   Its job is the visitor's first question, "is this for me, and can I afford
   it?", answered before they scroll. The left column makes the promise; the
   right column is the Package Index — every package and its starting price,
   the same navy index card the Services page opens with, here listing the
   packages instead of the pillars. Each row jumps to that package, already
   selected, in the package section below.

   The headline is split into words, each rising out of its own mask, because
   headlines vary in length across the thirteen services and a word mask
   wraps wherever the line does. */
export default function ServiceHero({ page }: { page: ServicePage }) {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const { hero, packages, contactName } = page;

  const words = hero.h1.split(" ");
  const accentFrom = words.length - (hero.accentWords ?? 0);

  useIsomorphicLayoutEffect(() => {
    const root = sectionRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let fallback: number | undefined;
    let removeListener: (() => void) | undefined;
    const mm = gsap.matchMedia();

    const ctx = gsap.context(() => {
      /* The construction order every hero on the site uses: frame, furniture,
         headline, then the actions last so the eye finishes on them. */
      const tl = gsap.timeline({ paused: true });
      tl.fromTo(".svh-frame", { scaleY: 0, transformOrigin: "top center" }, { scaleY: 1, duration: 1.1, ease: "power3.inOut" }, 0)
        .fromTo(".svh-rule", { scaleX: 0, transformOrigin: "left center" }, { scaleX: 1, duration: 1, stagger: 0.12, ease: "power3.inOut" }, 0.05)
        .fromTo(".svh-top > *", { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.06, ease: "power3.out" }, 0.2)
        .fromTo(".svh-word", { yPercent: 110 }, { yPercent: 0, duration: 1, stagger: 0.05, ease: "power4.out" }, 0.45)
        .fromTo(".svh-sub", { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, 0.95)
        .fromTo(".svh-card", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1.3, ease: "power3.out" }, 0.75)
        .fromTo(".svh-row", { opacity: 0, x: 14 }, { opacity: 1, x: 0, duration: 0.65, stagger: 0.07, ease: "power3.out" }, 1.05)
        .fromTo(".svh-action", { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.7, stagger: 0.1, ease: "power3.out" }, 1.25)
        .fromTo(".svh-cue", { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }, 1.5);

      /* Depth as the hero scrolls away: the card climbs a little faster
         than the headline while the frame stays put. */
      const depth = (target: string, y: number) =>
        gsap.to(target, { y, ease: "none", scrollTrigger: { trigger: root, start: 0, end: "bottom top", scrub: 0.6 } });
      depth(".svh-card-depth", -36);
      depth(".svh-head-depth", -12);

      const start = () => tl.play();
      if ((window as unknown as { __skyReady?: boolean }).__skyReady) {
        start();
      } else {
        window.addEventListener(READY_EVENT, start, { once: true });
        fallback = window.setTimeout(start, 4000);
        removeListener = () => window.removeEventListener(READY_EVENT, start);
      }

      /* Desktop with a mouse: the drafting dot-grid resolves under the
         cursor, as on the other heroes. One mask position per frame. */
      mm.add("(min-width: 1024px) and (hover: hover) and (pointer: fine)", () => {
        const grid = gridRef.current;
        if (!grid) return;
        let frame = 0;
        let x = 0;
        let y = 0;
        const apply = () => {
          frame = 0;
          grid.style.setProperty("--mx", `${x}px`);
          grid.style.setProperty("--my", `${y}px`);
        };
        const onMove = (e: PointerEvent) => {
          const r = root.getBoundingClientRect();
          x = e.clientX - r.left;
          y = e.clientY - r.top;
          grid.style.opacity = "1";
          if (!frame) frame = requestAnimationFrame(apply);
        };
        const onLeave = () => {
          grid.style.opacity = "0";
        };
        root.addEventListener("pointermove", onMove);
        root.addEventListener("pointerleave", onLeave);
        return () => {
          cancelAnimationFrame(frame);
          root.removeEventListener("pointermove", onMove);
          root.removeEventListener("pointerleave", onLeave);
        };
      });
    }, root);

    document.fonts?.ready.then(() => ScrollTrigger.refresh());

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
      id="service-hero"
      aria-labelledby="service-heading"
      className="relative isolate overflow-x-clip border-b border-accent bg-surface"
    >
      {/* Cursor-revealed dot grid (desktop, mouse only) */}
      <div
        ref={gridRef}
        aria-hidden="true"
        style={{ opacity: 0 }}
        className="pointer-events-none absolute inset-0 -z-10 transition-opacity duration-500 [background-image:radial-gradient(rgb(0_107_184/0.35)_1px,transparent_1.2px)] [background-size:22px_22px] [mask-image:radial-gradient(260px_circle_at_var(--mx,50%)_var(--my,50%),#000_0%,transparent_75%)]"
      />

      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className={`svh-frame h-full border-x border-dotted border-text/[0.16] ${FRAME}`} />
      </div>

      {/* Label and breadcrumb */}
      <div className={`relative ${FRAME}`}>
        <div className={`svh-top flex flex-wrap items-center justify-between gap-x-6 gap-y-3 pb-6 pt-12 sm:pt-16 ${INSET}`}>
          <p className="flex items-center gap-3 whitespace-nowrap">
            <span aria-hidden="true" className="block h-px w-8 bg-primary" />
            <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-primary sm:text-xs">
              {hero.label}
            </span>
          </p>

          <nav aria-label="Breadcrumb">
            <ol className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em]">
              <li>
                <Link href="/" className="inline-block py-1.5 text-text/65 transition-colors duration-300 hover:text-primary">
                  Home
                </Link>
              </li>
              <li aria-hidden="true" className="text-text/35">/</li>
              <li>
                <Link href="/services" className="inline-block py-1.5 text-text/65 transition-colors duration-300 hover:text-primary">
                  Services
                </Link>
              </li>
              <li aria-hidden="true" className="text-text/35">/</li>
              <li aria-current="page" className="text-text">
                {contactName}
              </li>
            </ol>
          </nav>
        </div>
      </div>

      <Rule className="svh-rule" />

      <div className={`relative ${FRAME}`}>
        <div
          className={`grid grid-cols-[minmax(0,1fr)] items-center gap-12 py-14 sm:py-20 lg:grid-cols-[minmax(0,1.12fr)_minmax(0,0.88fr)] lg:gap-14 lg:py-24 ${INSET}`}
        >
          {/* Promise and actions */}
          <div className="svh-head-depth">
            <h1
              id="service-heading"
              className="text-[2.45rem] font-semibold leading-[1.02] tracking-[-0.035em] text-text sm:text-[3.4rem] lg:text-[3.55rem] xl:text-[4.1rem]"
            >
              {words.map((word, i) => (
                <Fragment key={i}>
                  <span className="inline-block overflow-hidden pb-[0.1em] -mb-[0.1em] align-top">
                    <span className={`svh-word inline-block ${i >= accentFrom ? "text-primary" : ""}`}>{word}</span>
                  </span>
                  {i < words.length - 1 && " "}
                </Fragment>
              ))}
            </h1>

            <p className="svh-sub mt-7 max-w-xl text-base leading-relaxed text-text/70 [text-wrap:pretty] sm:text-lg">
              {hero.subheadline}
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
              <Link
                href={quoteHref(contactName)}
                className="svh-action group relative isolate flex min-h-[56px] items-center justify-between gap-4 overflow-hidden rounded-full bg-primary py-2 pl-6 pr-2 text-[13px] font-semibold uppercase tracking-[0.1em] text-white [transition:scale_140ms_cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary active:scale-[0.97]"
              >
                <span aria-hidden="true" className="absolute inset-0 -z-10 origin-left scale-x-0 bg-navy transition-transform duration-500 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100 group-focus-visible:scale-x-100" />
                {hero.primaryCta}
                <span aria-hidden="true" className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15">
                  <Arrow className="transition-transform duration-500 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0.5" />
                </span>
              </Link>

              <Link
                href={consultationHref(contactName)}
                className="svh-action group relative inline-flex items-center gap-3 py-3.5 font-mono text-[11px] uppercase tracking-[0.2em] text-text/75 transition-colors duration-300 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary sm:text-xs"
              >
                {hero.secondaryCta}
                <Arrow className="transition-transform duration-500 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1" />
                <span aria-hidden="true" className="absolute inset-x-0 bottom-1.5 h-px origin-left scale-x-0 bg-primary transition-transform duration-500 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100 group-focus-visible:scale-x-100" />
              </Link>
            </div>
          </div>

          {/* Package Index. Not on phones: there it would sit a screen above
              the package tabs, which list the same packages and prices. */}
          <div className="svh-card-depth max-sm:hidden">
            <nav
              aria-label={`${contactName} packages`}
              className="svh-card relative isolate overflow-hidden rounded-[26px] border border-white/[0.09] bg-navy shadow-[0_2px_4px_rgb(18_18_18/0.06),0_44px_88px_-44px_rgb(11_31_53/0.6)]"
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -z-10 opacity-[0.09] [background-image:linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] [background-size:28px_28px] [mask-image:radial-gradient(120%_80%_at_100%_0%,#000_0%,transparent_70%)]"
              />

              <div className="flex items-center justify-between gap-4 border-b border-white/[0.1] bg-white/[0.04] px-6 py-4 sm:px-7">
                <p className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em] text-white/75">
                  <span aria-hidden="true" className="block h-2 w-2 bg-cta" />
                  Package Index
                </p>
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/50">
                  {packages.tiers.length} Packages
                </p>
              </div>

              <ul className="px-6 sm:px-7">
                {packages.tiers.map((tier) => (
                  <li key={tier.id} className="svh-row relative">
                    <a
                      href={`#tier-${tier.id}`}
                      onClick={() => quote.setTier(page.slug, tier.id)}
                      className="group flex items-center gap-4 py-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cta"
                    >
                      <span className="min-w-0 flex-1 font-display text-[1rem] font-medium leading-snug tracking-[-0.01em] text-white transition-colors duration-300 group-hover:text-cta sm:text-[1.06rem]">
                        {tier.name}
                      </span>
                      <span className="shrink-0 text-right">
                        <span className="block font-mono text-[9.5px] uppercase tracking-[0.18em] text-white/45">
                          {packages.priceLabel}
                        </span>
                        <span className="block font-mono text-[1.02rem] tracking-[0.01em] text-white">
                          {tier.price}
                        </span>
                      </span>
                      <span
                        aria-hidden="true"
                        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/15 text-white/50 transition-colors duration-300 group-hover:border-cta group-hover:text-cta"
                      >
                        <Arrow className="h-3 w-3 rotate-90" />
                      </span>
                    </a>
                    <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px bg-white/[0.08]" />
                  </li>
                ))}
              </ul>

              {hero.timeline && (
                <p className="flex items-center justify-between gap-4 px-6 py-5 sm:px-7">
                  <span className="text-[13px] leading-snug text-white/65">{hero.timeline.label}</span>
                  <span className="font-mono text-[13px] tracking-[0.04em] text-cta">{hero.timeline.value}</span>
                </p>
              )}
            </nav>
          </div>
        </div>
      </div>

      <Rule className="svh-rule" />

      <div className={`relative ${FRAME}`}>
        <div className={`svh-cue pb-12 pt-6 sm:pb-16 ${INSET}`}>
          <a
            href="#packages"
            className="group inline-flex items-center gap-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.22em] text-text/70 transition-colors duration-300 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
          >
            Compare Packages
            <span aria-hidden="true" className="flex flex-col items-center gap-[1px] text-primary">
              {[0, 1, 2].map((i) => (
                <svg
                  key={i}
                  width="12"
                  height="7"
                  viewBox="0 0 12 7"
                  fill="none"
                  style={{ animation: "aboutCue 2.4s ease-in-out infinite", animationDelay: `${i * 0.18}s` }}
                >
                  <path d="M1 1l5 5 5-5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ))}
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
