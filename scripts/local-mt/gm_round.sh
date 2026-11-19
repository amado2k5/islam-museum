#!/bin/sh
# Arabic-only records through Google Gemini in the browser (founder's suggestion, 19 November 2026): the agent uploads
# one small Word file in Gemini's Task tab and saves the answer's code block as ~/Downloads/gm-<lang>-<nnn>.txt.
#   sh scripts/local-mt/gm_round.sh finish <lang> <n>   import batch n, then build batch n+1 (prints its name, or "nothing left")
#   sh scripts/local-mt/gm_round.sh ship <lang> <label> validate, commit, pull request into release/spanish, merge
# Founder's rules: one upload at a time, at least a minute apart. Source language: LOCAL_MT_SRC (default ar).
H="${LOCAL_MT_HOME:-/Volumes/exmicroSD/islam-museum-local-mt}"; P="${LOCAL_MT_PYTHON:-python3}"; UP="${LOCAL_MT_UPLOAD_DIR:-$H/gt}"
L="$2"; SRC="${LOCAL_MT_SRC:-ar}"; IDS="${LOCAL_MT_IDS:-$H/ids-$L-from-$SRC.txt}"; CHARS="${LOCAL_MT_GM_CHARS:-30000}"
if [ "$1" = ship ]; then
  until mkdir /tmp/local-mt-ship.lock 2>/dev/null; do sleep 10; done
  GT_ENGINE_LABEL="Google Gemini (browser) translated batches" GT_ENGINE_WHERE="with Google Gemini in the browser (Task mode), from the $SRC prose" GT_ENGINE_MODEL="gemini (Hydrogen)" sh scripts/local-mt/ship_gt.sh "$3" 2>&1 | tail -3; rmdir /tmp/local-mt-ship.lock; exit
fi
N=$(printf '%03d' "$3"); NAME="gm-$L-$N"; mkdir -p "$H/gt/dl"
[ -f "$HOME/Downloads/$NAME.txt" ] && mv "$HOME/Downloads/$NAME.txt" "$H/gt/dl/"
[ -f "$H/gt/dl/$NAME.txt" ] || { echo "no answer file for $NAME"; exit 1; }
OUT=$($P scripts/local-mt/import_gt.py --engine gemini --src "$SRC" --lang "$L" --map "$H/gt/$NAME.json" --txt "$H/gt/dl/$NAME.txt" --log "$H/logs/gm-$L.log"); echo "$OUT"
grep '"failed"' "$H/logs/gm-$L.log" | tail -40 | $P -c "import sys,json;[print(json.loads(l)['id']+'\t'+json.loads(l)['reason']) for l in sys.stdin]" >> "$H/logs/gm-$L.failed" 2>/dev/null
REC=$($P -c "import json,sys;d=json.load(open(sys.argv[1]));print(len(d), sum(len(l.get('en','').split()) for r in d for l in r['lines']))" "$H/gt/$NAME.json")
OK=$(echo "$OUT" | grep -oE "ok [0-9]+" | cut -d' ' -f2); TOT=$(echo "$REC" | cut -d' ' -f1)
printf '%s\t%s\t%s\t%s\t-\t%s\t%s\t%s\t-\timported, shipped with its group\n' "$NAME (Gemini, $SRC to $L)" "$L" "$TOT" "$(echo "$REC" | cut -d' ' -f2)" "$(date +%H:%M:%S)" "${OK:-0}" "$((TOT - ${OK:-0}))" >> "$H/gt/tracker.tsv"
rm -f "${H:?}/gt/${NAME:?}-en.docx" "${UP:?}/${NAME:?}.docx" "${H:?}/gt/dl/${NAME:?}.txt" "${H:?}/gt/${NAME:?}.json"
NEXT="gm-$L-$(printf '%03d' $(( $3 + 1 )))"
$P scripts/local-mt/build_gt.py --lang "$L" --src "$SRC" --dir "$H/gt" --n 0 --name "$NEXT" --bytes 5000000 --chars "$CHARS" --scheme tags --ids-file "$IDS" --failed "$H/logs/gm-$L.failed" && cp "$H/gt/$NEXT-en.docx" "$UP/$NEXT.docx" || echo "nothing left"
