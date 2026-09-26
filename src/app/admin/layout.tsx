import type { Metadata } from "next";

/* The panel is never indexed and never previewed. robots.ts excludes it too;
   this is the belt to that braces. */
export const metadata: Metadata = {
  title: "Admin — SKY Tech Dynamic",
  robots: { index: false, follow: false, nocache: true },
};

/* Nothing is rendered around the panel here: each area below supplies its own
   frame, because the sign-in screen and the working panel look nothing alike.

   The theme used to be chosen by an inline script so it applied before the
   first paint. React 19 rightly objects to a <script> inside a component —
   it is not executed on a client render — so the choice now travels in a
   cookie instead. The server reads it and writes the attribute into the HTML
   it sends, which removes the flash and the script together. */
export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return children;
}
