import matter from "gray-matter";
import { BaseContentSchema, type BaseContentMeta, type ContentCardMeta } from "@/content/schemas";

function computeReadingTime(text: string) {
  const words = (text || "").split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min`;
}

export type ContentItem = BaseContentMeta & {
  excerpt: string;
  mdx: React.ComponentType<any>;
  readingTime: string;
  card: Required<ContentCardMeta>;
};

export function loadEntries(globResult: Record<string, any>, type: "case" | "post"): ContentItem[] {
  const items = Object.entries(globResult).map(([path, mod]) => {
    const raw = mod?.raw ?? "";
    const mdx = mod?.default;
    const fm = mod?.meta ?? matter(raw).data ?? {};
    const body = mod?.body ?? ""; // si tenemos el cuerpo
    const parsed = BaseContentSchema.safeParse({
      ...fm,
      slug: fm.slug ?? path.split("/").pop()?.replace(/\.(mdx|md)$/, ""),
    });

    if (!parsed.success) {
      console.warn("Invalid meta for", path, parsed.error);
      return null;
    }

    const meta = parsed.data;

    // Fallbacks de tarjeta
    const defaultCta = type === "case"
      ? (meta.lang === "en" ? "View case →" : "Ver caso →")
      : (meta.lang === "en" ? "Read article →" : "Leer artículo →");

    const excerpt =
      meta.excerpt?.trim() ||
      (body ? body.replace(/[#>*`_]/g, "").slice(0, 180) + "…" : "");

    const readingTime = computeReadingTime(body);

    return {
      ...meta,
      excerpt,
      mdx,
      readingTime,
      card: {
        kicker: meta.card?.kicker,
        badges: meta.card?.badges ?? meta.tags ?? [],
        highlights:
          meta.card?.highlights ??
          (type === "post" ? [{ label: meta.lang === "en" ? "Read" : "Lectura", value: readingTime }] : undefined),
        cta: meta.card?.cta ?? defaultCta,
      },
    } as ContentItem;
  });

  return items.filter(Boolean).filter((i: ContentItem) => i.draft !== true);
}

/** Devuelve todos los casos (ES/EN) con meta y componente MDX */
export function getAllCasesWithMDX() {
  const modules = import.meta.glob("@/content/casos/**/*.{mdx,md}", { eager: true });
  return Object.entries(modules).map(([path, mod]: any) => {
    const raw = mod?.raw ?? "";
    const fm = mod?.meta ?? matter(raw).data ?? {};
    const slug = fm.slug ?? path.split("/").pop()?.replace(/\.(mdx|md)$/, "");
    const lang = /\/casos\/(en|es)\//.test(path) ? path.match(/\/casos\/(en|es)\//)![1] : fm.lang;

    const parsed = BaseContentSchema.safeParse({ ...fm, slug, lang });
    if (!parsed.success) return null;

    return {
      ...parsed.data,
      mdx: mod?.default ?? null,   // componente MDX compilado
      body: mod?.body ?? "",
      path,
    };
  })
  .filter(Boolean)
  .filter((x: any) => x.draft !== true);
}

/** Encuentra un caso por lang + slug con componente MDX */
export function getCaseWithMDXBySlug(lang: "es" | "en", slug: string) {
  const items = getAllCasesWithMDX();
  return items.find((i: any) => i.lang === lang && i.slug === slug) ?? null;
}

// Legacy API compatibility - keep existing functions working exactly the same
import type { CaseStudy, Locale, MDXModule, Post } from '@/content/types';

// Utilities for normalizing content metadata
const toTitleFromSlug = (slug: string) =>
  slug
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (m) => m.toUpperCase());

const pickTitle = (data: any, slug: string) =>
  (data?.title ?? data?.Title ?? data?.titulo ?? data?.name ?? toTitleFromSlug(slug)) as string;

const normalizeTags = (tags: unknown): string[] => {
  if (!tags) return [];
  if (Array.isArray(tags)) return tags.map(String);
  if (typeof tags === 'string') return tags.split(',').map(s => s.trim()).filter(Boolean);
  return [];
};

const normalizeCover = (cover: unknown, slug: string): string | undefined => {
  if (!cover) {
    // Try by convention: /images/cases/<slug>.(webp|jpg|png|jpeg)
    return `/images/cases/${slug}.webp`;
  }
  const c = String(cover).trim();
  if (c.startsWith('http') || c.startsWith('/')) return c;
  return `/images/${c}`;
};

const pickExcerpt = (data: any) =>
  (data?.excerpt ?? data?.summary ?? data?.resumen) ? String(data?.excerpt ?? data?.summary ?? data?.resumen) : undefined;

// 1) Index MDX files with Vite
const blogModules = import.meta.glob<MDXModule>('/src/content/blog/**/**/*.mdx', { eager: true });
const caseModules = import.meta.glob<MDXModule>('/src/content/casos/**/**/*.mdx', { eager: true });

// Util to build slug from path
function pathToSlug(path: string) {
  return path.split('/').pop()!.replace(/\.mdx$/, '');
}

function pathToLang(path: string): Locale {
  const parts = path.split('/');
  const idx = parts.findIndex(p => p === 'blog' || p === 'casos');
  const lang = parts[idx + 1] as Locale;
  return (lang === 'en' ? 'en' : 'es');
}

function isDraft(mod: MDXModule) {
  return Boolean(mod.frontmatter?.draft);
}

function moduleToPost(path: string, mod: MDXModule): Post {
  const fm = mod.frontmatter ?? {};
  const slug = pathToSlug(path);
  
  return {
    kind: 'post',
    slug: fm.slug ?? slug,
    title: pickTitle(fm, slug),
    date: fm.date ? new Date(String(fm.date)).toISOString() : undefined,
    excerpt: pickExcerpt(fm),
    cover: normalizeCover(fm.cover, slug),
    lang: (fm.lang as any) ?? pathToLang(path),
    tags: normalizeTags(fm.tags),
    draft: !!fm.draft,
  };
}

function moduleToCase(path: string, mod: MDXModule): CaseStudy {
  const fm = mod.frontmatter ?? {};
  const slug = pathToSlug(path);
  
  return {
    kind: 'case',
    slug: fm.slug ?? slug,
    title: pickTitle(fm, slug),
    date: fm.date ? new Date(String(fm.date)).toISOString() : undefined,
    excerpt: pickExcerpt(fm),
    cover: normalizeCover(fm.cover, slug),
    lang: (fm.lang as any) ?? pathToLang(path),
    tags: normalizeTags(fm.tags),
    draft: !!fm.draft,
  };
}

// 2) In-memory catalogs (eager)
const POSTS: Record<string, { meta: Post; mod: MDXModule }> = {};
const CASES: Record<string, { meta: CaseStudy; mod: MDXModule }> = {};

for (const [path, mod] of Object.entries(blogModules)) {
  const meta = moduleToPost(path, mod);
  if (!isDraft(mod)) {
    POSTS[`/${meta.lang}/blog/${meta.slug}`] = { meta, mod };
    // ES shortcut access
    if (meta.lang === 'es') {
      POSTS[`/blog/${meta.slug}`] = { meta, mod };
    }
  }
}

for (const [path, mod] of Object.entries(caseModules)) {
  const meta = moduleToCase(path, mod);
  if (!isDraft(mod)) {
    CASES[`/${meta.lang}/cases/${meta.slug}`] = { meta, mod };
    // ES shortcut access
    if (meta.lang === 'es') {
      CASES[`/casos/${meta.slug}`] = { meta, mod };
    }
  }
}

// 3) Public API - keeping exact same functionality for backwards compatibility
export function getAllPosts(lang: Locale): Post[] {
  return Object.values(POSTS)
    .map(v => v.meta)
    .filter(p => p.lang === lang)
    .sort((a, b) => {
      if (!a.date && !b.date) return 0;
      if (!a.date) return 1;
      if (!b.date) return -1;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
}

export function getAllCases(lang: Locale): CaseStudy[] {
  return Object.values(CASES)
    .map(v => v.meta)
    .filter(c => c.lang === lang)
    .sort((a, b) => {
      if (!a.date && !b.date) return 0;
      if (!a.date) return 1;
      if (!b.date) return -1;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
}

export function getPostBySlug(lang: Locale, slug: string) {
  const key = lang === 'en' ? `/en/blog/${slug}` : `/blog/${slug}`;
  return POSTS[key];
}

export function getCaseBySlug(lang: Locale, slug: string) {
  const key = lang === 'en' ? `/en/cases/${slug}` : `/casos/${slug}`;
  return CASES[key];
}