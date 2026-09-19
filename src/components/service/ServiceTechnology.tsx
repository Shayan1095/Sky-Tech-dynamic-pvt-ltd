"use client";

import type { ServicePage } from "@/lib/service-pages/types";
import { TECH_LOGOS } from "@/lib/service-pages/techLogos";
import { FRAME, INSET, Words } from "./parts";
import TechMarquee from "./TechMarquee";
import { useSectionReveal, type RevealBuilder } from "./useSectionReveal";

/* Section 07 — the stack.

   A navy band with the page's centred moment: after the ruled, left-aligned
   sections above it, the heading and its line sit on the centre axis, and the
   technology runs beneath them the full width of the screen — edge to edge,
   past the frame, fading into the navy at both sides. It is the one place on
   the page where the content is allowed to leave the drafting frame, which is
   what makes it read as a band rather than another section.

   The rows are the brand logos in their own colours (see TechMarquee). The
   count above the heading is worked out from the data, not written down.

   Entrance: the heading opens from its centre, as the centred composition
   asks, and each row slides in from the side it is travelling towards, so
   the motion that follows is a continuation rather than a change. */

const build: RevealBuilder<HTMLElement> = (tl, root) => {
  tl.fromTo(".svg-rule", { scaleX: 0, transformOrigin: "center" }, { scaleX: 1, duration: 0.6 }, 0)
    .fromTo(".svg-count", { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.5 }, 0.08)
    .fromTo(
      ".svg-heading",
      { clipPath: "inset(0 50% 0 50%)" },
      { clipPath: "inset(0 0% 0 0%)", duration: 0.95, ease: "power3.inOut" },
      0.14
    )
    .fromTo(".svg-intro", { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.8 }, 0.4);

  root.querySelectorAll<HTMLElement>(".svt-row").forEach((row, i) => {
    tl.fromTo(
      row,
      { opacity: 0, x: i % 2 === 0 ? -48 : 48 },
      { opacity: 1, x: 0, duration: 1.1, ease: "power3.out" },
      0.5 + i * 0.12
    );
  });
  tl.fromTo(".svt-still", { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.7 }, 0.9);
};

export default function ServiceTechnology({ page }: { page: ServicePage }) {
  const ref = useSectionReveal(build, "top 72%");
  const technology = page.technology;
  if (!technology) return null;

  const count = technology.groups
    .filter((g) => g.items.some((i) => TECH_LOGOS[i]))
    .reduce((n, g) => n + g.items.length, 0);

  return (
    <section
      ref={ref}
      id="technology"
      aria-labelledby="technology-heading"
      className="sky-anchor relative isolate overflow-hidden bg-navy text-white"
    >
      {/* Light falls from the top centre, on the heading's axis. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 [background-image:radial-gradient(70%_55%_at_50%_0%,rgb(0_107_184/0.55),transparent_70%),radial-gradient(45%_40%_at_50%_100%,rgb(0_194_255/0.08),transparent_70%)]"
      />
      {/* The drafting grid, strongest behind the heading. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.09] [background-image:linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] [background-size:34px_34px] [mask-image:radial-gradient(75%_60%_at_50%_0%,#000_0%,transparent_80%)]"
      />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className={`h-full border-x border-dotted border-white/15 ${FRAME}`} />
      </div>

      <div className={`relative ${FRAME}`}>
        <div className={`flex flex-col items-center pb-14 pt-24 text-center sm:pb-16 sm:pt-28 lg:pt-32 ${INSET}`}>
          {/* Counted from the brand technologies only; a service with only
              a handful shows no count. */}
          {count >= 4 && (
            <p className="flex items-center gap-4">
              <span aria-hidden="true" className="svg-rule block h-px w-10 bg-cta" />
              <span className="svg-count font-mono text-[11px] uppercase tracking-[0.22em] text-cta sm:text-xs">
                {count} Technologies
              </span>
              <span aria-hidden="true" className="svg-rule block h-px w-10 bg-cta" />
            </p>
          )}

          <h2
            id="technology-heading"
            className="svg-heading mt-8 max-w-4xl font-display text-[2.3rem] font-semibold leading-[1.04] tracking-[-0.035em] text-white [text-wrap:balance] sm:text-[3.2rem] lg:text-[3.9rem]"
          >
            <Words text={technology.heading} />
          </h2>

          {technology.intro && (
            <p className="svg-intro mt-7 max-w-2xl text-base leading-relaxed text-white/85 [text-wrap:balance] sm:text-lg">
              {technology.intro}
            </p>
          )}
        </div>
      </div>

      {/* Full-bleed: the rows run past the frame, edge to edge. */}
      <div className="relative pb-20 sm:pb-24">
        <TechMarquee groups={technology.groups} />
      </div>
    </section>
  );
}
