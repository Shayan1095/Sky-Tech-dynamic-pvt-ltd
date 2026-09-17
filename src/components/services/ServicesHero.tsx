"use client";

import Link from "next/link";
import { useEffect, useLayoutEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { READY_EVENT } from "@/components/shared/Preloader";
import { PILLARS, TOTAL_SERVICES, pillarHref } from "@/lib/pillars";

// Runs before paint on the client so the reveal never flashes its end state.
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/* The site's drafting frame, shared with the About and Contact heroes. */
const FRAME = "mx-4 sm:mx-6 lg:mx-8 xl:mx-auto xl:max-w-6xl";
const INSET = "px-5 sm:px-8 lg:px-12";

function Cross({ side }: { side: "left" | "right" }) {
  return (
    <span
      aria-hidden="true"
      className={`sh-cross absolute top-0 h-[11px] w-[11px] -translate-y-1/2 ${
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
    <div aria-hidden="true" className="relative">
      <div className="sh-rule border-t border-dotted border-text/[0.16]" />
      <div className={`relative ${FRAME}`}>
        <Cross side="left" />
        <Cross side="right" />
      </div>
    </div>
  );
}

/* A phrase that rises out of its own mask; React-rendered, so nothing
   rewrites DOM React owns. */
function Phrase({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <span className="inline-block overflow-hidden pb-[0.1em] pr-[0.06em] -mb-[0.1em] -mr-[0.06em] align-top">
      <span className={`sh-phrase inline-block whitespace-nowrap ${className}`}>{children}</span>
    </span>
  );
}

export default function ServicesHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const root = sectionRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let fallback: number | undefined;
    let removeListener: (() => void) | undefined;
    const mm = gsap.matchMedia();

    const ctx = gsap.context(() => {
      /* Same construction order as the other heroes: the frame is drawn,
         then the page furniture, then the headline rises, and the actions
         arrive last so the eye finishes on them. */
      const tl = gsap.timeline({ paused: true });
      tl.fromTo(".sh-frame", { scaleY: 0, transformOrigin: "top center" }, { scaleY: 1, duration: 1.1, ease: "power3.inOut" }, 0)
        .fromTo(".sh-rule", { scaleX: 0, transformOrigin: "left center" }, { scaleX: 1, duration: 1, stagger: 0.12, ease: "power3.inOut" }, 0.05)
        .fromTo(".sh-eyebrow > *, .sh-crumbs", { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.06, ease: "power3.out" }, 0.2)
        .fromTo(".sh-cross", { scale: 0, rotation: -90 }, { scale: 1, rotation: 0, duration: 0.6, stagger: 0.05, ease: "power3.out" }, 0.45)
        .fromTo(".sh-phrase", { yPercent: 110 }, { yPercent: 0, duration: 1.05, stagger: 0.1, ease: "power4.out" }, 0.5)
        .fromTo(".sh-sub", { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, 0.9)
        .fromTo(".sh-intro", { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" }, 1.0)
        .fromTo(".sh-card", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1.4, ease: "power3.out" }, 0.8)
        .fromTo(".sh-row", { opacity: 0, x: 14 }, { opacity: 1, x: 0, duration: 0.7, stagger: 0.1, ease: "power3.out" }, 1.15)
        .fromTo(".sh-card-rule", { scaleX: 0, transformOrigin: "left center" }, { scaleX: 1, duration: 0.9, stagger: 0.1, ease: "power3.inOut" }, 1.1)
        .fromTo(".sh-action", { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.7, stagger: 0.1, ease: "power3.out" }, 1.35)
        .fromTo(".sh-cue", { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }, 1.55);

      /* Scroll depth, as on the About and Contact heroes: the index card
         climbs faster than the headline while the frame stays put. */
      const depth = (target: string, y: number) =>
        gsap.to(target, {
          y,
          ease: "none",
          scrollTrigger: { trigger: root, start: 0, end: "bottom top", scrub: 0.6 },
        });
      depth(".sh-card-depth", -40);
      depth(".sh-head-depth", -15);

      const start = () => tl.play();
      if ((window as unknown as { __skyReady?: boolean }).__skyReady) {
        start();
      } else {
        window.addEventListener(READY_EVENT, start, { once: true });
        fallback = window.setTimeout(start, 4000);
        removeListener = () => window.removeEventListener(READY_EVENT, start);
      }

      /* Desktop with a mouse: the drafting dot-grid resolves under the
         cursor, as on the Contact hero. One CSS mask position per frame —
         no layout, no repaint of the content. */
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
      aria-labelledby="services-heading"
      className="relative isolate overflow-x-clip border-b border-accent bg-surface"
    >
      {/* Cursor-revealed dot grid (desktop, mouse only) */}
      <div
        ref={gridRef}
        aria-hidden="true"
        style={{ opacity: 0 }}
        className="pointer-events-none absolute inset-0 -z-10 transition-opacity duration-500 [background-image:radial-gradient(rgb(0_107_184/0.35)_1px,transparent_1.2px)] [background-size:22px_22px] [mask-image:radial-gradient(260px_circle_at_var(--mx,50%)_var(--my,50%),#000_0%,transparent_75%)]"
      />

      {/* Vertical frame rules */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className={`sh-frame h-full border-x border-dotted border-text/[0.16] ${FRAME}`} />
      </div>

      <div className={`relative ${FRAME}`}>
        {/* Label and breadcrumb each stay on one line; on narrow phones the
            breadcrumb drops below rather than breaking the label. */}
        <div className={`flex flex-wrap items-center justify-between gap-x-6 gap-y-3 pb-6 pt-12 sm:pt-16 ${INSET}`}>
          <p className="sh-eyebrow flex items-center gap-3 whitespace-nowrap">
            <span aria-hidden="true" className="block h-px w-8 bg-primary" />
            <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-primary sm:text-xs">
              Our Services
            </span>
          </p>

          <nav aria-label="Breadcrumb" className="sh-crumbs">
            <ol className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em]">
              <li>
                <Link href="/" className="text-text/65 transition-colors duration-300 hover:text-primary">
                  Home
                </Link>
              </li>
              <li aria-hidden="true" className="text-text/35">/</li>
              <li aria-current="page" className="text-text">Services</li>
            </ol>
          </nav>
        </div>
      </div>

      <Rule />

      <div className={`relative ${FRAME}`}>
        <div
          /* minmax(0,1fr) on phones: without it the single column grows to the
             card's unbreakable width and spills past the frame. */
          className={`grid grid-cols-[minmax(0,1fr)] items-center gap-12 py-14 sm:py-20 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-14 lg:py-24 ${INSET}`}
        >
          {/* Headline, promise and actions */}
          <div className="sh-head-depth services-hero-head">
            {/* The three phrases are the three pillars, in the order the page
                presents them: build, automate, grow. */}
            <h1 id="services-heading" className="services-h1">
              <span className="block text-text/[0.88]">
                <Phrase>Build Better.</Phrase>
              </span>
              <span className="block">
                <Phrase className="text-text/[0.58]">Automate Smarter.</Phrase>
              </span>
              <span className="block">
                <Phrase className="text-primary">Grow Faster.</Phrase>
              </span>
            </h1>

            <p className="sh-sub mt-7 font-display text-lg font-medium leading-snug tracking-[-0.015em] text-text [text-wrap:balance] sm:text-xl lg:text-[1.375rem]">
              Technology, Design &amp; Digital Growth — All Under One Roof.
            </p>

            <p className="sh-intro mt-5 max-w-xl text-base leading-relaxed text-text/70 [text-wrap:pretty] sm:text-lg">
              At SKY Tech, we help businesses, organizations and growing brands
              turn ideas into digital solutions that work.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-4">
              <a
                href="#what-we-do"
                className="sh-action group relative isolate flex min-h-[56px] items-center justify-between gap-4 overflow-hidden rounded-full bg-primary py-2 pl-6 pr-2 text-[13px] font-semibold uppercase tracking-[0.1em] text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
              >
                <span aria-hidden="true" className="absolute inset-0 -z-10 origin-left scale-x-0 bg-navy transition-transform duration-500 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100 group-focus-visible:scale-x-100" />
                Explore Our Services
                <span aria-hidden="true" className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15">
                  <svg viewBox="0 0 16 16" className="h-[13px] w-[13px] rotate-90 transition-transform duration-500 group-hover:translate-y-0.5" fill="none">
                    <path d="M3 8h9.5M8.5 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </a>

              <Link
                href="/contact"
                className="sh-action group relative inline-flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-text/75 transition-colors duration-300 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary sm:text-xs"
              >
                Talk to Our Team
                <svg viewBox="0 0 16 16" className="h-[13px] w-[13px] transition-transform duration-500 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1" fill="none" aria-hidden="true">
                  <path d="M3 8h9.5M8.5 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span aria-hidden="true" className="absolute inset-x-0 -bottom-1 h-px origin-left scale-x-0 bg-primary transition-transform duration-500 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100 group-focus-visible:scale-x-100" />
              </Link>
            </div>
          </div>

          {/* Service index — the page's contents, and its first navigation */}
          <div className="sh-card-depth">
            <nav
              aria-label="Service pillars"
              className="sh-card relative isolate overflow-hidden rounded-[26px] border border-white/[0.09] bg-navy shadow-[0_2px_4px_rgb(18_18_18/0.06),0_44px_88px_-44px_rgb(11_31_53/0.6)]"
            >
              {/* Drafting grid, as on the Contact panel: the construction
                  lines showing through the card, strongest at the top-right
                  corner and gone before they reach the copy. */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -z-10 opacity-[0.09] [background-image:linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] [background-size:28px_28px] [mask-image:radial-gradient(120%_80%_at_100%_0%,#000_0%,transparent_70%)]"
              />

              {/* Header band */}
              <div className="flex items-center justify-between gap-4 border-b border-white/[0.1] bg-white/[0.04] px-6 py-4 sm:px-7">
                <p className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em] text-white/75">
                  <span aria-hidden="true" className="block h-2 w-2 bg-cta" />
                  Service Index
                </p>
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/50">
                  {TOTAL_SERVICES} Services
                </p>
              </div>

              <ul className="px-6 sm:px-7">
                {PILLARS.map((pillar) => (
                  <li key={pillar.index} className="sh-row relative">
                    <a
                      href={pillarHref(pillar.anchor)}
                      className="group flex items-start gap-4 py-5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cta"
                    >
                      <span aria-hidden="true" className="mt-[3px] font-mono text-[11px] tracking-[0.14em] text-white/50 transition-colors duration-300 group-hover:text-cta">
                        {pillar.index}
                      </span>

                      <span className="min-w-0 flex-1">
                        <span className="block font-display text-[1.05rem] font-medium leading-snug tracking-[-0.015em] text-white transition-colors duration-300 group-hover:text-cta sm:text-[1.15rem]">
                          {pillar.name}
                        </span>
                        <span className="mt-1.5 block text-[13px] leading-relaxed text-white/60">
                          {pillar.short}
                        </span>
                      </span>

                      <span
                        aria-hidden="true"
                        className="mt-[2px] flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/15 text-white/50 transition-colors duration-300 group-hover:border-cta group-hover:text-cta"
                      >
                        <svg viewBox="0 0 16 16" className="h-3 w-3 rotate-90" fill="none">
                          <path d="M3 8h9.5M8.5 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                    </a>

                    <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px bg-white/[0.08]">
                      <span className="sh-card-rule absolute inset-0 bg-white/[0.16]" />
                    </span>
                  </li>
                ))}
              </ul>

              {/* Footer note */}
              <p className="px-6 py-5 text-[13px] leading-relaxed text-white/60 sm:px-7">
                Not sure where to start?{" "}
                <Link
                  href="/contact?type=consultation#contact-form"
                  className="font-medium text-cta underline decoration-cta/30 underline-offset-4 transition-colors duration-300 hover:decoration-cta focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cta"
                >
                  Book a free consultation
                </Link>{" "}
                and we&apos;ll map it out with you.
              </p>
            </nav>
          </div>
        </div>
      </div>

      <Rule />

      <div className={`relative ${FRAME}`}>
        <div className={`sh-cue pb-12 pt-6 sm:pb-16 ${INSET}`}>
          <a
            href="#what-we-do"
            className="group inline-flex items-center gap-4 font-mono text-[11px] uppercase tracking-[0.22em] text-text/70 transition-colors duration-300 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
          >
            What We Do
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
