/* Creates the first administrator, or resets an existing one.

   Run: npm run admin:create

   Everything secret is typed in here and never passes through anyone else:
   the password is read without being echoed, hashed with scrypt, and the plain
   text is discarded. The two-factor secret is generated locally and shown once
   as a QR code for you to scan — after that it is only ever compared, never
   displayed again. */

import "./load-env.mjs";

import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";
import { createHash, randomBytes, randomInt, scrypt } from "node:crypto";

import mysql from "mysql2/promise";
import QRCode from "qrcode";
import { Secret, TOTP } from "otpauth";

const N = 32768;
const R = 8;
const P = 1;

const ESC = String.fromCharCode(27);
const NEWLINE = String.fromCharCode(10);
const RETURN = String.fromCharCode(13);
const EOT = String.fromCharCode(4);

/* Recovery codes, generated exactly as the panel generates them: ten codes,
   stored only as SHA-256, shown once here and never again. Without these an
   account whose authenticator is lost has no way back in at all — the reset
   link still asks for a second factor, by design. */
const RECOVERY_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function recoveryCode() {
  let out = "";
  for (let i = 0; i < 10; i += 1) out += RECOVERY_ALPHABET[randomInt(RECOVERY_ALPHABET.length)];
  return out.slice(0, 5) + "-" + out.slice(5);
}

const sha256 = (value) => createHash("sha256").update(value).digest("hex");

const hash = (password) =>
  new Promise((resolve, reject) => {
    const salt = randomBytes(16);
    scrypt(
      password.normalize("NFKC"),
      salt,
      32,
      { N, r: R, p: P, maxmem: 256 * 1024 * 1024 },
      (error, key) => {
        if (error) reject(error);
        else resolve(["scrypt", N, R, P, salt.toString("base64"), key.toString("base64")].join("$"));
      }
    );
  });

/* Reads a line without printing it. Node has no built-in for this, so the
   line is repainted as asterisks as it is typed. If a terminal will not accept
   that, masking is abandoned rather than the prompt failing — visible
   characters beat refusing to run. */
async function secret(rl, question) {
  let masking = true;
  const onData = (chunk) => {
    if (!masking) return;
    const ch = chunk.toString();
    if (ch === NEWLINE || ch === RETURN || ch === EOT) return;
    try {
      stdout.write(ESC + "[2K" + ESC + "[200D" + question + "*".repeat(rl.line.length));
    } catch {
      masking = false;
    }
  };
  stdin.on("data", onData);
  const answer = await rl.question(question);
  stdin.off("data", onData);
  stdout.write(NEWLINE);
  return answer;
}

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is not set. Run this from the sky-tech folder.");
  process.exit(1);
}

const rl = createInterface({ input: stdin, output: stdout });

/* Each answer is asked again until it is usable. Being thrown back to the
   command prompt over a typo — after already typing a long password twice — is
   a bad way to meet a new tool. */
async function ask(question, validate) {
  for (;;) {
    const answer = (await rl.question(question)).trim();
    const problem = validate(answer);
    if (!problem) return answer;
    console.log("  " + problem);
  }
}

const email = (
  await ask("Email: ", (v) =>
    v.includes("@") && v.length > 3 ? null : "That is not an email address."
  )
).toLowerCase();

const name = await ask("Full name: ", (v) => (v ? null : "A name is required."));

let password = "";
for (;;) {
  password = await secret(rl, "Password (at least 12 characters): ");
  if (password.length < 12) {
    console.log("  Too short - " + password.length + " character(s). Try again.");
    continue;
  }
  const again = await secret(rl, "Confirm password: ");
  if (password !== again) {
    console.log("  Those did not match. Try again.");
    continue;
  }
  break;
}

rl.close();

const totpSecret = new Secret({ size: 20 }).base32;
const passwordHash = await hash(password);

const conn = await mysql.createConnection(process.env.DATABASE_URL);
let userId = 0;
try {
  const [existing] = await conn.query("SELECT id FROM admin_users WHERE email = ?", [email]);
  if (existing.length > 0) {
    await conn.query(
      `UPDATE admin_users SET name = ?, password_hash = ?, totp_secret = ?, totp_last_step = NULL,
       failed_attempts = 0, locked_until = NULL, is_active = 1, updated_at = UTC_TIMESTAMP()
       WHERE email = ?`,
      [name, passwordHash, totpSecret, email]
    );
    // Any session opened with the old credentials stops working immediately.
    await conn.query("DELETE FROM admin_sessions WHERE user_id = ?", [existing[0].id]);
    // A new authenticator means the old recovery codes belong to a secret that
    // no longer exists, so any browser trusted under it is forgotten too.
    await conn.query("DELETE FROM trusted_devices WHERE user_id = ?", [existing[0].id]);
    userId = existing[0].id;
    console.log("Reset the existing account for " + email + ".");
  } else {
    await conn.query(
      `INSERT INTO admin_users (email, name, password_hash, totp_secret, role, is_active,
       failed_attempts, created_at, updated_at)
       VALUES (?, ?, ?, ?, 'owner', 1, 0, UTC_TIMESTAMP(), UTC_TIMESTAMP())`,
      [email, name, passwordHash, totpSecret]
    );
    const [[created]] = await conn.query("SELECT id FROM admin_users WHERE email = ?", [email]);
    userId = created.id;
    console.log("Created " + email + " as owner.");
  }

  /* Issued for both paths. The panel issues these whenever it creates an
     administrator; doing it here too is what stops the very first owner — the
     one account that cannot be rescued by another — being the only one with
     no way back in. */
  const codes = Array.from({ length: 10 }, recoveryCode);
  await conn.query("DELETE FROM admin_recovery_codes WHERE user_id = ?", [userId]);
  await conn.query(
    "INSERT INTO admin_recovery_codes (user_id, code_hash, created_at) VALUES " +
      codes.map(() => "(?, ?, UTC_TIMESTAMP())").join(", "),
    codes.flatMap((code) => [userId, sha256(code.replace(/-/g, "").toUpperCase())])
  );

  const uri = new TOTP({
    issuer: "SKY Tech Dynamic",
    label: email,
    algorithm: "SHA1",
    digits: 6,
    period: 30,
    secret: Secret.fromBase32(totpSecret),
  }).toString();

  console.log("");
  console.log("Scan this with Google Authenticator, 1Password, or Authy:");
  console.log("");
  console.log(await QRCode.toString(uri, { type: "terminal", small: true }));
  console.log("If you cannot scan it, enter this key by hand:");
  console.log("");
  console.log("    " + totpSecret);
  console.log("");
  console.log("This is shown once. Scan it before closing this window.");
  console.log("");
  console.log("Recovery codes - each works once, in place of the authenticator:");
  console.log("");
  for (let i = 0; i < codes.length; i += 2) {
    console.log("    " + codes[i] + "    " + (codes[i + 1] ?? ""));
  }
  console.log("");
  console.log("Write these down and keep them away from the phone. If the");
  console.log("authenticator is lost and these are gone, this account cannot be");
  console.log("recovered - the emailed reset link asks for a second factor too.");
} catch (error) {
  const message = String(error.message).replace(/(mysql:\/\/[^:]+:)[^@]*@/gi, "$1***@");
  console.error("Failed: " + message);
  process.exitCode = 1;
} finally {
  await conn.end();
}
