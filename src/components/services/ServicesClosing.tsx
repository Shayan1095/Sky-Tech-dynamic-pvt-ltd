"use client";

import Link from "next/link";
import { useEffect, useLayoutEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

// Runs before paint on the client so the reveal never flashes its end state.
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/* Section 07 — Closing CTA, with the sign-off from section 09 as its coda.

   This is the site's closing band: the same full-bleed primary-to-navy
   gradient the Home and About pages end on, so the three pages finish the
   same way. What belongs to this page is the register — after seven
   left-aligned sections the band centres itself, which is what makes it read
   as an arrival rather than another section.

   The entrance is built to land rather than to arrive: the two rules open
   outward from the centre, the headline uncovers itself, and the actions
   come last so the eye finishes on them. Purpose is closure — this is the
   only section whose job is to end the page.

   On contrast: white at 70% over the blue end of this gradient measures
   3.5:1, under the 4.5 minimum, so the body copy and the quote sit at full
   white. Translucency is used only in the coda, low in the band, where the
   ground has resolved to navy and white at 70% measures 8.7:1. */

const FRAME = "mx-4 sm:mx-6 lg:mx-8 xl:mx-auto xl:max-w-6xl";

const Arrow = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 16 16" className={`h-[13px] w-[13px] ${className}`} fill="none" aria-hidden="true">
    <path d="M3 8h9.5M8.5 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/* The registration mark used throughout the page, here in white. */
function Cross({ side }: { side: "left" | "right" }) {
  return (
    <span
      aria-hidden="true"
      className={`absolute top-0 h-[11px] w-[11px] -translate-y-1/2 ${
        side === "left" ? "left-0 -translate-x-1/2" : "right-0 translate-x-1/2"
      }`}
    >
      <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-white/35" />
      <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-white/35" />
    </span>
  );
}

export default function ServicesClosing() {
  const sectionRef = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    const root = sectionRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: root, start: "top 75%", once: true },
      });

      /* The eyebrow's two hairlines grow outward from the label rather than
         left-to-right: the band is centred, so a left-anchored rule would
         fight its own composition. */
      tl.fromTo(".cl-rule", { scaleX: 0, transformOrigin: "center" }, { scaleX: 1, duration: 0.6 }, 0)
        .fromTo(".cl-eyebrow", { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.5 }, 0.08)
        .fromTo(".cl-heading", { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 1 }, 0.16)
        .fromTo(".cl-intro", { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.8 }, 0.38)
        .fromTo(".cl-quote-rule", { scaleX: 0, transformOrigin: "center" }, { scaleX: 1, duration: 0.6 }, 0.5)
        .fromTo(".cl-quote", { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.8 }, 0.58)
        .fromTo(".cl-action", { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.7, stagger: 0.08 }, 0.74)
        .fromTo(".cl-coda", { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.7, stagger: 0.07 }, 0.92);
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="start-a-project"
      aria-labelledby="services-closing-heading"
      className="sky-anchor relative isolate overflow-hidden bg-[linear-gradient(to_bottom_in_oklab,var(--color-primary)_0%,var(--color-navy)_100%)] text-white"
    >
      {/* Drafting grid, as on the page's panels — strongest at the top where
          the ground is lightest, gone before it reaches the coda. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.09] [background-image:linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] [background-size:30px_30px] [mask-image:radial-gradient(120%_70%_at_50%_0%,#000_0%,transparent_75%)]"
      />

      {/* The page's frame rules run on to the end, here in white. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className={`h-full border-x border-dotted border-white/20 ${FRAME}`} />
      </div>

      <div className={`relative ${FRAME}`}>
        <div className="flex flex-col items-center px-5 py-24 text-center sm:px-8 sm:py-28 lg:py-32">
          <p className="flex items-center gap-4">
            <span aria-hidden="true" className="cl-rule block h-px w-10 bg-cta" />
            <span className="cl-eyebrow font-mono text-[11px] uppercase tracking-[0.22em] text-white sm:text-xs">
              07
            </span>
            <span aria-hidden="true" className="cl-rule block h-px w-10 bg-cta" />
          </p>

          <h2
            id="services-closing-heading"
            className="cl-heading mt-8 max-w-5xl font-display text-[2.1rem] font-semibold leading-[1.04] tracking-[-0.035em] [text-wrap:balance] sm:text-[3.2rem] lg:text-[4rem]"
          >
            Let&apos;s Build Something That Moves Your Business Forward.
          </h2>

          <p className="cl-intro mt-8 max-w-2xl text-base leading-relaxed text-white [text-wrap:pretty] sm:text-lg">
            Whether you&apos;re launching a new business, improving your digital
            presence or looking for a long-term technology and growth partner,
            SKY Tech is here to help.
          </p>

          {/* The pull-quote is the page's closing thought, so it is set apart
              rather than run in with the paragraph above it. */}
          <blockquote className="relative mt-12 max-w-2xl">
            <span aria-hidden="true" className="cl-quote-rule mx-auto block h-px w-14 bg-cta" />
            <p className="cl-quote mt-7 font-display text-[1.35rem] font-medium leading-snug tracking-[-0.02em] text-white [text-wrap:balance] sm:text-[1.65rem] lg:text-[1.85rem]">
              Tell us what you&apos;re building. We&apos;ll help you figure out
              what&apos;s next.
            </p>
          </blockquote>

          <div className="mt-14 flex flex-col items-stretch gap-4 sm:flex-row sm:items-center sm:gap-5">
            {/* Primary. The site's signature CTA, the same one the Home and
                About pages close on: the disc floods the pill, the label
                swaps to its inverse on the way past, and the arrow leaves to
                the right while its twin arrives from the left.

                Three timings, deliberately different. The press is 140ms
                because feedback has to be instant. The label and arrow are
                ~420ms, fast enough to finish while the cursor is still
                there. The flood is 600ms — it is the decorative one, and it
                reads as deliberate rather than slow at that length. */}
            <Link
              href="/contact"
              className="cl-action group relative isolate flex min-h-[58px] items-center justify-between gap-5 overflow-hidden rounded-full bg-white py-2 pl-7 pr-2 text-[13px] font-semibold uppercase tracking-[0.1em] text-navy shadow-[0_16px_40px_-18px_rgb(0_0_0/0.55)] [transition:box-shadow_400ms_cubic-bezier(0.22,1,0.36,1),scale_140ms_cubic-bezier(0.22,1,0.36,1)] hover:shadow-[0_24px_52px_-20px_rgb(0_0_0/0.65)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white active:scale-[0.97]"
            >
              {/* Two copies of the label, one leaving upward and one arriving
                  from below in the inverse colour. The mask is the parent's
                  overflow, so neither is ever visible outside the pill. */}
              <span className="relative z-10 block overflow-hidden">
                <span className="block transition-transform delay-[60ms] duration-[420ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-full group-focus-visible:-translate-y-full">
                  Start Your Project
                </span>
                <span
                  aria-hidden="true"
                  className="absolute inset-0 block translate-y-full text-white transition-transform delay-[60ms] duration-[420ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0 group-focus-visible:translate-y-0"
                >
                  Start Your Project
                </span>
              </span>

              {/* No z-index here on purpose. The flood lives inside this wrapper and
                  must paint *under* the label, which carries z-10 — giving the
                  wrapper its own z-10 puts the navy disc on top and the label
                  vanishes the moment the fill arrives. */}
              <span aria-hidden="true" className="relative h-11 w-11 shrink-0">
                {/* The disc scales past the pill's own width, so the fill
                    arrives from the action rather than from an edge. */}
                <span className="absolute inset-0 rounded-full bg-navy transition-transform duration-[600ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[14] group-focus-visible:scale-[14]" />
                <span className="absolute inset-0 z-10 flex items-center justify-center overflow-hidden rounded-full text-white">
                  <Arrow className="transition-transform duration-[420ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-[180%] group-focus-visible:translate-x-[180%]" />
                  <Arrow className="absolute -translate-x-[180%] transition-transform delay-[60ms] duration-[420ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0 group-focus-visible:translate-x-0" />
                </span>
              </span>
            </Link>

            {/* Secondary: outlined, so the two actions are clearly ranked. */}
            <Link
              href="/contact?type=consultation#contact-form"
              className="cl-action group flex min-h-[58px] items-center justify-center gap-3 rounded-full border border-white/40 px-7 text-[13px] font-semibold uppercase tracking-[0.1em] text-white [transition:background-color_200ms_cubic-bezier(0.22,1,0.36,1),border-color_200ms_cubic-bezier(0.22,1,0.36,1),scale_140ms_cubic-bezier(0.22,1,0.36,1)] hover:border-white/70 hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white active:scale-[0.97]"
            >
              Get a Free Consultation
              <Arrow className="transition-transform duration-200 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>

      {/* Ruled off, then the sign-off. The page opened on these three verbs
          and closes on them, which is what makes it feel finished. */}
      <div aria-hidden="true" className="relative">
        <div className="border-t border-dotted border-white/20" />
        <div className={`relative ${FRAME}`}>
          <Cross side="left" />
          <Cross side="right" />
        </div>
      </div>

      {/* The gradient resolves to the same navy the footer uses, so without
          a ground of its own the sign-off would read as the top of the
          footer rather than the end of the page. A 3% white plate and a
          closing hairline are enough to separate them. */}
      <div className="relative border-b border-white/[0.14] bg-white/[0.03]">
        <div className={`relative ${FRAME}`}>
          <div className="flex flex-col items-center gap-3 px-5 py-12 text-center sm:px-8 sm:py-14">
            <p className="cl-coda font-display text-[1.05rem] font-medium tracking-[-0.015em] text-white sm:text-[1.2rem]">
              Build Better. Automate Smarter. Grow Faster.
            </p>
            <p className="cl-coda max-w-xl font-mono text-[11px] uppercase leading-relaxed tracking-[0.2em] text-white/70 sm:text-xs">
              SKY Tech — Your Digital Product, Technology &amp; Growth Partner.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
