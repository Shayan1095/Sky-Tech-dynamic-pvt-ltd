import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  formatDate,
  getPost,
  postSlugs,
  relatedPosts,
  servicePathFor,
} from "@/lib/blog";
import { SITE_NAME, SITE_URL, pageMetadata } from "@/lib/site";
import PostBody from "@/components/blog/PostBody";
import PostCard from "@/components/blog/PostCard";
import { FRAME, INSET, SectionLabel } from "@/components/service/parts";

/* Only the posts that exist are pages; any other slug is a 404 rather than
   an empty article. Same rule as the service pages. */
export const dynamicParams = false;

export function generateStaticParams() {
  return postSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata(props: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const post = getPost(slug);
  if (!post) return {};

  return {
    ...pageMetadata({
      title: `${post.title} | ${SITE_NAME}`,
      description: post.description,
      keywords: post.keywords ?? "",
      path: `/blog/${post.slug}`,
    }),
    /* An article, not a website, and with its date — which is what lets a
       result carry "3 Nov 2026" beside it. */
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      url: `${SITE_URL}/blog/${post.slug}`,
      publishedTime: post.date,
      images: post.cover ? [post.cover] : undefined,
    },
  };
}

export default async function BlogPost(props: PageProps<"/blog/[slug]">) {
  const { slug } = await props.params;
  const post = getPost(slug);
  if (!post) notFound();

  const servicePath = servicePathFor(post.service);
  const related = relatedPosts(post);
  const url = `${SITE_URL}/blog/${post.slug}`;

  /* Article and BreadcrumbList, the two that earn something in a result: the
     first can carry the date and the author, the second the trail above the
     title. Escaped the same way the service pages escape theirs, so a "<" in
     a headline cannot close the script tag. */
  const jsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        headline: post.title,
        description: post.description,
        datePublished: post.date,
        dateModified: post.date,
        image: post.cover ? [post.cover] : undefined,
        author: { "@type": "Organization", name: post.author || SITE_NAME, url: SITE_URL },
        publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
        mainEntityOfPage: { "@type": "WebPage", "@id": url },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog` },
          { "@type": "ListItem", position: 3, name: post.title, item: url },
        ],
      },
    ],
  }).replace(/</g, "\\u003c");

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />

      <article className="relative isolate overflow-x-clip bg-bg">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className={`h-full border-x border-dotted border-text/[0.16] ${FRAME}`} />
        </div>

        <div className={`relative ${FRAME}`}>
          <div className={`py-20 sm:py-24 lg:py-28 ${INSET}`}>
            <p className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-text/65">
              <Link href="/blog" className="transition-colors duration-300 hover:text-primary">
                Blog
              </Link>
              {post.service && (
                <>
                  <span aria-hidden="true" className="mx-2 text-text/35">
                    /
                  </span>
                  {servicePath ? (
                    <Link
                      href={servicePath}
                      className="text-primary transition-colors duration-300 hover:text-navy"
                    >
                      {post.service}
                    </Link>
                  ) : (
                    <span className="text-primary">{post.service}</span>
                  )}
                </>
              )}
            </p>

            <h1 className="mt-6 max-w-4xl font-display text-[2.1rem] font-semibold leading-[1.08] tracking-[-0.03em] text-text [text-wrap:balance] sm:text-[2.8rem] lg:text-[3.2rem]">
              {post.title}
            </h1>

            <p className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[10.5px] uppercase tracking-[0.16em] text-text/65">
              <time dateTime={post.date}>{formatDate(post.date)}</time>
              <span aria-hidden="true" className="h-[3px] w-[3px] rotate-45 bg-cta" />
              <span>{post.readingMinutes} min read</span>
              {post.author && (
                <>
                  <span aria-hidden="true" className="h-[3px] w-[3px] rotate-45 bg-cta" />
                  <span>{post.author}</span>
                </>
              )}
            </p>

            {post.description && (
              <p className="mt-7 max-w-2xl border-l-2 border-primary/30 pl-5 text-lg leading-relaxed text-text/80 [text-wrap:pretty]">
                {post.description}
              </p>
            )}

            {post.cover && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={post.cover}
                alt={post.coverAlt ?? ""}
                className="mt-10 w-full rounded-[18px] border border-text/[0.12]"
              />
            )}

            <div className="mt-12 max-w-2xl">
              <PostBody>{post.body}</PostBody>
            </div>

            {/* Out to the work the post is about. A blog that never points at
                the service it discusses is a blog that costs more than it
                returns. */}
            {servicePath && (
              <aside className="mt-16 max-w-2xl rounded-[18px] border border-text/[0.14] bg-[color-mix(in_srgb,var(--color-navy)_4%,var(--color-bg))] p-7">
                <p className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-primary">
                  The service this is about
                </p>
                <p className="mt-3 font-display text-[1.25rem] font-semibold tracking-[-0.02em] text-text">
                  {post.service}
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <Link
                    href={servicePath}
                    className="inline-flex min-h-[48px] items-center rounded-full bg-primary px-6 text-[12px] font-semibold uppercase tracking-[0.1em] text-white [transition:scale_140ms_cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary active:scale-[0.97]"
                  >
                    See what it involves
                  </Link>
                  <Link
                    href={`/contact?service=${encodeURIComponent(post.service!)}#contact-form`}
                    className="inline-flex min-h-[48px] items-center rounded-full border border-text/20 px-6 text-[12px] font-semibold uppercase tracking-[0.1em] text-text transition-colors duration-300 hover:border-primary hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
                  >
                    Talk to us about it
                  </Link>
                </div>
              </aside>
            )}
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <section
          aria-labelledby="more-reading"
          className="relative isolate overflow-x-clip border-t border-text/[0.1] bg-[color-mix(in_srgb,var(--color-navy)_3%,var(--color-bg))]"
        >
          <div className={`relative ${FRAME}`}>
            <div className={`py-20 ${INSET}`}>
              <SectionLabel>More reading</SectionLabel>
              <h2
                id="more-reading"
                className="mt-6 font-display text-[1.7rem] font-semibold leading-tight tracking-[-0.02em] text-text sm:text-[2rem]"
              >
                Carry on
              </h2>

              <ul className="mt-10 grid items-start gap-5 md:grid-cols-2 xl:grid-cols-3">
                {related.map((item) => (
                  <li key={item.slug}>
                    <PostCard post={item} />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
