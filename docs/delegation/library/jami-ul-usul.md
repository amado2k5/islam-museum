# Library lane: Jami' al-Usul fi Ahadith al-Rasul — Ibn al-Athir al-Jazari (d. 606 AH)

**Book id:** `jami-ul-usul` · category `hadith` · worker: Claude Code (OCR-harvest worker A), run `ocr-harvest-2026-11-04`.

## Items (`books/hadith/jami-ul-usul/`)

| item | pages | md5 (8) | what it is | used |
|---|---|---|---|---|
| `HadithsFundamentalismCollector` | 8,817 | dd30c7d6 | Dar Ibn Kathir 3rd ed. 1437/2016, ed. 'Abd al-Qadir al-Arna'ut, whole set incl. Tatimma, one file | **yes** → `source/jami-al-usul-arnaut-2016` |
| `jofarasoul` | 810 | 073a0fad | vol. 1 of the same Arna'ut edition, separate scan | no — duplicate edition |
| `20230829_20230829_0903` | 1,073 | b2b5a867 | Tatimma (rukn 3: narrators' biographies), Dar al-Fikr ed. by Bashir 'Uyun | not yet — next batch candidate |
| `muradmolla-373-3` | 251 | b1157fea | manuscript (Murad Molla library, Istanbul, no. 373) | **excluded**: OCR of handwriting is unreadable |

**Pages:** citations of `source/jami-al-usul-arnaut-2016` give the PDF page of the set file. Vol. 1 front matter PDF 1–42 = printed 1–42; from PDF 43 printed = PDF − 42 (checked PDF 50, 75, 150, 164, 176).

## Structure of vol. 1 (PDF pages)
Prefaces of 2nd ed. (2008) 5–8, of 1st ed. 9–16 (manuscripts 12–15), author's life 17–19, manuscript plates 20–42; author's introduction 45 ff.: book I (why) 46–59, book II (arrangement) 60–70, hadith sciences 71–158 (jarh wa-ta'dil 115, naskh 131, kinds of sahih 137), the six imams 159–176; Kitab al-Iman wa-l-Islam 179 ff.

## Batch 1 (4 Nov 2026)
- New: `source/jami-al-usul-arnaut-2016`, `work/jami-al-usul` (was a stub in `data/_stubs.d/lib-mawsuat-a3lam.yaml`; now written), `work/tajrid-al-sihah` (Razin's book, described from Ibn al-Athir's critique), `person/abd-al-qadir-al-arnaut` (the editor; death date from the 2nd-ed. preface).
- Enriched: `person/ibn-al-athir-al-jazri` (appended biography from the editor's introduction: birth at Jazirat Ibn 'Umar, teachers, chancery career, refusal of the vizierate, illness and retirement, works; born_in/died_in/student_of edges), `person/razin-ibn-muawiya` (his book in Ibn al-Athir's account; authored edge).
- Not used: the six-imams biographies (PDF 159–176) — the six imams already have rich pages; the hadith-sciences chapters (71–158) — candidates for concept enrichment.
- Doubts: none new. Gradings in the notes are al-Arna'ut's, not Ibn al-Athir's — say so whenever a grade from this edition is cited.

## Next
- Tatimma (narrators' biographies) for thin Companion/Successor pages; hadith-sciences chapters for concept pages (jarh wa-ta'dil, naskh, kinds of sahih).
