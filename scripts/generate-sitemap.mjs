#!/usr/bin/env node
/**
 * Generate sitemap.xml for KADMEIA
 * - Usa SITE_URL si existe; si no, https://kadmeia.com
 * - Salta en PREVIEW (lovable.app o SITE_ENV=preview)
 * - Incluye rutas ES/EN + MDX (blog/casos) + DB content, sin duplicados
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync, statSync } from "node:fs";
import * as path from "node:path";
import fg from "fast-glob";
import matter from "gray-matter";
import { createClient } from '@supabase/supabase-js';

// Detect output directory (dist for production builds, public for development)
const outDir = existsSync('dist') ? 'dist' : 'public';

// -------- Config --------
const BASE_URL = (process.env.SITE_URL || "https://kadmeia.com").replace(/\/+$/, "");
const IS_PREVIEW = process.env.SITE_ENV === "preview" || BASE_URL.includes(".lovable.app");

if (IS_PREVIEW) {
  console.log("[sitemap] Preview build detected — skipping sitemap generation");
  process.exit(0);
}

// Rutas estáticas (ajusta si cambias paths)
const STATIC = [
  { es: "/",            en: "/en" },
  { es: "/servicios",   en: "/en/services" },
  { es: "/casos",       en: "/en/cases" },
  { es: "/blog",        en: "/en/blog" },
  { es: "/sobre",       en: "/en/about" },
  { es: "/contacto",    en: "/en/contact" },
  { es: "/privacidad",  en: "/en/privacy" },
  { es: "/aviso-legal", en: "/en/legal" },
  { es: "/cookies",     en: "/en/cookies" }
];

// -------- Helpers --------
function addUrl(list, pathname, { lastmod = new Date(), changefreq = "weekly", priority = "0.7" } = {}) {
  const clean = pathname.startsWith("/") ? pathname : `/${pathname}`;
  list.push({
    loc: `${BASE_URL}${clean}`,
    lastmod: new Date(lastmod).toISOString().split("T")[0],
    changefreq,
    priority
  });
}

async function collectMdxEntries() {
  const entries = [];
  const files = await fg([
    "src/content/blog/{es,en}/**/*.mdx",
    "src/content/casos/{es,en}/**/*.mdx"
  ], { dot: false });

  for (const file of files) {
    try {
      const raw = readFileSync(file, "utf8");
      const { data } = matter(raw);
      if (data?.draft) continue; // permite ocultar borradores

      const slug = path.basename(file, ".mdx");
      const segs = file.split(path.sep);
      const sectionIdx = segs.findIndex(s => s === "blog" || s === "casos");
      const section = segs[sectionIdx];             // blog | casos
      const lang = (data.lang ?? segs[sectionIdx + 1] ?? "es").toLowerCase();

      const route =
        section === "blog"
          ? (lang === "en" ? `/en/blog/${slug}`  : `/blog/${slug}`)
          : (lang === "en" ? `/en/cases/${slug}` : `/casos/${slug}`);

      const lm = data.date || statSync(file).mtime;
      entries.push({
        loc: `${BASE_URL}${route}`,
        lastmod: new Date(lm).toISOString().split("T")[0],
        changefreq: "monthly",
        priority: "0.7"
      });
    } catch (err) {
      console.warn(`[sitemap] Warning: cannot parse ${file} → ${String(err.message || err)}`);
    }
  }
  return entries;
}

async function collectDbEntries() {
  // Skip DB content in preview environments
  if (IS_PREVIEW) return [];
  
  try {
    const supabaseUrl = process.env.SUPABASE_URL || 'https://tmtokjrdmkcznvlqhxlh.supabase.co';
    const supabaseKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRtdG9ranJkbWtjem52bHFoeGxoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU2ODU5MzIsImV4cCI6MjA3MTI2MTkzMn0.E_646tFbCw6eB_VjkXSoVUBW4on1dbrWeVr2wobqkMU';
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    const entries = [];

    // Get published blog posts from DB
    const { data: blogPosts } = await supabase
      .from('blog_posts')
      .select('slug, lang, published_at')
      .eq('status', 'published');

    if (blogPosts) {
      for (const post of blogPosts) {
        const route = post.lang === 'en' ? `/en/blog/${post.slug}` : `/blog/${post.slug}`;
        entries.push({
          loc: `${BASE_URL}${route}`,
          lastmod: new Date(post.published_at || new Date()).toISOString().split("T")[0],
          changefreq: "monthly",
          priority: "0.7"
        });
      }
    }

    // Get published case studies from DB
    const { data: caseStudies } = await supabase
      .from('case_studies')
      .select('slug, lang, published_at')
      .eq('status', 'published');

    if (caseStudies) {
      for (const caseStudy of caseStudies) {
        const route = caseStudy.lang === 'en' ? `/en/cases/${caseStudy.slug}` : `/casos/${caseStudy.slug}`;
        entries.push({
          loc: `${BASE_URL}${route}`,
          lastmod: new Date(caseStudy.published_at || new Date()).toISOString().split("T")[0],
          changefreq: "monthly",
          priority: "0.7"
        });
      }
    }

    console.log(`[sitemap] Collected ${entries.length} database entries`);
    return entries;
  } catch (error) {
    console.warn(`[sitemap] Could not fetch database content: ${error.message}`);
    return [];
}

// -------- Main --------
async function main() {
  console.log(`[sitemap] Generating for base: ${BASE_URL}`);

  // 1) Estáticas ES/EN
  let urls = [];
  for (const r of STATIC) {
    addUrl(urls, r.es, { priority: r.es === "/" ? "1.0" : "0.8" });
    addUrl(urls, r.en, { priority: r.en === "/en" ? "1.0" : "0.8" });
  }

  // 2) MDX dinámico
  const dynamic = await collectMdxEntries();
  
  // 3) DB content
  const dbEntries = await collectDbEntries();
  
  urls = urls.concat(dynamic, dbEntries);

  // 4) De-dup + orden
  const map = new Map();
  for (const u of urls) map.set(u.loc, u);
  urls = Array.from(map.values()).sort((a, b) => a.loc.localeCompare(b.loc));

  // 5) XML
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join("\n")}
</urlset>`;

  if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });
  writeFileSync(path.join(outDir, "sitemap.xml"), xml, "utf8");

  console.log(`✅ Sitemap generated: ${urls.length} URLs → ${outDir}/sitemap.xml`);
}

main().catch(err => {
  console.error("❌ Error generating sitemap:", err);
  process.exit(1);
});
