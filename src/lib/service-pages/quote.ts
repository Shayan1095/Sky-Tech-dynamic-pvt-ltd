/* The arithmetic behind the quote builder, shared by the service page and the
   contact form so both always show the same figure.

   Prices are read from their content wording: "$150" is one-off, "$100/month"
   and "$60/year" recurring, "$2,500+" a minimum, and "Custom Quote" has no
   figure at all.
   The result is only ever presented as a starting estimate — the content is
   explicit that packages are a starting point and final pricing depends on
   scope — so a "+" price, a custom item, or a recurring item is never folded
   silently into a single number. */

export type Price =
  | { kind: "included" }
  | { kind: "once"; amount: number; open: boolean }
  | { kind: "monthly"; amount: number }
  | { kind: "yearly"; amount: number }
  | { kind: "custom" };

export function parsePrice(text: string): Price {
  /* "Included in packages": nothing to add, and nothing to quote. */
  if (/^included/i.test(text.trim())) return { kind: "included" };
  const amount = Number(text.replace(/[^0-9.]/g, ""));
  if (!text.includes("$") || !Number.isFinite(amount) || amount <= 0) return { kind: "custom" };
  if (/\/\s*month/i.test(text)) return { kind: "monthly", amount };
  if (/\/\s*year/i.test(text)) return { kind: "yearly", amount };
  return { kind: "once", amount, open: text.includes("+") };
}

export type Estimate = {
  /* One-off total: the package plus every priced one-off add-on. */
  from: number;
  /* True when any part is itself a minimum ("$2,500+"). */
  open: boolean;
  /* Recurring totals, per month and per year. */
  monthly: number;
  yearly: number;
  /* Items with no figure yet, quoted after review. */
  custom: string[];
};

export function estimate(
  packagePrice: string | undefined,
  addOns: readonly { name: string; price: string }[]
): Estimate {
  const result: Estimate = { from: 0, open: false, monthly: 0, yearly: 0, custom: [] };
  const add = (name: string, text: string) => {
    const p = parsePrice(text);
    if (p.kind === "once") {
      result.from += p.amount;
      result.open ||= p.open;
    } else if (p.kind === "monthly") {
      result.monthly += p.amount;
    } else if (p.kind === "yearly") {
      result.yearly += p.amount;
    } else if (p.kind === "included") {
      /* costs nothing extra */
    } else {
      result.custom.push(name);
    }
  };
  if (packagePrice) add("Package", packagePrice);
  addOns.forEach((a) => add(a.name, a.price));
  return result;
}

export const money = (n: number) => `$${n.toLocaleString("en-US")}`;

/* The single figure to lead with: the one-off total when there is one,
   otherwise the recurring total (a maintenance or hosting plan on its own),
   otherwise nothing — every part is quoted after review. */
export function headline(e: Estimate): { value: number; suffix: string } | null {
  if (e.from > 0) return { value: e.from, suffix: e.open ? "+" : "" };
  if (e.monthly > 0) return { value: e.monthly, suffix: "/month" };
  if (e.yearly > 0) return { value: e.yearly, suffix: "/year" };
  return null;
}

/* Recurring parts not already shown by the headline figure, as text:
   ["$100/month"], ["$60/year"], or both. */
export function recurringExtras(e: Estimate): string[] {
  const h = headline(e);
  const out: string[] = [];
  if (e.monthly > 0 && h?.suffix !== "/month") out.push(`${money(e.monthly)}/month`);
  if (e.yearly > 0 && h?.suffix !== "/year") out.push(`${money(e.yearly)}/year`);
  return out;
}

/* The whole estimate in words: "$650", "$100/month", "$650 + $100/month",
   or "Custom Quote" when nothing on it has a figure. */
export function formatEstimate(e: Estimate): string {
  const parts: string[] = [];
  if (e.from > 0) parts.push(money(e.from) + (e.open ? "+" : ""));
  if (e.monthly > 0) parts.push(`${money(e.monthly)}/month`);
  if (e.yearly > 0) parts.push(`${money(e.yearly)}/year`);
  return parts.join(" + ") || "Custom Quote";
}

/* The headline figure as text. */
export function headlineText(e: Estimate): string {
  const h = headline(e);
  return h ? money(h.value) + h.suffix : "Custom Quote";
}

/* What to record against an enquiry, and to show the visitor.

   Everything above reads dollars: parsePrice requires a "$" before it will
   believe a number, because that is the currency every service package on
   this site is priced in. The Media & Event packages are not — they are the
   published rupee prices from the celebration deck — so the arithmetic finds
   no figure in "PKR 45,000" and formatEstimate falls through to "Custom
   Quote". A visitor who chose a package with a price printed beside it then
   reached a form, and an inbox, saying their quote was custom.

   Rather than teach the arithmetic a second currency — which would let a
   rupee package and a dollar add-on be added together into a number that
   means nothing, and would put rupees into the dollar totals the panel sums
   for revenue — a price that cannot be added up is simply carried through as
   it was written. It is the package's own published price, so it needs no
   arithmetic to be true. */
export function estimateLabel(e: Estimate, packagePrice?: string): string {
  if (headline(e)) return formatEstimate(e);
  if (packagePrice && /\d/.test(packagePrice)) return packagePrice;
  return formatEstimate(e);
}
