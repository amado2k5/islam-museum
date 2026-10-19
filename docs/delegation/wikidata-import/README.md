# Wikidata import lane (owner's megaplan, 19 Oct 2026)

Exhaustive import of the Islam-related Wikidata items from the local subset into the museum data. This directory is the lane document and the resumable state; the owner's task prompt (Devin session, 19 Oct 2026) is the approved proposal for this lane. It extends the earlier ten-slice wave documented in `docs/delegation/wikidata-insertion/` (commit `0f3dc75e`).

## Rules (from the task; `AGENTS.md` and `docs/agents/*` apply fully)

- **Candidates**: `select distinct id from wd_claim where property='P140' and value_id='Q432'` on the local subset (`$HARVEST/layers/cc0/wikidata-v2/wikidata-subset.duckdb`, read-only), minus Wikidata IDs already linked in `data/`, sorted by sitelink count descending.
- **Decision order per candidate**: already linked → skip (`present`); out of scope or modern (died >1800, modern building/neighbourhood mosque, company, film, album, person active only after 1800, Commons category, scholarly article, painting, coin, stamp, list, disambiguation, person with no description) → skip; entity already in `data/` under another name → add `external_ids.wikidata` and skip creating; no book/journal source confirmed in a library or publisher catalogue → skip (`no confirmed source`); else create a draft record. When in doubt, skip and log.
- **Records**: `data/<class>/<slug>.yaml`, `label`/`summary` in ar+en+ur, `external_ids.wikidata`, at least one `source/*` citation, `status.review: draft`, `completeness: 1`, provenance block. Prose in `content/ar/` + `content/en/` + `content/ur/` in the same commit. Never `reviewed`/`verified`; no honorifics typed; no Qur'an text.
- **Batches**: ≤25 new records per commit; push to `main` every 200 new entries (fetch → merge `origin/main` → validate → test → push). `npm run validate` 0 errors before every commit; `npm run graph` and `npm run coverage` in the same commit.
- **Stop only when**: candidate list exhausted; validator errors outside our own files; subset unreadable; pushes rejected repeatedly after merge.

## State files

- `progress.json` — resume state: `candidates_total`, `next_index`, `created_ids`, `linked_ids`, `skipped_total`, `skipped_by_reason`, `last_commit`, `last_push`, `updated_at`. Read it before each run and resume at `next_index`.
- `batches/NNNN.md` — the authoritative per-candidate log: one line per decision (id, decision, reason).
- `STATUS.md` — human-readable counts updated at each push.

## Deviations from the task text (documented, repo rules win)

- The frozen candidate list is **not committed**: ~82k ids ≈ 1.1 MB exceeds the repository's file-size rule (workflow §3). It lives at `$HARVEST/wikidata-import/candidates.tsv` (sha256 in `progress.json`, regenerable with the query above). `progress.json` likewise keeps bounded skip counts; the full id+reason record is the `batches/` log.
- Helper tooling (`$HARVEST/wikidata-import/wd_import.py`) lives in the harvest workspace outside git, so `scripts/` stays untouched. Subcommands: `freeze`, `enrich <start> <n>`, `index`, `collide <ar> [en]`, `show <QID…>`; run with the repo `.venv-harvest` python.

## How to resume (a new session)

1. Read `AGENTS.md`, `docs/agents/workflow.md`, `docs/agents/content-standards.md`, this file, `progress.json`, and the last `batches/NNNN.md`.
2. `git fetch origin && git merge origin/main`; rebuild the helper index (`wd_import.py index`).
3. Continue the loop at `next_index`; anything not yet committed is re-done.
