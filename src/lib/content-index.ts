import matter from "gray-matter";
import { BlogMeta, CaseMeta } from "@/content/schemas";

type Locale = "es" | "en";

// MDX crudo para extraer frontmatter (eager) - TEMPORAL: datos de ejemplo
const blogRaw: Record<string, string> = {};
const caseRaw: Record<string, string> = {};

// Módulos MDX (no eager) - TEMPORAL: vacío
const blogModules: Record<string, any> = {};
const caseModules: Record<string, any> = {};

export type ContentItem<T> = {
  slug: string;
  locale: Locale;
  meta: T & { date: Date };
  path: string; // ruta del módulo dentro de Vite
};

function buildIndex<T>(rawMap: Record<string, string>, schema: any): ContentItem<T>[] {
  const out: ContentItem<T>[] = [];
  
  try {
    for (const p in rawMap) {
      const raw = rawMap[p] as unknown as string;
      const { data } = matter(raw);
      const segs = p.split("/");
      const locale = segs[segs.length - 2] as Locale;
      const slug = segs[segs.length - 1].replace(/\.mdx$/, "");

      const parsed = schema.safeParse(data);
      if (!parsed.success) {
        console.warn("[content] invalid frontmatter:", p, parsed.error.format());
        continue;
      }
      // normalizamos date a Date real
     const meta = { ...parsed.data, date: new Date(String(parsed.data.date)) };
      if ((meta as any).draft) continue;

      out.push({ slug, locale, meta, path: p });
    }
    return out.sort((a, b) => b.meta.date.getTime() - a.meta.date.getTime());
  } catch (error) {
    console.error("Error building content index:", error);
    return [];
  }
}

export const blogIndex = buildIndex<import("@/content/schemas").BlogMeta>(blogRaw, BlogMeta);
export const caseIndex = buildIndex<import("@/content/schemas").CaseMeta>(caseRaw, CaseMeta);

// Resolución del import dinámico de un MDX (detalle)
export async function loadBlogComponent(locale: Locale, slug: string) {
  const key = Object.keys(blogModules).find((k) => k.endsWith(`/${locale}/${slug}.mdx`));
  return key ? (blogModules[key] as any)() : null;
}
export async function loadCaseComponent(locale: Locale, slug: string) {
  const key = Object.keys(caseModules).find((k) => k.endsWith(`/${locale}/${slug}.mdx`));
  return key ? (caseModules[key] as any)() : null;
}