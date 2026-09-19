import { SERVICE_ADDONS } from "./addons";
import type { ServicePage } from "./types";

/* Transcribed verbatim from src/content/services/digital-marketing.md.

   Resolved against the file:
   - The detailed package sections are the source; the summary tables
     appended at the end are not used, as on Web Development. (They agree on
     the package prices; the detailed add-on table gives SEO Optimization as
     a one-off $150, which is what is used.)
   - Packages are priced per month.
   - The six specialist sections (SEO, Google Ads & PPC, Social Media
     Advertising, Lead Generation, Email Marketing & Automation, Conversion
     Optimization) are the page's capabilities, shown as tabs in one band.
   - The content names no technologies, so the page has no technology band.
   - The hero's timeline figure is the content's SEO timeframe, the one
     duration it gives. */
export const DIGITAL_MARKETING: ServicePage = {
  slug: "digital-marketing",
  contactName: "Digital Marketing",

  hero: {
    label: "Digital Marketing Services",
    h1: "Digital Marketing That Drives Real, Measurable Growth",
    accentWords: 3,
    subheadline:
      "We combine SEO, paid advertising, content and conversion-focused strategies to help your business reach the right audience, generate qualified leads and grow revenue.",
    primaryCta: "Book a Free Marketing Consultation",
    secondaryCta: "Get a Free Marketing Audit",
    timeline: { label: "Meaningful SEO ranking improvements", value: "3–6 months" },
  },

  problem: {
    heading: "Stop Chasing Traffic. Start Growing Your Business.",
    paragraphs: [
      "Getting more traffic doesn't automatically mean getting more customers.",
      "You need ==the right audience==, ==the right message== and ==the right strategy== to turn attention into action.",
      "At SKY Tech, we build data-driven digital marketing strategies around your business goals — combining organic search, paid advertising, social media and lead generation to create a marketing system that works together.",
      "Whether you're launching a new business, looking to generate more leads or ready to scale your existing marketing, we build strategies designed around measurable outcomes.",
    ],
  },

  offerings: {
    heading: "What We Offer",
    items: [
      {
        title: "Search Engine Optimization (SEO)",
        body: "Improve your visibility on search engines and attract people actively looking for your products or services.",
        fit: { addOn: "SEO Optimization" },
      },
      {
        title: "Google Ads & PPC",
        body: "Reach high-intent customers with targeted paid search campaigns designed around your goals and budget.",
        fit: { addOn: "Google Ads Setup" },
      },
      {
        title: "Social Media Advertising",
        body: "Run targeted advertising campaigns across platforms such as Facebook, Instagram, LinkedIn and TikTok.",
        fit: { addOn: "Social Media Advertising" },
      },
      {
        title: "Lead Generation",
        body: "Build campaigns and conversion systems designed to attract qualified leads and support your sales pipeline.",
        fit: { addOn: "Lead Generation" },
      },
      {
        title: "Content Marketing",
        body: "Create useful, relevant content that builds visibility, authority and trust with your target audience.",
        fit: { tier: "growth-partner" },
      },
      {
        title: "Email Marketing",
        body: "Turn prospects into customers and customers into repeat buyers through strategic email campaigns.",
        fit: { addOn: "Email Marketing" },
      },
      {
        title: "Marketing Automation",
        body: "Automate repetitive marketing workflows such as lead follow-ups, notifications and customer communication.",
        fit: { addOn: "Marketing Automation" },
      },
      {
        title: "Conversion Optimization",
        body: "Improve landing pages, website journeys and calls-to-action to turn more visitors into leads and customers.",
        fit: { addOn: "Conversion Optimization" },
      },
      {
        title: "Analytics & Reporting",
        body: "Track campaign performance and use data to identify what is working, what isn't and where to improve.",
        fit: { addOn: "Analytics & Tracking Setup" },
      },
    ],
  },

  packages: {
    heading: "Our Digital Marketing Packages",
    priceLabel: "Starting From",
    tiers: [
      {
        id: "starter-growth",
        name: "Starter Growth",
        bestFor: "Small businesses and startups that need a strong digital marketing foundation.",
        price: "$299/month",
        includes: [
          "Digital marketing strategy",
          "Basic SEO optimization",
          "Keyword research",
          "On-page SEO recommendations",
          "Google Business Profile guidance",
          "Social media content strategy",
          "Basic social media advertising setup",
          "Monthly performance report",
          "Monthly strategy review",
        ],
        audience: {
          label: "Recommended For",
          text: "Startups, local businesses and small businesses starting their digital marketing journey.",
        },
        cta: "Start Growing",
      },
      {
        id: "growth-marketing",
        name: "Growth Marketing",
        bestFor: "Businesses that already have an online presence and want consistent traffic, leads and visibility.",
        price: "$499/month",
        includes: [
          "Complete digital marketing strategy",
          "SEO optimization",
          "Keyword research & content planning",
          "On-page SEO",
          "Technical SEO recommendations",
          "Google Ads / PPC management",
          "Social media advertising",
          "Landing page recommendations",
          "Lead generation strategy",
          "Conversion tracking",
          "Monthly analytics report",
          "Performance optimization",
        ],
        audience: {
          label: "Recommended For",
          text: "Growing SMEs, service businesses, e-commerce brands and companies looking for consistent lead generation.",
        },
        cta: "Grow My Business",
      },
      {
        id: "performance-marketing",
        name: "Performance Marketing",
        bestFor: "Businesses focused on generating measurable leads, sales and customer acquisition.",
        price: "$799/month",
        includes: [
          "Full-funnel marketing strategy",
          "Advanced SEO",
          "Google Ads management",
          "Social media advertising",
          "Retargeting campaigns",
          "Lead generation campaigns",
          "Landing page optimization",
          "Conversion tracking",
          "Audience research",
          "Campaign testing & optimization",
          "Analytics & performance monitoring",
          "Detailed monthly reporting",
          "Strategy consultation",
        ],
        audience: {
          label: "Recommended For",
          text: "Established businesses and brands that are ready to scale their customer acquisition.",
        },
        cta: "Scale My Marketing",
      },
      {
        id: "growth-partner",
        name: "Growth Partner",
        bestFor: "Businesses looking for an integrated marketing team to manage multiple digital growth channels.",
        price: "$1,200/month",
        includes: [
          "Complete digital marketing strategy",
          "SEO management",
          "Google Ads / PPC",
          "Social media advertising",
          "Content strategy",
          "Lead generation",
          "Email marketing",
          "Marketing automation",
          "Conversion optimization",
          "Retargeting",
          "Analytics & reporting",
          "Monthly strategy planning",
          "Continuous campaign optimization",
        ],
        audience: {
          label: "Recommended For",
          text: "Established companies, e-commerce businesses and organizations looking for long-term digital growth support.",
        },
        cta: "Become a Growth Partner",
      },
    ],
  },

  capabilities: [
    {
      id: "seo-services",
      title: "SEO Services",
      subtitle: "Get Found by the Right Customers",
      body: [
        "SEO is more than adding keywords to a website.",
        "We build SEO strategies around your audience, search intent, competition and business goals.",
      ],
      listLabel: "Our SEO Services Include",
      list: [
        "SEO audit",
        "Keyword research",
        "Competitor analysis",
        "On-page SEO",
        "Technical SEO",
        "Content optimization",
        "Local SEO",
        "Google Business Profile optimization",
        "Internal linking",
        "Metadata optimization",
        "Website structure recommendations",
        "Performance monitoring",
        "Monthly SEO reporting",
      ],
      priceLabel: "SEO Starting From",
      price: "$150/month",
      priceNote: "For larger websites and competitive industries, pricing is based on scope and requirements.",
      cta: "Get an SEO Audit",
    },
    {
      id: "google-ads-ppc-management",
      title: "Google Ads & PPC Management",
      subtitle: "Put Your Business in Front of High-Intent Customers",
      body: [
        "Google Ads can put your business in front of customers when they're actively searching for what you offer.",
      ],
      listLabel: "We Can Help With",
      list: [
        "Campaign strategy",
        "Keyword research",
        "Search campaigns",
        "Display campaigns",
        "Remarketing",
        "Ad copy",
        "Audience targeting",
        "Conversion tracking",
        "Landing page recommendations",
        "Campaign optimization",
        "Performance reporting",
      ],
      priceLabel: "PPC Management",
      price: "Custom Quote",
      priceNote: "Advertising spend is separate from management fees.",
      cta: "Launch My Google Ads",
    },
    {
      id: "social-media-advertising",
      title: "Social Media Advertising",
      subtitle: "Reach the People Most Likely to Buy",
      body: ["We create targeted paid social campaigns designed around your audience and business objectives."],
      lists: [
        { label: "Platforms", items: ["Facebook", "Instagram", "LinkedIn", "TikTok"] },
        {
          label: "Campaign Types",
          items: [
            "Lead generation",
            "Website traffic",
            "Conversions",
            "Product promotion",
            "Brand awareness",
            "Retargeting",
            "Customer acquisition",
          ],
        },
        {
          label: "Includes",
          items: [
            "Audience research",
            "Campaign setup",
            "Ad creative direction",
            "Campaign management",
            "A/B testing",
            "Performance monitoring",
            "Optimization",
            "Reporting",
          ],
        },
      ],
      cta: "Start Social Advertising",
    },
    {
      id: "lead-generation",
      title: "Lead Generation",
      subtitle: "Turn Marketing Into a Sales Pipeline",
      body: [
        "The goal isn't simply to get clicks.",
        "The goal is to generate leads that have a real chance of becoming customers.",
      ],
      listLabel: "Our lead generation approach can include",
      list: [
        "Lead generation campaigns",
        "Landing pages",
        "Lead forms",
        "Conversion tracking",
        "Retargeting",
        "Email follow-ups",
        "CRM integration",
        "Automated notifications",
        "Lead nurturing workflows",
      ],
      priceLabel: "Starting From",
      price: "$300/month",
      priceNote: "Final pricing depends on channels, campaign volume and required integrations.",
      cta: "Generate More Leads",
    },
    {
      id: "email-marketing-automation",
      title: "Email Marketing & Automation",
      subtitle: "Follow Up Without Doing Everything Manually",
      body: [
        "We help businesses build automated communication workflows that keep leads and customers engaged.",
      ],
      listLabel: "Services Include",
      list: [
        "Email campaign setup",
        "Newsletter campaigns",
        "Lead nurturing",
        "Automated follow-ups",
        "Welcome sequences",
        "Customer re-engagement",
        "Marketing automation",
        "CRM integrations",
        "Performance tracking",
      ],
      priceLabel: "Starting From",
      price: "$200/month",
      priceNote: "Custom automation projects are quoted according to workflow complexity.",
      cta: "Automate My Marketing",
    },
    {
      id: "conversion-optimization",
      title: "Conversion Optimization",
      subtitle: "More Traffic Isn't Enough. Convert More of It.",
      body: [
        "If your website receives visitors but doesn't generate enough enquiries or sales, the problem may be the conversion journey.",
      ],
      listLabel: "We can review and optimize",
      list: [
        "Landing pages",
        "Calls-to-action",
        "Contact forms",
        "User journeys",
        "Page structure",
        "Messaging",
        "Conversion points",
        "Mobile experience",
        "Lead capture process",
      ],
      priceLabel: "Starting From",
      price: "$200",
      cta: "Improve My Conversions",
    },
  ],

  addOns: {
    heading: "Digital Marketing Add-ons",
    intro: "",
    columns: ["Service", "Starting Price"],
    items: SERVICE_ADDONS["Digital Marketing"],
    note: "Advertising budget is not included in management fees.",
  },

  why: {
    heading: "What Makes Our Approach Different?",
    items: [
      {
        title: "Strategy Before Spending",
        body: "We don't believe in spending money on ads without understanding the audience, offer and conversion journey.",
        proof: { kind: "process", step: 2 },
      },
      {
        title: "Data-Driven Decisions",
        body: "Campaign decisions are based on performance data rather than assumptions.",
        proof: { kind: "process", step: 4 },
      },
      {
        title: "One Connected Strategy",
        body: "SEO, paid advertising, social media and content work together instead of operating as disconnected activities.",
        proof: { kind: "drawing", drawing: "structure" },
      },
      {
        title: "Business-Focused KPIs",
        body: "We focus on meaningful outcomes such as qualified leads, conversions and customer acquisition — not vanity metrics alone.",
        proof: { kind: "addOn", name: "Analytics & Tracking Setup" },
      },
      {
        title: "Transparent Reporting",
        body: "You receive clear reporting on what was done, what happened and what we're improving next.",
        proof: { kind: "addOn", name: "Marketing Audit" },
      },
      {
        title: "Continuous Optimization",
        body: "Digital marketing isn't a set-it-and-forget-it activity. We continuously test and optimize campaigns.",
        proof: { kind: "process", step: 5 },
      },
    ],
  },

  process: {
    heading: "Our Digital Marketing Process",
    steps: [
      { title: "Discover", body: "We understand your business, target audience, competitors and growth objectives." },
      {
        title: "Audit",
        body: "We review your existing website, SEO, advertising, social presence and conversion journey.",
      },
      {
        title: "Strategize",
        body: "We identify the right channels, campaigns and priorities based on your goals and budget.",
      },
      { title: "Launch", body: "We set up campaigns, tracking, content and conversion systems." },
      {
        title: "Measure",
        body: "We monitor traffic, leads, conversions, campaign performance and other relevant KPIs.",
      },
      { title: "Optimize", body: "We continuously improve campaigns based on real performance data." },
      {
        title: "Scale",
        body: "Once we identify what works, we focus resources on the channels and campaigns producing the strongest results.",
      },
    ],
  },

  investment: {
    heading: "How Much Does Digital Marketing Cost?",
    intro:
      "Digital marketing pricing depends on the number of channels, campaign complexity, business goals and level of ongoing management required.",
    label: "Typical Investment",
    unit: "/month",
    ranges: [
      { label: "Starter Growth", min: 299, max: 299, openEnded: true, display: "From $299/month", tier: "starter-growth" },
      { label: "Growth Marketing", min: 499, max: 499, openEnded: true, display: "From $499/month", tier: "growth-marketing" },
      { label: "Performance Marketing", min: 799, max: 799, openEnded: true, display: "From $799/month", tier: "performance-marketing" },
      { label: "Growth Partner", min: 1200, max: 1200, openEnded: true, display: "From $1,200/month", tier: "growth-partner" },
    ],
    note: "Additional one-time services such as SEO audits, tracking setup, landing page optimization and campaign setup can be added separately.",
    important: {
      label: "Important",
      text: "Advertising spend paid to platforms such as Google or Meta is separate from SKY Tech's management fees.",
    },
  },

  timeline: {
    heading: "How Long Does Digital Marketing Take to Show Results?",
    paragraphs: [
      "Different channels produce results at different speeds.",
      "Paid advertising can generate traffic and leads soon after campaigns are launched, depending on the offer, audience, budget and campaign setup.",
      "SEO is a longer-term strategy. Meaningful ranking improvements commonly take **3–6 months**, depending on competition, website authority and the starting point.",
      "Our focus is on building sustainable growth rather than promising unrealistic results.",
    ],
  },

  relatedAddOns: {
    "Google Ads": "Google Ads Setup",
  },

  faq: {
    heading: "Frequently Asked Questions",
    items: [
      {
        question: "What digital marketing services do you provide?",
        answer:
          "We provide SEO, Google Ads/PPC, social media advertising, lead generation, content marketing, email marketing, marketing automation, conversion optimization and analytics.",
      },
      {
        question: "Do you manage Google Ads?",
        answer:
          "Yes. We can handle campaign strategy, setup, keyword research, ad creation, conversion tracking, optimization and reporting.",
      },
      {
        question: "Do you manage Facebook and Instagram advertising?",
        answer:
          "Yes. We manage paid social campaigns across platforms including Facebook and Instagram, with additional platforms available depending on your audience.",
      },
      {
        question: "Is the advertising budget included?",
        answer:
          "No. Advertising spend paid directly to platforms such as Google or Meta is separate from our management fees.",
      },
      {
        question: "How long does SEO take?",
        answer:
          "SEO is a long-term strategy. Meaningful improvements can typically take around 3–6 months, depending on competition, website condition and the starting point.",
      },
      {
        question: "Can you generate leads for my business?",
        answer:
          "Yes. We can build lead generation campaigns using search advertising, social advertising, landing pages, forms, retargeting and automated follow-up workflows.",
      },
      {
        question: "Do you guarantee rankings or leads?",
        answer:
          "No. We don't make unrealistic guarantees. Marketing performance depends on many factors including competition, market demand, offer quality, budget and customer behaviour.",
      },
      {
        question: "Do you work with businesses outside Pakistan?",
        answer: "Yes. SKY Tech works with businesses in Pakistan, the USA, the UK and beyond.",
      },
      {
        question: "Can you work with our existing marketing team?",
        answer:
          "Yes. We can work alongside your internal team and provide specific services such as SEO, PPC, campaign management, content strategy or marketing automation.",
      },
      {
        question: "Do you provide monthly reports?",
        answer:
          "Yes. Ongoing marketing packages include performance reporting and strategy reviews appropriate to the selected package.",
      },
      {
        question: "Can you manage both SEO and paid advertising?",
        answer:
          "Yes. Combining organic and paid strategies can provide a stronger overall digital acquisition strategy when appropriate for the business.",
      },
      {
        question: "Can you integrate marketing with our CRM?",
        answer:
          "Yes. Where technically supported, we can connect lead generation and marketing workflows with your existing CRM and other business tools.",
      },
    ],
  },

  closing: {
    kicker: "Ready to Grow Your Business?",
    heading: "Let's Build a Marketing Strategy That Works.",
    body: "Tell us what you're trying to achieve — more traffic, more leads, more sales or stronger online visibility — and we'll help you identify the right digital marketing strategy.",
    promise:
      "No empty promises. No unnecessary channels. Just a strategy built around your business goals and measurable growth.",
    primaryCta: "Book a Free Marketing Consultation",
    secondaryCta: "Get a Free Marketing Audit",
  },
};
