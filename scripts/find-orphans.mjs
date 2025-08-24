#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { glob } from 'glob';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..');

// Helper to read file content
function readFile(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf-8');
  } catch (error) {
    console.warn(`Could not read file: ${filePath}`);
    return '';
  }
}

// Extract internal links from content
function extractInternalLinks(content) {
  const linkRegex = /href=["']([^"']*?)["']/g;
  const links = [];
  let match;
  
  while ((match = linkRegex.exec(content)) !== null) {
    const href = match[1];
    // Only internal links (starting with / but not //)
    if (href.startsWith('/') && !href.startsWith('//')) {
      links.push(href);
    }
  }
  
  return [...new Set(links)]; // Remove duplicates
}

// Extract routes from App.tsx
function extractAppRoutes() {
  const appPath = path.join(projectRoot, 'src/App.tsx');
  const content = readFile(appPath);
  
  const routeRegex = /<Route\s+path=["']([^"']*?)["']/g;
  const routes = [];
  let match;
  
  while ((match = routeRegex.exec(content)) !== null) {
    const route = match[1];
    // Ignore dynamic routes and wildcards
    if (!route.includes(':') && route !== '*') {
      routes.push(route);
    }
  }
  
  return [...new Set(routes)];
}

// Find all MDX content files
async function findContentFiles() {
  const patterns = [
    'src/content/**/*.mdx',
    'src/content/**/*.md'
  ];
  
  const files = [];
  for (const pattern of patterns) {
    const matches = await glob(pattern, { cwd: projectRoot });
    files.push(...matches);
  }
  
  return files;
}

// Extract links from various file types
async function extractAllLinks() {
  const links = new Set();
  
  // Header and Footer components
  const componentPaths = [
    'src/components/layout/Header.tsx',
    'src/components/layout/Footer.tsx',
    'src/components/layout/HrefLAngLinks.tsx'
  ];
  
  for (const componentPath of componentPaths) {
    const fullPath = path.join(projectRoot, componentPath);
    const content = readFile(fullPath);
    const componentLinks = extractInternalLinks(content);
    componentLinks.forEach(link => links.add(link));
  }
  
  // MDX content files
  const contentFiles = await findContentFiles();
  for (const file of contentFiles) {
    const fullPath = path.join(projectRoot, file);
    const content = readFile(fullPath);
    const contentLinks = extractInternalLinks(content);
    contentLinks.forEach(link => links.add(link));
  }
  
  return Array.from(links);
}

// Normalize routes for comparison
function normalizeRoute(route) {
  return route.replace(/\/$/, '') || '/';
}

// Main audit function
async function auditOrphanPages() {
  console.log('🔍 Starting dead pages audit...\n');
  
  const routes = extractAppRoutes();
  const links = await extractAllLinks();
  
  console.log(`📋 Found ${routes.length} routes in App.tsx`);
  console.log(`🔗 Found ${links.length} internal links\n`);
  
  // Normalize for comparison
  const normalizedRoutes = routes.map(normalizeRoute);
  const normalizedLinks = links.map(normalizeRoute);
  
  // Find broken links (links that don't have corresponding routes)
  const brokenLinks = normalizedLinks.filter(link => !normalizedRoutes.includes(link));
  
  // Find orphaned routes (routes that don't receive any links)
  const orphanedRoutes = normalizedRoutes.filter(route => !normalizedLinks.includes(route));
  
  // Report findings
  console.log('🚨 BROKEN LINKS (links pointing to non-existent routes):');
  if (brokenLinks.length === 0) {
    console.log('✅ No broken links found');
  } else {
    brokenLinks.forEach(link => console.log(`   ${link}`));
  }
  
  console.log('\n🏝️  ORPHANED ROUTES (routes with no incoming links):');
  if (orphanedRoutes.length === 0) {
    console.log('✅ No orphaned routes found');
  } else {
    orphanedRoutes.forEach(route => console.log(`   ${route}`));
  }
  
  // Check specific known issues
  console.log('\n🔍 KNOWN ISSUES TO CHECK:');
  
  const headerPath = path.join(projectRoot, 'src/components/layout/Header.tsx');
  const headerContent = readFile(headerPath);
  
  if (headerContent.includes('/servicios') || headerContent.includes('/sobre')) {
    console.log('⚠️  Header contains Spanish routes (/servicios, /sobre) but App.tsx uses English routes (/services, /about)');
  }
  
  if (headerContent.includes('/services') && headerContent.includes('/about')) {
    console.log('✅ Header uses English routes matching App.tsx');
  }
  
  // Summary
  console.log('\n📊 SUMMARY:');
  console.log(`   Total routes: ${routes.length}`);
  console.log(`   Total links: ${links.length}`);
  console.log(`   Broken links: ${brokenLinks.length}`);
  console.log(`   Orphaned routes: ${orphanedRoutes.length}`);
  
  return {
    routes: normalizedRoutes,
    links: normalizedLinks,
    brokenLinks,
    orphanedRoutes
  };
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  auditOrphanPages().catch(console.error);
}

export { auditOrphanPages };