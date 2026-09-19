import { SERVICE_ADDONS } from "./addons";
import type { ServicePage } from "./types";

/* Transcribed verbatim from src/content/services/website-maintenance.md.

   Resolved against the file:
   - The detailed package sections are the source; the summary tables
     appended at the end (Basic / Professional / Enterprise Maintenance, and
     a second add-on table) are not used, as on Web Development.
   - Packages are priced per month; "Custom Website Care" is a custom quote
     and lists what it "Can Include".
   - The problem section's opening two paragraphs are set as one opening
     line, and the problems it names are struck through; the qualities the
     content set in bold are highlighted instead. Wording unchanged.
   - The eight specialist sections (WordPress, Security, Backups,
     Performance, Content Updates, Bug Fixes, E-Commerce, Monitoring) are
     the page's capabilities, shown as tabs in one band.
   - The content names no technologies, so the page has no technology band.
   - "Custom Website Care: Custom Quote" has no figure to chart, so it is
     given as the cost section's closing line. */
export const WEBSITE_MAINTENANCE: ServicePage = {
  slug: "website-maintenance",
  contactName: "Website Maintenance",

  hero: {
    label: "Website Maintenance Services",
    h1: "Keep Your Website Secure, Updated & Running Smoothly",
    accentWords: 5,
    subheadline:
      "We take care of the technical side of your website so you can focus on your business. From updates and backups to security, bug fixes and performance optimization, our maintenance plans keep your website healthy and reliable.",
    primaryCta: "Get a Maintenance Plan",
    secondaryCta: "Request a Website Audit",
    timeline: { label: "Simple content changes & minor fixes", value: "1–2 business days" },
  },

  problem: {
    heading: "Your Website Needs Ongoing Care",
    paragraphs: [
      "Launching a website is only the beginning. Websites need regular updates, security checks, backups, performance monitoring and technical fixes to continue working properly.",
      "~~Outdated plugins~~, ~~broken links~~, ~~compatibility issues~~, ~~security vulnerabilities~~ and ~~slow performance~~ can affect both your visitors and your business.",
      "At SKY Tech, we provide ongoing website maintenance and technical support to help keep your website ==secure==, ==updated==, ==functional== and ==optimized==.",
      "Whether you have a WordPress website, business website or e-commerce store, we can create a maintenance plan around your requirements.",
    ],
  },

  offerings: {
    heading: "What We Offer",
    items: [
      {
        title: "Website Updates",
        body: "Keep your website software, CMS, plugins, themes and supported components updated.",
        fit: { tier: "essential-maintenance" },
      },
      {
        title: "WordPress Maintenance",
        body: "Ongoing WordPress updates, plugin management, theme updates and technical checks.",
        fit: { tier: "essential-maintenance" },
      },
      {
        title: "Security Monitoring",
        body: "Regular checks and security-related maintenance to help reduce common website risks.",
        fit: { tier: "business-maintenance" },
      },
      {
        title: "Website Backups",
        body: "Configure and manage regular website and database backups where supported.",
        fit: { addOn: "Backup Setup" },
      },
      {
        title: "Bug Fixes",
        body: "Identify and resolve common website errors, broken functionality and technical issues.",
        fit: { addOn: "Emergency Bug Fix" },
      },
      {
        title: "Performance Optimization",
        body: "Review website performance and identify opportunities to improve speed and efficiency.",
        fit: { addOn: "Performance Optimization" },
      },
      {
        title: "Plugin & Theme Management",
        body: "Keep plugins and themes updated while checking for compatibility issues.",
        fit: { tier: "business-maintenance" },
      },
      {
        title: "Broken Link Checks",
        body: "Identify broken or problematic links that may affect the user experience.",
        fit: { tier: "essential-maintenance" },
      },
      {
        title: "Website Content Updates",
        body: "Make agreed text, image, page and basic content changes.",
        fit: { addOn: "Content Update" },
      },
      {
        title: "Technical Support",
        body: "Provide assistance when website-related technical problems occur.",
        fit: { tier: "professional-maintenance" },
      },
      {
        title: "Website Monitoring",
        body: "Monitor important website functions and identify issues that require attention.",
        fit: { tier: "professional-maintenance" },
      },
      {
        title: "SSL & Security Checks",
        body: "Help maintain SSL configuration and basic website security settings.",
        fit: { addOn: "SSL Setup" },
      },
      {
        title: "Database Maintenance",
        body: "Perform appropriate database cleanup and optimization depending on the website environment.",
        fit: { addOn: "Database Optimization" },
      },
      {
        title: "Uptime Checks",
        body: "Monitor website availability and investigate reported downtime where applicable.",
        fit: { tier: "custom-website-care" },
      },
      {
        title: "Emergency Website Support",
        body: "Provide assistance for urgent website issues according to the selected support arrangement.",
        fit: { tier: "custom-website-care" },
      },
    ],
  },

  packages: {
    heading: "Our Website Maintenance Packages",
    priceLabel: "Starting From",
    tiers: [
      {
        id: "essential-maintenance",
        name: "Essential Maintenance",
        bestFor: "Small business websites and portfolios that need basic ongoing maintenance.",
        price: "$100/month",
        includes: [
          "Website health check",
          "CMS updates",
          "Plugin updates",
          "Theme updates",
          "Basic security checks",
          "Website backup monitoring",
          "Broken link checks",
          "Basic bug fixes",
          "Monthly maintenance report",
          "Email support",
        ],
        audience: {
          label: "Recommended For",
          text: "Small business websites, portfolios and simple informational websites.",
        },
        cta: "Protect My Website",
      },
      {
        id: "business-maintenance",
        name: "Business Maintenance",
        bestFor: "Businesses that depend on their website for enquiries, customers and day-to-day operations.",
        price: "$200/month",
        includes: [
          "Everything in Essential",
          "More frequent website checks",
          "WordPress / CMS maintenance",
          "Plugin & theme management",
          "Security monitoring",
          "Backup management",
          "Performance checks",
          "Content updates",
          "Bug fixes",
          "SSL checks",
          "Broken link monitoring",
          "Monthly optimization",
          "Priority support",
          "Detailed monthly report",
        ],
        audience: {
          label: "Recommended For",
          text: "SMEs, professional services, agencies and growing businesses.",
        },
        cta: "Maintain My Website",
      },
      {
        id: "professional-maintenance",
        name: "Professional Maintenance",
        bestFor: "Businesses with websites that require regular updates, optimization and technical support.",
        price: "$350/month",
        includes: [
          "Everything in Business",
          "Advanced website monitoring",
          "Regular security checks",
          "Backup verification",
          "Performance optimization",
          "Database maintenance",
          "Plugin compatibility checks",
          "Website error monitoring",
          "Content updates",
          "Technical troubleshooting",
          "SEO health checks",
          "Priority technical support",
          "Detailed monthly report",
          "Maintenance recommendations",
        ],
        audience: {
          label: "Recommended For",
          text: "Established businesses, content-heavy websites and websites with regular traffic and updates.",
        },
        cta: "Get Professional Maintenance",
      },
      {
        id: "e-commerce-maintenance",
        name: "E-Commerce Maintenance",
        bestFor: "Online stores where website availability and functionality directly affect sales.",
        price: "$500/month",
        includes: [
          "E-commerce website monitoring",
          "CMS maintenance",
          "Plugin / extension updates",
          "Theme updates",
          "Security checks",
          "Backup monitoring",
          "Database checks",
          "Performance optimization",
          "Product / content updates",
          "Broken functionality checks",
          "Checkout testing",
          "Basic payment integration checks",
          "Bug fixes",
          "Priority support",
          "Monthly performance report",
        ],
        audience: {
          label: "Recommended For",
          text: "WooCommerce stores and other supported e-commerce websites.",
        },
        cta: "Protect My Online Store",
      },
      {
        id: "custom-website-care",
        name: "Custom Website Care",
        bestFor:
          "Businesses that need dedicated ongoing technical support or have complex website requirements.",
        priceLabel: "Pricing",
        price: "Custom Quote",
        includesLabel: "Can Include",
        includes: [
          "Dedicated maintenance support",
          "High-frequency monitoring",
          "Advanced security maintenance",
          "Performance optimization",
          "Website updates",
          "Content management",
          "E-commerce support",
          "Custom functionality support",
          "Technical troubleshooting",
          "Backup management",
          "Migration support",
          "Emergency support",
          "Monthly technical reporting",
        ],
        audience: {
          label: "Ideal For",
          text: "Large businesses, e-commerce brands, web applications, organizations and websites with specialized requirements.",
        },
        cta: "Request a Custom Plan",
      },
    ],
  },

  capabilities: [
    {
      id: "wordpress-maintenance",
      title: "WordPress Maintenance",
      subtitle: "Keep Your WordPress Website Healthy",
      body: ["WordPress websites depend on multiple components working together."],
      lists: [
        {
          label: "We help maintain",
          items: [
            "WordPress core",
            "Plugins",
            "Themes",
            "Database",
            "Security settings",
            "Backups",
            "Website performance",
            "Forms",
            "Basic functionality",
          ],
        },
        {
          label: "WordPress Maintenance Can Include",
          items: [
            "WordPress updates",
            "Plugin updates",
            "Theme updates",
            "Compatibility checks",
            "Security checks",
            "Backup monitoring",
            "Bug fixing",
            "Performance checks",
            "Database maintenance",
            "Content updates",
          ],
        },
      ],
      priceLabel: "Starting From",
      price: "$100/month",
      cta: "Maintain My WordPress Website",
    },
    {
      id: "website-security-maintenance",
      title: "Website Security Maintenance",
      subtitle: "Protect Your Website From Common Issues",
      body: ["Website security requires ongoing attention."],
      lists: [
        {
          label: "We can help with",
          items: [
            "Security checks",
            "SSL monitoring",
            "Software updates",
            "Plugin updates",
            "Theme updates",
            "Malware checks where supported",
            "Login/security configuration",
            "Backup verification",
            "Basic vulnerability mitigation",
            "Security recommendations",
          ],
        },
      ],
      note: {
        label: "Important",
        text: "No maintenance service can guarantee that a website will never be compromised. Our goal is to maintain good security practices and respond to identified issues appropriately.",
      },
      cta: "Secure My Website",
    },
    {
      id: "website-backup-management",
      title: "Website Backup Management",
      subtitle: "Your Backup Is Your Safety Net",
      body: ["Regular backups can make recovery easier when something goes wrong."],
      lists: [
        {
          label: "We can help manage",
          items: [
            "Website backups",
            "Database backups",
            "Backup schedules",
            "Backup verification",
            "Backup retention",
            "Recovery planning",
          ],
        },
        {
          label: "Backup Support Depends On",
          items: ["Hosting environment", "Website platform", "Available storage", "Backup system", "Website size"],
        },
      ],
      cta: "Manage My Backups",
    },
    {
      id: "website-performance-optimization",
      title: "Website Performance Optimization",
      subtitle: "Keep Your Website Performing at Its Best",
      body: ["A website can become slower over time as content, plugins, scripts and databases grow."],
      lists: [
        {
          label: "We can review",
          items: [
            "Page loading performance",
            "Image optimization",
            "Caching",
            "Plugins",
            "Database",
            "Website resources",
            "Mobile performance",
            "Technical bottlenecks",
          ],
        },
        {
          label: "Optimization May Include",
          items: [
            "Image compression",
            "Cache configuration",
            "Plugin review",
            "Database cleanup",
            "Script optimization",
            "Basic technical improvements",
          ],
        },
      ],
      cta: "Improve My Website Speed",
    },
    {
      id: "website-content-updates",
      title: "Website Content Updates",
      subtitle: "Need a Small Change? We Can Handle It.",
      body: ["You shouldn't need a developer every time you need a small website update."],
      lists: [
        {
          label: "Depending on your maintenance package, we can assist with",
          items: [
            "Text changes",
            "Image replacement",
            "Contact information",
            "Service updates",
            "Blog updates",
            "Banner changes",
            "Basic page edits",
            "Menu updates",
            "Business information",
          ],
        },
      ],
      note: { text: "Larger design or development changes can be quoted separately." },
      cta: "Update My Website",
    },
    {
      id: "bug-fixes-technical-support",
      title: "Bug Fixes & Technical Support",
      subtitle: "When Something Breaks, We're Here to Help",
      body: ["Websites can develop technical issues after updates, plugin changes or configuration changes."],
      lists: [
        {
          label: "We can help troubleshoot",
          items: [
            "Broken pages",
            "Forms not working",
            "Plugin conflicts",
            "Theme issues",
            "Layout problems",
            "Website errors",
            "Broken links",
            "SSL issues",
            "Basic hosting-related issues",
          ],
        },
      ],
      priceLabel: "Starting From",
      price: "$50 per issue",
      priceNote: "Urgent or complex issues may require a custom quote.",
      cta: "Fix My Website",
    },
    {
      id: "e-commerce-website-maintenance",
      title: "E-Commerce Website Maintenance",
      subtitle: "Keep Your Online Store Ready for Customers",
      body: [
        "An e-commerce website requires additional attention because technical issues can directly affect sales.",
      ],
      lists: [
        {
          label: "We can monitor and maintain",
          items: [
            "Product pages",
            "Shopping cart",
            "Checkout",
            "Forms",
            "Payment-related functionality",
            "Product plugins",
            "Store plugins",
            "Database",
            "Website performance",
            "Security",
            "Backups",
          ],
        },
        {
          label: "Ideal For",
          items: ["WooCommerce stores", "Online retailers", "Product businesses", "Growing e-commerce brands"],
        },
      ],
      cta: "Maintain My Online Store",
    },
    {
      id: "website-monitoring",
      title: "Website Monitoring",
      subtitle: "Know When Something Needs Attention",
      body: ["Regular monitoring can help identify website issues before they become bigger problems."],
      lists: [
        {
          label: "Depending on your plan, monitoring can include",
          items: [
            "Website availability",
            "SSL status",
            "Important functionality",
            "Forms",
            "Performance indicators",
            "Security-related alerts",
            "Backup status",
          ],
        },
      ],
      note: { text: "When an issue is identified, we investigate and recommend the appropriate action." },
      cta: "Monitor My Website",
    },
  ],

  addOns: {
    heading: "Website Maintenance Add-ons",
    intro: "",
    columns: ["Add-on Service", "Starting Price"],
    items: SERVICE_ADDONS["Website Maintenance"],
  },

  why: {
    heading: "What Makes Our Website Maintenance Different?",
    items: [
      {
        title: "Proactive Maintenance",
        body: "We don't wait for every issue to become a major problem before addressing it.",
        proof: { kind: "process", step: 0 },
      },
      {
        title: "Security Conscious",
        body: "Regular updates and security checks help reduce common website risks.",
        proof: { kind: "addOn", name: "Security Hardening" },
      },
      {
        title: "Backup-Focused",
        body: "We consider backups an important part of ongoing website care.",
        proof: { kind: "addOn", name: "Backup Setup" },
      },
      {
        title: "Performance-Aware",
        body: "We monitor potential performance issues and identify optimization opportunities.",
        proof: { kind: "speed" },
        featured: true,
      },
      {
        title: "Business Continuity",
        body: "We understand that your website may be an important part of your business operations.",
        proof: { kind: "process", step: 9 },
      },
      {
        title: "Technical Support",
        body: "You have someone to contact when website-related problems occur.",
        proof: { kind: "addOn", name: "Emergency Bug Fix" },
      },
      {
        title: "Flexible Plans",
        body: "Choose a basic maintenance plan or a more comprehensive support arrangement.",
        proof: { kind: "pricing" },
      },
      {
        title: "Transparent Reporting",
        body: "You receive a clear summary of maintenance work and important observations.",
        proof: { kind: "process", step: 8 },
      },
    ],
  },

  process: {
    heading: "Website Maintenance Process",
    steps: [
      { title: "Website Audit", body: "We review your website, platform, hosting environment and current condition." },
      {
        title: "Maintenance Plan",
        body: "We identify the appropriate maintenance level based on your website and business requirements.",
      },
      { title: "Backup", body: "Before major maintenance work, available backup procedures are reviewed." },
      { title: "Updates", body: "We update supported CMS components, plugins, themes and other relevant software." },
      { title: "Security Check", body: "We review important security settings and identify potential issues." },
      { title: "Performance Check", body: "We review website performance and identify optimization opportunities." },
      { title: "Testing", body: "Important website functionality is checked after maintenance work." },
      { title: "Fixes", body: "Identified bugs and maintenance issues are addressed according to your package." },
      { title: "Report", body: "You receive a summary of completed maintenance and important findings." },
      {
        title: "Ongoing Support",
        body: "We continue monitoring and maintaining the website according to your selected plan.",
      },
    ],
  },

  investment: {
    heading: "How Much Does Website Maintenance Cost?",
    intro:
      "Website maintenance pricing depends on the platform, website size, number of plugins, traffic, e-commerce functionality, update frequency and level of technical support required.",
    label: "Typical Investment",
    unit: "/month",
    ranges: [
      { label: "Essential Maintenance", min: 100, max: 100, openEnded: true, display: "From $100/month", tier: "essential-maintenance" },
      { label: "Business Maintenance", min: 200, max: 200, openEnded: true, display: "From $200/month", tier: "business-maintenance" },
      { label: "Professional Maintenance", min: 350, max: 350, openEnded: true, display: "From $350/month", tier: "professional-maintenance" },
      { label: "E-Commerce Maintenance", min: 500, max: 500, openEnded: true, display: "From $500/month", tier: "e-commerce-maintenance" },
    ],
    note: "Custom Website Care: Custom Quote",
  },

  timeline: {
    heading: "How Long Does Website Maintenance Take?",
    paragraphs: [
      "Routine maintenance tasks are generally handled according to the maintenance schedule associated with your selected plan.",
      "Simple content changes and minor fixes may be completed within **1–2 business days**.",
      "More complex bugs, security issues, migrations or development work may require additional time depending on the issue.",
      "Emergency support is available through selected plans or as a separate service.",
    ],
  },

  faq: {
    heading: "Frequently Asked Questions",
    items: [
      {
        question: "What is website maintenance?",
        answer:
          "Website maintenance is the ongoing process of updating, monitoring, securing and improving a website to help keep it functional and reliable.",
      },
      {
        question: "Why does my website need maintenance?",
        answer:
          "Websites use software, plugins, themes, databases and other technologies that require regular updates and monitoring. Maintenance helps identify and address issues before they become larger problems.",
      },
      {
        question: "Do you maintain WordPress websites?",
        answer: "Yes. WordPress maintenance is one of our core website maintenance services.",
      },
      {
        question: "Do you maintain e-commerce websites?",
        answer: "Yes. We offer dedicated maintenance plans for supported e-commerce websites.",
      },
      {
        question: "Do you update WordPress plugins?",
        answer: "Yes. Plugin and theme updates can be included in WordPress maintenance packages.",
      },
      {
        question: "Will you take backups before updates?",
        answer:
          "Backup procedures depend on the hosting environment and selected maintenance setup. We recommend maintaining reliable backups before significant changes.",
      },
      {
        question: "Can you fix my broken website?",
        answer:
          "Yes. We can investigate and fix many common website issues. Complex development problems may require a separate quote.",
      },
      {
        question: "Can you update my website content?",
        answer: "Yes. Content updates can be included depending on your maintenance package.",
      },
      {
        question: "Can you improve website speed?",
        answer:
          "Yes. We can audit performance and implement appropriate optimization where the hosting and website structure allow it.",
      },
      {
        question: "Can you remove malware?",
        answer:
          "We can investigate and provide malware cleanup or recovery services where technically possible. Severe compromises may require specialized security work or website restoration.",
      },
      {
        question: "Do you provide emergency support?",
        answer:
          "Emergency support can be provided through selected plans or as a separate service, subject to availability and issue complexity.",
      },
      {
        question: "Will you guarantee my website will never go down?",
        answer:
          "No. Website uptime depends on hosting infrastructure, software, third-party services and other factors. Our role is to monitor, maintain and respond to issues within the agreed scope.",
      },
      {
        question: "Do you guarantee that my website will never be hacked?",
        answer:
          "No. No responsible maintenance provider can guarantee complete immunity from cyberattacks. Regular updates, backups and security practices can help reduce risk.",
      },
      {
        question: "Can I cancel maintenance anytime?",
        answer:
          "Maintenance terms depend on the selected plan and agreement. The cancellation and renewal terms will be provided before the service begins.",
      },
      {
        question: "Do you provide monthly reports?",
        answer: "Yes. Maintenance reports can summarize completed updates, checks, fixes and recommendations.",
      },
      {
        question: "Can you maintain a website developed by another company?",
        answer:
          "Yes. We can review the website first and, if the technology and access requirements are suitable, provide ongoing maintenance.",
      },
      {
        question: "Do you work with international clients?",
        answer: "Yes. SKY Tech works with businesses in Pakistan, the USA, the UK and beyond.",
      },
    ],
  },

  closing: {
    kicker: "Don't Wait for Your Website to Break",
    heading: "Keep Your Website Ready for Your Customers.",
    body: "Your website works for your business every day. Give it the maintenance and technical attention it needs.\n\nWhether you need basic WordPress updates, ongoing security and backups, e-commerce support or a complete website care plan, SKY Tech can help.",
    promise: "Updated. Secure. Supported. Ready to perform.",
    primaryCta: "Get a Maintenance Plan",
    secondaryCta: "Request a Website Audit",
  },
};
