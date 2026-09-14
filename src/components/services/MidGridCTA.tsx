import Link from "next/link";

export default function MidGridCTA() {
  return (
    <div className="mx-auto mb-16 max-w-3xl px-4 sm:px-6 lg:px-8">
      <div className="rounded-2xl bg-primary px-6 py-8 text-center sm:px-10">
        <p className="text-lg font-semibold text-white">
          Not sure which service fits your goals?
        </p>
        <Link
          href="/contact/"
          className="mt-4 inline-block rounded-full bg-cta px-6 py-2.5 text-sm font-semibold text-text transition-transform duration-300 hover:scale-105"
        >
          Talk to Our Team
        </Link>
      </div>
    </div>
  );
}
