import "server-only";

import { db } from "./db";
import { auditLog } from "./schema";
import { visitorHash } from "./auth";

/* Append-only record of everything an admin does. Never throws: a logging
   failure must not stop the action, and must not hand an attacker a way to
   break the log by breaking the write. */
export async function audit(entry: {
  userId: number | null;
  actor: string;
  action: string;
  target?: string;
  detail?: string;
}): Promise<void> {
  const handle = db();
  if (!handle) return;
  try {
    await handle.insert(auditLog).values({
      userId: entry.userId,
      actor: entry.actor,
      action: entry.action,
      target: entry.target ?? "",
      detail: (entry.detail ?? "").slice(0, 500),
      ipHash: await visitorHash(),
      createdAt: new Date(),
    });
  } catch {
    // Deliberately swallowed.
  }
}
