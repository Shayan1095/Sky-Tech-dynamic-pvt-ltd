/* SKY Tech Media & Event — the content behind /media-events.

   Taken from the two STME decks (the corporate profile and the celebration
   packages). Two things were done to it on the way in, and nothing else:

   1. Deduplicated. The decks repeat themselves heavily — the same nine
      add-ons appear on eight separate pages, the same four equipment icons
      head every package, and "what we cover" is restated for each category.
      Said once here, shown once on the page. That is where almost all of the
      length went, and not one fact was lost to it.

   2. Corrected. The decks read "Hįrllight Reel" on the Walima page and
      "Higlight Reels" on the two-event page; both are "Highlight" here. The
      brand is "Media & Event" throughout, which is the lockup the wedding
      pages use.

   Every price, duration, guest count and feature is exactly as the decks
   state it. Nothing is rounded, inferred or invented — a reader who has seen
   the PDF should find the same numbers here.

   Prices are whole rupees. They are shown formatted, never recomputed. */

export const BRAND = "SKY Tech Media & Event";
export const TAGLINE = "Making every moment memorable";

/* The name this division answers to in the contact form's service list, and
   the link that asks for a consultation about it.

   Both live here as one constant because they have to agree with the entry
   in src/lib/contact.ts exactly: the form only accepts a service it can find
   in that list, so a link spelling it differently — "Media & Events", say —
   silently loses the one piece of context the enquiry was sent with. */
export const EVENT_SERVICE = "Media & Event";

export const CONSULTATION_HREF = `/contact?type=consultation&service=${encodeURIComponent(
  EVENT_SERVICE
)}#contact-form`;

/* ------------------------------------------------------------------ */
/* Corporate                                                           */
/* ------------------------------------------------------------------ */

/** Which of the four families a category belongs to. */
export type FamilyId = "business" | "brand" | "institutions" | "production";

export type EventCategory = {
  name: string;
  /* The family it is shown under. The deck runs all fourteen together as one
     flat list, which is exhaustive rather than useful: someone looking for
     their own kind of event has to read all fourteen to learn whether it is
     there. Four named families let them find themselves in one pass, and say
     something the flat list does not — that this is four distinct lines of
     work rather than fourteen variations on one. */
  family: FamilyId;
  /* What that category actually covers, from the deck's own sub-bullets.
     Kept, not cut: "Corporate Events" tells a reader almost nothing on its
     own, while "Town hall meetings, client appreciation events, leadership
     and strategy sessions" tells them whether their event is on the list.
     They sit inside a disclosure on the page, so the detail is there for
     anyone who wants it and costs no height for anyone who does not. */
  covers: readonly string[];
};

/** The four families, in the order the page shows them. */
export const CATEGORY_FAMILIES: readonly { id: FamilyId; label: string }[] = [
  { id: "business", label: "Business & corporate" },
  { id: "brand", label: "Brand & recognition" },
  { id: "institutions", label: "Education & community" },
  { id: "production", label: "Ceremonies & production" },
];

/** The fourteen kinds of event the deck's service page lists.

    Ordered by family rather than in the deck's own sequence, so that the
    numbering a reader sees runs 01 to 14 without jumping between groups. No
    category was added, dropped or reworded to do it — only moved. */
export const EVENT_CATEGORIES: readonly EventCategory[] = [
  {
    name: "Corporate Events",
    family: "business",
    covers: [
      "Annual dinners",
      "Business meetups",
      "Conferences & summits",
      "Networking events",
      "Town hall meetings",
      "Award ceremonies",
      "Client appreciation events",
      "Staff gatherings",
      "Product & business presentations",
      "Leadership & strategy sessions",
    ],
  },
  {
    name: "Conferences & Seminars",
    family: "business",
    covers: [
      "National & international conferences",
      "Academic & medical seminars",
      "Leadership summits",
      "Policy dialogues",
      "Panel discussions",
    ],
  },
  {
    name: "Hi-Tea & Coffee Events",
    family: "business",
    covers: [
      "Corporate hi-tea",
      "Business breakfasts",
      "Client meetups",
      "Networking sessions",
      "Staff gatherings",
    ],
  },
  {
    name: "Training & Workshops",
    family: "business",
    covers: [
      "Training sessions",
      "Capacity building",
      "Professional development",
      "Seminars & panel discussions",
      "Awareness programmes",
    ],
  },
  {
    name: "Exhibitions & Trade Shows",
    family: "brand",
    covers: [
      "Product exhibitions",
      "Trade shows",
      "Education exhibitions",
      "Stall design & setup",
      "Visitor coverage",
    ],
  },
  {
    name: "Product Launches & Brand Activations",
    family: "brand",
    covers: [
      "Product launches",
      "Brand launches",
      "New branch openings",
      "Campaign launches",
      "Media & influencer events",
    ],
  },
  {
    name: "Awards & Recognition Events",
    family: "brand",
    covers: [
      "Achievement awards",
      "Employee recognition",
      "Excellence awards",
      "Appreciation events",
      "Red carpet & award moments",
    ],
  },
  {
    name: "Graduation & Certification Ceremonies",
    family: "institutions",
    covers: [
      "Graduation ceremonies",
      "Certificate distribution",
      "Student recognition",
      "Convocation-style events",
      "Youth entrepreneurship showcases",
    ],
  },
  {
    name: "School, College & University Events",
    family: "institutions",
    covers: [
      "Annual functions",
      "Prize distributions",
      "Orientation & freshers events",
      "Sports & cultural days",
      "Alumni & convocation events",
    ],
  },
  {
    name: "NGO / CSR & Community Events",
    family: "institutions",
    covers: [
      "Awareness campaigns",
      "Fundraising events",
      "Community programmes",
      "Project launches",
      "Social impact events",
    ],
  },
  {
    name: "Healthcare & Professional Events",
    family: "institutions",
    covers: [
      "Medical conferences",
      "Health awareness campaigns",
      "Hospital events",
      "Equipment launches",
      "Professional workshops",
    ],
  },
  {
    name: "Inaugurations & Opening Ceremonies",
    family: "production",
    covers: [
      "Office & facility openings",
      "Project inaugurations",
      "Ribbon cutting ceremonies",
      "Branch launches",
      "Groundbreaking events",
    ],
  },
  {
    name: "Event Planning & Management",
    family: "production",
    covers: [
      "Concept & theme planning",
      "Venue coordination",
      "Guest management",
      "Catering coordination",
      "Logistics & on-site management",
    ],
  },
  {
    name: "Decor, Stage & Technical Setup",
    family: "production",
    covers: [
      "Stage & backdrop setup",
      "Thematic decor & styling",
      "Sound, lighting & LED screens",
      "Seating & furniture arrangement",
      "Complete technical support",
    ],
  },
];

/** The categories grouped for display, each keeping the number it carries in
    the full run of fourteen. */
export function categoryFamilies(): readonly {
  id: FamilyId;
  label: string;
  items: readonly { index: number; category: EventCategory }[];
}[] {
  const numbered = EVENT_CATEGORIES.map((category, index) => ({ index, category }));
  return CATEGORY_FAMILIES.map((family) => ({
    ...family,
    items: numbered.filter((entry) => entry.category.family === family.id),
  }));
}

/* What is handled on the day. The deck repeats this per category; it is the
   same list every time, so it is stated once. */
export const COVERAGE: readonly string[] = [
  "Concept & theme planning",
  "Venue setup & branding",
  "Stage, backdrop & AV setup",
  "Seating & hospitality arrangements",
  "Guest management & registration",
  "Catering coordination",
  "Photography & videography",
  "Live streaming (optional)",
  "Same-day reels & social content",
  "Event highlights film",
  "Certificates, awards & gifts",
  "Post-event coverage & reporting",
];

/* The media side, which is half the business and is easy to lose behind the
   event planning. */
export const PRODUCTION: readonly string[] = [
  "Event photography",
  "Event videography",
  "Drone coverage",
  "Same-day reels",
  "Highlight films",
  "Interviews & testimonials",
  "Live event coverage",
  "Social media content",
];

/* The deck's "Why Choose Us" strip and its values, which are the only place
   it says anything about how the company works rather than what it sells. */
export const STRENGTHS: readonly { title: string; note: string }[] = [
  {
    title: "One team, one contact",
    note: "Planning, production, decor and coverage are the same people. Nothing is subcontracted out to a stranger on the day.",
  },
  {
    title: "Setups built for the room",
    note: "Stage, backdrop, lighting and seating designed for the venue and the theme, not pulled from a standing kit.",
  },
  {
    title: "Media in-house",
    note: "Photographers and videographers who were in the planning meetings, so they know what is about to happen and where to stand.",
  },
  {
    title: "Trusted by institutions",
    note: "Universities, hospitals, foundations and government bodies, where the standard for a public event is unforgiving.",
  },
];

export const APPROACH: readonly { step: string; label: string; note: string }[] = [
  { step: "01", label: "Understand", note: "Your goals and vision" },
  { step: "02", label: "Plan", note: "Creative concepts and detailed planning" },
  { step: "03", label: "Execute", note: "Seamless on-ground management" },
  { step: "04", label: "Capture", note: "Professional photo, video and media content" },
  { step: "05", label: "Create Impact", note: "Memorable experiences and lasting stories" },
];

/* Named in the deck's own client page. Text rather than logos: the logo files
   were not supplied, and a redrawn mark is not a client's mark. */
export const CLIENTS: readonly string[] = [
  "Rotary District 3271",
  "Dow University of Health Sciences",
  "Al-Mustafa Welfare Society",
  "Engro Foundation",
  "HBL Foundation",
  "Shell Tameer",
];

/* ------------------------------------------------------------------ */
/* Weddings & celebrations                                             */
/* ------------------------------------------------------------------ */

export type Package = {
  slug: string;
  name: string;
  price: number;
  /** "Up to 5 hours coverage", "Two events coverage" — the deck's own words. */
  coverage: string;
  features: readonly string[];
  /** Set on the combined packages, which are the ones worth steering to. */
  feature?: boolean;
};

/** One ceremony, one day. */
export const SINGLE_EVENT: readonly Package[] = [
  {
    slug: "nikah-engagement",
    name: "Nikah / Engagement",
    price: 35000,
    coverage: "Up to 4 hours",
    features: [
      "1 professional photographer",
      "1 professional videographer",
      "High-end Sony camera coverage",
      "Nikah / engagement ceremony coverage",
      "Candid + traditional photography",
      "Bride & groom portraits",
      "Family & guest coverage",
      "Stage & decor coverage",
      "Ring & ritual moments",
      "Full event video (edited)",
      "2–3 minute highlight reel",
      "200+ edited photos",
      "Couple portrait session (within venue)",
      "Online gallery (digital delivery)",
    ],
  },
  {
    slug: "mehndi-mayo",
    name: "Mehndi / Mayo",
    price: 45000,
    coverage: "Up to 5 hours",
    features: [
      "1 professional photographer",
      "1 professional videographer",
      "Candid + traditional photography",
      "Bride portraits",
      "Mehndi decor & details",
      "Family & guest coverage",
      "Cultural moments",
      "Full event video (edited)",
      "2–3 minute highlight reel",
      "250+ edited photos",
      "Beautiful decor & ambient coverage",
      "Online gallery (digital delivery)",
    ],
  },
  {
    slug: "barat-shadi",
    name: "Barat / Shadi",
    price: 55000,
    coverage: "Up to 6 hours",
    features: [
      "1 professional photographer",
      "1 professional videographer",
      "High-end Sony camera coverage",
      "Bride room & entry coverage",
      "Groom barat coverage",
      "Nikah / main ceremony",
      "Candid + traditional photography",
      "Family & guest photos",
      "Stage & couple portraits",
      "Full event video (edited)",
      "3–5 minute cinematic highlight reel",
      "300+ edited photos",
      "Decor & ambience coverage",
      "Multiple locations (within Karachi)",
      "Online gallery (digital delivery)",
    ],
  },
  {
    slug: "walima",
    name: "Walima",
    price: 45000,
    coverage: "Up to 5 hours",
    features: [
      "1 professional photographer",
      "1 professional videographer",
      "Candid + traditional photography",
      "Couple portraits",
      "Family & guest coverage",
      "Stage & decor coverage",
      "Walima ceremony coverage",
      "Full event video",
      "Highlight reel (2–3 minutes)",
      "250+ edited photos",
      "Bride & groom portraits",
      "Beautiful decor & details coverage",
      "Online gallery (digital delivery)",
    ],
  },
  {
    slug: "outdoor-couple-shoot",
    name: "Outdoor Couple Shoot",
    price: 35000,
    coverage: "Up to 3 hours",
    features: [
      "1 professional photographer",
      "1 professional videographer",
      "Candid + concept photography",
      "Couple portraits (multiple looks)",
      "Multiple outdoor locations (within Karachi)",
      "Creative angles & poses",
      "Drone shots (optional)",
      "Short cinematic highlight reel (2–3 minutes)",
      "150+ edited photos",
      "Colour grading & professional editing",
      "Outfits & theme-based coverage",
      "Online gallery (digital delivery)",
    ],
  },
];

/** More than one ceremony, booked together. */
export const COMBINED: readonly Package[] = [
  {
    slug: "two-events",
    name: "Two Events",
    price: 95000,
    coverage: "Any two events — Mehndi + Barat, or Barat + Walima",
    features: [
      "2 events coverage",
      "1 photographer per event",
      "1 videographer per event",
      "Candid + traditional photography",
      "Bride & groom portraits",
      "Family & guest coverage",
      "Decor & details coverage",
      "2 full event videos",
      "2 highlight reels (2–3 minutes each)",
      "500+ edited photos",
      "Multiple locations coverage (within Karachi)",
      "Drone coverage (1 event)",
      "Outfits & theme-based coverage",
      "Online gallery (digital delivery)",
    ],
  },
  {
    slug: "complete-wedding",
    name: "Complete Wedding",
    price: 135000,
    coverage: "Three days — Mehndi + Barat + Walima",
    feature: true,
    features: [
      "3 events coverage (Mehndi + Barat + Walima)",
      "Professional photography & videography",
      "High-end Sony camera setup",
      "Candid + traditional photography",
      "Bride & groom portraits",
      "Family & guest coverage",
      "Decor & details photography",
      "Stage & venue coverage",
      "Full event videos (3)",
      "3 highlight reels (2–3 minutes each)",
      "Cinematic wedding film (5–7 minutes)",
      "800+ edited photos",
      "Drone coverage (1 event)",
      "Multiple locations coverage (within Karachi)",
      "Outfits & theme-based coverage",
      "Premium album (optional)",
      "Online gallery (digital delivery)",
    ],
  },
];

export type Tier = {
  tier: string;
  price: number;
  guests: string;
  features: readonly string[];
};

export type Celebration = {
  slug: string;
  name: string;
  note: string;
  tiers: readonly Tier[];
};

/** Priced by guest count rather than by hours. */
export const CELEBRATIONS: readonly Celebration[] = [
  {
    slug: "bridal-shower",
    name: "Bridal Shower",
    note: "Theme, decor and the whole room built around the bride-to-be.",
    tiers: [
      {
        tier: "Basic",
        price: 85000,
        guests: "Up to 25 guests",
        features: [
          "Theme planning",
          "Basic decor setup",
          "Welcome backdrop",
          "Seating arrangement",
          "Sound system",
          "Event coordination",
        ],
      },
      {
        tier: "Standard",
        price: 125000,
        guests: "Up to 50 guests",
        features: [
          "Custom theme design",
          "Premium decor setup",
          "Flower arrangements",
          "Photo booth corner",
          "Bride-to-be props",
          "Games & activities",
          "Sound & lighting",
          "Event coordination",
        ],
      },
      {
        tier: "Premium",
        price: 185000,
        guests: "Up to 100 guests",
        features: [
          "Luxury theme design",
          "Full venue transformation",
          "Bridal entry setup",
          "Photo & videography",
          "Catering coordination",
          "Engagement activities",
          "Personalised goodie bags",
          "Sound, lighting & special effects",
          "Dedicated event team",
        ],
      },
    ],
  },
  {
    slug: "dholki",
    name: "Dholki",
    note: "Colour, music and tradition — the night before everything begins.",
    tiers: [
      {
        tier: "Basic",
        price: 75000,
        guests: "Up to 25 guests",
        features: [
          "Theme planning",
          "Traditional decor",
          "Seating arrangement",
          "Basic sound system",
          "Event coordination",
        ],
      },
      {
        tier: "Standard",
        price: 115000,
        guests: "Up to 50 guests",
        features: [
          "Custom theme & colour",
          "Traditional decor setup",
          "Flower & gota accents",
          "Dholki & live music setup",
          "Dance floor setup",
          "Games & activities",
          "Sound & lighting",
          "Event coordination",
        ],
      },
      {
        tier: "Premium",
        price: 175000,
        guests: "Up to 100 guests",
        features: [
          "Premium theme design",
          "Full decor & ambience",
          "Dhol player / live music",
          "Dance floor & stage setup",
          "Professional photography",
          "Candid videography",
          "Custom props & signage",
          "Catering coordination",
          "Dedicated event team",
        ],
      },
    ],
  },
  {
    slug: "qawwali-night",
    name: "Qawwali Night",
    note: "A spiritual musical evening, staged and recorded properly.",
    tiers: [
      {
        tier: "Basic",
        price: 150000,
        guests: "Up to 50 guests",
        features: [
          "Theme planning",
          "Stage setup",
          "Seating arrangement",
          "Basic sound system",
          "Event coordination",
        ],
      },
      {
        tier: "Standard",
        price: 250000,
        guests: "Up to 100 guests",
        features: [
          "Custom theme design",
          "Stage & backdrop setup",
          "Professional sound system",
          "Live qawwal group (4–6 members)",
          "Seating (majlis style)",
          "Lighting & ambience",
          "Event coordination",
        ],
      },
      {
        tier: "Premium",
        price: 400000,
        guests: "Up to 200 guests",
        features: [
          "Grand theme design",
          "Complete stage setup",
          "Renowned qawwal group",
          "Professional sound & lighting",
          "Live recording (audio/video)",
          "LED screening (optional)",
          "Catering coordination",
          "VIP seating arrangement",
          "Dedicated event team",
        ],
      },
    ],
  },
];

/* The same nine on every package in the deck, so listed once. */
export const ADD_ONS: readonly { name: string; price: number }[] = [
  { name: "Drone coverage", price: 8000 },
  { name: "Extra photographer", price: 15000 },
  { name: "Extra videographer", price: 15000 },
  { name: "Same-day highlight reel", price: 10000 },
  { name: "Extra reel", price: 4000 },
  { name: "Extra footage", price: 15000 },
  { name: "Premium album", price: 15000 },
  { name: "Outdoor shoot", price: 15000 },
  { name: "Raw footage", price: 10000 },
];

/* What the deck calls "more ways to make it special". Small print on the
   page, because that is what it is — the packages are the offer. */
export const BOOKING_NOTES: readonly { title: string; note: string }[] = [
  { title: "Multi-event discount", note: "Book Mehndi, Barat and Walima together and save." },
  { title: "Early booking bonus", note: "Book early for add-ons such as extra reels or a premium album." },
  { title: "Flexible payment", note: "Instalment options are available." },
  { title: "Custom packages", note: "Pay for the services you want and nothing else." },
];

/* ------------------------------------------------------------------ */
/* Formatting                                                          */
/* ------------------------------------------------------------------ */

/* Grouped the way rupee amounts are read here, and as plain digits rather
   than a locale call, so the server and the browser cannot disagree about
   the separator and force React to re-render the number. */
export function pkr(amount: number): string {
  return "PKR " + amount.toLocaleString("en-US");
}
