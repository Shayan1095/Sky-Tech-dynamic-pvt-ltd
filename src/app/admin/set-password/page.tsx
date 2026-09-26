import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { SetPasswordForm } from "@/components/admin/SetPasswordForm";
import { currentAdmin } from "@/lib/server/auth";

export const metadata: Metadata = {
  title: "Choose your password — SKY Tech Dynamic",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

/* Lives outside the panel group so the panel can redirect here without
   redirecting into itself. Anyone who does not need to be here is sent where
   they were going. */
export default async function SetPasswordPage() {
  const admin = await currentAdmin();
  if (!admin) redirect("/admin/login");
  if (!admin.mustChangePassword) redirect("/admin");

  return <SetPasswordForm name={admin.name} />;
}
