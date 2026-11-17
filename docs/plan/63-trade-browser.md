# Plan 63 — Trade Browser (متصفح قافلة الشتاء والصيف وطريق الحرير وتجارة المسلمين)

_Requested by the founder 16 November 2026: "start working on متصفح قافلة
الشتاء وألصيف و طريق الحرير و تجارة المسلمين where it should list all the
mentioned and written that are in quran, see rah, sunna, tabi3een stories,
quotes, mentioned and written in books that were harvested and any future
harvested book if it has a متصفح قافلة الشتاء وألصيف و طريق الحرير و تجارة
المسلمين should be viewable here. add a box for it on landing page and in
navigation menus. make sure this is done end to end and full detailed proses
and make it ready for production at the end of this. this is only about
متصفح قافلة الشتاء وألصيف و طريق الحرير و تجارة المسلمين and everything
mentioned about it anywhere in any of the sunni books or quran or sunna or
sera. find all the instances where it were mentioned or part of quotes from
quran, sunnah, Hadith, seerah or from sa7aba and tabi3een and add those
stories, mentions, quotes, details. also add this in engineering documents
as the original requirements to allow AI later on to test and validate it
when it is in production."_

Founder scope answers (same session, via clarifying questions): slug
**`trade`** → `/{lang}/trade/`; Explore-menu group **`places`** (with
journeys, maps, battles); **three topic chips** — `caravans` (قافلة
الشتاء والصيف), `silk-road` (طريق الحرير), `trade` (تجارة المسلمين); the
agent raises the PR and merges it; work happens on the microSD clone and
the folder is deleted after merge. Arabic title: «متصفح قافلة الشتاء
والصيف وطريق الحرير وتجارة المسلمين». Requirements and acceptance spec:
`docs/engineering/55-trade-browser-requirements.md`.

## 1. What it is

A browser over the one graph that gathers everything the museum's sources
say about the Quraysh winter and summer caravans (the ilaf of Surah
Quraysh), the Silk Road and the trade roads, and Muslim trade — markets,
merchants, goods, weights and measures, caravan and maritime commerce —
in the Qur'an, the Sunnah, the seerah, Companion and Tābiʿīn reports, and
every harvested book, present and future. It follows the Du'a Browser /
Islamic Economy Browser architecture: passages are ordinary graph nodes
found at build time by a shared detector; curated records carry the
`trade-browser` tag; there is no side table and no second list.

The key mechanism: **passages are not tagged — they are detected.**
`scripts/trade.ts` matches a guarded, context-gated Arabic lexicon over
each passage's own `text_search`/`text` — never labels or summaries,
which are museum metadata. A mention in a book harvested next month
appears here the day its passage record lands — the founder's "any future
harvested book" requirement, met by the detector rather than by tagging.

## 2. Scope — the three topics and their boundaries

Every item carries zero or more topic chips from `caravans`, `silk-road`
and `trade`:

- **caravans — قافلة الشتاء والصيف**: the ilaf (إيلاف، لإيلاف، إيلاف
  قريش), «رحلة الشتاء والصيف» and its halves, قافلة/قوافل, the caravan
  vocabulary (عير gated — the caravan of Badr fame or the town of 'Ir;
  ركب gated — the mounted company or a knee; هودج/محمل gated), and the
  way-stations (رباط، سراي، خان، خانقاه، قافلنسراي gated — خان is also a
  title; رباط is also a frontier post; قيصرية strong).
- **silk-road — طريق الحرير**: طريق الحرير and the other named trade
  roads (طريق البخور/اللبان/التوابل/العنبر/اللؤلؤ، طرق التجارة/القوافل),
  the Silk Road oasis cities (سمرقند، بخارى، خوارزم، مرو، نيسابور، بلخ،
  ترمذ، فرغانة، كاشغر، ختن، طشقند، سغد، ما وراء النهر — gated beside
  silk/road/trade collocations so conquest narratives do not false-hit),
  China in trade context (الصين gated, «اطلبوا العلم ولو في الصين»
  vetoed), and transit goods gated beside routes and marts.
- **trade — تجارة المسلمين**: تجارة/تاجر/تجار/متجر strong, بضاعة/سلعة
  strong, سوق/أسواق gated, بازار strong, بيع/شراء gated beside trade
  collocations, ربح/كساد/رواج gated, ثمن/سعر/قيمة/غلاء/رخص gated, cargo
  and shipping (حمولة/شحنة، ميناء/مرفأ، سفينة/مركب/فلك/ملاح/ربان gated
  beside cargo-and-sea collocations), weights and measures (مكيال/كيل/
  صاع/أوقية/رطل/قفيز/قسطاس, ميزان gated with an eschatological-scale
  veto), the named merchants (نخاس، سمسار، جهبذ، بزاز، عطار، دلال،
  بقال), حلف الفضول, the Jahili markets (عكاظ، مجنة، ذي المجاز،
  حباشة، أسواق العرب/الجاهلية), octroi and customs (مكوس/جمارك/عشار
  gated, the «عشرة/اثنا عشر» number veto), trade contracts shared with
  the Islamic Economy browser (مضاربة/قيراض/مشاركة/مرابحة/استصناع/
  جعالة/معاوضة/مساقاة/مزارعة gated), the spice and incense trade
  (لبان، بخور، كندر، توابل، عنبر، مسك، زعفران، قرنفل، فلفل، قرفة،
  هيل gated beside trade/ports collocations), silk as a traded fabric
  (حرير، ديباج، قز، إبريسم، استبرق، سندس، طراز gated — «طريق الحرير»
  vetoed so it lands under silk-road only), and travel-for-trade
  (سفر/رحلة gated beside تجارة/قافلة/بضاعة collocations).

Out of scope (verified, documented in the requirements spec): usury,
debt, zakat-on-wealth, treasury and fiscal dues as an economics
regulation topic — the Islamic Economy browser owns those (overlap on
shared trade vocabulary is expected and harmless: one passage may appear
in both browsers); war booty and spoils distribution (battles domain);
plain charity and gifts; travel with no trade context (hajj journeys,
migrations); «عشرة» numbers; the eschatological Scale.

## 3. The build

- `scripts/trade.ts` — the detector: `TRADE_TAG`, `TRADE_SECTIONS`
  (quran, sunnah, seerah, books, curated), `TRADE_TOPICS` (caravans,
  silk-road, trade), the signal table (strong/weak/context/veto, weak
  tokens stripped before the context test), `TRADE_EXCLUDE` id set,
  `tradeSignalsOf`, `tradeTopicsOf`, `isTradePassage`, `tradeCorpusOf`
  (work/quran → quran; genre sira → seerah; genre hadith or unit hadith →
  sunnah; else books), `tradeTagSection`, `tradeTagTopics`.
- `site/src/lib/trade.ts` — `tradeItems` over `realNodes`: tag OR
  detector; each item carries node, section, topics, work.
- `site/src/pages/[lang]/trade/[...page].astro` — the browser home:
  badge, lede, method note, API link, signature view, section chips,
  topic-chip filter, client filter, FullFilter, card grid per section,
  PagedNav, DraftMark; `data-pagefind-body` on the header block and
  `data-pagefind-ignore` on the lists.
- `site/src/components/sig/TradeRoutes.astro` — the signature view
  «الطرق الثلاثة»: a schematic (not-to-scale, captioned as such) map of
  the winter road south to Yemen (Mecca–Taif–Sanaa–Aden), the summer
  road north to al-Sham (Mecca–Petra–Gaza–Busra–Damascus) and the Silk
  Road east (Baghdad–Nishapur–Merv–Bukhara–Samarkand–Kashgar–Xi'an);
  every waypoint is a real `place/` record link; hover/focus/tap readout
  via `site/src/scripts/sig-trade.ts`.
- `site/src/scripts/trade-filter.ts` — client filter + topic chips.
- `scripts/tag-trade.py` — curated tagger: `trade-and-finance` theme
  AUTO pass plus explicit TARGETS (ilaf/caravan cluster, silk-road
  cluster, trade cluster).
- `scripts/trade-mentions.ts` — `mentions` edges from detected passages
  to the topic anchors (caravans → `concept/ilaf`, silk-road →
  `journey/silk-road`, trade → `concept/trade-in-islam`), citing each
  passage's own first source; idempotent.
- Registration rows: `site/src/lib/nav.ts` (key + places group),
  `site/src/lib/browser-registry.ts`, `site/src/components/Landing.astro`
  (card accent `#8a6a2f` + caravan-route thumbnail), `llms.txt.ts`,
  `scripts/export-api.ts` (`trade.json`, feature `trade-browser`),
  `scripts/features-api.test.ts`, `site/public/openapi/v1.json`,
  `docs/data/README.md`, `docs/site/browsers.md`,
  `docs/site/signature-views.md`, `scripts/check-weight.ts`,
  `docs/agents/lanes.md`, `docs/status.md`, `CANARY.md`,
  `docs/plan/00-README.md`, `docs/plan/06-roadmap.md`.
- New records created only where the graph has none: `concept/ilaf`
  (the Quraysh ilaf — the winter and summer caravans) and
  `journey/silk-road` (the Silk Road), each with sources and trilingual
  prose; existing records (`concept/trade-in-islam`, the route places,
  `invention/caravanserai-network`, the trade instruments) are tagged in
  place — reuse before create.

## 4. Ship

Founder's standing instructions for this lane: commit and push when
context is tight; do not wait for build/test or CI; open the PR and merge
it; delete the microSD clone after the merge. `npm run validate` still
runs locally once as the schema/extremism gate.
