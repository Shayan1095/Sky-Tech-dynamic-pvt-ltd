import type { Metadata } from "next";
import Link from "next/link";

/* 404 — shown for any address that doesn't exist, inside the normal site
   header and footer. Next.js marks this page noindex automatically. */

export const metadata: Metadata = {
  title: "Page Not Found | SKY Tech",
};

const FRAME = "mx-4 sm:mx-6 lg:mx-8 xl:mx-auto xl:max-w-6xl";
const INSET = "px-5 sm:px-8 lg:px-12";

const Arrow = () => (
  <svg viewBox="0 0 16 16" className="h-[13px] w-[13px]" fill="none" aria-hidden="true">
    <path d="M3 8h9.5M8.5 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function NotFound() {
  return (
    <section aria-labelledby="not-found-heading" className="relative overflow-x-clip bg-bg">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className={`h-full border-x border-dotted border-text/[0.16] ${FRAME}`} />
      </div>

      <div className={`relative ${FRAME}`}>
        <div className={`flex min-h-[70svh] flex-col justify-center py-20 sm:py-24 ${INSET}`}>
          <p className="flex items-center gap-3">
            <span aria-hidden="true" className="block h-px w-8 bg-primary" />
            <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-primary sm:text-xs">Error 404</span>
          </p>

          <p
            aria-hidden="true"
            className="mt-6 select-none font-display text-[7rem] font-semibold leading-[0.85] tracking-[-0.05em] text-transparent [-webkit-text-stroke:1.5px_rgb(0_107_184/0.35)] sm:text-[11rem] lg:text-[14rem]"
          >
            404
          </p>

          <h1
            id="not-found-heading"
            className="mt-6 text-[2.2rem] font-semibold leading-[1.04] tracking-[-0.028em] text-text sm:text-[3rem]"
          >
            Page not found
          </h1>
          <p className="mt-4 max-w-xl text-[1.05rem] leading-relaxed text-text/65">
            The page you&apos;re looking for doesn&apos;t exist or has moved.
          </p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="/"
              className="group relative isolate inline-flex min-h-[52px] items-center justify-between gap-4 overflow-hidden rounded-full bg-primary py-2 pl-7 pr-2 text-sm font-semibold uppercase tracking-[0.1em] text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
            >
              <span aria-hidden="true" className="absolute inset-0 -z-10 origin-left scale-x-0 bg-navy transition-transform duration-500 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100 group-focus-visible:scale-x-100" />
              Back to Home
              <span aria-hidden="true" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15">
                <Arrow />
              </span>
            </Link>
            <Link
              href="/contact"
              className="inline-flex min-h-[52px] items-center justify-center rounded-full border border-text/15 px-7 text-sm font-semibold uppercase tracking-[0.1em] text-text transition-colors duration-300 hover:border-primary hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
