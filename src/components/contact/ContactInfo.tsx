"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

// Runs before paint on the client so the reveal never flashes its end state.
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

const FRAME = "mx-4 sm:mx-6 lg:mx-8 xl:mx-auto xl:max-w-6xl";
const INSET = "px-5 sm:px-8 lg:px-12";

/* The trust line from contact.md, as three commitments. */
const PROMISES = ["No obligation.", "No hard sell.", "Just a conversation about your goals."];

const PHONE = { label: "+92 333 567 3810", href: "tel:+923335673810" };

const Arrow = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 16 16" className={`h-[14px] w-[14px] ${className}`} fill="none" aria-hidden="true">
    <path d="M3 8h9.5M8.5 4l4 4-4 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/* A conversation: a message, a reply being typed, joined by a dotted line.
   Decorative — the promise itself is carried by the text. */
function Conversation() {
  return (
    <svg viewBox="0 0 360 300" className="h-auto w-full max-w-[420px] overflow-visible" fill="none" aria-hidden="true">
      {/* Connector */}
      <path className="cv-link" d="M118 150 C 150 150, 170 186, 214 190" stroke="rgb(255 255 255 / 0.35)" strokeWidth="1.4" strokeDasharray="3 5" strokeLinecap="round" />
      <circle className="cv-node" cx="118" cy="150" r="3.5" fill="#00c2ff" />
      <circle className="cv-node" cx="214" cy="190" r="3.5" fill="#00c2ff" />

      {/* Message */}
      <g className="cv-bubble-a">
        <path d="M24 44h150a18 18 0 0 1 18 18v64a18 18 0 0 1-18 18H70l-22 20v-20H24a18 18 0 0 1-18-18V62a18 18 0 0 1 18-18z" fill="rgb(255 255 255 / 0.07)" stroke="rgb(255 255 255 / 0.28)" strokeWidth="1.2" />
        <rect x="30" y="72" width="118" height="7" rx="3.5" fill="rgb(255 255 255 / 0.55)" />
        <rect x="30" y="90" width="138" height="7" rx="3.5" fill="rgb(255 255 255 / 0.3)" />
        <rect x="30" y="108" width="84" height="7" rx="3.5" fill="rgb(255 255 255 / 0.3)" />
      </g>

      {/* Reply, being typed */}
      <g className="cv-bubble-b">
        <path d="M194 160h140a18 18 0 0 1 18 18v56a18 18 0 0 1-18 18h-22v20l-22-20H194a18 18 0 0 1-18-18v-56a18 18 0 0 1 18-18z" fill="rgb(0 194 255 / 0.12)" stroke="#00c2ff" strokeOpacity="0.7" strokeWidth="1.2" />
        {[232, 264, 296].map((cx, i) => (
          <circle key={cx} className="cv-dot" cx={cx} cy="206" r="6" fill="#ffffff" style={{ opacity: 0.35 + i * 0.2 }} />
        ))}
      </g>
    </svg>
  );
}

export default function ContactInfo() {
  const sectionRef = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    const root = sectionRef.current;
    if (!root) return;
    // Markup is authored in its finished state, so reduced motion shows every
    // promise lit and the conversation complete, with nothing looping.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      /* Header and actions arrive once. */
      const intro = gsap.timeline({ paused: true });
      intro
        .fromTo(".ci-line", { scaleX: 0, transformOrigin: "left center" }, { scaleX: 1, duration: 0.6, ease: "power3.out" }, 0)
        .fromTo(".ci-num", { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }, 0.08)
        .fromTo(".ci-action > *", { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: "power3.out" }, 0.5);
      ScrollTrigger.create({ trigger: root, start: "top 75%", once: true, onEnter: () => intro.play() });

      /* The promises light up one after another as you scroll through the
         section, each confirmed by a check that draws on. */
      const promises = gsap.utils.toArray<HTMLElement>(".ci-promise", root);
      const reading = gsap.timeline({
        scrollTrigger: { trigger: ".ci-promises", start: "top 78%", end: "bottom 45%", scrub: 0.5 },
      });
      promises.forEach((row, i) => {
        const q = gsap.utils.selector(row);
        reading
          .fromTo(row, { opacity: 0.22 }, { opacity: 1, duration: 0.5, ease: "none" }, i * 0.6)
          .fromTo(q(".ci-check-ring"), { drawSVG: "0%" }, { drawSVG: "100%", duration: 0.45, ease: "none" }, i * 0.6 + 0.1)
          .fromTo(q(".ci-check-mark"), { drawSVG: "0%" }, { drawSVG: "100%", duration: 0.3, ease: "none" }, i * 0.6 + 0.4)
          .fromTo(q(".ci-rule"), { scaleX: 0, transformOrigin: "left center" }, { scaleX: 1, duration: 0.6, ease: "none" }, i * 0.6 + 0.1);
      });

      /* Conversation: message, connector, reply — then the typing dots pulse
         only while the section is on screen. */
      // Each dot loops on its own offset (repeat lives in the stagger, not on
      // the tween, so the three never double up or drift out of rhythm).
      const typing = gsap.to(".cv-dot", {
        y: -5,
        duration: 0.42,
        ease: "sine.inOut",
        stagger: { each: 0.14, repeat: -1, yoyo: true },
        paused: true,
      });
      const talk = gsap.timeline({
        paused: true,
        onComplete: () => {
          ScrollTrigger.create({
            trigger: root,
            start: "top bottom",
            end: "bottom top",
            onToggle: (self) => (self.isActive ? typing.play() : typing.pause()),
          });
          typing.play();
        },
      });
      talk
        .fromTo(".cv-bubble-a", { opacity: 0, y: 18, scale: 0.94, transformOrigin: "20% 100%" }, { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: "power3.out" }, 0)
        .fromTo(".cv-node", { scale: 0, transformOrigin: "50% 50%" }, { scale: 1, duration: 0.35, stagger: 0.35, ease: "power3.out" }, 0.45)
        .fromTo(".cv-link", { drawSVG: "0%" }, { drawSVG: "100%", duration: 0.6, ease: "power2.inOut" }, 0.5)
        .fromTo(".cv-bubble-b", { opacity: 0, y: 18, scale: 0.94, transformOrigin: "80% 100%" }, { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: "power3.out" }, 0.95);
      ScrollTrigger.create({ trigger: ".ci-visual", start: "top 80%", once: true, onEnter: () => talk.play() });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="promise-heading"
      className="relative isolate overflow-hidden bg-[linear-gradient(to_bottom_in_oklab,var(--color-primary)_0%,var(--color-navy)_100%)] text-white"
    >
      {/* Frame rules, continued in white */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className={`h-full border-x border-dotted border-white/[0.16] ${FRAME}`} />
      </div>

      <div className={`relative ${FRAME}`}>
        <div
          className={`grid items-center gap-14 py-24 sm:py-28 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:gap-16 lg:py-36 ${INSET}`}
        >
          <div>
            <p className="flex items-center gap-3">
              <span aria-hidden="true" className="ci-line block h-px w-8 bg-cta" />
              <span className="ci-num font-mono text-[11px] uppercase tracking-[0.22em] text-white sm:text-xs">02</span>
            </p>

            {/* The trust line, read as one sentence by assistive tech */}
            <h2 id="promise-heading" className="sr-only">
              No obligation. No hard sell. Just a conversation about your goals.
            </h2>

            <ul aria-hidden="true" className="ci-promises mt-8">
              {PROMISES.map((promise, i) => (
                <li key={promise} className="ci-promise relative py-5 sm:py-6">
                  <div className="flex items-start gap-5 sm:gap-6">
                    <svg viewBox="0 0 40 40" className="mt-1 h-8 w-8 shrink-0 -rotate-90 sm:mt-2 sm:h-10 sm:w-10" fill="none">
                      <circle className="ci-check-ring" cx="20" cy="20" r="17" stroke="#00c2ff" strokeWidth="1.6" />
                      <path className="ci-check-mark" d="M13 20.5l5 5 9-10" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" transform="rotate(90 20 20)" />
                    </svg>
                    <span
                      className={`font-display font-semibold leading-[1.08] tracking-[-0.03em] [text-wrap:balance] ${
                        i === 2 ? "text-[1.7rem] sm:text-[2.4rem] lg:text-[2.9rem]" : "text-[2.1rem] sm:text-[3rem] lg:text-[3.6rem]"
                      }`}
                    >
                      {promise}
                    </span>
                  </div>
                  <span className="absolute inset-x-0 bottom-0 h-px bg-white/10">
                    <span className="ci-rule absolute inset-0 bg-white/35" />
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col items-center gap-10 lg:items-start">
            <div className="ci-visual w-full">
              <Conversation />
            </div>

            <div className="ci-action flex w-full flex-col items-stretch gap-4 sm:flex-row sm:items-center lg:flex-col lg:items-start xl:flex-row xl:items-center">
              {/* Primary: the premium CTA, flooding blue on hover or focus */}
              <a
                href="#contact-form"
                className="group relative isolate inline-flex min-h-[60px] items-center justify-between gap-5 overflow-hidden rounded-full bg-bg py-2 pl-7 pr-2 text-sm font-semibold uppercase tracking-[0.1em] text-text shadow-[0_14px_36px_-16px_rgb(0_0_0/0.6)] ring-1 ring-transparent transition-[box-shadow] duration-500 hover:shadow-[0_22px_48px_-18px_rgb(0_0_0/0.7)] hover:ring-bg/45 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white active:scale-[0.98]"
              >
                <span className="relative z-10 block overflow-hidden">
                  <span className="block transition-transform delay-[70ms] duration-500 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-full group-focus-visible:-translate-y-full">
                    Book My Free Consultation
                  </span>
                  <span aria-hidden="true" className="absolute inset-0 block translate-y-full text-bg transition-transform delay-[70ms] duration-500 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0 group-focus-visible:translate-y-0">
                    Book My Free Consultation
                  </span>
                </span>
                <span aria-hidden="true" className="relative h-11 w-11 shrink-0">
                  <span className="absolute inset-0 rounded-full bg-primary transition-transform duration-[650ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[14] group-focus-visible:scale-[14]" />
                  <span className="absolute inset-0 z-10 flex items-center justify-center overflow-hidden rounded-full text-bg">
                    <Arrow className="-rotate-90 transition-transform duration-500 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-[180%] group-focus-visible:-translate-y-[180%]" />
                    <Arrow className="absolute -rotate-90 translate-y-[180%] transition-transform delay-[90ms] duration-500 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0 group-focus-visible:translate-y-0" />
                  </span>
                </span>
              </a>

              {/* Secondary: speak to someone now */}
              <a
                href={PHONE.href}
                className="group inline-flex min-h-[60px] items-center justify-center gap-3 rounded-full border border-white/25 px-6 font-mono text-[12px] tracking-[0.14em] text-white transition-[border-color,background-color] duration-300 hover:border-white hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
              >
                <svg viewBox="0 0 16 16" className="h-4 w-4 text-cta" fill="none" aria-hidden="true">
                  <path d="M5.6 2.5l1.3 2.9-1.4 1.1a8 8 0 0 0 4 4l1.1-1.4 2.9 1.3-.5 2.6c-5.8.4-10.4-4.2-10-10z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
                </svg>
                <span className="sr-only">Call </span>
                {PHONE.label}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
