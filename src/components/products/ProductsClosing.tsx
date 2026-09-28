"use client";

import Link from "next/link";
import { PRODUCTS } from "@/lib/products";
import { FRAME, INSET, Arrow, H2, Words } from "@/components/service/parts";
import { useSectionReveal, revealHead, type RevealBuilder } from "@/components/service/useSectionReveal";

/* The page's last word, on navy — the same closing ground the service pages
   and the home page end on, so a visitor who has scrolled five products knows
   they have reached the bottom without being told.

   Two ways out, and they are genuinely different: see one of these running,
   or have something built that is not on this page. Offering only the first
   would lose everyone whose business does not fit one of five shapes. */

const build: RevealBuilder<HTMLElement> = (tl) => {
  revealHead(tl);
  tl.fromTo(".pc-body", { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.7 }, 0.34)
    .fromTo(".pc-action", { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.1 }, 0.5);
};

export default function ProductsClosing() {
  const ref = useSectionReveal(build, "top 76%");

  return (
    <section
      ref={ref}
      aria-labelledby="products-closing-heading"
      className="relative isolate overflow-hidden bg-navy text-white"
    >
      {/* Light from the top centre, as on the service pages' closing band. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 [background-image:radial-gradient(70%_55%_at_50%_0%,rgb(0_107_184/0.5),transparent_70%),radial-gradient(45%_40%_at_50%_100%,rgb(0_194_255/0.08),transparent_70%)]"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.09] [background-image:linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] [background-size:34px_34px] [mask-image:radial-gradient(75%_60%_at_50%_0%,#000_0%,transparent_80%)]"
      />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className={`h-full border-x border-dotted border-white/15 ${FRAME}`} />
      </div>

      <div className={`relative ${FRAME}`}>
        <div className={`flex flex-col items-center py-24 text-center sm:py-28 lg:py-32 ${INSET}`}>
          <p className="flex items-center gap-4">
            <span aria-hidden="true" className="sv-line block h-px w-10 bg-cta" />
            <span className="sv-label font-mono text-[11px] uppercase tracking-[0.22em] text-cta sm:text-xs">
              {String(PRODUCTS.length).padStart(2, "0")} Systems, One Conversation
            </span>
            <span aria-hidden="true" className="sv-line block h-px w-10 bg-cta" />
          </p>

          <h2
            id="products-closing-heading"
            className={`mt-8 max-w-4xl text-white ${H2}`}
          >
            <Words text="See one running on your own data." />
          </h2>

          <p className="pc-body mt-7 max-w-2xl text-base leading-relaxed text-white/85 [text-wrap:pretty] sm:text-lg">
            A demo is not a slideshow. Tell us which system interests you and
            what your business actually does, and we will set it up with your
            branches, your items and your numbers so you can judge it on
            something real.
          </p>

          <div className="mt-11 flex flex-col items-center gap-x-8 gap-y-5 sm:flex-row sm:flex-wrap sm:justify-center">
            <Link
              href="/contact?type=demo#contact-form"
              className="pc-action group relative isolate flex min-h-[56px] items-center justify-between gap-4 overflow-hidden rounded-full bg-white py-2 pl-6 pr-2 text-[13px] font-semibold uppercase tracking-[0.1em] text-navy [transition:scale_140ms_cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cta active:scale-[0.97]"
            >
              <span
                aria-hidden="true"
                className="absolute inset-0 -z-10 origin-left scale-x-0 bg-cta transition-transform duration-500 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100 group-focus-visible:scale-x-100"
              />
              Request a Demo
              <span
                aria-hidden="true"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-navy/10"
              >
                <Arrow className="transition-transform duration-500 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0.5" />
              </span>
            </Link>

            <Link
              href="/services"
              className="pc-action group relative inline-flex items-center gap-3 py-3.5 font-mono text-[11px] uppercase tracking-[0.2em] text-white/75 transition-colors duration-300 hover:text-cta focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cta sm:text-xs"
            >
              Need Something Different
              <Arrow className="transition-transform duration-500 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1" />
              <span
                aria-hidden="true"
                className="absolute inset-x-0 bottom-1.5 h-px origin-left scale-x-0 bg-cta transition-transform duration-500 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100 group-focus-visible:scale-x-100"
              />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
