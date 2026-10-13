# Library lane: Tarikh al-Khulafa — al-Suyuti (caliphal biographies)

**Book:** تاريخ الخلفاء — جلال الدين عبد الرحمن بن أبي بكر السيوطي (ت 911هـ). Chronological caliph biographies Abu Bakr → the author's own day, each entry mixing accession/incidents/deaths of notables.
**Book id:** `tarikh-khulafa` · category `tareekh` · branch `content/lib-futuh-buldan` (same lane branch) · stubs `data/_stubs.d/lib-futuh-buldan.yaml`.

**Edition and item used:** `raw/library/tareekh/tarikh-khulafa/20231228_20231228_2028.pdf` — **الطبعة الثانية المصححة المنقحة، دار المنهاج جدة بالتعاون مع دار الأوقاف للنشرون الإسلامية (قطر)، 1434هـ/2013م، إشراف محمد عثمان نصوح الحسيني، ISBN 978-9953-498-19-5, 864 pp**, based on six manuscripts incl. two in the author's students' hands. Three other scans exist in `raw/library/tareekh/tarikh-khulafa/` (AAlexandrina-033479, -140625, -163451, ~372pp each — likely different printings). OCR via `ocr_apple_vision.py` under miniconda python (system python3 lacks ocrmac) into `books/tareekh/tarikh-khulafa/20231228_20231228_2028/` — done 864 pages in 412s.

**Book structure:** front matter + manuscript plates to ~p64; Suyuti's خطبة الكتاب at p65; a miscellany on the imamate/khilafa hadiths and notes (~pp. 65–92) incl. the twelve-caliphs reports and the Fatimid-lineage anecdotes; then per-caliph entries beginning Abu Bakr (~p93+).

**Plan:** bounded batches by caliph. Extraction emphasis — accession/bay'a events, reign-length and death details, distinctive anecdotes, administrative acts — NOT the hadith corpus (largely covered by seerah/jami lanes). Reuse existing caliph entities (`person/abu-bakr`, `person/umar-ibn-al-khattab`, …) and enrich; create `event` entities for accessions/deaths where missing. Citations to printed page numbers (printed = PDF page, verify).

**Flags:** the edition prints honorifics — never typed into entities. Suyuti compiles from Bukhari/Muslim/Tabari/Ibn al-Athir — reuse existing entities aggressively.

## Done

- **Batch TK-1** (pp. 93–105 — miscellany + Abu Bakr opening): 5 `work` entities (caliph histories: Naftawayh, al-Suli's Awraq, Ibn al-Jawzi, Ibn Abi Tahir, Abu Musa Harun); 4 persons; `concept/quraysh-clan-offices` (siqaya/rifada, hijaba/liwa'/nadwa, Abu Bakr's diya).

- **Batch TK-2** (pp. 148–168 — Abu Bakr's caliphate/death): `event/compilation-of-quran` (Zayd's account), `event/death-of-abu-bakr` (khazira poison, the returned liqha/jafna/qatifa), `event/abu-bakr-naq-sortie` (Ali's halter, Khalid's five-pillar commission); persons al-harith-ibn-kalada, khuzayma-ibn-thabit.

- (12 Oct 2026) Lane opened; edition identified; OCR complete (864 pp, 412s); `source/tarikh-khulafa-minhaj-1434`, `work/tarikh-al-khulafa`, `person/al-suyuti` created.

- **Batch TK-4** (pp. 259–278 — Uthman): `event/baya-of-uthman` (Abd al-Rahman's private soundings, Ali's "فيما استطعت", Abu Talha's door guard), `event/uthman-expands-two-mosques` (Haram 26H, Prophet's mosque 29H — 160×150 cubits, teak roof); enriched `event/murder-of-uthman` (forged letter in the water-skin, Marwan's hand, siege, al-Mughira's three options, Hash Kawkab burial) and `event/first-raid-on-cyprus` (Amr's sea description); `person/muhammad-ibn-abi-bakr`.

- **Batch TK-3** (pp. 240–258 — Umar's late caliphate): `event/caesar-palm-letter` (the Caesarea palm letter), `event/umar-justice-anecdotes` (Ka'b ibn Suwar's verdict, Ali's meal-advice); enriched `event/death-of-umar` (Abu Lu'lu'a's windmill threat, Umar's premonition, the six-member shura); persons kab-al-ahbar, kab-ibn-suwar, amr-ibn-maymun; merged abu-lulua→`abu-lulu-firuz`, suhayb-al-rumi→`suhayb-ibn-sinan` (both pre-existing, same men).
