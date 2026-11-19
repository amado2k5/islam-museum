#!/bin/sh
# One step of translation through Word for Mac (Tools > Translate > Translate Document; founder's choice, 19 November
# 2026, while Google Translate refuses files). The agent clicks Translate in Word; this script does everything else.
#   sh scripts/local-mt/word_round.sh start  <lang> <n>   build file n for the language and open it in Word
#   sh scripts/local-mt/word_round.sh finish <lang> <n>   save Word's translated copy, import, ship, record, delete, start n+1
# Word translates only about the first 390,000 characters of a document, so files are built under 350,000.
H="${LOCAL_MT_HOME:-/Volumes/exmicroSD/islam-museum-local-mt}"; P="${LOCAL_MT_PYTHON:-python3}"
W="${LOCAL_MT_WORD_DIR:-$HOME/Documents/islam-museum-word-test}"; L="$2"; N=$(printf '%03d' "$3"); NAME="wd-$L-$N"
CHARS="${LOCAL_MT_WORD_CHARS:-350000}"; mkdir -p "$W" "$H/gt"
start() {
  n="$1"; name="wd-$L-$(printf '%03d' "$n")"; TAKEN=""; [ "$L" = fr ] && TAKEN="--taken $H/fr-taken.txt"
  $P scripts/local-mt/build_gt.py --lang "$L" --dir "$H/gt" --n "$n" --name "$name" --bytes 5000000 --chars "$CHARS" --failed "$H/logs/gt-$L.log.failed" $TAKEN || return 1
  cp "$H/gt/$name-en.docx" "$W/" && open -g -a "Microsoft Word" "$W/$name-en.docx"
}
if [ "$1" = start ]; then start "$3"; exit; fi
OUT_DOCX="$W/$NAME-$L.docx"
osascript -e "tell application \"Microsoft Word\"
  if (name of active document) contains \"$NAME-en\" then error \"the active document is still the English file: no translated copy\"
  save as active document file name (POSIX file \"$OUT_DOCX\") file format format document
  close every document saving no
end tell" || exit 1
[ -f "$OUT_DOCX" ] || { echo "no translated file saved"; exit 1; }
TAKEN=""; [ "$L" = fr ] && TAKEN="--taken $H/fr-taken.txt"
OUT=$($P scripts/local-mt/import_gt.py --engine word --lang "$L" --map "$H/gt/$NAME.json" --docx "$OUT_DOCX" --log "$H/logs/gt-$L.log" $TAKEN); echo "$OUT"
SHIP=$(GT_ENGINE_LABEL="Word for Mac translated document" GT_ENGINE_WHERE="with Translate Document in Word for Mac (Microsoft Translator)" GT_ENGINE_MODEL="microsoft-translator" sh scripts/local-mt/ship_gt.sh "$NAME" 2>&1); echo "$SHIP" | tail -3
PR=$(echo "$SHIP" | grep -oE "https://github.com/[^ ]+/pull/[0-9]+" | tail -1); STATE=$(echo "$SHIP" | tail -1)
REC=$($P -c "import json,sys;d=json.load(open(sys.argv[1]));print(len(d), sum(len(l.get('en','').split()) for r in d for l in r['lines']))" "$H/gt/$NAME.json")
TOT=$(echo "$REC" | cut -d' ' -f1); OK=$(echo "$OUT" | grep -oE "ok [0-9]+" | cut -d' ' -f2); SET=$(echo "$SHIP" | grep -c "^set aside")
printf '%s\t%s\t%s\t%s\t-\t%s\t%s\t%s\t%s\t%s\n' "$NAME (Word for Mac)" "$L" "$TOT" "$(echo "$REC" | cut -d' ' -f2)" "$(date +%H:%M:%S)" "$((${OK:-0} - SET))" "$((TOT - ${OK:-0} + SET))" "${PR:--}" "$STATE" >> "$H/gt/tracker.tsv"
tail -1 "$H/gt/tracker.tsv" | cut -c1-160
case "$STATE" in MERGED|"nothing new to ship") rm -f "${W:?}/${NAME:?}-en.docx" "${W:?}/${NAME:?}-$L.docx" "${H:?}/gt/${NAME:?}-en.docx" "${H:?}/gt/${NAME:?}.json";; esac
start $(( $3 + 1 ))
