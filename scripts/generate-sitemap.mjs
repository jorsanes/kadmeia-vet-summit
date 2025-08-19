#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { glob } from 'fast-glob';
import matter from 'gray-matter';

const baseUrl = 'https://kadmeia.com';

// Static routes for both languages
const staticRoutes = [
  { es: '/', en: '/en' },
  { es: '/servicios', en: '/en/services' },
  { es: '/casos', en: '/en/cases' },
  { es: '/blog', en: '/en/blog' },
  { es: '/sobre', en: '/en/about' },
  { es: '/contacto', en: '/en/contact' },
  { es: '/privacidad', en: '/en/privacy' },
  { es: '/aviso-legal', en: '/en/legal' },
  { es: '/cookies', en: '/en/cookies' }
];

async function generateSitemap() {
  console.log('Generating sitemap...');
  
  let urls = [];
  
  // Add static routes
  for (const route of staticRoutes) {
    // Spanish route
    urls.push({
      loc: `${baseUrl}${route.es}`,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'weekly',
      priority: route.es === '/' ? '1.0' : '0.8'
    });
    
    // English route
    urls.push({
      loc: `${baseUrl}${route.en}`,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'weekly',
      priority: route.en === '/en' ? '1.0' : '0.8'
    });
  }
  
  // Add MDX blog posts
  const blogFiles = await glob('src/content/blog/**/*.mdx');
  for (const file of blogFiles) {
    try {
      const content = fs.readFileSync(file, 'utf8');
      const { data } = matter(content);
      
      if (data.title && data.date && data.lang) {
        const slug = path.basename(file, '.mdx');
        const blogPath = data.lang === 'en' ? `/en/blog/${slug}` : `/blog/${slug}`;
        
        urls.push({
          loc: `${baseUrl}${blogPath}`,
          lastmod: new Date(data.date).toISOString().split('T')[0],
          changefreq: 'monthly',
          priority: '0.7'
        });
      }
    } catch (error) {
      console.warn(`Warning: Could not process blog file ${file}:`, error.message);
    }
  }
  
  // Add MDX case studies
  const caseFiles = await glob('src/content/casos/**/*.mdx');
  for (const file of caseFiles) {
    try {
      const content = fs.readFileSync(file, 'utf8');
      const { data } = matter(content);
      
      if (data.title && data.date && data.lang) {
        const slug = path.basename(file, '.mdx');
        const casePath = data.lang === 'en' ? `/en/cases/${slug}` : `/casos/${slug}`;
        
        urls.push({
          loc: `${baseUrl}${casePath}`,
          lastmod: new Date(data.date).toISOString().split('T')[0],
          changefreq: 'monthly',
          priority: '0.7'
        });
      }
    } catch (error) {
      console.warn(`Warning: Could not process case file ${file}:`, error.message);
    }
  }
  
  // Generate XML
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>`;
  
  // Ensure public directory exists
  const publicDir = 'public';
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }
  
  // Write sitemap
  fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemap);
  
  console.log(`✅ Sitemap generated with ${urls.length} URLs`);
  console.log('📁 Saved to: public/sitemap.xml');
}

generateSitemap().catch(error => {
  console.error('❌ Error generating sitemap:', error);
  process.exit(1);
});