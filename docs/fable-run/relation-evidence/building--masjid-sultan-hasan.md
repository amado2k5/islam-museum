# building/masjid-sultan-hasan

Neighbours before: 0. Relations added: 5.

| Relation | Evidence: the record's own words (quote the sentence, Arabic or English) | Citation on that sentence | Where |
|---|---|---|---|
| located_in -> place/cairo | «مسجد ومدرسة في [[place/cairo\|القاهرة]] بدأ السلطان حسن عمارته سنة 757هـ.» | {cite:khitat-maqrizi-1998 p.2111} | content/ar/building/masjid-sultan-hasan.md, section «موجز» |
| during_reign -> polity/mamluk-sultanate | «يعدّ يومانز جامع السلطان حسن ⁦(1356-1361م)⁩ أعظم روائع المماليك المعمارية وأكبر جوامع القاهرة وأفخمها.» <br> «يلخص يومانز الجامع بأنه نضج العمارة المملوكية» | {cite:yeomans-islamic-cairo-2006 p.154} {cite:yeomans-islamic-cairo-2006 p.155} <br> {cite:yeomans-islamic-cairo-2006 p.162} | content/ar/building/masjid-sultan-hasan.md, section «الجامع عند يومانز» <br> content/ar/building/masjid-sultan-hasan.md, section «التركيب» |
| exemplifies -> concept/iwan | «وفي قلبه مخطط صليبي ناضج بأربعة إيوانات عملاقة على صحن مكعب عميق» | {cite:yeomans-islamic-cairo-2006 p.156} {cite:yeomans-islamic-cairo-2006 p.161} | content/ar/building/masjid-sultan-hasan.md, section «المخطط» |
| written_about_by -> person/al-maqrizi | «يذكر المقريزي أن العمارة استمرت ثلاث سنين لا تنقطع، وأُرصد لنفقتها في كل يوم عشرون ألف درهم.» | {cite:khitat-maqrizi-1998 p.2111} | content/ar/building/masjid-sultan-hasan.md, section «عند المقريزي» |
| mentioned_in -> work/art-and-architecture-of-islamic-cairo | «يعدّ يومانز جامع السلطان حسن ⁦(1356-1361م)⁩ أعظم روائع المماليك المعمارية وأكبر جوامع القاهرة وأفخمها.» | {cite:yeomans-islamic-cairo-2006 p.154} {cite:yeomans-islamic-cairo-2006 p.155} | content/ar/building/masjid-sultan-hasan.md, section «الجامع عند يومانز». The cited source `source/yeomans-islamic-cairo-2006` is the edition of this work: Yeomans, Garnet 2006, as the work record's own summary says |

In the quotations a wikilink's pipe is written `\|` so that the table renders; the record has a plain pipe.

Looked for and not found as records: Sultan Hasan himself, al-Nasir Hasan ibn Muhammad ibn Qalawun, whom the record names as the builder. Searches: `ls data/person | grep -iE "sultan-hasan|nasir-hasan|hasan.*qalawun|hasan-ibn-al-nasir"` gives nothing; `grep -rlE "الناصر حسن|السلطان حسن|Sultan Hasan|Nasir Hasan" data/person/` gives only `person/al-malik-al-mansur-hajji`, his nephew, whose summary mentions him, and two unrelated people; `person/al-nasir-al-hasan` is a Zaydi imam of Yemen; `grep -nE "hasan|حسن" data/_stubs.yaml data/_stubs.d/* | grep -iE "sultan|nasir|ناصر|سلطان"` finds no stub for him. Al-Maqrizi's Khitat as a work: `ls data/work | grep -iE "khitat|mawaiz|maqrizi"` gives only `al-khitat-al-tawfiqiyya` and `imta-al-asma-maqrizi`, two other books, and `grep -rlE "المواعظ والاعتبار|الخطط المقريزية" data/work` gives nothing. The Khitat exists only as `source/khitat-maqrizi-1998`, so the door goes to the author. Maydan al-Rumayla: `grep -rlE "الرميلة|Rumayla" data/place` gives nothing.

Could have been added but the record does not cite it: nothing.

Supported by the record and left out: `written_about_by -> person/richard-yeomans`, who is reached through his book. `exemplifies -> concept/madrasa` and `exemplifies -> concept/muqarnas`: the record calls the building a mosque and madrasa and describes a muqarnas hood, but the four-iwan plan is its stronger statement. The amirs Sarghitmish, Shaykhu and Yalbugha belong to the sultan's life, not to the building. The al-Maridani minaret and the Gök Medrese are comparisons, and no registered predicate links a building to a building.
