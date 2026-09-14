import type { Metadata } from "next";

/* Site-wide identity and SEO helpers. The live address comes from
   NEXT_PUBLIC_SITE_URL (set it in the hosting dashboard once the domain is
   confirmed); until then it falls back to the website listed in
   src/content/contact.md. */

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://skytech.com.pk").replace(/\/+$/, "");
export const SITE_NAME = "SKY Tech Dynamic";

export const DEFAULT_TITLE = "SKY Tech | Web Development, Digital Marketing & AI Solutions";
export const DEFAULT_DESCRIPTION =
  "SKY Tech builds websites, software, and digital growth strategies for businesses in the USA, UK & beyond. Book a free consultation today.";
export const DEFAULT_KEYWORDS =
  "digital product agency, web development company, digital marketing agency, custom software development, WordPress development company";

/* Public routes, used by the sitemap. */
export const ROUTES = ["/", "/services", "/about", "/contact"] as const;

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
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

/* Until each service has its own page, service links open the Contact form
   with that service preselected. */
export function contactHref(service: string) {
  return `/contact?service=${encodeURIComponent(service)}#contact-form`;
}
