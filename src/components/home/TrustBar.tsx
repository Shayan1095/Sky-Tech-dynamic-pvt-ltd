"use client";

import { useEffect, useId, useRef } from "react";
import { gsap } from "@/lib/gsap";

const CLOSED = "inset(0 100% 0 0)";
const OPEN = "inset(0 0% 0 0)";

/* The site's drafting frame, shared with the About page and the footer. */
const FRAME = "mx-4 sm:mx-6 lg:mx-8 xl:mx-auto xl:max-w-6xl";
const INSET = "px-5 sm:px-8 lg:px-12";

type VisualKind = "sites" | "network" | "years";

const STATS: Array<{ value: number; label: string; visual: VisualKind }> = [
  { value: 50, label: "Websites Delivered", visual: "sites" },
  { value: 150, label: "Businesses Served", visual: "network" },
  { value: 5, label: "Years of Experience", visual: "years" },
];

// An odometer strip: full 0-9 cycles, then a partial run ending on the target
// digit. Scrubbing the strip's yPercent rolls the digit into place.
function buildStrip(target: number, cycles: number) {
  const seq: number[] = [];
  for (let c = 0; c < cycles; c++) {
    for (let d = 0; d <= 9; d++) seq.push(d);
  }
  for (let d = 0; d <= target; d++) seq.push(d);
  return seq;
}

/* ------------------------------------------------------------- Visuals --
   One schematic per stat, drawn to the stat's real count. Each has a faint
   base layer and an identical cyan layer revealed through a single clip
   shape, so the scroll scrub animates one attribute per visual rather than
   dozens of elements. */
const VB = { w: 220, h: 90 };
const CYAN = "#00c2ff";
const BASE = "rgb(255 255 255 / 0.22)";

// 50 browser-window tiles, 10 x 5.
const TILES = Array.from({ length: 50 }, (_, i) => ({
  x: (i % 10) * 22,
  y: Math.floor(i / 10) * 18,
}));

// 150 points, deterministic (seeded) so server and client render the same.
const POINTS = (() => {
  let seed = 7;
  const rand = () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };
  return Array.from({ length: 150 }, (_, i) => {
    const col = i % 15;
    const row = Math.floor(i / 15);
    return {
      x: 7 + col * 14.6 + (rand() - 0.5) * 8,
      y: 6 + row * 8.7 + (rand() - 0.5) * 5,
    };
  });
})();
// A light web of links between near neighbours.
const LINKS = POINTS.flatMap((p, i) =>
  POINTS.slice(i + 1, i + 17)
    .filter((q) => Math.hypot(q.x - p.x, q.y - p.y) < 13)
    .slice(0, 1)
    .map((q) => `M${p.x.toFixed(1)} ${p.y.toFixed(1)}L${q.x.toFixed(1)} ${q.y.toFixed(1)}`)
).join("");

const YEARS_X = [14, 62, 110, 158, 206];

function SitesLayer({ lit }: { lit: boolean }) {
  return (
    <>
      {TILES.map((t, i) => (
        <g key={i}>
          <rect
            x={t.x + 1}
            y={t.y + 1}
            width="18"
            height="14"
            rx="2.5"
            fill={lit ? "rgb(0 194 255 / 0.18)" : "none"}
            stroke={lit ? CYAN : BASE}
            strokeWidth="1"
          />
          <line
            x1={t.x + 1}
            y1={t.y + 5}
            x2={t.x + 19}
            y2={t.y + 5}
            stroke={lit ? CYAN : BASE}
            strokeWidth="1"
          />
        </g>
      ))}
    </>
  );
}

function NetworkLayer({ lit }: { lit: boolean }) {
  return (
    <>
      <path d={LINKS} stroke={lit ? "rgb(0 194 255 / 0.5)" : "rgb(255 255 255 / 0.1)"} strokeWidth="0.8" />
      {POINTS.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={lit ? 1.9 : 1.5} fill={lit ? CYAN : BASE} />
      ))}
    </>
  );
}

function YearsLayer({ lit }: { lit: boolean }) {
  return (
    <>
      <line x1="14" y1="45" x2="206" y2="45" stroke={lit ? CYAN : BASE} strokeWidth={lit ? 2 : 1.5} strokeLinecap="round" />
      {YEARS_X.map((x) => (
        <g key={x}>
          <line x1={x} y1="26" x2={x} y2="34" stroke={lit ? CYAN : BASE} strokeLinecap="round" />
          <circle cx={x} cy="45" r={lit ? 6 : 5.5} fill="#0b1f35" stroke={lit ? CYAN : BASE} strokeWidth="1.5" />
          {lit && <circle cx={x} cy="45" r="2.5" fill={CYAN} />}
        </g>
      ))}
    </>
  );
}

function StatVisual({ kind, row }: { kind: VisualKind; row: number }) {
  const clipId = `tb-clip-${useId().replace(/:/g, "")}`;
  const Layer =
    kind === "sites" ? SitesLayer : kind === "network" ? NetworkLayer : YearsLayer;

  return (
    <svg
      viewBox={`0 0 ${VB.w} ${VB.h}`}
      className="h-auto w-[180px] overflow-visible sm:w-[220px]"
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <clipPath id={clipId}>
          {kind === "network" ? (
            // Businesses light up outward from the centre.
            <circle className="tb-reveal" data-row={row} data-kind="radius" cx={VB.w / 2} cy={VB.h / 2} r="125" />
          ) : (
            // Sites and years fill left to right.
            <rect className="tb-reveal" data-row={row} data-kind="width" x="-4" y="-4" width={VB.w + 8} height={VB.h + 8} />
          )}
        </clipPath>
      </defs>
      <Layer lit={false} />
      <g clipPath={`url(#${clipId})`}>
        <Layer lit />
      </g>
    </svg>
  );
}

export default function TrustBar() {
  const sectionRef = useRef<HTMLElement>(null);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const leaderRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const rows = rowRefs.current.filter(Boolean) as HTMLDivElement[];
    const leaders = leaderRefs.current.filter(Boolean) as HTMLSpanElement[];
    const strips = Array.from(
      section.querySelectorAll<HTMLSpanElement>("[data-total]")
    );
    const reveals = Array.from(
      section.querySelectorAll<SVGElement>(".tb-reveal")
    );
    const pluses = Array.from(
      section.querySelectorAll<HTMLSpanElement>(".tb-plus")
    );

    const restTarget = (strip: HTMLSpanElement) => {
      const total = Number(strip.dataset.total ?? 1);
      return -((total - 1) / total) * 100;
    };

    // Reveal shapes start closed: a zero-width strip, or a zero-radius circle.
    const closedAttr = (el: SVGElement): gsap.AttrVars =>
      el.dataset.kind === "radius" ? { r: 0 } : { width: 0 };
    const openAttr = (el: SVGElement): gsap.AttrVars =>
      el.dataset.kind === "radius" ? { r: 125 } : { width: VB.w + 8 };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(rows, { opacity: 1, y: 0 });
      gsap.set(leaders, { scaleX: 1 });
      strips.forEach((s) => gsap.set(s, { yPercent: restTarget(s) }));
      reveals.forEach((r) => gsap.set(r, { attr: openAttr(r) }));
      return;
    }

    gsap.set(rows, { opacity: 0, y: 8 });
    gsap.set(leaders, { scaleX: 0, transformOrigin: "left center" });
    gsap.set(strips, { yPercent: 0 });
    reveals.forEach((r) => gsap.set(r, { attr: closedAttr(r) }));

    // Same header choreography as the Approach section: the mark scales in,
    // the heading wipes left to right a line at a time, the lede follows.
    const q = gsap.utils.selector(section);
    const header = gsap.timeline({
      scrollTrigger: { trigger: section, start: "top 78%", once: true },
      onComplete: () =>
        gsap.set(q(".tb-heading-line"), { clearProps: "willChange" }),
    });

    header
      .fromTo(
        q(".tb-mark"),
        { scale: 0, transformOrigin: "left center" },
        { scale: 1, duration: 0.5 },
        0
      )
      .fromTo(
        q(".tb-heading-line"),
        { clipPath: CLOSED, willChange: "clip-path" },
        { clipPath: OPEN, duration: 0.65, stagger: 0.09 },
        0.08
      )
      .fromTo(
        q(".tb-lede"),
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.6 },
        0.44
      );

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top 78%",
        end: "top 28%",
        scrub: 0.6,
      },
    });

    rows.forEach((row, i) => {
      const at = i * 0.15;
      tl.to(row, { opacity: 1, y: 0, duration: 0.3, ease: "none" }, at);
      tl.to(leaders[i], { scaleX: 1, duration: 0.5, ease: "none" }, at + 0.05);

      // Every digit rolls, units digit settling last — the number counts up
      // rather than sitting there with one spinning digit.
      const rowStrips = strips.filter((s) => s.dataset.row === String(i));
      rowStrips.forEach((strip, d) => {
        tl.to(
          strip,
          {
            yPercent: restTarget(strip),
            duration: 0.7 + d * 0.06,
            ease: "none",
          },
          at
        );
      });

      // The stat's schematic fills over exactly the span its number rolls,
      // so the last tile, business or year lights as the final digit lands.
      // Ending inside the existing span keeps the timeline's length — and so
      // every existing animation's scroll position — unchanged.
      const span = 0.7 + Math.max(0, rowStrips.length - 1) * 0.06;
      const reveal = reveals.find((r) => r.dataset.row === String(i));
      if (reveal) {
        tl.to(reveal, { attr: openAttr(reveal), duration: span, ease: "none" }, at);
      }
      if (pluses[i]) {
        tl.fromTo(
          pluses[i],
          { textShadow: "0 0 0px rgba(0, 194, 255, 0)" },
          {
            textShadow: "0 0 22px rgba(0, 194, 255, 0.55)",
            duration: 0.12,
            ease: "none",
          },
          at + span - 0.12
        );
      }
    });

    return () => {
      header.scrollTrigger?.kill();
      header.kill();
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, []);

  return (
    // overflow-x-clip, not overflow-hidden: the corner registration marks sit
    // across the section's top and bottom edges and must not be cut in half.
    <section ref={sectionRef} className="relative isolate overflow-x-clip bg-navy">
      {/* Frame rules and registration marks at the section's top and bottom */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className={`relative h-full border-x border-dotted border-bg/[0.14] ${FRAME}`}>
          {(["top-0 -translate-y-1/2", "bottom-0 translate-y-1/2"] as const).map((v) =>
            (["left-0 -translate-x-1/2", "right-0 translate-x-1/2"] as const).map((h) => (
              <span key={v + h} className={`absolute h-[11px] w-[11px] ${v} ${h}`}>
                <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-bg/40" />
                <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-bg/40" />
              </span>
            ))
          )}
        </div>
      </div>

      <div className={`relative ${FRAME}`}>
        <div className={`py-24 sm:py-32 ${INSET}`}>
          <span
            className="tb-mark block h-px w-8 bg-cta"
            aria-hidden="true"
          />
          <h2 className="mt-6 max-w-3xl text-[2.2rem] font-semibold leading-[1.04] tracking-[-0.028em] text-bg sm:text-[3rem] lg:text-[3.6rem]">
            <span className="tb-heading-line block">
              Trusted by Businesses,
            </span>
            <span className="tb-heading-line block">
              Organizations &amp; Growing Brands
            </span>
          </h2>
          <p className="tb-lede mt-6 max-w-2xl text-lg leading-relaxed text-bg sm:text-xl">
            From startups to established enterprises, SKY Tech has helped
            businesses across web development, digital marketing, and software
            design turn ideas into measurable results.
          </p>

          <div className="mt-16 sm:mt-20">
            {STATS.map((stat, i) => {
              const digits = String(stat.value).split("").map(Number);
              return (
                <div
                  key={stat.label}
                  ref={(el) => {
                    rowRefs.current[i] = el;
                  }}
                  className="flex items-end gap-4 border-t border-bg/15 py-8 last:border-b sm:gap-8 sm:py-10"
                >
                  <div className="flex min-w-0 shrink-0 flex-col gap-5">
                    <span className="font-display text-base font-medium text-bg sm:text-lg">
                      {stat.label}
                    </span>
                    <StatVisual kind={stat.visual} row={i} />
                  </div>

                  <span
                    ref={(el) => {
                      leaderRefs.current[i] = el;
                    }}
                    aria-hidden="true"
                    className="mb-2 hidden h-px flex-1 border-b border-dotted border-bg/30 sm:block"
                  />

                  <span className="ml-auto flex shrink-0 items-end font-mono text-5xl leading-none font-medium text-bg sm:ml-0 sm:text-6xl lg:text-7xl">
                    <span className="sr-only">
                      {stat.value}+ {stat.label}
                    </span>

                    {digits.map((digit, d) => {
                      const strip = buildStrip(digit, d + 1);
                      return (
                        <span
                          key={`${stat.label}-${d}`}
                          aria-hidden="true"
                          className="block overflow-hidden"
                          style={{ height: "1em" }}
                        >
                          <span
                            data-total={strip.length}
                            data-row={i}
                            className="block"
                          >
                            {strip.map((n, k) => (
                              <span
                                key={k}
                                className="block text-center"
                                style={{ height: "1em", lineHeight: 1 }}
                              >
                                {n}
                              </span>
                            ))}
                          </span>
                        </span>
                      );
                    })}

                    <span aria-hidden="true" className="tb-plus text-cta">
                      +
                    </span>
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
