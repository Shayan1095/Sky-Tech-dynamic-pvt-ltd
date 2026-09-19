"use client";

import { useState } from "react";
import { money } from "@/lib/service-pages/quote";
import type { ServicePage } from "@/lib/service-pages/types";
import { Arrow, FRAME, FrameRules, H2, INSET, Rich, SectionLabel, Words, consultationHref, pct } from "./parts";
import { quote } from "./quoteStore";
import { revealHead, useSectionReveal, type RevealBuilder } from "./useSectionReveal";

/* Section 09 — investment and timeline.

   The content lists five budget ranges. Listed as text they have to be read
   and compared in the head; plotted on one shared scale, a visitor sees at a
   glance where their budget falls and which kind of project it buys. That is
   the whole purpose of the chart — it is the content, drawn.

   The scale is logarithmic, because the ranges run from hundreds to tens of
   thousands: on a linear scale the first two bars would be slivers. Every bar
   carries its range in words beside it, and the axis is labelled, so the
   scale never has to be trusted blind. A range the content marks open-ended
   ("$3,000+") runs on past its figure and fades out.

   A budget finder sits on the same scale: the visitor drags to their budget,
   the ranges it falls in stay lit while the rest step back, and the packages
   behind those ranges are offered - one tap selects the package and takes
   them to it. It reads the same axis as the bars, so the marker lands
   exactly where the budget sits among them.

   The timeline sits beside it, because cost and time are one decision. */

const build: RevealBuilder<HTMLElement> = (tl) => {
  revealHead(tl)
    .fromTo(".svi-intro", { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.7 }, 0.25)
    .fromTo(".svi-axis", { opacity: 0 }, { opacity: 1, duration: 0.6 }, 0.35)
    .fromTo(".svi-bar", { scaleX: 0, transformOrigin: "left center" }, { scaleX: 1, duration: 1.1, stagger: 0.09, ease: "power3.out" }, 0.4)
    .fromTo(".svi-row-text", { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.09 }, 0.4)
    .fromTo(".svi-time", { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.9 }, 0.5);
};

const CANDIDATE_TICKS = [100, 300, 1000, 3000, 10000, 30000, 100000];
const tick = (v: number) => (v >= 1000 ? `$${v / 1000}k` : `$${v}`);

/* Budgets snap to round figures as the slider moves. */
const round = (v: number) =>
  v < 1000 ? Math.round(v / 50) * 50 : v < 5000 ? Math.round(v / 100) * 100 : Math.round(v / 500) * 500;
const STEPS = 1000;

export default function ServiceInvestment({ page }: { page: ServicePage }) {
  const ref = useSectionReveal(build);
  const { investment, timeline, hero, packages, slug, contactName } = page;
  /* The finder starts at $1,000 for project pricing. Recurring plans
     (a unit such as "/month"), or a scale $1,000 doesn't fall on, start
     midway along the scale instead, so the first reading is a typical
     budget rather than the top of the range. */
  const [budget, setBudget] = useState(() => {
    const r = page.investment?.ranges ?? [];
    if (!r.length) return 1000;
    const low = Math.min(...r.map((x) => x.min)) * 0.8;
    const high = Math.max(...r.map((x) => x.max)) * 1.25;
    const recurring = Boolean(page.investment?.unit);
    return !recurring && 1000 >= low && 1000 <= high ? 1000 : round(Math.sqrt(low * high));
  });
  const unit = page.investment?.unit ?? "";
  const [touched, setTouched] = useState(false);
  if (!investment && !timeline) return null;

  /* A shared log scale with a little air either side of the data. */
  const ranges = investment?.ranges ?? [];
  const lo = Math.min(...ranges.map((r) => r.min)) * 0.8;
  const hi = Math.max(...ranges.map((r) => r.max)) * 1.25;
  const at = (v: number) => ((Math.log(v) - Math.log(lo)) / (Math.log(hi) - Math.log(lo))) * 100;
  const ticks = CANDIDATE_TICKS.filter((t) => t >= lo && t <= hi);

  /* Slider position <-> budget, on the chart's own log scale. */
  const toBudget = (step: number) =>
    round(Math.exp(Math.log(lo) + (step / STEPS) * (Math.log(hi) - Math.log(lo))));
  const toStep = (v: number) =>
    Math.round(((Math.log(v) - Math.log(lo)) / (Math.log(hi) - Math.log(lo))) * STEPS);
  const fits = (r: (typeof ranges)[number]) => budget >= r.min && (r.openEnded || budget <= r.max);
  const matching = ranges.filter(fits);
  const suggested = packages.tiers.filter((t) => matching.some((r) => r.tier === t.id));

  return (
    <section
      ref={ref}
      id="pricing"
      aria-labelledby={investment ? "investment-heading" : "timeline-heading"}
      className="sky-anchor relative isolate overflow-x-clip border-b border-accent bg-surface"
    >
      <FrameRules />

      <div className={`relative ${FRAME}`}>
        <div className={`py-20 sm:py-24 lg:py-28 ${INSET}`}>
          <SectionLabel>Pricing &amp; Timeline</SectionLabel>

          <div className="mt-8 grid grid-cols-[minmax(0,1fr)] gap-14 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,0.7fr)] lg:gap-14">
            {investment && (
              <div className="min-w-0">
                <h2 id="investment-heading" className={`${H2} max-w-2xl text-text`}>
                  <Words text={investment.heading} />
                </h2>
                {investment.intro && (
                  <p className="svi-intro mt-6 max-w-xl text-base leading-relaxed text-text/70 [text-wrap:pretty] sm:text-lg">
                    {investment.intro}
                  </p>
                )}

                <p className="svi-intro mt-12 font-mono text-[10.5px] uppercase tracking-[0.2em] text-text/50">{investment.label}</p>

                {/* Budget finder, on the chart's own scale */}
                {/* Laid out exactly like a chart row, so the slider's travel
                    is the chart's own axis. The input reaches 8px past each
                    end because a range thumb's centre stops half a thumb in
                    from its track's ends; this puts that centre on the axis. */}
                <div className="svi-intro mt-5 grid items-center gap-3 border-y border-primary/20 bg-primary/[0.035] py-4 sm:grid-cols-[13rem_minmax(0,1fr)] sm:gap-0">
                  <label htmlFor={`${slug}-budget`} className="flex items-baseline justify-between gap-3 px-3 sm:block">
                    <span className="block font-display text-[15px] font-medium tracking-[-0.01em] text-text">Your budget</span>
                    <output htmlFor={`${slug}-budget`} className="block font-mono text-[1.15rem] tracking-[-0.01em] text-primary sm:mt-0.5">
                      {money(budget)}
                      {unit}
                    </output>
                  </label>
                  <input
                    id={`${slug}-budget`}
                    type="range"
                    min={0}
                    max={STEPS}
                    value={toStep(budget)}
                    aria-valuetext={`${money(budget)}${unit}`}
                    onChange={(e) => {
                      setBudget(toBudget(Number(e.target.value)));
                      setTouched(true);
                    }}
                    className="svi-range w-full sm:-mx-2 sm:w-[calc(100%+1rem)]"
                  />
                </div>

                <div className="relative mt-5" data-finder={touched ? "on" : "off"}>
                  {/* The budget marker, drawn across every row */}
                  <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-6 top-0 z-10 sm:left-[13rem]">
                    <span
                      className="svi-marker absolute inset-y-0 w-px bg-primary"
                      style={{ left: pct(Math.min(100, Math.max(0, at(budget)))) }}
                    />
                  </div>

                  {/* Gridlines at each tick, behind the bars */}
                  <div aria-hidden="true" className="svi-axis pointer-events-none absolute inset-x-0 bottom-6 top-0 hidden sm:block">
                    <span className="absolute inset-y-0 left-[13rem] right-0">
                      {ticks.map((t) => (
                        <span key={t} className="absolute inset-y-0 w-px bg-text/[0.07]" style={{ left: pct(at(t)) }} />
                      ))}
                    </span>
                  </div>

                  <ul className="relative">

                    {ranges.map((r) => {
                      const start = at(r.min);
                      const end = r.openEnded ? 100 : at(r.max);
                      const solidEnd = at(r.max);
                      return (
                        <li key={r.label} data-fits={fits(r)} className="svi-row relative grid gap-2.5 border-t border-text/10 py-4 sm:grid-cols-[13rem_minmax(0,1fr)] sm:items-center sm:gap-0 sm:py-5">
                          <p className="svi-row-text flex items-baseline justify-between gap-4 pr-4 sm:block">
                            <span className="block font-display text-[15px] font-medium leading-snug tracking-[-0.01em] text-text">
                              {r.label}
                            </span>
                            <span className="block whitespace-nowrap font-mono text-[12.5px] tracking-[0.01em] text-primary sm:mt-1">
                              {r.display}
                            </span>
                          </p>

                          <span aria-hidden="true" className="relative block h-3">
                            <span className="absolute inset-y-[5px] left-0 right-0 rounded-full bg-text/[0.06]" />
                            <span
                              className="svi-bar absolute inset-y-0 rounded-full"
                              style={{
                                left: pct(start),
                                width: pct(end - start),
                                backgroundImage: r.openEnded
                                  ? `linear-gradient(to right, var(--color-primary) 0%, var(--color-cta) ${pct(((solidEnd - start) / (end - start)) * 100)}, rgb(0 194 255 / 0) 100%)`
                                  : "linear-gradient(to right, var(--color-primary), var(--color-cta))",
                              }}
                            />
                          </span>
                        </li>
                      );
                    })}
                  </ul>

                  {/* The axis */}
                  <div aria-hidden="true" className="svi-axis relative mt-1 hidden h-6 border-t border-text/15 sm:ml-[13rem] sm:block">
                    {ticks.map((t) => (
                      <span
                        key={t}
                        className="absolute top-2 -translate-x-1/2 font-mono text-[10.5px] tracking-[0.04em] text-text/45"
                        style={{ left: pct(at(t)) }}
                      >
                        {tick(t)}
                      </span>
                    ))}
                  </div>
                </div>

                {/* What the budget buys */}
                <div aria-live="polite" className="mt-8 min-h-[3.25rem]">
                  {suggested.length > 0 ? (
                    <p className="flex flex-wrap items-center gap-x-3 gap-y-2">
                      <span className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-text/50">
                        Fits {money(budget)}
                        {unit}
                      </span>
                      {suggested.map((t) => (
                        <a
                          key={t.id}
                          href="#packages"
                          onClick={() => quote.setTier(slug, t.id)}
                          className="group inline-flex items-center gap-2 rounded-full border border-primary/25 bg-bg py-2 pl-3.5 pr-3 font-display text-[13.5px] font-medium tracking-[-0.01em] text-text transition-colors duration-300 hover:border-primary hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                        >
                          {t.name}
                          <span className="font-mono text-[12px] text-text/50 group-hover:text-primary">{t.price}</span>
                          <Arrow className="h-3 w-3 rotate-90" />
                        </a>
                      ))}
                    </p>
                  ) : (
                    <p className="text-[14px] leading-relaxed text-text/70 [text-wrap:pretty]">
                      Below our typical ranges.{" "}
                      <a
                        href={consultationHref(contactName)}
                        className="font-medium text-primary underline decoration-primary/30 underline-offset-4 hover:decoration-primary"
                      >
                        Book a free consultation
                      </a>{" "}
                      and we&apos;ll see what&apos;s possible.
                    </p>
                  )}
                </div>

                {investment.note && (
                  <p className="svi-intro mt-8 max-w-xl text-[15px] leading-relaxed text-text/70 [text-wrap:pretty]">{investment.note}</p>
                )}

                {investment.important && (
                  <div className="svi-intro mt-8 max-w-2xl rounded-2xl border border-primary/20 bg-bg p-5 sm:p-6">
                    <p className="text-[14.5px] leading-relaxed text-text [text-wrap:pretty]">
                      {investment.important.label && (
                        <span className="mr-2 font-mono text-[10.5px] uppercase tracking-[0.2em] text-primary">
                          {investment.important.label}
                        </span>
                      )}
                      {investment.important.text}
                    </p>
                    {investment.important.list && (
                      <>
                        {investment.important.listLabel && (
                          <p className="mt-4 font-mono text-[10.5px] uppercase tracking-[0.18em] text-text/50">
                            {investment.important.listLabel}
                          </p>
                        )}
                        <ul className="mt-3 flex flex-wrap gap-2">
                          {investment.important.list.map((item) => (
                            <li key={item} className="rounded-full border border-text/10 bg-surface px-3 py-1 text-[13px] text-text/75">
                              {item}
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                    {investment.important.closing && (
                      <p className="mt-4 text-[14px] leading-relaxed text-text/70">{investment.important.closing}</p>
                    )}
                  </div>
                )}
              </div>
            )}

            {timeline && (
              <div className="svi-time min-w-0 lg:pt-2">
                <div className="relative rounded-[22px] border border-text/10 bg-bg p-7 shadow-[0_1px_2px_rgb(18_18_18/0.04)] sm:p-9">
                  <h2
                    id="timeline-heading"
                    className="font-display text-[1.45rem] font-semibold leading-[1.12] tracking-[-0.025em] text-text [text-wrap:balance] sm:text-[1.65rem]"
                  >
                    <Words text={timeline.heading} />
                  </h2>

                  {hero.timeline && (
                    <div className="mt-8 border-t border-text/10 pt-7">
                      <p className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-text/50">{hero.timeline.label}</p>
                      {/* A longer figure ("1–2 business days") is set smaller
                          so it holds to one or two lines in the card. */}
                      <p
                        className={`mt-2 font-mono tracking-[-0.04em] text-primary ${
                          hero.timeline.value.length > 10
                            ? "text-[2.1rem] leading-[1.05]"
                            : "text-[3rem] leading-none sm:text-[3.4rem]"
                        }`}
                      >
                        {hero.timeline.value}
                      </p>
                    </div>
                  )}

                  {timeline.paragraphs.map((paragraph, i) => (
                    <p key={i} className="mt-6 text-[15px] leading-relaxed text-text/75 [text-wrap:pretty]">
                      <Rich text={paragraph} />
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
