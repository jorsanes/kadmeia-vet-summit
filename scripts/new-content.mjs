#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

const [,, type, lang = 'es', slug] = process.argv;

if (!type || !['post', 'case'].includes(type)) {
  console.error('Uso: node scripts/new-content.mjs <post|case> [es|en] [slug]');
  process.exit(1);
}

if (!['es', 'en'].includes(lang)) {
  console.error('Idioma debe ser "es" o "en"');
  process.exit(1);
}

const slugToUse = slug || `nuevo-${type}-${Date.now()}`;
const now = new Date().toISOString().split('T')[0];

const dir = type === 'post' 
  ? `src/content/blog/${lang}`
  : `src/content/casos/${lang}`;

const filename = `${slugToUse}.mdx`;
const filepath = path.join(dir, filename);

// Ensure directory exists
fs.mkdirSync(dir, { recursive: true });

const frontmatter = type === 'post' ? {
  title: `Nuevo artículo ${lang.toUpperCase()}`,
  date: now,
  excerpt: 'Descripción breve del artículo...',
  cover: '',
  lang: lang,
  tags: ['tecnología', 'veterinaria'],
  draft: false
} : {
  title: `Nuevo caso ${lang.toUpperCase()}`,
  date: now,
  excerpt: 'Descripción breve del caso...',
  cover: '',
  lang: lang,
  tags: ['caso-éxito', 'implementación'],
  draft: false
};

const content = `---
${Object.entries(frontmatter).map(([key, value]) => {
  if (Array.isArray(value)) {
    return `${key}:\n${value.map(v => `  - ${v}`).join('\n')}`;
  }
  return `${key}: ${typeof value === 'string' ? `"${value}"` : value}`;
}).join('\n')}
---

# ${frontmatter.title}

${type === 'post' 
  ? 'Contenido del artículo aquí...'
  : 'Descripción del caso de éxito aquí...'}

## Sección ejemplo

Texto de ejemplo.
`;

if (fs.existsSync(filepath)) {
  console.error(`❌ El archivo ya existe: ${filepath}`);
  process.exit(1);
}

fs.writeFileSync(filepath, content);
console.log(`✅ Creado: ${filepath}`);
console.log(`📝 Edita el archivo y cambia draft: false cuando esté listo`);