"use server";

import { headers } from "next/headers";

import {
  STEP_ONE,
  STEP_TWO,
  packagesFor,
  readEnquiryType,
  readValues,
  validate,
  type ContactResult,
} from "@/lib/contact";
import { COMBINATIONS, combinationLabel } from "@/lib/packages";
import { readAddOns } from "@/lib/service-pages/addons";
import { estimate, formatEstimate } from "@/lib/service-pages/quote";
import { createEnquiry } from "@/lib/server/enquiries";
import { hasDatabase } from "@/lib/server/env";
import { flushMail } from "@/lib/server/mail";
import { allow, identify } from "@/lib/server/rate-limit";
import { getPriceMap, priceKey } from "@/lib/server/prices";

/* Five submissions an hour from one visitor. Comfortably above anything a
   real enquiry needs, low enough that a script gains nothing. */
const LIMIT = 5;
const WINDOW_SECONDS = 60 * 60;

/* The enquiry is already stored by the time mail is attempted, so a slow SMTP
   server must not hold the visitor's page open. Anything still unsent when
   this elapses stays queued and is retried. */
const MAIL_BUDGET_MS = 9000;

async function withinBudget(work: Promise<unknown>): Promise<void> {
  let timer: NodeJS.Timeout | undefined;
  const budget = new Promise<void>((resolve) => {
    timer = setTimeout(resolve, MAIL_BUDGET_MS);
  });
  try {
    await Promise.race([work.then(() => undefined), budget]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}

/* Contact form submission.

   Server Actions are reachable by direct POST, so everything the client
   checks is checked again here, and every value that came from a link — the
   service, the package, the add-ons — is matched against what the site
   actually offers before it is stored.

   The enquiry is written to the database first and the notification email is
   queued second. That order is the whole point: a mail outage delays the
   notification, it never loses the lead. If the database itself is not
   reachable the form says so, rather than showing a success screen for a
   message nobody kept. */
export async function submitContact(
  _previous: ContactResult,
  formData: FormData
): Promise<ContactResult> {
  // Honeypot: a field real visitors never see. Bots that fill it get a
  // quiet success so they learn nothing, and nothing is processed.
  const trap = formData.get("company_website");
  if (typeof trap === "string" && trap.length > 0) {
    return { status: "success" };
  }

  const values = readValues(formData);
  const errors = validate(values, [...STEP_ONE, ...STEP_TWO]);
  if (Object.keys(errors).length > 0) {
    return { status: "invalid", errors };
  }

  // Nothing to store the enquiry in means nothing to promise the visitor.
  if (!hasDatabase()) return { status: "unavailable" };

  const headerList = await headers();
  const visitor = identify(
    headerList.get("x-forwarded-for"),
    headerList.get("x-real-ip")
  );
  if (!(await allow(`contact:${visitor}`, LIMIT, WINDOW_SECONDS))) {
    return { status: "unavailable" };
  }

  // Where the enquiry came from: a package request or a consultation
  // booking, or "" for an ordinary enquiry. Never trusted as sent — an
  // unrecognised value is discarded rather than passed on.
  const enquiry = readEnquiryType(formData);

  // A multi-service combination chosen on the Services page. Only a label
  // that matches one of the six combinations survives.
  const postedPackage = formData.get("package");
  const packageName =
    typeof postedPackage === "string" &&
    COMBINATIONS.some((c) => combinationLabel(c) === postedPackage)
      ? postedPackage
      : "";

  // Add-ons from a service page's quote builder. Only add-ons that belong to
  // the selected service survive; anything else in the field is dropped.
  const addOnsRaw = formData.get("addons");
  const addOns = readAddOns(values.need, typeof addOnsRaw === "string" ? addOnsRaw : "");

  /* The price is recomputed here from the chosen package and the surviving
     add-ons, so the figure in the inbox is one this site actually quotes —
     not a number that arrived in the request. */
  /* The saved price wins over the one in the content file, so the figure
     recorded against the enquiry is the one the visitor was actually shown. */
  const prices = await getPriceMap();
  const listed = packagesFor(values.need).find((p) => p.name === values.budget)?.price;
  const chosenPrice = prices[priceKey(values.need, values.budget)] ?? listed;
  const figures = estimate(chosenPrice, addOns);
  const total = formatEstimate(figures);

  try {
    const stored = await createEnquiry({
      values,
      enquiryType: enquiry,
      packageName,
      addOns,
      estimate: total,
      figures,
      ipHash: visitor,
      userAgent: headerList.get("user-agent") ?? "",
    });
    if (!stored) return { status: "unavailable" };
  } catch {
    // The reason belongs in the server log, never in the response — an error
    // message can describe the database to whoever provoked it.
    return { status: "unavailable" };
  }

  // Sends the notification just queued, and retries anything left over from
  // an earlier outage. Failure here is not the visitor's problem.
  await withinBudget(flushMail().catch(() => 0));

  return { status: "success" };
}
