import type { Metadata } from "next";
import { redirect } from "next/navigation";

import LoginForm from "@/components/admin/LoginForm";
import { currentAdmin } from "@/lib/server/auth";

export const metadata: Metadata = {
  title: "Sign in — SKY Tech Dynamic",
  robots: { index: false, follow: false },
};

// Reading the session cookie means this can never be prerendered.
export const dynamic = "force-dynamic";

export default async function LoginPage() {
  if (await currentAdmin()) redirect("/admin");
  return <LoginForm />;
}
