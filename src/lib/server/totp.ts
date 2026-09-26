import "server-only";

import { TOTP, Secret } from "otpauth";

/* ---------------------------------------------------------------------------
   Two-factor authentication.

   Standard TOTP: 6 digits, 30-second steps, SHA-1 — the combination every
   authenticator app supports, including Google Authenticator, which is the
   one most people already have.

   A window of 1 accepts the previous and next step as well as the current one,
   which covers a phone clock that is slightly out. That is also why the last
   accepted step is recorded against the account: without it, a code seen over
   someone's shoulder stays usable for the rest of its window.
   ------------------------------------------------------------------------ */

const ISSUER = "SKY Tech Dynamic";
const WINDOW = 1;

function build(secret: string, label: string): TOTP {
  return new TOTP({
    issuer: ISSUER,
    label,
    algorithm: "SHA1",
    digits: 6,
    period: 30,
    secret: Secret.fromBase32(secret),
  });
}

/** A fresh base32 secret for enrolment. 20 bytes, as RFC 4226 recommends. */
export function newSecret(): string {
  return new Secret({ size: 20 }).base32;
}

/** otpauth:// URI for the QR code an authenticator app scans. */
export function enrolmentUri(secret: string, email: string): string {
  return build(secret, email).toString();
}

export type TotpResult = { ok: false } | { ok: true; step: number };

/* Returns the matched step so the caller can store it and refuse that same
   step again. A step at or below the last accepted one is a replay and is
   rejected even though the code itself is arithmetically correct. */
export function verifyTotp(
  secret: string,
  code: string,
  lastStep: number | null
): TotpResult {
  const cleaned = code.replace(/\D/g, "");
  if (cleaned.length !== 6) return { ok: false };

  const delta = build(secret, "").validate({ token: cleaned, window: WINDOW });
  if (delta === null) return { ok: false };

  const step = Math.floor(Date.now() / 1000 / 30) + delta;
  if (lastStep !== null && step <= lastStep) return { ok: false };

  return { ok: true, step };
}
