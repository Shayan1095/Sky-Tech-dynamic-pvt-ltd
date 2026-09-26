import Script from "next/script";
import Preloader from "@/components/shared/Preloader";
import { SEEN_SCRIPT } from "@/lib/preloader";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import SmoothScrollProvider from "@/components/shared/SmoothScrollProvider";
import { Analytics } from "@/components/shared/Analytics";
import { SettingsProvider } from "@/components/shared/SettingsProvider";
import { PricesProvider } from "@/components/shared/PricesProvider";
import { getSettings } from "@/lib/server/settings";
import { getPriceMap } from "@/lib/server/prices";

/* The public site's chrome. Everything here used to sit in the root layout;
   it moved so that /admin can render without a navbar, a footer, a preloader
   or smooth scrolling — none of which belong in a working tool. */
export default async function SiteLayout({ children }: LayoutProps<"/">) {
  /* Read once when the page is built, not on every request, so editable
     details cost nothing in speed. Saving in the admin panel revalidates
     these pages, which rebuilds them within seconds. */
  const [settings, prices] = await Promise.all([getSettings(), getPriceMap()]);

  return (
    <SettingsProvider value={settings}>
      <PricesProvider value={prices}>
      {/* Before hydration: flags a repeat visit so the preloader is hidden
          from the first paint. */}
      <Script
        id="sky-seen"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: SEEN_SCRIPT }}
      />
      <Analytics />
      <Preloader />
      <SmoothScrollProvider>
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </SmoothScrollProvider>
      </PricesProvider>
    </SettingsProvider>
  );
}
