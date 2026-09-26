"use client";

import Link from "next/link";
import { useActionState } from "react";
import { PasswordField } from "@/components/admin/PasswordField";
import { signIn, type SignInResult } from "@/lib/actions/admin";

/* The sign-in screen. Everything is asked for at once — email, password and
   the six-digit code — so there is no halfway state between screens for an
   attacker to work against, and no second page for a legitimate admin to
   wait for. */

const initial: SignInResult = null;

function Field({
  name,
  label,
  type,
  hint,
  autoComplete,
  inputMode,
  maxLength,
  optional,
}: {
  name: string;
  label: string;
  type: string;
  hint?: string;
  autoComplete: string;
  inputMode?: "numeric";
  maxLength?: number;
  optional?: boolean;
}) {
  return (
    <div className="group">
      <label
        htmlFor={name}
        className="mb-2 block font-mono text-[10px] uppercase tracking-[0.2em] text-white/45"
      >
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={!optional}
        autoComplete={autoComplete}
        inputMode={inputMode}
        maxLength={maxLength}
        spellCheck={false}
        className="w-full rounded-lg border border-white/12 bg-white/[0.04] px-4 py-3 text-[0.95rem] text-white outline-none transition-colors duration-200 placeholder:text-white/25 hover:border-white/20 focus:border-cta focus:bg-white/[0.07]"
      />
      {hint && <p className="mt-2 font-mono text-[10px] tracking-[0.08em] text-white/30">{hint}</p>}
    </div>
  );
}

export default function LoginForm() {
  const [state, formAction, pending] = useActionState(signIn, initial);

  return (
    <div className="flex min-h-dvh items-center justify-center bg-navy px-6 py-16">
      {/* A single faint drafting grid, the same device the site uses, so the
          panel reads as part of the same system rather than a stock template. */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
          backgroundSize: "72px 72px",
        }}
      />

      <div className="relative w-full max-w-[26rem]">
        <div className="mb-10">
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-cta">
            Administration
          </p>
          <h1 className="mt-3 font-display text-[1.75rem] font-semibold leading-tight tracking-[-0.02em] text-white">
            SKY Tech Dynamic
          </h1>
          <p className="mt-2 text-[0.9rem] leading-relaxed text-white/45">
            Signing in requires your password and your authenticator code.
          </p>
        </div>

        <form action={formAction} className="flex flex-col gap-5">
          <Field name="email" label="Email" type="email" autoComplete="username" />
          <PasswordField
            name="password"
            label="Password"
            autoComplete="current-password"
          />
          <Field
            name="code"
            label="Authenticator Or Recovery Code"
            type="text"
            autoComplete="one-time-code"
            inputMode="numeric"
            maxLength={14}
            optional
            hint="Leave empty on a device you have already trusted"
          />

          <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3">
            <input
              name="trust"
              type="checkbox"
              defaultChecked
              className="mt-0.5 h-4 w-4 accent-[#00c2ff]"
            />
            <span>
              <span className="block text-[0.875rem] text-white/85">
                Trust this device for 30 days
              </span>
              <span className="mt-1 block text-[0.78rem] leading-relaxed text-white/40">
                Your password is still needed every time. Only the code is skipped, and
                only on this browser.
              </span>
            </span>
          </label>

          {state?.error && (
            <div
              role="alert"
              className="rounded-lg border border-[#ff6b6b]/30 bg-[#ff6b6b]/[0.08] px-4 py-3 text-[0.875rem] text-[#ffc9c9]"
            >
              {state.error}
            </div>
          )}

          <button
            type="submit"
            disabled={pending}
            aria-busy={pending}
            className="mt-2 inline-flex min-h-[52px] items-center justify-center rounded-lg bg-cta px-6 text-sm font-semibold uppercase tracking-[0.1em] text-navy transition-[transform,opacity] duration-150 ease-out active:scale-[0.98] disabled:cursor-wait disabled:opacity-70"
          >
            {pending ? "Checking…" : "Sign In"}
          </button>
        </form>

        <Link
          href="/admin/forgot"
          className="mt-6 inline-block font-mono text-[10px] uppercase tracking-[0.16em] text-white/45 transition-colors duration-200 hover:text-cta"
        >
          Forgotten your password?
        </Link>

        <p className="mt-8 font-mono text-[10px] uppercase tracking-[0.16em] text-white/25">
          Authorised access only · All activity is logged
        </p>
      </div>
    </div>
  );
}
