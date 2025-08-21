import type { CaseStudy, Locale, MDXModule, Post } from '@/content/types';

// 1) Indexar ficheros MDX con Vite
// Estructura esperada:
//   src/content/blog/es/*.mdx
//   src/content/blog/en/*.mdx
//   src/content/casos/es/*.mdx
//   src/content/casos/en/*.mdx
//
// Cada MDX debe exportar default (componente) y usar frontmatter YAML.

const blogModules = import.meta.glob<MDXModule>('/src/content/blog/**/**/*.mdx', { eager: true });
const caseModules = import.meta.glob<MDXModule>('/src/content/casos/**/**/*.mdx', { eager: true });

// Util para construir slug desde el path
function pathToSlug(path: string) {
  // /src/content/blog/es/mi-articulo.mdx -> mi-articulo
  return path.split('/').pop()!.replace(/\.mdx$/, '');
}
function pathToLang(path: string): Locale {
  // .../blog/es/... or .../casos/en/...
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
  return {
    kind: 'post',
    slug: fm.slug ?? pathToSlug(path),
    title: fm.title ?? pathToSlug(path),
    date: fm.date ?? new Date().toISOString().slice(0,10),
    excerpt: fm.excerpt,
    cover: fm.cover,
    lang: (fm.lang as any) ?? pathToLang(path),
    tags: fm.tags ?? [],
    draft: !!fm.draft,
  };
}
function moduleToCase(path: string, mod: MDXModule): CaseStudy {
  const fm = mod.frontmatter ?? {};
  return {
    kind: 'case',
    slug: fm.slug ?? pathToSlug(path),
    title: fm.title ?? pathToSlug(path),
    date: fm.date ?? new Date().toISOString().slice(0,10),
    excerpt: fm.excerpt,
    cover: fm.cover,
    lang: (fm.lang as any) ?? pathToLang(path),
    tags: fm.tags ?? [],
    draft: !!fm.draft,
  };
}

// 2) Catálogos en memoria (eager)
const POSTS: Record<string, { meta: Post; mod: MDXModule }> = {};
const CASES: Record<string, { meta: CaseStudy; mod: MDXModule }> = {};

for (const [path, mod] of Object.entries(blogModules)) {
  const meta = moduleToPost(path, mod);
  if (!isDraft(mod)) POSTS[`/${meta.lang}/blog/${meta.slug}`] = { meta, mod };
  // acceso alterno sin prefijo /es
  POSTS[`/blog/${meta.slug}`] = { meta, mod };
}

for (const [path, mod] of Object.entries(caseModules)) {
  const meta = moduleToCase(path, mod);
  if (!isDraft(mod)) CASES[`/${meta.lang}/cases/${meta.slug}`] = { meta, mod };
  CASES[`/casos/${meta.slug}`] = { meta, mod }; // ES corto
}

// 3) API pública
export function getAllPosts(lang: Locale): Post[] {
  return Object.values(POSTS)
    .map(v => v.meta)
    .filter(p => p.lang === lang)
    .sort((a,b) => (a.date < b.date ? 1 : -1));
}

export function getAllCases(lang: Locale): CaseStudy[] {
  return Object.values(CASES)
    .map(v => v.meta)
    .filter(c => c.lang === lang)
    .sort((a,b) => (a.date < b.date ? 1 : -1));
}

export function getPostBySlug(lang: Locale, slug: string) {
  const key = lang === 'en' ? `/en/blog/${slug}` : `/blog/${slug}`;
  return POSTS[key];
}

export function getCaseBySlug(lang: Locale, slug: string) {
  const key = lang === 'en' ? `/en/cases/${slug}` : `/casos/${slug}`;
  return CASES[key];
}