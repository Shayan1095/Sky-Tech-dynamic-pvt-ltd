import type { Metadata } from "next";
import { loadMarkdown } from "@/lib/markdown";
import { pageMetadata } from "@/lib/site";
import ContactHero from "@/components/contact/ContactHero";
import ContactForm from "@/components/contact/ContactForm";
import ContactInfo from "@/components/contact/ContactInfo";

export function generateMetadata(): Metadata {
  const { meta_title, meta_description, keywords } = loadMarkdown(
    "contact.md"
  );
  return pageMetadata({ title: meta_title, description: meta_description, keywords, path: "/contact" });
}

export default function ContactPage() {
  return (
    <>
      <ContactHero />
      <ContactForm />
      <ContactInfo />
    </>
  );
}
