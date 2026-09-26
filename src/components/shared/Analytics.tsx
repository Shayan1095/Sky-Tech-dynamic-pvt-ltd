"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

/* Tells the server a page was read.

   Fired after the page is interactive and sent with `keepalive`, so it never
   competes with anything the visitor is waiting for and survives them
   navigating away immediately.

   Two things are deliberately respected: Do Not Track, and a referrer from
   this same site — an internal link is not a source of traffic and counting
   it as one would make the referrer list meaningless. */
export function Analytics() {
  const pathname = usePathname();
  const lastSent = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname || lastSent.current === pathname) return;

    const dnt =
      navigator.doNotTrack === "1" ||
      (window as unknown as { doNotTrack?: string }).doNotTrack === "1";
    if (dnt) return;

    const referrer =
      document.referrer && !document.referrer.startsWith(window.location.origin)
        ? document.referrer
        : "";

    const body = JSON.stringify({ path: pathname, referrer });

    /* A timeout keeps this off the critical path entirely — the page is
       already usable before anything is sent. */
    const timer = window.setTimeout(() => {
      /* Marked as sent here rather than when the effect runs. React mounts an
         effect twice in development, and marking it early meant the second
         mount saw the path as already counted and scheduled nothing — so the
         count silently never happened while developing. */
      lastSent.current = pathname;

      void fetch("/api/view", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
        keepalive: true,
      }).catch(() => {
        // A failed count is not worth telling anyone about.
      });
    }, 600);

    return () => window.clearTimeout(timer);
  }, [pathname]);

  return null;
}
