// eslint.config.js
import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import jsxA11y from 'eslint-plugin-jsx-a11y';

export default [
  js.configs.recommended,

  // Reglas TS con chequeo de tipos
  ...tseslint.configs.recommendedTypeChecked,

  // Ignora artefactos y estáticos
  { ignores: ['dist', 'build', 'public', 'scripts/*.mjs'] },

  // Reglas para TS/TSX (React)
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        // TS 5 project service (no hace falta 'project')
        projectService: true,
        tsconfigRootDir: import.meta.dirname
      },
      globals: { ...globals.browser, ...globals.es2022 }
    },
    plugins: {
      'react-hooks': reactHooks,
      'jsx-a11y': jsxA11y
    },
    rules: {
      // Hooks
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      // Accesibilidad básica
      'jsx-a11y/alt-text': 'warn',
      'jsx-a11y/anchor-is-valid': 'warn',
      'jsx-a11y/no-autofocus': 'off',
      // TS sane
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/consistent-type-imports': 'warn',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }]
    }
  }
  // eslint.config.js (añade este bloque al final del export default array)
{
  files: ["src/components/ui/chart.tsx"],
  rules: {
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-unsafe-assignment": "off",
    "@typescript-eslint/no-unsafe-member-access": "off",
    "@typescript-eslint/no-unsafe-argument": "off",
    "@typescript-eslint/no-unnecessary-type-assertion": "off"
  }
}
];
