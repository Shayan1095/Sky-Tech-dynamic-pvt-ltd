"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { headlineText, recurringExtras } from "@/lib/service-pages/quote";
import type { ServicePage } from "@/lib/service-pages/types";
import { Arrow, FRAME } from "./parts";
import { useServiceQuote } from "./useServiceQuote";

/* The desktop section bar: this page's contents, under the main navigation.

   Service pages are long, and a visitor comparing agencies comes back to the
   same three things — packages, price, process. The bar lets them jump
   straight there, shows where they are, and carries their running estimate
   with the one action that matters.

   It appears once the hero has gone (the hero already holds all of this) and
   leaves when the closing band arrives, like the phone quote bar. Phones and
   tablets don't get it: there is no room for a second bar, and the quote bar
   does its job there.

   Which section is "current" is decided by IntersectionObserver against a
   thin line 45% down the screen, not by scroll events — it stays right after
   a jump, and costs nothing while the page scrolls. */

type Item = { id: string; label: string };

export default function SectionNav({ page }: { page: ServicePage }) {
  const { estimate, href, tier, addOns } = useServiceQuote(page);
  const [shown, setShown] = useState(false);
  const [current, setCurrent] = useState<string>("");

  const items: Item[] = [
    { id: "what-we-build", label: page.offerings.heading },
    { id: "packages", label: "Packages" },
    ...(page.addOns ? [{ id: "add-ons", label: "Quote Builder" }] : []),
    ...(page.technology ? [{ id: "technology", label: "Technology" }] : []),
    { id: "process", label: "Process" },
    ...(page.investment || page.timeline ? [{ id: "pricing", label: "Pricing" }] : []),
    { id: "faq", label: "FAQ" },
  ];
  const ids = items.map((i) => i.id).join(",");

  useEffect(() => {
    const hero = document.getElementById("service-hero");
    const close = document.getElementById("service-closing");
    let pastHero = false;
    let atClose = false;
    const update = () => setShown(pastHero && !atClose);
    const observers: IntersectionObserver[] = [];

    if (hero) {
      const o = new IntersectionObserver(([e]) => {
        pastHero = !e.isIntersecting && e.boundingClientRect.top < 0;
        update();
      });
      o.observe(hero);
      observers.push(o);
    }
    if (close) {
      const o = new IntersectionObserver(([e]) => {
        atClose = e.isIntersecting || e.boundingClientRect.top < 0;
        update();
      });
      o.observe(close);
      observers.push(o);
    }

    const sections = ids
      .split(",")
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => !!el);
    const line = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setCurrent(e.target.id);
        });
      },
      { rootMargin: "-45% 0px -54% 0px" }
    );
    sections.forEach((s) => line.observe(s));
    observers.push(line);

    return () => observers.forEach((o) => o.disconnect());
  }, [ids]);

  const edited = tier.id !== page.packages.tiers[0].id || addOns.length > 0;

  return (
    <div
      aria-hidden={!shown}
      {...(shown ? {} : { inert: true })}
      className={`svn-bar fixed inset-x-0 top-20 z-40 hidden border-b border-text/10 bg-bg shadow-[0_12px_24px_-20px_rgb(11_31_53/0.35)] lg:block ${
        shown ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
      }`}
    >
      <div className={`flex h-[52px] items-center justify-between gap-8 px-12 ${FRAME}`}>
        <nav aria-label="On this page" className="flex min-w-0 items-center gap-7">
          {/* The service name only where there is room for it beside seven
              links; the page's own heading already says it. */}
          <p className="hidden shrink-0 items-center gap-2.5 font-mono text-[10.5px] uppercase tracking-[0.2em] text-primary xl:flex">
            <span aria-hidden="true" className="block h-1.5 w-1.5 bg-cta" />
            {page.contactName}
          </p>
          <span aria-hidden="true" className="hidden h-4 w-px shrink-0 bg-text/15 xl:block" />
          <ul className="flex min-w-0 items-center gap-5 xl:gap-6">
            {items.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  aria-current={current === item.id ? "location" : undefined}
                  className="svn-link relative block whitespace-nowrap py-3.5 text-[13px] font-medium text-text/55 transition-colors duration-300 hover:text-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex shrink-0 items-center gap-4">
          <p className="text-right leading-tight">
            <span className="block font-mono text-[9.5px] uppercase tracking-[0.18em] text-text/45">
              {edited ? "Your Estimate" : page.packages.priceLabel}
            </span>
            <span className="block font-mono text-[14px] text-text">
              {addOns.length ? headlineText(estimate) : tier.price}
              {addOns.length > 0 &&
                recurringExtras(estimate).map((part) => (
                  <span key={part} className="text-text/50"> + {part}</span>
                ))}
            </span>
          </p>
          <Link
            href={href}
            className="group flex h-9 items-center gap-2 rounded-full bg-primary pl-4 pr-3.5 text-[11.5px] font-semibold uppercase tracking-[0.08em] text-white [transition:background-color_200ms_cubic-bezier(0.22,1,0.36,1),scale_140ms_cubic-bezier(0.22,1,0.36,1)] hover:bg-navy focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary active:scale-[0.97]"
          >
            Request Quote
            <Arrow className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
