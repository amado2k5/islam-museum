# Qurun Browser — production requirements

Original request (founder, 12 Nov 2026, verbatim, condensed): «متصفح القرون والسنين
والشهور الهامة والاشهر الحرم» — a browser listing all the mentioned and written
material about القرون والسنين والشهور الهامة والأشهر الحرم in the Qur'an, the seerah,
the Sunnah, Companion and Tabi'i stories and quotations, every book already
harvested and any future harvested book; a box on the landing page and in the
navigation menus; done end to end with full detailed prose, ready for production;
the requirements filed in engineering documents so a later AI can test and validate
it in production. Scope is only the centuries, the years, the important months and
the sacred months.

Each requirement carries an id (`QUR-Rn`) for the production smoke list.

- **QUR-R1.** `/[lang]/qurun/` renders for every published language without
  JavaScript: title, lede, five corpus sections (quran, sunnah, seerah, books,
  curated), every item as a card linking its entity page, per-card work and ref.
  Pagefind indexes title/lede/headings via `data-pagefind-body`.
- **QUR-R2.** `/api/v1/qurun.json` exists; every record has `section` ∈ the five
  corpora, `qurun_kind` ∈ {period, mention, null} and `topics`/`subjects`; passages
  carry work/ref/unit/text/sura/aya and graph edges.
- **QUR-R3.** Every passage whose text names an unambiguous time term (القرون،
  الأشهر الحرم، اثنا عشر شهرا، رمضان، محرم، صفر، ربيع، جمادى، رجب، شعبان، شوال،
  ذو القعدة، ذو الحجة، عام الفيل، عام الحزن، عام الوفود، النسيء…) is a
  `qurun.json` record.
- **QUR-R4.** Ambiguous forms count only beside their guards: «صفر» beside month
  context, «رجب» never for ابن رجب, «نسيء» only as intercalation, and the generic
  سنة/عام/شهر/قرن forms in the book corpus only beside the time lexicon.
- **QUR-R5.** Verified false positives stay out — each id in
  `QURUN_TOPIC_EXCLUDE` is absent from its excluded topic — and the letter-boundary
  patterns keep «جنة»-style collisions and personal names out of the topics.
- **QUR-R6.** A book harvested later brings its time mentions automatically: the
  detector runs at build time over `text_search`/`text` of every `passage` node; no
  tagging is needed. Smoke: any new passage containing «الأشهر الحرم» or «محرم»
  appears in `qurun.json` under the right topic.
- **QUR-R7.** Canonical `mentions` edges join the feed: a passage that mentions
  `concept/al-ashhur-al-hurum`, a month concept or a named-year event in the graph
  appears even with no lexical hit, and lands on the matching subject page.
- **QUR-R8.** Every `qurun-browser`-tagged record appears in the `curated` section
  and in the subjects index; the ten new month/generation records carry trilingual
  label, summary and prose (ar, en, ur) citing defined sources, `status.review:
  draft` until a human reads them.
- **QUR-R9.** Every subject page `/[lang]/qurun/<slug>/` renders the passages that
  mention that subject (lexical or `mentions`-edge) and links the ordinary entity
  page; the subject index on the home page lists every subject with a count.
- **QUR-R10.** Navigation and landing: the Explore menu in every language links
  `/[lang]/qurun/`; the landing page shows the Qurun Browser card; `llms.txt`,
  `openapi/v1.json` and `docs/data/README.md` describe the endpoint; the feature is
  registered in `docs/site/browsers.md`, `docs/plan/00-README.md`,
  `docs/agents/lanes.md` and `docs/status.md` with a `CANARY.md` entry.
- **QUR-R11.** Gates green at ship: `npm run validate` (0 errors), `npm test`
  (all pass), `npm run build` succeeds; `scripts/qurun.test.ts` and the qurun
  expectations in `scripts/features-api.test.ts` pass.
