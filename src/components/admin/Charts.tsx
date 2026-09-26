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

/* Monthly recurring revenue over time. A line is honest here — the figure is a
   running total that genuinely exists on every day in between — but only once
   there are two points to join. One point is drawn as one point. */
export function RevenueLine({ points }: { points: Bucket[] }) {
  const real = points.filter((p) => p.value > 0).length;
  const peak = Math.max(...points.map((p) => p.value), 1);
  const width = 100;
  const height = 40;
  const latest = points[points.length - 1]?.value ?? 0;

  const coords = points.map((point, i) => {
    const x = points.length === 1 ? width / 2 : (i / (points.length - 1)) * width;
    const y = height - (point.value / peak) * (height - 4) - 2;
    return { x, y, point };
  });

  const line = coords
    .map((c, i) => `${i === 0 ? "M" : "L"}${c.x.toFixed(2)},${c.y.toFixed(2)}`)
    .join(" ");

  /* The lone point, if there is one. It is drawn as an HTML dot rather than
     an SVG circle: preserveAspectRatio="none" stretches the viewBox unevenly,
     which turned the circle into an ellipse, and a point on the last month
     sits exactly on the right edge, where the SVG clipped half of it away. */
  const only = real === 1 ? coords.find((c) => c.point.value > 0) : undefined;

  return (
    <div>
      <div className="relative">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
        className="h-[120px] w-full"
        role="img"
        aria-label={
          real === 0
            ? "No recurring revenue recorded yet"
            : `Monthly recurring revenue, currently ${money(latest)}`
        }
      >
        {/* The baseline is always there, so the chart has a shape on day one. */}
        <line
          x1="0"
          y1={height - 2}
          x2={width}
          y2={height - 2}
          stroke="var(--color-text)"
          strokeOpacity="0.12"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
        />

        {real >= 2 && (
          <>
            <path
              d={`${line} L${width},${height} L0,${height} Z`}
              fill="var(--color-primary)"
              opacity="0.08"
            />
            <path
              d={line}
              fill="none"
              stroke="var(--color-primary)"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />
          </>
        )}

      </svg>

        {only && (
          <span
            aria-hidden="true"
            className="absolute block h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary"
            style={{ left: `${only.x}%`, top: `${(only.y / height) * 100}%` }}
          />
        )}
      </div>

      <div className="mt-2 flex items-baseline justify-between font-mono text-[9px] tracking-[0.04em] text-text/30">
        <span>{points[0]?.label}</span>
        <span className="text-text/55">{money(latest)}/mo now</span>
        <span>{points[points.length - 1]?.label}</span>
      </div>

      {real === 0 && <Caption>No active recurring work yet</Caption>}
      {real === 1 && <Caption>One month recorded — a line needs two</Caption>}
    </div>
  );
}
