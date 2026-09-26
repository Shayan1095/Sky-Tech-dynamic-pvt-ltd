/* Shown while a page's data is being fetched.

   The shapes deliberately match what replaces them — a heading, four stat
   tiles, a list — so the layout does not jump when the real content lands.
   A spinner would say "wait" without saying what for.

   It pulses rather than sweeping a highlight across: this appears for a few
   hundred milliseconds on a fast query, and a travelling shimmer at that
   length reads as a glitch. */
export default function Loading() {
  return (
    <div className="mx-auto max-w-[68rem] px-5 py-8 sm:px-8 sm:py-12" aria-busy="true">
      <span className="sr-only">Loading</span>

      <div className="mb-8">
        <div className="skeleton h-3 w-20 rounded" />
        <div className="skeleton mt-3 h-8 w-56 rounded" />
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="rounded-xl border border-text/[0.09] bg-card px-5 py-4">
            <div className="skeleton h-2.5 w-16 rounded" />
            <div className="skeleton mt-3 h-6 w-20 rounded" />
            <div className="skeleton mt-3 h-2.5 w-24 rounded" />
          </div>
        ))}
      </div>

      <div className="mt-3 flex flex-col gap-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="rounded-xl border border-text/[0.09] bg-card p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <div className="skeleton h-2.5 w-24 rounded" />
                <div className="skeleton mt-3 h-4 w-52 rounded" />
                <div className="skeleton mt-2 h-3 w-40 rounded" />
              </div>
              <div className="skeleton h-4 w-16 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
