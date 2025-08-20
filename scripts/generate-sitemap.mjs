#!/usr/bin/env node
/**
 * Generate sitemap.xml for KADMEIA
 * - Usa SITE_URL si existe; si no, https://kadmeia.com
 * - Salta en PREVIEW (lovable.app o SITE_ENV=preview)
 * - Incluye rutas ES/EN + MDX (blog/casos), sin duplicados
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync, statSync } from "node:fs";
import * as path from "node:path";
import fg from "fast-glob";
import matter from "gray-matter";

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
  urls = urls.concat(dynamic);

  // 3) De-dup + orden
  const map = new Map();
  for (const u of urls) map.set(u.loc, u);
  urls = Array.from(map.values()).sort((a, b) => a.loc.localeCompare(b.loc));

  // 4) XML
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join("\n")}
</urlset>`;

  if (!existsSync("public")) mkdirSync("public", { recursive: true });
  writeFileSync(path.join("public", "sitemap.xml"), xml, "utf8");

  console.log(`✅ Sitemap generated: ${urls.length} URLs → public/sitemap.xml`);
}

main().catch(err => {
  console.error("❌ Error generating sitemap:", err);
  process.exit(1);
});
