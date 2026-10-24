# Showcase Tier prose: progress (lane `showcase-prose`)

_Opened 24 October 2026. Lane document: [`../agents/lanes/showcase-prose.md`](../agents/lanes/showcase-prose.md). Queue: [`showcase-queue.md`](showcase-queue.md). Branch `content/showcase-prose`. Stubs `data/_stubs.d/showcase-prose.yaml`._

## Phase plan

| Phase | Scope | Budget | State |
|---|---|---|---|
| Setup | Repo, branch, dependencies, harvest workspace | 45 min | Done (see day log) |
| 0 | Register the lane; queue file | 30 min | Done (this commit) |
| 1 | Sicily pilot: `exhibit/path-sicily-islam` and its 10 featured records and journey | ~2.5 h | In progress |
| 2 | Egypt showcase set | ~2.5 h | In progress: batch 1 done (4 records). Archnet blocked, see D15; 100-record target not reached |
| 3 | General Showcase queue | remainder | Not started |

## 0.0 Compliance checklist (instructions of 24 October 2026)

| Line | Checked against | Verified |
|---|---|---|
| Publication standard: no review; one source enough; records enter `status.review: published` | `docs/agents/publication-standard.md` on `origin/main` at `fe34884ea` | Yes |
| Source families catalogue is the shelf; registration before first use | `docs/agents/source-families.md` on `origin/main` at `fe34884ea` | Yes |
| Tests and CI deferred: per batch only `npm run cite-check`; `npm test` not run; no waiting on CI before merge | Founder instruction 0.2 | Yes (see deferral note below) |
| Evidence gathered on this Mac into the local harvest workspace; writing from local files only | `~/islam-museum-harvest/` (books, OCR, claims) | Yes |
| Starting point of this branch | `origin/main` at `615949d2a` | Yes |

**Deferral note (instruction 0.2):** the full test suite (`npm test`) and CI are deferred to the founder and are not run in this lane. `npm run validate` is run only at phase checkpoints if it finishes quickly; its result is recorded in the batch entries below.

## Decisions taken without the founder (day log)

| # | Question | Options | Choice | Why |
|---|---|---|---|---|
| D1 | Branch name | Use the run's `content/showcase-prose` vs the worktree's `claude/islam-museum-enrichment-224ce4` | `content/showcase-prose`, created from `origin/main` in this worktree | The run instruction names the branch; the worktree is the isolated copy the session was given |
| D2 | Clone or worktree | Clone to `~/islam-museum` vs use this worktree | This worktree | The session runs in a git worktree; a second clone would split the work. The repo already exists on this Mac |
| D3 | Local model (Ollama) | Pull a model for first passes vs Claude-only | Claude-only, no model drafts | Every line must be checked against the local source anyway; the day's output must not depend on Ollama (instruction 1.4). A drafted line still needs the same check, so no time is saved on the claims that matter |
| D4 | Brew installs (tesseract, ocrmypdf, poppler, ripgrep, jq, pandoc) | Install vs skip | Skip. `tesseract`, `pdftotext`, `rg` and `jq` are already present; the OCR of the books needed for Phase 1 is already in the workspace | Setup must not eat the day (instruction 1.1–1.3) |
| D5 | Slug drift in the Sicily brief | Use the brief's slug vs the live slug | Live slugs: `event/aghabid-conquests-sicily` (brief said `aghlabid`), `polity/emirate-of-sicily`, `place/siqilliya`, `place/palermo`, `building/palermo-mosque-1591`, `event/first-raid-on-sicily`, `person/asad-ibn-al-furat`, `person/al-idrisi-muhammad-ibn-abd-allah`, `person/ibn-jubayr-muhammad`, `journey/sicily-to-granada-jubayr` | Instruction 1: use the real slug and note it |
| D6 | Sicily source for the Futuh al-Buldan | Cite the Mu'assasat al-Ma'arif 1407 scan (`source/futuh-buldan-maarif-1407`) | Same. The maarif scan is `books/tareekh/futuh-buldan/20230703_20230703_1444/` (pages.json). The Sicily passage is at scan page 329, the anchor the existing records already use. The other Futuh copies in the workspace are a different edition and are not cited for this lane | `source/futuh-buldan-maarif-1407` names this scan in its reliability note |
| D7 | Dates that two sources give differently | One date vs both | Both, as a second dated claim with `status: debated`, when the Ibn Khaldun and the al-Baladhuri/Ibn al-Athir dates differ | Publication standard: a second source strengthens a record; a conflict is shown, not resolved |

## Decisions, continued (Phase 1)

| # | Question | Choice | Why |
|---|---|---|---|
| D8 | Asad ibn al-Furat: death at Syracuse and burial at Palermo (cited to Wafayat al-A'yan) | Not written. The phrase "سرقوسة" does not occur in any Wafayat volume in the local workspace; the record stays at completeness 1 | Instruction: a claim the sources in reach cannot support is skipped. What is verifiable here is his leadership of the Sicily expedition (Ibar scan p. 1026) |
| D9 | Ibn Jubayr person record: origin and death place (cited to Nafh al-Tib p. 491, Shadharat p. 60) | Not written. The entries in the local Nafh OCR do not show p. 491's text; the record stays at completeness 1 | Same rule as D8. The Rihla itself is verified (see batch 1) and carries the journey record |
| D10 | Palermo's dates 831 and 1072, and Sicily's 827 and 1091 (in the earlier drafts, from GeoNames and Wikidata) | Removed from Palermo. For the emirate: 212 AH from Ibn Khaldun (scan p. 1026) and 1091 derived from Idrisi's "thirty years" from 453 AH (scan p. 589), both marked derived | No local source gives 831 or 1072. A pointer (Wikidata, GeoNames) is not a source for a date |
| D11 | Reading "سنة اثنتي عشرة" in Ibn Khaldun (scan p. 1026) as 212 AH | Taken, flagged in the prose: the year is read from the context of an OCR text in two interleaved columns | The Mazara landing is clear; the number is the reader's reading, so the record says so |
| D12 | Which Nuzhat al-Mushtaq to cite | `source/nuzhat-al-mushtaq-2002` (its scan `1-2_20240914`, two volumes), not the Rome 1592 scan | The local scan has two volumes, matching the 2002 Cairo entity; the 1592 copy is not used in this batch |
| D13 | Idrisi birth and death years (Mawsu'at A'lam pp. 408–410) | Kept in the data, unchanged, with their source. They are not in the local workspace and were not re-checked; the prose makes no claim that depends on them | Flagged for the founder's later check rather than removed |
| D14 | Exhibit completeness | Rooms rewritten to the 5.4 standard in ar, en and ur. The trail stays at completeness 2: room 4 features `question/what-were-the-crusades`, which is at completeness 1 | The 5.4 rule says a trail is finished only when every featured record is at 3. That record is outside this batch |
| D15 | Archnet registration: every request to archnet.org returned HTTP 429 with a bot-detection checkpoint (terms page, a site page, robots.txt) | Skip and log vs. complete the checkpoint or route around it | Skip. Completing or bypassing bot detection is outside the rules, and the terms page could not be read, so the posture cannot be verified at the provider's page as `source-families.md` requires. No Archnet data was fetched. Also open: `docs/plan/08-prior-art.md` records Archnet's terms as "default CC BY-NC 4.0" with "no public API", which conflicts with `source-families.md` ("fully open access"); settle at onboarding |
| D16 | Two Alexandria entities: `place/alexandria` (city) and `place/iskandariyya` (town, 11 inbound) | Merge now vs. write one and log | Wrote `place/alexandria` only. `place/iskandariyya` is untouched: a merge changes ids and aliases across the graph, so it is the founder's call |
| D17 | Khitat (al-Maqrizi) has no `data/source/` entity | Wait for a registered family vs. register the book | Registered `source/khitat-maqrizi-1998` (book, local scan `20221202_20221202_0332`, cited by scan page). Classical text; no registry entry needed, as with the other books |
| D18 | Egypt set size: the brief asks for about 100 records | Pad with unverified records vs. stop at what local evidence supports | Stopped at 4 records this pass. Each claim needed a page read in the local Khitat OCR; the remaining candidates are listed in NEXT STEP |

## Batches

### Batch 1 (Phase 1, Sicily): 7 records done, 2 skipped, 1 trail partly done

Done (completeness 3, `status.review: published`, ar + en + ur prose in the same commit; `cite-check` 8 of 8 pass):

- `event/first-raid-on-sicily`: the existing three-section prose kept; the "one more source is needed" sentence on the date removed, the date stated as derived from Mu'awiya's reign. Checked: Futuh scan p. 329.
- `event/aghabid-conquests-sicily`: rewritten. Checked: Futuh scan p. 329 (the heading "فتح جزائر في البحر", "نيفاً وعشرين مدينة", "قصر يانة وحصن غليانة").
- `place/siqilliya`: rewritten. Checked: Futuh scan p. 329; Nuzhat scan pp. 588–589.
- `polity/emirate-of-sicily`: rewritten; start and end years are derived and marked (D10, D11).
- `place/palermo`: rewritten; the 831 and 1072 dates removed (D10). Checked: Ibar scan p. 1026 ("حاصروا بليرم", "فتح المسلمون مدينة بليرم", no year in the read lines); Rihla scan pp. 92–93.
- `person/al-idrisi-muhammad-ibn-abd-allah`: prose rewritten from the Nuzhat preface (scan pp. 4, 7) and p. 588; the "Ceuta" claim and the map claim dropped from the summary (not in the local text). Birth and death years kept, flagged (D13).
- `journey/sicily-to-granada-jubayr`: the existing legs kept; this pass spot-checked the Rihla scan at pp. 76–79, 88, 90, 93, 96, 97, 101. Pages 80, 92, 94, 95 and 98 were not re-read.

Trail (partly done): `exhibit/path-sicily-islam`: the four rooms rewritten in ar, en and ur to 3–5 cited sentences each. The English bodies no longer contain Arabic. Summary rewritten to remove the unverified "النورمان يرثون الصناعة". Completeness 2 (D14).

Skipped: `building/palermo-mosque-1591` (no source in the local workspace; a Wikidata candidate whose identity is not checked; the brief's facts do not apply to it). `person/asad-ibn-al-furat` and `person/ibn-jubayr-muhammad` (D8, D9).

Slugs confirmed against the live tree (D5 in the brief): the event slug is `event/aghabid-conquests-sicily`; `event/aghlabid-conquests-sicily` does not exist. The Aghlabid dynasty is `polity/aghlabid-emirate`.

Checks run: `npm run cite-check` (8 of 8 pass); `npm run graph` and `npm run coverage` (`docs/coverage.md` regenerated); `npm run validate` (0 errors, 7,295 warnings, none from the lane's new text except the existing "sides" warnings that every raid and conquest record carries). `npm test` not run (instruction 0.2).

Urdu for founder review: every ur file in this batch is a draft translation by Claude Haiku 5.5, marked as such in its frontmatter.

### Batch 2 (Phase 2, Egypt, first pass): 4 records done; Archnet not registered

Archnet (`source-families.md` section 5.3, Tier 1) is **not registered**. On 24 October 2026 each request from this Mac to archnet.org (the terms page, a site page and `robots.txt`) returned HTTP 429 with a bot-detection checkpoint. The terms could not be read, and no Archnet data was fetched. The checkpoint was not completed or routed around (D15).

Records done (completeness 3, `status.review: published`, ar + en + ur prose in the same commit; `cite-check` 4 of 4 pass):

- `place/cairo`: the arrival of Jawhar on 17 Sha'ban 358 AH and the first mud-brick wall, named al-Mansuriyya before al-Mu'izz named the city al-Qahira (Khitat scan pp. 1030, 1067); the other account, laid out in Jumada II 359 (p. 1030); Cairo as the fourth seat of rule in Egypt, and the move to the Citadel under al-Kamil (p. 1001). The earlier farghani sentences keep their own citations (their 360 AH date stands beside Khitat's 358).
- `place/al-fustat`: al-Jawhari on the word fustat (p. 829); the seat of rule moves from Alexandria (p. 829); al-Askar and al-Qata'i (p. 829); the layout around Amr's mosque and the Qasr al-Sham' (p. 990); Shawar's burning (p. 829). The Futuh and Ahsan sentences are kept.
- `place/alexandria`: the 641 CE date in the earlier summary is removed (no local source states it). Alexandria as the seat before Fustat and the Alexander refounding (p. 446); the "house of learning" account, quoted by al-Maqrizi from Abu al-Salt al-Andalusi (p. 422); the move of the seat to Fustat (p. 446). The farghani sentences are kept.
- `building/masjid-amr-fustat`: Amr's founding of the mosque by the camp, the receding Nile and the house plots (p. 831); the layout of Fustat around the mosque (p. 990). The Umari sentences are kept.

Source registered: `source/khitat-maqrizi-1998` (`data/source/khitat-maqrizi-1998.yaml`): al-Maqrizi, Madbouli 1998, cited by PDF scan page. The OCR of the two-column pages is checked against the page image before a date or name is quoted.

Skipped or not done:
- `place/iskandariyya`: a second Alexandria entity; left for the founder (D16).
- `building/dar-al-hikma-cairo`: Khitat p. 1221 (the Dar al-'Ilm founded by al-Hakim, reopened in 517 AH) is found, not yet checked against the record. Not written in this pass.
- `person/shajar-al-durr` (8 inbound): Khitat pp. 654–661 and 1536–1543 hold the material; not read in this pass.
- No Egypt trail is finished: each Egypt trail features records below completeness 3.

Checks: `npm run cite-check` 4 of 4 pass; `npm run validate` 0 errors, 7,295 warnings (the same count as batch 1, so no new warnings from this batch); `npm run graph` and `npm run coverage` regenerated. `npm test` not run (instruction 0.2).

### Batch 2b (Phase 2, Egypt, second pass): 2 records done

Records done (completeness 3, `status.review: published`, ar + en + ur prose in the same commit; `cite-check` 2 of 2 pass; `npm run validate` 0 errors, 7,295 warnings, unchanged):

- `building/dar-al-hikma-cairo`: opened on Saturday 10 Jumada II 395 AH, with books brought from the palace libraries and jurists, readers, astrologers and physicians sitting in it (Khitat p. 1250). Copying and reading open to all, paid attendants, supplies for readers and copyists (p. 1251). Closed by al-Afdal; reopened at another site in Rabi' I 517 AH under al-Amir (pp. 1221, 1250). The Hasan Ibrahim paragraph on the Fatimid centres of wisdom is kept with its citation and is not re-checked locally.
- `person/shajar-al-durr`: concealed al-Salih's death on 14 Sha'ban 647 AH and brought in Turanshah (p. 1912). Turanshah threatened her; she wrote to the mamluks against him (pp. 660, 1914). The Bahriyya killed him on 19 Muharram 648 (p. 1912). The sultanate on 10 Safar 648, with the "mother of Khalil" signature, the coins and the khutba (pp. 1914, 661). She ceded the throne to Aybak after eighty days; he took the title al-Mu'izz (p. 1915). She killed Aybak in the bath in 655 AH (p. 1916). Her garden and tomb near the mashhad of al-Sayyida Nafisa (pp. 1384, 1657).

Decisions (this pass):

| # | Question | Choice | Why |
|---|---|---|---|
| D19 | Shajar al-Durr's own death: the earlier summary cites Shadharat p. 276 for her killing and burial | Removed from the summary; kept in `died.note` with its citation and flagged "not checked against the local scan" | Khitat in the workspace has her part in Aybak's death, not her own. The Shadharat claim is cited, but not checked here |
| D20 | The earlier record called her a slave-girl (جارية) | Changed to "wife" (زوجة) | Khitat p. 654 calls her the sultan's wife and p. 1912 the mother of his son. The slave-girl description came from the Tarikh al-Khulafa summary, which is not in the local text |
| D21 | Dar al-Hikma's Fatimid da'wa paragraph (Hasan Ibrahim pp. 405, 409) | Kept with its citation; not re-checked locally | It is cited to a defined source, and the claim is not one the Khitat contradicts. Flagged, as with the Idrisi years in batch 1 |

Still open from batch 2: the Egypt set is well short of 100 records. The Egypt trails (`exhibit/path-fatimid-cairo`, `exhibit/path-mamluk-cairo`) are not finished, because their featured records are not all at completeness 3.

### Batch 3 (Phase 2, Egypt): 3 records done, merged as PR #1488

- `person/al-hakim-bi-amr-allah`: the disappearance in Shawwal 411 AH, his age and reign, his astronomy, Dar al-Ilm and the confession account of 415 AH that al-Maqrizi prefers (Khitat pp. 1250, 2041–2042). The al-Suyuti and Muntazam accounts keep their citations, labelled as reports. Note: Khitat gives his age as 36 years 7 months; the Muntazam sentence in the summary says 37. Both kept, attributed.
- `place/misr`: Egypt among the climes; Fustat and Cairo at 55° longitude and 30° latitude; the desert frontiers (Khitat p. 84).
- `place/al-fayyum`: the Joseph tradition (p. 711); the year the Fayyum went unknown to the Muslims after the conquest, from Ibn Abd al-Hakam (p. 733). Honorifics typed in the first version were removed (validator error caught before the merge; fixed in a second commit on the same branch).

### Batch 4 (Phase 2, trails): evidence gathered, records not yet written

Both trails are still at completeness 1. Each needs its featured records at completeness 3 first. Verified Khitat passages for each feature (not yet written into the records):

- `person/jawhar-al-siqilli`: p. 1011 (al-Mu'izz sends him; the army's cost 358–362 AH); pp. 1030, 1067 (arrival and founding of Cairo); p. 2173 (after entering Egypt he proclaims the Shi'i call "hayya 'ala khayr al-'amal" in the mosques). The footnote on p. 1011 calls him builder of Cairo and al-Azhar; that is the editor's note, not al-Maqrizi's text, so do not cite it as Maqrizi.
- `person/al-muizz-li-din-allah`: p. 1067 (he names the city al-Qahira on arrival); p. 2174 (in Ramadan 362 AH, after he entered and lodged in his palace in Cairo, he ordered the inscription naming Ali).
- `building/al-azhar`: p. 1032 (the Friday mosque of the palace area is called Jami' al-Qahira or al-Azhar); p. 1098 (a session for women in al-Azhar, held by the Fatimid da'i); p. 1194 (the al-Azhar preacher preaches at the Prophet's birthday ceremony before the caliph). **The founding year is not found in the local OCR**; the existing record's "additional source" note stays until it is.
- `polity/fatimid-caliphate`: p. 2173 (the Shi'i proclamation); p. 1001 (Cairo as the caliphal residence until the Ayyubids); p. 290 (the dynasty ends with the Ghuzz entry and Saladin's takeover; al-Fadil's note for 567 AH).
- `polity/ayyubid-dynasty`: p. 290 (Saladin takes Egypt); p. 1001 (Saladin lives in Cairo; al-Kamil moves to the Citadel); p. 1912 (the Ayyubid rule in Egypt ends in 648 AH, after 81 years and 17 days, with eight rulers).
- `person/baybars`: p. 1032 (the al-Zahiriyya madrasa at Bab al-Dhahab, founded by al-Zahir Rukn al-Din Baybars); p. 1081 (Baybars is among the amirs who leave Cairo for al-Nasir Yusuf in Syria after Aqtay's killing).
- `person/qalawun`: p. 1249 (he begins the Mansuri hospital, madrasa and mausoleum on the old western-palace site, overseen by Sanjar al-Shuja'i); pp. 1061–1062 (the Mansuri dome and madrasa; the Nasiriyya madrasa beside its minaret).
- `person/al-nasir-muhammad-ibn-qalawun`: pp. 240–241 (his reign; he builds a bridge over the Nile); p. 831 (al-Jami' al-Jadid al-Nasiri outside Misr); p. 1062 (the Nasiriyya madrasa).
- `building/masjid-sultan-hasan`: p. 2111 (begun in 757 AH; three years of building; the great iwan). The record's data currently cites Wikidata, which is a pointer and not a source; the Khitat citation replaces it. The "built 1363" date needs a check against the 757 AH start (1356 CE), which the Khitat gives.

## NEXT STEP:

### Batch 4 (Phase 2, trails): done

Nine features written with Khitat citations (ar, en, ur). Completeness now:

- At 3: `person/jawhar-al-siqilli`, `person/al-muizz-li-din-allah`, `building/al-azhar`, `person/baybars`, `person/qalawun`, `person/al-nasir-muhammad-ibn-qalawun`, `building/masjid-sultan-hasan`, and `polity/fatimid-caliphate`.
- At 2: `polity/ayyubid-dynasty`. Its end date, 1341 CE, comes from Wikidata and has no local check. The Khitat ends Ayyubid rule in Egypt in 648 AH; that is recorded in the prose and does not settle the dynasty-wide date.

Decisions (this pass):

| # | Question | Choice | Why |
|---|---|---|---|
| D22 | Al-Azhar's founding year | Not stated; the record says so in its scope note | No passage giving the building year turned up in the local OCR, after several searches. The 378 AH date keeps its Hasan Ibrahim citation |
| D23 | Sultan Hasan's date: the earlier record said built 1363 (Wikidata) | `built` now records the start of the works, 1356 CE (757 AH, Khitat p. 2111). The completion date needs a source before it is restored | Khitat gives the start and the three years of building; it does not give 1363 |
| D24 | Fatimid start (909 CE) and end (1171 CE) | Both cited to the Khitat: 297 AH (p. 1366) and 567 AH (p. 290) | Those are the dated steps the local text gives. The start is a year-level match, not an explicit "founded" statement |
| D25 | Nasir's century | Confirmed as the 8th century AH (Khitat p. 240: 702 AH) | Removes the "needs a source" note the record had |

Trails:

- `exhibit/path-mamluk-cairo`: completeness **3**. Every featured record is at 3; each room has three cited sentences.
- `exhibit/path-fatimid-cairo`: completeness **2**. Rooms rewritten with Khitat citations; the Ayyubid feature is at 2 (D24's end date is Wikidata-only).

Checks: `npm run validate` 0 errors, 7,295 warnings (unchanged); `npm run cite-check` 11 of 11 pass. An earlier Sultan Hasan write lacked a provenance block; added before commit.

## NEXT STEP:

Phase 2, batch 5: `polity/ayyubid-dynasty` needs its end date (1341 CE) checked against a source that covers the whole dynasty, or the record should be narrowed to Egypt. Once it reaches 3, `exhibit/path-fatimid-cairo` can be set to 3. Then the Egypt set is still well short of the 100 records in the brief; the next candidates are the Khitat's Ayyubid and Mamluk people and the Fayyum and Fustat monuments. Two decisions wait for the founder: whether to merge `place/iskandariyya` into `place/alexandria` (D16), and Archnet: its terms page must be read in a session the founder can see, or the founder supplies the posture, before any registration (D15).
