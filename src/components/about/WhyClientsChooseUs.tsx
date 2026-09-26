"use client";

import { useEffect, useLayoutEffect, useRef, type ReactNode } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

// Runs before paint on the client so the reveal never flashes its end state.
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

const CLOSED = "inset(0 100% 0 0)";
const OPEN = "inset(0 0% 0 0)";

/* Shares the page's drafting frame, so the rules run on unbroken from the
   sections above — here drawn in white on the navy ground. */
const FRAME = "mx-4 sm:mx-6 lg:mx-8 xl:mx-auto xl:max-w-6xl";
const INSET = "px-5 sm:px-8 lg:px-12";

const CYAN = "#00c2ff";
const FAINT = "rgb(255 255 255 / 0.18)";
const SOFT = "rgb(255 255 255 / 0.34)";

/* Every schematic is choreographed from data attributes:
   data-kind  "draw" (stroke draws on) | "pop" (scales in) | "shrink" (settles
              down from an inflated height)
   data-step  when it happens, in beats
   A card's schematic plays once when the grid arrives, and replays on hover. */
type Kind = "draw" | "pop" | "shrink";
const s = (
  kind: Kind,
  step: number,
  extra: { "data-dur"?: string; "data-from"?: string } = {}
) => ({
  "data-kind": kind,
  "data-step": String(step),
  ...extra,
});

/* 01 — Every recommendation is tied to a business outcome, not a feature
   list: three list lines converge on a single target. */
function OutcomeVisual() {
  return (
    <>
      {[36, 60, 84].map((y) => (
        <line key={y} x1="24" y1={y} x2="84" y2={y} stroke={SOFT} strokeWidth="2" strokeLinecap="round" {...s("draw", 0)} />
      ))}
      <path d="M96 36 C 132 36, 142 60, 176 60" stroke={CYAN} strokeOpacity="0.75" strokeWidth="1.5" {...s("draw", 1)} />
      <path d="M96 60 L 176 60" stroke={CYAN} strokeOpacity="0.75" strokeWidth="1.5" {...s("draw", 1)} />
      <path d="M96 84 C 132 84, 142 60, 176 60" stroke={CYAN} strokeOpacity="0.75" strokeWidth="1.5" {...s("draw", 1)} />
      <circle cx="210" cy="60" r="24" stroke={FAINT} {...s("pop", 2)} />
      <circle cx="210" cy="60" r="13" stroke={CYAN} strokeWidth="1.5" {...s("pop", 2.4)} />
      <circle cx="210" cy="60" r="4.5" fill={CYAN} {...s("pop", 2.8)} />
    </>
  );
}

/* 02 — Design, development and marketing without five different vendors:
   five separate points resolve into one partner. */
function OnePartnerVisual() {
  const ys = [16, 38, 60, 82, 104];
  return (
    <>
      {ys.map((y, i) => (
        <path key={y} d={`M34 ${y} C 108 ${y}, 128 60, 186 60`} stroke={FAINT} strokeWidth="1.2" {...s("draw", 1 + i * 0.12)} />
      ))}
      {ys.map((y, i) => (
        <circle key={`d${y}`} cx="30" cy={y} r="4" fill={SOFT} {...s("pop", i * 0.15)} />
      ))}
      <circle cx="210" cy="60" r="32" stroke={CYAN} strokeOpacity="0.3" {...s("pop", 2.4)} />
      <circle cx="210" cy="60" r="20" fill={CYAN} {...s("pop", 2.1)} />
      <path d="M203 60.5l5 5 9-10" stroke="#0b1f35" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...s("draw", 2.6)} />
    </>
  );
}

/* 03 — Clear timelines and honest updates throughout: a timeline that fills
   milestone by milestone. */
function TimelineVisual() {
  const xs = [36, 100, 164, 228];
  return (
    <>
      <line x1="24" y1="64" x2="240" y2="64" stroke={FAINT} strokeWidth="2" strokeLinecap="round" />
      <line x1="36" y1="64" x2="228" y2="64" stroke={CYAN} strokeWidth="2" strokeLinecap="round" {...s("draw", 0.6, { "data-dur": "1.6" })} />
      {xs.map((x, i) => (
        <line key={`t${x}`} x1={x} y1="34" x2={x} y2="46" stroke={SOFT} strokeLinecap="round" {...s("draw", 0.2 + i * 0.1)} />
      ))}
      {xs.map((x) => (
        <circle key={`r${x}`} cx={x} cy="64" r="6" fill="#0b1f35" stroke={SOFT} strokeWidth="1.2" />
      ))}
      {xs.map((x, i) => (
        <circle key={`f${x}`} cx={x} cy="64" r="3" fill={CYAN} {...s("pop", 0.6 + i * 1.35)} />
      ))}
      <rect x="196" y="84" width="64" height="18" rx="9" stroke={SOFT} {...s("pop", 5)} />
      <line x1="206" y1="93" x2="232" y2="93" stroke={SOFT} strokeWidth="2" strokeLinecap="round" {...s("draw", 5.3)} />
    </>
  );
}

/* 04 — Quality delivery without inflated agency overhead: each bar settles
   from its inflated outline down to a lean, honest height. */
function PricingVisual() {
  return (
    <>
      <line x1="44" y1="106" x2="224" y2="106" stroke={FAINT} strokeWidth="1.5" strokeLinecap="round" />
      <rect x="70" y="14" width="42" height="92" rx="6" stroke={SOFT} strokeDasharray="3 4" {...s("pop", 0)} />
      <rect x="70" y="50" width="42" height="56" rx="6" fill={CYAN} {...s("shrink", 0.8, { "data-from": "1.64" })} />
      <rect x="148" y="30" width="42" height="76" rx="6" stroke={SOFT} strokeDasharray="3 4" {...s("pop", 0.3)} />
      <rect x="148" y="64" width="42" height="42" rx="6" fill={CYAN} fillOpacity="0.55" {...s("shrink", 1.1, { "data-from": "1.8" })} />
    </>
  );
}

/* 05 — Deadlines as commitments, not estimates: a progress ring closes
   exactly on the deadline marker. */
function DeadlineVisual() {
  return (
    <>
      <circle cx="72" cy="60" r="38" stroke="rgb(255 255 255 / 0.1)" strokeWidth="3" />
      <circle cx="72" cy="60" r="38" stroke={CYAN} strokeWidth="3" strokeLinecap="round" transform="rotate(-90 72 60)" {...s("draw", 0, { "data-dur": "1.3" })} />
      <path d="M58 60.5l9.5 9.5 19-21" stroke="#ffffff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" {...s("draw", 4.6)} />
      <line x1="126" y1="60" x2="222" y2="60" stroke={FAINT} strokeWidth="1.5" strokeDasharray="2 5" strokeLinecap="round" {...s("draw", 1.2)} />
      <line x1="228" y1="34" x2="228" y2="86" stroke={SOFT} strokeWidth="1.5" strokeLinecap="round" {...s("draw", 2.4)} />
      <path d="M228 34h16l-4 6 4 6h-16z" fill={CYAN} {...s("pop", 3)} />
    </>
  );
}

const REASONS: Array<{
  title: string;
  description: string;
  visual: ReactNode;
  span: string;
}> = [
  {
    title: "Business-First Thinking",
    description:
      "Every recommendation is tied to a business outcome, not just a feature list.",
    visual: <OutcomeVisual />,
    span: "sm:col-span-2 lg:col-span-7",
  },
  {
    title: "One Partner, Multiple Capabilities",
    description:
      "Design, development, and marketing without coordinating five different vendors.",
    visual: <OnePartnerVisual />,
    span: "lg:col-span-5",
  },
  {
    title: "Transparent Communication",
    description: "Clear timelines, clear pricing, and honest updates throughout.",
    visual: <TimelineVisual />,
    span: "lg:col-span-4",
  },
  {
    title: "Competitive, Honest Pricing",
    description: "Quality delivery without inflated agency overhead.",
    visual: <PricingVisual />,
    span: "lg:col-span-4",
  },
  {
    title: "On-Time Delivery",
    description: "We treat deadlines as commitments, not estimates.",
    visual: <DeadlineVisual />,
    span: "lg:col-span-4",
  },
];

export default function WhyClientsChooseUs() {
  const sectionRef = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    const root = sectionRef.current;
    if (!root) return;
    // Markup is authored complete, so reduced motion shows every schematic
    // in its finished state.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const cleanups: Array<() => void> = [];

    const ctx = gsap.context(() => {
      const BEAT = 0.28;
      const cards = gsap.utils.toArray<HTMLElement>(".why-card", root);

      // One timeline per schematic, built from its data attributes.
      const schematics = cards.map((card) => {
        const tl = gsap.timeline({ paused: true });
        card.querySelectorAll<SVGElement>("[data-kind]").forEach((el) => {
          const at = parseFloat(el.dataset.step ?? "0") * BEAT;
          const kind = el.dataset.kind as Kind;
          if (kind === "draw") {
            tl.fromTo(
              el,
              { drawSVG: "0%" },
              {
                drawSVG: "100%",
                duration: parseFloat(el.dataset.dur ?? "0.7"),
                ease: "power2.inOut",
              },
              at
            );
          } else if (kind === "pop") {
            tl.fromTo(
              el,
              { scale: 0, opacity: 0, transformOrigin: "50% 50%" },
              { scale: 1, opacity: 1, duration: 0.45, ease: "power3.out" },
              at
            );
          } else {
            tl.fromTo(
              el,
              {
                scaleY: parseFloat(el.dataset.from ?? "1.6"),
                transformOrigin: "50% 100%",
              },
              { scaleY: 1, duration: 1, ease: "power3.inOut" },
              at
            );
          }
        });
        return tl;
      });

      const intro = gsap.timeline({ paused: true });
      intro
        .fromTo(
          ".why-line",
          { scaleX: 0, transformOrigin: "left center" },
          { scaleX: 1, duration: 0.6, ease: "power3.out" },
          0
        )
        .fromTo(
          ".why-eyebrow",
          { opacity: 0, y: 8 },
          { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
          0.06
        )
        .fromTo(
          ".why-heading",
          { clipPath: CLOSED },
          { clipPath: OPEN, duration: 0.9, ease: "power3.inOut" },
          0.12
        );

      // Header on its own one-shot trigger.
      ScrollTrigger.create({
        trigger: root,
        start: "top 72%",
        once: true,
        onEnter: () => intro.play(),
      });

      // Cards rise in order; each schematic starts as its card lands.
      const grid = gsap.timeline({ paused: true });
      grid.fromTo(
        cards,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1, stagger: 0.12, ease: "power3.out" },
        0
      );
      schematics.forEach((tl, i) => {
        grid.add(() => {
          tl.play(0);
        }, 0.45 + i * 0.12);
      });
      ScrollTrigger.create({
        trigger: ".why-grid",
        start: "top 78%",
        once: true,
        onEnter: () => grid.play(),
      });

      // Hover replays a card's schematic — mouse devices only, and never
      // mid-play, so sweeping across the grid doesn't stutter.
      if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
        cards.forEach((card, i) => {
          const replay = () => {
            if (grid.progress() === 1 && !schematics[i].isActive()) {
              schematics[i].restart();
            }
          };
          card.addEventListener("pointerenter", replay);
          cleanups.push(() => card.removeEventListener("pointerenter", replay));
        });
      }
    }, root);

    return () => {
      cleanups.forEach((fn) => fn());
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="why-clients-heading"
      className="relative isolate overflow-hidden bg-navy text-white"
    >
      {/* Frame rules, continued in white on navy */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className={`h-full border-x border-dotted border-white/[0.14] ${FRAME}`} />
      </div>

      <div className={`relative ${FRAME}`}>
        <div className={`py-20 sm:py-24 lg:py-28 ${INSET}`}>
          <p className="why-eyebrow flex items-center gap-3">
            <span aria-hidden="true" className="why-line block h-px w-8 bg-cta" />
            <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-cta sm:text-xs">
              03
            </span>
          </p>

          <h2
            id="why-clients-heading"
            className="why-heading mt-5 text-[2.2rem] font-semibold leading-[1.04] tracking-[-0.028em] sm:text-[3rem] lg:text-[3.6rem]"
          >
            Why Clients Choose Us
          </h2>

          <ul className="why-grid mt-12 grid gap-4 sm:mt-14 sm:grid-cols-2 sm:gap-5 lg:grid-cols-12">
            {REASONS.map((reason, i) => (
              <li key={reason.title} className={`why-card ${reason.span}`}>
                <div className="group relative flex h-full min-h-[300px] flex-col rounded-[24px] border border-white/10 bg-white/[0.035] p-7 transition-[transform,border-color,background-color] duration-500 ease-out hover:-translate-y-1 hover:border-cta/35 hover:bg-white/[0.055] sm:p-8">
                  {/* The schematic must be allowed to shrink. As a flex item
                      it defaults to min-width:auto, so w-full made it claim
                      the whole row — the number's width and the gap then
                      pushed it past the card's edge on a phone. flex-1 with
                      min-w-0 lets it take what is left and no more. */}
                  <div className="flex items-start justify-between gap-4 sm:gap-6">
                    <span className="shrink-0 font-mono text-[12px] tracking-[0.16em] text-cta">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <svg
                      viewBox="0 0 260 120"
                      className="h-auto min-w-0 max-w-[260px] flex-1 overflow-visible"
                      fill="none"
                      aria-hidden="true"
                    >
                      {reason.visual}
                    </svg>
                  </div>

                  <div className="mt-auto pt-8">
                    <h3 className="text-[1.3rem] font-semibold leading-[1.2] tracking-[-0.015em] text-white sm:text-[1.4rem]">
                      {reason.title}
                    </h3>
                    <p className="mt-3 max-w-[40ch] text-[0.95rem] leading-relaxed text-white/75">
                      {reason.description}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
