"use client";

import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { serviceHref, type Pillar, type Service } from "@/lib/pillars";
import { Motif, bleedFor, identityFor } from "@/components/services/pillarIdentity";

// Runs before paint on the client so the reveal never flashes its end state.
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/* The site's drafting frame, shared with the hero and What We Do. */
const FRAME = "mx-4 sm:mx-6 lg:mx-8 xl:mx-auto xl:max-w-6xl";
const INSET = "px-5 sm:px-8 lg:px-12";

function ServiceCard({
  service,
  position,
  total,
  defaultOpen,
  onToggle,
}: {
  service: Service;
  position: number;
  total: number;
  defaultOpen: boolean;
  onToggle: () => void;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const panelId = useId();
  const number = String(position).padStart(2, "0");

  return (
    <li
      data-open={open}
      className="sp-card pillar-card rounded-[24px] border border-text/[0.07] p-6 sm:p-8"
    >
      <span aria-hidden="true" className="pillar-edge" />
      <span aria-hidden="true" className="pillar-wash" />

      <div className="flex items-baseline gap-4">
        <span
          aria-hidden="true"
          className="pillar-num font-mono text-[13px] tracking-[0.18em] text-text/30 transition-colors duration-500"
        >
          {number}
        </span>
        <h3 className="font-display text-[1.3rem] font-medium leading-snug tracking-[-0.02em] text-text sm:text-[1.5rem]">
          {service.name}
        </h3>
      </div>

      <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-text/70 [text-wrap:pretty] sm:text-base">
        {service.summary}
      </p>

      {/* What We Offer — collapsed by default except on the first service,
          so the pillar reads as a list rather than a wall of text. */}
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => {
          setOpen((v) => !v);
          onToggle();
        }}
        className="mt-6 flex w-full items-center gap-3 border-t border-text/[0.08] pt-5 text-left font-mono text-[11px] uppercase tracking-[0.2em] text-text/60 transition-colors duration-300 hover:text-[var(--pil-ink)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--pil-ink)]"
      >
        <span
          aria-hidden="true"
          className="svc-mark relative block h-[11px] w-[11px] shrink-0 text-[var(--pil-ink)]"
        >
          <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-current" />
          <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-current" />
        </span>
        What We Offer
        <span
          aria-hidden="true"
          className="ml-auto rounded-full border border-text/10 px-2.5 py-1 font-mono text-[10.5px] tracking-[0.14em] text-text/45"
        >
          {service.offers.length}
        </span>
      </button>

      <div id={panelId} className="svc-panel" data-open={open} {...(open ? {} : { inert: true })}>
        <div>
          <ul className="grid gap-x-8 gap-y-2.5 pt-5 sm:grid-cols-2">
            {service.offers.map((offer) => (
              <li key={offer} className="flex items-baseline gap-3 text-[14.5px] leading-snug text-text/70">
                <span
                  aria-hidden="true"
                  className="mt-[2px] block h-1.5 w-1.5 shrink-0 rotate-45 bg-[var(--pil-dot)]"
                />
                {offer}
              </li>
            ))}
          </ul>

          <a
            href={serviceHref(service)}
            className="group/link -mb-3.5 mt-3.5 inline-flex items-center gap-3 py-3.5 font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--pil-ink)] transition-colors duration-300 hover:text-navy focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--pil-ink)]"
          >
            Explore {service.name}
            <svg viewBox="0 0 16 16" className="h-[13px] w-[13px] transition-transform duration-500 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover/link:translate-x-1" fill="none" aria-hidden="true">
              <path d="M3 8h9.5M8.5 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>
      </div>

      <span className="sr-only">
        Service {position} of {total}
      </span>
    </li>
  );
}

export default function ServicePillar({
  pillar,
  tone = "surface",
}: {
  pillar: Pillar;
  /* Sections alternate between the two grounds the site already uses, so
     each pillar separates from the one above it. */
  tone?: "surface" | "bg";
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(1);
  const total = pillar.services.length;
  const identity = identityFor(pillar.index);

  useIsomorphicLayoutEffect(() => {
    const root = sectionRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>(".sp-card");

      /* Which service the panel reports: whichever card the reading line —
         45% down the viewport — is currently inside. Past the last card the
         line runs off the end of the section, so it falls back to the last
         card it has already passed; that is what lets the final service be
         reported even though the section runs out of scroll before its top
         could reach the line.

         Positions are cached whenever ScrollTrigger refreshes (including
         after a panel opens and changes the heights) rather than measured
         every frame, and the index only reaches React when it actually
         changes — so scrolling costs no layout reads and no re-renders. */
      let bounds: Array<{ top: number; bottom: number }> = [];
      let last = 1;

      ScrollTrigger.create({
        trigger: root,
        start: "top bottom",
        end: "bottom top",
        onRefresh: () => {
          const offset = window.scrollY;
          bounds = cards.map((c) => {
            const rect = c.getBoundingClientRect();
            return { top: rect.top + offset, bottom: rect.bottom + offset };
          });
        },
        onUpdate: () => {
          if (!bounds.length) return;
          const line = window.scrollY + window.innerHeight * 0.45;

          let index = bounds.findIndex((b) => line >= b.top && line < b.bottom);
          if (index === -1) {
            index = 0;
            for (let i = 0; i < bounds.length; i += 1) {
              if (bounds[i].top <= line) index = i;
            }
          }

          if (index + 1 !== last) {
            last = index + 1;
            setActive(last);
          }
        },
      });

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const tl = gsap.timeline({
        scrollTrigger: { trigger: root, start: "top 72%", once: true },
      });
      tl.fromTo(".sp-panel", { opacity: 0, y: 26 }, { opacity: 1, y: 0, duration: 1 }, 0)
        .fromTo(".sp-line", { scaleX: 0, transformOrigin: "left center" }, { scaleX: 1, duration: 0.55 }, 0.18)
        .fromTo(".sp-label", { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.55 }, 0.22)
        .fromTo(".sp-heading", { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", duration: 0.85, ease: "power3.inOut" }, 0.28)
        .fromTo(".pillar-motif", { opacity: 0, scale: 0.88, transformOrigin: "78% 82%" }, { opacity: 0.16, scale: 1, duration: 1.4 }, 0.3)
        .fromTo(".sp-intro", { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.7, stagger: 0.08 }, 0.44)
        .fromTo(".sp-card", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.9, stagger: 0.1 }, 0.48);
    }, root);

    return () => ctx.revert();
  }, []);

  /* Opening or closing a panel changes the page height, so every scroll
     range below this section has to be re-measured — otherwise the sections
     further down animate against positions that no longer exist. The
     transition runs for 0.55s; one refresh once it has settled is enough. */
  const refreshAfterToggle = () => {
    window.setTimeout(() => ScrollTrigger.refresh(), 600);
  };

  /* The pillar's accent reaches the CSS through these.

     --pil-spark is the identity colour, used only where the ground is dark
     or the element is decorative. --pil-ink is what carries text and focus
     rings on the light cards, and stays brand blue on every pillar: cyan on
     a light ground measures about 2:1 and cannot legibly carry copy. Colour
     identity therefore lives in the panel, where the ground is navy. */
  const bleed = bleedFor(identity);
  const style = {
    "--pil-spark": bleed.lead,
    "--pil-spark-2": bleed.support,
    "--pil-ink": "#006bb8",
    "--pil-glow": "#00c2ff",
    "--pil-dot": "#006bb8",
  } as CSSProperties;

  return (
    <section
      ref={sectionRef}
      id={pillar.anchor.replace(/^#/, "")}
      aria-labelledby={`pillar-${pillar.index}-heading`}
      style={style}
      className={`sky-anchor relative isolate overflow-x-clip border-b border-accent ${
        tone === "bg" ? "bg-bg" : "bg-surface"
      }`}
    >
      {/* Vertical frame rules */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className={`h-full border-x border-dotted border-text/[0.16] ${FRAME}`} />
      </div>

      <div className={`relative ${FRAME}`}>
        <div className={`grid gap-10 py-20 sm:py-24 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] lg:gap-12 lg:py-28 ${INSET}`}>
          {/* Pillar panel. Native sticky, not a GSAP pin: it adds no scroll
              length, so nothing below this section shifts position. */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            {/* A shared minimum height on desktop: pillar 01 carries no intro
                copy in the content, and without it its panel would read as a
                thinner object than the other two. */}
            <div
              data-bleed={identity.bleed}
              className="sp-panel pillar-panel flex flex-col p-7 text-white sm:p-9 lg:min-h-[26rem]"
            >
              <Motif kind={identity.motif} className="pillar-motif" />

              <p className="flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="sp-line block h-px w-8"
                  style={{ backgroundColor: identity.label }}
                />
                <span
                  className="sp-label font-mono text-[11px] uppercase tracking-[0.22em] sm:text-xs"
                  style={{ color: identity.label }}
                >
                  Pillar {pillar.index}
                </span>
              </p>

              <h2
                id={`pillar-${pillar.index}-heading`}
                className="sp-heading mt-6 text-[1.85rem] font-semibold leading-[1.06] tracking-[-0.03em] sm:text-[2.3rem] lg:text-[2.5rem]"
              >
                {pillar.name}
              </h2>

              {pillar.introHeading && (
                <p className="sp-intro mt-6 font-display text-[1.05rem] font-medium leading-snug tracking-[-0.015em] text-white/90 [text-wrap:balance] sm:text-lg">
                  {pillar.introHeading}
                </p>
              )}

              {pillar.introParagraphs?.map((paragraph) => (
                <p key={paragraph} className="sp-intro mt-4 max-w-md text-[14.5px] leading-relaxed text-white/80 [text-wrap:pretty]">
                  {paragraph}
                </p>
              ))}

              {/* Where you are within the pillar, driven by scroll position. */}
              <div className="sp-intro mt-9 hidden lg:mt-auto lg:block lg:pt-10">
                <div className="flex items-baseline justify-between gap-4 font-mono text-[11px] uppercase tracking-[0.18em] text-white/75">
                  <span>
                    <span className="text-white">{String(active).padStart(2, "0")}</span>
                    {" / "}
                    {String(total).padStart(2, "0")}
                  </span>
                  <span>Services</span>
                </div>
                <span aria-hidden="true" className="mt-3 block h-px w-full bg-white/15">
                  <span
                    className="pillar-progress block h-px"
                    style={{ width: `${(active / total) * 100}%` }}
                  />
                </span>
              </div>
            </div>
          </div>

          {/* The services */}
          <ul className="grid gap-5 lg:gap-6">
            {pillar.services.map((service, i) => (
              <ServiceCard
                key={service.name}
                service={service}
                position={i + 1}
                total={total}
                defaultOpen={i === 0}
                onToggle={refreshAfterToggle}
              />
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
