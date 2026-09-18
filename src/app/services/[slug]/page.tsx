import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { loadMarkdown } from "@/lib/markdown";
import { SITE_NAME, SITE_URL, pageMetadata } from "@/lib/site";
import { BUILT_SERVICE_SLUGS } from "@/lib/service-pages/built";
import { getServicePage } from "@/lib/service-pages";
import type { ServicePage } from "@/lib/service-pages/types";
import ServiceHero from "@/components/service/ServiceHero";
import ServiceProblem from "@/components/service/ServiceProblem";
import ServiceOfferings from "@/components/service/ServiceOfferings";
import ServicePackages from "@/components/service/ServicePackages";
import ServiceCapabilities from "@/components/service/ServiceCapabilities";
import ServiceExtras from "@/components/service/ServiceExtras";
import ServiceTechnology from "@/components/service/ServiceTechnology";
import ServiceWhy from "@/components/service/ServiceWhy";
import ServiceProcess from "@/components/service/ServiceProcess";
import ServiceInvestment from "@/components/service/ServiceInvestment";
import ServiceFAQ from "@/components/service/ServiceFAQ";
import ServiceRelated from "@/components/service/ServiceRelated";
import ServiceClosing from "@/components/service/ServiceClosing";
import MobileQuoteBar from "@/components/service/MobileQuoteBar";
import SectionNav from "@/components/service/SectionNav";

/* One template, every service page. Only services listed in
   src/lib/service-pages/built.ts are generated; any other slug is a 404
   rather than a half-built page. */
export const dynamicParams = false;

export function generateStaticParams() {
  return BUILT_SERVICE_SLUGS.map((slug) => ({ slug }));
}

/* Title, description and keywords come from the service's own content file,
   so the page's SEO stays in the hands of whoever edits the content. */
export async function generateMetadata(props: PageProps<"/services/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const { meta_title, meta_description, keywords } = loadMarkdown(`services/${slug}.md`);
  return pageMetadata({ title: meta_title, description: meta_description, keywords, path: `/services/${slug}` });
}

/* Structured data: the service and its starting price, its FAQ, and where it
   sits in the site. These are what let search engines show the page as a
   service with answers, not just a blue link. Every value comes from the
   same page data the visitor sees. */
function structuredData(page: ServicePage, description: string) {
  const url = `${SITE_URL}/services/${page.slug}`;
  const prices = page.packages.tiers
    .map((t) => Number(t.price.replace(/[^0-9.]/g, "")))
    .filter((n) => Number.isFinite(n) && n > 0);

  return [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: page.hero.label,
      serviceType: page.contactName,
      description,
      url,
      provider: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
      areaServed: ["Pakistan", "United States", "United Kingdom"],
      ...(prices.length && {
        offers: {
          "@type": "AggregateOffer",
          priceCurrency: "USD",
          lowPrice: Math.min(...prices),
          offerCount: page.packages.tiers.length,
        },
      }),
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: page.faq.items.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer },
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Services", item: `${SITE_URL}/services` },
        { "@type": "ListItem", position: 3, name: page.contactName, item: url },
      ],
    },
  ];
}

export default async function ServiceDetailPage(props: PageProps<"/services/[slug]">) {
  const { slug } = await props.params;
  const page = getServicePage(slug);
  if (!page) notFound();

  const { meta_description } = loadMarkdown(`services/${slug}.md`);
  /* "<" is escaped so no string in the data can close the script element. */
  const jsonLd = JSON.stringify(structuredData(page, meta_description)).replace(/</g, "\\u003c");

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
      <ServiceHero page={page} />
      <ServiceProblem page={page} />
      <ServiceOfferings page={page} />
      <ServicePackages page={page} />
      <ServiceCapabilities page={page} />
      <ServiceExtras page={page} />
      <ServiceTechnology page={page} />
      <ServiceWhy page={page} />
      <ServiceProcess page={page} />
      <ServiceInvestment page={page} />
      <ServiceFAQ page={page} />
      <ServiceRelated page={page} />
      <ServiceClosing page={page} />
      <SectionNav page={page} />
      <MobileQuoteBar page={page} />
    </>
  );
}
