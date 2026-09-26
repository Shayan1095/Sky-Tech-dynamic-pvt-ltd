import { cookies } from "next/headers";
import { notFound } from "next/navigation";

import { Drawer } from "@/components/admin/Drawer";
import { EnquiryDetail, loadEnquiry } from "@/components/admin/EnquiryDetail";

export const dynamic = "force-dynamic";

/* Intercepts /admin/enquiries/[id] when it is reached from inside the panel,
   and shows it over the list instead of replacing it. A reload of the same
   address falls through to the real page. */
export default async function EnquiryDrawer({ params }: PageProps<"/admin/enquiries/[id]">) {
  const { id } = await params;
  const theme = (await cookies()).get("sky-admin-theme")?.value === "dark" ? "dark" : "light";
  const loaded = await loadEnquiry(id);
  if (!loaded) notFound();

  const { enquiry, clientId } = loaded;

  return (
    <Drawer
      theme={theme}
      path={`/admin/enquiries/${enquiry.id}`}
      title={enquiry.name}
      subtitle={`${enquiry.reference} · ${enquiry.company}`}
    >
      <EnquiryDetail enquiry={enquiry} clientId={clientId} compact />
    </Drawer>
  );
}
