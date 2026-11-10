#!/bin/bash
# Regenerate site/src/data/recordings.json from every download manifest on disk, so that references on the
# site link to the archive's audio at the cited time. Run it whenever a series manifest is added or changed,
# and before every deploy; then commit the map with the content that links to it.
# Usage: regen_map.sh <harvest-root> <repo-root> [speaker]
set -eu
HARVEST="$1"; REPO="$2"; SPEAKER="${3:-omar-abdelkafy}"
RAW="$HARVEST/raw/assabile/$SPEAKER"
MANIFESTS=("$RAW"/*.manifest.tsv "$RAW"/manifests/*.manifest.tsv)
EXISTING=()
for m in "${MANIFESTS[@]}"; do [ -s "$m" ] && EXISTING+=("$m"); done
[ ${#EXISTING[@]} -gt 0 ] || { echo "no manifests under $RAW"; exit 1; }
"$HARVEST/.venv-audio/bin/python" "$REPO/scripts/harvest/audio/recordings_map.py" "${EXISTING[@]}" \
  --speaker "$SPEAKER" --out "$REPO/site/src/data/recordings.json"
