# Lane `lib-tafsir-shawkani`: Fath al-Qadir (Muhammad ibn Ali al-Shawkani, d. 1250 AH)

**Book id:** `tafsir-shawkani` · **Work:** `work/fath-al-qadir` · **Sources:** `source/fath-al-qadir-dar-al-marifa`, `source/fath-al-qadir-dar-al-wafa-v1` · **Author:** `person/al-shawkani` · **Stubs:** `data/_stubs.d/claude-ocr-harvest-b.yaml` · **Worker:** Claude Code (OCR-harvest worker B), run `ocr-harvest-2026-11-04`

## Items and editions
- `20241226_20241226_1104` (1,673 PDF pages): Dar al-Ma'rifa, Beirut, one volume, ed. Yusuf al-Ghush, 4th ed. 1428/2007, ISBN 9953-420-75-0. **Used** (`source/fath-al-qadir-dar-al-marifa`). Printed page = PDF + 1. PDF pp. 7 and 9 blank in the text layer.
- `20200114_20200114_1500` and `elshandawily14838`: byte-identical to each other (md5 `e8a7862512c5…`); another scan of the same Dar al-Ma'rifa edition with an extra title leaf and the index (1,704 pp.; PDF = above + 1). Used only to confirm.
- `tafssir-chokani` (871 pp.): Dar al-Wafa' edition, vol. 1, ed. Dr Abd al-Rahman Umayra with the Dar al-Wafa' research committee. **Used** for the editor's introduction (`source/fath-al-qadir-dar-al-wafa-v1`); printed = PDF in the introduction; year not legible.

## Batch 1 (this commit)
Pages read: Ma'rifa PDF 1–12 (title, biography, sources list, chain, author's preface, al-Fatiha opening), 522, 552–553 (al-Tawba opening), 1370, 1672 (end note); Wafa' PDF 1, 5–64 selectively (pp. 26–27 judgeship and death, 33, 43 manuscripts, 49–50 method and creed, 61–62 editor's work).
- Created: `source/fath-al-qadir-dar-al-marifa`, `source/fath-al-qadir-dar-al-wafa-v1`, `question/where-was-al-fatiha-revealed` (with Tantawi), stub file with 5 teachers of al-Shawkani + `work/al-durr-al-manthur`.
- Enriched: `work/fath-al-qadir` (draft card → full record + ar/en/ur prose); `person/al-shawkani` (thin card → full biography in ar/en/ur, Hijri dates, teachers, students, judgeship, works; traditions sunni + shia-zaydi with basis); `passage/quran-1`, `passage/quran-9` (Shawkani sections); `question/why-no-basmala-in-surat-al-tawba` (Shawkani's list and the gradings he reports from al-Tirmidhi and al-Hakim, beside Ahmad Shakir's weakening quoted by Tantawi).
- Doubts: birth year — al-A'lam card said 1759, the edition's 1173 AH converts to 1760 (recorded with both sources). The middle imam under whom he served is printed garbled («المتوكل على بن أحمد بن المنصور»); written only as "al-Mutawakkil (d. 1231)". The ISBN on the other scan's back cover reads 9963-…, an OCR or print variant.

## Next
Shawkani's sura openings carry rich makki/madani report lists (e.g. PDF 608 Yunus, 718, 951, 1112, 1370 Muhammad) — good material for sura prose and `concept/makki-wa-madani`; teachers' stubs could be written from al-Badr al-Tali'.
