"use client";

import { gsap } from "@/lib/gsap";
import type { ServicePage } from "@/lib/service-pages/types";
import { FRAME, FrameRules, H2, INSET, Rich, Words } from "./parts";
import { revealHead, useSectionReveal, type RevealBuilder } from "./useSectionReveal";

/* Section 02 — the problem, and what answers it.

   Read as a spec sheet in two halves. First the stake, set large: what a
   poor website, store or interface costs, with those costs (~~marked~~ in
   the page data) struck through as the statement crosses the screen — tied
   to scroll, so the reader sees it happen. Then a drawn connector leads
   down into the answer: the paragraph that says what SKY Tech brings, and
   beside it a board of the qualities that paragraph names (==marked==),
   one numbered cell each, so the answer can be taken in at a glance.

   The board repeats phrases the paragraph already says, so it is hidden
   from assistive tech; nothing on it is new copy. Its glyphs are abstract
   drafting marks, not icons of the phrases — the same four in the same
   order on every service. */

const build: RevealBuilder<HTMLElement> = (tl, root) => {
  revealHead(tl)
    .fromTo(".svp-lead", { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.8 }, 0.3)
    .fromTo(".svp-stake", { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: 0.9 }, 0.42);

  /* Scrubbed rather than fired: the strikes follow the reader's scroll
     through the statement, one after another. The strike's resting state in
     CSS is drawn, so without JavaScript — or under reduced motion, where
     this never runs — the words stay struck. */
  const strikes = root.querySelectorAll<HTMLElement>(".sv-strike");
  if (strikes.length) {
    gsap.fromTo(
      strikes,
      { "--strike": 0 },
      {
        "--strike": 1,
        ease: "none",
        stagger: 0.35,
        scrollTrigger: { trigger: root.querySelector(".svp-stake"), start: "top 72%", end: "bottom 42%", scrub: 0.5 },
      }
    );
  }

  /* The answer arrives once the connector reaches it: the line draws down,
     the board rises, and each cell's mark draws itself in turn. */
  const board = root.querySelector(".svp-board");
  if (board) {
    gsap
      .timeline({ scrollTrigger: { trigger: board, start: "top 82%", once: true } })
      .fromTo(".svp-link-line", { scaleY: 0, transformOrigin: "50% 0%" }, { scaleY: 1, duration: 0.5, ease: "power2.inOut" }, 0)
      .fromTo(".svp-link-node", { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.35, ease: "power3.out" }, 0.4)
      .fromTo(board, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, 0.45)
      .fromTo(".svp-cell", { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.55, stagger: 0.08, ease: "power3.out" }, 0.6)
      .fromTo(".svp-draw", { drawSVG: "0%" }, { drawSVG: "100%", duration: 0.7, stagger: 0.05, ease: "power2.inOut" }, 0.7);
  }
};

/* Every ==marked== phrase in the section, in reading order. */
function markedPhrases(paragraphs: readonly string[]) {
  return paragraphs.flatMap((p) => Array.from(p.matchAll(/==([^=]+)==/g), (m) => m[1]));
}

/* Four drafting marks, drawn in the brand blue. */
function Glyph({ index }: { index: number }) {
  const common = {
    className: "svp-draw",
    stroke: "currentColor",
    strokeWidth: 1.4,
    fill: "none",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  const shapes = [
    /* A target: circle and cross-hair. */
    <>
      <circle cx="20" cy="20" r="11" {...common} />
      <path d="M20 4v8M20 28v8M4 20h8M28 20h8" {...common} />
    </>,
    /* A grid of four. */
    <>
      <rect x="7" y="7" width="11" height="11" rx="2" {...common} />
      <rect x="22" y="7" width="11" height="11" rx="2" {...common} />
      <rect x="7" y="22" width="11" height="11" rx="2" {...common} />
      <rect x="22" y="22" width="11" height="11" rx="2" {...common} />
    </>,
    /* A structure: one node branching into three. */
    <>
      <rect x="14" y="5" width="12" height="8" rx="2" {...common} />
      <path d="M20 13v6M9 19h22M9 19v5M20 19v5M31 19v5" {...common} />
      <rect x="5" y="24" width="8" height="8" rx="2" {...common} />
      <rect x="16" y="24" width="8" height="8" rx="2" {...common} />
      <rect x="27" y="24" width="8" height="8" rx="2" {...common} />
    </>,
    /* Layers: three sheets, offset. */
    <>
      <path d="M20 6 34 13 20 20 6 13Z" {...common} />
      <path d="M6 20l14 7 14-7" {...common} />
      <path d="M6 27l14 7 14-7" {...common} />
    </>,
  ];
  return (
    <svg viewBox="0 0 40 40" className="h-7 w-7 text-primary sm:h-9 sm:w-9" aria-hidden="true">
      {shapes[index % shapes.length]}
    </svg>
  );
}

export default function ServiceProblem({ page }: { page: ServicePage }) {
  const ref = useSectionReveal(build);
  const paragraphs = page.problem.paragraphs;
  const [lead, stake, ...answer] = paragraphs;
  const phrases = markedPhrases(paragraphs);
  const cols = phrases.length === 3 ? "lg:grid-cols-3" : "lg:grid-cols-2";

  return (
    <section
      ref={ref}
      id="the-problem"
      aria-labelledby="problem-heading"
      className="sky-anchor relative isolate overflow-x-clip border-b border-accent bg-bg"
    >
      <FrameRules />

      <div className={`relative ${FRAME}`}>
        <div className={`py-20 sm:py-24 lg:py-32 ${INSET}`}>
          {/* The heading, with the opening line set beside it */}
          <div className="grid gap-y-8 lg:grid-cols-12 lg:items-end lg:gap-x-10">
            <h2 id="problem-heading" className={`${H2} text-text lg:col-span-7`}>
              <Words text={page.problem.heading} />
            </h2>
            {lead && (
              <p className="svp-lead max-w-md font-display text-[1.15rem] font-medium leading-snug tracking-[-0.015em] text-text/75 [text-wrap:pretty] sm:text-[1.3rem] lg:col-span-5 lg:pb-2">
                <Rich text={lead} markClass="text-primary" />
              </p>
            )}
          </div>

          {/* The stake */}
          {stake && (
            <p className="svp-stake mt-9 max-w-5xl sm:mt-12 font-display text-[1.75rem] font-medium leading-[1.14] tracking-[-0.03em] text-text [text-wrap:balance] sm:text-[2.3rem] lg:mt-16 lg:text-[2.85rem]">
              <Rich text={stake} markClass="text-primary" />
            </p>
          )}

          {answer.length > 0 && (
            <>
              {/* The connector: from the stake down into the answer */}
              <div aria-hidden="true" className="svp-link flex flex-col items-start pl-6 sm:pl-10">
                <span className="svp-link-line mt-6 block h-8 w-px bg-primary/50 sm:mt-8 sm:h-16" />
                <span className="svp-link-node -ml-[5px] flex h-[11px] w-[11px] rotate-45 border border-primary bg-bg" />
              </div>

              {/* The answer */}
              <div
                className={`svp-board mt-4 grid overflow-hidden rounded-[26px] border border-text/[0.09] bg-surface ${
                  phrases.length ? "lg:grid-cols-12" : ""
                }`}
              >
                <div className={`p-5 sm:p-9 ${phrases.length ? "lg:col-span-5 lg:border-r lg:border-dotted lg:border-text/15" : ""}`}>
                  <div className="space-y-5">
                    {answer.map((paragraph, i) => (
                      <p
                        key={i}
                        className={
                          i === 0
                            ? "font-display text-[1.1rem] font-medium leading-snug tracking-[-0.015em] text-text [text-wrap:pretty] sm:text-[1.2rem]"
                            : "text-[15px] leading-relaxed text-text/70 [text-wrap:pretty] sm:text-base"
                        }
                      >
                        <Rich text={paragraph} markClass="text-primary" />
                      </p>
                    ))}
                  </div>
                </div>

                {phrases.length > 0 && (
                  <ol aria-hidden="true" className={`svp-cells grid grid-cols-2 lg:col-span-7 ${cols}`}>
                    {phrases.map((phrase, i) => (
                      <li key={phrase} className="svp-cell flex min-h-[104px] flex-col justify-between gap-3 p-4 sm:min-h-[160px] sm:gap-6 sm:p-7">
                        <span className="flex items-start justify-between gap-3">
                          <span className="font-mono text-[11px] tracking-[0.18em] text-text/40">{String(i + 1).padStart(2, "0")}</span>
                          <Glyph index={i} />
                        </span>
                        <span className="svp-phrase font-display text-[1.02rem] font-medium leading-snug tracking-[-0.015em] text-text [text-wrap:balance] sm:text-[1.2rem]">
                          {phrase}
                        </span>
                      </li>
                    ))}
                  </ol>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
