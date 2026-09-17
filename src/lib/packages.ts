/* The six service combinations, worded exactly as in
   src/content/services/main.md. Shared by the Service Combinations section
   and the contact form: the section links to /contact?type=package&package=…
   and the form resolves the slug back to the same entry, so what the visitor
   picked is what the inbox receives. */

export type Combination = {
  slug: string;
  /* The services being combined, in the order the content lists them. */
  parts: readonly string[];
  outcome: string;
};

export const COMBINATIONS: readonly Combination[] = [
  {
    slug: "website-digital-marketing",
    parts: ["Website", "Digital Marketing"],
    outcome: "Build your online presence and attract the right audience.",
  },
  {
    slug: "wordpress-seo-content",
    parts: ["WordPress", "SEO Content"],
    outcome: "Create a professional website with content designed for visibility.",
  },
  {
    slug: "social-design-video",
    parts: ["Social Media", "Graphic Design", "Video Editing"],
    outcome: "Maintain a consistent and engaging social media presence.",
  },
  {
    slug: "ads-landing-tracking",
    parts: ["Google Ads", "Landing Page", "Conversion Tracking"],
    outcome: "Create a more structured lead-generation campaign.",
  },
  {
    slug: "meta-ads-creative-social",
    parts: ["Meta Ads", "Creative Content", "Social Media Management"],
    outcome: "Combine advertising with consistent brand communication.",
  },
  {
    slug: "event-video-social",
    parts: ["Event Coverage", "Video Editing", "Social Media Content"],
    outcome: "Turn your event into content that continues to work after the day ends.",
  },
] as const;

/* "Website + Digital Marketing" — the combination as the content writes it. */
export const combinationLabel = (combination: Combination) =>
  combination.parts.join(" + ");

/* A slug is only ever trusted after it has been matched against the list, so
   nothing arbitrary can arrive through the query string. */
export const findCombination = (slug: string): Combination | undefined =>
  COMBINATIONS.find((c) => c.slug === slug);

/* The most parts any combination has, used to hold the package panel at a
   constant height so choosing between a two-part and a three-part
   combination never shifts the layout. */
export const MAX_PARTS = COMBINATIONS.reduce(
  (n, c) => Math.max(n, c.parts.length),
  0
);

export const combinationHref = (combination: Combination) =>
  `/contact?type=package&package=${combination.slug}#contact-form`;
