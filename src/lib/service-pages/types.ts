/* The shape every service page is built from.

   One template renders all thirteen services, so this type is the contract
   between the content and the design: a section appears only when its data
   is present, and each service fills in what its own content file provides.

   All copy is transcribed verbatim from src/content/services/<slug>.md. The
   files are not parsed directly — their markdown is inconsistent between
   services and some contradict themselves, so each one is read and resolved
   by a person once, here, rather than guessed at by a parser on every build.

   Inline emphasis in body copy uses three markers, rendered by <Rich>:
     **text**  strong          ==text==  highlighted in the brand blue
     ~~text~~  struck through — the problem section's "what a bad site costs" */

export type ServiceTier = {
  /* Stable id for the tier: used in the URL hash and as the React key. */
  id: string;
  name: string;
  bestFor: string;
  /* Verbatim, e.g. "$299" or "$2,500+". Always US dollars. */
  price: string;
  includes: readonly string[];
  /* "Technology Options" — the stack this tier can be built on. */
  tech?: readonly string[];
  /* "Recommended For" or "Ideal For", with the label the content uses. */
  audience?: { label: string; text: string };
  /* "Examples" — what this tier can be. */
  examples?: readonly string[];
  cta: string;
};

/* A bespoke offering beyond the packages: Web Development's marketplace
   solutions, Digital Marketing's SEO service, and so on. */
export type ServiceCapability = {
  id: string;
  title: string;
  body: readonly string[];
  listLabel: string;
  list: readonly string[];
  priceLabel?: string;
  price?: string;
  priceNote?: string;
  cta: string;
};

export type ServiceCostRange = {
  label: string;
  /* Numeric bounds for the chart only; the label beside each bar uses
     `display`, which is the content's own wording. */
  min: number;
  max: number;
  /* "$3,000+" — the bar runs on past its maximum. */
  openEnded: boolean;
  display: string;
  /* The package this range corresponds to, for the budget finder. */
  tier?: string;
};

/* Where a "What We Build" item leads: the package that delivers it, or the
   add-on that does. A design decision, not content — each is confirmed with
   the client when a service is transcribed. */
export type OfferingFit = { tier: string } | { addOn: string };

/* The evidence under a "Why choose us" reason — something on this page (or
   this site) that shows the claim is true, rather than a restatement of it.
   Most are built from the page's own data, so they can't drift from it:
     process   a step of this page's process          pricing  the price ladder
     addOn     an add-on, addable to the quote         stack    the technology count
     speed     this site's Google PageSpeed score, with a link to re-test it
     drawing   a small schematic, where the proof is a principle, not a figure */
export type WhyProof =
  | { kind: "process"; step: number }
  | { kind: "pricing" }
  | { kind: "addOn"; name: string }
  | { kind: "stack" }
  | { kind: "speed" }
  | { kind: "drawing"; drawing: "responsive" | "structure" | "custom" };

export type ServicePage = {
  slug: string;
  /* The name the contact form knows this service by (src/lib/contact.ts). */
  contactName: string;

  hero: {
    /* The content's document title, shown as the hero's label. */
    label: string;
    h1: string;
    /* How many of the H1's closing words are set in the brand blue — the
       outcome the visitor is buying ("…Grow Your Business"). */
    accentWords?: number;
    subheadline: string;
    primaryCta: string;
    secondaryCta: string;
    /* The spec card's timeline line, taken from the timeline section. */
    timeline?: { label: string; value: string };
  };

  problem: { heading: string; paragraphs: readonly string[] };

  offerings: {
    heading: string;
    items: readonly { title: string; body: string; fit?: OfferingFit }[];
  };

  packages: {
    heading: string;
    priceLabel: string;
    tiers: readonly ServiceTier[];
  };

  capabilities?: readonly ServiceCapability[];

  addOns?: {
    heading: string;
    intro: string;
    columns: readonly [string, string];
    items: readonly { name: string; price: string }[];
  };

  technology?: {
    heading: string;
    intro: string;
    groups: readonly { label: string; items: readonly string[] }[];
  };

  why: {
    heading: string;
    /* `featured` spans two columns of the grid. */
    items: readonly { title: string; body: string; proof?: WhyProof; featured?: boolean }[];
  };

  process: {
    heading: string;
    steps: readonly { title: string; body: string }[];
  };

  investment?: {
    heading: string;
    intro: string;
    label: string;
    ranges: readonly ServiceCostRange[];
    note: string;
  };

  timeline?: { heading: string; paragraphs: readonly string[] };

  /* Related services that this page also sells as an add-on, by service
     name → add-on name. Their rows in the Related section can be added to
     the quote directly. */
  relatedAddOns?: Readonly<Record<string, string>>;

  faq: {
    heading: string;
    items: readonly { question: string; answer: string }[];
  };

  closing: {
    kicker: string;
    heading: string;
    body: string;
    promise: string;
    primaryCta: string;
    secondaryCta: string;
  };
};
