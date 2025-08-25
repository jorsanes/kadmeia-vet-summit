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
        'http://localhost:4173/blog/oportunidades-reales-en-ia-para-veterinarios-que-si-se-notan-en-el-dia-a-dia',
        'http://localhost:4173/casos/implantacion-ia-madrid',
        'http://localhost:4173/en',
        'http://localhost:4173/en/blog',
        'http://localhost:4173/en/cases'
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