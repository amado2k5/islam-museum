#!/bin/sh
# Progress of the Word translation loop:  sh scripts/local-mt/word_status.sh
H="${LOCAL_MT_HOME:-/Volumes/exmicroSD/islam-museum-local-mt}"
echo "$(date '+%H:%M')  loop: $(pgrep -f 'word_auto.sh' >/dev/null && pgrep -fl 'word_auto.sh (es|fr)' | grep -oE 'word_auto.sh (es|fr)' | head -1 || echo NOT RUNNING)"
for L in es fr; do
  [ -f "$H/logs/word-$L.log" ] || continue
  done_n=$(grep -c "records in the file" "$H/logs/word-$L.log"); last=$(tail -1 "$H/logs/word-$L.log" | cut -c1-110)
  imp=$(grep "(Word for Mac)" "$H/gt/tracker.tsv" | awk -F'\t' -v l=$L '$2==l{s+=$7} END{print s+0}')
  age=$(( $(date +%s) - $(stat -f %m "$H/logs/word-$L.log") ))
  echo "$L: files finished $done_n, records imported $imp, prose files now $(find content/$L -name '*.md' | wc -l | tr -d ' '), last log line ${age}s ago: $last"
done
"${LOCAL_MT_PYTHON:-/opt/homebrew/Caskroom/miniconda/base/bin/python3}" - "$H" <<'PY'
import os, sys
sys.path.insert(0, "scripts/local-mt")
from translate import queue, LEVELED, BROKEN
H = sys.argv[1]
ids = lambda f: set(l.split("\t")[0].strip() for l in open(f, encoding="utf-8")) if os.path.exists(f) else set()
have = lambda lang: set(os.path.join(d, f)[len(f"content/{lang}/"):-3] for d, _, fs in os.walk(f"content/{lang}") for f in fs if f.endswith(".md"))
en, ar = have("en"), have("ar")
print("remaining:")
for lang in ("es", "fr"):
    skip = ids(f"{H}/fr-taken.txt") if lang == "fr" else set()
    failed, n, w, held, fl = ids(f"{H}/logs/gt-{lang}.log.failed"), 0, 0, 0, 0
    for i in queue(lang, [], skip):
        b = open(f"content/en/{i}.md", encoding="utf-8").read()
        if LEVELED.search(b) or BROKEN.search(b): held += 1
        elif i in failed: fl += 1
        else: n += 1; w += len(b.split())
    print(f"  {lang}: {len(have(lang)):,} of {len(en):,} done; in the Word queue {n:,} records / {w:,} words (about {w // 62000 + 1} files); failed once {fl}; held {held}" + (f"; with the French lane {len(skip):,}" if skip else ""))
print(f"  en: {len(en):,} prose files; Arabic records with no English: {len(ar - en):,}; English records with no Arabic: {len(en - ar):,}")
PY
