import { SERVICE_ADDONS } from "./addons";
import type { ServicePage } from "./types";

/* Transcribed verbatim from src/content/services/social-media-management.md.

   Resolved against the file:
   - The detailed package sections are the source (Starter, Professional,
     Premium, Custom). The summary table appended at the end reuses Digital
     Marketing's package names and is not used.
   - Packages are priced per month; each lists its "Platforms".
   - The hero's secondary CTA "View Our Work" is omitted until a portfolio
     page exists; "Book a Free Consultation" from the closing section stands
     in for it, as on the other service pages.
   - "Platforms We Manage", "Content We Create", "Social Media Advertising"
     and "Social Media Reporting" are the page's capabilities, shown as tabs.
   - The content gives no delivery timeframe, so the hero's package index
     has no timeline line; the results section is text only. */
export const SOCIAL_MEDIA_MANAGEMENT: ServicePage = {
  slug: "social-media-management",
  contactName: "Social Media Management",

  hero: {
    label: "Social Media Management Services",
    h1: "Social Media That Builds Your Brand & Drives Growth",
    accentWords: 5,
    subheadline:
      "We manage your social media from strategy and content creation to publishing, engagement and performance tracking — so your brand stays consistent, active and relevant.",
    primaryCta: "Get a Free Social Media Audit",
    secondaryCta: "Book a Free Consultation",
  },

  problem: {
    heading: "Your Brand Shouldn't Be Invisible Online",
    paragraphs: [
      "Having a social media page isn't enough.",
      "Your audience expects businesses to be ==active==, ==professional== and ==relevant== — but consistently planning, creating, publishing and managing content takes time.",
      "At SKY Tech, we take care of your social media presence from strategy to execution.",
      "We combine creative content, strategic planning, community engagement and performance tracking to help your brand build visibility, trust and meaningful connections with its audience.",
    ],
  },

  offerings: {
    heading: "What We Offer",
    items: [
      {
        title: "Social Media Strategy",
        body: "A clear content and growth strategy based on your business, audience, industry and goals.",
        fit: { addOn: "Social Media Strategy & Audit" },
      },
      {
        title: "Content Creation",
        body: "Professional social media graphics, carousels, promotional posts, reels and other content designed around your brand.",
        fit: { tier: "professional" },
      },
      {
        title: "Caption & Copywriting",
        body: "Clear, engaging captions and social copy that communicate your message and encourage action.",
        fit: { tier: "starter" },
      },
      {
        title: "Content Planning",
        body: "Monthly content calendars that keep your social presence organized, consistent and purposeful.",
        fit: { tier: "starter" },
      },
      {
        title: "Page Management",
        body: "We manage your social media pages, publishing schedule, content and day-to-day presence.",
        fit: { tier: "starter" },
      },
      {
        title: "Community Management",
        body: "Respond to comments, messages and audience interactions to help build stronger relationships.",
        fit: { addOn: "Community Management" },
      },
      {
        title: "Reels & Short-Form Content",
        body: "Short-form video content designed to capture attention and increase engagement.",
        fit: { addOn: "Reel / Short Video" },
      },
      {
        title: "Social Media Advertising",
        body: "Paid campaigns designed to reach targeted audiences and support awareness, leads, traffic or conversions.",
        fit: { addOn: "Paid Ad Campaign Setup" },
      },
      {
        title: "Analytics & Reporting",
        body: "Track performance and identify what content, platforms and campaigns are producing the strongest results.",
        fit: { tier: "professional" },
      },
      {
        title: "Profile Optimization",
        body: "Improve your profile structure, bio, highlights, information and overall brand presentation.",
        fit: { addOn: "Social Media Profile Optimization" },
      },
    ],
  },

  packages: {
    heading: "Our Social Media Management Packages",
    priceLabel: "Starting From",
    tiers: [
      {
        id: "starter",
        name: "Starter",
        bestFor: "Small businesses, startups and professionals who need a consistent social media presence.",
        price: "$299/month",
        includes: [
          "Up to 3 social media platforms",
          "12 posts per month",
          "Content strategy",
          "Monthly content calendar",
          "Branded graphic posts",
          "Caption writing",
          "Hashtag strategy",
          "Basic page management",
          "Basic community engagement",
          "Monthly performance report",
        ],
        techLabel: "Platforms",
        tech: ["Facebook", "Instagram", "LinkedIn"],
        audience: {
          label: "Recommended For",
          text: "Small businesses, consultants, freelancers, startups and local brands.",
        },
        cta: "Start My Social Media",
      },
      {
        id: "professional",
        name: "Professional",
        bestFor: "Growing businesses that want stronger content, engagement and consistent audience growth.",
        price: "$499/month",
        includes: [
          "Up to 4 social media platforms",
          "20 posts per month",
          "Content strategy",
          "Monthly content calendar",
          "Branded graphics & carousels",
          "Caption & copywriting",
          "Reels / short-form content",
          "Community management",
          "Comment & message engagement",
          "Profile optimization",
          "Basic social media advertising management",
          "Analytics & monthly performance report",
          "Monthly strategy review",
        ],
        techLabel: "Platforms",
        tech: ["Facebook", "Instagram", "LinkedIn", "TikTok"],
        audience: {
          label: "Recommended For",
          text: "Growing SMEs, service businesses, agencies, restaurants, retailers and established brands.",
        },
        cta: "Grow My Social Presence",
      },
      {
        id: "premium",
        name: "Premium",
        bestFor:
          "Brands that want an active, professionally managed social media presence with content, engagement and paid campaigns working together.",
        price: "$799/month",
        includes: [
          "Up to 5 social media platforms",
          "30 posts per month",
          "Advanced content strategy",
          "Monthly content calendar",
          "Premium branded graphics",
          "Carousels & promotional creatives",
          "Reels / short-form video content",
          "Caption & copywriting",
          "Community management",
          "Comment & message engagement",
          "Full page optimization",
          "Paid social media campaign management",
          "Audience targeting",
          "Campaign optimization",
          "Performance analytics",
          "Detailed monthly report",
          "Monthly strategy consultation",
        ],
        techLabel: "Platforms",
        tech: ["Facebook", "Instagram", "LinkedIn", "TikTok", "X"],
        audience: {
          label: "Recommended For",
          text: "Established businesses, e-commerce brands, organizations and companies looking for a complete social media growth solution.",
        },
        cta: "Scale My Social Media",
      },
      {
        id: "custom-social-media-management",
        name: "Custom Social Media Management",
        bestFor:
          "Brands with larger teams, multiple locations, high content volume or specialized social media requirements.",
        priceLabel: "Pricing",
        price: "Custom Quote",
        includesLabel: "Can Include",
        includes: [
          "Multiple social platforms",
          "High-volume content production",
          "Advanced content strategy",
          "Custom campaign planning",
          "Reels & short-form video",
          "Influencer campaign coordination",
          "Community management",
          "Social media advertising",
          "Lead generation campaigns",
          "Social media campaigns",
          "Advanced analytics",
          "Competitor monitoring",
          "Monthly strategy sessions",
          "Dedicated account management",
        ],
        audience: {
          label: "Ideal For",
          text: "Large businesses, e-commerce brands, multi-location businesses, organizations and campaigns requiring a customized social media operation.",
        },
        cta: "Request a Custom Plan",
      },
    ],
  },

  capabilities: [
    {
      id: "platforms-we-manage",
      title: "Platforms We Manage",
      body: [
        "We don't believe every business needs to be everywhere.",
        "We help you focus on the platforms where your target audience actually spends time.",
      ],
      items: [
        {
          title: "Facebook",
          body: "Build your community, promote your services and reach targeted audiences through organic and paid content.",
        },
        { title: "Instagram", body: "Visual storytelling, reels, carousels, product content and community engagement." },
        {
          title: "LinkedIn",
          body: "Professional brand positioning, thought leadership, B2B content and business-focused campaigns.",
        },
        { title: "TikTok", body: "Short-form video content and campaigns designed to reach new audiences." },
        { title: "X", body: "Real-time brand communication, updates, conversations and audience engagement." },
      ],
    },
    {
      id: "content-we-create",
      title: "Content We Create",
      body: [
        "Your social media should not feel like the same post repeated every week.",
        "We create a balanced content mix based on your brand and goals.",
      ],
      items: [
        { title: "Educational Content", body: "Tips, insights, how-to content and industry information." },
        { title: "Promotional Content", body: "Products, services, offers, launches and special campaigns." },
        { title: "Engagement Content", body: "Questions, polls, conversations and interactive posts." },
        {
          title: "Brand Content",
          body: "Behind-the-scenes content, company culture, team stories and brand messaging.",
        },
        { title: "Social Proof", body: "Testimonials, reviews, case studies and customer experiences." },
        { title: "Product Content", body: "Product features, benefits, demonstrations and use cases." },
        { title: "Short-Form Video", body: "Reels and other short-form videos designed to capture attention." },
      ],
    },
    {
      id: "social-media-advertising",
      title: "Social Media Advertising",
      subtitle: "Reach More of the Right People",
      body: [
        "Organic content builds your presence. Paid advertising can help you reach targeted audiences faster.",
      ],
      lists: [
        {
          label: "We can manage paid campaigns for",
          items: [
            "Brand awareness",
            "Website traffic",
            "Lead generation",
            "Product promotion",
            "Conversions",
            "Retargeting",
            "Customer acquisition",
          ],
        },
        {
          label: "Advertising Management Includes",
          items: [
            "Audience research",
            "Campaign setup",
            "Ad creative direction",
            "Targeting",
            "Campaign monitoring",
            "A/B testing",
            "Optimization",
            "Performance reporting",
          ],
        },
      ],
      note: {
        label: "Note",
        text: "Advertising spend paid to platforms such as Meta, LinkedIn or TikTok is separate from SKY Tech's management fee.",
      },
      cta: "Start a Paid Campaign",
    },
    {
      id: "social-media-reporting",
      title: "Social Media Reporting",
      body: ["You shouldn't have to guess whether your social media is working."],
      lists: [
        {
          label: "Depending on your package, we track relevant metrics such as",
          items: [
            "Reach",
            "Impressions",
            "Engagement",
            "Follower growth",
            "Profile visits",
            "Website traffic",
            "Leads",
            "Content performance",
            "Campaign performance",
            "Audience insights",
          ],
        },
      ],
      closing: "We use these insights to identify what should be continued, improved or changed.",
    },
  ],

  addOns: {
    heading: "Social Media Add-ons",
    intro: "",
    columns: ["Add-on Service", "Starting Price"],
    items: SERVICE_ADDONS["Social Media Management"],
  },

  why: {
    heading: "What Makes Our Social Media Management Different?",
    items: [
      {
        title: "Strategy Before Posting",
        body: "We don't believe in posting just to fill a calendar. Every content piece should have a purpose.",
        proof: { kind: "process", step: 2 },
        featured: true,
      },
      {
        title: "Content Built Around Your Brand",
        body: "Your social media should look and sound like your business — not like a generic template.",
        proof: { kind: "drawing", drawing: "custom" },
      },
      {
        title: "Consistent Brand Presence",
        body: "We maintain consistency across your visuals, messaging, tone and publishing schedule.",
        proof: { kind: "process", step: 3 },
      },
      {
        title: "Creative + Performance",
        body: "We combine creative content with analytics so your social media isn't just attractive — it becomes measurable.",
        proof: { kind: "process", step: 7 },
      },
      {
        title: "Audience-Focused",
        body: "We create content for the people you want to reach, not simply for algorithms.",
        proof: { kind: "process", step: 0 },
      },
      {
        title: "One Team",
        body: "Strategy, design, content, social media management and advertising can all be handled under one roof.",
        proof: { kind: "drawing", drawing: "structure" },
        featured: true,
      },
      {
        title: "Transparent Reporting",
        body: "You know what was published, how it performed and what we're planning next.",
        proof: { kind: "addOn", name: "Social Media Strategy & Audit" },
      },
    ],
  },

  process: {
    heading: "Our Social Media Management Process",
    steps: [
      {
        title: "Discover",
        body: "We understand your business, audience, competitors, brand voice and objectives.",
      },
      {
        title: "Audit",
        body: "We review your existing social profiles, content, engagement and overall digital presence.",
      },
      {
        title: "Strategize",
        body: "We define the right platforms, content pillars, posting strategy and growth priorities.",
      },
      {
        title: "Plan",
        body: "We create a monthly content calendar aligned with your business goals and campaigns.",
      },
      {
        title: "Create",
        body: "Our team develops graphics, captions, carousels, reels and other required content.",
      },
      { title: "Review", body: "Content goes through an approval process before publishing." },
      {
        title: "Publish & Engage",
        body: "We publish according to the agreed schedule and manage audience interactions.",
      },
      {
        title: "Measure & Optimize",
        body: "We analyze performance and use the data to improve the next month's strategy.",
      },
    ],
  },

  investment: {
    heading: "How Much Does Social Media Management Cost?",
    intro:
      "Our pricing depends on the number of platforms, content volume, level of management and advertising requirements.",
    label: "Typical Investment",
    unit: "/month",
    ranges: [
      { label: "Starter", min: 299, max: 299, openEnded: true, display: "From $299/month", tier: "starter" },
      { label: "Professional", min: 499, max: 499, openEnded: true, display: "From $499/month", tier: "professional" },
      { label: "Premium", min: 799, max: 799, openEnded: true, display: "From $799/month", tier: "premium" },
    ],
    note: "Custom Management: Custom Quote",
    important: {
      text: "Paid advertising budgets are separate from our management fees.",
    },
  },

  timeline: {
    heading: "How Long Does It Take to See Results?",
    paragraphs: [
      "Social media growth is a continuous process rather than an overnight result.",
      "Some campaigns can generate engagement, traffic or leads quickly, while building a strong organic audience and consistent brand presence takes time.",
      "Our approach is focused on building sustainable visibility, improving content performance and learning from real audience data rather than promising unrealistic follower or engagement numbers.",
    ],
  },

  relatedAddOns: {
    "Meta Ads": "Paid Ad Campaign Setup",
  },

  faq: {
    heading: "Frequently Asked Questions",
    items: [
      {
        question: "What platforms do you manage?",
        answer: "We manage Facebook, Instagram, LinkedIn, TikTok and X, depending on your package and target audience.",
      },
      {
        question: "Do you create the content or do I need to provide it?",
        answer:
          "We can handle content creation end-to-end, including strategy, graphics, captions, carousels and short-form content according to the selected package.",
      },
      {
        question: "Can you manage my existing social media pages?",
        answer:
          "Yes. We can take over existing social profiles, review their current performance and develop a strategy for ongoing management.",
      },
      {
        question: "Do you create reels?",
        answer:
          "Yes. Reels and short-form video content can be included depending on the selected package and content requirements.",
      },
      {
        question: "Do you respond to comments and messages?",
        answer:
          "Community management is included in selected packages. The exact level of engagement depends on the package and agreed scope.",
      },
      {
        question: "Do you run Facebook and Instagram ads?",
        answer:
          "Yes. We can manage paid social campaigns including audience targeting, campaign setup, optimization and reporting.",
      },
      {
        question: "Is the advertising budget included?",
        answer: "No. Advertising spend paid directly to platforms is separate from SKY Tech's management fee.",
      },
      {
        question: "Can you manage LinkedIn for B2B businesses?",
        answer:
          "Yes. LinkedIn can be an important channel for B2B brands, professional services and companies targeting decision-makers.",
      },
      {
        question: "Do you guarantee followers or viral content?",
        answer:
          "No. We don't promise artificial follower numbers or guaranteed virality. Our focus is on relevant audiences, quality content and measurable business outcomes.",
      },
      {
        question: "How often will you post?",
        answer: "Posting frequency depends on your package. Our standard plans include 12, 20 or 30 posts per month.",
      },
      {
        question: "Can I approve content before it is published?",
        answer: "Yes. Content can be shared for client review and approval as part of the agreed workflow.",
      },
      {
        question: "Do you provide monthly reports?",
        answer: "Yes. Ongoing management packages include performance reporting appropriate to the selected package.",
      },
      {
        question: "Can you manage multiple brands or locations?",
        answer: "Yes. Multi-brand and multi-location social media management can be handled through a customized plan.",
      },
      {
        question: "Do you work with international clients?",
        answer: "Yes. SKY Tech works with businesses in Pakistan, the USA, the UK and beyond.",
      },
    ],
  },

  closing: {
    kicker: "Ready to Build a Stronger Social Presence?",
    heading: "Let's Make Your Brand Impossible to Ignore.",
    body: "Your audience is already online. Let's make sure your brand shows up with the right content, the right message and a strategy that supports your business goals.",
    promise: "Strategy. Content. Engagement. Growth. — All under one roof.",
    primaryCta: "Get a Free Social Media Audit",
    secondaryCta: "Book a Free Consultation",
  },
};
