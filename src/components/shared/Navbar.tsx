"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useLenis } from "lenis/react";
import { gsap } from "@/lib/gsap";
import { cn } from "@/lib/utils";

// Runs before paint on the client so the menu never flashes its end state.
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/services/", label: "Services" },
  { href: "/about/", label: "About" },
  { href: "/contact/", label: "Contact" },
];

const PHONE = { label: "+92 333 567 3810", href: "tel:+923335673810" };
const EMAIL = { label: "info@skytech.com.pk", href: "mailto:info@skytech.com.pk" };
const CTA = "Start a Project";

const Arrow = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 16 16" className={`h-[13px] w-[13px] ${className}`} fill="none" aria-hidden="true">
    <path d="M3 8h9.5M8.5 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/* Registration mark where a cell divider meets the bar's bottom rule. */
function Cross({ className }: { className: string }) {
  return (
    <span aria-hidden="true" className={`pointer-events-none absolute h-[9px] w-[9px] ${className}`}>
      <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-text/35" />
      <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-text/35" />
    </span>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const lenis = useLenis();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  // Next serves routes without a trailing slash, so compare normalised paths.
  const norm = (p: string) => (p.length > 1 ? p.replace(/\/$/, "") : p);
  const isActive = (href: string) => {
    const h = norm(href);
    const p = norm(pathname);
    return h === "/" ? p === "/" : p === h || p.startsWith(`${h}/`);
  };

  /* The bar gains a soft shadow once the contact strip has scrolled away. */
  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setScrolled(window.scrollY > 36));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // Close the menu whenever the route changes (adjusted during render, as
  // React recommends, rather than in an effect).
  const [menuPath, setMenuPath] = useState(pathname);
  if (pathname !== menuPath) {
    setMenuPath(pathname);
    setOpen(false);
  }

  /* The menu's animation is built once: the navy panel wipes down and the
     links rise in order. Opening plays it forward; closing plays the same
     timeline back (a little faster), so a quick open-then-close is smooth
     and interruptible rather than jumping. */
  const menuTl = useRef<gsap.core.Timeline | null>(null);

  useIsomorphicLayoutEffect(() => {
    const menu = menuRef.current;
    if (!menu) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        paused: true,
        onStart: () => {
          menu.style.visibility = "visible";
        },
        onReverseComplete: () => {
          menu.style.visibility = "hidden";
        },
      });

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        tl.fromTo(menu, { clipPath: "inset(0 0 100% 0)" }, { clipPath: "inset(0 0 0% 0)", duration: 0.01 });
      } else {
        tl.fromTo(menu, { clipPath: "inset(0 0 100% 0)" }, { clipPath: "inset(0 0 0% 0)", duration: 0.7, ease: "power3.inOut" }, 0)
          .fromTo(".menu-link", { yPercent: 110 }, { yPercent: 0, duration: 0.9, stagger: 0.07, ease: "power4.out" }, 0.35)
          .fromTo(".menu-rule", { scaleX: 0, transformOrigin: "left center" }, { scaleX: 1, duration: 0.8, stagger: 0.07, ease: "power3.inOut" }, 0.3)
          .fromTo(".menu-foot > *", { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.08, ease: "power3.out" }, 0.7);
      }
      menuTl.current = tl;
    }, menu);

    return () => {
      menuTl.current = null;
      ctx.revert();
    };
  }, []);

  /* Open/close. While open the page can't scroll, Escape closes, and Tab
     stays inside the menu; on close, focus returns to the toggle. */
  useEffect(() => {
    const menu = menuRef.current;
    const tl = menuTl.current;
    if (!menu || !tl) return;

    if (open) {
      lenis?.stop();
      document.documentElement.style.overflow = "hidden";
      menu.style.visibility = "visible";
      tl.timeScale(1).play();
      menu.querySelector<HTMLElement>("a, button")?.focus({ preventScroll: true });

      const onKey = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          setOpen(false);
          return;
        }
        if (e.key !== "Tab") return;
        const items = Array.from(menu.querySelectorAll<HTMLElement>("a, button"));
        const firstItem = items[0];
        const lastItem = items[items.length - 1];
        if (e.shiftKey && document.activeElement === firstItem) {
          e.preventDefault();
          lastItem.focus();
        } else if (!e.shiftKey && document.activeElement === lastItem) {
          e.preventDefault();
          firstItem.focus();
        }
      };
      document.addEventListener("keydown", onKey);
      return () => document.removeEventListener("keydown", onKey);
    }

    lenis?.start();
    document.documentElement.style.overflow = "";
    if (tl.progress() > 0) {
      tl.timeScale(1.6).reverse();
      toggleRef.current?.focus({ preventScroll: true });
    }
  }, [open, lenis]);

  return (
    <>
      {/* -------------------------------------------- Contact strip (md+) */}
      <div className="hidden bg-navy text-white md:block">
        <div className="flex h-9 items-center justify-between px-6 font-mono text-[11px] tracking-[0.12em] lg:px-8">
          <div className="flex items-center gap-7">
            <a href={PHONE.href} className="text-white/75 transition-colors duration-300 hover:text-cta">
              {PHONE.label}
            </a>
            <span aria-hidden="true" className="h-3 w-px bg-white/20" />
            <a href={EMAIL.href} className="text-white/75 transition-colors duration-300 hover:text-cta">
              {EMAIL.label}
            </a>
          </div>
          <p className="uppercase tracking-[0.2em] text-white/60">Pakistan · USA · UK</p>
        </div>
      </div>

      {/* ----------------------------------------------------- Main bar */}
      <header
        className={cn(
          "sticky top-0 z-50 border-b border-text/10 bg-bg transition-shadow duration-500",
          scrolled && "shadow-[0_10px_30px_-22px_rgb(11_31_53/0.45)]"
        )}
      >
        <nav aria-label="Main" className="relative flex h-20 items-stretch">
          {/* Logo cell */}
          <Link
            href="/"
            className="relative flex shrink-0 flex-col justify-center border-r border-text/10 px-5 leading-tight sm:px-6 lg:px-8"
          >
            <span className="font-display text-lg font-semibold tracking-[-0.01em] text-primary sm:text-xl">
              SKY Tech Dynamic
            </span>
            <span className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.2em] text-text/50">
              Pvt. Ltd.
            </span>
            <Cross className="-bottom-[5px] -right-[5px]" />
          </Link>

          {/* Links cell (desktop) */}
          <ul className="hidden flex-1 items-stretch lg:flex">
            {NAV_LINKS.map((link, i) => {
              const active = isActive(link.href);
              return (
                <li key={link.href} className="flex">
                  <Link
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className="group relative flex items-center gap-2.5 px-6 xl:px-8"
                  >
                    <span
                      className={cn(
                        "font-mono text-[10px] tracking-[0.12em] transition-colors duration-300",
                        active ? "text-primary" : "text-text/45 group-hover:text-primary"
                      )}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="font-display text-[15px] font-medium tracking-[-0.005em] text-text">
                      {link.label}
                    </span>
                    <span
                      aria-hidden="true"
                      className={cn(
                        "absolute inset-x-6 bottom-0 h-[2px] origin-left bg-primary transition-transform duration-500 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] xl:inset-x-8",
                        active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                      )}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* CTA block (desktop), flush to the right edge */}
          <Link
            href="/contact/"
            className="group relative isolate ml-auto hidden items-center gap-4 overflow-hidden bg-primary px-8 text-[13px] font-semibold uppercase tracking-[0.14em] text-white focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-white lg:flex xl:px-10"
          >
            <span
              aria-hidden="true"
              className="absolute inset-0 -z-10 origin-left scale-x-0 bg-navy transition-transform duration-500 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100 group-focus-visible:scale-x-100"
            />
            {CTA}
            <span aria-hidden="true" className="relative flex h-5 w-5 items-center justify-center overflow-hidden">
              <Arrow className="transition-transform duration-500 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-[160%]" />
              <Arrow className="absolute -translate-x-[160%] text-cta transition-transform delay-75 duration-500 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0" />
            </span>
            <Cross className="-bottom-[5px] -left-[5px]" />
          </Link>

          {/* Menu toggle (below lg) */}
          <button
            ref={toggleRef}
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="site-menu"
            onClick={() => setOpen((v) => !v)}
            className="ml-auto flex items-center gap-3 border-l border-text/10 px-5 font-mono text-[11px] uppercase tracking-[0.2em] text-text focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-primary sm:px-6 lg:hidden"
          >
            <span className="hidden sm:inline">{open ? "Close" : "Menu"}</span>
            <span aria-hidden="true" className="relative block h-3 w-6">
              <span className={cn("absolute left-0 top-0 h-[1.5px] w-6 bg-text transition-transform duration-500 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)]", open && "translate-y-[5px] rotate-45")} />
              <span className={cn("absolute bottom-0 left-0 h-[1.5px] w-6 bg-text transition-transform duration-500 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)]", open && "-translate-y-[5.5px] -rotate-45")} />
            </span>
          </button>
        </nav>
      </header>

      {/* ------------------------------------------ Full-screen menu (<lg) */}
      <div
        id="site-menu"
        ref={menuRef}
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        style={{ visibility: "hidden", clipPath: "inset(0 0 100% 0)" }}
        className="fixed inset-x-0 bottom-0 top-20 z-40 flex flex-col overflow-y-auto bg-navy text-white lg:hidden"
      >
        {/* Drafting frame */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="mx-4 h-full border-x border-dotted border-white/[0.12] sm:mx-6" />
        </div>

        <nav aria-label="Menu" className="relative mx-4 flex-1 px-5 pt-10 sm:mx-6 sm:px-8">
          <ul>
            {NAV_LINKS.map((link, i) => {
              const active = isActive(link.href);
              return (
                <li key={link.href} className="relative">
                  <span aria-hidden="true" className="menu-rule absolute inset-x-0 bottom-0 h-px bg-white/12" />
                  <span className="block overflow-hidden">
                    <Link
                      href={link.href}
                      aria-current={active ? "page" : undefined}
                      onClick={() => setOpen(false)}
                      className="menu-link group flex items-baseline gap-4 py-5"
                    >
                      <span className={cn("font-mono text-xs tracking-[0.14em]", active ? "text-cta" : "text-white/45")}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className={cn("font-display text-[2.4rem] font-semibold leading-none tracking-[-0.03em] transition-colors duration-300 sm:text-[3rem]", active ? "text-cta" : "text-white group-hover:text-cta")}>
                        {link.label}
                      </span>
                    </Link>
                  </span>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="menu-foot relative mx-4 flex flex-col gap-5 px-5 pb-10 pt-8 sm:mx-6 sm:px-8">
          <div className="flex flex-col gap-2 font-mono text-[12px] tracking-[0.1em]">
            <a href={PHONE.href} className="inline-block py-1.5 text-white/75 hover:text-cta">{PHONE.label}</a>
            <a href={EMAIL.href} className="inline-block py-1.5 text-white/75 hover:text-cta">{EMAIL.label}</a>
          </div>
          <Link
            href="/contact/"
            onClick={() => setOpen(false)}
            className="inline-flex min-h-[56px] items-center justify-between gap-4 bg-primary px-6 text-[13px] font-semibold uppercase tracking-[0.14em] text-white"
          >
            {CTA}
            <Arrow />
          </Link>
        </div>
      </div>
    </>
  );
}
