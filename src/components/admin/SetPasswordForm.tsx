"use client";

import Link from "next/link";
import { useActionState } from "react";

import { PasswordField } from "@/components/admin/PasswordField";
import { changePassword, type PasswordResult } from "@/lib/actions/account";

/* The screen a newly created administrator lands on.

   It reuses the ordinary password change, which is the point: the temporary
   password is proved, a second factor is proved, and only then does the
   account become theirs. Nothing about this path is weaker than the normal
   one — it is the normal one, with the panel closed until it is done.
   ------------------------------------------------------------------------ */

const LABEL = "mb-2 block font-mono text-[10px] uppercase tracking-[0.2em] text-white/45";

const FIELD =
  "w-full rounded-lg border border-white/12 bg-white/[0.04] px-4 py-3 text-[0.95rem] text-white outline-none transition-colors duration-200 placeholder:text-white/25 hover:border-white/20 focus:border-cta focus:bg-white/[0.07]";

const BUTTON =
  "mt-2 inline-flex min-h-[52px] items-center justify-center rounded-lg bg-cta px-6 text-sm font-semibold uppercase tracking-[0.1em] text-navy transition-[transform,opacity] duration-150 ease-out active:scale-[0.98] disabled:cursor-wait disabled:opacity-70";

export function SetPasswordForm({ name }: { name: string }) {
  const [state, formAction, pending] = useActionState<PasswordResult, FormData>(
    changePassword,
    null
  );

  const done = state !== null && "changed" in state;

  return (
    <div className="flex min-h-dvh items-center justify-center bg-navy px-6 py-16">
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
            Welcome, {name}
          </p>
          <h1 className="mt-3 font-display text-[1.75rem] font-semibold leading-tight tracking-[-0.02em] text-white">
            {done ? "You're all set" : "Choose your password"}
          </h1>
          <p className="mt-2 text-[0.9rem] leading-relaxed text-white/45">
            {done
              ? "Your account is now yours alone. The temporary password no longer works."
              : "Someone else created this account and still knows the password it came with. Replace it before going any further."}
          </p>
        </div>

        {done ? (
          <Link href="/admin" className={BUTTON}>
            Open The Panel
          </Link>
        ) : (
          <form action={formAction} className="flex flex-col gap-5">
            <PasswordField
              name="current"
              label="Temporary password"
              autoComplete="current-password"
            />

            <PasswordField
              name="next"
              label="New password"
              autoComplete="new-password"
              minLength={12}
              /* Password managers tend to fill every box on this screen with
                 the temporary password they just saved, which reads as a
                 refusal to accept a perfectly good new one. */
              hint="At least 12 characters. If your browser fills this in, clear it first."
            />

            <PasswordField
              name="confirm"
              label="Repeat new password"
              autoComplete="new-password"
              minLength={12}
            />

            <div>
              <label htmlFor="code" className={LABEL}>
                Authenticator or recovery code
              </label>
              <input
                id="code"
                name="code"
                type="text"
                required
                autoComplete="one-time-code"
                className={FIELD}
              />
            </div>

            {state && "error" in state && (
              <div
                role="alert"
                className="rounded-lg border border-[#ff6b6b]/30 bg-[#ff6b6b]/[0.08] px-4 py-3 text-[0.875rem] leading-relaxed text-[#ffc9c9]"
              >
                {state.error}
              </div>
            )}

            <button type="submit" disabled={pending} className={BUTTON}>
              {pending ? "Saving..." : "Set My Password"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
