import { SERVICE_ADDONS } from "./addons";
import type { ServicePage } from "./types";

/* Transcribed verbatim from src/content/services/meta-ads.md.

   Resolved against the file:
   - The detailed package sections are the source; the summary tables
     appended at the end agree on the prices and are not used.
   - The four management packages are priced per month and each carries the
     content's "Ad spend is separate." The fifth, the Meta Ads Audit, is a
     one-off $100; its opening lines stand as its "Best For" and its closing
     line as its note.
   - The problem section's second and third paragraphs are set as one
     statement; the three things the content set in bold form its board.
   - The nine specialist sections and "Key Meta Ads Metrics We Monitor" are
     the page's capabilities, shown as tabs in one band. In "Facebook &
     Instagram Advertising" the placements sentence, split across a heading
     in the source, is read as the list's label.
   - The cost chart plots the monthly management packages; the one-off audit
     is given as the section's closing line. */
export const META_ADS: ServicePage = {
  slug: "meta-ads",
  contactName: "Meta Ads",

  hero: {
    label: "Meta Ads Management Services",
    h1: "Turn Attention Into Leads, Sales & Growth",
    accentWords: 4,
    subheadline:
      "We create, manage and optimize Facebook and Instagram advertising campaigns designed to reach the right audience, generate meaningful actions and grow your business.",
    primaryCta: "Get a Free Meta Ads Consultation",
    secondaryCta: "Request a Campaign Audit",
    timeline: { label: "Basic campaign preparation", value: "3–5 business days" },
  },

  problem: {
    heading: "Your Customers Are Already on Social Media",
    paragraphs: [
      "Your potential customers are scrolling through Facebook and Instagram every day.",
      "The opportunity isn't simply to reach more people. It's to reach ==the right people== with ==the right message== at ==the right stage of their journey==.",
      "At SKY Tech, we create and manage Meta advertising campaigns focused on measurable business objectives — from lead generation and website traffic to product sales, engagement and remarketing.",
      "We combine audience strategy, creative testing, campaign optimization and conversion tracking to build advertising campaigns around your business goals.",
    ],
  },

  offerings: {
    heading: "What We Offer",
    items: [
      {
        title: "Facebook Ads",
        body: "Create targeted advertising campaigns to reach relevant audiences and generate leads, sales or engagement.",
        fit: { tier: "meta-ads-starter" },
      },
      {
        title: "Instagram Ads",
        body: "Build visually engaging campaigns designed specifically for Instagram audiences and formats.",
        fit: { tier: "meta-ads-starter" },
      },
      {
        title: "Lead Generation Campaigns",
        body: "Generate leads through website forms, instant forms and other conversion-focused campaigns.",
        fit: { tier: "meta-ads-growth" },
      },
      {
        title: "Sales & Conversion Campaigns",
        body: "Promote products and services with campaigns designed to drive purchases and valuable customer actions.",
        fit: { tier: "meta-ads-performance" },
      },
      {
        title: "Traffic Campaigns",
        body: "Drive relevant users to your website, landing pages, products or other destinations.",
        fit: { tier: "meta-ads-starter" },
      },
      {
        title: "Engagement Campaigns",
        body: "Increase interactions with content, posts, videos and other brand assets.",
        fit: { tier: "meta-ads-starter" },
      },
      {
        title: "Retargeting",
        body: "Reconnect with people who have already visited your website, engaged with your content or interacted with your business.",
        fit: { addOn: "Retargeting Setup" },
      },
      {
        title: "Audience Research",
        body: "Identify relevant audience segments based on your business, customers, interests and available first-party data.",
        fit: { addOn: "Audience Research" },
      },
      {
        title: "Custom & Lookalike Audiences",
        body: "Build audience strategies using available customer or engagement data where appropriate.",
        fit: { tier: "meta-ads-growth" },
      },
      {
        title: "Ad Creative Strategy",
        body: "Plan creative concepts, formats, messaging and variations for testing.",
        fit: { addOn: "Ad Creative Design" },
      },
      {
        title: "Ad Copywriting",
        body: "Create compelling primary text, headlines and calls-to-action aligned with campaign objectives.",
        fit: { addOn: "Ad Copywriting" },
      },
      {
        title: "Campaign Optimization",
        body: "Monitor performance and continuously improve audiences, creatives, budgets and campaign structure.",
        fit: { tier: "meta-ads-growth" },
      },
      {
        title: "Pixel & Conversion Tracking",
        body: "Set up or review Meta Pixel and relevant conversion tracking to help measure campaign results.",
        fit: { addOn: "Pixel / Event Review" },
      },
    ],
  },

  packages: {
    heading: "Our Meta Ads Packages",
    priceLabel: "Starting From",
    tiers: [
      {
        id: "meta-ads-starter",
        name: "Meta Ads Starter",
        bestFor: "Small businesses and startups launching Facebook and Instagram advertising for the first time.",
        price: "$150/month",
        includes: [
          "Meta Ads account review / setup",
          "1–2 campaigns",
          "Audience research",
          "Basic targeting",
          "Ad copy",
          "Up to 3 ad variations",
          "Facebook & Instagram placements",
          "Basic conversion setup",
          "Basic retargeting strategy",
          "Monthly performance report",
          "Basic optimization",
        ],
        audience: {
          label: "Recommended For",
          text: "Local businesses, startups, freelancers and small service businesses.",
        },
        note: "Ad spend is separate.",
        cta: "Start My Meta Ads",
      },
      {
        id: "meta-ads-growth",
        name: "Meta Ads Growth",
        bestFor: "Businesses that want consistent lead generation, traffic or sales from Facebook and Instagram.",
        price: "$299/month",
        includes: [
          "Full campaign management",
          "Up to 4 campaigns",
          "Audience research",
          "Custom audience strategy",
          "Retargeting",
          "Lookalike audience strategy where applicable",
          "Up to 6 ad variations",
          "Ad copywriting",
          "Creative recommendations",
          "Conversion tracking review",
          "Budget optimization",
          "A/B testing",
          "Ongoing optimization",
          "Monthly reporting",
        ],
        audience: {
          label: "Recommended For",
          text: "Growing businesses, service companies, e-commerce brands and local businesses.",
        },
        note: "Ad spend is separate.",
        cta: "Grow With Meta Ads",
      },
      {
        id: "meta-ads-performance",
        name: "Meta Ads Performance",
        bestFor:
          "Businesses with established campaigns that need more advanced testing, optimization and performance management.",
        price: "$499/month",
        includes: [
          "Full Meta Ads management",
          "Up to 8 campaigns",
          "Advanced audience strategy",
          "Custom audiences",
          "Lookalike audiences where applicable",
          "Retargeting funnels",
          "Creative testing",
          "Multiple ad variations",
          "Ad copywriting",
          "Campaign segmentation",
          "Conversion tracking",
          "Pixel review",
          "Budget allocation",
          "Bid / optimization strategy",
          "Landing page recommendations",
          "Weekly performance optimization",
          "Detailed monthly reporting",
          "Strategic recommendations",
        ],
        audience: {
          label: "Recommended For",
          text: "Established businesses, e-commerce brands, high-value services and businesses with larger advertising budgets.",
        },
        note: "Ad spend is separate.",
        cta: "Optimize My Meta Ads",
      },
      {
        id: "meta-ads-enterprise",
        name: "Meta Ads Enterprise",
        bestFor: "Businesses running multiple campaigns, products, locations or complex customer journeys.",
        price: "$999/month",
        includes: [
          "Full Meta advertising management",
          "Advanced campaign architecture",
          "Lead generation campaigns",
          "Sales campaigns",
          "Traffic campaigns",
          "Retargeting campaigns",
          "Custom audience strategy",
          "Lookalike audience strategy",
          "Advanced creative testing",
          "Multiple ad sets & variations",
          "Conversion tracking",
          "Pixel & event review",
          "Funnel strategy",
          "Budget allocation",
          "Performance optimization",
          "Creative recommendations",
          "Landing page recommendations",
          "Detailed reporting",
          "Strategic consultation",
        ],
        audience: {
          label: "Ideal For",
          text: "Large businesses, e-commerce brands, organizations and businesses with significant advertising budgets.",
        },
        note: "Ad spend is separate.",
        cta: "Build My Meta Ads Strategy",
      },
      {
        id: "meta-ads-audit",
        name: "Meta Ads Audit",
        bestFor:
          "Already running Facebook or Instagram ads? Before increasing your budget, let's identify what's working, what's not and where your opportunities are.",
        price: "$100",
        includesLabel: "Audit Can Include",
        includes: [
          "Campaign structure",
          "Campaign objectives",
          "Audience targeting",
          "Ad sets",
          "Creatives",
          "Ad copy",
          "Placements",
          "Frequency",
          "Click performance",
          "Conversion tracking",
          "Pixel setup",
          "Retargeting",
          "Budget allocation",
          "Funnel structure",
          "Landing page experience",
          "Creative fatigue",
          "Optimization opportunities",
        ],
        note: "You'll receive actionable recommendations based on the audit findings.",
        cta: "Audit My Meta Ads",
      },
    ],
  },

  capabilities: [
    {
      id: "lead-generation-ads",
      title: "Lead Generation Ads",
      subtitle: "Turn Social Media Attention Into Real Leads",
      body: [
        "If your business depends on enquiries, bookings, consultations or sales conversations, Meta can be a powerful lead-generation channel.",
      ],
      lists: [
        {
          label: "We Can Build Campaigns For",
          items: [
            "Contact form submissions",
            "Instant lead forms",
            "Consultation requests",
            "Booking enquiries",
            "WhatsApp conversations",
            "Phone calls",
            "Service enquiries",
            "Quote requests",
          ],
        },
        {
          label: "Ideal For",
          items: [
            "Agencies",
            "Consultants",
            "Real estate",
            "Education",
            "Professional services",
            "Local businesses",
            "Clinics",
            "Automotive businesses",
            "B2B services",
          ],
        },
      ],
      cta: "Generate More Leads",
    },
    {
      id: "e-commerce-sales-ads",
      title: "E-Commerce & Sales Ads",
      subtitle: "Put Your Products in Front of Potential Buyers",
      body: [
        "For e-commerce brands, we create campaigns designed around the customer journey from discovery to purchase.",
      ],
      lists: [
        {
          label: "We Can Help With",
          items: [
            "Product campaigns",
            "Catalog advertising",
            "Sales campaigns",
            "Retargeting",
            "Product-focused creatives",
            "Audience segmentation",
            "Customer re-engagement",
            "Conversion tracking",
            "Campaign optimization",
          ],
        },
        {
          label: "Ideal For",
          items: [
            "Online stores",
            "Fashion brands",
            "Beauty brands",
            "Food businesses",
            "Retail brands",
            "Product-based businesses",
          ],
        },
      ],
      cta: "Grow My Online Sales",
    },
    {
      id: "facebook-instagram-advertising",
      title: "Facebook & Instagram Advertising",
      subtitle: "One Strategy. Multiple Opportunities.",
      body: [
        "We manage advertising across Meta's platforms based on where your target audience and campaign objectives make the most sense.",
      ],
      items: [
        {
          title: "Facebook",
          body: "Useful for reaching broad audiences, communities and customers across different demographics.",
        },
        {
          title: "Instagram",
          body: "Ideal for visually-led campaigns, products, lifestyle brands and engaging short-form creative.",
        },
      ],
      lists: [
        {
          label: "Depending on campaign requirements, ads may be delivered across relevant Meta placements such as",
          items: ["Feed", "Stories", "Reels", "Explore", "Other eligible placements"],
        },
      ],
      closing: "We select placements based on campaign objectives and performance.",
    },
    {
      id: "retargeting-campaigns",
      title: "Retargeting Campaigns",
      subtitle: "Don't Lose People Who Already Showed Interest",
      body: [
        "Not every customer is ready to take action the first time they see your brand.",
        "Retargeting helps reconnect with people who have already interacted with your business.",
      ],
      lists: [
        {
          label: "Retargeting Audiences Can Include",
          items: [
            "Website visitors",
            "Product viewers",
            "Previous customers",
            "Social media engagers",
            "Video viewers",
            "Lead form interactions",
            "Other eligible audiences",
          ],
        },
        {
          label: "Retargeting Can Support",
          items: [
            "Repeat purchases",
            "Lead generation",
            "Product reminders",
            "Special offers",
            "Customer re-engagement",
            "Conversion campaigns",
          ],
        },
      ],
      cta: "Set Up Retargeting",
    },
    {
      id: "audience-strategy",
      title: "Audience Strategy",
      subtitle: "Reach People Who Are More Likely to Care",
      body: ["Successful Meta campaigns depend heavily on understanding your audience."],
      lists: [
        {
          label: "We can develop audience strategies based on",
          items: [
            "Customer profiles",
            "Location",
            "Demographics",
            "Interests",
            "Behaviours",
            "Website activity",
            "Customer lists",
            "Engagement",
            "Previous interactions",
            "Available first-party data",
          ],
        },
      ],
      closing: "Where appropriate, we can also use custom and lookalike audience strategies.",
    },
    {
      id: "creative-strategy-for-meta-ads",
      title: "Creative Strategy for Meta Ads",
      subtitle: "Better Ads Start With Better Creative",
      body: [
        "Your targeting can be strong, but if the creative doesn't capture attention, people will keep scrolling.",
      ],
      lists: [
        {
          label: "We can develop creative directions around",
          items: [
            "Video ads",
            "Reels",
            "Static graphics",
            "Carousels",
            "Product creatives",
            "Promotional graphics",
            "Testimonial creatives",
            "Educational creatives",
            "Offer-based ads",
          ],
        },
        {
          label: "Creative Testing Can Include",
          items: [
            "Different hooks",
            "Different headlines",
            "Different visuals",
            "Different offers",
            "Different calls-to-action",
            "Different audience angles",
          ],
        },
      ],
      closing: "Graphic design and video production can also be provided through our creative services.",
      cta: "Improve My Ad Creative",
    },
    {
      id: "meta-ads-copywriting",
      title: "Meta Ads Copywriting",
      subtitle: "Give Your Ads a Reason to Be Noticed",
      body: ["We create ad copy based on your audience, offer and campaign objective."],
      lists: [
        {
          label: "Copy Can Include",
          items: [
            "Primary text",
            "Headlines",
            "Descriptions",
            "Calls-to-action",
            "Promotional messaging",
            "Product messaging",
            "Lead-generation messaging",
          ],
        },
        {
          label: "We Focus On",
          items: [
            "Clear value propositions",
            "Strong hooks",
            "Customer pain points",
            "Benefits",
            "Offers",
            "Trust",
            "Action-oriented messaging",
          ],
        },
      ],
    },
    {
      id: "pixel-conversion-tracking",
      title: "Pixel & Conversion Tracking",
      subtitle: "Measure What Your Campaigns Actually Produce",
      body: ["Clicks and reach don't tell the whole story."],
      lists: [
        {
          label: "We can help set up or review conversion tracking for important actions such as",
          items: [
            "Purchases",
            "Lead submissions",
            "Website enquiries",
            "Registration",
            "Booking requests",
            "Add-to-cart actions",
            "Contact actions",
            "Other relevant website events",
          ],
        },
      ],
      closing: "Accurate tracking helps make campaign optimization more meaningful.",
      cta: "Fix My Conversion Tracking",
    },
    {
      id: "landing-page-funnel-recommendations",
      title: "Landing Page & Funnel Recommendations",
      subtitle: "Your Ad Is Only the Beginning",
      body: [
        "When someone clicks your advertisement, the next experience matters.",
        "We can review the journey from advertisement to conversion and identify potential friction points.",
      ],
      lists: [
        {
          label: "We Can Review",
          items: [
            "Ad-to-page message match",
            "Landing page structure",
            "Offer clarity",
            "Call-to-action",
            "Mobile experience",
            "Form experience",
            "Trust signals",
            "Conversion journey",
          ],
        },
      ],
      closing: "Website design, landing page design and development can be provided separately.",
      cta: "Improve My Funnel",
    },
    {
      id: "key-meta-ads-metrics",
      title: "Key Meta Ads Metrics We Monitor",
      body: [],
      lists: [
        {
          label: "Depending on your campaign objective, we can monitor",
          items: [
            "Reach",
            "Impressions",
            "Frequency",
            "Clicks",
            "CTR",
            "CPC",
            "CPM",
            "Leads",
            "Cost Per Lead",
            "Purchases",
            "Conversion Rate",
            "Cost Per Purchase",
            "Conversion Value",
            "ROAS",
            "Engagement",
            "Video Views",
            "Landing Page Views",
          ],
        },
      ],
    },
  ],

  addOns: {
    heading: "Meta Ads Add-on Services",
    intro: "",
    columns: ["Add-on Service", "Starting Price"],
    items: SERVICE_ADDONS["Meta Ads"],
  },

  why: {
    heading: "What Makes Our Meta Ads Management Different?",
    items: [
      {
        title: "Strategy Before Budget",
        body: "We don't simply put money behind a post. We build campaigns around a defined objective.",
        proof: { kind: "process", step: 2 },
        featured: true,
      },
      {
        title: "Audience + Creative",
        body: "We understand that successful Meta advertising requires both the right audience and the right creative.",
        proof: { kind: "addOn", name: "Audience Research" },
      },
      {
        title: "Testing Mindset",
        body: "Different audiences and creatives can behave differently. We use structured testing to identify stronger opportunities.",
        proof: { kind: "process", step: 6 },
      },
      {
        title: "Conversion-Focused",
        body: "We look beyond likes and impressions and focus on meaningful business actions.",
        proof: { kind: "addOn", name: "Conversion Tracking Setup" },
      },
      {
        title: "Continuous Optimization",
        body: "Campaign management doesn't stop after launch. We monitor and improve campaigns over time.",
        proof: { kind: "process", step: 7 },
      },
      {
        title: "Transparent Reporting",
        body: "You receive clear information about campaign performance and where your advertising budget is being used.",
        proof: { kind: "addOn", name: "Monthly Reporting" },
      },
      {
        title: "Full-Funnel Thinking",
        body: "From first interaction to retargeting and conversion, we consider the broader customer journey.",
        proof: { kind: "drawing", drawing: "structure" },
      },
      {
        title: "Creative Support",
        body: "Because creative quality is important to Meta advertising, our graphic design and video services can support your campaigns.",
        proof: { kind: "addOn", name: "Ad Creative Design" },
      },
    ],
  },

  process: {
    heading: "Meta Ads Management Process",
    steps: [
      { title: "Discover", body: "We understand your business, audience, offer, competition and advertising goals." },
      {
        title: "Research",
        body: "We research your audience, market, competitors and available campaign opportunities.",
      },
      {
        title: "Strategy",
        body: "We define campaign objectives, audience structure, creative direction and funnel approach.",
      },
      {
        title: "Setup",
        body: "We configure campaigns, ad sets, audiences, creatives, tracking and relevant settings.",
      },
      { title: "Launch", body: "Campaigns are reviewed and launched according to the agreed strategy." },
      { title: "Monitor", body: "We monitor campaign performance, audience behaviour and creative performance." },
      {
        title: "Test",
        body: "We test different audiences, creatives, messaging and campaign approaches where appropriate.",
      },
      {
        title: "Optimize",
        body: "We adjust budgets, targeting, creatives and campaign structure based on performance.",
      },
      { title: "Report", body: "You receive clear performance reporting and recommendations." },
      {
        title: "Scale",
        body: "When campaigns demonstrate sustainable performance, we identify opportunities to scale responsibly.",
      },
    ],
  },

  investment: {
    heading: "How Much Does Meta Ads Management Cost?",
    intro:
      "Meta Ads management pricing depends on the number of campaigns, audience complexity, creative requirements, advertising objectives and level of ongoing optimization.",
    label: "Typical Management Investment",
    unit: "/month",
    ranges: [
      { label: "Meta Ads Starter", min: 150, max: 150, openEnded: true, display: "From $150/month", tier: "meta-ads-starter" },
      { label: "Meta Ads Growth", min: 299, max: 299, openEnded: true, display: "From $299/month", tier: "meta-ads-growth" },
      { label: "Meta Ads Performance", min: 499, max: 499, openEnded: true, display: "From $499/month", tier: "meta-ads-performance" },
      { label: "Meta Ads Enterprise", min: 999, max: 999, openEnded: true, display: "From $999/month", tier: "meta-ads-enterprise" },
    ],
    note: "Meta Ads Audit: From $100",
    important: {
      label: "Important",
      text: "Your Meta advertising spend is separate from our management fee.",
      closing:
        "The advertising budget is paid directly to Meta. For larger accounts or higher advertising budgets, we can create a customized management plan.",
    },
  },

  timeline: {
    heading: "How Long Does Meta Ads Setup Take?",
    paragraphs: [
      "A basic Meta Ads campaign can typically be prepared within **3–5 business days** after receiving the required information, creative assets and account access.",
      "More complex campaigns involving multiple audiences, funnels, tracking, catalogs or extensive creative testing may require **1–2 weeks or more**.",
      "Ongoing optimization continues after launch as performance data becomes available.",
    ],
  },

  faq: {
    heading: "Frequently Asked Questions",
    items: [
      {
        question: "What are Meta Ads?",
        answer:
          "Meta Ads are paid advertisements delivered across Meta's advertising ecosystem, including Facebook and Instagram.",
      },
      {
        question: "Do you manage Facebook and Instagram Ads?",
        answer:
          "Yes. We manage advertising campaigns across Facebook and Instagram according to the campaign objective and audience.",
      },
      {
        question: "Do you manage existing Meta Ads accounts?",
        answer: "Yes. We can audit, restructure, optimize and manage existing campaigns.",
      },
      {
        question: "Do you set up Meta Ads from scratch?",
        answer:
          "Yes. We can handle campaign structure, audience strategy, ad copy, creative requirements, tracking and launch.",
      },
      {
        question: "Is the advertising budget included in your pricing?",
        answer:
          "No. Our management fee is separate from your advertising budget.\n\nThe advertising budget is paid directly to Meta.",
      },
      {
        question: "How much should I spend on Meta Ads?",
        answer:
          "There isn't one fixed budget for every business.\n\nThe appropriate starting budget depends on your industry, audience size, competition, offer, location and campaign objectives.\n\nWe can recommend a starting approach after reviewing your business.",
      },
      {
        question: "Do you guarantee leads or sales?",
        answer:
          "No. We don't guarantee a specific number of leads or sales because campaign results depend on many factors, including the offer, market demand, creative, landing page, competition and audience behaviour.",
      },
      {
        question: "Can you run lead-generation campaigns?",
        answer:
          "Yes. Lead-generation campaigns can be designed around website forms, instant forms and other relevant conversion actions.",
      },
      {
        question: "Can you run WhatsApp campaigns?",
        answer:
          "Where supported by the account, market and campaign setup, we can create campaigns designed to encourage conversations and enquiries through available messaging destinations.",
      },
      {
        question: "Do you run e-commerce ads?",
        answer: "Yes. We manage sales-focused campaigns for product-based and e-commerce businesses.",
      },
      {
        question: "Do you provide retargeting?",
        answer:
          "Yes. Retargeting strategies can be created for eligible website visitors, product viewers, engagers and other available audiences.",
      },
      {
        question: "Do you create the ad graphics?",
        answer: "Ad creative design can be provided as part of a package or as an additional service.",
      },
      {
        question: "Do you edit video ads?",
        answer:
          "Yes. Video editing for Reels and other ad formats can be provided separately or combined with your advertising package.",
      },
      {
        question: "Do you set up Meta Pixel?",
        answer:
          "Yes. Pixel and conversion tracking setup or review can be included depending on your package and technical requirements.",
      },
      {
        question: "How often do you optimize campaigns?",
        answer:
          "Optimization frequency depends on the package, account activity and campaign complexity. Ongoing management includes regular performance review and optimization.",
      },
      {
        question: "Do you provide monthly reports?",
        answer: "Yes. Monthly reporting is included in our ongoing management packages.",
      },
      {
        question: "Can you target specific cities or countries?",
        answer:
          "Yes. Campaigns can be targeted around relevant locations based on your business requirements and Meta's available targeting options.",
      },
      {
        question: "Can you advertise internationally?",
        answer: "Yes. We can manage campaigns targeting local, national or international markets.",
      },
      {
        question: "Do you work with international clients?",
        answer: "Yes. SKY Tech works with businesses in Pakistan, the USA, the UK and beyond.",
      },
    ],
  },

  closing: {
    kicker: "Ready to Grow With Meta Ads?",
    heading: "Let's Turn Your Social Audience Into Real Business Opportunities.",
    body: "Whether you're launching your first Facebook campaign, generating leads through Instagram or scaling an existing e-commerce campaign, SKY Tech can help build and manage a Meta advertising strategy around your business goals.",
    promise: "Better audiences. Better creative. Smarter optimization. More measurable growth.",
    primaryCta: "Get a Free Meta Ads Consultation",
    secondaryCta: "Request a Campaign Audit",
  },
};
