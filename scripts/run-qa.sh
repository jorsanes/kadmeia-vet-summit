#!/bin/bash

# QA Runner Script for KADMEIA
# Ejecuta todos los tests de calidad automáticamente

echo "🚀 Iniciando QA automático para KADMEIA..."
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Build the project
echo "📦 Building project..."
if npm run build; then
    echo -e "${GREEN}✅ Build completado${NC}"
else
    echo -e "${RED}❌ Error en build${NC}"
    exit 1
fi

echo ""

# Start preview server in background
echo "🌐 Iniciando servidor de preview..."
npm run preview &
SERVER_PID=$!

# Wait for server to be ready
echo "⏳ Esperando que el servidor esté listo..."
sleep 10

# Function to cleanup server on exit
cleanup() {
    echo ""
    echo "🧹 Cerrando servidor..."
    kill $SERVER_PID 2>/dev/null
    exit $1
}

# Trap to cleanup on script exit
trap cleanup EXIT

# Test if server is running
if curl -s http://localhost:4173 > /dev/null; then
    echo -e "${GREEN}✅ Servidor listo en http://localhost:4173${NC}"
else
    echo -e "${RED}❌ Servidor no responde${NC}"
    exit 1
fi

echo ""

# Run Lighthouse CI
echo "🔍 Ejecutando Lighthouse CI..."
if npx lhci autorun; then
    echo -e "${GREEN}✅ Lighthouse CI completado${NC}"
else
    echo -e "${YELLOW}⚠️  Lighthouse CI detectó issues${NC}"
fi

echo ""

# Run Pa11y accessibility tests
echo "♿ Ejecutando Pa11y para accesibilidad..."
if npx pa11y-ci; then
    echo -e "${GREEN}✅ Pa11y completado${NC}"
else
    echo -e "${YELLOW}⚠️  Pa11y detectó issues de accesibilidad${NC}"
fi

echo ""
echo "🎉 QA automático completado!"
echo "📊 Objetivos: Performance ≥90, Accessibility ≥90, SEO ≥95, Best Practices ≥95"
echo ""
echo "Para ejecutar tests individuales:"
echo "  npm run build && npx lhci autorun"
echo "  npm run build && npm run preview & npx pa11y-ci"