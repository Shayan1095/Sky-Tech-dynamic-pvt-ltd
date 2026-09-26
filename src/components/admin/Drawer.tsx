"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, type ReactNode } from "react";

/* A panel that slides in over the list.

   It exists so that reading an enquiry does not cost you your place. The
   address bar still changes to that enquiry, so the page can be reloaded,
   bookmarked or opened in a new tab and the full page appears instead — the
   drawer is a nicer way to arrive, not a different destination.

   Closing goes back rather than pushing a new address, so the browser's own
   back button and the close button do the same thing.

   Motion: 220ms, ease-out, from the right. It enters from the edge it lives
   on, which is what makes the direction meaningful rather than decorative.
   ------------------------------------------------------------------------ */

export function Drawer({ theme, path, title, subtitle, children }: {
  /* The drawer is rendered outside the panel's wrapper, so it carries the
     theme itself rather than inheriting it. */
  theme: "light" | "dark";
  /* The address this drawer belongs to. Next keeps a parallel route's slot
     mounted across a client-side navigation, so following a link out of the
     drawer would otherwise leave it hanging over the next page. Comparing
     against the live pathname is what closes it. */
  path: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const panel = useRef<HTMLDivElement>(null);
  const showing = pathname === path;

  useEffect(() => {
    if (!showing) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") router.back();
    };
    window.addEventListener("keydown", onKey);

    /* The page behind must not scroll while this is open, or closing the
       drawer leaves the list somewhere the reader never put it. */
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Focus moves into the panel, so a keyboard is not left behind the veil.
    panel.current?.focus();

    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [router, showing]);

  // Navigated away: the page underneath is the destination now.
  if (!showing) return null;

  return (
    <div className="adm fixed inset-0 z-50 flex justify-end" data-theme={theme} role="presentation">
      <button
        type="button"
        aria-label="Close"
        onClick={() => router.back()}
        className="drawer-veil absolute inset-0 cursor-default bg-navy/35"
      />

      <div
        ref={panel}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="drawer-panel relative flex h-full w-full max-w-[42rem] flex-col border-l border-text/[0.09] bg-panel shadow-[-12px_0_40px_rgba(11,31,53,0.18)] outline-none"
      >
        <div className="flex items-start justify-between gap-4 border-b border-text/[0.08] bg-card px-5 py-4 sm:px-6">
          <div className="min-w-0">
            <h2 className="truncate font-display text-[1.2rem] font-semibold tracking-[-0.015em] text-text">
              {title}
            </h2>
            {subtitle && (
              <p className="mt-0.5 truncate text-[0.85rem] text-text/50">{subtitle}</p>
            )}
          </div>
          <button
            type="button"
            onClick={() => router.back()}
            className="shrink-0 rounded-lg border border-text/15 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-text/60 transition-[color,border-color,transform] duration-150 ease-out hover:border-primary hover:text-primary active:scale-[0.97]"
          >
            Close
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-6">{children}</div>
      </div>
    </div>
  );
}
