import { SERVICE_ADDONS } from "./addons";
import type { ServicePage } from "./types";

/* Transcribed verbatim from src/content/services/google-ads.md.

   Resolved against the file:
   - The detailed package sections are the source; the summary tables
     appended at the end agree on the prices and are not used.
   - The four management packages are priced per month and each carries the
     content's "Ad spend is separate." The fifth, the Google Ads Audit, is a
     one-off $100; its opening lines stand as its "Best For".
   - The eight specialist sections (Search, Shopping, Performance Max,
     Display, Remarketing, Local, Conversion Tracking, Landing Page
     Recommendations) and "Key Google Ads Metrics We Monitor" are the page's
     capabilities, shown as tabs in one band.
   - The cost chart plots the monthly management packages; the one-off audit
     is given as the section's closing line rather than put on a monthly
     scale.
   - The problem section's answer board is the four things the content set
     in bold (targeting, ad copy, tracking, optimization). */
export const GOOGLE_ADS: ServicePage = {
  slug: "google-ads",
  contactName: "Google Ads",

  hero: {
    label: "Google Ads Management Services",
    h1: "Get Found by Customers Who Are Already Searching",
    accentWords: 4,
    subheadline:
      "We create, manage and optimize Google Ads campaigns designed to reach the right audience, generate qualified traffic and support measurable business growth.",
    primaryCta: "Get a Free Google Ads Consultation",
    secondaryCta: "Request a Campaign Audit",
    timeline: { label: "Basic campaign preparation", value: "3–5 business days" },
  },

  problem: {
    heading: "Stop Waiting for Customers to Find You",
    paragraphs: [
      "Your potential customers are already searching for products and services like yours.",
      "The challenge is getting your business in front of them at the right time — with the right message.",
      "At SKY Tech, we manage Google Ads campaigns with a focus on ==relevant targeting==, ==compelling ad copy==, ==conversion tracking== and ==continuous optimization==.",
      "From local businesses looking for leads to e-commerce brands looking for sales, we build paid search strategies around your business objectives.",
    ],
  },

  offerings: {
    heading: "What We Offer",
    items: [
      {
        title: "Google Search Ads",
        body: "Reach people actively searching for your products or services through targeted search campaigns.",
        fit: { tier: "google-ads-starter" },
      },
      {
        title: "Google Display Ads",
        body: "Build awareness and reach potential customers across websites, apps and digital placements.",
        fit: { tier: "google-ads-performance" },
      },
      {
        title: "Performance Max",
        body: "Use Google's automated campaign system to reach customers across multiple Google channels from a unified campaign.",
        fit: { tier: "google-ads-performance" },
      },
      {
        title: "Google Shopping Ads",
        body: "Promote products with product-focused ads designed to connect shoppers with your e-commerce store.",
        fit: { addOn: "Google Shopping Setup" },
      },
      {
        title: "Remarketing",
        body: "Reconnect with people who have previously visited your website or interacted with your business.",
        fit: { addOn: "Remarketing Setup" },
      },
      {
        title: "Local Google Ads",
        body: "Target customers within specific locations to support calls, visits, bookings and local leads.",
        fit: { tier: "google-ads-starter" },
      },
      {
        title: "YouTube Advertising",
        body: "Reach relevant audiences through video advertising across YouTube and Google's video network.",
        fit: { tier: "google-ads-enterprise" },
      },
      {
        title: "Keyword Research",
        body: "Identify relevant search terms and opportunities based on your products, services, audience and objectives.",
        fit: { addOn: "Keyword Research" },
      },
      {
        title: "Ad Copywriting",
        body: "Create clear and compelling headlines and descriptions designed to communicate your value proposition.",
        fit: { addOn: "Ad Copywriting" },
      },
      {
        title: "Conversion Tracking",
        body: "Set up and review conversion tracking so campaign performance can be measured more effectively.",
        fit: { addOn: "Conversion Tracking Setup" },
      },
      {
        title: "Campaign Optimization",
        body: "Continuously review campaign performance and make data-informed improvements.",
        fit: { tier: "google-ads-growth" },
      },
      {
        title: "PPC Audit",
        body: "Review existing campaigns to identify issues, wasted spend and opportunities for improvement.",
        fit: { tier: "google-ads-audit" },
      },
    ],
  },

  packages: {
    heading: "Our Google Ads Packages",
    priceLabel: "Starting From",
    tiers: [
      {
        id: "google-ads-starter",
        name: "Google Ads Starter",
        bestFor: "Small businesses starting with Google Ads or businesses running a limited number of campaigns.",
        price: "$150/month",
        includes: [
          "Account & campaign setup",
          "Keyword research",
          "1–2 campaigns",
          "Ad group structure",
          "Ad copy",
          "Basic audience targeting",
          "Location targeting",
          "Basic conversion setup",
          "Negative keyword setup",
          "Monthly performance report",
          "Basic optimization",
        ],
        audience: { label: "Recommended For", text: "Local businesses, startups and small service businesses." },
        note: "Ad spend is separate.",
        cta: "Start Google Ads",
      },
      {
        id: "google-ads-growth",
        name: "Google Ads Growth",
        bestFor:
          "Businesses that want ongoing campaign management and optimization to generate consistent leads or sales.",
        price: "$299/month",
        includes: [
          "Account setup / optimization",
          "Up to 4 campaigns",
          "Comprehensive keyword research",
          "Search intent analysis",
          "Ad copy variations",
          "Search campaigns",
          "Remarketing setup",
          "Audience targeting",
          "Conversion tracking review",
          "Negative keyword management",
          "Bid & budget optimization",
          "A/B testing",
          "Monthly performance report",
          "Ongoing optimization",
        ],
        audience: { label: "Recommended For", text: "Growing businesses, service companies and e-commerce brands." },
        note: "Ad spend is separate.",
        cta: "Grow With Google Ads",
      },
      {
        id: "google-ads-performance",
        name: "Google Ads Performance",
        bestFor: "Businesses running multiple campaigns that need advanced optimization and performance management.",
        price: "$499/month",
        includes: [
          "Full Google Ads account management",
          "Up to 8 campaigns",
          "Search Ads",
          "Display Ads",
          "Remarketing",
          "Performance Max where suitable",
          "Advanced keyword research",
          "Competitor research",
          "Multiple ad variations",
          "Audience segmentation",
          "Conversion tracking",
          "Negative keyword strategy",
          "Bid strategy optimization",
          "Landing page recommendations",
          "A/B testing",
          "Weekly optimization",
          "Monthly reporting",
          "Performance insights",
        ],
        audience: {
          label: "Recommended For",
          text: "Established businesses, high-value services and brands with larger advertising budgets.",
        },
        note: "Ad spend is separate.",
        cta: "Optimize My Campaigns",
      },
      {
        id: "google-ads-enterprise",
        name: "Google Ads Enterprise",
        bestFor:
          "Businesses with complex advertising requirements, multiple locations, products or large campaign structures.",
        price: "$999/month",
        includes: [
          "Full account management",
          "Advanced campaign architecture",
          "Search campaigns",
          "Display campaigns",
          "Shopping campaigns",
          "Performance Max",
          "Remarketing",
          "YouTube campaigns",
          "Advanced audience strategy",
          "Extensive keyword research",
          "Competitor analysis",
          "Conversion tracking",
          "Analytics integration",
          "Landing page recommendations",
          "Creative testing",
          "Budget allocation",
          "Bid optimization",
          "Ongoing performance analysis",
          "Detailed reporting",
          "Strategic consultation",
        ],
        audience: {
          label: "Ideal For",
          text: "Large businesses, e-commerce brands, multi-location businesses and organizations with significant advertising budgets.",
        },
        note: "Ad spend is separate.",
        cta: "Build My PPC Strategy",
      },
      {
        id: "google-ads-audit",
        name: "Google Ads Audit",
        bestFor:
          "Already running Google Ads? Before increasing your budget, make sure your campaigns are structured correctly.",
        price: "$100",
        includesLabel: "Audit Can Include",
        includes: [
          "Account structure",
          "Campaign settings",
          "Keyword targeting",
          "Search terms",
          "Negative keywords",
          "Ad copy",
          "Quality-related factors",
          "Audience targeting",
          "Location targeting",
          "Conversion tracking",
          "Budget allocation",
          "Bidding strategy",
          "Landing page experience",
          "Wasted spend opportunities",
          "Optimization recommendations",
        ],
        cta: "Audit My Google Ads",
      },
    ],
  },

  capabilities: [
    {
      id: "google-search-ads",
      title: "Google Search Ads",
      subtitle: "Be There When Customers Search",
      body: [
        "Search advertising allows your business to appear when people actively search for relevant products and services.",
      ],
      lists: [
        {
          label: "We build campaigns around",
          items: ["High-intent keywords", "Search intent", "Location", "Audience", "Services", "Products", "Business goals"],
        },
        {
          label: "We Manage",
          items: [
            "Campaign structure",
            "Ad groups",
            "Keywords",
            "Match types",
            "Negative keywords",
            "Ad copy",
            "Extensions / assets",
            "Bidding",
            "Budget allocation",
            "Search term analysis",
          ],
        },
      ],
      cta: "Launch Search Ads",
    },
    {
      id: "google-shopping-ads",
      title: "Google Shopping Ads",
      subtitle: "Put Your Products in Front of Ready-to-Buy Shoppers",
      body: [
        "For e-commerce businesses, Shopping campaigns can help showcase products directly to people searching for what you sell.",
      ],
      lists: [
        {
          label: "We Can Help With",
          items: [
            "Merchant Center setup",
            "Product feed review",
            "Product organization",
            "Shopping campaign setup",
            "Performance Max",
            "Product targeting",
            "Budget management",
            "Conversion tracking",
            "Campaign optimization",
          ],
        },
        { label: "Ideal For", items: ["E-commerce stores", "Retail businesses", "Product brands", "Online stores"] },
      ],
      cta: "Start Shopping Ads",
    },
    {
      id: "performance-max-campaigns",
      title: "Performance Max Campaigns",
      subtitle: "Reach Customers Across Google's Ecosystem",
      body: [
        "Performance Max campaigns can help businesses reach potential customers across multiple Google channels using a unified campaign structure.",
      ],
      lists: [
        {
          label: "Depending on your business and campaign goals, we can manage",
          items: [
            "Campaign setup",
            "Audience signals",
            "Asset requirements",
            "Product feeds",
            "Conversion goals",
            "Budget allocation",
            "Performance monitoring",
            "Ongoing optimization",
          ],
        },
      ],
      cta: "Explore Performance Max",
    },
    {
      id: "google-display-advertising",
      title: "Google Display Advertising",
      subtitle: "Build Awareness Beyond Search",
      body: [
        "Display campaigns can help you reach potential customers while they browse websites and digital content across Google's network.",
      ],
      lists: [
        {
          label: "Useful For",
          items: [
            "Brand awareness",
            "Remarketing",
            "Product promotion",
            "Lead generation",
            "Campaign support",
            "Customer retention",
          ],
        },
      ],
      closing: "We can help with targeting, campaign structure, creative requirements and ongoing optimization.",
      cta: "Start Display Advertising",
    },
    {
      id: "remarketing-campaigns",
      title: "Remarketing Campaigns",
      subtitle: "Bring Interested Visitors Back",
      body: [
        "Not every website visitor converts on their first visit.",
        "Remarketing allows you to reconnect with people who have already interacted with your website or business.",
      ],
      lists: [
        {
          label: "We Can Create Remarketing Strategies For",
          items: [
            "Website visitors",
            "Product viewers",
            "Cart visitors",
            "Previous customers",
            "Engaged audiences",
            "Specific website sections",
          ],
        },
      ],
      closing: "The exact targeting approach depends on your business, audience and available data.",
      cta: "Set Up Remarketing",
    },
    {
      id: "local-google-ads",
      title: "Local Google Ads",
      subtitle: "Reach Customers in Your Target Area",
      body: [
        "If your business depends on customers from a specific city, region or service area, location-focused campaigns can help put your business in front of relevant local searches.",
      ],
      lists: [
        {
          label: "Ideal For",
          items: [
            "Restaurants",
            "Clinics",
            "Salons",
            "Real estate businesses",
            "Service providers",
            "Automotive businesses",
            "Local retailers",
            "Professional services",
          ],
        },
        {
          label: "We Can Target By",
          items: ["City", "Region", "Service area", "Location radius", "Relevant audience segments"],
        },
      ],
      cta: "Get Local Leads",
    },
    {
      id: "conversion-tracking",
      title: "Conversion Tracking",
      subtitle: "Know What Your Ads Are Actually Producing",
      body: ["Clicks and impressions are useful — but conversions are what matter to your business."],
      lists: [
        {
          label: "We can help set up or review tracking for actions such as",
          items: [
            "Contact form submissions",
            "Phone calls",
            "WhatsApp clicks",
            "Purchases",
            "Booking requests",
            "Sign-ups",
            "Lead forms",
            "Key website interactions",
          ],
        },
      ],
      closing: "Proper tracking allows campaign decisions to be based on measurable actions rather than clicks alone.",
      cta: "Fix My Tracking",
    },
    {
      id: "landing-page-recommendations",
      title: "Landing Page Recommendations",
      subtitle: "Your Ads Are Only One Part of the Funnel",
      body: ["Even a strong ad can struggle if the landing page doesn't deliver what the visitor expected."],
      lists: [
        {
          label: "As part of campaign optimization, we can review",
          items: [
            "Message match",
            "Headlines",
            "Calls-to-action",
            "Page structure",
            "Mobile experience",
            "Form placement",
            "User journey",
            "Conversion friction",
          ],
        },
      ],
      closing: "Where required, landing page design and development can be provided as a separate service.",
      cta: "Improve My Landing Page",
    },
    {
      id: "key-google-ads-metrics",
      title: "Key Google Ads Metrics We Monitor",
      body: [],
      lists: [
        {
          label: "Depending on campaign objectives, we can track",
          items: [
            "Impressions",
            "Clicks",
            "Click-Through Rate (CTR)",
            "Cost Per Click (CPC)",
            "Conversions",
            "Conversion Rate",
            "Cost Per Conversion",
            "Conversion Value",
            "Return on Ad Spend (ROAS)",
            "Search Terms",
            "Quality-related indicators",
            "Campaign & keyword performance",
          ],
        },
      ],
    },
  ],

  addOns: {
    heading: "Google Ads Add-on Services",
    intro: "",
    columns: ["Add-on Service", "Starting Price"],
    items: SERVICE_ADDONS["Google Ads"],
  },

  why: {
    heading: "What Makes Our Google Ads Management Different?",
    items: [
      {
        title: "Strategy Before Spend",
        body: "We don't simply launch campaigns and wait. We build a strategy around your objectives.",
        proof: { kind: "process", step: 2 },
        featured: true,
      },
      {
        title: "Intent-Focused",
        body: "We focus on reaching people whose searches and behaviours are relevant to your business.",
        proof: { kind: "process", step: 1 },
      },
      {
        title: "Data-Driven",
        body: "Campaign decisions are based on performance data and measurable outcomes.",
        proof: { kind: "process", step: 5 },
      },
      {
        title: "Continuous Optimization",
        body: "Paid advertising requires ongoing refinement. We monitor and optimize campaigns rather than treating setup as a one-time task.",
        proof: { kind: "process", step: 6 },
      },
      {
        title: "Transparent Reporting",
        body: "You should understand where your advertising budget is going and what the campaigns are producing.",
        proof: { kind: "addOn", name: "Monthly Reporting" },
      },
      {
        title: "Business-Focused",
        body: "Clicks are not the final goal. We focus on meaningful actions such as leads, sales, bookings and other agreed conversions.",
        proof: { kind: "addOn", name: "Conversion Tracking Setup" },
      },
      {
        title: "Flexible",
        body: "Campaigns can be scaled according to business requirements, market conditions and advertising budgets.",
        proof: { kind: "pricing" },
        featured: true,
      },
    ],
  },

  process: {
    heading: "Google Ads Management Process",
    steps: [
      {
        title: "Discover",
        body: "We understand your business, products/services, target audience, locations and advertising objectives.",
      },
      {
        title: "Research",
        body: "We research keywords, competitors, search intent and relevant audience opportunities.",
      },
      { title: "Strategy", body: "We define campaign structure, targeting, budget allocation and conversion goals." },
      { title: "Setup", body: "We configure campaigns, ad groups, keywords, targeting, ads and tracking." },
      { title: "Launch", body: "Campaigns are reviewed and launched according to the agreed strategy." },
      { title: "Monitor", body: "We monitor important campaign metrics and search behaviour." },
      {
        title: "Optimize",
        body: "We refine keywords, ads, bids, budgets, audiences and other campaign elements based on performance.",
      },
      { title: "Report", body: "You receive clear performance reporting and insights." },
      { title: "Improve", body: "We use campaign data to identify opportunities for ongoing improvement." },
    ],
  },

  investment: {
    heading: "How Much Does Google Ads Management Cost?",
    intro:
      "Google Ads management pricing depends on the number of campaigns, advertising channels, account complexity, targeting requirements and level of ongoing optimization.",
    label: "Typical Management Investment",
    unit: "/month",
    ranges: [
      { label: "Google Ads Starter", min: 150, max: 150, openEnded: true, display: "From $150/month", tier: "google-ads-starter" },
      { label: "Google Ads Growth", min: 299, max: 299, openEnded: true, display: "From $299/month", tier: "google-ads-growth" },
      { label: "Google Ads Performance", min: 499, max: 499, openEnded: true, display: "From $499/month", tier: "google-ads-performance" },
      { label: "Google Ads Enterprise", min: 999, max: 999, openEnded: true, display: "From $999/month", tier: "google-ads-enterprise" },
    ],
    note: "Google Ads Audit: From $100",
    important: {
      label: "Important",
      text: "Google advertising spend is separate from our management fee.",
      closing:
        "Your actual ad budget is paid directly to Google. For larger accounts or higher advertising budgets, we can create a customized management plan.",
    },
  },

  timeline: {
    heading: "How Long Does Google Ads Setup Take?",
    paragraphs: [
      "A basic campaign can typically be prepared within **3–5 business days** after receiving the required information and access.",
      "More complex accounts involving multiple campaigns, Shopping, tracking integrations or extensive research may require **1–2 weeks or more**.",
      "Ongoing optimization continues after launch as performance data becomes available.",
    ],
  },

  faq: {
    heading: "Frequently Asked Questions",
    items: [
      {
        question: "What is Google Ads?",
        answer:
          "Google Ads is Google's paid advertising platform that allows businesses to promote their products and services across Google's advertising network.",
      },
      {
        question: "Do you manage existing Google Ads accounts?",
        answer: "Yes. We can audit, restructure and manage existing campaigns as well as build new accounts.",
      },
      {
        question: "Do you provide Google Ads setup?",
        answer:
          "Yes. Campaign setup, keyword research, ad creation, targeting and basic tracking can be included depending on the package.",
      },
      {
        question: "Is the Google Ads budget included in your pricing?",
        answer:
          "No. Our management fee and your advertising spend are separate.\n\nThe advertising budget is paid directly to Google.",
      },
      {
        question: "How much should I spend on Google Ads?",
        answer:
          "There is no single budget that works for every business. The appropriate budget depends on your industry, competition, target locations, keywords, conversion value and business objectives.\n\nWe can recommend a starting range after reviewing your business and market.",
      },
      {
        question: "Do you guarantee leads or sales?",
        answer:
          "No. We do not guarantee a specific number of leads or sales because campaign results depend on factors including market demand, competition, offer, landing page, pricing and conversion behaviour.",
      },
      { question: "Do you run Search Ads?", answer: "Yes. Search Ads are one of our core Google Ads services." },
      {
        question: "Do you manage Google Shopping?",
        answer:
          "Yes. Shopping campaign management and Merchant Center support can be included depending on your package.",
      },
      {
        question: "Do you manage Performance Max campaigns?",
        answer: "Yes. Performance Max can be used where it makes sense for the business and campaign objectives.",
      },
      {
        question: "Do you provide remarketing?",
        answer:
          "Yes. We can set up and manage remarketing campaigns based on available audience data and campaign requirements.",
      },
      {
        question: "Can you target specific cities?",
        answer: "Yes. Location targeting can be configured around your target service areas.",
      },
      {
        question: "Do you set up conversion tracking?",
        answer:
          "Yes. Conversion tracking setup or review can be included depending on your package and technical requirements.",
      },
      {
        question: "Can you manage YouTube Ads?",
        answer: "Yes. YouTube advertising can be included in larger or customized Google Ads campaigns.",
      },
      {
        question: "How often do you optimize campaigns?",
        answer:
          "Optimization frequency depends on the selected package, account size and campaign activity. Ongoing management includes regular performance review and optimization.",
      },
      {
        question: "Do you provide monthly reports?",
        answer: "Yes. Monthly reporting is included in our ongoing management packages.",
      },
      {
        question: "Can you manage international campaigns?",
        answer:
          "Yes. Campaigns can be structured for local, national or international markets depending on your business requirements.",
      },
      {
        question: "Do you work with international clients?",
        answer: "Yes. SKY Tech works with businesses in Pakistan, the USA, the UK and beyond.",
      },
    ],
  },

  closing: {
    kicker: "Ready to Turn Searches Into Opportunities?",
    heading: "Let's Put Your Business in Front of the Right Customers.",
    body: "Whether you are launching your first Google Ads campaign or looking to improve an existing account, SKY Tech can help build and manage a paid advertising strategy around your business goals.",
    promise: "Better targeting. Smarter optimization. More measurable advertising.",
    primaryCta: "Get a Free Google Ads Consultation",
    secondaryCta: "Request a Campaign Audit",
  },
};
