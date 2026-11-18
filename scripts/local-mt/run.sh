#!/bin/sh
# Supervisor for one local translation thread (scripts/local-mt/translate.py). It keeps the model server up (see
# BACKEND below; the Spanish and the French thread share it), runs the translator,
# and starts it again if it stops for any reason other than an empty queue. Everything is appended to the log.
#
#   sh scripts/local-mt/run.sh es            # Spanish thread
#   sh scripts/local-mt/run.sh fr event,place,work
#
# Stop a thread: touch /Volumes/exmicroSD/islam-museum-local-mt/STOP-<lang>   (it stops before the next restart; remove the file to allow restarts)
LANG_CODE=$1; CLASSES=$2
# Models, logs and lists live on the microSD (founder's instruction): /Volumes/exmicroSD/islam-museum-local-mt
HOME_DIR="${LOCAL_MT_HOME:-/Volumes/exmicroSD/islam-museum-local-mt}"; LOGS="$HOME_DIR/logs"
# The card can be unplugged: wait for it instead of failing (nothing is written elsewhere meanwhile).
while [ ! -d "$HOME_DIR/ollama-models" ]; do echo "$(date '+%Y-%m-%dT%H:%M:%S') waiting for $HOME_DIR" >> "/tmp/local-mt-$1-waiting.log"; sleep 60; done
mkdir -p "$LOGS"
LOG="$LOGS/$LANG_CODE.log"; SUP="$LOGS/$LANG_CODE.supervisor.log"
REPO="$(cd "$(dirname "$0")/../.." && pwd)"
PY="${LOCAL_MT_PYTHON:-python3}"
note() { echo "$(date '+%Y-%m-%dT%H:%M:%S') $*" >> "$SUP"; }

# Backend: "mlx" (default) is the batching MLX server on 11501 (scripts/local-mt/mlx_server.py), about twice as fast
# with both languages running; "ollama" is the private Ollama server on 11500. Set LOCAL_MT_BACKEND to choose.
BACKEND="${LOCAL_MT_BACKEND:-mlx}"
if [ "$BACKEND" = "mlx" ]; then
  HOST=http://127.0.0.1:11501; MODEL="translategemma-27b-it-4bit (MLX)"; WORKERS="${LOCAL_MT_WORKERS:-2}"
else
  HOST=http://127.0.0.1:11500; MODEL="translategemma:27b"; WORKERS="${LOCAL_MT_WORKERS:-1}"
fi

ensure_server() {
  if curl -s -m 5 "$HOST/api/version" > /dev/null 2>&1; then return; fi
  if [ "$BACKEND" = "mlx" ]; then
    # one server for both threads: only start it if nobody else is starting it
    if mkdir /tmp/local-mt-mlx-start.lock 2>/dev/null; then
      note "starting MLX batching server on 11501"
      nohup "$PY" "$REPO/scripts/local-mt/mlx_server.py" --model "$HOME_DIR/mlx-models/translategemma-27b-it-4bit" >> "$LOGS/mlx-server.log" 2>&1 &
    fi
    n=0; until curl -s -m 5 "$HOST/api/version" > /dev/null 2>&1 || [ $n -ge 60 ]; do sleep 10; n=$((n + 1)); done
    rmdir /tmp/local-mt-mlx-start.lock 2>/dev/null
  else
    note "starting private ollama server on 11500"
    OLLAMA_MODELS="$HOME_DIR/ollama-models" OLLAMA_HOST=127.0.0.1:11500 OLLAMA_NUM_PARALLEL=2 OLLAMA_KEEP_ALIVE=24h OLLAMA_MAX_LOADED_MODELS=1 \
      nohup ollama serve >> "$LOGS/ollama-11500.log" 2>&1 &
    sleep 8
  fi
}

note "supervisor start lang=$LANG_CODE classes=${CLASSES:-all} backend=$BACKEND pid=$$"
while :; do
  while [ ! -d "$HOME_DIR/ollama-models" ]; do echo "$(date '+%Y-%m-%dT%H:%M:%S') waiting for $HOME_DIR" >> "/tmp/local-mt-$LANG_CODE-waiting.log"; sleep 60; done
  [ -f "$HOME_DIR/STOP-$LANG_CODE" ] && { note "STOP file present; supervisor exits"; exit 0; }
  ensure_server
  if [ -n "$CLASSES" ]; then
    "$PY" "$REPO/scripts/local-mt/translate.py" --lang "$LANG_CODE" --host "$HOST" --model "$MODEL" --workers "$WORKERS" --log "$LOG" --classes "$CLASSES" --taken "$HOME_DIR/$LANG_CODE-taken.txt" >> "$SUP" 2>&1
  else
    "$PY" "$REPO/scripts/local-mt/translate.py" --lang "$LANG_CODE" --host "$HOST" --model "$MODEL" --workers "$WORKERS" --log "$LOG" --taken "$HOME_DIR/$LANG_CODE-taken.txt" >> "$SUP" 2>&1
  fi
  CODE=$?
  if [ "$CODE" = "0" ]; then note "translator finished: queue empty (exit 0); supervisor exits"; exit 0; fi
  note "translator stopped with exit $CODE; restarting in 30 s"
  sleep 30
done
