import Link from "next/link";
import {
  APPROACH,
  categoryFamilies,
  CLIENTS,
  COVERAGE,
  EVENT_CATEGORIES,
  PRODUCTION,
  STRENGTHS,
} from "@/lib/media-events";
import { FRAME, INSET, H2, Words } from "@/components/service/parts";

/* The corporate half.

   The source deck gives each of the fourteen categories a page of its own,
   with five sub-bullets and a repeat of the same "what we cover" list. The
   sub-bullets were nearly all restatements of the category name — "Corporate
   Events: Annual Dinners, Business Meetups, Conferences & Summits" — so they
   are gone and the categories stand as a named grid. The coverage list, which
   was repeated fourteen times, is here once.

   No animation in this panel: it lives inside a switch, and a scroll-driven
   entrance measured while the panel was hidden would be measured against a
   zero-height element. The switch fades the panel in when it is chosen, which
   is the only entrance it needs. */

function SectionHead({
  label,
  count,
  title,
  lede,
}: {
  label: string;
  count?: string;
  title: string;
  lede?: string;
}) {
  return (
    <>
      <div className="flex items-center justify-between gap-6">
        <p className="flex items-center gap-3">
          <span aria-hidden="true" className="block h-px w-8 bg-primary" />
          <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-primary sm:text-xs">
            {label}
          </span>
        </p>
        {count && (
          <span className="shrink-0 font-mono text-[11px] uppercase tracking-[0.18em] text-text/65">
            {count}
          </span>
        )}
      </div>
      <h2 className={`mt-7 ${H2}`}>
        <Words text={title} />
      </h2>
      {lede && (
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-text/80 [text-wrap:pretty]">
          {lede}
        </p>
      )}
    </>
  );
}

export default function CorporatePanel() {
  return (
    <>
      {/* ------------------------------------------------ what we run */}
      <section
        id="corporate-events"
        aria-labelledby="corporate-events-heading"
        className="sky-anchor relative isolate overflow-x-clip bg-bg"
      >
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className={`h-full border-x border-dotted border-text/[0.16] ${FRAME}`} />
        </div>

        <div className={`relative ${FRAME}`}>
          <div className={`py-20 sm:py-24 lg:py-28 ${INSET}`}>
            <div id="corporate-events-heading">
              <SectionHead
                label="What we run"
                count={`${EVENT_CATEGORIES.length} Kinds of Event`}
                title="Complete event solutions, under one roof."
                lede="From planning and production to media coverage and guest management. One team, one point of contact, from the first conversation to the final edit."
              />
            </div>

            {/* Separate tiles, top-aligned, deliberately.

                These were one seamless hairline table, every cell stretched
                to its row. That is right for a table of equal things and
                wrong the moment a cell can open: expanding one category grew
                its whole row, so the two tiles beside it gained a band of
                empty space and appeared to have opened too. Nothing had — but
                what a reader sees is three tiles reacting to one click.

                Each tile now sizes to its own content and carries its own
                border, so opening one moves nothing but the tiles below it in
                the same column. The cost is a visible gap in place of shared
                rules, and the gain is that the control does what it looks
                like it does. It also disposes of the empty fifteenth cell,
                since there is no grid left to leave a hole in.

                Closed, this is a scannable list of what we run; open, it is
                the deck's full sub-list for that category — about seventy
                items across the fourteen, none of which cost the page any
                height until someone asks for them. */}
            {/* Grouped into four families rather than run as one list of
                fourteen. Fourteen equal items is a list to get through; four
                named groups is an answer — a hospital, a university and a
                brand each find their row without reading the other eleven.
                The numbering still runs 01 to 14 across the whole section,
                because it is still fourteen kinds of event. */}
            <div className="mt-14 space-y-12">
              {categoryFamilies().map((family) => (
                <section key={family.id} aria-label={family.label}>
                  <div className="flex items-center gap-5 border-t border-text/[0.16] pt-4">
                    <h3 className="font-mono text-[11px] uppercase tracking-[0.2em] text-primary">
                      {family.label}
                    </h3>
                    <span aria-hidden="true" className="h-px flex-1 bg-text/[0.12]" />
                    <span className="shrink-0 font-mono text-[10.5px] tracking-[0.18em] text-text/65">
                      {String(family.items.length).padStart(2, "0")}
                    </span>
                  </div>

                  {/* Three columns only from xl. Between lg and xl the tiles
                      are 275px wide, which pushes the longest names to a
                      third line and makes them taller than the floor below —
                      two columns there keeps the rows even. */}
                  <ul className="mt-4 grid items-start gap-3 md:grid-cols-2 xl:grid-cols-3">
                    {family.items.map(({ index, category }) => (
                      <li
                        key={category.name}
                        className="overflow-hidden rounded-[14px] border border-text/[0.14] bg-bg transition-colors duration-300 has-[details[open]]:border-primary/25 has-[details[open]]:bg-[color-mix(in_srgb,var(--color-primary)_4%,var(--color-bg))]"
                      >
                        <details className="group">
                          {/* A floor equal to the tallest closed tile. Tiles
                              no longer stretch to their row, so without it a
                              short name sits beside a long one and the row
                              ends at two different heights; with it the
                              closed grid keeps its even rhythm and only an
                              opened tile is taller than its neighbours, which
                              is the one difference that should be visible. */}
                          <summary className="block cursor-pointer list-none px-5 py-5 transition-colors duration-300 hover:bg-[color-mix(in_srgb,var(--color-primary)_5%,var(--color-bg))] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-primary md:min-h-[163px] md:group-open:min-h-0">
                            <span className="flex items-center justify-between gap-4">
                              <span className="font-mono text-[11px] tracking-[0.16em] text-text/65">
                                {String(index + 1).padStart(2, "0")}
                              </span>
                              <span
                                aria-hidden="true"
                                className="relative grid h-3.5 w-3.5 shrink-0 place-items-center text-primary transition-transform duration-300 group-open:rotate-45"
                              >
                                <span className="absolute h-px w-3 bg-current" />
                                <span className="h-3 w-px bg-current" />
                              </span>
                            </span>

                            <span className="mt-4 block font-display text-[1.05rem] font-semibold leading-snug tracking-[-0.01em] text-text [text-wrap:pretty]">
                              {category.name}
                            </span>

                            {/* Two of the things it covers, and how many more
                                there are. A name on its own asks the reader
                                to guess whether their event is inside it;
                                this tells them, and tells them what a click
                                is worth. It steps aside once the tile is
                                open, where the full list says it better.

                                The clamp lives on the inner span: `hidden`
                                and `line-clamp-2` both set `display`, and on
                                one element the wrong one can win. */}
                            <span className="mt-2 block group-open:hidden">
                              <span className="line-clamp-2 text-[0.82rem] leading-snug text-text/65 [text-wrap:pretty]">
                                {category.covers.slice(0, 2).join(" · ")}
                                {category.covers.length > 2 &&
                                  ` · +${category.covers.length - 2} more`}
                              </span>
                            </span>
                          </summary>

                          <ul className="px-5 pb-5">
                            {category.covers.map((item) => (
                              <li
                                key={item}
                                className="flex items-baseline gap-2.5 border-t border-dotted border-text/20 py-2 text-[0.86rem] leading-snug text-text/80"
                              >
                                <span
                                  aria-hidden="true"
                                  className="mt-[0.4em] h-[4px] w-[4px] shrink-0 rotate-45 bg-cta"
                                />
                                <span className="[text-wrap:pretty]">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </details>
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>

            <p className="mt-10 font-mono text-[10.5px] uppercase tracking-[0.16em] text-text/65">
              Open any category to see everything it covers
            </p>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------- on the day */}
      <section
        aria-labelledby="coverage-heading"
        className="relative isolate overflow-x-clip bg-[color-mix(in_srgb,var(--color-navy)_4%,var(--color-bg))]"
      >
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className={`h-full border-x border-dotted border-text/[0.16] ${FRAME}`} />
        </div>

        <div className={`relative ${FRAME}`}>
          <div className={`py-20 sm:py-24 lg:py-28 ${INSET}`}>
            <div className="grid gap-x-16 gap-y-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)]">
              <div id="coverage-heading">
                <SectionHead
                  label="On the day"
                  title="Everything the day needs, handled."
                  lede="The same list whatever the event — it is the work, not the category, that stays constant."
                />
              </div>

              <ul className="border-t border-dotted border-text/20 sm:columns-2 sm:gap-x-10">
                {COVERAGE.map((item) => (
                  <li
                    key={item}
                    className="flex items-baseline gap-3.5 border-b border-dotted border-text/20 py-3 text-[0.95rem] leading-snug text-text/85 sm:break-inside-avoid"
                  >
                    <span
                      aria-hidden="true"
                      className="mt-[0.45em] h-[5px] w-[5px] shrink-0 rotate-45 bg-cta"
                    />
                    <span className="[text-wrap:pretty]">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* --------------------------------------------- media production */}
      <section
        aria-labelledby="production-heading"
        className="relative isolate overflow-hidden bg-navy text-white"
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 [background-image:radial-gradient(70%_55%_at_50%_0%,rgb(0_107_184/0.45),transparent_70%)]"
        />
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className={`h-full border-x border-dotted border-white/15 ${FRAME}`} />
        </div>

        <div className={`relative ${FRAME}`}>
          <div className={`py-20 sm:py-24 lg:py-28 ${INSET}`}>
            <div className="flex items-center justify-between gap-6">
              <p className="flex items-center gap-3">
                <span aria-hidden="true" className="block h-px w-8 bg-cta" />
                <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-cta sm:text-xs">
                  Media &amp; content production
                </span>
              </p>
              <span className="shrink-0 font-mono text-[11px] uppercase tracking-[0.18em] text-white/65">
                {PRODUCTION.length} Outputs
              </span>
            </div>

            <h2 id="production-heading" className={`mt-7 max-w-3xl text-white ${H2}`}>
              <Words text="Capture every moment, share a bigger story." />
            </h2>

            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/85 [text-wrap:pretty]">
              The cameras are ours and they are in the room from the start, so
              the reel that goes out that evening is cut by people who watched
              the day happen rather than by an editor working from someone
              else&rsquo;s footage.
            </p>

            {/* The other direction of the same pair.

                Someone who only wants the cameras — a conference already
                being run by its own people, filmed by us — is on the wrong
                page here, and the right one exists. Said where the reader is
                already reading about the cameras. */}
            <p className="mt-6 max-w-2xl text-[0.95rem] leading-relaxed text-white/70 [text-wrap:pretty]">
              Coverage on its own, for an event you are running yourself, is{" "}
              <Link
                href="/services/event-photography-video"
                className="font-medium text-white underline decoration-white/40 underline-offset-4 transition-colors duration-300 hover:decoration-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cta"
              >
                Event Photography &amp; Video
              </Link>
              .
            </p>

            <ul className="mt-12 grid gap-px border border-white/15 bg-white/15 sm:grid-cols-2 lg:grid-cols-4">
              {PRODUCTION.map((item) => (
                <li
                  key={item}
                  className="bg-navy px-5 py-6 text-[0.95rem] font-medium leading-snug text-white/90 transition-colors duration-300 hover:bg-[color-mix(in_srgb,var(--color-cta)_10%,var(--color-navy))]"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------- how we work */}
      <section
        aria-labelledby="approach-heading"
        className="relative isolate overflow-x-clip bg-bg"
      >
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className={`h-full border-x border-dotted border-text/[0.16] ${FRAME}`} />
        </div>

        <div className={`relative ${FRAME}`}>
          <div className={`py-20 sm:py-24 lg:py-28 ${INSET}`}>
            <div id="approach-heading">
              <SectionHead label="How we work" title="Five steps, every time." />
            </div>

            <ol className="mt-12 grid gap-px border border-text/[0.14] bg-text/[0.14] sm:grid-cols-2 lg:grid-cols-5">
              {APPROACH.map((step) => (
                <li key={step.step} className="bg-bg px-5 py-7">
                  <span className="font-mono text-[11px] tracking-[0.18em] text-primary">
                    {step.step}
                  </span>
                  <h3 className="mt-4 font-display text-lg font-semibold">{step.label}</h3>
                  <p className="mt-2 text-[0.9rem] leading-snug text-text/75 [text-wrap:pretty]">
                    {step.note}
                  </p>
                </li>
              ))}
            </ol>

            {/* ----------------------------------------------- strengths */}
            <div className="mt-20 grid gap-x-16 gap-y-10 border-t border-dotted border-text/20 pt-14 lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1fr)]">
              <div>
                <p className="flex items-center gap-3">
                  <span aria-hidden="true" className="block h-px w-8 bg-primary" />
                  <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-primary sm:text-xs">
                    Why us
                  </span>
                </p>
                <h3 className="mt-6 font-display text-[1.7rem] font-semibold leading-[1.1] tracking-[-0.02em] [text-wrap:balance] sm:text-[2rem]">
                  The room and the cameras, from the same team.
                </h3>
              </div>

              <dl className="grid gap-x-10 gap-y-8 sm:grid-cols-2">
                {STRENGTHS.map((item) => (
                  <div key={item.title}>
                    <dt className="flex items-baseline gap-3 font-display text-[1.02rem] font-semibold">
                      <span
                        aria-hidden="true"
                        className="mt-[0.4em] h-[6px] w-[6px] shrink-0 rotate-45 bg-cta"
                      />
                      {item.title}
                    </dt>
                    <dd className="mt-2 pl-[1.1rem] text-[0.92rem] leading-relaxed text-text/80 [text-wrap:pretty]">
                      {item.note}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* ------------------------------------------------- clients */}
            <div className="mt-20 border-t border-dotted border-text/20 pt-12">
              <p className="flex items-center gap-3">
                <span aria-hidden="true" className="block h-px w-8 bg-primary" />
                <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-primary sm:text-xs">
                  Organisations we have worked with
                </span>
              </p>
              <ul className="mt-7 flex flex-wrap gap-x-3 gap-y-3">
                {CLIENTS.map((client) => (
                  <li
                    key={client}
                    className="rounded-full border border-text/20 px-4 py-2 text-[0.88rem] text-text/85"
                  >
                    {client}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
