"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import type { ServicePage } from "@/lib/service-pages/types";
import { FRAME, FrameRules, H2, INSET, SectionLabel, Words } from "./parts";
import { revealHead } from "./useSectionReveal";
import WhyProof from "./WhyProof";

const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

/* Section 08 — why SKY Tech: promises with proof.

   Every agency claims transparent pricing and post-launch support, and a
   visitor can check none of it. This page already holds the evidence for
   most of these claims, so each reason carries its proof beneath it: the
   real price ladder, the maintenance add-on (one tap adds it to the quote),
   the first step of the process, the stack, this site's own PageSpeed score
   with a link to re-test it, and — where the claim is a principle rather
   than a figure — a small drawing of it.

   Light ground, after the navy technology band, so the page keeps its
   alternation. A 12-column grid of white cards; a reason marked `featured`
   spans two thirds, and the grid packs densely so the rows close up.

   Motion, with a purpose each: cards rise in as the grid arrives; each
   card's proof then draws itself; and on a mouse, hovering a card replays
   it. Under reduced motion everything is simply shown. */

export default function ServiceWhy({ page }: { page: ServicePage }) {
  const sectionRef = useRef<HTMLElement>(null);
  const { why } = page;

  useIsomorphicLayoutEffect(() => {
    const root = sectionRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const cleanups: (() => void)[] = [];
    const ctx = gsap.context(() => {
      revealHead(gsap.timeline({ scrollTrigger: { trigger: root, start: "top 78%", once: true } }));

      const cards = gsap.utils.toArray<HTMLElement>(".svy-card", root);

      /* Each card's proof, as its own replayable timeline. */
      const proofs = cards.map((card) => {
        const q = gsap.utils.selector(card);
        const tl = gsap.timeline({ paused: true });
        tl.fromTo(q(".svy-draw"), { drawSVG: "0%" }, { drawSVG: "100%", duration: 0.7, stagger: 0.06, ease: "power2.inOut" }, 0)
          .fromTo(
            q(".svy-pop"),
            { opacity: 0, scale: 0.7, transformOrigin: "50% 50%" },
            { opacity: 1, scale: 1, duration: 0.45, stagger: 0.035, ease: "power3.out" },
            0.25
          )
          .fromTo(q(".svy-arc"), { drawSVG: "0% 0%" }, { drawSVG: "0% 90%", duration: 1.2, stagger: 0.15, ease: "power3.out" }, 0.1)
          .fromTo(q(".svy-bar"), { scaleY: 0, transformOrigin: "50% 100%" }, { scaleY: 1, duration: 0.6, stagger: 0.06, ease: "power3.out" }, 0.1);
        tl.progress(0).pause();
        return tl;
      });

      ScrollTrigger.batch(cards, {
        start: "top 86%",
        once: true,
        onEnter: (batch) => {
          gsap.fromTo(batch, { opacity: 0, y: 26 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.08, ease: "power3.out" });
          batch.forEach((card, i) => {
            const tl = proofs[cards.indexOf(card as HTMLElement)];
            gsap.delayedCall(0.35 + i * 0.08, () => tl.restart());
          });
        },
      });

      /* A mouse resting on a card replays its proof. */
      if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
        cards.forEach((card, i) => {
          const replay = () => proofs[i].restart();
          card.addEventListener("mouseenter", replay);
          cleanups.push(() => card.removeEventListener("mouseenter", replay));
        });
      }
    }, root);

    return () => {
      cleanups.forEach((c) => c());
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="why-sky-tech"
      aria-labelledby="why-heading"
      className="sky-anchor relative isolate overflow-x-clip border-b border-accent bg-surface"
    >
      <FrameRules />

      <div className={`relative ${FRAME}`}>
        <div className={`py-20 sm:py-24 lg:py-28 ${INSET}`}>
          <SectionLabel count={`${why.items.length} Reasons, With Proof`}>Why SKY Tech</SectionLabel>

          <h2 id="why-heading" className={`${H2} mt-8 max-w-4xl text-text`}>
            <Words text={why.heading} />
          </h2>

          <ul className="mt-14 grid gap-4 [grid-auto-flow:dense] sm:grid-cols-2 sm:gap-5 lg:mt-16 lg:grid-cols-12">
            {why.items.map((item) => (
              <li
                key={item.title}
                className={item.featured ? "sm:col-span-2 lg:col-span-8" : "lg:col-span-4"}
              >
                <article
                  className={`svy-card group relative flex h-full flex-col rounded-[24px] border border-text/[0.08] bg-bg p-7 shadow-[0_1px_2px_rgb(18_18_18/0.04)] transition-[translate,box-shadow,border-color] duration-500 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] sm:p-8 ${
                    item.featured ? "lg:grid lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-10" : ""
                  }`}
                >
                  <div>
                    <span aria-hidden="true" className="block h-2 w-2 rotate-45 bg-cta" />
                    <h3 className="mt-5 font-display text-[1.22rem] font-medium leading-snug tracking-[-0.02em] text-text [text-wrap:balance] sm:text-[1.3rem]">
                      <Words text={item.title} />
                    </h3>
                    <p className="mt-3 text-[14.5px] leading-relaxed text-text/70 [text-wrap:pretty]">{item.body}</p>
                  </div>

                  {item.proof && (
                    <div
                      className={`mt-auto pt-7 ${
                        item.featured ? "lg:mt-0 lg:flex lg:flex-col lg:justify-center lg:border-l lg:border-dotted lg:border-text/15 lg:pl-10 lg:pt-0" : ""
                      }`}
                    >
                      <div className={item.featured ? "border-t border-dotted border-text/15 pt-6 lg:border-0 lg:pt-0" : "border-t border-dotted border-text/15 pt-6"}>
                        <p className="mb-4 flex items-center gap-2.5 font-mono text-[10px] uppercase tracking-[0.2em] text-primary">
                          <span aria-hidden="true" className="block h-px w-5 bg-primary" />
                          Proof
                        </p>
                        <WhyProof page={page} proof={item.proof} />
                      </div>
                    </div>
                  )}
                </article>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
