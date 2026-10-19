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

## Batch 2: first batch for the other three books (draft, branch `lib-exp-medicine-science-batch1`, 18 Oct 2026)

- **Pages covered (OCR markers):**
  - al-Razi, *al-Hawi*, vol. 1 (Dar al-Kutub al-Ilmiyya, Beirut): pp.1, 5 (title block, contents of the three parts, start of Juz 1). The volume is 3,945 scan pages; only the front matter was read.
  - Ibn al-Nafis, *Sharh Tashrih al-Qanun*: pp.1 (preface), 7, 9, 15 (headings), 35 (heading and neck vertebrae). The text has 202 pages.
  - al-Biruni, *al-Athar al-Baqiya*: pp.2 (cataloguing page), 3 (opening), 4 (purpose). The 2008 Cairo printing has 448 scan pages; pp.3 and 4 are read.
  - al-Tusi, *Tahrir al-Majisti*: pp.1, 3 (colophon), 4 and 5 (cataloguing). The scan is a British Library manuscript (Add MS 23392), not a printed edition.
- **Entities created (all `status.review: draft`):**
  - `work/al-hawi-fi-al-tibb` (author `person/al-razi-abu-bakr`, existing)
  - `work/sharh-tashrih-al-qanun` (author `person/ibn-al-nafis`, existing)
  - `work/tahrir-al-majisti` (author `person/nasir-al-din-al-tusi`, existing; distinct from `work/al-majisti`, Ptolemy's text)
  - `concept/anatomy` (new; `part_of` `concept/medicine`)
  - Sources: `source/hawi-razi-dar-kutub-ilmiyya`, `source/sharh-tashrih-qanun-print`, `source/athar-baqiya-thaqafa-2008`, `source/tahrir-majisti-bl-add-23392`. Each carries a `reliability_note` that says the edition is not verified (for the Tusi copy: that it is a manuscript and that 956 AH is a copy date).
- **Skipped and why:**
  - `work/al-athar-al-baqiya` already exists (Kashf al-Zunun citation). Not duplicated. The new source `source/athar-baqiya-thaqafa-2008` is not yet linked from it; to be added in a later batch as an append to that record.
  - Al-Razi's death year (printed as 313 in the title block) is not entered: the OCR is unclear and no second source has been checked. Work records carry no dates.
  - No dedication verse is typed; the Qur'an verse at Biruni p.3 is left to `[[passage/...]]` linking in a later batch.
  - The heart, arteries and diaphragm sections (flagged on Nafis p.7) are not read yet; they are the next Nafis batch.
- **Schema or enum needs:** none. `based_on` cannot start from a work (predicate domain), so the Tahrir–Almagest link is in prose only.

## Batch 2 (draft, branch `lib-exp-medicine-science/manazir-maalim-zij-batch-1`)

- **Pages covered (scan markers):**
  - *Kitab al-Manazir*, vol. 1 (Books 1–3, Kuwait 1983, ed. Sabra): pp.1–13 (title, editor's preface, contents). The text of Book 1 itself is not yet read.
  - *al-Zij al-Sabi* (al-Battani, Byblion 2005, ed. Nallino): pp.1–7 (title pages, contents, opening of the chapter list).
- **Entities created (all `status.review: draft`):**
  - `work/kitab-al-manazir`, `person/ibn-al-haytham` (the editor places him in the 5th century AH; no birth or death date in the pages read), `concept/optics`, `source/manazir-sabra-1983`
  - `work/al-zij-al-sabi` (author linked to the existing `person/al-battani`; the existing record is not edited), `concept/astronomy`, `source/zij-sabi-nallino-byblion`
- **Skipped and why:** the al-Battani person record already exists and is not changed in this batch. The Zij's author name varies across the title pages and is noted in the source's reliability note. Ibn al-Haytham's other names (kunya, nisba) are not printed in the pages read, so none are entered. No Qur'an text or honorifics typed.
- **Schema or enum needs:** none.
- **Edition notes:** the Manazir copy is volume 1 only (Books 1–3); the Zij copy's original Nallino edition is not confirmed from this reprint.

## Next step

0. Manazir: read Book 1 of the text (after the contents, scan p.13 on), and the Zij chapter bodies (scan pp.5–7 onward); add entities only where `data/` has none. Canon line below remains open.
1. Canon (Ibn Sina): read the OCR pages 19–68 (Ta'lim 5 organs and the rest of Ta'lim 6), and find the front matter if the OCR has it under another page (none found in pp.1–18). Then create the organ and powers concepts.
2. Confirm the edition (publisher, date, volume) before any record moves from draft.
3. Add this lane's entries to `scripts/harvest/library/books.yaml` in the lane's own commit, then run `fetch_books.py` for the lane after the workstream commit is on `origin/main`.