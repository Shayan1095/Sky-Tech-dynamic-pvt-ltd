import Link from "next/link";
import { notFound } from "next/navigation";

import SectionsForm from "@/components/admin/SectionsForm";
import { Page } from "@/components/admin/ui";
import { getHiddenSections, SECTIONS } from "@/lib/server/sections";
import { getServicePage } from "@/lib/service-pages";

export const dynamic = "force-dynamic";

export default async function MobileSections({ params }: PageProps<"/admin/mobile/[slug]">) {
  const { slug } = await params;
  const page = getServicePage(slug);
  if (!page) notFound();

  const hidden = await getHiddenSections(slug);

  const sections = SECTIONS.map((section) => ({
    key: section.key,
    label: section.label,
    note: section.note,
    hidden: hidden.has(section.key),
  }));

  return (
    <Page
      eyebrow="Mobile layout"
      title={page.contactName}
      lead="Turn a section off to hide it on phones only."
      actions={
        <div className="flex flex-wrap items-center gap-4">
          <Link
            href={`/services/${slug}`}
            target="_blank"
            rel="noreferrer noopener"
            className="font-mono text-[10px] uppercase tracking-[0.16em] text-text/45 transition-colors duration-200 hover:text-primary"
          >
            View page
          </Link>
          <Link
            href="/admin/mobile"
            className="font-mono text-[10px] uppercase tracking-[0.16em] text-text/45 transition-colors duration-200 hover:text-primary"
          >
            &larr; All pages
          </Link>
        </div>
      }
    >
      <SectionsForm slug={slug} sections={sections} />
    </Page>
  );
}
