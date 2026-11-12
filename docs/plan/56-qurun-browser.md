# Qurun Browser — متصفح القرون والسنين والشهور الهامة والأشهر الحرم

Requested 12 Nov 2026 (founder, verbatim, abbreviated): build «متصفح القرون والسنين
والشهور الهامة والاشهر الحرم» listing every mention and every written report about
القرون والسنين والشهور الهامة والأشهر الحرم in the Qur'an, the seerah, the Sunnah,
Tabi'in and Companion stories and quotations, every book already harvested and every
book harvested later — with a landing-page box, navigation-menu entry, full detailed
prose, production-ready end-to-end delivery, and the requirements filed in engineering
documents so a later AI can test and validate it in production. Scope is only the
centuries/generations, the years and the important and sacred months.

## 1. Detection — `scripts/qurun.ts`

A guarded, corpus-aware lexicon over passage `text_search`/`text` only (labels and
summaries never count), joined to the canonical `mentions` edges:

- **Topics and kinds.** Fourteen topics, each `period` (a named span or month) or
  `mention` (the meta terms): `qurun` (القرون والأجيال), `sunnin` (السنين والأعوام),
  `named-years` (عام الفيل، عام الحزن، عام الوفود، عام الجماعة ونحوها), `shuhur`
  (الشهور والأشهر الاثنا عشر), `sacred` (الأشهر الحرم الأربعة)، `jahiliyya-time`
  (النسيء، أنساء العرب، شهور الجاهلية)، and the twelve month topics `muharram`,
  `safar`, `rabi`, `jumada`, `rajab`, `shaban`, `ramadan`, `shawwal`, `dhul-qada`,
  `dhul-hijja`. The strongest kind wins: any `period` topic marks the item a period.
- **Guards.** Ambiguous forms are gated or excluded: «رجب» patterns refuse the
  anthroponym ابن رجب; «صفر» needs month context (شهر/أشهر/هلال proximity) so «صفر
  اليدين» never counts; «سنة/سنين/عام/أعوام/شهر/أشهر» forms count in the general
  book corpus only when the time lexicon appears in the passage; «نسيء» counts only
  as the intercalation, not «نسيء» the deferment verb forms without the calendar
  sense; verified false positives drop out by id in `QURUN_TOPIC_EXCLUDE`.
- **Corpus awareness.** Qur'an, sunnah and seerah passages use narrower narrative
  patterns; the general book corpus requires the time lexicon in the window.
- **Mentions edges.** A passage whose graph `mentions` edge already names one of the
  browser's subjects joins the feed and the subject index without a lexical hit.
- **Future books.** The detector runs at build time over every `passage` node, so a
  book harvested later brings its time mentions automatically; no tagging needed.

## 2. Pages and index

`/[lang]/qurun/` (home, filter, five corpus sections — quran, sunnah, seerah, books,
curated — topic chips, subject index) and `/[lang]/qurun/<slug>/` subject pages built
from `site/src/lib/qurun.ts`; filtering is `site/src/scripts/qurun-filter.ts`, an
enhancement only. Title, lede and headings are indexed through `data-pagefind-body`.
Explore-menu entry in `site/src/lib/nav.ts` and a landing card in
`site/src/components/Landing.astro`; full i18n blocks in `i18n/ar|en|ur.yaml`.

## 3. API

`/api/v1/qurun.json` from `scripts/export-api.ts` — every detected passage plus the
`qurun-browser` curated records, with corpus section, kind (period/mention),
subjects/topics, work, ref, unit, text, sura/aya and edges; documented in
`site/public/openapi/v1.json`, `docs/data/README.md` and `llms.txt`; covered by
`scripts/features-api.test.ts` and `scripts/qurun.test.ts`.

## 4. Curated records

Thirty-four `qurun-browser`-tagged records: twenty-four existing records tagged in
place (the sacred-months complex, the calendar and year concepts, al-Nasi', the
Jahiliyya day/month names and the Persian months, the Ramadan and Dhu al-Hijja
clusters, 'Arafa and Tashriq, and the six named-year events) and ten new cited
concept records — `qurun-generations`, `muharram-month`, `safar-month`,
`rabi-months`, `jumada-months`, `rajab-month`, `shaban-month`, `ramadan-month`,
`dhul-qada-month`, `dhul-hijja-month` — each with trilingual label, summary and
prose sourced to the Fiqh Mawsu'a, al-Biruni's al-Athar al-Baqiya and the seerah.
All draft until a human reads them.

## 5. Acceptance spec

`docs/engineering/44-qurun-browser-requirements.md` (`QUR-R1..`). Lane `qurun`.
