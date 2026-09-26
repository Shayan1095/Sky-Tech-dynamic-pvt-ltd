"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo, useOptimistic, useRef, useState, useTransition } from "react";

import { Pill, shortDate } from "@/components/admin/ui";
import { useToast } from "@/components/admin/Toaster";
import { bulkSetStatus } from "@/lib/actions/enquiries";

/* The enquiry list: searching, filtering, and acting on several at once.

   Search and filters live in the URL rather than in component state. That is
   what makes a filtered list something you can bookmark, reload without
   losing, and send to someone else — and it means the server does the
   filtering, so this stays correct past the first hundred rows.
   ------------------------------------------------------------------------ */

export type Row = {
  id: number;
  reference: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  country: string;
  service: string;
  packageName: string;
  budget: string;
  estimate: string;
  details: string;
  timeline: string;
  status: string;
  createdAt: Date;
};

const STATUSES = ["new", "read", "replied", "archived"] as const;

export function EnquiryFilters({ total }: { total: number }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [pending, startTransition] = useTransition();

  const status = params.get("status") ?? "";
  const query = params.get("q") ?? "";
  const [text, setText] = useState(query);

  /* Keeps the box in step when the URL changes from somewhere else — the back
     button, or a link into a filtered view. Adjusted during render rather than
     in an effect, which is React's own recommendation: an effect would paint
     the stale value first and then correct it. */
  const [lastQuery, setLastQuery] = useState(query);
  if (query !== lastQuery) {
    setLastQuery(query);
    setText(query);
  }

  const apply = useMemo(
    () => (next: { q?: string; status?: string }) => {
      const updated = new URLSearchParams(params.toString());
      for (const [key, value] of Object.entries(next)) {
        if (value) updated.set(key, value);
        else updated.delete(key);
      }
      startTransition(() => router.replace(`${pathname}?${updated.toString()}`));
    },
    [params, pathname, router]
  );

  /* Typing settles before the URL changes, so a five-letter search is one
     query rather than five. */
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onType = (value: string) => {
    setText(value);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => apply({ q: value }), 300);
  };

  return (
    <div className="mb-5 flex flex-wrap items-center gap-3">
      <div className="relative min-w-[14rem] flex-1">
        <input
          type="search"
          value={text}
          onChange={(event) => onType(event.currentTarget.value)}
          placeholder="Search name, company, email, reference..."
          aria-label="Search enquiries"
          className="w-full rounded-lg border border-text/12 bg-card px-4 py-2.5 pr-20 text-[0.9rem] text-text outline-none transition-colors duration-200 placeholder:text-text/30 focus:border-primary"
        />
        <span
          aria-live="polite"
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 font-mono text-[10px] tracking-[0.06em] text-text/30"
        >
          {pending ? "..." : `${total}`}
        </span>
      </div>

      <div className="flex flex-wrap gap-1.5">
        <button
          type="button"
          onClick={() => apply({ status: "" })}
          aria-pressed={status === ""}
          className={chip(status === "")}
        >
          All
        </button>
        {STATUSES.map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => apply({ status: value === status ? "" : value })}
            aria-pressed={status === value}
            className={chip(status === value)}
          >
            {value}
          </button>
        ))}
      </div>
    </div>
  );
}

const chip = (active: boolean) =>
  `rounded-lg border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] transition-[color,border-color,background-color,transform] duration-150 ease-out active:scale-[0.97] ${
    active
      ? "border-primary bg-primary/[0.06] text-primary"
      : "border-text/12 text-text/55 hover:border-primary hover:text-primary"
  }`;

export function EnquiryList({ rows }: { rows: Row[] }) {
  const toast = useToast();
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [pending, startTransition] = useTransition();

  /* The list updates the moment a status is applied, and snaps back on its
     own if the server refuses — React discards the optimistic value when the
     transition ends without the real data changing. */
  const [shown, applyOptimistic] = useOptimistic(
    rows,
    (current: Row[], change: { ids: number[]; status: string }) =>
      current.map((row) =>
        change.ids.includes(row.id) ? { ...row, status: change.status } : row
      )
  );

  const toggle = (id: number) => {
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const allShown = shown.length > 0 && shown.every((row) => selected.has(row.id));
  const toggleAll = () =>
    setSelected(allShown ? new Set() : new Set(shown.map((row) => row.id)));

  const run = (status: string) => {
    const ids = [...selected];
    if (ids.length === 0) return;

    const data = new FormData();
    data.set("status", status);
    for (const id of ids) data.append("ids", String(id));

    startTransition(async () => {
      applyOptimistic({ ids, status });
      await bulkSetStatus(data);
      setSelected(new Set());
      toast(`${ids.length} enquir${ids.length === 1 ? "y" : "ies"} marked ${status}.`);
    });
  };

  return (
    <div>
      {shown.length > 0 && (
        <div className="mb-3 flex flex-wrap items-center gap-3">
          <label className="flex cursor-pointer items-center gap-2 text-[0.8rem] text-text/55">
            <input
              type="checkbox"
              checked={allShown}
              onChange={toggleAll}
              className="h-4 w-4 accent-[#006bb8]"
            />
            Select all
          </label>

          {selected.size > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-primary">
                {selected.size} selected
              </span>
              {STATUSES.map((status) => (
                <button
                  key={status}
                  type="button"
                  disabled={pending}
                  onClick={() => run(status)}
                  className="rounded-lg border border-text/15 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-text/60 transition-[color,border-color,transform] duration-150 ease-out hover:border-primary hover:text-primary active:scale-[0.97] disabled:opacity-50"
                >
                  Mark {status}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <ul className="flex flex-col gap-3">
        {shown.map((row) => (
          <li
            key={row.id}
            className={`group rounded-xl border bg-card p-5 transition-[border-color,box-shadow] duration-200 ${
              selected.has(row.id)
                ? "border-primary/40 shadow-[0_1px_3px_rgba(0,107,184,0.08)]"
                : "border-text/[0.09] hover:border-text/20 hover:shadow-[0_1px_3px_rgba(11,31,53,0.06)]"
            }`}
          >
            <div className="flex items-start gap-4">
              <input
                type="checkbox"
                checked={selected.has(row.id)}
                onChange={() => toggle(row.id)}
                aria-label={`Select ${row.reference}`}
                className="mt-1 h-4 w-4 shrink-0 accent-[#006bb8]"
              />

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-text/35">
                        {row.reference}
                      </span>
                      <Pill status={row.status} />
                    </div>

                    <Link
                      href={`/admin/enquiries/${row.id}`}
                      className="mt-2 block font-display text-[1.05rem] font-semibold tracking-[-0.01em] text-text underline-offset-4 hover:underline"
                    >
                      {row.name}
                      <span className="font-sans font-normal text-text/45"> · {row.company}</span>
                    </Link>

                    <p className="mt-1 text-[0.875rem] text-text/55">
                      {row.service || "No service specified"}
                      {row.packageName && ` · ${row.packageName}`}
                      {row.budget && ` · ${row.budget}`}
                    </p>
                  </div>

                  <div className="text-right">
                    {row.estimate && (
                      <p className="font-display text-[1.05rem] font-semibold tracking-[-0.01em] text-text">
                        {row.estimate}
                      </p>
                    )}
                    <p className="mt-1 font-mono text-[10px] tracking-[0.08em] text-text/35">
                      {shortDate(row.createdAt)}
                    </p>
                  </div>
                </div>

                {row.details && (
                  <p className="mt-3 line-clamp-2 border-t border-text/[0.07] pt-3 text-[0.9rem] leading-relaxed text-text/65">
                    {row.details}
                  </p>
                )}

                <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 font-mono text-[10px] tracking-[0.06em] text-text/40">
                  <a
                    href={`mailto:${row.email}`}
                    className="underline-offset-4 transition-colors duration-200 hover:text-primary hover:underline"
                  >
                    {row.email}
                  </a>
                  <a
                    href={`tel:${row.phone.replace(/\s/g, "")}`}
                    className="transition-colors duration-200 hover:text-primary"
                  >
                    {row.phone}
                  </a>
                  <span>{row.country}</span>
                  {row.timeline && <span>Timeline: {row.timeline}</span>}
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
