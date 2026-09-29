import { money } from "@/components/admin/ui";

/* Charts, drawn by hand in SVG.

   No charting library. The panel needs three shapes, and a dependency that
   ships a hundred kilobytes to draw twelve rectangles is a bad trade — it also
   brings its own colours and type, which would make the panel look like two
   products stitched together.

   The chart is always drawn, from the first day, even with nothing in it: an
   empty frame is honest and shows where the data will appear, whereas a panel
   that stays blank until some threshold is met just looks broken.

   What is never done is inventing shape. A single measurement is drawn as a
   single point and labelled as such, not joined to the axis by a line that
   implies a trend nobody measured.
   ------------------------------------------------------------------------ */

export type Bucket = { label: string; value: number };

/* Which columns keep their label when there are too many to fit.

   Counted from the right, so the newest column always keeps its label. The
   obvious version — hiding every odd index — blanked whichever end happened
   to land on an odd number, and with twelve weeks or thirty days that was
   always the last one: the "now" column, the only one anybody looks for. */
function labelled(index: number, total: number): boolean {
  const step = Math.max(1, Math.ceil(total / 8));
  return (total - 1 - index) % step === 0;
}

function Caption({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-2 text-center font-mono text-[9px] uppercase tracking-[0.12em] text-text/30">
      {children}
    </p>
  );
}

/* Counts per period. Bars rather than a line: each period is a separate count,
   and a line between them would imply values in between that were never
   measured. Empty periods are drawn as a hairline on the axis, so the shape of
   the whole window is visible from the first day. */
export function WeeklyBars({ buckets, minWeeks = 4 }: { buckets: Bucket[]; minWeeks?: number }) {
  const withData = buckets.filter((b) => b.value > 0).length;
  const peak = Math.max(...buckets.map((b) => b.value), 1);
  const total = buckets.reduce((sum, b) => sum + b.value, 0);

  return (
    <div>
      {/* The columns must stretch to the full 140px. With items-end they were
          only as tall as their contents, and a percentage height against an
          auto-height parent resolves to auto — so every bar computed to zero
          and the chart showed its numbers floating over empty space. */}
      <div
        className="flex h-[140px] items-stretch gap-1.5"
        role="img"
        aria-label={`${total} in total across ${buckets.length} periods`}
      >
        {buckets.map((bucket, i) => {
          const height = bucket.value > 0 ? Math.max((bucket.value / peak) * 100, 4) : 1.5;
          return (
            <div
              key={`${i}-${bucket.label}`}
              className="flex min-w-0 flex-1 flex-col items-center gap-1.5"
            >
              <span className="font-mono text-[9px] leading-none text-text/40">
                {bucket.value > 0 ? bucket.value : ""}
              </span>
              {/* A track with a definite height, so the bar inside it has
                  something real to be a percentage of. */}
              <div className="relative w-full flex-1">
                <div
                  className={`absolute inset-x-0 bottom-0 rounded-t transition-[height] duration-300 ease-out ${
                    bucket.value > 0 ? "bg-primary/70" : "bg-text/[0.07]"
                  }`}
                  style={{ height: `${height}%` }}
                  title={`${bucket.label}: ${bucket.value}`}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-2 flex gap-1.5">
        {buckets.map((bucket, i) => (
          <span
            key={`${i}-${bucket.label}`}
            className="min-w-0 flex-1 text-center font-mono text-[9px] tracking-[0.04em] text-text/30"
          >
            {labelled(i, buckets.length) ? bucket.label : ""}
          </span>
        ))}
      </div>

      {withData === 0 && <Caption>Nothing recorded yet — bars appear as they arrive</Caption>}
      {withData > 0 && withData < minWeeks && (
        <Caption>
          {withData} of {minWeeks} periods so far — too early to read a trend
        </Caption>
      )}
    </div>
  );
}

export type Stage = { label: string; value: number; note?: string };

/* The funnel. Widths are proportional to the first stage, so the drop between
   stages is the thing you see — that drop is the entire point of the chart. */
export function Funnel({ stages }: { stages: Stage[] }) {
  const top = Math.max(stages[0]?.value ?? 0, 1);
  const empty = (stages[0]?.value ?? 0) === 0;

  return (
    <div>
      <ul className="flex flex-col gap-3">
        {stages.map((stage, i) => {
          const width = stage.value > 0 ? Math.max((stage.value / top) * 100, 3) : 0;
          const previous = stages[i - 1]?.value;
          const rate =
            previous && previous > 0 ? Math.round((stage.value / previous) * 100) : null;

          return (
            <li key={stage.label}>
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-[0.875rem] text-text/70">{stage.label}</span>
                <span className="flex items-baseline gap-2">
                  {rate !== null && (
                    <span className="font-mono text-[10px] text-text/35">{rate}%</span>
                  )}
                  <span className="font-display text-[1rem] font-semibold tracking-[-0.01em] text-text">
                    {stage.value}
                  </span>
                </span>
              </div>
              <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-text/[0.06]">
                <div
                  className="h-full rounded-full bg-primary/70 transition-[width] duration-300 ease-out"
                  style={{ width: `${width}%` }}
                />
              </div>
              {stage.note && <p className="mt-1 text-[0.75rem] text-text/35">{stage.note}</p>}
            </li>
          );
        })}
      </ul>

      {empty && <Caption>Fills in as enquiries arrive</Caption>}
    </div>
  );
}

/* Monthly recurring revenue over time.

   A line is honest here — the figure is a running total that genuinely exists
   on every day in between — but only once there are two points to join. One
   point is drawn as one point.

   Redrawn, and the reason is mostly one attribute. The old chart stretched a
   100×40 viewBox across the card with preserveAspectRatio="none", which scales
   x and y by different amounts: every circle came out an ellipse (which is why
   the single point had to be faked with an HTML span), and the line's weight
   changed with the width of the card. This one keeps its aspect and scales as
   a whole, so a circle is a circle and 2px is 2px.

   What it now says that it did not before: what the money actually is. There
   was no value scale at all — a shape rising to an unlabelled peak, with the
   current figure in a caption underneath. Now two recessive gridlines carry
   the peak and the half, every month is a marker you can hover for its own
   figure, and the newest figure is written once, beside the point it belongs
   to. One series, so no legend: the card's title names it.

   Hover is a native <title> per point. A tooltip library, or any JavaScript,
   would be a strange price to pay for twelve numbers in a panel that is
   otherwise entirely server-rendered. */
export function RevenueLine({ points }: { points: Bucket[] }) {
  const real = points.filter((p) => p.value > 0).length;
  const peak = Math.max(...points.map((p) => p.value), 1);
  const latest = points[points.length - 1]?.value ?? 0;

  /* The last month that had money in it, and the one before it, so the change
     quoted underneath is between two months that actually happened rather than
     across a gap where nothing was recorded. */
  const earned = points.filter((p) => p.value > 0);
  const previous = earned.length >= 2 ? earned[earned.length - 2].value : null;
  const change = previous !== null ? latest - previous : null;

  /* Room at the top for the value label, and at the foot for the months. */
  const W = 640;
  const H = 200;
  const PAD = { top: 26, right: 14, bottom: 26, left: 14 };
  const plotW = W - PAD.left - PAD.right;
  const plotH = H - PAD.top - PAD.bottom;

  const xAt = (i: number) =>
    points.length === 1 ? PAD.left + plotW / 2 : PAD.left + (i / (points.length - 1)) * plotW;
  const yAt = (value: number) => PAD.top + plotH - (value / peak) * plotH;

  const coords = points.map((point, i) => ({ x: xAt(i), y: yAt(point.value), point, i }));
  const line = coords.map((c, i) => `${i === 0 ? "M" : "L"}${c.x.toFixed(1)},${c.y.toFixed(1)}`).join(" ");
  const area = `${line} L${xAt(points.length - 1).toFixed(1)},${PAD.top + plotH} L${xAt(0).toFixed(1)},${PAD.top + plotH} Z`;

  const last = coords[coords.length - 1];
  /* Keep the label inside the frame when the newest point sits at the edge. */
  const labelAnchor = points.length === 1 ? "middle" : "end";

  return (
    <div>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-auto w-full"
        role="img"
        aria-label={
          real === 0
            ? "No recurring revenue recorded yet"
            : `Monthly recurring revenue over ${points.length} months, currently ${money(latest)} a month`
        }
      >
        <defs>
          {/* Fades out downward so the area reads as depth under the line
              rather than a second block of colour competing with it. */}
          <linearGradient id="rev-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.20" />
            <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0.01" />
          </linearGradient>
        </defs>

        {/* The scale: the peak, the half, and the floor. Recessive — they are
            there to be measured against, not looked at. */}
        {real >= 1 &&
          [peak, peak / 2].map((value) => (
            <g key={value}>
              <line
                x1={PAD.left}
                y1={yAt(value)}
                x2={W - PAD.right}
                y2={yAt(value)}
                stroke="var(--color-text)"
                strokeOpacity="0.09"
                strokeWidth="1"
                strokeDasharray="3 4"
                vectorEffect="non-scaling-stroke"
              />
              <text
                x={PAD.left}
                y={yAt(value) - 6}
                fill="var(--color-text)"
                fillOpacity="0.4"
                fontSize="11"
                fontFamily="var(--font-mono, ui-monospace)"
                letterSpacing="0.04em"
              >
                {money(value)}
              </text>
            </g>
          ))}

        {/* The floor is always drawn, so the chart has a shape on day one. */}
        <line
          x1={PAD.left}
          y1={PAD.top + plotH}
          x2={W - PAD.right}
          y2={PAD.top + plotH}
          stroke="var(--color-text)"
          strokeOpacity="0.14"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
        />

        {real >= 2 && (
          <>
            <path d={area} fill="url(#rev-fill)" />
            <path
              d={line}
              fill="none"
              stroke="var(--color-primary)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />
          </>
        )}

        {/* A marker per month, each carrying its own figure for a hover. The
            ring is --color-card: the surface the chart actually sits on, and
            the one the panel's dark theme redefines — --color-bg it leaves
            alone, which would have left a white dot on a dark card. So a
            marker sitting on the line still reads as a separate object, in
            either theme. */}
        {real >= 1 &&
          coords
            .filter((c) => c.point.value > 0)
            .map((c) => {
              const newest = c.i === coords.length - 1;
              return (
                <circle
                  key={c.point.label}
                  cx={c.x}
                  cy={c.y}
                  r={newest ? 5 : 4}
                  fill={newest ? "var(--color-primary)" : "var(--color-card)"}
                  stroke="var(--color-primary)"
                  strokeWidth="2"
                  vectorEffect="non-scaling-stroke"
                >
                  <title>{`${c.point.label} — ${money(c.point.value)} a month`}</title>
                </circle>
              );
            })}

        {/* Labelled once, on the figure that matters: what it is now. In text
            ink, not the series colour — the marker beside it carries that. */}
        {real >= 1 && (
          <text
            x={last.x + (labelAnchor === "end" ? 4 : 0)}
            y={Math.max(PAD.top - 10, last.y - 14)}
            textAnchor={labelAnchor}
            fill="var(--color-text)"
            fontSize="15"
            fontWeight="600"
            letterSpacing="-0.01em"
          >
            {money(latest)}
          </text>
        )}

        {/* Months along the foot, thinned the same way the bar charts thin
            theirs, so the newest always keeps its label. */}
        {points.map((point, i) =>
          labelled(i, points.length) ? (
            <text
              key={point.label}
              x={xAt(i)}
              y={H - 8}
              textAnchor={i === 0 ? "start" : i === points.length - 1 ? "end" : "middle"}
              fill="var(--color-text)"
              fillOpacity="0.35"
              fontSize="11"
              fontFamily="var(--font-mono, ui-monospace)"
              letterSpacing="0.06em"
            >
              {point.label}
            </text>
          ) : null
        )}
      </svg>

      {change !== null && change !== 0 && (
        <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.1em] text-text/45">
          {change > 0 ? "+" : "−"}
          {money(Math.abs(change))} on the month before
        </p>
      )}

      {real === 0 && <Caption>No active recurring work yet</Caption>}
      {real === 1 && <Caption>One month recorded — a line needs two</Caption>}
    </div>
  );
}
