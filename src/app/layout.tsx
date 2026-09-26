import type { Metadata } from "next";
import { Space_Grotesk, Manrope, JetBrains_Mono } from "next/font/google";
import { DEFAULT_DESCRIPTION, DEFAULT_KEYWORDS, DEFAULT_TITLE, SITE_NAME, SITE_URL } from "@/lib/site";
import "./globals.css";

/* The root layout holds only what every route needs: the document, the fonts
   and the site-wide metadata defaults. The public site's chrome — preloader,
   navigation, smooth scrolling, footer — lives in (site)/layout.tsx, because
   the admin panel shares the fonts and nothing else. Route groups do not
   appear in URLs, so every public address is unchanged. */

const spaceGrotesk = Space_Grotesk({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const manrope = Manrope({
  variable: "--font-body",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-numeric",
  subsets: ["latin"],
  weight: ["400", "500"],
});

// Site-wide defaults; each page sets its own title, description and
// canonical URL through pageMetadata().
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: DEFAULT_TITLE,
  description: DEFAULT_DESCRIPTION,
  keywords: DEFAULT_KEYWORDS,
  applicationName: SITE_NAME,
  openGraph: { type: "website", siteName: SITE_NAME, locale: "en_US" },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // suppressHydrationWarning covers only these two elements' own attributes:
    // browser extensions (Grammarly, ColorZilla, Dark Reader, translators…)
    // inject attributes here before React hydrates. Mismatches anywhere
    // inside the page are still reported.
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${manrope.variable} ${jetbrainsMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col bg-bg text-text" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
