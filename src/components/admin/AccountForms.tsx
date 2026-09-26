"use client";

import Image from "next/image";
import { useActionState, useState, useTransition } from "react";

import {
  changePassword,
  confirmTotpSetup,
  regenerateCodes,
  startTotpSetup,
  type CodesResult,
  type PasswordResult,
  type TotpSetup,
} from "@/lib/actions/account";
import { PasswordField } from "@/components/admin/PasswordField";

const FIELD =
  "w-full rounded-lg border border-text/12 bg-panel px-4 py-2.5 text-[0.9rem] text-text outline-none transition-colors duration-200 focus:border-primary focus:bg-card";

const LABEL = "font-mono text-[10px] uppercase tracking-[0.16em] text-text/40";

const BUTTON =
  "inline-flex min-h-[44px] items-center justify-center rounded-lg bg-primary px-5 font-mono text-[10px] uppercase tracking-[0.16em] text-white transition-[transform,opacity] duration-150 ease-out active:scale-[0.98] disabled:cursor-wait disabled:opacity-70";

const QUIET =
  "inline-flex min-h-[44px] items-center justify-center rounded-lg border border-text/15 px-5 font-mono text-[10px] uppercase tracking-[0.16em] text-text/65 transition-[color,border-color,transform] duration-150 ease-out hover:border-primary hover:text-primary active:scale-[0.98] disabled:cursor-wait disabled:opacity-60";

function Notice({ tone, children }: { tone: "bad" | "good"; children: React.ReactNode }) {
  const bad = tone === "bad";
  return (
    <div
      role={bad ? "alert" : "status"}
      className={`rounded-lg border px-4 py-3 text-[0.875rem] leading-relaxed text-text ${
        bad
          ? "border-[#b42318]/25 bg-[#b42318]/[0.05]"
          : "border-[#0a7c42]/25 bg-[#0a7c42]/[0.06]"
      }`}
    >
      {children}
    </div>
  );
}

/* Shown once and never again. Presented as something to act on rather than a
   list to glance at, because a recovery code nobody saved is not a recovery
   code — it is a lockout waiting for a lost phone. */
function RecoveryCodes({ codes }: { codes: string[] }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(codes.join("\n"));
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="rounded-lg border border-[#b06000]/30 bg-[#b06000]/[0.05] p-5">
      <p className="font-display text-[1rem] font-semibold tracking-[-0.01em] text-text">
        Save these now
      </p>
      <p className="mt-1.5 text-[0.85rem] leading-relaxed text-text/65">
        Each code signs you in once, in place of your authenticator. This is the only
        time they are shown. Keep them somewhere other than your phone.
      </p>

      <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-1.5 font-mono text-[0.9rem] text-text">
        {codes.map((code) => (
          <li key={code}>{code}</li>
        ))}
      </ul>

      <button type="button" onClick={copy} className={`${QUIET} mt-4`}>
        {copied ? "Copied" : "Copy all"}
      </button>
    </div>
  );
}

export function TwoFactorCard({
  enrolled,
  codesLeft,
}: {
  enrolled: boolean;
  codesLeft: number;
}) {
  const [setup, setSetup] = useState<{ qr: string; secret: string } | null>(null);
  const [startError, setStartError] = useState("");
  const [starting, startTransition] = useTransition();
  const [state, formAction, pending] = useActionState<TotpSetup, FormData>(
    confirmTotpSetup,
    null
  );

  const begin = () => {
    setStartError("");
    startTransition(async () => {
      const result = await startTotpSetup();
      if (result && "qr" in result) setSetup({ qr: result.qr, secret: result.secret });
      else if (result && "error" in result) setStartError(result.error);
    });
  };

  if (state && "done" in state) {
    return (
      <div className="flex flex-col gap-4">
        <Notice tone="good">Your authenticator is set up.</Notice>
        <RecoveryCodes codes={state.codes} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-[0.875rem] leading-relaxed text-text/60">
        {enrolled
          ? `An authenticator is set up, with ${codesLeft} recovery code${codesLeft === 1 ? "" : "s"} left.`
          : "No authenticator is set up on this account yet."}
      </p>

      {!setup ? (
        <>
          {startError && <Notice tone="bad">{startError}</Notice>}
          <button type="button" onClick={begin} disabled={starting} className={QUIET}>
            {starting ? "Preparing..." : enrolled ? "Replace authenticator" : "Set up authenticator"}
          </button>
          {enrolled && (
            <p className="text-[0.75rem] leading-relaxed text-text/35">
              Replacing it issues a new set of recovery codes and makes the old ones
              stop working.
            </p>
          )}
        </>
      ) : (
        <>
          <div className="flex flex-wrap items-start gap-5">
            <Image
              src={setup.qr}
              alt="QR code for your authenticator app"
              width={180}
              height={180}
              unoptimized
              className="rounded-lg border border-text/[0.09]"
            />
            <div className="min-w-0 flex-1">
              <p className="text-[0.85rem] leading-relaxed text-text/65">
                Scan this with Google Authenticator, Authy or 1Password. If you cannot
                scan, enter this key by hand:
              </p>
              <p className="mt-2 break-all rounded-lg border border-text/[0.09] bg-panel px-3 py-2 font-mono text-[0.78rem] text-text/75">
                {setup.secret}
              </p>
            </div>
          </div>

          <form action={formAction} className="flex flex-col gap-4">
            <label className="flex flex-col gap-1.5">
              <span className={LABEL}>Your password</span>
              <input
                name="password"
                type="password"
                required
                autoComplete="current-password"
                className={FIELD}
              />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className={LABEL}>Code from the app</span>
              <input
                name="code"
                type="text"
                required
                inputMode="numeric"
                maxLength={6}
                autoComplete="one-time-code"
                className={FIELD}
              />
            </label>

            {state && "error" in state && <Notice tone="bad">{state.error}</Notice>}

            <button type="submit" disabled={pending} className={BUTTON}>
              {pending ? "Checking..." : "Confirm"}
            </button>
          </form>
        </>
      )}
    </div>
  );
}

export function PasswordCard() {
  const [state, formAction, pending] = useActionState<PasswordResult, FormData>(
    changePassword,
    null
  );

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <PasswordField
        name="current"
        label="Current password"
        autoComplete="current-password"
        tone="light"
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <PasswordField
          name="next"
          label="New password"
          autoComplete="new-password"
          minLength={12}
          tone="light"
        />

        <PasswordField
          name="confirm"
          label="Repeat new password"
          autoComplete="new-password"
          minLength={12}
          tone="light"
        />
      </div>

      <label className="flex flex-col gap-1.5">
        <span className={LABEL}>Authenticator or recovery code</span>
        <input name="code" type="text" required autoComplete="one-time-code" className={FIELD} />
      </label>

      {state && "error" in state && <Notice tone="bad">{state.error}</Notice>}
      {state && "changed" in state && (
        <Notice tone="good">
          Password changed. Every other device has been signed out.
        </Notice>
      )}

      <p className="text-[0.75rem] leading-relaxed text-text/35">
        At least 12 characters. Changing it ends every other session — this one stays
        signed in.
      </p>

      <button type="submit" disabled={pending} className={`${BUTTON} self-start`}>
        {pending ? "Changing..." : "Change Password"}
      </button>
    </form>
  );
}

export function RecoveryCard({ codesLeft }: { codesLeft: number }) {
  const [state, formAction, pending] = useActionState<CodesResult, FormData>(
    regenerateCodes,
    null
  );

  if (state && "codes" in state) return <RecoveryCodes codes={state.codes} />;

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <p className="text-[0.875rem] leading-relaxed text-text/60">
        {codesLeft > 0
          ? `${codesLeft} unused code${codesLeft === 1 ? "" : "s"} remaining.`
          : "No recovery codes remain. Issue a new set before you need one."}
      </p>

      <label className="flex flex-col gap-1.5">
        <span className={LABEL}>Your password</span>
        <input
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className={FIELD}
        />
      </label>

      {state && "error" in state && <Notice tone="bad">{state.error}</Notice>}

      <button type="submit" disabled={pending} className={`${QUIET} self-start`}>
        {pending ? "Issuing..." : "Issue new codes"}
      </button>

      <p className="text-[0.75rem] leading-relaxed text-text/35">
        Issuing a new set immediately stops the old codes working.
      </p>
    </form>
  );
}
