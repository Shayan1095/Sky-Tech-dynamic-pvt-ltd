import Link from "next/link";
import { notFound } from "next/navigation";

import PageTextForm from "@/components/admin/PageTextForm";
import { Page } from "@/components/admin/ui";
import { editableFields, getPageText } from "@/lib/server/page-text";
import { getServicePage } from "@/lib/service-pages";

export const dynamic = "force-dynamic";

export default async function EditPageText({ params }: PageProps<"/admin/pages/[slug]">) {
  const { slug } = await params;
  const page = getServicePage(slug);
  if (!page) notFound();

  const saved = await getPageText(slug);
  const fields = editableFields(page, saved);
  const changed = fields.filter((f) => f.value !== f.original).length;

  return (
    <Page
      eyebrow="Page text"
      title={page.contactName}
      lead={changed > 0 ? `${changed} line${changed === 1 ? "" : "s"} changed from the original.` : undefined}
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
            href="/admin/pages"
            className="font-mono text-[10px] uppercase tracking-[0.16em] text-text/45 transition-colors duration-200 hover:text-primary"
          >
            &larr; All pages
          </Link>
        </div>
      }
    >
      <PageTextForm slug={slug} fields={fields} />
    </Page>
  );
}
