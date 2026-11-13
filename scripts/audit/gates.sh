#!/bin/sh
# The two merge gates of the audit run, each asserted literally and as its own step:
#   1. `npm run validate` prints a summary line that says "0 errors" (the summary line itself is matched, never a
#      line that merely contains the word "error");
#   2. `npm run cite-check` over every data record this branch changed prints "0 fail".
# Usage: sh scripts/audit/gates.sh [base-ref]      (base defaults to origin/main)
# Logs: .cache/logs/gate-validate.log, .cache/logs/gate-cite.log. Exit 1 on either gate.
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"; cd "$ROOT"
BASE="${1:-origin/main}"
mkdir -p .cache/logs
FAIL=0

npm run validate > .cache/logs/gate-validate.log 2>&1; VRC=$?
VLINE="$(grep -E '^validated [0-9]+ entities, [0-9]+ prose files: [0-9]+ errors, [0-9]+ warnings$' .cache/logs/gate-validate.log)"
echo "validate exit code: $VRC"
echo "validate summary:   ${VLINE:-<no summary line>}"
if [ "$VRC" -eq 0 ] && printf '%s\n' "$VLINE" | grep -Eq ': 0 errors, '; then echo "GATE validation: PASS (0 errors)"; else echo "GATE validation: FAIL"; FAIL=1; fi

# every data record added or changed against the base, committed or not, that still exists
IDS="$( { git diff --name-only "$BASE"...HEAD -- data; git diff --name-only HEAD -- data; git ls-files --others --exclude-standard -- data; } | sort -u \
  | grep -E '^data/[a-z-]+/[a-z0-9-]+\.yaml$' | while read -r f; do [ -f "$f" ] && echo "$f" | sed -E 's#^data/##; s#\.yaml$##'; done)"
N="$(printf '%s\n' "$IDS" | grep -c . )"
if [ "$N" -eq 0 ]; then
  echo "cite-check: no data record changed against $BASE"
  echo "GATE cite-check: PASS (0 fail of 0 records)"
else
  # shellcheck disable=SC2086
  npm run cite-check -- $IDS > .cache/logs/gate-cite.log 2>&1; CRC=$?
  CLINE="$(grep -E '^cite-check: [0-9]+ pass, [0-9]+ fail of [0-9]+ record\(s\)' .cache/logs/gate-cite.log)"
  echo "cite-check exit code: $CRC"
  echo "cite-check summary:   ${CLINE:-<no summary line>}"
  if [ "$CRC" -eq 0 ] && printf '%s\n' "$CLINE" | grep -Eq "^cite-check: $N pass, 0 fail of $N record\(s\)"; then echo "GATE cite-check: PASS (0 fail of $N records)"; else echo "GATE cite-check: FAIL"; FAIL=1; fi
fi
exit $FAIL
