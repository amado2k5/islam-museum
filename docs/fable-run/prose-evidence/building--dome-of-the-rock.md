# building/dome-of-the-rock

Lead before: 21 Arabic words, 30 English words. Lead after: 172 / 238.
Sources cited in the lead: ahsan-al-taqasim, wikidata, umayyad-birth-to-fall-2006, tei-epigraphie, umari-masalik-1924

Local copies read on the page:

- `ahsan-al-taqasim`: `~/islam-museum-harvest/books/geography/ahsan-taqasim/ar115voyag85/pages.json`. The record's page numbers are this scan's page index (its «p. 144» is scan page 144, printed page 147). I cite scan pages the same way.
- `umari-masalik-1924`: `~/islam-museum-harvest/books/geography/masalik-al-absar-umari-1924/masalik-1924/pages.json` (scan pages, as the record cites them; scan 177–182 are printed 139–144).
- `umayyad-birth-to-fall-2006`: `~/islam-museum-harvest/books/tareekh/tarikh-umayyad-salabi/2006_20231111/pages.json` (title page: Muhammad Qabbani, الدولة الأموية من الميلاد إلى السقوط; scan page = printed page).
- `wikidata` and `tei-epigraphie` are online databases and are not on this machine; their two facts are carried from the record.

| # | Sentence (first six words of the Arabic) | Citation | Where the fact was read |
|---|---|---|---|
| 1 | قبة الصخرة بيت مثمّن تعلوه قبة، | {cite:ahsan-al-taqasim p. 143} {cite:wikidata} | this record, old lead (in the court of al-Aqsa, in Jerusalem, {cite:wikidata}) and section «وصف المقدسي» (octagon with a dome). Read on the page: ahsan-taqasim/ar115voyag85, scan p.143, last lines («والصحن كله مبلط ... وفي الوسط قبة الصخرة على بيت مثمن»). The record cites p. 144 for this; the words are on scan p.143, so that page is cited |
| 2 | تؤرخ بيانات ويكيداتا بناءها بسنة 691م | {cite:wikidata} | this record, old lead and `data/building/dome-of-the-rock.yaml` field `built` (edtf 0691, source/wikidata), same citation. Not re-read: Wikidata is not on this machine |
| 3 | ويذكر محمد قباني أن عبد الملك | {cite:umayyad-birth-to-fall-2006 p.163} {cite:umayyad-birth-to-fall-2006 p.161} | new to the record, read on the page: tarikh-umayyad-salabi/2006_20231111, p.163 («أمر عبد الملك بن مروان سنة 72هـ ببناء مسجد فوق الصخرة التي عرج الرسول من فوقها ليلة الإسراء والمعراج») and p.161 (listed among the best-known new mosques the Umayyads built, «الذي أنشأه عبد الملك بن مروان في القدس»). The statement about the Ascension is attributed to the author in the sentence |
| 4 | ويسجّل قاموس النقوش الإسلامية لها نقشاً | {cite:tei-epigraphie 9} | this record, `data/building/dome-of-the-rock.yaml`, `built.note` («نقش بنائي مؤرخ سنة ٧٢هـ في قاموس النقوش الإسلامية {cite:tei-epigraphie 9}»), same citation. Not re-read: the database is not on this machine |
| 5 | ووصفها المقدسي في أحسن التقاسيم، وهو | {cite:ahsan-al-taqasim p. 12} {cite:ahsan-al-taqasim p. 143} | this record, section «وصف المقدسي» and data summary (octagon, four doors each facing a stair). Read on the page: scan p.143 («بيت مثمن بأربعة أبواب كل باب يقابل مرقاة ... جميعها مذهبة»). The year: scan p.12 (author's preface: the work was finished «سنة ٣٧٥»). The record says he saw it "around 375"; the page gives 375 as the year the book was completed, so the sentence says that |
| 6 | وفي داخله ثلاثة أروقة دائرة على | {cite:ahsan-al-taqasim p. 144} | this record, section «وصف المقدسي», same citation. Read on the page: scan p.144 («ثلاثة أروقة دائرة على أعمدة معجونة أجل من الرخام ... طولها ... في الهواء مائة ذراع ... ملبسة بالصفر المذهب») |
| 7 | وقال إن الشمس إذا بزغت عليها | {cite:ahsan-al-taqasim p. 144} | this record, section «وصف المقدسي», same citation. Read on the page: scan p.144 («فإذا بزغت عليها الشمس أشرقت القبة وتلألأت المنطقة ... لم أر في الإسلام ولا سمعت أن في الشرق مثل هذه القبة»). Wording follows the page: the record has "nothing like it in the East" |
| 8 | ثم وصف ابن فضل الله العمري | {cite:umari-masalik-1924 p.177} {cite:umari-masalik-1924 p.178} | this record, section «صفتها سنة 743هـ عند العمري», same two citations. Read on the page: masalik-1924, scan p.177 (last lines: «على ما استقر عليه بناؤه إلى سنة ثلاث وأربعين وسبعمائة») and p.178 (Taj al-Din Ahmad ibn Amin al-Mulk's short book, «معتمدا ... على ما حرره بالذراع») |
| 9 | وفيه أن البناء المثمن يرتفع عن | {cite:umari-masalik-1924 p.178} {cite:umari-masalik-1924 pp. 181-186} | this record, sections «صفتها سنة 743هـ عند العمري» (eighteen cubits above the paved court, p.178) and «ذرع العمري» (northern door called Bab al-Janna, pp. 181-186), same citations. Read on the page: scan p.178 and p.182 («وأما الباب الشمالي ويسمى باب الجنة») |

Dropped or changed from the old lead: the clause "from a single source that needs a second" was replaced by the second sources themselves, both already listed by the record: the TEI inscription dated 72 AH (sentence 4, from `built.note`) and Qabbani's 72 AH (sentence 3, read on the page). The 691 CE date and its Wikidata attribution are kept. No Hijri year was converted: 691 CE and 72 AH are each given as their source gives them.

Could not be supported and left out:
- "In the Mamluk period" (record, section «ذرع العمري»): the pages read give the year 743 but do not use the word; the year is given instead.
- The brass-plated door leaves, which the record cites to pp. 181-186: on the scan the sentence is on p.179 and belongs to the southern door only; left out of the lead.
- Who built it according to an early source: al-Maqdisi (scan p.143) names Abd al-Malik for the covered al-Aqsa mosque, not for the Dome, so the builder is given only on Qabbani's authority.

Revised after verification: nothing changed in the lead. The one finding is about the page convention: `ahsan-al-taqasim p. 12 / 143 / 144` are page indices of the local scan, not printed pages. The printed folios read at the foot of those scan pages are 15 (scan 12), 146 (scan 143) and 147 (scan 144). The locators are left as they are because the record's body and data cite this source by the same scan pages, the source record defines the source as that local scan and states no page convention, and changing the lead alone would give one passage two page numbers inside one record. The convention belongs in the source record (data), outside the lead.
