"use client";

import { useSyncExternalStore, type CSSProperties } from "react";
import { TECH_LOGOS } from "@/lib/service-pages/techLogos";
import type { ServicePage, WhyProof as Proof } from "@/lib/service-pages/types";
import { Arrow, pct, px } from "./parts";
import { quote } from "./quoteStore";
import { useServiceQuote } from "./useServiceQuote";

/* The proof under each "Why choose us" reason. Each renders from the page's
   own data where it can, so a proof can never disagree with the section it
   points to. Drawings are decoration (aria-hidden); every proof that carries
   information carries it as text too.

   Animation hooks (played by ServiceWhy, replayed on hover):
     .svy-draw  strokes that draw on        .svy-pop  shapes that settle in
     .svy-arc   gauge arcs                  .svy-bar  bars that grow upward */

const FAINT = "rgb(18 18 18 / 0.12)";
const SOFT = "rgb(18 18 18 / 0.3)";
const PRIMARY = "#006bb8";
const CTA = "#00c2ff";

function ProofLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="group/pl inline-flex items-center gap-2 py-1.5 font-mono text-[10.5px] uppercase tracking-[0.18em] text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
    >
      <span className="underline decoration-primary/30 underline-offset-4 transition-colors duration-300 group-hover/pl:decoration-primary">
        {children}
      </span>
      <Arrow className="h-3 w-3 transition-transform duration-300 group-hover/pl:translate-x-0.5" />
    </a>
  );
}

/* ---- Drawings ------------------------------------------------------------ */

function ResponsiveDrawing() {
  return (
    <svg viewBox="0 0 240 104" className="h-auto w-full max-w-[250px] overflow-visible" fill="none" aria-hidden="true">
      {/* Desktop */}
      <rect className="svy-draw" x="4" y="6" width="120" height="78" rx="6" stroke={SOFT} strokeWidth="1.5" />
      <path className="svy-draw" d="M52 84v10M40 96h24" stroke={SOFT} strokeWidth="1.5" strokeLinecap="round" />
      <rect className="svy-pop" x="12" y="14" width="104" height="7" rx="2" fill={PRIMARY} />
      {[12, 48, 84].map((x) => (
        <rect key={x} className="svy-pop" x={x} y="28" width="32" height="48" rx="3" fill={CTA} fillOpacity="0.16" stroke={PRIMARY} strokeOpacity="0.5" />
      ))}
      {/* Tablet */}
      <rect className="svy-draw" x="138" y="14" width="50" height="76" rx="6" stroke={SOFT} strokeWidth="1.5" />
      <rect className="svy-pop" x="144" y="21" width="38" height="6" rx="2" fill={PRIMARY} />
      <rect className="svy-pop" x="144" y="32" width="18" height="24" rx="3" fill={CTA} fillOpacity="0.16" stroke={PRIMARY} strokeOpacity="0.5" />
      <rect className="svy-pop" x="164" y="32" width="18" height="24" rx="3" fill={CTA} fillOpacity="0.16" stroke={PRIMARY} strokeOpacity="0.5" />
      <rect className="svy-pop" x="144" y="60" width="38" height="24" rx="3" fill={CTA} fillOpacity="0.16" stroke={PRIMARY} strokeOpacity="0.5" />
      {/* Phone */}
      <rect className="svy-draw" x="202" y="26" width="32" height="64" rx="6" stroke={SOFT} strokeWidth="1.5" />
      <rect className="svy-pop" x="207" y="33" width="22" height="5" rx="2" fill={PRIMARY} />
      {[42, 58, 74].map((y) => (
        <rect key={y} className="svy-pop" x="207" y={y} width="22" height="12" rx="2.5" fill={CTA} fillOpacity="0.16" stroke={PRIMARY} strokeOpacity="0.5" />
      ))}
    </svg>
  );
}

function StructureDrawing() {
  const h2 = [44, 120, 196];
  return (
    <svg viewBox="0 0 240 104" className="h-auto w-full max-w-[250px] overflow-visible" fill="none" aria-hidden="true">
      {h2.map((x) => (
        <path key={x} className="svy-draw" d={`M120 24 V34 H${x} V48`} stroke={SOFT} strokeWidth="1.5" />
      ))}
      {h2.map((x) =>
        [-14, 14].map((dx) => (
          <path key={`${x}${dx}`} className="svy-draw" d={`M${x} 62 V70 H${x + dx} V78`} stroke={FAINT} strokeWidth="1.5" />
        ))
      )}
      <g className="svy-pop">
        <rect x="92" y="6" width="56" height="18" rx="4" fill={PRIMARY} />
        <text x="120" y="18.5" textAnchor="middle" fontSize="9" fontFamily="var(--font-numeric)" fill="#fff" letterSpacing="1">H1</text>
      </g>
      {h2.map((x) => (
        <g key={x} className="svy-pop">
          <rect x={x - 22} y="48" width="44" height="14" rx="3.5" fill={CTA} fillOpacity="0.18" stroke={PRIMARY} strokeOpacity="0.55" />
          <text x={x} y="58" textAnchor="middle" fontSize="8" fontFamily="var(--font-numeric)" fill={PRIMARY} letterSpacing="1">H2</text>
        </g>
      ))}
      {h2.map((x) =>
        [-14, 14].map((dx) => (
          <rect key={`${x}${dx}`} className="svy-pop" x={x + dx - 10} y="78" width="20" height="6" rx="2" fill={SOFT} />
        ))
      )}
    </svg>
  );
}

function CustomDrawing() {
  return (
    <svg viewBox="0 0 240 104" className="h-auto w-full max-w-[250px] overflow-visible" fill="none" aria-hidden="true">
      {/* The template: three identical boxes, dashed */}
      {[6, 40, 74].map((x) => (
        <rect key={x} className="svy-pop" x={x} y="20" width="28" height="64" rx="3" stroke={SOFT} strokeWidth="1.5" strokeDasharray="3 3" />
      ))}
      <path className="svy-draw" d="M112 52h22m-6-6 6 6-6 6" stroke={PRIMARY} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* Built around the business: an asymmetric layout */}
      <rect className="svy-pop" x="146" y="12" width="88" height="14" rx="3" fill={PRIMARY} />
      <rect className="svy-pop" x="146" y="32" width="52" height="46" rx="3" fill={CTA} fillOpacity="0.18" stroke={PRIMARY} strokeOpacity="0.55" />
      <rect className="svy-pop" x="204" y="32" width="30" height="20" rx="3" fill={CTA} fillOpacity="0.18" stroke={PRIMARY} strokeOpacity="0.55" />
      <rect className="svy-pop" x="204" y="58" width="30" height="20" rx="3" fill={CTA} fillOpacity="0.18" stroke={PRIMARY} strokeOpacity="0.55" />
      <rect className="svy-pop" x="146" y="84" width="88" height="8" rx="2" fill={SOFT} />
    </svg>
  );
}

/* ---- Speed --------------------------------------------------------------- */

const noSubscribe = () => () => {};

/* The gauges are drawn at 90 of 100: the claim is "90+", which stays true
   across the run-to-run variation a live score has. */
function Gauge({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 100 100" className="h-[92px] w-[92px] sm:h-[104px] sm:w-[104px]" fill="none" aria-hidden="true">
        <circle cx="50" cy="50" r="42" stroke={FAINT} strokeWidth="7" />
        <circle
          className="svy-arc"
          cx="50"
          cy="50"
          r="42"
          stroke="url(#svy-gauge)"
          strokeWidth="7"
          strokeLinecap="round"
          /* 90% of the ring in real units (circumference 2π·42 ≈ 263.9): the
             draw animation measures true lengths, so pathLength can't be used. */
          strokeDasharray="237.5 263.9"
          transform="rotate(-90 50 50)"
        />
        <text x="50" y="57" textAnchor="middle" fontSize="22" fontWeight="600" fontFamily="var(--font-heading)" fill="#121212" letterSpacing="-0.5">
          90+
        </text>
      </svg>
      <span className="mt-2 font-mono text-[10.5px] uppercase tracking-[0.18em] text-text/55">{label}</span>
    </div>
  );
}

function SpeedProof() {
  /* Test the page the visitor is actually on — whichever domain serves it. */
  const here = useSyncExternalStore(noSubscribe, () => window.location.origin + window.location.pathname, () => "");
  const href = here ? `https://pagespeed.web.dev/analysis?url=${encodeURIComponent(here)}` : "https://pagespeed.web.dev/";

  return (
    <div className="flex flex-col gap-5">
      <svg width="0" height="0" className="absolute" aria-hidden="true">
        <defs>
          <linearGradient id="svy-gauge" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={PRIMARY} />
            <stop offset="1" stopColor={CTA} />
          </linearGradient>
        </defs>
      </svg>
      <div className="flex gap-6">
        <Gauge label="Mobile" />
        <Gauge label="Desktop" />
      </div>
      <div className="min-w-0">
        <p className="text-[14px] leading-relaxed text-text/75 [text-wrap:pretty]">
          <span className="sr-only">Scores of 90 or more on mobile and desktop. </span>
          This page, tested on Google PageSpeed Insights.
        </p>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="group/pl mt-2 inline-flex items-center gap-2 py-1.5 font-mono text-[10.5px] uppercase tracking-[0.18em] text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <span className="underline decoration-primary/30 underline-offset-4 transition-colors duration-300 group-hover/pl:decoration-primary">
            Test it yourself
          </span>
          <Arrow className="h-3 w-3 -rotate-45 transition-transform duration-300 group-hover/pl:rotate-0" />
          <span className="sr-only">(opens Google PageSpeed Insights in a new tab)</span>
        </a>
      </div>
    </div>
  );
}

/* ---- Data-built proofs --------------------------------------------------- */

function PricingProof({ page }: { page: ServicePage }) {
  const tiers = page.packages.tiers;
  const values = tiers.map((t) => Number(t.price.replace(/[^0-9.]/g, "")) || 0);
  const lo = Math.log(Math.min(...values.filter(Boolean)));
  const hi = Math.log(Math.max(...values));
  const height = (v: number) => (v && hi > lo ? 28 + ((Math.log(v) - lo) / (hi - lo)) * 72 : 40);
  return (
    <div>
      <div aria-hidden="true" className="flex h-16 items-end gap-1.5">
        {tiers.map((t, i) => (
          <span
            key={t.id}
            className="svy-bar block flex-1 rounded-t-[4px] bg-[linear-gradient(to_top,var(--color-primary),var(--color-cta))]"
            style={{ height: pct(height(values[i])), opacity: (0.35 + (0.65 * (i + 1)) / tiers.length).toFixed(2) }}
          />
        ))}
      </div>
      <p className="mt-2 flex justify-between font-mono text-[12.5px] text-text">
        <span>{tiers[0].price}</span>
        <span>{tiers[tiers.length - 1].price}</span>
      </p>
      <p className="mt-1 text-[13px] text-text/60">
        {tiers.length} packages, every starting price on this page.
      </p>
      <div className="mt-2">
        <ProofLink href="#packages">See all packages</ProofLink>
      </div>
    </div>
  );
}

function ProcessProof({ page, step }: { page: ServicePage; step: number }) {
  const s = page.process.steps[step];
  if (!s) return null;
  return (
    <div>
      <p className="flex items-center gap-3">
        <span className="svy-pop flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary font-mono text-[11px] text-white">
          {String(step + 1).padStart(2, "0")}
        </span>
        <span className="font-display text-[1.05rem] font-medium tracking-[-0.01em] text-text">{s.title}</span>
        <span aria-hidden="true" className="flex items-center gap-1.5">
          {page.process.steps.slice(step + 1, step + 4).map((_, i) => (
            <span key={i} className="block h-1.5 w-1.5 rounded-full bg-text/15" />
          ))}
        </span>
      </p>
      <p className="mt-2.5 text-[13.5px] leading-relaxed text-text/65 [text-wrap:pretty]">{s.body}</p>
      <div className="mt-1.5">
        <ProofLink href="#process">See the process</ProofLink>
      </div>
    </div>
  );
}

function StackProof({ page }: { page: ServicePage }) {
  /* Counted exactly as the Technology band counts, so the two never
     disagree: every technology in a group that has logos (Java included). */
  const groups = (page.technology?.groups ?? []).filter((g) => g.items.some((i) => TECH_LOGOS[i]));
  const total = groups.reduce((n, g) => n + g.items.length, 0);
  const names = groups.flatMap((g) => g.items).filter((n) => TECH_LOGOS[n]);
  return (
    <div>
      <div className="flex items-center gap-3">
        <span className="font-display text-[1.6rem] font-semibold leading-none tracking-[-0.03em] text-text">{total}</span>
        <span className="text-[13px] leading-tight text-text/60">technologies
          <br />we work with</span>
      </div>
      <div aria-hidden="true" className="mt-4 flex flex-wrap gap-2">
        {names.slice(0, 6).map((n) => {
          const logo = TECH_LOGOS[n];
          return (
            <span key={n} className="svy-pop flex h-9 w-9 items-center justify-center rounded-lg border border-text/10 bg-bg" style={{ "--brand": logo.hex } as CSSProperties}>
              <span
                className="svt-logo"
                data-backed={logo.backing ? "true" : undefined}
                style={{ "--logo": `url(/tech/${logo.file}.svg)`, "--size": px(18 * (logo.scale ?? 1)), "--backing": logo.backing } as CSSProperties}
              />
            </span>
          );
        })}
      </div>
      <div className="mt-2">
        <ProofLink href="#technology">See the stack</ProofLink>
      </div>
    </div>
  );
}

function AddOnProof({ page, name }: { page: ServicePage; name: string }) {
  const addOn = page.addOns?.items.find((a) => a.name === name);
  const { selected } = useServiceQuote(page);
  if (!addOn) return null;
  const added = selected.includes(addOn.name);
  return (
    <div>
      <p className="flex items-baseline justify-between gap-4">
        <span className="font-display text-[1.02rem] font-medium tracking-[-0.01em] text-text">{addOn.name}</span>
        <span className="font-mono text-[13px] text-primary">{addOn.price}</span>
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
        <button
          type="button"
          aria-pressed={added}
          onClick={() => quote.toggleAddOn(page.slug, page.packages.tiers[0].id, addOn.name)}
          className={`inline-flex min-h-[40px] items-center gap-2 rounded-full border px-4 text-[12px] font-semibold uppercase tracking-[0.08em] [transition:background-color_200ms_cubic-bezier(0.22,1,0.36,1),border-color_200ms_cubic-bezier(0.22,1,0.36,1),color_200ms_cubic-bezier(0.22,1,0.36,1),scale_140ms_cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary active:scale-[0.97] ${
            added ? "border-primary bg-primary text-white" : "border-primary/35 text-primary hover:border-primary"
          }`}
        >
          {added ? (
            <svg aria-hidden="true" viewBox="0 0 16 16" className="h-3 w-3" fill="none">
              <path d="M3.5 8.5l3 3 6-7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ) : (
            <svg aria-hidden="true" viewBox="0 0 16 16" className="h-3 w-3" fill="none">
              <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          )}
          {added ? "In your quote" : "Add to my quote"}
        </button>
        {added && <ProofLink href="#add-ons">View quote</ProofLink>}
      </div>
    </div>
  );
}

export default function WhyProof({ page, proof }: { page: ServicePage; proof: Proof }) {
  switch (proof.kind) {
    case "speed":
      return <SpeedProof />;
    case "pricing":
      return <PricingProof page={page} />;
    case "process":
      return <ProcessProof page={page} step={proof.step} />;
    case "stack":
      return <StackProof page={page} />;
    case "addOn":
      return <AddOnProof page={page} name={proof.name} />;
    case "drawing":
      return proof.drawing === "responsive" ? (
        <ResponsiveDrawing />
      ) : proof.drawing === "structure" ? (
        <StructureDrawing />
      ) : (
        <CustomDrawing />
      );
  }
}
