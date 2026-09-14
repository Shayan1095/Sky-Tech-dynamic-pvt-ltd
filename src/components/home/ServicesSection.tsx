"use client";

import Image from "next/image";
import { contactHref } from "@/lib/site";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { SERVICE_META } from "@/lib/services";

const CLOSED = "inset(0 100% 0 0)";
const OPEN = "inset(0 0% 0 0)";
const PIN_LENGTH = 2200;
// Shorter on phones: the same five handovers over less travel for a thumb.
const PIN_LENGTH_COMPACT = 1750;

interface Service {
  index: string;
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
  /* Supplied artwork. Intrinsic size is carried per image because the set is
     not uniform — video production is 2:1 while the rest are 16:9 — and a
     shared size would stretch it. */
  image: { src: string; width: number; height: number };
  /* Supporting-card artwork. Supplied transparent at 1536x1024; Business
     Automation has none because the stack already ends on it.

     Each file frames its subject differently inside the canvas — content
     occupies 65-85% of the width with margins varying from 3% to 29% — so
     dropping them into identical boxes renders them at visibly different
     sizes and off different centres. `art` is the measured scale and offset
     that fits each one's content into the shared frame and centres it.
     Nothing is cropped or altered; only placed. */
  card?: string;
  art?: { w: number; l: number; v: number };
}

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const SERVICES: Service[] = [
  {
    index: "01",
    art: { w: 139.65, l: -21.83, v: -50.78 },
    card: "/services/cards/web-development.png",
    image: { src: "/services/web-development.webp", width: 1672, height: 941 },
    title: "Web Development",
    description:
      "Custom, responsive websites and web apps built on modern frameworks.",
    href: contactHref("Web Development"),
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" {...stroke}>
        <rect x="2.5" y="4.5" width="19" height="15" rx="2.5" />
        <path d="M2.5 8.8h19" />
        <path d="M10.2 12.4l-1.9 2.2 1.9 2.2M13.8 12.4l1.9 2.2-1.9 2.2" />
      </svg>
    ),
  },
  {
    index: "02",
    art: { w: 140.15, l: -32.12, v: -55.08 },
    card: "/services/cards/wordpress-development.png",
    image: { src: "/services/wordpress-development.png", width: 1671, height: 941 },
    title: "WordPress Development",
    description:
      "Secure, scalable WordPress & WooCommerce sites with custom themes.",
    href: contactHref("WordPress Development"),
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" {...stroke}>
        <circle cx="12" cy="12" r="8.75" />
        <path d="M7.4 9.1l1.7 6 2.9-6 2.9 6 1.7-6" />
      </svg>
    ),
  },
  {
    index: "03",
    art: { w: 117.07, l: -10.98, v: -51.57 },
    card: "/services/cards/digital-marketing.png",
    image: { src: "/services/digital-marketing.png", width: 1671, height: 941 },
    title: "Digital Marketing",
    description:
      "Data-driven SEO, Google Ads, and social advertising that generates leads.",
    href: contactHref("Digital Marketing"),
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" {...stroke}>
        <path d="M3 19.5h18" />
        <path d="M4 15.4l4.8-4.8 3.2 3.2 7-7" />
        <path d="M14.4 6.8H21v6.6" />
      </svg>
    ),
  },
  {
    index: "04",
    art: { w: 154.84, l: -38.7, v: -51.76 },
    card: "/services/cards/social-media-management.png",
    image: { src: "/services/social-media-management.png", width: 1670, height: 942 },
    title: "Social Media Management",
    description:
      "Strategy, content, and community management that builds real engagement.",
    href: contactHref("Social Media Management"),
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" {...stroke}>
        <path d="M20.5 11.4c0 3.8-3.8 6.9-8.5 6.9a10 10 0 0 1-2.4-.3L4.8 20l1.1-3.2a6.6 6.6 0 0 1-2.4-5c0-3.8 3.8-6.9 8.5-6.9s8.5 3.1 8.5 6.9z" />
        <path d="M12 14.3s-2.7-1.6-2.7-3.3a1.5 1.5 0 0 1 2.7-.8 1.5 1.5 0 0 1 2.7.8c0 1.7-2.7 3.3-2.7 3.3z" />
      </svg>
    ),
  },
  {
    index: "05",
    art: { w: 147.12, l: -42.53, v: -51.37 },
    card: "/services/cards/video-production.png",
    image: { src: "/services/video-production.png", width: 1774, height: 887 },
    title: "Video Production",
    description:
      "Professional video production, reels, and social-first visual content.",
    href: contactHref("Video Production"),
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" {...stroke}>
        <rect x="3" y="8.8" width="18" height="11.4" rx="2.2" />
        <path d="M3 13.2h18" />
        <path d="M7.6 8.8L6.1 13.2M12.1 8.8l-1.5 4.4M16.6 8.8l-1.5 4.4" />
        <path d="M3.4 8.8l.9-3.2 16.5 1.6-.4 1.6" />
      </svg>
    ),
  },
  {
    index: "06",
    image: { src: "/services/business-automation.png", width: 1672, height: 941 },
    title: "Business Automation",
    description: "Custom workflows and integrations that eliminate manual work.",
    href: contactHref("Business Automation"),
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" {...stroke}>
        <rect x="2.5" y="3.2" width="7.6" height="5.8" rx="1.8" />
        <rect x="13.9" y="15" width="7.6" height="5.8" rx="1.8" />
        <path d="M10.1 6.1h5a2.6 2.6 0 0 1 2.6 2.6v4.2" />
        <path d="M15.5 12.6l2.2 2.4 2.2-2.4" />
      </svg>
    ),
  },
];

const Arrow = ({ className = "" }: { className?: string }) => (
  <svg
    viewBox="0 0 16 16"
    className={`h-[13px] w-[13px] ${className}`}
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M4.5 11.5L11.5 4.5M6 4.5h5.5V10"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function ServicesSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = sectionRef.current;
    if (!root) return;

    const mm = gsap.matchMedia();

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>(".svc-feature");
      const pinwrap = root.querySelector<HTMLElement>(".svc-pinwrap");
      const stackEl = root.querySelector<HTMLElement>(".svc-stack");
      const dots = gsap.utils.toArray<HTMLElement>(".svc-dot");
      if (!pinwrap || !stackEl || cards.length === 0) return;

      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (reduced) {
        // Only the first service is shown; 02-06 remain reachable through the
        // supporting cards below.
        gsap.set(cards.slice(1), { opacity: 0, pointerEvents: "none" });
        return;
      }

      /* --- Header entrance ---------------------------------------------- */
      const header = gsap.timeline({
        scrollTrigger: { trigger: root, start: "top 78%", once: true },
        onComplete: () =>
          gsap.set(".svc-heading-line", { clearProps: "willChange" }),
      });

      header
        .fromTo(
          ".svc-eyebrow > *",
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.5, stagger: 0.06 },
          0
        )
        .fromTo(
          ".svc-heading-line",
          { clipPath: CLOSED, willChange: "clip-path" },
          { clipPath: OPEN, duration: 0.65, stagger: 0.09 },
          0.12
        )
        .fromTo(
          ".svc-pager",
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.5 },
          0.5
        );

      /* --- Ambient drift, only on the service currently on screen -------- */
      const ambient = cards.map((card) =>
        gsap.to(card.querySelectorAll(".sv-float"), {
          y: -9,
          duration: 3.4,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
          paused: true,
          stagger: { each: 0.35, from: "random" },
        })
      );

      let current = -1;
      const setCurrent = (i: number) => {
        if (i === current) return;
        current = i;
        dots.forEach((d, k) => d.classList.toggle("is-current", k === i));
        ambient.forEach((a, k) => (k === i ? a.play() : a.pause()));
      };

      // Each unit of the timeline is one service. The handover happens in the
      // back half of the unit: the outgoing card sinks back while the incoming
      // one rises over it. Offsets are percentages of the card, so the motion
      // scales with the card at every breakpoint.
      const buildStack = () => {
        const stack = gsap.timeline();
        for (let k = 0; k < cards.length - 1; k += 1) {
          stack
            .to(
              cards[k],
              {
                yPercent: -6,
                scale: 0.9,
                opacity: 0,
                duration: 0.6,
                ease: "none",
              },
              k + 0.4
            )
            .fromTo(
              cards[k + 1],
              { yPercent: 14, scale: 0.94, opacity: 0 },
              {
                yPercent: 0,
                scale: 1,
                opacity: 1,
                duration: 0.6,
                ease: "none",
              },
              k + 0.4
            );
        }
        return stack;
      };

      // The timeline is one unit per handover, so it runs 0..cards-1, not
      // 0..cards. Service k is fully on screen at time k; the label flips at
      // the midpoint of each handover (k + 0.7), hence the 0.2 offset.
      const trackCurrent =
        (stack: gsap.core.Timeline) => (self: ScrollTrigger) => {
          const t = self.progress * stack.duration();
          setCurrent(
            gsap.utils.clamp(0, cards.length - 1, Math.round(t - 0.2))
          );
        };

      /* --- Desktop: pin heading and stack together ----------------------- */
      mm.add("(min-width: 1024px)", () => {
        const stack = buildStack();

        const pin = ScrollTrigger.create({
          trigger: pinwrap,
          start: "center center",
          end: `+=${PIN_LENGTH}`,
          pin: true,
          anticipatePin: 1,
          scrub: 0.6,
          animation: stack,
          onUpdate: trackCurrent(stack),
        });

        // The pager jumps within the pinned range rather than acting as a
        // slideshow — the section is still driven entirely by scroll position.
        const jumpTo = (i: number) => {
          const k = gsap.utils.clamp(0, cards.length - 1, i);
          // Land on the scroll offset where service k sits fully composed,
          // pulled just inside the end so the last one does not unpin on
          // arrival.
          const at = Math.min(0.985, k / (cards.length - 1));
          window.scrollTo({
            top: pin.start + PIN_LENGTH * at,
            behavior: "smooth",
          });
        };

        const onDot = (e: Event) => {
          const el = e.currentTarget as HTMLElement;
          jumpTo(Number(el.dataset.idx));
        };
        const onPrev = () => jumpTo(current - 1);
        const onNext = () => jumpTo(current + 1);

        const prev = root.querySelector<HTMLElement>(".svc-prev");
        const next = root.querySelector<HTMLElement>(".svc-next");
        dots.forEach((d) => d.addEventListener("click", onDot));
        prev?.addEventListener("click", onPrev);
        next?.addEventListener("click", onNext);

        setCurrent(0);

        return () => {
          dots.forEach((d) => d.removeEventListener("click", onDot));
          prev?.removeEventListener("click", onPrev);
          next?.removeEventListener("click", onNext);
          pin.kill();
          stack.kill();
        };
      });

      /* --- Phones and tablets: pin the stack alone ----------------------- */
      // Heading plus card is taller than a phone screen, so only the card
      // stack pins, centred in the space below the fixed site header; the
      // heading scrolls away above it.
      mm.add("(max-width: 1023px) and (min-height: 600px)", () => {
        const stack = buildStack();
        const header = document.querySelector<HTMLElement>("header");
        const offset = () => Math.round((header?.offsetHeight ?? 0) / 2);

        const pin = ScrollTrigger.create({
          trigger: stackEl,
          start: () => `center center+=${offset()}`,
          end: `+=${PIN_LENGTH_COMPACT}`,
          pin: true,
          anticipatePin: 1,
          scrub: 0.6,
          animation: stack,
          invalidateOnRefresh: true,
          onUpdate: trackCurrent(stack),
        });

        setCurrent(0);

        return () => {
          pin.kill();
          stack.kill();
          ambient.forEach((a) => a.pause());
        };
      });

      // Landscape phones are too short to hold a pinned card, so the top of
      // the stack (the last service) simply stays in place.
      mm.add("(max-width: 1023px) and (max-height: 599px)", () => {
        setCurrent(cards.length - 1);
        return () => ambient.forEach((a) => a.pause());
      });

      /* --- Supporting cards ---------------------------------------------- */
      gsap.fromTo(
        ".svc-support",
        { opacity: 0, y: 26 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.08,
          scrollTrigger: {
            trigger: ".svc-support-grid",
            start: "top 82%",
            once: true,
          },
        }
      );
    }, root);

    return () => {
      mm.revert();
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="services-heading"
      /* overflow-x-clip keeps the full-bleed card band from causing sideways
         scroll without cutting the corner registration marks in half. */
      className="sky-services relative isolate overflow-x-clip bg-[#f8fafc] py-24 sm:py-28"
    >
      {/* The site's drafting frame, with registration marks at the section's
          corners — shared with the Trust Bar, Approach and About page. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="relative mx-4 h-full border-x border-dotted border-text/[0.16] sm:mx-6 lg:mx-8 xl:mx-auto xl:max-w-6xl">
          {["top-0 -translate-y-1/2", "bottom-0 translate-y-1/2"].map((v) =>
            ["left-0 -translate-x-1/2", "right-0 translate-x-1/2"].map((h) => (
              <span key={v + h} className={`absolute h-[11px] w-[11px] ${v} ${h}`}>
                <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-text/40" />
                <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-text/40" />
              </span>
            ))
          )}
        </div>
      </div>

      <div className="relative mx-4 px-5 sm:mx-6 sm:px-8 lg:mx-8 lg:px-12 xl:mx-auto xl:max-w-6xl">
        <div className="svc-pinwrap">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
            <div className="lg:max-w-2xl">
              <p className="svc-eyebrow flex items-center gap-4">
                <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-text/60">
                  Services
                </span>
                <span
                  aria-hidden="true"
                  className="h-px w-16 bg-text/20 sm:w-20"
                />
                <span className="font-mono text-[11px] tracking-[0.18em] text-text/40">
                  / 06
                </span>
              </p>

              <h2
                id="services-heading"
                className="mt-6 text-[2.2rem] font-semibold leading-[1.04] tracking-[-0.028em] text-text sm:text-[3rem] lg:text-[3.6rem]"
              >
                <span className="svc-heading-line block">
                  Everything You Need to
                </span>
                <span className="svc-heading-line block">
                  <span className="text-primary">Build, Launch &amp; Grow</span>
                </span>
              </h2>
            </div>

            {/* Scroll position within the pinned sequence */}
            <nav
              aria-label="Featured service"
              className="svc-pager hidden shrink-0 items-center gap-1 lg:flex"
            >
              <button
                type="button"
                className="svc-prev flex h-8 w-8 items-center justify-center rounded-full text-text/45 transition-colors duration-300 hover:bg-white hover:text-primary"
                aria-label="Previous service"
              >
                <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none">
                  <path
                    d="M10 3.5L5.5 8l4.5 4.5"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              {SERVICES.map((service, i) => (
                <button
                  key={service.index}
                  type="button"
                  data-idx={i}
                  aria-label={`Show ${service.title}`}
                  className="svc-dot relative px-3 py-2 font-mono text-[12px] tracking-[0.12em] text-text/40 transition-colors duration-300 hover:text-primary"
                >
                  {service.index}
                  <span
                    aria-hidden="true"
                    className="svc-dot-rule absolute inset-x-2 bottom-0 h-[2px] origin-left scale-x-0 rounded-full bg-primary transition-transform duration-500 ease-out"
                  />
                </button>
              ))}

              <button
                type="button"
                className="svc-next flex h-8 w-8 items-center justify-center rounded-full text-text/45 transition-colors duration-300 hover:bg-white hover:text-primary"
                aria-label="Next service"
              >
                <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none">
                  <path
                    d="M6 3.5L10.5 8 6 12.5"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </nav>
          </div>

          {/* Featured stack */}
          {/* Below lg every card shares one grid cell, so the stack is as tall
              as its tallest card with no measuring; on desktop they sit
              absolutely in a fixed-height frame. */}
          <div className="svc-stack relative mt-10 grid lg:mt-12 lg:block lg:h-[420px]">
            {SERVICES.map((service, i) => {
              return (
                <article
                  key={service.index}
                  className="svc-feature mx-auto w-full max-w-2xl [grid-area:1/1] lg:absolute lg:inset-0 lg:max-w-none"
                  style={{ zIndex: i + 1 }}
                >
                  {/* One card: copy and artwork share a surface, a border and
                      a progress rule, so neither half floats on its own. */}
                  <div className="svc-unified relative h-full overflow-hidden rounded-[24px] border border-[#e3e8ef] bg-white p-2.5 shadow-[0_1px_2px_rgb(18_18_18/0.04),0_28px_56px_-32px_rgb(18_18_18/0.24)] sm:p-3">
                    {/* Progress through the six services, across the top */}
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-0 top-0 h-[3px] bg-[#e3e8ef]"
                    />
                    <span
                      aria-hidden="true"
                      className="absolute left-0 top-0 h-[3px] rounded-r-full bg-gradient-to-r from-primary to-primary/70"
                      style={{
                        width: `${((i + 1) / SERVICES.length) * 100}%`,
                      }}
                    />

                    <div className="svc-u-copy relative px-4 pt-6 sm:px-6 sm:pt-7 lg:px-8 lg:pt-10">
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute right-3 top-3 font-display text-[4.5rem] font-bold leading-none text-primary/[0.06] sm:text-[5.5rem] lg:right-6 lg:top-6 lg:text-[7rem]"
                      >
                        {service.index}
                      </span>

                      <p className="relative flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[13px] tracking-[0.14em] text-primary">
                        {service.index}
                        <span aria-hidden="true" className="h-px w-6 bg-primary/40" />
                        <span className="text-[10px] uppercase tracking-[0.2em] text-text/55">
                          {SERVICE_META[service.title]?.category}
                        </span>
                      </p>

                      <h3 className="relative mt-3 max-w-md text-[1.5rem] font-semibold leading-[1.2] tracking-tight text-text sm:text-[1.9rem]">
                        {service.title}
                      </h3>

                      <p className="relative mt-3 max-w-md text-[0.95rem] leading-relaxed text-[#5a6472] sm:mt-4">
                        {SERVICE_META[service.title]?.description ?? service.description}
                      </p>
                    </div>

                    {/* Artwork sits inset in its own panel. The panel matches
                        the artwork's edge tone (#f3f5f7-#fbfcfe), so the image
                        needs no clipping and shows no seam. */}
                    <div className="svc-u-art mt-6 flex items-center justify-center rounded-[18px] border border-[#e9eef4] bg-[#f8fafc] p-3 sm:p-5 lg:mt-0 lg:p-4">
                      <div className="sv-float w-full">
                        {/* Intrinsic dimensions, so each piece of artwork keeps
                            its own aspect ratio exactly — no crop, no stretch. */}
                        <Image
                          src={service.image.src}
                          alt=""
                          width={service.image.width}
                          height={service.image.height}
                          sizes="(max-width: 1023px) 100vw, 600px"
                          className="mx-auto h-auto max-h-[30svh] w-full object-contain lg:max-h-none"
                        />
                      </div>
                    </div>

                    <div className="svc-u-foot mx-4 mt-5 flex items-center justify-between gap-4 border-t border-[#e3e8ef] pb-3 pt-4 sm:mx-6 lg:mx-8 lg:mb-7 lg:mt-0 lg:pb-0">
                      <Link
                        href={service.href}
                        className="group inline-flex items-center gap-2 border-b-2 border-primary/35 pb-1 text-sm font-medium text-primary transition-colors duration-300 hover:border-primary"
                      >
                        Explore {service.title}
                        <Arrow className="transition-transform duration-300 ease-out group-hover:-translate-y-[2px] group-hover:translate-x-[2px]" />
                      </Link>
                      <span
                        aria-hidden="true"
                        className="font-mono text-[11px] tracking-[0.18em] text-text/40"
                      >
                        {service.index} / {String(SERVICES.length).padStart(2, "0")}
                      </span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        {/* Supporting services — the five the stack does not end on, with the
            CTA closing the grid. Business Automation is omitted because the
            pinned stack finishes on it. Palette and ground are scoped to this
            band via .svc-cards. */}
        <div className="svc-cards relative mt-10 py-12 sm:mt-20 sm:py-16">
          <span
            aria-hidden="true"
            className="absolute inset-y-0 left-1/2 -z-10 w-screen -translate-x-1/2 bg-[var(--card-band)]"
          />

          <div className="svc-support-grid grid grid-cols-1 gap-5 sm:auto-rows-fr sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.slice(0, 5).map((service) => (
              <Link
                key={service.index}
                href={service.href}
                className="svc-support group relative flex flex-col sm:min-h-[260px] overflow-hidden rounded-[20px] border border-[var(--card-border)] bg-white px-6 py-5 shadow-[0_1px_2px_rgb(18_18_18/0.04)] transition-[transform,border-color,box-shadow] duration-500 ease-out hover:-translate-y-[5px] hover:border-[var(--card-blue)]/45 hover:shadow-[0_2px_6px_rgb(0_107_184/0.07),0_24px_44px_-24px_rgb(18_18_18/0.26)]"
              >
                {/* Artwork column. Every file frames its subject differently
                    inside the canvas, so each is scaled and offset by its own
                    measured content box — all six end up the same content
                    width, flush right, vertically centred. Nothing cropped. */}
                {/* Phones: a full-width artwork band on top of the card. The
                    tallest artwork is 0.859x its frame width, so a 172px frame
                    fits the 148px inside the band — nothing is clipped. From
                    sm up the band dissolves back into the right-hand column. */}
                {service.card && service.art && (
                  <span className="pointer-events-none relative mb-1 block h-[172px] rounded-[16px] border border-[var(--card-border)] bg-[linear-gradient(160deg,#f1f4f8_0%,#ffffff_72%)] sm:absolute sm:bottom-[72px] sm:right-1 sm:top-4 sm:mb-0 sm:h-auto sm:w-[40%] sm:rounded-none sm:border-0 sm:bg-none">
                  {/* Anchored right and capped so it always clears the icon
                      chip in the top-left corner (which ends 85px in). */}
                  <span className="absolute inset-y-3 right-3 w-[min(172px,calc(100%-109px))] transition-transform duration-500 ease-out group-hover:-translate-y-[5px] group-hover:translate-x-[3px] sm:inset-0 sm:w-full">
                    <Image
                      src={service.card}
                      alt=""
                      width={1536}
                      height={1024}
                      sizes="(max-width: 639px) 60vw, (max-width: 1023px) 32vw, 22vw"
                      style={{
                        width: `${service.art.w}%`,
                        left: `${service.art.l}%`,
                        transform: `translateY(${service.art.v}%)`,
                      }}
                      className="absolute top-1/2 h-auto max-w-none"
                    />
                  </span>
                  </span>
                )}

                {/* Phones: icon and number sit inside the band's top-left
                    corner, clear of the centred artwork. */}
                <span className="absolute left-[calc(1.5rem+12px)] top-[calc(1.25rem+12px)] z-10 flex items-center gap-3 sm:relative sm:left-auto sm:top-auto">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[var(--card-blue)]/15 bg-[var(--card-blue)]/8 text-[var(--card-blue)] transition-[background-color,border-color,color,transform] duration-500 ease-out group-hover:-translate-y-[3px] group-hover:border-[var(--card-blue)] group-hover:bg-[var(--card-blue)] group-hover:text-white">
                    {service.icon}
                  </span>
                  <span className="font-mono text-[11px] tracking-[0.18em] text-[var(--card-muted)]/55 transition-colors duration-500 group-hover:text-[var(--card-blue)]">
                    {service.index}
                  </span>
                </span>

                <h3 className="mt-4 font-display sm:mt-3 sm:max-w-[58%] text-[1.15rem] font-semibold leading-snug tracking-tight text-[var(--card-ink)]">
                  {service.title}
                </h3>

                <p className="mt-2 text-[0.86rem] sm:max-w-[58%] leading-relaxed text-[var(--card-muted)]">
                  {SERVICE_META[service.title]?.description ?? service.description}
                </p>

                <span className="mt-auto flex items-center justify-between gap-3 border-t border-[var(--card-border)] pt-3">
                  <span className="text-[0.82rem] font-medium text-[var(--card-ink)] transition-colors duration-500 group-hover:text-[var(--card-blue)]">
                    Explore {service.title}
                  </span>
                  <span
                    aria-hidden="true"
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--card-border)] text-[var(--card-blue)] transition-[background-color,border-color,color,transform] duration-500 ease-out group-hover:-translate-y-[2px] group-hover:translate-x-[2px] group-hover:border-[var(--card-blue)] group-hover:bg-[var(--card-blue)] group-hover:text-white"
                  >
                    <Arrow />
                  </span>
                </span>
              </Link>
            ))}

            {/* The conclusion of the grid — same anatomy, inverted. */}
            <Link
              href="/services/"
              className="svc-support group relative flex flex-col sm:min-h-[260px] overflow-hidden rounded-[20px] bg-[var(--card-blue)] px-6 py-5 text-white shadow-[0_1px_2px_rgb(18_18_18/0.06)] transition-[transform,box-shadow] duration-500 ease-out hover:-translate-y-[5px] hover:shadow-[0_2px_8px_rgb(0_107_184/0.25),0_28px_52px_-24px_rgb(0_107_184/0.55)]"
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-white/12 via-transparent to-[#00457f]/55"
              />

              <span className="pointer-events-none relative mb-1 block h-[172px] rounded-[16px] border border-white/15 bg-[linear-gradient(160deg,rgb(255_255_255/0.16)_0%,rgb(255_255_255/0.04)_72%)] sm:absolute sm:bottom-[72px] sm:right-1 sm:top-4 sm:mb-0 sm:h-auto sm:w-[40%] sm:rounded-none sm:border-0 sm:bg-none">
              {/* Centred between the icon (left) and "ALL" (right), and
                  narrowed on small phones so it clears both. */}
              <span className="absolute inset-y-3 left-[calc(50%-min(86px,calc((100%-136px)/2)))] w-[min(172px,calc(100%-136px))] transition-transform duration-500 ease-out group-hover:-translate-y-[5px] group-hover:translate-x-[3px] sm:inset-0 sm:w-full">
                <Image
                  src="/services/cards/cta.png"
                  alt=""
                  width={1536}
                  height={1024}
                  sizes="(max-width: 639px) 60vw, (max-width: 1023px) 32vw, 22vw"
                  style={{ width: "135.21%", left: "-22.89%", transform: "translateY(-48.44%)" }}
                  className="absolute top-1/2 h-auto max-w-none"
                />
              </span>
              </span>

              <div className="absolute inset-x-[calc(1.5rem+12px)] top-[calc(1.25rem+12px)] z-10 flex items-start justify-between gap-3 sm:relative sm:inset-x-auto sm:top-auto">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/25 bg-white/12 text-white transition-transform duration-500 ease-out group-hover:-translate-y-[3px]">
                  <svg viewBox="0 0 24 24" className="h-5 w-5" {...stroke}>
                    <rect x="3.2" y="3.2" width="7.4" height="7.4" rx="2" />
                    <rect x="13.4" y="3.2" width="7.4" height="7.4" rx="2" />
                    <rect x="3.2" y="13.4" width="7.4" height="7.4" rx="2" />
                    <rect x="13.4" y="13.4" width="7.4" height="7.4" rx="2" />
                  </svg>
                </span>
                <span className="font-mono text-[11px] tracking-[0.18em] text-white/55">
                  ALL
                </span>
              </div>

              <h3 className="mt-4 font-display sm:mt-3 sm:max-w-[58%] text-[1.15rem] font-semibold leading-snug tracking-tight text-white">
                Explore All Services
              </h3>

              <p className="mt-2 text-[0.86rem] leading-[1.5] sm:max-w-[58%] sm:text-[0.78rem] text-white/75">
                Discover our complete range of services and find the perfect
                solution for your business.
              </p>

              <span className="mt-3 flex flex-wrap gap-1.5 sm:max-w-[58%] sm:gap-1">
                {["Web", "Marketing", "Design", "Automation", "Video", "SEO"].map(
                  (tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-white/25 bg-white/10 px-2.5 py-1 font-mono text-[10px] uppercase sm:px-[7px] sm:py-[2px] sm:text-[8px] tracking-[0.1em] text-white/85"
                    >
                      {tag}
                    </span>
                  )
                )}
              </span>

              <span className="mt-auto flex items-center justify-between gap-3 border-t border-white/20 pt-3">
                <span className="flex items-center gap-3">
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/85">
                    View All Services
                  </span>
                  <span
                    aria-hidden="true"
                    className="h-px w-6 bg-white/30 transition-[width,background-color] duration-500 ease-out group-hover:w-10 group-hover:bg-white"
                  />
                </span>
                <span
                  aria-hidden="true"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/30 text-white transition-[background-color,color,transform] duration-500 ease-out group-hover:-translate-y-[2px] group-hover:translate-x-[2px] group-hover:bg-white group-hover:text-[var(--card-blue)]"
                >
                  <Arrow />
                </span>
              </span>
            </Link>
          </div>
        </div>      </div>
    </section>
  );
}
