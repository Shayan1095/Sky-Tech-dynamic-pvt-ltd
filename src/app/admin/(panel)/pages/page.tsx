import Link from "next/link";

import { Card, Page } from "@/components/admin/ui";
import { editedCounts } from "@/lib/server/page-text";
import { BUILT_SERVICE_SLUGS } from "@/lib/service-pages/built";
import { getServicePage } from "@/lib/service-pages";

export const dynamic = "force-dynamic";

export default async function PagesIndex() {
  const counts = await editedCounts();

  const pages = BUILT_SERVICE_SLUGS.map((slug) => {
    const page = getServicePage(slug);
    return page ? { slug, name: page.contactName, edited: counts[slug] ?? 0 } : null;
  }).filter((p) => p !== null);

  return (
    <Page
      eyebrow="Content"
      title="Page text"
      lead="Headlines, introductions and answers on each service page. Structure and feature lists stay in the code, where a change is reviewed before it ships."
    >
      <Card className="p-0">
        <ul className="flex flex-col">
          {pages.map((p) => (
            <li key={p.slug} className="border-b border-text/[0.06] last:border-b-0">
              <Link
                href={`/admin/pages/${p.slug}`}
                className="flex flex-wrap items-center gap-x-4 gap-y-1 px-5 py-4 transition-colors duration-200 hover:bg-text/[0.02]"
              >
                <span className="min-w-0 flex-1">
                  <span className="block font-display text-[1rem] font-semibold tracking-[-0.01em] text-text">
                    {p.name}
                  </span>
                  <span className="mt-0.5 block font-mono text-[10px] tracking-[0.06em] text-text/35">
                    /services/{p.slug}
                  </span>
                </span>
                {p.edited > 0 && (
                  <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-primary">
                    {p.edited} changed
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </Card>
    </Page>
  );
}
