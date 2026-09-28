/* The brands SKY Tech has worked with, for the wall on the home page.

   `file` is a WebP in public/brands/, built from the supplied artwork by
   scripts/build-brand-logos.mjs. The artwork is never cropped, trimmed or
   recoloured — only resized — so `ratio` differs from one mark to the next
   and the tile sizes each logo by its height, letting the width follow.

   Each logo remains the trademark of its owner and is shown only to say who
   SKY Tech has worked with.

   Adding a brand: drop the artwork in the logos folder, re-run the script,
   add a line here. Order is the order they appear, which the wall then
   splits across its rows. */

export type Brand = {
  /** The name shown beside the mark. */
  name: string;
  /** Basename in public/brands/, without the extension. */
  file: string;
  /** Intrinsic width ÷ height of the built file, so the tile reserves space. */
  ratio: number;
};

export const BRANDS: readonly Brand[] = [
  { name: "Agency Blue360", file: "agency-blue-logo", ratio: 2.0 },
  { name: "Al Manz Foods", file: "al-manz-logo", ratio: 2.33 },
  { name: "BestBoard Industries", file: "best-board-logo", ratio: 1.0 },
  { name: "Crescent Hijama", file: "crescent-hijama-logo", ratio: 1.05 },
  { name: "Glamour", file: "glamour-logo", ratio: 1.05 },
  { name: "HNS Education", file: "hns-logo", ratio: 1.0 },
  { name: "JMC Engineers", file: "jmc-logo", ratio: 1.78 },
  { name: "JS Timeless Leather", file: "js-logo", ratio: 1.0 },
  { name: "Lion Gate Builders", file: "lion-gate-logo", ratio: 1.5 },
  { name: "Maravilla", file: "maravilla-logo", ratio: 1.0 },
  { name: "Multi Hub", file: "multi-hub-logo", ratio: 1.0 },
  { name: "NSculpt5 Pilates", file: "ns-logo", ratio: 1.5 },
  { name: "Ojee", file: "ojee-logo", ratio: 1.0 },
  { name: "Sky Shop", file: "sky-shop-logo", ratio: 1.0 },
  { name: "SkyTech IT Institute", file: "skytech-it", ratio: 1.78 },
  { name: "SkyTech", file: "skytech", ratio: 1.05 },
  { name: "Sultana's Beauty Salon", file: "sultana-salon-logo", ratio: 1.0 },
  { name: "Talal Perfect Pixels", file: "talal-logo", ratio: 2.0 },
  { name: "The Intellects Club", file: "the-intellects-club-logo", ratio: 1.0 },
  { name: "Vision Core Solutions", file: "vcs-logo", ratio: 1.5 },
  { name: "Women Circle", file: "women-circle-logo", ratio: 1.0 },
  { name: "XPO", file: "xpo-logo", ratio: 1.0 },
  { name: "Zarabz Studio & Academy", file: "zara-logo", ratio: 1.0 },
];
