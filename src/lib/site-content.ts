/* Editable site details, and the values they fall back to.

   These are the things that used to be typed into four different components:
   the phone number, the email address, the website, and the social profiles.
   Having them in one place is what makes them editable at all — a number
   duplicated across a footer, a hero and a form is a number that eventually
   disagrees with itself.

   The defaults below are exactly what those components contained, taken from
   src/content/contact.md. They are what the site shows when nothing has been
   saved in the admin panel, and what it falls back to if the database cannot
   be reached during a build. The site is therefore never wrong and never
   blank — at worst it is out of date, and it says so nowhere. */

export type SiteSettings = {
  phone: string;
  email: string;
  website: string;
  facebook: string;
  instagram: string;
  linkedin: string;
  tiktok: string;
  x: string;
};

export const SETTING_DEFAULTS: SiteSettings = {
  phone: "+92 333 567 3810",
  email: "info@skytech.com.pk",
  website: "skytech.com.pk",
  // Empty until the real profiles are supplied. An empty value hides the icon
  // rather than linking to "#", which looks live and goes nowhere.
  facebook: "",
  instagram: "",
  linkedin: "",
  tiktok: "",
  x: "",
};

export const SETTING_KEYS = Object.keys(SETTING_DEFAULTS) as (keyof SiteSettings)[];

/* Which settings are links, and how each is labelled in the admin panel. */
export const SETTING_FIELDS: {
  key: keyof SiteSettings;
  label: string;
  hint?: string;
  placeholder?: string;
  group: "contact" | "social";
}[] = [
  { key: "phone", label: "Phone", hint: "Shown and dialled exactly as written.", group: "contact" },
  { key: "email", label: "Email", hint: "Where the site tells people to write.", group: "contact" },
  { key: "website", label: "Website", hint: "Displayed without https://", group: "contact" },
  { key: "facebook", label: "Facebook", placeholder: "https://facebook.com/...", group: "social" },
  { key: "instagram", label: "Instagram", placeholder: "https://instagram.com/...", group: "social" },
  { key: "linkedin", label: "LinkedIn", placeholder: "https://linkedin.com/company/...", group: "social" },
  { key: "tiktok", label: "TikTok", placeholder: "https://tiktok.com/@...", group: "social" },
  { key: "x", label: "X", placeholder: "https://x.com/...", group: "social" },
];

/* Dialling strips everything a human reads it by — spaces, brackets, dashes —
   because tel: needs the digits and the plus, and nothing else. */
export const telHref = (phone: string) => `tel:${phone.replace(/[^\d+]/g, "")}`;

export const mailHref = (email: string) => `mailto:${email}`;

export const websiteHref = (website: string) =>
  /^https?:\/\//i.test(website) ? website : `https://${website}`;

/* Display label for the website, without the scheme or a trailing slash. */
export const websiteLabel = (website: string) =>
  website.replace(/^https?:\/\//i, "").replace(/\/+$/, "");
