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
        // The detailed packages in wordpress-development.md, in US dollars;
        // the PKR table there is PENDING_CONFIRMATION and not used.
        name: "WordPress Development",
        packages: [
          { name: "WordPress Starter", price: "$299" },
          { name: "WordPress Business", price: "$500" },
          { name: "WordPress Advanced", price: "$800" },
          { name: "WooCommerce Store", price: "$600" },
          { name: "Custom WooCommerce Solution", price: "$1,500" },
        ],
      },
      {
        // The detailed packages in ui-ux-design.md; the summary table at
        // the end of that file is not used, as on Web Development.
        name: "UI/UX Design",
        packages: [
          { name: "UI Starter", price: "$200" },
          { name: "UI/UX Professional", price: "$400" },
          { name: "UI/UX Advanced", price: "$800" },
          { name: "Product Design", price: "$1,500" },
        ],
      },
      {
        // The detailed packages in graphic-design.md; the summary table at
        // the end of that file is not used.
        name: "Graphic Design",
        packages: [
          { name: "Essential Design", price: "$99" },
          { name: "Business Design", price: "$249" },
          { name: "Professional Creative", price: "$499" },
          { name: "Complete Brand Identity", price: "$799" },
          { name: "Custom Design Partnership", price: "Custom Quote" },
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
        // The detailed packages in social-media-management.md; the summary
        // table at the end of that file (which reuses Digital Marketing's
        // package names) is not used.
        name: "Social Media Management",
        packages: [
          { name: "Starter", price: "$299/month" },
          { name: "Professional", price: "$499/month" },
          { name: "Premium", price: "$799/month" },
          { name: "Custom Social Media Management", price: "Custom Quote" },
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
        // The detailed packages in content-writing.md; the summary table at
        // the end of that file is not used.
        name: "Content Writing",
        packages: [
          { name: "Essential Content", price: "$99" },
          { name: "Business Content", price: "$249" },
          { name: "SEO Content Growth", price: "$399/month" },
          { name: "Content Pro", price: "$699/month" },
          { name: "Custom Content Partnership", price: "Custom Quote" },
        ],
      },
      {
        // The detailed packages in video-production.md, then its monthly
        // content packages; the summary table at the end is not used.
        name: "Video Editing & Production",
        packages: [
          { name: "Basic Editing", price: "$25/video" },
          { name: "Standard Editing", price: "$99/video" },
          { name: "Premium Editing", price: "$299/video" },
          { name: "Custom Video Production", price: "$449+" },
          { name: "Content Starter", price: "$299/month" },
          { name: "Content Growth", price: "$599/month" },
          { name: "Content Pro", price: "$999/month" },
        ],
      },
      {
        // The detailed packages in event-photography-video.md; the summary
        // table at the end of that file is not used.
        name: "Event Photography & Video",
        packages: [
          { name: "Event Essentials", price: "$250" },
          { name: "Event Pro", price: "$500" },
          { name: "Event Premium", price: "$900" },
          { name: "Full Event Production", price: "$1,500" },
          { name: "Custom Event Solution", price: "Custom Quote" },
        ],
      },
      {
        /* SKY Tech Media & Event — the division, not the service above.
           Someone asking about a Walima is not asking for the same thing as
           someone buying event coverage by the day, and until this existed
           they had nowhere to land: /media-events sent the package they had
           chosen to a form that had no package that matched, so the name of
           it was dropped on the way in and the enquiry arrived saying only
           "an event, some package".

           Prices are the published ones from the celebration deck, in
           rupees, exactly as /media-events shows them. They are quoted here
           only so the form can recognise the package the visitor clicked —
           the page remains the place they are set. */
        name: "Media & Event",
        packages: [
          { name: "Nikah / Engagement", price: "PKR 35,000" },
          { name: "Mehndi / Mayo", price: "PKR 45,000" },
          { name: "Barat / Shadi", price: "PKR 55,000" },
          { name: "Walima", price: "PKR 45,000" },
          { name: "Outdoor Couple Shoot", price: "PKR 35,000" },
          { name: "Two Events", price: "PKR 95,000" },
          { name: "Complete Wedding", price: "PKR 135,000" },
          { name: "Bridal Shower — Basic", price: "PKR 85,000" },
          { name: "Bridal Shower — Standard", price: "PKR 125,000" },
          { name: "Bridal Shower — Premium", price: "PKR 185,000" },
          { name: "Dholki — Basic", price: "PKR 75,000" },
          { name: "Dholki — Standard", price: "PKR 115,000" },
          { name: "Dholki — Premium", price: "PKR 175,000" },
          { name: "Qawwali Night — Basic", price: "PKR 150,000" },
          { name: "Qawwali Night — Standard", price: "PKR 250,000" },
          { name: "Qawwali Night — Premium", price: "PKR 400,000" },
        ],
      },
    ],
  },
  {
    category: "Support & Operations",
    services: [
      {
        // The detailed packages in hosting-domain.md; the summary table at
        // the end of that file is not used.
        name: "Hosting & Domain",
        packages: [
          { name: "Starter Hosting", price: "$60/year" },
          { name: "Business Hosting", price: "$120/year" },
          { name: "WordPress Hosting", price: "$150/year" },
          { name: "E-Commerce Hosting", price: "$250/year" },
          { name: "Custom Hosting Solution", price: "Custom Quote" },
        ],
      },
      {
        // The detailed packages in website-maintenance.md; the summary
        // table at the end of that file is not used.
        name: "Website Maintenance",
        packages: [
          { name: "Essential Maintenance", price: "$100/month" },
          { name: "Business Maintenance", price: "$200/month" },
          { name: "Professional Maintenance", price: "$350/month" },
          { name: "E-Commerce Maintenance", price: "$500/month" },
          { name: "Custom Website Care", price: "Custom Quote" },
        ],
      },
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

export function validate(
  values: ContactValues,
  fields: ContactField[],
  /* A free consultation with no subject is an enquiry nobody can prepare
     for — somebody has to write back and ask what it is about before any
     work can start. When the visitor arrived by asking for one, the service
     stops being optional. Checked here rather than in the form alone, so a
     submission that skips the browser is held to the same rule. */
  options: { requireService?: boolean } = {}
): ContactErrors {
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
        if (!value && options.requireService) {
          errors.need = "Please choose which service your consultation is about.";
        } else if (value && !isService(value)) {
          errors.need = "Please choose a service from the list.";
        }
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

/* ---------------------------------------------------------------------------
   Enquiry type.

   Most visitors arrive from a single service link (/contact?service=Google
   Ads). Two entry points mean something different: the Services page's
   combination builder sends ?type=package, and its consultation links send
   ?type=consultation. Carrying that through to the inbox is what lets a
   package request be told apart from a one-service enquiry, so it is a real
   submitted value — and, like every submitted value, it is only trusted
   after it has been matched against this list.
   ------------------------------------------------------------------------ */
export const ENQUIRY_TYPES = ["package", "consultation", "demo"] as const;

export type EnquiryType = (typeof ENQUIRY_TYPES)[number];

export function isEnquiryType(value: string): value is EnquiryType {
  return (ENQUIRY_TYPES as readonly string[]).includes(value);
}

/* Anything unrecognised — including a tampered POST — becomes "". */
export function readEnquiryType(data: FormData): EnquiryType | "" {
  const value = data.get("enquiry");
  return typeof value === "string" && isEnquiryType(value) ? value : "";
}

/* What the visitor is shown once they arrive, so the context they clicked
   from is visibly carried over instead of silently dropped. */
export const ENQUIRY_LABELS: Record<EnquiryType, { badge: string; note: string }> = {
  package: {
    badge: "Package Enquiry",
    note: "You're asking about a combined service package — tell us which services you have in mind below and we'll price them together.",
  },
  consultation: {
    badge: "Free Consultation",
    note: "You're booking a free consultation. Tell us which service it's about below, and share as much or as little else as you like — we'll take it from there.",
  },
  demo: {
    badge: "Product Demo",
    note: "You're asking to see one of our systems running. Tell us a little about how your business works and we'll set the demo up with your own kind of data.",
  },
};

/* The package note above is written for the Services page's combination
   builder, where the visitor has assembled several services and none of them
   has a price yet. Arriving from a published price list it is wrong in both
   halves: there is one package, not a combination, and it is already priced.
   Used in place of it whenever the link named a package we can recognise. */
export const NAMED_PACKAGE_NOTE =
  "You're asking about the package shown above. Tell us the date and anything particular about the day, and we'll confirm it.";
