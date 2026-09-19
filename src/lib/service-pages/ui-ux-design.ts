import { SERVICE_ADDONS } from "./addons";
import type { ServicePage } from "./types";

/* Transcribed verbatim from src/content/services/ui-ux-design.md.

   Resolved against the file:
   - The detailed package sections are the source; the summary pricing table
     appended at the end (Website Redesign, Mobile App UI…) is not used, as
     on Web Development. Prices are US dollars.
   - The hero's secondary CTA "View Our Work" is omitted until a portfolio
     page exists; "Book a Free Consultation" stands in for it, as on the
     other service pages.
   - The four specialism sections (Website, Mobile App, Web Application &
     Dashboard, UX Audit & Redesign) and "UI/UX Design Deliverables" are the
     page's capabilities, shown as tabs in one band.
   - "Tools & Technologies" names no brand logos yet (Figma and Adobe marks
     would need to be added), so its groups show as labelled lists.
   - "Typical Investment" gives starting prices only, so each bar in the
     cost chart starts at its price and runs on open-ended. */
export const UI_UX_DESIGN: ServicePage = {
  slug: "ui-ux-design",
  contactName: "UI/UX Design",

  hero: {
    label: "UI/UX Design Services",
    h1: "Designs That Look Good. Experiences That Work.",
    accentWords: 3,
    subheadline:
      "We design intuitive, modern and user-focused digital experiences for websites, mobile apps and digital products — combining strategy, usability and visual design.",
    primaryCta: "Get a Free Design Consultation",
    secondaryCta: "Book a Free Consultation",
    timeline: { label: "Simple website or landing page", value: "1–2 weeks" },
  },

  problem: {
    heading: "Great Design Is More Than Just Good Looks",
    paragraphs: [
      "A beautiful interface isn't necessarily a good user experience.",
      "Your users need to understand where to go, what to do and why they should take action — without ~~confusion~~.",
      "At SKY Tech, we combine ==user experience strategy==, ==interface design== and ==business objectives== to create digital products that are easy to use, visually engaging and built around real user needs.",
      "From a business website to a complex web application or mobile app, we design experiences that make digital products easier to understand and easier to use.",
    ],
  },

  offerings: {
    heading: "What We Offer",
    items: [
      {
        title: "UI/UX Strategy",
        body: "Define the structure, user journey and design direction before moving into detailed interface design.",
        fit: { tier: "ui-ux-professional" },
      },
      {
        title: "User Research",
        body: "Understand your target users, their needs, behaviours and pain points to inform better design decisions.",
        fit: { tier: "ui-ux-advanced" },
      },
      {
        title: "Information Architecture",
        body: "Organize content, features and navigation so users can find what they need quickly.",
        fit: { tier: "ui-ux-professional" },
      },
      {
        title: "User Flow Design",
        body: "Map the steps users take to complete important actions within your website or application.",
        fit: { addOn: "User Flow" },
      },
      {
        title: "Wireframing",
        body: "Create low-fidelity layouts to establish structure, hierarchy and functionality before visual design.",
        fit: { addOn: "Wireframing" },
      },
      {
        title: "UI Design",
        body: "Create polished, modern interfaces aligned with your brand identity and product goals.",
        fit: { tier: "ui-starter" },
      },
      {
        title: "Website UI/UX",
        body: "Design responsive website experiences focused on usability, clarity and conversion.",
        fit: { tier: "ui-ux-professional" },
      },
      {
        title: "Mobile App UI/UX",
        body: "Design intuitive interfaces and user journeys for iOS and Android applications.",
        fit: { tier: "product-design" },
      },
      {
        title: "Web Application Design",
        body: "Design complex dashboards, portals and web applications with clear workflows and scalable interfaces.",
        fit: { tier: "ui-ux-advanced" },
      },
      {
        title: "Design Systems",
        body: "Create reusable components, styles and guidelines to maintain consistency across digital products.",
        fit: { addOn: "Design System" },
      },
      {
        title: "Interactive Prototyping",
        body: "Build clickable prototypes that allow teams and stakeholders to experience the product before development.",
        fit: { addOn: "Interactive Prototype" },
      },
      {
        title: "UX Audit",
        body: "Review an existing website or application to identify usability issues, friction points and opportunities for improvement.",
        fit: { addOn: "UX Audit" },
      },
    ],
  },

  packages: {
    heading: "Our UI/UX Design Packages",
    priceLabel: "Starting From",
    tiers: [
      {
        id: "ui-starter",
        name: "UI Starter",
        bestFor: "Small websites, landing pages and businesses that need a clean and professional interface.",
        price: "$200",
        includes: [
          "Design consultation",
          "Basic user flow",
          "Up to 5 key screens/pages",
          "Responsive desktop design",
          "Mobile adaptation",
          "Typography & color selection",
          "Basic UI components",
          "Figma design file",
          "Basic prototype",
          "1 revision round",
        ],
        audience: {
          label: "Recommended For",
          text: "Landing pages, small business websites, personal brands and simple digital products.",
        },
        cta: "Start My Design",
      },
      {
        id: "ui-ux-professional",
        name: "UI/UX Professional",
        bestFor:
          "Businesses and startups that need a complete website or application interface with a structured user experience.",
        price: "$400",
        includes: [
          "UX strategy",
          "User flow",
          "Information architecture",
          "Wireframes",
          "Up to 10 key screens/pages",
          "Desktop & mobile UI",
          "Custom visual design",
          "Interactive prototype",
          "UI component library",
          "Responsive design",
          "Developer-ready Figma files",
          "2 revision rounds",
        ],
        audience: {
          label: "Recommended For",
          text: "Business websites, SaaS products, startup websites, web portals and medium-sized digital products.",
        },
        cta: "Design My Product",
      },
      {
        id: "ui-ux-advanced",
        name: "UI/UX Advanced",
        bestFor:
          "Complex websites, web applications and digital products that require deeper UX planning and a scalable design system.",
        price: "$800",
        includes: [
          "UX research",
          "User personas",
          "Customer/user journeys",
          "Information architecture",
          "Detailed user flows",
          "Wireframes",
          "15+ screens",
          "Desktop, tablet & mobile design",
          "Advanced UI design",
          "Interactive prototype",
          "Design system",
          "Component library",
          "UX validation",
          "Developer handoff",
          "3 revision rounds",
        ],
        audience: {
          label: "Recommended For",
          text: "SaaS platforms, web applications, dashboards, marketplaces and complex digital products.",
        },
        cta: "Build My UX",
      },
      {
        id: "product-design",
        name: "Product Design",
        bestFor: "Startups and businesses building a complete digital product from concept to developer-ready design.",
        price: "$1,500",
        includes: [
          "Product discovery",
          "UX research",
          "User personas",
          "User journeys",
          "Information architecture",
          "Complete user flows",
          "Wireframes",
          "High-fidelity UI",
          "Mobile / web product design",
          "Interactive prototypes",
          "Design system",
          "Component library",
          "UX testing",
          "Developer handoff",
          "Design documentation",
          "Ongoing design support",
        ],
        audience: {
          label: "Ideal For",
          text: "SaaS platforms, startups, marketplaces, mobile applications, web applications and custom digital products.",
        },
        cta: "Start My Product Design",
      },
    ],
  },

  capabilities: [
    {
      id: "website-ui-ux-design",
      title: "Website UI/UX Design",
      subtitle: "Turn Your Website Into a Better User Experience",
      body: [
        "Your website should do more than look professional.",
        "It should guide visitors toward the information and actions that matter.",
      ],
      lists: [
        {
          label: "We Design",
          items: [
            "Corporate websites",
            "Business websites",
            "Landing pages",
            "E-commerce websites",
            "Portfolio websites",
            "SaaS websites",
            "Startup websites",
            "Service websites",
            "Conversion-focused pages",
          ],
        },
        {
          label: "Our Focus",
          items: [
            "Clear navigation",
            "Strong visual hierarchy",
            "Responsive layouts",
            "Conversion-focused sections",
            "Accessible design",
            "Consistent branding",
            "Intuitive user journeys",
          ],
        },
      ],
      cta: "Redesign My Website",
    },
    {
      id: "mobile-app-ui-ux-design",
      title: "Mobile App UI/UX Design",
      subtitle: "Create Apps Users Actually Enjoy Using",
      body: [
        "Mobile users expect digital products to be fast, intuitive and easy to navigate.",
        "We design mobile experiences with usability and consistency at the centre.",
      ],
      lists: [
        {
          label: "We Can Design",
          items: [
            "iOS applications",
            "Android applications",
            "Cross-platform apps",
            "Customer apps",
            "Business applications",
            "E-commerce apps",
            "Booking apps",
            "SaaS applications",
          ],
        },
        {
          label: "Deliverables",
          items: [
            "User flows",
            "Wireframes",
            "High-fidelity screens",
            "Interactive prototypes",
            "Design system",
            "UI components",
            "Developer handoff",
          ],
        },
      ],
      cta: "Design My Mobile App",
    },
    {
      id: "web-application-dashboard-design",
      title: "Web Application & Dashboard Design",
      subtitle: "Make Complex Systems Feel Simple",
      body: [
        "Dashboards and web applications can become overwhelming when information and functionality aren't structured properly.",
        "We simplify complex interfaces through thoughtful information architecture and clear user flows.",
      ],
      lists: [
        {
          label: "We Design",
          items: [
            "Admin dashboards",
            "CRM interfaces",
            "ERP dashboards",
            "SaaS platforms",
            "Customer portals",
            "Booking systems",
            "Analytics dashboards",
            "Management systems",
          ],
        },
        {
          label: "We Focus On",
          items: [
            "Navigation",
            "Data hierarchy",
            "User workflows",
            "Tables & filters",
            "Forms",
            "Search",
            "Notifications",
            "Dashboards",
            "Responsive layouts",
          ],
        },
      ],
      cta: "Design My Web App",
    },
    {
      id: "ux-audit-redesign",
      title: "UX Audit & Redesign",
      subtitle: "Find Out Why Users Are Getting Stuck",
      body: [
        "Already have a website or app?",
        "You don't always need to redesign everything.",
        "We can audit your existing product to identify usability problems and opportunities for improvement.",
      ],
      listLabel: "UX Audit Can Include",
      list: [
        "Navigation review",
        "User-flow analysis",
        "Content hierarchy",
        "Mobile usability",
        "Conversion journey",
        "Form usability",
        "Accessibility review",
        "Visual consistency",
        "Interaction analysis",
        "Competitor comparison",
      ],
      priceLabel: "Starting From",
      price: "$200",
      priceNote: "After the audit, you'll receive actionable recommendations for improving the user experience.",
      cta: "Request a UX Audit",
    },
    {
      id: "ui-ux-design-deliverables",
      title: "UI/UX Design Deliverables",
      subtitle: "Depending on your project, we can provide",
      body: [],
      lists: [
        {
          label: "UX Deliverables",
          items: [
            "User research",
            "Personas",
            "User journeys",
            "Information architecture",
            "User flows",
            "Wireframes",
            "UX audit",
            "Usability recommendations",
          ],
        },
        {
          label: "UI Deliverables",
          items: [
            "High-fidelity designs",
            "Responsive layouts",
            "Mobile interfaces",
            "Design systems",
            "Component libraries",
            "Icons & UI elements",
            "Visual guidelines",
          ],
        },
        {
          label: "Prototype Deliverables",
          items: [
            "Interactive prototypes",
            "Clickable user flows",
            "Product demonstrations",
            "Stakeholder review prototypes",
          ],
        },
        {
          label: "Development Handoff",
          items: [
            "Organized Figma files",
            "Design specifications",
            "Components",
            "Assets",
            "Responsive guidelines",
            "Developer handoff documentation",
          ],
        },
      ],
    },
  ],

  addOns: {
    heading: "UI/UX Design Add-ons",
    intro: "",
    columns: ["Add-on Service", "Starting Price"],
    items: SERVICE_ADDONS["UI/UX Design"],
  },

  technology: {
    heading: "Tools & Technologies",
    intro: "",
    groups: [
      { label: "Primary Design Tool", items: ["Figma"] },
      { label: "Supporting Tools", items: ["Adobe Photoshop", "Adobe Illustrator", "FigJam"] },
      {
        label: "Design Approach",
        items: ["Responsive Design", "Component-Based Design", "Design Systems", "User-Centered Design"],
      },
    ],
  },

  why: {
    heading: "What Makes Our UI/UX Design Different?",
    items: [
      {
        title: "User Before Decoration",
        body: "We don't start with colors and fancy effects. We start with what the user needs to accomplish.",
        proof: { kind: "process", step: 1 },
        featured: true,
      },
      {
        title: "Business + User Goals",
        body: "A good design should work for both the user and the business.",
        proof: { kind: "process", step: 0 },
      },
      {
        title: "Simple Over Complicated",
        body: "We aim to remove unnecessary friction and make interfaces easier to understand.",
        proof: { kind: "drawing", drawing: "structure" },
      },
      {
        title: "Consistency Matters",
        body: "Reusable components and design systems help maintain a consistent experience across the product.",
        proof: { kind: "addOn", name: "Design System" },
      },
      {
        title: "Designed for Development",
        body: "Our files are organized with developer handoff in mind.",
        proof: { kind: "addOn", name: "Developer Handoff" },
      },
      {
        title: "Responsive by Default",
        body: "Interfaces are designed with different screen sizes and devices in mind.",
        proof: { kind: "drawing", drawing: "responsive" },
        featured: true,
      },
      {
        title: "Design With Purpose",
        body: "Every section, component and interaction should have a reason to exist.",
        proof: { kind: "process", step: 3 },
      },
    ],
  },

  process: {
    heading: "Our UI/UX Design Process",
    steps: [
      { title: "Discover", body: "We understand your business, users, product goals and project requirements." },
      { title: "Research", body: "We analyze users, competitors and existing experiences where research is required." },
      { title: "Structure", body: "We define information architecture, user flows and the overall product structure." },
      {
        title: "Wireframe",
        body: "We create wireframes to validate the layout and functionality before investing in detailed visual design.",
      },
      { title: "Design", body: "We transform approved structures into polished, high-fidelity interfaces." },
      {
        title: "Prototype",
        body: "We connect screens into interactive prototypes so the experience can be tested and reviewed.",
      },
      { title: "Validate", body: "We review usability, consistency, responsiveness and key user journeys." },
      { title: "Handoff", body: "We organize the design files, components and specifications for the development team." },
      {
        title: "Support",
        body: "We can collaborate with developers during implementation to ensure the final product matches the approved design.",
      },
    ],
  },

  investment: {
    heading: "How Much Does UI/UX Design Cost?",
    intro:
      "UI/UX design pricing depends on the number of screens, complexity of the product, research requirements, prototype depth and level of customization.",
    label: "Typical Investment",
    ranges: [
      { label: "UI Starter", min: 200, max: 200, openEnded: true, display: "From $200", tier: "ui-starter" },
      { label: "UI/UX Professional", min: 400, max: 400, openEnded: true, display: "From $400", tier: "ui-ux-professional" },
      { label: "UI/UX Advanced", min: 800, max: 800, openEnded: true, display: "From $800", tier: "ui-ux-advanced" },
      { label: "Product Design", min: 1500, max: 1500, openEnded: true, display: "From $1,500", tier: "product-design" },
      { label: "UX Audit", min: 200, max: 200, openEnded: true, display: "From $200" },
    ],
    note: "For complex applications and larger products, we provide a custom quotation based on the complete project scope.",
  },

  timeline: {
    heading: "How Long Does UI/UX Design Take?",
    paragraphs: [
      "A simple website or landing page design can typically take **1–2 weeks**.",
      "A complete business website or medium-sized digital product can take approximately **2–4 weeks**.",
      "Complex web applications, SaaS products and mobile applications may take **4–8+ weeks**, depending on the number of screens, research requirements, feedback cycles and project complexity.",
    ],
  },

  faq: {
    heading: "Frequently Asked Questions",
    items: [
      {
        question: "What is the difference between UI and UX?",
        answer:
          "**UX (User Experience)** focuses on how a product works and how users move through it.\n\n**UI (User Interface)** focuses on how the product looks and how users interact with its visual interface.\n\nWe combine both to create complete digital experiences.",
      },
      {
        question: "Do you design websites as well as apps?",
        answer:
          "Yes. We design websites, mobile applications, dashboards, SaaS products, portals and other digital interfaces.",
      },
      { question: "Do you use Figma?", answer: "Yes. Figma is our primary design and prototyping tool." },
      {
        question: "Will I receive the Figma source files?",
        answer:
          "Yes. Final deliverables can include organized Figma files depending on the selected package and project scope.",
      },
      {
        question: "Do you provide prototypes?",
        answer:
          "Yes. Interactive prototypes can be included to demonstrate user flows and interactions before development.",
      },
      {
        question: "Can you redesign my existing website or app?",
        answer:
          "Yes. We can audit your existing experience, identify usability issues and redesign selected sections or the complete product.",
      },
      {
        question: "Do you provide UX research?",
        answer:
          "Yes. User research, personas, journeys and usability analysis can be included depending on the project requirements.",
      },
      {
        question: "Can you create a design system?",
        answer:
          "Yes. We can create reusable components, styles and guidelines to maintain consistency across larger products.",
      },
      {
        question: "Do you work with developers?",
        answer:
          "Yes. We can provide organized design files and developer handoff documentation, and collaborate during implementation when required.",
      },
      {
        question: "Can you design responsive websites?",
        answer: "Yes. Responsive design for desktop, tablet and mobile is part of our website UI/UX process.",
      },
      {
        question: "Do you provide development after UI/UX design?",
        answer:
          "Yes. If required, the approved UI/UX designs can move into website or application development through our development services.",
      },
      {
        question: "How many revisions are included?",
        answer:
          "Revision rounds depend on the selected package. The exact number will be clearly mentioned in your project proposal.",
      },
      {
        question: "Do you work with international clients?",
        answer: "Yes. SKY Tech works with businesses in Pakistan, the USA, the UK and beyond.",
      },
    ],
  },

  closing: {
    kicker: "Ready to Create a Better Digital Experience?",
    heading: "Let's Design Something People Love to Use.",
    body: "Whether you're launching a new website, building an app or improving an existing digital product, SKY Tech can help turn your ideas into intuitive, modern and developer-ready designs.",
    promise: "Research. Strategy. UX. UI. Prototyping. — Everything your digital product needs to create a better experience.",
    primaryCta: "Get a Free Design Consultation",
    secondaryCta: "Book a Free Consultation",
  },
};
