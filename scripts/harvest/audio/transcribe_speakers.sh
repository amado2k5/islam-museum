#!/bin/bash
# Phase B for several speakers: transcribe every downloaded episode (audio series: <series>/epNN.mp3; video series:
# <series>/audio/epNN.mp3) with the working engine into books/assabile/<speaker>/<series>/pass5-qwen. Speakers are
# taken in the order given, series in the order of the speaker's series.tsv. Loops while phase A is still downloading;
# exits when every speaker's phase A is done and nothing is pending. Raw audio is kept. Resumable.
# Usage: transcribe_speakers.sh <harvest-root> <repo-root> <speaker> [<speaker> ...]
set -u
HARVEST="$1"; REPO="$2"; shift 2
PY="$HARVEST/.venv-audio/bin/python"
shopt -s nullglob
while true; do
  PENDING=0; ALLDONE=1
  for SPEAKER in "$@"; do
    RAW="$HARVEST/raw/assabile/$SPEAKER"
    [ -f "$RAW/.phaseA-done" ] || ALLDONE=0
    [ -s "$RAW/series.tsv" ] || continue
    while IFS=$'\t' read -r _ SERIES; do
      OUT="$HARVEST/books/assabile/$SPEAKER/$SERIES/pass5-qwen"
      BATCH=()
      for MP3 in "$RAW/$SERIES"/ep*.mp3 "$RAW/$SERIES"/audio/ep*.mp3; do
        STEM=$(basename "$MP3" .mp3)
        [ -s "$OUT/$STEM.json" ] && continue
        BATCH+=("$MP3")
      done
      [ ${#BATCH[@]} -eq 0 ] && continue
      PENDING=$((PENDING + ${#BATCH[@]}))
      mkdir -p "$OUT"
      echo "[$(date +%H:%M:%S)] B: $SPEAKER/$SERIES ${#BATCH[@]} pending"
      "$PY" "$REPO/scripts/harvest/audio/transcribe_qwen.py" --out "$OUT" "${BATCH[@]}" < /dev/null || echo "transcribe failed: $SPEAKER/$SERIES"
    done < "$RAW/series.tsv"
  done
  if [ "$ALLDONE" -eq 1 ] && [ "$PENDING" -eq 0 ]; then echo "[$(date +%H:%M:%S)] B finished"; exit 0; fi
  [ "$PENDING" -eq 0 ] && sleep 120
done
