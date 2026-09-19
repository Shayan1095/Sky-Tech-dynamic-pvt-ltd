"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import {
  COMBINATIONS,
  MAX_PARTS,
  combinationHref,
  combinationLabel,
} from "@/lib/packages";

// Runs before paint on the client so the reveal never flashes its end state.
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/* The site's drafting frame, shared with the rest of the page. */
const FRAME = "mx-4 sm:mx-6 lg:mx-8 xl:mx-auto xl:max-w-6xl";
const INSET = "px-5 sm:px-8 lg:px-12";

export default function ServiceCombinations() {
  const sectionRef = useRef<HTMLElement>(null);
  const chipsRef = useRef<HTMLUListElement>(null);
  const [selected, setSelected] = useState(0);
  const combination = COMBINATIONS[selected];

  useIsomorphicLayoutEffect(() => {
    const root = sectionRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: root, start: "top 76%", once: true },
      });
      tl.fromTo(".pc-line", { scaleX: 0, transformOrigin: "left center" }, { scaleX: 1, duration: 0.55 }, 0)
        .fromTo(".pc-eyebrow", { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.55 }, 0.06)
        .fromTo(".pc-heading", { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", duration: 0.85, ease: "power3.inOut" }, 0.12)
        .fromTo(".pc-intro", { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.09 }, 0.3)
        .fromTo(".pkg-panel", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1 }, 0.4)
        .fromTo(".pkg-row", { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.65, stagger: 0.07 }, 0.48);
    }, root);

    return () => ctx.revert();
  }, []);

  /* Each time a different combination is chosen its parts assemble in the
     panel. This is an animation, not state — the chips have already been
     rendered by React; they are only being moved into place. */
  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const chips = chipsRef.current;
    if (!chips) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".pkg-chip",
        { opacity: 0, y: 14, scale: 0.97 },
        { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.07, ease: "power3.out" }
      );
      gsap.fromTo(".pkg-outcome", { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.55, delay: 0.12, ease: "power3.out" });
    }, chips.closest(".pkg-panel") as HTMLElement);

    return () => ctx.revert();
  }, [selected]);

  return (
    <section
      ref={sectionRef}
      id="service-combinations"
      aria-labelledby="service-combinations-heading"
      className="sky-anchor relative isolate overflow-x-clip border-b border-accent bg-surface"
    >
      {/* Vertical frame rules */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className={`h-full border-x border-dotted border-text/[0.16] ${FRAME}`} />
      </div>

      <div className={`relative ${FRAME}`}>
        <div className={`py-20 sm:py-24 lg:py-28 ${INSET}`}>
          <p className="flex items-center gap-3">
            <span aria-hidden="true" className="pc-line block h-px w-8 bg-primary" />
            <span className="pc-eyebrow font-mono text-[11px] uppercase tracking-[0.22em] text-primary sm:text-xs">
              06
            </span>
          </p>

          <h2
            id="service-combinations-heading"
            className="pc-heading mt-8 max-w-3xl text-[2.2rem] font-semibold leading-[1.04] tracking-[-0.028em] text-text sm:text-[3rem] lg:text-[3.4rem]"
          >
            Need More Than One Service?
          </h2>

          <p className="pc-intro mt-7 max-w-3xl font-display text-xl font-medium leading-snug tracking-[-0.02em] text-text [text-wrap:balance] sm:text-2xl lg:text-[1.75rem]">
            Build Your Complete Digital Growth Ecosystem.
          </p>

          <p className="pc-intro mt-5 max-w-2xl text-base leading-relaxed text-text/70 [text-wrap:pretty] sm:text-lg">
            Your website, marketing, content and branding should work together.
          </p>
          <p className="pc-intro mt-4 max-w-2xl text-base leading-relaxed text-text/70 [text-wrap:pretty] sm:text-lg">
            Instead of managing multiple vendors, you can work with one partner
            for connected digital solutions.
          </p>

          <div className="mt-12 grid gap-6 sm:mt-14 sm:gap-10 lg:mt-16 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-start lg:gap-12">
            {/* The chooser. Real radio inputs, so arrow keys move through the
                combinations the way a keyboard user expects. */}
            <fieldset>
              <legend className="font-mono text-[11px] uppercase tracking-[0.22em] text-text/55">
                Popular Service Combinations
              </legend>

              <div className="mt-4 sm:mt-7" role="none">
                {COMBINATIONS.map((item, i) => (
                  <label key={item.slug} className="pkg-row py-3.5 pl-5 pr-2 sm:py-5">
                    <input
                      type="radio"
                      name="service-combination"
                      className="sr-only"
                      checked={selected === i}
                      onChange={() => setSelected(i)}
                    />

                    <span className="flex items-start gap-4">
                      <span aria-hidden="true" className="pkg-num mt-[3px] font-mono text-[11px] tracking-[0.18em]">
                        {String(i + 1).padStart(2, "0")}
                      </span>

                      <span className="min-w-0 flex-1">
                        <span className="block font-display text-[1.05rem] font-medium leading-snug tracking-[-0.015em] text-text sm:text-[1.15rem]">
                          {item.parts.map((part, p) => (
                            <span key={part}>
                              {p > 0 && (
                                <span aria-hidden="true" className="pkg-plus px-2 font-mono text-[0.85em]">
                                  +
                                </span>
                              )}
                              {part}
                            </span>
                          ))}
                        </span>
                        {/* On phones the chosen combination's outcome is
                            shown once, in the package panel below, rather
                            than under every row. */}
                        <span className="mt-2 block text-[14px] leading-relaxed text-text/60 max-sm:hidden">
                          {item.outcome}
                        </span>
                      </span>
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            {/* The package. Updates live with the choice and carries it into
                the contact form. */}
            <div className="lg:sticky lg:top-28">
              <div className="pkg-panel p-7 text-white sm:p-9">
                <div className="flex items-center justify-between gap-4">
                  <p className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em] text-white/75">
                    <span aria-hidden="true" className="block h-2 w-2 bg-cta" />
                    Your Package
                  </p>
                  <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/50">
                    {combination.parts.length} Services
                  </p>
                </div>

                {/* min-height holds the panel steady between a two-part and a
                    three-part combination, so choosing never shifts the page. */}
                {/* Every combination renders the same number of slots, the
                    unused ones held empty. A min-height in rem would drift
                    with font metrics and zoom; matching slot counts cannot,
                    so choosing a combination never moves the page. On phones
                    the panel sits below the list, so nothing being read can
                    move and the empty slot is dropped. */}
                <ul ref={chipsRef} className="mt-8 grid gap-3">
                  {Array.from({ length: MAX_PARTS }, (_, p) => {
                    const part = combination.parts[p];
                    return (
                      <li
                        key={p}
                        className={`relative ${part ? "" : "invisible max-sm:hidden"}`}
                        aria-hidden={part ? undefined : true}
                      >
                        {p > 0 && (
                          <span
                            aria-hidden="true"
                            className="pointer-events-none absolute inset-x-0 -top-3 flex h-3 items-center justify-center font-mono text-[12px] leading-none text-cta"
                          >
                            +
                          </span>
                        )}
                        <span className="pkg-chip inline-flex w-full items-center gap-3 rounded-2xl px-4 py-3 font-display text-[1rem] font-medium tracking-[-0.01em] sm:text-[1.05rem]">
                          <span aria-hidden="true" className="block h-1.5 w-1.5 rotate-45 bg-cta" />
                          {part ?? "—"}
                        </span>
                      </li>
                    );
                  })}
                </ul>

                <p aria-live="polite" className="pkg-outcome mt-7 border-t border-white/12 pt-6 text-[14.5px] leading-relaxed text-white/80 [text-wrap:pretty]">
                  {combination.outcome}
                </p>

                <a
                  href={combinationHref(combination)}
                  className="group relative isolate mt-8 flex min-h-[56px] items-center justify-between gap-4 overflow-hidden rounded-full bg-white py-2 pl-6 pr-2 text-[13px] font-semibold uppercase tracking-[0.1em] text-navy focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cta"
                >
                  <span aria-hidden="true" className="absolute inset-0 -z-10 origin-left scale-x-0 bg-cta transition-transform duration-500 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100 group-focus-visible:scale-x-100" />
                  Build My Service Package
                  <span aria-hidden="true" className="flex h-10 w-10 items-center justify-center rounded-full bg-navy/10">
                    <svg viewBox="0 0 16 16" className="h-[13px] w-[13px] transition-transform duration-500 group-hover:translate-x-0.5" fill="none">
                      <path d="M3 8h9.5M8.5 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </a>

                <p className="mt-4 text-[13px] leading-relaxed text-white/55">
                  We&apos;ll receive{" "}
                  <span className="text-white/80">{combinationLabel(combination)}</span>{" "}
                  with your enquiry.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
