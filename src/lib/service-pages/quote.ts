/* The arithmetic behind the quote builder, shared by the service page and the
   contact form so both always show the same figure.

   Prices are read from their content wording: "$150" is one-off, "$100/month"
   recurring, "$2,500+" a minimum, and "Custom Quote" has no figure at all.
   The result is only ever presented as a starting estimate — the content is
   explicit that packages are a starting point and final pricing depends on
   scope — so a "+" price, a custom item, or a recurring item is never folded
   silently into a single number. */

export type Price =
  | { kind: "once"; amount: number; open: boolean }
  | { kind: "monthly"; amount: number }
  | { kind: "custom" };

export function parsePrice(text: string): Price {
  const amount = Number(text.replace(/[^0-9.]/g, ""));
  if (!text.includes("$") || !Number.isFinite(amount) || amount <= 0) return { kind: "custom" };
  if (/\/\s*month/i.test(text)) return { kind: "monthly", amount };
  return { kind: "once", amount, open: text.includes("+") };
}

export type Estimate = {
  /* One-off total: the package plus every priced one-off add-on. */
  from: number;
  /* True when any part is itself a minimum ("$2,500+"). */
  open: boolean;
  /* Recurring total, per month. */
  monthly: number;
  /* Items with no figure yet, quoted after review. */
  custom: string[];
};

export function estimate(
  packagePrice: string | undefined,
  addOns: readonly { name: string; price: string }[]
): Estimate {
  const result: Estimate = { from: 0, open: false, monthly: 0, custom: [] };
  const add = (name: string, text: string) => {
    const p = parsePrice(text);
    if (p.kind === "once") {
      result.from += p.amount;
      result.open ||= p.open;
    } else if (p.kind === "monthly") {
      result.monthly += p.amount;
    } else {
      result.custom.push(name);
    }
  };
  if (packagePrice) add("Package", packagePrice);
  addOns.forEach((a) => add(a.name, a.price));
  return result;
}

export const money = (n: number) => `$${n.toLocaleString("en-US")}`;
