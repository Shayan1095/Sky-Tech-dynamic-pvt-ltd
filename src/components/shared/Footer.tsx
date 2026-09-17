"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useRef } from "react";
import { useLenis } from "lenis/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

// Runs before paint on the client so the reveal never flashes its end state.
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

const CLOSED = "inset(0 100% 0 0)";
const OPEN = "inset(0 0% 0 0)";

/* The site's drafting frame, so every page ends in the same editorial
   system the About page is built on. */
const FRAME = "mx-4 sm:mx-6 lg:mx-8 xl:mx-auto xl:max-w-6xl";
const INSET = "px-5 sm:px-8 lg:px-12";

const PHONE = { label: "+92 333 567 3810", href: "tel:+923335673810" };
const EMAIL = { label: "info@skytech.com.pk", href: "mailto:info@skytech.com.pk" };
const WEBSITE = { label: "skytech.com.pk", href: "https://skytech.com.pk" };

const PAGES = [
  { href: "/", label: "Home" },
  { href: "/services/", label: "Services" },
  { href: "/about/", label: "About" },
  { href: "/contact/", label: "Contact" },
];

// Individual service pages aren't built yet, so these point at /services/.
const SERVICES = [
  "Web Development",
  "WordPress Development",
  "Digital Marketing",
  "Social Media Management",
  "Video Production",
  "Business Automation",
];

// Real profile URLs to be supplied; kept as placeholders until then.
const SOCIALS = [
  {
    label: "Facebook",
    href: "#",
    path: "M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.4h-1.2c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.4v7A10 10 0 0 0 22 12z",
  },
  {
    label: "Instagram",
    href: "#",
    path: "M12 2.2c2.67 0 2.99.01 4.04.06 1.06.05 1.79.22 2.43.47.66.26 1.21.6 1.76 1.15.5.5.9 1.1 1.15 1.76.25.64.42 1.37.47 2.43.05 1.06.06 1.42.06 4.13s-.01 3.06-.06 4.12c-.05 1.06-.22 1.79-.47 2.43a4.9 4.9 0 0 1-1.15 1.76 4.9 4.9 0 0 1-1.76 1.15c-.64.25-1.37.42-2.43.47-1.06.05-1.42.06-4.12.06s-3.06-.01-4.13-.06c-1.06-.05-1.79-.22-2.43-.47a4.9 4.9 0 0 1-1.76-1.15 4.9 4.9 0 0 1-1.15-1.76c-.25-.64-.42-1.37-.47-2.43C2.21 15.06 2.2 14.7 2.2 12s.01-3.06.06-4.12c.05-1.06.22-1.79.47-2.43.26-.66.6-1.21 1.15-1.76A4.9 4.9 0 0 1 5.64.54c.64-.25 1.37-.42 2.43-.47C9.14.02 9.5.01 12 .01Zm0 1.8c-2.67 0-2.99.01-4.04.06-.87.04-1.34.18-1.65.3-.42.16-.71.35-1.02.66-.31.31-.5.6-.66 1.02-.12.31-.26.78-.3 1.65-.05 1.03-.06 1.35-.06 3.9s.01 2.87.06 3.9c.04.87.18 1.34.3 1.65.16.42.35.71.66 1.02.31.31.6.5 1.02.66.31.12.78.26 1.65.3 1.05.05 1.37.06 4.04.06s2.99-.01 4.04-.06c.87-.04 1.34-.18 1.65-.3.42-.16.71-.35 1.02-.66.31-.31.5-.6.66-1.02.12-.31.26-.78.3-1.65.05-1.03.06-1.35.06-3.9s-.01-2.87-.06-3.9c-.04-.87-.18-1.34-.3-1.65a2.7 2.7 0 0 0-.66-1.02 2.7 2.7 0 0 0-1.02-.66c-.31-.12-.78-.26-1.65-.3C14.87 4.01 14.55 4 12 4Zm0 3.05a5.35 5.35 0 1 1 0 10.7 5.35 5.35 0 0 1 0-10.7Zm0 1.8a3.55 3.55 0 1 0 0 7.1 3.55 3.55 0 0 0 0-7.1Zm5.56-1.98a1.25 1.25 0 1 1-2.5 0 1.25 1.25 0 0 1 2.5 0Z",
  },
  {
    label: "LinkedIn",
    href: "#",
    path: "M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45Z",
  },
];

function Cross({ side }: { side: "left" | "right" }) {
  return (
    <span
      aria-hidden="true"
      className={`ft-cross absolute top-0 h-[11px] w-[11px] -translate-y-1/2 ${
        side === "left" ? "left-0 -translate-x-1/2" : "right-0 translate-x-1/2"
      }`}
    >
      <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-white/40" />
      <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-white/40" />
    </span>
  );
}

function Rule() {
  return (
    <div aria-hidden="true" className="relative">
      <div className="ft-rule border-t border-dotted border-white/[0.14]" />
      <div className={`relative ${FRAME}`}>
        <Cross side="left" />
        <Cross side="right" />
      </div>
    </div>
  );
}

/* Text link with an underline that sweeps in from the left on hover or
   keyboard focus. */
function SweepLink({
  href,
  children,
  external = false,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  external?: boolean;
  className?: string;
}) {
  const inner = (
    <>
      {children}
      <span
        aria-hidden="true"
        className="absolute inset-x-0 -bottom-[3px] h-px origin-left scale-x-0 bg-cta transition-transform duration-500 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100 group-focus-visible:scale-x-100"
      />
    </>
  );
  const cls = `group relative inline-block py-1.5 text-white/75 transition-colors duration-300 hover:text-white focus-visible:text-white focus-visible:outline-none ${className}`;

  if (external || href.startsWith("tel:") || href.startsWith("mailto:")) {
    return (
      <a
        href={href}
        className={cls}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {inner}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {inner}
    </Link>
  );
}

const heading =
  "font-mono text-[11px] uppercase tracking-[0.2em] text-white/60";

export default function Footer() {
  const year = new Date().getFullYear();
  const rootRef = useRef<HTMLElement>(null);
  const pathname = usePathname();
  const lenis = useLenis();

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      // Paused timeline on its own one-shot trigger, so a later refresh can
      // never rewind it.
      const tl = gsap.timeline({ paused: true });
      tl.fromTo(
        ".ft-rule",
        { scaleX: 0, transformOrigin: "left center" },
        { scaleX: 1, duration: 1, stagger: 0.15, ease: "power3.inOut" },
        0
      )
        .fromTo(
          ".ft-cross",
          { scale: 0, rotation: -90 },
          { scale: 1, rotation: 0, duration: 0.5, stagger: 0.05, ease: "power3.out" },
          0.3
        )
        .fromTo(
          ".ft-eyebrow",
          { opacity: 0, y: 8 },
          { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
          0.1
        )
        .fromTo(
          ".ft-email",
          { clipPath: CLOSED },
          { clipPath: OPEN, duration: 1, ease: "power3.inOut" },
          0.2
        )
        .fromTo(
          ".ft-direct > *",
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.7, stagger: 0.08, ease: "power3.out" },
          0.5
        )
        .fromTo(
          ".ft-col",
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.8, stagger: 0.09, ease: "power3.out" },
          0.6
        )
        .fromTo(
          ".ft-bottom > *",
          { opacity: 0 },
          { opacity: 1, duration: 0.7, stagger: 0.08 },
          1
        );

      ScrollTrigger.create({
        trigger: root,
        start: "top 90%",
        once: true,
        onEnter: () => tl.play(),
      });
    }, root);

    return () => ctx.revert();
  }, []);

  // The footer persists across client navigations while the page above it
  // changes height, so re-measure its trigger once the new page has laid out.
  useEffect(() => {
    const id = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(id);
  }, [pathname]);

  const backToTop = () => {
    if (lenis) lenis.scrollTo(0, { duration: 1.4 });
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer
      ref={rootRef}
      className="relative mt-auto overflow-hidden bg-navy text-white"
    >
      {/* Frame rules */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className={`h-full border-x border-dotted border-white/[0.12] ${FRAME}`} />
      </div>

      {/* ------------------------------------------------ Direct contact */}
      <div className={`relative ${FRAME}`}>
        <div
          className={`grid gap-10 pb-14 pt-20 sm:pt-24 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:gap-16 ${INSET}`}
        >
          <div className="min-w-0">
            <p className={`ft-eyebrow flex items-center gap-3 ${heading}`}>
              <span aria-hidden="true" className="block h-px w-8 bg-cta" />
              Get in Touch
            </p>
            <a
              href={EMAIL.href}
              className="ft-email group relative mt-6 inline-block max-w-full break-words font-display text-[1.75rem] font-semibold leading-[1.1] tracking-[-0.03em] text-white focus-visible:outline-none sm:text-[3rem] lg:text-[3.6rem] xl:text-[4.1rem]"
            >
              {EMAIL.label}
              <span
                aria-hidden="true"
                className="absolute inset-x-0 -bottom-1 h-[2px] origin-left scale-x-0 bg-cta transition-transform duration-700 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100 group-focus-visible:scale-x-100"
              />
            </a>
          </div>

          <dl className="ft-direct grid gap-5 sm:grid-cols-2 lg:grid-cols-1 lg:pb-2">
            <div>
              <dt className={heading}>Phone</dt>
              <dd className="mt-2 text-[1.05rem]">
                <SweepLink href={PHONE.href}>{PHONE.label}</SweepLink>
              </dd>
            </div>
            <div>
              <dt className={heading}>Website</dt>
              <dd className="mt-2 text-[1.05rem]">
                <SweepLink href={WEBSITE.href} external>
                  {WEBSITE.label}
                </SweepLink>
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <Rule />

      {/* ------------------------------------------------------- Columns */}
      <div className={`relative ${FRAME}`}>
        <div
          className={`grid gap-12 py-14 sm:grid-cols-2 sm:py-16 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,0.8fr)_minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-10 ${INSET}`}
        >
          <div className="ft-col">
            <p className="font-display text-[1.6rem] font-semibold tracking-[-0.02em]">
              SKY Tech
            </p>
            <p className="mt-3 max-w-xs text-[0.95rem] leading-relaxed text-white/70">
              Digital Product, Technology &amp; Growth Partner. Helping
              businesses build, automate, and grow through technology.
            </p>
            <Link
              href="/contact/"
              className="group mt-7 inline-flex min-h-[46px] items-center gap-3 rounded-full border border-white/25 py-2 pl-5 pr-2 text-[0.8rem] font-semibold uppercase tracking-[0.08em] text-white transition-[background-color,border-color,color] duration-500 ease-out hover:border-white hover:bg-white hover:text-navy focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              Book a Free Consultation
              <span
                aria-hidden="true"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-cta text-navy transition-transform duration-500 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0.5"
              >
                <svg viewBox="0 0 16 16" className="h-[13px] w-[13px]" fill="none">
                  <path d="M3 8h9.5M8.5 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </Link>
          </div>

          <nav aria-label="Footer pages" className="ft-col">
            <p className={heading}>Pages</p>
            <ul className="mt-5 space-y-3 text-[0.95rem]">
              {PAGES.map((p) => (
                <li key={p.href}>
                  <SweepLink href={p.href}>{p.label}</SweepLink>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Footer services" className="ft-col">
            <p className={heading}>Services</p>
            <ul className="mt-5 space-y-3 text-[0.95rem]">
              {SERVICES.map((s) => (
                <li key={s}>
                  <SweepLink href="/services/">{s}</SweepLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="ft-col">
            <p className={heading}>Get in Touch</p>
            <ul className="mt-5 space-y-3 text-[0.95rem]">
              <li>
                <SweepLink href={PHONE.href}>{PHONE.label}</SweepLink>
              </li>
              <li>
                <SweepLink href={EMAIL.href}>{EMAIL.label}</SweepLink>
              </li>
              <li>
                <SweepLink href={WEBSITE.href} external>
                  {WEBSITE.label}
                </SweepLink>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <Rule />

      {/* ---------------------------------------------------- Bottom bar */}
      <div className={`relative ${FRAME}`}>
        <div
          className={`ft-bottom flex flex-col gap-6 py-8 sm:flex-row sm:items-center sm:justify-between ${INSET}`}
        >
          <p className="text-[0.8rem] text-white/60">
            © {year} SKY Tech Dynamic Private Limited. All rights reserved.
          </p>

          <div className="flex items-center gap-6">
            <ul className="flex items-center gap-2">
              {SOCIALS.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    aria-label={s.label}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/70 transition-[color,border-color,background-color] duration-300 hover:border-cta hover:bg-cta hover:text-navy focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cta"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d={s.path} />
                    </svg>
                  </a>
                </li>
              ))}
            </ul>

            <button
              type="button"
              onClick={backToTop}
              className="group inline-flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-white/70 transition-colors duration-300 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cta"
            >
              Back to top
              <span
                aria-hidden="true"
                className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-white/15 transition-colors duration-300 group-hover:border-cta"
              >
                <svg viewBox="0 0 16 16" className="h-[13px] w-[13px] transition-transform duration-500 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-0.5" fill="none">
                  <path d="M8 13V3.5M4 7.5l4-4 4 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
