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
