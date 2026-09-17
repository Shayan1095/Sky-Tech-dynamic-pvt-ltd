"use server";

import {
  STEP_ONE,
  STEP_TWO,
  readEnquiryType,
  readValues,
  validate,
  type ContactResult,
} from "@/lib/contact";

/* Contact form submission.

   Server Actions are reachable by direct POST, so everything the client
   checks is checked again here. Delivery (email to the SKY Tech inbox, with
   rate limiting) is connected once the destination address is provided —
   until then this reports "unavailable" honestly instead of pretending the
   message was sent. */
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

  // Where the enquiry came from: a package request or a consultation
  // booking, or "" for an ordinary enquiry. Never trusted as sent — an
  // unrecognised value is discarded rather than passed on.
  const enquiry = readEnquiryType(formData);
  void enquiry;

  // TODO(contact-delivery): send `values`, `enquiry` and `chosenPackage` to the inbox via the
  // chosen email provider (API key from a server-only env var), add rate
  // limiting, then return { status: "success" }.
  return { status: "unavailable" };
}
