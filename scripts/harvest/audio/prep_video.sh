#!/bin/bash
# Prepare video series in parallel with the main queue. For each series: discover the episode files (once), download
# each episode's MP4 politely, extract its audio track to <series>/audio/epNN.mp3 (MP3, mono, 16 kHz, no picture; the same format the transcription library reads), and
# transcribe the audio with the working engine into the same pass5-qwen folder the queue uses, so the queue skips the
# episodes already done. Resumable: every step skips what exists.
# Usage: prep_video.sh <speaker> <harvest-root> <repo-root> <series slug> [<series slug> ...]
set -u
SPEAKER="$1"; HARVEST="$2"; REPO="$3"; shift 3
PY="$HARVEST/.venv-audio/bin/python"
RAW="$HARVEST/raw/assabile/$SPEAKER"
MAN="$RAW/manifests"
shopt -s nullglob
mkdir -p "$MAN"
for SERIES in "$@"; do
  echo "[$(date +%H:%M:%S)] prep $SERIES"
  M="$MAN/$SERIES.manifest.tsv"
  if [ ! -s "$M" ]; then
    "$PY" "$REPO/scripts/harvest/audio/discover_series.py" --speaker "$SPEAKER" --series "$SERIES" --out "$MAN" || { echo "discover failed: $SERIES"; continue; }
  fi
  "$PY" "$REPO/scripts/harvest/audio/download.py" --out "$RAW" --manifest "$M" || { echo "download failed: $SERIES"; continue; }
  mkdir -p "$RAW/$SERIES/audio"
  for MP4 in "$RAW/$SERIES"/ep*.mp4; do
    STEM=$(basename "$MP4" .mp4)
    OUT="$RAW/$SERIES/audio/$STEM.mp3"
    if [ ! -s "$OUT" ]; then
      ffmpeg -hide_banner -loglevel error -n -i "$MP4" -vn -ac 1 -ar 16000 -c:a libmp3lame -b:a 64k "$OUT" || { echo "extract failed: $MP4"; rm -f "$OUT"; continue; }
    fi
  done
  AUDIO=("$RAW/$SERIES/audio"/ep*.mp3)
  if [ ${#AUDIO[@]} -gt 0 ]; then
    "$PY" "$REPO/scripts/harvest/audio/transcribe_qwen.py" --out "$HARVEST/books/assabile/$SPEAKER/$SERIES/pass5-qwen" "${AUDIO[@]}" || echo "transcribe failed: $SERIES"
  fi
  echo "[$(date +%H:%M:%S)] prep done $SERIES"
done
echo "[$(date +%H:%M:%S)] prep finished"
