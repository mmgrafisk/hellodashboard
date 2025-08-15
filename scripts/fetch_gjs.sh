#!/usr/bin/env bash
set -euo pipefail

: "${VITE_FIREBASE_CONFIG:?Missing VITE_FIREBASE_CONFIG env var}"

if [[ ! "$VITE_FIREBASE_CONFIG" =~ ^\{.*\}$ ]]; then
  echo "VITE_FIREBASE_CONFIG must be a single-line JSON string starting with { and ending with }"
  exit 1
fi

write_cfg() {
  local target="$1/firebase-config.json"
  mkdir -p "$(dirname "$target")"
  printf '%s' "$VITE_FIREBASE_CONFIG" > "$target"
  echo "Wrote $target"
}

# Always write to project root (useful if publish='.')
write_cfg "."

# If Netlify exposes a publish dir env, write there too
if [[ -n "${PUBLISH_DIR:-}" ]]; then
  write_cfg "$PUBLISH_DIR"
fi
if [[ -n "${NETLIFY_PUBLISH_DIR:-}" ]]; then
  write_cfg "$NETLIFY_PUBLISH_DIR"
fi

# Best-effort common publish folders
for d in "public" "dist" "build" ; do
  if [[ -d "$d" ]]; then
    write_cfg "$d"
  fi
done
