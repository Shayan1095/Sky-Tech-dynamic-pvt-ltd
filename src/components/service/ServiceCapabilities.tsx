"use client";

import Link from "next/link";
import { useId, useRef, useState, type KeyboardEvent } from "react";
import { capabilityLists, type ServiceCapability, type ServicePage } from "@/lib/service-pages/types";
import { Arrow, FRAME, FrameRules, INSET, Rich, SectionLabel, packageHref, quoteHref, Words } from "./parts";
import { useSectionReveal, type RevealBuilder } from "./useSectionReveal";

/* Section 05 — beyond the packages.

   The page's one navy band, and a deliberate change of scale: this is the
   offer for buyers whose project doesn't fit a package, so it is set apart
   from everything around it.

   One or two offers (Web Development's marketplace, WordPress's redesign)
   each get the full band: the offer on the left, and what it can include
   drawn as a system board on the right — each module a cell on a shared
   grid, with a node that powers on as the board arrives.

   Three or more (UI/UX Design's website, mobile app, dashboard and audit
   specialisms) share one band, as tabs: a band per offer would add a screen
   of scrolling each, and a visitor wants the one that matches their
   project, not all of them in turn. Every panel stays in the page for
   search engines and assistive tech; only the chosen one is shown. */

const build: RevealBuilder<HTMLElement> = (tl) => {
  tl.fromTo(".svc2-head > *", { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.08 }, 0)
    .fromTo(".svc2-heading", { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", duration: 0.9, ease: "power3.inOut" }, 0.1)
    .fromTo(".svc2-cell", { opacity: 0 }, { opacity: 1, duration: 0.5, stagger: { each: 0.045, grid: "auto", from: "start" } }, 0.35)
    .fromTo(".svc2-node", { scale: 0.4, backgroundColor: "rgba(255,255,255,0.2)" }, { scale: 1, backgroundColor: "#00c2ff", duration: 0.45, stagger: 0.045, ease: "power3.out" }, 0.5);
};

const buildTabs: RevealBuilder<HTMLElement> = (tl) => {
  tl.fromTo(".svc3-head > *", { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.08 }, 0)
    .fromTo(".svc3-tab", { opacity: 0, x: -12 }, { opacity: 1, x: 0, duration: 0.6, stagger: 0.06 }, 0.2)
    .fromTo(".svc3-stage", { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.9 }, 0.35);
};

/* The background every navy band shares. */
function BandGround() {
  return (
    <>
      {/* Light enters from the top-left corner, the same bleed the pillar
          panels on the Services page carry. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 [background-image:radial-gradient(90%_70%_at_0%_0%,rgb(0_107_184/0.55),transparent_62%),radial-gradient(60%_60%_at_100%_100%,rgb(0_194_255/0.12),transparent_60%)]"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.08] [background-image:linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] [background-size:32px_32px] [mask-image:radial-gradient(110%_80%_at_0%_0%,#000_0%,transparent_72%)]"
      />
      <FrameRules tone="light" />
    </>
  );
}

function PriceBlock({ cap }: { cap: ServiceCapability }) {
  if (!cap.price) return null;
  return (
    <div className="mt-10 border-t border-white/15 pt-7">
      {cap.priceLabel && <p className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-white/55">{cap.priceLabel}</p>}
      <p className="mt-2 font-mono text-[2.6rem] leading-none tracking-[-0.02em] text-white sm:text-[3rem]">{cap.price}</p>
      {cap.priceNote && <p className="mt-4 max-w-md text-[14px] leading-relaxed text-white/70 [text-wrap:pretty]">{cap.priceNote}</p>}
    </div>
  );
}

function CapabilityCta({ page, cap, className = "mt-10" }: { page: ServicePage; cap: ServiceCapability; className?: string }) {
  if (!cap.cta) return null;
  return (
    <Link
      href={quoteHref(page.contactName)}
      className={`group relative isolate ${className} inline-flex min-h-[56px] items-center justify-between gap-5 overflow-hidden rounded-full bg-white py-2 pl-6 pr-2 text-[13px] font-semibold uppercase tracking-[0.1em] text-navy [transition:scale_140ms_cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cta active:scale-[0.97]`}
    >
      <span aria-hidden="true" className="absolute inset-0 -z-10 origin-left scale-x-0 bg-cta transition-transform duration-500 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100 group-focus-visible:scale-x-100" />
      {cap.cta}
      <span aria-hidden="true" className="flex h-10 w-10 items-center justify-center rounded-full bg-navy/10">
        <Arrow className="transition-transform duration-500 group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}

/* A closing line after the lists — a scope note, or a labelled caveat such
   as Website Maintenance's "Important" on what security work can promise. */
function CapabilityNote({ note }: { note: NonNullable<ServiceCapability["note"]> }) {
  return (
    <div className="mt-8 flex max-w-2xl gap-4 rounded-2xl border border-white/15 bg-white/[0.04] p-4 sm:p-5">
      <span aria-hidden="true" className="mt-[3px] block h-4 w-[2px] shrink-0 bg-cta" />
      <p className="text-[14px] leading-relaxed text-white/80 [text-wrap:pretty]">
        {note.label && (
          <span className="mr-2 font-mono text-[10.5px] uppercase tracking-[0.2em] text-cta">{note.label}</span>
        )}
        {note.text}
      </p>
    </div>
  );
}

export default function ServiceCapabilities({ page }: { page: ServicePage }) {
  const caps = page.capabilities;
  if (!caps?.length) return null;
  return caps.length >= 3 ? <CapabilityTabs page={page} caps={caps} /> : <CapabilityBands page={page} caps={caps} />;
}

/* ------------------------------------------------------------------------- */
/* One or two offers: a full band each                                        */
/* ------------------------------------------------------------------------- */

function CapabilityBands({ page, caps }: { page: ServicePage; caps: readonly ServiceCapability[] }) {
  const ref = useSectionReveal(build, "top 72%");

  return (
    <section
      ref={ref}
      aria-labelledby={`${caps[0].id}-heading`}
      className="relative isolate overflow-hidden bg-navy text-white"
    >
      <BandGround />

      {caps.map((cap, i) => (
        <div key={cap.id} id={cap.id} className={`sky-anchor relative ${FRAME} ${i > 0 ? "border-t border-dotted border-white/20" : ""}`}>
          <div
            className={`grid grid-cols-[minmax(0,1fr)] gap-10 py-20 sm:gap-12 sm:py-24 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:gap-16 lg:py-28 ${INSET}`}
          >
            {/* The offer */}
            <div className="svc2-head lg:sticky lg:top-40 lg:self-start">
              <h2
                id={`${cap.id}-heading`}
                className="svc2-heading font-display text-[2.1rem] font-semibold leading-[1.05] tracking-[-0.03em] [text-wrap:balance] sm:text-[2.6rem] lg:text-[2.75rem]"
              >
                <Words text={cap.title} />
              </h2>

              {cap.subtitle && (
                <p className="mt-5 font-display text-[1.2rem] font-medium leading-snug tracking-[-0.015em] text-white [text-wrap:balance]">
                  {cap.subtitle}
                </p>
              )}

              {cap.body.map((paragraph, p) => (
                <p key={p} className="mt-6 max-w-lg text-base leading-relaxed text-white/80 [text-wrap:pretty] sm:text-lg">
                  <Rich text={paragraph} markClass="text-cta" />
                </p>
              ))}

              {cap.note && <CapabilityNote note={cap.note} />}
              <PriceBlock cap={cap} />
              <CapabilityCta page={page} cap={cap} />
            </div>

            {/* The system board */}
            <div className="space-y-12">
              {capabilityLists(cap).map((list) => (
                <div key={list.label}>
                  <p className="svc2-head flex items-center gap-3">
                    <span aria-hidden="true" className="block h-px w-8 bg-cta" />
                    <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-cta sm:text-xs">{list.label}</span>
                  </p>

                  <ul className="svc2-board mt-7 grid grid-cols-2 sm:grid-cols-3">
                    {list.items.map((item) => (
                      <li key={item} className="svc2-cell flex min-h-[84px] flex-col justify-between gap-3 p-4 sm:min-h-[118px] sm:gap-4 sm:p-5">
                        <span aria-hidden="true" className="svc2-node block h-2 w-2 bg-cta" />
                        <span className="text-[14px] font-medium leading-snug text-white [text-wrap:balance] sm:text-[15px]">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}

/* ------------------------------------------------------------------------- */
/* Three or more: one band, a tab each                                        */
/* ------------------------------------------------------------------------- */

function CapabilityTabs({ page, caps }: { page: ServicePage; caps: readonly ServiceCapability[] }) {
  const ref = useSectionReveal(buildTabs, "top 72%");
  const [active, setActive] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const baseId = useId();
  const tablistRef = useRef<HTMLDivElement>(null);
  const tabId = (i: number) => `${baseId}-tab-${i}`;

  /* Where the tabs are a sideways row, the chosen chip is brought into view
     — scrolled along the row only, never the page. */
  const choose = (i: number) => {
    setActive(i);
    const row = tablistRef.current;
    const tab = tabRefs.current[i];
    if (!row || !tab || row.scrollWidth <= row.clientWidth) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    row.scrollTo({ left: tab.offsetLeft - row.offsetLeft - 36, behavior: reduce ? "auto" : "smooth" });
  };
  const panelId = (i: number) => `${baseId}-panel-${i}`;

  /* Arrow keys move along the tabs and select as they go; Home and End jump
     to the ends — the standard tablist pattern. */
  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const last = caps.length - 1;
    const next =
      event.key === "ArrowDown" || event.key === "ArrowRight"
        ? (i + 1) % caps.length
        : event.key === "ArrowUp" || event.key === "ArrowLeft"
          ? (i - 1 + caps.length) % caps.length
          : event.key === "Home"
            ? 0
            : event.key === "End"
              ? last
              : null;
    if (next === null) return;
    event.preventDefault();
    choose(next);
    tabRefs.current[next]?.focus({ preventScroll: true });
  };

  return (
    <section
      ref={ref}
      id="specialisms"
      aria-labelledby={`${baseId}-heading`}
      className="sky-anchor relative isolate overflow-hidden bg-navy text-white"
    >
      <BandGround />

      <div className={`relative ${FRAME}`}>
        <div className={`py-20 sm:py-24 lg:py-28 ${INSET}`}>
          <div className="svc3-head">
            <SectionLabel tone="light" count={`${caps.length} Areas`}>
              <span id={`${baseId}-heading`}>Specialisms</span>
            </SectionLabel>
          </div>

          <div className="mt-10 grid grid-cols-[minmax(0,1fr)] gap-8 lg:mt-12 lg:grid-cols-[minmax(0,0.62fr)_minmax(0,1.38fr)] lg:gap-14">
            {/* The tabs: a column on desktop, a swipeable row on smaller
                screens. */}
            <div
              ref={tablistRef}
              role="tablist"
              aria-labelledby={`${baseId}-heading`}
              className="svc3-tabs -mx-9 flex gap-2 overflow-x-auto px-9 pb-1 [scrollbar-width:none] sm:-mx-0 sm:px-0 lg:mx-0 lg:flex-col lg:gap-0 lg:overflow-visible lg:px-0 lg:pb-0 [&::-webkit-scrollbar]:hidden"
            >
              {caps.map((cap, i) => (
                <button
                  key={cap.id}
                  ref={(el) => {
                    tabRefs.current[i] = el;
                  }}
                  id={tabId(i)}
                  type="button"
                  role="tab"
                  aria-selected={active === i}
                  aria-controls={panelId(i)}
                  tabIndex={active === i ? 0 : -1}
                  onClick={() => choose(i)}
                  onKeyDown={(e) => onKeyDown(e, i)}
                  className="svc3-tab group relative flex shrink-0 items-center gap-3 rounded-full border px-4 py-3 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cta lg:rounded-none lg:border-0 lg:border-t lg:px-0 lg:py-5"
                  data-active={active === i}
                >
                  <span className="font-mono text-[11px] tracking-[0.18em] text-cta">{String(i + 1).padStart(2, "0")}</span>
                  <span className="whitespace-nowrap font-display text-[14.5px] font-medium tracking-[-0.01em] lg:whitespace-normal lg:text-[1.15rem] lg:leading-snug">
                    {cap.title}
                  </span>
                  <Arrow className="svc3-arrow ml-auto hidden shrink-0 lg:block" />
                </button>
              ))}
            </div>

            {/* The panels. On desktop they share one grid cell, so the band
                is as tall as its longest panel and switching tabs never
                moves the page; below that, only the chosen one takes space. */}
            <div className="svc3-stage grid">
              {caps.map((cap, i) => {
                const lists = capabilityLists(cap);
                return (
                  <div
                    key={cap.id}
                    id={panelId(i)}
                    role="tabpanel"
                    aria-labelledby={tabId(i)}
                    tabIndex={0}
                    data-active={active === i}
                    className="svc3-panel min-w-0 [grid-area:1/1] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cta"
                    {...(active === i ? {} : { inert: true })}
                  >
                    <div id={cap.id} className="sky-anchor">
                      <h2 className="font-display text-[1.9rem] font-semibold leading-[1.06] tracking-[-0.03em] [text-wrap:balance] sm:text-[2.4rem]">
                        <Words text={cap.title} />
                      </h2>
                      {cap.subtitle && (
                        <p className="mt-4 font-display text-[1.15rem] font-medium leading-snug tracking-[-0.015em] text-cta [text-wrap:balance] sm:text-[1.3rem]">
                          {cap.subtitle}
                        </p>
                      )}
                      {cap.body.map((paragraph, p) => (
                        <p key={p} className="mt-4 max-w-2xl text-[15px] leading-relaxed text-white/80 [text-wrap:pretty] sm:text-base">
                          <Rich text={paragraph} markClass="text-cta" />
                        </p>
                      ))}

                      {/* Priced plans, side by side; each goes straight to
                          the contact form with that plan chosen. */}
                      {cap.plans && (
                        <ul className="mt-9 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                          {cap.plans.map((plan) => (
                            <li key={plan.name} className="flex flex-col rounded-[20px] border border-white/15 bg-white/[0.04] p-5">
                              <p className="font-display text-[1.1rem] font-semibold tracking-[-0.015em] text-white">{plan.name}</p>
                              <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.2em] text-white/50">Starting From</p>
                              <p className="mt-1 font-mono text-[1.45rem] leading-none tracking-[-0.02em] text-cta">{plan.price}</p>
                              <ul className="mt-5 space-y-2 border-t border-white/12 pt-4">
                                {plan.includes.map((item) => (
                                  <li key={item} className="flex items-baseline gap-2.5 text-[13.5px] leading-snug text-white/85">
                                    <span aria-hidden="true" className="mt-[1px] block h-1 w-2 shrink-0 bg-cta/70" />
                                    {item}
                                  </li>
                                ))}
                              </ul>
                              <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.2em] text-white/50">Best For</p>
                              <p className="mt-1.5 text-[13.5px] leading-relaxed text-white/75 [text-wrap:pretty]">{plan.bestFor}</p>
                              <Link
                                href={packageHref(page.contactName, plan.name)}
                                className="group mt-auto inline-flex items-center gap-2.5 pt-6 font-mono text-[10.5px] uppercase tracking-[0.2em] text-white transition-colors duration-300 hover:text-cta focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cta"
                              >
                                Choose This Plan
                                <Arrow className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-0.5" />
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}

                      {/* Titled entries, each with its line: a ruled
                          two-column index. */}
                      {cap.items && (
                        <dl className="mt-9 grid gap-x-10 sm:grid-cols-2">
                          {cap.items.map((item, i) => (
                            <div key={item.title} className="border-t border-white/15 py-5">
                              <dt className="flex items-baseline gap-3 font-display text-[1.05rem] font-medium tracking-[-0.01em] text-white">
                                <span aria-hidden="true" className="font-mono text-[10.5px] tracking-[0.18em] text-cta">
                                  {String(i + 1).padStart(2, "0")}
                                </span>
                                {item.title}
                              </dt>
                              <dd className="mt-2 pl-[calc(0.75rem+2ch)] text-[14px] leading-relaxed text-white/75 [text-wrap:pretty]">
                                {item.body}
                              </dd>
                            </div>
                          ))}
                        </dl>
                      )}

                      {/* What it covers: each list a short ruled column. */}
                      {lists.length > 0 && (
                      <div className={`mt-9 grid gap-x-10 gap-y-8 ${lists.length > 1 ? "sm:grid-cols-2" : ""}`}>
                        {lists.map((list) => (
                          <div key={list.label || "list"} className="min-w-0">
                            {/* A list the content gives no label keeps just
                                the rule. */}
                            <p className="flex items-center gap-3 border-b border-white/15 pb-3 font-mono text-[10.5px] uppercase tracking-[0.2em] text-white/60">
                              <span aria-hidden="true" className="block h-1.5 w-1.5 bg-cta" />
                              {list.label}
                            </p>
                            <ul className={`mt-4 grid gap-x-6 gap-y-2.5 ${lists.length === 1 ? "sm:grid-cols-2" : ""}`}>
                              {list.items.map((item) => (
                                <li key={item} className="flex items-baseline gap-3 text-[14.5px] leading-snug text-white/85">
                                  <span aria-hidden="true" className="mt-[1px] block h-1 w-2.5 shrink-0 bg-white/25" />
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                      )}

                      {cap.closing && (
                        <p className="mt-6 max-w-2xl text-[14.5px] leading-relaxed text-white/75 [text-wrap:pretty]">{cap.closing}</p>
                      )}

                      {cap.note && <CapabilityNote note={cap.note} />}

                      {(cap.price || cap.cta) && (
                        <div className="mt-10 flex flex-wrap items-end justify-between gap-x-10 gap-y-6 border-t border-white/15 pt-7">
                          {cap.price ? (
                            <div>
                              {cap.priceLabel && (
                                <p className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-white/55">{cap.priceLabel}</p>
                              )}
                              <p className="mt-2 font-mono text-[2.2rem] leading-none tracking-[-0.02em] text-white">{cap.price}</p>
                              {cap.priceNote && (
                                <p className="mt-3 max-w-sm text-[13.5px] leading-relaxed text-white/70 [text-wrap:pretty]">
                                  {cap.priceNote}
                                </p>
                              )}
                            </div>
                          ) : (
                            <span />
                          )}
                          <CapabilityCta page={page} cap={cap} className="" />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
