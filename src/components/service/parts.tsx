import { Fragment, type ReactNode } from "react";

/* Shared furniture for the service-page template. Nothing here is interactive
   or stateful, so it renders on the server and inside client sections alike.

   The drafting frame, registration marks and ruled dividers are the site's
   own vocabulary (Services, About and Contact heroes); the service pages use
   them unchanged so a visitor moving between pages never feels the seam. */

export const FRAME = "mx-4 sm:mx-6 lg:mx-8 xl:mx-auto xl:max-w-6xl";
export const INSET = "px-5 sm:px-8 lg:px-12";

/* ------------------------------------------------------------------------- */
/* Links                                                                      */
/* ------------------------------------------------------------------------- */

const q = encodeURIComponent;

/* Every action on a service page ends at the contact form, arriving with as
   much of the visitor's choice already filled in as the form understands. */
export const quoteHref = (service: string) => `/contact?service=${q(service)}#contact-form`;

export const packageHref = (service: string, tier: string) =>
  `/contact?service=${q(service)}&budget=${q(tier)}#contact-form`;

export const consultationHref = (service: string) =>
  `/contact?type=consultation&service=${q(service)}#contact-form`;

/* A built quote: the package plus any ticked add-ons, which the contact form
   checks against the service's real add-on list before showing them. */
export const quoteRequestHref = (service: string, tier: string, addOns: readonly string[]) =>
  addOns.length
    ? `/contact?service=${q(service)}&budget=${q(tier)}&addons=${q(addOns.join("|"))}#contact-form`
    : packageHref(service, tier);

/* A computed length for an inline style, rounded. Browsers keep style values
   to about six significant digits, so an unrounded float ("45.432568897…%")
   no longer matches what the browser holds when React hydrates the page —
   a hydration mismatch React will not repair. Two decimals is finer than a
   pixel at any width this site renders. */
export const pct = (n: number) => `${n.toFixed(2)}%`;
export const px = (n: number) => `${n.toFixed(2)}px`;

/* ------------------------------------------------------------------------- */
/* Marks                                                                      */
/* ------------------------------------------------------------------------- */

export function Arrow({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={`h-[13px] w-[13px] ${className}`} fill="none" aria-hidden="true">
      <path d="M3 8h9.5M8.5 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* A registration mark: two hairlines crossing. Drawn rather than typed, so it
   sits exactly on the rule it marks instead of on a text baseline. */
export function Cross({
  className = "",
  tone = "ink",
}: {
  className?: string;
  tone?: "ink" | "light";
}) {
  const line = tone === "light" ? "bg-white/35" : "bg-text/40";
  return (
    <span aria-hidden="true" className={`absolute h-[11px] w-[11px] ${className}`}>
      <span className={`absolute left-1/2 top-0 h-full w-px -translate-x-1/2 ${line}`} />
      <span className={`absolute left-0 top-1/2 h-px w-full -translate-y-1/2 ${line}`} />
    </span>
  );
}

/* A full-bleed dotted rule, marked where it crosses the frame. */
export function Rule({ tone = "ink", className = "" }: { tone?: "ink" | "light"; className?: string }) {
  return (
    <div aria-hidden="true" className="relative">
      <div className={`border-t border-dotted ${tone === "light" ? "border-white/20" : "border-text/[0.16]"} ${className}`} />
      <div className={`relative ${FRAME}`}>
        <Cross tone={tone} className="left-0 top-0 -translate-x-1/2 -translate-y-1/2" />
        <Cross tone={tone} className="right-0 top-0 -translate-y-1/2 translate-x-1/2" />
      </div>
    </div>
  );
}

/* The frame's two vertical rules, behind a section's content. */
export function FrameRules({ tone = "ink", className = "" }: { tone?: "ink" | "light"; className?: string }) {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      <div
        className={`h-full border-x border-dotted ${tone === "light" ? "border-white/20" : "border-text/[0.16]"} ${FRAME} ${className}`}
      />
    </div>
  );
}

/* A section's label: a short primary rule and the section's role, with an
   optional count on the right when the number tells the reader something
   (five packages, seven steps). The .sv-line / .sv-label hooks are what the
   shared entrance timeline animates. */
export function SectionLabel({
  children,
  count,
  tone = "ink",
}: {
  children: ReactNode;
  count?: string;
  tone?: "ink" | "light";
}) {
  return (
    <div className="flex items-center justify-between gap-6">
      <p className="flex items-center gap-3">
        <span aria-hidden="true" className={`sv-line block h-px w-8 ${tone === "light" ? "bg-cta" : "bg-primary"}`} />
        <span
          className={`sv-label font-mono text-[11px] uppercase tracking-[0.22em] sm:text-xs ${
            tone === "light" ? "text-cta" : "text-primary"
          }`}
        >
          {children}
        </span>
      </p>
      {count && (
        <span
          className={`sv-label shrink-0 font-mono text-[11px] uppercase tracking-[0.18em] ${
            tone === "light" ? "text-white/55" : "text-text/45"
          }`}
        >
          {count}
        </span>
      )}
    </div>
  );
}

/* Section heading at the site's H2 scale. */
export const H2 =
  "sv-heading text-[2.2rem] font-semibold leading-[1.04] tracking-[-0.028em] [text-wrap:balance] sm:text-[3rem] lg:text-[3.4rem]";

/* Display headings wrap at a hyphen like at a space, which splits words like
   "E-commerce" and "Add-ons" across lines at large sizes. Hyphenated words
   are kept whole with a no-wrap span — the text itself is untouched, so what
   search engines and screen readers get is exactly the content's wording. */
export function Words({ text, nowrap = "whitespace-nowrap" }: { text: string; nowrap?: string }) {
  const parts = text.split(/(\S*\w-\w\S*)/);
  return (
    <>
      {parts.map((part, i) =>
        /\w-\w/.test(part) ? (
          <span key={i} className={nowrap}>
            {part}
          </span>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        )
      )}
    </>
  );
}

/* ------------------------------------------------------------------------- */
/* Rich text                                                                  */
/* ------------------------------------------------------------------------- */

/* Renders the three inline markers the page data uses (see
   src/lib/service-pages/types.ts). Content is split into text and elements —
   never injected as HTML — so nothing in the data can become markup. */
const TOKEN = /(\*\*[^*]+\*\*|==[^=]+==|~~[^~]+~~)/g;

export function Rich({
  text,
  markClass = "text-primary",
}: {
  text: string;
  markClass?: string;
}) {
  const parts = text.split(TOKEN);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return <strong key={i} className="font-semibold">{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith("==") && part.endsWith("==")) {
          return <span key={i} className={markClass}>{part.slice(2, -2)}</span>;
        }
        if (part.startsWith("~~") && part.endsWith("~~")) {
          /* Not <s>: the words are not wrong, they are what is at stake.
             The strike is drawn by CSS on .sv-strike and read by nobody. */
          return (
            <span key={i} className="sv-strike">
              {part.slice(2, -2)}
            </span>
          );
        }
        return <Fragment key={i}>{part}</Fragment>;
      })}
    </>
  );
}
