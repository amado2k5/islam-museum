#!/bin/bash
# Queue for one speaker's series, one after another: discover the episode links (once), download each
# episode politely, then transcribe it with the working engine (Qwen3-ASR). Resumable: each step skips what is done.
# Usage: run_queue.sh <speaker> <harvest-root> <repo-root> <series slug> [<series slug> ...]
set -u
SPEAKER="$1"; HARVEST="$2"; REPO="$3"; shift 3
PY="$HARVEST/.venv-audio/bin/python"
RAW="$HARVEST/raw/assabile/$SPEAKER"
MAN="$RAW/manifests"
mkdir -p "$MAN"
for SERIES in "$@"; do
  echo "[$(date +%H:%M:%S)] series $SERIES"
  if [ ! -s "$MAN/$SERIES.manifest.tsv" ]; then
    "$PY" "$REPO/scripts/harvest/audio/discover_series.py" --speaker "$SPEAKER" --series "$SERIES" --out "$MAN" || { echo "discover failed: $SERIES"; continue; }
  fi
  "$PY" "$REPO/scripts/harvest/audio/download.py" --out "$RAW" --manifest "$MAN/$SERIES.manifest.tsv" || { echo "download failed: $SERIES"; continue; }
  FILES=("$RAW/$SERIES"/ep*.mp3 "$RAW/$SERIES"/ep*.mp4 "$RAW/$SERIES"/ep*.m4a)
  EXIST=()
  for f in "${FILES[@]}"; do [ -s "$f" ] && EXIST+=("$f"); done
  [ ${#EXIST[@]} -eq 0 ] && { echo "no media for $SERIES"; continue; }
  "$PY" "$REPO/scripts/harvest/audio/transcribe_qwen.py" --out "$HARVEST/books/assabile/$SPEAKER/$SERIES/pass5-qwen" "${EXIST[@]}" || echo "transcribe failed: $SERIES"
  echo "[$(date +%H:%M:%S)] done $SERIES"
done
echo "[$(date +%H:%M:%S)] queue finished"
