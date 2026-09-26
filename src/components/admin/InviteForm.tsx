"use client";

import Image from "next/image";
import { useActionState, useState } from "react";

import { createAdmin, type InviteResult } from "@/lib/actions/invite";

/* Adding an administrator.

   Everything the new person needs is shown once, on one screen, and never
   again: a temporary password, the QR for their authenticator, and their
   recovery codes. There is no "resend" — if it is lost, the account is reset
   and a new set issued, which is the same decision made deliberately rather
   than a credential sitting in an inbox forever.

   Hand these over in person or through something that is not email. An email
   containing both a password and a second factor defeats the point of having
   two.
   ------------------------------------------------------------------------ */

const FIELD =
  "w-full rounded-lg border border-text/12 bg-panel px-4 py-2.5 text-[0.9rem] text-text outline-none transition-colors duration-200 focus:border-primary focus:bg-card";

const LABEL = "font-mono text-[10px] uppercase tracking-[0.16em] text-text/40";

export default function InviteForm() {
  const [state, formAction, pending] = useActionState<InviteResult, FormData>(
    createAdmin,
    null
  );
  const [copied, setCopied] = useState("");

  const copy = async (what: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(what);
    } catch {
      setCopied("");
    }
  };

  if (state && "created" in state) {
    return (
      <div className="flex flex-col gap-5">
        <div
          role="status"
          className="rounded-lg border border-[#b06000]/30 bg-[#b06000]/[0.05] p-5"
        >
          <p className="font-display text-[1rem] font-semibold tracking-[-0.01em] text-text">
            Hand these over now
          </p>
          <p className="mt-1.5 text-[0.85rem] leading-relaxed text-text/65">
            This screen is the only time any of it is shown. Give it to{" "}
            <strong className="font-semibold">{state.email}</strong> in person or over
            something that is not email — a password and a second factor sent through the
            same inbox are not two factors.
          </p>
          <p className="mt-2 text-[0.85rem] leading-relaxed text-text/65">
            They will be asked to choose their own password the first time they sign in,
            and cannot reach anything else until they do.
          </p>
        </div>

        <div className="rounded-lg border border-text/[0.09] bg-panel p-5">
          <p className={LABEL}>Temporary password</p>
          <p className="mt-2 break-all font-mono text-[0.95rem] text-text">{state.password}</p>
          <button
            type="button"
            onClick={() => copy("password", state.password)}
            className="mt-3 rounded-lg border border-text/15 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.16em] text-text/65 transition-colors duration-150 hover:border-primary hover:text-primary"
          >
            {copied === "password" ? "Copied" : "Copy"}
          </button>
        </div>

        <div className="rounded-lg border border-text/[0.09] bg-panel p-5">
          <p className={LABEL}>Authenticator</p>
          <div className="mt-3 flex flex-wrap items-start gap-5">
            <Image
              src={state.qr}
              alt="QR code for the new administrator's authenticator app"
              width={180}
              height={180}
              unoptimized
              className="rounded-lg border border-text/[0.09] bg-card"
            />
            <div className="min-w-0 flex-1">
              <p className="text-[0.85rem] leading-relaxed text-text/65">
                They scan this with Google Authenticator, Authy, 1Password or iPhone
                Passwords. If scanning is not possible, this key can be typed in:
              </p>
              <p className="mt-2 break-all rounded-lg border border-text/[0.09] bg-card px-3 py-2 font-mono text-[0.78rem] text-text/75">
                {state.secret}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-text/[0.09] bg-panel p-5">
          <p className={LABEL}>Recovery codes</p>
          <p className="mt-1.5 text-[0.8rem] leading-relaxed text-text/50">
            Ten codes, each usable once in place of the authenticator. Their way back in
            if the phone is lost.
          </p>
          <ul className="mt-3 grid grid-cols-2 gap-x-6 gap-y-1.5 font-mono text-[0.9rem] text-text">
            {state.codes.map((code) => (
              <li key={code}>{code}</li>
            ))}
          </ul>
          <button
            type="button"
            onClick={() => copy("codes", state.codes.join("\n"))}
            className="mt-4 rounded-lg border border-text/15 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.16em] text-text/65 transition-colors duration-150 hover:border-primary hover:text-primary"
          >
            {copied === "codes" ? "Copied" : "Copy all"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <form action={formAction} className="grid gap-4 sm:grid-cols-2">
      <label className="flex flex-col gap-1.5">
        <span className={LABEL}>Their name</span>
        <input name="name" type="text" required maxLength={100} className={FIELD} />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className={LABEL}>Their email</span>
        <input
          name="email"
          type="email"
          required
          maxLength={254}
          autoComplete="off"
          className={FIELD}
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className={LABEL}>Role</span>
        <select name="role" className={FIELD} defaultValue="editor">
          <option value="editor">Editor — can work here</option>
          <option value="owner">Owner — can also add and remove admins</option>
        </select>
      </label>

      <div className="flex items-end">
        <button
          type="submit"
          disabled={pending}
          aria-busy={pending}
          className="inline-flex min-h-[46px] w-full items-center justify-center rounded-lg bg-primary px-6 font-mono text-[10px] uppercase tracking-[0.16em] text-white transition-[transform,opacity] duration-150 ease-out active:scale-[0.98] disabled:cursor-wait disabled:opacity-70"
        >
          {pending ? "Creating..." : "Create Administrator"}
        </button>
      </div>

      {state && "error" in state && (
        <div
          role="alert"
          className="rounded-lg border border-[#b42318]/25 bg-[#b42318]/[0.05] px-4 py-3 text-[0.875rem] text-text sm:col-span-2"
        >
          {state.error}
        </div>
      )}

      <p className="text-[0.75rem] leading-relaxed text-text/35 sm:col-span-2">
        A temporary password and an authenticator are generated for them. You never
        choose someone else&apos;s password, and they must replace the temporary one
        before they can use the panel.
      </p>
    </form>
  );
}
