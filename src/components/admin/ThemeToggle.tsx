"use client";

import { useState } from "react";

/* Light or dark, remembered in a cookie.

   A cookie rather than localStorage because the server has to know: it writes
   the attribute into the HTML it sends, so the panel arrives in the right
   theme instead of arriving light and correcting itself. That also means no
   inline script, which is what React 19 objects to.

   The click applies the change immediately by setting the attribute directly
   — waiting for a round trip to see a theme change would feel broken — and
   the cookie makes it stick for the next page.
   ------------------------------------------------------------------------ */

const COOKIE = "sky-admin-theme";
const ONE_YEAR = 60 * 60 * 24 * 365;

export function ThemeToggle({ initial }: { initial: "light" | "dark" }) {
  const [theme, setTheme] = useState<"light" | "dark">(initial);

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);

    // The panel's wrapper carries the attribute; find it from here.
    document.querySelector(".adm")?.setAttribute("data-theme", next);

    /* SameSite=Lax and no Secure flag in development, where there is no
       certificate. It holds a display preference and nothing else. */
    const secure = window.location.protocol === "https:" ? "; Secure" : "";
    document.cookie = `${COOKIE}=${next}; Path=/admin; Max-Age=${ONE_YEAR}; SameSite=Lax${secure}`;
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={theme === "dark"}
      title={theme === "dark" ? "Switch to light" : "Switch to dark"}
      className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/12 text-white/55 transition-[color,border-color,transform] duration-150 ease-out hover:border-white/25 hover:text-white active:scale-[0.95]"
    >
      <span className="sr-only">
        {theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
      </span>
      {theme === "dark" ? (
        <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" aria-hidden="true">
          <circle cx="8" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.4" />
          <path
            d="M8 1.2v1.6M8 13.2v1.6M1.2 8h1.6M13.2 8h1.6M3.2 3.2l1.1 1.1M11.7 11.7l1.1 1.1M12.8 3.2l-1.1 1.1M4.3 11.7l-1.1 1.1"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        </svg>
      ) : (
        <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" aria-hidden="true">
          <path
            d="M13.5 9.6A5.8 5.8 0 0 1 6.4 2.5a5.8 5.8 0 1 0 7.1 7.1z"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </button>
  );
}
