#!/bin/bash
set -e

echo "🚀 Starting AdaptiveAI Verification Suite..."

echo "📦 Step 1: Building project..."
npm run build

echo "🔍 Step 2: Type checking..."
npm run typecheck

echo "💅 Step 3: Linting..."
npm run lint

echo "🧪 Step 4: Running Unit & Integration tests..."
npm test

echo "🌐 Step 5: Running E2E tests (headless)..."
# In a real environment we might need to start the server first or use a dev server
# For this script we assume the environment is set up or use playwright's webServer config
npm run test:e2e

echo "✅ Verification complete. All systems green!"
