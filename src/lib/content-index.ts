import matter from "gray-matter";
import { BlogMeta, CaseMeta } from "@/content/schemas";

type Locale = "es" | "en";

// MDX crudo para extraer frontmatter (eager)
const blogRaw: Record<string, any> = import.meta.glob("/src/content/blog/**/*.mdx", { 
  query: '?raw', 
  import: 'default',
  eager: true 
});

const caseRaw: Record<string, any> = import.meta.glob("/src/content/casos/**/*.mdx", { 
  query: '?raw', 
  import: 'default',
  eager: true 
});

// Módulos MDX (no eager)
const blogModules: Record<string, any> = import.meta.glob("/src/content/blog/**/*.mdx");
const caseModules: Record<string, any> = import.meta.glob("/src/content/casos/**/*.mdx");

export type ContentItem<T> = {
  slug: string;
  locale: Locale;
  meta: T & { date: Date };
  path: string; // ruta del módulo dentro de Vite
};

function buildIndex<T>(rawMap: Record<string, any>, schema: any): ContentItem<T>[] {
  const out: ContentItem<T>[] = [];
  
  if (import.meta.env.DEV) {
    console.log("[content] buildIndex starting:", { totalFiles: Object.keys(rawMap).length });
  }
  
  for (const p in rawMap) {
    try {
      let raw = rawMap[p];
      
      // Aceptar tanto string directo como { default: string }
      if (typeof raw === 'object' && raw.default) {
        raw = raw.default;
      }
      
      // Verificar que el contenido sea una cadena válida
      if (typeof raw !== 'string' || !raw.trim()) {
        if (import.meta.env.DEV) {
          console.warn("[content] skipping invalid content:", p, typeof raw);
        }
        continue;
      }
      
      const { data } = matter(raw);
      const segs = p.split("/");
      const locale = segs[segs.length - 2] as Locale;
      const slug = segs[segs.length - 1].replace(/\.mdx$/, "");

      const parsed = schema.safeParse(data);
      if (!parsed.success) {
        if (import.meta.env.DEV) {
          console.warn("[content] invalid frontmatter:", p, {
            errors: parsed.error.format(),
            data: data
          });
        }
        continue;
      }
      
      // normalizamos date a Date real
      const meta = { ...parsed.data, date: new Date(String(parsed.data.date)) };
      if ((meta as any).draft) {
        if (import.meta.env.DEV) {
          console.warn("[content] skipping draft:", p);
        }
        continue;
      }

      if (import.meta.env.DEV) {
        console.log("[content] parsed successfully:", p, { slug, locale, title: meta.title });
      }
      
      out.push({ slug, locale, meta, path: p });
    } catch (itemError) {
      // Handle error per item, don't break the whole index
      if (import.meta.env.DEV) {
        console.error("[content] error processing file:", p, itemError);
      }
      continue;
    }
  }
  
  if (import.meta.env.DEV) {
    console.log("[content] buildIndex completed:", { totalFiles: Object.keys(rawMap).length, validItems: out.length });
  }
  
  return out.sort((a, b) => b.meta.date.getTime() - a.meta.date.getTime());
}

export const blogIndex = buildIndex<import("@/content/schemas").BlogMeta>(blogRaw, BlogMeta);
export const caseIndex = buildIndex<import("@/content/schemas").CaseMeta>(caseRaw, CaseMeta);

// Diagnostics en desarrollo
if (import.meta.env.DEV) {
  console.log('📚 Content Index loaded:', {
    blog: { total: blogIndex.length, es: blogIndex.filter(p => p.locale === 'es').length, en: blogIndex.filter(p => p.locale === 'en').length },
    cases: { total: caseIndex.length, es: caseIndex.filter(p => p.locale === 'es').length, en: caseIndex.filter(p => p.locale === 'en').length }
  });
}

// Resolución del import dinámico de un MDX (detalle)
export async function loadBlogComponent(locale: Locale, slug: string) {
  const key = Object.keys(blogModules).find((k) => k.endsWith(`/${locale}/${slug}.mdx`));
  return key ? (blogModules[key] as any)() : null;
}
export async function loadCaseComponent(locale: Locale, slug: string) {
  const key = Object.keys(caseModules).find((k) => k.endsWith(`/${locale}/${slug}.mdx`));
  return key ? (caseModules[key] as any)() : null;
}