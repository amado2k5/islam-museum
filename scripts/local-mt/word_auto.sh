#!/bin/sh
# Unattended translation through Word for Mac (founder's instruction, 19 November 2026): for each file, click
# Translate in Word's Translator panel, wait for the translated copy, then word_round.sh saves, imports, ships to
# release/spanish, deletes the Word files and opens the next file. Runs until the language has nothing left.
#   sh scripts/local-mt/word_auto.sh <es|fr> <first n>      (the file n must already be open: word_round.sh start)
# The Mac must be left alone while it runs: Word has to stay in front. Stop: touch <home>/STOP-word
H="${LOCAL_MT_HOME:-/Volumes/exmicroSD/islam-museum-local-mt}"; P="${LOCAL_MT_PYTHON:-python3}"; L="$1"; N="$2"
LOG="$H/logs/word-$L.log"; DIR="$(dirname "$0")"; LANGNAME=Spanish; [ "$L" = fr ] && LANGNAME=French
say() { echo "$(date '+%Y-%m-%dT%H:%M:%S') $*" >> "$LOG"; }
panel() {  # bring Word forward, open the Translator panel, print the window's position and width
  osascript -e 'tell application "Microsoft Word" to activate' -e 'delay 1' -e 'tell application "System Events" to tell process "Microsoft Word"
    click menu item "Translate Document" of menu 1 of menu item "Translate" of menu 1 of menu bar item "Tools" of menu bar 1
    delay 5
    set {wx, wy} to position of window 1
    set {ww, wh} to size of window 1
    return (wx as text) & " " & (wy as text) & " " & (ww as text)
  end tell'
}
translate() {
  stem="$1"; set -- $(panel) || return 1
  # the panel keeps its last "To" language: it is chosen once by hand before this loop starts (typing it by script went astray)
  $P "$DIR/word_click.py" click $(( $1 + $3 - 67 )) $(( $2 + 360 ))
  i=0; while [ $i -lt 80 ]; do
    sleep 3; i=$((i + 1))
    r=$(osascript -e 'tell application "Microsoft Word" to return (name of active document) & "|" & (count of documents)' 2>/dev/null)
    case "$r" in *"$stem"*) ;; *"|"[2-9]) return 0;; esac
  done
  return 1
}
while :; do
  [ -f "$H/STOP-word" ] && { say "STOP file present; exit"; exit 0; }
  NAME="wd-$L-$(printf '%03d' "$N")"
  [ -f "$H/gt/$NAME.json" ] || { say "$NAME: no file built; nothing left for $L"; exit 0; }
  say "$NAME: translate"
  translate "$NAME-en" || { say "$NAME: no translated copy, second try"; translate "$NAME-en" || { say "$NAME: FAILED twice; stopping"; exit 1; }; }
  sleep 4
  until mkdir /tmp/local-mt-ship.lock 2>/dev/null; do sleep 10; done
  OUT=$(sh "$DIR/word_round.sh" finish "$L" "$N" 2>&1); rc=$?; rmdir /tmp/local-mt-ship.lock
  say "$NAME: $(echo "$OUT" | grep -E "records in the file|MERGED|nothing new|FAILED|CONFLICT|error" | tr '\n' ' ' | cut -c1-300)"
  echo "$OUT" | grep -qE "VALIDATE FAILED|MERGE CONFLICT|no translated file" && { say "$NAME: shipping problem; stopping"; exit 1; }
  echo "$OUT" | grep -q " ok " || { say "$NAME: nothing imported; stopping"; exit 1; }
  N=$((N + 1)); sleep 20
done
