# Library hand-off: al-Madkhal ila madhhab al-Imam Ahmad (Ibn Badran, ed. al-Turki)

- Source entity: `source/madkhal-ibn-badran-turki` (edition: 2nd ed., Mu'assasat al-Risala, 1401 AH / 1981).
- Item used: `noor-book-turki` (one scanned PDF, 520 pages, no text layer; all pages read with Apple Vision OCR).
- Page offset: none. The PDF page equals the printed page (checked at pp. 9, 104, 123, 425).
- Harvest workspace (outside git): `~/islam-museum-harvest/books/fiqh/madkhal-mazhab-ahmad/noor-book-turki/`.

## Done (batch 1, pages 7-13, 47, 103-104, 123-128, 411-412, 424-426)
- 16 entities: 1 source, 3 works, 9 people, 1 group, 2 concepts. All `status.review: draft`.
- Facts and pages: `claims/batch1-verified.json` in the harvest workspace (each fact checked against the page text).
- Arabic prose drafted by a local model (qwen3:32b via Ollama) with `scripts/harvest/library/draft_prose.py`, from that table only, then rewritten by hand where it went beyond the facts.

## Not yet done, in order
1. Chapter 1, creed narrated from Ahmad (pp. 49-102): run the shared pipeline `scripts/harvest/library/claims_pipeline.py` (sections, extract, judge, report) on `fiqh/madkhal-mazhab-ahmad/noor-book-turki`, then review the claims by hand.
2. Chapter 3, principles of derivation (pp. 113-122).
3. Chapter 4, rest of the companions (pp. 129-140) and chapter 5, usul (pp. 141-251).
4. Chapter 6, technical terms (pp. 405-422): the glossary of abbreviated names (pp. 410-412) is the best source for further persons.
5. Chapter 7, books (pp. 423-448) and chapter 8, genres (pp. 449-520).

## Open items
- Ahmad's death year (241 AH, taken from the Musnad entry) and every death year taken from this book need a second source.
- Concepts `riwayat-al-imam` and `la-yanbaghi` have Hanbali opinions only. The academic view is still to be added.
- Five quotations in chapter 2 did not match the OCR text exactly; they were not used.
