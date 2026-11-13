# Audit fixes, 13 November 2026: ledger

The run that answers the independent audit of 13 November 2026 (content integrity, production retest, tafsir
walkthrough, explorer sweep). One pull request per part. Every number here was measured on the tree named beside it.
A statement is GREEN only when its acceptance test was run and passed; a shortfall is written as NOT GREEN with the
number reached.

## How this run departs from its brief, and why

| Brief | What the run does | Why |
|---|---|---|
| Pull requests against `release/uat` | Pull requests against `main`, not merged by the agent | `AGENTS.md`, founder rule of 12 November 2026: `release/uat` is retired and no pull request is raised against it. |
| "Do not touch /ur/" | Urdu ships with Arabic and English in every commit | The founder said so in chat on 13 November, during the run ("make sure everything is translated in all three languages, and always touch urdu"). `scripts/pipeline.test.ts` also fails when `i18n/ur.yaml` lacks a key the other two carry. |

## The gates, per pull request

`sh scripts/audit/gates.sh` runs the two gates as separate asserted steps: it matches the validator's own summary
line and requires `: 0 errors,` in it, then runs cite-check over every data record the branch changed and requires
`N pass, 0 fail of N record(s)`. `npm test` is run in full beside them.

| Part | Validation | Cite-check | Tests |
|---|---|---|---|
| I | `validated 58135 entities, 90102 prose files: 0 errors, 4587 warnings` | `cite-check: 4 pass, 0 fail of 4 record(s)` | 37 files, 518 tests passed |
| II | `validated 58120 entities, 90072 prose files: 0 errors, 4605 warnings` | `cite-check: 571 pass, 0 fail of 571 record(s)` (two records the date removal touched had no `provenance.source` on `main` and failed; the field now states what each record's own `extraction_flow` and sources say) | 37 files, 524 tests passed |
| III | `validated 58120 entities, 90072 prose files: 0 errors, 4605 warnings` | `cite-check: 581 pass, 0 fail of 581 record(s)` | 38 files, 529 tests passed |
| IV | `validated 58120 entities, 90072 prose files: 0 errors, 4605 warnings` | `cite-check: 581 pass, 0 fail of 581 record(s)` | 39 files, 533 tests passed |
| V | `validated 58120 entities, 90072 prose files: 0 errors, 4605 warnings` | `cite-check: 581 pass, 0 fail of 581 record(s)` | 39 files, 533 tests passed |

Part I was also built in full (`npm run build` in a separate worktree at `38ac9a6f10`): 202,331 pages, `check-site` 0 errors and 2 warnings, `check-weight` 46 routes and 0 over budget.

## Part I: tafsir

| | State | Evidence |
|---|---|---|
| S1 verse-first landing | GREEN | `/en/tafsir/` leads with "Read by verse" (14 surahs with counts); landing → `/en/tafsir/surah/2/` → `/en/passage/quran-2-255/#tafsir` is two clicks, asserted in `scripts/check-site.ts`. Catalogue below, labelled. |
| S2 Tafsir section on verse pages | **NOT GREEN as written** | 1:1 and 2:255 show the section with al-Tabari's digest, the commentator, the work and the volume as links. **36:58 and 112:1 show the fallback, not content**: the baseline that they have tafsir material did not reproduce (see below). The fallback names the catalogue (23 commentaries), the one read verse by verse (Jami' al-Bayan) and says the verse is not yet covered; no heading is empty and no text is borrowed. All 6,236 verse pages carry the section: 1,715 with a digest, 4,521 with the fallback. |
| S3 surah pages carry their tafsir | GREEN | "Tafsir on this surah" on the surah record page and on the surah map page, with the count ("284 of the 286 verses") and a link; a surah without coverage says so. |
| S4 volume pages explain themselves | GREEN | Coverage in words per surah; "2:3 — not yet covered" on volume 1; the page names and links the commentary and the commentator. |
| S5 honest catalogue, Qur'an door | GREEN | Heading "The volumes of Jami' al-Bayan (Tafsir al-Tabari) in this edition — 16"; `tafsir.json` rows carry `role`, `volume_of`, `verses_covered`; `/{lang}/quran/` is a page; the Mushaf and Surah maps landings each explain the other in one sentence. |

### Baselines that did not reproduce (Part I)

- **"Test verses 1:1, 2:255, 36:58, 112:1 must each show the section with real content."** On this tree (`faf3accebb`)
  the verse digests stop at surah 14: 1,715 verses in surahs 1 to 14 cite a tafsir volume, all of them
  `tafsir-tabari-shakir-v01` to `v16` (15,990 cite markers), and no verse of surahs 15 to 114 does. `content/*/passage/quran-36-58.md`
  and `quran-112-1.md` hold a two-line "place" note and nothing else, and no record in `data/` points a commentary at
  either verse. Giving them content would mean writing commentary or borrowing another verse's, which the brief forbids.
- **"The menu's Quran door lands on a page whose H1 is 'Surah maps'."** On this tree the Explore entry `quran` points at
  `/{lang}/words/quran/`, whose H1 is "The Mushaf"; "Surah maps" is the separate entry `surahmaps` → `/{lang}/surah/`.
  The menu label for the first is "Quran explorer", which is not its H1; that naming drift is S34's business.
- **Found, not in the brief:** volumes 10, 12, 13 and 14 of Jami' al-Bayan listed fewer verses than the verse records
  citing them (37/78, 107/136, 149/151, 146/157: 83 verses missing). Corrected from the same cite lines; the site now
  reads coverage from both the edges and the cite lines.

## Part II: classification and identity

| | State | Evidence |
|---|---|---|
| S6 tag-union browsers | **NOT GREEN in part** | Jinn & Devils: each topic is divided by the record's own class and kind (beings, teachings, events, named figures, questions, works). The "beings themselves" list holds only concepts of kind angel, jinn or devil (17 records) and the build fails if a person-class record appears in it. Ibn Abbas, Ibn Mas'ud, Abu Said al-Khudri, Adam, Musa, Pharaoh and Umm Salama stand under "Named figures in these accounts" in the Devils topic, Isa and Maryam under the same heading in Angels, with a sentence saying the museum classes no human as an angel, a jinn or a devil. No record left the browser (181 before and after). Arabic title «متصفح الجن والشياطين». **What is not done:** the topic a record belongs to is still read from the `jd-*`, `angels-browser` and `dream-browser` tags, because the records carry nothing else that says it; and Jibril, Mika'il, Iblis, Harut and Marut are person-class records with no field saying what kind of being they are, so they stand among the named figures and not among the beings. Typing them needs a schema decision (Part VI, item 7). Other browsers built the same way are listed below. |
| S7 duplicated persons | GREEN for the two named pairs and 13 more; candidates reported | Abaqa: `person/abaga-ibn-hulagu` survives, `person/abagha-khan` is its alias; the built page shows "Parent of: Arghun Khan, Gaykhatu". Solomon: `person/sulayman` survives; the Fars edge is not carried. 13 further pairs provable from the records are merged with `scripts/audit/merge-person.py`. Records 58,135 → 58,120. Alias resolution fixed in the build (below). 76 LIKELY pairs and one PROVABLE pair held back for doubt (`ahmed-wafqi-efendi` / `ahmed-wefik-pasha`: «وفقي» and «وفيق» may be two men) are in `docs/audit/data/s7-candidates.json`, untouched. |
| S8 date integrity | **NOT GREEN in part** | The pass: 27 commits of 9 November 2026 ("data(person): date-enrichment batch"), recognisable by `note: "Date-enrichment pass; source: …"`; 5,835 person records. Checked against each record's own summary and prose: 1,405 agree, 550 conflict, 3,790 give no year to test. Dates removed from 544 of the 550 (540 `died`, 195 `born`); 6 kept after a hand read; none replaced, except Abbas ibn Muhammad, whose year, era and region now follow his own cited summary. Validator check added (`summaryDeathYearMismatch`, tolerance 2 years, 10 for approximate dates, 100 for century precision): 19 records reported on this tree, 11 of them still carrying the pass's note. **What is not done:** the 3,790 untestable dates stay in place. Among testable records the pass was wrong on 25.1% (497 of 1,984 death years) against 0.7% elsewhere, so roughly 900 of them may be wrong; removing all 3,790 would also remove the roughly 2,900 that are probably right. That choice is put to the founder (Part VI, item 8). |
| S9 the Ten | GREEN | `/companions/` lists ten in all three languages (asserted in `scripts/check-site.ts`); derived from the list in `concept/ashara-mubashshara`'s own prose, cited there to al-Tahawi; the page and `companions.json` fail the build when the section and the list disagree. |
| S10 Signs | GREEN; no menu door needs to change | `/signs/` holds 114 records in five ordered steps (24, 29, 15, 12, 34), labelled as the customary order, not a textual one. HTML 3,526,920 B → 253,712 B. The full corpus (2,621) is at `/signs/all/` (3,526,197 B, the old page; Part IV paginates it). All four landings carry the same block stating what each holds. |

### Alias resolution (found while merging)

`validate.ts` accepts a former id as a relation target and as a `[[link]]`; `build-graph.ts` dropped such an edge without a word and `markdown.ts` rendered such a link as plain text; a former id listed in a stub file got a stub page. On this tree: 233 former ids without a file, 80 prose links to them, 34 relation targets. Fixed in `scripts/build-graph.ts`, `site/src/lib/graph.ts`, `site/src/lib/markdown.ts`: edges 148,914 → 148,956 before the merges, stub pages 1,871 → 1,866.

### The same union pattern elsewhere (named report, not changed)

Every browser of this family reads its members from a browser tag plus a build-time detector over passage text; the section a record stands in is a `<prefix>-<section>` tag. Where a section's NAME claims what its members are, the same defect can occur. Reported for the founder's reading, untouched: `site/src/lib/angels.ts` (section tags `angels-*`; its "events" and "doctrine" sections are named for what they hold), `site/src/lib/ghayb.ts`, `nature.ts`, `magic.ts` (shares `jd-devils` records such as Labid ibn al-Asam under "magic-sihr"), `messengers.ts`, `miracles.ts`, `madhahib.ts` (S14 below), `bayt.ts`, `usra.ts`, `ansab.ts`. Only Jinn & Devils unioned OTHER browsers' tags into its own sections.

### Baselines that did not reproduce (Part II)

- **S9, "derive from the concept record's own sourced list":** the concept record's DATA has no list (no relations at all); the ten names are in its prose, section "الأسماء", as ten person links, cited to `aqida-tahawiyya` pp. 29–30. The section is derived from that.
- **S8, Abbas ibn Muhammad's wrong era and region:** they were not written by the date pass but by an earlier Wikidata import (`cea062ecac`, 20 October). Corrected on this one record; other records' era and region tags were not audited.

### Submission-impacting (docs/ai-change-gates.md §3)

Merging 15 records lowers the record count from 58,135 to 58,120 and the person class by 15. The claims register and the evidence map under `docs/outreach/` are reserved to the founder and were not edited.

## Part III: search and reachability

| | State | Evidence |
|---|---|---|
| S11 canon-first search | GREEN on the built site; production changes at the next deploy | Baseline on production (the Grand Tour run's own capture, `docs/fable-run/oracle-output/o06-search-production.out`): 2 of 50. The test set is the frozen 50-query file `scripts/fable/search-queries.json` (names, places, events, practices, buildings, works; Arabic and English). `scripts/search-canon.ts` builds, per language, a map from names to the canon record they name (918 records; 8,014 Arabic and 8,143 English keys; about 350 KB each); the search page shows the record a query names as the first result and Pagefind's results follow. `scripts/search-canon.test.ts` runs the 50 queries through the same index and the same spelling expansion the page uses: 50 of 50, and the five named queries (Muhammad, Saladin, Baghdad, Quran, Kaaba) each return their record. Canon membership and the fame gate are untouched. **The rendered oracle on this branch's full build** (`npm run build` at `3e11ee479c`, served with `astro preview`, `node scripts/fable/o06_search.mjs http://localhost:4390`): **50 of 50, RESULT: GREEN**; its output is `docs/audit/data/o06-search-part3-local-build.out`. That measures the built site, not production. |
| S12 reachability | **NOT GREEN** | Published records within three relation-hops of a cornerstone: 7,149 of 18,690 (38.3%), against 38.1% in the Grand Tour ledger and a target of 60%. Cornerstone dead ends: 14 on this tree before (the canon grew since the ledger's 12), 7 after ten sourced edges. |

### S12: who remains far, and why

- **8,846 of the 11,541 uncovered published records are source records.** A source attaches to the records that cite it by citation, and the oracle's own definition says a citation is not a relation. Sources are 47% of everything published, so without them the measure cannot pass 52.7% whatever else is done: **60% is out of reach for any set of honest edges between subject records.**
- Without the reference apparatus the measure is 7,149 of 9,622 published subject records (74.3%). The remaining 2,473: persons 805, passages 673, works 287, concepts 133, buildings 131, and smaller classes; 10,500 of all uncovered records have no relation at all in the graph.
- **Five of the seven remaining dead ends are period records.** The era a record belongs to is the `periods` field on the record, which the site shows and links, but it is not a relation in the graph.
- Two modelling choices would move the number, and the run made neither, because each turns one field into tens of thousands of edges at once, which is the padding the brief forbids. Their size, from `scripts/audit/s12-what-if.py`:

| Choice | Within three hops | Cornerstone dead ends |
|---|---|---|
| As the graph stands | 7,149 of 18,690 (38.3%) | 7 |
| A. the era field counted as a relation | 8,090 (43.3%) | 2 |
| B. citations counted as relations | 12,868 (68.8%) | 1 |
| A and B together | 14,405 (77.1%) | 1 |

Both are put to the founder (Part VI, item 9). The ten edges added are listed in the commit; each names the page of the source its sentence cites.

## Part IV: presentation, numbers and data surfaces

| | State | Evidence |
|---|---|---|
| S13 one presentation for drafts | GREEN, with one stated exception | The frame "Draft card for … ; not yet checked on the page" is taken off summaries when the graph is built (`scripts/scaffold.ts`; 11,781 records flagged; the data files are unchanged) and "has not been written yet" is reworded in the three strings that carried it. A draft record carries one badge and one sentence (`status.draft`, `status.draft_note`, three languages) on its own page, on hall and class-listing cards, and on the rows of 29 browser templates, with the sentence once at the head of each listing. `scripts/check-site.ts` fails the build on either phrase on any page except the changelog, which quotes them. Review states are untouched. **Exception, by decision:** a passage (verse, hadith) does not carry the badge, because "written with AI help" would be said of the source's own text; its notes are draft and say nothing. **Conflict recorded:** the audit of 5 November decided that pages show no review state (`check-site` still asserts the old chip is absent on one exhibit); this brief asks for the opposite. The brief is the later instruction and is followed; the old assertion still passes because the badge is new markup. |
| S14 counts from rendered sets | GREEN | Every section-style browser's headline is `renderedHeadline(...)`: the distinct records across the sections it renders plus any other list on the page; the build throws when a claimed record is in no section. Miracles and Messengers now count their subject cards. Madhahib: a record stands in its first section and names the others ("Also under"); 168 records, 168 places. |
| S15 one wing population, named | GREEN as a labelling fix | `counts.json` keeps `wings` (records of the wing's own class, what the menu's noun counts) and gains `halls` (records tagged with the wing, what the hall lists) and `definitions`. Words: `wings.words` 13,538 is passages and is defined as such; `halls.words` is 1,056. Coverage's table is labelled "entries tagged with the wing, drafts included". **Not done as recommended:** the brief recommended "primary-wing published" as the one public count. The menu and homepage print a class noun ("{n} people"), so they keep the class count and no published-only count is introduced; the choice of a published-only headline is left to the founder (Part VI, item 10). |
| S16 public numbers generated | GREEN for the surfaces named; residue listed | `site/src/lib/numbers.ts` computes records, stubs, record pages, connections, classes, published, drafts, file line counts, pathways, commits and merged pull requests; the Developers, Backstage and Support pages and the homepage read it through placeholders in the three language files. Commits and pull requests are counted from git at build time (22,675 and 6,436 on this tree; the brief measured 22,254 and 6,268 a little earlier). One definition of "pages" (record pages = records and stubs × three languages), said on the homepage. API front door: `/api/v1/index.json`, written from the list of files produced; the Developers page names it. **Residue:** "300 pathways" is still typed in four strings (homepage tour line and Coverage, three languages); whether `https://api.islam.museum/api/v1/` itself answers depends on the API host's configuration, which is outside the repository. |
| S17 labels, sections, stray strings | (a) GREEN (c) GREEN (d) GREEN (e) GREEN as a marking (f) GREEN; **(b) did not reproduce** | (a) `labelOf` falls back to a Latin name or the id spelled out on English pages; `meta/label-gaps.json` lists 246 published persons without an English label (786 records in all; 7,492 records have no Arabic label, by class in the same file). (b) see below. (c) event titles shared by more than one record get their year: shared English titles 73 → 2, Arabic 33 → 5; the remainder look like the same event filed twice and are listed below. (d) a start and end on the same date print once, without the extra dagger. (e) 18 feed tests require tagged records to stay in a feed, so an unconnected record stays in `items` marked `unconnected: true` and is listed under `unconnected`. (f) `export-api` strips the marker from every file and throws if one would ship: 595 files carried it, 0 do. |
| S18 page weight | GREEN for every page the brief names; **NOT GREEN for 13 other pages** | Table below. Method: removal and pagination only. No existing budget was raised; 25 new entries cap the listings at 500 KB (`LISTING_BUDGETS`). |
| S19 API surface | GREEN | `chains.json`: 307 `successor_of` edges with their sources and the 123 maximal runs they form; nothing inferred. `openapi.json`: the maintained OpenAPI document served beside the data, with the new files described (60 paths). `index.json`: the front door. |
| S20 footnote apparatus | Diagnosed; nothing fabricated | The renderer drops nothing: `check-site` already fails on a note link without its anchor. The families without notes have none written. `node scripts/audit/s20-footnotes.mjs`: nature 118 of 119 records without a single cite marker (117 have no prose at all), hisab 25 of 25, madhahib 43 of 167, ansab 10 of 203, ghayb 10 of 85, bayt 7 of 57; across all subject records 14,346 of 34,684 have no marker and 14,312 no prose. Every one of them lists its sources in the Sources section (22 list none). |
| S21 UAT graph parity | GREEN on the live UAT site | `release/uat` is retired; UAT is deployed from `main`. `https://uat.islam.museum/en/graph/?from=person/muhammad`, 13 November: a constellation of 82 nodes renders, no console error. `scripts/csp-headers.test.ts` keeps both API hosts in `connect-src`. |

### S18: bytes, before and after

Before: the brief's production measurements (document only). After: the Arabic page (the heaviest script) in a scoped production build of this branch, as `check-weight` measures it (HTML with its inlined CSS plus the `/shell/*.js` files it loads).

| Page | Before | After | Heaviest sub-page |
|---|---|---|---|
| `/ibadat/` | 4,985,273 B | 326 KB | 248 KB |
| `/people/` | 4,021,339 B | 116 KB | 243 KB (letter م) |
| `/mukatabat/` | 3,614,718 B | 274 KB | 240 KB |
| `/signs/` | 3,526,920 B | 276 KB (and `/signs/all/` 338 KB) | 329 KB |
| `/akhlaq/` | 3,503,995 B | 349 KB | 322 KB |
| `/messengers/` | 2,241,231 B | 266 KB | 244 KB |
| `/objects/` | 2,201,591 B | 366 KB | 226 KB |
| `/time/` | 2,045,876 B | 159 KB | 287 KB (6th century) |
| `/ansab/` | 1,744,021 B | 303 KB | 214 KB |
| `/hisab/` | 1,546,825 B | 337 KB | 338 KB |
| `/islamic-economy/` | 1,512,052 B | 302 KB | 423 KB |
| `/miracles/` | 1,267,619 B | 305 KB | 248 KB |
| `/battles/kind/battle/` | 1,483 cards on one page | 195 KB, 200 cards a page | same |
| `/browse/person/` (not named) | 1,973,776 B on this tree | 105 KB | 303 KB |
| `/wander/` (not named) | 8,281,443 B on this tree | 98 KB | none |

Rows per sub-page: 75 in the browsers, 300 cards in the halls, 1,200 names in the class listings, 200 cards in the battle listings. The filter box of a paginated page searches the whole list through `/<lang>/list-index/<browser>.json` (largest: people 1.47 MB, fetched only when someone types).

**Still over 500 KB, not changed, with the reason** (Arabic, this tree; one record page, `person/muhammad`, is 616 KB and is a record, not a listing): the changelog 1,875 KB (it renders the release notes whole; not a listing); `/art/` 1,042 KB; three theme pages (law and courts 1,130 KB, scripture 734 KB, worship 637 KB); `/modern/new/` 993 KB and `/modern/figures/` 571 KB (the latter already has a 700 KB budget); `/ansab/muhammad/` 851 KB and `/messengers/muhammad/` 631 KB (one subject's page, every passage that names him); `/words/poetry/` 795 KB; `/timeline/events/` 780 KB; `/fatwa/` 644 KB; `/place/` 607 KB (the map's own index); `/references/` 604 KB. They need the same treatment and were not reached.

### Baselines that did not reproduce (Part IV)

- **S17(b), "concept, building and work pages render no Connections or Sources section in server HTML":** on this tree `concept/malaika`, `building/kaaba` and `work/jami-al-bayan` each render both sections in the built HTML (`id="conn"` and `id="src"` present, without JavaScript). Nothing was changed.
- **S16, Backstage "179,997 pages":** that figure was records and stubs × three languages, the estimate the page computed; a script then replaced it with the deploy's count of every HTML file. The replacement is removed so the page prints the same record-page count as the homepage.

### Found, not in the brief (Part IV)

- Event titles still shared after year-qualifying, which look like one event filed twice: `event/battle-of-bathys-ryax` and `-872`; `event/conquest-of-kirman` and `event/kirman-conquest`; `event/conquest-of-emesa-636` and `event/conquest-of-hims`; `event/death-of-qutayba-ibn-muslim` and `event/qutayba-death`; `event/ghazwat-banu-qaynuqa` and `event/siege-of-banu-qaynuqa`; `event/siege-of-acre-1831` and `event/siege-of-akka-1831`. Untouched: the person merges of S7 were the mandate, not events.
- The Urdu strings of the Developers page are English text. The sentences this run changed there are now Urdu; the rest of that block is not translated.

## Part V: explorer repairs

| | State | Evidence |
|---|---|---|
| S22 Hadith Library | **NOT GREEN: diagnosed, not repaired** | The "books" under Bukhari and several other collections are passage records of unit `chapter` that are page-numbered excerpts ("… p. 3"), with no report records filed under them and no topic title in their data; the Muwatta's are real books with reports. Titles cannot be given where the records carry none, and topic and narrator access across collections needs a model the records do not have yet. Nothing was changed. This is the largest item left. |
| S23 Fatwa Explorer | GREEN | Find box over all 345 fatwas (whole-list index); "By subject": 183 subjects from the fatwas' own `about` relations (331 of 345 name one; the 14 that do not are said to be listed under their source), one page each; by source, one page each (7). The disclaimer sentence is on the landing and on every subject and source page. Landing 644 KB → 110 KB; largest sub-page 496 KB. |
| S24 passage browsers | **Half GREEN** | Order: in 21 browsers the museum's own records lead and passages follow (Paradise: 22 records, then 201 passages). **Not done:** the axes the intros promise (occasions in Du'a, virtues and vices in Akhlaq, acts of worship in Ibadat). Sections are still by source after the lead section, and the intros were not rewritten. |
| S25 Graph Explorer | GREEN | `scripts/audit/e2e-graph.mjs`, 11 of 11: a typed name offers suggestions and becomes the centre (Saladin); a star click re-centres; the list's "Make it the centre" re-centres; visited centres are shown with a way back; a filter in force is badged at the box with one-click clear; an unknown name is reported at the box, in view; no script error. On this tree the star click and the centre button already worked; the name search, the trail, the badge and the message at the control are new. |
| S26 the map's time control | **Half GREEN** | The year can be typed in either calendar (656 AH and 1258 CE both move the bar to 656 AH · 1258 CE) and the panel says what the bar does: it lights the places with dated records in that year and names each region's era, and does not filter a place's own list. **Not done:** filtering a selected place's records by year, and a starting year chosen from what is on screen (it still opens at 11 AH). |
| S27 two timelines | GREEN | Menu lines tell them apart; each page names the other in one sentence; the Time wing has a typed year box (AH or CE) that opens the century's page, and the century pages (`/time/all/c06/` …) are static and linkable. |
| S28 addressable calendar | GREEN within a stated window | `/calendar/<year>/<month>/` and `/calendar/<year>/` for 1438 to 1458 AH (ten years either side of the build's Hijri year): 252 month pages and 21 year pages per language, no script, real previous and next links; the calendar page links them. Years outside the window open in the interactive calendar; the page says so. |
| S29 Journeys front door | GREEN | `/journeys/` lists all 50 journeys by kind with their stations; the menu opens it; every journey page links the index and up to six journeys of its kind. |
| S30 Battles search | GREEN | Find box on the landing over every battle record; kind and era listings are 200 cards a page (S18). |
| S31 Ideas hall furniture | GREEN | Done with S32: find box, letter navigation and a count that is the rendered set. |
| S32 one hall pattern | GREEN, with two residues | Every hall: what the wing promises (Living: its 45 practice records first; Made: its listings), the wing's cornerstones, then the paginated index. Place: the index is headed "Index of the N places on the map". **Residue:** the Today wing's cards are still computed for the build's day and corrected to the visitor's day by script; without JavaScript the date shown is the build's, unlabelled as such. |
| S33 Jobs honesty | GREEN | The introduction and the menu line promise what is there; the status line counts the jobs with no person recorded; each such job says so in the list and on its page. |
| S34 names, eyebrows, menu | GREEN, one eyebrow left | `scripts/audit/s34-names.ts`: menu label = H1 = title for 53 of 53 destinations in English and in Arabic (8 and 7 mismatches before). Five "in the making" eyebrows replaced; the Asma browser's is left, since the brief did not name it as finished. Menu grouped in six groups plus "More ways in". Ghayb's Arabic title is «متصفح عالم الغيب». |
| S35 Modern's headline | GREEN; **baseline partly not reproduced** | The section cards already carried their counts on this tree. Added: one line reconciling them with the headline (2,307 places for 2,304 distinct records). |
| S36 loading and error states | GREEN for Search and Graph; the Map already had them | Search: "Searching…" from the first keystroke. Graph: loading and failure are said at the box. Map: `place-map.js` already shows a loading line and a retry on failure. The whole-list filter of the paginated browsers says when it is searching and when it failed. |

## The closing ledger: S1 to S36

| | State | In one line |
|---|---|---|
| S1 | GREEN | Verse-first landing; two clicks to al-Tabari on 2:255. |
| S2 | **NOT GREEN as written** | Section on every verse page; 36:58 and 112:1 have no commentary in the repository and show the honest fallback. |
| S3 | GREEN | "Tafsir on this surah" on surah records and surah maps. |
| S4 | GREEN | Coverage in words, gaps stated, work and commentator linked. |
| S5 | GREEN | Volumes labelled as one work's volumes; `/quran/` answers. |
| S6 | **NOT GREEN in part** | No human among the beings; topic membership still from tags; six person-class beings untyped. |
| S7 | GREEN, candidates reported | 15 pairs merged; alias resolution repaired; 77 pairs left untouched. |
| S8 | **NOT GREEN in part** | 544 grafted dates removed; validator check added; 3,790 untestable dates remain. |
| S9 | GREEN | The Ten are ten, from the doctrine record's own list, with a build check. |
| S10 | GREEN | Signs scoped and ordered; no door changed. |
| S11 | GREEN on the built site | 50 of 50 in the rendered oracle on a full local build; production was 2 of 50 and changes at deploy. |
| S12 | **NOT GREEN** | 38.3% within three hops (target 60%); dead ends 14 → 7; the ceiling without sources is 52.7%. |
| S13 | GREEN | Zero scaffolding phrases; one badge and sentence; passages excepted by decision. |
| S14 | GREEN | Headlines from rendered sets, with a build check. |
| S15 | GREEN as labelling | Both populations named and defined; no published-only count introduced. |
| S16 | GREEN, small residue | Public numbers computed; one meaning of "pages"; "300 pathways" still typed in four strings. |
| S17 | GREEN except (b) | (b) did not reproduce: the sections are in server HTML on this tree. |
| S18 | GREEN for the named pages | 13 other pages still over 500 KB, listed. |
| S19 | GREEN | `index.json`, `chains.json`, `openapi.json`. |
| S20 | Diagnosed | The notes were never written; counts per family reported; nothing fabricated. |
| S21 | GREEN | Verified on the live UAT site. |
| S22 | **NOT GREEN** | Diagnosed only. |
| S23 | GREEN | Find box and subject axis. |
| S24 | **Half GREEN** | Order done; promised axes not done. |
| S25 | GREEN | 11 of 11 end-to-end checks. |
| S26 | **Half GREEN** | Typed year and an honest label; no per-place year filter. |
| S27 | GREEN | Names, cross-references, year access. |
| S28 | GREEN within 1438–1458 AH | Static month and year pages. |
| S29 | GREEN | Journeys landing. |
| S30 | GREEN | Battles find box; paginated listings. |
| S31 | GREEN | Ideas hall has its furniture. |
| S32 | GREEN, residue | One hall pattern; "today" without JavaScript still the build's day. |
| S33 | GREEN | Jobs say what they hold. |
| S34 | GREEN | 53 of 53 labels match in English and Arabic. |
| S35 | GREEN | Reconciliation line added; counts were already there. |
| S36 | GREEN | Loading and error states at the control. |

Count: 26 GREEN (some with a stated residue), 3 half GREEN (S24, S26, and S15 as a labelling answer), 6 NOT GREEN in whole or part (S2, S6, S8, S12, S20 as a diagnosis, S22).

## Scorecard: every explorer named in the brief

| Explorer | Sweep baseline | After this run |
|---|---|---|
| Tafsir Browser | Volume shelf; one of 23 commentaries wired; grids of numbers | Verse first; Tafsir on every verse page; volumes explain themselves. Fixed. |
| Mushaf and Surah maps | `/quran/` 404; two instruments unexplained | Door added; each explains the other. Fixed. |
| Jinn & Devils | Humans listed as devils and angels | Grouped by what records are; six beings still untyped. Mostly fixed. |
| Angels Browser | 34 records, sound | Unchanged; linked from Jinn & Devils. |
| Companions Browser | The Ten listed nine | Ten, derived, checked. Fixed. |
| Signs, Qiyama, Janna, Nar | Signs a superset of the other three | Signs scoped and ordered; all four say how they differ; own records first. Fixed. |
| Search | 2 of 50 canon-first on production | 50 of 50 on the built site. Fixed pending deploy. |
| Graph Explorer | Name search dead, errors below the fold, invisible filters | Name search, trail, badge, errors at the box, end-to-end check. Fixed. |
| People hall and the other halls | 4 MB pages; draft-card text on 2,905 cards; no two alike | One pattern, paginated index, one draft badge. Fixed. |
| Ideas hall | No filter, letters or count | All three. Fixed. |
| Living and Made halls | Alphabetical dumps contradicting their wing cards | Open with what the wing promises. Fixed. |
| Place hall and map | Time control appears to do nothing; "all 3,873" over 3,891 | Typed year, honest label, index relabelled; no per-place year filter; page still 607 KB. Partly fixed. |
| Time hall and Timeline Explorer | Indistinguishable names; no year access | Told apart, cross-referenced, year box, century pages. Fixed. |
| Calendar | Months not addressable | Month and year pages for 21 years. Fixed within the window. |
| Journeys | One journey in the menu, 49 hidden | Landing with all 50. Fixed. |
| Battles | No name search; 1,483 cards on one page | Find box; 200 a page. Fixed. |
| Hadith Library | Empty book pages dressed as content | Diagnosed only. Not fixed. |
| Fatwa Explorer | No filter, institution only | Find box and 183 subjects. Fixed. |
| Du'a, Akhlaq, Ibadat | Sections do not match the axes their intros promise | Own records first; axes not built. Partly fixed. |
| Miracles, Messengers | Headline under-counts the page | Headline is the rendered set. Fixed. |
| Madhahib | 331 slots for 168 records | One place each, others named. Fixed. |
| Jobs | Promise of holders not kept | Says what it holds. Fixed. |
| Modern | Headline not checkable | Reconciles on the page. Fixed. |
| Khulafa, Inventions, Asma | "In the making" eyebrows; Arabic labels on English pages; name drift | Eyebrows replaced (Asma's left), label fallback, names aligned. Fixed. |
| Ghayb | Arabic title "metaphysics" | «متصفح عالم الغيب». Fixed. |
| Developers, Backstage, Support, Coverage, homepage | Typed, stale, disagreeing numbers; API front door 404 | Computed numbers, one meaning of pages, `index.json`. Fixed; the bare `/api/v1/` address depends on the host. |
| Nature pages | Summaries with no notes | Diagnosed: 117 of 119 have no article. Not fixed (nothing to restore). |
| Wander (not in the brief) | 8.3 MB page | 98 KB. Fixed. |

## Retest list for the founder's reviewer, after merge and deploy

Each line is an address and what to do there. Arabic and English behave alike; check both where a line says so.

1. `/en/tafsir/` → "Sura 2: Al-Baqara" → `2:255`: the Tafsir section opens with al-Tabari, Jami' al-Bayan, vol. 5. Two clicks.
2. `/en/passage/quran-1-1/` and `/ar/passage/quran-2-255/`: a section headed Tafsir (تفسير) with commentator, work and volume linked.
3. `/en/passage/quran-36-58/` and `/en/passage/quran-112-1/`: the fallback sentence (23 commentaries, Jami' al-Bayan, not yet reached). No empty heading.
4. `/en/tafsir/jami-al-bayan-shakir-v01/`: "Sura 2: Al-Baqara — verses 1–2, 4–43" and "2:3 — not yet covered".
5. `/en/quran/` and `/ar/quran/`: a page, four doors. `/en/words/quran/` and `/en/surah/`: one sentence each naming the other.
6. `/en/companions/`: ten chips under "The Ten promised Paradise", Sa'd ibn Abi Waqqas among them.
7. `/en/jinn-devils/`: under Devils, Ibn Abbas and Umm Salama stand under "Named figures in these accounts"; no person under "The beings themselves". `/ar/jinn-devils/`: title «متصفح الجن والشياطين».
8. `/en/person/abagha-khan/` redirects to `/en/person/abaga-ibn-hulagu/`; that page lists "Parent of: Arghun Khan, Gaykhatu". `/en/person/sulayman-ibn-dawud/` redirects to `/en/person/sulayman/`; no "Lived in: Fars".
9. `/en/person/abaza-muhammad-pasha/`: no 1576–1634 above the 1769 summary. `/en/person/abbas-ibn-muhammad/`: 884 CE · 271 AH.
10. `/en/signs/`: 114 records in five numbered steps; `/en/signs/all/`: the full index; `/en/qiyama/`, `/en/janna/`, `/en/nar/`: the "Four browsers, four subjects" block.
11. `/en/search/?q=Muhammad`, `Saladin`, `Baghdad`, `Quran`, `Kaaba`, `Ibn Sina`: the first result is the record, marked "Museum cornerstone". Then `node scripts/fable/o06_search.mjs https://islam.museum`.
12. `/en/people/`: about 110 KB; "Cornerstones of this wing", then "The full index" with letters; open a letter, then page 2. No "Draft card for" anywhere; draft cards carry the badge "Draft".
13. `/en/ibadat/`, `/en/akhlaq/`, `/en/mukatabat/`: under 500 KB; "All N in …" opens the section's pages; type in the filter box and the matches from the whole list appear under it.
14. View source of any page and of `/api/v1/person/index.json`: no "Draft card for", no "has not been written yet", no `needs_source`.
15. `/en/miracles/`, `/en/messengers/`: the headline number equals the records listed. `/en/madhahib/`: each record once, with "Also under".
16. `/en/developers/`, `/en/backstage/`, `/en/support/`, `/en/`: the record count is the same on all four; "record pages" is the same number wherever pages are counted.
17. `https://api.islam.museum/api/v1/index.json`, `/chains.json`, `/openapi.json`, `/meta/counts.json` (keys `wings`, `halls`, `definitions`). Also try the bare `https://api.islam.museum/api/v1/`: if it still answers 404, that is the host's configuration, not the build.
18. `/en/event/battle-of-marash/`, `-694/`, `-953/`, `-1920/`: four different titles, each with its year; the 694 page shows one date.
19. `/en/graph/`: type "Saladin", choose it; click a star; use "Centres visited" to go back; click a legend type and clear it from the badge; type "zzzz". Then `node scripts/audit/e2e-graph.mjs https://islam.museum`.
20. `/en/place/`: in the panel, "Go to year" 656 AH, then 1258 CE; the year bar moves; the note says what the bar does.
21. `/en/time/`: "Go to a year" 656 AH opens the 13th-century page; the sentence under the axis links the Timeline Explorer, and `/en/time-browser/` links back.
22. `/en/calendar/1447/9/`, `/en/calendar/1447/`, `/en/calendar/1448/6/`: pages; previous and next are links; try with JavaScript off.
23. `/en/journeys/`: fifty journeys; `/en/journey/hijra-route/`: "More journeys".
24. `/en/battles/`: the find box finds Yarmuk; `/en/battles/kind/battle/` is paged.
25. `/en/fatwa/`: the find box; "By subject" → Zakat; the disclaimer on that page.
26. `/en/jobs/`: the introduction and the count of jobs with no person recorded. `/en/modern/`: the reconciliation line.
27. The Explore menu: six groups and "More ways in"; every label equals the heading of the page it opens.
28. Any phone-width check of items 12, 19, 20 and 25: no sideways scroll.

## After the run: the 77 candidate pairs (S7), 13 November 2026

The founder approved merging the pairs that are the same person. Both records of every pair were read before merging: **51 merged** (`scripts/audit/merge-person.py`, which now also adds to an existing alias list), **24 left as different people** (pairs 1, 9, 12, 16, 20, 21, 28, 33, 40, 51, 52, 53, 54, 55, 56, 59, 61, 63, 64, 69, 70, 72, 74, 76), **2 undecided** (26, the two Umayr ibn Wahb al-Jumahi records; 71, al-Harith ibn Badr and Haritha ibn Badr al-Ghudani). The verdicts rest on the names, dates and summaries the records carry, not on a fresh reading of the biographical dictionaries. Pair numbers are the order of `docs/audit/data/s7-candidates.json`. In pair 11 the record kept is `person/dawud-al-zahiri`, the canon member, so the canon register is unchanged. The merge script carries sources, relations, names, identifiers and prose; 83 further fields that only the removed record held (roles, regions, periods, gender, faith with its basis, story roles, one "did you know" fact and the like) were carried over word for word in a second pass, checked field by field. A birth or death date held only by the removed record was not carried in five pairs (17, 27, 42, 43, 66), by the script's rule for dates from the date-enrichment pass. The same check on the 15 pairs merged earlier in this run found 9 fields left behind on 7 of them (faith, periods, themes, occupations); they were carried over the same way. The script itself still carries only the kinds named in its header: run the field check after it.

Pairs 26 and 71 were settled the same day and merged on the founder's word: for 26, a companion biography compilation (sahaba.rasoolona.com, entry for Umayr ibn Wahb ibn Khalaf al-Jumahi) carries both the Tabuk report and the reinforcement to Egypt; for 71, al-Tabari on 5:34 (reports 11879 to 11881, read on quran.ksu.edu.sa) tells the story of Haritha ibn Badr, whom the editor's note identifies as al-Ghudani. Kept: `person/umayr-ibn-wahb-al-jumahi` (the published record) and `person/haritha-ibn-badr`. `merge-person.py` now carries every field only the removed record held, so the separate field check is no longer needed. Final count for the 77 pairs: 53 merged, 24 different people.

## Founder decisions on Part VI, 13 November 2026

Recorded in `docs/decisions/inbox/audit-part-vi-founder-choices-2026-11-13.yaml`. A second model (Gemini) was asked for research and for advice on the choices; its research was checked against the pages it cited before use, and its advice was overruled on three points.

| Item | Decision | State |
|---|---|---|
| AI text on published records (items 1, 13; the Kiswa) | Label the text; records stay published; wing counts unchanged | Done: `status.ai_passages`, `status.ai_narrative`, `tafsir.ai_note`; marker `provenance.lead_deepened` or `status.ai_unread` |
| Tafsir digests (item 11) | One sentence inside the Tafsir section of the verse pages that have a digest | Done |
| Beings filed as persons (item 7) | Optional `being` on persons; Jibril and Mika'il typed as angels from al-Tabari on 2:98; the four disputed beings untyped | Done |
| Untestable dates (item 8) | Compare with Wikidata where there is an id; the rest leave timelines and sorted lists and stay on the page, marked unverified | To do |
| Connectedness (item 9) | Measure subject records only; count the sources nothing cites beside it | Done: `scripts/audit/subject-reach.py` |
| S2 | Write the two missing digests from al-Tabari, al-Turki edition, vol. 19 pp. 466-469 and vol. 24 pp. 727-730 | Done: S2 is GREEN for the two verses the brief named; the pages were read on Shamela through a fetch, not on a printed copy |
| S24 | Build the Du'a occasions axis from al-Nawawi's al-Adhkar (structure checked on Shamela) | To do |
| The Signs door (item 6) | Not raised; stays as built | |

### Connectedness, restated (founder decision, 13 November 2026)

The Grand Tour's target (60% of all published records within three relation-hops of a cornerstone) is out of reach by construction, because 47% of published records are sources and a citation is not a relation. That oracle and its baseline are left as they are. The measure the museum reports from now on is over published subject records (everything but sources), with two numbers beside it, from `python3 scripts/audit/subject-reach.py` on the tree of 13 November 2026:

| Measure | Value |
|---|---|
| Published subject records within three hops of a cornerstone | 7,138 of 9,833 (72.6%) |
| The Grand Tour's measure, for comparison | 7,138 of 18,679 (38.2%) |
| Source records that no record cites | 107 of 9,211 |
| Published subject records with no relation at all | 1,654 (passages 671, media 222, works 162, buildings 116, concepts 100, listings 79, groups 76, places 72) |

The 74.3% quoted in the Part III section was measured before the duplicate merges and the day's other changes on `main`. The Grand Tour's own numbers file (`docs/fable-run/NUMBERS.md`) carries a similar figure that also leaves out media and dataset records (73.9%); this one leaves out sources only. No target is set here: the last row is the work list.
