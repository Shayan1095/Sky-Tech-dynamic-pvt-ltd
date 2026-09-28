"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import BrandMarquee from "./BrandMarquee";
import { BRANDS } from "@/lib/brands";

const CLOSED = "inset(0 100% 0 0)";
const OPEN = "inset(0 0% 0 0)";

/* The site's drafting frame, shared with the About page and the footer. */
const FRAME = "mx-4 sm:mx-6 lg:mx-8 xl:mx-auto xl:max-w-6xl";
const INSET = "px-5 sm:px-8 lg:px-12";

const STATS: Array<{ value: number; label: string }> = [
  { value: 50, label: "Websites Delivered" },
  { value: 150, label: "Businesses Served" },
  { value: 5, label: "Years of Experience" },
];

/* The three figures used to be three full-width rows, each with a schematic
   drawn to its own count — fifty browser tiles, a hundred and fifty linked
   points, five years on a timeline. It was a good drawing and it was the
   wrong shape for this position: the section ran the better part of a screen
   and a half between the hero and the work, so the proof of the claim sat a
   long way from the claim.

   The figures now read across in one strip, and the space that bought goes
   to the brands themselves, which are the stronger evidence anyway: a name
   someone recognises does more than a count of tiles.

   The odometer stays. It is the part that earns the scroll. */

// An odometer strip: full 0-9 cycles, then a partial run ending on the target
// digit. Scrubbing the strip's yPercent rolls the digit into place.
function buildStrip(target: number, cycles: number) {
  const seq: number[] = [];
  for (let c = 0; c < cycles; c++) {
    for (let d = 0; d <= 9; d++) seq.push(d);
  }
  for (let d = 0; d <= target; d++) seq.push(d);
  return seq;
}

export default function TrustBar() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const cells = Array.from(section.querySelectorAll<HTMLElement>(".tb-cell"));
    const strips = Array.from(section.querySelectorAll<HTMLSpanElement>("[data-total]"));
    const pluses = Array.from(section.querySelectorAll<HTMLSpanElement>(".tb-plus"));

    const restTarget = (strip: HTMLSpanElement) => {
      const total = Number(strip.dataset.total ?? 1);
      return -((total - 1) / total) * 100;
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(cells, { opacity: 1, y: 0 });
      strips.forEach((s) => gsap.set(s, { yPercent: restTarget(s) }));
      return;
    }

    gsap.set(cells, { opacity: 0, y: 10 });
    gsap.set(strips, { yPercent: 0 });

    // Same header choreography as the Approach section: the mark scales in,
    // the heading wipes left to right a line at a time, the lede follows.
    const q = gsap.utils.selector(section);
    const header = gsap.timeline({
      scrollTrigger: { trigger: section, start: "top 78%", once: true },
      onComplete: () => gsap.set(q(".tb-heading-line"), { clearProps: "willChange" }),
    });

    header
      .fromTo(q(".tb-mark"), { scale: 0, transformOrigin: "left center" }, { scale: 1, duration: 0.5 }, 0)
      .fromTo(
        q(".tb-heading-line"),
        { clipPath: CLOSED, willChange: "clip-path" },
        { clipPath: OPEN, duration: 0.65, stagger: 0.09 },
        0.08
      )
      .fromTo(q(".tb-lede"), { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.6 }, 0.44);

    /* The strip is one line now, so the figures roll together rather than one
       row at a time — a short scrub that finishes well before the wall below
       comes into view. */
    const tl = gsap.timeline({
      scrollTrigger: { trigger: section, start: "top 70%", end: "top 35%", scrub: 0.6 },
    });

    cells.forEach((cell, i) => {
      const at = i * 0.12;
      tl.to(cell, { opacity: 1, y: 0, duration: 0.3, ease: "none" }, at);

      // Every digit rolls, units digit settling last — the number counts up
      // rather than sitting there with one spinning digit.
      const cellStrips = strips.filter((s) => s.dataset.row === String(i));
      cellStrips.forEach((strip, d) => {
        tl.to(strip, { yPercent: restTarget(strip), duration: 0.7 + d * 0.06, ease: "none" }, at);
      });

      const span = 0.7 + Math.max(0, cellStrips.length - 1) * 0.06;
      if (pluses[i]) {
        tl.fromTo(
          pluses[i],
          { textShadow: "0 0 0px rgba(0, 194, 255, 0)" },
          { textShadow: "0 0 22px rgba(0, 194, 255, 0.55)", duration: 0.12, ease: "none" },
          at + span - 0.12
        );
      }
    });

    /* The wall arrives once, gently. Its rows move on their own from there. */
    const wall = gsap.fromTo(
      section.querySelector(".tb-wall"),
      { opacity: 0, y: 16 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: { trigger: section.querySelector(".tb-wall"), start: "top 90%", once: true },
      }
    );

    return () => {
      header.scrollTrigger?.kill();
      header.kill();
      tl.scrollTrigger?.kill();
      tl.kill();
      wall.scrollTrigger?.kill();
      wall.kill();
    };
  }, []);

  return (
    // overflow-x-clip, not overflow-hidden: the corner registration marks sit
    // across the section's top and bottom edges and must not be cut in half.
    <section ref={sectionRef} className="relative isolate overflow-x-clip bg-navy">
      {/* Frame rules and registration marks at the section's top and bottom */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className={`relative h-full border-x border-dotted border-bg/[0.14] ${FRAME}`}>
          {(["top-0 -translate-y-1/2", "bottom-0 translate-y-1/2"] as const).map((v) =>
            (["left-0 -translate-x-1/2", "right-0 translate-x-1/2"] as const).map((h) => (
              <span key={v + h} className={`absolute h-[11px] w-[11px] ${v} ${h}`}>
                <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-bg/40" />
                <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-bg/40" />
              </span>
            ))
          )}
        </div>
      </div>

      <div className={`relative ${FRAME}`}>
        <div className={`pt-24 sm:pt-32 ${INSET}`}>
          <span className="tb-mark block h-px w-8 bg-cta" aria-hidden="true" />
          <h2 className="mt-6 max-w-3xl text-[2.2rem] font-semibold leading-[1.04] tracking-[-0.028em] text-bg sm:text-[3rem] lg:text-[3.6rem]">
            <span className="tb-heading-line block">Trusted by Businesses,</span>
            <span className="tb-heading-line block">Organizations &amp; Growing Brands</span>
          </h2>
          <p className="tb-lede mt-6 max-w-2xl text-lg leading-relaxed text-bg sm:text-xl">
            From startups to established enterprises, SKY Tech has helped
            businesses across web development, digital marketing, and software
            design turn ideas into measurable results.
          </p>

          {/* The results, in one line. Three cells, dotted rules between them,
              ruled top and bottom like a spec sheet's summary row. */}
          <div className="mt-14 grid grid-cols-3 border-y border-bg/15 sm:mt-16">
            {STATS.map((stat, i) => {
              const digits = String(stat.value).split("").map(Number);
              return (
                <div
                  key={stat.label}
                  className={`tb-cell flex flex-col items-center gap-2 py-7 text-center sm:gap-3 sm:py-9 ${
                    i > 0 ? "border-l border-dotted border-bg/25" : ""
                  }`}
                >
                  <span className="flex items-end font-mono text-[2.1rem] leading-none font-medium text-bg sm:text-5xl lg:text-6xl">
                    <span className="sr-only">
                      {stat.value}+ {stat.label}
                    </span>

                    {digits.map((digit, d) => {
                      const strip = buildStrip(digit, d + 1);
                      return (
                        <span
                          key={`${stat.label}-${d}`}
                          aria-hidden="true"
                          className="block overflow-hidden"
                          style={{ height: "1em" }}
                        >
                          <span data-total={strip.length} data-row={i} className="block">
                            {strip.map((n, k) => (
                              <span
                                key={k}
                                className="block text-center"
                                style={{ height: "1em", lineHeight: 1 }}
                              >
                                {n}
                              </span>
                            ))}
                          </span>
                        </span>
                      );
                    })}

                    <span aria-hidden="true" className="tb-plus text-cta">
                      +
                    </span>
                  </span>

                  <span
                    aria-hidden="true"
                    className="font-display text-[0.78rem] leading-tight text-bg/75 sm:text-sm lg:text-base"
                  >
                    {stat.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* The wall runs past the frame, edge to edge, as the Technology band
          on the service pages does. */}
      <div className="tb-wall relative pb-20 pt-14 sm:pb-24 sm:pt-16">
        <p className={`mb-8 flex items-center justify-center gap-4 sm:mb-10 ${INSET}`}>
          <span aria-hidden="true" className="block h-px w-8 bg-cta sm:w-10" />
          <span className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-cta sm:text-[11px]">
            {BRANDS.length} Brands We&rsquo;ve Worked With
          </span>
          <span aria-hidden="true" className="block h-px w-8 bg-cta sm:w-10" />
        </p>
        <BrandMarquee />
      </div>
    </section>
  );
}
