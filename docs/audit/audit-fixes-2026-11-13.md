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
