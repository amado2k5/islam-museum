# Low-risk coverage audit, 2026-10-14

Scope: Arabic pages in `content/ar/` for the classes place, group, event, journey, concept, polity, period, work, source and exhibit. That is 451 pages (place 57, group 64, event 206, journey 32, concept 46, polity 8, period 13, work 11, source 9, exhibit 5). Classes outside this list (person, building, practice, question, object) are not in this pass.

## What was checked

(a) Doctrinal and sectarian judgements. Keyword screen across all 451 pages for sect and school names (Shia, Ibadi, Mutazila, Ashari, Qadariyya, Murjia, Jahmiyya, Ahl al-Hadith and similar), verdict words (al-sawab, al-batil, al-dalal, la shakk, al-haqq anna, yazʻum, yukadhdhibun, ibtada, munharif), and narrator-judgement terms (kadhdhab, matruk, muttaham, daʻif, la yasihh, wahin). Each hit was read in context. Most are attributed to a named book, author or tradition, or are quoted. Result: one clear violation.

(b) Insulting or sectarian terms in the museum's own voice (enemy of Islam, rafida, nasibi, ibtida, zindiq, kafir, khawarij and similar). Keyword screen across the same pages. Every hit is historical, quoted from a source, or already attributed. No unattributed term found.

(c) At least one `{cite:...}` key on each page. Ten pages have none. The validator already rejects unresolved keys (0 errors), so this check only finds pages with no citation at all. See "Not fixed" below.

(d) Honorifics typed into prose (ﷺ, صلى الله عليه, رضي الله عنه/عنها/عنهم, عليه السلام, عليهم السلام, رحمه الله and variants). Screen across `content/ar/`, all classes. No occurrences.

Method limit: (a) was checked by keyword screen plus reading of each hit, not by a full close reading of every paragraph of all 451 pages. Judgement phrased without any of the screened words could be missed.

Validation: `npm run validate` on the baseline commit 08081bb2 reported 0 errors and 2152 warnings. Warnings are pre-existing and are not changed by this pass.

## Fixes

| File | Before | After | Reason |
| --- | --- | --- | --- |
| `content/ar/group/ansar.md` (section "الأثر") | الأنصار هم السند الدائم لأهل السنة — «ولا يحبهم إلا مؤمن» — | عند أهل السنة، الأنصار هم السند الدائم — «ولا يحبهم إلا مؤمن» — | A Sunni position was stated as the museum's own claim. The attribution is added. The existing wording and citation are kept, and no claim is added. |

Pages with a fix: 1 of 451.

## Not fixed

Pages with no `{cite:...}` key (criterion (c)). The brief forbids adding new citations, so these are listed, not edited. Each page's data record already lists sources, so a cite could be added from those, but that is a content decision for an editor.

- `content/ar/place/al-akhdar.md` (data lists source/ibn-hisham-saqqa)
- `content/ar/place/al-jurf.md` (data lists source/ibn-hisham-saqqa)
- `content/ar/place/maysan.md` (data lists source/ibn-hisham-saqqa)
- `content/ar/place/thaniyyat-al-wada.md` (data lists source/ibn-hisham-saqqa)
- `content/ar/place/wadi-al-mushaqqaq.md` (data lists source/ibn-hisham-saqqa)
- `content/ar/exhibit/path-abyssinia-migrations.md` (data lists ibn-hajar-isaba, ibn-hisham-sira, mubarakpuri-raheeq)
- `content/ar/exhibit/path-from-opposition-to-islam.md` (data lists ibn-hajar-isaba, mubarakpuri-raheeq)
- `content/ar/exhibit/path-islam-in-30-minutes.md` (data lists mubarakpuri-raheeq, sahih-al-bukhari)
- `content/ar/exhibit/path-meccan-period.md` (data lists ibn-hisham-sira, mubarakpuri-raheeq)
- `content/ar/exhibit/path-women-around-the-prophet.md` (data lists ibn-hajar-isaba, mubarakpuri-raheeq)

Reviewed and left as they are. The verdict-style words in these pages are attributed to a named source or tradition, or are quoted. Examples: the Jahmiyya and Qadariyya pages (`يزعم`, `يزعمون`, with `بحسب وصف الكتاب` or a cite), the Mutazila and Murjia pages (same), and the hadith-critic verdicts in the person pages (attributed to Ibn Hajar, Abu Umar and others).

## Result

- Pages checked: 451.
- Fixes made: 1 (ansar).
- Pages failing (c): 10, not fixed.
- Validate after the fix: to be recorded in the commit report.
