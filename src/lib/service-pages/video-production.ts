import { SERVICE_ADDONS } from "./addons";
import type { ServicePage } from "./types";

/* Transcribed verbatim from src/content/services/video-production.md.

   Resolved against the file:
   - The detailed package sections are the source (Basic, Standard, Premium
     Editing and Custom Video Production). The summary table appended at the
     end (Short-Form Content $299/video…) is not used, as on Web
     Development.
   - "Monthly Video Content Packages" (Content Starter, Growth, Pro) are shown
     as plans in their own tab, each requestable directly.
   - The hero's secondary CTA "View Our Work" is omitted until a portfolio
     page exists; "Book a Free Consultation" stands in for it.
   - The specialist sections, "What We Can Work With", "Video Editing
     Services", "Video Formats We Deliver" and the monthly packages are the
     page's capabilities, shown as tabs.
   - The content gives no delivery timeframe and names no tools, so the page
     has no timeline figure and no technology band. */
export const VIDEO_PRODUCTION: ServicePage = {
  slug: "video-production",
  contactName: "Video Editing & Production",

  hero: {
    label: "Video Editing & Production Services",
    h1: "Video Content That Captures Attention & Builds Trust",
    accentWords: 4,
    subheadline:
      "We turn raw footage and ideas into engaging, professional video content designed to tell your story, showcase your brand and keep your audience watching.",
    primaryCta: "Get a Free Video Quote",
    secondaryCta: "Book a Free Consultation",
  },

  problem: {
    heading: "Your Brand Deserves Better Video Content",
    paragraphs: [
      "People scroll fast.",
      "You have only a few seconds to ==capture attention==, ==communicate your message== and ==make someone want to keep watching==.",
      "At SKY Tech, we transform raw footage, product ideas and creative concepts into polished video content that looks professional and communicates clearly.",
      "From short-form reels and social media videos to promotional campaigns, product demonstrations and corporate videos, we create content around your brand and business goals.",
    ],
  },

  offerings: {
    heading: "What We Offer",
    items: [
      {
        title: "Video Editing",
        body: "Transform raw footage into polished, engaging videos with professional cuts, transitions, audio and visual enhancements.",
        fit: { tier: "standard-editing" },
      },
      {
        title: "Reels & Short-Form Videos",
        body: "Create attention-grabbing short videos for Instagram, Facebook, TikTok, YouTube Shorts and other platforms.",
        fit: { tier: "basic-editing" },
      },
      {
        title: "Promotional Videos",
        body: "Showcase your business, products, services, campaigns or offers through compelling promotional content.",
        fit: { tier: "standard-editing" },
      },
      {
        title: "Corporate Videos",
        body: "Professional company videos that communicate your brand, team, services and story.",
        fit: { tier: "premium-editing" },
      },
      {
        title: "Product Videos",
        body: "Demonstrate your product's features, benefits and use cases through engaging visual content.",
        fit: { tier: "standard-editing" },
      },
      {
        title: "Explainer Videos",
        body: "Simplify complex products, services or ideas through clear and engaging video storytelling.",
        fit: { tier: "custom-video-production" },
      },
      {
        title: "Motion Graphics",
        body: "Add animated text, graphics, icons and visual elements to make your videos more engaging.",
        fit: { addOn: "Motion Graphics" },
      },
      {
        title: "Event Videos",
        body: "Turn event footage into professional highlights, recap videos and social-ready content.",
        fit: { tier: "standard-editing" },
      },
      {
        title: "Video Ads",
        body: "Create short, focused video advertisements designed for social media and digital advertising campaigns.",
        fit: { tier: "basic-editing" },
      },
      {
        title: "YouTube Videos",
        body: "Edit long-form YouTube content with clean cuts, graphics, captions, sound enhancement and engaging pacing.",
        fit: { tier: "standard-editing" },
      },
    ],
  },

  packages: {
    heading: "Our Video Editing Packages",
    priceLabel: "Starting From",
    tiers: [
      {
        id: "basic-editing",
        name: "Basic Editing",
        bestFor: "Simple social media videos, personal content and short clips that need clean professional editing.",
        price: "$25/video",
        includes: [
          "Up to 1-minute video",
          "Cutting & trimming",
          "Basic transitions",
          "Basic effects",
          "Background music",
          "Basic audio cleanup",
          "Basic text",
          "Standard HD export",
        ],
        audience: {
          label: "Recommended For",
          text: "Simple reels, short clips, announcements and basic social media content.",
        },
        cta: "Edit My Video",
      },
      {
        id: "standard-editing",
        name: "Standard Editing",
        bestFor: "Businesses and creators looking for polished, engaging videos with professional visual elements.",
        price: "$99/video",
        includes: [
          "2–5 minute video",
          "Professional cuts & transitions",
          "Motion graphics",
          "Text animation",
          "Background music",
          "Audio enhancement",
          "Captions / subtitles",
          "Brand elements",
          "Color correction",
          "HD delivery",
        ],
        audience: {
          label: "Recommended For",
          text: "Promotional videos, social media content, product videos, YouTube videos and business presentations.",
        },
        cta: "Upgrade My Video",
      },
      {
        id: "premium-editing",
        name: "Premium Editing",
        bestFor:
          "Brands that need high-quality, professionally edited video content with advanced visual treatment.",
        price: "$299/video",
        includes: [
          "5–10 minute video",
          "Advanced editing",
          "Advanced transitions & effects",
          "Motion graphics",
          "Professional text animation",
          "Voiceover integration",
          "Audio enhancement",
          "Color correction",
          "Captions / subtitles",
          "Brand integration",
          "Advanced visual effects",
          "HD rendering",
          "Multiple revision rounds",
        ],
        audience: {
          label: "Recommended For",
          text: "Corporate videos, premium promotional videos, YouTube content, product campaigns and professional brand storytelling.",
        },
        cta: "Create My Premium Video",
      },
      {
        id: "custom-video-production",
        name: "Custom Video Production",
        bestFor: "Businesses that need complete video production rather than editing alone.",
        price: "$449+",
        includes: [
          "Concept development",
          "Scriptwriting",
          "Storyboarding",
          "Creative direction",
          "Video production planning",
          "Professional video editing",
          "Motion graphics",
          "Voiceover coordination",
          "Music selection",
          "Color correction",
          "Audio enhancement",
          "Brand integration",
          "Multiple deliverables",
          "Social media cut-downs",
          "Final HD delivery",
        ],
        audience: {
          label: "Ideal For",
          text: "Corporate campaigns, promotional films, product launches, explainer videos, brand campaigns and large-scale content projects.",
        },
        cta: "Request a Custom Quote",
      },
    ],
  },

  capabilities: [
    {
      id: "social-media-video-content",
      title: "Social Media Video Content",
      subtitle: "Short Videos Designed for the Scroll",
      body: [
        "Short-form video is one of the most powerful ways to capture attention online.",
        "We create social-ready videos designed around the format and audience of each platform.",
      ],
      lists: [
        {
          label: "We Can Create",
          items: [
            "Instagram Reels",
            "Facebook Videos",
            "TikTok Videos",
            "YouTube Shorts",
            "Product Reels",
            "Promotional Reels",
            "Educational Videos",
            "Talking-Head Videos",
            "Brand Stories",
            "Video Ads",
            "Event Highlights",
          ],
        },
        {
          label: "Content Can Include",
          items: [
            "Fast-paced editing",
            "Captions",
            "Animated text",
            "Hooks",
            "Brand elements",
            "Music",
            "Sound effects",
            "Transitions",
            "Platform-specific formatting",
          ],
        },
      ],
      cta: "Create My Social Videos",
    },
    {
      id: "promotional-corporate-videos",
      title: "Promotional & Corporate Videos",
      subtitle: "Tell Your Brand Story With Impact",
      body: [
        "Your company deserves more than a slideshow of information.",
        "We create professional videos that help communicate what your business does, why it matters and what makes your brand different.",
      ],
      listLabel: "Ideal For",
      list: [
        "Company introductions",
        "Service presentations",
        "Brand stories",
        "Promotional campaigns",
        "Corporate announcements",
        "Event coverage",
        "Internal communications",
        "Recruitment videos",
      ],
      cta: "Create My Brand Video",
    },
    {
      id: "product-demonstration-videos",
      title: "Product Demonstration Videos",
      subtitle: "Show Customers What Your Product Can Do",
      body: [
        "A good product video can explain features faster and more effectively than a page full of text.",
      ],
      listLabel: "We create product-focused videos that highlight",
      list: [
        "Product features",
        "Benefits",
        "How-to-use instructions",
        "Product demonstrations",
        "Unboxing content",
        "Product comparisons",
        "Promotional offers",
        "Customer use cases",
      ],
      cta: "Showcase My Product",
    },
    {
      id: "explainer-videos",
      title: "Explainer Videos",
      subtitle: "Make Complex Ideas Easy to Understand",
      body: [
        "If your product, service or technology is difficult to explain, video can make it simple.",
      ],
      lists: [
        {
          label: "We can create explainer videos using",
          items: [
            "Motion graphics",
            "Animated text",
            "Visual storytelling",
            "Screen recordings",
            "Voiceovers",
            "Icons & illustrations",
            "Brand elements",
          ],
        },
        {
          label: "Ideal For",
          items: [
            "Software companies",
            "SaaS businesses",
            "Startups",
            "Educational platforms",
            "Technology products",
            "Business services",
          ],
        },
      ],
      cta: "Explain My Product",
    },
    {
      id: "monthly-video-content-packages",
      title: "Monthly Video Content Packages",
      body: [],
      plans: [
        {
          name: "Content Starter",
          price: "$299/month",
          includes: ["8 short-form videos", "Basic editing", "Captions", "Basic branding", "Social media formatting"],
          bestFor: "Small businesses and creators who need consistent short-form content.",
        },
        {
          name: "Content Growth",
          price: "$599/month",
          includes: [
            "12 short-form videos",
            "Advanced editing",
            "Captions",
            "Motion graphics",
            "Branding",
            "Platform-specific formatting",
            "Monthly content planning",
          ],
          bestFor: "Growing businesses and brands building a consistent video presence.",
        },
        {
          name: "Content Pro",
          price: "$999/month",
          includes: [
            "20 short-form videos",
            "Advanced editing",
            "Motion graphics",
            "Captions",
            "Branding",
            "Multiple platform formats",
            "Content planning",
            "Performance-focused creative direction",
          ],
          bestFor: "Brands, e-commerce businesses and organizations with a high-volume content strategy.",
        },
      ],
    },
    {
      id: "what-we-can-work-with",
      title: "What We Can Work With",
      body: [
        "Already have footage?",
        "Perfect.",
        "You can provide your existing material and we'll transform it into polished content.",
      ],
      listLabel: "We Can Work With",
      list: [
        "Smartphone footage",
        "DSLR / mirrorless footage",
        "Camera recordings",
        "Screen recordings",
        "Interviews",
        "Product footage",
        "Event footage",
        "Stock footage",
        "Voice recordings",
        "Existing brand assets",
      ],
    },
    {
      id: "video-editing-services",
      title: "Video Editing Services",
      subtitle: "Our editing workflow can include",
      body: [],
      items: [
        { title: "Cutting & Pacing", body: "Remove unnecessary footage and create a smooth, engaging flow." },
        { title: "Transitions", body: "Use professional transitions where they improve the viewing experience." },
        { title: "Motion Graphics", body: "Add animated text, graphics and visual elements." },
        { title: "Captions & Subtitles", body: "Make your videos easier to understand and more accessible." },
        {
          title: "Audio Editing",
          body: "Improve dialogue clarity, balance audio and add appropriate music or sound effects.",
        },
        { title: "Color Correction", body: "Improve consistency and visual quality across your footage." },
        { title: "Branding", body: "Integrate logos, colors, fonts and other brand elements." },
        {
          title: "Platform Optimization",
          body: "Deliver videos in the appropriate format and dimensions for the platform.",
        },
      ],
    },
    {
      id: "video-formats-we-deliver",
      title: "Video Formats We Deliver",
      body: [],
      listLabel: "Depending on your project, we can prepare content for",
      list: [
        "Instagram Reels",
        "Facebook",
        "TikTok",
        "YouTube",
        "YouTube Shorts",
        "LinkedIn",
        "Website",
        "Digital Ads",
        "Presentations",
        "Internal Business Use",
      ],
    },
  ],

  addOns: {
    heading: "Video Editing Add-ons",
    intro: "",
    columns: ["Add-on Service", "Starting Price"],
    items: SERVICE_ADDONS["Video Editing & Production"],
  },

  why: {
    heading: "Why Choose SKY Tech for Video Editing?",
    items: [
      {
        title: "Story First",
        body: "Good editing isn't just about effects. We focus on telling the story clearly and keeping the viewer engaged.",
        proof: { kind: "process", step: 4 },
        featured: true,
      },
      {
        title: "Brand-Focused",
        body: "Your videos should feel like your brand. We maintain consistency in visuals, messaging and tone.",
        proof: { kind: "drawing", drawing: "custom" },
      },
      {
        title: "Social-Ready",
        body: "We understand that content needs to work across different platforms and formats.",
        proof: { kind: "drawing", drawing: "responsive" },
      },
      {
        title: "Creative + Technical",
        body: "We combine creative storytelling with professional editing and production techniques.",
        proof: { kind: "process", step: 5 },
      },
      {
        title: "Clear Communication",
        body: "We define the scope, deliverables and revision process before work begins.",
        proof: { kind: "process", step: 0 },
      },
      {
        title: "Flexible",
        body: "Whether you have raw footage or only an idea, we can work with you based on your requirements.",
        proof: { kind: "pricing" },
        featured: true,
      },
      {
        title: "Business-Focused",
        body: "We create content with a purpose — whether that's awareness, engagement, education, product promotion or lead generation.",
        proof: { kind: "addOn", name: "Short-Form Cut from Long Video" },
      },
    ],
  },

  process: {
    heading: "Our Video Production Process",
    steps: [
      { title: "Brief", body: "We understand your objective, audience, platform and desired outcome." },
      {
        title: "Concept",
        body: "For production projects, we develop the creative direction, concept and messaging.",
      },
      {
        title: "Script & Storyboard",
        body: "Where required, we develop the script and visual structure before production.",
      },
      {
        title: "Production / Footage Collection",
        body: "We work with your supplied footage or coordinate the requirements for a complete production project.",
      },
      { title: "Edit", body: "Our editors assemble the footage, refine pacing and build the visual story." },
      {
        title: "Enhance",
        body: "We add motion graphics, captions, music, sound design, color correction and branding where required.",
      },
      {
        title: "Review",
        body: "You review the first version and provide feedback according to the agreed revision scope.",
      },
      {
        title: "Final Delivery",
        body: "We export and deliver the final video in the required format and resolution.",
      },
    ],
  },

  investment: {
    heading: "How Much Does Video Editing Cost?",
    intro:
      "Video pricing depends on the length of the video, complexity of editing, amount of raw footage, graphics, animation, audio work and number of revisions.",
    label: "Typical Investment",
    ranges: [
      { label: "Basic Editing", min: 25, max: 25, openEnded: true, display: "From $25/video", tier: "basic-editing" },
      { label: "Standard Editing", min: 99, max: 99, openEnded: true, display: "From $99/video", tier: "standard-editing" },
      { label: "Premium Editing", min: 299, max: 299, openEnded: true, display: "From $299/video", tier: "premium-editing" },
      { label: "Custom Video Production", min: 449, max: 449, openEnded: true, display: "From $449+", tier: "custom-video-production" },
    ],
    note: "For larger campaigns, multiple videos or recurring content, we can create a customized package based on your requirements.",
  },

  faq: {
    heading: "Frequently Asked Questions",
    items: [
      {
        question: "Do you provide video editing only, or complete production?",
        answer:
          "Both. You can send us your existing footage for editing, or we can work with you on a complete production project including concept, script, storyboard and editing.",
      },
      {
        question: "Can you edit videos recorded on a phone?",
        answer: "Yes. Smartphone footage can be edited into professional social media, promotional and business videos.",
      },
      {
        question: "Do you edit Instagram Reels and TikTok videos?",
        answer:
          "Yes. We create short-form content optimized for platforms such as Instagram, Facebook, TikTok and YouTube Shorts.",
      },
      {
        question: "Do you add captions and subtitles?",
        answer:
          "Yes. Captions and subtitles can be included depending on the package or added as an additional service.",
      },
      {
        question: "Can you add motion graphics?",
        answer:
          "Yes. Motion graphics, animated text, icons and other visual elements can be included depending on the project's requirements.",
      },
      {
        question: "Can you edit YouTube videos?",
        answer:
          "Yes. We can edit long-form YouTube content including cuts, pacing, captions, graphics, audio enhancement and branding.",
      },
      {
        question: "Can you create videos from raw footage?",
        answer: "Yes. Simply provide the footage and project brief, and we can turn it into a polished final video.",
      },
      {
        question: "Do you provide scriptwriting?",
        answer: "Yes. Scriptwriting can be included in custom video production projects or purchased as an add-on.",
      },
      {
        question: "Do you provide voiceovers?",
        answer: "Voiceover integration and coordination can be included depending on the project requirements.",
      },
      {
        question: "How many revisions are included?",
        answer:
          "Revision rounds depend on the selected package and project scope. The agreed number of revisions will be clearly mentioned in the project proposal.",
      },
      {
        question: "What video formats do you deliver?",
        answer:
          "We can prepare videos for social media, websites, YouTube, digital advertising, presentations and other platforms based on your requirements.",
      },
      {
        question: "Can you create multiple videos every month?",
        answer:
          "Yes. We offer monthly video content packages for businesses that need consistent short-form video production.",
      },
      {
        question: "Do you work with international clients?",
        answer: "Yes. SKY Tech works with businesses in Pakistan, the USA, the UK and beyond.",
      },
    ],
  },

  closing: {
    kicker: "Ready to Tell Your Story Through Video?",
    heading: "Let's Create Videos People Want to Watch.",
    body: "Whether you need a single promotional video, a polished product demo or a consistent stream of social media content, SKY Tech can help turn your ideas and footage into professional video content.",
    promise: "Better storytelling. Better editing. Better content for your brand.",
    primaryCta: "Get a Free Video Quote",
    secondaryCta: "Book a Free Consultation",
  },
};
