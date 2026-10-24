# Showcase Tier prose: day-1 report (lane `showcase-prose`)

_Written 24 October 2026. Progress file: [`showcase-prose-progress.md`](showcase-prose-progress.md). Queue: [`showcase-queue.md`](showcase-queue.md). Lane: [`../agents/lanes/showcase-prose.md`](../agents/lanes/showcase-prose.md)._

## Counts

| Item | Count | Notes |
|---|---|---|
| Records raised to completeness 3 (Sicily, Phase 1) | 7 | `event/first-raid-on-sicily`, `event/aghabid-conquests-sicily`, `place/siqilliya`, `polity/emirate-of-sicily`, `place/palermo`, `person/al-idrisi-muhammad-ibn-abd-allah`, `journey/sicily-to-granada-jubayr` |
| Records raised to completeness 3 (Egypt, Phase 2) | 27 | `place/cairo`, `place/al-fustat`, `place/alexandria`, `building/masjid-amr-fustat`, `building/dar-al-hikma-cairo`, `person/shajar-al-durr`, `person/al-hakim-bi-amr-allah`, `place/misr`, `place/al-fayyum`, `person/jawhar-al-siqilli`, `person/al-muizz-li-din-allah`, `building/al-azhar`, `person/baybars`, `person/qalawun`, `person/al-nasir-muhammad-ibn-qalawun`, `building/masjid-sultan-hasan`, `polity/fatimid-caliphate`, `polity/ayyubid-dynasty`, and (batch 6) `person/qutuz`, `person/salah-al-din-yusuf-ibn-ayyub`, `person/al-malik-al-kamil`, `person/al-malik-al-salih-ayyub`, `building/masjid-ibn-tulun`; and (batch 7) `person/al-malik-al-mansur-ali-ibn-aybak`, `person/al-malik-al-adil-ayyub`, `person/al-malik-al-aziz-uthman`; and (batch 8) `person/izz-al-din-aybak` |
| Trails at completeness 3 | 2 | `exhibit/path-mamluk-cairo`, `exhibit/path-fatimid-cairo` |
| Trails still below 3 | 1 | `exhibit/path-sicily-islam` at 2 (room 4 features `question/what-were-the-crusades`, completeness 1) |
| Records skipped and logged | 3 | `building/palermo-mosque-1591`, `person/asad-ibn-al-furat`, `person/ibn-jubayr-muhammad` (reasons below) |

Note: the Phase 1 entry in the progress file's batch heading says "2 skipped"; the batch's own list names three, so this report uses three.

Egypt target: the brief asks for about 100 records. The Egypt set is at 27 records, plus the two Cairo trails.

Batch 6 (Egypt, after this report was first written) corrected one error in the Qutuz prose: the battle is Friday 15 Ramadan 658 (Khitat p. 1916), not 25. The killing day differs between the Khitat (mid-Dhu al-Qa'da) and Shadharat (the sixteenth); both are kept and noted.

## Families and sources

- **Families registered:** none. Archnet was the unlock for the Egypt set, but it was not registered (see D15).
- **Source entities added:** `source/khitat-maqrizi-1998` (al-Maqrizi, *al-Mawa'iz wa-l-i'tibar*, Madbouli 1998; D17). The classical books already in the harvest needed no new entity.
- **Sources cited for the Ayyubid end date:** `source/tarikh-islam-hasan-ibrahim` (pp. 494, 698) and the Khitat (p. 1912). Wikidata is a pointer and is no longer cited for that date.

## Skipped records and reasons

- `person/asad-ibn-al-furat` (D8): the claim of death at Syracuse and burial at Palermo cites Wafayat al-A'yan, but the phrase does not appear in any local Wafayat volume. The record stays at completeness 1.
- `person/ibn-jubayr-muhammad` (D9): the origin and death place cite Nafh al-Tib p. 491, which does not match the local OCR. The record stays at completeness 1. The Rihla itself is verified and carries the journey record.
- `building/palermo-mosque-1591`: no source in the local workspace supports it, and the Wikidata candidate's identity is not checked.

## Decisions for the founder

| # | Question | State |
|---|---|---|
| D15 | Archnet: every request returned HTTP 429 with a bot-detection checkpoint. Its terms page could not be read, and the terms conflict between `docs/plan/08-prior-art.md` (CC BY-NC 4.0, no API) and `source-families.md` (open access) | Not registered. The founder must read the terms in a visible session, or supply the posture |
| D16 | Merge `place/iskandariyya` into `place/alexandria`? | Not merged. A merge changes ids and aliases across the graph |
| D26 | `polity/ayyubid-dynasty` narrowed from 1341 CE (Wikidata) to Egypt, 1250 CE (648 AH) | Done. The founder should confirm the narrowing. A dynasty-wide end needs a source for the Syrian and Yemeni lines |
| D22 | Al-Azhar's founding year is not in the local OCR | The record says so. Not guessed |
| D23 | Sultan Hasan's completion date | Not restored. `built` records the start of the works (1356 CE, 757 AH) |
| D13 | Idrisi's birth and death years (Mawsu'at al-A'lam) | Kept, flagged, not re-checked locally |

## Open checks and items for review

- **Urdu drafts:** all ur translations were drafted by Claude Haiku 5.5 and need founder review.
- **Shajar al-Durr's death** (Shadharat p. 276): cited but not re-checked locally; flagged in her record.
- **Dar al-Hikma's da'wa paragraph** (Hasan Ibrahim pp. 405, 409): cited, not re-checked locally.
- **Period file:** `content/ar/period/crusades-ayyubid-mamluk.md` line 16 still gives the Ayyubid span as 1171–1341. It belongs to another lane and should match D26.
- **Education-level sections** (للبراعم / للمستكشفين / للدارسين and their en and ur equivalents) in several place and polity records are other lanes' drafts and were not touched.
- **Fatimid start (909 CE):** a year-level match from the Khitat's 297 AH entry, not an explicit "founded" statement (D24).

## Queue position

- **Phase 1 (Sicily pilot):** in progress. Seven records are at 3; the trail is at 2 because of one feature.
- **Phase 2 (Egypt set):** in progress. Twenty-seven records and two trails at 3. The brief's ~100 target is not reached.
- **Phase 3 (general queue):** not started. The queue has 313 exhibits, 50 journeys and 1,240 distinct featured records, of which 1,171 were below completeness 3 at generation time (`showcase-queue.md`).

## Checks

- `npm run validate`: 0 errors, 7,295 warnings (unchanged across the day's batches).
- `npm run cite-check` on each batch's records: all pass.
- `npm run graph` and `npm run coverage` regenerated for the batches that changed entities.
- `npm test`: **not run.** Full test suite and CI are deferred to the founder per instruction 0.2.
