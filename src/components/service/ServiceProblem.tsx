"use client";

import { gsap } from "@/lib/gsap";
import type { ServicePage } from "@/lib/service-pages/types";
import { FRAME, FrameRules, H2, INSET, Rich, Words } from "./parts";
import { revealHead, useSectionReveal, type RevealBuilder } from "./useSectionReveal";

/* Section 02 — the problem.

   A change of register after the hero: no cards, no actions, just the
   argument set as an editorial page. The four paragraphs step down in size
   and step in from the left — the stake, stated large; the answer, set
   beside it — so the reader moves through the argument rather than reading a
   block of copy.

   The one motion with meaning here: the things a poor website costs the
   visitor (~~marked~~ in the page data) are struck through as the statement
   crosses the middle of the screen, tied to scroll so the reader sees it
   happen rather than finding it already done. */

const build: RevealBuilder<HTMLElement> = (tl, root) => {
  revealHead(tl)
    .fromTo(".svp-lead", { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.8 }, 0.3)
    .fromTo(".svp-stake", { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: 0.9 }, 0.42)
    .fromTo(".svp-answer", { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.1 }, 0.6);

  /* Scrubbed rather than fired: the strikes follow the reader's scroll
     through the statement, one after another. Created here, inside the
     section's gsap.context, so it is reverted with everything else. The
     strike's resting state in CSS is drawn, so without JavaScript — or
     under reduced motion, where this never runs — the words stay struck. */
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
};

export default function ServiceProblem({ page }: { page: ServicePage }) {
  const ref = useSectionReveal(build);
  const [lead, stake, ...answer] = page.problem.paragraphs;

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
          <h2 id="problem-heading" className={`${H2} max-w-4xl text-text`}>
            <Words text={page.problem.heading} />
          </h2>

          <div className="mt-12 grid gap-y-10 lg:mt-16 lg:grid-cols-12 lg:gap-x-10">
            {lead && (
              <p className="svp-lead font-display text-[1.2rem] font-medium leading-snug tracking-[-0.015em] text-text/80 [text-wrap:pretty] sm:text-[1.35rem] lg:col-span-5">
                <Rich text={lead} />
              </p>
            )}

            {stake && (
              <p className="svp-stake font-display text-[1.75rem] font-medium leading-[1.14] tracking-[-0.03em] text-text [text-wrap:balance] sm:text-[2.3rem] lg:col-span-11 lg:col-start-2 lg:text-[2.85rem]">
                <Rich text={stake} />
              </p>
            )}

            {answer.length > 0 && (
              <div className="grid gap-8 sm:grid-cols-2 sm:gap-10 lg:col-span-8 lg:col-start-5">
                {answer.map((paragraph, i) => (
                  <p key={i} className="svp-answer text-base leading-relaxed text-text/75 [text-wrap:pretty] sm:text-[1.05rem]">
                    <Rich text={paragraph} markClass="font-medium text-primary" />
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
