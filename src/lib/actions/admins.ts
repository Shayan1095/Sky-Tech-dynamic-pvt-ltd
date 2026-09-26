"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { and, eq, ne, sql } from "drizzle-orm";

import { audit } from "@/lib/server/audit";
import { currentAdmin, destroyAllSessions } from "@/lib/server/auth";
import { db } from "@/lib/server/db";
import { adminUsers } from "@/lib/server/schema";

/* Managing the people who can sign in.

   Only an owner may change any of this. An editor can work in the panel but
   cannot grant anyone access to it, which is the whole point of having two
   roles rather than one.

   Two things are refused outright, because both end with nobody able to get
   in: deactivating or demoting yourself, and removing the last owner. A panel
   that lets you lock yourself out of it is a panel that eventually does. */

async function requireOwner() {
  const admin = await currentAdmin();
  if (!admin) redirect("/admin/login");
  return admin.role === "owner" ? admin : null;
}

async function ownerCount(): Promise<number> {
  const handle = db();
  if (!handle) return 0;
  const [row] = await handle
    .select({ n: sql<number>`COUNT(*)` })
    .from(adminUsers)
    .where(and(eq(adminUsers.role, "owner"), eq(adminUsers.isActive, 1)));
  return Number(row?.n ?? 0);
}

export async function setActive(formData: FormData): Promise<void> {
  const admin = await requireOwner();
  if (!admin) return;

  const id = Number(formData.get("id"));
  const active = formData.get("active") === "1";
  if (!Number.isInteger(id)) return;

  // Locking yourself out is never what was meant — and, as with the role
  // change, the panel never offers it, so an attempt is worth recording.
  if (id === admin.id) {
    await audit({
      userId: admin.id,
      actor: admin.email,
      action: "admin.deactivate_refused",
      target: admin.email,
      detail: "cannot deactivate your own account",
    });
    return;
  }

  const handle = db();
  if (!handle) return;

  const [target] = await handle
    .select({ email: adminUsers.email, role: adminUsers.role })
    .from(adminUsers)
    .where(eq(adminUsers.id, id))
    .limit(1);
  if (!target) return;

  if (!active && target.role === "owner" && (await ownerCount()) <= 1) return;

  await handle
    .update(adminUsers)
    .set({ isActive: active ? 1 : 0, updatedAt: new Date() })
    .where(eq(adminUsers.id, id));

  // Access should stop now, not when their session happens to expire.
  if (!active) await destroyAllSessions(id);

  await audit({
    userId: admin.id,
    actor: admin.email,
    action: active ? "admin.activated" : "admin.deactivated",
    target: target.email,
  });

  revalidatePath("/admin/admins");
}

export async function setRole(formData: FormData): Promise<void> {
  const admin = await requireOwner();
  if (!admin) return;

  const id = Number(formData.get("id"));
  const role = String(formData.get("role") ?? "");
  if (!Number.isInteger(id) || (role !== "owner" && role !== "editor")) return;

  /* An owner demoting themselves could leave the panel with no owner at all.
     The panel never offers this — the buttons are absent on your own row — so
     reaching here means the request was altered on its way in. That is worth
     a line in the log: every other change is recorded, and a refused attempt
     to take privileges is more interesting than a successful ordinary one. */
  if (id === admin.id) {
    await audit({
      userId: admin.id,
      actor: admin.email,
      action: "admin.role_refused",
      target: admin.email,
      detail: "cannot change your own role",
    });
    return;
  }

  const handle = db();
  if (!handle) return;

  const [target] = await handle
    .select({ email: adminUsers.email, role: adminUsers.role })
    .from(adminUsers)
    .where(eq(adminUsers.id, id))
    .limit(1);
  if (!target) return;

  if (role === "editor" && target.role === "owner" && (await ownerCount()) <= 1) return;

  await handle
    .update(adminUsers)
    .set({ role, updatedAt: new Date() })
    .where(eq(adminUsers.id, id));

  await audit({
    userId: admin.id,
    actor: admin.email,
    action: "admin.role",
    target: target.email,
    detail: `set to ${role}`,
  });

  revalidatePath("/admin/admins");
}

/* Signs one account out of every device it is signed in on. Useful when a
   laptop goes missing, and the fastest thing to reach for when something
   looks wrong. */
export async function signOutEverywhere(formData: FormData): Promise<void> {
  const admin = await requireOwner();
  if (!admin) return;

  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) return;

  const handle = db();
  if (!handle) return;

  const [target] = await handle
    .select({ email: adminUsers.email })
    .from(adminUsers)
    .where(and(eq(adminUsers.id, id), ne(adminUsers.id, 0)))
    .limit(1);
  if (!target) return;

  await destroyAllSessions(id);

  await audit({
    userId: admin.id,
    actor: admin.email,
    action: "admin.sessions_cleared",
    target: target.email,
  });

  revalidatePath("/admin/admins");
}
