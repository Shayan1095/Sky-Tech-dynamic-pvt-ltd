import { SERVICE_ADDONS } from "./addons";
import type { ServicePage } from "./types";

/* Transcribed verbatim from src/content/services/graphic-design.md.

   Resolved against the file:
   - The detailed package sections are the source; the summary table
     appended at the end (Logo Design, Brand Identity Package…) is not used,
     as on Web Development. Prices are US dollars, one-off.
   - The hero's and closing's secondary CTA "View Our Work" is omitted until
     a portfolio page exists; "Book a Free Consultation" stands in for it.
   - The eight specialist sections and "Design Deliverables" are the page's
     capabilities, shown as tabs. Print Design's "Deliverables" line is that
     tab's note.
   - "Tools We Use" is the technology band. Only Figma has a logo in the
     site's icon set; the Adobe marks and Canva show by name. */
export const GRAPHIC_DESIGN: ServicePage = {
  slug: "graphic-design",
  contactName: "Graphic Design",

  hero: {
    label: "Graphic Design Services",
    h1: "Designs That Make Your Brand Stand Out",
    accentWords: 4,
    subheadline:
      "We create professional, creative and brand-focused designs that help businesses communicate clearly, look consistent and make a stronger impression.",
    primaryCta: "Get a Free Design Quote",
    secondaryCta: "Book a Free Consultation",
    timeline: { label: "Simple designs", value: "1–3 business days" },
  },

  problem: {
    heading: "Design That Speaks for Your Brand",
    paragraphs: [
      "Your visual identity is often the first thing people notice about your business.",
      "A strong design can ==communicate professionalism==, ==build trust== and ==make your brand easier to remember==.",
      "At SKY Tech, we create purposeful graphic designs that combine creativity, clear communication and brand consistency.",
      "From social media creatives and marketing materials to presentations, packaging and complete brand identity systems, we help businesses create visuals that look professional and communicate effectively.",
    ],
  },

  offerings: {
    heading: "What We Offer",
    items: [
      {
        title: "Brand Identity Design",
        body: "Create a consistent visual identity with logos, colors, typography and brand guidelines.",
        fit: { tier: "complete-brand-identity" },
      },
      {
        title: "Logo Design",
        body: "Professional and memorable logos designed around your brand personality and business positioning.",
        fit: { addOn: "Logo Design" },
      },
      {
        title: "Social Media Design",
        body: "Scroll-stopping posts, carousels, stories, covers and promotional creatives for your social platforms.",
        fit: { addOn: "Additional Social Media Design" },
      },
      {
        title: "Marketing & Advertising Design",
        body: "Creative designs for digital campaigns, promotions, advertisements and marketing materials.",
        fit: { tier: "business-design" },
      },
      {
        title: "Brochure & Flyer Design",
        body: "Professional brochures, flyers and promotional materials designed for print or digital distribution.",
        fit: { addOn: "Brochure Design" },
      },
      {
        title: "Business Stationery",
        body: "Business cards, letterheads, envelopes, certificates and other branded stationery.",
        fit: { addOn: "Business Card Design" },
      },
      {
        title: "Presentation Design",
        body: "Professional PowerPoint, pitch deck and business presentation designs that communicate information clearly.",
        fit: { addOn: "Presentation Design" },
      },
      {
        title: "Packaging Design",
        body: "Creative packaging concepts designed to showcase products and strengthen brand recognition.",
        fit: { addOn: "Packaging Design" },
      },
      {
        title: "Infographic Design",
        body: "Turn complex information and data into clear, visually engaging graphics.",
        fit: { addOn: "Infographic Design" },
      },
      {
        title: "Banner & Poster Design",
        body: "Digital and print-ready banners, posters and promotional artwork.",
        fit: { addOn: "Banner Design" },
      },
      {
        title: "YouTube & Digital Content Design",
        body: "Thumbnails, channel graphics and visual assets designed to improve your digital content presentation.",
        fit: { addOn: "YouTube Thumbnail" },
      },
      {
        title: "Custom Graphic Design",
        body: "Have a unique design requirement? We can create a custom solution around your project.",
        fit: { tier: "custom-design-partnership" },
      },
    ],
  },

  packages: {
    heading: "Our Graphic Design Packages",
    priceLabel: "Starting From",
    tiers: [
      {
        id: "essential-design",
        name: "Essential Design",
        bestFor:
          "Small businesses and individuals who need professional designs for everyday business communication.",
        price: "$99",
        includes: [
          "Design consultation",
          "Up to 5 design assets",
          "Social media graphics",
          "Promotional creatives",
          "Basic brand styling",
          "Print / digital-ready files",
          "1 revision round",
        ],
        audience: { label: "Recommended For", text: "Startups, freelancers, small businesses and individuals." },
        cta: "Start My Design",
      },
      {
        id: "business-design",
        name: "Business Design",
        bestFor: "Growing businesses that need consistent and professional marketing visuals.",
        price: "$249",
        includes: [
          "Up to 10 design assets",
          "Custom graphic design",
          "Social media creatives",
          "Promotional designs",
          "Flyer / brochure design",
          "Basic presentation design",
          "Brand consistency",
          "Print & digital formats",
          "2 revision rounds",
        ],
        audience: {
          label: "Recommended For",
          text: "SMEs, service businesses, agencies, retailers and growing brands.",
        },
        cta: "Design for My Business",
      },
      {
        id: "professional-creative",
        name: "Professional Creative",
        bestFor: "Established brands that require a larger volume of polished and consistent creative assets.",
        price: "$499",
        includes: [
          "Up to 20 design assets",
          "Advanced graphic design",
          "Social media design",
          "Marketing creatives",
          "Carousels",
          "Promotional campaigns",
          "Presentation graphics",
          "Infographics",
          "Banner / poster designs",
          "Brand consistency",
          "Print & digital deliverables",
          "3 revision rounds",
        ],
        audience: {
          label: "Recommended For",
          text: "Established businesses, marketing campaigns, organizations and brands with ongoing design requirements.",
        },
        cta: "Upgrade My Design",
      },
      {
        id: "complete-brand-identity",
        name: "Complete Brand Identity",
        bestFor: "New businesses and brands that need a complete and consistent visual identity.",
        price: "$799",
        includes: [
          "Logo design",
          "Logo variations",
          "Color palette",
          "Typography selection",
          "Brand style",
          "Business card design",
          "Letterhead design",
          "Social media profile assets",
          "Social media templates",
          "Brand guidelines",
          "Marketing collateral",
          "Print & digital-ready files",
          "Multiple revision rounds",
        ],
        audience: {
          label: "Ideal For",
          text: "Startups, new businesses, rebranding projects and companies building a professional brand identity from the ground up.",
        },
        cta: "Build My Brand",
      },
      {
        id: "custom-design-partnership",
        name: "Custom Design Partnership",
        bestFor: "Businesses that require ongoing, high-volume or specialized graphic design support.",
        priceLabel: "Pricing",
        price: "Custom Quote",
        includesLabel: "Can Include",
        includes: [
          "Monthly design support",
          "Social media creatives",
          "Marketing campaigns",
          "Digital advertising creatives",
          "Presentation design",
          "Print materials",
          "Packaging",
          "Brand assets",
          "Event materials",
          "Infographics",
          "Custom illustrations",
          "Multiple design requests",
          "Dedicated design support",
        ],
        audience: {
          label: "Ideal For",
          text: "Agencies, e-commerce brands, established businesses, organizations and businesses with ongoing creative requirements.",
        },
        cta: "Request a Custom Plan",
      },
    ],
  },

  capabilities: [
    {
      id: "branding-visual-identity",
      title: "Branding & Visual Identity",
      subtitle: "Build a Brand People Remember",
      body: [
        "A logo is only one part of your brand.",
        "We help businesses create a consistent visual identity that can be applied across digital and physical touchpoints.",
      ],
      listLabel: "Branding Services Include",
      list: [
        "Logo design",
        "Logo variations",
        "Color palette",
        "Typography",
        "Brand guidelines",
        "Business cards",
        "Letterheads",
        "Social media assets",
        "Presentation templates",
        "Marketing collateral",
        "Brand templates",
      ],
      priceLabel: "Starting From",
      price: "$299",
      priceNote: "Complete brand identity projects are quoted according to scope.",
      cta: "Start My Branding Project",
    },
    {
      id: "social-media-graphic-design",
      title: "Social Media Graphic Design",
      subtitle: "Make Every Post Look Like Your Brand",
      body: [
        "Your social media should have a recognizable visual language.",
        "We create branded content that keeps your social presence professional and consistent.",
      ],
      listLabel: "We Design",
      list: [
        "Social media posts",
        "Instagram carousels",
        "Stories",
        "Facebook creatives",
        "LinkedIn graphics",
        "Promotional posts",
        "Offer graphics",
        "Event announcements",
        "Quote posts",
        "Educational graphics",
        "Infographics",
        "Social media covers",
      ],
      priceLabel: "Starting From",
      price: "$15/design",
      priceNote:
        "Monthly social media design packages are available for businesses requiring regular creative content.",
      cta: "Get Social Media Designs",
    },
    {
      id: "marketing-advertising-design",
      title: "Marketing & Advertising Design",
      subtitle: "Creative That Supports Your Campaigns",
      body: [
        "Good advertising design should communicate the message quickly and make the audience want to take action.",
      ],
      listLabel: "We create visual assets for",
      list: [
        "Digital advertisements",
        "Social media campaigns",
        "Promotional campaigns",
        "Sales & offers",
        "Product launches",
        "Event promotions",
        "Website banners",
        "Email marketing",
        "Print advertising",
        "Display advertising",
      ],
      priceLabel: "Starting From",
      price: "$25/design",
      cta: "Design My Campaign",
    },
    {
      id: "print-design",
      title: "Print Design",
      subtitle: "From Screen to Print",
      body: ["We create print-ready artwork for businesses and organizations."],
      listLabel: "Print Materials",
      list: [
        "Business cards",
        "Flyers",
        "Brochures",
        "Posters",
        "Banners",
        "Certificates",
        "Letterheads",
        "Envelopes",
        "Menus",
        "Invitations",
        "Catalogues",
        "Company profiles",
      ],
      note: {
        label: "Deliverables",
        text: "Files can be prepared according to the requirements of your printer or printing vendor.",
      },
      cta: "Prepare My Print Design",
    },
    {
      id: "presentation-design",
      title: "Presentation Design",
      subtitle: "Turn Information Into a Better Story",
      body: [
        "A professional presentation shouldn't overwhelm the audience with text.",
        "We transform information into clean, structured and visually engaging presentations.",
      ],
      lists: [
        {
          label: "We Design",
          items: [
            "Business presentations",
            "Company profiles",
            "Pitch decks",
            "Sales presentations",
            "Investor decks",
            "Training presentations",
            "Proposal decks",
            "Reports",
            "Corporate presentations",
          ],
        },
        {
          label: "Includes",
          items: [
            "Slide layouts",
            "Visual hierarchy",
            "Charts & graphs",
            "Infographics",
            "Icons",
            "Brand integration",
            "Professional formatting",
          ],
        },
      ],
      priceLabel: "Starting From",
      price: "$15/slide",
      cta: "Design My Presentation",
    },
    {
      id: "packaging-design",
      title: "Packaging Design",
      subtitle: "Make Your Product Stand Out on the Shelf",
      body: [
        "Packaging is often the first physical interaction customers have with a product.",
        "We create packaging concepts that balance brand identity, product information and visual appeal.",
      ],
      listLabel: "We Can Design",
      list: [
        "Product boxes",
        "Labels",
        "Pouches",
        "Bottles",
        "Jars",
        "Food packaging",
        "Cosmetic packaging",
        "Retail packaging",
        "Product inserts",
      ],
      priceLabel: "Starting From",
      price: "$100",
      priceNote: "Final pricing depends on the packaging format, number of variants and production requirements.",
      cta: "Design My Packaging",
    },
    {
      id: "infographic-design",
      title: "Infographic Design",
      subtitle: "Make Complex Information Easy to Understand",
      body: ["Infographics can turn complicated information into something people can understand quickly."],
      listLabel: "We design",
      list: [
        "Business infographics",
        "Process diagrams",
        "Statistics",
        "Data visualizations",
        "Educational graphics",
        "Timeline graphics",
        "Comparison graphics",
        "Step-by-step visuals",
      ],
      priceLabel: "Starting From",
      price: "$50",
      cta: "Create My Infographic",
    },
    {
      id: "digital-content-design",
      title: "Digital Content Design",
      subtitle: "Graphics Built for the Digital World",
      body: ["We create visual assets for websites, social media, video platforms and digital campaigns."],
      listLabel: "We Can Create",
      list: [
        "Website banners",
        "Blog graphics",
        "YouTube thumbnails",
        "Channel artwork",
        "Email graphics",
        "Digital ads",
        "App promotional graphics",
        "Online campaign assets",
        "Website illustrations",
      ],
    },
    {
      id: "design-deliverables",
      title: "Design Deliverables",
      subtitle: "Depending on your project, you can receive",
      body: [],
      lists: [
        { label: "Digital Files", items: ["PNG", "JPG", "PDF", "SVG", "Web-ready assets"] },
        { label: "Source Files", items: ["AI", "PSD", "Figma", "Editable design files where applicable"] },
        {
          label: "Print-Ready Files",
          items: ["CMYK artwork", "High-resolution PDF", "Bleed & crop marks where required", "Printer-ready layouts"],
        },
      ],
    },
  ],

  addOns: {
    heading: "Graphic Design Add-ons",
    intro: "",
    columns: ["Add-on Service", "Starting Price"],
    items: SERVICE_ADDONS["Graphic Design"],
  },

  technology: {
    heading: "Tools We Use",
    intro: "We select the appropriate tool based on the project and final deliverables.",
    groups: [
      {
        label: "Design Tools",
        items: ["Adobe Photoshop", "Adobe Illustrator", "Adobe InDesign", "Figma", "Canva"],
      },
    ],
  },

  why: {
    heading: "What Makes Our Graphic Design Different?",
    items: [
      {
        title: "Design With Purpose",
        body: "We don't design simply to make something look attractive. Every design has a communication objective.",
        proof: { kind: "process", step: 0 },
        featured: true,
      },
      {
        title: "Brand Consistency",
        body: "We make sure your visual content looks like it belongs to the same brand.",
        proof: { kind: "drawing", drawing: "custom" },
      },
      {
        title: "Creative + Strategic",
        body: "We combine creative thinking with an understanding of your audience and business goals.",
        proof: { kind: "process", step: 2 },
      },
      {
        title: "Professional Execution",
        body: "From typography and spacing to hierarchy and file preparation, we focus on the details.",
        proof: { kind: "process", step: 6 },
      },
      {
        title: "Digital + Print",
        body: "We can prepare artwork for both online platforms and professional printing.",
        proof: { kind: "drawing", drawing: "responsive" },
      },
      {
        title: "Flexible",
        body: "From a single social media post to a complete brand identity, we can work according to your needs.",
        proof: { kind: "pricing" },
        featured: true,
      },
      {
        title: "Business-Focused",
        body: "Our goal is to create visuals that help you communicate, promote and build trust.",
        proof: { kind: "addOn", name: "Brand Guidelines" },
      },
    ],
  },

  process: {
    heading: "Our Graphic Design Process",
    steps: [
      {
        title: "Brief",
        body: "We understand your business, audience, design objective and required deliverables.",
      },
      {
        title: "Research",
        body: "We review your brand, competitors, industry and relevant visual references.",
      },
      { title: "Concept", body: "We develop creative directions based on your requirements." },
      {
        title: "Design",
        body: "Our designers create the initial concepts and develop the selected direction.",
      },
      {
        title: "Review",
        body: "You review the design and provide feedback according to the agreed revision scope.",
      },
      {
        title: "Refine",
        body: "We make the required refinements while maintaining the original creative direction.",
      },
      { title: "Finalize", body: "We prepare the final artwork in the required formats." },
      {
        title: "Deliver",
        body: "You receive the final files ready for digital use, printing or further production.",
      },
    ],
  },

  investment: {
    heading: "How Much Does Graphic Design Cost?",
    intro:
      "Graphic design pricing depends on the type of design, number of assets, complexity, level of customization and required deliverables.",
    label: "Typical Investment",
    ranges: [
      { label: "Essential Design", min: 99, max: 99, openEnded: true, display: "From $99", tier: "essential-design" },
      { label: "Business Design", min: 249, max: 249, openEnded: true, display: "From $249", tier: "business-design" },
      { label: "Professional Creative", min: 499, max: 499, openEnded: true, display: "From $499", tier: "professional-creative" },
      { label: "Complete Brand Identity", min: 799, max: 799, openEnded: true, display: "From $799", tier: "complete-brand-identity" },
    ],
    note: "Custom Design Partnership: Custom Quote",
    important: {
      text: "Individual designs can also be ordered separately based on your requirements.",
    },
  },

  timeline: {
    heading: "How Long Does Graphic Design Take?",
    paragraphs: [
      "Simple designs such as social media graphics, banners and promotional posts can typically be completed within **1–3 business days**.",
      "Brochures, presentations, packaging and larger design projects may take **3–7+ business days**, depending on complexity and feedback.",
      "Brand identity projects may take **1–3 weeks** depending on scope and revision requirements.",
      "Final timelines are confirmed before the project begins.",
    ],
  },

  faq: {
    heading: "Frequently Asked Questions",
    items: [
      {
        question: "What types of graphic design do you provide?",
        answer:
          "We provide branding, logo design, social media graphics, marketing materials, presentations, packaging, infographics, print design, banners and custom graphic design.",
      },
      {
        question: "Can you design a complete brand identity?",
        answer:
          "Yes. Our complete brand identity service can include logo design, colors, typography, brand guidelines, stationery and social media assets.",
      },
      {
        question: "Do you design social media posts?",
        answer:
          "Yes. We create branded posts, carousels, stories, promotional graphics, educational content and other social media assets.",
      },
      {
        question: "Can you design print materials?",
        answer:
          "Yes. We create print-ready business cards, flyers, brochures, posters, banners, menus, certificates and other materials.",
      },
      {
        question: "Do you provide editable source files?",
        answer: "Yes. Source files can be included depending on the project and agreed deliverables.",
      },
      {
        question: "Can you follow our existing brand guidelines?",
        answer:
          "Yes. If you already have brand guidelines, we can use them to maintain visual consistency across your designs.",
      },
      {
        question: "Can you create designs from an existing reference?",
        answer:
          "Yes. You can provide visual references, examples or inspiration, and we can develop an original design direction based on your requirements.",
      },
      {
        question: "Do you design presentations?",
        answer:
          "Yes. We design business presentations, pitch decks, company profiles, proposals, reports and other professional presentations.",
      },
      {
        question: "Do you design packaging?",
        answer:
          "Yes. We can design packaging for products including boxes, labels, pouches, bottles, jars and other formats.",
      },
      {
        question: "Can you create monthly design content?",
        answer:
          "Yes. We offer ongoing design support and custom monthly creative arrangements for businesses that require regular design work.",
      },
      {
        question: "How many revisions are included?",
        answer:
          "The number of revisions depends on the selected package. The exact revision scope will be mentioned in your proposal.",
      },
      {
        question: "Can you redesign existing artwork?",
        answer:
          "Yes. We can improve or redesign existing artwork depending on the condition of the original files and your requirements.",
      },
      {
        question: "Do you work with international clients?",
        answer: "Yes. SKY Tech works with businesses in Pakistan, the USA, the UK and beyond.",
      },
    ],
  },

  closing: {
    kicker: "Ready to Give Your Brand a Better Look?",
    heading: "Let's Create Designs That Get Noticed.",
    body: "Whether you need a single creative, a complete marketing campaign or an entire brand identity, SKY Tech can help turn your ideas into professional visual communication.",
    promise: "Creative thinking. Consistent branding. Professional design. Built around your business.",
    primaryCta: "Get a Free Design Quote",
    secondaryCta: "Book a Free Consultation",
  },
};
