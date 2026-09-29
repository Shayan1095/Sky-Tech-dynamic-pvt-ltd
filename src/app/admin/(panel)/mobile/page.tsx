
import { Page } from "@/components/admin/ui";
import ServicePageList from "@/components/admin/ServicePageList";
import { hiddenCounts } from "@/lib/server/sections";
import { BUILT_SERVICE_SLUGS } from "@/lib/service-pages/built";
import { getServicePage } from "@/lib/service-pages";

export const dynamic = "force-dynamic";

export default async function MobileIndex() {
  const counts = await hiddenCounts();

  const pages = BUILT_SERVICE_SLUGS.map((slug) => {
    const page = getServicePage(slug);
    if (!page) return null;
    const hidden = counts[slug] ?? 0;
    return { slug, name: page.contactName, note: hidden > 0 ? `${hidden} hidden` : undefined };
  }).filter((p) => p !== null);

  return (
    <Page
      eyebrow="Content"
      title="Mobile layout"
      lead="Shorten a service page on phones by hiding sections. Desktop is never affected, and nothing is removed from the page."
    >
      <ServicePageList hrefBase="/admin/mobile" rows={pages} />
    </Page>
  );
}
