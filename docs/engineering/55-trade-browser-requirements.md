# 55 · Trade Browser — requirements and production checklist

_The feature requirements for «متصفح قافلة الشتاء والصيف وطريق الحرير
وتجارة المسلمين» (the Trade Browser — everything the museum's sources
mention or write about the Quraysh winter and summer caravans, the Silk
Road, and Muslim trade, across the Qur'an, the Sunnah, the seerah,
Companion and Tabi'i reports and every harvested book), as requested by
the founder on 16 November 2026 and delivered in
`docs/plan/63-trade-browser.md`. Written so any person or AI agent can
validate each requirement against production (`https://islam.museum`,
`https://api.islam.museum`) without reading the plan. Every requirement
has an id (`TR-R..`), a "how to check" line, and the artifact that proves
it._

## 0. The original request (verbatim)

> "megaplan
> Use microsd instead of Mac main drive
> get latest from main, clone the repo to a separate folder then start working on
>
> متصفح قافلة الشتاء وألصيف و طريق الحرير و تجارة المسلمين
>
>   where it should list all the mentioned and written
>
>
> متصفح قافلة الشتاء وألصيف و طريق الحرير و تجارة المسلمين
>
>
> that are in quran, see rah, sunna, tabi3een stories , quotes , mentioned
> and written in books that were harvested and any future harvested book if
> it has a
>
>
> متصفح قافلة الشتاء وألصيف و طريق الحرير و تجارة المسلمين
>
>
> should be viewable here. add a box for it on landing page and in navigation
> menus. make sure this is done end to end and full detailed proses and make
> it ready for production at the end of this.
>
> this is only about
>
> متصفح قافلة الشتاء وألصيف و طريق الحرير و تجارة المسلمين
>
>
> and everything mentioned about
>
> متصفح قافلة الشتاء وألصيف و طريق الحرير و تجارة المسلمين
>
>
> anywhere in any of the sunni books or quran or sunna or sera
>
> find all the instances where
>
>
> متصفح قافلة الشتاء وألصيف و طريق الحرير و تجارة المسلمين
>
>
> Were mentioned or part of quotes from quran, sunnah, Hadith, seerah or
> from sa7aba and tabi3een and add those stories, mentions, quotes, details
>
> also add this in engineering documents as the original requirements to
> allow AI later on to test and validate it when it is in production.
>
> you can use mac browser to browse to any web page, to get any information
> or download any books, you can use mac apple vision to OCR and then harvest
> those OCRd books or you can find any other online website that you can
> decide whether or not can be authentic and trusted as a source and get from
> it information to fully enrich and fill detailed proses
>
> when context is tight, just commit and push and continue
>
> do not wait for build/test or ci
>
> in the end commit, push, raise PR and merge it
> Then delete all the files and folder related to this work from the microsd"

Founder scope answers (same session, via clarifying questions): slug
**`trade`** → `/{lang}/trade/`; Explore-menu group **`places`**; **three
topic chips** — `caravans` (قافلة الشتاء والصيف), `silk-road` (طريق
الحرير), `trade` (تجارة المسلمين); the agent raises the PR and merges it;
the microSD clone is deleted after merge. Follow-up instructions in the
same session: "make sure you write full detailed proses", "make sure the
page UI is unique just like the other browser/explorer pages", "you will
raise the PRs and merge them too".

## 1. Graph and data model

| Id | Requirement | How to check |
|---|---|---|
| TR-R01 | No new class or side table: every browser record is an ordinary graph node — passages detected at build time, curated records tagged `trade-browser` (+ optional `trade-<topic>` / `trade-<section>`) | `grep -rl "trade-browser" data/`; `scripts/lib.ts` `CLASSES` unchanged |
| TR-R02 | Five corpus sections derived from the work, not a topic list: `quran` في القرآن · `sunnah` في السنة · `seerah` في السيرة · `books` في سائر الكتب · `curated` السجلات المنتقاة | `TRADE_SECTIONS` in `scripts/trade.ts`; `site/src/lib/trade.ts` |
| TR-R03 | Three topic chips on every record: `caravans` (قافلة الشتاء والصيف), `silk-road` (طريق الحرير), `trade` (تجارة المسلمين); a record may carry several | `TRADE_TOPICS`; `tradeTopicsOf` (passages) / `tradeTagTopics` (curated); `/api/v1/trade.json` `topics` arrays |
| TR-R04 | **Automatic inclusion of future harvested books**: a caravan/road/trade mention in any book enters the browser the day its passage record lands — detection is a build-time function of the compiled graph, never a hand-kept list | add a fixture passage containing «قافلة» or «طريق الحرير» to a test work, run `npm run graph && npx tsx scripts/export-api.ts`, confirm it appears in `trade.json` with the right `section`/`topics`; then remove the fixture |
| TR-R05 | Detection is over passage-owned text only (`text_search`, `text` fallback) — never labels or summaries, so a chapter named «كتاب التجارة» does not create false hits | `tradeSignalsOf` in `scripts/trade.ts`; a fixture passage whose label names trade but whose text does not must NOT be detected |
| TR-R06 | Arabic diacritics and tatweel are stripped before matching; patterns tolerate clitic prefixes and pronoun suffixes | fixture «لِإِيلَـٰفِ قُرَيْشٍ» (fully vocalised) is detected |
| TR-R07 | Caravan signals — unambiguous forms: إيلاف/لإيلاف/إيلاف قريش، رحلة الشتاء والصيف and each half, قافلة/قوافل, قيصرية | `scripts/trade.ts`; spot-check `passage/quran-106-1`..`quran-106-4` cards |
| TR-R08 | Caravan signals — gated ambiguous forms: «عير» (the caravan or the town of 'Ir — needs caravan/trade collocations), «ركب» (the company or a knee/riding — needs caravan collocations plus a verb veto), «هودج/محمل» gated, «رباط/سراي/خانقاه» gated, «خان» (the inn or a khan's title — needs way-station collocations plus a named-khans veto) | weak+context pattern pairs; fixture «ركب الرجل دابته» → not detected; «ركب قافلة إلى الشام» → detected |
| TR-R09 | Silk-road signals: طريق الحرير and the named trade roads strong; the oasis cities (سمرقند، بخارى، خوارزم، مرو، نيسابور، بلخ، ترمذ، فرغانة، كاشغر، ختن، سغد، ما وراء النهر) gated beside silk/road/trade collocations so conquest narratives do not false-hit; الصين gated beside trade collocations with «اطلبوا العلم ولو في الصين» vetoed; transit goods gated | fixture «فتحت سمرقند» alone → not detected; «طريق الحرير» → detected with `silk-road` topic |
| TR-R10 | Trade signals — unambiguous: تجارة/تاجر/تجار/متجر، بضاعة/سلعة، بازار، حلف الفضول, the Jahili markets (عكاظ، مجنة، ذي المجاز، حباشة، أسواق العرب/الجاهلية), the measures block (مكيال، أوفوا الكيل، المطففين، قسطاس، صاع، أوقية، رطل، قفيز), the named merchants (نخاس، سمسار، جهبذ، بزاز، عطار، دلال، بقال) | spot-check `passage/quran-83-1` (مطففين), `passage/quran-9-111`-area trade verses |
| TR-R11 | Trade signals — gated: «سوق/أسواق», «بيع/شراء/باع/اشترى», «ربح/كساد/رواج», «ثمن/سعر/قيمة/غلاء/رخص», cargo and ports (حمولة، شحنة، ميناء، مرفأ، مرسى), ships (سفينة، مركب، فلك، ملاح، ربان gated beside cargo-and-sea collocations), «ميزان/كيلة» gated with the eschatological-Scale veto, customs (مكوس، جمارك، عشار gated with the عشرة-numbers veto), trade contracts (مضاربة، قيراض، مشاركة، مرابحة، استصناع، جعالة، معاوضة، مساقاة، مزارعة), spice/incense goods (لبان، بخور، توابل، عنبر، مسك، زعفران، قرنفل، فلفل، قرفة، هيل), silk fabric (حرير، ديباج، قز، إبريسم، استبرق، سندس، طراز — «طريق الحرير» vetoed), travel-for-trade (سفر/رحلة gated) | fixture «سافر القوم إلى الحج» → not detected; «سافر للتجارة» → detected |
| TR-R12 | Known false positives excluded by id in `TRADE_EXCLUDE`: every verified wrong hit from the sampling pass | `TRADE_EXCLUDE`; none of these ids in `trade.json` |
| TR-R13 | Out-of-scope senses verified absent: usury/debt/zakat/fiscal as an economics topic (Islamic Economy browser), war booty (battles), plain charity and gifts, travel with no trade context, «عشرة» numbers, the eschatological Scale | fixture «غنيمة»/«زكاة»/«ركب الرجل» passages → not detected as trade; spot-check the Islamic Economy browser still owns riba |
| TR-R14 | `mentions` edges: every detected passage gains `mentions` edges to its topic anchors — caravans → `concept/ilaf`, silk-road → `journey/silk-road`, trade → `concept/trade-in-islam` — each citing the passage's own first source; a multi-topic passage gets several edges; no duplicate edges (script `scripts/trade-mentions.ts`, idempotent) | `grep -l "journey/silk-road" data/passage/*.yaml \| wc -l` ≥ silk-road-topic count; `npm run validate` 0 errors |
| TR-R15 | Corpus classification: `work/quran` → quran; genre `sira` → seerah; genre `hadith` or `unit: hadith` → sunnah; everything else → books; works not yet harvested land correctly the day their genre is known | `tradeCorpusOf`; seerah/books sections render correctly today |
| TR-R16 | Reuse before create: existing topic records tagged in place (`concept/trade-in-islam`, the route places, `invention/caravanserai-network`, the trade instruments, the `trade-and-finance` theme concepts); `concept/ilaf` and `journey/silk-road` created only with defined sources — never invented citations | `grep -l "trade-browser" data/` inventory; `npm run validate` 0 errors |
| TR-R17 | Every record carries `sources` and `provenance`; AI-generated prose is trilingual in the same commit | spot-check the new/changed files |

## 2. Corpus coverage (the founder's source list)

| Id | Requirement | How to check |
|---|---|---|
| TR-R20 | **Qur'an**: every ayah on trade, caravans, weights/measures and honest dealing is listed — Surah Quraysh (106:1–4, the ilaf and the two journeys), «أوفوا الكيل والميزان بالقسط» (6:152, 17:35), the Mutaffifin block (83:1–3), «تجارة تخشون كسادها» (61:10), the ships-and-sea-trade verses (e.g. 2:164, 35:12, 16:14, 30:46, 45:12, 55:24, 23:22, 17:66), «ليبتغوا من فضل الله» travel-for-trade verses (73:20, 62:10, 2:198) | `/api/v1/trade.json` `section:"quran"` items; spot-check `passage/quran-106-1`, `passage/quran-83-1`, `passage/quran-61-10` cards |
| TR-R21 | **Sunnah**: the trade/caravan/market reports of the two Sahihs, the Muwatta and the Sunan — «رحم الله رجلاً سمحاً إذا باع وإذا اشترى وإذا اقتضى», the ban on meeting the rukban (تلقي الركبان), the truthful-trustworthy merchant hadiths, the 'Ir caravan of Badr, market and measure reports | `section:"sunnah"` items; spot-check known market hadith cards link to their passage pages |
| TR-R22 | **Seerah**: the section exists in the taxonomy and fills itself — any passage whose work carries genre `sira` lands in `seerah` automatically (the ilaf narratives, the 'Ir of Badr, the Jahili markets, the Prophet's own trade journeys) | `tradeCorpusOf`; verify it renders rather than erroring |
| TR-R23 | **Harvested books**: every non-scripture, non-hadith, non-seerah work with a topic passage lands in `books`, classified by genre the day its passages arrive — geography and travel books (al-Muqaddasi, Ibn Battuta, Yaqut), histories and the fiqh corpus | `section:"books"` items; future books appear without code changes (TR-R04) |
| TR-R24 | **Companions and Tabi'in**: their stories, quotes and mentions arrive through the same detector — Companion/Tabi'in reports are sunnah/book passages like any other; no separate pipeline needed | any `passage/*` from a tabi'in work with «قافلة»/«سوق»/«طريق الحرير» appears with its work label |
| TR-R25 | **Curated layer**: tagged records in `section:"curated"` — the ilaf and Silk Road concepts, the route places (Mecca to Xi'an), the caravanserai/khan records, the trade instruments and markets, `trade-and-finance` theme records | `section:"curated"` → N items; `trade-browser` tags verified on each |

## 3. The browser page `/{lang}/trade/`

| Id | Requirement | How to check |
|---|---|---|
| TR-R30 | Page exists in all three languages: `/ar/trade/`, `/en/trade/`, `/ur/trade/` | `curl -sI` each → 200 |
| TR-R31 | Localized title «متصفح قافلة الشتاء والصيف وطريق الحرير وتجارة المسلمين» / "Trade Browser — the Winter and Summer Caravans, the Silk Road and Muslim Trade" / Urdu equivalent + lede + badge + method note + status count + topic labels | `i18n/{ar,en,ur}.yaml` `trade:` blocks; view each page |
| TR-R32 | Section chips with counts, each linking to its anchor; every populated section shows title + description + card grid; empty sections render nothing | `/ar/trade/` chip counts sum to item count |
| TR-R33 | Topic chips render on every card that carries them (caravans/silk-road/trade labels in the page language) | inspect cards on `/en/trade/` |
| TR-R34 | Every card links to the **ordinary entity page** (`/{lang}/passage/<slug>/` or `/{lang}/concept/<slug>/` etc.), never a browser-only page | inspect card `href`s |
| TR-R35 | Passage cards show work name + ref/unit (e.g. «صحيح مسلم · 1556»، «القرآن · 106:1») and a text excerpt; curated cards show their summary | `/ar/trade/` cards carry the work/ref line and topic chips |
| TR-R36 | Client filter narrows cards across labels, summaries, work names, excerpts and topic labels in all three languages; Arabic vowel-insensitive; full list readable with JS off | `site/src/scripts/trade-filter.ts`; `/ar/trade/` with JS disabled → full list |
| TR-R37 | Pagefind: title/lede/headings inside `data-pagefind-body`; card lists inside `data-pagefind-ignore` | page source carries both attributes |
| TR-R38 | WCAG 2.2 AA, RTL on ar/ur, Arabic parentheses isolated (U+2066/2069), no honorifics typed, `dir`/`lang` correct | validator + visual check |
| TR-R39 | **Landing card** on the homepage (with caravan-route thumbnail) and **Explore menu** entry under the `places` group, in all three languages | homepage shows the card; `nav.ts` `{ key: "trade", ready: true }`; header explore menu lists it |
| TR-R40 | **Unique signature view** «الطرق الثلاثة» (`site/src/components/sig/TradeRoutes.astro`): a schematic, captioned-as-such map of the three roads — winter south to Yemen (Mecca–Taif–Sanaa–Aden), summer north to al-Sham (Mecca–Petra–Gaza–Busra–Damascus), Silk Road east (Baghdad–Nishapur–Merv–Bukhara–Samarkand–Kashgar–Xi'an); every waypoint is a real `place/` link with a hover/focus/tap readout; complete without JavaScript | view `/ar/trade/`; dots link to `/ar/place/<slug>/`; `site/src/scripts/sig-trade.ts` adds the readout only |

## 4. API and documentation

| Id | Requirement | How to check |
|---|---|---|
| TR-R41 | `https://api.islam.museum/api/v1/trade.json` returns every detected + tagged record with `section`, `topics`, `signals`, `work`, `ref`, `unit`, `text`, `sura`, `aya`, `kind`, `themes`, `tags`, `connections`, `prose` | `curl -s .../trade.json \| jq '.items \| length'`; `feature: "trade-browser"`; `section` ∈ {quran,sunnah,seerah,books,curated}; `topics` ⊆ {caravans,silk-road,trade} |
| TR-R42 | Endpoint documented in `docs/data/README.md`, `site/public/openapi/v1.json` (`/trade.json` path), and `llms.txt` | all three rows exist |
| TR-R43 | Registered in `docs/site/browsers.md` (feature + export rows), `docs/site/signature-views.md`, `docs/plan/00-README.md` (plan 63), `docs/plan/06-roadmap.md`, `docs/agents/lanes.md` (`trade` lane), `docs/status.md`, `CANARY.md`, `docs/plan/63-trade-browser.md`, this file | all rows present |
| TR-R44 | `features-api.test.ts` asserts `trade.json` in the export set and its detection/classification/exclusion rules (topics, corpus sections, false-positive gates, future-book inclusion) | `npm test` green |

## 5. Governance and delivery

| Id | Requirement | How to check |
|---|---|---|
| TR-R50 | Gates: `npm run validate` 0 errors; tests and build run by CI on the PR (the founder's standing instruction for this lane is not to await them locally) | run them / CI result |
| TR-R51 | Work shipped through a PR with canary entries; nothing committed directly to protected `main`; the agent merges the PR per the founder's instruction for this lane | merged-PR list |
| TR-R52 | **Full trilingual coverage**: every new record carries `label`/`summary`/prose in ar, en and ur; UI strings exist in all three `i18n` files in the same commit | `i18n/{ar,en,ur}.yaml` `trade:` blocks present in the same commit |
| TR-R53 | Draft gate: new records enter `status.review` with `provenance` (published where they meet the publication standard — defined sources + provenance block, per the 15-Nov ruling); tagged-in-place records keep their existing review status | `data/concept/ilaf.yaml`, `data/journey/silk-road.yaml` status + provenance |
| TR-R54 | Deploy readiness: nothing live until the founder deploys; on deploy the card + menu + page + API appear automatically | post-deploy check TR-R30/R39/R40/R41 |
| TR-R55 | **microSD workspace**: work happened on the microSD clone at `/Volumes/exmicroSD/islam-museum` and the folder is deleted after merge; the Mac main drive's `~/Documents/GitHub/uber_eats/islam-museum` working tree is untouched | `ls /Volumes/exmicroSD/islam-museum` → absent after cleanup |

## 6. Explicitly out of scope / known limits

- **Economics regulation is not this browser**: riba, debt, zakat-on-wealth,
  treasury and fiscal dues belong to the Islamic Economy browser
  (`docs/plan/47`); passages may appear in both where the vocabulary
  overlaps — that is expected, not a bug.
- **War booty is not trade**: «فيء»، «غنيمة»، «الأنفال» belong to the
  battles domain and are excluded by design.
- **Plain giving is not trade**: «صدقة»، «هبة»، «نذر» stay out.
- **Travel without trade stays out**: hajj journeys, migrations and
  campaigns match only when trade collocations are present.
- **Ambiguous short forms are conservative by design**: bare «عير»،
  «ركب»، «خان»، «سوق»، «سفر»، «رحلة»، «فلك»، «حرير»، «الصين»، «عشر»،
  «ميزان» count only beside their domain collocations; misses are added
  to the detector in waves, never by hand-tagging passages.
- **The signature map is schematic**: «الطرق الثلاثة» draws the three
  roads for reading, not to geographic scale; the caption says so.
- **Seerah depth**: the seerah section fills as seerah passages are
  harvested; the current corpus may have few sira-genre trade passages.
