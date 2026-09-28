import Link from "next/link";
import { FRAME, INSET, Arrow, H2, Words } from "@/components/service/parts";
import { BRAND, CONSULTATION_HREF } from "@/lib/media-events";

/* The last word, shared by both halves of the page — the decision is the same
   one whichever side you came down: tell us what the day is.

   Static, and outside the switch, so it is the one thing on the page that
   does not change when the tabs do. */

export default function EventsClosing() {
  return (
    <section
      aria-labelledby="events-closing-heading"
      className="relative isolate overflow-hidden bg-navy text-white"
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 [background-image:radial-gradient(70%_55%_at_50%_0%,rgb(0_107_184/0.5),transparent_70%),radial-gradient(45%_40%_at_50%_100%,rgb(0_194_255/0.08),transparent_70%)]"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.09] [background-image:linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] [background-size:34px_34px] [mask-image:radial-gradient(75%_60%_at_50%_0%,#000_0%,transparent_80%)]"
      />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className={`h-full border-x border-dotted border-white/15 ${FRAME}`} />
      </div>

      <div className={`relative ${FRAME}`}>
        <div className={`flex flex-col items-center py-24 text-center sm:py-28 lg:py-32 ${INSET}`}>
          <p className="flex items-center gap-4">
            <span aria-hidden="true" className="block h-px w-10 bg-cta" />
            <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-cta sm:text-xs">
              Events start with a conversation
            </span>
            <span aria-hidden="true" className="block h-px w-10 bg-cta" />
          </p>

          <h2 id="events-closing-heading" className={`mt-8 max-w-4xl text-white ${H2}`}>
            <Words text="Tell us what the day is." />
          </h2>

          <p className="mt-7 max-w-2xl text-base leading-relaxed text-white/85 [text-wrap:pretty] sm:text-lg">
            The date, roughly how many people, and what has to happen in the
            room. That is enough for us to come back with a plan and a number —
            and for you to know whether we are the right people for it.
          </p>

          <div className="mt-11 flex flex-col items-center gap-x-8 gap-y-5 sm:flex-row sm:flex-wrap sm:justify-center">
            <Link
              href={CONSULTATION_HREF}
              className="group relative isolate flex min-h-[56px] items-center justify-between gap-4 overflow-hidden rounded-full bg-white py-2 pl-6 pr-2 text-[13px] font-semibold uppercase tracking-[0.1em] text-navy [transition:scale_140ms_cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cta active:scale-[0.97]"
            >
              <span
                aria-hidden="true"
                className="absolute inset-0 -z-10 origin-left scale-x-0 bg-cta transition-transform duration-500 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100 group-focus-visible:scale-x-100"
              />
              Plan Your Event
              <span
                aria-hidden="true"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-navy/10"
              >
                <Arrow className="transition-transform duration-500 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0.5" />
              </span>
            </Link>

            <a
              href="tel:+923335673810"
              className="group relative inline-flex items-center gap-3 py-3.5 font-mono text-[11px] uppercase tracking-[0.2em] text-white/80 transition-colors duration-300 hover:text-cta focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cta sm:text-xs"
            >
              +92 333 567 3810
              <Arrow className="transition-transform duration-500 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1" />
              <span
                aria-hidden="true"
                className="absolute inset-x-0 bottom-1.5 h-px origin-left scale-x-0 bg-cta transition-transform duration-500 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100 group-focus-visible:scale-x-100"
              />
            </a>
          </div>

          <p className="mt-12 font-mono text-[10.5px] uppercase tracking-[0.18em] text-white/50">
            {BRAND}
          </p>
        </div>
      </div>
    </section>
  );
}
