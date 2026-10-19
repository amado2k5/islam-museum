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

## Canon print volumes (user-supplied, 18 Oct 2026)

- Volume 1: https://archive.org/details/alqanun-iiibn-sina1 (raw/library/medicine-science/canon-ibn-sina-print-v1/)
- Volume 2: https://archive.org/details/alqanun-iiibn-sina2 (raw/library/medicine-science/canon-ibn-sina-print-v2/)
- Volume 3: https://archive.org/details/alqanun-iiibn-sina3 (raw/library/medicine-science/canon-ibn-sina-print-v3/)
- Queued for OCR after the current items. The front matter and the five-book division are expected in these volumes; the earlier 1,161-page OCR has none. Edition details come from the printed title pages.
- Source for future downloads: https://www.al-mostafa.com/ (requested by the founder). Not yet checked for licence or terms; not added to any fetch step.

## Batch 1b: al-Khwarizmi, al-Kitab al-mukhtasar fi hisab al-jabr wal-muqabala (draft, 18 Oct 2026)

- **Copy:** `unidentified/columbia-aco000196` (Columbia scan, 130 pages, Apple Vision OCR; not in git). The OCR is partly garbled but the title page and the editors' introduction are readable, so the copy was not treated as empty.
- **Edition found:** Cairo, 1939, edited by Ali Mustafa Mosharafa and Muhammad Morsi Ahmad (Faculty of Science, Egyptian University; the preface is dated 1937 in the OCR). The printed title is "kitab al-jabr wal-muqabala"; the longer title in the brief is not confirmed by the OCR.
- **Pages covered (scan markers):** pp.1, 2, 7, 8–9 (partly), 11–12 (editors' introduction). p.13 begins a historical section ("Algebra before al-Khwarizmi") and is not yet read.
- **Entities created (all `status.review: draft`):**
  - `work/al-jabr-wal-muqabala` (book; author `person/al-khwarizmi`, existing record, which keeps the sourced dates; no death year written here)
  - `concept/algebra` (scientific; new)
  - `source/khwarizmi-jabr-cairo-1939` (primary; edition not verified)
  - `content/ar/work/al-jabr-wal-muqabala.md`, `content/ar/concept/algebra.md`
- **Flags:** the editors say their base manuscript was a copy made about five hundred years after the author's death, with copying errors (scan pp.11–12). The text is treated as a late copy, not an autograph.
- **Skipped and why:**
  - Death year of al-Khwarizmi: not in the book, left empty on the work.
  - `person/al-khwarizmi` already exists; not recreated.
- **Next step:** read the mathematics (chapters after p.13) to check statements of method before any claim about content beyond the editors' introduction. Confirm the edition against a second print.

## Next step

1. Read the OCR pages 19–68 (Ta'lim 5 organs and the rest of Ta'lim 6), and find the front matter if the OCR has it under another page (none found in pp.1–18). Then create the organ and powers concepts.
2. Confirm the edition (publisher, date, volume) before any record moves from draft.
3. Add this lane's entries to `scripts/harvest/library/books.yaml` in the lane's own commit, then run `fetch_books.py` for the lane after the workstream commit is on `origin/main`.