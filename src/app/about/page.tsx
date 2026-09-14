import type { Metadata } from "next";
import { loadMarkdown } from "@/lib/markdown";
import { pageMetadata } from "@/lib/site";
import AboutHero from "@/components/about/AboutHero";
import AboutStory from "@/components/about/AboutStory";
import AboutMissionApproach from "@/components/about/AboutMissionApproach";
import AboutWhereWeWork from "@/components/about/AboutWhereWeWork";
import WhyClientsChooseUs from "@/components/about/WhyClientsChooseUs";
import AboutCTA from "@/components/about/AboutCTA";

export function generateMetadata(): Metadata {
  const { meta_title, meta_description, keywords } = loadMarkdown("about.md");
  return pageMetadata({ title: meta_title, description: meta_description, keywords, path: "/about" });
}

export default function AboutPage() {
  return (
    <>
      <AboutHero />

      <AboutStory />

      <AboutMissionApproach />

      <WhyClientsChooseUs />

      <AboutWhereWeWork />

      <AboutCTA />
    </>
  );
}
