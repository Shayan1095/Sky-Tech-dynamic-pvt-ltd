import type { Metadata } from "next";
import { loadMarkdown } from "@/lib/markdown";
import { pageMetadata } from "@/lib/site";
import ServicesHero from "@/components/services/ServicesHero";
import ServicesGridStacked from "@/components/services/ServicesGridStacked";
import MidGridCTA from "@/components/services/MidGridCTA";
import HowWeWork from "@/components/services/HowWeWork";
import ServicesFinalCTA from "@/components/services/ServicesFinalCTA";

export function generateMetadata(): Metadata {
  const { meta_title, meta_description, keywords } = loadMarkdown(
    "services/index.md"
  );
  return pageMetadata({ title: meta_title, description: meta_description, keywords, path: "/services" });
}

export default function ServicesPage() {
  return (
    <>
      <ServicesHero />
      <ServicesGridStacked />
      <MidGridCTA />
      <HowWeWork />
      <ServicesFinalCTA />
    </>
  );
}
