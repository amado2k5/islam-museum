# Library lane: Tarikh al-Khulafa — al-Suyuti (caliphal biographies)

**Book:** تاريخ الخلفاء — جلال الدين عبد الرحمن بن أبي بكر السيوطي (ت 911هـ). Chronological caliph biographies Abu Bakr → the author's own day, each entry mixing accession/incidents/deaths of notables.
**Book id:** `tarikh-khulafa` · category `tareekh` · branch `content/lib-futuh-buldan` (same lane branch) · stubs `data/_stubs.d/lib-futuh-buldan.yaml`.

**Edition and item used:** `raw/library/tareekh/tarikh-khulafa/20231228_20231228_2028.pdf` — **الطبعة الثانية المصححة المنقحة، دار المنهاج جدة بالتعاون مع دار الأوقاف للنشرون الإسلامية (قطر)، 1434هـ/2013م، إشراف محمد عثمان نصوح الحسيني، ISBN 978-9953-498-19-5, 864 pp**, based on six manuscripts incl. two in the author's students' hands. Three other scans exist in `raw/library/tareekh/tarikh-khulafa/` (AAlexandrina-033479, -140625, -163451, ~372pp each — likely different printings). OCR via `ocr_apple_vision.py` under miniconda python (system python3 lacks ocrmac) into `books/tareekh/tarikh-khulafa/20231228_20231228_2028/` — done 864 pages in 412s.

**Book structure:** front matter + manuscript plates to ~p64; Suyuti's خطبة الكتاب at p65; a miscellany on the imamate/khilafa hadiths and notes (~pp. 65–92) incl. the twelve-caliphs reports and the Fatimid-lineage anecdotes; then per-caliph entries beginning Abu Bakr (~p93+).

**Plan:** bounded batches by caliph. Extraction emphasis — accession/bay'a events, reign-length and death details, distinctive anecdotes, administrative acts — NOT the hadith corpus (largely covered by seerah/jami lanes). Reuse existing caliph entities (`person/abu-bakr`, `person/umar-ibn-al-khattab`, …) and enrich; create `event` entities for accessions/deaths where missing. Citations to printed page numbers (printed = PDF page, verify).

**Flags:** the edition prints honorifics — never typed into entities. Suyuti compiles from Bukhari/Muslim/Tabari/Ibn al-Athir — reuse existing entities aggressively.

## Done

- (12 Oct 2026) Lane opened; edition identified; OCR complete (864 pp, 412s); `source/tarikh-khulafa-minhaj-1434`, `work/tarikh-al-khulafa`, `person/al-suyuti` created.
