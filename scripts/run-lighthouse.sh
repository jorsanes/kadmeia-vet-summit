#!/bin/bash

# Lighthouse CI Runner
echo "🔍 Ejecutando solo Lighthouse CI..."

# Build the project
npm run build || exit 1

# Run Lighthouse CI
npx lhci autorun