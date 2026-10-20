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

## Batch 3: Canon print volumes 1 to 3 (draft, branch `worktree-agent-af5112308d410cab4`, 19 Oct 2026)

- **Pages covered (scan markers):**
  - Vol. 1 (741 scan pages): pp.1–2 (title page, verso), 3–4 (editor's introduction, read for edition only), 9–10 (author's preface and the plan of the five books), 11–35 (Book I, Fann 1 Ta'lim 1–5), 94–95 (Fann 1 Ta'lim 6 opening), 103–104 (Fann 2 Ta'lim 1), 112 (Ta'lim 2), 154 (Fann 2 Ta'lim 3 opening), 200 and 203 (Fann 3), 221 (Fann 3 Ta'lim 2 opening), 267 (Fann 4), 311 and 313 (end of Book I, start of Book II), 728 (end of Book II). Headings were checked with a scan-by-scan search.
  - Vol. 2 (864 scan pages): pp.1–2 (title page, verso), 3 (start of Book III), 6 (Fann 1), 841 (start of a contents list).
  - Vol. 3 (590 scan pages): pp.1–2 (title page, verso), 3 (start of Book IV), 4–5 (preface and Fann 1), 393 (end of Book IV), 395 (start of Book V), 588–590 (last scanned pages).
- **Structure recorded** on the existing `work/al-qanun-fi-al-tibb` (the five books, fanns and page ranges). Batch 1 had wrong page numbers for the fanns and Book II, which pointed to the editor's introduction and to Book I. These are corrected in this batch.
- **Entities created (all `status.review: draft`, provenance with `run: lib-exp-medicine-science-canon-batch-2`):**
  - Sources: `source/canon-ibn-sina-print-v1`, `source/canon-ibn-sina-print-v2`, `source/canon-ibn-sina-print-v3` (edition from each title page: Dar al-Kutub al-Ilmiyya, Beirut, 1st ed. 1420 AH / 1999 CE, notes by Muhammad Amin al-Dannawi; the date rests on one source and is flagged).
  - Concepts (Book I subjects, none existed before, checked by `ls data/concept`): `concept/health`, `concept/disease`, `concept/symptoms-and-signs`, `concept/powers-and-actions`, `concept/regimen-of-health`, `concept/medical-treatment`. Each has `relations: part_of concept/medicine`. No content md for these six; the data summary carries the text, as with the other concepts of this lane.
- **Corrected existing records (reuse, not recreated):** `work/al-qanun-fi-al-tibb` (data and md), `concept/medicine` (data and md), `concept/four-elements`, `concept/temperament`, `concept/humours`. Their citations pointed to scan pages 2 to 13, which are the editor's introduction and the Book I preface. They now point to the Book I pages where the text is (13, 14, 15, 17, 19, 28, 30, 33, 35). `concept/medicine` also had the definition attributed to `sunni-hanafi`; the definition is Ibn Sina's own, so the tradition is now `academic`.
- **Skipped and why:**
  - Ibn Sina's death year: the title page of each volume reads 428 AH (scan p.1). It is not written in any record here: the person record `person/ibn-sina` already holds its own sourced date, and this batch does not add one.
  - The Book I ta'lim 5 (organs, p.36) and the rest of Book I (fanns 2 to 4): read only at heading level. Organs are already covered by `concept/anatomy` (Nafis lane); not duplicated.
  - Book III's end is not located: the text is followed by a contents list from scan p.841. Book V ends at scan p.590 in vol. 3 and its close is not in the scan.
  - The old source `source/canon-ibn-sina-print` (edition unverified, 1,161-page copy from the earlier batch) is not used by any record in this batch and is left as it is. `content/en/work/al-qanun-fi-al-tibb.md` and `content/en/concept/medicine.md` still cite it with the old pages. They are outside this lane's Arabic scope and are not edited here; `content/ur/` is not touched (no-go registry).
  - The ISBN printed on the verso of each volume (2-7451-2617-2) is the same on all three; it is not entered.
- **Schema or enum needs:** none. New class, predicate or enum: none.
- **Flags for the founder:** the three volumes give the edition, but not a catalogue check. The publisher series name in the OCR is partly garbled and is noted in the source records.

## Next step

0. Manazir: read Book 1 of the text (after the contents, scan p.13 on), and the Zij chapter bodies (scan pp.5–7 onward); add entities only where `data/` has none.
1. Canon (Ibn Sina): read Book I, Fann 1 Ta'lim 5 (organs, scan p.36 on) and Fann 2 to 4 in the text (pages not yet read beyond headings), then add only concepts `data/` does not have. Book II (simple drugs from scan p.313) is the next book; its entities need a separate batch.
2. Confirm the edition against a catalogue record or a second copy before any record moves from draft.
3. Add this lane's entries to `scripts/harvest/library/books.yaml` in the lane's own commit, then run `fetch_books.py` for the lane after the workstream commit is on `origin/main`.