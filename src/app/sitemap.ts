import type { MetadataRoute } from "next";
import { ROUTES, SITE_URL } from "@/lib/site";
import { allPosts } from "@/lib/blog";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const pages: MetadataRoute.Sitemap = ROUTES.map((route) => ({
    url: route === "/" ? SITE_URL : `${SITE_URL}${route}`,
    lastModified,
    changeFrequency: "monthly",
    priority: route === "/" ? 1 : 0.8,
  }));

  /* Posts list themselves. Adding a file to src/content/blog is the whole of
     publishing: the page exists, the sitemap names it, and its own date is
     what search engines are told — not the moment this file happened to run,
     which would claim every post changed on every deploy. */
  const posts: MetadataRoute.Sitemap = allPosts().map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: new Date(`${post.date}T00:00:00Z`),
    changeFrequency: "yearly",
    priority: 0.6,
  }));

  return [...pages, ...posts];
}
