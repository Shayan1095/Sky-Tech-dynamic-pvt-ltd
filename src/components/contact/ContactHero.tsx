"use client";

import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useSettings } from "@/components/shared/SettingsProvider";
import {
  mailHref,
  telHref,
  websiteHref,
  websiteLabel,
  type SiteSettings,
} from "@/lib/site-content";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { READY_EVENT } from "@/components/shared/Preloader";

// Runs before paint on the client so the reveal never flashes its end state.
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/* The site's drafting frame, shared with the About hero. */
const FRAME = "mx-4 sm:mx-6 lg:mx-8 xl:mx-auto xl:max-w-6xl";
const INSET = "px-5 sm:px-8 lg:px-12";

/* Direct contact details. The values come from the admin panel, falling back
   to src/content/contact.md; only the icons are fixed here. */
const channelsFor = (settings: SiteSettings) => [
  {
    term: "Phone",
    label: settings.phone,
    href: telHref(settings.phone),
    copy: settings.phone,
    icon: <path d="M5.6 2.5l1.3 2.9-1.4 1.1a8 8 0 0 0 4 4l1.1-1.4 2.9 1.3-.5 2.6c-5.8.4-10.4-4.2-10-10z" />,
  },
  {
    term: "Email",
    label: settings.email,
    href: mailHref(settings.email),
    copy: settings.email,
    icon: (
      <>
        <rect x="2" y="3.5" width="12" height="9" rx="2" />
        <path d="M2.8 4.8L8 8.6l5.2-3.8" />
      </>
    ),
  },
  {
    term: "Website",
    label: websiteLabel(settings.website),
    href: websiteHref(settings.website),
    copy: null,
    icon: (
      <>
        <circle cx="8" cy="8" r="5.8" />
        <path d="M2.2 8h11.6M8 2.2c1.6 1.7 2.4 3.6 2.4 5.8S9.6 12.1 8 13.8M8 2.2C6.4 3.9 5.6 5.8 5.6 8s.8 4.1 2.4 5.8" />
      </>
    ),
  },
];

function Cross({ side }: { side: "left" | "right" }) {
  return (
    <span
      aria-hidden="true"
      className={`ch-cross absolute top-0 h-[11px] w-[11px] -translate-y-1/2 ${
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
      <div className="ch-rule border-t border-dotted border-text/[0.16]" />
      <div className={`relative ${FRAME}`}>
        <Cross side="left" />
        <Cross side="right" />
      </div>
    </div>
  );
}

/* A phrase that rises out of its own mask; React-rendered, so nothing
   rewrites DOM React owns. */
function Phrase({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <span className="inline-block overflow-hidden pb-[0.1em] pr-[0.06em] -mb-[0.1em] -mr-[0.06em] align-top">
      <span className={`ch-phrase inline-block whitespace-nowrap ${className}`}>{children}</span>
    </span>
  );
}

/* Copies a contact detail and confirms in place; the confirmation is
   announced politely for screen readers. */
function CopyButton({ value, term }: { value: string; term: string }) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");

  useEffect(() => {
    if (state === "idle") return;
    const t = window.setTimeout(() => setState("idle"), 2000);
    return () => window.clearTimeout(t);
  }, [state]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setState("copied");
    } catch {
      setState("failed");
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={`Copy ${term.toLowerCase()}`}
      className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-text/10 text-text/55 transition-colors duration-300 hover:border-primary hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
    >
      {state === "copied" ? (
        <svg viewBox="0 0 16 16" className="h-4 w-4 text-primary" fill="none" aria-hidden="true">
          <path d="M3.5 8.5l3 3 6-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : (
        <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" aria-hidden="true">
          <rect x="5.5" y="5.5" width="8" height="8" rx="1.8" stroke="currentColor" strokeWidth="1.3" />
          <path d="M10.5 3.8V3.5a1.5 1.5 0 0 0-1.5-1.5H4a1.5 1.5 0 0 0-1.5 1.5V9A1.5 1.5 0 0 0 4 10.5h.3" stroke="currentColor" strokeWidth="1.3" />
        </svg>
      )}
      <span role="status" aria-live="polite" className="sr-only">
        {state === "copied" ? `${term} copied` : state === "failed" ? `Couldn't copy ${term.toLowerCase()}` : ""}
      </span>
    </button>
  );
}

export default function ContactHero() {
  const settings = useSettings();
  const CHANNELS = channelsFor(settings);
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const root = sectionRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let fallback: number | undefined;
    let removeListener: (() => void) | undefined;
    const mm = gsap.matchMedia();

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ paused: true });
      tl.fromTo(".ch-frame", { scaleY: 0, transformOrigin: "top center" }, { scaleY: 1, duration: 1.1, ease: "power3.inOut" }, 0)
        .fromTo(".ch-rule", { scaleX: 0, transformOrigin: "left center" }, { scaleX: 1, duration: 1, stagger: 0.12, ease: "power3.inOut" }, 0.05)
        .fromTo(".ch-eyebrow > *, .ch-crumbs", { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.06, ease: "power3.out" }, 0.2)
        .fromTo(".ch-cross", { scale: 0, rotation: -90 }, { scale: 1, rotation: 0, duration: 0.6, stagger: 0.05, ease: "power3.out" }, 0.45)
        .fromTo(".ch-phrase", { yPercent: 110 }, { yPercent: 0, duration: 1.05, stagger: 0.1, ease: "power4.out" }, 0.5)
        .fromTo(".ch-intro", { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" }, 0.95)
        .fromTo(".ch-card", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1.4, ease: "power3.out" }, 0.8)
        .fromTo(".ch-row", { opacity: 0, x: 14 }, { opacity: 1, x: 0, duration: 0.7, stagger: 0.1, ease: "power3.out" }, 1.15)
        .fromTo(".ch-card-rule", { scaleX: 0, transformOrigin: "left center" }, { scaleX: 1, duration: 0.9, stagger: 0.1, ease: "power3.inOut" }, 1.1)
        .fromTo(".ch-cue, .ch-card-cta", { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.7, stagger: 0.1, ease: "power3.out" }, 1.45);

      /* Scroll depth, as on the About hero: the card climbs faster than the
         headline while the frame stays put. */
      const depth = (target: string, y: number) =>
        gsap.to(target, {
          y,
          ease: "none",
          scrollTrigger: { trigger: root, start: 0, end: "bottom top", scrub: 0.6 },
        });
      depth(".ch-card-depth", -40);
      depth(".ch-head-depth", -15);

      const start = () => tl.play();
      if ((window as unknown as { __skyReady?: boolean }).__skyReady) {
        start();
      } else {
        window.addEventListener(READY_EVENT, start, { once: true });
        fallback = window.setTimeout(start, 4000);
        removeListener = () => window.removeEventListener(READY_EVENT, start);
      }

      /* Desktop with a mouse: a drafting dot-grid resolves under the cursor,
         like reading the page's construction lines up close. One CSS mask
         position per frame — no layout, no repaint of the content. */
      mm.add("(min-width: 1024px) and (hover: hover) and (pointer: fine)", () => {
        const grid = gridRef.current;
        if (!grid) return;
        let frame = 0;
        let x = 0;
        let y = 0;
        const apply = () => {
          frame = 0;
          grid.style.setProperty("--mx", `${x}px`);
          grid.style.setProperty("--my", `${y}px`);
        };
        const onMove = (e: PointerEvent) => {
          const r = root.getBoundingClientRect();
          x = e.clientX - r.left;
          y = e.clientY - r.top;
          grid.style.opacity = "1";
          if (!frame) frame = requestAnimationFrame(apply);
        };
        const onLeave = () => {
          grid.style.opacity = "0";
        };
        root.addEventListener("pointermove", onMove);
        root.addEventListener("pointerleave", onLeave);
        return () => {
          cancelAnimationFrame(frame);
          root.removeEventListener("pointermove", onMove);
          root.removeEventListener("pointerleave", onLeave);
        };
      });
    }, root);

    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh);

    return () => {
      removeListener?.();
      if (fallback) window.clearTimeout(fallback);
      mm.revert();
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="contact-heading"
      className="relative isolate overflow-x-clip border-b border-accent bg-surface"
    >
      {/* Cursor-revealed dot grid (desktop, mouse only) */}
      <div
        ref={gridRef}
        aria-hidden="true"
        style={{ opacity: 0 }}
        className="pointer-events-none absolute inset-0 -z-10 transition-opacity duration-500 [background-image:radial-gradient(rgb(0_107_184/0.35)_1px,transparent_1.2px)] [background-size:22px_22px] [mask-image:radial-gradient(260px_circle_at_var(--mx,50%)_var(--my,50%),#000_0%,transparent_75%)]"
      />

      {/* Vertical frame rules */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className={`ch-frame h-full border-x border-dotted border-text/[0.16] ${FRAME}`} />
      </div>

      <div className={`relative ${FRAME}`}>
        {/* Label and breadcrumb each stay on one line; on narrow phones the
            breadcrumb drops below rather than breaking the label. */}
        <div className={`flex flex-wrap items-center justify-between gap-x-6 gap-y-3 pb-6 pt-12 sm:pt-16 ${INSET}`}>
          <p className="ch-eyebrow flex items-center gap-3 whitespace-nowrap">
            <span aria-hidden="true" className="block h-px w-8 bg-primary" />
            <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-primary sm:text-xs">
              Contact SKY Tech
            </span>
          </p>

          <nav aria-label="Breadcrumb" className="ch-crumbs">
            <ol className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em]">
              <li>
                <Link href="/" className="text-text/65 transition-colors duration-300 hover:text-primary">
                  Home
                </Link>
              </li>
              <li aria-hidden="true" className="text-text/35">/</li>
              <li aria-current="page" className="text-text">Contact</li>
            </ol>
          </nav>
        </div>
      </div>

      <Rule />

      <div className={`relative ${FRAME}`}>
        <div
          /* minmax(0,1fr) on phones: without it the single column grows to the
             card button's unbreakable width and spills past the frame. */
          className={`grid grid-cols-[minmax(0,1fr)] items-center gap-12 py-14 sm:py-20 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-14 lg:py-24 ${INSET}`}
        >
          {/* Headline and intro */}
          <div className="ch-head-depth">
            <h1
              id="contact-heading"
              className="text-[2.6rem] font-semibold leading-[1] tracking-[-0.04em] sm:text-[4rem] lg:text-[4.6rem] xl:text-[5.2rem]"
            >
              <span className="block text-text/[0.88]">
                <Phrase>Let&apos;s Talk</Phrase>
              </span>
              <span className="block">
                <Phrase className="text-text/[0.58]">About Your</Phrase>
              </span>
              <span className="block">
                <Phrase className="text-primary">Project</Phrase>
              </span>
            </h1>

            <p className="ch-intro mt-8 max-w-xl text-lg leading-relaxed text-text [text-wrap:pretty] sm:text-xl">
              Tell us what you&apos;re trying to build or grow — we&apos;ll help you
              figure out the right approach, timeline, and budget. No obligation,
              no hard sell, just a straightforward conversation about your goals.
            </p>
          </div>

          {/* Direct contact card */}
          <div className="ch-card-depth">
            <div className="ch-card relative overflow-hidden rounded-[26px] border border-text/[0.08] bg-white shadow-[0_2px_4px_rgb(18_18_18/0.04),0_40px_80px_-44px_rgb(11_31_53/0.45)]">
              {/* Header band */}
              <div className="flex items-center justify-between gap-4 border-b border-text/[0.07] bg-[#f8fafc] px-6 py-4 sm:px-7">
                <p className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em] text-text/70">
                  <span aria-hidden="true" className="block h-2 w-2 bg-cta" />
                  Direct Contact
                </p>
                <span aria-hidden="true" className="flex gap-1.5">
                  {[0, 1, 2].map((i) => (
                    <span key={i} className="block h-1.5 w-1.5 rounded-full bg-text/15" />
                  ))}
                </span>
              </div>

              <ul className="px-6 sm:px-7">
                {CHANNELS.map((c) => (
                  <li key={c.term} className="ch-row relative flex items-center gap-3 py-5 sm:gap-4">
                    <span aria-hidden="true" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-primary/15 bg-primary/[0.06] text-primary sm:h-11 sm:w-11 sm:rounded-2xl">
                      <svg viewBox="0 0 16 16" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
                        {c.icon}
                      </svg>
                    </span>

                    <div className="min-w-0 flex-1">
                      <p className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-text/50">{c.term}</p>
                      <a
                        href={c.href}
                        {...(c.term === "Website" ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                        // Contact details are never truncated: they wrap if a
                        // screen is too narrow to fit them on one line.
                        className="group relative mt-1 inline-block max-w-full break-words py-1.5 font-display text-[1rem] font-medium tracking-[-0.01em] text-text transition-colors duration-300 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary sm:text-[1.2rem]"
                      >
                        {c.label}
                        <span aria-hidden="true" className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-primary transition-transform duration-500 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100 group-focus-visible:scale-x-100" />
                      </a>
                    </div>

                    {c.copy ? (
                      <CopyButton value={c.copy} term={c.term} />
                    ) : (
                      <span aria-hidden="true" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-text/10 text-text/40">
                        <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none">
                          <path d="M5 11l6-6M6.5 5H11v4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                    )}

                    <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px bg-text/[0.07]">
                      <span className="ch-card-rule absolute inset-0 bg-text/[0.12]" />
                    </span>
                  </li>
                ))}
              </ul>

              {/* Card action */}
              <div className="ch-card-cta p-6 sm:p-7">
                <a
                  href="#contact-form"
                  className="group relative isolate flex min-h-[56px] items-center justify-between gap-4 overflow-hidden rounded-full bg-primary py-2 pl-6 pr-2 text-[13px] font-semibold uppercase tracking-[0.1em] text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
                >
                  <span aria-hidden="true" className="absolute inset-0 -z-10 origin-left scale-x-0 bg-navy transition-transform duration-500 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100 group-focus-visible:scale-x-100" />
                  Book My Free Consultation
                  <span aria-hidden="true" className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15">
                    <svg viewBox="0 0 16 16" className="h-[13px] w-[13px] rotate-90 transition-transform duration-500 group-hover:translate-y-0.5" fill="none">
                      <path d="M3 8h9.5M8.5 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Rule />

      <div className={`relative ${FRAME}`}>
        <div className={`ch-cue pb-12 pt-6 sm:pb-16 ${INSET}`}>
          <a
            href="#contact-form"
            className="group inline-flex items-center gap-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.22em] text-text/70 transition-colors duration-300 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
          >
            Contact Form
            <span aria-hidden="true" className="flex flex-col items-center gap-[1px] text-primary">
              {[0, 1, 2].map((i) => (
                <svg
                  key={i}
                  width="12"
                  height="7"
                  viewBox="0 0 12 7"
                  fill="none"
                  style={{ animation: "aboutCue 2.4s ease-in-out infinite", animationDelay: `${i * 0.18}s` }}
                >
                  <path d="M1 1l5 5 5-5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ))}
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
