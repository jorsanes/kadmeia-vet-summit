import type { CaseStudy, Locale, MDXModule, Post } from '@/content/types';

// Utilities for normalizing content metadata
const toTitleFromSlug = (slug: string) =>
  slug
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (m) => m.toUpperCase());

const normalizeTags = (tags: unknown): string[] => {
  if (!tags) return [];
  if (Array.isArray(tags)) return tags.map(String);
  if (typeof tags === 'string') return tags.split(',').map(s => s.trim()).filter(Boolean);
  return [];
};

const normalizeCover = (cover: unknown): string | undefined => {
  if (!cover) return undefined;
  const c = String(cover).trim();
  // Accept http(s), absolute and relative paths
  if (c.startsWith('http')) return c;
  if (c.startsWith('/')) return c;
  // If relative, assume it's in /images/
  return `/images/${c}`;
};

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
    title: fm.title ?? toTitleFromSlug(slug),
    date: fm.date ?? new Date().toISOString().slice(0, 10),
    excerpt: fm.excerpt,
    cover: normalizeCover(fm.cover),
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
    title: fm.title ?? toTitleFromSlug(slug),
    date: fm.date ?? new Date().toISOString().slice(0, 10),
    excerpt: fm.excerpt,
    cover: normalizeCover(fm.cover),
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

// 3) Public API
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