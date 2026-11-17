# 58. Sport Browser — Requirements and Acceptance Tests

Original requirement (founder, verbatim): «متصفح الفروسية والسباحة والرماية وجميع رياضات ومنافسات
المسلمون — list all the mentioned and written that are in quran, seerah, sunna, tabi'een stories,
quotes, mentioned and written in books that were harvested and any future harvested book should be
viewable here. add a box for it on landing page and in navigation menus. end to end, full detailed
process, ready for production.» Scope: everything including modern; dedicated `sport` class; URL
`/sport/`. Companion plan: `docs/plan/66-sport-browser.md`.

## Acceptance tests (SPORT-R)

- **SPORT-R1 — Class registered.** `sport` ∈ `CLASSES` in `scripts/lib.ts`; `schema/sport.schema.json`
  exists (generated); `class.sport` labels in all three i18n files.
- **SPORT-R2 — Browser route.** `/[lang]/sport/` builds for ar, en, ur from
  `site/src/pages/[lang]/sport/[...page].astro`; subject/entity pages resolve at
  `/[lang]/sport/<slug>/` via the generic entity routes.
- **SPORT-R3 — Discovery.** Explore menu holds exactly one `sport` entry (nav group completeness
  check enforces it); landing page shows a sport card via `explorePages`.
- **SPORT-R4 — Auto-ingestion.** `scripts/sport.ts` detector matches sport passages at build time
  across eight guarded families; a passage harvested later with sport vocabulary joins
  `/api/v1/sport.json` and the sections with no side list. Detector exports
  `isSportPassage`, `sportSignalsOf`, `sportTopicsOf`, `sportCorpusOf`, `sportTagSection`.
- **SPORT-R5 — API.** `/api/v1/sport.json` exported; `scripts/features-api.test.ts` expects it;
  each passage item carries `section`, `topics`, `signals`.
- **SPORT-R6 — Seeds.** ≥17 `sport` records (the Prophetic trio, contests, games, hunting, the
  Ottoman grounds, a modern sport), ≥5 `event` contest records, ≥10 existing records tagged
  `sport-browser` in place.
- **SPORT-R7 — Content rules.** No typed Qur'an text (only `passage/quran-*` refs); no honorifics;
  Arabic parentheses isolated; every record cites defined source ids; `status.review` and
  `provenance` present on new records.
- **SPORT-R8 — i18n.** `sport:` page block and `explore.pages.sport` in ar/en/ur; counts, section
  titles, topics and kinds resolve in all three languages.
- **SPORT-R9 — Signature view.** `sig/SportFields.astro` ships, is decorative-abstract (no
  figurative depiction), readable without JavaScript.
- **SPORT-R10 — Validation.** `npm run validate` reports 0 errors.
- **SPORT-R11 — Production.** Merged to `main`; `/{lang}/sport/` reachable on the live site; the
  microSD working copy deleted after merge confirmation.
