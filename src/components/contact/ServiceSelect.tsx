"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { OTHER_SERVICE, SERVICE_GROUPS } from "@/lib/contact";

/* Branded service picker — a select-only combobox (WAI-ARIA APG pattern).
   Focus stays on the trigger; the highlighted option is exposed through
   aria-activedescendant. Keyboard: arrows, Home/End, PageUp/PageDown,
   Enter/Space to choose, Escape to close, and type-ahead by name. The value
   is posted through a hidden input, so the form and server action are
   unchanged. */

type Option = { name: string; category: string; index: number };

const GROUPS: Array<{ category: string; options: Option[] }> = [];
const OPTIONS: Option[] = [];
for (const group of SERVICE_GROUPS) {
  const options = group.services.map((s) => {
    const option = { name: s.name, category: group.category, index: OPTIONS.length };
    OPTIONS.push(option);
    return option;
  });
  GROUPS.push({ category: group.category, options });
}
const OTHER: Option = { name: OTHER_SERVICE, category: "", index: OPTIONS.length };
OPTIONS.push(OTHER);

const LAST = OPTIONS.length - 1;
const ERROR = "text-[#b42318]";

export default function ServiceSelect({
  name,
  label,
  placeholder,
  value,
  onChange,
  error,
  className = "",
}: {
  name: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  className?: string;
}) {
  const id = useId();
  const labelId = `${id}-label`;
  const listId = `${id}-list`;
  const errorId = `${id}-error`;
  const optionId = (index: number) => `${id}-option-${index}`;

  const rootRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const typed = useRef({ text: "", timer: 0 });
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);

  const selectedIndex = OPTIONS.findIndex((o) => o.name === value);
  const selected = selectedIndex >= 0 ? OPTIONS[selectedIndex] : null;

  const openList = (index = Math.max(selectedIndex, 0)) => {
    setActive(index);
    setOpen(true);
  };

  const choose = (index: number) => {
    onChange(OPTIONS[index].name);
    setOpen(false);
  };

  /* Close when pressing anywhere outside. */
  useEffect(() => {
    if (!open) return;
    const onPointer = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointer);
    return () => document.removeEventListener("pointerdown", onPointer);
  }, [open]);

  /* Keep the highlighted option in view — scrolls the list only, never the
     page. Leaves room for the sticky category header above it. */
  useEffect(() => {
    if (!open) return;
    const list = listRef.current;
    const el = document.getElementById(optionId(active));
    if (!list || !el) return;
    // Category names can wrap on phones, so measure the sticky header.
    const header = (el.parentElement?.firstElementChild as HTMLElement | null)?.offsetHeight ?? 0;
    const top = el.offsetTop;
    const bottom = top + el.offsetHeight;
    if (top - header < list.scrollTop) list.scrollTop = top - header;
    else if (bottom + 8 > list.scrollTop + list.clientHeight) list.scrollTop = bottom + 8 - list.clientHeight;
    // optionId only depends on the stable id.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, active]);

  const typeahead = (char: string, from: number) => {
    const t = typed.current;
    window.clearTimeout(t.timer);
    t.text += char.toLowerCase();
    t.timer = window.setTimeout(() => (t.text = ""), 500);
    // A fresh letter moves past the current match; a longer string refines it.
    const start = t.text.length === 1 ? from + 1 : Math.max(from, 0);
    for (let i = 0; i < OPTIONS.length; i++) {
      const index = (start + i) % OPTIONS.length;
      if (OPTIONS[index].name.toLowerCase().startsWith(t.text)) return index;
    }
    return -1;
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const { key, altKey, ctrlKey, metaKey } = event;

    if (!open) {
      if (key === "ArrowDown" || key === "ArrowUp" || key === "Enter" || key === " ") {
        event.preventDefault();
        openList();
        return;
      }
      if (key === "Home" || key === "End") {
        event.preventDefault();
        openList(key === "Home" ? 0 : LAST);
        return;
      }
    } else {
      switch (key) {
        case "ArrowDown":
          event.preventDefault();
          if (altKey) choose(active);
          else setActive((i) => Math.min(LAST, i + 1));
          return;
        case "ArrowUp":
          event.preventDefault();
          if (altKey) choose(active);
          else setActive((i) => Math.max(0, i - 1));
          return;
        case "Home":
          event.preventDefault();
          setActive(0);
          return;
        case "End":
          event.preventDefault();
          setActive(LAST);
          return;
        case "PageDown":
          event.preventDefault();
          setActive((i) => Math.min(LAST, i + 10));
          return;
        case "PageUp":
          event.preventDefault();
          setActive((i) => Math.max(0, i - 10));
          return;
        case "Enter":
          event.preventDefault();
          choose(active);
          return;
        case " ":
          // Space continues a type-ahead search; otherwise it chooses.
          if (!typed.current.text) {
            event.preventDefault();
            choose(active);
            return;
          }
          break;
        case "Escape":
          event.preventDefault();
          setOpen(false);
          return;
        case "Tab":
          choose(active);
          return;
      }
    }

    if (key.length === 1 && !altKey && !ctrlKey && !metaKey) {
      const index = typeahead(key, open ? active : selectedIndex);
      if (index >= 0) {
        event.preventDefault();
        openList(index);
      }
    }
  };

  const renderOption = (option: Option) => {
    const isActive = open && active === option.index;
    const isSelected = selectedIndex === option.index;
    return (
      <div
        key={option.name}
        id={optionId(option.index)}
        role="option"
        aria-selected={isSelected}
        onMouseMove={() => active !== option.index && setActive(option.index)}
        onClick={() => choose(option.index)}
        className={`relative mx-2 flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-[0.95rem] leading-snug transition-colors duration-200 ${
          isActive ? "bg-accent/70" : ""
        } ${isSelected || isActive ? "text-primary" : "text-text"} ${isSelected ? "font-medium" : ""}`}
      >
        <span
          aria-hidden="true"
          className={`h-1.5 w-1.5 shrink-0 rounded-full transition-colors duration-300 ${
            isSelected ? "bg-primary" : isActive ? "bg-cta" : "bg-text/15"
          }`}
        />
        <span className="min-w-0 flex-1">{option.name}</span>
        {isSelected ? (
          <svg aria-hidden="true" viewBox="0 0 16 16" className="h-4 w-4 shrink-0 text-primary" fill="none">
            <path d="M13 4.5 6.5 11 3 7.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : (
          <svg
            aria-hidden="true"
            viewBox="0 0 16 16"
            className={`h-3.5 w-3.5 shrink-0 text-primary transition-[opacity,translate] duration-300 ${
              isActive ? "translate-x-0 opacity-100" : "-translate-x-1 opacity-0"
            }`}
            fill="none"
          >
            <path d="M3 8h9.5M8.5 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>
    );
  };

  return (
    <div className={className}>
      <div ref={rootRef} className="relative">
        <span
          id={labelId}
          className={`pointer-events-none absolute left-0 top-1.5 z-10 text-[0.78rem] font-medium tracking-[0.01em] transition-colors duration-300 ${
            error ? ERROR : open ? "text-primary" : "text-text/55"
          }`}
        >
          {label}
        </span>

        {/* Trigger */}
        <div
          role="combobox"
          tabIndex={0}
          data-field={name}
          aria-labelledby={labelId}
          aria-controls={listId}
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-activedescendant={open ? optionId(active) : undefined}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          onClick={() => (open ? setOpen(false) : openList())}
          onKeyDown={onKeyDown}
          onBlur={(event) => {
            if (!rootRef.current?.contains(event.relatedTarget as Node | null)) setOpen(false);
          }}
          className={`group relative flex w-full cursor-pointer select-none items-center gap-4 border-b pb-3 pt-7 text-base outline-none transition-colors duration-300 ${
            error ? "border-[#b42318]" : "border-text/15 hover:border-text/30"
          }`}
        >
          <span className={`min-w-0 flex-1 truncate ${selected ? "text-text" : "text-text/45"}`}>
            {selected ? selected.name : placeholder}
          </span>
          {selected?.category && (
            <span className="hidden whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.16em] text-text/45 md:block">
              {selected.category}
            </span>
          )}
          <span
            aria-hidden="true"
            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-[rotate,background-color,border-color,color] duration-500 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] ${
              open
                ? "rotate-180 border-primary bg-primary text-white"
                : "border-text/15 text-text/60 group-hover:border-primary/50 group-hover:text-primary"
            }`}
          >
            <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none">
              <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <span
            aria-hidden="true"
            className={`absolute inset-x-0 -bottom-px h-[2px] origin-left bg-primary transition-transform duration-500 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-focus-visible:scale-x-100 ${
              open ? "scale-x-100" : "scale-x-0"
            }`}
          />
        </div>
        <input type="hidden" name={name} value={value} />

        {/* Panel — pressing inside it never moves focus off the trigger. */}
        <div
          onPointerDown={(event) => event.preventDefault()}
          className={`absolute inset-x-0 top-full z-30 mt-2 origin-top overflow-hidden rounded-[20px] border border-text/[0.08] bg-white shadow-[0_2px_4px_rgb(11_31_53/0.06),0_32px_64px_-24px_rgb(11_31_53/0.35)] transition-[opacity,translate,scale,visibility] duration-300 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] ${
            open ? "visible translate-y-0 scale-100 opacity-100" : "pointer-events-none invisible -translate-y-2 scale-[0.98] opacity-0"
          }`}
        >
          <span aria-hidden="true" className="block h-[3px] bg-[linear-gradient(to_right,var(--color-primary),var(--color-cta))]" />
          <div
            ref={listRef}
            id={listId}
            role="listbox"
            aria-labelledby={labelId}
            data-lenis-prevent
            className="relative max-h-[min(360px,55vh)] overflow-y-auto overscroll-contain pb-2 [scrollbar-color:rgb(0_107_184/0.35)_transparent] [scrollbar-width:thin]"
          >
            {GROUPS.map((group, g) => (
              <div key={group.category} role="group" aria-labelledby={`${id}-group-${g}`}>
                <div className="sticky top-0 z-10 flex items-center gap-3 bg-white/95 px-5 pb-2 pt-4 backdrop-blur-sm">
                  <span aria-hidden="true" className="font-mono text-[10px] tracking-[0.14em] text-primary">
                    0{g + 1}
                  </span>
                  <span id={`${id}-group-${g}`} className="font-mono text-[10px] uppercase leading-snug tracking-[0.12em] text-text/55 sm:tracking-[0.18em]">
                    {group.category}
                  </span>
                  <span aria-hidden="true" className="h-px flex-1 bg-text/[0.08]" />
                </div>
                {group.options.map(renderOption)}
              </div>
            ))}
            <span aria-hidden="true" className="mx-5 my-2 block h-px bg-text/[0.08]" />
            {renderOption(OTHER)}
          </div>
        </div>
      </div>
      {error && (
        <p id={errorId} className={`mt-2 text-[0.8rem] ${ERROR}`}>
          {error}
        </p>
      )}
    </div>
  );
}
