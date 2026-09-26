import { desc } from "drizzle-orm";

import { db } from "@/lib/server/db";
import { auditLog } from "@/lib/server/schema";

export const dynamic = "force-dynamic";

/* The audit log, read-only by design. Nothing in the panel can edit or delete
   an entry, including this page: a record that can be tidied up answers
   nothing. Failed sign-ins appear here too, which is how an attempt on the
   account becomes visible rather than silent. */

const when = (date: Date) =>
  new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
  }).format(date);

const TONE: Record<string, string> = {
  "login.success": "text-[#0a7c42]",
  "login.failed": "text-[#b42318]",
  "login.locked": "text-[#b42318]",
};

export default async function ActivityPage() {
  const handle = db();
  const rows = handle
    ? await handle.select().from(auditLog).orderBy(desc(auditLog.createdAt)).limit(200)
    : [];

  return (
    <div className="mx-auto max-w-[62rem] px-5 py-8 sm:px-8 sm:py-12">
      <div className="mb-8">
        <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-primary">Audit</p>
        <h1 className="mt-2 font-display text-[1.6rem] font-semibold tracking-[-0.02em] text-text sm:text-[1.9rem]">
          Activity
        </h1>
        <p className="mt-2 max-w-lg text-[0.9rem] leading-relaxed text-text/55">
          Every sign-in and every change, kept permanently and never editable.
        </p>
      </div>

      {rows.length === 0 ? (
        <div className="rounded-xl border border-dashed border-text/15 px-6 py-16 text-center">
          <p className="text-[0.9rem] text-text/55">Nothing recorded yet.</p>
        </div>
      ) : (
        <ul className="overflow-hidden rounded-xl border border-text/[0.09] bg-card">
          {rows.map((row) => (
            <li
              key={row.id}
              className="flex flex-wrap items-baseline gap-x-4 gap-y-1 border-b border-text/[0.06] px-5 py-3 last:border-b-0"
            >
              <span className="font-mono text-[10px] tracking-[0.08em] text-text/35">
                {when(row.createdAt)}
              </span>
              <span
                className={`font-mono text-[10px] uppercase tracking-[0.12em] ${
                  TONE[row.action] ?? "text-text/60"
                }`}
              >
                {row.action}
              </span>
              <span className="text-[0.875rem] text-text/70">{row.actor}</span>
              {row.detail && (
                <span className="text-[0.8rem] text-text/40">{row.detail}</span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
