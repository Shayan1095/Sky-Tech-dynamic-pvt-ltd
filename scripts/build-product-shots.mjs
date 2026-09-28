/* Prepares the product screenshots for the Products page.

   Run: node scripts/build-product-shots.mjs [source-folder]
   Default source: ../portfolio

   The screenshots arrive as JPEGs with spaces and inconsistent casing in
   their names. This copies each to a stable slug under public/products/ and
   caps the width, so the page's image data never has to know what the file
   was called when it was taken. Nothing is cropped or recoloured — a product
   screenshot is a record of what the software looks like, and trimming it
   would make it a record of something else.

   Next's image pipeline serves these as AVIF or WebP at whatever width the
   layout asks for, so one file per product is enough.

   Replacing a screenshot: drop the new file in the source folder under the
   same name, re-run this. If the name changes, update SHOTS below and the
   matching entry in src/lib/products.ts.

   After running, the printed dimensions go into src/lib/products.ts — the
   page sets width and height so a screenshot never reflows the section as
   it loads. */

import { mkdirSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

import sharp from "sharp";

/* Wider than any column that shows them, so the pipeline always downscales
   rather than stretching. */
const MAX_WIDTH = 1600;

const SOURCE = process.argv[2] ?? join("..", "portfolio");
const OUT = join("public", "products");

/* Source file -> slug. The slug is what src/lib/products.ts refers to and
   what the served file is called. Keeping the map explicit means a renamed
   or re-exported screenshot fails loudly here rather than 404ing on the page. */
const SHOTS = {
  "Dot Pro -ERP.jpeg": "dotpro-erp",
  "Dot Pro Schooling system.jpeg": "dotpro-school",
  "KA Digital - Inventory MAnagement.jpeg": "inventory",
  "Online Quran Academy Portal.jpeg": "quran-academy",
  "Resturant PoS.jpeg": "restaurant-pos",
};

async function main() {
  let present;
  try {
    present = new Set(readdirSync(SOURCE));
  } catch {
    console.error(`Cannot read ${SOURCE}. Pass the screenshot folder as an argument.`);
    process.exit(1);
  }

  mkdirSync(OUT, { recursive: true });

  const missing = Object.keys(SHOTS).filter((f) => !present.has(f));
  if (missing.length > 0) {
    console.error("Missing from the source folder:");
    for (const f of missing) console.error("  " + f);
    process.exit(1);
  }

  let bytesIn = 0;
  let bytesOut = 0;
  const built = [];

  for (const [file, slug] of Object.entries(SHOTS)) {
    const from = join(SOURCE, file);
    const to = join(OUT, `${slug}.webp`);

    const info = await sharp(from)
      .resize({ width: MAX_WIDTH, withoutEnlargement: true })
      .webp({ quality: 93 })
      .toFile(to);

    bytesIn += statSync(from).size;
    bytesOut += statSync(to).size;
    built.push({ slug, w: info.width, h: info.height, kb: Math.round(statSync(to).size / 1024) });
  }

  const kb = (n) => `${(n / 1024).toFixed(0)} KB`;
  console.log(`Built ${built.length} screenshot(s) into ${OUT}`);
  console.log(`  ${kb(bytesIn)} of source -> ${kb(bytesOut)} served`);
  console.log("");
  console.log("For src/lib/products.ts:");
  for (const b of built) {
    console.log(`  ${b.slug.padEnd(16)} width: ${b.w}, height: ${b.h}   (${b.kb} KB)`);
  }
}

await main();
