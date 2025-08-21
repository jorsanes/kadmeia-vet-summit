import fs from 'fs';
import path from 'path';
import fg from 'fast-glob';
import matter from 'gray-matter';

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

const postsEs = readDocs('src/content/blog/es/*.mdx', '/blog');
const postsEn = readDocs('src/content/blog/en/*.mdx', '/en/blog');

const all = [...postsEs, ...postsEn];

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