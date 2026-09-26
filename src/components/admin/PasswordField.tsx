"use client";

import { useState } from "react";

/* A password box you can read back.

   Typing a long password blind, twice, is where most sign-in frustration
   comes from — and a password manager's suggestion is worth being able to
   check. The button is a toggle rather than hold-to-reveal so it works the
   same with a keyboard.

   The field is never pre-filled by us and the value never leaves the form, so
   revealing it exposes nothing that is not already on the screen. */
export function PasswordField({
  id,
  name,
  label,
  autoComplete,
  minLength,
  hint,
  tone = "dark",
}: {
  id?: string;
  name: string;
  label: string;
  autoComplete: string;
  minLength?: number;
  hint?: string;
  /* "dark" is the navy sign-in screen; "light" is inside the panel. */
  tone?: "dark" | "light";
}) {
  const [shown, setShown] = useState(false);
  const fieldId = id ?? name;
  const dark = tone === "dark";

  return (
    <div>
      <label
        htmlFor={fieldId}
        className={
          dark
            ? "mb-2 block font-mono text-[10px] uppercase tracking-[0.2em] text-white/45"
            : "mb-2 block font-mono text-[10px] uppercase tracking-[0.16em] text-text/40"
        }
      >
        {label}
      </label>

      <div className="relative">
        <input
          id={fieldId}
          name={name}
          type={shown ? "text" : "password"}
          required
          minLength={minLength}
          autoComplete={autoComplete}
          spellCheck={false}
          className={
            dark
              ? "w-full rounded-lg border border-white/12 bg-white/[0.04] px-4 py-3 pr-16 text-[0.95rem] text-white outline-none transition-colors duration-200 placeholder:text-white/25 hover:border-white/20 focus:border-cta focus:bg-white/[0.07]"
              : "w-full rounded-lg border border-text/12 bg-panel px-4 py-2.5 pr-16 text-[0.9rem] text-text outline-none transition-colors duration-200 focus:border-primary focus:bg-card"
          }
        />

        <button
          type="button"
          onClick={() => setShown((current) => !current)}
          aria-pressed={shown}
          className={`absolute right-2 top-1/2 -translate-y-1/2 rounded px-2 py-1 font-mono text-[9px] uppercase tracking-[0.14em] transition-colors duration-150 ${
            dark ? "text-white/40 hover:text-cta" : "text-text/40 hover:text-primary"
          }`}
        >
          {shown ? "Hide" : "Show"}
        </button>
      </div>

      {hint && (
        <p
          className={
            dark
              ? "mt-2 font-mono text-[10px] tracking-[0.08em] text-white/30"
              : "mt-2 text-[0.75rem] text-text/35"
          }
        >
          {hint}
        </p>
      )}
    </div>
  );
}
