import { servicePagePath } from "@/lib/service-pages/built";

/* The three service pillars and their thirteen services, worded exactly as
   in src/content/services/main.md. Shared by the hero's index card, the What
   We Do section and the pillar sections, so none of them can fall out of
   step with the others. */

export type Service = {
  name: string;
  /* The one-line description under the service name. */
  summary: string;
  /* The "What We Offer" list, in the order the content gives it. */
  offers: readonly string[];
  /* Where the service's own page will live once it is built. */
  slug: string;
};

export type Pillar = {
  index: string;
  name: string;
  anchor: string;
  /* Pillars 02 and 03 open with a headline and two paragraphs; pillar 01
     goes straight to its services, exactly as the content does. */
  introHeading?: string;
  introParagraphs?: readonly string[];
  services: readonly Service[];
  /* The service list condensed to one line, for the hero's index card. */
  short: string;
};

export const PILLARS: readonly Pillar[] = [
  {
    index: "01",
    name: "Technology & Digital Solutions",
    anchor: "#technology--digital-solutions",
    short: "Web · WordPress · UI/UX · Maintenance · Hosting",
    services: [
      {
        name: "Web Development",
        slug: "web-development",
        summary:
          "Custom websites and web applications built for performance, scalability and business growth.",
        offers: [
          "Business websites",
          "Custom web applications",
          "E-commerce websites",
          "Web portals",
          "Admin dashboards",
          "API integrations",
          "Full-stack development",
        ],
      },
      {
        name: "WordPress Development",
        slug: "wordpress-development",
        summary:
          "Professional WordPress websites designed to help businesses establish a reliable, flexible and easy-to-manage online presence.",
        offers: [
          "WordPress business websites",
          "Custom theme development",
          "Theme customization",
          "WooCommerce stores",
          "Plugin integration",
          "Membership websites",
          "Website migration",
          "WordPress optimization",
        ],
      },
      {
        name: "UI/UX Design",
        slug: "ui-ux-design",
        summary:
          "User-focused digital experiences that combine intuitive navigation, thoughtful design and business objectives.",
        offers: [
          "User research",
          "User flows",
          "Wireframes",
          "Website UI design",
          "Mobile app UI design",
          "Prototypes",
          "Design systems",
          "Usability-focused design",
        ],
      },
      {
        name: "Website Maintenance",
        slug: "website-maintenance",
        summary:
          "Ongoing technical support to keep your website secure, updated, functional and performing reliably.",
        offers: [
          "Website updates",
          "Plugin and theme updates",
          "Security checks",
          "Backups",
          "Performance monitoring",
          "Bug fixes",
          "Content updates",
          "Technical support",
        ],
      },
      {
        name: "Hosting & Domain",
        slug: "hosting-domain",
        summary:
          "Reliable hosting and domain solutions to help your website stay accessible, secure and properly configured.",
        offers: [
          "Domain registration",
          "Web hosting",
          "SSL setup",
          "DNS configuration",
          "Business email setup",
          "Website migration",
          "Backup configuration",
          "Hosting support",
        ],
      },
    ],
  },
  {
    index: "02",
    name: "Digital Marketing & Growth",
    anchor: "#digital-marketing--growth",
    short: "Marketing · Social · Google Ads · Meta Ads · Content",
    introHeading: "Turn Your Digital Presence Into Business Growth.",
    introParagraphs: [
      "A strong digital presence needs more than visibility. It needs the right strategy, consistent execution and measurable results.",
      "Our digital marketing services help businesses reach the right audience, generate leads, improve conversions and build long-term brand visibility.",
    ],
    services: [
      {
        name: "Digital Marketing",
        slug: "digital-marketing",
        summary:
          "Data-driven digital marketing campaigns designed to increase reach, leads, sales and brand visibility.",
        offers: [
          "Digital marketing strategy",
          "Performance marketing",
          "Lead generation",
          "Campaign planning",
          "Conversion tracking",
          "Retargeting",
          "Landing-page recommendations",
          "Marketing reporting",
        ],
      },
      {
        name: "Social Media Management",
        slug: "social-media-management",
        summary:
          "Strategic social media management designed to build brand presence, engagement and consistent digital growth.",
        offers: [
          "Social media strategy",
          "Content planning",
          "Content calendars",
          "Post design",
          "Captions and copy",
          "Reels and short-form content",
          "Community management",
          "Performance reporting",
        ],
      },
      {
        name: "Google Ads",
        slug: "google-ads",
        summary:
          "Targeted Google Ads campaigns designed to increase qualified traffic, leads, conversions and business growth.",
        offers: [
          "Google Ads setup",
          "Keyword research",
          "Search campaigns",
          "Display campaigns",
          "Remarketing",
          "Conversion tracking",
          "Campaign optimization",
          "Performance reporting",
        ],
      },
      {
        name: "Meta Ads",
        slug: "meta-ads",
        summary:
          "Performance-focused Facebook and Instagram advertising campaigns designed to generate leads, sales, engagement and brand growth.",
        offers: [
          "Meta Ads setup",
          "Audience research",
          "Lead generation campaigns",
          "Sales campaigns",
          "Retargeting",
          "Creative testing",
          "Conversion tracking",
          "Campaign optimization",
        ],
      },
      {
        name: "Content Writing",
        slug: "content-writing",
        summary:
          "Strategic and engaging content created to communicate, inform, rank and convert across digital platforms.",
        offers: [
          "Website content",
          "Service pages",
          "SEO content",
          "Blog writing",
          "Landing-page copy",
          "Social media captions",
          "Marketing copy",
          "Business and technical writing",
        ],
      },
    ],
  },
  {
    index: "03",
    name: "Creative & Media Services",
    anchor: "#creative--media-services",
    short: "Graphic Design · Video Editing & Production · Media & Events",
    introHeading: "Creative Work That Makes Your Brand Stand Out.",
    introParagraphs: [
      "Your brand needs more than good ideas. It needs clear communication, consistent visuals and content that connects with people.",
      "Our creative services help businesses communicate professionally across digital and physical platforms.",
    ],
    services: [
      {
        name: "Graphic Design",
        slug: "graphic-design",
        summary:
          "Creative graphic design solutions for branding, marketing, social media and business communication.",
        offers: [
          "Social media creatives",
          "Marketing banners",
          "Brand identity",
          "Brochures",
          "Presentations",
          "Marketing collateral",
          "Campaign designs",
          "Business stationery",
        ],
      },
      {
        name: "Video Editing & Production",
        slug: "video-production",
        summary:
          "Professional video editing for social media, marketing, corporate and digital content.",
        offers: [
          "Reels editing",
          "Short-form videos",
          "YouTube videos",
          "Corporate videos",
          "Motion graphics",
          "Subtitles",
          "Sound enhancement",
          "Branded video content",
        ],
      },
      {
        name: "Media & Events",
        slug: "media-events",
        summary:
          "Professional event planning, photography, videography, live coverage and content production for corporate and brand events.",
        offers: [
          "Event planning support",
          "Event coordination",
          "Event photography",
          "Event videography",
          "Corporate event coverage",
          "Product launch coverage",
          "Live streaming",
          "Event highlights",
          "Social media event coverage",
          "Post-event content",
        ],
      },
    ],
  },
] as const;

/* Counted rather than written down, so it cannot disagree with the list. */
export const TOTAL_SERVICES = PILLARS.reduce((n, p) => n + p.services.length, 0);

/* The pillar sections are being built one at a time. Until a pillar's anchor
   exists on the page, links to it resolve to the What We Do index rather
   than to nothing at all. */
const LIVE_PILLARS = new Set(["01", "02", "03"]);

export const pillarHref = (anchor: string) => {
  const pillar = PILLARS.find((p) => p.anchor === anchor);
  return pillar && LIVE_PILLARS.has(pillar.index) ? anchor : "#what-we-do";
};

/* A service's "Explore" link goes to its own page once that page is built
   (see src/lib/service-pages/built.ts), and to the contact form with the
   service already chosen until then. */
export const serviceHref = (service: Service) =>
  servicePagePath(service.name) ?? `/contact?service=${encodeURIComponent(service.name)}#contact-form`;
