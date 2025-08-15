#!/usr/bin/env bash
set -euo pipefail

: "${VITE_FIREBASE_CONFIG:?Missing VITE_FIREBASE_CONFIG env var}"

# Ensure JSON is single-line and valid-looking (basic check)
if [[ ! "$VITE_FIREBASE_CONFIG" =~ ^\{.*\}$ ]]; then
  echo "VITE_FIREBASE_CONFIG must be a single-line JSON string starting with { and ending with }"
  exit 1
fi

printf '%s' "$VITE_FIREBASE_CONFIG" > firebase-config.json
echo "Wrote ./firebase-config.json"
