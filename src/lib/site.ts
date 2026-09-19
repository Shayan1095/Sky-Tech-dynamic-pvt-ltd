import type { Metadata } from "next";
import { BUILT_SERVICE_SLUGS, servicePagePath } from "@/lib/service-pages/built";

/* Site-wide identity and SEO helpers. The live address, in order:

   1. NEXT_PUBLIC_SITE_URL, when set in the hosting dashboard. Set it on any
      host other than Vercel (Hostinger included) once the domain is live.
   2. On Vercel, the project's production address, which Vercel passes to
      every build — the vercel.app address today, the custom domain as soon
      as one is attached. This is what makes link previews work before the
      domain exists: the share image is fetched from an address that is
      actually serving the site.
   3. The website listed in src/content/contact.md.

   Server-only: used for metadata, the sitemap, robots and structured data,
   never in anything rendered on the client. */

const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || (vercel ? `https://${vercel}` : "https://skytech.com.pk")
).replace(/\/+$/, "");
export const SITE_NAME = "SKY Tech Dynamic";

export const DEFAULT_TITLE = "SKY Tech | Web Development, Digital Marketing & AI Solutions";
export const DEFAULT_DESCRIPTION =
  "SKY Tech builds websites, software, and digital growth strategies for businesses in the USA, UK & beyond. Book a free consultation today.";
export const DEFAULT_KEYWORDS =
  "digital product agency, web development company, digital marketing agency, custom software development, WordPress development company";

/* Public routes, used by the sitemap. Service pages join as they are built. */
export const ROUTES: readonly string[] = [
  "/",
  "/services",
  ...BUILT_SERVICE_SLUGS.map((slug) => `/services/${slug}`),
  "/about",
  "/contact",
];

/* Per-page metadata: title, description, a canonical URL, and the matching
   Open Graph / Twitter card fields. The preview image itself comes from
   app/opengraph-image.tsx. */
export function pageMetadata({
  title,
  description,
  keywords,
  path,
}: {
  title: string;
  description: string;
  keywords?: string;
  path: string;
}): Metadata {
  return {
    title,
    description,
    keywords,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      locale: "en_US",
      url: path,
      title,
      description,
      images: [SHARE_IMAGE],
    },
    twitter: { card: "summary_large_image", title, description, images: [SHARE_IMAGE] },
  };
}

/* The link-preview card (src/app/opengraph-image.tsx). Next only attaches it
   automatically to pages that leave openGraph alone; a page that sets its own
   openGraph replaces the whole object, image included — so every page built
   with pageMetadata names it explicitly. */
export const SHARE_IMAGE = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: "SKY Tech Dynamic — Web Development, Digital Marketing & AI Solutions",
};

/* Opens the Contact form with a service preselected. */
export function contactHref(service: string) {
  return `/contact?service=${encodeURIComponent(service)}#contact-form`;
}

/* Where a link about a service should go: its own page once that exists,
   the pre-filled Contact form until then. */
export function serviceLink(service: string) {
  return servicePagePath(service) ?? contactHref(service);
}
