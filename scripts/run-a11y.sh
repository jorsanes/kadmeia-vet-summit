#!/bin/bash

# Pa11y Accessibility Runner
echo "♿ Ejecutando solo tests de accesibilidad..."

# Build the project
npm run build || exit 1

# Start preview server in background
npm run preview &
SERVER_PID=$!

# Wait for server to be ready
sleep 10

# Function to cleanup
cleanup() {
    kill $SERVER_PID 2>/dev/null
    exit $1
}
trap cleanup EXIT

# Run Pa11y
npx pa11y-ci