"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import ApproachPillar, { type Pillar } from "./ApproachPillar";
import { BuildVisual, AutomateVisual, GrowVisual } from "./ApproachVisuals";
import JourneyRail from "./JourneyRail";

const CLOSED = "inset(0 100% 0 0)";
const OPEN = "inset(0 0% 0 0)";

const PILLARS: Pillar[] = [
  {
    index: "01",
    title: "Build",
    subtitle: "Custom Digital Products",
    description:
      "We design and develop websites, web applications, and WordPress solutions that are fast, secure, and built to convert.",
    href: "/services",
    progress: "33.333%",
    visual: <BuildVisual />,
  },
  {
    index: "02",
    title: "Automate",
    subtitle: "Business Processes",
    description:
      "We streamline the manual, repetitive parts of your business through automation and smart digital workflows.",
    href: "/services",
    progress: "66.666%",
    visual: <AutomateVisual />,
  },
  {
    index: "03",
    title: "Grow",
    subtitle: "Digital Presence & Revenue",
    description:
      "We combine SEO, social media, and paid marketing to turn traffic into leads and leads into customers.",
    href: "/services",
    progress: "100%",
    visual: <GrowVisual />,
  },
];

export default function ValuePropsSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = sectionRef.current;
    if (!root) return;

    const mm = gsap.matchMedia();

    const ctx = gsap.context(() => {
      const pillars = gsap.utils.toArray<HTMLElement>(".approach-pillar");
      const stage = root.querySelector<HTMLElement>(".approach-stage");
      const pinwrap = root.querySelector<HTMLElement>(".approach-pinwrap");
      if (!stage || !pinwrap) return;

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set(".approach-line, .approach-rule, .rail-h-blue", { scaleX: 1 });
        gsap.set(".av-line", { scaleY: 1 });
        gsap.set(".gv-path", { drawSVG: "100%" });
        return;
      }

      /* --- Steps 1-4: eyebrow, heading, supporting paragraph ------------- */
      gsap.set(".approach-line", { scaleX: 0, transformOrigin: "left center" });

      let headerDone = false;
      let stageInView = false;
      let cardsDone = false;
      let pendingFocus: number | null = null;

      const header = gsap.timeline({
        scrollTrigger: { trigger: root, start: "top 78%", once: true },
        onComplete: () => {
          gsap.set(".approach-heading-line", { clearProps: "willChange" });
          headerDone = true;
          maybePlayCards();
        },
      });

      header
        .to(".approach-line", { scaleX: 1, duration: 0.5 }, 0)
        .fromTo(
          ".approach-eyebrow",
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.5 },
          0.05
        )
        .fromTo(
          ".approach-count",
          { opacity: 0 },
          { opacity: 1, duration: 0.5 },
          0.15
        )
        .fromTo(
          ".approach-heading-line",
          { clipPath: CLOSED, willChange: "clip-path" },
          { clipPath: OPEN, duration: 0.65, stagger: 0.09 },
          0.14
        )
        .fromTo(
          ".approach-lede",
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.6 },
          0.5
        );

      /* --- Steps 5-10: cards arrive, then their visuals ------------------
         Each card enters from a different corner — Build from the bottom
         left, Automate straight up from below, Grow from the bottom right —
         so the trio converges rather than marching in identically. Held
         until the heading and paragraph have finished. */
      // Never shift further left than the container's own margin, or the
      // pre-state pushes past the viewport and creates a horizontal
      // scrollbar at widths where the container has little side gutter.
      const gutter = pillars[0]?.getBoundingClientRect().left ?? 24;
      const dx = Math.max(8, Math.min(window.innerWidth >= 1024 ? 56 : 18, gutter - 6));
      const FROM = [
        { x: -dx, y: 64 },
        { x: 0, y: 72 },
        { x: dx, y: 64 },
      ];

      const cards = gsap.timeline({
        paused: true,
        onComplete: () => {
          cardsDone = true;
          // A card that asked for focus mid-entrance gets it now, rather than
          // being dropped until the next scroll event.
          if (pendingFocus !== null) {
            const next = pendingFocus;
            pendingFocus = null;
            setFocus(next);
          }
        },
      });

      pillars.forEach((pillar, i) => {
        const q = gsap.utils.selector(pillar);
        const at = i * 0.18;

        cards
          .fromTo(
            pillar,
            { opacity: 0, scale: 0.96, ...FROM[i] },
            { opacity: 1, scale: 1, x: 0, y: 0, duration: 0.85 },
            at
          )
          .fromTo(
            q(".approach-rule"),
            { scaleX: 0, transformOrigin: "left center" },
            { scaleX: 1, duration: 0.7 },
            at + 0.22
          );

        // Build: the interface composition assembles in two beats.
        if (i === 0) {
          cards.fromTo(
            q(".bv-piece"),
            { opacity: 0, y: 14 },
            { opacity: 1, y: 0, duration: 0.55, stagger: 0.1 },
            at + 0.4
          );
        }

        // Automate: the hero visual — a signal moving through the workflow.
        if (i === 1) {
          cards
            .fromTo(
              q(".av-line"),
              { scaleY: 0, transformOrigin: "top center" },
              { scaleY: 1, duration: 0.85 },
              at + 0.4
            )
            .fromTo(
              q(".av-dot"),
              { scale: 0, transformOrigin: "center" },
              { scale: 1, duration: 0.35, stagger: 0.16 },
              at + 0.46
            )
            .fromTo(
              q(".av-row"),
              { opacity: 0, y: 10 },
              { opacity: 1, y: 0, duration: 0.45, stagger: 0.16 },
              at + 0.44
            );
        }

        // Grow: one drawn stroke, deliberately quieter than Automate.
        if (i === 2) {
          cards
            .fromTo(
              q(".gv-path"),
              { drawSVG: "0%" },
              { drawSVG: "100%", duration: 1, ease: "none" },
              at + 0.4
            )
            .fromTo(
              q(".gv-area"),
              { opacity: 0 },
              { opacity: 1, duration: 0.9 },
              at + 0.6
            )
            .fromTo(
              q(".gv-mark"),
              { scale: 0, transformOrigin: "center" },
              { scale: 1, duration: 0.3, stagger: 0.22 },
              at + 0.62
            )
            .fromTo(
              q(".gv-label"),
              { opacity: 0 },
              { opacity: 1, duration: 0.4, stagger: 0.22 },
              at + 0.67
            )
            .fromTo(
              q(".gv-end"),
              { opacity: 0, scale: 0.6, transformOrigin: "246px 15px" },
              { opacity: 1, scale: 1, duration: 0.45 },
              at + 1.15
            )
            .fromTo(
              q(".gv-chip"),
              { opacity: 0, scale: 0.7, y: 6 },
              { opacity: 1, scale: 1, y: 0, duration: 0.45 },
              at + 1.25
            );
        }
      });

      function maybePlayCards() {
        if (headerDone && stageInView) cards.play();
      }

      ScrollTrigger.create({
        trigger: stage,
        start: "top 85%",
        once: true,
        onEnter: () => {
          stageInView = true;
          maybePlayCards();
        },
      });

      /* --- The focus relay and the journey rail, in lockstep --------------
         One card at a time pops forward and is highlighted; the one it takes
         over from returns to its exact resting position. On desktop the rail
         is pinned alongside the cards and driven by the same scroll range, so
         a node lands exactly as focus changes hands. */
      // Reaching the relay means the entrance is moot — snap it to its end
      // rather than letting a fast scroll arrive at a pin that does nothing.
      const ensureCardsLanded = () => {
        if (cardsDone) return;
        cards.progress(1);
        cardsDone = true;
      };

      // Single-column phones stack cards with a narrow gap, so the pop is
      // kept inside that gap rather than lifting into the card above.
      const compact = window.matchMedia("(max-width: 639px)");

      let active = -2;
      const setFocus = (i: number) => {
        if (!cardsDone) {
          pendingFocus = i;
          return;
        }
        if (i === active) return;
        active = i;
        pillars.forEach((pillar, k) => {
          const on = k === i;
          pillar.classList.toggle("is-focused", on);
          gsap.to(pillar, {
            scale: on ? (compact.matches ? 1.02 : 1.045) : 1,
            y: on ? (compact.matches ? -6 : -14) : 0,
            duration: 0.55,
            ease: "sky",
            overwrite: "auto",
          });
        });
      };

      const nodes = gsap.utils.toArray<HTMLElement>(".rail-node");
      const texts = gsap.utils.toArray<HTMLElement>(".rail-text");
      const hSegs = gsap.utils.toArray<HTMLElement>(".rail-h-blue");

      gsap.set(nodes, { scale: 0, transformOrigin: "center" });
      gsap.set(texts, { opacity: 0, y: 8 });
      gsap.set(hSegs, { scaleX: 0, transformOrigin: "left center" });

      // Exactly three units long, one per pillar, so a scrub maps unit k onto
      // the moment pillar k takes focus. Node k lands on the beat; its
      // connector then draws across to node k+1 during the handover.
      const buildRail = (segs: HTMLElement[], prop: "scaleX" | "scaleY") => {
        const tl = gsap.timeline();
        nodes.forEach((node, k) => {
          tl.to(node, { scale: 1, duration: 0.25, ease: "skyShort" }, k).to(
            texts[k],
            { opacity: 1, y: 0, duration: 0.3 },
            k + 0.04
          );
          if (segs[k]) {
            tl.to(
              segs[k],
              { [prop]: 1, duration: 0.68, ease: "none" },
              k + 0.25
            );
          }
        });
        tl.to({}, { duration: 0.4 }, 2.6);
        return tl;
      };

      // Desktop: cards and rail are pinned together and a single ScrollTrigger
      // owns both — the relay (discrete) and the rail (scrubbed) cannot drift
      // apart because they read the same progress.
      mm.add("(min-width: 1024px)", () => {
        const railTl = buildRail(hSegs, "scaleX");
        const pin = ScrollTrigger.create({
          trigger: pinwrap,
          start: "center center",
          end: "+=1100",
          pin: true,
          anticipatePin: 1,
          scrub: 0.55,
          animation: railTl,
          onUpdate: (self) => {
            ensureCardsLanded();
            setFocus(
              Math.min(pillars.length - 1, Math.floor(self.progress * 3))
            );
          },
          // Release the last card instead of leaving Grow stuck out on its own
          // once the section is behind you.
          onLeave: () => setFocus(-1),
          onLeaveBack: () => setFocus(-1),
        });
        return () => {
          pin.kill();
          railTl.kill();
        };
      });

      // Below lg the cards are already stacked, so no pin is needed — each
      // takes focus as it passes the middle of the viewport, and the rail
      // plays once it arrives.
      mm.add("(max-width: 1023px)", () => {
        const railTl = buildRail(hSegs, "scaleX").pause().timeScale(2.4);

        const triggers = pillars.map((pillar, i) =>
          ScrollTrigger.create({
            trigger: pillar,
            start: "top 62%",
            end: "bottom 42%",
            onToggle: (self) => setFocus(self.isActive ? i : -1),
          })
        );

        const railTrigger = ScrollTrigger.create({
          trigger: ".journey-rail",
          start: "top 88%",
          once: true,
          onEnter: () => railTl.play(),
        });

        return () => {
          triggers.forEach((t) => t.kill());
          railTrigger.kill();
          railTl.kill();
        };
      });

    }, root);

    return () => {
      mm.revert();
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="approach-heading"
      className="sky-approach relative isolate bg-[var(--ap-bg)] py-28 sm:py-36"
    >
      {/* The site's drafting frame, with registration marks at the section's
          corners — shared with the Trust Bar, About page and footer. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="relative mx-4 h-full border-x border-dotted border-[var(--ap-ink)]/[0.16] sm:mx-6 lg:mx-8 xl:mx-auto xl:max-w-6xl">
          {["top-0 -translate-y-1/2", "bottom-0 translate-y-1/2"].map((v) =>
            ["left-0 -translate-x-1/2", "right-0 translate-x-1/2"].map((h) => (
              <span key={v + h} className={`absolute h-[11px] w-[11px] ${v} ${h}`}>
                <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-[var(--ap-ink)]/40" />
                <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-[var(--ap-ink)]/40" />
              </span>
            ))
          )}
        </div>
      </div>

      <div className="relative mx-4 px-5 sm:mx-6 sm:px-8 lg:mx-8 lg:px-12 xl:mx-auto xl:max-w-6xl">
        <div className="flex items-start justify-between gap-6">
          <p className="flex items-center gap-3">
            <span
              aria-hidden="true"
              className="approach-line block h-px w-8 bg-[var(--ap-blue)]"
            />
            <span className="approach-eyebrow font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--ap-blue)] sm:text-xs">
              The SKY Tech Approach
            </span>
          </p>
          <span
            aria-hidden="true"
            className="approach-count shrink-0 font-mono text-[11px] tracking-[0.18em] text-[var(--ap-muted)]"
          >
            01 / 03
          </span>
        </div>

        <h2
          id="approach-heading"
          className="mt-8 max-w-4xl text-[2.2rem] font-semibold leading-[1.04] tracking-[-0.028em] text-[var(--ap-ink)] sm:text-[3rem] lg:text-[3.6rem]"
        >
          <span className="approach-heading-line block">
            Your Business Doesn&apos;t Need
          </span>
          <span className="approach-heading-line block">More Technology.</span>
          <span className="approach-heading-line block">
            It Needs the{" "}
            <span className="text-[var(--ap-blue)]">Right Technology.</span>
          </span>
        </h2>

        <p className="approach-lede mt-7 max-w-2xl text-base leading-relaxed text-[var(--ap-ink)] sm:text-lg">
          Outdated websites, disconnected marketing, and manual processes
          quietly cost businesses time, leads, and revenue every day. At SKY
          Tech, we don&apos;t just build — we solve. Every website,
          application, and campaign we deliver is designed around one goal:
          real, measurable business growth.
        </p>

        {/* Cards and rail are pinned as one unit on desktop so the rail is
            on screen while the relay runs. Grow sits half-width alone at
            tablet rather than spanning: a full-bleed cell would letterbox
            its trajectory SVG badly. */}
        <div className="approach-pinwrap">
          <div className="approach-stage mt-14 grid grid-cols-1 gap-7 sm:mt-16 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
            {PILLARS.map((pillar) => (
              <ApproachPillar key={pillar.title} pillar={pillar} />
            ))}
          </div>

          <JourneyRail />
        </div>
      </div>
    </section>
  );
}
