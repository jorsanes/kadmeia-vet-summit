import fs from 'fs';
import path from 'path';
import fg from 'fast-glob';
import matter from 'gray-matter';
import { createClient } from '@supabase/supabase-js';

// Detect output directory (dist for production builds, public for development)
const outDir = fs.existsSync('dist') ? 'dist' : 'public';

const site = 'https://www.kadmeia.com';

function readDocs(pattern, baseUrl) {
  const files = fg.sync(pattern);
  const items = [];
  for (const f of files) {
    const raw = fs.readFileSync(f, 'utf8');
    const { data, content } = matter(raw);
    if (data?.draft) continue;
    const slug = path.basename(f, '.mdx');
    const url = `${site}${baseUrl}/${slug}`;
    items.push({
      title: data.title ?? slug,
      url,
      date: data.date ?? new Date().toISOString(),
      description: data.excerpt ?? '',
    });
  }
  return items.sort((a,b) => (a.date < b.date ? 1 : -1));
}

async function readDbPosts() {
  try {
    const supabaseUrl = process.env.SUPABASE_URL || 'https://tmtokjrdmkcznvlqhxlh.supabase.co';
    const supabaseKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRtdG9ranJkbWtjem52bHFoeGxoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU2ODU5MzIsImV4cCI6MjA3MTI2MTkzMn0.E_646tFbCw6eB_VjkXSoVUBW4on1dbrWeVr2wobqkMU';
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    const items = [];

    // Get Spanish posts
    const { data: postsEs } = await supabase
      .from('blog_posts')
      .select('slug, title, excerpt, published_at, lang')
      .eq('status', 'published')
      .eq('lang', 'es');

    if (postsEs) {
      for (const post of postsEs) {
        items.push({
          title: post.title,
          url: `${site}/blog/${post.slug}`,
          date: post.published_at || new Date().toISOString(),
          description: post.excerpt || '',
        });
      }
    }

    // Get English posts
    const { data: postsEn } = await supabase
      .from('blog_posts')
      .select('slug, title, excerpt, published_at, lang')
      .eq('status', 'published')
      .eq('lang', 'en');

    if (postsEn) {
      for (const post of postsEn) {
        items.push({
          title: post.title,
          url: `${site}/en/blog/${post.slug}`,
          date: post.published_at || new Date().toISOString(),
          description: post.excerpt || '',
        });
      }
    }

    console.log(`[RSS] Collected ${items.length} database posts`);
    return items;
  } catch (error) {
    console.warn(`[RSS] Could not fetch database posts: ${error.message}`);
    return [];
  }
}

async function generateRss() {
  const postsEs = readDocs('src/content/blog/es/*.mdx', '/blog');
  const postsEn = readDocs('src/content/blog/en/*.mdx', '/en/blog');
  const dbPosts = await readDbPosts();

  const all = [...postsEs, ...postsEn, ...dbPosts].sort((a,b) => (a.date < b.date ? 1 : -1));

  const xml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
<channel>
  <title>KADMEIA Blog</title>
  <link>${site}</link>
  <description>IA y automatización veterinaria</description>
  ${all.map(i => `
  <item>
    <title><![CDATA[${i.title}]]></title>
    <link>${i.url}</link>
    <pubDate>${new Date(i.date).toUTCString()}</pubDate>
    <description><![CDATA[${i.description}]]></description>
    <guid>${i.url}</guid>
  </item>`).join('')}
</channel>
</rss>`;

  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'rss.xml'), xml);
  console.log(`✅ RSS generado: ${outDir}/rss.xml (${all.length} items)`);
}

generateRss().catch(console.error);