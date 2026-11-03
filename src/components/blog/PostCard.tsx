import Link from "next/link";

import { formatDate, type PostSummary } from "@/lib/blog";

/* One post in a list.

   The whole card is the link, because a card with a separate "read more"
   gives a reader two targets for one intention and a screen reader two
   announcements of the same thing.

   The cover image is a plain <img>, not next/image. The addresses are
   whatever was pasted into the post's file — an arbitrary host the optimiser
   has no business fetching and resizing on every request, and one it would
   refuse outright unless its domain were added to next.config. A sized,
   lazy-loaded img is the honest version of what this is. */
export default function PostCard({ post }: { post: PostSummary }) {
  return (
    <article className="group relative isolate flex flex-col overflow-hidden rounded-[18px] border border-text/[0.14] bg-bg transition-colors duration-300 hover:border-primary/30">
      {post.cover && (
        <div className="relative aspect-[16/9] overflow-hidden border-b border-text/[0.1] bg-[color-mix(in_srgb,var(--color-navy)_4%,var(--color-bg))]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.cover}
            alt={post.coverAlt ?? ""}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-500 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          />
        </div>
      )}

      <div className="flex flex-1 flex-col p-6">
        <p className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[10.5px] uppercase tracking-[0.16em] text-text/65">
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          <span aria-hidden="true" className="h-[3px] w-[3px] rotate-45 bg-cta" />
          <span>{post.readingMinutes} min read</span>
          {post.service && (
            <>
              <span aria-hidden="true" className="h-[3px] w-[3px] rotate-45 bg-cta" />
              <span className="text-primary">{post.service}</span>
            </>
          )}
        </p>

        <h3 className="mt-4 font-display text-[1.25rem] font-semibold leading-snug tracking-[-0.02em] text-text [text-wrap:pretty]">
          {/* The stretched link: one target covering the card, with the
              heading still the thing announced. */}
          <Link
            href={`/blog/${post.slug}`}
            className="after:absolute after:inset-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
          >
            {post.title}
          </Link>
        </h3>

        {post.description && (
          <p className="mt-3 flex-1 text-[0.95rem] leading-relaxed text-text/75 [text-wrap:pretty]">
            {post.description}
          </p>
        )}

        <p
          aria-hidden="true"
          className="mt-5 flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.18em] text-primary"
        >
          Read
          <span className="transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none">
            &rarr;
          </span>
        </p>
      </div>
    </article>
  );
}
