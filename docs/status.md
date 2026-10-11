# Project status and how to resume

_Last updated 11 October 2026. Read this first in a new session, then `docs/plan/00-README.md` (the plan) and `CLAUDE.md` (the rules)._

## What exists

| Area | State |
|---|---|
| Repo scaffold (plan Phase 0) | Done and deployed: schema (21 classes incl. `listing`, `screen`), 124 themes, story roles, predicates, validator, graph/derive/api/coverage scripts, Hijri converter, Astro site (en/ar, RTL), CI, issue forms |
| Content (Phase 1 spine, started) | 13 periods, 25 events of the Prophet's life (with sides on conflicts), 4 people, 6 places (GeoNames/Pleiades ids on 5), 12 sources, *The Message* (screen example), all `draft` |
| Qur'an | Frozen from Tanzil v1.1: `work/quran`, 114 suras, 6,236 ayat. Source files committed in `data/work/quran-source/` with sha256; the validator re-checks every ayah byte for byte. Sura names are museum labels still to verify against Tanzil metadata. Second witness (King Fahd Hafs) not done. |
| Doc 16 (event maps) | Partly implemented: `map` block on `event`, `map`/`illustration` media kinds, `geo/` folder, validator rules (every map feature needs a source), deterministic renderer `scripts/media/maps/render.py` (run in `.venv-media`; outputs to `~/islam-museum-media/img`). One pilot map (Battle of Badr, schematic route). **Not done:** Natural Earth basemap (needs download), scale bar/north arrow, `brief.py`, `accuracy.yaml`, `verify_coords.py`, illustration generation (needs diffusion model), `ingest.py` and showing maps on event pages. |
| Plan documents | 00-16 in `docs/plan/`. |

Run `npm install && npm install --prefix site && npm test && npm run build` to confirm the state (expect 0 validation errors, 25 tests passing, about 12,900 pages).

## The local harvest (outside the repo)

- **Workspace:** `/Volumes/exmicroSD/islam-museum-harvest` (1 TB drive), symlinked from `~/islam-museum-harvest`. If the drive is unplugged the link breaks. Registry of sources and licences: `$HARVEST/sources.yaml` (template in `scripts/harvest/sources.yaml`).
- **Python env:** `.venv-harvest` in the repo root (gitignored). Recreate with the command in `docs/plan/15-local-harvest.md` §4 (`uv venv --python 3.12 .venv-harvest`).
- **Tools installed:** aria2, duckdb, tmux, pbzip2 (lbzip2 is not in Homebrew), jq, uv.

### Downloads (resumable; the repo never contains them)

| Queue | Command | Contents | Size |
|---|---|---|---|
| Wikimedia dumps | `cd scripts/harvest && source ../../.venv-harvest/bin/activate && python download_dumps.py` | first-ring Wikipedias (en fr ar fa id tr bn ur ms), the 96 GiB Wikidata JSON dump, 26 second-ring Wikipedias | about 188 GiB, about 10 MB/s |
| Small sources | `python download_misc.py` | OpenITI Makhzan 2026.1.2 (Zenodo 19861912, CC BY-NC-SA, md5 verified), Met Open Access, Pleiades, GeoNames | about 7 GiB |

Both skip finished files and resume partial ones. Checksums go to `$HARVEST/raw/checksums.sha256`. Run them inside tmux (`tmux new -s harvest-dl`) with `caffeinate -dims`. Check state with `python scripts/harvest/status.py` and `tmux ls`.

### Loaded and used so far

- `scripts/harvest/collections/load_tables.py` loads Pleiades, GeoNames, Met (and OpenITI metadata once downloaded) into `$HARVEST/db/harvest.duckdb`.
- `scripts/harvest/collections/reconcile_places.py [--apply]` matches museum places to GeoNames and Pleiades.
- `scripts/harvest/wikidata/run_queries.py` ran 5 seed queries (1,074 QIDs in `$HARVEST/db/seeds.txt`). IDs in the queries were verified against Wikidata labels.
- `scripts/harvest/wikidata/filter_dump.py` (two-pass streaming subset filter, self-tested by `test_filter.py`) is written but **not yet run on the real dump**.

## Next steps, in order

1. Let the downloads finish (check `tmux ls`; rerun the queue commands if a session died).
2. After `raw/wikidata/latest-all.json.bz2` is complete: run the filter, pass 1 then pass 2, then `--build` (commands in the script's docstring). Do not delete the dump until the tables exist.
3. Load the OpenITI metadata (`load_tables.py`), then the Wikipedia category walk and page extraction (doc 15 §6.2; scripts `select_pages.py` and `extract.py` are not written yet).
4. Finish doc 16: basemap download (Natural Earth, ETOPO), more map blocks with sourced features, `brief.py`, `accuracy.yaml`, `verify_coords.py`, ingest maps into `media/` and event pages; illustrations need the local image model (doc 10).
5. Continue Phase 1 spine content: places (60), people (150 + 100), more events, per `docs/plan/06-roadmap.md`; first screen batch; theme hubs.
6. Manual items for the founder: second witness for the Qur'an text; verify sura names against Tanzil metadata; verify bibliographic details of the draft sources; add a contact email to the harvest User-Agent if wanted.

## Rules to remember

- Only `cc0`/`by`/`own-research` layers may feed `data/`; Wikipedia (by-sa) and OpenITI (nc) are for discovery and facts with citations only (`docs/attribution.md`).
- AI-generated content is `status.review: draft`; never mark `reviewed` or `verified`. Never write or correct Qur'an text.
- Commit only when asked; conventional commits; at most 25 entities per content batch.
