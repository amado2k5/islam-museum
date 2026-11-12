# 39 · Ibadat and Adhkar Browser — requirements and production checklist

_The feature requirements for «متصفح العبادات والأذكار» (the Ibadat and Adhkar
Browser — every act of worship and remembrance mentioned or written in the
Qur'an, the Sunnah, the seerah, Companion and Tabi'i reports and every
harvested book), as requested by the founder on 11 November 2026 and delivered
in `docs/plan/51-ibadat-browser.md`. Written so any person or AI agent can
validate each requirement against production (`https://islam.museum`,
`https://api.islam.museum`) without reading the plan. Every requirement has an
id (`IBADAT-R..`), a "how to check" line, and the artifact that proves it._

## 0. The original request (verbatim)

> "start working on متصفح العبادات والاذكار where it should list all the
> mentioned and written العبادات والاذكار that are in quran, see rah, sunna,
> tabi3een stories, quotes, mentioned and written in books that were harvested
> and any future harvested book if it has a العبادات والاذكار should be
> viewable here. add a box for it on landing page and in navigation menus.
> make sure this is done end to end and full detailed proses and make it ready
> for production at the end of this. this is only about العبادات والاذكار and
> everything mentioned about العبادات والاذكار anywhere in any of the sunni
> books or quran or sunna or sera. find all the instances where العبادات
> والاذكار Were mentioned or part of quotes from quran, sunnah, Hadith, seerah
> or from sa7aba and tabi3een and add those stories, mentions, quotes,
> details. also add this in engineering documents as the original requirements
> to allow AI later on to test and validate it when it is in production."

Scope note: «العبادات والأذكار» here means worship directed to God — the
ritual acts (prayer, purification, fasting, zakat, hajj) and the devotional
acts (dhikr, du'a, glorification, seeking forgiveness, blessings on the
Prophet, recitation, repentance, ruqya). It does not include worship of other
than God, the argument sense of «احتجّ», or da'wa (preaching).

## 1. Graph and data model

| Id | Requirement | How to check |
|---|---|---|
| IBADAT-R01 | No new class or side table: every browser record is an ordinary graph node — passages detected at build time, curated records tagged `ibadat-browser` (+ optional `ibadat-<section>`) | `grep -rl "ibadat-browser" data/` — hits under `data/practice/` and `data/concept/`; `scripts/lib.ts` `CLASSES` unchanged |
| IBADAT-R02 | Five sections derived from the corpus, not a topic list: `quran` في القرآن · `sunnah` في السنة · `seerah` في السيرة · `books` في سائر الكتب · `curated` السجلات المنتقاة | `IBADAT_SECTIONS` in `scripts/ibadat.ts`; `site/src/lib/ibadat.ts` |
| IBADAT-R03 | **Automatic inclusion of future harvested books**: an act of worship in any book enters the browser the day its passage record lands in the graph — detection is a build-time function of the compiled graph, never a hand-kept list | add a fixture passage containing «أقاموا الصلاة» to a test work, run `npm run graph && npx tsx scripts/export-api.ts`, confirm it appears in `ibadat.json` with the right `section`; then remove the fixture |
| IBADAT-R04 | Detection is over passage-owned text only (`text_search`, `text` fallback) — never labels or summaries, so chapter names like «كتاب الصلاة» do not create false hits | `ibadatSignalsOf` in `scripts/ibadat.ts`; a fixture passage whose label says «الصلاة» but whose text does not must NOT be detected |
| IBADAT-R05 | Arabic diacritics and tatweel are stripped before matching; patterns tolerate clitic prefixes and pronoun suffixes | fixture «أَقِيمُوا الصَّلَاةَ» (fully vocalised) is detected |
| IBADAT-R06 | Worship signals: «عبادة/عبادات» always counts; «عبد + divine object» («إياك نعبد»، «اعبدوا الله»، «يعبدون الرحمن») counts; «عبد + false-god object» («يعبدون الأصنام/الطاغوت/الشمس/الكواكب») never counts | `AR_IBADA_NOUN`, `AR_IBADA_VERB_GOD`, `AR_IYYAKA`, `IBADA_FALSE`; `passage/quran-1-5` («إياك نعبد») in; a fixture «يعبدون الأصنام» out |
| IBADAT-R07 | Prayer signals: «صلاة/الصلوات/المصلين»، performing verb «يصلي/صلى/صلوا»، ركوع وسجود، قيام الليل/تهجد/وتر/نوافل/تراويح | `AR_SALAT_NOUN`, `AR_SALAWAT`, `AR_SALAT_VERB`, `AR_RUKU_SUJUD`, `AR_MUSALLI`, `AR_QIYAM` |
| IBADAT-R08 | Purification signals: وضوء/توضأ، غسل/اغتسل، تيمم، طهارة | `AR_WUDU`, `AR_GHUSL`, `AR_TAYAMMUM`, `AR_TAHARA` |
| IBADAT-R09 | Fasting signals: صيام/صائم/يصوم، إفطار/سحور، اعتكاف/عاكف | `AR_SAWM`, `AR_SAWM_VERB`, `AR_IFTAR_SUHUR`, `AR_ITIKAF` |
| IBADAT-R10 | Zakat and charity signals: زكاة/«يؤتون الزكاة»، صدقة/يتصدق | `AR_ZAKAT`, `AR_ZAKA_VERB`, `AR_SADAQA`, `AR_TASADDAQ` |
| IBADAT-R11 | Hajj signals: حج/يحج، عمرة/اعتمر، طواف/يطوف، سعي بين، إحرام/عرفة/مزدلفة/رمي الجمار/المناسك — and **«احتجّ» (he argued) and «حجة» (proof) never match** because patterns are word-initial | `AR_HAJJ`, `AR_YUHAJJ`, `AR_UMRA`, `AR_ITAMAR`, `AR_TAWAF`, `AR_SAY`, `AR_HAJJ_RITES`; a fixture «احتجّ عليهم» must NOT be detected |
| IBADAT-R12 | Dhikr signals: «ذكر الله/يذكرون الله»، «أذكار/أوراد»، تسبيح («سبحان/يسبح»)، تحميد («الحمد لله»)، تهليل («لا إله إلا الله»)، تكبير («الله أكبر»)، استغفار، الصلاة على النبي، حوقلة وبسملة | `AR_DHIKR_GOD`, `AR_DHIKR_NOUN`, `AR_TASBIH`, `AR_TAHMID`, `AR_TAHLIL`, `AR_TAKBIR`, `AR_ISTIGHFAR`, `AR_ISTIGHFAR_NOUN`, `AR_SALAT_NABI`, `AR_HAWQALA` |
| IBADAT-R13 | **Du'a included by reuse**: `isIbadatPassage` calls `isDuaPassage` from `scripts/dua.ts` — every passage the Du'a Browser counts is an act of worship here, with topic `dua`; the two detectors can never drift | `scripts/ibadat.ts` imports `isDuaPassage`; every id in `duas.json` `section:"quran"|"sunnah"` also in `ibadat.json` |
| IBADAT-R14 | Tilawa, tawba, ruqya signals: تلاوة/يتلو/ترتيل، توبة/يتوب/تائب/أناب، رقية/يرقي/استرقى | `AR_TILAWA`, `AR_TAWBA`, `AR_TUB`, `AR_RUQYA` |
| IBADAT-R15 | `ibadat_kind`: `act` when the passage performs or commands the worship (performing verbs, formulas, «إياك نعبد»), `mention` when it is only about it; du'a-only passages inherit the dua kind (formula → act); curated records carry `null` | `ibadatKindOf`, `ACT_SIGNALS`; `ibadat.json` rows carry `ibadat_kind`, `topics`, `signals` |
| IBADAT-R16 | `topics`: every passage lists the worship families it touches ∈ {ibada, salah, tahara, sawm, zakat, hajj, dhikr, dua, tilawa, tawba, ruqya} | `ibadatTopicsOf`, `SIGNAL_TOPICS`; a «أقيموا الصلاة وآتوا الزكاة» fixture carries both `salah` and `zakat` |
| IBADAT-R17 | Corpus classification: `work/quran` → quran; genre `sira` → seerah; genre `hadith` or `unit: hadith` → sunnah; everything else → books; works not yet harvested land correctly the day their genre is known | `ibadatCorpusOf` |
| IBADAT-R18 | Reuse before create: **no new record was needed** — `concept/ibada` (the umbrella), `practice/{salah,wudu,tayammum,sawm-ramadan,zakat,hajj,umrah,dhikr,dua,tawaf,sai,itikaf,istikhara,nadhr,tahajjud,qiyam-al-layl,…}` and the fiqh concepts already existed and were tagged in place; `concept/ibadat-al-asnam-jahiliyya` (idol worship) is NOT tagged | `grep -l "ibadat-browser" data/` hits 83 files under `data/practice/` and `data/concept/`; `npm run validate` 0 errors |
| IBADAT-R19 | Every tagged record keeps `sources`, `provenance` and its existing `status.review`; nothing new enters review except what a future wave writes | spot-check `data/practice/salah.yaml`, `data/concept/ibada.yaml` |

## 2. Corpus coverage (the founder's source list)

| Id | Requirement | How to check |
|---|---|---|
| IBADAT-R20 | **Qur'an**: every ayah carrying, commanding or mentioning worship — «أقيموا الصلاة وآتوا الزكاة»، «إياك نعبد» (1:5)، the fasting verses (2:183–185)، the hajj verses (2:196–203, 22:26–37)، «فاذكروني أذكركم» (2:152)، «سبحان الله»، «لا إله إلا الله»، «قل هو الله أحد»، the prophets' prayers, «إن الصلاة تنهى عن الفحشاء» (29:45) | `/api/v1/ibadat.json` `section:"quran"` items; `/ar/ibadat/` quran section cards; `passage/quran-1-5` carries `act` + topics `ibada` |
| IBADAT-R21 | **Sunnah**: the worship of the two Sahihs, the Muwatta and the Sunan — the books of Prayer, Tahara, Sawm, Zakat, Hajj and Adhkar in every collection, the morning/evening adhkar, istighfar, blessings on the Prophet | `section:"sunnah"` items; spot-check bukhari/muslim/muwatta prayer and dhikr passages link to their passage pages |
| IBADAT-R22 | **Seerah**: the section exists in the taxonomy and fills itself — any passage whose work carries genre `sira` lands in `seerah` automatically | `ibadatCorpusOf`; empty today — verify it renders nothing rather than erroring |
| IBADAT-R23 | **Harvested books**: every non-scripture, non-hadith, non-seerah work with a worship passage lands in `books`, classified by genre the day its passages arrive | `section:"books"`; future books appear without code changes (IBADAT-R03) |
| IBADAT-R24 | **Companions and Tabi'in**: their worship reports arrive through the same detector — Companion/Tabi'in reports are sunnah/book passages like any other; no separate pipeline needed | any `passage/*` from a sahaba/tabi'in work with «صلى/ذكر/استغفر» appears with its work label |
| IBADAT-R25 | **Curated layer**: 83 records in `section:"curated"` — 52 practices and 31 concepts covering all eleven worship families | `section:"curated"` → 83 items |

## 3. The browser page `/{lang}/ibadat/`

| Id | Requirement | How to check |
|---|---|---|
| IBADAT-R30 | Page exists in all three languages: `/ar/ibadat/`, `/en/ibadat/`, `/ur/ibadat/` | `curl -sI` each → 200 |
| IBADAT-R31 | Localized title «متصفح العبادات والأذكار» / "Worship and Adhkar Browser" / متصفح العبادات والاذکار + lede + badge + method note + status count + kind labels + topic labels | `i18n/{ar,en,ur}.yaml` `ibadat:` block; view each page |
| IBADAT-R32 | Section chips with counts, each linking to its anchor; every populated section shows title + description + card grid; empty sections do not render | `/ar/ibadat/` chip counts sum to item count |
| IBADAT-R33 | Every card links to the **ordinary entity page** (`/{lang}/passage/<slug>/` or `/{lang}/practice/<slug>/` or `/{lang}/concept/<slug>/`), never a browser-only page | inspect card `href`s on `/en/ibadat/` |
| IBADAT-R34 | Passage cards show work name + ref/unit and a text excerpt; the act/mention chip and the topic chips show on passage cards; curated cards show their summary | `/ar/ibadat/` sunnah cards carry the work/ref line and chips |
| IBADAT-R35 | Client filter narrows cards across labels, summaries, work names, excerpts, kind and topic labels in all three languages; Arabic vowel-insensitive; full list readable with JS off | `site/src/scripts/ibadat-filter.ts`; open `/ar/ibadat/` with JS disabled → full list; type «الصلاة» → filtered cards |
| IBADAT-R36 | Pagefind: title/lede/headings inside `data-pagefind-body`; card lists inside `data-pagefind-ignore` | page source carries both attributes; searching «العبادات» or "worship" reaches the page |
| IBADAT-R37 | WCAG 2.2 AA, RTL on ar/ur, Arabic parentheses isolated (U+2066/2069), no honorifics typed, `dir`/`lang` correct | validator + visual check |
| IBADAT-R38 | **Landing card** on the homepage («متصفح العبادات والأذكار») and **Explore menu** entry, in all three languages | homepage shows the card; `nav.ts` `{ key: "ibadat", ready: true }`; header explore menu lists it |

## 4. API and documentation

| Id | Requirement | How to check |
|---|---|---|
| IBADAT-R40 | `https://api.islam.museum/api/v1/ibadat.json` returns every detected + tagged record with `section`, `ibadat_kind`, `topics`, `signals`, `work`, `ref`, `unit`, `text`, `sura`, `aya`, `kind`, `themes`, `tags` | `curl -s .../ibadat.json \| jq '.items \| length'`; `feature: "ibadat-browser"`; `section` ∈ {quran,sunnah,seerah,books,curated}; `ibadat_kind` ∈ {act,mention,null} |
| IBADAT-R41 | Endpoint documented in `docs/data/README.md`, `site/public/openapi/v1.json` (`/ibadat.json` path), and `llms.txt` | all three rows exist |
| IBADAT-R42 | Registered in `docs/site/browsers.md` (feature + export rows), `docs/plan/00-README.md` (plan 51), `docs/agents/lanes.md` (`ibadat` lane), `docs/status.md`, `CANARY.md` (v1.23.0 + entries), `docs/plan/51-ibadat-browser.md`, this file | all rows present |
| IBADAT-R43 | `features-api.test.ts` asserts `ibadat.json` in the export set and its detection/classification rules (act vs mention, topics, false-god and احتجّ gates, du'a inheritance, future-book inclusion) | `npm test` green |

## 5. Governance and delivery

| Id | Requirement | How to check |
|---|---|---|
| IBADAT-R50 | Gates: `npm run validate` 0 errors, `npm test` all pass, `npm run build` clean | run them |
| IBADAT-R51 | Work shipped through PRs with canary entries; nothing committed directly to protected `main` | merged-PR list |
| IBADAT-R52 | **Full trilingual coverage**: every tagged record already carries `label`/`summary` in ar, en and ur; UI strings exist in all three `i18n` files in the same commit | `explore.pages.ibadat` + `ibadat:` blocks in all three yaml |
| IBADAT-R53 | Draft gate: no new record was authored, so nothing new enters review; tagged-in-place records keep their existing review status | `data/practice/dua.yaml` status unchanged beyond the added tags |
| IBADAT-R54 | Deploy readiness: nothing live until the founder deploys; on deploy the card + menu + page + API appear automatically | post-deploy check IBADAT-R30/R38/R40 |

## 6. Explicitly out of scope / known limits

- **Worship of other than God**: «يعبدون الأصنام/الأوثان/الطاغوت/الشمس/
  الكواكب» never counts; `concept/ibadat-al-asnam-jahiliyya` is not tagged.
- **The argument sense of حجّ**: «احتجّ/يحتجّ/احتجاج» and «حجة» (proof) are
  out — the patterns are word-initial so they cannot hit.
- **Da'wa is not worship**: «دعوة إلى» stays in the Du'a Browser's out-of-
  scope set and inherits here via `isDuaPassage`.
- **Rites of passage vs worship**: nikah, mahr, walima and kafala (social
  transactions) are not tagged; ritual practices (aqiqa, dafn, udhiyya,
  khitan) are tagged as devotional rites.
- **Ambiguous short forms** are intentionally conservative: bare «صام» or
  «طاف» with no context still counts when word-initial (they are unambiguous
  Arabic); missed edge cases are added to the detector in waves, never by
  hand-tagging passages.
- **Seerah depth**: the seerah section fills as seerah passages are
  harvested; the current corpus carries few sira-genre worship passages.
- Human read of all draft records is the only blocker to calling the feature
  finished for readers; everything else is mechanical.
