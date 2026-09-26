"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import type { NavItem } from "@/components/admin/AdminNav";

/* Jump anywhere by typing. Ctrl+K, or Cmd+K on a Mac.

   Deliberately not animated on open. This is the fastest way through the
   panel and someone using it will open it dozens of times a day; a 200ms
   entrance is charming twice and then it is a tax. The same reasoning Raycast
   applies to itself.

   It searches the sections, and anything the current page chose to register —
   an enquiry list registers its enquiries, so "northline" finds the company
   without going through the inbox first.
   ------------------------------------------------------------------------ */

export type Command = {
  id: string;
  label: string;
  hint?: string;
  href: string;
};

export function CommandPalette({ items }: { items: readonly NavItem[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const commands: Command[] = useMemo(
    () => [
      ...items.map((item) => ({
        id: item.href,
        label: item.label,
        hint: "Section",
        href: item.href,
      })),
      { id: "account", label: "Your account", hint: "Section", href: "/admin/account" },
      {
        id: "new-enquiries",
        label: "Unread enquiries",
        hint: "Filter",
        href: "/admin/enquiries?status=new",
      },
      {
        id: "active-clients",
        label: "Active clients",
        hint: "Filter",
        href: "/admin/clients",
      },
    ],
    [items]
  );

  const results = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return commands;
    return commands.filter((command) =>
      `${command.label} ${command.hint ?? ""}`.toLowerCase().includes(term)
    );
  }, [commands, query]);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setIndex(0);
  }, []);

  const go = useCallback(
    (command: Command) => {
      close();
      router.push(command.href);
    },
    [close, router]
  );

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((current) => !current);
        return;
      }
      if (event.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  if (!open) return null;

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setIndex((i) => (results.length === 0 ? 0 : (i + 1) % results.length));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setIndex((i) => (results.length === 0 ? 0 : (i - 1 + results.length) % results.length));
    } else if (event.key === "Enter") {
      event.preventDefault();
      const chosen = results[index];
      if (chosen) go(chosen);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-start justify-center bg-navy/40 px-4 pt-[12vh] backdrop-blur-[2px]"
      onMouseDown={close}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search the panel"
        onMouseDown={(event) => event.stopPropagation()}
        className="w-full max-w-lg overflow-hidden rounded-xl border border-text/[0.09] bg-card shadow-[0_20px_60px_rgba(11,31,53,0.28)]"
      >
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(event) => {
            setQuery(event.currentTarget.value);
            setIndex(0);
          }}
          onKeyDown={onKeyDown}
          placeholder="Go to..."
          aria-label="Search the panel"
          className="w-full border-b border-text/[0.08] px-5 py-4 text-[0.95rem] text-text outline-none placeholder:text-text/30"
        />

        {results.length === 0 ? (
          <p className="px-5 py-6 text-[0.875rem] text-text/45">Nothing matches.</p>
        ) : (
          <ul className="max-h-[50vh] overflow-y-auto py-2">
            {results.map((command, i) => (
              <li key={command.id}>
                <button
                  type="button"
                  onMouseEnter={() => setIndex(i)}
                  onClick={() => go(command)}
                  className={`flex w-full items-center gap-3 px-5 py-2.5 text-left text-[0.9rem] transition-colors duration-100 ${
                    i === index ? "bg-primary/[0.06] text-primary" : "text-text/75"
                  }`}
                >
                  <span className="min-w-0 flex-1 truncate">{command.label}</span>
                  {command.hint && (
                    <span className="shrink-0 font-mono text-[9px] uppercase tracking-[0.14em] text-text/30">
                      {command.hint}
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className="flex items-center gap-4 border-t border-text/[0.08] px-5 py-2.5 font-mono text-[9px] uppercase tracking-[0.14em] text-text/30">
          <span>&uarr;&darr; move</span>
          <span>&crarr; open</span>
          <span>esc close</span>
        </div>
      </div>
    </div>
  );
}
