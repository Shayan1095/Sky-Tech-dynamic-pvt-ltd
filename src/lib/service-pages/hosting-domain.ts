import { SERVICE_ADDONS } from "./addons";
import type { ServicePage } from "./types";

/* Transcribed verbatim from src/content/services/hosting-domain.md.

   Resolved against the file:
   - The detailed package sections are the source; the summary tables
     appended at the end (Basic / Professional / Enterprise Hosting, and a
     second add-on table) are not used, as on Web Development.
   - Packages are priced per year; "Custom Hosting Solution" is a custom
     quote and lists what it "Can Include".
   - The nine specialist sections (Domain Registration, Web Hosting,
     WordPress Hosting, E-Commerce Hosting, SSL, Business Email, Migration,
     DNS, Backups) and "Hosting Features We Can Help Configure" are the
     page's capabilities, shown as tabs in one band. Domain Registration's
     "Pricing" line is carried as that tab's note.
   - The content names no technologies, so the page has no technology band.
   - The problem section's qualities (reliable, secure, suitable) form its
     answer board; the services the content set in bold stay bold. */
export const HOSTING_DOMAIN: ServicePage = {
  slug: "hosting-domain",
  contactName: "Hosting & Domain",

  hero: {
    label: "Hosting & Domain Services",
    h1: "Reliable Hosting & Domains for Your Online Presence",
    accentWords: 3,
    subheadline:
      "Secure your brand with the right domain and keep your website fast, stable and accessible with reliable hosting solutions tailored to your business needs.",
    primaryCta: "Get Hosting & Domain",
    secondaryCta: "Talk to an Expert",
    timeline: { label: "Basic domain & hosting setup", value: "1–2 business days" },
  },

  problem: {
    heading: "Your Website Deserves a Reliable Home",
    paragraphs: [
      "Your website is available to customers 24/7.",
      "That means your hosting needs to be ==reliable==, ==secure== and ==suitable for the demands of your website==.",
      "At SKY Tech, we provide **domain registration, website hosting, WordPress hosting, business email, SSL, migration and hosting support** to help businesses establish and maintain a dependable online presence.",
      "Whether you're launching a simple business website or running a growing online store, we can help you choose and configure a hosting solution based on your requirements.",
    ],
  },

  offerings: {
    heading: "What We Offer",
    items: [
      {
        title: "Domain Registration",
        body: "Register the right domain name for your business and establish a professional online identity.",
        fit: { addOn: "Domain Setup" },
      },
      {
        title: "Domain Transfer",
        body: "Move your existing domain to a new provider with assistance throughout the transfer process.",
        fit: { addOn: "Domain Transfer" },
      },
      {
        title: "Shared Web Hosting",
        body: "Affordable hosting for personal websites, portfolios, blogs and small business websites.",
        fit: { tier: "starter-hosting" },
      },
      {
        title: "Business Web Hosting",
        body: "More suitable hosting solutions for growing businesses and websites with higher resource requirements.",
        fit: { tier: "business-hosting" },
      },
      {
        title: "WordPress Hosting",
        body: "Hosting configured specifically for WordPress websites, with performance and security considerations.",
        fit: { tier: "wordpress-hosting" },
      },
      {
        title: "E-Commerce Hosting",
        body: "Hosting solutions designed for online stores and websites with higher resource and traffic requirements.",
        fit: { tier: "e-commerce-hosting" },
      },
      {
        title: "SSL Certificate",
        body: "Help secure your website with HTTPS and an SSL certificate.",
        fit: { addOn: "SSL Setup" },
      },
      {
        title: "Business Email",
        body: "Set up professional email addresses using your business domain.",
        fit: { addOn: "Business Email Setup" },
      },
      {
        title: "Website Migration",
        body: "Move your existing website from another hosting provider with minimal disruption.",
        fit: { addOn: "Website Migration" },
      },
      {
        title: "Backup & Recovery",
        body: "Help configure website backups and recovery options based on the hosting environment.",
        fit: { addOn: "Backup Setup" },
      },
      {
        title: "Hosting Setup",
        body: "Configure domains, DNS, hosting accounts, SSL and other required website infrastructure.",
        fit: { tier: "starter-hosting" },
      },
      {
        title: "Hosting Support",
        body: "Technical assistance for common hosting, domain, DNS and website-related issues.",
        fit: { addOn: "Hosting Troubleshooting" },
      },
    ],
  },

  packages: {
    heading: "Our Hosting & Domain Packages",
    priceLabel: "Starting From",
    tiers: [
      {
        id: "starter-hosting",
        name: "Starter Hosting",
        bestFor: "Individuals, portfolios and small websites with basic hosting requirements.",
        price: "$60/year",
        includes: [
          "1 website",
          "Basic web hosting",
          "Domain setup assistance",
          "SSL configuration",
          "Basic DNS setup",
          "Control panel access",
          "Email setup assistance",
          "Basic technical support",
        ],
        audience: {
          label: "Recommended For",
          text: "Personal websites, portfolios, landing pages and small websites.",
        },
        note: "Domain registration may be included depending on the selected domain extension and hosting plan.",
        cta: "Get Starter Hosting",
      },
      {
        id: "business-hosting",
        name: "Business Hosting",
        bestFor: "Small and growing businesses that need a professional hosting environment.",
        price: "$120/year",
        includes: [
          "Hosting for business website",
          "Domain setup",
          "SSL",
          "DNS configuration",
          "Business email setup",
          "Control panel access",
          "Website backup configuration",
          "Basic performance optimization",
          "Technical support",
        ],
        audience: {
          label: "Recommended For",
          text: "Business websites, agencies, professional services and SMEs.",
        },
        cta: "Host My Business Website",
      },
      {
        id: "wordpress-hosting",
        name: "WordPress Hosting",
        bestFor: "Businesses and professionals running WordPress websites.",
        price: "$150/year",
        includes: [
          "WordPress hosting",
          "Domain setup",
          "SSL",
          "WordPress installation",
          "DNS configuration",
          "Email setup assistance",
          "Backup configuration",
          "Basic performance optimization",
          "Security configuration",
          "Technical support",
        ],
        audience: {
          label: "Recommended For",
          text: "WordPress websites, blogs, business websites and content-driven websites.",
        },
        cta: "Get WordPress Hosting",
      },
      {
        id: "e-commerce-hosting",
        name: "E-Commerce Hosting",
        bestFor: "Online stores and websites requiring additional hosting resources.",
        price: "$250/year",
        includes: [
          "E-commerce hosting setup",
          "Domain configuration",
          "SSL",
          "DNS setup",
          "Website migration assistance",
          "Backup configuration",
          "Performance optimization",
          "Security configuration",
          "Business email",
          "Technical support",
        ],
        audience: {
          label: "Recommended For",
          text: "WooCommerce stores, online shops and growing e-commerce businesses.",
        },
        cta: "Host My Online Store",
      },
      {
        id: "custom-hosting-solution",
        name: "Custom Hosting Solution",
        bestFor: "Websites with specialized requirements, higher traffic or custom infrastructure needs.",
        priceLabel: "Pricing",
        price: "Custom Quote",
        includesLabel: "Can Include",
        includes: [
          "Advanced hosting configuration",
          "VPS / cloud hosting setup",
          "Dedicated resource planning",
          "Multiple websites",
          "Advanced DNS configuration",
          "Migration",
          "SSL",
          "Backup strategy",
          "Performance optimization",
          "Security configuration",
          "Monitoring",
          "Ongoing technical support",
        ],
        audience: {
          label: "Ideal For",
          text: "High-traffic websites, e-commerce businesses, web applications, agencies and organizations with specialized hosting requirements.",
        },
        cta: "Get a Custom Hosting Plan",
      },
    ],
  },

  capabilities: [
    {
      id: "domain-registration",
      title: "Domain Registration",
      subtitle: "Your Domain Is Your Digital Address",
      body: ["A good domain name makes your business easier to find and remember."],
      lists: [
        {
          label: "We can assist with",
          items: [
            "Domain name selection",
            "Domain registration",
            "Domain configuration",
            "Domain renewal",
            "DNS management",
            "Domain transfer",
            "Domain connection",
            "Business email setup",
          ],
        },
        {
          label: "Popular Extensions",
          items: [".com", ".net", ".org", ".co", ".pk", "Other available extensions"],
        },
      ],
      note: {
        label: "Pricing",
        text: "Domain pricing varies by extension and registrar. We provide a quote based on the domain extension and registration period.",
      },
      cta: "Register My Domain",
    },
    {
      id: "web-hosting",
      title: "Web Hosting",
      subtitle: "Hosting Built Around Your Website",
      body: [
        "Different websites have different requirements.",
        "A small portfolio doesn't need the same hosting environment as an e-commerce store or web application.",
      ],
      lists: [
        {
          label: "We help you select and configure hosting according to",
          items: [
            "Website type",
            "Number of websites",
            "Traffic",
            "Storage requirements",
            "Performance requirements",
            "Email requirements",
            "Software / CMS",
            "Business growth",
            "Budget",
          ],
        },
      ],
      cta: "Find the Right Hosting",
    },
    {
      id: "wordpress-hosting-setup",
      title: "WordPress Hosting",
      subtitle: "Keep Your WordPress Website Running Smoothly",
      body: [
        "WordPress websites require a hosting environment that can support the CMS, plugins, themes and website traffic.",
      ],
      lists: [
        {
          label: "Our WordPress hosting setup can include",
          items: [
            "WordPress installation",
            "Domain connection",
            "SSL",
            "DNS configuration",
            "Backup setup",
            "Security configuration",
            "Performance optimization",
            "Email setup",
            "Migration assistance",
          ],
        },
      ],
      cta: "Get WordPress Hosting",
    },
    {
      id: "e-commerce-hosting-setup",
      title: "E-Commerce Hosting",
      subtitle: "Give Your Online Store the Resources It Needs",
      body: ["An online store may have more requirements than a standard business website."],
      lists: [
        {
          label: "We can help configure hosting for",
          items: [
            "WooCommerce",
            "Product catalogs",
            "Online stores",
            "Payment integrations",
            "Customer accounts",
            "Larger databases",
            "Higher traffic requirements",
          ],
        },
        {
          label: "Our Support Can Include",
          items: [
            "Hosting setup",
            "SSL",
            "Migration",
            "Backup configuration",
            "Performance optimization",
            "Security configuration",
          ],
        },
      ],
      cta: "Host My E-Commerce Website",
    },
    {
      id: "ssl-website-security",
      title: "SSL & Website Security",
      subtitle: "Protect Your Website With HTTPS",
      body: ["An SSL certificate helps establish an encrypted connection between your website and its visitors."],
      lists: [
        {
          label: "We can help with",
          items: [
            "SSL installation",
            "SSL configuration",
            "HTTPS setup",
            "Certificate renewal",
            "Mixed-content troubleshooting",
            "Basic security configuration",
          ],
        },
      ],
      cta: "Secure My Website",
    },
    {
      id: "business-email-hosting",
      title: "Business Email Hosting",
      subtitle: "Look Professional With Your Own Domain Email",
      body: ["Build trust with professional email addresses using your business domain."],
      lists: [
        {
          label: "For example",
          items: ["info@yourbusiness.com", "sales@yourbusiness.com", "support@yourbusiness.com"],
        },
        {
          label: "We Can Help With",
          items: [
            "Business email setup",
            "Mailbox configuration",
            "Domain connection",
            "DNS records",
            "Email forwarding",
            "Email client setup",
            "Migration assistance",
          ],
        },
      ],
      priceLabel: "Starting From",
      price: "$50/setup",
      priceNote: "Email hosting fees, where applicable, are separate.",
      cta: "Set Up Business Email",
    },
    {
      id: "website-migration",
      title: "Website Migration",
      subtitle: "Move Your Website Without the Headache",
      body: ["Changing hosting providers doesn't have to mean rebuilding your website."],
      lists: [
        {
          label: "We can assist with moving",
          items: [
            "Website files",
            "Databases",
            "WordPress websites",
            "Domain configuration",
            "Email settings",
            "SSL",
            "DNS records",
          ],
        },
        {
          label: "Migration Can Include",
          items: ["Backup", "Transfer", "Configuration", "Testing", "DNS Update"],
        },
      ],
      priceLabel: "Starting From",
      price: "$75",
      priceNote: "Complex migrations are quoted according to website size and technical requirements.",
      cta: "Migrate My Website",
    },
    {
      id: "domain-dns-management",
      title: "Domain & DNS Management",
      subtitle: "Get Your Website Connected Correctly",
      body: ["DNS configuration connects your domain with the services your business uses."],
      lists: [
        {
          label: "We can assist with",
          items: [
            "A records",
            "CNAME records",
            "MX records",
            "TXT records",
            "Nameservers",
            "Subdomains",
            "Domain forwarding",
            "Email DNS configuration",
            "Website connections",
          ],
        },
      ],
      priceLabel: "Starting From",
      price: "$30",
      cta: "Fix My DNS",
    },
    {
      id: "website-backup-setup",
      title: "Website Backup Setup",
      subtitle: "Be Prepared Before Something Goes Wrong",
      body: [
        "Regular backups can help protect your website against accidental changes, technical issues or other disruptions.",
      ],
      lists: [
        {
          label: "We can help configure",
          items: ["Website backups", "Database backups", "Backup schedules", "Backup storage", "Recovery options"],
        },
      ],
      priceLabel: "Starting From",
      price: "$50",
      priceNote: "Backup availability and options depend on the selected hosting environment.",
      cta: "Set Up My Backups",
    },
    {
      id: "hosting-features",
      title: "Hosting Features We Can Help Configure",
      subtitle: "Depending on the selected hosting environment",
      body: [],
      lists: [
        {
          label: "",
          items: [
            "Domain connection",
            "SSL",
            "DNS",
            "Control panel",
            "Email accounts",
            "Database",
            "Backups",
            "WordPress",
            "Website migration",
            "Security settings",
            "Performance configuration",
            "Subdomains",
            "FTP / SFTP access",
            "Cron jobs",
            "CDN integration where applicable",
          ],
        },
      ],
    },
  ],

  addOns: {
    heading: "Hosting & Domain Add-ons",
    intro: "",
    columns: ["Add-on Service", "Starting Price"],
    items: SERVICE_ADDONS["Hosting & Domain"],
  },

  why: {
    heading: "What Makes Our Hosting Service Different?",
    items: [
      {
        title: "Business-Focused Recommendations",
        body: "We don't recommend the same hosting solution for every website.",
        proof: { kind: "process", step: 1 },
        featured: true,
      },
      {
        title: "Complete Setup",
        body: "We can handle the domain, hosting, DNS, SSL and website connection together.",
        proof: { kind: "process", step: 2 },
      },
      {
        title: "Migration Support",
        body: "Moving from another provider can be handled as part of the service.",
        proof: { kind: "addOn", name: "Website Migration" },
      },
      {
        title: "Security Conscious",
        body: "We consider SSL, backups, access and basic security configuration during setup.",
        proof: { kind: "addOn", name: "Website Security Setup" },
      },
      {
        title: "Scalable",
        body: "We can help you move toward a more suitable hosting environment as your website grows.",
        proof: { kind: "pricing" },
      },
      {
        title: "Technical Support",
        body: "You don't have to figure out hosting and DNS issues on your own.",
        proof: { kind: "addOn", name: "Hosting Troubleshooting" },
      },
      {
        title: "One Place for Your Website Infrastructure",
        body: "Domain, hosting, SSL, email and website setup can be coordinated through one service provider.",
        proof: { kind: "drawing", drawing: "structure" },
        featured: true,
      },
    ],
  },

  process: {
    heading: "Hosting Migration & Setup Process",
    steps: [
      { title: "Understand", body: "We review your website, domain, hosting requirements and current setup." },
      {
        title: "Recommend",
        body: "We identify a suitable hosting option based on your website and expected requirements.",
      },
      { title: "Configure", body: "We set up the hosting environment, domain, DNS, SSL and required services." },
      {
        title: "Migrate",
        body: "If you're moving from another provider, we transfer the website and relevant configuration.",
      },
      { title: "Test", body: "We verify the website, domain, SSL, email and essential functionality." },
      { title: "Connect", body: "DNS is configured so visitors can access the website through your domain." },
      { title: "Secure", body: "We configure available security, backup and access settings." },
      {
        title: "Support",
        body: "We provide assistance with hosting-related issues according to your selected support arrangement.",
      },
    ],
  },

  investment: {
    heading: "How Much Does Hosting & Domain Cost?",
    intro:
      "Hosting costs depend on the hosting type, provider, resources, domain extension, storage, traffic and required services.",
    label: "Typical Investment",
    unit: "/year",
    ranges: [
      { label: "Starter Hosting", min: 60, max: 60, openEnded: true, display: "From $60/year", tier: "starter-hosting" },
      { label: "Business Hosting", min: 120, max: 120, openEnded: true, display: "From $120/year", tier: "business-hosting" },
      { label: "WordPress Hosting", min: 150, max: 150, openEnded: true, display: "From $150/year", tier: "wordpress-hosting" },
      { label: "E-Commerce Hosting", min: 250, max: 250, openEnded: true, display: "From $250/year", tier: "e-commerce-hosting" },
    ],
    note: "Custom Hosting: Custom Quote",
    important: {
      label: "Important",
      text: "Domain registration and hosting are recurring services.",
      listLabel: "Prices may vary based on",
      list: [
        "Domain extension",
        "Hosting provider",
        "Billing period",
        "Hosting resources",
        "Promotional pricing",
        "Renewal pricing",
        "Additional services",
      ],
      closing: "We provide the final price before purchase or setup.",
    },
  },

  timeline: {
    heading: "How Long Does Hosting Setup Take?",
    paragraphs: [
      "A basic domain and hosting setup can typically be completed within **1–2 business days** after receiving the required information and access.",
      "WordPress setup and website migration may take approximately **2–5 business days**.",
      "Complex migrations, e-commerce websites and custom hosting environments may require **5–10+ business days**, depending on technical requirements.",
      "Domain registration and DNS propagation times can vary.",
    ],
  },

  faq: {
    heading: "Frequently Asked Questions",
    items: [
      {
        question: "What is a domain?",
        answer: "A domain is the web address people use to access your website, such as **yourbusiness.com**.",
      },
      {
        question: "What is web hosting?",
        answer:
          "Web hosting is the server environment where your website files, databases and related resources are stored and made accessible online.",
      },
      {
        question: "Do I need both a domain and hosting?",
        answer:
          "For a typical website, yes. The domain is your website's address, while hosting provides the infrastructure where your website lives.",
      },
      {
        question: "Do you provide domain registration?",
        answer: "Yes. We can assist with domain registration and configuration for available domain extensions.",
      },
      {
        question: "Can you transfer my existing domain?",
        answer: "Yes. We can assist with domain transfers and DNS configuration.",
      },
      {
        question: "Can you migrate my existing website?",
        answer:
          "Yes. Website migration is available for WordPress, business websites and other supported hosting environments.",
      },
      {
        question: "Do you provide WordPress hosting?",
        answer: "Yes. We offer WordPress-focused hosting setup and support.",
      },
      {
        question: "Do you provide hosting for e-commerce websites?",
        answer:
          "Yes. We can configure hosting solutions for WooCommerce and other e-commerce websites according to their requirements.",
      },
      { question: "Do you provide SSL?", answer: "Yes. We can assist with SSL installation and HTTPS configuration." },
      {
        question: "Can you set up business email?",
        answer: "Yes. We can configure professional email addresses using your business domain.",
      },
      {
        question: "Can you fix DNS issues?",
        answer: "Yes. We can troubleshoot and configure common DNS records such as A, CNAME, MX and TXT records.",
      },
      {
        question: "Do you provide website backups?",
        answer:
          "We can help configure available website and database backup solutions depending on the hosting environment.",
      },
      {
        question: "Will my website be faster with better hosting?",
        answer:
          "Hosting can affect website performance, but speed also depends on website code, images, plugins, database configuration, caching and other factors. We can review the hosting environment and identify potential improvements.",
      },
      {
        question: "Do you guarantee 100% uptime?",
        answer:
          "No. Actual uptime depends on the hosting infrastructure and provider. We recommend selecting hosting based on the website's requirements and the provider's service commitments.",
      },
      {
        question: "Are domain and hosting prices recurring?",
        answer:
          "Yes. Domain registration and hosting generally require renewal according to their respective billing periods.",
      },
      {
        question: "Can I upgrade my hosting later?",
        answer:
          "In many hosting environments, yes. The appropriate upgrade path depends on the provider and hosting plan.",
      },
      {
        question: "Do you provide ongoing hosting support?",
        answer: "Yes. Ongoing technical support and maintenance can be arranged according to your requirements.",
      },
      {
        question: "Do you work with international clients?",
        answer: "Yes. SKY Tech works with businesses in Pakistan, the USA, the UK and beyond.",
      },
    ],
  },

  closing: {
    kicker: "Ready to Get Your Website Online?",
    heading: "Let's Set Up the Right Foundation for Your Website.",
    body: "Whether you're registering a new domain, launching a website, moving from another hosting provider or looking for a more reliable hosting solution, SKY Tech can help manage the technical setup.",
    promise: "Reliable hosting. Professional domains. Secure setup. Ongoing support.",
    primaryCta: "Get Hosting & Domain",
    secondaryCta: "Talk to an Expert",
  },
};
