import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { ResetForm } from "@/components/admin/RecoverForms";

export const metadata: Metadata = {
  title: "Reset password — SKY Tech Dynamic",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

/* The token is only carried through to the form; whether it is valid is
   decided when the new password is submitted, so this page cannot be used to
   test tokens against. */
export default async function ResetPage({ searchParams }: PageProps<"/admin/reset">) {
  const query = await searchParams;
  const raw = query.token;
  const token = (Array.isArray(raw) ? raw[0] : raw) ?? "";
  if (!token) redirect("/admin/forgot");

  return <ResetForm token={token} />;
}
