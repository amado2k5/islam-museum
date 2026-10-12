# Library lane: نساء حول الرسول — تراجم وقصص (al-Maktaba al-Asriyya 2015)

**Book:** نساء حول الرسول: تراجم وقصص — إعداد محمد علي القطب ومحمد عمر الداعوق وأحمد عبد الجواد الدومي؛ المكتبة العصرية، صيدا–بيروت، 1436هـ/2015م، 464 صفحة، ISBN 9953-34-219-9.
**Book id:** `nisa-hawl-rasul` · category `sahabiyat` · branch `content/lib-nisa-hawl-rasul` · stubs `data/_stubs.d/lib-nisa-hawl-rasul.yaml`.

**Edition and item used:** archive.org item `20200429_20200429_0107` (`raw/library/sahabiyat/nisa-hawl-rasul/20200429_20200429_0107.pdf`, 216 MB scan, 465 pages) — identical bytes to the founder's local PDF (`~/Downloads/نساء حول الرسول.pdf`). Already OCR'd with Apple Vision into `books/sahabiyat/nisa-hawl-rasul/20200429_20200429_0107/` (465 pages, ~629k chars). **Printed page = PDF page − 1** (checked at pp. 5, 11, 169, 441, 462). Source entity: `source/nisa-hawl-alrasul`; work: `work/nisa-hawl-alrasul`.

**Registry note:** `books.yaml` gives this book id the author «محمود المصري» — that is a different book with the same title (the small scans `90162` and `20250123_20250123_0924` are other works). The item used here is the al-Asriyya compilation by al-Qutb/al-Da'uq/al-Dumi (title page verified). Flagged for maintainer; not corrected in `scripts/` (other lane).

**Book structure (contents pp. 462–464 + running heads):**

| Section | Printed pages | Women |
|---|---|---|
| مقدمة | 5–9 | — |
| أمهات الرسول | 11–34 | آمنة بنت وهب (11), حليمة السعدية (15), بركة أم أيمن (20), فاطمة بنت أسد (29) |
| زوجات الرسول | 35–178 | خديجة (35), سودة (49), عائشة (59), حفصة (74), زينب بنت خزيمة (84), أم سلمة هند بنت أبي أمية (93), زينب بنت جحش (107), جويرية (118), أم حبيبة رملة (129), صفية بنت حيي (139), ميمونة (149), ريحانة (161), مارية القبطية (169) |
| نساء عاصرن الرسول | 179–388 | أم هانئ (181), أسماء بنت أبي بكر (189), صفية بنت عبد المطلب (193), أم الفضل (201), أسماء بنت عميس (213), أم معبد (219), أم عمارة نسيبة (225), رفيدة الأسلمية (233), أم ورقة (235), أم كلثوم بنت عقبة (241), أم سليم (253), أم حرام (257), فاطمة بنت الخطاب (265), أم منيع أسماء بنت عمرو (273), الخنساء (279), الشيماء (291), ضباعة القشيرية (295), خولة بنت ثعلبة (305), أم شريك (313), أم رومان (321), أمة بنت خالد بن سعيد (333), هند بنت عتبة (343), كعيبة الأسلمية (359), حمنة بنت جحش (367), سلمى القابلة (379) |
| بنات الرسول | 389–438 | زينب الكبرى (391), رقية (401), أم كلثوم (409), فاطمة الزهراء (419) |
| حفيدات الرسول | 439–461 | زينب بنت علي (441), أمامة (443), أم كلثوم بنت علي (453) |

**Plan:** nearly all ~49 women already exist on main (`people` and `lib-isaba` lanes). Per `mining-sources.md` §3, this book adds a second/third source and its own claims on the existing entities; create persons only for the missing (likely: رفيدة الأسلمية، أم منيع أسماء بنت عمرو، ضباعة القشيرية، خولة بنت ثعلبة، كعيبة الأسلمية، سلمى القابلة — verify while reading). Claims are `status: tradition`; the book's «قيل»/«يُروى» markers become `debated`/notes; zaynab-bint-jahsh's marriage is Tier A (perspectives already exist — cite, don't restate). Dates as the book words them.

**Done:**
- (12 Oct 2026) Lane opened. `source/nisa-hawl-alrasul`, `work/nisa-hawl-alrasul`, stubs file, this progress file. OCR confirmed already complete in the harvest workspace; redundant re-OCR stopped.
- (12 Oct 2026) أمهات الرسول pp. 11–34 + خديجة وسودة pp. 35–58 mined: enriched `amina-bint-wahb` (died-at-al-Abwa corroboration), `halima-al-sadiyya` (husband al-Harith ibn Abd al-Uzza, p. 15), `umm-ayman` (spouse_of zayd-ibn-haritha, parent_of usama/ayman, died under Uthman p. 28), `fatima-bint-asad` (died 063X~ Medina per book's راجح p. 29; parent_of umm-hani + 5 stub children p. 30), `khadija` (first husbands abu-hala-ibn-zurara & atiq-ibn-aidh pp. 36–37), `sawda-bint-zama` (al-sakran-ibn-amr p. 58; died → debated, two reports p. 58); `passage/quran-4-128` → `revealed_about` sawda (p. 54). Stubs: al-harith-ibn-abd-al-uzza, aqil/talib/jumana/rayta children of Abu Talib, al-sakran-ibn-amr, abu-hala-ibn-zurara, atiq-ibn-aidh.

**Flags:**
- Book calls Khadija's father «خويلد بن نوفل» (p. 35) — an error (Khuwaylid ibn **Asad**; Nawfal was his brother, Waraqa's father). Not propagated; noted here only.
- Book's «28 years» for Khadija's marriage (p. 48) exceeds the standard ~24/25 years — not propagated.
- Book's claim «أول امرأة تزوجت رجلاً هاشمياً... فاطمة بنت أسد» (p. 30, from al-Zuhri) kept as a note-level claim, not a headline fact.

**Next:** batch 2b — rest of زوجات الرسول (printed pp. 59–178): عائشة (59), حفصة (74), زينب بنت خزيمة (84), أم سلمة (93), زينب بنت جحش (107), جويرية (118), أم حبيبة (129), صفية بنت حيي (139), ميمونة (149), ريحانة (161), مارية (169). Same method: claims per woman → enrich existing persons; watch for verse-revelation edges (Q33 on زينب بنت جحش/الحجاب/الإفك) and new stubs.
