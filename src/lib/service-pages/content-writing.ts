import { SERVICE_ADDONS } from "./addons";
import type { ServicePage } from "./types";

/* Transcribed verbatim from src/content/services/content-writing.md.

   Resolved against the file:
   - The detailed package sections are the source (Essential, Business, SEO
     Content Growth, Content Pro, Custom). The summary table appended at the
     end (Blog Posts & Articles, Website Copy…) is not used, as on Web
     Development.
   - Essential and Business Content are one-off; SEO Content Growth and
     Content Pro are monthly. The cost chart shows them as the content
     lists them, each with its own unit.
   - The hero's secondary CTA "View Our Work" is omitted until a portfolio
     page exists; "Book a Free Consultation" from the closing section stands
     in for it.
   - The ten specialist sections and "Content Types We Cover" are the
     page's capabilities, shown as tabs in one band.
   - The content names no technologies, so the page has no technology band. */
export const CONTENT_WRITING: ServicePage = {
  slug: "content-writing",
  contactName: "Content Writing",

  hero: {
    label: "Content Writing Services",
    h1: "Content That Connects, Communicates & Converts",
    accentWords: 4,
    subheadline:
      "We create clear, engaging and purposeful content that helps your brand communicate better, attract the right audience and turn attention into action.",
    primaryCta: "Get a Free Content Quote",
    secondaryCta: "Book a Free Consultation",
    timeline: { label: "Simple pages & short-form content", value: "2–4 business days" },
  },

  problem: {
    heading: "Words That Work for Your Business",
    paragraphs: [
      "Good content isn't just about putting words on a page.",
      "It should ==communicate your message clearly==, ==speak to the right audience== and ==support your business goals==.",
      "At SKY Tech, we create strategic content for websites, search engines, social media and marketing campaigns.",
      "Whether you need website copy, SEO blogs, product descriptions, social media content or persuasive marketing copy, we develop content that is written for people first — while keeping business and search visibility in mind.",
    ],
  },

  offerings: {
    heading: "What We Offer",
    items: [
      {
        title: "Website Content Writing",
        body: "Professional website copy that communicates your services, builds credibility and guides visitors toward action.",
        fit: { tier: "essential-content" },
      },
      {
        title: "SEO Content Writing",
        body: "Search-friendly content created around relevant keywords, search intent and your target audience.",
        fit: { tier: "seo-content-growth" },
      },
      {
        title: "Blog Writing",
        body: "Well-researched and engaging blog articles designed to educate your audience and strengthen your online presence.",
        fit: { addOn: "Additional Blog Article" },
      },
      {
        title: "Copywriting",
        body: "Persuasive marketing copy designed to capture attention, communicate value and encourage action.",
        fit: { tier: "business-content" },
      },
      {
        title: "Social Media Content",
        body: "Captions, post copy, campaign messaging and content ideas tailored to your social platforms.",
        fit: { tier: "business-content" },
      },
      {
        title: "Product Descriptions",
        body: "Clear, benefit-focused product descriptions that help customers understand what you're selling.",
        fit: { addOn: "Product Description" },
      },
      {
        title: "Landing Page Copy",
        body: "Conversion-focused content designed to communicate your offer and guide visitors toward a specific action.",
        fit: { addOn: "Landing Page Copy" },
      },
      {
        title: "Email Marketing Content",
        body: "Professional email copy for newsletters, promotions, lead nurturing and customer communication.",
        fit: { addOn: "Email Copy" },
      },
      {
        title: "Company Profiles",
        body: "Professional company and business profiles that communicate your story, services, strengths and positioning.",
        fit: { addOn: "Company Profile" },
      },
      {
        title: "Technical & Business Writing",
        body: "Clear and structured content for technical products, business documents, processes and professional audiences.",
        fit: { tier: "custom-content-partnership" },
      },
      {
        title: "Content Editing & Proofreading",
        body: "Improve clarity, grammar, structure, tone and consistency without losing the original message.",
        fit: { addOn: "Content Editing" },
      },
      {
        title: "Content Strategy",
        body: "Develop a structured content plan based on your audience, business goals, keywords and marketing objectives.",
        fit: { addOn: "Content Strategy" },
      },
    ],
  },

  packages: {
    heading: "Our Content Writing Packages",
    priceLabel: "Starting From",
    tiers: [
      {
        id: "essential-content",
        name: "Essential Content",
        bestFor: "Small businesses and individuals who need professional content for basic business communication.",
        price: "$99",
        includes: [
          "Up to 5 short-form content pieces",
          "Website or marketing copy",
          "Professional tone",
          "Basic keyword integration",
          "Content formatting",
          "Proofreading",
          "1 revision round",
        ],
        audience: { label: "Recommended For", text: "Small businesses, freelancers, startups and professionals." },
        cta: "Start My Content",
      },
      {
        id: "business-content",
        name: "Business Content",
        bestFor: "Businesses that need consistent, professional content across their website and marketing channels.",
        price: "$249",
        includes: [
          "Up to 10 content pieces",
          "Website / marketing copy",
          "SEO-friendly writing",
          "Keyword research",
          "Content structuring",
          "Blog / article content",
          "Social media copy",
          "Proofreading & editing",
          "2 revision rounds",
        ],
        audience: { label: "Recommended For", text: "SMEs, service businesses, agencies and growing brands." },
        cta: "Build My Content",
      },
      {
        id: "seo-content-growth",
        name: "SEO Content Growth",
        bestFor: "Businesses that want consistent search-friendly content to build organic visibility.",
        price: "$399/month",
        includes: [
          "4 SEO blog articles/month",
          "Keyword research",
          "Search intent analysis",
          "SEO-friendly headings",
          "Meta title & description suggestions",
          "Internal linking recommendations",
          "Content optimization",
          "Proofreading",
          "Monthly content planning",
          "Performance recommendations",
        ],
        audience: { label: "Recommended For", text: "Businesses investing in long-term SEO and organic growth." },
        cta: "Grow With SEO Content",
      },
      {
        id: "content-pro",
        name: "Content Pro",
        bestFor: "Businesses that need a complete content solution across their website, SEO and marketing channels.",
        price: "$699/month",
        includes: [
          "8 SEO articles/month",
          "Website content support",
          "Social media copy",
          "Marketing copy",
          "Keyword research",
          "Content strategy",
          "Search intent research",
          "Meta content",
          "Content optimization",
          "Editing & proofreading",
          "Monthly content calendar",
          "Performance review",
        ],
        audience: {
          label: "Recommended For",
          text: "Established businesses, e-commerce brands, agencies and companies with ongoing content requirements.",
        },
        cta: "Scale My Content",
      },
      {
        id: "custom-content-partnership",
        name: "Custom Content Partnership",
        bestFor: "Organizations that require high-volume, specialized or ongoing content production.",
        priceLabel: "Pricing",
        price: "Custom Quote",
        includesLabel: "Can Include",
        includes: [
          "Website content",
          "SEO content",
          "Blog production",
          "Social media copy",
          "Product descriptions",
          "Email campaigns",
          "Landing pages",
          "Sales copy",
          "Company profiles",
          "Technical writing",
          "Content editing",
          "Content strategy",
          "Content calendars",
          "Ongoing content management",
        ],
        audience: {
          label: "Ideal For",
          text: "Large businesses, e-commerce brands, agencies, SaaS companies and organizations with extensive content needs.",
        },
        cta: "Request a Custom Plan",
      },
    ],
  },

  capabilities: [
    {
      id: "website-content-writing",
      title: "Website Content Writing",
      subtitle: "Make Your Website Say the Right Thing",
      body: [
        "Your website has only a few seconds to communicate who you are, what you offer and why someone should choose you.",
        "We create website content that is clear, structured and aligned with your brand.",
      ],
      lists: [
        {
          label: "We Can Write",
          items: [
            "Homepage content",
            "About Us pages",
            "Service pages",
            "Product pages",
            "Landing pages",
            "Industry pages",
            "Location pages",
            "FAQ sections",
            "Company profiles",
            "Website microcopy",
            "Calls-to-action",
          ],
        },
        {
          label: "Our Focus",
          items: [
            "Clear messaging",
            "Brand voice",
            "User-friendly structure",
            "Search visibility",
            "Conversion-focused copy",
            "Strong calls-to-action",
          ],
        },
      ],
      priceLabel: "Starting From",
      price: "$50/page",
      priceNote: "Complex or highly specialized pages are quoted according to scope.",
      cta: "Write My Website",
    },
    {
      id: "seo-content-writing",
      title: "SEO Content Writing",
      subtitle: "Content Designed to Be Found",
      body: [
        "Ranking isn't just about adding keywords.",
        "We create content around what your audience is actually searching for and the information they need.",
      ],
      listLabel: "SEO Content Includes",
      list: [
        "Keyword research",
        "Search intent analysis",
        "Topic research",
        "SEO-friendly structure",
        "Headings & subheadings",
        "Keyword optimization",
        "Internal linking recommendations",
        "Meta title suggestions",
        "Meta description suggestions",
        "Readability optimization",
        "Content optimization",
      ],
      priceLabel: "Starting From",
      price: "$75/article",
      priceNote: "Monthly SEO content packages are available.",
      cta: "Start My SEO Content",
    },
    {
      id: "blog-writing",
      title: "Blog Writing",
      subtitle: "Turn Expertise Into Content",
      body: [
        "A useful blog can educate your audience, build authority and support your SEO strategy.",
        "We create researched and structured blog content around your industry and audience.",
      ],
      listLabel: "Blog Content Can Include",
      list: [
        "How-to articles",
        "Educational blogs",
        "Industry insights",
        "Listicles",
        "Guides",
        "Tutorials",
        "Comparison articles",
        "Thought leadership",
        "Informational content",
        "Business blogs",
      ],
      priceLabel: "Starting From",
      price: "$75/article",
      priceNote: "Pricing depends on word count, research requirements and subject complexity.",
      cta: "Order a Blog",
    },
    {
      id: "copywriting",
      title: "Copywriting",
      subtitle: "Words That Make People Take Action",
      body: [
        "Copywriting is about more than writing beautifully.",
        "It's about communicating value and giving the audience a reason to act.",
      ],
      listLabel: "We Write",
      list: [
        "Landing page copy",
        "Sales copy",
        "Advertisement copy",
        "Promotional copy",
        "Website CTAs",
        "Campaign messaging",
        "Product copy",
        "Email copy",
        "Lead generation copy",
        "Brand messaging",
      ],
      priceLabel: "Starting From",
      price: "$100/project",
      cta: "Get Conversion Copy",
    },
    {
      id: "social-media-content-writing",
      title: "Social Media Content Writing",
      subtitle: "Give Your Social Media Something Worth Saying",
      body: [
        "Strong visuals need strong messaging.",
        "We create captions and social media copy that complement your content and communicate your message clearly.",
      ],
      listLabel: "We Can Create",
      list: [
        "Social media captions",
        "Promotional posts",
        "Educational posts",
        "Engagement posts",
        "Product announcements",
        "Campaign copy",
        "Reel captions",
        "LinkedIn posts",
        "Facebook content",
        "Instagram copy",
      ],
      priceLabel: "Starting From",
      price: "$100/month",
      priceNote: "Social media writing can also be included in our social media management packages.",
      cta: "Get Social Media Copy",
    },
    {
      id: "product-description-writing",
      title: "Product Description Writing",
      subtitle: "Turn Features Into Reasons to Buy",
      body: [
        "Product descriptions should help customers understand what the product does, why it matters and why they should choose it.",
      ],
      listLabel: "We Focus On",
      list: [
        "Product benefits",
        "Key features",
        "Customer pain points",
        "Use cases",
        "Clear structure",
        "Search-friendly wording",
        "Persuasive messaging",
        "Calls-to-action",
      ],
      priceLabel: "Starting From",
      price: "$15/product",
      priceNote: "Bulk product description packages are available.",
      cta: "Write My Product Descriptions",
    },
    {
      id: "email-content",
      title: "Email Content",
      subtitle: "Stay Connected With Your Audience",
      body: [
        "Email gives businesses a direct way to communicate with customers and leads.",
        "We create professional email content for different stages of the customer journey.",
      ],
      listLabel: "We Can Write",
      list: [
        "Newsletters",
        "Promotional emails",
        "Welcome emails",
        "Lead nurturing emails",
        "Product announcements",
        "Customer updates",
        "Re-engagement emails",
        "Follow-up emails",
        "Campaign sequences",
      ],
      priceLabel: "Starting From",
      price: "$50/email",
      cta: "Write My Email Campaign",
    },
    {
      id: "company-profiles-business-documents",
      title: "Company Profiles & Business Documents",
      subtitle: "Present Your Business Professionally",
      body: [
        "Your company profile can influence how customers, partners and potential clients perceive your business.",
      ],
      listLabel: "We create structured professional content for",
      list: [
        "Company profiles",
        "Business proposals",
        "Service brochures",
        "Capability statements",
        "Corporate presentations",
        "Business introductions",
        "About Us content",
        "Organizational profiles",
      ],
      priceLabel: "Starting From",
      price: "$100",
      priceNote: "Final pricing depends on length, research and document requirements.",
      cta: "Write My Company Profile",
    },
    {
      id: "editing-proofreading",
      title: "Editing & Proofreading",
      subtitle: "Make Existing Content Better",
      body: [
        "Already have content but feel it isn't quite right?",
        "We can improve it without changing the core message.",
      ],
      listLabel: "We Can Improve",
      list: [
        "Grammar",
        "Spelling",
        "Sentence structure",
        "Readability",
        "Tone",
        "Consistency",
        "Clarity",
        "Flow",
        "Formatting",
        "Professional presentation",
      ],
      priceLabel: "Starting From",
      price: "$30",
      cta: "Polish My Content",
    },
    {
      id: "content-strategy",
      title: "Content Strategy",
      subtitle: "Don't Just Create Content. Create the Right Content.",
      body: [
        "Before producing large amounts of content, we can help define what should be created and why.",
      ],
      listLabel: "Strategy Can Include",
      list: [
        "Audience research",
        "Content goals",
        "Topic research",
        "Keyword research",
        "Content pillars",
        "Content calendar",
        "Content formats",
        "Distribution strategy",
        "Competitor content analysis",
        "Content priorities",
      ],
      priceLabel: "Starting From",
      price: "$150",
      cta: "Build My Content Strategy",
    },
    {
      id: "content-types-we-cover",
      title: "Content Types We Cover",
      body: [],
      lists: [
        { label: "Website", items: ["Homepage", "About Us", "Services", "Landing Pages", "Product Pages", "FAQs"] },
        { label: "SEO", items: ["Blog Posts", "Articles", "Guides", "Tutorials", "Industry Pages", "Location Pages"] },
        {
          label: "Marketing",
          items: ["Ad Copy", "Sales Copy", "Landing Pages", "Email Campaigns", "Promotional Content"],
        },
        {
          label: "Business",
          items: ["Company Profiles", "Proposals", "Brochures", "Business Documents", "Presentations"],
        },
        {
          label: "E-commerce",
          items: ["Product Descriptions", "Category Content", "Product Guides", "Promotional Copy"],
        },
        {
          label: "Social Media",
          items: ["Captions", "LinkedIn Posts", "Campaign Copy", "Reel Captions", "Promotional Posts"],
        },
      ],
    },
  ],

  addOns: {
    heading: "Content Writing Add-ons",
    intro: "",
    columns: ["Add-on Service", "Starting Price"],
    items: SERVICE_ADDONS["Content Writing"],
  },

  why: {
    heading: "What Makes Our Content Writing Different?",
    items: [
      {
        title: "Audience First",
        body: "We write for real people, not just search engines.",
        proof: { kind: "process", step: 0 },
      },
      {
        title: "Clear & Purposeful",
        body: "Every piece of content should have a clear purpose and message.",
        proof: { kind: "process", step: 2 },
      },
      {
        title: "Brand-Aligned",
        body: "We adapt tone, language and messaging to match your brand.",
        proof: { kind: "drawing", drawing: "custom" },
      },
      {
        title: "SEO-Aware",
        body: "Where SEO is part of the project, we consider keywords, search intent, structure and readability.",
        proof: { kind: "drawing", drawing: "structure" },
        featured: true,
      },
      {
        title: "Human-Centered",
        body: "Our goal is to make content useful, understandable and engaging.",
        proof: { kind: "process", step: 4 },
      },
      {
        title: "Research-Driven",
        body: "We research the subject and audience before writing where the project requires it.",
        proof: { kind: "process", step: 1 },
      },
      {
        title: "Conversion-Focused",
        body: "For marketing content, we focus on communicating value and encouraging the desired action.",
        proof: { kind: "addOn", name: "Landing Page Copy" },
      },
      {
        title: "Consistent",
        body: "Ongoing content follows a consistent voice, style and messaging framework.",
        proof: { kind: "addOn", name: "Content Calendar" },
      },
    ],
  },

  process: {
    heading: "Our Content Writing Process",
    steps: [
      { title: "Discover", body: "We understand your business, audience, goals and required content." },
      {
        title: "Research",
        body: "We research your industry, audience, competitors, topics and relevant keywords where applicable.",
      },
      { title: "Plan", body: "We define the structure, tone, messaging and content direction." },
      { title: "Write", body: "Our writers create the content based on the approved requirements." },
      {
        title: "Edit",
        body: "Content is reviewed for grammar, clarity, consistency, readability and overall quality.",
      },
      {
        title: "Optimize",
        body: "For SEO content, we optimize the structure, keywords, headings and other relevant elements.",
      },
      {
        title: "Review",
        body: "You review the content and provide feedback according to the agreed revision scope.",
      },
      { title: "Deliver", body: "We deliver the finalized content in the required format." },
    ],
  },

  investment: {
    heading: "How Much Does Content Writing Cost?",
    intro:
      "Content pricing depends on the type of content, word count, research requirements, subject complexity and number of deliverables.",
    label: "Typical Investment",
    ranges: [
      { label: "Essential Content", min: 99, max: 99, openEnded: true, display: "From $99", tier: "essential-content" },
      { label: "Business Content", min: 249, max: 249, openEnded: true, display: "From $249", tier: "business-content" },
      { label: "SEO Content Growth", min: 399, max: 399, openEnded: true, display: "From $399/month", tier: "seo-content-growth" },
      { label: "Content Pro", min: 699, max: 699, openEnded: true, display: "From $699/month", tier: "content-pro" },
    ],
    note: "Custom Content Partnership: Custom Quote",
    important: {
      text: "Individual content pieces can also be ordered separately.",
    },
  },

  timeline: {
    heading: "How Long Does Content Writing Take?",
    paragraphs: [
      "Simple website pages, social media copy and short-form content can typically be completed within **2–4 business days**.",
      "Standard blog articles and marketing content may take approximately **3–5 business days**.",
      "Research-heavy, technical or long-form projects may require **5–10+ business days**, depending on complexity.",
      "Large content projects and monthly content retainers follow an agreed production schedule.",
    ],
  },

  faq: {
    heading: "Frequently Asked Questions",
    items: [
      {
        question: "What types of content do you write?",
        answer:
          "We write website content, SEO blogs, articles, marketing copy, social media content, product descriptions, email content, company profiles and business documents.",
      },
      {
        question: "Do you provide SEO content writing?",
        answer:
          "Yes. SEO content can include keyword research, search intent analysis, optimized headings, content structure, metadata recommendations and readability optimization.",
      },
      {
        question: "Can you write content for my website?",
        answer:
          "Yes. We can write complete website content including homepage, About Us, service pages, landing pages, product pages and FAQs.",
      },
      {
        question: "Do you write blog articles?",
        answer:
          "Yes. We create researched blog posts, educational articles, guides, tutorials, industry content and thought-leadership pieces.",
      },
      {
        question: "Can you write product descriptions?",
        answer:
          "Yes. We create clear and persuasive product descriptions focused on features, benefits, customer needs and search visibility.",
      },
      {
        question: "Do you provide copywriting for advertisements?",
        answer: "Yes. We can write copy for digital ads, promotional campaigns, landing pages and other marketing materials.",
      },
      {
        question: "Can you match our existing brand voice?",
        answer: "Yes. We can follow your existing tone, terminology, messaging guidelines and brand voice.",
      },
      {
        question: "Do you provide proofreading and editing?",
        answer:
          "Yes. We can improve existing content for grammar, clarity, structure, tone, readability and consistency.",
      },
      {
        question: "Do you guarantee Google rankings?",
        answer:
          "No. SEO performance depends on many factors beyond content alone, including competition, website authority, technical SEO and search behaviour.",
      },
      {
        question: "Can you write technical content?",
        answer:
          "Yes. Technical and specialized content can be developed based on the available information, subject requirements and research scope.",
      },
      {
        question: "Do you provide monthly content packages?",
        answer:
          "Yes. Monthly packages are available for businesses that need consistent blogs, website content, social media copy or ongoing content support.",
      },
      {
        question: "Can you create content calendars?",
        answer:
          "Yes. Content calendars can be created around your campaigns, audience, platforms, topics and marketing objectives.",
      },
      {
        question: "How many revisions are included?",
        answer:
          "Revision rounds depend on the selected package. The exact number will be mentioned in your proposal before work begins.",
      },
      {
        question: "Do you work with international clients?",
        answer: "Yes. SKY Tech works with businesses in Pakistan, the USA, the UK and beyond.",
      },
    ],
  },

  closing: {
    kicker: "Ready to Put Your Brand Into Words?",
    heading: "Let's Create Content That Works for Your Business.",
    body: "Whether you need a new website, better SEO content, persuasive marketing copy or consistent monthly content, SKY Tech can help you communicate with clarity and purpose.",
    promise: "Clear messaging. Strategic content. Stronger communication. Built around your goals.",
    primaryCta: "Get a Free Content Quote",
    secondaryCta: "Book a Free Consultation",
  },
};
