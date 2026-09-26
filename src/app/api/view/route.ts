import { NextResponse } from "next/server";

import { isBot, recordView } from "@/lib/server/analytics";
import { identify } from "@/lib/server/rate-limit";
import { allow } from "@/lib/server/rate-limit";

export const dynamic = "force-dynamic";

/* Records one page view.

   Always answers 204, whatever happened. This is called from a beacon that
   nobody is waiting on, and an error code here would put a red line in a
   visitor's console for something that is none of their concern.

   The address and the browser string are read from the request rather than
   accepted from the body: a counter anyone can post to is not a counter. */
export async function POST(request: Request) {
  const nothing = new NextResponse(null, { status: 204 });

  try {
    const userAgent = request.headers.get("user-agent") ?? "";
    if (!userAgent || isBot(userAgent)) return nothing;

    const forwarded = request.headers.get("x-forwarded-for");
    const real = request.headers.get("x-real-ip");
    const address = (forwarded?.split(",")[0] ?? real ?? "").trim();

    /* A generous ceiling per visitor per hour. Enough for anyone genuinely
       reading the site; not enough to inflate the numbers from one machine. */
    if (!(await allow(`view:${identify(forwarded, real)}`, 200, 60 * 60))) return nothing;

    const body = (await request.json()) as { path?: unknown; referrer?: unknown };
    const path = typeof body.path === "string" ? body.path : "";
    if (!path.startsWith("/") || path.length > 255) return nothing;

    // The panel is not the website; its traffic is not visitor traffic.
    if (path.startsWith("/admin") || path.startsWith("/api")) return nothing;

    await recordView({
      path,
      referrer: typeof body.referrer === "string" ? body.referrer : "",
      device: /mobile|android|iphone|ipad/i.test(userAgent) ? "mobile" : "desktop",
      address,
      userAgent,
    });
  } catch {
    // Counting is never worth an error a visitor can see.
  }

  return nothing;
}
