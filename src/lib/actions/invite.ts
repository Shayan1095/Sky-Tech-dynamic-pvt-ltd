"use server";

import { randomInt } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import QRCode from "qrcode";

import { issueRecoveryCodes } from "@/lib/server/account";
import { audit } from "@/lib/server/audit";
import { currentAdmin } from "@/lib/server/auth";
import { db } from "@/lib/server/db";
import { hashPassword } from "@/lib/server/password";
import { adminUsers } from "@/lib/server/schema";
import { enrolmentUri, newSecret } from "@/lib/server/totp";

/* Creating another administrator, from the panel rather than the terminal.

   The owner never chooses the other person's password. A temporary one is
   generated, shown once, and the account is marked so that the only thing it
   can do after signing in is replace it. Until that happens, the person who
   created the account still knows the password — so it is not yet anybody's
   account, and the panel treats it that way.

   The authenticator is enrolled at the same time, because an account that can
   sign in without a second factor is a hole that stays open until somebody
   remembers to close it.
   ------------------------------------------------------------------------ */

export type InviteResult =
  | { error: string }
  | {
      created: true;
      email: string;
      password: string;
      qr: string;
      secret: string;
      codes: string[];
    }
  | null;

/* Readable aloud and down a phone line: no I, O, 0 or 1, and grouped. */
const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";

function temporaryPassword(): string {
  let out = "";
  for (let i = 0; i < 18; i += 1) out += ALPHABET[randomInt(ALPHABET.length)];
  return `${out.slice(0, 6)}-${out.slice(6, 12)}-${out.slice(12)}`;
}

export async function createAdmin(
  _previous: InviteResult,
  formData: FormData
): Promise<InviteResult> {
  const admin = await currentAdmin();
  if (!admin) redirect("/admin/login");

  // Only an owner may hand out access. An editor can work here, not decide
  // who else can.
  if (admin.role !== "owner") return { error: "Only an owner can add administrators." };

  const handle = db();
  if (!handle) return { error: "No database is connected." };

  const email = String(formData.get("email") ?? "").trim().toLowerCase().slice(0, 254);
  const name = String(formData.get("name") ?? "").trim().slice(0, 100);
  const role = String(formData.get("role") ?? "editor");

  if (!email.includes("@") || email.length < 5) return { error: "That is not an email address." };
  if (!name) return { error: "Please give them a name." };
  if (role !== "owner" && role !== "editor") return { error: "Choose a role." };

  const [existing] = await handle
    .select({ id: adminUsers.id })
    .from(adminUsers)
    .where(eq(adminUsers.email, email))
    .limit(1);
  if (existing) {
    return { error: "There is already an account with that email." };
  }

  const password = temporaryPassword();
  const secret = newSecret();

  await handle.insert(adminUsers).values({
    email,
    name,
    passwordHash: await hashPassword(password),
    totpSecret: secret,
    role,
    isActive: 1,
    mustChangePassword: 1,
    failedAttempts: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  const [created] = await handle
    .select({ id: adminUsers.id })
    .from(adminUsers)
    .where(eq(adminUsers.email, email))
    .limit(1);

  const codes = created ? await issueRecoveryCodes(created.id) : [];

  const qr = await QRCode.toDataURL(enrolmentUri(secret, email), {
    margin: 1,
    width: 220,
    color: { dark: "#0b1f35", light: "#ffffff" },
  });

  await audit({
    userId: admin.id,
    actor: admin.email,
    action: "admin.created",
    target: email,
    detail: `role ${role}`,
  });

  revalidatePath("/admin/admins");

  /* Returned once and never stored in readable form. The owner has to pass
     these on now; there is no screen that will show them again. */
  return { created: true, email, password, qr, secret, codes };
}
