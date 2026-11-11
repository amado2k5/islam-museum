#!/bin/sh
# Statement 12, second half: the integration point. Merges main into a scratch copy of this branch, without committing
# and without touching this checkout, and re-runs there every oracle that the merge could affect.
#
#   git fetch origin main
#   sh scripts/fable/integrate.sh <an empty scratch folder outside the repository> [main's commit, default origin/main]
#   python3 scripts/fable/concurrency.py <the same commit>      # writes the block in VERIFICATION.md
#
# What it does, in order:
#   1. adds a detached git worktree of this branch's HEAD at the scratch folder;
#   2. runs `git merge --no-commit` of main there and lists the conflicts. Two files are expected to conflict and are
#      taken from main for the purpose of this run: CANARY.md (both sides add a version block at the top; the real
#      merge places this branch's block above main's newest) and docs/coverage.md (generated; regenerated on merge).
#      Any other conflict stops the script: it is a finding, and is written to merge.out;
#   3. builds the graph artifact, the derived files and the scoped site build from the merged tree;
#   4. runs oracles 00, 01, 02, 03, 04, 05, 07 and 09 and the validator there, and writes their outputs into THIS
#      checkout, under docs/fable-run/oracle-output/integration/.
# The merge is never committed (the repository's commit hook refuses commits that touch Qur'an passage files, which
# main's own commits do; the hook is not bypassed), so the oracle headers there name this branch's HEAD and count the
# merged files as uncommitted paths. The scratch folder is left in place; remove it with `git worktree remove --force`.
set -e
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
DIR="$1"
[ -n "$DIR" ] || { echo "usage: sh scripts/fable/integrate.sh <scratch folder> [main commit]"; exit 2; }
MAIN="$(git -C "$ROOT" rev-parse "${2:-origin/main}")"
HEAD="$(git -C "$ROOT" rev-parse HEAD)"
OUT="$ROOT/docs/fable-run/oracle-output/integration"
rm -rf "$OUT"; mkdir -p "$OUT"
if [ -e "$DIR" ]; then git -C "$ROOT" worktree remove --force "$DIR" 2>/dev/null || rm -rf "$DIR"; git -C "$ROOT" worktree prune; fi
git -C "$ROOT" worktree add --detach "$DIR" "$HEAD" >/dev/null 2>&1
cd "$DIR"
{
  echo "integration point: this branch at $HEAD merged with main at $MAIN (git merge --no-commit, never committed)"
  git merge --no-commit --no-ff "$MAIN" 2>&1 | grep -E "^(CONFLICT|Automatic merge|Auto-merging (CANARY|docs/coverage|i18n|site/src/components/Landing))" || true
  echo "files in conflict:"
  git diff --name-only --diff-filter=U | sed 's/^/  /'
} > "$OUT/merge.out"
OTHER="$(git diff --name-only --diff-filter=U | grep -v -x -e CANARY.md -e docs/coverage.md || true)"
if [ -n "$OTHER" ]; then echo "RESULT: NOT-GREEN (the merge conflicts outside the two expected files: $(echo $OTHER))" >> "$OUT/merge.out"; cat "$OUT/merge.out"; exit 1; fi
for f in $(git diff --name-only --diff-filter=U); do git checkout --theirs -- "$f"; done
echo "files main changed that this branch also changed, merged by git without conflict: $(git diff --name-only "$HEAD" "$(git merge-base "$HEAD" "$MAIN")" | sort > .ours.txt; git diff --name-only "$MAIN" "$(git merge-base "$HEAD" "$MAIN")" | sort > .theirs.txt; comm -12 .ours.txt .theirs.txt | grep -v -x -e CANARY.md -e docs/coverage.md | tr '\n' ' '; rm -f .ours.txt .theirs.txt)" >> "$OUT/merge.out"
echo "RESULT: GREEN (the merge conflicts only in CANARY.md and docs/coverage.md)" >> "$OUT/merge.out"
ln -s "$ROOT/node_modules" node_modules
ln -s "$ROOT/site/node_modules" site/node_modules
npx tsx scripts/build-graph.ts > "$OUT/graph.log" 2>&1
npm run derive >> "$OUT/graph.log" 2>&1
sh scripts/fable/scoped-build.sh >> "$OUT/graph.log" 2>&1 || echo "scoped build failed; oracle 09 will say so" >> "$OUT/graph.log"
run() { name="$1"; shift; "$@" > "$OUT/$name.out" 2>/dev/null || true; echo "$name: $(grep '^RESULT:' "$OUT/$name.out" | tail -1)"; }
run o00_baseline python3 scripts/fable/o00_baseline.py
run o01_canon python3 scripts/fable/o01_canon.py
run o02_tour_coverage python3 scripts/fable/o02_tour_coverage.py
run o03_tour_prose python3 scripts/fable/o03_tour_prose.py
run o04_reachability python3 scripts/fable/o04_reachability.py
run o05_contradictions npx tsx scripts/fable/o05_contradictions.ts
run o07_absences python3 scripts/fable/o07_absences.py
run o09_nojs node scripts/fable/o09_nojs.mjs
npm run validate 2>&1 | grep -E "validated [0-9]+ entities" | tail -1 > "$OUT/validate.out" || true
echo "validate: $(cat "$OUT/validate.out")"
# the logs are for the person running this; the ledger keeps the oracle outputs and the merge record
rm -f "$OUT/graph.log"
