"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

// Runs before paint on the client so the reveal never flashes its end state.
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

const CLOSED = "inset(0 100% 0 0)";
const OPEN = "inset(0 0% 0 0)";

/* Shares the hero's drafting frame, so its dotted rules run on unbroken from
   the hero into this section. */
const FRAME = "mx-4 sm:mx-6 lg:mx-8 xl:mx-auto xl:max-w-6xl";
const INSET = "px-5 sm:px-8 lg:px-12";

/* The story, split into reading-sized phrases. The eye takes a whole phrase
   at once, so the paragraph reads deliberately instead of ticking along one
   word at a time. Joined with single spaces these are the paragraph exactly
   as written in src/content/about.md — the copy is never edited here. */
const PHRASES = [
  "SKY Tech started",
  "with a simple observation:",
  "most businesses don't fail",
  "because of bad ideas —",
  "they fail because their",
  "technology,",
  "marketing, and",
  "operations",
  "never work together.",
  "We built SKY Tech to",
  "close that gap,",
  "combining software development,",
  "design, and digital marketing",
  "under one roof",
  "so businesses can move faster",
  "without juggling multiple vendors.",
];

/* The two phrases the story turns on: the problem, and the answer. */
const MARK_TONES: Record<number, "problem" | "answer"> = {
  8: "problem", // "never work together."
  13: "answer", // "under one roof"
};

/* Which phrase a word belongs to — the diagram's beats are placed by it, so
   every visual change lands on the phrase that describes it. */
const beat = (needle: string) => PHRASES.findIndex((p) => p.includes(needle));

/* ---------------------------------------------------------------- Diagram --
   Three disciplines named in the story. They start loosely linked, drift
   apart as the problem is read ("never work together"), then are pulled back
   into one connected system around SKY Tech as the answer is read, and a
   single ring closes around them ("under one roof"). */
const C = { x: 240, y: 225 };
type Key = "T" | "M" | "O";
const NODES: Array<{ key: Key; label: string; word: string }> = [
  { key: "T", label: "Technology", word: "technology," },
  { key: "M", label: "Marketing", word: "marketing," },
  { key: "O", label: "Operations", word: "operations" },
];
const TIGHT: Record<Key, [number, number]> = {
  T: [240, 110],
  M: [135, 295],
  O: [345, 295],
};
const APART: Record<Key, [number, number]> = {
  T: [240, 58],
  M: [82, 352],
  O: [398, 352],
};
// Pairs, with how far along the line the node's pill edge sits.
const PAIRS: Array<[Key, Key, number]> = [
  ["T", "M", 0.17],
  ["T", "O", 0.17],
  ["M", "O", 0.32],
];
const PILL = { w: 124, h: 40 };
const RING_R = 205;

const lerp = (
  a: [number, number],
  b: [number, number],
  t: number
): [number, number] => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];

/* A broken link is two half-lines, one from each node toward the midpoint.
   Tight, they meet; apart, they stop short and leave a visible gap. */
const halfLines = (
  pos: Record<Key, [number, number]>,
  gap: number
) =>
  PAIRS.flatMap(([a, b, edge]) => {
    const [x1, y1] = lerp(pos[a], pos[b], edge);
    const [x2, y2] = lerp(pos[a], pos[b], 0.5 - gap);
    const [x3, y3] = lerp(pos[b], pos[a], edge);
    const [x4, y4] = lerp(pos[b], pos[a], 0.5 - gap);
    return [
      { x1, y1, x2, y2 },
      { x1: x3, y1: y3, x2: x4, y2: y4 },
    ];
  });

const GREY_TIGHT = halfLines(TIGHT, 0);
const GREY_APART = halfLines(APART, 0.12);

const GREY = "rgba(18, 18, 18, 0.34)";
const BLUE = "#006bb8";
const STEP = 0.24; // timeline seconds per phrase — the section's pace dial

export default function AboutStory() {
  const sectionRef = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    const root = sectionRef.current;
    if (!root) return;
    // Markup is authored in its finished state, so reduced motion simply
    // shows the completed story and diagram.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const mm = gsap.matchMedia();

    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(root);

      /* Label and heading arrive once, on their own one-shot trigger. */
      gsap
        .timeline({
          scrollTrigger: { trigger: root, start: "top 78%", once: true },
        })
        .fromTo(
          ".story-line",
          { scaleX: 0, transformOrigin: "left center" },
          { scaleX: 1, duration: 0.6, ease: "power3.out" },
          0
        )
        .fromTo(
          ".story-eyebrow",
          { opacity: 0, y: 8 },
          { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
          0.08
        )
        .fromTo(
          ".story-heading",
          { clipPath: CLOSED },
          { clipPath: OPEN, duration: 0.8, ease: "power3.inOut" },
          0.15
        );

      /* Phrases resolve from a faint ghost to full ink, and the two key
         phrases are underlined as they are read. */
      const addPhrases = (tl: gsap.core.Timeline) => {
        tl.fromTo(
          q(".story-phrase"),
          { opacity: 0.16 },
          { opacity: 1, duration: 0.45, stagger: STEP, ease: "none" },
          0
        );
        // Document order, so the underlines match the phrases they belong to.
        Object.keys(MARK_TONES)
          .map(Number)
          .sort((a, b) => a - b)
          .forEach((phrase, i) => {
            tl.fromTo(
              q(".story-mark")[i],
              { backgroundSize: "0% 2px" },
              { backgroundSize: "100% 2px", duration: 0.5, ease: "none" },
              phrase * STEP
            );
          });
      };

      /* The diagram, on the same clock as the words: every beat is placed at
         the word it illustrates, so a phrase and its effect land on the same
         frame. Beats never overlap on the same property, and the last one
         (the ring) finishes well before the timeline ends, so the diagram is
         visibly complete rather than still resolving as it leaves. */
      const addDiagram = (tl: gsap.core.Timeline) => {
        const t = (word: string, plus = 0) => Math.max(0, beat(word) * STEP + plus);
        const nodes = q(".story-node");
        const greys = q(".story-grey");
        const pills = q(".story-pill");

        /* The opening, one beat per phrase, so the diagram is building the
           whole time the first lines are read rather than sitting still:
           the drafting guide and centre mark arrive, the three disciplines
           travel out from the centre, then the loose links appear. */
        tl.fromTo(
          q(".story-orbit"),
          { opacity: 0, scale: 0.92, svgOrigin: `${C.x} ${C.y}` },
          { opacity: 1, scale: 1, duration: 0.7, ease: "power2.out" },
          0
        ).fromTo(
          q(".story-cross"),
          { opacity: 0, scale: 0, svgOrigin: `${C.x} ${C.y}` },
          { opacity: 1, scale: 1, duration: 0.35, ease: "power3.out" },
          0.1
        );

        /* Scales an inner group, never .story-node itself: the drift below
           moves .story-node with x/y, and a scale origin on the same element
           leaves a residual offset that lands the pills off their marks.
           Scaling about the hub makes each pill travel outward into place. */
        NODES.forEach((_, i) => {
          tl.fromTo(
            q(".story-node-in")[i],
            { opacity: 0, scale: 0.35, svgOrigin: `${C.x} ${C.y}` },
            { opacity: 1, scale: 1, duration: 0.5, ease: "power3.out" },
            i * STEP
          );
        });

        // The loose links between them, still grey and dashed.
        tl.fromTo(
          greys,
          { opacity: 0 },
          { opacity: 1, duration: 0.4, stagger: 0.05, ease: "none" },
          3 * STEP
        );

        // Each discipline sharpens as the story names it.
        NODES.forEach((n, i) => {
          tl.fromTo(
            q(".story-label")[i],
            { opacity: 0.4 },
            { opacity: 1, duration: 0.25 },
            t(n.word)
          );
        });

        // "…never work together." — they drift apart, the links break.
        const drift = t("never");
        NODES.forEach((n, i) => {
          tl.to(
            nodes[i],
            {
              x: APART[n.key][0] - TIGHT[n.key][0],
              y: APART[n.key][1] - TIGHT[n.key][1],
              duration: 0.35,
              ease: "power1.inOut",
            },
            drift
          );
        });
        greys.forEach((line, i) => {
          tl.fromTo(
            line,
            // Opacity is owned by the beat above, so the links stay hidden
            // until they are drawn in rather than showing from the start.
            { attr: GREY_TIGHT[i] },
            { attr: GREY_APART[i], duration: 0.35, ease: "power1.inOut" },
            drift
          );
        });

        // "…to close that gap" — pulled back together, and reconnected.
        const close = t("close");
        NODES.forEach((_, i) => {
          tl.to(
            nodes[i],
            { x: 0, y: 0, duration: 0.55, ease: "power2.inOut" },
            close
          );
        });
        tl.fromTo(
          pills,
          { stroke: GREY },
          { stroke: BLUE, duration: 0.4, ease: "none" },
          close
        )
          .to(greys, { opacity: 0, duration: 0.25, ease: "none" }, close + 0.15)
          .fromTo(
            q(".story-link"),
            { drawSVG: "50% 50%" },
            { drawSVG: "0% 100%", duration: 0.4, stagger: 0.06, ease: "power2.out" },
            close + 0.3
          )
          .fromTo(
            q(".story-hub"),
            { scale: 0, opacity: 0, svgOrigin: `${C.x} ${C.y}` },
            { scale: 1, opacity: 1, duration: 0.35, ease: "power3.out" },
            close + 0.45
          )
          // "…under one roof" — one ring closes around the whole system.
          .fromTo(
            q(".story-ring"),
            { drawSVG: "0%" },
            // Drawn over a longer beat than the words it spans, so the final
            // close reads as a settle rather than a snap.
            { drawSVG: "100%", duration: 0.95, ease: "power2.inOut" },
            t("under")
          );
      };

      const header = document.querySelector<HTMLElement>("header");
      const headerOffset = () => Math.round((header?.offsetHeight ?? 0) / 2);

      /* Desktop with room to spare: pin the story beside its diagram and
         drive both from one scroll range, so a word and its effect in the
         diagram land on the same frame. */
      mm.add("(min-width: 1024px) and (min-height: 760px)", () => {
        const tl = gsap.timeline();
        addPhrases(tl);
        addDiagram(tl);
        // The last tenth of the range rests on the completed story and
        // diagram, so the section lands rather than cutting away mid-reveal.
        tl.to({}, { duration: 0.5 });

        const st = ScrollTrigger.create({
          trigger: q(".story-stage")[0],
          start: () => `center center+=${headerOffset()}`,
          end: "+=1150",
          pin: true,
          scrub: 0.6,
          // Pins add scroll length, so they recalculate before sections below.
          refreshPriority: 1,
          animation: tl,
          invalidateOnRefresh: true,
        });
        return () => {
          st.kill();
          tl.kill();
        };
      });

      /* Phones, tablets and short laptop screens: no pin. The paragraph reads
         in on its own scroll range, and the diagram, placed after it, plays
         the whole story on its own. */
      mm.add("(max-width: 1023px), (max-height: 759px)", () => {
        const words = gsap.timeline({
          scrollTrigger: {
            trigger: q(".story-body")[0],
            start: "top 80%",
            end: "bottom 55%",
            scrub: 0.5,
          },
        });
        addPhrases(words);

        /* The diagram plays the whole story on its own range. It ends while
           the diagram is still fully on screen (bottom at 60% of the
           viewport, top around 20%), so the ring visibly closes instead of
           finishing as the section leaves the top of the screen. */
        const diagram = gsap.timeline({
          scrollTrigger: {
            trigger: q(".story-diagram")[0],
            start: "top 95%",
            end: "bottom 55%",
            scrub: 0.35,
            invalidateOnRefresh: true,
          },
        });
        addDiagram(diagram);
        diagram.to({}, { duration: 0.4 }); // hold on the finished state

        return () => {
          words.scrollTrigger?.kill();
          diagram.scrollTrigger?.kill();
          words.kill();
          diagram.kill();
        };
      });
    }, root);

    return () => {
      mm.revert();
      ctx.revert();
    };
  }, []);

  /* One span per phrase. The two key phrases sit inside an underline span
     that can still wrap across lines. */
  const renderPhrases = () =>
    PHRASES.map((phrase, p) => {
      const tone = MARK_TONES[p];
      const text = <span className="story-phrase">{phrase}</span>;
      return (
        <span key={p}>
          {tone ? (
            <span className={`story-mark story-mark--${tone}`}>{text}</span>
          ) : (
            text
          )}
          {p < PHRASES.length - 1 ? " " : null}
        </span>
      );
    });

  return (
    <section
      ref={sectionRef}
      id="our-story"
      aria-labelledby="story-heading"
      className="relative scroll-mt-24 bg-bg"
    >
      {/* Frame rules, continued from the hero */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div
          className={`h-full border-x border-dotted border-text/[0.16] ${FRAME}`}
        />
      </div>

      <div className={`relative ${FRAME}`}>
        <div className={`py-20 sm:py-24 lg:py-24 ${INSET}`}>
          <div className="story-stage">
            <p className="story-eyebrow flex items-center gap-3">
              <span
                aria-hidden="true"
                className="story-line block h-px w-8 bg-primary"
              />
              <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-primary sm:text-xs">
                01
              </span>
            </p>
            <h2
              id="story-heading"
              className="story-heading mt-4 text-[2rem] font-semibold leading-[1.05] tracking-[-0.025em] text-text sm:text-[2.4rem] lg:text-[2.6rem]"
            >
              Our Story
            </h2>

            <div className="mt-10 grid items-center gap-14 lg:mt-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-12">
              <p className="story-body font-display text-[1.35rem] font-medium leading-[1.38] tracking-[-0.012em] text-text [text-wrap:pretty] sm:text-[1.6rem] lg:text-[1.7rem] lg:leading-[1.36]">
                {renderPhrases()}
              </p>

              <div className="story-diagram mx-auto w-full max-w-[420px] lg:max-w-[480px]">
                <svg
                  viewBox="0 0 480 440"
                  className="h-auto w-full overflow-visible"
                  fill="none"
                  aria-hidden="true"
                >
                  {/* Drafting guides: a faint orbit and a centre mark, the
                      diagram's first beat as the story opens. */}
                  <circle
                    className="story-orbit"
                    cx={C.x}
                    cy={C.y}
                    r={RING_R}
                    stroke="rgba(18,18,18,0.08)"
                    strokeDasharray="2 6"
                  />
                  <path
                    className="story-cross"
                    d={`M${C.x - 6} ${C.y}h12M${C.x} ${C.y - 6}v12`}
                    stroke="rgba(18,18,18,0.25)"
                  />

                  {/* "Under one roof" */}
                  <circle
                    className="story-ring"
                    cx={C.x}
                    cy={C.y}
                    r={RING_R}
                    stroke={BLUE}
                    strokeWidth="1.5"
                    transform={`rotate(-90 ${C.x} ${C.y})`}
                  />

                  {/* Broken links (problem state) */}
                  {GREY_TIGHT.map((l, k) => (
                    <line
                      key={k}
                      className="story-grey"
                      {...l}
                      stroke={GREY}
                      strokeWidth="1.4"
                      strokeDasharray="4 5"
                      strokeLinecap="round"
                      opacity="0"
                    />
                  ))}

                  {/* Connected links (answer state) */}
                  {PAIRS.map(([a, b, edge]) => {
                    const [x1, y1] = lerp(TIGHT[a], TIGHT[b], edge);
                    const [x2, y2] = lerp(TIGHT[b], TIGHT[a], edge);
                    return (
                      <line
                        key={a + b}
                        className="story-link"
                        x1={x1}
                        y1={y1}
                        x2={x2}
                        y2={y2}
                        stroke={BLUE}
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    );
                  })}

                  {/* SKY Tech at the centre */}
                  <g className="story-hub">
                    <circle cx={C.x} cy={C.y} r="46" fill={BLUE} opacity="0.08" />
                    <circle cx={C.x} cy={C.y} r="31" fill={BLUE} />
                    <text
                      x={C.x}
                      y={C.y + 4}
                      textAnchor="middle"
                      fill="#ffffff"
                      className="font-display"
                      fontSize="11.5"
                      fontWeight="600"
                      letterSpacing="-0.01em"
                    >
                      SKY Tech
                    </text>
                  </g>

                  {/* The three disciplines */}
                  {NODES.map((n) => {
                    const [x, y] = TIGHT[n.key];
                    return (
                      <g key={n.key} className="story-node">
                        {/* Inner group carries the entrance scale; the outer
                            one is moved by the drift. */}
                        <g className="story-node-in">
                          <rect
                            className="story-pill"
                            x={x - PILL.w / 2}
                            y={y - PILL.h / 2}
                            width={PILL.w}
                            height={PILL.h}
                            rx={PILL.h / 2}
                            fill="#ffffff"
                            stroke={BLUE}
                            strokeWidth="1.2"
                          />
                          <text
                            className="story-label font-mono"
                            x={x}
                            y={y + 3.6}
                            textAnchor="middle"
                            fill="#121212"
                            fontSize="10.5"
                            letterSpacing="0.14em"
                          >
                            {n.label.toUpperCase()}
                          </text>
                        </g>
                      </g>
                    );
                  })}
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
