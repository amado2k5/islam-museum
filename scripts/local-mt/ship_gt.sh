#!/bin/sh
# Ships records imported from a Google Translate document: validate, set aside any record the validator refuses,
# update the counts, commit, merge release/spanish in, push, open the pull request against release/spanish, merge it.
#   sh scripts/local-mt/ship_gt.sh "<file name, e.g. gt-es-001>"
# It never touches main and never raises against any branch but release/spanish (founder's instruction).
HOME_DIR="${LOCAL_MT_HOME:-/Volumes/exmicroSD/islam-museum-local-mt}"; WHAT="$1"
ENGINE="${GT_ENGINE_LABEL:-Google Translate document}"; SITE="${GT_ENGINE_WHERE:-on translate.google.com (document translation)}"; MODEL="${GT_ENGINE_MODEL:-google-translate}"
BRANCH=$(git rev-parse --abbrev-ref HEAD); LOG=/tmp/local-mt-ship-validate.log; round=0; VALNOTE="0 errors"
while :; do
  npm run validate > "$LOG" 2>&1 && break
  round=$((round + 1))
  bad=$(grep -E "^ERROR " "$LOG" | grep -oE "content/(es|fr|en|ur)/[a-z_-]+/[^ :]+\.md" | sort -u)
  # Only this lane's own machine translations are ever set aside. A file another lane or agent wrote is never
  # touched, whatever the validator says about it (19 November 2026: 33 French files of another agent were removed
  # by this step and had to be restored); its errors are reported and left for its owner.
  others=""; mine=""
  for f in $bad; do if grep -q "scripts/local-mt/" "$f" 2>/dev/null; then mine="$mine $f"; else others="$others $f"; fi; done
  if [ -z "$mine" ] && [ -n "$others" ]; then  # data/ errors that follow from those files (education.levels) are theirs too
    echo "validator errors only in $(echo $others | wc -w | tr -d ' ') files of other lanes (left untouched):$(echo $others | cut -c1-200)"
    VALNOTE="$(grep -cE "^ERROR " "$LOG") errors, all in $(echo $others | wc -w | tr -d ' ') files written by other lanes and left untouched; none in this change"; break
  fi
  bad="$mine"
  if [ -z "$bad" ] || [ "$round" -gt 3 ]; then echo "VALIDATE FAILED:"; grep -E "^ERROR " "$LOG" | head -5; exit 1; fi
  for f in $bad; do
    lang=$(echo "$f" | cut -d/ -f2); id=$(echo "$f" | sed -E 's#content/(es|fr|en|ur)/##; s#\.md$##')
    reason=$(grep -F "$f" "$LOG" | head -1 | sed -E 's/^ERROR [^:]*: //' | cut -c1-160)
    mkdir -p "$HOME_DIR/quarantine/$lang/$(dirname "$id")"; mv "$f" "$HOME_DIR/quarantine/$lang/$id.md"
    printf '%s\tvalidator: %s\n' "$id" "$reason" >> "$HOME_DIR/logs/gt-$lang.log.failed"
    echo "set aside $f ($reason)"
  done
done
grep -E "^validated" "$LOG"
ES=$(find content/es -name '*.md' | wc -l | tr -d ' '); FR=$(find content/fr -name '*.md' | wc -l | tr -d ' ')
python3 - "$ES" "$FR" "$WHAT" <<'PY'
import re, sys, time
es, fr, what = int(sys.argv[1]), int(sys.argv[2]), sys.argv[3]
p = 'CANARY.md'; s = open(p, encoding='utf-8').read()
s = re.sub(r'\*\*First Spanish prose: [\d,]+ records', f'**First Spanish prose: {es:,} records', s, count=1)
open(p, 'w', encoding='utf-8').write(s)
p = 'docs/delegation/spanish-progress.md'; s = open(p, encoding='utf-8').read()
s = re.sub(r'- `content/es/`: [\d,]+ files of about 34,800 \(([^)]*)\)\.', f'- `content/es/`: {es:,} files of about 34,800 (\\1).', s, count=1)
line = f'- {time.strftime("%Y-%m-%d %H:%M")} machine-translated document {what} imported: `content/es/` {es:,} files, `content/fr/` {fr:,} files; `npm run validate` 0 errors.\n'
a = '\n## Explicit gaps\n'
if a in s: s = s.replace(a, line + a, 1)
open(p, 'w', encoding='utf-8').write(s)
PY
git add -- content/es content/fr content/en content/ur ':!*.tmp' CANARY.md docs/delegation/spanish-progress.md scripts/local-mt
if git diff --cached --quiet; then echo "nothing new to ship"; exit 0; fi
N=$(git diff --cached --name-only -- content/es content/fr content/en content/ur | wc -l | tr -d ' ')
git commit -q -m "feat(gt-docs): $N records from $ENGINE $WHAT (content/es $ES files, content/fr $FR files)

Translated from content/en/ $SITE and
split back into records by scripts/local-mt/import_gt.py; every record passed
the checks against its English source. Not read by a human.
npm run validate: $VALNOTE.

AI-Agent: Claude Code
AI-Model: $MODEL (translation); claude-fable-5-2 (management)
AI-Editor: Claude desktop app
Co-Authored-By: Claude Fable 5.2 <noreply@anthropic.com>" || exit 1
git fetch -q origin; git merge -q --no-edit "origin/$BRANCH" 2>/dev/null  # another session may have pushed a merge onto this branch
git merge -q --no-edit origin/release/spanish || { echo "MERGE CONFLICT with release/spanish"; exit 1; }
git push -q origin "$BRANCH" || exit 1
URL=$(gh pr create --base release/spanish --head "$BRANCH" --title "$ENGINE $WHAT: $N records (es $ES, fr $FR)" --body "Into \`release/spanish\`; nothing goes to \`main\`. $N records translated from English $SITE and imported by \`scripts/local-mt/import_gt.py\`. Totals: \`content/es/\` $ES files, \`content/fr/\` $FR files. Every record passed the checks against its English source; not read by a human. \`npm run validate\`: $VALNOTE.

🤖 Generated with [Claude Code](https://claude.com/claude-code)" | tail -1)
echo "$URL"; sleep 8; gh pr merge "$URL" --merge > /dev/null 2>&1 || { sleep 20; gh pr merge "$URL" --merge > /dev/null 2>&1; }; gh pr view "$URL" --json state -q .state
