"use client";

import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { useLenis } from "lenis/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { serviceHref, type Pillar, type Service } from "@/lib/pillars";
import { useMediaQuery } from "@/lib/useMediaQuery";
import { Motif, bleedFor, identityFor } from "@/components/services/pillarIdentity";

// Runs before paint on the client so the reveal never flashes its end state.
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/* Desktop is the two-column layout: sticky panel beside the list. Below it
   the pillar becomes a deck — see the CSS under "Pillar deck". */
const DESKTOP = "(min-width: 1024px)";
const DECK = "(max-width: 1023px)";
const STACKING = "(max-width: 1023px) and (prefers-reduced-motion: no-preference)";

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
  onToggle: (card: HTMLLIElement, opening: boolean) => void;
}) {
  const cardRef = useRef<HTMLLIElement>(null);
  /* The first service opens by default on desktop, where the list sits
     beside the panel. On phones and tablets every card starts closed, so the
     deck stays compact. The server cannot know which it is, so until the
     browser answers the card renders as "auto" and CSS picks the state by
     width — the same result either way, with no flash after hydration. */
  const desktop = useMediaQuery(DESKTOP);
  const [choice, setChoice] = useState<boolean | null>(null);
  const open = choice ?? (defaultOpen ? desktop : false);
  const shown = open ?? true;
  const panelId = useId();
  const number = String(position).padStart(2, "0");

  return (
    <li
      ref={cardRef}
      data-open={open === null ? "auto" : open}
      style={{ "--i": position - 1 } as CSSProperties}
      className="sp-card pillar-card rounded-[24px] border border-text/[0.07] p-6 sm:p-8"
    >
      <span aria-hidden="true" className="pillar-edge" />
      <span aria-hidden="true" className="pillar-wash" />
      <span aria-hidden="true" className="pillar-veil" />

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
        aria-expanded={shown}
        aria-controls={panelId}
        onClick={() => {
          if (cardRef.current) onToggle(cardRef.current, !shown);
          setChoice(!shown);
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

      <div
        id={panelId}
        className="svc-panel"
        data-open={open === null ? "auto" : open}
        {...(shown ? {} : { inert: true })}
      >
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
  const dockMarkRef = useRef<HTMLSpanElement>(null);
  const [active, setActive] = useState(1);
  const [docked, setDocked] = useState(false);
  const total = pillar.services.length;
  const identity = identityFor(pillar.index);
  const lenis = useLenis();

  /* The dock is the panel's footer until it reaches the navbar, then a bar
     of its own. The mark just above it says which. */
  useEffect(() => {
    const mark = dockMarkRef.current;
    if (!mark) return;
    const io = new IntersectionObserver(
      ([e]) => setDocked(!e.isIntersecting && e.boundingClientRect.top < window.innerHeight / 2),
      { rootMargin: "-90px 0px 0px 0px" }
    );
    io.observe(mark);
    return () => io.disconnect();
  }, []);

  useIsomorphicLayoutEffect(() => {
    const root = sectionRef.current;
    if (!root) return;

    const mm = gsap.matchMedia(root);

    /* Phones and tablets: the deck. Cards stick one step below each other
       (CSS), and as each new card slides over the one before, that one
       settles back — a touch smaller, a touch darker — so the stack reads as
       depth rather than as cards colliding.

       Everything is computed from where each card WOULD be without sticky
       (the list's top plus the heights above it), because a stuck card's own
       position says nothing about scroll progress. Heights are re-read when
       any card changes size — opening a panel, fonts, rotation — so scrolling
       itself costs one layout read and only touches styles that changed. */
    mm.add(DECK, () => {
      const list = root.querySelector<HTMLElement>(".sp-deck-list");
      if (!list) return;
      const cards = gsap.utils.toArray<HTMLElement>(".sp-card", root);
      const veils = cards.map((c) => c.querySelector<HTMLElement>(".pillar-veil"));
      const stacking = () => window.matchMedia(STACKING).matches;

      let offsets: number[] = [];
      let heights: number[] = [];
      let tops: number[] = [];
      const shown = cards.map(() => ({ scale: 1, veil: 0 }));
      let last = 0;

      const measure = () => {
        const style = getComputedStyle(list);
        const gap = parseFloat(style.rowGap) || 0;
        let y = parseFloat(style.paddingTop) || 0;
        heights = cards.map((c) => c.offsetHeight);
        offsets = heights.map((h) => {
          const at = y;
          y += h + gap;
          return at;
        });
        /* Each card sticks just below the one before's title, so every
           covered card still shows its number and whole name — one line or
           two. The CSS step is the fallback until this has run. */
        let stack = 0;
        const stacks = cards.map((c) => {
          const at = stack;
          c.style.setProperty("--stack", `${at}px`);
          const title = c.querySelector<HTMLElement>("h3");
          stack += title ? title.offsetTop + title.offsetHeight + 7 : 56;
          return at;
        });
        /* An open card has no sticky top (see the CSS), so the deck's top
           edge is read from any card that does. */
        const probe = cards.findIndex((c) => getComputedStyle(c).top !== "auto");
        const base = probe === -1 ? 0 : parseFloat(getComputedStyle(cards[probe]).top) - stacks[probe];
        tops = stacks.map((at) => base + at);

        /* A stuck card is held inside the list, so as the list's end
           arrives each card is pushed off by its own height — cards of
           different heights would slide into one another on the way out.
           A bottom margin extends each card's reach to exactly where the
           last card rests, so the stack leaves as one piece; the next card
           takes the same margin back, and nothing in the flow moves. */
        const n = cards.length - 1;
        const on = stacking();
        cards.forEach((c, i) => {
          const reach = on && i < n ? Math.round(tops[n] + heights[n] - tops[i] - heights[i]) : 0;
          c.style.marginBottom = reach ? `${reach}px` : "";
          if (i < n) cards[i + 1].style.marginTop = reach ? `${-reach}px` : "";
        });
      };

      const update = () => {
        if (!offsets.length) return;
        const listTop = list.getBoundingClientRect().top;
        const at = offsets.map((o) => listTop + o);
        const stack = stacking();

        /* How far each card is covered by the next one, 0 to 1. */
        const cover = cards.map((c, i) => {
          if (!stack || i === cards.length - 1 || c.dataset.open === "true") return 0;
          const from = tops[i] + heights[i];
          const to = tops[i + 1];
          if (from <= to) return 0;
          return gsap.utils.clamp(0, 1, (from - at[i + 1]) / (from - to));
        });

        let depth = 0;
        for (let i = cards.length - 1; i >= 0; i -= 1) {
          depth = cover[i] ? depth + cover[i] : 0;
          const scale = Math.round((1 - 0.035 * Math.min(depth, 3)) * 1000) / 1000;
          const veil = Math.round(Math.min(depth, 2) * 0.05 * 1000) / 1000;
          if (scale !== shown[i].scale) {
            gsap.set(cards[i], { scale });
            shown[i].scale = scale;
          }
          if (veil !== shown[i].veil && veils[i]) {
            veils[i]!.style.opacity = String(veil);
            shown[i].veil = veil;
          }
        }

        /* The service being read: the last card to reach its place. */
        let current = 0;
        at.forEach((y, i) => {
          if (y <= tops[i] + 1) current = i;
        });
        if (current !== last) {
          last = current;
          setActive(current + 1);
        }
      };

      const resize = new ResizeObserver(() => {
        measure();
        update();
      });
      cards.forEach((c) => resize.observe(c));

      ScrollTrigger.create({
        trigger: list,
        start: "top bottom",
        end: "bottom top",
        onRefresh: () => {
          measure();
          update();
        },
        onUpdate: update,
      });

      return () => {
        resize.disconnect();
        cards.forEach((c) => {
          gsap.set(c, { clearProps: "scale" });
          c.style.removeProperty("--stack");
          c.style.marginTop = "";
          c.style.marginBottom = "";
        });
        veils.forEach((v) => v && (v.style.opacity = ""));
      };
    });

    /* Desktop keeps its own reading line, unchanged. */
    mm.add(DESKTOP, () => {
      const cards = gsap.utils.toArray<HTMLElement>(".sp-card", root);

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
    });

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: root, start: "top 72%", once: true },
      });
      tl.fromTo(".sp-panel, .sp-dock", { opacity: 0, y: 26 }, { opacity: 1, y: 0, duration: 1 }, 0)
        .fromTo(".sp-line", { scaleX: 0, transformOrigin: "left center" }, { scaleX: 1, duration: 0.55 }, 0.18)
        .fromTo(".sp-label", { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.55 }, 0.22)
        .fromTo(".sp-heading", { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", duration: 0.85, ease: "power3.inOut" }, 0.28)
        .fromTo(".pillar-motif", { opacity: 0, scale: 0.88, transformOrigin: "78% 82%" }, { opacity: 0.16, scale: 1, duration: 1.4 }, 0.3)
        .fromTo(".sp-intro", { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.7, stagger: 0.08 }, 0.44)
        .fromTo(".sp-card", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.9, stagger: 0.1 }, 0.48);
    });

    return () => mm.revert();
  }, []);

  /* Opening or closing a panel changes the page height, so every scroll
     range below this section has to be re-measured — otherwise the sections
     further down animate against positions that no longer exist. The
     transition runs for 0.55s; one refresh once it has settled is enough. */
  const refreshAfterToggle = () => {
    window.setTimeout(() => ScrollTrigger.refresh(), 600);
  };

  /* Opening a card in the deck takes it out of the stack (an open card
     scrolls normally, so none of its list is ever hidden under the next
     card). Released from sticky it would jump back to its place in the
     list, which can be well above the screen — so the page first scrolls by
     exactly that distance, and the card stays where the reader's thumb is. */
  const onToggle = (card: HTMLLIElement, opening: boolean) => {
    refreshAfterToggle();
    if (!opening || !window.matchMedia(STACKING).matches) return;
    const list = card.parentElement;
    if (!list) return;

    const style = getComputedStyle(list);
    const gap = parseFloat(style.rowGap) || 0;
    let offset = parseFloat(style.paddingTop) || 0;
    for (const sibling of Array.from(list.children)) {
      if (sibling === card) break;
      offset += (sibling as HTMLElement).offsetHeight + gap;
    }
    const natural = list.getBoundingClientRect().top + offset;
    const delta = natural - card.getBoundingClientRect().top;
    if (delta > -1) return;

    const target = window.scrollY + delta;
    if (lenis) lenis.scrollTo(target, { immediate: true, force: true });
    else window.scrollTo({ top: target, behavior: "instant" });
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
        <div className={`grid gap-0 py-20 sm:py-24 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] lg:gap-12 lg:py-28 ${INSET}`}>
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

          {/* The services. Below desktop the dock heads the list: the
              panel's footer at first, then — once the panel has scrolled
              away — a bar pinned under the navbar that keeps the pillar's
              name and the reader's place in view while the cards stack. It
              repeats what the panel says, so it is hidden from assistive
              tech. */}
          <div className="sp-deck">
            <span ref={dockMarkRef} aria-hidden="true" className="block h-0 lg:hidden" />
            <div aria-hidden="true" data-bleed={identity.bleed} data-docked={docked} className="sp-dock lg:hidden">
              <span className="font-mono text-[11px] tracking-[0.18em]" style={{ color: identity.label }}>
                {pillar.index}
              </span>
              <span className="sp-dock-title">
                <span className="sp-dock-rest">Services</span>
                <span className="sp-dock-name">{pillar.name}</span>
              </span>
              <span className="shrink-0 font-mono text-[11px] tracking-[0.18em] text-white/70">
                <span className="text-white">{String(active).padStart(2, "0")}</span>
                {" / "}
                {String(total).padStart(2, "0")}
              </span>
              <span className="sp-dock-track">
                <span className="pillar-progress block h-px" style={{ width: `${(active / total) * 100}%` }} />
              </span>
            </div>

            <ul className="sp-deck-list grid gap-5 pt-5 lg:gap-6 lg:pt-0">
              {pillar.services.map((service, i) => (
                <ServiceCard
                  key={service.name}
                  service={service}
                  position={i + 1}
                  total={total}
                  defaultOpen={i === 0}
                  onToggle={onToggle}
                />
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
