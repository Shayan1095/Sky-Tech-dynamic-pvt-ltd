import HeroSection from "@/components/home/HeroSection";
import TrustBar from "@/components/home/TrustBar";
import ValuePropsSection from "@/components/home/ValuePropsSection";
import ServicesSection from "@/components/home/ServicesSection";
import WhySkyTech from "@/components/home/WhySkyTech";
import ProcessSection from "@/components/home/ProcessSection";
import FinalCTA from "@/components/home/FinalCTA";
import { DEFAULT_DESCRIPTION, DEFAULT_KEYWORDS, DEFAULT_TITLE, pageMetadata } from "@/lib/site";

export const metadata = pageMetadata({
  title: DEFAULT_TITLE,
  description: DEFAULT_DESCRIPTION,
  keywords: DEFAULT_KEYWORDS,
  path: "/",
});

export default function Home() {
  return (
    <>
      <HeroSection />
      <TrustBar />
      <ValuePropsSection />
      <ServicesSection />
      <WhySkyTech />
      <ProcessSection />
      <FinalCTA />
    </>
  );
}
