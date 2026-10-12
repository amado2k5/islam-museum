# Project status and how to resume

_Last updated 11 October 2026, 18:15 EDT._ Read this first in a new session, then `docs/plan/00-README.md` (the plan) and `CLAUDE.md` (the rules)._

## What exists

| Area | State |
|---|---|
| Repo scaffold (plan Phase 0) | Done and deployed: schema (21 classes incl. `listing`, `screen`), 124 themes, story roles, predicates, validator, graph/derive/api/coverage scripts, Hijri converter, Astro site (en/ar, RTL), CI, issue forms |
| Content (Phase 1 spine, started) | 13 periods, 25 events of the Prophet's life (with sides on conflicts), 4 people, 31 places (GeoNames ids on all, Pleiades ids where a unique match exists), 12 sources, *The Message* (screen example), all `draft` |
| Qur'an | Frozen from Tanzil v1.1: `work/quran`, 114 suras, 6,236 ayat. Source files committed in `data/work/quran-source/` with sha256; the validator re-checks every ayah byte for byte. Sura names are museum labels still to verify against Tanzil metadata. Second witness (King Fahd Hafs) not done. |
| Doc 16 (event maps) | Pipeline built end to end for maps: `map` block on events, `map`/`illustration` media kinds, `geo/`, validator rules (every map feature needs a source), deterministic renderer `scripts/media/maps/render.py` (Natural Earth vectors + shaded relief, scale bar, north arrow, en/ar), `verify_coords.py` (GeoNames check: 12 ok, 1 check, 1 unmatched, 1 missing), `scripts/media/brief.py` (24 scene briefs, ETOPO1 elevation), `scripts/media/accuracy.yaml` (one unreviewed entry), `ingest.py` (writes `data/media/*` and copies SVGs to `site/public/media/maps/`), event pages show the map. One pilot map (Battle of Badr, schematic route, draft). Basemap and elevation files are in `$HARVEST/basemaps/` (not in git). **Not done:** more map blocks with sourced features (camps, lines), polity-extent layer under maps, the accuracy table needs a reviewer's sources, illustration generation (needs the local image model of doc 10; `brief.py` output is ready for it), Wikidata P625 check (needs the dump). Run in `.venv-media` (renderer) and `.venv-harvest` (verify_coords). |
| Plan documents | 00-16 in `docs/plan/`, plus `docs/scope.md` (Sunni default frame, all other views labelled) and the no-runtime-AI rule (ADR 0002). |

Run `npm install && npm install --prefix site && npm test && npm run build` to confirm the state (expect 0 validation errors, 25 tests passing, about 12,900 pages).

## The local harvest (outside the repo)

- **Workspace:** `/Volumes/exmicroSD/islam-museum-harvest` (1 TB drive), symlinked from `~/islam-museum-harvest`. If the drive is unplugged the link breaks. Registry of sources and licences: `$HARVEST/sources.yaml` (template in `scripts/harvest/sources.yaml`).
- **Python env:** `.venv-harvest` in the repo root (gitignored). Recreate with the command in `docs/plan/15-local-harvest.md` §4 (`uv venv --python 3.12 .venv-harvest`).
- **Tools installed:** aria2, duckdb, tmux, pbzip2 (lbzip2 is not in Homebrew), jq, uv.

### Downloads (resumable; the repo never contains them)

| Queue | Command | Contents | Size |
|---|---|---|---|
| Wikimedia dumps | `cd scripts/harvest && source ../../.venv-harvest/bin/activate && python download_dumps.py` | first-ring Wikipedias (en fr ar fa id tr bn ur ms), the 96 GiB Wikidata JSON dump, 26 second-ring Wikipedias; five files per language: article dump, its index, `page`, `categorylinks` and **`linktarget`** (added: categorylinks now stores `cl_target_id`, so category names live in linktarget) | about 195 GiB, about 10 MB/s |
| Small sources | `python download_misc.py [source ...]` | **openiti-corpus** 2025.1.9 (Zenodo 17767721, the real text corpus, 5.9 GB, CC BY-NC-SA, md5 verified), openiti-makhzan 2026.1.2 (Zenodo 19861912: manuscript/print data for text recognition, NOT the corpus; kept for catalogue metadata), Met, Pleiades, GeoNames, Natural Earth, ETOPO1 | about 20 GiB |

Both skip finished files and resume partial ones. Checksums go to `$HARVEST/raw/checksums.sha256`. Run them inside tmux (`tmux new -s harvest-dl`) with `caffeinate -dims`. Check state with `python scripts/harvest/status.py` and `tmux ls`.

### Loaded and used so far

- `scripts/harvest/collections/load_tables.py` loads Pleiades, GeoNames, Met (and OpenITI metadata once downloaded) into `$HARVEST/db/harvest.duckdb`.
- `scripts/harvest/collections/reconcile_places.py [--apply]` matches museum places to GeoNames and Pleiades.
- `scripts/harvest/wikidata/run_queries.py` ran 5 seed queries (1,074 QIDs in `$HARVEST/db/seeds.txt`). IDs in the queries were verified against Wikidata labels.
- `scripts/harvest/wikipedia/load_sql.py LANG` parses the MySQL dumps (page, linktarget, categorylinks) into `$HARVEST/db/wikipedia.duckdb`; `select_pages.py --lang LANG` walks categories offline from `seed-categories.yaml` (stop-list for leaking categories) into `wp_<lang>_scope`; `extract.py --lang LANG` reads only the needed compressed blocks via the multistream index and writes JSONL (lead, sections, infobox hints, references, categories) to `layers/by-sa/wikipedia/LANG/`. English page table is loaded; categorylinks/linktarget loading and the first walk were in progress. Other languages: seed categories are to be mapped from English through langlinks, not typed by hand (langlinks dumps not downloaded yet).
- `scripts/harvest/wikidata/filter_dump.py` (two-pass streaming subset filter, self-tested by `test_filter.py`) is written but **not yet run on the real dump**.

## Parallel work (who owns what)

| Stream | Owner | Where | Status |
|---|---|---|---|
| Prophetic-era people (batches A-F: family, Companions, Meccan opposition, protectors, Medina allies, Ridda, groups) | Devin, from its own clone, via PRs on `devin/people-batch-*` | `data/person/**`, Prophetic-era `data/group/**`, own `data/source/**`, `content/*/person/**`, `data/_stubs.d/devin-people.yaml`. Prompt: `docs/delegation/devin-people-lane.md` | Batches A-F merged 11 Oct 2026; review any further PRs before merging (all content is `draft`; check sources are real) |
| Sīrat Ibn Hishām juz' 4 mining (plan 18: endgame, conquests, expeditions, delegations, passing) | Devin (sira mining lane) | `data/**`, `content/ar/**`, `datasets/**` | Batches 1, 2, and 3 (فتح مكة، حنين والطائف، أموال هوازن والمؤلفة والجعرانة pp. 31–143) merged to main; 0 validation errors, 32 tests passing |
| al-Raheeq al-Makhtum mining (plan 17: Prophetic era spine) | Antigravity (`content/raheeq-continue`) | `data/**`, `content/ar/**`, `data/_stubs.d/raheeq.yaml` | Batches 1–8 merged on main; Batch 9 (الحياة في المدينة وغزوات قبل بدر pp. 175–203) and Batch 10 (بين بدر وأحد pp. 233–247) completed; 0 validation errors, 32 tests passing |
| Schema, scripts, site, i18n, events, places, periods, maps, Qur'an, local harvest | Maintainer session (Claude) | everything else | In progress |

Devin's schema needs arrive as `docs/requests/devin-*.md`. Unresolved references for parallel contributors go in `data/_stubs.d/*.yaml` (read by the validator and graph builder alongside `data/_stubs.yaml`).

## Live state snapshot (11 Oct 2026, ~18:15 EDT)

| Item | State |
|---|---|
| Downloads on `/Volumes/exmicroSD/islam-museum-harvest` | **Done and checksummed:** all 9 first-ring Wikipedias (5 files each, incl. linktarget), OpenITI corpus 2025.1.9 (md5 ok) and Makhzan, Pleiades, GeoNames, Met, Natural Earth, ETOPO1. **Running (tmux `harvest-dl`):** Wikidata JSON dump, 8% of 96 GiB at about 8 MB/s (about 3 h), then the 26 second-ring Wikipedias (about 46 GiB). Resume: `python scripts/harvest/download_dumps.py`. About 72 GB raw on disk, 870 GiB free. |
| English Wikipedia tables (`$HARVEST/db/wikipedia.duckdb`) | `wp_en_page` (22.0 M rows) and `wp_en_catlinks` (226.6 M rows) loaded; `wp_en_linktarget` loading; **next:** `python scripts/harvest/wikipedia/select_pages.py --lang en`, then `extract.py --lang en`. Other languages' SQL dumps not parsed yet (`load_sql.py LANG`). |
| Wikidata | Dump downloading; `filter_dump.py` (two-pass) ready and self-tested, not yet run on the real dump. 1,074 seed QIDs in `$HARVEST/db/seeds.txt`. |
| Devin (people lane) | **Batches A-F reviewed and merged by the founder (PRs #1-#6).** Main now has 67 people (63 by Devin) and 12 groups, 129 prose files, 0 validation errors, 29 tests passing. All `draft`; sources are real books but bibliographic details still need a human check. Perspectives are Sunni-first on all 22 blocks; no honorifics or epithets found by an exact-pattern scan. Further Devin work (more Prophetic-era people, then other lanes of `docs/plan/13` §3) needs a new prompt; batches in `docs/delegation/devin-people-lane.md` are complete. |
| Content on main | 67 people, 12 groups, 31 places, 39 events (Prophetic era), 13 periods, about 25 sources, Qur'an (frozen), *The Message*; all `draft`. 14 validator warnings remain (places without sources, 4 people with completeness >= 2 but no English prose, 3 unsourced *Message* reception entries) |

## Next steps, in order

1. Let the downloads finish (check `tmux ls`; rerun the queue commands if a session died).
2. After `raw/wikidata/latest-all.json.bz2` is complete: run the filter, pass 1 then pass 2, then `--build` (commands in the script's docstring). Do not delete the dump until the tables exist.
3. Finish the English Wikipedia walk (`load_sql.py en categorylinks linktarget`, `select_pages.py --lang en`, then `extract.py --lang en`); then mine OpenITI (corpus zip is unzipped on demand, never republished) and run the same walk for the other languages as their dumps finish.
4. Finish doc 16: basemap download (Natural Earth, ETOPO), more map blocks with sourced features, `brief.py`, `accuracy.yaml`, `verify_coords.py`, ingest maps into `media/` and event pages; illustrations need the local image model (doc 10).
5. Continue Phase 1 spine content: places (60), people (150 + 100), more events, per `docs/plan/06-roadmap.md`; first screen batch; theme hubs.
6. Manual items for the founder: second witness for the Qur'an text; verify sura names against Tanzil metadata; verify bibliographic details of the draft sources; add a contact email to the harvest User-Agent if wanted.

## Rules to remember

- **Arabic first** (`docs/language.md`): implemented 11 Oct 2026 (`c0030e9`). The site publishes `ar` only (`site/src/lib/i18n.ts` LANGS, `astro.config.mjs`, `scripts/lib.ts` PUBLISHED_LANGS); `/` serves the Arabic home page and `/ar/` is canonical; no language switcher while there is one language. Validator requires `label.ar`, `summary.ar` and Arabic alt text (sources exempt); English is optional. Existing English prose stays and is shown with a notice when Arabic prose is missing; new prose is written in `content/ar/`. Templates and style guide are Arabic first. Search normalises Arabic (hamza, ta marbuta, diacritics) and maps Latin spellings to Arabic labels. To add English in Phase 4: add `"en"` to the three places above and translate. The Devin prompt in `docs/delegation/` predates this rule: new prompts must ask for Arabic first (English optional).
- **Content quality** (`docs/content-quality.md`, 11 Oct 2026): review of Raheeq batch 11 part 1 found typed honorifics, a `.yaml` saved under `content/`, no top-level `sources`, `related_to` everywhere, wrong EDTF month for Shawwal 3 AH, duplicate stubs, and unattributed judgements ("تمرد", "رأس المنافقين"); also typed ayat in three batch-9 pages. All fixed in place; the validator now rejects honorifics anywhere (it silently missed ﷺ before: a `\b` bug), typed ayat in prose, and non-`.md` files under `content/`.
- **Collaboration protocol** (`docs/collaboration.md`, founder instruction 11 Oct 2026): review and merge what arrives, never revert or discard others' work, duplicates become aliases. Applies to every session and to Devin. Example merge done: `event/conversion-of-hamza` and `event/conversion-of-umar` (earlier English-first stubs) folded into the richer `event/islam-of-hamza` and `event/islam-of-umar` as aliases, with their themes and English-scholarship sources carried over.
- **Shared working folder hazard:** several agent sessions have been editing `~/Documents/GitHub/islam-museum` at the same time (one preserved another's uncommitted work as a WIP branch; `git add -A` swept files into the wrong commit). Use a separate `git worktree` per session, commit only explicit paths, and rebase/push from a clean worktree.
- **No AI and no compute at runtime** (docs/plan/03 §13, ADR 0002): AI is a build-time tool only. The site is static; `npm run check:static` (also in CI) fails the build on any runtime call to a non-static or external endpoint. Search synonyms (`scripts/search-variants.yaml` → `site/public/search-synonyms.json`) and related-entity lists (`derive.ts`) are precomputed at build time. Still to do from Prompt P (Phase 5): `scripts/questions/harvest-queries.ts` and the zero-result-search → Questions loop.
- Only `cc0`/`by`/`own-research` layers may feed `data/`; Wikipedia (by-sa) and OpenITI (nc) are for discovery and facts with citations only (`docs/attribution.md`).
- AI-generated content is `status.review: draft`; never mark `reviewed` or `verified`. Never write or correct Qur'an text.
- Commit only when asked; conventional commits; at most 25 entities per content batch.
