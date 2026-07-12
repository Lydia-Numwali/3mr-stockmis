#!/bin/bash
set -e

echo "==> Building backend..."
cd backend
npm install
npm run build
echo "==> Backend build complete!"
