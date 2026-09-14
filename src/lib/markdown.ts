import fs from "fs";
import path from "path";
import matter from "gray-matter";

export interface PageContent {
  url: string;
  meta_title: string;
  meta_description: string;
  keywords: string;
  h1: string;
  service?: string;
  content: string;
}

const CONTENT_DIR = path.join(process.cwd(), "src/content");

export function loadMarkdown(relativePath: string): PageContent {
  const filePath = path.join(CONTENT_DIR, relativePath);
  const fileContents = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(fileContents);

  return {
    url: data.url ?? "/",
    meta_title: data.meta_title ?? "",
    meta_description: data.meta_description ?? "",
    keywords: data.keywords ?? "",
    h1: data.h1 ?? "",
    service: data.service ?? undefined,
    content,
  };
}

export function getServiceSlugs(): string[] {
  const servicesDir = path.join(CONTENT_DIR, "services");
  return fs
    .readdirSync(servicesDir)
    .filter((file) => file.endsWith(".md") && file !== "index.md")
    .map((file) => file.replace(/\.md$/, ""));
}

export function loadServiceContent(slug: string): PageContent {
  return loadMarkdown(`services/${slug}.md`);
}
