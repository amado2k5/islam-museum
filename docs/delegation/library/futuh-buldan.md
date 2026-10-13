# Library lane: Futuh al-Buldan — al-Baladhuri (conquest history)

**Book:** فتوح البلدان — أحمد بن يحيى بن جابر البلاذري البغدادي (ت ~279هـ، التاريخ متنازع عليه). The classic source-history of the early conquests, siyar-shaped then ordered by region/province.
**Book id:** `futuh-buldan` · category `tareekh` · branch `content/lib-futuh-buldan` · stubs `data/_stubs.d/lib-futuh-buldan.yaml`.

**Edition and item used:** `raw/library/tareekh/futuh-buldan/20230703_20230703_1444.pdf` — **مؤسسة المعارف، بيروت، غرة ذي الحجة 1407هـ الموافق 26 تموز (يوليو) 1987م، تحقيق محققَين** (the al-Tabba' edition; the editors' names do not appear on the scanned pages — signature reads «المحققان» only, editor colophon on p. 7 of the scan). 768 PDF pages. No text layer; Apple Vision OCR via `ocr_apple_vision.py` (started 12 Oct 2026) into `books/tareekh/futuh-buldan/20230703_20230703_1444/`. **Printed page ≠ PDF page** — offset must be derived per section (the printed number appears at the top/foot of each page, e.g. index shows فتح الأندلس near printed p. 467). Three other scans exist in `raw/library/tareekh/futuh-buldan/` (AAlexandrina-011858, AAlexandrina-129953, FutuhAlBoldan) — first scan chosen for cleanest OCR.

**Book structure (from the printed index at the end):** the work opens with the Prophet's siyar condensed (Quba' onward), then ridda and the early conquests by region: الشام، فتوح مصر والمغرب (الإسكندرية، برقة، أطرابلس، إفريقية، طنجة، الأندلس، الجزائر)، فتوح السواد (جلولاء، تأسيس الكوفة، واسط، البطائح، مدينة السلام)، الجبال وحلوان، الدينور وماسبذان ومهرة، همذان، قم وقاشان وأصبهان، مقتل يزدجرد، الري وقومس، قزوين وزنجان، أذربيجان، الموصل، شهرزور، جرجان وطبرستان، كور دجلة، تأسيس البصرة، الأساورة والزط، كور الأهواز، فارس وكرمان، سجستان وكابل، خراسان، فتوح السند، أحكام أراضي الراج، العطاء في خلافة عمر — closing with كتاب الخراج-style material (zakat/jizya on produce, e.g. the saffron discussion on PDF p. 101).

**Plan (per `categories/tareekh`):**
1. Batch 1: `source/futuh-buldan-maarif-1407`, `work/futuh-buldan`, `person/al-baladhuri` (bio from the edition's own muqaddima: teachers, students, death-date dispute 279 vs al-Mu'tadid's era, poet anecdote with al-Musta'in).
2. Then bounded batches by region: `event` entities for conquests/treaties (صلح, فتح عنوة), `place` stubs where missing, `person` for commanders/governors, `practice`/`concept` for kharaj/jizya/fay'/sulh rules. Every claim cited to printed page; OCR never enters git.

## Done

- (12 Oct 2026) Lane opened: edition identified (Mu'assasat al-Ma'arif 1407/1987, two editors unnamed on scan); OCR of all 768 pages started; source/work/person stubs reserved.

**Flags:** conquest narratives carry isnads — attribute every report to its chain/author, never the museum's voice; peace-treaty texts (e.g. صلح نجران، صلح التوبة) are primary documents — summarize, don't republish; Ridda and conquest events may already exist from the seerah lanes — reuse before creating.

**Next:** batch 1 — source/work/person entities while OCR runs; then map printed-page offset and open with the siyar section + باب الجزية على أهل البلدان.