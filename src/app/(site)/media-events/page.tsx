import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site";
import EventsHero from "@/components/events/EventsHero";
import EventsSwitch from "@/components/events/EventsSwitch";
import CorporatePanel from "@/components/events/CorporatePanel";
import WeddingsPanel from "@/components/events/WeddingsPanel";
import EventsClosing from "@/components/events/EventsClosing";

/* Offers are read from the database, so this page is rendered per request
   rather than at build time — an offer switched on in the panel appears
   without a deploy. */
export const dynamic = "force-dynamic";

export const metadata: Metadata = pageMetadata({
  title: "Media & Event | Corporate Events & Wedding Packages | SKY Tech",
  description:
    "Event planning, management and media production in Karachi — conferences, launches and graduations, plus wedding packages with published prices from PKR 35,000.",
  /* No "event videography" here. That is the service page's term — see
     /services/event-photography-video — and the two pages spent the whole
     of their overlap bidding against each other for it. This page is the
     division: who runs the event, and what the packages cost. */
  keywords:
    "event management Karachi, corporate event planners Pakistan, wedding packages Karachi, event management company Pakistan, conference management, wedding photography prices Karachi",
  path: "/media-events",
});

export default function MediaEventsPage() {
  return (
    <>
      <EventsHero />
      <EventsSwitch corporate={<CorporatePanel />} weddings={<WeddingsPanel />} />
      <EventsClosing />
    </>
  );
}
