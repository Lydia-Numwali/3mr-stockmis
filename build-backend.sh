#!/bin/bash
set -e

echo "==> Building backend..."
echo "==> Current directory: $(pwd)"
echo "==> Changing to backend directory..."
cd "$(dirname "$0")/backend"
echo "==> Now in: $(pwd)"
echo "==> Installing dependencies..."
npm install
echo "==> Building..."
npm run build
echo "==> Backend build complete!"
