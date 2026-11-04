# Library harvest: tafsir/tafsir-baydawi (Anwar al-Tanzil)

- Worker: Claude Code (OCR-harvest worker B), claude-opus-5-5, run ocr-harvest-2026-11-04.
- Items used: AAlexandrina-071476 (Leipzig edition by H. O. Fleischer, vol. 1, printer Vogel; preface PDF p. 5, al-Fatiha p. 6, title pages pp. 162–166 — OCR of the Arabic type is rough, only clear clauses used and paraphrased); TafsirBaydawi (Cairo, Dar al-Kutub al-Arabiyya al-Kubra / al-Halabi, part 4 with al-Kazaruni's gloss, 1330 AH; title p. 1, colophon pp. 391–392).
- Not used: AAlexandrina-099932 (older printing, OCR unreadable); AAlexandrina-123574 (a later part of the Leipzig edition).

## Entities
- Created: source/anwar-al-tanzil-fleischer-v1; source/anwar-al-tanzil-halabi-1330-v4; question/is-the-basmala-a-verse-of-al-fatiha (Shafi'i, Maliki, Hanafi, "not yet given" line).
- Enriched: work/anwar-al-tanzil (ur label and summary, authors, genre, three new prose sections, status published); person/al-baydawi-abd-allah-ibn-umar (ur label, full name from the Halabi title page, new prose section); question/where-was-al-fatiha-revealed (al-Baydawi as holder, new section).

## Notes
- The Halabi title page gives the death year 791 AH; this is reported as the title page's statement and not entered in the date record, which keeps the 685/691 debate.
- The year on the Fleischer title page is garbled and is not given. The museum does not identify "H. O. Fleischer" further from these pages.
- person/al-baydawi (a draft card by another agent from al-Manar) probably refers to the same man but was left alone; it may become an alias after a check.

## Duplicate resolved (second run, OCR-harvest worker B)
- `person/al-baydawi` (a one-line draft: Rashid Rida's quotation of "al-Baydawi" on Q. 2:142, Tafsir al-Manar vol. 2 p. 3; the Dar al-Ifta fatwa on naming a mosque links the same id for al-Baydawi "in Anwar al-Tanzil") is the author of Anwar al-Tanzil. Merged into `person/al-baydawi-abd-allah-ibn-umar`: `aliases: [person/al-baydawi]`, the Manar quotation kept as a prose section in ar/en/ur with its citation, the three fatwa links repointed, the duplicate yaml and prose removed.
