#!/bin/bash

# Setup development tools for KADMEIA project
echo "🔧 Setting up development environment..."

# Initialize husky
echo "📦 Initializing Husky..."
npx husky install

# Create pre-commit hook
echo "🪝 Creating pre-commit hook..."
npx husky add .husky/pre-commit "npx lint-staged"

# Make the hook executable
chmod +x .husky/pre-commit

echo "✅ Development environment setup complete!"
echo ""
echo "📋 Available commands:"
echo "  npm run format      - Format all files with Prettier"
echo "  npm run lint        - Run ESLint"
echo "  npm run build       - Production build"
echo "  npm run build:analyze - Build with bundle analysis"
echo ""
echo "🚀 Pre-commit hooks are now active!"
echo "   - ESLint will run on staged files"
echo "   - Prettier will format staged files"