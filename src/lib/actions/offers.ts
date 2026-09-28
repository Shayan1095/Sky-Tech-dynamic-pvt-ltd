"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";

import { audit } from "@/lib/server/audit";
import { currentAdmin } from "@/lib/server/auth";
import { db } from "@/lib/server/db";
import { serviceOffers } from "@/lib/server/schema";
import { offerTargets } from "@/lib/server/offers";

/* ActionForm raises its own success toast, so an action that worked
   returns nothing; only a refusal has anything to say. */
export type OfferResult = void | { error: string };

const text = (data: FormData, field: string, max: number) =>
  String(data.get(field) ?? "").trim().slice(0, max);

/* A date from a <input type="date">, read as the end of that day in UTC so
   an offer that runs "until 31 March" is still live on the 31st. An empty
   field means no limit. */
function endOfDay(value: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const date = new Date(`${value}T23:59:59.999Z`);
  return Number.isNaN(date.getTime()) ? null : date;
}

function startOfDay(value: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const date = new Date(`${value}T00:00:00.000Z`);
  return Number.isNaN(date.getTime()) ? null : date;
}

/* Everywhere an offer can appear is statically generated, so a change has to
   rebuild the public pages as well as the panel's own list. */
function rebuild() {
  revalidatePath("/", "layout");
  revalidatePath("/admin/offers");
}

export async function saveOffer(formData: FormData): Promise<OfferResult> {
  const admin = await currentAdmin();
  if (!admin) redirect("/admin/login");

  const handle = db();
  if (!handle) return { error: "No database is connected." };

  const serviceName = text(formData, "service", 60);
  if (!offerTargets().includes(serviceName)) {
    return { error: "That is not a service this site offers." };
  }

  const title = text(formData, "title", 140);
  if (title.length < 3) return { error: "Give the offer a headline." };

  const body = text(formData, "body", 400);
  const code = text(formData, "code", 40);
  const startsAt = startOfDay(text(formData, "startsAt", 10));
  const endsAt = endOfDay(text(formData, "endsAt", 10));

  if (startsAt && endsAt && endsAt < startsAt) {
    return { error: "The offer ends before it starts." };
  }

  const isActive = formData.get("isActive") === "on" ? 1 : 0;
  const id = Number(formData.get("id"));
  const now = new Date();

  if (Number.isInteger(id) && id > 0) {
    await handle
      .update(serviceOffers)
      .set({ serviceName, title, body, code, startsAt, endsAt, isActive, updatedAt: now, updatedBy: admin.id })
      .where(eq(serviceOffers.id, id));

    await audit({
      userId: admin.id,
      actor: admin.email,
      action: "offer.updated",
      target: serviceName,
      detail: title,
    });
    rebuild();
    return;
  }

  await handle.insert(serviceOffers).values({
    serviceName,
    title,
    body,
    code,
    startsAt,
    endsAt,
    isActive,
    createdAt: now,
    updatedAt: now,
    updatedBy: admin.id,
  });

  await audit({
    userId: admin.id,
    actor: admin.email,
    action: "offer.created",
    target: serviceName,
    detail: title,
  });
  rebuild();
  return;
}

/* Switching an offer off leaves it in the list, so a seasonal promotion can
   be brought back next year rather than retyped. */
export async function toggleOffer(formData: FormData): Promise<OfferResult> {
  const admin = await currentAdmin();
  if (!admin) redirect("/admin/login");

  const handle = db();
  if (!handle) return { error: "No database is connected." };

  const id = Number(formData.get("id"));
  if (!Number.isInteger(id) || id <= 0) return { error: "Unknown offer." };
  const on = formData.get("on") === "1" ? 1 : 0;

  await handle
    .update(serviceOffers)
    .set({ isActive: on, updatedAt: new Date(), updatedBy: admin.id })
    .where(eq(serviceOffers.id, id));

  await audit({
    userId: admin.id,
    actor: admin.email,
    action: on ? "offer.enabled" : "offer.disabled",
    target: String(id),
  });
  rebuild();
  return;
}

export async function deleteOffer(formData: FormData): Promise<OfferResult> {
  const admin = await currentAdmin();
  if (!admin) redirect("/admin/login");

  const handle = db();
  if (!handle) return { error: "No database is connected." };

  const id = Number(formData.get("id"));
  if (!Number.isInteger(id) || id <= 0) return { error: "Unknown offer." };

  await handle.delete(serviceOffers).where(eq(serviceOffers.id, id));

  await audit({
    userId: admin.id,
    actor: admin.email,
    action: "offer.deleted",
    target: String(id),
  });
  rebuild();
  return;
}
