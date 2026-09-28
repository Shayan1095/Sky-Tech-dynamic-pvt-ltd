"use client";

import Image from "next/image";
import Link from "next/link";
import { type Product, demoHref } from "@/lib/products";
import { FRAME, INSET, Arrow, Cross, H2, Words } from "@/components/service/parts";
import { useSectionReveal, revealHead, type RevealBuilder } from "@/components/service/useSectionReveal";

/* One product.

   The screenshot runs the full width of the frame rather than sharing a row
   with the writing. Half a row gave it 496px for a 1600px dashboard — a
   third of its real size, at which the sidebar, the figures and the charts
   were all a blur. The thing being sold was the least legible element on its
   own page. At the frame's full width it is twice that, the layout of the
   software reads at a glance, and the column of dead space that used to sit
   beside it is gone.

   So the section reads top to bottom: what it is, who it is for, then the
   software itself, then how it works and what it does, then the demo. The
   claim, the evidence, the detail, the invitation — in that order.

   Rhythm comes from the alternating ground and from swapping the two lower
   columns, not from flipping a big image from side to side. */

const build: RevealBuilder<HTMLElement> = (tl, root) => {
  revealHead(tl);

  tl.fromTo(".pr-lede", { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.7, stagger: 0.08 }, 0.3);

  /* The frame rises, then its contents are uncovered inside it — the
     screenshot arrives in something rather than the frame arriving around
     something already there. clip-path and transform only: no layout. */
  tl.fromTo(
    root.querySelectorAll(".pr-frame"),
    { opacity: 0, y: 30 },
    { opacity: 1, y: 0, duration: 0.85, ease: "power3.out" },
    0.42
  ).fromTo(
    root.querySelectorAll(".pr-shot"),
    { clipPath: "inset(0 100% 0 0)", scale: 1.03 },
    { clipPath: "inset(0 0% 0 0)", scale: 1, duration: 1.15, ease: "power3.inOut" },
    0.6
  );

  tl.fromTo(".pr-body", { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.7, stagger: 0.08 }, 0.9)
    .fromTo(".pr-cap", { opacity: 0, x: -10 }, { opacity: 1, x: 0, duration: 0.5, stagger: 0.05 }, 1.0)
    .fromTo(".pr-action", { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.6 }, 1.35);
};

export default function ProductRow({
  product,
  tone = "bg",
}: {
  product: Product;
  /** Alternating grounds, as the Services pillars do. */
  tone?: "bg" | "sunk";
}) {
  const ref = useSectionReveal(build, "top 72%");
  const flip = Number(product.index) % 2 === 0;
  const ground =
    tone === "sunk" ? "bg-[color-mix(in_srgb,var(--color-navy)_4%,var(--color-bg))]" : "bg-bg";

  return (
    <section
      ref={ref}
      id={product.slug}
      aria-labelledby={`${product.slug}-heading`}
      className={`sky-anchor relative isolate overflow-x-clip ${ground}`}
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className={`h-full border-x border-dotted border-text/[0.16] ${FRAME}`} />
      </div>

      <div className={`relative ${FRAME}`}>
        <div className={`py-24 sm:py-28 lg:py-32 ${INSET}`}>
          {/* ------------------------------------------------------ header */}
          <div className="flex items-center justify-between gap-6">
            <p className="flex items-center gap-3">
              <span aria-hidden="true" className="sv-line block h-px w-8 bg-primary" />
              <span className="sv-label font-mono text-[11px] uppercase tracking-[0.22em] text-primary sm:text-xs">
                {product.category}
              </span>
            </p>
            <span className="sv-label shrink-0 font-mono text-[11px] uppercase tracking-[0.18em] text-text/65">
              {product.index}
            </span>
          </div>

          <div className="mt-8 grid gap-x-16 gap-y-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] lg:items-end">
            <h2 id={`${product.slug}-heading`} className={H2}>
              <Words text={product.name} />
            </h2>

            {/* Who it is for. Sat beside the name rather than buried in the
                prose, so a reader who is not that business can move on. */}
            <p className="pr-lede border-l-2 border-cta pl-4 text-[0.95rem] leading-relaxed text-text/75 [text-wrap:pretty] lg:pb-1">
              {product.audience}
            </p>
          </div>

          <p className="pr-lede mt-8 max-w-3xl text-xl leading-relaxed text-text/85 [text-wrap:pretty] sm:text-[1.35rem] sm:leading-[1.55]">
            {product.summary}
          </p>

          {/* -------------------------------------------------- the software */}
          <figure className="pr-frame relative mt-14 sm:mt-16">
            <Cross className="-left-px -top-px -translate-x-1/2 -translate-y-1/2" />
            <Cross className="-right-px -top-px -translate-y-1/2 translate-x-1/2" />

            <div className="overflow-hidden rounded-[20px] border border-text/[0.14] bg-white shadow-[0_2px_6px_rgb(18_18_18/0.05),0_48px_96px_-52px_rgb(11_31_53/0.5)]">
              {/* Browser chrome: this is a picture of other software, and the
                  frame is what says so. */}
              <div className="flex items-center gap-2 border-b border-text/[0.1] bg-[color-mix(in_srgb,var(--color-navy)_5%,#fff)] px-4 py-3 sm:px-5">
                <span aria-hidden="true" className="h-[9px] w-[9px] rounded-full bg-text/15" />
                <span aria-hidden="true" className="h-[9px] w-[9px] rounded-full bg-text/15" />
                <span aria-hidden="true" className="h-[9px] w-[9px] rounded-full bg-text/15" />
                <span className="ml-3 truncate font-mono text-[10.5px] uppercase tracking-[0.16em] text-text/65">
                  {product.name}
                </span>
              </div>

              <Image
                className="pr-shot block h-auto w-full"
                src={`/products/${product.shot}.webp`}
                alt={product.shotAlt}
                width={product.shotWidth}
                height={product.shotHeight}
                sizes="(min-width: 1280px) 1056px, (min-width: 1024px) 88vw, 92vw"
                quality={90}
              />
            </div>

            <figcaption className="mt-4 font-mono text-[10.5px] uppercase tracking-[0.16em] text-text/65">
              {product.name} — working system
            </figcaption>
          </figure>

          {/* ------------------------------------------- detail, in two columns */}
          <div
            className={`mt-16 grid gap-x-16 gap-y-12 lg:grid-cols-2 ${
              flip ? "lg:[&>*:first-child]:order-2" : ""
            }`}
          >
            <div className="min-w-0">
              {product.body.map((paragraph) => (
                <p
                  key={paragraph.slice(0, 32)}
                  className="pr-body mt-5 text-base leading-relaxed text-text/80 [text-wrap:pretty] first:mt-0 sm:text-[1.05rem] sm:leading-[1.7]"
                >
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="min-w-0">
              <p className="flex items-center gap-3">
                <span aria-hidden="true" className="block h-px w-6 bg-text/25" />
                <span className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-text/65">
                  What it does
                </span>
              </p>

              {/* Ruled like a spec sheet, because that is what it is — one
                  line per capability, each checkable against the screenshot
                  above it. */}
              <ul className="mt-6 border-t border-dotted border-text/20">
                {product.capabilities.map((capability) => (
                  <li
                    key={capability}
                    className="pr-cap flex items-baseline gap-3.5 border-b border-dotted border-text/20 py-3 text-[0.95rem] leading-snug text-text/85"
                  >
                    <span
                      aria-hidden="true"
                      className="mt-[0.45em] h-[5px] w-[5px] shrink-0 rotate-45 bg-cta"
                    />
                    <span className="[text-wrap:pretty]">{capability}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="pr-action mt-14">
            <Link
              href={demoHref(product)}
              className="group relative isolate inline-flex min-h-[56px] items-center justify-between gap-4 overflow-hidden rounded-full bg-primary py-2 pl-6 pr-2 text-[13px] font-semibold uppercase tracking-[0.1em] text-white [transition:scale_140ms_cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary active:scale-[0.97]"
            >
              <span
                aria-hidden="true"
                className="absolute inset-0 -z-10 origin-left scale-x-0 bg-navy transition-transform duration-500 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100 group-focus-visible:scale-x-100"
              />
              <span>
                Request a Demo
                <span className="sr-only"> of {product.name}</span>
              </span>
              <span
                aria-hidden="true"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15"
              >
                <Arrow className="transition-transform duration-500 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0.5" />
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
