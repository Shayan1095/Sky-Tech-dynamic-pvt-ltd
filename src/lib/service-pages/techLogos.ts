/* Logos for the technology rows, keyed by the name the content uses.

   Files in public/tech/ come unmodified from Simple Icons 16.31.0
   (https://cdn.jsdelivr.net/npm/simple-icons@16.31.0/icons/, CC0-1.0),
   downloaded 2026-09-18 (Figma 2026-09-19). The marks remain trademarks of their owners and are
   shown only to say which technologies SKY Tech works with. `hex` is each
   brand's official colour from the same release, used on hover.

   A name with no entry here (Java — removed from Simple Icons at Oracle's
   request) is shown as a name-only tile, never a redrawn logo. */

/* `scale` enlarges a wordmark-style logo, whose artwork sits as a thin band
   inside the square icon box and would otherwise read far smaller than the
   symbol-style logos around it. The artwork itself is not altered. */
/* `backing` fills the logo's cut-out shapes. The JavaScript mark is a yellow
   square with the letters cut out of it; the official logo has those letters
   in black, so a black square sits behind the yellow one. */
export type TechLogo = { file: string; hex: string; scale?: number; backing?: string };

export const TECH_LOGOS: Record<string, TechLogo> = {
  HTML5: { file: "html5", hex: "#E34F26" },
  CSS3: { file: "css", hex: "#663399" },
  JavaScript: { file: "javascript", hex: "#F7DF1E", backing: "#000000" },
  "React.js": { file: "react", hex: "#61DAFB" },
  "Vue.js": { file: "vuedotjs", hex: "#4FC08D" },
  Bootstrap: { file: "bootstrap", hex: "#7952B3" },
  "Tailwind CSS": { file: "tailwindcss", hex: "#06B6D4" },
  PHP: { file: "php", hex: "#777BB4" },
  Laravel: { file: "laravel", hex: "#FF2D20" },
  CodeIgniter: { file: "codeigniter", hex: "#EF4223" },
  "Node.js": { file: "nodedotjs", hex: "#5FA04E" },
  Django: { file: "django", hex: "#092E20" },
  Python: { file: "python", hex: "#3776AB" },
  WordPress: { file: "wordpress", hex: "#21759B" },
  WooCommerce: { file: "woocommerce", hex: "#96588A", scale: 2.2 },
  Shopify: { file: "shopify", hex: "#7AB55C" },
  MySQL: { file: "mysql", hex: "#4479A1", scale: 1.5 },
  MongoDB: { file: "mongodb", hex: "#47A248" },
  /* Added 2026-09-19, same release. Adobe Photoshop, Adobe Illustrator and
     FigJam have no Simple Icons entry (the Adobe marks were removed at
     Adobe's request), so they show by name. */
  Figma: { file: "figma", hex: "#F24E1E" },
};
