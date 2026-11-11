# Four Madhhabs Browser — requirements and production acceptance test

«متصفح المذاهب الأربعة» — the museum's browser over the four Sunni legal schools: the four
imams and the schools they founded, the other schools the tradition recorded, the salaf and
tabi'in forebears, the canonical books, the fiqh/usul concepts, and every mention of the
madhhabs in the Qur'an-related corpus, the Sunni books, the harvested books and every future
harvested book. Plan: `docs/plan/39-madhahib-browser.md`. Lane: `madhahib`
(`docs/agents/lanes.md`). Implemented in `site/src/pages/[lang]/madhahib/`,
`site/src/lib/madhahib.ts`, `scripts/madhahib.ts`, `scripts/export-api.ts` (`madhahib.json`).

This file is the acceptance spec: each numbered requirement states what must be true, how to
check it against the production site, and what the expected result is. Any agent or reviewer
can run the checks verbatim. Numbers marked *(derived)* are computed from the graph at build
time — they can only grow as waves land, so test against *at least* the baseline values, or
better, against the numbers the graph build reports.

Base URL for checks: `https://islam.museum` (or the current production domain).

## 1. Scope requirement (the original brief, verbatim)

The founder's request of 10 November 2026, kept verbatim so any future agent can validate the
shipped browser against it:

> "start working on متصفح المذاهب الأربعة where it should list all the mentioned and written
> المذاهب الأربعة that are in tabi3een stories, quotes, mentioned and written in books that were
> harvested and any future harvested book if it has a المذاهب الأربعة should be viewable here.
> add a box for it on landing page and in navigation menus. make sure this is done end to end
> and full detailed proses and make it ready for production at the end of this. this is only
> about المذاهب الأربعة and everything mentioned about المذاهب الأربعة anywhere in any of the
> sunni books. find all the instances where المذاهب الأربعة were mentioned or part of quotes from
> sa7aba and tabi3een and add those stories, mentions, quotes, details. also add this in
> engineering documents as the original requirements to allow AI later on to test and validate
> it when it is in production."

Founder decisions recorded in the same session (they bound the interpretation of the brief):

- The browser is a **topic hub**, not a raw dump of every lexical hit: the corpus carries
  ~18,000 madhhab-related matches, most of them ordinary fiqh statements («عند الحنفية…»);
  the browser lists the schools, their people, works, stories, quotes and the works/passages
  that discuss the schools — curated by tags and `mentions` edges, never every occurrence.
- **Other schools are included but labelled**: Zahiri, Ja'fari and Ibadiyya records appear in
  the `ukhra` («مذاهب أخرى») section, never presented as members of the four.
- Work happened on a microSD clone (`/Volumes/exmicroSD/islam-museum-madhahib`, deleted after
  merge); the shared harvest corpus stayed at `/Volumes/exmicroSD/islam-museum-harvest`.
- Mining depth: "everything now" — every harvested book containing «المذاهب الأربعة» and its
  variants was processed in waves as far as the session allowed.

- **R1** The browser covers **the four Sunni madhhabs** — Hanafi, Maliki, Shafi'i, Hanbali —
  and everything the museum records about them: the imams, the school groups, their scholars,
  canonical books, the salaf/Tabi'i forebears, the concepts, stories, quotes and mentions —
  as graph records inside the one graph, never a side table.
  Check: `curl -s https://islam.museum/api/v1/madhahib.json | python3 -c "import json,sys; d=json.load(sys.stdin); items=d if isinstance(d,list) else d['items']; print(len(items))"` → `>= 60` (baseline at first ship; the number grows with every wave).
- **R2** **Future harvested books surface automatically** through two mechanical paths, no code
  change: (a) any `work`, `passage`, `media`, `event`, `exhibit` or `question` record whose
  `mentions` edge targets `group/{hanafi,maliki,shafii,hanbali,zahiri,jafari}-madhhab`,
  `group/ibadiyya` or `concept/madhhab` joins `dhikr` (and the school/`ukhra` section for the
  school targets); (b) a `source`-class record — outside the `mentions` domain — joins through
  `madhahib-browser` + `mh-<section>` tags. Both contracts are documented in
  `docs/plan/39-madhahib-browser.md` §2 and the `madhahib` lane row.
  Check: `grep -n "mentions" schema/predicates.yaml` → domain `[work,passage,media,event,exhibit,question]`;
  `scripts/madhahib.ts` `MENTION_SECTIONS` is the target→section table; re-run
  `npm run graph && npm run api` after adding a test `mentions` edge and the record appears in
  `site/public/api/v1/madhahib.json`.
- **R3** **The four imams and the four schools are present**: `person/{abu-hanifa,
  malik-ibn-anas, al-shafii, ahmad-ibn-hanbal}` and `group/{hanafi,maliki,shafii,
  hanbali}-madhhab` are members; the imams sit in `aima` and their school section.
  Check: the API items include all eight ids, each with `aima` or the school section.
- **R4** **Other schools are labelled, not conflated**: `group/{zahiri-madhhab,
  jafari-madhhab, ibadiyya}` and their founders appear only in `ukhra`.
  Check: `curl -s https://islam.museum/api/v1/madhahib.json` → those ids' `sections` contain
  `ukhra` and never `hanafi|maliki|shafii|hanbali|aima`.
- **R5** **Tabi'in stories, quotes and mentions**: the browser carries the Successors'
  statements about ijtihad, ra'y, qiyas and the imams as cited record content — at minimum the
  salaf forebears (`mh-salaf`) and the `dhikr` corpus of books that record them.
  Check: `dhikr` section count `>= 30` at first ship; `salaf` section lists the forebear
  records (`ibrahim-al-nakhai`, `al-hasan-al-basri`, `sufyan-al-thawri`, `al-awzai`, … as they
  exist in the graph).

## 2. Pages exist and render in all three languages

- **R6** The landing page exists at `/{lang}/madhahib/` for `lang ∈ {ar, en, ur}` and returns
  HTTP 200. `curl -sI https://islam.museum/en/madhahib/ | head -1` → `200`; repeat `/ar/`, `/ur/`.
- **R7** Pages are readable with JavaScript disabled: title, lede, section headings, cards and
  summaries are all in the HTML. The filter (`madhahib-filter.ts`) is progressive enhancement.
- **R8** The landing page is indexed for site search: its HTML carries `data-pagefind-body`
  around title, lede and headings; «Four Madhhabs Browser» / «متصفح المذاهب الأربعة» /
  «چاروں فقہی مذاہب کا براؤزر» is findable via `/{lang}/search/`.
- **R9** Long card lists carry `data-pagefind-ignore` so Pagefind does not index thousands of
  duplicate card texts.

## 3. Taxonomy — ten sections

- **R10** Sections are exactly `MADHABIB_SECTIONS` in `scripts/madhahib.ts`:
  `aima, hanafi, maliki, shafii, hanbali, ukhra, salaf, kutub, mafahim, dhikr` — in that
  display order. Each section shows its record count and links its cards.
- **R11** The section set is data-driven: a record re-tagged between `mh-*` sections moves on the
  next build; a record carrying several `mh-*` tags or several qualifying `mentions` targets
  appears in each of its sections; `mentions → group/<school>-madhhab` adds both the school
  section and `dhikr`; `mentions → concept/madhhab` adds `dhikr` only.
- **R12** Membership is computed at build time by `madhahibMembers(nodes, edges)` in
  `scripts/madhahib.ts`, shared by `site/src/lib/madhahib.ts` and `scripts/export-api.ts` —
  one definition, no duplicated logic.

## 4. Content rules the browser must obey

- **R13** Graph-backed only: every listed record is an ordinary entity (`person`, `group`,
  `work`, `concept`, `source`, `passage`, `event`, `question`, `exhibit`, `media`). No side
  table, no second dataset, no page-only dataset, no duplicated entities to fill sections.
- **R14** Edges are registered predicates only (`mentions`, `founder_of`, `member_of`,
  `authored`, `related_to`, …), each written once on the record that owns it, with cited
  `sources:`.
- **R15** Every record cites defined `data/source/` records; `status.review: draft` with a
  `provenance` block until a human promotes it.
- **R16** Arabic first: `label.ar` and `summary.ar` on every record; `en` and `ur` shipped in
  the same commit.
- **R17** No honorifics typed into prose or data fields; Arabic-script parentheses wrapped in
  U+2066…U+2069; no Qur'an text typed — verses enter only as frozen `passage/quran-*` records.
- **R18** Quotes from the corpus stay within the 40-word cited-quotation limit; book text is
  rewritten in museum prose, never reproduced.
- **R19** Content safety: the extremism hard block stays at 0 errors — no madhhab record
  touches a blocked organisation.
- **R20** Other schools are labelled: `ukhra` records carry their own tradition
  (`sunni-zahiri`, `shia-*`, `ibadi`, … per `schema/enums/traditions.yaml`); nothing in
  `ukhra` is presented as one of the four.

## 5. Navigation and discovery

- **R21** The Explore menu contains a «Four Madhhabs Browser» entry in all three languages
  (`explore.pages.madhahib` in `i18n/{ar,en,ur}.yaml`), linking `/{lang}/madhahib/`.
- **R22** The landing page shows a dedicated card (title + lede), separate from every other
  browser card, via `explorePages(lang)` in `site/src/lib/nav.ts` — which feeds both
  `site/src/components/Landing.astro` and `site/src/layouts/BaseLayout.astro`.
- **R23** The browser is registered in `docs/site/browsers.md` (row with routes, plan link,
  counts), `docs/status.md`, `docs/agents/lanes.md` (`madhahib` lane),
  `docs/plan/39-madhahib-browser.md`, the plan index (`docs/plan/00-README.md`),
  `docs/plan/06-roadmap.md`, and `CANARY.md` (reader-facing entry per commit; new feature ⇒
  minor version bump).

## 6. API

- **R24** `GET /api/v1/madhahib.json` returns 200 with the JSON of every browser member —
  *(derived)* `>= 60` items at first ship. Each item carries id, class, trilingual label,
  summary, `sections`, kind/traditions/themes/tags where present, `connections` and `prose`
  languages.
  `curl -s https://islam.museum/api/v1/madhahib.json | python3 -c "import json,sys; d=json.load(sys.stdin); items=d if isinstance(d,list) else d['items']; print(len(items))"` → `>= 60`.
- **R25** The endpoint is registered in `scripts/export-api.ts`, documented in
  `docs/data/README.md`, `site/public/openapi/v1.json` and `llms.txt`, and appears in
  `scripts/features-api.test.ts`'s expected list.
- **R26** The export is generated at build time from the graph — never a hand-written file —
  and stays separate from every other feature export.

## 7. Gates

- **R27** `npm run validate` → 0 errors. `npm test` → all pass. `npm run coverage` →
  regenerated with data changes. `npm run build` → the madhahib routes render in all three
  languages.
- **R28** Every change appends a reader-facing entry to `CANARY.md` in the same commit.
- **R29** Attribution trailers `AI-Agent:`, `AI-Model:`, `AI-Editor:` on every commit
  (`.githooks/pre-commit` enforces).

## 8. Data state at first ship (regression baseline)

| Metric | Value | Check |
|---|---|---|
| Browser members | >= 60 (grows with waves) | `madhahib.json` count |
| Sections | 10 (`aima hanafi maliki shafii hanbali ukhra salaf kutub mafahim dhikr`) | landing page headings |
| The four imams + groups | 8 records present in `aima`/school sections | R3 |
| Other schools | zahiri, jafari, ibadiyya in `ukhra` only | R4 |
| Languages | ar + en + ur on every record, page, nav string | R6/R16 |
| Mentions corpus | `dhikr` >= 30 works/passages/questions | R5 |

## 9. Known open items (not defects)

- All records are `status.review: draft` — awaiting human read before publication tier.
- Content waves continue: tabi'in quotes, more `mentions` edges as the remaining ~70 hit
  books are mined, and missing formative-generation scholars as sources document them — each
  lands as ordinary tagged records or edges, no page change needed.
- `mentions` edges are written on `work`/`source` records for harvested books; per-page
  `passage` records join automatically if a future lane writes passage-level mentions.
