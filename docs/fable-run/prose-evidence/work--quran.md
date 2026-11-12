# work/quran

Lead before: 40 Arabic words, 65 English words. Lead after: 167 / 244.
Sources cited in the lead: tanzil-quran

The record cites one source, the Tanzil text. The two frozen files are `data/work/quran-source/tanzil-uthmani-v1.1.txt` and `data/work/quran-source/tanzil-simple-clean-v1.1.txt`. Each has 6,236 lines of the form `sura|aya|text` and a 28-line notice at the end. Nothing in the lead comes from anywhere else: every sentence rests on the record (its old lead and its data block `text_source`), on a count of those lines, or on that notice. No Qur'an wording is typed, no sura is named, and nothing is said about revelation or compilation.

The counts can be repeated with:

```bash
python3 - <<'EOF'
import re, collections
for fn in ("data/work/quran-source/tanzil-uthmani-v1.1.txt", "data/work/quran-source/tanzil-simple-clean-v1.1.txt"):
    c = collections.Counter(int(l.split("|")[0]) for l in open(fn, encoding="utf-8") if re.match(r"^\d+\|\d+\|", l))
    print(fn, len(c), sum(c.values()), max(c, key=c.get), max(c.values()), [s for s in c if c[s] == min(c.values())],
          c[1], c[114], sum(c[s] for s in range(1, 26)), sum(c[s] for s in range(1, 27)), c[77], max(c[s] for s in range(78, 115)))
EOF
```

Both files give: 114 suras, 6,236 verses, longest sura 2 with 286, shortest suras 103, 108 and 110 with 3 each, sura 1 with 7, sura 114 with 6, suras 1 to 25 with 2,932 verses, suras 1 to 26 with 3,159, sura 77 with 50, and at most 46 in any of suras 78 to 114.

| # | Sentence (first six words of the Arabic) | Citation | Where the fact was read |
|---|---|---|---|
| 1 | القرآن كتاب الإسلام المقدس، يؤمن المسلمون | {cite:tanzil-quran} | this record, old lead, first paragraph, same citation |
| 2 | ولغته العربية، ويعتمد المتحف في نصه | {cite:tanzil-quran} | this record: data `language: language/arabic`; data `text_source.name` ("Tanzil Project, Quran Text v1.1"); old lead, second paragraph ⁦(«برواية حفص كما في نص مشروع تنزيل»)⁩, same citation. The version is also in the notice at the end of both files ("Version 1.1") |
| 3 | يضم هذا النص 114 سورة و6236 | {cite:tanzil-quran} | this record, old lead, second paragraph, same citation. Counted in both files: 114 distinct sura numbers, 6,236 verse lines, verses numbered 1 to n with no gap in every sura |
| 4 | وتتفاوت السور في الطول تفاوتاً كبيراً: | {cite:tanzil-quran} | counted in both files: sura 2 has 286 verse lines, the most (next is sura 26 with 227); suras 103, 108 and 110 have 3 each, the fewest |
| 5 | وفي السورة الأولى سبع آيات، وفي | {cite:tanzil-quran} | counted in both files: sura 1 has 7 verse lines, sura 114 has 6 |
| 6 | وتقع أكثر الآيات في السور الأولى: | {cite:tanzil-quran} | counted in both files: suras 1 to 26 hold 3,159 verse lines (half of 6,236 is 3,118; suras 1 to 25 hold 2,932); each of suras 78 to 114, thirty-seven suras, has fewer than 50 (the most is 46; sura 77 has exactly 50) |
| 7 | ويذكر مشروع تنزيل في ذيل ملفّيه | {cite:tanzil-quran} | read in the notice at the end of both files: "carefully produced, highly verified and continuously monitored by a group of specialists at Tanzil Project"; terms of use: verbatim copies may be made and distributed, changing the text is not allowed; the source is to be clearly indicated with a link to tanzil.net |
| 8 | ولا يكتب المتحف نص الآيات في | {cite:tanzil-quran} | this record: old lead, third paragraph (the museum does not write the verses on its pages; they are taken from the frozen Tanzil files); data `text_source.files` (the Uthmani file with `use: text`, the Simple Clean file with `use: text_search`) and `text_source.frozen: "2026-10-11"` |
| 9 | وتُحال إلى هذين الملفين صفحات الآيات | {cite:tanzil-quran} | this record: old lead, third paragraph (the pages of single verses refer to the files); data `text_source.rule` ("The text in passage/quran-* files must equal these files exactly; scripts/validate.ts checks it on every build") |

Sentences from the record itself: 5 (1, 2, 3, 8, 9). Sentences from the source files, by counting or by reading the notice: 4 (4, 5, 6, 7).

Dropped or changed from the old lead: nothing dropped. The old third paragraph had no citation; its two sentences are now sentences 8 and 9 and carry `{cite:tanzil-quran}`, the only source the record has. That citation points at the files the sentences are about; the statements themselves are the record's own (data `text_source`).

Could not be supported and left out:
- section «للدارسين»: "revealed in parts over about twenty-three years, and gathered into one mushaf in the time of Uthman". Uncited, and not in the record's only source. Left out.
- Sura names: the files carry sura numbers only, so the lead gives numbers.
- Anything about the basmala: a plain comparison of the first verse of each sura gives different results in the two files, so no statement is made.
- When and where the Qur'an was revealed and how it was gathered: the record has no source for it. The lead therefore tells the visitor what the book is, how its text is laid out and how the museum holds it, and nothing about its history.

Seen in the record, outside the lead (not changed):
- The section «للدارسين» states the twenty-three years and the gathering under Uthman with no source.
- data `education.did_you_know.sources` lists `source/sahih-al-bukhari`, which the record's `sources` does not list.
