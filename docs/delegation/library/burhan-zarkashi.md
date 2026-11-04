# Library harvest: quran-sciences/burhan-zarkashi (al-Burhan fi Ulum al-Qur'an)

- Worker: Claude Code (OCR-harvest worker B), claude-opus-5-5, run ocr-harvest-2026-11-04.
- Items used: 20200118_20200118_1147 (Dar al-Hadith, Cairo 1427/2006, ed. Abu al-Fadl al-Dimyati Ahmad ibn Ali; PDF pp. 1–21) — sa71mir_gmail_20160529 is a byte-identical copy; 1767-pdf (MA thesis, Alexandria University, Layla Muhammad Mas'ud Abd al-Mun'im; PDF pp. 1–4, 141–146).
- Not cited: BurhanQuran (Dar al-Turath vol. 3, ed. Muhammad Abu al-Fadl Ibrahim).

## Entities
- Created: source/burhan-dar-al-hadith-2006; source/thaqafat-al-mufassir-zarkashi-alexandria (academic); concept/ulum-al-quran; question/is-al-itqan-an-abridgement-of-al-burhan (Sunni x2, academic); question/does-the-quran-contain-every-science (Sunni x2, academic).
- Enriched: work/al-burhan-fi-ulum-al-quran-zarkashi (draft card turned into a full record with the 47 types, an `influenced` edge to al-Itqan, ar/en/ur prose); person/badr-al-din-al-zarkashi (en/ur labels, born 745, died Sunday 3 Rajab 794, student_of al-Isnawi and Siraj al-Din al-Bulqini, new prose section).

## Notes
- Al-Suyuti's own words from al-Itqan are cited through the thesis that quotes them; al-Itqan itself was not read in this pass.
- The year of the thesis is not on the pages read.

## Second pass (OCR-harvest worker B): the types as concept records
Pages read (Dar al-Hadith 2006, PDF): 28–35 (type 1, occasions of revelation), 50–51 (type 3, verse-endings), 81–82 (type 4, polysemy and parallels), 87–88 (type 5, verbal similarity), 111–112 (type 6, the unnamed).
- Created: `concept/asbab-al-nuzul`, `concept/al-fawasil`, `concept/al-wujuh-wal-nazair`, `concept/mutashabih-al-lafz` (distinct from `concept/muhkam-and-mutashabih`), `concept/al-mubhamat` — each with ar/en/ur prose and `related_to` edges to `concept/ulum-al-quran` and the authors al-Zarkashi names.
- Not reproduced: the verse examples (referred to by sura only, or by passage id where the book names the ayah).
- Next: type 2 (munasaba) to enrich the existing `concept/munasaba`; types 7–9 (openings and closings of suras, Meccan and Medinan).
