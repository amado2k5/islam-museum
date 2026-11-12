# Plan 51 — Ibadat and Adhkar Browser (متصفح العبادات والأذكار)

_Requested by the founder 11 November 2026: "start working on متصفح العبادات
والاذكار where it should list all the mentioned and written العبادات والاذكار
that are in quran, see rah, sunna, tabi3een stories, quotes, mentioned and
written in books that were harvested and any future harvested book if it has a
العبادات والاذكار should be viewable here. add a box for it on landing page and
in navigation menus. make sure this is done end to end and full detailed proses
and make it ready for production at the end of this. this is only about
العبادات والاذكار and everything mentioned about العبادات والاذكار anywhere in
any of the sunni books or quran or sunna or sera. find all the instances where
العبادات والاذكار Were mentioned or part of quotes from quran, sunnah, Hadith,
seerah or from sa7aba and tabi3een and add those stories, mentions, quotes,
details. also add this in engineering documents as the original requirements
to allow AI later on to test and validate it when it is in production."_

## 1. What it is

A browser over the one graph that gathers every act of worship and remembrance
the museum's sources mention or write: the prayer and its pillars, sunnahs and
supererogatory forms, purification, the fast, zakat and charity, the hajj and
umrah, the remembrance of God in all its formulas, supplication, the recitation
of the Qur'an, repentance and ruqya — in the Qur'an, the Sunnah, the seerah,
the reports of the Companions and the Successors, and every harvested book —
plus the curated records on worship itself. It follows the Du'a Browser
architecture: passages are ordinary graph nodes found at build time by a shared
detector; curated records carry the `ibadat-browser` tag; there is no side
table and no second list.

The key mechanism: **passages are not tagged — they are detected.**
`scripts/ibadat.ts` matches a guarded lexicon over each passage's own
`text_search`/`text` — never labels or summaries, which are museum metadata
(the «كتاب الصلاة» chapter name of a hadith collection is not evidence). An
act of worship in a book harvested next month appears here the day its
passage record lands — the founder's "any future harvested book" requirement,
met by the detector rather than by tagging.

## 2. Scope — what counts as worship and remembrance

In scope, eleven families —

- **العبادة** (worship itself): «عبادة/عبادات» and «عبد + divine object»
  («إياك نعبد»، «اعبدوا الله»، «يعبدون الرحمن»). Worship of other than God
  («يعبدون الأصنام/الطاغوت/الشمس») is excluded.
- **الصلاة**: «صلاة/الصلوات/المصلين»، the performing verb «يصلي/صلى/صلوا»،
  ركوع وسجود، and قيام الليل والتهجد والوتر والنوافل والتراويح.
- **الطهارة**: وضوء وتوضأ، غسل واغتسل، تيمم، طهارة.
- **الصوم والاعتكاف**: صيام وصائم ويصوم، إفطار وسحور، اعتكاف وعاكف.
- **الزكاة والصدقة**: زكاة و«يؤتون الزكاة»، صدقة ويتصدق.
- **الحج والعمرة**: حج ويحج، عمرة واعتمر، طواف ويطوف، سعي بين الصفا والمروة،
  إحرام وعرفة ومزدلفة ورمي الجمار والمناسك. The argument sense «احتجّ»
  (he argued) and «حجة» (proof) stay out — word-initial matching keeps them
  from ever hitting.
- **الذكر والأذكار**: «ذكر الله/يذكرون الله»، «أذكار/أوراد»، التسبيح
  («سبحان/يسبح/سبّح»)، التحميد («الحمد لله»)، التهليل («لا إله إلا الله»)،
  التكبير («الله أكبر»)، الاستغفار، الصلاة على النبي («صلوا عليه»)، الحوقلة
  والبسملة.
- **الدعاء**: every passage the Du'a Browser counts — `isIbadatPassage`
  literally calls `isDuaPassage` from `scripts/dua.ts`, so the two browsers
  can never drift apart on what a supplication is.
- **التلاوة**: تلاوة ويتلو وتتلى وترتيل.
- **التوبة والإنابة**: توبة ويتوب وتائب وأناب ومنيب.
- **الرقية**: رقية ويرقي واسترقى.

Every passage is marked `act` when it performs or commands the worship
(performing verbs, the dhikr formulas, «إياك نعبد») and `mention` when it is
only about one, and carries a `topics` list naming each family it touches.

## 3. Records

- **Detected passages** across the whole corpus: Qur'an ayahs
  (`work/quran`), sunnah reports (genre `hadith` / `unit: hadith`), seerah
  passages (genre `sira`) and every other harvested work — plus all ~355
  du'a passages by inheritance from `isDuaPassage`.
- **83 curated records tagged in place**: 52 practices (الصلاة، الوضوء،
  التيمم، الغسل، صوم رمضان، السحور، الإفطار، الاعتكاف، الزكاة وزكاة الفطر،
  الصدقة، الحج، العمرة، الطواف، السعي، الأذان، الخطبة، التهجد، قيام الليل،
  التراويح، الوتر، صلاة الجمعة والجماعة والجنازة والخوف والكسوف والاستسقاء
  والضحى، سجود السهو والتلاوة، الاستخارة، النذر، كفارة اليمين، التسبيح
  والذكر والدعاء، ختم القرآن وحفظه والتجويد، الأضحية والعقيقة والختان
  والدفن والعيدان والمولد وزيارة القبور وليلة القدر وعاشوراء والمسواك
  والاستنجاء والمسح على الخفين) and 31 concepts (العبادة، الاستغفار،
  التوبة، الذكر، الرقية، الصلاة على النبي، النوافل، الطهارة، الصدقة الجارية،
  وأحكام الصلاة والحج والوضوء والرقية والخطبة وأوقات الصلاة). Reuse-before-
  create: no new record was needed — the umbrella `concept/ibada` and every
  major worship practice already existed, most with trilingual prose.

## 4. Sections (the corpus, not a topic taxonomy)

`quran` في القرآن · `sunnah` في السنة · `seerah` في السيرة · `books` في سائر
الكتب · `curated` السجلات المنتقاة — derived from each passage's work
(`work/quran`, genre `hadith`/`sira` or `unit: hadith`) and from the
`ibadat-browser` tag on curated records. Topic chips (الصلاة، الطهارة، الصوم،
الزكاة والصدقة، الحج والعمرة، الذكر، الدعاء، التلاوة، التوبة، الرقية،
العبادة) show on every passage card.

## 5. Pages

- `/[lang]/ibadat/` — the home: lede, status count, method note, API link,
  section chips with counts, a client-side filter over trilingual labels,
  summaries, work names, text excerpts and topic labels, and the cards.
  Header block carries `data-pagefind-body`; the lists are
  `data-pagefind-ignore`.
- Every card links to the **ordinary entity page** of its record
  (`/{lang}/passage/<slug>/` or `/{lang}/practice|concept/<slug>/`).

## 6. Surface

- `scripts/ibadat.ts` — the shared detector + corpus classifier + topic
  mapper + section tag reader (used by `scripts/export-api.ts`,
  `site/src/lib/ibadat.ts` and `scripts/features-api.test.ts`); imports
  `isDuaPassage`/`duaKindOf` from `scripts/dua.ts` for the du'a family.
- `site/src/lib/ibadat.ts` (shared reads), `site/src/lib/nav.ts` (`ibadat`
  key, `ready: true`), `site/src/pages/[lang]/ibadat/index.astro`,
  `site/src/scripts/ibadat-filter.ts`, `i18n/{ar,en,ur}.yaml`
  (`explore.pages.ibadat` + `ibadat:` block in the same commit),
  `/api/v1/ibadat.json` via `FEATURE_EXPORTS`, documented in
  `docs/data/README.md`, `site/public/openapi/v1.json` and `llms.txt`.
  Landing card + Explore menu entry via `explorePages`. Register rows in
  `docs/site/browsers.md`, plan index, `docs/agents/lanes.md` (`ibadat`
  lane), `docs/status.md`, `CANARY.md` (v1.23.0).
- `docs/engineering/39-ibadat-browser-requirements.md` — the requirements
  and production checklist for later validation (`IBADAT-R..`).

## 7. Status

Built 11 November 2026: the detector over the whole passage corpus plus 83
curated records tagged in place, `/api/v1/ibadat.json`, the `/[lang]/ibadat/`
page in three languages, the landing card and Explore menu entry, full API
docs. New records are draft-tier until a human reads them; nothing goes live
until the founder deploys. Future enrichment waves: seerah and books
passages as they are harvested, adhkar compendia (al-Nawawi's al-Adhkar,
Ibn al-Qayyim's al-Wabil al-Sayyib) when mined, deeper Companion/Tabi'in
anecdote mining, and the `IBADAT-R..` production checklist.
