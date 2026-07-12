#!/bin/bash
set -e

echo "==> Building frontend..."
cd "$(dirname "$0")/frontend"
echo "==> Now in: $(pwd)"
echo "==> Installing dependencies..."
npm install
echo "==> Building Next.js app..."
npm run build
echo "==> Frontend build complete!"
