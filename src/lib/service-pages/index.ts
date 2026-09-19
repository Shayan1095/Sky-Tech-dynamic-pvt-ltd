import type { BuiltServiceSlug } from "./built";
import type { ServicePage } from "./types";
import { WEB_DEVELOPMENT } from "./web-development";
import { CONTENT_WRITING } from "./content-writing";
import { DIGITAL_MARKETING } from "./digital-marketing";
import { GOOGLE_ADS } from "./google-ads";
import { GRAPHIC_DESIGN } from "./graphic-design";
import { HOSTING_DOMAIN } from "./hosting-domain";
import { MEDIA_EVENTS } from "./media-events";
import { META_ADS } from "./meta-ads";
import { SOCIAL_MEDIA_MANAGEMENT } from "./social-media-management";
import { UI_UX_DESIGN } from "./ui-ux-design";
import { VIDEO_PRODUCTION } from "./video-production";
import { WEBSITE_MAINTENANCE } from "./website-maintenance";
import { WORDPRESS_DEVELOPMENT } from "./wordpress-development";

/* Every slug listed in built.ts must have its page data here — the Record
   type makes a missing one a compile error rather than a 404 in production.
   Imported by server code only (the route and its metadata), so none of this
   copy is shipped as JavaScript beyond what each page actually renders. */
export const SERVICE_PAGES: Record<BuiltServiceSlug, ServicePage> = {
  "web-development": WEB_DEVELOPMENT,
  "wordpress-development": WORDPRESS_DEVELOPMENT,
  "ui-ux-design": UI_UX_DESIGN,
  "website-maintenance": WEBSITE_MAINTENANCE,
  "hosting-domain": HOSTING_DOMAIN,
  "digital-marketing": DIGITAL_MARKETING,
  "social-media-management": SOCIAL_MEDIA_MANAGEMENT,
  "google-ads": GOOGLE_ADS,
  "meta-ads": META_ADS,
  "content-writing": CONTENT_WRITING,
  "graphic-design": GRAPHIC_DESIGN,
  "video-production": VIDEO_PRODUCTION,
  "media-events": MEDIA_EVENTS,
};

export function getServicePage(slug: string): ServicePage | undefined {
  return (SERVICE_PAGES as Record<string, ServicePage>)[slug];
}
