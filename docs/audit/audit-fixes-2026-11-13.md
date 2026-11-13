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
