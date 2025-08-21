import fg from "fast-glob";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { BlogMeta, CaseMeta } from "@/content/schemas";

const ROOT = path.resolve(".");
const BLOG_DIR = "src/content/blog";
const CASE_DIR = "src/content/casos";

type Item<T = any> = {
  slug: string;
  filepath: string;
  meta: T;
};

function readItems<T>(
  dir: string,
  locale: "es" | "en",
  schema: any
): Item<T>[] {
  const base = path.join(ROOT, dir, locale);
  const files = fg.sync("**/*.mdx", { cwd: base, absolute: true });
  const items: Item<T>[] = [];

  for (const file of files) {
    const raw = fs.readFileSync(file, "utf8");
    const { data } = matter(raw);
    const parsed = schema.safeParse(data);
    if (!parsed.success) {
      console.warn(`[content] invalid frontmatter: ${file}`, parsed.error.format());
      continue;
    }
    const slug = path.basename(file, ".mdx");
    items.push({
      slug,
      filepath: file,
      meta: parsed.data as T,
    });
  }

  return items
    .filter((it) => !(it.meta as any).draft)
    .sort((a, b) => (b.meta as any).date.getTime() - (a.meta as any).date.getTime())
    .reverse();
}

export function getAllPosts(locale: "es" | "en") {
  return readItems(BLOG_DIR, locale, BlogMeta);
}

export function getAllCases(locale: "es" | "en") {
  return readItems(CASE_DIR, locale, CaseMeta);
}

export function getPostBySlug(locale: "es" | "en", slug: string) {
  return getAllPosts(locale).find((p) => p.slug === slug);
}

export function getCaseBySlug(locale: "es" | "en", slug: string) {
  return getAllCases(locale).find((c) => c.slug === slug);
}