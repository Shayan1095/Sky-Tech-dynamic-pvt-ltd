"use client";

import { SERVICE_GROUPS } from "@/lib/contact";
import { useState } from "react";

import { ActionForm } from "@/components/admin/ActionForm";
import { Card, CardTitle, Empty, shortDate } from "@/components/admin/ui";
import { deleteOffer, saveOffer, toggleOffer } from "@/lib/actions/offers";

/* Offers, in the panel.

   One form to add an offer, and a row per existing offer that can be
   switched on, switched off or removed. Switching off is deliberately not
   deleting: a promotion that runs every Ramadan should come back rather than
   be retyped.

   The state of each offer is worked out here rather than stored, so a row
   cannot claim to be live after its own end date has passed. "Scheduled",
   "Live", "Ended" and "Off" are four different things and an operator needs
   to be able to tell them apart at a glance. */

export type OfferRow = {
  id: number;
  serviceName: string;
  title: string;
  body: string;
  code: string;
  startsAt: Date | null;
  endsAt: Date | null;
  isActive: number;
};

/* Four states, not two. The panel's shared Pill renders whatever status
   string it is given and its palette is built around enquiries, so these get
   their own badge rather than a borrowed word that means something else in
   the rest of the panel. */
const BADGE: Record<string, string> = {
  Live: "border-[#0a7c42]/25 bg-[#0a7c42]/[0.07] text-[#0a7c42]",
  Scheduled: "border-[#b06000]/25 bg-[#b06000]/[0.07] text-[#b06000]",
  Ended: "border-text/15 bg-text/[0.04] text-text/55",
  Off: "border-text/12 bg-transparent text-text/40",
};

function status(offer: OfferRow): string {
  if (offer.isActive !== 1) return "Off";
  const now = Date.now();
  if (offer.startsAt && offer.startsAt.getTime() > now) return "Scheduled";
  if (offer.endsAt && offer.endsAt.getTime() < now) return "Ended";
  return "Live";
}

function Badge({ state }: { state: string }) {
  return (
    <span
      className={`rounded-full border px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.14em] ${BADGE[state]}`}
    >
      {state}
    </span>
  );
}

/* The same field the rest of the panel uses.

   This form had its own, and the difference mattered: it painted itself
   bg-bg, and --color-bg is one of the few tokens the panel's dark theme does
   not redefine. So every input and the service dropdown stayed white in dark
   mode while their text followed --color-text and went almost white with it —
   white on white. bg-panel is themed, and text-text is stated rather than
   inherited. */
const field =
  "mt-1.5 block w-full rounded-lg border border-text/12 bg-panel px-4 py-2.5 text-[0.9rem] text-text outline-none transition-colors duration-200 placeholder:text-text/30 focus:border-primary focus:bg-card";
const label = "block font-mono text-[10px] uppercase tracking-[0.16em] text-text/65";

export default function OffersForm({
  offers,
  targets,
}: {
  offers: OfferRow[];
  targets: string[];
}) {
  const [editing, setEditing] = useState<OfferRow | null>(null);

  /* Offerable things that are not one of the thirteen services — Weddings
     belongs to the Media & Event division and has no service group of its
     own. Derived rather than listed, so adding another one anywhere only
     means adding it to offerTargets(). */
  const grouped = new Set(SERVICE_GROUPS.flatMap((g) => g.services.map((s) => s.name)));
  const ungrouped = targets.filter((t) => t !== "*" && !grouped.has(t));

  return (
    <div className="space-y-8">
      <Card>
        <CardTitle>{editing ? `Editing: ${editing.title}` : "Add an offer"}</CardTitle>

        <ActionForm
          action={saveOffer}
          message={editing ? "Offer updated." : "Offer added."}
          className="mt-5"
        >
          {editing && <input type="hidden" name="id" value={editing.id} />}

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className={label} htmlFor="offer-service">
                Applies to
              </label>
              {/* Grouped by the same categories, in the same order, as the
                  service picker on the contact form. It was a flat
                  alphabetical run of every service, which put Content Writing
                  between Meta Ads and Social Media Management and made a list
                  of fourteen harder to search than it needed to be. Anything
                  offerable that is not one of the service groups — Weddings,
                  which belongs to the Media & Event division — lands in the
                  last group rather than being dropped. */}
              <select
                id="offer-service"
                name="service"
                defaultValue={editing?.serviceName ?? "*"}
                className={field}
              >
                <option value="*">Every service</option>
                {SERVICE_GROUPS.map((group) => {
                  const inGroup = group.services
                    .map((s) => s.name)
                    .filter((name) => targets.includes(name));
                  if (inGroup.length === 0) return null;
                  return (
                    <optgroup key={group.category} label={group.category}>
                      {inGroup.map((name) => (
                        <option key={name} value={name}>
                          {name}
                        </option>
                      ))}
                    </optgroup>
                  );
                })}
                {ungrouped.length > 0 && (
                  <optgroup label="Elsewhere on the site">
                    {ungrouped.map((name) => (
                      <option key={name} value={name}>
                        {name}
                      </option>
                    ))}
                  </optgroup>
                )}
              </select>
            </div>

            <div>
              <label className={label} htmlFor="offer-code">
                Promo code <span className="text-text/50">(optional)</span>
              </label>
              <input
                id="offer-code"
                name="code"
                maxLength={40}
                defaultValue={editing?.code ?? ""}
                placeholder="STME2026"
                className={field}
              />
            </div>

            <div className="sm:col-span-2">
              <label className={label} htmlFor="offer-title">
                Headline
              </label>
              <input
                id="offer-title"
                name="title"
                required
                maxLength={140}
                defaultValue={editing?.title ?? ""}
                placeholder="20% off the Complete Wedding package"
                className={field}
              />
            </div>

            <div className="sm:col-span-2">
              <label className={label} htmlFor="offer-body">
                Detail <span className="text-text/50">(optional)</span>
              </label>
              <textarea
                id="offer-body"
                name="body"
                rows={2}
                maxLength={400}
                defaultValue={editing?.body ?? ""}
                placeholder="Applies to bookings confirmed before the end of the month."
                className={`${field} resize-y`}
              />
            </div>

            <div>
              <label className={label} htmlFor="offer-starts">
                Starts <span className="text-text/50">(optional)</span>
              </label>
              <input
                id="offer-starts"
                name="startsAt"
                type="date"
                defaultValue={editing?.startsAt ? editing.startsAt.toISOString().slice(0, 10) : ""}
                className={field}
              />
            </div>

            <div>
              <label className={label} htmlFor="offer-ends">
                Ends <span className="text-text/50">(optional)</span>
              </label>
              <input
                id="offer-ends"
                name="endsAt"
                type="date"
                defaultValue={editing?.endsAt ? editing.endsAt.toISOString().slice(0, 10) : ""}
                className={field}
              />
              <p className="mt-1.5 text-[11px] leading-snug text-text/65">
                The offer disappears from the site by itself after this date.
                Leave empty to run until switched off.
              </p>
            </div>
          </div>

          {/* text-text, stated. Left to inherit, this line was the one
              piece of copy in the form with no colour of its own. */}
          <label className="mt-5 flex items-center gap-3 text-sm text-text">
            <input
              type="checkbox"
              name="isActive"
              defaultChecked={editing ? editing.isActive === 1 : true}
              className="h-4 w-4 accent-[var(--color-primary)]"
            />
            <span>Show this offer on the site</span>
          </label>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              type="submit"
              className="rounded-full bg-primary px-5 py-2.5 text-[12px] font-semibold uppercase tracking-[0.1em] text-white [transition:scale_140ms_cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary active:scale-[0.97]"
            >
              {editing ? "Save changes" : "Add offer"}
            </button>
            {editing && (
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-text/65 transition-colors duration-200 hover:text-primary"
              >
                Cancel
              </button>
            )}
          </div>
        </ActionForm>
      </Card>

      <Card>
        <CardTitle>All offers</CardTitle>

        {offers.length === 0 ? (
          <Empty
            title="No offers yet"
            body="Anything added above appears here, and on the pages for the service it belongs to."
          />
        ) : (
          <ul className="mt-5 divide-y divide-text/10">
            {offers.map((offer) => {
              const state = status(offer);
              return (
                <li key={offer.id} className="flex flex-wrap items-start gap-x-5 gap-y-3 py-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                      <Badge state={state} />
                      <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-text/65">
                        {offer.serviceName === "*" ? "Every service" : offer.serviceName}
                      </span>
                      {offer.code && (
                        <span className="font-mono text-[10.5px] tracking-[0.1em] text-primary">
                          {offer.code}
                        </span>
                      )}
                    </div>

                    <p className="mt-2 text-sm font-medium">{offer.title}</p>
                    {offer.body && (
                      <p className="mt-1 text-[13px] leading-snug text-text/75">{offer.body}</p>
                    )}
                    <p className="mt-1.5 font-mono text-[10.5px] tracking-[0.1em] text-text/65">
                      {offer.startsAt ? shortDate(offer.startsAt) : "now"} &rarr;{" "}
                      {offer.endsAt ? shortDate(offer.endsAt) : "no end date"}
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setEditing(offer);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="rounded-full border border-text/20 px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] transition-colors duration-200 hover:border-primary hover:text-primary"
                    >
                      Edit
                    </button>

                    <ActionForm
                      action={toggleOffer}
                      message={offer.isActive === 1 ? "Offer switched off." : "Offer is live."}
                    >
                      <input type="hidden" name="id" value={offer.id} />
                      <input type="hidden" name="on" value={offer.isActive === 1 ? "0" : "1"} />
                      <button
                        type="submit"
                        className="rounded-full border border-text/20 px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] transition-colors duration-200 hover:border-primary hover:text-primary"
                      >
                        {offer.isActive === 1 ? "Switch off" : "Switch on"}
                      </button>
                    </ActionForm>

                    <ActionForm action={deleteOffer} message="Offer removed.">
                      <input type="hidden" name="id" value={offer.id} />
                      <button
                        type="submit"
                        className="rounded-full border border-text/20 px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-[#b42318] transition-colors duration-200 hover:border-[#b42318]"
                      >
                        Delete
                      </button>
                    </ActionForm>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </Card>
    </div>
  );
}
