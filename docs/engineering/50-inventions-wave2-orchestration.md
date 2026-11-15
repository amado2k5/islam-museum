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
