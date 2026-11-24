#!/bin/bash
# Every 5 min: import any fully-answered retry3 batch, commit new content, PR+merge.
cd /Users/ahmedabdelaal/Documents/GitHub/uber_eats/islam-museum
P=local-mt-work/word-tr-id/retry3/paste
mkdir -p local-mt-work/word-tr-id/retry3/logs
while true; do
  for lang in tr id fr es; do
    for map in local-mt-work/word-tr-id/retry3/r3-$lang-*.json; do
      base=$(basename "$map" .json)
      [ -f "$P/answers/$base.txt" ] || continue
      # complete when every <base>-pK file is in the ledger and none failed
      python3 - "$P" "$lang" "$base" <<'PY' || continue
import json, os, sys
p, lang, base = sys.argv[1:]
import glob
led = {}
for lp in glob.glob(os.path.join(p, 'bing-ledger-*.json')):
    led.update(json.load(open(lp)))
files = [f for f in os.listdir(os.path.join(p, lang)) if f.startswith(base + '-p')]
if not files: sys.exit(1)
for f in files:
    v = led.get(f'{lang}/{f}')
    if not v or v.get('failed'): sys.exit(1)
PY
      norm="/tmp/$base.norm.txt"
      python3 scripts/local-mt/normalize_bing.py "$P/answers/$base.txt" "$norm"
      src=ar; case "$base" in *-fr-0[12]|*-es-0[12]) src=en;; esac
      extra=""; case "$base" in r3-fr-0[12]|r3-es-0[12]) extra="--leveled";; esac
      out=$(python3 scripts/local-mt/import_gt.py --lang $lang --src $src --engine bing $extra --txt "$norm" --map "$map" --log local-mt-work/word-tr-id/retry3/logs/bing-import.log 2>&1 | tail -1)
      echo "$(date +%H:%M) $base $src: $out" >> local-mt-work/word-tr-id/retry3/logs/monitor.log
    done
  done
  # commit anything new
  if [ -n "$(git status --short -- content/ | head -1)" ]; then
    git checkout -B feat/bing-imports
    git add content/
    git commit -q -m "tr/id/fr/es: Bing paste-loop imports (automated, $(date +%Y-%m-%d\ %H:%M))

Generated with [Devin](https://devin.ai)

Co-Authored-By: Devin <158243242+devin-ai-integration[bot]@users.noreply.github.com>" 2>/dev/null
    git push -q -u origin feat/bing-imports 2>/dev/null
    pr=$(gh pr create --head feat/bing-imports --base main --title "Bing lane imports $(date +%H:%M)" --body "Automated import of completed retry3 batches via the Bing paste lane. Generated with [Devin](https://devin.ai)" 2>/dev/null | tail -1)
    [ -n "$pr" ] && gh pr merge "$pr" --squash >/dev/null 2>&1 && echo "$(date +%H:%M) merged $pr" >> local-mt-work/word-tr-id/retry3/logs/monitor.log
    git checkout -q main && git pull -q --ff-only 2>/dev/null
  fi
  sleep 300
done
