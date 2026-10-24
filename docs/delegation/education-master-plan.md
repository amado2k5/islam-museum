# Education master plan: audit and phased roadmap (Stage 1)

_Written 23 October 2026 by Claude (Claude Fable 5.1) at the founder's request (the "Education master plan" brief of 23 October 2026). Status: **proposal, awaiting the founder's approval phase by phase.** Nothing in this document has been built. Stage 2 (building) starts only for the phases the founder approves in writing, and each approved phase is then run as its own lane (section 11)._

Change-gate label for this document itself: `non-impacting` (a planning document; no code, data, i18n or policy file is touched). Every phase below carries its own label in its spec. Two of them touch the privacy posture or the documentation the submissions link to and are marked `submission-impacting` where that is so (`docs/ai-change-gates.md` §3).

Binding owner decisions this plan implements (23 October 2026):

1. **Full coverage, all ages, five bands with their own paths:** Sprouts 4–6 · Explorers 7–9 · Storytellers 10–12 · Scholars 13–15 · Researchers 16–18, each with its own hub, route family, visual identity and content ladder, fronted by one Education front door that routes by age, plus separate teacher and parent surfaces.
2. **Trilingual, always:** every new surface ships in Arabic, English and Urdu together; a phase is not done until all three are live and verified. Urdu output of every phase is flagged for the owner's own review in the hand-off.

House rules that bound every idea (restated as checks in section 3): static only, no accounts, no tracking, no cookies, no student data; never break anything; Arabic first with full RTL for Arabic and Urdu; WCAG 2.2 AA and readable without JavaScript; strict page-weight budgets; child safety by design (no chat, no comments, no user-generated public content, no ungated external links, no ads, adult surfaces on separate routes); no typed Qur'an or honorifics; Sunni default frame with labelled views and no rulings; no depictions of prophets or people in generated scenes.

---

## 1. Audit: what exists today (read-only; nothing was changed)

Measured in this worktree on 23 October 2026 (branch `claude/islam-museum-education-plan-48575d` at `411b5f758`, equal to `origin/main`). Counts are of files in the repository, not of the deployed site; the founder deploys by hand, so the live site may lag by a day.

### 1.1 Inventory of education routes

| Surface | Routes (per language; ×3 for ar/en/ur) | Who it serves | Data behind it | Client state (localStorage key) | Print | Readable without JS |
|---|---|---|---|---|---|---|
| **Kids' Wing hub** «جناح الصغار» | `/{lang}/sighar/` | 4–12, parents | `kids/bridge.yaml` (8 bridge cards) | none | partial | yes |
| Word Garden + bee quiz | `/sighar/garden/` | 7–9 | `cards/wordmap/*.json` with `"kids": true` (1 of 4 maps) | `kids-bee-score`, `kids-quest-stars` | bloom panel only | yes (quiz needs JS) |
| Prophet Quest | `/sighar/quest/` | 7–9 | `kids/quest-stops.yaml` (5 stops, 1 choice each, warm feedback) | `kids-quest-stars` | no | yes |
| Kindness Quest | `/sighar/kindness/` | 7–9 | `kids/deeds.yaml` (30 deeds) | stickers | yes (fridge chart, server-rendered) | yes |
| Bedtime Stories | `/sighar/stories/` | 4–9 read-aloud | `kids/stories.yaml` (5 retellings, same 5 prophets as the quest); audio gated on file existence (0 files published) | none | no | yes |
| Sprouts Garden / Sprouts Quest | `/sighar/sprouts-garden/`, `/sighar/sprouts-quest/` | 4–6 | `sprout` one-liners on the 5 quest stops | none (stateless by rule) | no | yes |
| Retell | `/sighar/retell/` | 10–12 | `kids/retell.yaml` (3 prompts × 5 stops) | autosave | yes | yes (printing needs an adult) |
| Values Journal | `/sighar/journal/` | 10–12 | none | `kids-journal` (≤ 500 entries) | yes | read-only without JS |
| Build-a-Mosque | `/sighar/mosque/` | 7–12 | `kids/mosque-parts.yaml` (7 parts, real example buildings) | `kids-mosque-parts`, `kids-mosque-name` | yes | yes |
| Little Time Machine | `/sighar/timemachine/` | 7–12 | `kids/eras.yaml` (5 eras × 4 events, every event cites a real entity) | `kids-eras-visited` | no | yes |
| **Teacher's Kit** | `/sighar/teachers/`, `/teachers/lessons/{unit}` (6), `/teachers/paths/{path}` (3), `/teachers/pilot/` | teachers of 4–12 | `kids/lessons.yaml` (6 × 40-minute plans: objectives, flow, discussion, worksheet), `kids/paths.yaml` (3 paths), `kids/pilot.yaml` (4 weeks, contact is a visible `TODO`) | none | worksheets, plans | yes |
| Classroom mode | `?classroom=1` on every kids page (`site/src/scripts/classroom.ts`, 0.8 KB) | teachers | none | none (URL only) | n/a | degrades to normal page |
| **Tour / Learn** «جولة وتعلّم» | `/{lang}/learn/` (chooser), `/{lang}/exhibit/path-*/` (player) | newcomers, "students" | 301 `exhibit` records: 299 `trail`, 1 `lesson`, 1 `tour`; audience tags: student 300, newcomer 298, family 1, teacher 0, researcher 0; authored `goal`/`outcomes`/`next`: 0 (derived in the UI) | `pathway:<id>` position | yes (handout prints the whole route) | yes (ordered list) |
| **Museum Cards** «بطاقات المتحف» | `/{lang}/cards/` + `wordmaps`, `lists`, `explainers`, `stories`, `challenge`, daily card | general, 10+ | 4 word maps, 13 lists (flip decks), 14 explainers (stepper, decision tree, timeline, compare), 9 stories (stations), 1 thirty-day challenge (12 habits), 1 daily series | challenge grid | challenge only | yes |
| **Surah Map** «خريطة السورة» | `/{lang}/surah/`, `/surah/{slug}/` (114) | 10+ | `surah-maps/*.yaml` (114) | none | no | yes (sections listed) |
| **3D tour** | `/{lang}/3d/` | general | `tour/journeys.yaml` (7 journeys) | none | no | yes (fallback list) |
| Timeline, graph, maps | `/{lang}/time/`, `/graph/`, entity `MiniMap` | general | 4,352 events; schematic MENA basemap only (`site/src/data/basemap-mena.json`, 304 KB source, bbox 18–72°E, 4–46°N) | none | n/a | yes |
| Search | `/{lang}/search/` | general | Pagefind from R2 + `search-synonyms.*.json` | none | n/a | no (search needs JS) |

Totals: the Kids' Wing is 22 pages per language (66 pages), 10 data files (111 KB of YAML), one stylesheet (`kids.css`, 27.7 KB raw) and 142 UI strings in the `kids:` block of each `i18n/*.yaml` (ar/en parity is tested; the Urdu block carries the same keys but no test checks it). It has been built in six phases over 16–18 October 2026 by one agent ("Muse"), with Urdu added on 18 October.

### 1.2 Evidence (numbers, not adjectives)

**Page weight (what a ten-year-old Chromebook downloads).** Measured from the sources in this worktree and from the dev server (section 1.6 gives the per-route table). The constants that matter:

| Asset | Size | Loaded on |
|---|---|---|
| Arabic and Urdu web fonts preloaded above the fold (Noto Naskh Arabic 400 + Amiri 400, woff2) | 52.7 KB + 108.6 KB = **161 KB** | every ar/ur page, cached after the first |
| Latin web fonts (Source Serif 4 + Inter, woff2) | 20.1 KB + 23.7 KB = 44 KB | every en page |
| `global.css` (raw source; minified at build) | 56.1 KB | every page |
| `kids.css` (raw) | 27.7 KB | every kids page |
| Largest kids script (`mosque.ts`, raw) | 7.2 KB | Build-a-Mosque |
| `surah-map.ts` (raw) | 11.8 KB | Surah Map |
| three.js 0.160 (`three.module.min.js`), loaded lazily after "Enter" | **671 KB** | 3D tour only |

Conclusion: the kids pages are already light (a few KB of JavaScript each, no framework); the fixed cost of every Arabic or Urdu page is the 161 KB of fonts on first visit. The 3D tour is the one surface that cannot meet a school-device budget and must stay out of every child and teen route.

**Depth of content.** 35,810 data records (brief said 34,747; the dossier of 21 October says 33,578: the number moves daily). Prose files: 22,882 Arabic, 22,641 English, 22,626 Urdu. Classes relevant to teaching: 8,605 people, 4,352 events, 1,692 places, 5,595 buildings, 517 objects, 1,598 concepts, 9,546 passages (of which 1,222 carry an ordered isnad `chain`), 1,459 works, 220 questions. Only **2** questions carry a `perspectives` block, **1** record carries `tensions`, **0** carry `opinions` (plan 20): the multi-view structures that a teen debate layer needs are designed but almost unpopulated.

**Media usable in games.** 467 `media/photo-*` records, all of **objects** (228 CC0 from the Met and Cleveland, 187 V&A non-commercial via IIIF, 56 Wikimedia Commons); **0** photographs of buildings or places. 1,349 AI illustrations under `/art/` (1,191 art, 147 architecture, 11 patterns); 136 of them link a related entity; 100 of 1,349 have English and Urdu alt text, the rest Arabic only (an open compliance item in `docs/status.md`). A "Where am I?" game therefore has 147 architecture illustrations to draw on today, not photographs.

**Tests that protect education surfaces.** `scripts/kids.test.ts` (29 tests: file existence, ar/en parity, no typed honorifics, 44 px targets and reduced motion in `kids.css`, printable chart, build-breaker guards), `scripts/cards.test.ts` (4), `scripts/tour.test.ts` (6). `scripts/check-site.ts` has **no** assertion about any education route. **No** test anywhere measures page weight. No test checks Urdu parity of the kids strings (the parity test covers ar/en).

### 1.3 Where a child gets stuck or bored (completion points, from reading the code)

1. **The hub asks an 8-year-old to choose among 18 doors** (3 band cards, 7 activity cards, 8 bridge cards) and never says "do this next". No band has its own page: all three share `/sighar/`.
2. **Prophet Quest ends in "play again".** Five stops, a finale, and the only onward control restarts. The stars it awards are read by the Word Garden and by nothing else.
3. **Progress is nine unrelated keys.** `kids-quest-stars`, `kids-bee-score`, `kids-mosque-parts`, `kids-eras-visited`, `kids-journal`, the kindness stickers, the retell autosave, the cards challenge grid and `pathway:<id>` never meet. Nothing can show a child what they have done across the wing.
4. **Storytellers (10–12) have two activities and both are writing tasks** (Retell, Journal) built on the same five prophet stories as the 7–9 band. A 12-year-old who wants to *read* is sent through the bridge cards into adult pages set at a 68-character measure with no level control.
5. **The Teacher's Kit sits inside the children's chrome** as the fifth of seven cards on the kids hub, under the Hudhud topbar. No QR code, no per-lesson short URL, no answer key, no grade or curriculum mapping, no PDF. The pilot guide's contact line is a visible `TODO`.
6. **Learn trails have no age, no level and no check.** All 301 are tagged `student`; `goal`, `outcomes` and `next` are unfilled; a trail ends when the list ends. Nothing tells a learner whether they understood.
7. **Cards flip and nothing else.** Thirteen decks with flip and prev/next, a quiz on the word maps only, no match, no type-the-answer, no printable deck, no review schedule. The 30-day challenge depends on the visitor remembering to return.
8. **After 12, nothing.** No route, string or data file in the repository addresses a 13–18-year-old.

### 1.4 Corrections to the brief, from the evidence

- **Explorers 7–9 is not missing; it is the fullest band** (Word Garden, Prophet Quest, Kindness Quest, Bedtime Stories). What is missing is a hub route and a ladder for *every* band; Storytellers 10–12 is the thin one (two activities). The plan completes all three young bands rather than "the missing Explorers path".
- **"80 card pages"**: 41 content items × 2 languages ≈ 82 at the time the brief was written; with Urdu since 21 October it is about 123 content pages plus hubs.
- **A "Debate Hall" design does not exist under that name.** The nearest designs are "Debates: curated pairs presented as perspectives" (`docs/plan/04-experience.md` §4), the tension card (`docs/plan/14-themes-atlas.md`) and opinions (`docs/plan/20-opinions.md`). With 2 perspective blocks and 1 tension in the data, dilemma cards must be authored, not mined.
- **There is no world map.** The museum's only map is a schematic MENA basemap; MapLibre and PMTiles are in the architecture plan but not installed. A map-first Explorers home needs a new, light world SVG (Natural Earth 110m, public domain, about 60–80 KB) rather than a tile stack.
- **Surah Map auto-play exists** (`surah-map.ts`: one section every 2.8 s with pan) and is the right base for narrated story cards.
- **"Classroom live quiz" cannot aggregate answers** without a server. Static means the teacher's screen cannot know what students tapped on their own devices; the plan builds the Kahoot *feeling* (big countdown, projected question, reveal, per-device score, show of hands) and says so plainly.

### 1.5 Gaps, in one list

No front door; no band hubs; no teen wing; no progression layer; no leveled reading; no curriculum mapping; no mastery checks; no study modes beyond flip; no printable packs as a first-class output; no QR or short URLs; no share cards; no fact engine; no daily game; no teacher-query landing pages; no page-weight test; no Urdu parity test; Urdu register not yet reviewed by a native reader anywhere in the wing.

### 1.6 Measured page weights (dev server, this worktree)

Measured with the Astro dev server (unminified; the Vite client and HMR script are excluded from the numbers; production HTML is smaller and compressed at the edge, so these are **upper bounds**). Fonts are listed once above and not repeated here.

| Route (Arabic unless noted) | HTML markup, production estimate (dev page minus inlined CSS and dev tooling) | of which inline SVG | CSS the page needs (raw, before minification; shared and cached in production) | Whole dev page, gzip | Links on the page | Note |
|---|---|---|---|---|---|---|
| `/ar/sighar/` (hub) | 69 KB | 22 KB (one Hudhud) | 100 KB (global + kids) | 29 KB | 75 | 18 doors |
| `/ar/sighar/quest/` | **163 KB** | **102 KB** (five Hudhud copies, one per stop) | 100 KB | 31 KB | 54 | an SVG `<symbol>`/`<use>` sprite would cut about 80 KB |
| `/ar/sighar/mosque/` | 118 KB | 54 KB | 105 KB | 31 KB | 53 | |
| `/ar/sighar/timemachine/` | 119 KB | 54 KB | 104 KB | 32 KB | 54 | |
| `/ar/sighar/teachers/` | 49 KB | 7 KB | 100 KB | 27 KB | 71 | |
| `/ar/sighar/teachers/lessons/quest/` | 51 KB | 7 KB | 101 KB | 27 KB | 55 | plan + worksheet on one page |
| `/ar/learn/` (trail chooser) | **581 KB** | 7 KB | 73 KB | 55 KB | 394 | 301 trail cards with summaries; the heaviest education page and the front-door candidate |
| `/ar/cards/` | 96 KB | 7 KB | 73 KB | 24 KB | 115 | |
| `/ar/cards/list/tartib-al-anbiya/` | 144 KB | 7 KB | 75 KB | 26 KB | 90 | deck rendered twice (flip stage + plain list for no-JS) |
| `/ar/3d/` | 89 KB | 7 KB | 82 KB | 28 KB | 99 | plus 671 KB of three.js after "Enter" |
| `/en/sighar/` | 68 KB | 22 KB | 100 KB | 28 KB | 75 | |
| `/ur/sighar/` | 70 KB | 22 KB | 100 KB | 29 KB | 75 | |
| `/ur/sighar/quest/` | 163 KB | 102 KB | 100 KB | 31 KB | 54 | |

Reading the table: the kids pages are light where it counts (6 KB of inline script, a few KB of page script); note that `site/astro.config.mjs` sets `inlineStylesheets: "always"`, so in production the CSS column is inlined into every page's HTML rather than shared (a trade made for first paint). The two things that weigh are **repeated inline SVG** (the mascot drawn once per quest stop) and **the trail chooser's 301 cards on one page**. Both are fixed in E1 (a sprite; the front door becomes a short page and the chooser moves to its own route). The budgets in section 3 are set so that today's pages pass once those two fixes land, and fail if anyone repeats the pattern.

---

## 2. Idea bank, scored

Scores 1–5. **Impact** = value to learners and to the Ontario pitch. **Effort** = cost to build and author trilingually (5 = cheapest). **Fit** = fit with the house rules without re-engineering (5 = fits as is). **Rank** = Impact × Fit × Effort (higher first). Ideas that need an account, a server, a payment or a child's personal data are re-engineered in the "How it becomes static" column or dropped.

| # | Idea (source) | How it becomes static here | Impact | Effort | Fit | Rank | Phase |
|---|---|---|---|---|---|---|---|
| 1 | Education front door routing by age and audience | New page, links only | 5 | 5 | 5 | 125 | E1 |
| 2 | Five band hubs with own identity, bands ladder into each other | New pages reusing existing routes | 5 | 4 | 5 | 100 | E1 |
| 3 | Museum Passport (Duolingo streaks, re-engineered) | One `localStorage` key aggregating the nine existing keys; printable page; printable streak calendar | 5 | 4 | 5 | 100 | E1 |
| 4 | Study modes on card decks (Quizlet): flip · match · type · test; printable deck | Client-side only; lenient Arabic matching; print CSS | 4 | 4 | 5 | 80 | E1 |
| 5 | Share cards that travel (Wordle, Wrapped) | Canvas-rendered PNG + emoji text card; Web Share API or download; nothing sent anywhere | 4 | 4 | 5 | 80 | E1 |
| 6 | Print as first-class output (packs: teacher page + worksheet + answer key) | Print stylesheets and a pack page per unit | 5 | 4 | 5 | 100 | E1, E2 |
| 7 | One-tap classroom entry: QR on every printable, short URLs | QR rendered at build (pure SVG generator, no network) | 4 | 5 | 5 | 100 | E1 |
| 8 | Leveled reading (Newsela), top 300 records × 3 levels | Sections in the existing prose files; level switcher without JS (radio + CSS) | 5 | 1 | 5 | 25 | E2 (top 100), E5 (next 200) |
| 9 | Curriculum-mapped pathways (Bitesize), Ontario first | New `exhibit` trails with `curriculum` block; teacher landing pages | 5 | 3 | 5 | 75 | E2 |
| 10 | Teacher discovery SEO (TpT effect) | Landing pages with `LearningResource` JSON-LD, grade and subject in titles; printable indexed | 5 | 4 | 5 | 100 | E2 |
| 11 | Mastery checks, not scores (Khan) | 5 questions per trail, authored in the trail; wrong answer links back to the step; nothing stored but a stamp | 4 | 3 | 5 | 60 | E2 |
| 12 | Retrieval practice "Tell it back" | Extends the existing Retell to every quest and trail; youngest choose from options | 4 | 4 | 5 | 80 | E2 |
| 13 | Exam and homework rescue: 50 topics, 60-second explainers, glossaries, practice sets | Authored data; self-marking in the client | 5 | 2 | 5 | 50 | E4 |
| 14 | Classroom quiz mode (Kahoot) | Projected question + countdown + reveal; per-device score; show of hands; printable results sheet. **No** live aggregation (no server) | 4 | 3 | 4 | 48 | E3 |
| 15 | Daily challenge with share text (Wordle): Century Challenge, Who am I? | Build writes a 366-day schedule; the client picks today; emoji result card | 4 | 4 | 5 | 80 | E3 |
| 16 | «هل تعلم؟» fact engine (NatGeo Kids) | Authored, sourced `did_you_know` facts (never mined superlatives); fact of the day; printable poster | 4 | 3 | 5 | 60 | E3 |
| 17 | Where am I? (GeoGuessr) | 147 architecture illustrations + schematic world SVG; four candidate cities | 3 | 3 | 4 | 36 | E3 |
| 18 | The October engine: seasonal packs (Heritage Month, Ramadan, back-to-school, exams) | Landing page + pack per season; email text for the founder's lists | 4 | 4 | 5 | 80 | E3 |
| 19 | Offline and low-bandwidth packs (single-file HTML) | Build inlines CSS and small images into one HTML per unit (≤ 2 MB); PDF is a later build job | 4 | 3 | 5 | 60 | E3 |
| 20 | Homework search that forgives | Curated "topic → pathway" table merged into the existing synonyms JSON; zero-result hint | 3 | 4 | 5 | 60 | E3 |
| 21 | Teen umbrella wing with two bands, no mascot | New route family `/shabab/` | 5 | 4 | 5 | 100 | E4 |
| 22 | Source Detective units (iCivics, archives) | Authored units: claim + 3 sources from the corpus (isnad strip, chronicle excerpt in own words, object photo) + "what does the evidence prove" | 5 | 2 | 5 | 50 | E4 |
| 23 | Debate and dilemma cards for teens | Authored: decision, two attributed positions, evidence, "you decide"; no winner | 5 | 2 | 5 | 50 | E4 |
| 24 | Timeline-first teen home | Reuses `HijriTimeline.astro` with hot spots | 3 | 4 | 5 | 60 | E4 |
| 25 | Journey Map (Khan mastery map) per band | SVG territories coloured from the passport; printable poster | 3 | 3 | 5 | 45 | E4 |
| 26 | My Museum Shelf (Learning Lab collections) | `localStorage` + `?ids=` share link (same pattern as My tour); printable pack | 4 | 4 | 5 | 80 | E2 |
| 27 | Parent and teacher dashboards on paper | Weekly one-page printable from the passport | 3 | 4 | 5 | 60 | E2 |
| 28 | Three-minute story films, static style (BrainPOP) | "Story in 12 cards" auto-play reusing the Surah Map player; audio later | 4 | 3 | 5 | 60 | E5 |
| 29 | Build and remix studio (Scratch, Tate Kids): girih tile designer, calligraphy tracing, design a coin or a manuscript page | Client-side canvas or SVG; export PNG; nothing uploaded | 4 | 2 | 5 | 40 | E5 |
| 30 | Embed widget (Arts & Culture partner model) + LibGuides page | Static iframe page (≤ 15 KB), no cookies; one citation page for librarians | 3 | 4 | 4 | 48 | E5 |
| 31 | Video front door (YouTube trailers), **spec only** | 15 trailer scripts (5 bands, 10 pathways) with the no-people rule and a QR ending | 3 | 5 | 5 | 75 | E5 |
| 32 | Effectiveness evidence, privacy-safe | Edge request counts per path prefix (no client script), voluntary pilot reports, one-question survey by email; reported each phase | 4 | 5 | 5 | 100 | every phase |

Dropped, with reasons: leagues and leaderboards (need identity); push or email reminders to children (need contact data; the streak lives on the fridge); comments, forums, student uploads (user-generated public content); classroom join codes with live answer counting (needs a server; see idea 14); AI tutor or chat (no AI at runtime, ADR 0002); any "sign in with school account" integration (no accounts).

---

## 3. Non-negotiables as checks, and the page-weight budgets

Every phase must pass these before it is called done; they are added to the repository's tests as each phase lands (the exact tests are in each phase spec).

1. **Static.** `npm run check:static` passes: no external fetch, no third-party script. New client code reads and writes `localStorage` only inside `try/catch` and every feature works when storage is unavailable (private mode). No cookie, no form that posts, no beacon. Anything that would add a script, a form or a network call is `submission-impacting` and needs the founder's sign-off before it is built.
2. **No student data.** No name, age, class or school is ever stored, not even locally; the passport stores band and stamps only. Free-text fields (journal, retell, shelf names) remain local, capped, erasable with a two-step confirm, and the page says so.
3. **Trilingual.** Every new i18n key exists in `ar.yaml`, `en.yaml` and `ur.yaml` (a parity test fails otherwise); every new YAML string carries `ar`, `en` and `ur`; every new page is built for `LANGS` (3) and linked from the band hub in each language; Urdu is translated from the Arabic, not from the English.
4. **Content gates.** No typed honorifics or Qur'an glyphs (validator); kids' content follows `docs/agents/kids-content.md` (no fear, no gore, no shaming, no promises, opt-in gating); teen content follows `AGENTS.md` (perspectives labelled, Sunni frame first, no verdict); all AI output `status.review: draft` with `provenance`.
5. **Accessibility.** Every page reads and works without JavaScript (the interactive layer adds, never gates); keyboard operation for every game (arrow keys, Enter, Escape; a visible focus ring); `aria-pressed`/`aria-live` on game controls; tap targets ≥ 44 px on child pages (64 px in classroom mode, already in `kids.css`); contrast AA on every band palette (checked with the same method as `kids.css`'s token comments); reduced motion honoured; no horizontal scroll at 390 px.
6. **Child safety.** Child routes link out only through bridge cards marked as grown-up doors; teacher and parent surfaces live under `/learn/`, never under `/sighar/` or `/shabab/` (the existing `/sighar/teachers/` stays reachable and gets a redirect note, see E1); no external link on a child or teen page without the "for grown-ups" gate.
7. **Never break anything.** `npm run validate` (0 errors), `npm test` (all pass), `npm run build` green, on top of the fresh `origin/main` after a three-way merge; small PRs; explicit paths; attribution trailers.

**Page-weight budgets per route family** (bytes as served from `dist/`, uncompressed, measured by `scripts/check-weight.ts`, which runs after the build on a fixed list of education routes; compressed sizes at the edge are roughly a quarter). Because Astro inlines every stylesheet into the page, the HTML figure below is the markup **plus** its CSS; the JS figure is the hashed module scripts the page references. Fonts are excluded from the per-page figure because they are shared and cached, and the budgets assume the existing 161 KB Arabic/Urdu font pair and no new font family on any education route. The numbers the check enforces today are in `scripts/check-weight.ts` (E1); this table is the ceiling per family.

| Route family | HTML (markup as served) | CSS (all sheets, minified, shared) | JS (all page scripts, ex the 6 KB layout script) | Images on first screen | Total first visit, cold, ex-fonts |
|---|---|---|---|---|---|
| Front door, band hubs, parent and teacher hubs | ≤ 80 KB | ≤ 90 KB | ≤ 10 KB | ≤ 120 KB (SVG preferred, one mascot per page via a sprite) | ≤ 300 KB |
| Child activity pages (4–12) | ≤ 120 KB | ≤ 90 KB | ≤ 12 KB | ≤ 100 KB | ≤ 320 KB |
| Teen activity and game pages (13–18) | ≤ 120 KB | ≤ 90 KB | ≤ 30 KB | ≤ 150 KB | ≤ 390 KB |
| Classroom quiz screen | ≤ 80 KB | ≤ 90 KB | ≤ 15 KB | 0 (text and shapes) | ≤ 185 KB |
| Leveled reading page (entity page with switcher) | ≤ 160 KB | ≤ 90 KB | ≤ 10 KB | ≤ 100 KB | ≤ 360 KB |
| Printable pack page | ≤ 200 KB | ≤ 90 KB | 0 required | ≤ 200 KB | ≤ 490 KB |
| Listing pages (`/learn/trails/`, `/learn/facts/`) | ≤ 600 KB, split by kind or year above that | ≤ 90 KB | ≤ 10 KB | 0 | ≤ 700 KB |
| Offline single-file pack | one file ≤ 2 MB | inlined | inlined, optional | inlined | ≤ 2 MB |
| Embed widget | ≤ 15 KB total | inlined | ≤ 2 KB | 0 | ≤ 15 KB |

At the edge these compress to roughly a quarter (the measured dev pages gzip to 24–55 KB whole). Today's `/ar/sighar/quest/` (163 KB) exceeds the child-activity line only because of the five mascot copies; E1's sprite brings it to about 80 KB.

No three.js, MapLibre, chart library or framework on any education route. A budget breach fails the build; the fix is to remove weight, never to raise the number.

---

## 4. The route map (all five bands, explicit)

Every route exists in `ar`, `en` and `ur` (`/{lang}/…`). Existing routes keep their addresses; new ones are marked **new**.

| Audience | Hub | Identity | Routes |
|---|---|---|---|
| **Education front door** | **new** `/{lang}/learn/` becomes the front door (age doors, teacher door, parent door, "all trails" door, fact of the day, today's challenge, passport strip). The current trail chooser moves to **new** `/{lang}/learn/trails/` with identical filters. Nav label stays «جولة وتعلّم». | Museum palette (ivory, lapis, gold) | `/learn/`, `/learn/trails/`, **new** `/learn/passport/`, **new** `/learn/shelf/`, **new** `/learn/daily/`, **new** `/learn/facts/` |
| **Sprouts 4–6** «البراعم» | **new** `/{lang}/sighar/sprouts/` (two big doors, Hudhud reads everything; stateless) | Paper `#faf6ea`, leaf green, Hudhud large; one idea per screen | existing `/sighar/sprouts-garden/`, `/sighar/sprouts-quest/`; **new** `/sighar/sprouts/stories/` (read-aloud subset of Bedtime Stories), **new** `/sighar/sprouts/sounds/` (E5: tap-a-sound cards) |
| **Explorers 7–9** «المستكشفون» | **new** `/{lang}/sighar/explorers/` (map-first home: the world SVG hot-spotted with quests; Hudhud as guide; passport strip) | Teal `#2a7b88`, parchment map motif, Hudhud medium | existing `/sighar/garden/`, `/sighar/quest/`, `/sighar/kindness/`, `/sighar/stories/`, `/sighar/mosque/`, `/sighar/timemachine/`; **new** `/sighar/read/{class}/{slug}/` (leveled reader, Sprout and Explorer levels, flagged records only); **new** `/sighar/explorers/where/` (E3) |
| **Storytellers 10–12** «الرواة» | **new** `/{lang}/sighar/storytellers/` (a reading shelf first, then creation tools; Hudhud small) | Lapis `#1b2a4a`, gold ink, manuscript motif | existing `/sighar/retell/`, `/sighar/journal/`; **new** `/sighar/read/…` at Explorer level with the bridge to Scholar; **new** `/sighar/storytellers/stories/{slug}/` (story in 12 cards, E5); study modes on kids-flagged decks |
| **Teen wing** «جناح الشباب» | **new** `/{lang}/shabab/` (timeline-first home hot-spotted with mysteries and dilemmas; two band doors; no mascot) | Ink and teal, girih line pattern, no emoji in headings | **new** `/shabab/`, `/shabab/scholars/`, `/shabab/researchers/` |
| **Scholars 13–15** «الدارسون» | **new** `/{lang}/shabab/scholars/` | Teal accents on ink | **new** `/shabab/60s/{topic}/` (explain it in 60 seconds), `/shabab/practice/{topic}/` (self-marking sets), `/shabab/dilemmas/{slug}/`, `/shabab/daily/` (Century Challenge), `/shabab/where/`, `/shabab/glossary/{topic}/` |
| **Researchers 16–18** «الباحثون» | **new** `/{lang}/shabab/researchers/` | Lapis and gold on ink | **new** `/shabab/detective/{slug}/` (Source Detective), `/shabab/dilemmas/{slug}/` (deeper set), `/shabab/daily/` (Who am I?), the full Learn trails at `level: deep`, entity pages with isnad strips and `perspectives` |
| **Teachers** | **new** `/{lang}/learn/teachers/` (umbrella: kits by band, pathways by grade, packs by season, classroom quiz, LibGuides text) | Museum palette, dense, print-first | existing `/sighar/teachers/**` (kept, linked, and its hub gains a "see the full teacher hub" note); **new** `/learn/teachers/pathways/{grade}-{subject}-{unit}/`, `/learn/teachers/packs/{season}/`, `/learn/teachers/quiz/{trail}/`, `/learn/teachers/print/{unit}/`, `/learn/teachers/offline/{unit}.html`, `/learn/teachers/librarians/` |
| **Parents** | **new** `/{lang}/learn/parents/` (what each band does, the weekly sheet, the fridge calendar, family challenge) | Museum palette | **new** `/learn/parents/weekly/` (printable from the passport), `/learn/parents/calendar/` |
| **Embeds** | n/a | minimal | **new** `/{lang}/embed/fact/`, `/embed/trail-of-the-week/` (E5) |

**Laddering.** Each band hub ends with a "ready for the next band?" door that carries the passport across (same `localStorage` key, the `band` field changes, stamps stay). Sprouts → Explorers → Storytellers → Scholars → Researchers → the museum itself.

---

## 5. Phases

Each phase is independently shippable, lands as its own pull request series on top of fresh `origin/main`, and is run as a lane (`education`) with a progress file. Effort is in **agent-days** (one Claude session day of code and content work) and **author-hours** for content (AI-drafted, agent-checked, validator-clean, still `draft`; scholar and owner review are not included). Trilingual content is costed as **2.25 × the Arabic hours** (Arabic + one translation = 1.5×; three languages = 1.5 × that, the owner's rule). Rate assumed: 500 reviewed Arabic words per author-hour at a fixed register.

### E1 · Front door, five band hubs, passport, study modes, share cards, QR and print (quick wins)

**Goal.** Connect what exists: one front door that routes by age, a hub per band with its identity and a visible ladder, one passport over the nine existing progress keys, four study modes on the decks, share cards for every completion, a QR code and a short URL on every printable. Nothing new to author beyond UI strings, hub copy and 13 deck "type" answer lists.

**Label.** `non-impacting` (new pages, no new script origin, no form, no network call). The Web Share API and canvas download are local browser features and do not change the privacy posture; the founder should still glance at the share-card code before merge because it is the first time the site emits a file.

**Routes.** `/learn/` (front door), `/learn/trails/`, `/learn/passport/`, `/sighar/sprouts/`, `/sighar/explorers/` (first version: list, the map arrives in E3), `/sighar/storytellers/`, `/learn/teachers/` (first version: links to the existing kit plus the printables index), `/learn/parents/` (first version). Nav: «جولة وتعلّم» → front door; the landing-page card points to the front door.

**Components.** `EduDoor.astro` (age doors), `BandHub.astro` (hero, ladder, next-step card, passport strip), `Passport.astro` + `scripts/passport.ts` (reads the nine keys, writes `edu-passport`), `StudyModes.astro` + `scripts/study.ts` (flip · match · type · test), `ShareCard.astro` + `scripts/share.ts` (canvas PNG + emoji text; `navigator.share` when present, download otherwise), `Qr.astro` (build-time SVG QR from a vendored, dependency-free generator ≤ 6 KB, MIT), print CSS for decks (2 columns, cut lines).

**Data.** `edu/bands.yaml` (5 bands: id, ages, ar/en/ur name and one-line voice, palette token, hub route, activities in order, next band); `edu/stamps.yaml` (one stamp per existing activity and trail: id, icon, ar/en/ur label, the `localStorage` key and predicate that earns it); `cards/lists/*.yaml` gain an optional `accept:` list of alternative spellings per item for type mode (13 decks × ~10 items). New folder `edu/` holds education data (language-neutral structure with ar/en/ur strings, same convention as `kids/`).

**Passport storage schema** (`edu-passport`, versioned): `{ v: 1, band: "explorers", stamps: { "quest": "2026-10-23", … }, lanterns: { explorers: 3 } }`. Migration on first load reads the nine legacy keys and awards their stamps; legacy keys are left in place (the existing pages keep working). No name, no age, no free text.

**Content counts (all three languages).** ~120 new UI strings (hubs, passport, study modes, share text) = 360 strings; 5 band descriptions × 60 words; 13 decks × 10 `accept` lists (spellings, no translation needed beyond the three scripts). Author-hours: 6 Arabic → **14 trilingual**.

**Engineering.** 8–10 agent-days.

**Acceptance tests (must pass in ar, en and ur).**
- `edu.test.ts`: `edu/bands.yaml` has exactly 5 bands in ladder order, each with ar/en/ur strings and a hub route that exists; `edu/stamps.yaml` keys and predicates reference real `localStorage` keys found in the scripts; i18n parity of every `edu:` key across the three files; no typed honorifics in `edu/**`.
- Rendered: `/{lang}/learn/` contains five band links, a teacher link and a parent link, in all three languages; `/{lang}/learn/trails/` renders the same cards as the old chooser (count equal to trails in the graph); every band hub links its activities and its next band; `/sighar/teachers/` still builds and links to `/learn/teachers/`.
- `check:static` passes (no fetch, no third-party script); `check-weight` passes on the 11 new routes.
- Manual, recorded in the progress file with screenshots: 390 px and 1024 px (iPad) layouts, keyboard walk of study modes, share card downloads a PNG in each language with correct RTL text, passport prints on one page, no horizontal scroll.

**Before / after a reviewer can verify live.** Before: `/ar/learn/` is a chooser of 301 trails; `/ar/sighar/` offers 18 doors; no passport. After: `/ar/learn/` asks «كم عمرك؟» and shows five doors; `/ar/sighar/explorers/` shows 6 activities, a next-step card and a passport strip; `/ar/learn/passport/` shows the stamps earned on this device and prints; a deck at `/ar/cards/list/tartib-al-anbiya/` offers four modes.

### E2 · Leveled reading (top 100), Ontario curriculum pathways, mastery checks, Tell it back, shelf, weekly sheet, teacher SEO

**Goal.** The school-value core: one URL per taught topic that works for a mixed class, pathways a teacher finds by grade and unit, and a check at the end of every trail.

**Label.** `non-impacting` for pages and content; the JSON-LD `LearningResource` additions are metadata only. The teacher landing pages are documentation-like pages that outreach will link to; they do not alter any filed claim.

**Leveled reading, data design.** Levels live in the existing prose file `content/{lang}/{class}/{slug}.md` as three optional sections with fixed headings (ar: `## للبراعم` (4–6, read aloud, ≤ 80 words), `## للمستكشفين` (7–9, ≤ 160 words), `## للدارسين` (13+, ≤ 300 words); en and ur equivalents fixed in the validator); Storytellers 10–12 read the Explorer text with the Scholar bridge. The record's `data/` file gains `education: { levels: [sprouts, explorers, scholars], flagged_for_kids: true }` so kids routes can opt in (the opt-in rule of `docs/agents/kids-content.md` §4). Rendering: on the entity page a level switcher implemented as three radio inputs + CSS (works without JS) with JS remembering the choice in `edu-level`; on `/sighar/read/{class}/{slug}/` the kids chrome shows the Sprout and Explorer texts only. Validator: word limits, banned patterns for the two child levels, no perspectives content in a child level, all three languages present or the section is absent in all three.

**Selection of the 100 (then 200 more in E5).** By demand: the 50 school topics (appendix B), the five prophets already in the quest, the 20 Time Machine events, the 10 cities of the trails catalogue, inbound-link rank for the rest. The list is written to `edu/leveled-100.yaml` first and approved by the founder before authoring starts (batches of 25, as every content batch).

**Curriculum pathways (Ontario first, then a generic world-history map).** New `exhibit` trails (`kind: lesson`, `audience: [teacher, student]`, `level`, 5–15 steps, mastery check, worksheet) with a `curriculum:` block (`jurisdiction: on-ca`, `course`, `grade`, `strand`, `expectation` text in the teacher's words, never copied from the ministry document). First set of 12: Grade 4 Social Studies A (early societies to 1500 CE: Baghdad, Cordoba, Cairo, Timbuktu), Grade 6 (communities and world connections: the Hajj as a global network), Grade 7–8 (medieval trade and the Silk Roads), CHW3M world history to the 15th century (rise of Islam, the Abbasid age, al-Andalus, the Crusades from the Muslim side, the Mongols and after), CHY4U (the Ottomans, the gunpowder empires), HRT3M and HRF3O world religions (the Prophet's biography, the five pillars, the Qur'an as a text, Islamic art and architecture). Course codes and strands are verified against the current Ontario curriculum documents before any page is published, and each page says "mapped by the museum, not endorsed by the Ministry".

**Mastery check.** `quiz:` block on the trail (5 questions, 4 options, `answer`, `teaches: <step index>`); a wrong answer shows the step card that teaches it; a pass earns a stamp; nothing else is stored.

**Tell it back.** The existing Retell component generalised: every quest and trail ends with "tell it back" (typed, or spoken to a parent with a tick box, or choose-the-order cards for Sprouts); the passport rewards the retelling, not the clicking.

**Shelf.** `/learn/shelf/`: any card, record or trail is shelved (`edu-shelf`, ≤ 60 ids); export as a printable pack or as `?ids=` link (the pattern of `/tour?ids=`); no names in the URL.

**Weekly sheet.** `/learn/parents/weekly/`: one printable page from the passport: done this week, due for review (E1 study scheduler), one family activity from `edu/family-activities.yaml` (52 entries).

**Teacher SEO.** Each pathway page: title «{topic}: {grade} {subject} lesson and free printable | islam.museum» in each language, `LearningResource` JSON-LD (`educationalLevel`, `learningResourceType`, `inLanguage`, `isAccessibleForFree: true`, `license`), the printable linked with `rel="alternate"` and listed in the sitemap; the teacher hub lists pathways by grade. English carries the Ontario weight; Arabic and Urdu pages carry the same structure for Arab and South Asian schools.

**Content counts.** Leveled reading, 100 records × 2 new child levels (Sprout 80 + Explorer 160 words) + Scholar level where `## Brief` is missing (assume 60 of 100 × 250 words) = 24,000 + 15,000 = 39,000 Arabic words → 78 Arabic hours → **176 trilingual author-hours**. Pathways: 12 trails × (goal, 10 notes, 5 questions, worksheet, teacher page ≈ 900 words) = 10,800 words → 22 h → **49 h**. Family activities 52 × 40 words → 4 h → **9 h**. Tell-it-back prompts for 20 activities → 3 h → **7 h**. Total **≈ 241 trilingual author-hours**, delivered as 9 content batches of ≤ 25 entities.

**Engineering.** 10–12 agent-days (validator rules, switcher, reader route, quiz, shelf, weekly sheet, JSON-LD, sitemap, tests).

**Acceptance tests.** Validator: every leveled section within its word limit, in all three languages or none, no banned pattern, no honorific, `education.levels` matches the sections present; every `curriculum` block has all fields; every `quiz` has 5 questions each with a `teaches` index inside the trail. Rendered: `/{lang}/{class}/{slug}/` shows the switcher only when levels exist and the chosen level without JS (radio default = Scholar); `/{lang}/sighar/read/…` exists only for flagged records and shows no Scholar text; each pathway page has JSON-LD that parses and names a grade; sitemap lists every pathway in three languages; `check-weight` passes. Manual: a teacher can print one lesson as one pack (teacher page, worksheet, answer key) in ≤ 4 sheets in each language; the Urdu pack is flagged for the owner's review.

**Before / after.** Before: `/en/event/battle-of-badr/` is one adult text. After: it offers three levels; `/en/learn/teachers/pathways/g11-chw3m-rise-of-islam/` exists with a QR, a worksheet and a mastery check; a Grade 4 teacher typing "Baghdad grade 4 lesson free printable" can land on a page built for that query.

### E3 · Reach engines: classroom quiz, daily challenge, fact engine, seasonal packs, offline packs, Where am I?, homework search, Explorers map

**Goal.** The surfaces that make the site travel: a projector mode a whole class shouts at, one tiny game a day with a WhatsApp-ready result, a fact a day, a dated pack for every school-year hook, a single-file pack for poor connectivity, and the Explorers' map home.

**Label.** `non-impacting` for everything on the site itself. The offline single-file pack and the printable PDF (if generated at build) are new file types in `dist/`; they contain no script that calls out. The seasonal packs come with email text the **founder** sends from the existing outreach lists; the site never sends email.

**Classroom quiz.** `/learn/teachers/quiz/{trail}/?classroom=1`: the trail's 5 mastery questions, big type, a 20-second ring, shapes and colours on the four tiles (keyboard 1–4), reveal with the teaching step, a per-device score, "raise your hands" cue, a printable results sheet for the teacher to tally by hand. Honest limit printed on the page: no answers leave any device.

**Daily challenge.** `/learn/daily/` (and mirrored on `/shabab/daily/`): Century Challenge (an event, pick its century) and Who am I? (three clues, one figure). The build writes `edu/daily-schedule.json` with 366 entries chosen by a stable hash of entity ids (no clock, no random at build); the client picks the day; the no-JS page lists this week's seven. Result text: `متحف الإسلام · تحدّي القرن · ١٨/١٠ · 🟩🟩⬜🟩🟩` with the link, designed for WhatsApp; a PNG card via the E1 share component. Source pool: events with a date of at least year precision and ≥ 2 sources; figures with ≥ 3 sourced claims; both pools exclude contested or sensitive records by an `education.exclude: true` flag.

**Fact engine «هل تعلم؟».** `did_you_know:` (ar/en/ur, ≤ 40 words, ≥ 2 sources) authored on entities, never generated from superlatives. 365 facts in 15 batches. Fact of the day on the front door and the hubs; `/learn/facts/` archive; printable "fact of the week" poster (A4, one fact, QR).

**Seasonal packs.** `/learn/teachers/packs/{heritage-month | ramadan | back-to-school | exam-season}/`: landing page + printable kit (8–12 pages) + QR + the email text as a `.md` in `docs/outreach/education/` for the founder to send. Dates: Islamic Heritage Month (Ontario, October), Ramadan 1448 (expected to begin about 8 February 2027; the page states the Umm al-Qura expectation and the sighting caveat, using the museum's converter), back-to-school (first week of September), exam season (May–June).

**Offline packs.** A build step writes `/learn/teachers/offline/{unit}.html`: one file, CSS inlined, images inlined as WebP ≤ 60 KB each, fonts referenced not inlined (the pack still reads in the system Arabic font offline), ≤ 2 MB. PDF export stays a question for the owner (section 9, Q4).

**Where am I?** `/sighar/explorers/where/` (gentle: two choices, always warm) and `/shabab/where/` (four cities, streak): 147 architecture illustrations with their 136 related entity links, labelled as illustrations; cities placed on the new world SVG.

**Homework search.** `edu/homework-topics.yaml`: 50 topics × ar/en/ur phrasings → merged at build into `search-synonyms.*.json` and rendered as a "topics" strip on the search page's zero-result state and on the teacher hub; typing «الحروب الصليبية واجب» lands on the pathway.

**Explorers map.** `site/src/data/basemap-world.json` from Natural Earth 110m land (public domain, simplified to ≤ 80 KB), rendered as an inline SVG with 12 hot spots (Mecca, Medina, Jerusalem, Damascus, Baghdad, Cairo, Cordoba, Fez, Timbuktu, Istanbul, Samarkand, Delhi); each hot spot opens a quest or a leveled record; the list below the map is the no-JS and screen-reader equivalent.

**Content counts.** 365 facts × 40 words = 14,600 words → 29 h → **66 h**. 4 packs × ~2,500 words = 10,000 → 20 h → **45 h**. Daily challenge clues: 366 Who-am-I entries × 3 clues × 15 words = 16,500 → 33 h → **74 h** (Century Challenge needs no new text). Homework topics 50 × 3 phrasings: 2 h → **5 h**. Map hot-spot copy 12 × 40 words: 1 h → **2 h**. Total **≈ 192 trilingual author-hours**.

**Engineering.** 12–14 agent-days (quiz mode, schedule generator, fact strip and poster, pack pages, single-file build step, two games, synonyms merge, world SVG and map home, tests).

**Acceptance tests.** `daily-schedule.json` has 366 entries, is byte-identical across two builds of the same commit, and every entry resolves to a non-excluded record with ≥ 2 sources; every `did_you_know` is ≤ 40 words in each language with ≥ 2 sources; the quiz page renders all 5 questions and the answer sheet without JS; the offline file is ≤ 2 MB, contains no `<script src` and no absolute `http(s)://` fetch, and opens from `file://` (manual); `basemap-world.json` ≤ 80 KB; each hot spot's target exists; the share text contains no personal data and no URL parameter other than the page path; `check-weight` passes on all new routes; Urdu versions of the four packs flagged for the owner.

**Before / after.** Before: no daily anything, no projector mode, no packs. After: `/ar/learn/daily/` changes every day and produces a pasteable result; `/en/learn/teachers/quiz/path-meccan-period/?classroom=1` fills a projector; `/en/learn/teachers/packs/heritage-month/` is one URL a board email can carry; `/ar/sighar/explorers/` is a map.

### E4 · The teen wing: Scholars and Researchers, Source Detective, dilemma cards, 60-second explainers, practice sets, glossaries, Journey Map

**Goal.** Close the 13–18 gap with a wing free of mascot-forward design, built on the museum's one asset no textbook has: the sourced graph.

**Label.** `non-impacting` for routes and content. The dilemma and detective units touch contested topics and are the first child- or teen-facing content to carry `perspectives`; their editorial rules are the museum's (labelled views, Sunni frame first, no verdict), restated for teens below. These units are authored in the `education` lane and reviewed like any contested content.

**Routes.** `/shabab/`, `/shabab/scholars/`, `/shabab/researchers/`, `/shabab/60s/{topic}/` (50), `/shabab/practice/{topic}/` (50 sets × 10 questions), `/shabab/glossary/{topic}/` (50 × 12 terms), `/shabab/dilemmas/{slug}/` (30), `/shabab/detective/{slug}/` (20), `/shabab/journey/` (Journey Map), with `/shabab/daily/` and `/shabab/where/` from E3.

**Components.** `TeenHub.astro` (timeline-first: `HijriTimeline.astro` reused with hot spots for dilemmas and detective units), `SixtySeconds.astro` (a 60-second read with a visible reading bar, no timer pressure), `PracticeSet.astro` + `scripts/practice.ts` (self-marking, keyboard-first, explanation under every option), `Dilemma.astro` (the decision, two attributed positions with their evidence cards, "you decide" with a written reflection kept locally, sources attached, no winner), `Detective.astro` (claim, three evidence cards: an isnad strip from a chained passage, a chronicle excerpt rewritten in the museum's words with citation, an object photo or illustration; the student grades what the evidence proves on a four-step scale and compares with the historians' note), `JourneyMap.astro` (territories coloured from the passport, printable).

**Data.** `edu/topics-50.yaml` (the taught topics, appendix B, each with its 60-second text, glossary, practice set and the records it links), `edu/dilemmas/*.yaml` (30), `edu/detective/*.yaml` (20). Dilemmas and detective units cite entities and passages by id; the validator checks every id exists and that each position names who holds it.

**Teen editorial rules (restating the house rules for 13–18).** Positions are attributed («يرى ابن خلدون…», "the Mamluk chronicler al-Maqrizi writes…"), never anonymous; the Sunni position(s) come first where the matter is religious, the academic view follows, other views are labelled; the page never scores a position; sensitive topics (sectarian violence, modern conflicts) are not in the first 30 dilemmas; evidence excerpts stay under 40 words when quoted and are otherwise paraphrased with citation; no image of a person.

**Content counts.** 50 topics × (60-second text 150 words + 12 glossary terms × 15 words + 10 questions × 40 words) = 50 × 730 = 36,500 words → 73 h → **164 h**. 30 dilemmas × 500 words = 15,000 → 30 h → **68 h**. 20 detective units × 600 words = 12,000 → 24 h → **54 h**. Hub and band copy 1,000 words → 2 h → **5 h**. Total **≈ 291 trilingual author-hours**.

**Engineering.** 12–15 agent-days.

**Acceptance tests.** Every topic has all three parts in all three languages; every practice question has exactly one answer and an explanation; every dilemma has ≥ 2 positions, each with a holder and ≥ 1 source, and no field named "verdict", "winner" or "correct"; every detective unit's three evidence ids exist and at least one is a passage with a `chain`; the teen hub has no Hudhud component and no emoji in headings; keyboard-only completion of a practice set and a dilemma recorded in the progress file; `check-weight` on the teen family; Urdu flagged.

**Before / after.** Before: nothing for 13–18. After: `/en/shabab/` opens on a timeline with 50 hot spots; `/en/shabab/detective/who-wrote-down-the-quran/` hands a 16-year-old three pieces of evidence; `/en/shabab/practice/crusades/` marks itself.

### E5 · Story films in cards, leveled reading 101–300, build and remix studio, embeds, LibGuides page, video specs

**Goal.** Depth and syndication: the remaining leveled records, the "story in 12 cards" auto-play, the studio, the embeds, and the trailer specs for the YouTube channel.

**Label.** `non-impacting` for the site; the **embed widget** is the one item the founder should look at under the privacy heading: other sites will load museum files in an iframe (no cookies, no script beyond the widget's own, `Referrer-Policy` already strict-origin), and `docs/outreach/dpga-evidence-map.md` states the privacy posture, so the embed page is listed there as a documentation touch (`submission-impacting`, documentation only) before it ships.

**Story in 12 cards.** `edu/story-cards/*.yaml`: 20 stories × 12 cards (one idea, one image from the whitelist or an architecture illustration, one line of narration text), played with the Surah Map auto-play engine (2.8 s per card, pause, step), optional audio later with the existing gating pattern.

**Studio.** Girih tile designer (a 10-point and 8-point star grid, strap colours, export PNG/SVG), calligraphy tracing (Kufic letterforms as SVG guides, no Qur'an text: letters and words from the names of cities and virtues), design a coin or a manuscript page (templates from real objects in the 467 photos, text fields limited to names and dates); every export carries a share card; nothing uploaded.

**Embeds and librarians.** `/embed/fact/` and `/embed/trail-of-the-week/` (≤ 15 KB, inline CSS, a "from islam.museum" link); `/learn/teachers/librarians/` with the citation text in APA, MLA and Chicago and the exact links a LibGuides page needs.

**Video specs (spec only, no production).** 15 scripts (5 bands, 10 pathways), 60–90 s each: shot list limited to places, objects, calligraphy, architecture, maps and the museum's own screens; no people; no recitation unless a licensed recording is named; trilingual subtitles; the last frame is the QR of the route. Stored in `docs/outreach/education/video-specs.md`.

**Content counts.** Leveled 101–300: 200 × (80 + 160) + 120 × 250 = 48,000 + 30,000 = 78,000 words → 156 h → **351 h**. Story cards 20 × 12 × 20 words = 4,800 → 10 h → **22 h**. Video scripts 15 × 200 words = 3,000 → 6 h → **14 h**. Studio and embed strings: 2 h → **5 h**. Total **≈ 392 trilingual author-hours**.

**Engineering.** 14–16 agent-days.

**Acceptance tests.** Story cards: 12 per story, every image on the whitelist, auto-play stops on any pointer or key, full list without JS; studio: no `fetch`, export produces a file in each language's UI, ≤ 30 KB JS per studio; embed ≤ 15 KB total, no cookie set, works at 300 px wide; video specs contain the no-people and no-recitation lines in every script; leveled 300 complete in all three languages; Urdu flagged.

### Summary of cost

| Phase | Engineering (agent-days) | Content (trilingual author-hours) | Depends on |
|---|---|---|---|
| E1 | 8–10 | 14 | nothing |
| E2 | 10–12 | 241 | E1 (passport, hubs, QR, print) |
| E3 | 12–14 | 192 | E1; E2 for the quiz (mastery questions) |
| E4 | 12–15 | 291 | E1; E3 for daily and where |
| E5 | 14–16 | 392 | E2 (leveled rules), E1 (share) |
| **Total** | **56–67** | **≈ 1,130** | |

Content hours are the honest bill of trilingual production; they are spread over the lane's content batches (≤ 25 entities each, pushed as they pass) and can run in parallel with engineering by a second session of the same lane.

---

## 6. Trilingual production and the Urdu discipline

- **Order of writing:** Arabic first, in the register of the band (the kids rulebook's three registers, plus two teen registers defined in E4); English second; Urdu third, translated from the Arabic. A string whose Urdu repeats the English is a gap, not a translation (kids rulebook §10).
- **Urdu typography.** The site sets Urdu in Noto Naskh Arabic; the plan does not add a Nastaliq face on education routes (it would add 200–400 KB to every Urdu page and break the budget). Urdu-specific checks added to the parity test: `ur` strings use Urdu digits and punctuation where the Arabic uses Arabic ones («۔» not «.», «،» shared), Urdu letter forms (ہ, ی, ے, ک, گ) not Arabic look-alikes, and no untranslated Latin terms beyond proper names.
- **Owner review.** Every phase hand-off lists its Urdu files and strings under "Urdu for the owner's review"; the rest of `/ur/` outside this programme stays the owner's lane and is never touched.
- **Register for children in all three languages:** short sentences, concrete nouns, present tense where the band allows, no jargon without a gloss, no honorific typed (the UI renders them in the three scripts as `kidsHonorify` already does).

---

## 7. Effectiveness evidence (privacy-safe) and how it is reported

Collected, in this order, and nothing else:

1. **Aggregate edge request counts per path prefix** (`/{lang}/learn/**`, `/{lang}/sighar/**`, `/{lang}/shabab/**`, the pack and offline files), read from the Cloudflare dashboard by the founder. No client script, no cookie, no identifier: this is the server's own count of files served, which the site already produces by existing. Reported monthly as totals per prefix and per language, rounded to the hundred.
2. **Voluntary teacher reports** through the existing 5-school pilot guide (completion of a pathway, class size as a range, one line of what worked), sent by email to the pilot contact once the founder fills the `TODO`. Reported per term as counts and quoted lines, never a school's name without consent.
3. **One-question teacher survey per term** («هل استخدمت هذا في الصف هذا الفصل؟ نعم / لا / جزئيًا»), by email, never a form on the site. Reported as three counts.

Each phase hand-off ends with an "Evidence" section that states these three numbers for the previous period, the before/after of the phase, and the exact claims outreach may make. Reach claims in `docs/outreach/` quote only these numbers with their dates.

Not collected, by design: page views per visitor, time on page, completion rates per child, device identifiers, geography finer than the dashboard's country totals, anything from `localStorage`.

---

## 8. Mockups (1440 × 900, Arabic RTL)

Self-contained HTML files, same convention as `docs/design/landing-mockup.html` (the colours there are approximations; the real tokens are `site/src/styles/global.css` and `kids.css`):

| Screen | File |
|---|---|
| Education front door `/ar/learn/` | `docs/design/education/01-front-door.html` |
| Explorers hub (young band, map-first) `/ar/sighar/explorers/` | `docs/design/education/02-explorers-hub.html` |
| Teen umbrella hub `/ar/shabab/` | `docs/design/education/03-teen-hub.html` |
| Classroom quiz screen `/ar/learn/teachers/quiz/{trail}/?classroom=1` | `docs/design/education/04-classroom-quiz.html` |

Open each in a browser window at 1440 × 900. The map in the Explorers mockup is a schematic drawing, not the Natural Earth basemap E3 will build; the QR in the quiz mockup is a placeholder pattern.

---

## 9. Open questions for the owner (five, each with a recommendation)

1. **Where does the front door live?** Recommendation: `/{lang}/learn/` becomes the front door and the trail chooser moves to `/{lang}/learn/trails/`. The nav label «جولة وتعلّم» already fits; the old chooser URL keeps working because it only gains a routing section at the top and a link to the full chooser. Alternative: a new `/{lang}/education/` and leave `/learn/` untouched (one more top-level concept to explain).
2. **Names of the two teen bands and the teen wing.** Recommendation: «جناح الشباب» (`/shabab/`), «الدارسون» 13–15 (`/scholars/`), «الباحثون» 16–18 (`/researchers/`), English "Scholars" and "Researchers", Urdu «طالبِ علم» and «محقّقین» to be confirmed by the owner's Urdu review. Alternative: age labels only («١٣–١٥», «١٦–١٨») with no band names.
3. **Leveled reading inside the prose file or beside it?** Recommendation: fixed-heading sections inside `content/{lang}/{class}/{slug}.md` (one file per entity per language stays the rule; the validator enforces the limits). Alternative: a parallel folder, which would be the first exception to "prose only in `content/<lang>/<class>/<slug>.md`".
4. **PDF generation at build.** Recommendation: ship single-file HTML packs in E3 and print-to-PDF stays local to the teacher; add a PDF build job (Playwright in CI, about 90 s per deploy) only if teachers in the pilot ask for PDFs. Alternative: PDFs from E2, accepting the CI dependency and build time.
5. **The 300 leveled records: who approves the list?** Recommendation: the agent proposes `edu/leveled-100.yaml` in E2's first PR with the demand evidence per record; the founder approves or edits the list before authoring; the next 200 follow the same step in E5. Alternative: the agent selects by inbound-link rank alone.

---

### 9.1 Decisions (founder, 23 October 2026)

The founder agreed to all five recommendations in chat on 23 October 2026. They are now binding on Stage 2:

1. The front door is `/{lang}/learn/`; the trail chooser moves to `/{lang}/learn/trails/`.
2. The teen wing is «جناح الشباب» at `/shabab/`, with «الدارسون» (Scholars, 13–15) at `/shabab/scholars/` and «الباحثون» (Researchers, 16–18) at `/shabab/researchers/`; the Urdu band names stay subject to the founder's Urdu review.
3. Leveled reading lives inside the existing prose file as fixed-heading sections, enforced by the validator.
4. Packs ship as single-file HTML in E3; a PDF build job is added only if pilot teachers ask for it.
5. The agent proposes `edu/leveled-100.yaml` (and later the next 200) with demand evidence, and the founder approves the list before authoring starts.

Phase approvals, as given in chat: **E1 approved 23 October 2026** (built in the `education` lane the same day); **E2 approved 23 October 2026**, to start once E1 is merged, beginning with the proposed list `edu/leveled-100.yaml` for the founder's approval (decision 5). On 23 October 2026, the founder wrote: "The leveled-100 list in PR #1389 is approved as proposed."

**E3 approved 24 October 2026.** The founder wrote in chat: "E3 is approved: reach engines (classroom quiz, daily challenge, fact engine, seasonal packs, offline packs, Where am I, homework search, Explorers map)." Built as the steps listed in `docs/delegation/education-progress.md` (section E3), one pull request at a time, each merged by its agent after Validate passes. E3 adds no E4 teen routes (the `/shabab/` daily and where mirrors wait for E4) and no E5 items.

## 10. Build this first, and why

**E1.** It connects what exists, needs almost no new content (14 author-hours), and is the phase every other phase stands on: the front door and five hubs give E2's pathways and E4's teen wing a place to live, the passport gives every later activity a stamp to earn, the share card gives every later completion a way to travel, and the QR and print work give every later pack its paper form. It fixes the two worst completion points today (18 doors on the hub, nothing after a quest) within ten agent-days, and it makes the owner's single most important pitch line true on the site itself: the same URL serves a 5-year-old, a 15-year-old and their teacher, with no account, no tracking and no student data.

---

## 11. How Stage 2 runs (when approved)

- Lane `education` is added to `docs/agents/lanes.md` with `docs/agents/lanes/education.md` (scope: `edu/`, `site/src/pages/[lang]/learn/**`, `site/src/pages/[lang]/sighar/**` additions, `site/src/pages/[lang]/shabab/**`, the `edu:` and `shabab:` i18n blocks, education tests), progress file `docs/delegation/education-progress.md`, branch pattern `education/E<n>-<agent>`, stubs file `data/_stubs.d/education.yaml`.
- One phase at a time; a phase is a series of small PRs (routes first, then data, then content batches ≤ 25); each PR green on `validate`, `test`, `build`, merged by the agent after Validate passes, on top of fresh `origin/main`.
- Every PR says in its description which phase and which acceptance tests it advances, and the hand-off of a phase lists: routes live in ar, en, ur; tests added; Urdu for the owner's review; evidence numbers; what the founder must deploy (commits named, whether a Worker or workflow file is among them).
- Nothing from `docs/ai-change-gates.md` §8 (reserved areas) is touched; the two documentation touches named above (E5 embed in the evidence map) are proposed separately with their label when their phase starts.

---

## Appendix A · Content ladder per band (what a child finds, in order)

| Band | Reads | Plays | Makes | Checks | Earns |
|---|---|---|---|---|---|
| Sprouts 4–6 | Hudhud reads: 5 sprout lines, 5 bedtime stories (read-aloud), 100 leveled Sprout texts (E2) | Sprouts Garden, Sprouts Quest, tap-a-sound (E5) | nothing to save (stateless) | "tell it back" by choosing picture order (no failure state) | a sticker page the parent prints; no stored state |
| Explorers 7–9 | 100 Explorer-level texts (E2), 365 facts (E3) | Word Garden, Prophet Quest, Kindness Quest, Time Machine, Where am I? (gentle), the map home | Build-a-Mosque | 5-question mastery checks on the kids-flagged trails, tell it back | stamps and lanterns in the passport, printable passport, fridge calendar |
| Storytellers 10–12 | 100 Explorer texts with the Scholar bridge, 20 stories in 12 cards (E5), kids-flagged decks | study modes (flip, match, type, test), Century Challenge (kids pool) | Retell, Journal, Studio (E5), Shelf | mastery checks, tell it back in writing | passport, Journey Map poster |
| Scholars 13–15 | 50 sixty-second explainers, 50 glossaries, Scholar-level texts | practice sets, daily challenge, Where am I? (four cities) | Shelf, Studio (E5) | self-marking sets with explanations | passport (lanterns), share cards |
| Researchers 16–18 | Source Detective (20), dilemmas (30), deep trails, entity pages with isnad strips and perspectives | Who am I?, Century Challenge (full pool) | Shelf as a research pack, citations (Cite this page) | the detective's evidence scale, trail mastery checks | Journey Map, share cards, the museum itself |

## Appendix B · The 50 taught topics (for leveled reading, 60-second explainers, practice sets and homework search)

Prophetic era and Qur'an (12): the Arabia Islam was born into · the Prophet's life before prophethood · the first revelation · the Meccan years and the boycott · the migrations to Abyssinia · the Hijra · the Constitution of Medina · Badr, Uhud and the Trench (as one unit, told at the story's edge for children) · the Treaty of Hudaybiyya and the conquest of Mecca · the Farewell Pilgrimage · how the Qur'an was written down and transmitted · what a hadith is and how an isnad works.
Beliefs and practices (8): the five pillars · the shahada and tawhid · prayer and the mosque · zakat and waqf · Ramadan and the two Eids · the Hajj as a global network · the Hijri calendar · the schools of law and why they differ (labelled).
Eras (10): the Rashidun · the Umayyads and Damascus · the Abbasids and Baghdad's House of Wisdom · al-Andalus and Cordoba · Fatimid Cairo and al-Azhar · the Seljuks and the Crusades from the Muslim side · the Mongols and the fall of Baghdad · the Mamluks · the Ottomans · the Mughals and Safavids (the gunpowder empires).
Science, art and cities (12): algebra and al-Khwarizmi · optics and Ibn al-Haytham · medicine: Ibn Sina and al-Razi · astronomy and the astrolabe · geography and Ibn Battuta · paper, libraries and translation · calligraphy · geometric pattern and the arabesque · the mosque in every region · Timbuktu and the trans-Saharan trade · the Silk Roads · Jerusalem in Islamic history.
Living culture and Canada (8): Muslims in Canada (a story told from sourced records) · Islamic Heritage Month · food, halal and hospitality · the Islamic year in a family · Arabic as a world language · Urdu and the languages of Muslim peoples · Muslim-made today (the Made wing) · how to cite the museum (for students).

Each topic gets, by E4: three reading levels on its anchor record, a 60-second explainer, a 12-term glossary, a 10-question practice set, a pathway or trail, and the homework-search phrasings in three languages.

## Appendix C · Tests added across the phases (names, for the lane's checklist)

`scripts/edu.test.ts` (bands, stamps, parity, honorifics, curriculum blocks, quizzes, dilemmas, detective units, topics), `scripts/check-weight.ts` (post-build budgets on the education route list), additions to `scripts/kids.test.ts` (Urdu parity and Urdu-script checks, new pages exist, hub links), additions to `scripts/validate.ts` (leveled sections, `education` block, `did_you_know`, `curriculum`, `quiz`), additions to `scripts/check-site.ts` (front door has five doors in three languages; teen hub has no mascot; offline pack has no external script), and the manual acceptance list per phase recorded with screenshots in `docs/delegation/education-progress.md`.
