#!/bin/bash
set -e

echo "==> Building backend..."
cd "$(dirname "$0")/backend"
echo "==> Now in: $(pwd)"
echo "==> Removing node_modules and package-lock if they exist..."
rm -rf node_modules package-lock.json
echo "==> Fresh install..."
npm install
echo "==> Building..."
npm run build
echo "==> Backend build complete!"
