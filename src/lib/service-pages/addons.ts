/* Each service's add-ons, worded and priced exactly as in its content file.

   Kept in this small module — rather than inside the full page data — because
   three places need it: the service page's quote builder, the contact form
   (which shows the chosen add-ons back to the visitor) and the contact
   server action (which accepts only add-ons on this list). The contact page
   should not have to load every service page's copy to check a name. */

export type AddOn = { name: string; price: string };

export const SERVICE_ADDONS: Record<string, readonly AddOn[]> = {
  "Web Development": [
    { name: "SEO Optimization", price: "$150" },
    { name: "UI/UX Design", price: "$200" },
    { name: "Payment Gateway Integration", price: "$100" },
    { name: "Domain & Hosting Setup", price: "$100" },
    { name: "Website Maintenance", price: "$100/month" },
    { name: "Content Writing", price: "Custom Quote" },
    { name: "Additional Pages", price: "Custom Quote" },
    { name: "API Integration", price: "Custom Quote" },
    { name: "Website Redesign", price: "Custom Quote" },
  ],
  "UI/UX Design": [
    { name: "UX Audit", price: "$200" },
    { name: "User Flow", price: "$100" },
    { name: "Wireframing", price: "$150" },
    { name: "Interactive Prototype", price: "$150" },
    { name: "Design System", price: "$250" },
    { name: "Additional Screen", price: "$50" },
    { name: "Mobile Responsive Adaptation", price: "$100" },
    { name: "Developer Handoff", price: "$100" },
    { name: "Usability Review", price: "$150" },
    { name: "Design Consultation", price: "$75/hour" },
  ],
  "Website Maintenance": [
    { name: "Website Audit", price: "$75" },
    { name: "Emergency Bug Fix", price: "$75" },
    { name: "Malware Cleanup", price: "$100" },
    { name: "Website Migration", price: "$75" },
    { name: "Performance Optimization", price: "$100" },
    { name: "Security Hardening", price: "$100" },
    { name: "Backup Setup", price: "$50" },
    { name: "SSL Setup", price: "$30" },
    { name: "Content Update", price: "$25" },
    { name: "Additional Development Hour", price: "$30" },
    { name: "Database Optimization", price: "$75" },
    { name: "Website Recovery", price: "$100" },
    { name: "SEO Technical Check", price: "$100" },
  ],
  "Hosting & Domain": [
    { name: "Domain Setup", price: "$20" },
    { name: "Domain Transfer", price: "$30" },
    { name: "DNS Configuration", price: "$30" },
    { name: "SSL Setup", price: "$30" },
    { name: "Business Email Setup", price: "$50" },
    { name: "Website Migration", price: "$75" },
    { name: "WordPress Installation", price: "$40" },
    { name: "Backup Setup", price: "$50" },
    { name: "Website Security Setup", price: "$75" },
    { name: "Hosting Optimization", price: "$75" },
    { name: "Additional Website Setup", price: "$50" },
    { name: "Hosting Troubleshooting", price: "$50" },
    { name: "Emergency Migration", price: "Custom Quote" },
  ],
  "Digital Marketing": [
    { name: "SEO Optimization", price: "$150" },
    { name: "Google Ads Setup", price: "$150" },
    { name: "PPC Management", price: "Custom Quote" },
    { name: "Social Media Advertising", price: "$200/month" },
    { name: "Lead Generation", price: "$300/month" },
    { name: "Email Marketing", price: "$200/month" },
    { name: "Marketing Automation", price: "$250" },
    { name: "Conversion Optimization", price: "$200" },
    { name: "Analytics & Tracking Setup", price: "$100" },
    { name: "Marketing Audit", price: "$100" },
  ],
  "Social Media Management": [
    { name: "Additional Platform", price: "$49/month" },
    { name: "Social Media Strategy & Audit", price: "$199" },
    { name: "Additional Social Posts", price: "Custom Quote" },
    { name: "Reel / Short Video", price: "Custom Quote" },
    { name: "Paid Ad Campaign Setup", price: "$100" },
    { name: "Paid Ad Management", price: "Custom Quote" },
    { name: "Social Media Profile Optimization", price: "$100" },
    { name: "Community Management", price: "Custom Quote" },
    { name: "Influencer Campaign Management", price: "Custom Quote" },
    { name: "Social Media Reporting", price: "Included in packages" },
  ],
  "Google Ads": [
    { name: "Google Ads Audit", price: "$100" },
    { name: "Campaign Setup", price: "$100" },
    { name: "Keyword Research", price: "$75" },
    { name: "Ad Copywriting", price: "$50" },
    { name: "Conversion Tracking Setup", price: "$100" },
    { name: "Landing Page Audit", price: "$100" },
    { name: "Remarketing Setup", price: "$75" },
    { name: "Google Shopping Setup", price: "$150" },
    { name: "Merchant Center Setup", price: "$100" },
    { name: "Additional Campaign", price: "$75" },
    { name: "Monthly Reporting", price: "$50" },
    { name: "Competitor PPC Research", price: "$100" },
  ],
  "Meta Ads": [
    { name: "Meta Ads Audit", price: "$100" },
    { name: "Campaign Setup", price: "$100" },
    { name: "Audience Research", price: "$75" },
    { name: "Ad Copywriting", price: "$50" },
    { name: "Ad Creative Design", price: "$25" },
    { name: "Video Ad Editing", price: "$50" },
    { name: "Conversion Tracking Setup", price: "$100" },
    { name: "Pixel / Event Review", price: "$75" },
    { name: "Retargeting Setup", price: "$75" },
    { name: "Catalog Setup", price: "$150" },
    { name: "Additional Campaign", price: "$75" },
    { name: "Landing Page Audit", price: "$100" },
    { name: "Competitor Ad Research", price: "$100" },
    { name: "Monthly Reporting", price: "$50" },
  ],
  "Content Writing": [
    { name: "Additional Blog Article", price: "$75" },
    { name: "Keyword Research", price: "$50" },
    { name: "Content Strategy", price: "$150" },
    { name: "Website Content Audit", price: "$100" },
    { name: "Content Editing", price: "$30" },
    { name: "Proofreading", price: "$25" },
    { name: "Meta Title & Description", price: "$15/page" },
    { name: "Product Description", price: "$15/product" },
    { name: "Landing Page Copy", price: "$100" },
    { name: "Email Copy", price: "$50/email" },
    { name: "Company Profile", price: "$100" },
    { name: "Content Calendar", price: "$100" },
    { name: "Competitor Content Analysis", price: "$100" },
  ],
  "Graphic Design": [
    { name: "Additional Social Media Design", price: "$15" },
    { name: "Additional Revision Round", price: "$25" },
    { name: "Logo Design", price: "$100" },
    { name: "Brand Guidelines", price: "$150" },
    { name: "Business Card Design", price: "$30" },
    { name: "Flyer Design", price: "$30" },
    { name: "Brochure Design", price: "$75" },
    { name: "Poster Design", price: "$40" },
    { name: "Presentation Design", price: "$15/slide" },
    { name: "Infographic Design", price: "$50" },
    { name: "YouTube Thumbnail", price: "$15" },
    { name: "Packaging Design", price: "$100" },
    { name: "Banner Design", price: "$30" },
    { name: "Custom Illustration", price: "$50" },
  ],
  "Video Editing & Production": [
    { name: "Additional Revision", price: "Custom Quote" },
    { name: "Subtitles / Captions", price: "$15" },
    { name: "Motion Graphics", price: "$30" },
    { name: "Thumbnail Design", price: "$20" },
    { name: "Short-Form Cut from Long Video", price: "$25" },
    { name: "Social Media Format Adaptation", price: "$20" },
    { name: "Voiceover Integration", price: "$25" },
    { name: "Advanced Color Grading", price: "$50" },
    { name: "Audio Cleanup", price: "$20" },
    { name: "Scriptwriting", price: "$50" },
    { name: "Storyboarding", price: "$75" },
    { name: "Additional Video Version", price: "Custom Quote" },
  ],
  "Media & Events": [
    { name: "Additional Photography Hour", price: "$50" },
    { name: "Additional Videography Hour", price: "$75" },
    { name: "Additional Photographer", price: "$100" },
    { name: "Additional Videographer", price: "$150" },
    { name: "Event Highlight Video", price: "$150" },
    { name: "Social Media Reel", price: "$50" },
    { name: "Event Interview", price: "$75" },
    { name: "Live Streaming", price: "$300" },
    { name: "Same-Day Content", price: "$150" },
    { name: "Event Backdrop Design", price: "$75" },
    { name: "Event Branding Package", price: "$150" },
    { name: "Photo Booth / Branded Photo Area", price: "Custom Quote" },
    { name: "Drone Coverage", price: "Custom Quote" },
    { name: "Additional Video Editing", price: "$75" },
    { name: "Rush Delivery", price: "Custom Quote" },
  ],
  /* The content lists these add-ons without prices, so each is quoted on
     request until prices are confirmed. */
  "WordPress Development": [
    { name: "SEO Optimization", price: "Custom Quote" },
    { name: "UI/UX Design", price: "Custom Quote" },
    { name: "Payment Gateway Integration", price: "Custom Quote" },
    { name: "Domain & Hosting Setup", price: "Custom Quote" },
    { name: "WordPress Maintenance", price: "Custom Quote" },
    { name: "Website Migration", price: "Custom Quote" },
    { name: "Speed Optimization", price: "Custom Quote" },
    { name: "Security Optimization", price: "Custom Quote" },
    { name: "Additional Pages", price: "Custom Quote" },
    { name: "Custom Plugin Development", price: "Custom Quote" },
    { name: "API Integration", price: "Custom Quote" },
  ],
};

/* A stable id for an add-on: its name, lower-cased and hyphenated. */
export const addOnId = (name: string) =>
  name
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

/* The add-ons carried in a link (?addons=A|B) or a form field, kept only if
   each is a real add-on of that service. Anything unrecognised is dropped,
   so nothing arbitrary from a URL or a tampered POST reaches the enquiry. */
export const ADDON_SEPARATOR = "|";
export const MAX_ADDONS = 12;

export function readAddOns(service: string, raw: string | null | undefined): AddOn[] {
  const known = SERVICE_ADDONS[service];
  if (!known || !raw) return [];
  const asked = new Set(raw.split(ADDON_SEPARATOR).map((s) => s.trim()).slice(0, MAX_ADDONS));
  return known.filter((a) => asked.has(a.name));
}
