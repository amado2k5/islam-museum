#!/bin/bash
# Phase A for several speakers, in the order given: list each speaker's series (list_series.py), discover the episode
# links (discover_series.py, once per series), download politely (download.py), and extract the audio track of every
# video episode to <series>/audio/epNN.mp3 (mono, 16 kHz, 64k). MP4 files are kept. Stops downloading when the
# harvest disk has less than MIN_FREE_GB free. Resumable: every step skips what exists. Transcription is a separate
# job (transcribe_speakers.sh), so downloads never wait for the GPU.
# Usage: harvest_speakers.sh <harvest-root> <repo-root> <speaker> [<speaker> ...]
set -u
HARVEST="$1"; REPO="$2"; shift 2
PY="$HARVEST/.venv-audio/bin/python"
MIN_FREE_GB="${MIN_FREE_GB:-40}"
shopt -s nullglob
free_gb() { df -g "$HARVEST/" | awk 'NR==2 {print $4}'; }
for SPEAKER in "$@"; do
  RAW="$HARVEST/raw/assabile/$SPEAKER"
  MAN="$RAW/manifests"
  mkdir -p "$MAN"
  [ -s "$RAW/series.tsv" ] || "$PY" "$REPO/scripts/harvest/audio/list_series.py" "$SPEAKER" > "$RAW/series.tsv" || { echo "list failed: $SPEAKER"; continue; }
  echo "[$(date +%H:%M:%S)] A: $SPEAKER, $(wc -l < "$RAW/series.tsv") series"
  while IFS=$'\t' read -r _ SERIES; do
    if [ "$(free_gb)" -lt "$MIN_FREE_GB" ]; then echo "[$(date +%H:%M:%S)] disk below ${MIN_FREE_GB} GB free; stopping"; exit 3; fi
    M="$MAN/$SERIES.manifest.tsv"
    if [ ! -s "$M" ]; then
      "$PY" "$REPO/scripts/harvest/audio/discover_series.py" --speaker "$SPEAKER" --series "$SERIES" --out "$MAN" < /dev/null || { echo "discover failed: $SPEAKER/$SERIES"; continue; }
    fi
    [ -s "$M" ] || { echo "no media listed: $SPEAKER/$SERIES"; continue; }
    "$PY" "$REPO/scripts/harvest/audio/download.py" --out "$RAW" --manifest "$M" < /dev/null || echo "download incomplete: $SPEAKER/$SERIES"
    for MP4 in "$RAW/$SERIES"/ep*.mp4 "$RAW/$SERIES"/ep*.m4a; do
      mkdir -p "$RAW/$SERIES/audio"
      STEM=$(basename "${MP4%.*}")
      OUT="$RAW/$SERIES/audio/$STEM.mp3"
      [ -s "$OUT" ] && continue
      ffmpeg -hide_banner -loglevel error -y -i "$MP4" -vn -ac 1 -ar 16000 -c:a libmp3lame -b:a 64k "$OUT.part.mp3" < /dev/null \
        && mv "$OUT.part.mp3" "$OUT" || { echo "extract failed: $MP4"; rm -f "$OUT.part.mp3"; }
    done
    echo "[$(date +%H:%M:%S)] A done: $SPEAKER/$SERIES"
  done < "$RAW/series.tsv"
  touch "$RAW/.phaseA-done"
done
echo "[$(date +%H:%M:%S)] A finished"
