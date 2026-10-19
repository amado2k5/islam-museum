# Lane `lib-exp-modern-muslim-writers`

- **Owner:** library-expansion (Claude)
- **Opened:** 18 Oct 2026, workstream prompt of the founder (see `docs/agents/lanes.md`, "Library expansion lanes")
- **Scope and book list:** see `docs/agents/lanes.md`, section "Library expansion lanes"
- **Branch / stubs:** `content/lib-exp-modern-muslim-writers`; `data/_stubs.d/lib-exp-modern-muslim-writers.yaml`

## Status

| Stage | State |
|---|---|
| 1. Books located (`books.yaml` entries) | Tafsir al-Manar, volumes 1 to 6 on the harvest drive (`books/tafsir/tafsir-manar-v01` to `-v06`); volumes 7 to 12 also present, not in scope yet |
| 2. Downloaded (filename, source URL, size recorded below) | Local copy, volume 1 (406 PDF pages, OCR `book.txt`) |
| 3. OCR (local, drive only) | Volume 1 read; volumes 2 to 6 not yet read |
| 4. Distilled into draft entities | Batch 1 drafted (volume 1, pp. 3 to 34) |
| 5. Verified (`verify_cites.py`) | not run yet for this batch |
| 6. Published in batches of at most 25 | Batch 1: 7 entities created, 1 extended, branch `content/lib-exp-modern-muslim-writers-manar-1-6` |

## Tafsir al-Manar, volumes 1 to 6 (batch 1)

- **Pages covered (volume 1, OCR page markers):** pp. 1 to 2 (title pages), 3 to 8 (editor's foreword), 9 to 26 (Rida's introduction to the tafsir, from Abduh's lessons, method and aims), 31 to 34 (opening of the commentary on al-Fatiha: its Meccan status, names, and the question of the first revelation). Printed page numbers agree with the markers on the pages checked.
- **Entities created (7):** `work/tafsir-al-manar`, `source/tafsir-manar-v01`, `concept/israiliyyat`, `concept/tafsir-bil-raay`, `concept/tawil-quran`, `concept/awwal-ma-nazal-min-al-quran`, `concept/hidayat-al-quran`.
- **Entities extended:** `person/kab-al-ahbar` (source `source/tafsir-manar-v01` added to its `sources` list; no summary sentence from Rida added yet).
- **Reused (not created):** `person/rashid-rida`, `person/muhammad-abduh`, `person/ibn-taymiyya`, `person/ahmad-ibn-hanbal`, `person/al-zamakhshari`, `passage/quran-7-53`.
- **Skipped:** Ka'b al-Ahbar was first created as `person/kaab-al-ahbar`; it already exists as `person/kab-al-ahbar`, so the new file was removed. Dates of the Manar's publication (1317 and 1318 AH) are the book's own claim and carry a flag for a second source.
- **Edition:** the local copy is an OCR of a modern printing (editor Ibrahim Shams al-Din; publisher Dar al-Kutub al-Ilmiyya, Beirut). Its year is not read in the OCR and is not recorded. The edition is not verified.
- **Rules applied:** no Qur'an text typed (passage link only); no honorifics; every entity `status.review: draft` with a provenance block; Rida's views labelled as his; the first-revelation question carries a `perspectives` block with the majority view first.

## Duplicates found and skipped

- `person/kab-al-ahbar` (existing) matches Ka'b al-Ahbar; reused.

## Downloads

None (the books are already on the harvest drive; nothing fetched in this batch).

## Next step

Read volume 1 from p. 35 on (the commentary on al-Baqara's opening) and volumes 2 to 6 in later batches, one `source/tafsir-manar-v0N` record per volume read; find a second source for the 1317 and 1318 AH dates; add a sentence from Rida (vol. 1, p. 14) to the `person/kab-al-ahbar` summary when the person record is next reviewed.
