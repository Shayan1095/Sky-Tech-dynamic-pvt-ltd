import Link from "next/link";
import type { ReactNode } from "react";

export interface Pillar {
  index: string;
  title: string;
  subtitle: string;
  description: string;
  href: string;
  /* Share of the top rule painted blue — 1/3, 2/3, 3/3. The rule encodes how
     far through the Build → Automate → Grow system each pillar sits, and
     prefigures the journey rail below. */
  progress: string;
  visual: ReactNode;
}

// Two layers on purpose: the outer <article> is GSAP's — it owns the entrance
// and the scroll relay's focus transform. The inner card owns hover and the
// visual treatment, so a CSS hover transform never fights GSAP's inline one.
export default function ApproachPillar({ pillar }: { pillar: Pillar }) {
  return (
    // Phones: a fixed, centred card width instead of stretching edge to edge.
    <article className="approach-pillar mx-auto w-full max-w-[21rem] sm:max-w-none">
      <div className="approach-card group relative isolate flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--ap-border)] p-5 transition-transform duration-500 ease-out hover:-translate-y-[5px] sm:p-7">
        {/* Accent wash, faded up when this card holds focus */}
        <span
          aria-hidden="true"
          className="approach-glow pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-[var(--ap-blue)]/[0.04] to-[var(--ap-blue)]/[0.14] opacity-0"
        />

        <span
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-[3px] bg-[var(--ap-border)]"
        />
        <span
          aria-hidden="true"
          className="approach-rule absolute left-0 top-0 h-[3px] rounded-r-full bg-gradient-to-r from-[var(--ap-blue)] to-[var(--ap-blue)]/60"
          style={{ width: pillar.progress }}
        />

        <span className="font-mono text-sm text-[var(--ap-blue)]">
          {pillar.index}
        </span>

        <h3 className="mt-2 text-[1.45rem] font-medium uppercase tracking-tight text-[var(--ap-ink)] sm:mt-3 sm:text-[1.75rem]">
          {pillar.title}
        </h3>
        <p className="mt-1 text-sm text-[var(--ap-muted)]">
          {pillar.subtitle}
        </p>

        <p className="mt-3 text-[0.9rem] leading-relaxed text-[var(--ap-ink)] sm:mt-4 sm:text-[0.95rem]">
          {pillar.description}
        </p>

        <Link
          href={pillar.href}
          className="mt-4 inline-flex w-fit sm:mt-5 items-center gap-2 rounded-full text-sm text-[var(--ap-blue)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--ap-blue)]"
        >
          Explore {pillar.title}
          <span
            aria-hidden="true"
            className="transition-transform duration-300 ease-out group-hover:translate-x-1"
          >
            &rarr;
          </span>
        </Link>

        <div className="mt-auto">{pillar.visual}</div>
      </div>
    </article>
  );
}
