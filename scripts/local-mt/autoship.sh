#!/bin/sh
# Hourly shipping of the local translation output (founder's instruction, 18 November 2026): runs
# scripts/local-mt/ship.sh once an hour so main always carries what has been translated, even when no
# Claude session is open. One instance only; a lock keeps it apart from a manual ship.
#
#   nohup sh scripts/local-mt/autoship.sh > /dev/null 2>&1 &
#
# Stop it: touch /Volumes/exmicroSD/islam-museum-local-mt/STOP-ship
HOME_DIR="${LOCAL_MT_HOME:-/Volumes/exmicroSD/islam-museum-local-mt}"
REPO="$(cd "$(dirname "$0")/../.." && pwd)"
EVERY="${LOCAL_MT_SHIP_EVERY:-3600}"
LOCK=/tmp/local-mt-ship.lock
while :; do
  while [ ! -d "$HOME_DIR/logs" ]; do sleep 60; done
  LOG="$HOME_DIR/logs/ship.log"
  [ -f "$HOME_DIR/STOP-ship" ] && { echo "$(date '+%Y-%m-%dT%H:%M:%S') STOP file present; auto-ship exits" >> "$LOG"; exit 0; }
  if mkdir "$LOCK" 2>/dev/null; then
    echo "$(date '+%Y-%m-%dT%H:%M:%S') ship start" >> "$LOG"
    (cd "$REPO" && sh scripts/local-mt/ship.sh) >> "$LOG" 2>&1
    echo "$(date '+%Y-%m-%dT%H:%M:%S') ship end (exit $?)" >> "$LOG"
    rmdir "$LOCK"
  else
    echo "$(date '+%Y-%m-%dT%H:%M:%S') another ship is running; skipped" >> "$LOG"
  fi
  sleep "$EVERY"
done
