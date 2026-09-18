import { SERVICE_ADDONS } from "./addons";
import type { ServicePage } from "./types";

/* Transcribed verbatim from src/content/services/web-development.md.

   Resolved against the file (confirmed with the client, 2026-09-18):
   - The detailed package sections are the source. The summary table
     appended at the end of the file is not used, except that the Advanced
     Business Web App is priced at $2,500+ as that table gives it.
   - The hero's secondary CTA "View Our Work" is omitted until a portfolio
     page exists; "Book a Free Consultation" from the closing section
     stands in for it.
   - Prices are US dollars only. */
export const WEB_DEVELOPMENT: ServicePage = {
  slug: "web-development",
  contactName: "Web Development",

  hero: {
    label: "Website Development Services",
    h1: "Websites Built to Grow Your Business",
    accentWords: 3,
    subheadline:
      "We design and develop fast, responsive and scalable websites that look professional, perform smoothly and turn visitors into customers.",
    primaryCta: "Get a Free Website Quote",
    secondaryCta: "Book a Free Consultation",
    timeline: { label: "Standard business website", value: "2–4 weeks" },
  },

  problem: {
    heading: "Your Website Should Do More Than Look Good",
    paragraphs: [
      "Your website is often the first interaction a potential customer has with your business.",
      "A slow, outdated or difficult-to-use website can cost you ~~credibility~~, ~~leads~~ and ~~sales~~.",
      "At SKY Tech, we build websites around your business goals — combining ==modern design==, ==responsive development==, ==SEO-friendly structure== and ==the right technology== for your needs.",
      "Whether you need a professional business website, an online store or a custom web application, we build it to help your business move forward.",
    ],
  },

  offerings: {
    heading: "What We Build",
    items: [
      {
        title: "Custom Business Websites",
        body: "Professional websites designed around your brand, services and business objectives.",
        fit: { tier: "business-website" },
      },
      {
        title: "Corporate & Portfolio Websites",
        body: "Clean, credibility-focused websites for companies, professionals, consultants and organizations.",
        fit: { tier: "business-website" },
      },
      {
        title: "Landing Pages",
        body: "High-converting landing pages designed for campaigns, products, services and lead generation.",
        fit: { tier: "starter-website" },
      },
      {
        title: "E-commerce Websites",
        body: "Online stores with product management, secure checkout, payment integration and inventory functionality.",
        fit: { tier: "e-commerce-website" },
      },
      {
        title: "Custom Web Applications",
        body: "Feature-rich web applications built around your unique business processes and requirements.",
        fit: { tier: "custom-web-application" },
      },
      {
        title: "Booking & Customer Portals",
        body: "Online booking systems, customer dashboards, membership platforms and custom portals.",
        fit: { tier: "custom-web-application" },
      },
      {
        title: "Website Redesign & Optimization",
        body: "Transform outdated websites into modern, responsive and performance-focused digital experiences.",
        fit: { addOn: "Website Redesign" },
      },
      {
        title: "Website Maintenance & Support",
        body: "Ongoing updates, backups, security improvements and performance support after launch.",
        fit: { addOn: "Website Maintenance" },
      },
    ],
  },

  packages: {
    heading: "Our Website Development Packages",
    priceLabel: "Starting From",
    tiers: [
      {
        id: "starter-website",
        name: "Starter Website",
        bestFor:
          "Startups, individuals, freelancers and small businesses that need a professional online presence.",
        price: "$299",
        includes: [
          "Up to 5 pages",
          "Responsive website design",
          "Mobile & tablet optimization",
          "HTML5 & CSS3 development",
          "Bootstrap or Tailwind CSS",
          "Contact form",
          "Social media integration",
          "Basic on-page SEO structure",
          "Speed-friendly development",
          "Basic testing before launch",
        ],
        audience: {
          label: "Recommended For",
          text: "Personal brands, consultants, freelancers, small businesses and service providers.",
        },
        cta: "Get Started",
      },
      {
        id: "business-website",
        name: "Business Website",
        bestFor:
          "Growing businesses that need a complete, professional website with stronger functionality.",
        price: "$500",
        includes: [
          "Up to 10 pages",
          "Custom website design",
          "Responsive development",
          "Business-focused page structure",
          "Blog / news section",
          "Contact & inquiry forms",
          "Social media integration",
          "Basic SEO optimization",
          "Google Analytics / tracking setup",
          "Speed optimization",
          "Security best practices",
          "Cross-browser testing",
        ],
        tech: ["HTML5", "CSS3", "JavaScript", "Bootstrap", "Tailwind", "WordPress", "PHP"],
        audience: {
          label: "Recommended For",
          text: "SMEs, corporate businesses, agencies, consultants, healthcare providers, real estate companies and professional services.",
        },
        cta: "Build My Website",
      },
      {
        id: "e-commerce-website",
        name: "E-commerce Website",
        bestFor: "Businesses ready to sell products or services online.",
        price: "$600",
        includes: [
          "E-commerce website setup",
          "Product catalogue",
          "Product categories",
          "Shopping cart",
          "Secure checkout",
          "Payment gateway integration",
          "Inventory management",
          "Order management",
          "Customer account functionality",
          "Responsive mobile design",
          "Basic SEO setup",
          "Analytics integration",
          "Admin dashboard",
          "Website testing before launch",
        ],
        tech: ["WooCommerce", "Shopify", "Laravel", "React", "MySQL"],
        audience: {
          label: "Ideal For",
          text: "Retailers, online stores, product-based businesses, brands and growing e-commerce companies.",
        },
        cta: "Start My Online Store",
      },
      {
        id: "custom-web-application",
        name: "Custom Web Application",
        bestFor: "Businesses that need more than a traditional website.",
        price: "$1,500",
        includes: [
          "Custom UI/UX",
          "Business-specific functionality",
          "User authentication",
          "Admin dashboard",
          "Database integration",
          "API integrations",
          "Custom workflows",
          "Third-party integrations",
          "Role-based access",
          "Responsive interface",
          "Testing & deployment",
          "Scalable architecture",
        ],
        tech: ["React.js", "Node.js", "Laravel", "Django", "Python", "MySQL", "MongoDB"],
        examples: [
          "Booking systems",
          "Customer portals",
          "Membership platforms",
          "Business dashboards",
          "CRM systems",
          "ERP solutions",
          "Internal management systems",
          "Custom business applications",
        ],
        cta: "Discuss My Project",
      },
      {
        id: "advanced-business-web-app",
        name: "Advanced Business Web App",
        bestFor:
          "Established businesses that need a complete digital platform to manage operations, customers or internal processes.",
        price: "$2,500+",
        includes: [
          "Custom UI/UX design",
          "Full-stack development",
          "Advanced admin panel",
          "Multiple user roles",
          "Database architecture",
          "API integrations",
          "Payment integrations where required",
          "Automated workflows",
          "Reporting & dashboards",
          "Third-party system integrations",
          "Security implementation",
          "Performance optimization",
          "Testing",
          "Deployment",
          "Post-launch support",
        ],
        tech: ["React.js", "Node.js", "Laravel", "Django", "Java", "MySQL", "MongoDB"],
        audience: {
          label: "Ideal For",
          text: "Companies requiring custom portals, CRM/ERP systems, booking platforms, marketplaces or complex business applications.",
        },
        cta: "Request a Custom Quote",
      },
    ],
  },

  capabilities: [
    {
      id: "custom-e-commerce-marketplace",
      title: "Custom E-commerce & Marketplace Solutions",
      body: [
        "For businesses with complex requirements, we develop tailored e-commerce platforms beyond standard WooCommerce or Shopify setups.",
      ],
      listLabel: "Solutions Can Include",
      list: [
        "Multi-vendor marketplace",
        "Vendor dashboards",
        "Product management",
        "Commission management",
        "Customer accounts",
        "Order management",
        "Payment integrations",
        "Inventory management",
        "Advanced search & filters",
        "Reporting dashboards",
        "API integrations",
        "Custom admin panels",
      ],
      priceLabel: "Starting From",
      price: "$2,500+",
      priceNote:
        "Final pricing depends on the number of modules, integrations, user roles, workflows and overall project complexity.",
      cta: "Discuss Your Marketplace",
    },
  ],

  addOns: {
    heading: "Website Development Add-ons",
    intro: "Enhance your website with additional services when required.",
    columns: ["Add-on Service", "Starting Price"],
    items: SERVICE_ADDONS["Web Development"],
  },

  technology: {
    heading: "Technology We Work With",
    intro:
      "We select the technology based on your business requirements, performance needs and future scalability.",
    groups: [
      {
        label: "Frontend",
        items: ["HTML5", "CSS3", "JavaScript", "React.js", "Vue.js", "Bootstrap", "Tailwind CSS"],
      },
      {
        label: "Backend",
        items: ["PHP", "Laravel", "CodeIgniter", "Node.js", "Django", "Python", "Java"],
      },
      { label: "CMS & E-commerce", items: ["WordPress", "WooCommerce", "Shopify"] },
      { label: "Databases", items: ["MySQL", "MongoDB"] },
      {
        label: "Integrations",
        items: ["Payment Gateways", "APIs", "Analytics", "Marketing Tools", "Third-Party Platforms"],
      },
    ],
  },

  why: {
    heading: "Why Choose SKY Tech for Website Development?",
    items: [
      {
        title: "Business-First Approach",
        body: "We don't start with technology. We start by understanding what your business needs the website to achieve.",
        proof: { kind: "process", step: 0 },
      },
      {
        title: "Custom Solutions",
        body: "Your website is built around your requirements instead of forcing your business into a generic template.",
        proof: { kind: "drawing", drawing: "custom" },
      },
      {
        title: "Responsive by Default",
        body: "Every website is designed to work across desktops, tablets and mobile devices.",
        proof: { kind: "drawing", drawing: "responsive" },
      },
      {
        title: "SEO-Friendly Structure",
        body: "We build websites with clean structure and essential SEO considerations from the beginning.",
        proof: { kind: "drawing", drawing: "structure" },
      },
      {
        title: "Performance Focused",
        body: "We prioritize clean development, optimized assets and a smooth user experience.",
        proof: { kind: "speed" },
        featured: true,
      },
      {
        title: "Scalable Technology",
        body: "We choose technologies that can grow with your business and future requirements.",
        proof: { kind: "stack" },
      },
      {
        title: "Transparent Pricing",
        body: "You get clear project scope, deliverables and pricing before development begins.",
        proof: { kind: "pricing" },
      },
      {
        title: "Post-Launch Support",
        body: "Our relationship doesn't have to end when your website goes live. Maintenance and support options are available for ongoing needs.",
        proof: { kind: "addOn", name: "Website Maintenance" },
      },
    ],
  },

  process: {
    heading: "Our Website Development Process",
    steps: [
      {
        title: "Discover",
        body: "We understand your business, audience, competitors, goals and website requirements.",
      },
      {
        title: "Plan",
        body: "We define the sitemap, features, technology, functionality and project scope.",
      },
      {
        title: "Design",
        body: "We create a user-focused interface aligned with your brand and business objectives.",
      },
      {
        title: "Develop",
        body: "Our development team builds the website using the technology best suited to your project.",
      },
      {
        title: "Test",
        body: "We test functionality, responsiveness, forms, integrations, performance and compatibility.",
      },
      {
        title: "Launch",
        body: "Once everything is approved, we deploy your website and make it ready for your audience.",
      },
      {
        title: "Support & Grow",
        body: "We provide maintenance, optimization and additional development support as your business evolves.",
      },
    ],
  },

  investment: {
    heading: "How Much Does Website Development Cost?",
    intro: "Website development pricing depends on the size and complexity of your project.",
    label: "Typical Investment",
    ranges: [
      { label: "Basic Websites", min: 300, max: 600, openEnded: false, display: "$300 – $600", tier: "starter-website" },
      { label: "Dynamic Business Websites", min: 500, max: 1200, openEnded: false, display: "$500 – $1,200", tier: "business-website" },
      { label: "E-commerce Websites", min: 600, max: 3000, openEnded: true, display: "$600 – $3,000+", tier: "e-commerce-website" },
      { label: "Custom Web Applications", min: 1500, max: 6000, openEnded: true, display: "$1,500 – $6,000+", tier: "custom-web-application" },
      { label: "CRM / ERP & Advanced Systems", min: 3000, max: 10000, openEnded: true, display: "$3,000 – $10,000+", tier: "advanced-business-web-app" },
    ],
    note: "Every project is different, so we provide a custom quotation after understanding your requirements.",
  },

  timeline: {
    heading: "How Long Does Website Development Take?",
    paragraphs: [
      "A standard business website can typically be completed within **2–4 weeks**, depending on the number of pages, functionality, content readiness and feedback cycles.",
      "E-commerce websites and custom web applications may require additional time based on their features and integrations.",
    ],
  },

  relatedAddOns: {
    "UI/UX Design": "UI/UX Design",
    "Website Maintenance": "Website Maintenance",
    "Hosting & Domain": "Domain & Hosting Setup",
  },

  faq: {
    heading: "Frequently Asked Questions",
    items: [
      {
        question: "Do you build websites from scratch?",
        answer:
          "Yes. We develop custom websites based on your brand, business goals and required functionality. We also work with platforms such as WordPress, WooCommerce and Shopify when they are the right choice for the project.",
      },
      {
        question: "Do you provide e-commerce website development?",
        answer:
          "Yes. We build both standard and custom e-commerce solutions, including WooCommerce, Shopify and custom e-commerce platforms.",
      },
      {
        question: "Can you redesign my existing website?",
        answer:
          "Yes. We can redesign outdated websites, improve their responsiveness, optimize performance and enhance their overall user experience.",
      },
      {
        question: "Do you provide website maintenance?",
        answer:
          "Yes. Monthly maintenance plans are available for updates, backups, security, troubleshooting and ongoing performance improvements.",
      },
      {
        question: "Can you integrate payment gateways?",
        answer:
          "Yes. Payment gateway integration is available as part of e-commerce and custom web development projects, depending on the gateway and project requirements.",
      },
      {
        question: "Do you provide SEO with website development?",
        answer:
          "Our websites are built with SEO-friendly structure and basic on-page SEO considerations. Full SEO campaigns are available as an additional service.",
      },
      {
        question: "Can you integrate APIs and third-party software?",
        answer: "Yes. We can integrate APIs and third-party platforms based on your project's requirements.",
      },
      {
        question: "Do you work with international clients?",
        answer: "Yes. SKY Tech works with businesses in Pakistan, the USA, the UK and beyond.",
      },
      {
        question: "What are your payment terms?",
        answer:
          "Standard projects generally begin with an advance payment, with remaining payments linked to agreed project milestones. Exact terms are confirmed in the project proposal.",
      },
    ],
  },

  closing: {
    kicker: "Ready to Build Your Website?",
    heading: "Let's Turn Your Idea Into a Digital Product.",
    body: "Whether you need a simple business website, an online store or a custom web application, we'll help you choose the right solution for your business.",
    promise:
      "No unnecessary features. No confusing technical jargon. Just the right technology for what you're trying to achieve.",
    primaryCta: "Get a Free Website Quote",
    secondaryCta: "Book a Free Consultation",
  },
};
