# 28 · Household of the Prophet Browser — requirements and production checklist

_The feature requirements for «متصفح بيت النبوة وآل النبي» (the Household of
the Prophet and the Prophet's family — everything mentioned about the
Prophet's household anywhere in the Qur'an, the Sunnah, the seerah and every
harvested book, including books harvested later), as requested by the founder
and delivered in `docs/plan/40-bayt-browser.md`. Written so any person or AI
agent can validate each requirement against production
(`https://islam.museum`, `https://api.islam.museum`) without reading the plan.
Every requirement has an id (`BAYT-R..`), a "how to check" line, and the
artifact that proves it._

## 0. The original request (verbatim)

> "megaplan
> Use microsd instead of Mac main drive
> get latest from main, clone the repo to a separate folder then start working
> on
>
> متصفح بيت النبوة وآل النبي
>
>   where it should list all the mentioned and written
>
>
> بيت النبوة وآل النبي
>
>
> that are in quran, see rah, sunna, tabi3een stories , quotes , mentioned and
> written in books that were harvested and any future harvested book if it has
> a بيت النبوة وآل النبي should be viewable here. add a box for it on landing
> page and in navigation menus. make sure this is done end to end and full
> detailed proses and make it ready for production at the end of this.
>
> this is only about بيت النبوة وآل النبي
>
> and everything mentioned about بيت النبوة وآل النبي anywhere in any of the
> sunni books or quran or sunna or sera
>
> find all the instances where بيت النبوة وآل النبي Were mentioned or part of
> quotes from quran, sunnah, Hadith, seerah or from sa7aba and tabi3een and
> add those stories, mentions, quotes, details
>
> also add this in engineering documents as the original requirements to allow
> AI later on to test and validate it when it is in production.
>
> you can use mac browser to browse to any web page, to get any information or
> download any books, you can use mac apple vision to OCR and then harvest
> those OCRd books or you can find any other online website that you can decide
> whether or not can be authentic and trusted as a source and get from it
> information to fully enrich and fill detailed proses
>
> when context is tight, just commit and push and continue
>
> do not wait for build/test or ci
>
> in the end commit, push, raise PR and merge it
> Then delete all the files and folder related to this work from the microsd"

Founder rulings recorded during planning (verbatim decisions):

- Scope is the whole bayt: «أهل البيت والعترة وبني هاشم وبنو عبد المطلب
  وأزواج النبي وبناته وأبناؤه وأحفاده والأئمة». Wife-name mentions are accepted
  even where some are narrator mentions («روت عائشة»), because the founder
  wants *everything mentioned*, not only subject-focused reports.
- Bounded graph completion: tag the existing curated records, add the missing
  core members, and mine the family chapters of al-Waqidi's *Kitab al-Maghazi*
  as the first seerah-corpus harvest — the unmined remainder of the book is
  documented in `docs/delegation/library/maghazi-waqidi.md`, not silently
  dropped.

## 1. Requirements

### Pages and surface

- **BAYT-R1 — Trilingual landing pages exist.** `/ar/bayt/`, `/en/bayt/` and
  `/ur/bayt/` render 200 on production. *Check:* fetch each URL; expect the
  page `<title>` «متصفح بيت النبوة وآل النبي» / "Household of the Prophet
  Browser" / «نبی کریم کے گھرانے اور آل کا براؤزر». *Artifact:*
  `site/src/pages/[lang]/bayt/index.astro`.
- **BAYT-R2 — Lede, status count, method note, section chips and filter.**
  Each page shows the lede, a status line with `{n}` records and `{s}`
  sections, the «منهج المتصفح» method block, chips for the seven sections, a
  filter input labelled «رشّح سجلات البيت» (and the en/ur equivalents), and a
  card grid. *Check:* view-source the page; all of the above are present in
  HTML. *Artifact:* `site/src/pages/[lang]/bayt/index.astro`,
  `i18n/{ar,en,ur}.yaml` (`bayt:` block).
- **BAYT-R3 — No-JS readability and Pagefind.** The full card list is in the
  static HTML (the `data-pagefind-ignore` region only wraps the interactive
  filter affordance, not the records); title, lede and headings carry
  `data-pagefind-body`. *Check:* disable JavaScript and confirm every card is
  still listed; search Pagefind for «أهل البيت» and confirm the bayt landing
  page appears. *Artifact:* `site/src/pages/[lang]/bayt/index.astro`.
- **BAYT-R4 — Cards link to real entity pages.** Every card links to the
  record's own page (`/passage/<slug>/`, `/person/<slug>/`, etc.) and shows
  work and reference for passage items. *Check:* click any card; the target
  resolves. *Artifact:* `site/src/pages/[lang]/bayt/index.astro`.
- **BAYT-R5 — Landing card and Explore menu.** The landing page shows a
  «متصفح بيت النبوة وآل النبي» card and the Explore menu lists «تصفّح بيت
  النبوة وآل النبي» in all three languages. *Check:* open `/{lang}/` and the
  nav; the card and menu entry exist and link to `/{lang}/bayt/`. *Artifact:*
  `site/src/components/Landing.astro`, `site/src/lib/nav.ts`,
  `i18n/{ar,en,ur}.yaml` (`explore.pages.bayt`).
- **BAYT-R6 — Accessibility.** WCAG 2.2 AA structure: labelled filter input,
  semantic headings, sufficient contrast, keyboard-operable filter. *Check:*
  run the repo axe scan (`npm run axe` against the built site) on `/ar/bayt/`;
  no new violations. *Artifact:* `site/src/pages/[lang]/bayt/index.astro`,
  `site/src/scripts/bayt-filter.ts`.

### Data, API and search

- **BAYT-R7 — Static API export.** `/api/v1/bayt.json` returns 200 and
  contains every detected passage and every `bayt-browser`-tagged record,
  each row with `section`, `work`, `ref`, excerpt, `kind`, `themes`, `tags`,
  `edges` and prose languages. *Check:* `curl https://api.islam.museum/api/v1/bayt.json`
  (or `site/public/api/v1/bayt.json` in the build); inspect a Qur'an row
  (`section: "quran"`), a hadith row (`section: "sunnah"`) and a person row
  (`section: "ahl"`). *Artifact:* `scripts/export-api.ts`,
  `site/public/api/v1/bayt.json`.
- **BAYT-R8 — Corpus sections are derived, not listed.** Passage rows are
  classified by work/genre/unit at build time: `work/quran` → `quran`;
  genre `hadith` or `unit: hadith` → `sunnah`; genre `sira` → `seerah`; all
  else → `books`. *Check:* the JSON rows for `passage/quran-*` all carry
  `section: "quran"`; Muwatta/Bukhari/Muslim/Sunan rows carry `"sunnah"`.
  *Artifact:* `scripts/bayt.ts` (`baytCorpusOf`).
- **BAYT-R9 — Qur'an coverage.** The household and wives verses are present:
  at minimum `quran-33-33` (purification), `quran-33-6` (wives),
  `quran-33-37`/`quran-4-128`/`quran-33-40` (Zayd–Zaynab reports),
  `quran-33-50`, `quran-66-5`, `quran-3-61`/`quran-3-64` (mubahala family),
  and every ayah the guarded lexicon detects. *Check:* filter
  `section === "quran"` in `bayt.json`; count ≥ 19; spot-check the ids above.
  *Artifact:* `scripts/bayt.ts`, `site/public/api/v1/bayt.json`.
- **BAYT-R10 — Sunnah coverage.** The flagship clusters are present: the
  thaqalayn report (`muslim-2408`), the hadith of the cloak (`muslim-2424`),
  «Fatima is a part of me» (`muslim-2449`), the household scene
  (`bukhari-2613`), Fadak (`bukhari-4033`), plus wives' and family hadiths the
  lexicon detects. *Check:* search `bayt.json` for those ids; all appear with
  `section: "sunnah"`. *Artifact:* `scripts/bayt.ts`,
  `site/public/api/v1/bayt.json`.
- **BAYT-R11 — Tagged curated records.** The family members, clan groups,
  wives, descendants and household events are tagged `bayt-browser` +
  `bayt-<section>`: `person/fatima`, `person/ali-ibn-abi-talib`,
  `person/hasan-ibn-ali`, `person/husayn-ibn-ali`, the Prophet's daughters,
  `person/khadija`, `person/abd-al-muttalib`, `person/abu-talib`,
  `person/abbas-ibn-abd-al-muttalib`, `person/hamza`,
  `person/jafar-ibn-abi-talib`, `person/umm-ayman`, the wife records
  (`aisha`, `hafsa`, `umm-salama`, `sawda-bint-zama`, `zaynab-bint-jahsh`,
  `umm-habiba-bint-abi-sufyan`, `juwayriya-bint-al-harith`,
  `maymuna-bint-al-harith`, `safiyya-bint-huyayy`, `maria-al-qibtiyya`,
  `zaynab-bint-khuzayma`), the imams line (`jafar-al-sadiq`,
  `muhammad-al-baqir`, `ali-al-rida`, `zayd-ibn-ali`),
  `group/ahl-al-bayt`, `group/banu-hashim`, `group/banu-al-muttalib`,
  `group/mothers-of-the-believers`, the mawaqif events (`ghadir-khumm`,
  `death-of-fatima-bint-muhammad`, `battle-of-karbala`,
  `fatima-inheritance-claim-fadak`, `sulh-of-fadak`,
  `marriage-of-fatima-and-ali`, the family death events), and the concepts
  (`mubahala`, `twelve-imams`). *Check:* `grep -l bayt-browser data/**/*.yaml`
  covers the list; the records appear under `ahl`, `mawaqif` and `concepts`
  in `bayt.json`. *Artifact:* `data/**` tag diffs.
- **BAYT-R12 — New records.** At least the previously-missing core members
  exist as draft records: `person/ummayma-bint-ali` and
  `person/fatima-bint-ali` (daughters of Ali and Fatima) with trilingual
  labels, summaries and prose. *Check:* `data/person/ummayma-bint-ali.yaml`,
  `data/person/fatima-bint-ali.yaml` and their `content/{ar,en,ur}/` files
  exist; `status.review: draft`. *Artifact:* those files.
- **BAYT-R13 — Perspectives labelled.** Contested material (who is Ahl
  al-Bayt, the imamate line) keeps the `perspectives` block with Sunni first.
  `group/ahl-al-bayt` already carries sunni/academic/shia-twelver
  perspectives; no record states a verdict. *Check:* inspect
  `group/ahl-al-bayt.yaml` and `concept/twelve-imams.yaml`; perspectives are
  labelled and cited. *Artifact:* those files.
- **BAYT-R14 — No honorifics typed; Arabic parentheses isolated.** No ﷺ or
  typed honorifics in new prose/data; every Arabic-script parenthetical uses
  U+2066…U+2069. *Check:* `npm run validate` passes (it enforces both);
  spot-grep new files. *Artifact:* repo validators.

### Future-harvest guarantee

- **BAYT-R15 — Automatic inclusion of future books.** Any passage record
  whose text matches the guarded lexicon appears in `bayt.json` with the
  correct section the day it lands — no manual tagging. *Check:*
  `scripts/features-api.test.ts` carries a fixture passage containing a
  registered family term and asserts it is exported with the right section;
  run `npm test`. *Artifact:* `scripts/bayt.ts`, `scripts/export-api.ts`,
  `scripts/features-api.test.ts`.
- **BAYT-R16 — Guarded lexicon.** Unambiguous terms (أهل البيت، العترة، آل
  النبي، آل محمد، بنو هاشم، الثقلين، غدير خم، فدك، التطهير) match directly;
  ambiguous names (فاطمة، زينب، صفية، ميمونة، سودة، ruqyah-like forms) count
  only in qualified forms or after the false-positive audit; generic «آل»/«أهل»/
  «سبط»/bare «البيت» do not match alone. *Check:* read `BAYT_*` constants in
  `scripts/bayt.ts`; the corpus audit in
  `docs/plan/40-bayt-browser.md` §audit records counts and exclusions.
  *Artifact:* `scripts/bayt.ts`.

### Seerah harvest

- **BAYT-R17 — Waqidi delegation documented.** The bounded harvest of
  al-Waqidi's *Kitab al-Maghazi* family chapters is specified in
  `docs/delegation/library/maghazi-waqidi.md` with the edition/source
  decision, the chapter list in scope, the citation rules, and the explicit
  statement of what remains unmined. A library manifest
  `docs/delegation/library/maghazi-waqidi.yaml` registers the work for future
  waves. *Check:* both files exist and name the in-scope chapters.
  *Artifact:* those files.
- **BAYT-R18 — Seerah section live.** `/ar/bayt/` shows the «في السيرة»
  section populated by the seerah-genre works already tagged
  (`work/kitab-al-maghazi`, `work/al-sira-al-nabawiyya-ibn-kathir`,
  `work/al-sira-al-nabawiyya-sallabi`, `work/fiqh-al-sira-al-buti`) and by
  any `sira`-genre passages as they land. *Check:* `bayt.json` rows with
  `section: "seerah"` ≥ 4; the seerah chip on the page is not empty.
  *Artifact:* `scripts/export-api.ts`, `site/public/api/v1/bayt.json`.

### Process and documentation

- **BAYT-R19 — Docs registers updated.** The feature is registered in
  `docs/site/browsers.md`, `docs/data/README.md`, `docs/plan/00-README.md`,
  `docs/plan/06-roadmap.md`, `docs/agents/lanes.md`, `docs/status.md`,
  `docs/coverage.md`, `site/public/openapi/v1.json` and `site/src/pages/llms.txt.ts`.
  *Check:* each file names the browser, the route and `/api/v1/bayt.json`.
  *Artifact:* the listed files.
- **BAYT-R20 — Gates green.** `npm run validate` reports 0 errors, `npm test`
  passes, `npm run build` succeeds; `CANARY.md` carries the v1.13.0 entry.
  *Check:* run the three commands on `main` after merge; inspect `CANARY.md`
  top block. *Artifact:* CI/local runs, `CANARY.md`.
- **BAYT-R21 — Production smoke.** After deploy, all of BAYT-R1..R12 spot
  checks pass against `https://islam.museum` and
  `https://api.islam.museum`; record the smoke result in
  `docs/status.md`. *Check:* the checklist above executed against production.
  *Artifact:* `docs/status.md` note.
