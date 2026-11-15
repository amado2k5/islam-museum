# 50 · Inventions wave 2: orchestrating 100 records through the packet pipeline

Written 15 November 2026 by the Devin orchestrator session, on the founder's
instruction to add 100 more inventions with subagents while following every
repository rule. This note records how the run is organised so it can be
resumed, audited and repeated.

## Goal and scope

- Add 100 `invention` records (data + trilingual prose + media) to the Muslim
  Inventions Browser, taking the museum from 100 to ~200 records.
- Work is **packet-only**: no worker touches the repository checkout. All
  content is drafted under `/Volumes/exmicroSD/islam-museum-harvest/packets/`
  exactly as `docs/agents/pipeline.md` specifies; the standing lander lands
  verified trains to `main`.
- Queue source: `docs/inventions/queue.yaml` on `origin/main` `fae1c5722d`
  (425 open leads). The 140 leads with linked records and lead sources were
  sliced 7-per-packet into `/Volumes/exmicroSD/islam-museum-harvest/inventions/wave2/slice-01..20.yaml`.

## Per-packet shape

Each of the 20 packets (`inventions-w2-01` … `inventions-w2-20`) targets 5
inventions → ≤25 entities: `data/invention/<slug>.yaml`,
`content/{ar,en,ur}/invention/<slug>.md` (17 canonical sections, ≥1500
main-body words per language), one `kind: image` media record and one
`kind: illustration` diagram media record per invention, plus any new
`data/source/` records. Skipped leads are reported in the manifest
`exclusions` as proposals for the founder — never decided by a worker.

## Operating rules given to drafters

The full brief lives at
`/Volumes/exmicroSD/islam-museum-harvest/inventions/wave2/WORKER-BRIEF.md`. In
short: gold-shape YAML copied from `data/invention/al-biruni-earth-radius.yaml`,
canonical 17-section prose from `content/en/invention/algebra.md`, sources must
be actually read (microSD harvest `inventions/` tree first, then web/TDV/DSB/
museum catalogues/Commons), never invent dates or citations, Sunni-first
frame, extremism hard block, Arabic-parenthesis isolation, provenance on every
record.

## Failure handling observed on day one

Launching all 20 drafters at once tripped the model request rate limit; every
drafter died before writing a file. The fix is a small rotating pool (4–5
concurrent drafters), resumed/relaunched on failure, with packets verified by
a *different* agent per `pipeline.md`. This file is the audit trail for that
adjustment.

## Bookkeeping owned by the orchestrator

- `docs/inventions/queue.yaml` state updates (`[~]`/`[x]`/`[-]`) are collected
  from landed packets and applied as a separate bookkeeping packet — workers
  never edit it concurrently.
- `BOARD.md` claims/done lines on the microSD record every packet.
- Ledger lines from manifests go to
  `docs/delegation/lane-ledgers/inventions-devin.md` (new per-lane ledger).

Merged is not live: deployment stays the founder's manual step.

## Update — first landings (15 November 2026, same day)

Three inventions trains have already landed, all merged to `main`:

| Train | PR | Packets | Inventions |
|---|---|---|---|
| inventions-1 | #7042 | w2-01, w2-02, w2-03, w2-04, w2-06 | 17 |
| inventions-2 | #7047 | w2-07 | 4 |
| inventions-3 | #7048 | w2-05 | 3 |

### The standing lander excludes this lane

Train 38 of the standing lander carried the commit note *"Excludes
inventions-w2-* (another orchestrator's)"*. The inventions lane therefore
has its own lander: the orchestrator lands `inventions-w2-*` trains itself,
following `docs/agents/pipeline.md` and the lander brief — one PR per train,
`npm run graph` + `npm run coverage` + `npm run validate` (0 errors) before
merge, CANARY entries, lane ledger
(`docs/delegation/lane-ledgers/inventions-devin.md`), three-way merge
against fresh `origin/main`. `BOARD.md` records this so the standing lander
keeps skipping these packets rather than rejecting them.

### `check:packet` vs full `validate` — the gap that matters

Every verified packet passed `npm run check:packet`, yet the first full
`npm run validate` on train 1 found **34 errors** the scoped check misses:

- `data/source/*` records need a self-citing `sources:` list when
  `provenance.layer` is not `cc0`/`by`, and must not carry a `doi` field.
- `spread` entries require `place:` + `start:` + `sources:` **and**
  `media.map` pointing to a real map media entity (render pipeline
  `scripts/media/maps/`). Lander decision for wave 2: `spread: []` on every
  invention; the spread narrative stays in prose. Map-backed spread entries
  are a documented follow-up.
- `impact.fields` must use the controlled enum (e.g. `timekeeping`,
  `institutions-systems` — never `religion`/`law`).
- Pure-digit date strings (`edtf: "0900"`) must be quoted or YAML loads them
  as ints.
- `work/` records have no `names` field; `invention` `dependents`/`precursors`
  entries take `invention:` or `external:` (trilingual) — never `work:`;
  `sources:` arrays take bare `source/<id>` refs, page detail goes in `note`.
- Arabic-script parentheticals need U+2066/U+2069 isolation everywhere,
  including inside `external:` blocks.

All of these are now **Addenda 1–2 of `WORKER-BRIEF.md`** so draffers and
verifiers produce train-clean packets; verifiers also enforce them.

### Collisions and merges observed

- `data/person/al-farghani.yaml` was edited by **two** packets (w2-03 and
  w2-04) — the lander hand-merged both invention-tie sets and both
  provenance extensions into one file. Addendum 1 now tells workers to avoid
  shared-file edits or declare them in `shared_edits`.
- `docs/coverage.md` conflicts on every train (generated file); resolved by
  regenerating with `npm run coverage` after merging `origin/main`.

### Totals at this update

24 wave-2 inventions landed (117 → 124 records on `main` including the
pre-existing 100). Drafting continues on packets w2-08 through w2-20 with
the same verify-then-land cycle; reserve slices 21–40 stand ready if yield
stays under 5 inventions per packet.

## Update — first landings (15 November 2026, same day)

Three inventions trains have already landed, all merged to `main`:

| Train | PR | Packets | Inventions |
|---|---|---|---|
| inventions-1 | #7042 | w2-01, w2-02, w2-03, w2-04, w2-06 | 17 |
| inventions-2 | #7047 | w2-07 | 4 |
| inventions-3 | #7048 | w2-05 | 3 |

### The standing lander excludes this lane

Train 38 of the standing lander carried the commit note "Excludes
inventions-w2-* (another orchestrator's)". The inventions lane therefore
has its own lander: the orchestrator lands `inventions-w2-*` trains itself,
following `docs/agents/pipeline.md` and the lander brief — one PR per train,
`npm run graph` + `npm run coverage` + `npm run validate` (0 errors) before
merge, CANARY entries, lane ledger
(`docs/delegation/lane-ledgers/inventions-devin.md`), three-way merge
against fresh `origin/main`. `BOARD.md` records this so the standing lander
keeps skipping these packets rather than rejecting them.

### `check:packet` vs full `validate` — the gap that matters

Every verified packet passed `npm run check:packet`, yet the first full
`npm run validate` on train 1 found **34 errors** the scoped check misses:

- `data/source/*` records need a self-citing `sources:` list when
  `provenance.layer` is not `cc0`/`by`, and must not carry a `doi` field.
- `spread` entries require `place:` + `start:` + `sources:` **and**
  `media.map` pointing to a real map media entity (render pipeline
  `scripts/media/maps/`). Lander decision for wave 2: `spread: []` on every
  invention; the spread narrative stays in prose. Map-backed spread entries
  are a documented follow-up.
- `impact.fields` must use the controlled enum (e.g. `timekeeping`,
  `institutions-systems` — never `religion`/`law`).
- Pure-digit date strings (`edtf: "0900"`) must be quoted or YAML loads them
  as ints.
- `work/` records have no `names` field; `invention` `dependents`/`precursors`
  entries take `invention:` or `external:` (trilingual) — never `work:`;
  `sources:` arrays take bare `source/<id>` refs, page detail goes in `note`.
- Arabic-script parentheticals need U+2066/U+2069 isolation everywhere,
  including inside `external:` blocks.

All of these are now **Addenda 1–2 of `WORKER-BRIEF.md`** so drafters and
verifiers produce train-clean packets; verifiers also enforce them.

### Collisions and merges observed

- `data/person/al-farghani.yaml` was edited by **two** packets (w2-03 and
  w2-04) — the lander hand-merged both invention-tie sets and both
  provenance extensions into one file. Addendum 1 now tells workers to avoid
  shared-file edits or declare them in `shared_edits`.
- `docs/coverage.md` conflicts on every train (generated file); resolved by
  regenerating with `npm run coverage` after merging `origin/main`.

### Totals at this update

24 wave-2 inventions landed (117 -> 124 records on `main` including the
pre-existing 100). Drafting continues on packets w2-08 through w2-20 with
the same verify-then-land cycle; reserve slices 21–40 stand ready if yield
stays under 5 inventions per packet.
