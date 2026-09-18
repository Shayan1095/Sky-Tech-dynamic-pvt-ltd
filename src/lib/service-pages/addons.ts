/* Each service's add-ons, worded and priced exactly as in its content file.

   Kept in this small module — rather than inside the full page data — because
   three places need it: the service page's quote builder, the contact form
   (which shows the chosen add-ons back to the visitor) and the contact
   server action (which accepts only add-ons on this list). The contact page
   should not have to load every service page's copy to check a name. */

export type AddOn = { name: string; price: string };

export const SERVICE_ADDONS: Record<string, readonly AddOn[]> = {
  "Web Development": [
    { name: "SEO Optimization", price: "$150" },
    { name: "UI/UX Design", price: "$200" },
    { name: "Payment Gateway Integration", price: "$100" },
    { name: "Domain & Hosting Setup", price: "$100" },
    { name: "Website Maintenance", price: "$100/month" },
    { name: "Content Writing", price: "Custom Quote" },
    { name: "Additional Pages", price: "Custom Quote" },
    { name: "API Integration", price: "Custom Quote" },
    { name: "Website Redesign", price: "Custom Quote" },
  ],
};

/* A stable id for an add-on: its name, lower-cased and hyphenated. */
export const addOnId = (name: string) =>
  name
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

/* The add-ons carried in a link (?addons=A|B) or a form field, kept only if
   each is a real add-on of that service. Anything unrecognised is dropped,
   so nothing arbitrary from a URL or a tampered POST reaches the enquiry. */
export const ADDON_SEPARATOR = "|";
export const MAX_ADDONS = 12;

export function readAddOns(service: string, raw: string | null | undefined): AddOn[] {
  const known = SERVICE_ADDONS[service];
  if (!known || !raw) return [];
  const asked = new Set(raw.split(ADDON_SEPARATOR).map((s) => s.trim()).slice(0, MAX_ADDONS));
  return known.filter((a) => asked.has(a.name));
}
