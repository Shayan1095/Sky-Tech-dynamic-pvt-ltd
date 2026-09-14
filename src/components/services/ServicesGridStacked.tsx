import ServiceCardStacked, { type ServiceCardData } from "./ServiceCardStacked";
import { contactHref } from "@/lib/site";

const SERVICES: ServiceCardData[] = [
  {
    title: "Web Development",
    description:
      "Custom, responsive websites and web applications built on modern frameworks.",
    href: contactHref("Web Development"),
  },
  {
    title: "WordPress Development",
    description:
      "Secure, scalable WordPress and WooCommerce websites with custom themes.",
    href: contactHref("WordPress Development"),
  },
  {
    title: "UI/UX Design",
    description:
      "User-focused UI/UX design that creates intuitive, conversion-oriented experiences.",
    href: contactHref("UI/UX Design"),
  },
  {
    title: "Graphic Design",
    description:
      "Creative graphic design for branding, marketing, and business communication.",
    href: contactHref("Graphic Design"),
  },
  {
    title: "Digital Marketing",
    description:
      "Data-driven SEO, Google Ads, and social advertising campaigns.",
    href: contactHref("Digital Marketing"),
  },
  {
    title: "Social Media Management",
    description:
      "Strategy, content creation, and community management that builds engagement.",
    href: contactHref("Social Media Management"),
  },
  {
    title: "Google Ads",
    description:
      "Targeted Google Ads campaigns designed to increase qualified traffic and conversions.",
    href: contactHref("Google Ads"),
  },
  {
    title: "Meta Ads",
    description:
      "Performance-focused Facebook and Instagram advertising campaigns.",
    href: contactHref("Meta Ads"),
  },
  {
    title: "Content Writing",
    description: "Strategic, engaging content created to inform, rank, and convert.",
    href: contactHref("Content Writing"),
  },
  {
    title: "Video Production",
    description:
      "Professional video production, reels, and social-first visual content.",
    href: contactHref("Video Production"),
  },
  {
    title: "Media & Events",
    description:
      "Event planning, photography, videography, and live coverage for brand events.",
    href: contactHref("Media & Events"),
  },
  {
    title: "Hosting & Domain",
    description:
      "Reliable domain registration and hosting with SSL, DNS, and support.",
    href: contactHref("Hosting & Domain"),
  },
  {
    title: "Website Maintenance",
    description:
      "Ongoing updates, backups, security, and performance monitoring.",
    href: contactHref("Website Maintenance"),
  },
  {
    title: "Business Automation",
    description:
      "Custom workflows and system integrations that save your team hours.",
    href: contactHref("Business Automation"),
  },
];

export default function ServicesGridStacked() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {SERVICES.map((service, index) => (
          <ServiceCardStacked key={service.title} index={index} {...service} />
        ))}
      </div>
    </section>
  );
}
