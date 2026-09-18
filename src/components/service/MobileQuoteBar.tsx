"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { money } from "@/lib/service-pages/quote";
import type { ServicePage } from "@/lib/service-pages/types";
import { Arrow } from "./parts";
import { useServiceQuote } from "./useServiceQuote";

/* A slim quote bar pinned to the bottom of the screen on phones and tablets.

   It appears once the hero (and its own quote button) has scrolled away, and
   leaves again as the closing band arrives — which carries the same action —
   so the page never shows two of the same button at once. Desktop doesn't
   get it: the header's contact link is always in reach there, and a fixed
   bar would sit over content on a wide screen for no gain.

   Visibility comes from two IntersectionObservers, not a scroll listener. The
   bar moves on transform only, and is inert while hidden so it can never be
   tabbed to off-screen.

   It shows the visitor's running estimate once they have chosen a package or
   an add-on, and its button requests exactly that quote. */
export default function MobileQuoteBar({ page }: { page: ServicePage }) {
  const [pastHero, setPastHero] = useState(false);
  const [atClose, setAtClose] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("service-hero");
    const close = document.getElementById("service-closing");
    const observers: IntersectionObserver[] = [];

    if (hero) {
      const o = new IntersectionObserver(([entry]) => {
        setPastHero(!entry.isIntersecting && entry.boundingClientRect.top < 0);
      });
      o.observe(hero);
      observers.push(o);
    }
    if (close) {
      /* "Reached" means the band is on screen or already above it, so the
         bar stays away over the footer too. */
      const o = new IntersectionObserver(([entry]) => {
        setAtClose(entry.isIntersecting || entry.boundingClientRect.top < 0);
      });
      o.observe(close);
      observers.push(o);
    }
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const shown = pastHero && !atClose;
  const { estimate, href, tier, addOns } = useServiceQuote(page);
  const edited = tier.id !== page.packages.tiers[0].id || addOns.length > 0;

  return (
    <div
      aria-hidden={!shown}
      {...(shown ? {} : { inert: true })}
      className={`svq-bar fixed inset-x-0 bottom-0 z-40 border-t border-text/10 bg-bg px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3 shadow-[0_-12px_32px_-18px_rgb(11_31_53/0.35)] lg:hidden ${
        shown ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="mx-auto flex max-w-xl items-center justify-between gap-4">
        <p className="shrink-0 leading-tight">
          <span className="block whitespace-nowrap font-mono text-[9px] uppercase tracking-[0.14em] text-text/50">
            {edited ? "Your Estimate" : page.packages.priceLabel}
          </span>
          <span className="block font-mono text-[1.05rem] text-text">
            {money(estimate.from)}
            {estimate.open ? "+" : ""}
          </span>
        </p>
        <Link
          href={edited ? href : `/contact?service=${encodeURIComponent(page.contactName)}#contact-form`}
          className="flex min-h-[48px] min-w-0 items-center gap-2.5 whitespace-nowrap rounded-full bg-primary px-5 text-[11.5px] font-semibold uppercase tracking-[0.05em] text-white [transition:scale_140ms_cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary active:scale-[0.97]"
        >
          {page.hero.primaryCta}
          <Arrow className="shrink-0" />
        </Link>
      </div>
    </div>
  );
}
