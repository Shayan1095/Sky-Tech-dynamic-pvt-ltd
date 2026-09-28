import OffersForm, { type OfferRow } from "@/components/admin/OffersForm";
import { Page } from "@/components/admin/ui";
import { listOffers, liveCount, offerTargets } from "@/lib/server/offers";

export const dynamic = "force-dynamic";

export default async function OffersPage() {
  const rows = await listOffers();

  const offers: OfferRow[] = rows.map((row) => ({
    id: row.id,
    serviceName: row.serviceName,
    title: row.title,
    body: row.body,
    code: row.code,
    startsAt: row.startsAt,
    endsAt: row.endsAt,
    isActive: row.isActive,
  }));

  const live = liveCount(offers);

  return (
    <Page
      eyebrow="Content"
      title="Offers"
      lead="A promotion attached to a service. It appears on that service's pages and stops showing by itself once its end date passes, so nobody has to remember to take it down."
      actions={
        live > 0 ? (
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-primary">
            {live} showing on the site
          </p>
        ) : undefined
      }
    >
      <OffersForm offers={offers} targets={offerTargets()} />
    </Page>
  );
}
