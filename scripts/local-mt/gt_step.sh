#!/bin/sh
# One step of the Google Translate document flow, after a translated file has been downloaded in the browser:
# move it to the microSD, import it, ship it to release/spanish, record it in the tracker, build the next file.
#   sh scripts/local-mt/gt_step.sh <lang> <n> <uploaded HH:MM:SS>
H="${LOCAL_MT_HOME:-/Volumes/exmicroSD/islam-museum-local-mt}"; P="${LOCAL_MT_PYTHON:-python3}"; L="$1"; N=$(printf '%03d' "$2"); NAME="gt-$L-$N"
UP="${LOCAL_MT_UPLOAD_DIR:-$H/gt}"; DL="$HOME/Downloads/$NAME-en.docx"
[ -f "$DL" ] || { echo "no download at $DL"; exit 1; }
mkdir -p "$H/gt/dl" && mv "$DL" "$H/gt/dl/$NAME.docx" || exit 1
TAKEN=""; [ "$L" = fr ] && TAKEN="--taken $H/fr-taken.txt"
OUT=$($P scripts/local-mt/import_gt.py --lang "$L" --map "$H/gt/$NAME.json" --docx "$H/gt/dl/$NAME.docx" --log "$H/logs/gt-$L.log"); echo "$OUT"
SHIP=$(sh scripts/local-mt/ship_gt.sh "$NAME" 2>&1); echo "$SHIP" | tail -4
PR=$(echo "$SHIP" | grep -oE "https://github.com/[^ ]+/pull/[0-9]+" | tail -1); STATE=$(echo "$SHIP" | tail -1)
[ -f "$H/gt/tracker.tsv" ] || printf 'file\tlang\trecords\tenglish_words\tuploaded\tdownloaded\timported\tnot_imported\tpull_request\tstate\n' > "$H/gt/tracker.tsv"
REC=$($P -c "import json,sys;d=json.load(open(sys.argv[1]));print(len(d), sum(len(l.get('en','').split()) for r in d for l in r['lines']))" "$H/gt/$NAME.json")
OK=$(echo "$OUT" | grep -oE "ok [0-9]+" | cut -d' ' -f2); TOT=$(echo "$REC" | cut -d' ' -f1)
SET=$(echo "$SHIP" | grep -c "^set aside")
printf '%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\n' "$NAME" "$L" "$TOT" "$(echo "$REC" | cut -d' ' -f2)" "$3" "$(date +%H:%M:%S)" "$((${OK:-0} - SET))" "$((TOT - ${OK:-0} + SET))" "${PR:--}" "$STATE" >> "$H/gt/tracker.tsv"
NEXT=$(( $2 + 1 )); $P scripts/local-mt/build_gt.py --lang "$L" --dir "$H/gt" --n "$NEXT" --failed "$H/logs/gt-$L.log.failed" --scheme "${LOCAL_MT_GT_SCHEME:-tags}" $TAKEN && cp "$H/gt/gt-$L-$(printf '%03d' $NEXT)-en.docx" "$UP/"
tail -1 "$H/gt/tracker.tsv"
