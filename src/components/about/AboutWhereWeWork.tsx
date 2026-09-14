"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

// Runs before paint on the client so the reveal never flashes its end state.
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

const CLOSED = "inset(0 100% 0 0)";
const OPEN = "inset(0 0% 0 0)";

/* Shares the page's drafting frame, so the dotted rules run on unbroken. */
const FRAME = "mx-4 sm:mx-6 lg:mx-8 xl:mx-auto xl:max-w-6xl";
const INSET = "px-5 sm:px-8 lg:px-12";

const BLUE = "#006bb8";

/* The three markets, west to east, placed roughly by longitude and latitude
   on an abstract grid. Markers stand for local market understanding; the
   arcs between them for global delivery standards. */
type Market = { name: string; x: number; y: number };

// Wide canvas (sm and up), viewBox 1000 x 320
const WIDE: Market[] = [
  { name: "USA", x: 200, y: 170 },
  { name: "UK", x: 520, y: 118 },
  { name: "Pakistan", x: 800, y: 190 },
];
const WIDE_ARCS = ["M200 170 Q 360 14 520 118", "M520 118 Q 668 30 800 190"];

// Tall canvas (phones), viewBox 320 x 560
const TALL: Market[] = [
  { name: "USA", x: 64, y: 70 },
  { name: "UK", x: 64, y: 280 },
  { name: "Pakistan", x: 64, y: 490 },
];
const TALL_ARCS = [
  "M64 70 C 190 110, 190 240, 64 280",
  "M64 280 C 190 320, 190 450, 64 490",
];

function Marker({ x, y }: { x: number; y: number }) {
  return (
    <g className="wm-marker">
      <circle className="wm-pulse" cx={x} cy={y} r="12" stroke={BLUE} strokeWidth="1.2" opacity="0" />
      <circle cx={x} cy={y} r="24" fill={BLUE} opacity="0.07" />
      <circle cx={x} cy={y} r="12" stroke={BLUE} strokeOpacity="0.35" strokeWidth="1.2" fill="#ffffff" />
      <circle cx={x} cy={y} r="5.5" fill={BLUE} />
    </g>
  );
}

function Routes({ arcs }: { arcs: string[] }) {
  return (
    <>
      {arcs.map((d) => (
        <path key={`t${d}`} className="wm-track" d={d} stroke="rgb(18 18 18 / 0.16)" strokeWidth="1.2" strokeDasharray="3 6" />
      ))}
      {arcs.map((d) => (
        <path key={`a${d}`} className="wm-arc" d={d} stroke={BLUE} strokeWidth="1.6" strokeLinecap="round" />
      ))}
      {arcs.map((d) => (
        <circle key={`d${d}`} className="wm-dot" r="3.5" cx="-20" cy="-20" fill={BLUE} stroke="#ffffff" strokeWidth="1.5" opacity="0" />
      ))}
    </>
  );
}

export default function AboutWhereWeWork() {
  const sectionRef = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    const root = sectionRef.current;
    if (!root) return;
    // Markup is authored complete, so reduced motion shows the finished map
    // with no looping movement.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const mm = gsap.matchMedia();

    const ctx = gsap.context(() => {
      // Header, on its own one-shot trigger.
      const intro = gsap.timeline({ paused: true });
      intro
        .fromTo(".wm-line", { scaleX: 0, transformOrigin: "left center" }, { scaleX: 1, duration: 0.6, ease: "power3.out" }, 0)
        .fromTo(".wm-eyebrow", { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }, 0.06)
        .fromTo(".wm-heading", { clipPath: CLOSED }, { clipPath: OPEN, duration: 0.9, ease: "power3.inOut" }, 0.12)
        .fromTo(".wm-lede", { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" }, 0.35);
      ScrollTrigger.create({ trigger: root, start: "top 72%", once: true, onEnter: () => intro.play() });

      /* Map: the grid settles, then each market lands in turn and its route
         draws on to the next. Once complete, a signal travels each route and
         the markers breathe — only while the map is on screen. */
      const buildMap = (selector: string) => {
        const scope = root.querySelector<HTMLElement>(selector);
        if (!scope) return;
        const q = gsap.utils.selector(scope);
        const markers = q(".wm-marker");
        const labels = q(".wm-label");
        const arcs = q(".wm-arc") as unknown as SVGPathElement[];
        const dots = q(".wm-dot");

        const loops: gsap.core.Animation[] = [];
        let loopTrigger: ScrollTrigger | undefined;

        const startLoops = () => {
          q(".wm-pulse").forEach((pulse, i) => {
            loops.push(
              gsap.fromTo(
                pulse,
                { scale: 1, opacity: 0.55, transformOrigin: "50% 50%" },
                { scale: 2.6, opacity: 0, duration: 2.4, ease: "power2.out", repeat: -1, delay: i * 0.8 }
              )
            );
          });
          arcs.forEach((arc, i) => {
            const length = arc.getTotalLength();
            const dot = dots[i];
            const state = { t: 0 };
            gsap.set(dot, { opacity: 1 });
            loops.push(
              gsap.to(state, {
                t: 1,
                duration: 2.8,
                delay: i * 1.4,
                repeat: -1,
                repeatDelay: 1.4,
                ease: "power1.inOut",
                onUpdate: () => {
                  const p = arc.getPointAtLength(state.t * length);
                  dot.setAttribute("cx", String(p.x));
                  dot.setAttribute("cy", String(p.y));
                },
              })
            );
          });
          loopTrigger = ScrollTrigger.create({
            trigger: scope,
            start: "top bottom",
            end: "bottom top",
            onToggle: (self) => loops.forEach((l) => (self.isActive ? l.play() : l.pause())),
          });
        };

        const tl = gsap.timeline({ paused: true, onComplete: startLoops });
        tl.fromTo(q(".wm-grid"), { opacity: 0 }, { opacity: 1, duration: 0.9, ease: "none" }, 0)
          .fromTo(q(".wm-track"), { opacity: 0 }, { opacity: 1, duration: 0.6, stagger: 0.2 }, 0.2);

        markers.forEach((marker, i) => {
          const at = 0.35 + i * 0.8;
          tl.fromTo(
            marker,
            { scale: 0, opacity: 0, transformOrigin: "50% 50%" },
            { scale: 1, opacity: 1, duration: 0.7, ease: "power3.out" },
            at
          ).fromTo(
            labels[i],
            { opacity: 0, y: 12 },
            { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
            at + 0.12
          );
          if (arcs[i]) {
            tl.fromTo(arcs[i], { drawSVG: "0%" }, { drawSVG: "100%", duration: 0.85, ease: "power2.inOut" }, at + 0.4);
          }
        });
        tl.fromTo(q(".wm-legend > *"), { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power3.out" }, 2.3);

        const playTrigger = ScrollTrigger.create({ trigger: scope, start: "top 78%", once: true, onEnter: () => tl.play() });

        return () => {
          playTrigger.kill();
          loopTrigger?.kill();
          loops.forEach((l) => l.kill());
          tl.kill();
        };
      };

      // Each canvas animates only while it is the one being displayed, since
      // path lengths can't be measured on a hidden SVG.
      mm.add("(min-width: 640px)", () => buildMap(".wm-wide"));
      mm.add("(max-width: 639px)", () => buildMap(".wm-tall"));
    }, root);

    return () => {
      mm.revert();
      ctx.revert();
    };
  }, []);

  const legend = (
    <div className="wm-legend mt-8 flex flex-wrap items-center gap-x-8 gap-y-3 font-mono text-[11px] uppercase tracking-[0.16em] text-text">
      {/* Both keys sit in the same 32px slot, so the two labels align. */}
      <span className="flex items-center gap-3">
        <span aria-hidden="true" className="flex w-8 justify-center">
          <span className="block h-[11px] w-[11px] rounded-full bg-primary shadow-[0_0_0_4px_rgb(0_107_184/0.12)]" />
        </span>
        Local market understanding
      </span>
      <span className="flex items-center gap-3">
        <span aria-hidden="true" className="flex w-8 justify-center">
          <span className="block h-[1.5px] w-8 rounded-full bg-primary" />
        </span>
        Global delivery standards
      </span>
    </div>
  );

  return (
    <section
      ref={sectionRef}
      id="where-we-work"
      aria-labelledby="where-heading"
      className="relative scroll-mt-24 bg-bg"
    >
      {/* Frame rules, continued from the sections above */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className={`h-full border-x border-dotted border-text/[0.16] ${FRAME}`} />
      </div>

      <div className={`relative ${FRAME}`}>
        <div className={`py-20 sm:py-24 lg:py-28 ${INSET}`}>
          <div className="grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)] lg:items-end lg:gap-16">
            <div>
              <p className="wm-eyebrow flex items-center gap-3">
                <span aria-hidden="true" className="wm-line block h-px w-8 bg-primary" />
                <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-primary sm:text-xs">
                  04
                </span>
              </p>
              <h2
                id="where-heading"
                className="wm-heading mt-5 text-[2.2rem] font-semibold leading-[1.04] tracking-[-0.028em] text-text sm:text-[3rem] lg:text-[3.6rem]"
              >
                Where We Work
              </h2>
            </div>

            <p className="wm-lede max-w-[36ch] font-display text-[1.25rem] font-medium leading-[1.35] tracking-[-0.012em] text-text [text-wrap:pretty] sm:text-[1.45rem] lg:pb-2">
              SKY Tech serves businesses in Pakistan, the USA, and the UK —
              combining local market understanding with global delivery
              standards.
            </p>
          </div>

          {/* ------------------------------------------ Wide map (sm+) */}
          <div className="wm-wide mt-14 hidden sm:block lg:mt-16">
            <div className="relative">
              <svg viewBox="0 0 1000 320" className="h-auto w-full overflow-visible" fill="none" aria-hidden="true">
                <g className="wm-grid">
                  {[80, 160, 240].map((y) => (
                    <line key={`h${y}`} x1="0" y1={y} x2="1000" y2={y} stroke="rgb(18 18 18 / 0.08)" strokeDasharray="2 7" />
                  ))}
                  {[100, 200, 300, 400, 500, 600, 700, 800, 900].map((x) => (
                    <line key={`v${x}`} x1={x} y1="10" x2={x} y2="310" stroke="rgb(18 18 18 / 0.06)" strokeDasharray="2 7" />
                  ))}
                </g>
                <Routes arcs={WIDE_ARCS} />
                {WIDE.map((m) => (
                  <Marker key={m.name} x={m.x} y={m.y} />
                ))}
              </svg>

              {WIDE.map((m) => (
                <div
                  key={m.name}
                  className="wm-label absolute -translate-x-1/2 text-center"
                  style={{ left: `${m.x / 10}%`, top: `calc(${(m.y / 320) * 100}% + 34px)` }}
                >
                  <span className="block whitespace-nowrap font-display text-[1.5rem] font-semibold tracking-[-0.02em] text-text lg:text-[1.9rem]">
                    {m.name}
                  </span>
                </div>
              ))}
            </div>
            {legend}
          </div>

          {/* ---------------------------------------- Tall map (phones) */}
          <div className="wm-tall mt-12 sm:hidden">
            {/* Outer padding holds the last label, which sits below its
                marker; labels are placed against the inner box, which is
                exactly the SVG's size. */}
            <div className="mx-auto max-w-[320px] pb-12">
            <div className="relative">
              <svg viewBox="0 0 320 560" className="h-auto w-full overflow-visible" fill="none" aria-hidden="true">
                <g className="wm-grid">
                  {[64, 144, 224].map((x) => (
                    <line key={`v${x}`} x1={x} y1="0" x2={x} y2="560" stroke="rgb(18 18 18 / 0.07)" strokeDasharray="2 7" />
                  ))}
                  {[175, 385].map((y) => (
                    <line key={`h${y}`} x1="0" y1={y} x2="320" y2={y} stroke="rgb(18 18 18 / 0.06)" strokeDasharray="2 7" />
                  ))}
                </g>
                <Routes arcs={TALL_ARCS} />
                {TALL.map((m) => (
                  <Marker key={m.name} x={m.x} y={m.y} />
                ))}
              </svg>

              {TALL.map((m) => (
                /* Below each marker, left-aligned: the routes leave every
                   marker toward the right, so this corner is always clear. */
                <div
                  key={m.name}
                  className="wm-label absolute"
                  style={{ left: `calc(${(m.x / 320) * 100}% - 12px)`, top: `calc(${(m.y / 560) * 100}% + 30px)` }}
                >
                  <span className="block whitespace-nowrap font-display text-[1.6rem] font-semibold tracking-[-0.02em] text-text">
                    {m.name}
                  </span>
                </div>
              ))}
            </div>
            </div>
            {legend}
          </div>
        </div>
      </div>
    </section>
  );
}
