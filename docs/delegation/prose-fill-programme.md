# Prose-fill programme — every prose-bearing entity to completeness 3 in ar+en+ur

_Author: Devin (SWE-2 Medium), 3 Nov 2026. Approved by the founder in session (megaplan prompt "enrich and fill up to the possible max all the proses missing content in all three languages"; the founder directed that the zero-link tail is included, not excluded, and that the work is split into class lanes). The programme doc is the lane registry's parent; each lane doc is `docs/agents/lanes/prose-fill-<name>.md`._

## 1. What this is

The endgame for prose coverage: every `data/<class>/<slug>.yaml` entity that takes a prose page gets one in all three published languages (`content/{ar,en,ur}/`), and every thin prose file (<800 bytes) is enriched to the class's full house structure, each record raised to `status.completeness: 3`. Meta-classes are excluded as before: `source/*`, `media/*`, `listing/*`, `dataset/*`, `language/*`, `passage/quran-*` (bibliography cards, captions, reader frames — not prose pages).

## 2. Baseline (3 Nov 2026, computed by `npx tsx scripts/report/prose-queue.ts`)

**13,153 entities missing prose in ≥1 language; 8,542 more thin-only.** Per-class (missing / thin):

| Class | Missing | Thin-only |
|---|---|---|
| building | 5,426 | ~76 |
| person | 3,105 | ~2,759 |
| event | 2,422 | ~817 |
| work | 1,215 | ~192 |
| place | ~19 | ~1,037 |
| passage (non-quran) | ~533 | ~1,039 |
| object | ~4 | ~489 |
| group | ~94 | ~84 |
| polity | ~74 | ~20 |
| concept | ~13 | ~146 |
| question | 0 | ~177 (cards) |
| exhibit | 0 | ~305 (cards) |
| screen | 0 | ~234 (cards) |
| practice, journey | 0 | ~16 |

The authoritative per-class queues (ranked by inbound links, with cited source ids) are regenerated into `docs/delegation/prose-fill-queue.md` and `docs/delegation/prose-queue/<class>.md` — re-run the script after every large merge; the boundary restated in each progress file applies to the latest generation.

## 3. Lanes (partition by class — no record worked twice)

| Lane | Classes | Queue file(s) |
|---|---|---|
| `prose-fill-buildings` | building | `prose-queue/building.md` |
| `prose-fill-persons` | person | `prose-queue/person.md` |
| `prose-fill-events` | event | `prose-queue/event.md` |
| `prose-fill-works` | work | `prose-queue/work.md` |
| `prose-fill-places-objects` | place, object | `prose-queue/place.md`, `prose-queue/object.md` |
| `prose-fill-misc` | group, polity, concept, practice, journey, period, passage (non-quran) | one file per class |
| `prose-fill-cards` | question, exhibit, screen | fuller sourced card per class conventions, not essay-length |

**Boundary with existing lanes.** `prose-backfill-2` (Devin) continues as the **head-of-queue worker**: missing prose ranked by inbound links, top-down, in any class. Each `prose-fill-*` class lane works its class **bottom-up** — the zero-link tail first, ascending — plus all thin records in its class. The two meet in the middle; the boundary (last position worked by each) is restated in both progress files at each queue regeneration. `prose-backfill` (original, thin tier): its thin work in covered classes is **absorbed** by the class lanes — the class lane owns thin records in its classes so that ar+en+ur land in one commit; records already finished by any lane (listed in its progress file) are never reworked. `prose-enrichment-100` keeps its <20-word a–m / n–z split; a record it finishes drops out of the thin queue on the next regeneration. `showcase-prose` is unchanged (its featured records are also its own; class lanes skip anything in `docs/delegation/showcase-prose-progress.md`).

**The tail, per the founder's direction.** The zero-link cohort is written, not skipped: each record's prose is sourced from the sources its data record already cites (only **4** records in the whole gap cite *only* `source/wikidata` — those get a real book source found from the harvest library or are logged as leads). Where no readable source exists after the toolkit pass below, the record is logged in the progress file as a lead with the reason — never padded, never written from Wikipedia/Wikidata alone.

## 4. Sourcing toolkit (the founder's machine)

- **Cited sources first.** The record's own `sources:` are the starting point — most of the tail cites al-A'lam, Tarikh al-Islam (Hasan Ibrahim Hasan), Sallabi, or a survey work already OCR'd on the harvest drive.
- **Harvest library.** `scripts/harvest/library/books.yaml` canon + the extracted texts on the harvest drive (`/Volumes/exmicroSD/islam-museum-harvest/books/`, `ocr/`), the OpenITI corpus (5.9 GB), `$HARVEST/db/*.duckdb`.
- **Local OCR.** `.venv-harvest` + `scripts/harvest/ocr_status.py`; Apple Vision OCR of downloaded PDFs (the founder's Mac may browse the web and download PDFs — e.g. archive.org copies — then OCR them, per `mining-sources.md`; PDFs and OCR text never enter git).
- **Local models.** ollama (qwen3:32b, llama3.1, gemma4, qwen2.5-coder…) for retrieval/assist tasks only — prose is written by the lane agent from cited sources, never generated unsourced.
- Facts and page references enter `data/` from any source read; verbatim text stays out (≤40-word cited quotation max), per `docs/sources-policy.md`.

## 5. Per-record bar

- Arabic first: `## موجز` lead + the class's house sections (gold example `content/ar/event/expedition-of-al-sawiq.md`); `content/en/` and `content/ur/` prose in the same commit, all `status.review: published` with a `provenance` block (`generated_by`, `model`, `run`, `source`).
- Every fact carries `{cite:<source-id> <anchor>}` to a defined `data/source/` entity. One source is enough per fact (`docs/agents/publication-standard.md`); a second is added when cheap.
- `status.completeness: 3` on the yaml; enrichments add sources/claims additively; new edges use `schema/predicates.yaml` only; unresolved mentions go to the lane's own `data/_stubs.d/prose-fill-<name>.yaml` (append-only).
- Cards (`question`, `exhibit`, `screen`): the complete sourced card the class calls for — the sections `docs/plan/02-content-model.md` gives them — not padded essays.
- No honorifics typed, no Qur'an text outside Tanzil, no verdicts; contested topics use `perspectives` (Sunni first, academic next, labelled, no verdict).

## 6. Per-batch protocol

1. Fetch-merge `origin/main`; regenerate the queue if a large merge landed.
2. ≤25 records per commit, grouped by source so one book is mined once.
3. `npm run cite-check <ids>` — the mechanical publication bar.
4. `npm run validate` (0 errors) and `npm test` (all pass); `npm run coverage` regenerated **in the same commit** (never hand-edited).
5. Explicit paths only (never `git add -A`); conventional commit `content(prose-fill-<name>): …`; attribution trailers `AI-Agent:`, `AI-Model:`, `AI-Editor:`.
6. Push the branch (`content/prose-fill-<name>`), open a PR, self-merge — `main` is PR-only; no review required.
7. One line per batch in the lane's progress file: files written, skipped/leads with reason, next queue position. Report to the owner every 10 batches from regenerated coverage.

## 7. Non-goals

No UI/site/feature work, no schema changes (a new class, predicate or enum value stops and goes to the founder), no deployment (manual, the founder's alone), no rework of records any lane has already logged as done.

## 8. Exit

The programme exits when `prose-queue.ts` reports zero missing and zero thin rows in every covered class, or when the remaining rows are all logged leads awaiting sources — at which point a source-hunt phase decides each lead's fate.
