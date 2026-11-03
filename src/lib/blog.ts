import "server-only";

import fs from "node:fs";
import path from "node:path";

import matter from "gray-matter";

import { BUILT_SERVICE_PAGES } from "@/lib/service-pages/built";

/* The blog, as files.

   One markdown file per post in src/content/blog. A post goes live when its
   file is pushed and the site rebuilds — there is no database table and no
   editor in the panel, which is the trade that was chosen: nothing new to
   migrate or back up, at the cost of needing a deploy to publish.

   Files whose name starts with an underscore are skipped, which is what
   _template.md is: a post that is never a post.

   Read with fs at request time rather than imported, so adding a file is the
   whole of adding a post — no index to update, nothing to register. The
   service pages already work this way; this follows them.
   ------------------------------------------------------------------------ */

const BLOG_DIR = path.join(process.cwd(), "src", "content", "blog");

export type Post = {
  slug: string;
  title: string;
  description: string;
  /* ISO date, e.g. 2026-11-03. Used for ordering, the dateline, and the
     article's published date in search results. */
  date: string;
  /* Which service this post is about, by the name the rest of the site uses
     ("Web Development"). It puts the post in that filter on the index and
     links it to the service page — which is most of why a blog is worth
     having: a relevant page pointing into the page that sells the work. */
  service?: string;
  /* An absolute URL. Vercel cannot keep uploaded files — its filesystem is
     rebuilt on every deploy — so images live wherever you host them and are
     referenced by address. */
  cover?: string;
  coverAlt?: string;
  keywords?: string;
  author?: string;
  /* Minutes, estimated from the word count at 200 words a minute. Not a
     claim about anybody's reading speed; it is there because a reader
     deciding whether to start wants a size, and "4 min" is a size. */
  readingMinutes: number;
  body: string;
};

export type PostSummary = Omit<Post, "body">;

const SERVICE_NAMES = Object.keys(BUILT_SERVICE_PAGES);

/* The address of the service a post is about, when it names one we have a
   page for. An unrecognised service is not an error — it simply does not get
   a link — so a post can be filed under something before its page exists. */
export function servicePathFor(service?: string): string | null {
  if (!service) return null;
  const slug = (BUILT_SERVICE_PAGES as Record<string, string>)[service];
  return slug ? `/services/${slug}` : null;
}

export function serviceNames(): string[] {
  return SERVICE_NAMES;
}

function readFile(file: string): Post | null {
  const raw = fs.readFileSync(path.join(BLOG_DIR, file), "utf8");
  const { data, content } = matter(raw);

  const title = typeof data.title === "string" ? data.title.trim() : "";
  const date = typeof data.date === "string" ? data.date.trim() : "";
  /* A post with no title or no date has nothing to be listed by, and a half
     listed post is worse than one that waits. Skipped rather than guessed
     at. */
  if (!title || !date) return null;

  const words = content.split(/\s+/).filter(Boolean).length;

  return {
    slug: file.replace(/\.md$/, ""),
    title,
    description: typeof data.description === "string" ? data.description.trim() : "",
    date,
    service: typeof data.service === "string" ? data.service.trim() : undefined,
    cover: typeof data.cover === "string" ? data.cover.trim() : undefined,
    coverAlt: typeof data.coverAlt === "string" ? data.coverAlt.trim() : undefined,
    keywords: typeof data.keywords === "string" ? data.keywords.trim() : undefined,
    author: typeof data.author === "string" ? data.author.trim() : undefined,
    readingMinutes: Math.max(1, Math.round(words / 200)),
    body: content,
  };
}

function files(): string[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs
    .readdirSync(BLOG_DIR)
    .filter((file) => file.endsWith(".md") && !file.startsWith("_"));
}

/** Every post, newest first. */
export function allPosts(): PostSummary[] {
  return files()
    .map(readFile)
    .filter((post): post is Post => post !== null)
    .sort((a, b) => b.date.localeCompare(a.date))
    .map(({ body: _body, ...summary }) => summary);
}

export function postSlugs(): string[] {
  return allPosts().map((post) => post.slug);
}

export function getPost(slug: string): Post | null {
  /* The slug comes from the address bar. Anything with a separator in it is
     not a slug, it is an attempt to read a file somewhere else. */
  if (!/^[a-z0-9-]+$/i.test(slug)) return null;
  const file = `${slug}.md`;
  if (!files().includes(file)) return null;
  return readFile(file);
}

/** The services that actually have posts, for the index's filter. */
export function servicesWithPosts(posts: PostSummary[]): string[] {
  const named = new Set(posts.map((p) => p.service).filter(Boolean) as string[]);
  return SERVICE_NAMES.filter((name) => named.has(name));
}

/* Up to three more posts to read, preferring ones about the same service. */
export function relatedPosts(current: PostSummary, limit = 3): PostSummary[] {
  const others = allPosts().filter((p) => p.slug !== current.slug);
  const sameService = others.filter((p) => p.service && p.service === current.service);
  const rest = others.filter((p) => !sameService.includes(p));
  return [...sameService, ...rest].slice(0, limit);
}

/** 3 November 2026 — written out, never a bare numeric date. */
export function formatDate(iso: string): string {
  const date = new Date(`${iso}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}
