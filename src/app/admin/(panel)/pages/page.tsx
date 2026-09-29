
import { Page } from "@/components/admin/ui";
import ServicePageList from "@/components/admin/ServicePageList";
import { editedCounts } from "@/lib/server/page-text";
import { BUILT_SERVICE_SLUGS } from "@/lib/service-pages/built";
import { getServicePage } from "@/lib/service-pages";

export const dynamic = "force-dynamic";

export default async function PagesIndex() {
  const counts = await editedCounts();

  const pages = BUILT_SERVICE_SLUGS.map((slug) => {
    const page = getServicePage(slug);
    if (!page) return null;
    const edited = counts[slug] ?? 0;
    return { slug, name: page.contactName, note: edited > 0 ? `${edited} changed` : undefined };
  }).filter((p) => p !== null);

  return (
    <Page
      eyebrow="Content"
      title="Page text"
      lead="Headlines, introductions and answers on each service page. Structure and feature lists stay in the code, where a change is reviewed before it ships."
    >
      <ServicePageList hrefBase="/admin/pages" rows={pages} />
    </Page>
  );
}
