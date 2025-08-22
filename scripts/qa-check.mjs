#!/usr/bin/env node

import { spawn } from 'child_process';
import { createServer } from 'vite';
import { readFileSync } from 'fs';

const packageJson = JSON.parse(readFileSync('./package.json', 'utf8'));

console.log('🚀 Iniciando QA automático para KADMEIA...\n');

// Start preview server in background
console.log('📦 Iniciando servidor de preview...');
const server = spawn('npm', ['run', 'preview'], { 
  stdio: 'pipe',
  shell: true 
});

let serverReady = false;

// Wait for server to be ready
server.stdout.on('data', (data) => {
  const output = data.toString();
  if (output.includes('Local:') && !serverReady) {
    serverReady = true;
    console.log('✅ Servidor listo\n');
    runTests();
  }
});

server.stderr.on('data', (data) => {
  // Ignore preview server stderr unless it's an error
  const output = data.toString();
  if (output.includes('ERROR') || output.includes('EADDRINUSE')) {
    console.error('❌ Error en servidor:', output);
    process.exit(1);
  }
});

function runCommand(command, args) {
  return new Promise((resolve, reject) => {
    const process = spawn(command, args, { stdio: 'inherit', shell: true });
    process.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command failed with code ${code}`));
      }
    });
  });
}

async function runTests() {
  try {
    // Run Lighthouse CI
    console.log('🔍 Ejecutando Lighthouse CI...');
    await runCommand('npx', ['lhci', 'autorun']);
    console.log('✅ Lighthouse CI completado\n');

    // Run Pa11y
    console.log('♿ Ejecutando Pa11y para accesibilidad...');
    await runCommand('npx', ['pa11y-ci']);
    console.log('✅ Pa11y completado\n');

    console.log('🎉 QA automático completado exitosamente!');
    console.log('📊 Objetivos: Performance ≥90, Accessibility ≥90, SEO ≥95, Best Practices ≥95');
    
  } catch (error) {
    console.error('❌ Error en QA:', error.message);
    process.exit(1);
  } finally {
    // Kill preview server
    server.kill();
    process.exit(0);
  }
}

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n⏹️  Interrumpido por usuario');
  server.kill();
  process.exit(0);
});

process.on('SIGTERM', () => {
  server.kill();
  process.exit(0);
});