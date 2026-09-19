/* Which services have their own page, by the name the rest of the site uses
   for them. Kept apart from the page data on purpose: client components
   (the Services hero, the footer) ask "does this service have a page yet?",
   and importing the page registry to answer that would ship every page's
   copy to every visitor. Add a service here when its page goes live and
   every link to it — Services, Home, footer, sitemap — switches over. */
export const BUILT_SERVICE_PAGES = {
  "Web Development": "web-development",
  "WordPress Development": "wordpress-development",
  "UI/UX Design": "ui-ux-design",
  "Website Maintenance": "website-maintenance",
  "Hosting & Domain": "hosting-domain",
  "Digital Marketing": "digital-marketing",
  "Social Media Management": "social-media-management",
  "Google Ads": "google-ads",
  "Meta Ads": "meta-ads",
  "Content Writing": "content-writing",
  "Graphic Design": "graphic-design",
  "Video Editing & Production": "video-production",
  "Media & Events": "media-events",
} as const;

export type BuiltServiceSlug = (typeof BUILT_SERVICE_PAGES)[keyof typeof BUILT_SERVICE_PAGES];

export const BUILT_SERVICE_SLUGS = Object.values(BUILT_SERVICE_PAGES) as BuiltServiceSlug[];

export function servicePagePath(name: string): string | null {
  const slug = (BUILT_SERVICE_PAGES as Record<string, string>)[name];
  return slug ? `/services/${slug}` : null;
}
