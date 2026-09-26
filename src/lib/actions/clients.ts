"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";

import { audit } from "@/lib/server/audit";
import { currentAdmin } from "@/lib/server/auth";
import { db } from "@/lib/server/db";
import { clientServices, clients } from "@/lib/server/schema";

/* Actions on a client and the work they have bought.

   Each one re-checks the session: a Server Action is a POST endpoint in its
   own right, reachable without ever loading the page the layout protects.

   Nothing here deletes. A service that is not happening becomes "cancelled"
   and stays visible, because what was agreed and then called off is part of
   the account history and is exactly what somebody will want to look up in
   six months.
   ------------------------------------------------------------------------ */

const CLIENT_STATUSES = ["lead", "active", "past", "lost"] as const;
const SERVICE_STATUSES = ["proposed", "active", "completed", "cancelled"] as const;
const BILLING = ["once", "monthly", "yearly"] as const;

const oneOf = <T extends readonly string[]>(list: T, value: string): value is T[number] =>
  (list as readonly string[]).includes(value);

export async function setClientStatus(formData: FormData): Promise<void> {
  const admin = await currentAdmin();
  if (!admin) redirect("/admin/login");

  const id = Number(formData.get("id"));
  const status = String(formData.get("status") ?? "");
  if (!Number.isInteger(id) || !oneOf(CLIENT_STATUSES, status)) return;

  const handle = db();
  if (!handle) return;

  await handle
    .update(clients)
    .set({ status, updatedAt: new Date() })
    .where(eq(clients.id, id));

  await audit({
    userId: admin.id,
    actor: admin.email,
    action: "client.status",
    target: `client:${id}`,
    detail: `set to ${status}`,
  });

  revalidatePath("/admin");
  revalidatePath("/admin/clients");
  revalidatePath(`/admin/clients/${id}`);
}

export async function saveClientNotes(formData: FormData): Promise<void> {
  const admin = await currentAdmin();
  if (!admin) redirect("/admin/login");

  const id = Number(formData.get("id"));
  const notes = String(formData.get("notes") ?? "").slice(0, 5000);
  if (!Number.isInteger(id)) return;

  const handle = db();
  if (!handle) return;

  await handle
    .update(clients)
    .set({ notes, updatedAt: new Date() })
    .where(eq(clients.id, id));

  await audit({
    userId: admin.id,
    actor: admin.email,
    action: "client.notes",
    target: `client:${id}`,
  });

  revalidatePath(`/admin/clients/${id}`);
}

export async function addService(formData: FormData): Promise<void | { error: string }> {
  const admin = await currentAdmin();
  if (!admin) redirect("/admin/login");

  const clientId = Number(formData.get("clientId"));
  const service = String(formData.get("service") ?? "").trim().slice(0, 60);
  const packageName = String(formData.get("packageName") ?? "").trim().slice(0, 160);
  const billing = String(formData.get("billing") ?? "once");
  const status = String(formData.get("status") ?? "proposed");

  /* The amount is parsed from whatever was typed, so "$1,500" and "1500" both
     work, and anything that is not a number is refused rather than silently
     stored as zero and quietly wrecking every total built on it. */
  const raw = String(formData.get("amount") ?? "").replace(/[^0-9.]/g, "");
  const amount = Number.parseFloat(raw);

  /* These used to collapse into one silent `return`. An empty amount is the
     easy mistake — the box shows "500" as a placeholder, so a form that was
     never filled in looks filled in — and the reply was a success toast and
     no row. Each refusal now names itself. */
  if (!Number.isInteger(clientId)) return { error: "That client could not be found." };
  if (!service) return { error: "Choose a service." };
  if (!Number.isFinite(amount)) {
    return {
      error:
        "That amount is not a number. Enter digits only, like 500 or 1500.50 — and note the grey 500 in the box is an example, not a value.",
    };
  }
  if (amount < 0) return { error: "An amount cannot be negative." };
  if (!oneOf(BILLING, billing)) return { error: "Choose how it is billed." };
  if (!oneOf(SERVICE_STATUSES, status)) return { error: "Choose a status." };

  const handle = db();
  if (!handle) return { error: "No database is connected." };

  await handle.insert(clientServices).values({
    clientId,
    service,
    packageName,
    amount: amount.toFixed(2),
    billing,
    status,
    startedOn: status === "active" ? new Date() : null,
    notes: "",
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  await audit({
    userId: admin.id,
    actor: admin.email,
    action: "service.added",
    target: `client:${clientId}`,
    detail: `${service} — ${amount.toFixed(2)} ${billing}`,
  });

  revalidatePath("/admin");
  revalidatePath(`/admin/clients/${clientId}`);
}

export async function setServiceStatus(formData: FormData): Promise<void> {
  const admin = await currentAdmin();
  if (!admin) redirect("/admin/login");

  const id = Number(formData.get("id"));
  const clientId = Number(formData.get("clientId"));
  const status = String(formData.get("status") ?? "");
  if (!Number.isInteger(id) || !oneOf(SERVICE_STATUSES, status)) return;

  const handle = db();
  if (!handle) return;

  await handle
    .update(clientServices)
    .set({
      status,
      // Becoming active dates the work; finishing or cancelling closes it.
      ...(status === "active" ? { startedOn: new Date() } : {}),
      ...(status === "completed" || status === "cancelled" ? { endsOn: new Date() } : {}),
      updatedAt: new Date(),
    })
    .where(eq(clientServices.id, id));

  await audit({
    userId: admin.id,
    actor: admin.email,
    action: "service.status",
    target: `service:${id}`,
    detail: `set to ${status}`,
  });

  revalidatePath("/admin");
  revalidatePath(`/admin/clients/${clientId}`);
}
