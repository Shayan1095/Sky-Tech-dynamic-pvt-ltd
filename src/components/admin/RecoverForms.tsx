"use client";

import Link from "next/link";
import { useActionState } from "react";

import { PasswordField } from "@/components/admin/PasswordField";

import {
  requestReset,
  resetPassword,
  type ForgotResult,
  type ResetResult,
} from "@/lib/actions/account";

/* The signed-out screens. They share the sign-in page's frame so arriving here
   does not feel like leaving the system. */

const FIELD =
  "w-full rounded-lg border border-white/12 bg-white/[0.04] px-4 py-3 text-[0.95rem] text-white outline-none transition-colors duration-200 placeholder:text-white/25 hover:border-white/20 focus:border-cta focus:bg-white/[0.07]";

const LABEL = "mb-2 block font-mono text-[10px] uppercase tracking-[0.2em] text-white/45";

const BUTTON =
  "mt-2 inline-flex min-h-[52px] items-center justify-center rounded-lg bg-cta px-6 text-sm font-semibold uppercase tracking-[0.1em] text-navy transition-[transform,opacity] duration-150 ease-out active:scale-[0.98] disabled:cursor-wait disabled:opacity-70";

function Shell({
  eyebrow,
  title,
  lead,
  children,
}: {
  eyebrow: string;
  title: string;
  lead: string;
  children: React.ReactNode;
}) {
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
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-cta">{eyebrow}</p>
          <h1 className="mt-3 font-display text-[1.75rem] font-semibold leading-tight tracking-[-0.02em] text-white">
            {title}
          </h1>
          <p className="mt-2 text-[0.9rem] leading-relaxed text-white/45">{lead}</p>
        </div>
        {children}
      </div>
    </div>
  );
}

function Alert({ tone, children }: { tone: "bad" | "good"; children: React.ReactNode }) {
  const bad = tone === "bad";
  return (
    <div
      role={bad ? "alert" : "status"}
      className={`rounded-lg border px-4 py-3 text-[0.875rem] leading-relaxed ${
        bad
          ? "border-[#ff6b6b]/30 bg-[#ff6b6b]/[0.08] text-[#ffc9c9]"
          : "border-cta/30 bg-cta/[0.08] text-white/85"
      }`}
    >
      {children}
    </div>
  );
}

export function ForgotForm() {
  const [state, formAction, pending] = useActionState<ForgotResult, FormData>(
    requestReset,
    null
  );

  return (
    <Shell
      eyebrow="Administration"
      title="Forgotten password"
      lead="We'll email you a link to set a new one."
    >
      {state && "sent" in state ? (
        <div className="flex flex-col gap-5">
          <Alert tone="good">
            If that address has an account, a link is on its way. It expires in 30
            minutes, and you will still need your authenticator or a recovery code to
            use it.
          </Alert>
          <Link
            href="/admin/login"
            className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/45 transition-colors duration-200 hover:text-cta"
          >
            &larr; Back to sign in
          </Link>
        </div>
      ) : (
        <form action={formAction} className="flex flex-col gap-5">
          <div>
            <label htmlFor="email" className={LABEL}>
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="username"
              className={FIELD}
            />
          </div>

          {state && "error" in state && <Alert tone="bad">{state.error}</Alert>}

          <button type="submit" disabled={pending} className={BUTTON}>
            {pending ? "Sending..." : "Send Reset Link"}
          </button>

          <Link
            href="/admin/login"
            className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/45 transition-colors duration-200 hover:text-cta"
          >
            &larr; Back to sign in
          </Link>
        </form>
      )}
    </Shell>
  );
}

export function ResetForm({ token }: { token: string }) {
  const [state, formAction, pending] = useActionState<ResetResult, FormData>(
    resetPassword,
    null
  );

  if (state && "done" in state) {
    return (
      <Shell
        eyebrow="Administration"
        title="Password changed"
        lead="Every device has been signed out."
      >
        <Link href="/admin/login" className={BUTTON}>
          Sign In
        </Link>
      </Shell>
    );
  }

  return (
    <Shell
      eyebrow="Administration"
      title="Choose a new password"
      lead="You will also need your authenticator, or one of your recovery codes."
    >
      <form action={formAction} className="flex flex-col gap-5">
        <input type="hidden" name="token" value={token} />

        <PasswordField
          name="next"
          label="New password"
          autoComplete="new-password"
          minLength={12}
          hint="At least 12 characters"
        />

        <PasswordField
          name="confirm"
          label="Repeat password"
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

        {state && "error" in state && <Alert tone="bad">{state.error}</Alert>}

        <button type="submit" disabled={pending} className={BUTTON}>
          {pending ? "Saving..." : "Set New Password"}
        </button>
      </form>
    </Shell>
  );
}
