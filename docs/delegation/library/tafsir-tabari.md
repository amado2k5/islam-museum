# Library harvest: tafsir/tafsir-tabari (Jami' al-Bayan)

- Worker: Claude Code (OCR-harvest worker B), claude-opus-5-5, run ocr-harvest-2026-11-04.
- Item used: alfirdwsiy2018_gmail_0001 — doctoral thesis "al-Qira'at 'inda Abi Ja'far al-Tabari fi Daw' al-Lugha wa'l-Nahw", Ahmad Khalid Babakr, Umm al-Qura University, 1402–1403/1982–83, supervisor Abd al-Aziz Burham (PDF pp. 1, 3, 7–8, 1443–1445). alfirdwsiy2018_gmail_0017 is a byte-identical copy.
- Not used: k-514_20240822 (al-Kamil fi Taqrib Jami' al-Bayan, an abridgement without chains; broken text layer). No copy of Jami' al-Bayan itself is in this harvest folder.

## Entities
- Created: source/qiraat-inda-al-tabari-thesis-umm-al-qura (academic).
- Enriched: work/jami-al-bayan (ur label, new section on readings, language and grammar; status left as the original author set it); person/al-tabari (new section).

## Notes
- The thesis's count of places of disagreement among the readers is unclear in the OCR and is not given.
- The thesis's view that al-Tabari belonged to the "Baghdad trend" in grammar is given as its own conclusion; no question card was made because the pages read give only one voice.

## Second pass (deep), OCR-harvest worker B
Pages read in the thesis (PDF): 26–36 (journeys, teachers, students, works), 46–57 (al-Tabari's sources and chains; his influence on later exegetes, readers and grammarians), 74–93 (the seven ahruf, al-Tabari's view, typology of views, the thesis's preference; definition and transmission of the readings), 1364–1382 (Part Four: al-Tabari's stance on the readings, 854 places, his three criteria), 1446–1502 (indexes and table of contents). Offsets: PDF = typescript + 13 in Part One, + 18 in Part Four.

### Batch 2a
- Work: `work/jami-al-bayan` turned from a draft card into a full record (authors, genre, structure, 18 typed relations, published) with four new ar/en/ur sections (sources and chains; language and grammar sources; readings; influence).
- Created: `question/did-al-tabari-reject-established-readings` (al-Tabari, Ibn al-Jazari, Babakr); persons `atiyya-al-awfi`, `al-abbas-ibn-al-walid-al-bayruti` (not the Umayyad commander `al-abbas-ibn-al-walid`), `ahmad-ibn-yusuf-al-taghlibi`.
- Enriched: `concept/al-ahruf-al-sabaa` (published; al-Tabari's view, the kinds of views, the thesis's preference, and Ibn Atiyya's chapter from `source/muharrar-wajiz-dar-ibn-hazm` PDF pp. 21–24), `concept/qiraat`, `person/al-tabari` (teachers and students; 10 `student_of` edges), `person/ibn-mujahid` and `person/ahmad-ibn-kamil` (`student_of` al-Tabari), `person/yunus-ibn-abd-al-ala`; the source record's notes.
- Doubts kept out: the thesis's footnote on Muqatil mixes Muqatil ibn Sulayman with Muqatil ibn Hayyan (not linked); "al-Hasan ibn Dawud al-Massisi" kept as the thesis has it; Abu Ubayd's death "214" in a footnote (OCR) not used.

### Batch 2b
- Enriched with a section on their place in Jami' al-Bayan (chains, counts, footnote biographies; PDF pp. 47–52, 90): `person/mujahid-ibn-jabr`, `al-dahhak-ibn-muzahim`, `ata-ibn-abi-rabah`, `ibn-jurayj`, `qatada-ibn-diama`, `hushaym-ibn-bashir`, `yazid-ibn-harun-al-wasiti`, `al-farra`, `al-akhfash-al-awsat-said`, `ibn-qutayba`, `al-kisai`, `abdullah-ibn-abbas`; `person/al-rabi-ibn-anas` turned from a draft card into a published record (death 139, two `student_of` edges, ar/en/ur prose).
- Conflicts noted, not resolved: al-Dahhak's death 105 (thesis) vs 102 (Ibn Qutayba); Qatada's death "110" in an OCR'd footnote vs 117/118 (Tadhkira) — not used.
- Not done: al-Suddi (the thesis's chapter on sources does not name him); Muqatil (footnote conflation).
