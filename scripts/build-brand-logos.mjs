/* Turns the client logo artwork into the files the brand wall actually loads.

   Run: node scripts/build-brand-logos.mjs [source-folder]
   Default source: ../logos (the folder the artwork arrived in)

   The supplied artwork is 0.6-3.4 MB per logo, around 1250px square, which is
   right for print and hopeless for a row of tiles 32px tall. Each file is
   resized to fit the tile at three times its rendered size and written as
   WebP. Nothing else is done to it: no cropping, no trimming of the white
   border, no recolouring. A logo is its owner's, and it appears here at the
   proportions they drew it at.

   The whole set lands around 90 KB, which is less than one of the originals.

   Adding a brand: drop the artwork in the source folder, add an entry to
   src/lib/brands.ts, re-run this. Files already built are overwritten. */

import { mkdirSync, readdirSync, statSync } from "node:fs";
import { join, extname, basename } from "node:path";

import sharp from "sharp";

/* Three times the 32px the tile draws them at, so the marks stay crisp on a
   phone's display without carrying a print-sized file to do it. */
const HEIGHT = 96;

const SOURCE = process.argv[2] ?? join("..", "logos");
const OUT = join("public", "brands");

/* The seven files left out, and why — recorded here rather than in a message
   nobody can find later. Five have no readable name in the artwork and no
   name was supplied; two are too weak to put on a home page. Supply a better
   file or a name and delete the line. */
const SKIP = new Set([
  "aqs logo.png", // no name in the mark
  "logo .png", // no name in the mark
  "s logo.png", // no name in the mark; purple ground baked in
  "women rotary logo.png", // which Rotary club is not stated
  "x logo.png", // no name in the mark
  "blue sea logo.png", // grey ground baked in, reads as a grey box
  "ku building logo.jpg.jpeg", // heavily compressed, soft at any size
]);

export const slugFor = (file) =>
  basename(file, extname(file))
    .trim()
    .replace(/[^a-z0-9]+/gi, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();

async function main() {
  let files;
  try {
    files = readdirSync(SOURCE).filter((f) => /\.(png|jpe?g|webp)$/i.test(f));
  } catch {
    console.error(`Cannot read ${SOURCE}. Pass the artwork folder as an argument.`);
    process.exit(1);
  }

  mkdirSync(OUT, { recursive: true });

  let built = 0;
  let bytesIn = 0;
  let bytesOut = 0;
  const skipped = [];

  for (const file of files.sort()) {
    if (SKIP.has(file)) {
      skipped.push(file);
      continue;
    }
    const from = join(SOURCE, file);
    const to = join(OUT, `${slugFor(file)}.webp`);

    await sharp(from)
      .resize({ height: HEIGHT, withoutEnlargement: true })
      .webp({ quality: 88 })
      .toFile(to);

    bytesIn += statSync(from).size;
    bytesOut += statSync(to).size;
    built += 1;
  }

  const kb = (n) => `${(n / 1024).toFixed(0)} KB`;
  console.log(`Built ${built} logo(s) into ${OUT}`);
  console.log(`  ${kb(bytesIn)} of artwork -> ${kb(bytesOut)} served`);
  if (skipped.length > 0) {
    console.log(`  Skipped ${skipped.length}: ${skipped.join(", ")}`);
  }
}

await main();
