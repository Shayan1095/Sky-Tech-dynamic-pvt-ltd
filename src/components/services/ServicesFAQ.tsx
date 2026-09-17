"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

// Runs before paint on the client so the reveal never flashes its end state.
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/* The site's drafting frame, shared with the rest of the page. */
const FRAME = "mx-4 sm:mx-6 lg:mx-8 xl:mx-auto xl:max-w-6xl";
const INSET = "px-5 sm:px-8 lg:px-12";

/* The eight questions, worded exactly as in src/content/services/main.md. */
const FAQS = [
  {
    question: "What services does SKY Tech provide?",
    answer:
      "We provide web development, WordPress development, UI/UX design, digital marketing, social media management, video editing, graphic design, content writing, Google Ads, Meta Ads, hosting and domain, website maintenance, and media and event services.",
  },
  {
    question: "Can I hire SKY Tech for more than one service?",
    answer:
      "Yes. We can combine multiple services into a customized package based on your business needs.",
  },
  {
    question: "Do you work with startups and small businesses?",
    answer:
      "Yes. Our services can be tailored to different business sizes, budgets and project requirements.",
  },
  {
    question: "Do you offer ongoing support?",
    answer:
      "Yes. Website maintenance, hosting support and social media management are available as ongoing services.",
  },
  {
    question: "Do you work with international clients?",
    answer:
      "Yes. We can work with clients in Pakistan and internationally, depending on project requirements.",
  },
  {
    question: "How do I get a quote?",
    answer:
      "Contact our team with your requirements. We will review your project and provide a customized quotation.",
  },
  {
    question: "Are your packages fixed?",
    answer:
      "Our packages provide a starting point. Final pricing depends on scope, complexity, deliverables and timeline.",
  },
  {
    question: "Can you help me choose the right service?",
    answer:
      "Yes. We can help you identify the services that best match your business goals and current stage.",
  },
] as const;

export default function ServicesFAQ() {
  /* One answer at a time: with eight rows, keeping the list scannable matters
     more than being able to compare two answers side by side. Clicking the
     open row closes it, so nothing is ever forced open. */
  const [open, setOpen] = useState<number | null>(0);
  const baseId = useId();
  const sectionRef = useRef<HTMLElement>(null);

  /* Entrance, once, as the section arrives. Purpose is continuity: every
     other section on this page introduces itself the same way, so without
     it the FAQ would be the one block that snaps in fully formed.

     GSAP rather than CSS because the trigger is viewport position, and
     because the eight sections above already run on ScrollTrigger — a second
     scheduler for one section would be the drift we removed Motion to avoid.

     Only opacity and transform move. The rows stagger at 60ms, inside the
     30-80ms band: fast enough that the list never feels like it is loading. */
  useIsomorphicLayoutEffect(() => {
    const root = sectionRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: root, start: "top 78%", once: true },
      });
      tl.fromTo(".faq-line", { scaleX: 0, transformOrigin: "left center" }, { scaleX: 1, duration: 0.55 }, 0)
        .fromTo(".faq-eyebrow", { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.55 }, 0.06)
        .fromTo(".faq-heading", { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", duration: 0.85, ease: "power3.inOut" }, 0.12)
        .fromTo(".faq-row", { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.06 }, 0.3);
    }, root);

    return () => ctx.revert();
  }, []);

  /* Opening a row changes the page height. Nothing below this section
     currently measures against scroll position, but the closing band will
     gain entrance choreography shortly — re-measuring once the 0.55s
     transition has settled keeps that correct rather than fragile. */
  const toggle = (i: number) => {
    setOpen((current) => (current === i ? null : i));
    window.setTimeout(() => ScrollTrigger.refresh(), 600);
  };

  return (
    <section
      ref={sectionRef}
      id="faq"
      aria-labelledby="faq-heading"
      className="sky-anchor relative isolate overflow-x-clip border-b border-accent bg-bg"
    >
      {/* Vertical frame rules */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className={`h-full border-x border-dotted border-text/[0.16] ${FRAME}`} />
      </div>

      <div className={`relative ${FRAME}`}>
        <div className={`py-20 sm:py-24 lg:py-28 ${INSET}`}>
          <p className="flex items-center gap-3">
            <span aria-hidden="true" className="faq-line block h-px w-8 bg-primary" />
            <span className="faq-eyebrow font-mono text-[11px] uppercase tracking-[0.22em] text-primary sm:text-xs">
              08
            </span>
          </p>

          <h2
            id="faq-heading"
            className="faq-heading mt-8 max-w-3xl text-[2.2rem] font-semibold leading-[1.04] tracking-[-0.028em] text-text sm:text-[3rem] lg:text-[3.4rem]"
          >
            Frequently Asked Questions
          </h2>

          {/* A narrow measure: the only place on the page where the job is
              reading prose rather than scanning a layout. */}
          <ul className="faq-list mt-14 max-w-3xl lg:mt-16">
            {FAQS.map((faq, i) => {
              const panelId = `${baseId}-panel-${i}`;
              const isOpen = open === i;

              return (
                <li key={faq.question} className="faq-row">
                  <h3>
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => toggle(i)}
                      className="flex w-full items-start gap-5 py-6 text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary sm:gap-6 sm:py-7"
                    >
                      <span aria-hidden="true" className="faq-num mt-[7px] font-mono text-[11px] tracking-[0.18em] text-text/30">
                        {String(i + 1).padStart(2, "0")}
                      </span>

                      <span className="faq-question min-w-0 flex-1 font-display text-[1.1rem] font-medium leading-snug tracking-[-0.015em] text-text [text-wrap:pretty] sm:text-[1.25rem]">
                        {faq.question}
                      </span>

                      <span
                        aria-hidden="true"
                        className="svc-mark relative mt-[6px] block h-[13px] w-[13px] shrink-0 text-primary"
                      >
                        <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-current" />
                        <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-current" />
                      </span>
                    </button>
                  </h3>

                  {/* The answer stays in the DOM whether open or closed, so
                      every one is indexed; closed panels are inert so they
                      are never reachable by keyboard. */}
                  <div
                    id={panelId}
                    className="svc-panel"
                    data-open={isOpen}
                    {...(isOpen ? {} : { inert: true })}
                  >
                    <div>
                      <p className="max-w-2xl pb-7 pl-[calc(1.25rem+3ch)] text-[15px] leading-relaxed text-text/70 [text-wrap:pretty] sm:pl-[calc(1.5rem+3ch)] sm:text-base">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
