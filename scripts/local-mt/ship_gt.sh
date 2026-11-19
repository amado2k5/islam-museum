#!/bin/sh
# Ships records imported from a Google Translate document: validate, set aside any record the validator refuses,
# update the counts, commit, merge release/spanish in, push, open the pull request against release/spanish, merge it.
#   sh scripts/local-mt/ship_gt.sh "<file name, e.g. gt-es-001>"
# It never touches main and never raises against any branch but release/spanish (founder's instruction).
HOME_DIR="${LOCAL_MT_HOME:-/Volumes/exmicroSD/islam-museum-local-mt}"; WHAT="$1"
BRANCH=$(git rev-parse --abbrev-ref HEAD); LOG=/tmp/local-mt-ship-validate.log; round=0
while :; do
  npm run validate > "$LOG" 2>&1 && break
  round=$((round + 1))
  bad=$(grep -E "^ERROR " "$LOG" | grep -oE "content/(es|fr)/[a-z_-]+/[^ :]+\.md" | sort -u)
  if [ -z "$bad" ] || [ "$round" -gt 3 ]; then echo "VALIDATE FAILED:"; grep -E "^ERROR " "$LOG" | head -5; exit 1; fi
  for f in $bad; do
    lang=$(echo "$f" | cut -d/ -f2); id=$(echo "$f" | sed -E 's#content/(es|fr)/##; s#\.md$##')
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
line = f'- {time.strftime("%Y-%m-%d %H:%M")} Google Translate document {what} imported: `content/es/` {es:,} files, `content/fr/` {fr:,} files; `npm run validate` 0 errors.\n'
a = '\n## Explicit gaps\n'
if a in s: s = s.replace(a, line + a, 1)
open(p, 'w', encoding='utf-8').write(s)
PY
git add -- content/es content/fr ':!*.tmp' CANARY.md docs/delegation/spanish-progress.md scripts/local-mt
if git diff --cached --quiet; then echo "nothing new to ship"; exit 0; fi
N=$(git diff --cached --name-only -- content/es content/fr | wc -l | tr -d ' ')
git commit -q -m "feat(gt-docs): $N records from Google Translate document $WHAT (content/es $ES files, content/fr $FR files)

Translated from content/en/ on translate.google.com (document translation) and
split back into records by scripts/local-mt/import_gt.py; every record passed
the checks against its English source. Not read by a human.
npm run validate: 0 errors.

AI-Agent: Claude Code
AI-Model: google-translate (translation); claude-fable-5-2 (management)
AI-Editor: Claude desktop app
Co-Authored-By: Claude Fable 5.2 <noreply@anthropic.com>" || exit 1
git fetch -q origin; git merge -q --no-edit origin/release/spanish || { echo "MERGE CONFLICT with release/spanish"; exit 1; }
git push -q origin "$BRANCH" || exit 1
URL=$(gh pr create --base release/spanish --head "$BRANCH" --title "Google Translate document $WHAT: $N records (es $ES, fr $FR)" --body "Into \`release/spanish\`; nothing goes to \`main\`. $N records translated from English on translate.google.com (document translation) and imported by \`scripts/local-mt/import_gt.py\`. Totals: \`content/es/\` $ES files, \`content/fr/\` $FR files. Every record passed the checks against its English source; not read by a human. \`npm run validate\`: 0 errors.

🤖 Generated with [Claude Code](https://claude.com/claude-code)" | tail -1)
echo "$URL"; sleep 8; gh pr merge "$URL" --merge > /dev/null 2>&1 || { sleep 20; gh pr merge "$URL" --merge > /dev/null 2>&1; }; gh pr view "$URL" --json state -q .state
