# Lane `lib-exp-medicine-science`

- **Owner:** library-expansion (Claude)
- **Opened:** 18 Oct 2026, workstream prompt of the founder (see `docs/agents/lanes.md`, "Library expansion lanes")
- **Scope and book list:** see `docs/agents/lanes.md`, section "Library expansion lanes"
- **Branch / stubs:** `content/lib-exp-medicine-science`; `data/_stubs.d/lib-exp-medicine-science.yaml`

## Status

| Stage | State |
|---|---|
| 1. Books located (`books.yaml` entries) | not started |
| 2. Downloaded (filename, source URL, size recorded below) | not started |
| 3. OCR (local, drive only) | not started |
| 4. Distilled into draft entities | not started |
| 5. Verified (`verify_cites.py`) | not started |
| 6. Published in batches of at most 25 | not started |

## Batch 1 (draft, branch `lib-exp-medicine-science/canon-batch-1`)

- **Pages covered (OCR markers):** p.1 (title page), pp.2–18 (Book I, Fann 1, Ta'lim 1–5), p.69 (Ta'lim 6 heading), and heading-only checks at pp.77, 158, 197, 232, 543.
- **Entities created (all `status.review: draft`):**
  - `work/al-qanun-fi-al-tibb` (book; ID was already referenced by `person/ibn-sina`, so it is now written)
  - `concept/medicine` (was a stub in `data/_stubs.yaml`; the stub line is removed)
  - `concept/four-elements`, `concept/temperament`, `concept/humours`
  - `source/canon-ibn-sina-print` (the printed copy, edition not verified; `status` only, no provenance block, since a source with a provenance layer needs cited sources)
- **Skipped and why:**
  - The author's front matter and the five-book division with page numbers: not in the OCR. p.1 is the title page only; p.2 opens Book I directly. Book IV and Book V were not located in the headings found so far.
  - Author death date (428 AH) for the work record: not stated in the pages read. The person record `person/ibn-sina` already holds it, sourced to Gutas and al-Dhahabi; the work record carries no date.
  - Organs (Ta'lim 5, p.18), powers and actions (Ta'lim 6, p.69), and the rest of Book I: next batch.
  - No prose for the three concept files beyond the data summaries (matches `concept/madhahib-al-tibb`).
- **Schema or enum needs:** none found for this batch. `source/` kinds and `provenance.layer` values used as the schema allows.

## Duplicates found and skipped

No duplicate for the Canon, Ibn Sina, or the medical concepts in this batch: `grep` over `data/` found `person/ibn-sina` (existing), `concept/madhahib-al-tibb` (different topic, left alone) and `concept/arab-medicine-in-european-schools` (left alone). Pre-check counts (18 Oct 2026) are in the lane document.

## Downloads

None yet.

## First book: al-Qanun fi al-Tibb (Ibn Sina)

- **Source file (local, not in git):** `/Users/ahmedabdelaal/Downloads/القانون في الطب_63329_Foulabook.com_.pdf`, copied to `raw/library/medicine-science/canon-ibn-sina/canon-ibn-sina.pdf` on the harvest drive. 1,161 pages, 6.9 MB, Arabic printed edition. Its own text layer exists but is partly broken, so the whole book is OCR'd with Apple Vision (`--force-ocr`).
- **Edition:** not verified yet (no publisher, date or volume on the title page we have read). Must be checked before the source is marked reviewed.
- **Category:** `medicine-science` is not in the category list of `books.yaml`; it is a harvest folder name only. Founder to confirm.
- **OCR:** started 18 Oct 2026 with `ocr_book.py --force-ocr`, log `logs/ocr-canon-ibn-sina.log`.

## Next step

1. Read the OCR pages 19–68 (Ta'lim 5 organs and the rest of Ta'lim 6), and find the front matter if the OCR has it under another page (none found in pp.1–18). Then create the organ and powers concepts.
2. Confirm the edition (publisher, date, volume) before any record moves from draft.
3. Add this lane's entries to `scripts/harvest/library/books.yaml` in the lane's own commit, then run `fetch_books.py` for the lane after the workstream commit is on `origin/main`.