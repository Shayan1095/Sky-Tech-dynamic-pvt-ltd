import { SERVICE_ADDONS } from "./addons";
import type { ServicePage } from "./types";

/* Transcribed verbatim from src/content/services/wordpress-development.md.

   Resolved against the file:
   - Prices are the US dollar figures in the detailed package sections and
     "Typical Investment". The PKR table appended at the end of the file is
     marked PENDING_CONFIRMATION and is not used (US prices only).
   - The hero's secondary CTA "View Our Work" is omitted until a portfolio
     page exists; "Book a Free Consultation" from the closing section stands
     in for it, as on Web Development.
   - "Typical Investment" gives starting prices only ("From $299"), so each
     bar in the cost chart starts at its price and runs on open-ended.
   - The add-on list has no prices in the content; see addons.ts. */
export const WORDPRESS_DEVELOPMENT: ServicePage = {
  slug: "wordpress-development",
  contactName: "WordPress Development",

  hero: {
    label: "WordPress Development Services",
    h1: "WordPress Websites Built for Speed, Security & Growth",
    accentWords: 4,
    subheadline:
      "We design and develop professional WordPress websites that are responsive, secure, SEO-friendly and built around your business goals.",
    primaryCta: "Get a Free WordPress Quote",
    secondaryCta: "Book a Free Consultation",
    timeline: { label: "Standard WordPress website", value: "2–4 weeks" },
  },

  problem: {
    heading: "WordPress That Works for Your Business",
    paragraphs: [
      "WordPress makes it easy to launch a website — but building a website that is ==fast==, ==secure==, ==scalable== and ==designed to generate results== requires the right strategy and development expertise.",
      "At SKY Tech, we build WordPress websites that go beyond ~~ready-made templates~~.",
      "From a simple business website to a fully customized WooCommerce store, we combine professional design, clean development, performance optimization and the right plugins to create a website that works for your business.",
    ],
  },

  offerings: {
    heading: "What We Offer",
    items: [
      {
        title: "Custom WordPress Website Development",
        body: "Professional WordPress websites designed around your brand, content and business objectives.",
        fit: { tier: "wordpress-business" },
      },
      {
        title: "WordPress Business Websites",
        body: "Modern, responsive websites for companies, agencies, consultants, startups and service providers.",
        fit: { tier: "wordpress-business" },
      },
      {
        title: "WooCommerce Development",
        body: "Complete online stores with products, categories, shopping carts, checkout, payments and order management.",
        fit: { tier: "woocommerce-store" },
      },
      {
        title: "Custom Theme Development",
        body: "Unique WordPress themes and layouts created to match your brand instead of relying on generic templates.",
        fit: { tier: "wordpress-advanced" },
      },
      {
        title: "Theme Customization",
        body: "Customize an existing WordPress theme to match your design, functionality and business requirements.",
        fit: { tier: "wordpress-starter" },
      },
      {
        title: "Plugin Integration & Customization",
        body: "Install, configure and customize the right plugins to extend your website's functionality.",
        fit: { tier: "wordpress-advanced" },
      },
      {
        title: "WordPress Speed Optimization",
        body: "Improve website performance, loading speed and overall user experience.",
        fit: { addOn: "Speed Optimization" },
      },
      {
        title: "WordPress Security",
        body: "Security-focused configuration, updates and best practices to help protect your website.",
        fit: { addOn: "Security Optimization" },
      },
      {
        title: "WordPress Website Redesign",
        body: "Turn an outdated WordPress website into a modern, responsive and conversion-focused digital experience.",
      },
      {
        title: "WordPress Maintenance & Support",
        body: "Ongoing updates, backups, security checks, troubleshooting and performance support.",
        fit: { addOn: "WordPress Maintenance" },
      },
    ],
  },

  packages: {
    heading: "Our WordPress Development Packages",
    priceLabel: "Starting From",
    tiers: [
      {
        id: "wordpress-starter",
        name: "WordPress Starter",
        bestFor:
          "Individuals, freelancers, startups and small businesses that need a professional WordPress presence.",
        price: "$299",
        includes: [
          "Up to 5 pages",
          "WordPress installation & configuration",
          "Professional responsive layout",
          "Mobile & tablet optimization",
          "Theme setup & customization",
          "Contact form",
          "Social media integration",
          "Basic SEO setup",
          "Essential plugin configuration",
          "Basic speed optimization",
          "Security best-practice setup",
          "Testing before launch",
        ],
        audience: {
          label: "Recommended For",
          text: "Consultants, freelancers, personal brands, small businesses and service providers.",
        },
        cta: "Get Started",
      },
      {
        id: "wordpress-business",
        name: "WordPress Business",
        bestFor: "Growing businesses that need a more customized and professional WordPress website.",
        price: "$500",
        includes: [
          "Up to 10 pages",
          "Custom WordPress design",
          "Responsive development",
          "Customized theme/layout",
          "Blog section",
          "Contact & inquiry forms",
          "Social media integration",
          "Essential plugin integration",
          "On-page SEO setup",
          "Speed optimization",
          "Security configuration",
          "Analytics integration",
          "Cross-browser testing",
        ],
        audience: {
          label: "Recommended For",
          text: "SMEs, corporate businesses, agencies, professional services, healthcare providers, real estate businesses and organizations.",
        },
        cta: "Build My Website",
      },
      {
        id: "wordpress-advanced",
        name: "WordPress Advanced",
        bestFor: "Businesses that need a highly customized WordPress website with advanced functionality.",
        price: "$800",
        includes: [
          "Custom WordPress UI/UX",
          "Advanced page layouts",
          "Custom theme modifications",
          "Advanced plugin integration",
          "Custom functionality",
          "Blog / resource section",
          "Forms & lead generation setup",
          "SEO-friendly structure",
          "Advanced speed optimization",
          "Security hardening",
          "Analytics & tracking",
          "Third-party integrations",
          "Responsive optimization",
          "Complete testing",
        ],
        audience: {
          label: "Recommended For",
          text: "Established businesses, organizations, agencies and companies with specific functionality requirements.",
        },
        cta: "Discuss My Project",
      },
      {
        id: "woocommerce-store",
        name: "WooCommerce Store",
        bestFor: "Businesses that want to sell products online through a professional WordPress-powered store.",
        price: "$600",
        includes: [
          "WooCommerce installation & configuration",
          "Store setup",
          "Product catalogue",
          "Product categories",
          "Shopping cart",
          "Checkout system",
          "Payment gateway integration",
          "Shipping configuration",
          "Inventory management",
          "Order management",
          "Customer accounts",
          "Responsive mobile design",
          "Product SEO basics",
          "Analytics integration",
          "Security configuration",
          "Store testing before launch",
        ],
        tech: ["WordPress", "WooCommerce"],
        audience: {
          label: "Ideal For",
          text: "Retail businesses, product brands, online stores, startups and growing e-commerce businesses.",
        },
        cta: "Start My Online Store",
      },
      {
        id: "custom-woocommerce-solution",
        name: "Custom WooCommerce Solution",
        bestFor: "Businesses that need advanced e-commerce functionality beyond a standard WooCommerce store.",
        price: "$1,500",
        includes: [
          "Custom WooCommerce development",
          "Custom storefront design",
          "Advanced product functionality",
          "Custom checkout",
          "Payment gateway integrations",
          "Inventory & order workflows",
          "Customer dashboards",
          "Custom shipping logic",
          "Third-party API integrations",
          "Advanced search & filtering",
          "Custom admin functionality",
          "Performance optimization",
          "Security implementation",
          "Testing & deployment",
        ],
        audience: {
          label: "Ideal For",
          text: "Growing e-commerce brands and businesses with unique sales, operational or integration requirements.",
        },
        cta: "Request a Custom Quote",
      },
    ],
  },

  capabilities: [
    {
      id: "wordpress-redesign-optimization",
      title: "WordPress Redesign & Optimization",
      body: ["Already have a WordPress website?", "We can improve it without starting from zero."],
      listLabel: "We Can Help With",
      list: [
        "Website redesign",
        "Theme customization",
        "Mobile responsiveness",
        "Speed optimization",
        "Plugin cleanup",
        "Plugin updates",
        "Security improvements",
        "SEO structure",
        "Broken functionality",
        "UX improvements",
        "Conversion optimization",
        "WordPress migration",
      ],
      priceLabel: "Starting From",
      price: "$299",
      priceNote:
        "Final pricing depends on the current website, number of pages, technical issues and required improvements.",
      cta: "Get My Website Audited",
    },
  ],

  addOns: {
    heading: "WordPress Add-ons",
    intro: "Enhance your WordPress website with additional services.",
    columns: ["Add-on Service", "Starting Price"],
    items: SERVICE_ADDONS["WordPress Development"],
  },

  technology: {
    heading: "WordPress Technologies & Tools",
    intro: "We select the right combination of WordPress tools based on your website's requirements.",
    groups: [
      { label: "CMS", items: ["WordPress"] },
      { label: "E-commerce", items: ["WooCommerce"] },
      { label: "Frontend", items: ["HTML5", "CSS3", "JavaScript", "Bootstrap", "Tailwind CSS"] },
      { label: "Backend", items: ["PHP"] },
      { label: "Database", items: ["MySQL"] },
      {
        label: "Integrations",
        items: ["Payment Gateways", "APIs", "Analytics", "Marketing Tools", "CRM Platforms", "Third-Party Services"],
      },
    ],
  },

  why: {
    heading: "Why Choose SKY Tech for WordPress Development?",
    items: [
      {
        title: "More Than a Template",
        body: "We don't simply install a theme and replace the demo content. We customize your website around your brand and business requirements.",
        proof: { kind: "drawing", drawing: "custom" },
      },
      {
        title: "Business-Focused Development",
        body: "Every page and functionality is planned around what you want your website to achieve.",
        proof: { kind: "process", step: 0 },
      },
      {
        title: "Responsive by Default",
        body: "Your website is optimized for desktops, tablets and mobile devices.",
        proof: { kind: "drawing", drawing: "responsive" },
      },
      {
        title: "Performance Matters",
        body: "We focus on clean implementation, optimized assets, plugin efficiency and page speed.",
        /* Not featured: nine reasons fill three full rows of three; a
           double-width card would leave the last one on its own. */
        proof: { kind: "speed" },
      },
      {
        title: "SEO-Friendly Foundation",
        body: "We structure your website with essential SEO considerations from the development stage.",
        proof: { kind: "drawing", drawing: "structure" },
      },
      {
        title: "Security-Conscious",
        body: "We follow WordPress security best practices and keep essential components properly configured.",
        proof: { kind: "addOn", name: "Security Optimization" },
      },
      {
        title: "Scalable",
        body: "Your WordPress website can evolve as your business grows, with additional functionality added when needed.",
        proof: { kind: "stack" },
      },
      {
        title: "Transparent Pricing",
        body: "You receive a clear scope and pricing structure before development begins.",
        proof: { kind: "pricing" },
      },
      {
        title: "Ongoing Support",
        body: "Need help after launch? Maintenance and support options are available for updates, security and ongoing improvements.",
        proof: { kind: "addOn", name: "WordPress Maintenance" },
      },
    ],
  },

  process: {
    heading: "Our WordPress Development Process",
    steps: [
      { title: "Discover", body: "We understand your business, audience, goals and website requirements." },
      {
        title: "Plan",
        body: "We define your sitemap, functionality, content structure, plugins and technical requirements.",
      },
      { title: "Design", body: "We create a professional interface aligned with your brand and focused on usability." },
      {
        title: "Develop",
        body: "We build and customize your WordPress website using the appropriate themes, plugins and custom development.",
      },
      { title: "Optimize", body: "We improve responsiveness, speed, SEO structure and security." },
      {
        title: "Test",
        body: "We test pages, forms, functionality, integrations and compatibility across devices and browsers.",
      },
      { title: "Launch", body: "After final approval, we deploy your website and make it ready for your customers." },
      { title: "Support", body: "We can continue supporting your website through maintenance, updates and optimization." },
    ],
  },

  investment: {
    heading: "How Much Does a WordPress Website Cost?",
    intro:
      "WordPress development pricing depends on the website size, design requirements, functionality and integrations.",
    label: "Typical Investment",
    ranges: [
      { label: "Starter WordPress Website", min: 299, max: 299, openEnded: true, display: "From $299", tier: "wordpress-starter" },
      { label: "Business WordPress Website", min: 500, max: 500, openEnded: true, display: "From $500", tier: "wordpress-business" },
      { label: "Advanced WordPress Website", min: 800, max: 800, openEnded: true, display: "From $800", tier: "wordpress-advanced" },
      { label: "WooCommerce Store", min: 600, max: 600, openEnded: true, display: "From $600", tier: "woocommerce-store" },
      { label: "Custom WooCommerce Solution", min: 1500, max: 1500, openEnded: true, display: "From $1,500", tier: "custom-woocommerce-solution" },
      { label: "WordPress Redesign & Optimization", min: 299, max: 299, openEnded: true, display: "From $299" },
    ],
    note: "For projects with complex functionality, we provide a custom quotation based on the exact scope.",
  },

  timeline: {
    heading: "How Long Does a WordPress Website Take?",
    paragraphs: [
      "A standard WordPress website can typically be completed within **2–4 weeks**, depending on the number of pages, design requirements, content readiness and feedback cycles.",
      "WooCommerce websites, redesigns and websites requiring custom functionality may take longer depending on scope.",
    ],
  },

  relatedAddOns: {
    "UI/UX Design": "UI/UX Design",
    "Website Maintenance": "WordPress Maintenance",
    "Hosting & Domain": "Domain & Hosting Setup",
  },

  faq: {
    heading: "Frequently Asked Questions",
    items: [
      {
        question: "Do you build custom WordPress websites?",
        answer:
          "Yes. We can customize existing themes or build a WordPress website around your specific brand, content and functionality requirements.",
      },
      {
        question: "Do you provide WooCommerce development?",
        answer:
          "Yes. We build WooCommerce stores with product management, checkout, payment integration, inventory and order management.",
      },
      {
        question: "Can you redesign my existing WordPress website?",
        answer:
          "Yes. We can redesign, restructure and optimize your existing website while preserving useful content and functionality where appropriate.",
      },
      {
        question: "Can you fix a broken WordPress website?",
        answer:
          "Yes. We can troubleshoot WordPress issues involving themes, plugins, layouts, forms, functionality and compatibility.",
      },
      {
        question: "Do you provide WordPress migration?",
        answer:
          "Yes. We can assist with moving WordPress websites between hosting environments while taking care of website files, database and essential configurations.",
      },
      {
        question: "Can you optimize my WordPress website speed?",
        answer:
          "Yes. We provide WordPress performance optimization covering areas such as assets, plugins, images, caching and other technical factors.",
      },
      {
        question: "Do you provide WordPress security?",
        answer:
          "Yes. Security configuration, updates and best practices can be included in WordPress projects and maintenance plans.",
      },
      {
        question: "Can you integrate payment gateways?",
        answer:
          "Yes. Payment gateway integration is available for WooCommerce and other WordPress-based solutions, depending on the gateway and project requirements.",
      },
      {
        question: "Do you provide SEO?",
        answer:
          "Yes. WordPress websites are developed with an SEO-friendly foundation, while complete SEO optimization and ongoing SEO campaigns can be purchased as an additional service.",
      },
      {
        question: "Do you provide maintenance after launch?",
        answer:
          "Yes. Monthly maintenance plans are available for updates, backups, security checks, troubleshooting and performance support.",
      },
      {
        question: "Can you integrate third-party APIs?",
        answer: "Yes. We can integrate APIs and external platforms based on your website's requirements.",
      },
      {
        question: "Do you work with international clients?",
        answer: "Yes. SKY Tech works with businesses in Pakistan, the USA, the UK and beyond.",
      },
    ],
  },

  closing: {
    kicker: "Ready to Build a Better WordPress Website?",
    heading: "Let's Build a WordPress Website That Works for Your Business.",
    body: "Whether you're starting from scratch, redesigning an existing website or building an online store, SKY Tech can help you choose the right WordPress solution.",
    promise: "Professional design. Clean development. Better performance. Built around your goals.",
    primaryCta: "Get a Free WordPress Quote",
    secondaryCta: "Book a Free Consultation",
  },
};
