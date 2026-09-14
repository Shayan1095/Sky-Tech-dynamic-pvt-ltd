import type { ReactNode } from "react";

// Three bespoke visuals, one per pillar. Each is decorative — the meaning is
// carried by the pillar's text — so they are hidden from assistive tech.
//
// Deliberate hierarchy: AUTOMATE is the hero visual (full sequential
// choreography). BUILD assembles in two beats and GROW is a single drawn
// stroke, so the eye has one place to land rather than three.

const wellClass =
  "relative mt-5 h-[156px] w-full sm:mt-7 sm:h-[172px] overflow-hidden rounded-xl border border-[var(--ap-border)]";

const floatShadow =
  "0 1px 2px rgb(17 24 39 / 0.05), 0 8px 20px -12px rgb(17 24 39 / 0.3)";

/* ---------------------------------------------------------------- BUILD -- */

export function BuildVisual() {
  return (
    <div
      className={`${wellClass} bg-gradient-to-b from-white to-[var(--ap-bg)]`}
      aria-hidden="true"
    >
      {/* Soft ground shape the composition sits on */}
      <span className="absolute -bottom-8 -left-10 h-32 w-48 rounded-[45%] bg-gradient-to-tr from-[var(--ap-blue)]/20 via-[var(--ap-blue)]/8 to-transparent" />

      {/* Primary interface window */}
      <div
        className="bv-piece bv-1 absolute left-4 top-5 w-[60%] overflow-hidden rounded-lg border border-[var(--ap-border)] bg-white transition-transform duration-500 ease-out group-hover:-translate-x-1"
        style={{ boxShadow: floatShadow }}
      >
        <div className="flex items-center gap-[3px] border-b border-[var(--ap-border)] bg-[var(--ap-bg)] px-2 py-[5px]">
          <span className="h-[3px] w-[3px] rounded-full bg-[var(--ap-muted)]/40" />
          <span className="h-[3px] w-[3px] rounded-full bg-[var(--ap-muted)]/40" />
          <span className="h-[3px] w-[3px] rounded-full bg-[var(--ap-muted)]/40" />
        </div>
        <div className="p-[10px]">
          <p className="text-[9px] font-semibold leading-[1.25] text-[var(--ap-ink)]">
            Your Idea.
            <br />
            Our Code.
          </p>
          <span className="mt-[6px] block h-[3px] w-full rounded-full bg-[var(--ap-muted)]/18" />
          <span className="mt-[4px] block h-[3px] w-[72%] rounded-full bg-[var(--ap-muted)]/18" />
          <span className="mt-[8px] flex h-[13px] w-[52px] items-center justify-center rounded-md bg-gradient-to-r from-[var(--ap-blue)] to-[var(--ap-blue)]/75 text-[6px] font-semibold tracking-wide text-white">
            GET STARTED
          </span>
        </div>
      </div>

      {/* Thumbnail card, offset behind */}
      <div
        className="bv-piece bv-2 absolute right-4 top-14 w-[36%] overflow-hidden rounded-lg border border-[var(--ap-border)] bg-white transition-transform duration-500 ease-out group-hover:-translate-y-1 group-hover:translate-x-1"
        style={{ boxShadow: floatShadow }}
      >
        <span className="relative block h-[36px] w-full overflow-hidden bg-gradient-to-br from-[var(--ap-blue)]/35 to-[var(--ap-blue)]/8">
          <span className="absolute -bottom-2 left-1 h-5 w-8 rotate-45 bg-white/45" />
          <span className="absolute -bottom-3 right-0 h-6 w-9 rotate-45 bg-white/30" />
        </span>
        <div className="space-y-[4px] p-[7px]">
          <span className="block h-[3px] w-full rounded-full bg-[var(--ap-muted)]/18" />
          <span className="block h-[3px] w-[58%] rounded-full bg-[var(--ap-muted)]/18" />
        </div>
      </div>

      {/* Foreground code chip */}
      <div
        className="bv-piece bv-3 absolute bottom-5 left-10 flex items-center gap-[6px] rounded-lg border border-[var(--ap-border)] bg-white px-[7px] py-[6px] transition-transform duration-500 ease-out group-hover:translate-y-1"
        style={{ boxShadow: floatShadow }}
      >
        <span className="flex h-[16px] w-[16px] shrink-0 items-center justify-center rounded-md bg-[var(--ap-blue)]/12 font-mono text-[7px] font-bold text-[var(--ap-blue)]">
          &lt;/&gt;
        </span>
        <span className="block h-[3px] w-[26px] rounded-full bg-[var(--ap-muted)]/25" />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------- AUTOMATE -- */

const glyph = (d: ReactNode) => (
  <svg
    viewBox="0 0 16 16"
    className="h-[9px] w-[9px]"
    fill="none"
    stroke="var(--ap-blue)"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {d}
  </svg>
);

const FLOW: Array<{ label: string; icon: ReactNode }> = [
  {
    label: "Inquiry",
    icon: glyph(
      <>
        <circle cx="8" cy="5.5" r="2.6" />
        <path d="M2.8 13.4a5.2 5.2 0 0 1 10.4 0" />
      </>
    ),
  },
  {
    label: "CRM",
    icon: glyph(
      <>
        <ellipse cx="8" cy="4" rx="5.2" ry="2.2" />
        <path d="M2.8 4v8a5.2 2.2 0 0 0 10.4 0V4" />
        <path d="M2.8 8a5.2 2.2 0 0 0 10.4 0" />
      </>
    ),
  },
  {
    label: "Process",
    icon: glyph(
      <>
        <circle cx="8" cy="8" r="2.4" />
        <path d="M8 1.6v2M8 12.4v2M1.6 8h2M12.4 8h2M3.5 3.5l1.4 1.4M11.1 11.1l1.4 1.4M12.5 3.5l-1.4 1.4M4.9 11.1l-1.4 1.4" />
      </>
    ),
  },
  {
    label: "Customer",
    icon: glyph(
      <>
        <circle cx="8" cy="8" r="6" />
        <path d="M5.2 8.2l2 2 3.6-4" />
      </>
    ),
  },
];

export function AutomateVisual() {
  return (
    <div
      className={`${wellClass} approach-automate bg-gradient-to-b from-[var(--ap-blue)]/[0.16] via-white to-white px-4 py-[14px]`}
      aria-hidden="true"
    >
      {/* Base rail, then the blue line that draws down through it */}
      <span className="absolute bottom-6 left-1/2 top-6 w-px -translate-x-1/2 bg-[var(--ap-border)]" />
      <span className="av-line absolute bottom-6 left-1/2 top-6 w-px -translate-x-1/2 bg-gradient-to-b from-[var(--ap-blue)] to-[var(--ap-blue)]/45" />
      <span className="approach-pulse absolute left-1/2 top-6 h-[7px] w-[7px] -translate-x-1/2 rounded-full bg-[var(--ap-blue)] opacity-0 shadow-[0_0_0_4px_rgb(0_107_184/0.16)]" />

      <ul className="relative flex h-full flex-col items-center justify-between">
        {FLOW.map(({ label, icon }) => (
          <li
            className="av-row flex items-center gap-[7px] rounded-full border border-[var(--ap-border)] bg-white py-[5px] pl-[5px] pr-[13px] transition-colors duration-300 group-hover:border-[var(--ap-blue)]/40"
            key={label}
            style={{ boxShadow: floatShadow }}
          >
            <span className="av-dot flex h-[17px] w-[17px] shrink-0 items-center justify-center rounded-full bg-[var(--ap-blue)]/12">
              {icon}
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--ap-ink)]">
              {label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ----------------------------------------------------------------- GROW -- */

const TRAJECTORY =
  "M14 118 C 44 114, 58 104, 74 99 S 112 90, 136 74 S 178 52, 198 38 S 228 24, 246 15";
const AREA = `${TRAJECTORY} L246 132 L14 132 Z`;
const MARKS: Array<[number, number]> = [
  [74, 99],
  [136, 74],
  [198, 38],
];
const GAINS = ["More Traffic", "More Leads", "More Sales"];

export function GrowVisual() {
  return (
    <div className={`${wellClass} bg-white`} aria-hidden="true">
      <svg
        viewBox="0 0 260 150"
        className="h-full w-full"
        fill="none"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="growFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--ap-blue)" stopOpacity="0.26" />
            <stop offset="100%" stopColor="var(--ap-blue)" stopOpacity="0" />
          </linearGradient>
        </defs>

        <path className="gv-area" d={AREA} fill="url(#growFill)" />
        <path
          className="gv-path"
          d={TRAJECTORY}
          stroke="var(--ap-blue)"
          strokeWidth="2"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />

        {MARKS.map(([x, y]) => (
          <circle
            key={x}
            className="gv-mark"
            cx={x}
            cy={y}
            r="2.6"
            fill="white"
            stroke="var(--ap-blue)"
            strokeWidth="1.6"
            vectorEffect="non-scaling-stroke"
          />
        ))}

        <g className="gv-end transition-transform duration-500 ease-out group-hover:-translate-y-[4px]">
          <circle cx="246" cy="15" r="8" fill="var(--ap-blue)" opacity="0.16" />
          <circle
            cx="246"
            cy="15"
            r="4"
            fill="var(--ap-blue)"
            stroke="white"
            strokeWidth="1.6"
            vectorEffect="non-scaling-stroke"
          />
        </g>
      </svg>

      {/* Gains card */}
      <div
        className="absolute left-4 top-5 rounded-lg border border-[var(--ap-border)] bg-white px-[9px] py-[7px]"
        style={{ boxShadow: floatShadow }}
      >
        {GAINS.map((gain) => (
          <p
            key={gain}
            className="gv-label flex items-center gap-[5px] text-[8px] leading-[1.55] text-[var(--ap-ink)]"
          >
            <span className="h-[3px] w-[3px] rounded-full bg-[var(--ap-blue)]" />
            {gain}
          </p>
        ))}
      </div>

      {/* Chart badge */}
      <div
        className="gv-chip absolute bottom-4 right-4 flex h-[26px] w-[26px] items-end justify-center gap-[2px] rounded-lg border border-[var(--ap-border)] bg-white pb-[7px] transition-transform duration-500 ease-out group-hover:-translate-y-[3px]"
        style={{ boxShadow: floatShadow }}
      >
        <span className="h-[6px] w-[3px] rounded-sm bg-[var(--ap-blue)]/45" />
        <span className="h-[10px] w-[3px] rounded-sm bg-[var(--ap-blue)]/70" />
        <span className="h-[13px] w-[3px] rounded-sm bg-[var(--ap-blue)]" />
      </div>
    </div>
  );
}
