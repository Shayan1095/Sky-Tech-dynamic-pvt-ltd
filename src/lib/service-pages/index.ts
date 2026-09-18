import type { BuiltServiceSlug } from "./built";
import type { ServicePage } from "./types";
import { WEB_DEVELOPMENT } from "./web-development";

/* Every slug listed in built.ts must have its page data here — the Record
   type makes a missing one a compile error rather than a 404 in production.
   Imported by server code only (the route and its metadata), so none of this
   copy is shipped as JavaScript beyond what each page actually renders. */
export const SERVICE_PAGES: Record<BuiltServiceSlug, ServicePage> = {
  "web-development": WEB_DEVELOPMENT,
};

export function getServicePage(slug: string): ServicePage | undefined {
  return (SERVICE_PAGES as Record<string, ServicePage>)[slug];
}
