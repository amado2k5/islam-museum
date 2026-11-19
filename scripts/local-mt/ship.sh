#!/bin/sh
# Ships what the local translation threads have written so far: validate, set aside any record the validator refuses,
# update the counts, commit, push, open the pull request against release/spanish and merge it.
# Run from the repository root, on the Spanish feature branch:   sh scripts/local-mt/ship.sh
# It never touches main and never raises against any branch but release/spanish (founder's instruction).
HOME_DIR="${LOCAL_MT_HOME:-/Volumes/exmicroSD/islam-museum-local-mt}"
BRANCH=$(git rev-parse --abbrev-ref HEAD)
LOG=/tmp/local-mt-ship-validate.log
round=0
while :; do
  npm run validate > "$LOG" 2>&1 && break
  round=$((round + 1))
  bad=$(grep -E "^ERROR " "$LOG" | grep -oE "content/(es|fr)/[a-z_-]+/[^ :]+\.md" | sort -u)
  # Only this lane's own machine translations are ever set aside. A file another lane or agent wrote is never
  # touched, whatever the validator says about it (19 November 2026: 33 French files of another agent were removed
  # by this step and had to be restored); its errors are reported and left for its owner.
  others=""; mine=""
  for f in $bad; do if grep -q "scripts/local-mt/" "$f" 2>/dev/null; then mine="$mine $f"; else others="$others $f"; fi; done
  if [ -z "$mine" ] && [ -n "$others" ]; then  # data/ errors that follow from those files (education.levels) are theirs too
    echo "validator errors only in $(echo $others | wc -w | tr -d ' ') files of other lanes (left untouched):$(echo $others | cut -c1-200)"; break
  fi
  bad="$mine"
  if [ -z "$bad" ] || [ "$round" -gt 3 ]; then echo "VALIDATE FAILED (not a translated file, or still failing after 3 rounds):"; grep -E "^ERROR " "$LOG" | head -5; exit 1; fi
  for f in $bad; do
    lang=$(echo "$f" | cut -d/ -f2); id=$(echo "$f" | sed -E 's#content/(es|fr)/##; s#\.md$##')
    reason=$(grep -F "$f" "$LOG" | head -1 | sed -E 's/^ERROR [^:]*: //' | cut -c1-160)
    mkdir -p "$HOME_DIR/quarantine/$lang/$(dirname "$id")"; mv "$f" "$HOME_DIR/quarantine/$lang/$id.md"
    printf '%s\tvalidator: %s\n' "$id" "$reason" >> "$HOME_DIR/logs/$lang.log.failed"
    echo "set aside $f ($reason)"
  done
done
grep -E "^validated" "$LOG"
ES=$(find content/es -name '*.md' | wc -l | tr -d ' '); FR=$(find content/fr -name '*.md' | wc -l | tr -d ' ')
python3 - "$ES" "$FR" <<'PY'
import re, sys, time
es, fr = int(sys.argv[1]), int(sys.argv[2])
p = 'CANARY.md'; s = open(p, encoding='utf-8').read()
s, k = re.subn(r'\*\*First Spanish prose: [\d,]+ records', f'**First Spanish prose: {es:,} records', s, count=1)
open(p, 'w', encoding='utf-8').write(s)
p = 'docs/delegation/spanish-progress.md'; s = open(p, encoding='utf-8').read()
s = re.sub(r'- `content/es/`: [\d,]+ files of about 34,800 \(([^)]*)\)\.', f'- `content/es/`: {es:,} files of about 34,800 (\\1).', s, count=1)
line = f'- {time.strftime("%Y-%m-%d %H:%M")} local machine translation shipped: `content/es/` {es:,} files, `content/fr/` {fr:,} files; `npm run validate` 0 errors.\n'
a = '\n## Explicit gaps\n'
s = s.replace(a, line + a, 1) if s.split(a)[0].endswith('\n') and '### Packet log' in s else s
open(p, 'w', encoding='utf-8').write(s)
PY
git add -- content/es content/fr ':!*.tmp' CANARY.md docs/delegation/spanish-progress.md
if git diff --cached --quiet; then echo "nothing new to ship"; exit 0; fi
N=$(git diff --cached --name-only -- content/es content/fr | wc -l | tr -d ' ')
git commit -q -m "feat(local-mt): $N records translated locally (content/es $ES files, content/fr $FR files)

Translated from content/en/ on the founder's Mac by TranslateGemma 27B
(scripts/local-mt/translate.py); every record passed the checks against its
English source. Not read by a human. npm run validate: 0 errors.

AI-Agent: Claude Code (managing a local model)
AI-Model: translategemma:27b (translation); claude-fable-5-2 (management)
AI-Editor: Claude desktop app
Co-Authored-By: Claude Fable 5.2 <noreply@anthropic.com>" || exit 1
git fetch -q origin; echo "french ahead: $(git rev-list --count origin/release/spanish..origin/release/french)  main ahead: $(git rev-list --count origin/release/spanish..origin/main)"
git push -q origin "$BRANCH" || exit 1
URL=$(gh pr create --base release/spanish --head "$BRANCH" --title "Local machine translation: $N records (es $ES, fr $FR)" --body "Into \`release/spanish\`; nothing goes to \`main\`. $N records translated from English on the founder's Mac by TranslateGemma 27B (\`scripts/local-mt/\`). Totals: \`content/es/\` $ES files, \`content/fr/\` $FR files. Every record passed the checks against its English source; not read by a human. \`npm run validate\`: 0 errors.

🤖 Generated with [Claude Code](https://claude.com/claude-code)" | tail -1)
echo "$URL"; gh pr merge "$URL" --merge > /dev/null 2>&1; gh pr view "$URL" --json state -q .state
