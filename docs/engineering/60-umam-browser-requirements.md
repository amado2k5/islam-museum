# 59. Umam Browser — Requirements and Acceptance Tests

Original requirement (founder, verbatim): «متصفح ال أمم والأديان والطوائف والشعوب غير المسلمة
المذكورة فالقرآن والحديث وأثر وكتب الصحابة والتابعين — where it should list all the mentioned and
written that are in quran, see rah, sunna, tabi'een stories, quotes, mentioned and written in
books that were harvested and any future harvested book if it has a [mention]. Should be viewable
here. add a box for it on landing page and in navigation menus. make sure this is done end to end
and full detailed proses and make it ready for production at the end of this. this is only about
[non-Muslim nations] and everything mentioned about [them] anywhere in any of the sunni books or
quran or sunna or sera. find all the instances where [they] were mentioned or part of quotes from
quran, sunnah, Hadith, seerah or from sa7aba and tabi3een and add those stories, mentions, quotes,
details. also add this in engineering documents as the original requirements to allow AI later on
to test and validate it when it is in production.» Scope: all non-Muslim nations, religions,
sects and peoples, including pre-Islamic Arab polytheists. URL slug `umam`. Companion plan:
`docs/plan/68-umam-browser.md`.

## Acceptance tests (UMAM-R)

- **UMAM-R1 — Shared detector.** `scripts/umam.ts` exports `UMAM_SECTIONS`, `UMAM_TAG`,
  `umamTagSections`, `umamMembers`, `umamMatches`, `umamMatchesOfText`, `umamFold`,
  `umamCorpusOf`, `umamMentionCounts` and the guarded lexicon `UMAM_NAMES`. Membership comes from
  three paths only: `umam-browser` + `um-<section>` tags, forward `mentions` edges to a member,
  and the lexicon over non-Qur'an passage texts. There is no side list.
- **UMAM-R2 — Browser route.** `/ar/umam/`, `/en/umam/`, `/ur/umam/` build from
  `site/src/pages/[lang]/umam/[...page].astro` (paged via `pagedStaticPaths`); section sub-pages
  paginate. Check: `curl -s https://islam.museum/ar/umam/ | grep -q "متصفح الأمم"`; en and ur
  equivalents return 200 with their titles.
- **UMAM-R3 — Unique signature view.** The landing shows «خريطة عالم النصوص» — the world of the
  texts (`site/src/components/sig/UmamWorld.astro`): a pure-SVG manuscript map centred on Makka
  and Madina with Rum NW, Fars NE, Abyssinia SW, the People-of-the-Book band, the vanished
  nations below the horizon, named figures, lands, concepts, books and the far rim; every dot is
  a link. Check: the SVG contains `<a href` element children; no JavaScript is required to see
  members.
- **UMAM-R4 — Sections.** Ten sections in `UMAM_SECTIONS` order render with counts and
  descriptions: umam (recounted nations), adyan, tawaif, shuub, mushrikun, ayan, sukun, mafahim,
  kutub, dhikr. Each present on the landing with `id="t-<section>"` anchors.
- **UMAM-R5 — Qur'an coverage by edges, never by text.** Frozen `passage/quran-*` records join
  only through `mentions` edges; the detector never lexically scans Qur'an text
  (`n.data.work === "work/quran"` is excluded). Check: `/ar/umam/` dhikr rows include
  `passage/quran-*` ids; no prose file under `content/` contains ﴿ ﴾.
- **UMAM-R6 — Future harvests auto-surface.** A passage or work harvested later joins the browser
  the day its forward `mentions` edge to an Umam member lands — `dhikr` plus the target's
  sections — or when the guarded lexicon names a member in its text. No tagging step is needed.
  Check: `umamMembers` on a graph with a new edge grows by the source record.
- **UMAM-R7 — API.** `/api/v1/umam.json` is exported by `scripts/export-api.ts` with
  `feature: "umam-browser"`; each item carries compact node data, `sections`, per-corpus
  `mentions` counts, `connections`, `prose` languages and `tags`. Check:
  `curl -s https://islam.museum/api/v1/umam.json | head`.
- **UMAM-R8 — Discovery.** Exactly one `umam` entry in `explorePages`, grouped under `people` in
  `EXPLORE_GROUPS`; a landing card with its own SVG glyph and accent `#8a6d3b`
  (`site/src/components/Landing.astro`); `umam` rows in `BROWSER_ROWS`
  (`site/src/lib/browser-registry.ts`). Check: landing HTML contains `/umam/` and the explore
  group check passes.
- **UMAM-R9 — i18n.** `umam` blocks exist in `i18n/ar.yaml`, `i18n/en.yaml`, `i18n/ur.yaml` with
  title, lede, badge, method, per-section title+desc and the viz strings; `explore.umam` cards in
  all three. Check: each language page renders its own title, not a fallback.
- **UMAM-R10 — Trilingual prose.** Every curated member record has `content/{ar,en,ur}/<class>/<slug>.md`
  or shares a richer existing file; new prose carries `source_lang: ar`, translators markers on
  en/ur, and `{cite:...}` source references. Check: the audit reports zero curated members
  missing a language.
- **UMAM-R11 — Harvest tooling.** `scripts/harvest-umam-ocr.ts` mines `pages.json` scans with the
  40-word excerpt cap, Qur'an 4-gram and honorific guards, and per-book caps;
  `scripts/harvest-umam-hadithapi.ts` mines the hadith-api editions with the 55-word excerpt cap
  and dedup rules; `scripts/umam-audit.ts` prints section counts, silent members and the
  lexicon-only review list. Check: `npx tsx scripts/umam-audit.ts` exits 0 and prints `TOTAL`.
- **UMAM-R12 — Safety and voice.** No honorific formulas typed in data or prose; Qur'an text
  never typed (Tanzil frozen files only); Arabic parentheses inside Arabic text are isolated
  (U+2066/U+2069); the terrorist-organisation hard block passes (`npm run validate`);
  non-Muslim categories kept distinct and judgements attributed to sources.
- **UMAM-R13 — Pagefind.** The landing body carries `data-pagefind-body`; long repeated card
  lists carry `data-pagefind-ignore`; the filter works without JavaScript (full list is in the
  HTML). Check: `grep -q data-pagefind-body` on the built page.
- **UMAM-R14 — Accessibility.** The signature view is keyboard reachable (real `<a>` elements),
  has an `aria-label`, a text legend, and `prefers-reduced-motion` safe styling; the page is RTL
  correct in ar/ur.
- **UMAM-R15 — Production verification (for a later agent).** After deploy, verify:
  `curl -sI https://islam.museum/en/umam/` → 200; same for `/ar/` and `/ur/`;
  `curl -s https://islam.museum/api/v1/umam.json` → JSON with `feature: "umam-browser"` and a
  non-empty `items` array whose items carry `sections`; the landing page contains a section
  anchor `t-adyan` and a `mentions`-driven strip; Pagefind indexes the page (search "الأمم" on
  the site search). Report counts only from the live JSON.
