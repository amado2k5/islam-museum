# Library harvest: tafsir/tafsir-tabari-shakir (Jami' al-Bayan, Ahmad and Mahmud Shakir's edition)

- Worker: Claude Code (OCR-harvest worker B, tabari run), claude-opus-5-5, run ocr-harvest-2026-11-04.
- Items used: the 16 volumes waqtaftab-taftab01 to 16 (archive.org waqtaftab; 627 to 689 PDF pages each; Apple Vision OCR on the Mac, finished 17:59 on 4 Nov 2026).
- Edition: Tafsir al-Tabari, Jami' al-Bayan 'an Ta'wil Ay al-Qur'an, ed. Ahmad Muhammad Shakir and Mahmud Muhammad Shakir, Maktabat Ibn Taymiyya, Cairo; "second edition" stated on the title page of vol. 1. The printing year is not read on the pages used.

## Entities
- Created: source/tafsir-tabari-shakir-v01 to v16 (one record per volume, with ar/en/ur labels and summaries).
- Enriched: work/jami-al-bayan (new section on the edition, ar/en/ur; the volume sources added to its `sources`).

## Notes
- Vol. 1 title page and text (PDF pp. 1, 3): the editors, the publisher, the second edition, and the statement that the text was read to al-Tabari in 306 AH.
- Vol. 16 title page (PDF p. 1): the sixteenth volume.
- Not done yet: the body of the commentary, verse by verse. The volumes have been OCR'd (book.txt and pages.json on the harvest drive) but not read beyond their title pages. The next pass should start with the introduction of vol. 1 and then the chapters on the readings, the ahruf and the sources for the work's method.
- Printed page offsets are not established; citations are PDF pages.

## Introduction of vol. 1 (second pass)
- Read: PDF pp. 4–6 (praise, the author's aim); the volume's index on PDF pp. 618–621 (the chapters of the introduction, with the author's own summary of the seven ahruf).
- Added to work/jami-al-bayan in ar/en/ur: the section "The introduction in the first volume".
- Not yet read: the chapters themselves (PDF pp. 7–617).

## Readings in vol. 1 (locations, third pass)
- Correction: vol. 1 of this edition is 627 PDF pages. The PDF pp. 1364–1382 noted earlier belong to the Babakr thesis, not to this edition.
- The volume's index (PDF pp. 618–621) lists the commentary passages where al-Tabari discusses the readers' disagreements, by printed page: printed p. 148 and 152 (the reading of "malik" in al-Fatiha), 182 (reading "ghayr al-maghdub" with a nasb vowel, which he disliked), 282 (reading "bima kanu yakdhibun"), 524 (reading "fa-azallahuma"). Printed-to-PDF offset not yet established.
- Next: open the printed p. 148 and 152 passages (find the PDF page by the printed number once the offset is set) and write the readings record from them.

## Page offset and the readings at printed p. 148 (fourth pass)
- Offset for vol. 1 is zero: the printed page numbers match the PDF pages (printed 22 on PDF 22, 49 on 49, 148 on 148). The index's page numbers can be read as PDF pages.
- PDF p. 148: al-Tabari says the readers differ on "malik" in al-Fatiha 4 (three readings, with and without the alif, and the kasra or fatha on the kaf). He says he has set out the transmitted readings and his preferred reading in his separate book on the readings, and that this commentary is about the meanings, not the readings. No preference is stated here.
- Next: PDF p. 152 (the rejected reading with fatha on the kaf) and p. 182 (the reading of "ghayr" with fatha, which he disliked). Then write concept/qiraat from them.

## Next steps
1. Read vol. 1 introduction (PDF pp. 3–60): al-Tabari's method, the ahruf, the merit of tafsir (for concept/al-ahruf-al-sabaa, concept/tafsir-bil-mathur).
2. Map the places in vol. 1–16 where al-Tabari gives his own preference among the readings (for question/did-al-tabari-reject-established-readings).
3. Excluded so far: none.
