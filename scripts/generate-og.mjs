#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Simple OG image generation using Sharp
async function generateOGImage(title, cover, outputPath, lang = 'es') {
  const width = 1200;
  const height = 630;
  const isSpanish = lang === 'es';

  try {
    // Create base canvas
    let image = sharp({
      create: {
        width,
        height,
        channels: 4,
        background: { r: 245, g: 241, b: 234, alpha: 1 } // Marfil claro
      }
    });

    // If cover exists, try to use it as background
    if (cover && fs.existsSync(path.join(process.cwd(), 'public', cover))) {
      try {
        const coverPath = path.join(process.cwd(), 'public', cover);
        const coverImage = sharp(coverPath)
          .resize(width, height, { fit: 'cover' })
          .composite([
            {
              input: Buffer.from(`
                <svg width="${width}" height="${height}">
                  <defs>
                    <linearGradient id="overlay" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" style="stop-color:rgba(30,42,56,0.7);stop-opacity:1" />
                      <stop offset="100%" style="stop-color:rgba(30,42,56,0.9);stop-opacity:1" />
                    </linearGradient>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#overlay)" />
                </svg>
              `),
              top: 0,
              left: 0
            }
          ]);
        
        image = coverImage;
      } catch (coverError) {
        console.warn(`Warning: Could not load cover image ${cover}, using fallback`);
      }
    }

    // Create SVG overlay with text and branding
    const svgOverlay = `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <style>
            .title { 
              font-family: 'Arial', sans-serif; 
              font-size: ${title.length > 60 ? '48px' : '56px'}; 
              font-weight: bold; 
              fill: white;
              text-anchor: start;
            }
            .brand { 
              font-family: 'Arial', sans-serif; 
              font-size: 32px; 
              font-weight: bold; 
              fill: #B38A3F;
            }
            .tagline { 
              font-family: 'Arial', sans-serif; 
              font-size: 18px; 
              fill: #B38A3F;
            }
          </style>
        </defs>
        
        <!-- Brand section -->
        <rect x="60" y="60" width="200" height="80" rx="8" fill="rgba(255,255,255,0.95)" />
        <text x="80" y="90" class="brand">KADMEIA</text>
        <text x="80" y="115" class="tagline">${isSpanish ? 'Consultoría veterinaria' : 'Veterinary consulting'}</text>
        
        <!-- Title -->
        <g>
          ${wrapText(title, 80, 200, 56, width - 160, cover ? 'white' : '#1E2A38')}
        </g>
        
        <!-- Bottom accent -->
        <rect x="60" y="${height - 20}" width="200" height="8" rx="4" fill="#B38A3F" />
      </svg>
    `;

    // Composite the SVG overlay
    const finalImage = await image
      .composite([
        {
          input: Buffer.from(svgOverlay),
          top: 0,
          left: 0
        }
      ])
      .png()
      .toFile(outputPath);

    console.log(`✅ Generated OG image: ${outputPath}`);
    return true;
  } catch (error) {
    console.error(`❌ Error generating OG image for "${title}":`, error.message);
    return false;
  }
}

// Helper function to wrap text in SVG
function wrapText(text, x, y, fontSize, maxWidth, color = '#1E2A38') {
  const words = text.split(' ');
  const lines = [];
  let currentLine = '';
  const maxCharsPerLine = Math.floor(maxWidth / (fontSize * 0.6));

  for (const word of words) {
    const testLine = currentLine + (currentLine ? ' ' : '') + word;
    if (testLine.length <= maxCharsPerLine) {
      currentLine = testLine;
    } else {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
    }
  }
  if (currentLine) lines.push(currentLine);

  // Limit to 3 lines and add ellipsis if needed
  if (lines.length > 3) {
    lines[2] = lines[2].substring(0, lines[2].length - 3) + '...';
    lines.splice(3);
  }

  return lines.map((line, index) => 
    `<text x="${x}" y="${y + (index * (fontSize + 10))}" style="font-family: Arial, sans-serif; font-size: ${fontSize}px; font-weight: bold; fill: ${color};">${escapeXml(line)}</text>`
  ).join('\n');
}

// Helper to escape XML characters
function escapeXml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Get all MDX files and process them
async function generateAllOGImages() {
  const blogDir = path.join(process.cwd(), 'src/content/blog');
  const casesDir = path.join(process.cwd(), 'src/content/casos');
  const outputBlogDir = path.join(process.cwd(), 'public/og/blog');
  const outputCasesDir = path.join(process.cwd(), 'public/og/cases');

  // Ensure output directories exist
  fs.mkdirSync(outputBlogDir, { recursive: true });
  fs.mkdirSync(outputCasesDir, { recursive: true });

  const processDirectory = async (dir, outputDir, type) => {
    if (!fs.existsSync(dir)) return;

    const langs = fs.readdirSync(dir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);

    for (const lang of langs) {
      const langDir = path.join(dir, lang);
      const files = fs.readdirSync(langDir)
        .filter(file => file.endsWith('.mdx'));

      for (const file of files) {
        const filePath = path.join(langDir, file);
        const content = fs.readFileSync(filePath, 'utf-8');
        
        // Extract frontmatter
        const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
        if (!frontmatterMatch) continue;

        const frontmatter = {};
        frontmatterMatch[1].split('\n').forEach(line => {
          const match = line.match(/^(\w+):\s*"?([^"]*)"?$/);
          if (match) {
            frontmatter[match[1]] = match[2];
          }
        });

        const slug = file.replace('.mdx', '');
        const title = frontmatter.title || slug;
        const cover = frontmatter.cover;
        
        const outputPath = path.join(outputDir, `${slug}-${lang}.png`);
        
        await generateOGImage(title, cover, outputPath, lang);
      }
    }
  };

  console.log('🎨 Generating OG images...');
  
  await processDirectory(blogDir, outputBlogDir, 'blog');
  await processDirectory(casesDir, outputCasesDir, 'cases');
  
  console.log('✅ OG image generation complete!');
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  generateAllOGImages().catch(console.error);
}

export { generateOGImage, generateAllOGImages };