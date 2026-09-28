"use client";

import Link from "next/link";
import { useEffect, useLayoutEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { READY_EVENT } from "@/components/shared/Preloader";
import { PRODUCTS } from "@/lib/products";
import { FRAME, INSET, Arrow } from "@/components/service/parts";

// Runs before paint on the client so the reveal never flashes its end state.
const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

function Cross({ side }: { side: "left" | "right" }) {
  return (
    <span
      aria-hidden="true"
      className={`ph-cross absolute top-0 h-[11px] w-[11px] -translate-y-1/2 ${
        side === "left" ? "left-0 -translate-x-1/2" : "right-0 translate-x-1/2"
      }`}
    >
      <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-text/40" />
      <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-text/40" />
    </span>
  );
}

function Rule() {
  return (
    <div aria-hidden="true" className="relative">
      <div className="ph-rule border-t border-dotted border-text/[0.16]" />
      <div className={`relative ${FRAME}`}>
        <Cross side="left" />
        <Cross side="right" />
      </div>
    </div>
  );
}

/* A phrase that rises out of its own mask; React-rendered, so nothing
   rewrites DOM that React owns. */
function Phrase({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block overflow-hidden pb-[0.1em] pr-[0.06em] -mb-[0.1em] -mr-[0.06em] align-top">
      <span className="ph-phrase inline-block whitespace-nowrap">{children}</span>
    </span>
  );
}

export default function ProductsHero() {
  const sectionRef = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    const root = sectionRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let fallback: number | undefined;
    let removeListener: (() => void) | undefined;

    const ctx = gsap.context(() => {
      /* Same construction order as the Services, About and Contact heroes:
         the frame is drawn, then the page furniture, then the headline
         rises, and the actions arrive last so the eye finishes on them. */
      const tl = gsap.timeline({ paused: true });
      tl.fromTo(".ph-frame", { scaleY: 0, transformOrigin: "top center" }, { scaleY: 1, duration: 1.1, ease: "power3.inOut" }, 0)
        .fromTo(".ph-rule", { scaleX: 0, transformOrigin: "left center" }, { scaleX: 1, duration: 1, stagger: 0.12, ease: "power3.inOut" }, 0.05)
        .fromTo(".ph-eyebrow > *", { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.06, ease: "power3.out" }, 0.2)
        .fromTo(".ph-cross", { scale: 0, rotation: -90 }, { scale: 1, rotation: 0, duration: 0.6, stagger: 0.05, ease: "power3.out" }, 0.45)
        .fromTo(".ph-phrase", { yPercent: 110 }, { yPercent: 0, duration: 1.05, stagger: 0.1, ease: "power4.out" }, 0.5)
        .fromTo(".ph-intro", { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" }, 0.95)
        .fromTo(".ph-item", { opacity: 0, x: 14 }, { opacity: 1, x: 0, duration: 0.7, stagger: 0.08, ease: "power3.out" }, 1.05)
        .fromTo(".ph-action", { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.7, stagger: 0.1, ease: "power3.out" }, 1.35);

      /* The hero waits for the preloader, as the other heroes do, so its
         opening is not spent behind a covered viewport. The timeout is the
         safety net for a visitor who arrives with the flag already set. */
      const start = () => tl.play();
      if ((window as unknown as { __skyReady?: boolean }).__skyReady) {
        start();
      } else {
        window.addEventListener(READY_EVENT, start, { once: true });
        fallback = window.setTimeout(start, 4000);
        removeListener = () => window.removeEventListener(READY_EVENT, start);
      }
    }, root);

    return () => {
      if (fallback) window.clearTimeout(fallback);
      removeListener?.();
      ctx.revert();
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative isolate overflow-x-clip bg-bg">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className={`ph-frame h-full border-x border-dotted border-text/[0.16] ${FRAME}`} />
      </div>

      <div className="pt-28 sm:pt-32 lg:pt-36">
        <Rule />
      </div>

      <div className={`relative ${FRAME}`}>
        <div className={`py-14 sm:py-16 lg:py-24 ${INSET}`}>
          <div className="ph-eyebrow flex items-center justify-between gap-6">
            <p className="flex items-center gap-3">
              <span aria-hidden="true" className="block h-px w-8 bg-primary" />
              <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-primary sm:text-xs">
                Products
              </span>
            </p>
            <span className="shrink-0 font-mono text-[11px] uppercase tracking-[0.18em] text-text/65">
              {String(PRODUCTS.length).padStart(2, "0")} Systems
            </span>
          </div>

          <h1 className="mt-8 max-w-4xl text-[2.6rem] font-semibold leading-[1.02] tracking-[-0.032em] sm:text-[3.6rem] lg:text-[4.4rem]">
            <Phrase>Software we have</Phrase> <Phrase>already built,</Phrase>{" "}
            <Phrase>ready for your</Phrase> <Phrase>business.</Phrase>
          </h1>

          <p className="ph-intro mt-8 max-w-2xl text-lg leading-relaxed text-text/80 [text-wrap:pretty] sm:text-xl">
            These are working systems, not proposals. Each one is licensed and
            configured around how you already work — your branches, your items,
            your fee structure, your menu — so you start from something that
            runs rather than something that has to be built first.
          </p>

          {/* The index: every product, in order, linked to its own section. */}
          <ul className="mt-12 max-w-3xl border-t border-dotted border-text/20">
            {PRODUCTS.map((product) => (
              <li key={product.slug} className="ph-item border-b border-dotted border-text/20">
                <a
                  href={`#${product.slug}`}
                  className="group flex items-baseline gap-4 py-4 transition-colors duration-300 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary sm:gap-6"
                >
                  <span className="shrink-0 font-mono text-[11px] tracking-[0.18em] text-text/65">
                    {product.index}
                  </span>
                  <span className="font-display text-base font-medium sm:text-lg">
                    {product.name}
                  </span>
                  <span
                    aria-hidden="true"
                    className="mx-1 hidden h-px flex-1 self-center border-b border-dotted border-text/25 sm:block"
                  />
                  <span className="ml-auto shrink-0 text-right text-[0.8rem] text-text/65 sm:ml-0 sm:text-sm">
                    {product.category}
                  </span>
                </a>
              </li>
            ))}
          </ul>

          <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-4">
            <Link
              href="/contact?type=demo#contact-form"
              className="ph-action group relative isolate flex min-h-[56px] items-center justify-between gap-4 overflow-hidden rounded-full bg-primary py-2 pl-6 pr-2 text-[13px] font-semibold uppercase tracking-[0.1em] text-white [transition:scale_140ms_cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary active:scale-[0.97]"
            >
              <span
                aria-hidden="true"
                className="absolute inset-0 -z-10 origin-left scale-x-0 bg-navy transition-transform duration-500 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100 group-focus-visible:scale-x-100"
              />
              Request a Demo
              <span
                aria-hidden="true"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15"
              >
                <Arrow className="transition-transform duration-500 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0.5" />
              </span>
            </Link>

            <Link
              href="/services"
              className="ph-action group relative inline-flex items-center gap-3 py-3.5 font-mono text-[11px] uppercase tracking-[0.2em] text-text/75 transition-colors duration-300 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary sm:text-xs"
            >
              Or Built From Scratch
              <Arrow className="transition-transform duration-500 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1" />
              <span
                aria-hidden="true"
                className="absolute inset-x-0 bottom-1.5 h-px origin-left scale-x-0 bg-primary transition-transform duration-500 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100 group-focus-visible:scale-x-100"
              />
            </Link>
          </div>
        </div>
      </div>

      <Rule />
    </section>
  );
}
