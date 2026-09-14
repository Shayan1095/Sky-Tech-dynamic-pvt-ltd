import type { Metadata } from "next";
import { Space_Grotesk, Manrope, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import Preloader from "@/components/shared/Preloader";
import { SEEN_SCRIPT } from "@/lib/preloader";
import { DEFAULT_DESCRIPTION, DEFAULT_KEYWORDS, DEFAULT_TITLE, SITE_NAME, SITE_URL } from "@/lib/site";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import SmoothScrollProvider from "@/components/shared/SmoothScrollProvider";
import "./globals.css";

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
      <body
        className="flex min-h-full flex-col bg-bg text-text"
        suppressHydrationWarning
      >
        {/* Before hydration: flags a repeat visit so the preloader is hidden
            from the first paint. */}
        <Script
          id="sky-seen"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: SEEN_SCRIPT }}
        />
        <Preloader />
        <SmoothScrollProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
