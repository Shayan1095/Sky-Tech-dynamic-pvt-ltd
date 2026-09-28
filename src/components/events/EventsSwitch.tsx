"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useLenis } from "lenis/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { FRAME, INSET } from "@/components/service/parts";

/* Corporate and weddings, as two halves of one page.

   These are two audiences with nothing in common: someone booking a
   conference for four hundred people and someone booking a Barat shoot.
   Stacked, each would scroll through the other's content to reach their own,
   and the page would read as twice as long as it is. Switched, a visitor
   chooses in one click and reads half of it.

   Both halves stay in the document. The hidden one is hidden with the
   `hidden` attribute, which takes it out of the accessibility tree and out of
   tab order but leaves it in the HTML, so search engines still index the
   wedding prices even when corporate is the side showing.

   This is the only client component on the page. The two panels are server
   components passed in as children, so choosing a side costs no JavaScript
   beyond the toggle itself — there is nothing to hydrate inside them. */

const TABS = [
  { id: "corporate", label: "Corporate & Institutional", hint: "Conferences, launches, graduations" },
  { id: "weddings", label: "Weddings & Celebrations", hint: "Packages with published prices" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function EventsSwitch({
  corporate,
  weddings,
}: {
  corporate: ReactNode;
  weddings: ReactNode;
}) {
  const [active, setActive] = useState<TabId>("corporate");
  const panelsRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const lenis = useLenis();
  /* The first render is the page arriving, which the sections animate for
     themselves. Only a deliberate change should play the swap. */
  const changed = useRef(false);

  /* The site header is sticky and its height changes with the viewport (the
     contact strip above the nav is not on phones). Rather than hard-code an
     offset that would be wrong at some width and drift the day the header
     changes, measure it and keep the switch directly beneath it. */
  useEffect(() => {
    const bar = barRef.current;
    const header = document.querySelector("header");
    if (!bar || !header) return;
    const apply = () => {
      bar.style.top = `${Math.round(header.getBoundingClientRect().height)}px`;
    };
    apply();
    const ro = new ResizeObserver(apply);
    ro.observe(header);
    return () => ro.disconnect();
  }, []);

  /* Arriving at #weddings — from the hero's own link, or from a shared URL —
     has to select that side, or the anchor lands on a hidden panel. */
  useEffect(() => {
    const fromHash = () => {
      const id = window.location.hash.replace("#", "");
      if (id === "weddings" || id === "corporate") {
        changed.current = false;
        setActive(id);
      }
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, []);

  useEffect(() => {
    if (!changed.current) return;
    const root = panelsRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const shown = root.querySelector<HTMLElement>("[data-panel]:not([hidden])");
    if (!shown) return;
    /* Short and quiet: this is a filter, not an entrance. Opacity and
       transform only. */
    const tween = gsap.fromTo(
      shown,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.45, ease: "power2.out" }
    );
    return () => {
      tween.kill();
      gsap.set(shown, { clearProps: "opacity,transform" });
    };
  }, [active]);

  /* Swapping panels changes the document's height by a couple of thousand
     pixels. Two things are holding a stale number when that happens: Lenis,
     which caches how far the page can scroll, and ScrollTrigger, which has
     measured every trigger below this point — the footer's back-to-top among
     them. Told on the frame after the swap, once the new panel has laid out.

     A reader who was some way down the old panel is also carried to the same
     offset in the new one, which has nothing to do with where they were. If
     they are past the switch, they are put back on it, so the side they just
     chose starts at its beginning. */
  useEffect(() => {
    if (!changed.current) return;
    const bar = barRef.current;

    const panels = panelsRef.current;

    const frame = requestAnimationFrame(() => {
      lenis?.resize();
      ScrollTrigger.refresh();

      if (!bar || !panels) return;

      /* Measured on the panels wrapper, never on the bar. The bar is sticky,
         and a stuck element's rect always reports its stuck position — so
         `rect.top + scrollY` on it is scrollY plus the offset, every time,
         which makes any comparison against it meaningless. The wrapper is in
         normal flow and its document position is real. */
      const headerHeight = parseFloat(bar.style.top) || 0;
      const barHeight = bar.getBoundingClientRect().height;
      const target = Math.max(
        0,
        panels.getBoundingClientRect().top + window.scrollY - headerHeight - barHeight
      );

      /* Already at or above the start of the panels: leave the reader alone. */
      if (window.scrollY <= target + 1) return;

      if (lenis) lenis.scrollTo(target, { immediate: true, force: true });
      else window.scrollTo({ top: target, behavior: "instant" });
    });

    return () => cancelAnimationFrame(frame);
  }, [active, lenis]);

  const choose = (id: TabId) => {
    if (id === active) return;
    changed.current = true;
    setActive(id);
  };

  /* Left and right arrows move between tabs, as a tablist should. */
  const onKeyDown = (event: React.KeyboardEvent) => {
    const i = TABS.findIndex((t) => t.id === active);
    if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
      event.preventDefault();
      const next = TABS[(i + (event.key === "ArrowRight" ? 1 : TABS.length - 1)) % TABS.length];
      choose(next.id);
      document.getElementById(`tab-${next.id}`)?.focus();
    }
  };

  return (
    <>
      {/* The switch sticks under the header, so the choice can be changed
          from anywhere in either side without scrolling back. */}
      {/* Opaque, and no backdrop blur.

          A blurred translucent bar looks expensive and is: backdrop-filter on
          a sticky element the full width of the viewport makes the compositor
          re-rasterise that strip on every single scroll frame, and the whole
          page stutters for it. The site's own header is sticky and opaque for
          exactly this reason; this matches it. */}
      <div ref={barRef} className="sticky top-0 z-30 border-y border-text/10 bg-bg">
        <div className={`relative ${FRAME}`}>
          {/* Centred on the page, not pushed left by the label beside it.
              A flex row with `justify-between` puts the switch wherever the
              other child leaves room, so it sits off-centre at exactly the
              widths where the label is visible. Three columns with the switch
              in the middle one centres it against the page, and the label
              takes the right column without moving it — a fixed position
              rather than a consequence of what is next to it. */}
          <div
            className={`flex flex-col items-center gap-3 py-3 lg:grid lg:grid-cols-[1fr_auto_1fr] lg:items-center lg:gap-x-8 ${INSET}`}
          >
            {/* One track holding both tabs, with a single navy block that
                slides between them. Two separate pills fading in and out read
                as two buttons; one indicator that travels reads as a control
                with a position — and the movement itself says the two sides
                are alternatives rather than a list. */}
            <div
              role="tablist"
              aria-label="Which kind of event"
              onKeyDown={onKeyDown}
              /* Equal columns, deliberately. Sized to their own content the
                 two tabs come out 265px and 248px, and a half-width
                 indicator then sits eight pixels off the second one — close
                 enough to look like a mistake rather than a design. Equal
                 halves make "half the track" and "one tab" the same distance,
                 so the indicator lands exactly, at any label length. */
              className="relative isolate grid w-full grid-cols-2 rounded-full border border-text/12 bg-[color-mix(in_srgb,var(--color-navy)_4%,var(--color-bg))] p-1 sm:w-auto lg:col-start-2"
            >
              <span
                aria-hidden="true"
                className="absolute inset-y-1 left-1 -z-10 w-[calc(50%-0.25rem)] rounded-full bg-navy shadow-[0_1px_2px_rgb(11_31_53/0.25),0_10px_24px_-12px_rgb(11_31_53/0.7)] transition-transform duration-500 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
                style={{ transform: `translateX(${active === "corporate" ? "0%" : "100%"})` }}
              />

              {TABS.map((tab) => {
                const on = tab.id === active;
                return (
                  <button
                    key={tab.id}
                    id={`tab-${tab.id}`}
                    type="button"
                    role="tab"
                    aria-selected={on}
                    aria-controls={`panel-${tab.id}`}
                    tabIndex={on ? 0 : -1}
                    onClick={() => choose(tab.id)}
                    className={`relative rounded-full px-4 py-2.5 text-left transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary sm:px-7 ${
                      on ? "text-white" : "text-text/70 hover:text-primary"
                    }`}
                  >
                    <span className="block font-mono text-[10.5px] uppercase tracking-[0.16em] sm:text-[11px]">
                      {tab.label}
                    </span>
                    <span
                      className={`mt-0.5 block text-[11px] leading-tight transition-colors duration-300 sm:text-[11.5px] ${
                        on ? "text-white/70" : "text-text/55"
                      }`}
                    >
                      {tab.hint}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Which side is showing, said once in words — the indicator is a
                position, and a position is not an announcement. */}
            <p className="hidden font-mono text-[10.5px] uppercase tracking-[0.18em] text-text/65 lg:col-start-3 lg:block lg:justify-self-end">
              {active === "corporate" ? "Corporate programme" : "Published package prices"}
            </p>
          </div>
        </div>
      </div>

      <div ref={panelsRef}>
        <div
          data-panel
          id="panel-corporate"
          role="tabpanel"
          aria-labelledby="tab-corporate"
          hidden={active !== "corporate"}
        >
          {corporate}
        </div>
        <div
          data-panel
          id="panel-weddings"
          role="tabpanel"
          aria-labelledby="tab-weddings"
          hidden={active !== "weddings"}
        >
          {weddings}
        </div>
      </div>
    </>
  );
}
