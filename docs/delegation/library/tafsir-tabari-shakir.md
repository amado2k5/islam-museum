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

## PDF pp. 152 and 182 (fifth pass)
- PDF p. 152: mostly interpretation. al-Tabari argues against reading "rabb al-alamin" and "malik yawm al-din" as only about this world, or only about the next, and against taking "malik yawm al-din" to mean the one who holds the power to establish the Day. The reading rejected at this place (fatha on the kaf) is named in the index; its argument is not yet read on this page.
- PDF p. 182: on "ghayr al-maghdub" he argues that the phrase is parsed as qualifying the people of al-Fatiha 7 and that the Qur'an's own description of them makes it impossible that they are both pleased with and angry at the same time. Grammatical and reading points follow on this page.
- Still to read: the rest of p. 152 (the rejected reading) and p. 182 (the reading and its grounds), then the readings concept.

## PDF p. 152, the fatha reading of "malik" (sixth pass)
- On p. 152 al-Tabari explains the reading with fatha on the kaf ("malika yawm al-din") as a vocative, "O owner of the Day", and gives grammatical grounds (Yusuf 29, and an old Arabic verse of a poet from the tribe of Asad, with a note on its source).
- The index lists this reading among those he rejects. The rejection is not on p. 152 as read; it should be on the following page, to be checked.
- Next: the page after 152 for the rejection, then p. 182 for the reading of "ghayr".

## Next steps
1. Read vol. 1 introduction (PDF pp. 3–60): al-Tabari's method, the ahruf, the merit of tafsir (for concept/al-ahruf-al-sabaa, concept/tafsir-bil-mathur).
2. Map the places in vol. 1–16 where al-Tabari gives his own preference among the readings (for question/did-al-tabari-reject-established-readings).
3. Excluded so far: none.

- Page markers: in `book.txt` the `[pNNN]` markers run two ahead of the printed page numbers from marker p367 onward (marker p371 is printed p. 369); cite the printed numbers.

- Volume 2 (`waqtaftab-taftab02`, 615 markers): the offset is zero. Marker numbers equal the printed page numbers (checked at markers 10, 50, 100, 300, 400, 580, 600). Printed p. 7 holds the start of the commentary on 2:44. Cite as `{cite:tafsir-tabari-shakir-v02 p. N}` with printed numbers.

## Lead: perspectives block for passage/quran-2-81 (sin and the unbeliever)
- The page presents al-Tabari's reading (v02 pp. 282-283) that the "evil" of 2:81 is associating partners, not major sins, labelled as his reading. A second Sunni voice exists in the harvest copy of Ibn Kathir (`books/tafsir/tafsir-ibn-kathir/AAlexandrina-024188`, printed p. 119): he reports that Ibn Abbas, Abu Wa'il, Abu al-'Aliya, Mujahid, 'Ikrima, al-Hasan, Qatada and al-Rabi' ibn Anas take it as shirk, that al-Hasan and al-Suddi also say "a major sin", and that Mujahid, al-Hasan, Qatada and others read "his sin has encompassed him" as the major sin that makes the Fire due; he concludes that all these statements are close in meaning.
- Not yet used: `data/source/tafsir-ibn-kathir.yaml` records a different edition (Dar al-Andalus), so its page cannot be cited until the edition is registered or confirmed. Next: register the Alexandria edition as a source, then add the `perspectives` entries (Sunni: al-Tabari, Ibn Kathir; academic and other views still to be added from sources, none asserted from memory).
- Volume 3 (`waqtaftab-taftab03`, 635 markers): the offset is zero. Marker numbers equal the printed page numbers (checked at markers 10, 100, 300, 450, 580, 600). Printed p. 7 holds the start of the commentary on 2:124; the volume ends with the commentary near 2:195 and "the fourth part begins" at about p. 598. Cite as `{cite:tafsir-tabari-shakir-v03 p. N}` with printed numbers.

## Page-header audit, volumes 2 and 3 (5 November 2026)
Method: the printed number in the first lines of every scanned page in `pages.json` was compared with the marker (scan page) number, for all 615 pages of volume 2 and all 635 of volume 3.

| Volume | Marker range | Printed numbers | Finding |
|---|---|---|---|
| 3 | 1-7 | none | front matter, no printed number |
| 3 | 8-278 | equal to the marker | offset zero |
| 3 | 279, 280, 281, 282 | 281, 282, 279, 280 | out of order: printed pp. 279-280 sit at markers 281-282, printed pp. 281-282 at markers 279-280 |
| 3 | 283-595 | equal to the marker | offset zero |
| 3 | 596 on | none or index | end matter and index |
| 2 | 1-600 | equal to the marker | offset zero; no out-of-order or duplicated pages |
| 2 | 601 on | index pages | not commentary |

Other differences in the raw comparison are single-digit OCR misreads of the header number (for example marker 225 read as 220, 295 as 290, 36 as 31); the neighbouring pages are consistent, so these are not swaps. Citations use the printed number. The only repair needed is the pair of swapped stretches at volume 3 markers 279-282. Citations in the museum so far: the passage 2:165 text (printed pp. 279-286) was read from the correct pages, and earlier pull requests (#3730-#3788) cite no page in 279-282 from a marker, so no citation needed correcting; the note wrongly claiming missing pages in 2:164 was removed in #3787.

## Volume 3 end and volume 4 offset (5 November 2026)
- Volume 3 (`waqtaftab-taftab03`): the commentary ends on printed p. 595 with the end of 2:195; the page after it (marker 596) reads "the third part is finished; the fourth begins with the commentary on 'and complete the hajj and the umra for God'" (2:196). Markers 597 on are the indexes. The whole commentary text of volume 3 (2:124 to 2:195) has been read and cited by printed page.
- Volume 4 (`waqtaftab-taftab04`, 639 markers): the offset is zero. Marker numbers equal the printed page numbers (checked at markers 10, 51, 101, 201, 301, 401, 596-600). Markers 1-6 are front matter (title page, the contents line "verses 196-230, reports 3185-4908", and a preface); printed p. 7 holds the start of the commentary on 2:196; the commentary runs to printed p. 600 (end of 2:230) and the indexes begin at marker 601.
- Audit of the printed header against the marker for volume 4: 25 differences, all of the single-digit OCR-misread kind (for example marker 105 read as 205, 223 as 333, 351 as 201, 599 as 569); neighbouring pages are consistent and no out-of-order or duplicated pages were found. About 67 pages carry no readable header number in the first lines; their number is the marker. Cite as `{cite:tafsir-tabari-shakir-v04 p. N}` with printed numbers.

## Volume 4 end and volume 5 (5 November 2026)
- Volume 4 (`waqtaftab-taftab04`) is now read and cited to its end: the commentary on 2:230 closes on printed p. 600 (markers 601 on are the indexes), and the last page states that volume 5 begins with the commentary on the verse about divorced women who reach the end of their term (2:231). Passages 2:196 to 2:230 carry `{cite:tafsir-tabari-shakir-v04 p. N}` citations by printed page.
- Volume 5 (`waqtaftab-taftab05`, 648 markers): the offset is zero. Marker numbers equal the printed page numbers (headers compared for all markers, 5 November 2026: 534 equal, 52 differ by an OCR misread, 62 have no readable header). Markers 1-6 are front matter (title page, the contents line "verses 231-274, reports 4909-6234", and a preface); printed p. 7 holds the start of the commentary on 2:231; the commentary ends on printed p. 602 (2:274) and marker 603 reads "the fifth part is finished; the sixth begins with the commentary on the verse on those who consume usury" (2:275). Markers 604 on are indexes.
- Misread headers (single-digit OCR errors, neighbours consistent): markers 26 (read 29), 55 (50), 75 (70), 100 (10), 130 (120), 235 (230), 254 (204), 255 (200), 293 (292), 307 (207), 311 (211), 312 (212), 335 (235), 345 (245), 365 (360), 387 (287), 391 (39), 449 (49), 491 (461), 501 (1), 503 (502), 508 (58), 512 (12), 513 (13), 521 (21), 523 (23), 524 (24), 525 (20), 529 (5029), 538 (38), 540 (140), 545 (4), 547 (47), 551 (1), 552 (52), 553 (53), 554 (4), 561 (61), 565 (60), 580 (58), 585 (5), 589 (89), 593 (93), 599 (596).
- Out of order or duplicated stretch in volume 5 (not an OCR misread): markers 423 and 424 repeat the text of markers 421 and 422 (printed pp. 421-422), and markers 425 and 426 carry printed pp. 427-428, which markers 427 and 428 carry again. So printed pp. 423-426 (about 2:256 to 2:257) are not in this scan, and pp. 421-422 and 427-428 appear twice. Do not cite pages 423-426 from this copy; read around them and state the gap.
- Cite as `{cite:tafsir-tabari-shakir-v05 p. N}` with printed numbers. Passages 2:231 onward are read from volume 5.
