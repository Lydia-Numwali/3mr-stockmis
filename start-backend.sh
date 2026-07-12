#!/bin/bash
set -e

cd "$(dirname "$0")/backend"
node dist/src/main.js
