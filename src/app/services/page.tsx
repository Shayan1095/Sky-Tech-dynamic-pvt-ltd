import type { Metadata } from "next";
import { loadMarkdown } from "@/lib/markdown";
import { pageMetadata } from "@/lib/site";
import { PILLARS } from "@/lib/pillars";
import ServicesHero from "@/components/services/ServicesHero";
import WhatWeDo from "@/components/services/WhatWeDo";
import ServicePillar from "@/components/services/ServicePillar";
import OurApproach from "@/components/services/OurApproach";
import WhyChooseSky from "@/components/services/WhyChooseSky";
import WhoWeWorkWith from "@/components/services/WhoWeWorkWith";
import ServiceCombinations from "@/components/services/ServiceCombinations";
import ServicesFAQ from "@/components/services/ServicesFAQ";
import ServicesClosing from "@/components/services/ServicesClosing";

export function generateMetadata(): Metadata {
  const { meta_title, meta_description, keywords } = loadMarkdown(
    "services/main.md"
  );
  return pageMetadata({ title: meta_title, description: meta_description, keywords, path: "/services" });
}

export default function ServicesPage() {
  return (
    <>
      <ServicesHero />
      <WhatWeDo />
      <ServicePillar pillar={PILLARS[0]} />
      <ServicePillar pillar={PILLARS[1]} tone="bg" />
      <ServicePillar pillar={PILLARS[2]} />
      <OurApproach />
      <WhyChooseSky />
      <WhoWeWorkWith />
      <ServiceCombinations />
      <ServicesFAQ />
      <ServicesClosing />
    </>
  );
}
