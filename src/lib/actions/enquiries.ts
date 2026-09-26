"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq, inArray } from "drizzle-orm";

import { audit } from "@/lib/server/audit";
import { currentAdmin } from "@/lib/server/auth";
import { db } from "@/lib/server/db";
import { clients, enquiries } from "@/lib/server/schema";

/* Actions on a single enquiry.

   Every one of these re-checks the session itself. The layout already blocks
   an unauthenticated visitor from seeing the page, but a Server Action is a
   POST endpoint in its own right — reachable without ever loading that page —
   so the guard has to live here as well. */

const STATUSES = ["new", "read", "replied", "archived"] as const;
type Status = (typeof STATUSES)[number];

const isStatus = (value: string): value is Status =>
  (STATUSES as readonly string[]).includes(value);

export async function setStatus(formData: FormData): Promise<void> {
  const admin = await currentAdmin();
  if (!admin) redirect("/admin/login");

  const id = Number(formData.get("id"));
  const status = String(formData.get("status") ?? "");
  if (!Number.isInteger(id) || !isStatus(status)) return;

  const handle = db();
  if (!handle) return;

  await handle
    .update(enquiries)
    .set({ status, updatedAt: new Date() })
    .where(eq(enquiries.id, id));

  await audit({
    userId: admin.id,
    actor: admin.email,
    action: "enquiry.status",
    target: `enquiry:${id}`,
    detail: `set to ${status}`,
  });

  revalidatePath("/admin");
  revalidatePath("/admin/enquiries");
  revalidatePath(`/admin/enquiries/${id}`);
}

export async function saveNotes(formData: FormData): Promise<void> {
  const admin = await currentAdmin();
  if (!admin) redirect("/admin/login");

  const id = Number(formData.get("id"));
  const notes = String(formData.get("notes") ?? "").slice(0, 5000);
  if (!Number.isInteger(id)) return;

  const handle = db();
  if (!handle) return;

  await handle
    .update(enquiries)
    .set({ adminNotes: notes, updatedAt: new Date() })
    .where(eq(enquiries.id, id));

  await audit({
    userId: admin.id,
    actor: admin.email,
    action: "enquiry.notes",
    target: `enquiry:${id}`,
  });

  revalidatePath(`/admin/enquiries/${id}`);
}

/* Turns an enquiry into a client without consuming it. The enquiry stays
   exactly as it was sent — it is a record of what somebody actually wrote, and
   rewriting it later would make it worthless as one. */
export async function convertToClient(formData: FormData): Promise<void> {
  const admin = await currentAdmin();
  if (!admin) redirect("/admin/login");

  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) return;

  const handle = db();
  if (!handle) return;

  const [enquiry] = await handle.select().from(enquiries).where(eq(enquiries.id, id)).limit(1);
  if (!enquiry) return;

  // Converting twice should open the existing client, not create a rival copy
  // of the same person.
  const [existing] = await handle
    .select({ id: clients.id })
    .from(clients)
    .where(eq(clients.email, enquiry.email))
    .limit(1);

  if (existing) {
    redirect(`/admin/clients/${existing.id}`);
  }

  await handle.insert(clients).values({
    name: enquiry.name,
    company: enquiry.company,
    email: enquiry.email,
    phone: enquiry.phone,
    country: enquiry.country,
    status: "lead",
    sourceEnquiryId: enquiry.id,
    notes: "",
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  const [created] = await handle
    .select({ id: clients.id })
    .from(clients)
    .where(eq(clients.email, enquiry.email))
    .limit(1);

  await audit({
    userId: admin.id,
    actor: admin.email,
    action: "client.created",
    target: `client:${created?.id ?? "?"}`,
    detail: `from enquiry ${enquiry.reference}`,
  });

  revalidatePath("/admin");
  revalidatePath("/admin/clients");
  redirect(`/admin/clients/${created?.id ?? ""}`);
}

/* Several enquiries at once.

   The ids are filtered to integers and capped before they reach the database,
   so a hand-edited form cannot turn one click into an update across the whole
   table. */
export async function bulkSetStatus(formData: FormData): Promise<void> {
  const admin = await currentAdmin();
  if (!admin) redirect("/admin/login");

  const status = String(formData.get("status") ?? "");
  if (!isStatus(status)) return;

  const ids = formData
    .getAll("ids")
    .map((value) => Number(value))
    .filter((n) => Number.isInteger(n) && n > 0)
    .slice(0, 100);

  if (ids.length === 0) return;

  const handle = db();
  if (!handle) return;

  await handle
    .update(enquiries)
    .set({ status, updatedAt: new Date() })
    .where(inArray(enquiries.id, ids));

  await audit({
    userId: admin.id,
    actor: admin.email,
    action: "enquiry.bulk_status",
    target: `${ids.length} enquiries`,
    detail: `set to ${status}`,
  });

  revalidatePath("/admin");
  revalidatePath("/admin/enquiries");
}
