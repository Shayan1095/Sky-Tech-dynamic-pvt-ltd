"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { BRANDS, type Brand } from "@/lib/brands";

/* The brand wall, for the navy band under the results strip.

   The same rows as the Technology band on the service pages, and the same
   classes drive them (.svt-*, in globals.css): light tiles on a rail that
   runs the full width of the screen, alternate rows travelling in opposite
   directions, fading into the navy at both edges. Two sections that look the
   same should be the same thing, not two things that happen to match.

   What differs is only the mark. A technology logo is one colour, so it is
   drawn as a mask and painted in the brand's hex. A client's logo is their
   artwork — several colours, a photograph in one case, its own proportions —
   so it is an image, placed and sized and nothing else. Every logo keeps the
   shape its owner drew, which is why the tile sizes by height and lets the
   width fall where it may.

   Motion is CSS: each track holds the sequence twice and slides by exactly
   half its width, linear and forever, so the loop has no seam. It stops off
   screen, on hover, on a tap, and under reduced motion. No JavaScript runs
   while it moves.

   The moving copies are hidden from assistive technology; the real list is
   rendered once, visually hidden, so screen readers and search engines get
   a plain list of names rather than a carousel read three times over. */

/* Enough tiles that a row still fills a wide screen after the split. */
const MIN_TILES_PER_HALF = 10;

/* The logo's drawn height inside the tile. The built files are three times
   this, so they stay sharp on a phone. */
const LOGO_HEIGHT = 32;

/* A very wide wordmark would otherwise crowd out its neighbours. None of the
   current set reaches this; it is here so a future one cannot. */
const LOGO_MAX_WIDTH = 116;

/* Two rows reads as a wall; one reads as a ticker. A third only earns its
   place once there are enough brands that two rows would repeat visibly. */
function splitRows(brands: readonly Brand[]): Brand[][] {
  const count = brands.length >= 27 ? 3 : 2;
  const per = Math.ceil(brands.length / count);
  return Array.from({ length: count }, (_, i) => brands.slice(i * per, (i + 1) * per)).filter(
    (row) => row.length > 0
  );
}

function Tile({ brand }: { brand: Brand }) {
  const width = Math.min(LOGO_MAX_WIDTH, Math.round(LOGO_HEIGHT * brand.ratio));
  return (
    <span className="svt-tile">
      {/* Deliberately not next/image: these are already built to their final
          size by scripts/build-brand-logos.mjs, so there is nothing left to
          optimise, and routing 23 fixed thumbnails through the image service
          would spend Vercel's optimisation allowance to return the same
          bytes. Width and height are set so the row never reflows. */}
      {/* eslint-disable-next-line @next/next/no-img-element -- see above:
          already built to final size, and next/image would spend Vercel's
          optimisation allowance to hand back the same bytes. */}
      <img
        className="svt-brand"
        src={`/brands/${brand.file}.webp`}
        alt=""
        width={width}
        height={LOGO_HEIGHT}
        loading="lazy"
        decoding="async"
        style={{ "--logo-w": `${width}px` } as CSSProperties}
      />
      <span className="svt-name">{brand.name}</span>
    </span>
  );
}

export default function BrandMarquee() {
  const rows = splitRows(BRANDS);
  const rootRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);

  /* Nothing needs to move while the rows are off screen. */
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const io = new IntersectionObserver(([entry]) => {
      root.dataset.offscreen = entry.isIntersecting ? "false" : "true";
    });
    io.observe(root);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={rootRef} className="svt" data-paused={paused} data-offscreen="true">
      {/* The real list, once, for screen readers and search engines. */}
      <h3 className="sr-only">Brands SKY Tech has worked with</h3>
      <ul className="sr-only">
        {BRANDS.map((brand) => (
          <li key={brand.file}>{brand.name}</li>
        ))}
      </ul>

      {/* A tap or click anywhere on the rows pauses or resumes them. */}
      <div
        aria-hidden="true"
        className="space-y-5 sm:space-y-7"
        onClick={() => setPaused((p) => !p)}
      >
        {rows.map((row, r) => {
          const repeats = Math.max(1, Math.ceil(MIN_TILES_PER_HALF / row.length));
          const tilesPerHalf = row.length * repeats;
          /* Slow and steady, each row a touch off the other so they never
             travel in lockstep. */
          const duration = tilesPerHalf * 5.4 * [1, 1.13, 0.95][r % 3];

          const half = (copy: number) => (
            <div key={copy} className="svt-half" data-copy={copy}>
              {Array.from({ length: repeats }, (_, k) =>
                row.map((brand) => (
                  <span key={`${k}-${brand.file}`} className="contents" data-rep={k > 0 || undefined}>
                    <Tile brand={brand} />
                  </span>
                ))
              )}
            </div>
          );

          return (
            <div key={r} className="svt-row">
              <div className="svt-rail">
                <div className="svt-viewport">
                  <div
                    className="svt-track"
                    data-dir={r % 2 === 0 ? "right" : "left"}
                    style={{ "--dur": `${duration.toFixed(1)}s` } as CSSProperties}
                  >
                    {half(0)}
                    {half(1)}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
