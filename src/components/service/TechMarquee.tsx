"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { TECH_LOGOS } from "@/lib/service-pages/techLogos";
import { px } from "./parts";

/* The technology rows, for the navy Technology band: each group runs the
   full width of the screen as a slow row of logos, alternate rows in
   opposite directions, fading into the navy at both edges.

   Rows. A group with four or more technologies gets its own row. Smaller
   groups share one (Web Development's CMS & E-commerce and Databases), or
   join the next large group's row when too few to fill one, with
   a small marker in the track where each group starts — a two-logo row would
   read as a mistake. Groups with no logos at all (Integrations: "APIs",
   "Analytics"… are categories, not brands) are not animated; they sit below
   as one still, centred line.

   Colour. Every logo shows in its own brand colour, on a light tile: brand
   marks are drawn for light grounds, and several (Django, WordPress, MySQL)
   would all but disappear straight on navy.

   Motion. Pure CSS: each track holds the sequence twice and slides by exactly
   half its width, linear and forever, so the loop has no seam — a transform
   on the compositor, with no JavaScript running while it moves. It stops
   while off screen and while a mouse rests on a row; a tap or click on the
   rows pauses and resumes them; and under reduced motion they are still.

   Semantics. The moving copies are decoration and hidden from assistive tech;
   the real list is rendered once, visually hidden, as a definition list. */

type Group = { label: string; items: readonly string[] };

const MIN_TILES_PER_HALF = 12;

function buildRows(groups: readonly Group[]) {
  const withLogos = groups.filter((g) => g.items.some((i) => TECH_LOGOS[i]));
  const still = groups.filter((g) => !g.items.some((i) => TECH_LOGOS[i]));
  const rows: Group[][] = [];
  let pending: Group[] = [];
  const size = (gs: Group[]) => gs.reduce((n, g) => n + g.items.length, 0);

  for (const g of withLogos) {
    if (g.items.length >= 4) {
      /* Small groups waiting for company join this row rather than making a
         short row of their own (WordPress's CMS and E-commerce, one logo
         each). */
      if (pending.length && size(pending) >= 4) rows.push(pending);
      rows.push(pending.length && size(pending) < 4 ? [...pending, g] : [g]);
      pending = [];
    } else {
      pending.push(g);
      if (size(pending) >= 4) {
        rows.push(pending);
        pending = [];
      }
    }
  }
  if (pending.length) {
    if (rows.length && size(pending) < 4) rows[rows.length - 1].push(...pending);
    else rows.push(pending);
  }
  return { rows, still };
}

function Tile({ name }: { name: string }) {
  const logo = TECH_LOGOS[name];
  return (
    <span className="svt-tile" style={logo ? ({ "--brand": logo.hex } as CSSProperties) : undefined}>
      {logo && (
        <span
          className="svt-logo"
          data-backed={logo.backing ? "true" : undefined}
          style={
            {
              "--logo": `url(/tech/${logo.file}.svg)`,
              "--size": px(24 * (logo.scale ?? 1)),
              "--backing": logo.backing,
            } as CSSProperties
          }
        />
      )}
      <span className="svt-name">{name}</span>
    </span>
  );
}

/* Too few logos to fill a moving row (UI/UX Design has one: Figma) — a
   row would only repeat the same mark. They are shown still instead, each
   group on its own centred line. */
const MIN_MOVING = 6;

function StillTiles({ groups }: { groups: readonly Group[] }) {
  return (
    <div className="svt space-y-10">
      {groups.map((g) => {
        const withLogo = g.items.some((i) => TECH_LOGOS[i]);
        return (
          <div key={g.label} className="svt-still">
            <p className="svt-label">{g.label}</p>
            <ul className="mt-5 flex flex-wrap justify-center gap-2.5 px-4">
              {g.items.map((item) =>
                withLogo ? (
                  <li key={item} className="flex">
                    <Tile name={item} />
                  </li>
                ) : (
                  <li key={item} className="svt-pill">
                    {item}
                  </li>
                )
              )}
            </ul>
          </div>
        );
      })}
    </div>
  );
}

export default function TechMarquee({ groups }: { groups: readonly Group[] }) {
  const logos = groups.reduce((n, g) => n + g.items.filter((i) => TECH_LOGOS[i]).length, 0);
  if (logos < MIN_MOVING) return <StillTiles groups={groups} />;
  return <MovingRows groups={groups} />;
}

function MovingRows({ groups }: { groups: readonly Group[] }) {
  const { rows, still } = buildRows(groups);
  const rootRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);

  /* Nothing needs to move while the rows are off screen. */
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const io = new IntersectionObserver(([e]) => {
      root.dataset.offscreen = e.isIntersecting ? "false" : "true";
    });
    io.observe(root);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={rootRef} className="svt" data-paused={paused} data-offscreen="true">
      {/* The real list of the moving rows, for screen readers and search
          engines. (The still line below is ordinary text already.) */}
      <dl className="sr-only">
        {rows.flat().map((g) => (
          <div key={g.label}>
            <dt>{g.label}</dt>
            <dd>{g.items.join(", ")}</dd>
          </div>
        ))}
      </dl>

      {/* A tap or click anywhere on the rows pauses or resumes them. */}
      <div aria-hidden="true" className="space-y-9 sm:space-y-11" onClick={() => setPaused((p) => !p)}>
        {rows.map((row, r) => {
          const count = row.reduce((n, g) => n + g.items.length, 0);
          const repeats = Math.max(1, Math.ceil(MIN_TILES_PER_HALF / count));
          const tilesPerHalf = count * repeats;
          /* Slow and steady (~36px a second), each row a touch off the others
             so they never move in lockstep. */
          const duration = tilesPerHalf * 4.8 * [1, 1.12, 0.94, 1.06][r % 4];
          const merged = row.length > 1;

          const half = (copy: number) => (
            <div key={copy} className="svt-half" data-copy={copy}>
              {Array.from({ length: repeats }, (_, k) =>
                row.map((g) => (
                  <span key={`${k}-${g.label}`} className="contents" data-rep={k > 0 || undefined}>
                    {merged && <span className="svt-group">{g.label}</span>}
                    {g.items.map((item) => (
                      <Tile key={item} name={item} />
                    ))}
                  </span>
                ))
              )}
            </div>
          );

          return (
            <div key={r} className="svt-row">
              <p className="svt-label">
                {row.map((g, i) => (
                  <span key={g.label} className="contents">
                    {i > 0 && <span className="svt-label-sep" />}
                    {g.label}
                  </span>
                ))}
              </p>
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

      {still.map((g) => (
        <div key={g.label} className="svt-still">
          <p className="svt-label">{g.label}</p>
          <ul className="mt-5 flex flex-wrap justify-center gap-2.5 px-4">
            {g.items.map((item) => (
              <li key={item} className="svt-pill">
                {item}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
