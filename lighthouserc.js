module.exports = {
  ci: {
    collect: {
      startServerCommand: 'npm run preview',
      startServerReadyPattern: 'Local:',
      startServerReadyTimeout: 30000,
      url: [
        'http://localhost:4173/',
        'http://localhost:4173/blog',
        'http://localhost:4173/casos',
        'http://localhost:4173/blog/ia-veterinaria-2024',
        'http://localhost:4173/casos/clinica-barcelona-ia',
        'http://localhost:4173/en',
        'http://localhost:4173/en/blog',
        'http://localhost:4173/en/cases',
        'http://localhost:4173/en/blog/ai-veterinary-diagnostics',
        'http://localhost:4173/en/cases/london-ai-implementation'
      ],
      numberOfRuns: 1
    },
    assert: {
      assertions: {
        'categories:performance': ['warn', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['warn', { minScore: 0.95 }],
        'categories:seo': ['warn', { minScore: 0.95 }]
      }
    },
    upload: {
      target: 'temporary-public-storage'
    }
  }
};