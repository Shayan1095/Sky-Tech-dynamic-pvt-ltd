/* Contact form schema — shared by the client (instant feedback) and the
   server action (the real gate). Required fields follow src/content/contact.md.
   Services and their packages come from src/content/services/*.md ("Pricing"
   tables); prices are shown exactly as written there. Limits keep payloads
   small and reject abuse before anything is sent anywhere. */

export type Package = { name: string; price: string };

export const SERVICE_GROUPS: Array<{
  category: string;
  services: Array<{ name: string; packages: Package[] }>;
}> = [
  {
    category: "Website & Software Development",
    services: [
      {
        name: "Web Development",
        packages: [
          { name: "Starter Website", price: "$299" },
          { name: "Business Website", price: "$500" },
          { name: "E-commerce Website", price: "$600" },
          { name: "Custom Web Application", price: "$1,500" },
          { name: "Advanced Business Web App", price: "$2,500+" },
        ],
      },
      {
        // Pricing marked PENDING_CONFIRMATION in wordpress-development.md.
        name: "WordPress Development",
        packages: [
          { name: "Starter", price: "PKR 25,000" },
          { name: "Professional", price: "PKR 55,000" },
          { name: "Business", price: "PKR 100,000" },
        ],
      },
      {
        name: "UI/UX Design",
        packages: [
          { name: "Website Redesign", price: "$500-$1,000" },
          { name: "Mobile App UI", price: "$1,000-$2,500" },
          { name: "Design System", price: "$1,500-$3,000" },
          { name: "UX Audit & Recommendations", price: "$500-$1,000" },
        ],
      },
      {
        name: "Graphic Design",
        packages: [
          { name: "Logo Design", price: "$299-$599" },
          { name: "Brand Identity Package", price: "$999-$1,999" },
          { name: "Marketing Collateral", price: "$500-$1,200" },
          { name: "Ongoing Design Support", price: "$500+/month" },
        ],
      },
    ],
  },
  {
    category: "Digital Marketing & Advertising",
    services: [
      {
        name: "Digital Marketing",
        packages: [
          { name: "Starter Growth", price: "$299/month" },
          { name: "Growth Marketing", price: "$499/month" },
          { name: "Performance Marketing", price: "$799/month" },
          { name: "Growth Partner", price: "$1,200/month" },
        ],
      },
      {
        name: "Social Media Management",
        packages: [
          { name: "Starter Growth", price: "$299/month" },
          { name: "Growth Marketing", price: "$499/month" },
          { name: "Performance Marketing", price: "$799/month" },
          { name: "Growth Partner", price: "$1,200/month" },
        ],
      },
      {
        name: "Google Ads",
        packages: [
          { name: "Google Ads Starter", price: "$150/month" },
          { name: "Google Ads Growth", price: "$299/month" },
          { name: "Google Ads Performance", price: "$499/month" },
          { name: "Google Ads Enterprise", price: "$999/month" },
          { name: "Google Ads Audit", price: "$100" },
        ],
      },
      {
        name: "Meta Ads",
        packages: [
          { name: "Meta Ads Starter", price: "$150/month" },
          { name: "Meta Ads Growth", price: "$299/month" },
          { name: "Meta Ads Performance", price: "$499/month" },
          { name: "Meta Ads Enterprise", price: "$999/month" },
          { name: "Meta Ads Audit", price: "$100" },
        ],
      },
    ],
  },
  {
    category: "Content & Media",
    services: [
      {
        name: "Content Writing",
        packages: [
          { name: "Blog Posts & Articles", price: "$100-$300/article" },
          { name: "Website Copy", price: "$500-$1,500" },
          { name: "Social Media Content", price: "$200-$500/month" },
          { name: "Email Marketing", price: "$300-$800/month" },
          { name: "Content Strategy", price: "$1,000+" },
        ],
      },
      {
        name: "Video Production",
        packages: [
          { name: "Short-Form Content", price: "$299/video" },
          { name: "Product Demo", price: "$500/video" },
          { name: "Promotional Video", price: "$999/video" },
          { name: "Corporate Video", price: "$1,500/video" },
          { name: "Full Production Package", price: "$3,000+" },
        ],
      },
      {
        name: "Media & Events",
        packages: [
          { name: "Event Photography", price: "$500-$1,500" },
          { name: "Event Videography", price: "$800-$2,000" },
          { name: "Full Event Coverage", price: "$1,500-$3,500" },
          { name: "Live Event Production", price: "$2,000-$5,000+" },
        ],
      },
    ],
  },
  {
    category: "Support & Operations",
    services: [
      {
        name: "Hosting & Domain",
        packages: [
          { name: "Basic Hosting", price: "$100/year" },
          { name: "Professional Hosting", price: "$200/year" },
          { name: "Enterprise Hosting", price: "$500+/year" },
        ],
      },
      {
        name: "Website Maintenance",
        packages: [
          { name: "Basic Maintenance", price: "$100/month" },
          { name: "Professional Maintenance", price: "$200/month" },
          { name: "Enterprise Maintenance", price: "$500+/month" },
        ],
      },
      // No pricing content exists yet — custom budget only.
      { name: "Business Automation", packages: [] },
    ],
  },
];

export const OTHER_SERVICE = "Other";
export const CUSTOM_BUDGET = "Custom";

const SERVICE_NAMES = SERVICE_GROUPS.flatMap((g) => g.services.map((s) => s.name));

export function isService(name: string) {
  return name === OTHER_SERVICE || SERVICE_NAMES.includes(name);
}

export function packagesFor(service: string): Package[] {
  for (const group of SERVICE_GROUPS) {
    const match = group.services.find((s) => s.name === service);
    if (match) return match.packages;
  }
  return [];
}

export type ContactField =
  | "name"
  | "company"
  | "email"
  | "phone"
  | "country"
  | "need"
  | "details"
  | "budget"
  | "budgetCustom"
  | "timeline";

export type ContactValues = Record<ContactField, string>;
export type ContactErrors = Partial<Record<ContactField, string>>;

export const FIELD_LIMITS: Record<ContactField, number> = {
  name: 100,
  company: 120,
  email: 254,
  phone: 30,
  country: 80,
  need: 60,
  details: 3000,
  budget: 80,
  budgetCustom: 80,
  timeline: 80,
};

/* Step 1 fields are all required by contact.md; step 2 fields are optional,
   except a custom amount once "Custom Budget" is chosen. */
export const STEP_ONE: ContactField[] = ["name", "company", "email", "phone", "country"];
export const STEP_TWO: ContactField[] = ["need", "details", "budget", "budgetCustom", "timeline"];

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE = /^[+()\-.\s\d]{7,30}$/;

export function readValues(data: FormData): ContactValues {
  const get = (k: ContactField) => {
    const v = data.get(k);
    return typeof v === "string" ? v.trim() : "";
  };
  return {
    name: get("name"),
    company: get("company"),
    email: get("email"),
    phone: get("phone"),
    country: get("country"),
    need: get("need"),
    details: get("details"),
    budget: get("budget"),
    budgetCustom: get("budgetCustom"),
    timeline: get("timeline"),
  };
}

export function validate(values: ContactValues, fields: ContactField[]): ContactErrors {
  const errors: ContactErrors = {};

  for (const field of fields) {
    const value = values[field];
    if (value.length > FIELD_LIMITS[field]) {
      errors[field] = `Please keep this under ${FIELD_LIMITS[field]} characters.`;
      continue;
    }
    switch (field) {
      case "name":
        if (!value) errors.name = "Please enter your name.";
        break;
      case "company":
        if (!value) errors.company = "Please enter your company name.";
        break;
      case "email":
        if (!value) errors.email = "Please enter your work email.";
        else if (!EMAIL.test(value)) errors.email = "Please enter a valid email address.";
        break;
      case "phone":
        if (!value) errors.phone = "Please enter your phone number.";
        else if (!PHONE.test(value) || value.replace(/\D/g, "").length < 7)
          errors.phone = "Please enter a valid phone number.";
        break;
      case "country":
        if (!value) errors.country = "Please enter your country.";
        break;
      case "need":
        if (value && !isService(value)) errors.need = "Please choose a service from the list.";
        break;
      case "budget":
        // A package must belong to the chosen service; "Custom" is always allowed.
        if (
          value &&
          value !== CUSTOM_BUDGET &&
          !packagesFor(values.need).some((p) => p.name === value)
        ) {
          errors.budget = "Please choose a budget for the selected service.";
        }
        break;
      case "budgetCustom":
        if (values.budget === CUSTOM_BUDGET && !value)
          errors.budgetCustom = "Please enter your budget.";
        break;
      default:
        break;
    }
  }
  return errors;
}

export type ContactResult =
  | { status: "idle" }
  | { status: "invalid"; errors: ContactErrors }
  | { status: "success" }
  | { status: "unavailable" };
