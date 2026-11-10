# Library harvest: tafsir/tafsir-baghawi (Ma'alim al-Tanzil)

- Worker: Claude Code (OCR-harvest worker B), claude-opus-5-5, run ocr-harvest-2026-11-04.
- Item used: 20200114_20200114_1523 — Tahdhib Tafsir al-Baghawi, ed. al-Harsh, Dumayriyya and al-Nimr, Dar Tayba, Riyadh, 1st ed. 1430/2009 (PDF pp. 1–7 read).
- Excluded: AAlexandrina-060262 (old printing, OCR largely unreadable); MS.ARA.97 and MS.ARA.98 (manuscript volumes, OCR garbled).

## Entities
- Created: source/tahdhib-tafsir-baghawi-tayba-2009.
- Enriched: work/maalim-al-tanzil (draft card turned into a full record, new ar/en/ur prose); person/al-baghawi-al-husayn-ibn-muhammad (ur label, the name al-Husayn ibn Mas'ud added, birth 433/436 marked debated, student_of al-Qadi Husayn, died_in Marw al-Rudh, new prose section); question/where-was-al-fatiha-revealed (al-Baghawi as a holder of the Meccan view, new section); concept/israiliyyat (new section on the Tahdhib and al-Kashshaf; status left as the original author set it).

## Notes
- The existing record's death year conflict (510 in the encyclopaedia vs 516 in Shadharat) is now supported for 516 by the Tahdhib editors; the data date was already 516.
- The id keeps "ibn-muhammad" (ids are immutable); the label now reads al-Husayn ibn Mas'ud, with both name forms in `names`.

## Second pass (OCR-harvest worker B)
Pages read (Tahdhib, Dar Tayba 2009, PDF): 8–12 (end of al-Fatiha, opening of al-Baqara).
- Enriched: `concept/al-muqattaat` (al-Baghawi's view from al-Sha'bi that the letters are among the ambiguous, with al-Zarkashi's type 7 from `source/burhan-dar-al-hadith-2006` PDF pp. 117–119); al-Baghawi is a holder in `question/what-do-the-opening-letters-of-the-suras-mean`.
