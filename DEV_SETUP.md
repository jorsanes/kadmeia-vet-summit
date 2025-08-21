# 🛠️ Development Setup - KADMEIA

## Herramientas de Desarrollo Configuradas

### ✨ Prettier
- **Configuración**: `.prettierrc`
- **Ignora**: `.prettierignore`
- **Script**: `npm run format`

### 🔍 Lint-staged
- **Configuración**: `lint-staged.config.js`
- **Ejecuta**: ESLint + Prettier en archivos staged

### 🪝 Husky
- **Hook pre-commit**: `.husky/pre-commit`
- **Ejecuta**: `lint-staged` antes de cada commit

### 📊 Bundle Analysis
- **Script**: `npm run build:analyze`
- **Output**: `dist/bundle-analysis.html`
- **Visualización**: Treemap interactivo

## 🚀 Comandos Disponibles

```bash
# Formatear código
npm run format

# Análisis de bundle
npm run build:analyze

# Setup inicial (solo primera vez)
chmod +x scripts/setup-dev.sh && ./scripts/setup-dev.sh
```

## 📝 Flujo de Trabajo

1. **Desarrollo normal**: Los hooks se ejecutan automáticamente
2. **Pre-commit**: 
   - ESLint revisa y corrige errores
   - Prettier formatea el código
3. **Análisis periódico**: `npm run build:analyze` para revisar el bundle

## 🎯 Beneficios

- ✅ Código consistente y formateado
- ✅ Detección temprana de errores
- ✅ Commits limpios automáticamente
- ✅ Análisis visual del bundle size
- ✅ Optimización de chunks automática

## 🔧 Configuración Prettier

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": false,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "bracketSpacing": true,
  "arrowParens": "avoid",
  "endOfLine": "lf"
}
```

## 📊 Chunks Configurados

- **vendor**: React, React DOM
- **ui**: Componentes Radix UI
- **utils**: Utilidades (clsx, tailwind-merge, etc.)
- **router**: React Router DOM
- **mdx**: MDX y plugins relacionados