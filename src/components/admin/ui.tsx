import type { ReactNode } from "react";

/* The panel's shared furniture. Defined once so every screen has the same
   rhythm — the same heading scale, the same card edge, the same mono label —
   rather than each page drifting into its own dialect. */

export function Page({
  eyebrow,
  title,
  lead,
  actions,
  children,
}: {
  eyebrow: string;
  title: string;
  lead?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="mx-auto max-w-[68rem] px-5 py-8 sm:px-8 sm:py-12">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-primary">{eyebrow}</p>
          <h1 className="mt-2 font-display text-[1.6rem] font-semibold tracking-[-0.02em] text-text sm:text-[1.9rem]">
            {title}
          </h1>
          {lead && (
            <p className="mt-2 max-w-lg text-[0.9rem] leading-relaxed text-text/55">{lead}</p>
          )}
        </div>
        {actions}
      </div>
      {children}
    </div>
  );
}

export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-xl border border-text/[0.09] bg-card p-5 ${className}`}>
      {children}
    </div>
  );
}

export function CardTitle({ children, note }: { children: ReactNode; note?: string }) {
  return (
    <div className="mb-4 flex items-baseline justify-between gap-3">
      <h2 className="font-mono text-[10px] uppercase tracking-[0.18em] text-text/45">{children}</h2>
      {note && <span className="font-mono text-[10px] tracking-[0.08em] text-text/30">{note}</span>}
    </div>
  );
}

/* A single figure. `note` is where a number is allowed to explain itself —
   what it excludes, or that it is a floor rather than a total. */
export function Stat({
  label,
  value,
  note,
  trend,
}: {
  label: string;
  value: string;
  note?: string;
  trend?: { value: number; label: string };
}) {
  const up = trend && trend.value > 0;
  const down = trend && trend.value < 0;
  return (
    <div className="rounded-xl border border-text/[0.09] bg-card px-5 py-4">
      <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-text/40">{label}</p>
      <p className="mt-2 font-display text-[1.6rem] font-semibold leading-none tracking-[-0.02em] text-text">
        {value}
      </p>
      <div className="mt-2 flex flex-wrap items-baseline gap-2">
        {trend && (
          <span
            className={`font-mono text-[10px] tracking-[0.06em] ${
              up ? "text-[#0a7c42]" : down ? "text-[#b42318]" : "text-text/35"
            }`}
          >
            {up ? "+" : ""}
            {trend.value}
            {" "}
            {trend.label}
          </span>
        )}
        {note && <span className="text-[0.75rem] text-text/35">{note}</span>}
      </div>
    </div>
  );
}

export function Empty({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-xl border border-dashed border-text/15 px-6 py-16 text-center">
      <p className="font-display text-[1.05rem] font-semibold tracking-[-0.01em] text-text">
        {title}
      </p>
      <p className="mx-auto mt-2 max-w-sm text-[0.9rem] leading-relaxed text-text/55">{body}</p>
    </div>
  );
}

const STATUS_STYLE: Record<string, string> = {
  new: "border-primary/25 bg-primary/[0.07] text-primary",
  read: "border-text/15 bg-text/[0.04] text-text/60",
  replied: "border-[#0a7c42]/25 bg-[#0a7c42]/[0.07] text-[#0a7c42]",
  archived: "border-text/12 bg-transparent text-text/40",
  lead: "border-primary/25 bg-primary/[0.07] text-primary",
  active: "border-[#0a7c42]/25 bg-[#0a7c42]/[0.07] text-[#0a7c42]",
  past: "border-text/15 bg-text/[0.04] text-text/55",
  lost: "border-text/12 bg-transparent text-text/40",
  proposed: "border-[#b06000]/25 bg-[#b06000]/[0.07] text-[#b06000]",
  completed: "border-text/15 bg-text/[0.04] text-text/55",
  cancelled: "border-text/12 bg-transparent text-text/40",
};

export function Pill({ status }: { status: string }) {
  return (
    <span
      className={`rounded-full border px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.14em] ${
        STATUS_STYLE[status] ?? STATUS_STYLE.read
      }`}
    >
      {status}
    </span>
  );
}

/* Server-rendered, so a fixed unambiguous format rather than the reader's
   locale: nobody has to work out whether 09/12 is September or December. */
export const shortDate = (date: Date) =>
  new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);

export const dateTime = (date: Date) =>
  new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
  }).format(date);

export const money = (amount: number) =>
  `$${Math.round(amount).toLocaleString("en-US")}`;
