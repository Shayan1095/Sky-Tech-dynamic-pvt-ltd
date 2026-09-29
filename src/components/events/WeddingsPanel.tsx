import Link from "next/link";
import {
  EVENT_SERVICE,
  ADD_ONS,
  BOOKING_NOTES,
  CELEBRATIONS,
  COMBINED,
  SINGLE_EVENT,
  pkr,
  type Package,
} from "@/lib/media-events";
import { FRAME, INSET, Arrow, H2, Words } from "@/components/service/parts";
import Offer from "@/components/shared/Offer";

/* The weddings half.

   The prices are the most useful thing in either deck and most of the trade
   hides them, so they lead. The source deck gives each package a full page
   with the same four equipment icons and the same nine add-ons repeated on
   every one; here the packages are a row each and the add-ons appear once
   underneath, which is where nearly all of the length went.

   Each package's full feature list is a <details>. The content stays in the
   HTML — indexed, findable, one click away — without fourteen lines per
   package deciding the height of the page. No JavaScript: the browser has
   done this since before we had frameworks. */

/* `budget`, not `package`.

   The contact form reads `package` only for the Services page's combination
   builder, where it is a label for a bundle the visitor assembled and there
   is no single service behind it. A named tier is a different thing: it is
   `budget`, matched against the packages of the service in `service`. Sent as
   `package` it was read by nothing — somebody clicked Walima and the form
   they arrived at had never heard of it.

   The tier names here are the ones in the contact schema, so each arrives
   chosen rather than typed. */
const enquiryHref = (name: string) =>
  `/contact?type=package&service=${encodeURIComponent(EVENT_SERVICE)}&budget=${encodeURIComponent(name)}#contact-form`;

function PackageRow({ pack, tone = "bg" }: { pack: Package; tone?: "bg" | "feature" }) {
  const featured = tone === "feature";
  return (
    <div
      className={`relative isolate ${
        featured
          ? "rounded-[20px] border border-cta/35 bg-navy px-6 py-7 text-white shadow-[0_2px_6px_rgb(18_18_18/0.06),0_40px_80px_-48px_rgb(11_31_53/0.55)] sm:px-8"
          : "border-b border-dotted border-text/20 py-7"
      }`}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-3">
        <div className="min-w-0">
          <h3
            className={`font-display text-xl font-semibold leading-tight sm:text-2xl ${
              featured ? "text-white" : "text-text"
            }`}
          >
            {pack.name}
            {featured && (
              <span className="ml-3 align-middle font-mono text-[10px] uppercase tracking-[0.18em] text-cta">
                Best value
              </span>
            )}
          </h3>
          <p
            className={`mt-1.5 text-[0.9rem] ${featured ? "text-white/70" : "text-text/70"}`}
          >
            {pack.coverage}
          </p>
        </div>

        <p className="shrink-0">
          <span
            className={`font-mono text-2xl font-medium leading-none sm:text-[1.75rem] ${
              featured ? "text-white" : "text-text"
            }`}
          >
            {pkr(pack.price)}
          </span>
        </p>
      </div>

      <details className="group mt-5">
        <summary
          className={`inline-flex cursor-pointer list-none items-center gap-2.5 font-mono text-[10.5px] uppercase tracking-[0.18em] transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-4 ${
            featured
              ? "text-cta hover:text-white focus-visible:outline-cta"
              : "text-primary hover:text-navy focus-visible:outline-primary"
          }`}
        >
          <span className="group-open:hidden">
            What&rsquo;s included ({pack.features.length})
          </span>
          <span className="hidden group-open:inline">Hide details</span>
          <span
            aria-hidden="true"
            className="grid h-4 w-4 place-items-center transition-transform duration-300 group-open:rotate-45"
          >
            <span className="absolute h-px w-3 bg-current" />
            <span className="h-3 w-px bg-current" />
          </span>
        </summary>

        <ul
          className={`mt-5 border-t border-dotted sm:columns-2 sm:gap-x-10 ${
            featured ? "border-white/20" : "border-text/20"
          }`}
        >
          {pack.features.map((f) => (
            <li
              key={f}
              className={`flex items-baseline gap-3 border-b border-dotted py-2.5 text-[0.9rem] leading-snug sm:break-inside-avoid ${
                featured ? "border-white/20 text-white/85" : "border-text/20 text-text/85"
              }`}
            >
              <span aria-hidden="true" className="mt-[0.45em] h-[4px] w-[4px] shrink-0 rotate-45 bg-cta" />
              <span className="[text-wrap:pretty]">{f}</span>
            </li>
          ))}
        </ul>
      </details>

      <div className="mt-6">
        <Link
          href={enquiryHref(pack.name)}
          className={`group/cta relative isolate inline-flex min-h-[48px] items-center justify-between gap-3 overflow-hidden rounded-full py-1.5 pl-5 pr-1.5 text-[12px] font-semibold uppercase tracking-[0.1em] [transition:scale_140ms_cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-2 focus-visible:outline-offset-4 active:scale-[0.97] ${
            featured
              ? "bg-white text-navy focus-visible:outline-cta"
              : "bg-primary text-white focus-visible:outline-primary"
          }`}
        >
          <span
            aria-hidden="true"
            className={`absolute inset-0 -z-10 origin-left scale-x-0 transition-transform duration-500 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover/cta:scale-x-100 group-focus-visible/cta:scale-x-100 ${
              featured ? "bg-cta" : "bg-navy"
            }`}
          />
          <span>
            Enquire
            <span className="sr-only"> about the {pack.name} package</span>
          </span>
          <span
            aria-hidden="true"
            className={`flex h-9 w-9 items-center justify-center rounded-full ${
              featured ? "bg-navy/10" : "bg-white/15"
            }`}
          >
            <Arrow className="transition-transform duration-500 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover/cta:translate-x-0.5" />
          </span>
        </Link>
      </div>
    </div>
  );
}

export default function WeddingsPanel() {
  return (
    <>
      {/* ------------------------------------------------- the packages */}
      <section
        id="weddings"
        aria-labelledby="weddings-heading"
        className="sky-anchor relative isolate overflow-x-clip bg-bg"
      >
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className={`h-full border-x border-dotted border-text/[0.16] ${FRAME}`} />
        </div>

        <div className={`relative ${FRAME}`}>
          <div className={`py-20 sm:py-24 lg:py-28 ${INSET}`}>
            <div className="flex items-center justify-between gap-6">
              <p className="flex items-center gap-3">
                <span aria-hidden="true" className="block h-px w-8 bg-primary" />
                <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-primary sm:text-xs">
                  Wedding packages
                </span>
              </p>
              <span className="shrink-0 font-mono text-[11px] uppercase tracking-[0.18em] text-text/65">
                Prices Published
              </span>
            </div>

            <h2 id="weddings-heading" className={`mt-7 max-w-3xl ${H2}`}>
              <Words text="What it costs, before you ask." />
            </h2>

            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-text/80 [text-wrap:pretty]">
              Every package below is a full price for a full day&rsquo;s
              coverage — photographer, videographer, the edit and the gallery.
              Add-ons are listed underneath at their own prices, so a quote is
              something you can work out yourself before you call.
            </p>

            <Offer service="Weddings" className="mt-8" />

            {/* One ceremony */}
            <h3 className="mt-14 font-mono text-[11px] uppercase tracking-[0.2em] text-text/65">
              One ceremony
            </h3>
            <div className="mt-2 border-t border-dotted border-text/20">
              {SINGLE_EVENT.map((pack) => (
                <PackageRow key={pack.slug} pack={pack} />
              ))}
            </div>

            {/* Booked together */}
            <h3 className="mt-16 font-mono text-[11px] uppercase tracking-[0.2em] text-text/65">
              Booked together
            </h3>
            <div className="mt-6 grid gap-6 lg:grid-cols-2 lg:items-start">
              {COMBINED.map((pack) => (
                <PackageRow key={pack.slug} pack={pack} tone={pack.feature ? "feature" : "bg"} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------- celebrations */}
      <section
        id="celebrations"
        aria-labelledby="celebrations-heading"
        className="sky-anchor relative isolate overflow-x-clip bg-[color-mix(in_srgb,var(--color-navy)_4%,var(--color-bg))]"
      >
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className={`h-full border-x border-dotted border-text/[0.16] ${FRAME}`} />
        </div>

        <div className={`relative ${FRAME}`}>
          <div className={`py-20 sm:py-24 lg:py-28 ${INSET}`}>
            <p className="flex items-center gap-3">
              <span aria-hidden="true" className="block h-px w-8 bg-primary" />
              <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-primary sm:text-xs">
                Celebrations
              </span>
            </p>

            <h2 id="celebrations-heading" className={`mt-7 max-w-3xl ${H2}`}>
              <Words text="The nights around the wedding." />
            </h2>

            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-text/80 [text-wrap:pretty]">
              Priced by how many people are coming rather than by how long it
              runs, because that is what decides the room, the decor and the
              catering.
            </p>

            <div className="mt-14 space-y-16">
              {CELEBRATIONS.map((celebration) => (
                <div key={celebration.slug}>
                  <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2 border-b border-dotted border-text/20 pb-4">
                    <h3 className="font-display text-xl font-semibold sm:text-2xl">
                      {celebration.name}
                    </h3>
                    <p className="text-[0.92rem] text-text/75 [text-wrap:pretty]">
                      {celebration.note}
                    </p>
                  </div>

                  <div className="mt-6 grid gap-5 lg:grid-cols-3">
                    {celebration.tiers.map((tier) => (
                      <div
                        key={tier.tier}
                        className="flex flex-col rounded-[18px] border border-text/[0.14] bg-bg px-6 py-6 shadow-[0_1px_2px_rgb(18_18_18/0.04)]"
                      >
                        <p className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-primary">
                          {tier.tier}
                        </p>
                        <p className="mt-3 font-mono text-xl font-medium leading-none sm:text-2xl">
                          {pkr(tier.price)}
                        </p>
                        <p className="mt-2 text-[0.85rem] text-text/70">{tier.guests}</p>

                        <ul className="mt-5 border-t border-dotted border-text/20">
                          {tier.features.map((f) => (
                            <li
                              key={f}
                              className="flex items-baseline gap-3 border-b border-dotted border-text/20 py-2.5 text-[0.88rem] leading-snug text-text/85"
                            >
                              <span
                                aria-hidden="true"
                                className="mt-[0.45em] h-[4px] w-[4px] shrink-0 rotate-45 bg-cta"
                              />
                              <span className="[text-wrap:pretty]">{f}</span>
                            </li>
                          ))}
                        </ul>

                        <div className="mt-6 pt-1">
                          <Link
                            href={enquiryHref(`${celebration.name} — ${tier.tier}`)}
                            className="group/t inline-flex items-center gap-2.5 font-mono text-[10.5px] uppercase tracking-[0.18em] text-primary transition-colors duration-300 hover:text-navy focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
                          >
                            Enquire
                            <span className="sr-only">
                              {" "}
                              about {celebration.name} {tier.tier}
                            </span>
                            <Arrow className="transition-transform duration-500 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover/t:translate-x-1" />
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------ add-ons */}
      <section
        aria-labelledby="addons-heading"
        className="relative isolate overflow-x-clip bg-bg"
      >
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className={`h-full border-x border-dotted border-text/[0.16] ${FRAME}`} />
        </div>

        <div className={`relative ${FRAME}`}>
          <div className={`py-20 sm:py-24 ${INSET}`}>
            <div className="grid gap-x-16 gap-y-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)]">
              <div>
                <p className="flex items-center gap-3">
                  <span aria-hidden="true" className="block h-px w-8 bg-primary" />
                  <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-primary sm:text-xs">
                    Add-ons
                  </span>
                </p>
                <h2 id="addons-heading" className={`mt-7 ${H2}`}>
                  <Words text="Add what you want." />
                </h2>
                <p className="mt-6 max-w-md text-base leading-relaxed text-text/80 [text-wrap:pretty]">
                  The same prices on every package above. Nothing here is
                  bundled in to pad a total — if you do not want a drone, you do
                  not pay for one.
                </p>
              </div>

              <ul className="border-t border-dotted border-text/20">
                {ADD_ONS.map((addon) => (
                  <li
                    key={addon.name}
                    className="flex items-baseline gap-4 border-b border-dotted border-text/20 py-3.5"
                  >
                    <span className="text-[0.95rem] text-text/85">{addon.name}</span>
                    <span
                      aria-hidden="true"
                      className="mx-1 hidden h-px flex-1 self-center border-b border-dotted border-text/25 sm:block"
                    />
                    <span className="ml-auto shrink-0 font-mono text-[0.92rem] text-text sm:ml-0">
                      {pkr(addon.price)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* The deck's "more ways to make it special", as small print —
                because the packages are the offer and these are the terms. */}
            <dl className="mt-16 grid gap-x-10 gap-y-6 border-t border-dotted border-text/20 pt-10 sm:grid-cols-2 lg:grid-cols-4">
              {BOOKING_NOTES.map((note) => (
                <div key={note.title}>
                  <dt className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-text/65">
                    {note.title}
                  </dt>
                  <dd className="mt-2 text-[0.9rem] leading-snug text-text/80 [text-wrap:pretty]">
                    {note.note}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>
    </>
  );
}
