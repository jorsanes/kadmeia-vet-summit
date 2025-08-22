#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { generateAllOGImages } from './generate-og.mjs';

// Create OG directories if they don't exist
const createDirectories = () => {
  const dirs = [
    'public/og',
    'public/og/blog', 
    'public/og/cases'
  ];
  
  dirs.forEach(dir => {
    fs.mkdirSync(dir, { recursive: true });
  });
};

// Main execution
const main = async () => {
  console.log('🎨 Setting up OG image directories...');
  createDirectories();
  
  console.log('📝 Generating OG images from MDX content...');
  await generateAllOGImages();
  
  console.log('✅ OG setup complete!');
};

main().catch(console.error);