# Library lane: Kitab al-Jabr wal-Muqabala — Muhammad ibn Musa al-Khwarizmi

**Book id:** `khwarizmi-algebra` · category `medicine-science` · worker J of the ocr-harvest run (4 Nov 2026), branch `harvest/claude-ocr-J`, commit prefix `content(lib-khwarizmi-algebra)`.

## Items

| item | edition | md5 of book.txt | used as |
|---|---|---|---|
| `20241227_20241227_1503` | Cairo 1939, ed. Ali Mustafa Mosharafa and Muhammad Mursi Ahmad, Faculty of Science of the Egyptian University no. 2; Columbia University scan, 130 pp. | 3071449aca9b658280673ddda2865eef | `source/khwarizmi-jabr-cairo-1939` (existing record, extended) |
| `ar120vieux197` | London 1831 (Arabic title page: 1830), ed. Friedrich Rosen, Arabic part only; UC Berkeley scan, 124 pp., pages in reverse order | 2e879f88c2454f9ab2dc1896bbfc79a3 | `source/khwarizmi-jabr-rosen-1831` (new) |

Distinct editions, not duplicates.

**Page offset (Cairo):** printed = scan − 12 for scan pp. 13–26; a facsimile plate (scan p. 28) and a blank leaf are inserted, so printed = scan − 14 from scan p. 29 (scan p. 30 = printed 16; scan p. 122 = printed 106). All citations use scan pages. **Rosen:** scan runs backwards; Arabic title page scan p. 121, end of text scan p. 2.

## Sections covered (Cairo scan pages)

- Preface of the editors pp. 11–12; "algebra before al-Khwarizmi" pp. 13–21; "al-Khwarizmi and his book" pp. 22–26.
- Text: preface pp. 29–30; six types pp. 30–35; geometric proofs pp. 35–43; multiplication pp. 43–46; addition/subtraction pp. 46–50; six problems pp. 50–54; miscellaneous problems pp. 54–69 (sampled); transactions pp. 69–70; mensuration pp. 70–82; Book of Bequests pp. 83–122 (chapter heads and the marriage, manumission, acknowledgement and salam problems read; the long bequest computations pp. 84–107 sampled only). Colophon p. 122 (19 Muharram 743 AH, Cairo). Publications list p. 126.

## Batch 1 (this commit)

Enriched: `source/khwarizmi-jabr-cairo-1939` (offset, colophon, published), `work/al-jabr-wal-muqabala` (full rewrite, structure, editions, translations), `concept/algebra` (rewrite incl. the editors' pre-history of algebra), `person/al-khwarizmi` (new section from the editors' biography; patronage edge to al-Ma'mun), `person/sanad-ibn-ali` (Suter's attribution question), `person/abu-kamil-shuja-ibn-aslam` (first prose).
New: `source/khwarizmi-jabr-rosen-1831`, `concept/al-durub-al-sitta`, `concept/hisab-al-dawr`, `concept/ilm-al-misaha`, `concept/rule-of-three-muamalat`, `work/kitab-al-hisab-al-khwarizmi`, `work/zij-al-sindhind-khwarizmi`, `work/surat-al-ard-khwarizmi`, `person/ali-mustafa-musharrafa`, `person/muhammad-mursi-ahmad`.

Doubts recorded in prose: the editors' identification of al-Khwarizmi with Muhammad, eldest of the Banu Musa, is given as their own inference; the three non-algebra works are described only from the editors' introduction (texts not read). The Ibn Khaldun quotation calls him "Abd Allah al-Khwarizmi" in the OCR (p. 25); not used as a name variant.

Excluded: the OCR of the manuscript facsimile pages (scan pp. 9, 28) is garbled and was not used; inline modern equations in the editors' notes are garbled in OCR and were not transcribed. Not created (too little in the book): Friedrich Rosen, Robert of Chester, Karpinski, Marre, Sinan ibn al-Fath, Abd Allah ibn al-Hasan (named in prose without links).

## Next step

Nothing essential left; a later pass could mine the bequest computations (pp. 84–107) for a dedicated entity on *al-wasiyya bil-dirham* / *al-takmila*.
