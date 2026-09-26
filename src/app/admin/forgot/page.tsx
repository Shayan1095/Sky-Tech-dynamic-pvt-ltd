import type { Metadata } from "next";

import { ForgotForm } from "@/components/admin/RecoverForms";

export const metadata: Metadata = {
  title: "Forgotten password — SKY Tech Dynamic",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default function ForgotPage() {
  return <ForgotForm />;
}
