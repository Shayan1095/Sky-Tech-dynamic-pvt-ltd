import { getOffer } from "@/lib/server/offers";

/* A running promotion, if there is one.

   An async server component, so a page that includes it needs to know nothing
   about offers, the database, or whether either exists — it renders the
   banner or it renders nothing, and the page is the same page either way.

   This is deliberately not the decks' treatment. Their 20% badge is a gold
   rosette with a ribbon, which is print artwork that cannot expire; this is a
   ruled band in the site's own palette that stops appearing the moment the
   offer's window closes. The offer is information, not decoration. */

export default async function Offer({
  service,
  className = "",
}: {
  service: string;
  className?: string;
}) {
  const offer = await getOffer(service);
  if (!offer) return null;

  /* Shown only when there is an end, and only as a date — not a countdown.
     A countdown on a page that is cached and statically served would be wrong
     within the hour. */
  const until = offer.endsAt
    ? offer.endsAt.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })
    : null;

  return (
    <aside
      aria-label="Current offer"
      className={`flex flex-wrap items-center gap-x-5 gap-y-2 rounded-[14px] border border-cta/40 bg-[color-mix(in_srgb,var(--color-cta)_8%,var(--color-bg))] px-5 py-4 ${className}`}
    >
      <span className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-primary">
        Offer
      </span>

      <p className="min-w-0 flex-1 text-[0.95rem] leading-snug text-text/90 [text-wrap:pretty]">
        <span className="font-semibold">{offer.title}</span>
        {offer.body && <span className="text-text/80"> — {offer.body}</span>}
        {until && (
          <span className="text-text/70">
            {" "}
            Until <time dateTime={offer.endsAt!.toISOString()}>{until}</time>.
          </span>
        )}
      </p>

      {offer.code && (
        <span className="shrink-0 rounded-full border border-dashed border-primary/50 px-3.5 py-1.5 font-mono text-[11px] tracking-[0.12em] text-primary">
          {offer.code}
        </span>
      )}
    </aside>
  );
}
