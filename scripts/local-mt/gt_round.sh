#!/bin/sh
# One round of the Google Translate document flow (founder's instructions, 19 November 2026): one English Word file,
# translated once into Spanish and once into French in the browser. This script takes over after each download.
#   sh scripts/local-mt/gt_round.sh got <n> <es|fr>     move the fresh download aside (both downloads share one name)
#   sh scripts/local-mt/gt_round.sh finish <n> [bytes]  import both, ship to release/spanish, record, delete, build n+1
H="${LOCAL_MT_HOME:-/Volumes/exmicroSD/islam-museum-local-mt}"; P="${LOCAL_MT_PYTHON:-python3}"; UP="${LOCAL_MT_UPLOAD_DIR:-$H/gt}"
N=$(printf '%03d' "$2"); NAME="gt-$N"; mkdir -p "$H/gt/dl"
if [ "$1" = got ]; then
  [ -f "$HOME/Downloads/$NAME-en.docx" ] || { echo "no download at ~/Downloads/$NAME-en.docx"; exit 1; }
  mv "$HOME/Downloads/$NAME-en.docx" "$H/gt/dl/$NAME.$3.docx" && echo "$3 $(date +%H:%M:%S)" >> "$H/gt/dl/$NAME.times" && ls -la "$H/gt/dl/$NAME.$3.docx"; exit
fi
[ -f "$H/gt/tracker.tsv" ] || printf 'file\tlang\trecords\tenglish_words\tuploaded\tdownloaded\timported\tnot_imported\tpull_request\tstate\n' > "$H/gt/tracker.tsv"
ROWS=""
for L in es fr; do
  [ -f "$H/gt/dl/$NAME.$L.docx" ] || { echo "missing $L download"; exit 1; }
  TAKEN=""; [ "$L" = fr ] && TAKEN="--taken $H/fr-taken.txt"
  OUT=$($P scripts/local-mt/import_gt.py --lang "$L" --map "$H/gt/$NAME.json" --docx "$H/gt/dl/$NAME.$L.docx" --log "$H/logs/gt-$L.log" $TAKEN); echo "$OUT"
  OK=$(echo "$OUT" | grep -oE "ok [0-9]+" | cut -d' ' -f2); SK=$(echo "$OUT" | grep -oE "(already translated|taken by another lane) [0-9]+" | grep -oE "[0-9]+$" | paste -sd+ - | bc)
  ROWS="$ROWS$L ${OK:-0} ${SK:-0}
"
done
SHIP=$(sh scripts/local-mt/ship_gt.sh "$NAME" 2>&1); echo "$SHIP" | tail -4
PR=$(echo "$SHIP" | grep -oE "https://github.com/[^ ]+/pull/[0-9]+" | tail -1); STATE=$(echo "$SHIP" | tail -1)
REC=$($P -c "import json,sys;d=json.load(open(sys.argv[1]));print(len(d), sum(len(l.get('en','').split()) for r in d for l in r['lines']))" "$H/gt/$NAME.json")
TOT=$(echo "$REC" | cut -d' ' -f1)
echo "$ROWS" | while read L OK SK; do
  [ -n "$L" ] || continue
  SET=$(echo "$SHIP" | grep -c "^set aside content/$L/")
  printf '%s\t%s\t%s\t%s\t-\t%s\t%s\t%s\t%s\t%s\n' "$NAME" "$L" "$((TOT - SK))" "$(echo "$REC" | cut -d' ' -f2)" "$(grep "^$L " "$H/gt/dl/$NAME.times" | tail -1 | cut -d' ' -f2)" "$((OK - SET))" "$((TOT - SK - OK + SET))" "${PR:--}" "$STATE" >> "$H/gt/tracker.tsv"
done
tail -2 "$H/gt/tracker.tsv"
# once both translations of the file are processed and merged, delete what was uploaded and what was downloaded
if [ "$STATE" = MERGED ]; then
  rm -f "${H:?}/gt/${NAME:?}-en.docx" "${UP:?}/${NAME:?}-en.docx" "${H:?}/gt/dl/${NAME:?}.es.docx" "${H:?}/gt/dl/${NAME:?}.fr.docx" "${H:?}/gt/dl/${NAME:?}.times" "${H:?}/gt/${NAME:?}.json"
fi
NEXT=$(printf '%03d' $(( $2 + 1 ))); $P scripts/local-mt/build_gt.py --lang both --dir "$H/gt" --n $(( $2 + 1 )) --bytes "${3:-4900000}" --home "$H" && cp "$H/gt/gt-$NEXT-en.docx" "$UP/"
