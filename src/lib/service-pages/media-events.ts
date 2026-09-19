import { SERVICE_ADDONS } from "./addons";
import type { ServicePage } from "./types";

/* Transcribed verbatim from src/content/services/media-events.md.

   Resolved against the file:
   - The detailed package sections are the source; the summary table
     appended at the end (Event Photography $500–$1,500…) is not used, as on
     Web Development. Prices are US dollars, one-off.
   - The hero's secondary CTA is the content's own "Get a Free Quote".
   - The ten specialist sections are the page's capabilities, shown as tabs.
     Corporate Event Coverage's "Photography + Videography + …" line is read
     as a list; Event Social Media Coverage's "Ideal For" sentence is that
     tab's note.
   - The cost section has no introduction in the content; its "Event pricing
     depends on" list sits under the chart.
   - The timeline figure is the content's advance-booking guidance for
     larger events. The content names no tools, so there is no technology
     band. */
export const MEDIA_EVENTS: ServicePage = {
  slug: "media-events",
  contactName: "Media & Events",

  hero: {
    label: "Media & Events Services",
    h1: "We Capture the Moment. You Make the Impact.",
    accentWords: 4,
    subheadline:
      "From event planning and production to professional photography, videography and live coverage, we help businesses create memorable events and powerful content.",
    primaryCta: "Plan Your Event",
    secondaryCta: "Get a Free Quote",
    timeline: { label: "Advance planning for larger events", value: "2–6 weeks" },
  },

  problem: {
    heading: "Your Event Deserves More Than a Few Photos",
    paragraphs: [
      "An event is more than what happens on the day.",
      "It is an opportunity to ==bring people together==, ==showcase your brand==, ==create experiences== and ==generate content that continues to work long after the event is over==.",
      "At SKY Tech, we provide integrated **media and event services** for businesses, organizations and brands.",
      "From corporate conferences and seminars to product launches, exhibitions, workshops and social events, we can support the event journey from planning and production to professional coverage and post-event content.",
    ],
  },

  offerings: {
    heading: "What We Offer",
    items: [
      {
        title: "Event Planning & Coordination",
        body: "Plan and coordinate the essential elements of your event for a smooth and organized experience.",
        fit: { tier: "full-event-production" },
      },
      {
        title: "Event Production",
        body: "Support the technical and visual production requirements of your event.",
        fit: { tier: "full-event-production" },
      },
      {
        title: "Event Photography",
        body: "Professional photography to capture important moments, people, branding and event highlights.",
        fit: { tier: "event-essentials" },
      },
      {
        title: "Event Videography",
        body: "Professional video coverage that captures the atmosphere, activities and key moments of your event.",
        fit: { tier: "event-pro" },
      },
      {
        title: "Corporate Event Coverage",
        body: "Complete media coverage for conferences, seminars, meetings, workshops and corporate gatherings.",
        fit: { tier: "event-pro" },
      },
      {
        title: "Product Launch Coverage",
        body: "Capture product launches with professional photography, video and social media content.",
        fit: { tier: "event-premium" },
      },
      {
        title: "Conference & Seminar Coverage",
        body: "Document speakers, presentations, audience interactions, networking and key moments.",
        fit: { tier: "event-pro" },
      },
      {
        title: "Exhibition & Activation Coverage",
        body: "Capture brand activations, exhibitions, stalls, customer interactions and promotional activities.",
        fit: { tier: "event-premium" },
      },
      {
        title: "Live Streaming",
        body: "Stream eligible events to online audiences through supported platforms.",
        fit: { addOn: "Live Streaming" },
      },
      {
        title: "Social Media Event Coverage",
        body: "Create real-time content for social media throughout your event.",
        fit: { addOn: "Same-Day Content" },
      },
      {
        title: "Event Highlights",
        body: "Produce short highlight videos and visual recaps that capture the most important moments.",
        fit: { addOn: "Event Highlight Video" },
      },
      {
        title: "Post-Event Content",
        body: "Repurpose event footage and photography into social media content and marketing assets.",
        fit: { addOn: "Social Media Reel" },
      },
      {
        title: "Event Branding",
        body: "Support the visual presentation of your event through branded backdrops, signage and digital assets.",
        fit: { addOn: "Event Branding Package" },
      },
      {
        title: "Audio-Visual Support",
        body: "Coordinate required audio, video, display and presentation equipment according to event requirements.",
        fit: { tier: "full-event-production" },
      },
    ],
  },

  packages: {
    heading: "Our Media & Events Packages",
    priceLabel: "Starting From",
    tiers: [
      {
        id: "event-essentials",
        name: "Event Essentials",
        bestFor:
          "Small events, workshops, seminars and private business gatherings that need professional documentation.",
        price: "$250",
        includes: [
          "Event photography",
          "Up to 3 hours coverage",
          "Professional camera coverage",
          "Basic event video coverage",
          "30+ edited photographs",
          "30–60 second highlight reel",
          "Basic event branding shots",
          "Online delivery",
        ],
        audience: {
          label: "Recommended For",
          text: "Small businesses, workshops, seminars, networking events and private functions.",
        },
        cta: "Book Event Coverage",
      },
      {
        id: "event-pro",
        name: "Event Pro",
        bestFor: "Corporate and business events that require professional photography and videography.",
        price: "$500",
        includes: [
          "Photography coverage",
          "Videography coverage",
          "Up to 5 hours coverage",
          "75+ edited photographs",
          "1–2 minute highlight video",
          "Speaker & audience coverage",
          "Branding & venue coverage",
          "Event social media content",
          "Professional editing",
          "Online delivery",
        ],
        audience: {
          label: "Recommended For",
          text: "Corporate events, conferences, seminars, launches and business gatherings.",
        },
        cta: "Book Event Pro",
      },
      {
        id: "event-premium",
        name: "Event Premium",
        bestFor: "Large events and important brand occasions requiring comprehensive media coverage.",
        price: "$900",
        includes: [
          "Full event photography",
          "Full event videography",
          "Up to 8 hours coverage",
          "150+ edited photographs",
          "2–3 minute highlight film",
          "Speaker coverage",
          "Audience & networking coverage",
          "Brand activation coverage",
          "Social media content",
          "Short-form video clips",
          "Professional post-production",
          "Event recap content",
          "Online delivery",
        ],
        audience: {
          label: "Recommended For",
          text: "Large corporate events, conferences, product launches, exhibitions and major brand events.",
        },
        cta: "Book Premium Coverage",
      },
      {
        id: "full-event-production",
        name: "Full Event Production",
        bestFor: "Organizations that need event planning, production and media coverage under one service.",
        price: "$1,500",
        includes: [
          "Event planning support",
          "Event coordination",
          "Event branding",
          "Photography",
          "Videography",
          "Event production support",
          "Audio-visual coordination",
          "Stage / backdrop requirements",
          "Social media coverage",
          "Highlight video",
          "Post-event content",
          "Professional editing",
          "Event documentation",
        ],
        audience: {
          label: "Recommended For",
          text: "Corporate events, conferences, launches, exhibitions and organizational events.",
        },
        cta: "Plan My Event",
      },
      {
        id: "custom-event-solution",
        name: "Custom Event Solution",
        bestFor: "Large-scale events or projects with specialized production and media requirements.",
        priceLabel: "Pricing",
        price: "Custom Quote",
        includesLabel: "Can Include",
        includes: [
          "Complete event planning",
          "Event management",
          "Venue coordination",
          "Event branding",
          "Stage & backdrop",
          "Audio-visual production",
          "Photography team",
          "Videography team",
          "Live streaming",
          "Social media team",
          "Event content creation",
          "Interviews",
          "Highlight film",
          "Same-day content",
          "Post-event campaign",
          "Event recap",
          "Complete documentation",
        ],
        audience: {
          label: "Ideal For",
          text: "Corporations, NGOs, organizations, agencies, brands and large-scale events.",
        },
        cta: "Request a Custom Event Plan",
      },
    ],
  },

  capabilities: [
    {
      id: "event-photography",
      title: "Event Photography",
      subtitle: "Every Important Moment, Professionally Captured",
      body: [
        "Professional event photography allows you to document your event and create visual assets that can be used long after the event ends.",
      ],
      listLabel: "We Capture",
      list: [
        "Speakers",
        "Guests",
        "Audience",
        "Networking",
        "Group photographs",
        "Stage moments",
        "Awards",
        "Product displays",
        "Brand activations",
        "Venue details",
        "Behind-the-scenes moments",
        "Candid interactions",
      ],
      priceLabel: "Starting From",
      price: "$150",
      priceNote:
        "Pricing depends on event duration, location, number of photographers and coverage requirements.",
      cta: "Book Event Photography",
    },
    {
      id: "event-videography",
      title: "Event Videography",
      subtitle: "Tell the Story of Your Event Through Video",
      body: ["Video captures the energy and atmosphere of an event in a way that still images cannot."],
      listLabel: "We Can Produce",
      list: [
        "Event coverage videos",
        "Highlight reels",
        "Corporate event videos",
        "Conference recaps",
        "Product launch videos",
        "Interview videos",
        "Testimonial videos",
        "Social media clips",
        "Behind-the-scenes content",
      ],
      priceLabel: "Starting From",
      price: "$200",
      priceNote:
        "Final pricing depends on coverage duration, crew size, equipment and post-production requirements.",
      cta: "Book Event Videography",
    },
    {
      id: "corporate-event-coverage",
      title: "Corporate Event Coverage",
      subtitle: "Professional Coverage for Professional Events",
      body: ["Your corporate events can become valuable brand content."],
      lists: [
        {
          label: "We provide media coverage for",
          items: [
            "Conferences",
            "Seminars",
            "Workshops",
            "Business meetings",
            "Award ceremonies",
            "Networking events",
            "Training sessions",
            "Company celebrations",
            "Annual events",
            "Corporate launches",
          ],
        },
        {
          label: "Coverage Can Include",
          items: ["Photography", "Videography", "Interviews", "Highlights", "Social Content"],
        },
      ],
      cta: "Cover My Corporate Event",
    },
    {
      id: "product-launch-events",
      title: "Product Launch Events",
      subtitle: "Turn Your Launch Into a Content Opportunity",
      body: ["A product launch should create excitement before, during and after the event."],
      lists: [
        {
          label: "We can capture",
          items: [
            "Product reveals",
            "Guest reactions",
            "Product demonstrations",
            "Speaker moments",
            "Brand experiences",
            "Media interactions",
            "Customer engagement",
            "Product photography",
            "Launch highlights",
          ],
        },
        {
          label: "Post-Event Content Can Include",
          items: [
            "Highlight video",
            "Social media reels",
            "Event photographs",
            "Product images",
            "Short interviews",
            "Promotional clips",
          ],
        },
      ],
      cta: "Cover My Product Launch",
    },
    {
      id: "conferences-seminars",
      title: "Conferences & Seminars",
      subtitle: "Capture Knowledge, People & Impact",
      body: [
        "We document conferences and seminars with a focus on both the event experience and the people behind it.",
      ],
      lists: [
        {
          label: "Coverage Includes",
          items: [
            "Keynote speakers",
            "Presentations",
            "Panel discussions",
            "Audience interaction",
            "Networking",
            "Certificates & awards",
            "Sponsor branding",
            "Venue setup",
            "Group photographs",
          ],
        },
        {
          label: "Optional",
          items: [
            "Speaker interviews",
            "Attendee interviews",
            "Highlight video",
            "Social media clips",
            "Live streaming",
          ],
        },
      ],
      cta: "Cover My Conference",
    },
    {
      id: "event-social-media-coverage",
      title: "Event Social Media Coverage",
      subtitle: "Keep Your Audience Connected in Real Time",
      body: [
        "Your event doesn't have to be experienced only by the people in the room.",
        "We can create content throughout your event for your digital audience.",
      ],
      listLabel: "We Can Create",
      list: [
        "Instagram Stories",
        "Facebook Stories",
        "Reels",
        "Event photographs",
        "Short video clips",
        "Speaker highlights",
        "Behind-the-scenes content",
        "Guest interactions",
        "Live updates",
      ],
      note: {
        label: "Ideal For",
        text: "Brands, conferences, launches, exhibitions and events with a strong social media presence.",
      },
      cta: "Get Social Event Coverage",
    },
    {
      id: "live-streaming",
      title: "Live Streaming",
      subtitle: "Bring Your Event to a Wider Audience",
      body: [
        "For events where online participation matters, we can support live streaming setups based on the event requirements and available platforms.",
      ],
      lists: [
        {
          label: "Live Streaming Can Include",
          items: [
            "Camera feeds",
            "Multiple camera setup",
            "Audio integration",
            "Branding overlays",
            "Speaker presentation feed",
            "Online streaming setup",
            "Basic production",
            "Recording of the stream",
          ],
        },
        {
          label: "Ideal For",
          items: ["Conferences", "Webinars", "Seminars", "Corporate events", "Product launches", "Award ceremonies"],
        },
      ],
      priceLabel: "Starting From",
      price: "$300",
      priceNote:
        "Final pricing depends on the number of cameras, event duration, internet requirements and production complexity.",
      cta: "Stream My Event",
    },
    {
      id: "event-branding-production",
      title: "Event Branding & Production",
      subtitle: "Make Your Event Look Like Your Brand",
      body: [
        "The visual environment of an event plays an important role in how attendees experience your brand.",
      ],
      listLabel: "We Can Support",
      list: [
        "Event backdrops",
        "Stage branding",
        "Roll-up banners",
        "Directional signage",
        "Welcome screens",
        "Presentation graphics",
        "Digital displays",
        "Sponsor branding",
        "Branded photo areas",
        "Event materials",
      ],
      closing: "Graphic design and print production can be provided as separate services.",
      cta: "Brand My Event",
    },
    {
      id: "event-interviews-testimonials",
      title: "Event Interviews & Testimonials",
      subtitle: "Turn Your Event Into Long-Term Marketing Content",
      body: ["Events provide a great opportunity to capture authentic conversations and customer experiences."],
      lists: [
        {
          label: "We can produce",
          items: [
            "Speaker interviews",
            "Customer testimonials",
            "Guest interviews",
            "Team interviews",
            "Partner interviews",
            "Short promotional clips",
          ],
        },
        {
          label: "These can later be repurposed for",
          items: [
            "Social media",
            "Website",
            "YouTube",
            "Marketing campaigns",
            "Presentations",
            "Internal communications",
          ],
        },
      ],
      cta: "Capture Event Interviews",
    },
    {
      id: "post-event-content",
      title: "Post-Event Content",
      subtitle: "The Event Ends. Your Content Doesn't Have To.",
      body: ["Your event footage can continue generating value after the event."],
      listLabel: "We can transform event coverage into",
      list: [
        "Highlight videos",
        "Social media reels",
        "Short clips",
        "Photo albums",
        "Speaker clips",
        "Interview clips",
        "Promotional content",
        "Event recap posts",
        "Website content",
      ],
      cta: "Repurpose My Event Content",
    },
  ],

  addOns: {
    heading: "Media & Events Add-ons",
    intro: "",
    columns: ["Add-on Service", "Starting Price"],
    items: SERVICE_ADDONS["Media & Events"],
  },

  why: {
    heading: "What Makes Our Media & Events Service Different?",
    items: [
      {
        title: "One Team",
        body: "Combine event support and media coverage instead of coordinating multiple vendors.",
        proof: { kind: "drawing", drawing: "structure" },
        featured: true,
      },
      {
        title: "Business-Focused",
        body: "We understand that your event is also a branding and communication opportunity.",
        proof: { kind: "process", step: 0 },
      },
      {
        title: "Professional Coverage",
        body: "We focus on capturing the moments, people and details that matter.",
        proof: { kind: "process", step: 4 },
      },
      {
        title: "Content Beyond the Event",
        body: "We help turn event footage into content that can continue to support your marketing.",
        proof: { kind: "process", step: 8 },
      },
      {
        title: "Flexible Packages",
        body: "From a few hours of photography to complete event production, packages can be customized.",
        proof: { kind: "pricing" },
        featured: true,
      },
      {
        title: "Digital-First",
        body: "We can create content specifically for social media, websites and digital campaigns.",
        proof: { kind: "drawing", drawing: "responsive" },
      },
      {
        title: "Brand Consistency",
        body: "Your event visuals and post-event content can be aligned with your brand identity.",
        proof: { kind: "addOn", name: "Event Branding Package" },
      },
    ],
  },

  process: {
    heading: "Our Media & Events Process",
    steps: [
      {
        title: "Discover",
        body: "We understand your event, audience, objectives, location, date and media requirements.",
      },
      { title: "Plan", body: "We create a coverage and production plan based on the event schedule." },
      {
        title: "Prepare",
        body: "We coordinate the required team, equipment, branding and technical requirements.",
      },
      {
        title: "Setup",
        body: "Our team prepares the required equipment and media setup before coverage begins.",
      },
      { title: "Capture", body: "We photograph, record and document the important moments throughout the event." },
      {
        title: "Produce",
        body: "After the event, our team edits photographs, videos and other agreed content.",
      },
      { title: "Review", body: "Where applicable, you review the agreed deliverables." },
      { title: "Deliver", body: "Final photographs, videos and content are delivered in the agreed formats." },
      {
        title: "Repurpose",
        body: "Additional content can be created from the event material for ongoing marketing.",
      },
    ],
  },

  investment: {
    heading: "How Much Do Media & Event Services Cost?",
    intro: "",
    label: "Typical Investment",
    ranges: [
      { label: "Event Essentials", min: 250, max: 250, openEnded: true, display: "From $250", tier: "event-essentials" },
      { label: "Event Pro", min: 500, max: 500, openEnded: true, display: "From $500", tier: "event-pro" },
      { label: "Event Premium", min: 900, max: 900, openEnded: true, display: "From $900", tier: "event-premium" },
      { label: "Full Event Production", min: 1500, max: 1500, openEnded: true, display: "From $1,500", tier: "full-event-production" },
    ],
    note: "Custom Event Solution: Custom Quote",
    important: {
      text: "Event pricing depends on",
      list: [
        "Event duration",
        "Event location",
        "Number of attendees",
        "Number of photographers",
        "Number of videographers",
        "Equipment requirements",
        "Live streaming requirements",
        "Event production",
        "Editing requirements",
        "Deliverables",
        "Travel requirements",
      ],
    },
  },

  timeline: {
    heading: "How Early Should You Book?",
    paragraphs: [
      "For small events, we recommend booking as early as possible to secure availability.",
      "For larger events, conferences, product launches and full production projects, **2–6 weeks or more** of advance planning is recommended where possible.",
      "Large-scale events may require additional preparation for equipment, crew, venue coordination and production.",
    ],
  },

  faq: {
    heading: "Frequently Asked Questions",
    items: [
      {
        question: "What types of events do you cover?",
        answer:
          "We cover corporate events, conferences, seminars, workshops, product launches, exhibitions, networking events, award ceremonies and other business or organizational events.",
      },
      {
        question: "Do you provide both photography and videography?",
        answer:
          "Yes. Photography and videography can be booked separately or combined into an event coverage package.",
      },
      {
        question: "Do you manage events as well as cover them?",
        answer: "Yes. We can provide event planning and production support depending on the selected package.",
      },
      {
        question: "Do you provide live streaming?",
        answer:
          "Yes. Live streaming is available for eligible events and can be included as an add-on or custom event package.",
      },
      {
        question: "Can you cover events for social media?",
        answer: "Yes. We can create photographs, Stories, Reels, short videos and other content during the event.",
      },
      {
        question: "Can you provide same-day content?",
        answer: "Yes. Same-day or rapid-turnaround content can be arranged for selected events.",
      },
      {
        question: "Do you provide event branding?",
        answer:
          "Yes. We can support event branding including backdrops, signage, presentation graphics and other visual materials.",
      },
      {
        question: "Can you cover a full-day event?",
        answer: "Yes. Full-day coverage is available through our Premium or Custom Event packages.",
      },
      {
        question: "Do you provide edited photographs?",
        answer: "Yes. Final photographs are professionally selected and edited according to the agreed package.",
      },
      {
        question: "Do you provide highlight videos?",
        answer: "Yes. Highlight videos can be included in packages or ordered separately.",
      },
      {
        question: "Can you interview speakers or guests?",
        answer: "Yes. Speaker, guest, customer and team interviews can be arranged as part of the media coverage.",
      },
      {
        question: "Can event footage be used for social media?",
        answer: "Yes. We can deliver content specifically formatted for social platforms, subject to the agreed deliverables.",
      },
      {
        question: "Do you provide raw footage?",
        answer:
          "Raw footage can be provided where agreed as part of the project. Storage and transfer requirements may apply.",
      },
      {
        question: "Do you provide drone coverage?",
        answer:
          "Drone coverage may be available depending on location, venue, weather, permissions and applicable requirements.",
      },
      {
        question: "Do you travel for events?",
        answer:
          "Yes. Travel can be arranged for events outside our normal service area. Additional travel costs may apply.",
      },
      {
        question: "Do you guarantee specific event shots?",
        answer:
          "We create a coverage plan around your requirements, but event photography and videography involve live environments and cannot guarantee every spontaneous moment.",
      },
      {
        question: "How long does post-event editing take?",
        answer:
          "Delivery time depends on the volume and complexity of the content. Standard event photographs may take several business days, while highlight films and larger projects may require additional production time.",
      },
      {
        question: "Can you work with our existing event team?",
        answer:
          "Yes. We can coordinate with your event planner, venue, AV team, marketing team or other vendors.",
      },
      {
        question: "Do you work with international clients?",
        answer:
          "Yes. SKY Tech works with businesses and organizations in Pakistan, the USA, the UK and beyond.",
      },
    ],
  },

  closing: {
    kicker: "Let's Make Your Event Worth Remembering.",
    heading: "Plan It. Capture It. Share It.",
    body: "From a small corporate gathering to a large-scale conference or product launch, SKY Tech brings together event support and professional media production to help you create an event that people remember — and content that keeps working afterward.",
    promise: "Professional events. Powerful visuals. Content that lasts beyond the day.",
    primaryCta: "Plan My Event",
    secondaryCta: "Get a Free Quote",
  },
};
