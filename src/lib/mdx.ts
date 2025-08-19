import { ComponentType } from 'react';

export interface MDXFrontmatter {
  title: string;
  date: string;
  excerpt: string;
  cover: string;
  lang: 'es' | 'en';
  tags: string[];
}

export interface MDXEntry extends MDXFrontmatter {
  path: string;
  slug: string;
  Component: ComponentType;
}

// Blog modules
export const blogModules = import.meta.glob('/src/content/blog/**/*.mdx', { eager: true });

// Cases modules
export const casesModules = import.meta.glob('/src/content/casos/**/*.mdx', { eager: true });

export function listEntries(modules: any): MDXEntry[] {
  return Object.entries(modules)
    .map(([path, mod]: [string, any]) => {
      const slug = path.split('/').pop()?.replace('.mdx', '') || '';
      return {
        path,
        slug,
        ...mod.frontmatter,
        Component: mod.default
      };
    })
    .sort((a, b) => (a.date > b.date ? -1 : 1));
}

export function getBlogPosts(lang: 'es' | 'en' = 'es'): MDXEntry[] {
  const entries = listEntries(blogModules);
  return entries.filter(entry => entry.lang === lang);
}

export function getCases(lang: 'es' | 'en' = 'es'): MDXEntry[] {
  const entries = listEntries(casesModules);
  return entries.filter(entry => entry.lang === lang);
}

export function getBlogPost(slug: string, lang: 'es' | 'en' = 'es'): MDXEntry | undefined {
  return getBlogPosts(lang).find(post => post.slug === slug);
}

export function getCase(slug: string, lang: 'es' | 'en' = 'es'): MDXEntry | undefined {
  return getCases(lang).find(caseItem => caseItem.slug === slug);
}

export function paginateEntries<T>(entries: T[], page: number, pageSize: number = 6) {
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  
  return {
    entries: entries.slice(start, end),
    totalPages: Math.ceil(entries.length / pageSize),
    currentPage: page,
    hasNext: end < entries.length,
    hasPrev: page > 1
  };
}