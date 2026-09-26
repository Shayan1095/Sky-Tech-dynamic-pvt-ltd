import Link from "next/link";
import { notFound } from "next/navigation";

import { EnquiryDetail, loadEnquiry } from "@/components/admin/EnquiryDetail";
import { Page } from "@/components/admin/ui";

export const dynamic = "force-dynamic";

/* The full page. Reached by opening an enquiry in a new tab, by reloading the
   drawer's address, or by following a link from an email — all the ways
   somebody arrives at one enquiry without the list behind it. */
export default async function EnquiryPage({ params }: PageProps<"/admin/enquiries/[id]">) {
  const { id } = await params;
  const loaded = await loadEnquiry(id);
  if (!loaded) notFound();

  const { enquiry, clientId } = loaded;

  return (
    <Page
      eyebrow={enquiry.reference}
      title={enquiry.name}
      lead={`${enquiry.company} · ${enquiry.country}`}
      actions={
        <Link
          href="/admin/enquiries"
          className="font-mono text-[10px] uppercase tracking-[0.16em] text-text/45 transition-colors duration-200 hover:text-primary"
        >
          &larr; All enquiries
        </Link>
      }
    >
      <EnquiryDetail enquiry={enquiry} clientId={clientId} />
    </Page>
  );
}
