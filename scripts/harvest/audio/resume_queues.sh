#!/bin/bash
# Check the harvest jobs and start again any that have stopped. Safe to run often: each job skips what is already
# done (run_queue.sh and prep_video.sh skip existing transcripts and downloads; local_claims.py skips finished batches).
# A job that is still running is left alone. Every check and restart is written to the log with a time stamp.
#
# Usage: resume_queues.sh <repo-root> [<harvest-root>]
set -u
REPO="$1"
H="${2:-$HOME/islam-museum-harvest}"
LOG="$H/logs/resume.log"
SPEAKER="omar-abdelkafy"
MAIN_SERIES="sharh-al-hekam-al-ataeya nafahat-ramadaneya-1436-h silsilat-qissa-wa-ebra al-manjeyat wa-nafsun-ma-sawaha tariq-al-noor bustan-el-amal al-dar-al-akhera silsilat-ebadu-al-rahman muktatafat-mena-al-seera albuyout-alamena"
REVERSE_SERIES="sharh-saheeh-al-bukhare albuyout-alamena muktatafat-mena-al-seera silsilat-ebadu-al-rahman al-dar-al-akhera bustan-el-amal tariq-al-noor wa-nafsun-ma-sawaha al-manjeyat silsilat-qissa-wa-ebra nafahat-ramadaneya-1436-h sharh-al-hekam-al-ataeya"
VIDEO_SERIES="al-naba-al-safi ahl-al-hikma mawkib-al-nour ajaeb-al-kulub min-kunuz-al-sunnah modakirate-iblis alwaad-alhaq"
NABA_OUT="$H/books/assabile/$SPEAKER/al-naba-al-safi/claims-local"

stamp() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*" >> "$LOG"; }

running() { pgrep -f "$1" > /dev/null; }

start() { # start <name> <log-file> <command...>
  local name="$1" logfile="$2"; shift 2
  stamp "restarting $name"
  (cd "$REPO" && nohup caffeinate -dims "$@" >> "$logfile" 2>&1 &)
}

mkdir -p "$H/logs"

if ! curl -s -m 5 http://localhost:11434/api/tags > /dev/null; then
  stamp "Ollama is not answering on localhost:11434; the claims step cannot run until it is started"
fi

if running "run_queue.sh $SPEAKER .* sharh-al-hekam-al-ataeya nafahat"; then
  stamp "main queue running"
else
  start "main queue" "$H/logs/queue-omar.log" bash scripts/harvest/audio/run_queue.sh "$SPEAKER" "$H" "$REPO" $MAIN_SERIES
fi

if running "run_queue.sh $SPEAKER .* sharh-saheeh-al-bukhare albuyout"; then
  stamp "reverse queue running"
else
  start "reverse queue" "$H/logs/queue-omar-reverse.log" bash scripts/harvest/audio/run_queue.sh "$SPEAKER" "$H" "$REPO" $REVERSE_SERIES
fi

if running "prep_video.sh $SPEAKER"; then
  stamp "video prep running"
else
  start "video prep" "$H/logs/prep-video.log" bash scripts/harvest/audio/prep_video.sh "$SPEAKER" "$H" "$REPO" $VIDEO_SERIES
fi

# Claims for Al Naba episode 1 (the pilot). Restart only if it is not finished (12 batches of 8 lines).
if [ -f "$NABA_OUT/ep01.batches.txt" ] && [ "$(wc -l < "$NABA_OUT/ep01.batches.txt")" -ge 12 ]; then
  stamp "Al Naba ep01 claims complete"
elif running "local_claims.py"; then
  stamp "Al Naba ep01 claims running"
else
  start "Al Naba ep01 claims" "$H/logs/local-claims-naba-ep01.log" python3 scripts/harvest/audio/local_claims.py --out "$NABA_OUT" "$H/books/assabile/$SPEAKER/al-naba-al-safi/pass5-qwen/ep01.txt"
fi
