"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { sql } from "drizzle-orm";

import { audit } from "@/lib/server/audit";
import { currentAdmin } from "@/lib/server/auth";
import { AUTO_REPLY_DEFAULTS, getAutoReply } from "@/lib/server/auto-reply";
import { db } from "@/lib/server/db";
import { siteSettings } from "@/lib/server/schema";

export type AutoReplyResult = { error: string } | { saved: true; enabled: boolean } | null;

/* Saving the automatic reply.

   Switching it on is the consequential part, so it is recorded in the audit
   log as its own fact rather than buried in a list of edited fields: from that
   moment the site sends mail to addresses nobody has verified, and it should
   be obvious afterwards who turned that on and when. */
export async function saveAutoReply(
  _previous: AutoReplyResult,
  formData: FormData
): Promise<AutoReplyResult> {
  const admin = await currentAdmin();
  if (!admin) redirect("/admin/login");

  const handle = db();
  if (!handle) return { error: "No database is connected." };

  const enabled = formData.get("enabled") === "on";

  /* "Restore the standard wording" submits the same form with this set. The
     boxes are ignored in that case — the whole point is to discard what is in
     them and go back to the version that ships with the site. */
  const restoring = formData.get("restore") === "1";

  const subject = restoring
    ? AUTO_REPLY_DEFAULTS.subject
    : String(formData.get("subject") ?? "").trim().slice(0, 255);
  const body = restoring
    ? AUTO_REPLY_DEFAULTS.body
    : String(formData.get("body") ?? "").trim().slice(0, 8000);

  if (!subject) return { error: "Please write a subject." };
  if (!body) return { error: "Please write the message." };

  const before = await getAutoReply();

  const write = async (key: string, value: string) => {
    await handle
      .insert(siteSettings)
      .values({ settingKey: key, value, updatedAt: new Date(), updatedBy: admin.id })
      .onDuplicateKeyUpdate({
        set: { value, updatedAt: sql`UTC_TIMESTAMP()`, updatedBy: admin.id },
      });
  };

  await write("ack.enabled", enabled ? "1" : "0");
  await write("ack.subject", subject);
  await write("ack.body", body);

  if (before.enabled !== enabled) {
    await audit({
      userId: admin.id,
      actor: admin.email,
      action: enabled ? "autoreply.enabled" : "autoreply.disabled",
      target: "contact form",
    });
  } else {
    await audit({
      userId: admin.id,
      actor: admin.email,
      action: restoring ? "autoreply.restored" : "autoreply.edited",
      target: "contact form",
    });
  }

  revalidatePath("/admin/email");
  return { saved: true, enabled };
}
