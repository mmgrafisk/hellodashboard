#!/usr/bin/env bash
set -euo pipefail

PUBLISH_DIR="site"
ASSET_DIR="${PUBLISH_DIR}/gjs"

mkdir -p "${ASSET_DIR}"

echo "Fetching GrapesJS core + CSS + preset plugin..."
curl -L https://unpkg.com/grapesjs/dist/grapes.min.js -o "${ASSET_DIR}/grapes.min.js"
curl -L https://unpkg.com/grapesjs/dist/css/grapes.min.css -o "${ASSET_DIR}/grapes.min.css"
curl -L https://unpkg.com/grapesjs-preset-webpage/dist/grapesjs-preset-webpage.min.js -o "${ASSET_DIR}/grapesjs-preset-webpage.min.js"

echo "OK: Assets downloaded to ${ASSET_DIR}"
