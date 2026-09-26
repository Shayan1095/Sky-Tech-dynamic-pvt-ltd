import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";

import { taskToken } from "@/lib/server/env";
import { flushMail } from "@/lib/server/mail";

/* ---------------------------------------------------------------------------
   Scheduled retry for notification emails.

   Most messages are sent during the submission that created them. This exists
   for the ones that were not: an SMTP outage, a timeout, a mailbox briefly
   over quota. A cron job calls it every few minutes and anything still due
   goes out.

   Set up in hPanel > Advanced > Cron Jobs, every 5 minutes:
     curl -s -H "Authorization: Bearer YOUR_TASK_TOKEN" https://skytech.com.pk/api/tasks/flush-mail

   The endpoint is disabled entirely until TASK_TOKEN is set, so an
   unconfigured deploy does not expose an open trigger.
   ------------------------------------------------------------------------ */

export const dynamic = "force-dynamic";

/* Constant-time, so the response time cannot be used to discover the token a
   character at a time. Different lengths are rejected without comparing. */
function matches(provided: string, expected: string): boolean {
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

async function handle(request: Request) {
  const expected = taskToken();
  if (!expected) {
    return NextResponse.json({ error: "Not configured" }, { status: 404 });
  }

  const provided = request.headers.get("authorization") ?? "";
  if (!matches(provided, `Bearer ${expected}`)) {
    // Deliberately identical to the unconfigured response: an unauthenticated
    // caller learns nothing about whether the endpoint exists.
    return NextResponse.json({ error: "Not configured" }, { status: 404 });
  }

  const sent = await flushMail(25);
  return NextResponse.json({ sent });
}

// Cron runners default to GET; both behave the same.
export const GET = handle;
export const POST = handle;
