"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { Words } from "@/components/service/parts";

// Runs before paint on the client so the reveal never flashes its end state.
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/* The site's drafting frame, shared with the rest of the page. */
const FRAME = "mx-4 sm:mx-6 lg:mx-8 xl:mx-auto xl:max-w-6xl";
const INSET = "px-5 sm:px-8 lg:px-12";

/* The ten client types, worded exactly as in src/content/services/main.md and
   in the order the content's two columns read across. */
const CLIENTS = [
  "Startups",
  "Service-based businesses",
  "Small and medium-sized businesses",
  "Personal brands",
  "Corporate organizations",
  "Women-led businesses",
  "NGOs and social organizations",
  "Educational institutions",
  "E-commerce businesses",
  "Growing digital ventures",
] as const;

export default function WhoWeWorkWith() {
  const sectionRef = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    const root = sectionRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: root, start: "top 78%", once: true },
      });
      tl.fromTo(".ww-line", { scaleX: 0, transformOrigin: "left center" }, { scaleX: 1, duration: 0.55 }, 0)
        .fromTo(".ww-eyebrow, .ww-count", { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.55, stagger: 0.06 }, 0.06)
        .fromTo(".ww-heading", { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", duration: 0.85, ease: "power3.inOut" }, 0.12)
        .fromTo(".ww-intro", { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.7 }, 0.3)
        /* Each entry uncovers from the left along its own rule, so the list
           builds like an index being typed out rather than fading in. */
        .fromTo(".ww-entry", { opacity: 0, x: -14 }, { opacity: 1, x: 0, duration: 0.6, stagger: 0.05 }, 0.38);
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="who-we-work-with"
      aria-labelledby="who-we-work-with-heading"
      className="sky-anchor relative isolate overflow-x-clip border-b border-accent bg-bg"
    >
      {/* Vertical frame rules */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className={`h-full border-x border-dotted border-text/[0.16] ${FRAME}`} />
      </div>

      <div className={`relative ${FRAME}`}>
        <div className={`py-20 sm:py-24 lg:py-28 ${INSET}`}>
          <div className="flex items-start justify-between gap-6">
            <p className="flex items-center gap-3">
              <span aria-hidden="true" className="ww-line block h-px w-8 bg-primary" />
              <span className="ww-eyebrow font-mono text-[11px] uppercase tracking-[0.22em] text-primary sm:text-xs">
                05
              </span>
            </p>
            <span aria-hidden="true" className="ww-count shrink-0 font-mono text-[11px] uppercase tracking-[0.18em] text-text/45">
              {CLIENTS.length} Client Types
            </span>
          </div>

          <h2
            id="who-we-work-with-heading"
            className="ww-heading mt-8 max-w-3xl text-[2.2rem] font-semibold leading-[1.04] tracking-[-0.028em] text-text sm:text-[3rem] lg:text-[3.4rem]"
          >
            Who We Work With
          </h2>

          <p className="ww-intro mt-6 max-w-xl text-base leading-relaxed text-text/70 [text-wrap:pretty] sm:text-lg">
            We support a wide range of clients, including:
          </p>

          {/* Set large, because the range of clients is a claim in its own
              right. Two columns on desktop so ten entries stay on one screen
              instead of becoming a scroll of their own. Phones get two
              columns as well — a compact grid of cells, number above name. */}
          <ul className="ww-index mt-14 max-sm:mt-10 max-sm:grid max-sm:grid-cols-2 lg:mt-16 lg:grid lg:grid-cols-2 lg:gap-x-14">
            {CLIENTS.map((client, i) => (
              <li
                key={client}
                className="ww-entry relative flex items-baseline gap-5 py-5 max-sm:flex-col max-sm:gap-2 max-sm:py-4 max-sm:odd:pr-4 max-sm:even:border-l max-sm:even:border-l-text/10 max-sm:even:pl-4 sm:gap-6 sm:py-6"
              >
                <span aria-hidden="true" className="shrink-0 font-mono text-[11px] tracking-[0.18em] text-text/30">
                  {String(i + 1).padStart(2, "0")}
                </span>

                <span className="min-w-0 flex-1 font-display text-[1.25rem] font-medium max-sm:text-[1.02rem] leading-snug tracking-[-0.02em] [text-wrap:balance] sm:text-[1.5rem] lg:text-[1.65rem]">
                  {/* Phones only: the desktop wrap is left exactly as it was. */}
                  <Words text={client} nowrap="max-sm:whitespace-nowrap" />
                </span>

                <svg
                  aria-hidden="true"
                  viewBox="0 0 16 16"
                  className="ww-arrow h-[14px] w-[14px] shrink-0 self-center text-primary max-sm:hidden"
                  fill="none"
                >
                  <path d="M3 8h9.5M8.5 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
