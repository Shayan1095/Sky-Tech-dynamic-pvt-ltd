import Link from "next/link";
import type { Metadata } from "next";

import { allPosts } from "@/lib/blog";
import { pageMetadata } from "@/lib/site";
import PostCard from "@/components/blog/PostCard";
import { FRAME, INSET, H2, SectionLabel, Words } from "@/components/service/parts";

export const metadata: Metadata = pageMetadata({
  title: "Blog | Web, Marketing & Software Insights | SKY Tech",
  description:
    "Practical writing on web development, digital marketing, advertising and the software we build — from the team that does the work.",
  keywords:
    "web development blog, digital marketing blog Pakistan, SEO tips, google ads advice, software development insights",
  path: "/blog",
});

/* Static, and deliberately so.

   This page reads nothing but the files on disk, and those only change when
   the site is deployed — so there is no reason to compute it per visitor.
   Reading a query string for a filter was enough to make Next render it on
   demand, which on Vercel means a function invocation for every visit, and a
   cold start for the unlucky ones. Prerendered, it is a file on the CDN.

   The filter went with it. It was one chip for one service, which is not
   worth a server round-trip on every visit; each card still names the
   service it belongs to, and the post itself links through to it. When there
   are enough posts for filtering to earn its place, it comes back as real
   static routes rather than a query — crawlable and prerendered, the same as
   everything else here. */
export default function BlogIndex() {
  const posts = allPosts();

  return (
    <section aria-labelledby="blog-heading" className="relative isolate overflow-x-clip bg-bg">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className={`h-full border-x border-dotted border-text/[0.16] ${FRAME}`} />
      </div>

      <div className={`relative ${FRAME}`}>
        <div className={`py-20 sm:py-24 lg:py-28 ${INSET}`}>
          <SectionLabel>Blog</SectionLabel>

          <h1 id="blog-heading" className={`mt-7 max-w-3xl ${H2}`}>
            <Words text="What we have learned, written down." />
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-text/80 [text-wrap:pretty]">
            Notes on the work — building websites, running campaigns, and the
            systems we license. Written by the people doing it, not by a
            content farm.
          </p>

          {posts.length === 0 ? (
            <div className="mt-12 rounded-[18px] border border-dashed border-text/20 px-6 py-14 text-center">
              <p className="font-display text-[1.25rem] font-semibold tracking-[-0.015em] text-text">
                The first posts are on their way.
              </p>
              <p className="mx-auto mt-3 max-w-md text-[0.95rem] leading-relaxed text-text/70 [text-wrap:pretty]">
                In the meantime, the{" "}
                <Link
                  href="/services"
                  className="font-medium text-primary underline decoration-primary/30 underline-offset-4 hover:decoration-primary"
                >
                  service pages
                </Link>{" "}
                go into detail on how each piece of work is done.
              </p>
            </div>
          ) : (
            <>
              <ul className="mt-12 grid items-start gap-5 md:grid-cols-2 xl:grid-cols-3">
                {posts.map((post) => (
                  <li key={post.slug}>
                    <PostCard post={post} />
                  </li>
                ))}
              </ul>

              <p className="mt-8 font-mono text-[10.5px] uppercase tracking-[0.16em] text-text/65">
                {posts.length} {posts.length === 1 ? "post" : "posts"}
              </p>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
