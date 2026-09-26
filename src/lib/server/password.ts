import "server-only";

import { randomBytes, scrypt, timingSafeEqual, type ScryptOptions } from "node:crypto";

/* promisify() drops the options overload, so scrypt is wrapped by hand. */
function scryptAsync(
  password: string,
  salt: Buffer,
  keyLength: number,
  options: ScryptOptions
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scrypt(password, salt, keyLength, options, (error, key) => {
      if (error) reject(error);
      else resolve(key);
    });
  });
}

/* ---------------------------------------------------------------------------
   Password hashing.

   scrypt, from Node's own crypto module. It is memory-hard — an attacker with
   a GPU farm gains far less against it than against a plain hash — and being
   built in, there is no native module to fail to compile on shared hosting.

   Argon2id would be the textbook first choice, but the only portable
   implementation is pure JavaScript and measured 1236ms here for weaker
   parameters than scrypt needs for 338ms. A hash nobody can afford to run at
   a sensible cost is not more secure.

   N=32768 is roughly 32MB and a third of a second per attempt: unnoticeable
   when signing in, ruinous for anyone trying millions of guesses. The
   parameters are stored alongside the hash, so the cost can be raised later
   without invalidating anyone's existing password.
   ------------------------------------------------------------------------ */

const N = 32768;
const R = 8;
const P = 1;
const KEY_LENGTH = 32;
const SALT_LENGTH = 16;
// scrypt needs headroom above N*r*128 or Node refuses the request.
const MAX_MEM = 256 * 1024 * 1024;

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(SALT_LENGTH);
  const key = await scryptAsync(password.normalize("NFKC"), salt, KEY_LENGTH, {
    N,
    r: R,
    p: P,
    maxmem: MAX_MEM,
  });
  return ["scrypt", N, R, P, salt.toString("base64"), key.toString("base64")].join("$");
}

/* Constant-time throughout: a wrong password and a wrong length must take the
   same time to reject, or the difference itself leaks information. A malformed
   stored hash returns false rather than throwing, so a corrupted row cannot be
   turned into a way past the login screen. */
export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const parts = stored.split("$");
  if (parts.length !== 6 || parts[0] !== "scrypt") return false;

  const n = Number(parts[1]);
  const r = Number(parts[2]);
  const p = Number(parts[3]);
  if (!Number.isInteger(n) || !Number.isInteger(r) || !Number.isInteger(p)) return false;

  let salt: Buffer;
  let expected: Buffer;
  try {
    salt = Buffer.from(parts[4], "base64");
    expected = Buffer.from(parts[5], "base64");
  } catch {
    return false;
  }
  if (salt.length === 0 || expected.length === 0) return false;

  try {
    const key = await scryptAsync(password.normalize("NFKC"), salt, expected.length, {
      N: n,
      r,
      p,
      maxmem: MAX_MEM,
    });
    return key.length === expected.length && timingSafeEqual(key, expected);
  } catch {
    return false;
  }
}

/* True when a hash was made with parameters weaker than the current ones, so
   it can be silently upgraded the next time that password is entered
   correctly — the only moment the plain password is available to re-hash. */
export function needsRehash(stored: string): boolean {
  const parts = stored.split("$");
  if (parts.length !== 6 || parts[0] !== "scrypt") return true;
  return Number(parts[1]) < N || Number(parts[2]) < R || Number(parts[3]) < P;
}
