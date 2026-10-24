# Showcase Tier prose: progress (lane `showcase-prose`)

_Opened 24 October 2026. Lane document: [`../agents/lanes/showcase-prose.md`](../agents/lanes/showcase-prose.md). Queue: [`showcase-queue.md`](showcase-queue.md). Branch `content/showcase-prose`. Stubs `data/_stubs.d/showcase-prose.yaml`._

## Phase plan

| Phase | Scope | Budget | State |
|---|---|---|---|
| Setup | Repo, branch, dependencies, harvest workspace | 45 min | Done (see day log) |
| 0 | Register the lane; queue file | 30 min | Done (this commit) |
| 1 | Sicily pilot: `exhibit/path-sicily-islam` and its featured records | ~2.5 h | Done (batch 19: the trail is at completeness 3; every featured record is at 3) |
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

### Batch 5 (Phase 2, Ayyubid end date): done

The 1341 CE end was Wikidata-only, and no local source gives 1341 for the Ayyubids. Ibn al-Imad's Shadharat in the local scan covers only vols. 3, 7 and 8 (c. 800–1000 AH), and the Muntazam scan stops at 349 AH, so neither can settle it. Hasan Ibrahim's Tarikh al-Islam does: p. 494 gives the Ayyubid era as 567–648 AH, and the chapter heading on p. 698 gives "الدولة الأيوبية ١١٧١–١٢٥٠ / ٥٦٧–٦٤٨". Khitat p. 1912 gives the same 648 AH end for Egypt.

| # | Question | Choice | Why |
|---|---|---|---|
| D26 | `polity/ayyubid-dynasty` end: 1341 (Wikidata) or narrower | Narrowed to Egypt: end 1250 CE, hijri `0648~` (the Gregorian year is derived). Summary, prose (ar, en, ur) and the status note say so. Wikidata's 1341 is no longer used, and `source/wikidata` leaves the record's sources list (the external id stays) | No local source gives a dynasty-wide end. The local sources agree on Egypt, 648 AH |

- `polity/ayyubid-dynasty`: completeness **3**. Left open: the Ayyubid rulers outside Egypt after 1250 (the Syrian and Yemeni lines) are not covered by this record. A dynasty-wide end date needs a source for those lines first.
- `exhibit/path-fatimid-cairo`: completeness **3**. Every featured record is at 3.
- Not edited (another lane): `content/ar/period/crusades-ayyubid-mamluk.md` line 16 still gives the period's Ayyubid span as 1171–1341. It should be aligned with D26 by that lane or the founder.

Checks: `npm run validate` 0 errors, 7,295 warnings (unchanged); `npm run cite-check` on the two records 2 of 2 pass; `npm run graph` and `npm run coverage` regenerated (totals unchanged). `npm test` not run, per instruction 0.2.

### Batch 6 (Phase 2, Ayyubid and Mamluk people; Ibn Tulun mosque): done

Five records raised to completeness 3, each from the local Khitat scan (ar, en, ur in the same commit). The Khitat spells Qutuz as "قطز" (p. 1916); a first keyword search missed it, and the later search found it.

- `person/qutuz`: pp. 1916 (deputy of al-Mu'izz Aybak; deposes al-Mansur Ali on Saturday 14 Dhu al-Qa'da 657; Ayn Jalut on Friday 15 Ramadan 658; killed by Baybars near al-Manzila al-Salihiyya). Suyuti's account of Amid keeps its citation.
- `person/salah-al-din-yusuf-ibn-ayyub`: pp. 290 (takes Egypt after the Fatimid end), 1000 (the wall: Qaraqush extends Cairo's wall to Bab al-Qantara, Bab al-Sha'riyya and Bab al-Bahr), 1001 (his successors in Cairo; al-Kamil moves to the Citadel).
- `person/al-malik-al-kamil`: pp. 643–644 (sole ruler at al-Adiliyya near Damietta on his father's death; the bridge against the Franks at the Chain Tower, over 70,000 dinars; seventy messengers for help).
- `person/al-malik-al-salih-ayyub`: p. 558 (al-Salihiyya founded in 644 AH); p. 1912 (the Rawda citadel; the four madrasas between the palaces; death at al-Mansura, Sunday 14 Sha'ban 647, concealed by Shajar al-Durr).
- `building/masjid-ibn-tulun`: pp. 881–882 (beside the upper police in al-Askar; built on the hill of Yashkur); p. 279 (the divan moves to the mosque, then to Ya'qub ibn Killis's house).

**Corrections made:**
- `person/qutuz` prose said the battle was on "25 Ramadan"; the Khitat gives Friday 15 Ramadan 658. The prose now says 15 Ramadan.
- `person/qutuz` killing day: the Khitat gives the middle of Dhu al-Qa'da (p. 1916); Shadharat gives the sixteenth (p. 299). The prose states both and the record keeps both; the data `died` field stays as Shadharat's day.
- `person/al-malik-al-salih-ayyub`: the death day is Khitat's Sunday 14 Sha'ban; the `died` field keeps the Suyuti reading (mid-Sha'ban), noted, until the day is converted.

**Not confirmed locally:** `building/masjid-ibn-tulun` built year 879 is Wikidata only. The Khitat passages read here give no founding year. The record notes this and the prose gives no year.

**Decision D27:** the Khitat is the first source for Cairo and Fustat monuments and for the rulers' acts. Suyuti and Shadharat citations remain as labelled reports, not as the main basis.

Checks: `npm run cite-check` on the five records 5 of 5 pass; `npm run validate` 0 errors, 7,295 warnings (unchanged); `npm run graph` and `npm run coverage` regenerated. `npm test` not run, per instruction 0.2.

Egypt set now: 23 records (18 + 5) and 2 trails at 3.

### Batch 7 (Phase 2, Ayyubid and Mamluk rulers): done

Three records raised to completeness 3 from the local Khitat scan (ar, en, ur):

- `person/al-malik-al-mansur-ali-ibn-aybak`: pp. 1916 (Aybak killed in the bath on the night of 14 Rabi' I 655; al-Mansur enthroned on 15 Rabi' I, aged fifteen; reign of two years, eight months and three days; deposed by Qutuz on 14 Dhu al-Qa'da 657), 1530 (the maternal uncle al-Dud, arrested by Qutuz in Dhu al-Hijja 657).
- `person/al-malik-al-adil-ayyub`: p. 643 (al-Kamil becomes sole ruler on hearing of his father's death near Damietta; the father, ill after leaving Marj al-Safar, dies on the 7th of Jumada II; al-Mu'azzam Isa conceals the death and buries him in Damascus, then in the Adiliyya madrasa); p. 291 (the "Adili diwan" in the land-tax registers).
- `person/al-malik-al-aziz-uthman`: p. 1001 (lived in Cairo after his father Saladin); p. 352 (the zakat office seizes a merchant's goods; al-Aziz leaves the assessment to the owners of property).

**Conflict recorded:** `person/al-malik-al-adil-ayyub` gives the place of death as Alaqin (Ibn al-Athir, p. 393–394, the record's citation); the Khitat (p. 643) gives "عالفين" (Alfin). The day (7 Jumada II) agrees. The record keeps the Ibn al-Athir place; the spelling difference is not resolved here.

**Skipped and logged:**
- `building/al-madrasa-al-nasiriyya-cairo`: the Khitat (p. 1062) places it beside the minaret of the Mansuri dome, but the passages read give no founder or date. The record stays at completeness 1.
- `person/izz-al-din-aybak`: the Khitat (p. 1080) dates his accession to 650 AH. The record's own date must be reconciled with that before prose is written. Not written in this batch.

Checks: `npm run cite-check` on the three records 3 of 3 pass; `npm run validate` 0 errors, 7,295 warnings (unchanged); `npm run graph` and `npm run coverage` regenerated.

Egypt set now: 26 records (23 + 3) and 2 trails at 3.

### Batch 8 (Phase 2, Aybak): done

- `person/izz-al-din-aybak`: completeness 3. The Suyuti account gives his independence in Rabi' al-Akhir 648 AH; the Khitat (p. 1080) gives 650 AH. Both dates are stated in the prose with their sources, not resolved. Pages 1080–1081 add Aqtay's rivalry and the Bahriyya in Syria after his murder.

**Decision D28:** where two sources give different dates for the same act and neither can be checked against the other, both are stated with their citations (the D7 rule). The record's summary keeps the Suyuti date.

Checks: `npm run cite-check` 1 of 1 pass; `npm run validate` 0 errors, 7,295 warnings (unchanged); `npm run graph` and `npm run coverage` regenerated.

Egypt set now: 27 records (26 + 1) and 2 trails at 3.

### Batch 9 (Phase 2, Cairo monuments; Fayyum not reached): done

Four Cairo buildings raised to completeness 3 from the local Khitat scan (ar, en, ur):

- `building/juyushi-mosque-cairo`: pp. 400–401 (also called al-Rasd, next to al-Antaki's house; begun by al-Afdal, unfinished, completed when assigned to the observatory; a ring moved from the Fil mosque; after the lower ring was finished al-Afdal was killed, and al-Ma'mun al-Bata'ihi moved the observatory to Bab al-Nasr).
- `building/al-madrasa-al-salihiyya-cairo`: pp. 1061–1062 (two Salihiyya madrasas between the palaces, one for the Hanafis and Hanbalis, one for the Shafi'is and Malikis, beside the dome of al-Salih); p. 1912 (founded by al-Salih Ayyub; four teaching posts).
- `building/madrasah-al-kamiliya-cairo`: pp. 1032, 1062, 1063 (known as Dar al-Hadith, beside the new Zahiriyya; opposite Bab al-Bahr, today Bab Qasr Bashtak; a shop-block in its endowment).
- `building/al-aqmar-mosque`: pp. 1063, 1131, 1132 (at the end of the candle-makers' market; inscriptions on its gate threshold; the Mukhalliq corner opposite its basin).

**Corrections to the records' summaries** (these were Wikidata or encyclopedia claims with no local check):
- The Juyushi summary said Badr al-Jamali built it in 1085. The Khitat (p. 400) names al-Afdal as its builder. The summary now follows the Khitat.
- The Aqmar summary said al-Ma'mun al-Bata'ihi built it in 1125. No local passage read here gives a builder or date, so the summary now says so.
- The Salihiyya summary gave a 1243 date from Wikidata. Not used; the prose has no date.

**Decision D29:** where a draft record's summary names a builder or date that the Khitat does not give, the summary follows the local text and the record's status note says what is not confirmed.

**Skipped and logged, Fayyum:** no Fayyum place record exists beyond `place/al-fayyum` (done in batch 3). The Khitat's Fayyum towns (for example Batn al-Rayyan and Hawara) have no data records yet. Creating records is a new-entity task with a reuse check first, so it is left for a later batch.

**Skipped, Cairo candidates checked:** the al-Shafi'i mausoleum, the Mahmudiya, the Sayyida Zainab and Sayyida Aisha mosques (no usable Khitat passage found in this pass), and Uqba ibn Amir in al-Qarafa (the Khitat hits are about the conquest, not the mosque).

Checks: `npm run cite-check` on the four records 4 of 4 pass; `npm run validate` 0 errors, 7,295 warnings (unchanged); `npm run graph` and `npm run coverage` regenerated.

Egypt set now: 31 records (27 + 4) and 2 trails at 3.

### Batch 10 (Phase 2, Fayyum towns and a Fustat-area building): done

- **New** `place/al-lahun` (completeness 3): Khitat pp. 531, 720, 723 (the canal to Lahun; the 307 AH entry into the Fayyum). The Yusuf attribution is the Khitat's own tradition and is stated as such.
- **New** `place/damuna` (completeness 3): Khitat p. 731 (water by flow from the great canal; vines watered by waterwheels). One page only, no date.
- `building/dar-al-anmat` raised to completeness 3. The Khitat (pp. 1059, 1541) places a house of this name in Cairo, on al-Jawdariyya, bought and demolished by Baybars for his qaysariyya. Al-Umari (p. 234) places it in Fustat. The two conflict and both are stated (decision D30, the D7 rule).

Both new places use `periods: [period/prophetic-era]` because the Khitat's account is Yusuf's canal; the Fatimid entry is dated in the prose.

Skipped: `building/qubbas-of-the-seven-daughters` (no Khitat passage found). The Khitat hits at p. 2077 are about another subject.

Checks: `npm run cite-check` 3 of 3 pass; `npm run validate` 0 errors, 7,295 warnings (unchanged); `npm run graph` and `npm run coverage` regenerated.

Egypt set now: 34 records at completeness 3 (31 + al-lahun + damuna + dar-al-anmat).

### Batch 11 (Phase 2, al-Qarafa and the remaining Fayyum villages): done

- `building/mausoleum-of-imam-al-shafii` raised to completeness 3: pp. 1782, 2061, 2324 (Saladin's madrasa beside the grave, endowed with Fil island; the Nasiriyya madrasa beside the dome, with a teacher of Shafi'i fiqh; al-Kamil's enlargement of the small mosque beside the tomb, Friday prayer in 607 AH). The draft's "dome built under Saladin" is replaced by what the Khitat names.
- `building/jami-al-qarafa-mosque-cairo` raised to completeness 3: pp. 2437, 2456, 2463 (names; attribution to the Banu Abd Allah ibn Manih; the renewal under al-Amir bi-Ahkam Allah in 520 AH). The builder is not stated outright; the Khitat's line on Tafrid is quoted as the Khitat gives it. The Khitat's other identification (Ibn Abi al-Saghir's mosque, p. 2459) is not resolved (D31).
- **New** `place/bayad` and `place/al-awsiyya-al-kubra` (completeness 3), both Fayyum villages on the great canal (p. 731). The Awsiyya kura at p. 253 is a Lower Egypt district list and is a different entry.

Skipped and checked: Hawara (the Khitat's Hawara at pp. 554, 597 is a Berber group and a town in Upper Egypt, not the Fayyum place); Batn al-Rayyan (no Khitat hit).

Logged for the founder: the Khitat's Qarafa Nasiriyya (p. 2324) is a madrasa beside al-Shafi'i's dome. It is a different building from the skipped Cairo al-Nasiriyya (the Mansuri hospital's neighbour, pp. 1062); do not merge them without a check.

Checks: `npm run cite-check` 4 of 4 pass; `npm run validate` 0 errors, 7,295 warnings (unchanged); `npm run graph` and `npm run coverage` regenerated.

Egypt set now: 38 records at completeness 3 (34 + the Shafi'i mausoleum and the Qarafa mosque, which were drafts, and the two Fayyum villages).

### Batch 12 (Phase 2, Cairo buildings at completeness 1): done, one record

- `building/al-muayyad-mosque-cairo` raised to completeness 3: pp. 2143 (founded by al-Mu'ayyad Shaykh inside Bab Zuwayla, on the site of Khizanat Shamail, Sanqur al-Ashqar's qaysariyya and others), 1535 (the qaysariyya demolished and absorbed in Jumada I 818 AH), 2147 (the supervisor of the building, and the verses on the leaning minaret). The Wikidata candidate's 1415-1420 span is not used; 818 AH is the dated event.

Checked and not written (no building passage in the Khitat):
- Sayyida Sukayna (p. 1662 is a biography; p. 1384 mentions a shrine only as a landmark).
- Lu'lu'a (p. 1266 onward: a Fatimid pleasure pavilion, not a mosque).
- Sayyida Ruqayya (p. 1028: a boundary mention only).
- al-Hosary (pp. 1064, 1574: the Hasriyyin market and the book market, not a mosque).
- Mahmudiya (pp. 1351-1352: a quarter, not a building).

Checks: `npm run cite-check` 1 of 1 pass; `npm run validate` 0 errors, 7,295 warnings (unchanged); `npm run graph` and `npm run coverage` regenerated.

Egypt set now: 39 records at completeness 3 (38 + the al-Muayyad mosque).

### Batch 13 (Phase 2, Cairo drafts with Khitat passages): done, two records

- `building/khanqah-of-baybars-al-gashankir` raised to completeness 3: pp. 1065, 1200 (within the Dar al-Wizara, facing the Dirb al-Asfar; the Qaraqanshiyya madrasa beside it; the houses of Qazman and Sanqur al-A'sar). The Khitat gives no founding date in these passages, so the draft's 1310 is not used.
- `building/shajarat-al-durr-tomb` raised to completeness 3: pp. 1384, 1657 (the garden, house and baths she built near Sayyida Nafisa's shrine; the tomb's site where the garden stood), p. 1536 (a property built by Jahārkas bought for "the mother of Khalil" in 655 AH).

Checked and not written:
- Taghribirdi (pp. 1470-1471): the passages are about the houses of Ahmad and Bayabars, not the Taghribirdi mosque, which is later than the Khitat.
- Qanibay (p. 1934): a list of mosques with no description.
- Fustat church and gate names: no building record exists in `data/` for them, so there is nothing to upgrade.
- al-Nasir Muhammad: the Khitat's new Jami' al-Nasiri (p. 831) is outside Misr, and the draft is the Citadel mosque (the Citadel's Jami' al-Nasiri appears only in the list at p. 1934). Not written; the two buildings need a check before any merge (logged for D32).

Checks: `npm run cite-check` 2 of 2 pass; `npm run validate` 0 errors, 7,295 warnings (unchanged); `npm run graph` and `npm run coverage` regenerated.

Egypt set now: 41 records at completeness 3 (39 + the two above).

### Batch 14 (Phase 2, Cairo drafts with Khitat passages): one new record

- **New** `building/al-jami-al-jadid-al-nasiri` (completeness 3): the New Mosque outside Misr at Mawrid al-Hulfa, built by al-Nasir Muhammad ibn Qalawun (p. 831); the Nasiri canal's built-up quarter (p. 1037); the four hundred thousand dirhams Fakhr al-Din refused back, spent on it (p. 2099). Kept apart from the Citadel draft `building/al-nasir-muhammad-mosque` (decision D32, now evidenced: the Khitat's Nasiri mosque is outside Misr; the Citadel mosque is named only in a list at p. 1934). No date is given (none in the passages read).

Checked and not written:
- Sayyida Nafisa mosque (`building/sayyida-nafisa-mosque`): the Khitat mentions the shrine as a landmark and as the beneficiary of an endowment (p. 1620), and gives no mosque account. No prose.
- al-Malika Safiyya (`building/mosque-of-al-malika-safiyya`): "Suwaiqat Safiyya" (pp. 1604, 2151) is a street name; the mosque is not described.
- The Citadel Nasiri mosque (`building/al-nasir-muhammad-mosque`): only a list entry (p. 1934). The draft stays at completeness 1.

Checks: `npm run cite-check` on the new record; `npm run validate` 0 errors, 7,295 warnings (unchanged); `npm run graph` and `npm run coverage` regenerated.

Egypt set now: 42 records at completeness 3 (41 + the New Mosque).

### Batch 15 (Phase 2, Egypt drafts beyond Cairo and the Fustat monuments): two records

- `building/madrasa-of-al-zahir-baibars` raised to completeness 3: pp. 1061, 1194, 1343 (between the palaces; the Hall of the Lote Tree and the Hall of the Tents as its origin, sold to Baybars in Jumada II 660 AH; the mihrab on a former Fatimid palace gate).
- `building/attarine-mosque-alexandria` raised to completeness 3: pp. 1077, 1078 (built by Badr al-Jamali, Amir al-Juyush, from confiscated funds; Alexandria taken in Muharram 477 AH; finished Rabi' I 479 AH). The draft's Athanasius-church claim is not in the Khitat and is removed from the summary.

Checked and not written:
- `building/khizanat-al-suruj` (pp. 1033, 1159 support it as a Fatimid saddle treasury): the record already has Hasan Ibrahim prose; rewriting it on the Khitat is left for a later batch.
- `place/ayn-shams` (pp. 123, 428-429): the Khitat's accounts are legendary (the founding by a figure of the ancient Egyptian tradition, and Yusuf's marriage). They are not sourced to a verifiable fact, so no prose.
- Qus, Asyut, the Mahalla and other Upper Egypt drafts: the name hits are generic phrases ("Sa'id Misr", "a large town"), not the places.
- Fustat monuments outside the Amr mosque: no Fustat building draft with a usable Khitat passage was found in this pass.

Checks: `npm run cite-check` 2 of 2 pass; `npm run validate` 0 errors, 7,295 warnings (unchanged); `npm run graph` and `npm run coverage` regenerated.

Egypt set now: 44 records at completeness 3 (42 + the two above).

### Batch 16 (Phase 2, Khizanat al-Suruj rewrite; remaining drafts): three records

- `building/khizanat-al-suruj` rewritten on the Khitat, pp. 1033 (its place among the palace stores between Bab al-Zahuma and al-Azhar), 1159 (five thousand saddles taken out by al-Mustansir; over four thousand stored; a saddle valued from a thousand to seven thousand dinars; Ibn al-Tuwayr's description of the hall, quoted by al-Maqrizi). The earlier Hasan Ibrahim prose on the craft is kept and cited to its own source.
- `building/masjid-al-husayn-cairo` raised to completeness 3: pp. 1178, 1181 (Dar al-Fitra opposite the shrine; the teaching circle under al-Nasir with al-Baha' al-Dimashqi; the vizier Mu'in al-Din's teaching iwan built from endowments; the fire in the Salihi years, in a year of the 640s AH). The Duha entry is not read and not cited.
- `building/ulmas-al-hajib-mosque` raised to completeness 3: p. 2087 (built by Almas al-Hajib on the street outside Bab Zuwayla, completed in 730 AH; he was a mamluk of al-Nasir Muhammad ibn Qalawun). The draft's 1330 CE is the same year, now stated in the Hijri.

Checked and not written: the Egypt drafts whose names give only generic hits (see batches 12–15). With these three, the reuse-checked shortlist from the Khitat is close to exhausted for the Egypt drafts.

Checks: `npm run cite-check` 3 of 3 pass; `npm run validate` 0 errors, 7,295 warnings (unchanged); `npm run graph` and `npm run coverage` regenerated.

Egypt set now: 47 records at completeness 3 (44 + the three above).

### Batch 17 (Phase 2, Alexandria monuments; Fayyum passages): three records

- `place/al-manara-iskandariyya` (the Pharos) raised to completeness 3: pp. 476, 478, 482 (the builder traditions; the treasure beneath it; the height of more than 150 cubits from Ibn Abd al-Hakam; the mosque at its top; Ibn Tulun's wooden dome; the Baybars rebuilding in 673 AH). Conflict recorded: the Idrisi height of about 300 cubits (p. 320) differs from the Khitat's 150, and both are stated (D7 rule).
- `building/amud-al-sawari` (the pillar) raised to completeness 3: p. 487 (the red speckled stone; about four hundred columns broken by Qaraja in Saladin's time and thrown to the shore; the Aristotle-portico tradition).
- `place/malab-iskandariyya` (the hippodrome) raised to completeness 3: p. 484 (al-Qada'i's list of Alexandria's wonders; the ball; Amr's festival attendance).

Checked and not written:
- The Fayyum passages in the Yusuf section (pp. 709-735) were already used for Lahun, Damuna, Bayad and al-Awsiyya (batch 10-11). Al-Qays (p. 734, named after Qays ibn al-Harith's expedition) is a different place from `place/al-qays` (Idrisi's town near Dahrut), so it is not written as the same entry; logged.
- The other Alexandria drafts (al-Kiryawn, al-Masalla, Sidi Bishr, the Shurbagi and Tirbana mosques, Ras al-Tin and the other palaces) have no matching Khitat passage in this pass, or only a list entry. al-Kiryawn (pp. 246, 482, 499, 509) and al-Masalla (pp. 141, 679) remain for a later check.
- Iskandariyya (`place/iskandariyya`) is the duplicate of `place/alexandria` (D16); the three records above keep their existing relations to it.

Checks: `npm run cite-check` 3 of 3 pass; `npm run validate` 0 errors, 7,295 warnings (unchanged); `npm run graph` and `npm run coverage` regenerated.

Egypt set now: 50 records at completeness 3 (47 + the three above).

### Batch 18 (Phase 2, the last Alexandria drafts with Khitat passages): two records

- `place/al-kiryawn` raised to completeness 3: pp. 246 (the canal into Alexandria led from Kasa, opposite al-Kiryawn), 499 (about ten days of fighting; Abdallah ibn Amr in the vanguard), 509 (the Byzantines occupy the houses the Muslims had claimed with their spears, and are responsible for their repair). The Futuh passages (pp. 309, 312) keep their citations.
- `place/al-masalla-iskandariyya` raised to completeness 3: p. 141 (al-Qada'i lists the two obelisks among Alexandria's wonders, on bronze crabs at the corners). The Khitat's other obelisks (p. 679) belong to a city that is not Alexandria, so they are not used.

Checks: `npm run cite-check` 2 of 2 pass; `npm run validate` 0 errors, 7,295 warnings (unchanged); `npm run graph` and `npm run coverage` regenerated.

Egypt set now: 52 records at completeness 3 (50 + the two above).

### Batch 19 (Phase 1, Sicily trail room 4): done, the Sicily trail reaches 3

- `question/what-were-the-crusades` raised to completeness 3 from Hasan Ibrahim's Tarikh al-Islam (local scan): pp. 110, 111, 238, 243 (Antioch 1098 and Jerusalem June 1099 with a massacre; Hattin 1187; Saladin's entry into Jerusalem on 27 Rajab 583 AH after the Crusaders asked for terms; the end of the Crusades in the East).
- Corrections: the draft cited Wikidata (a pointer, not a source) and gave a 1096 start and a 1291 expulsion from Acre. Neither is in the local text, so both are removed. The Mamluk stage is left undated in the record. Hasan's Hattin line prints "579 AH (1187 CE)"; the record gives 1187 CE only, since 583 AH is the correct year.
- `exhibit/path-sicily-islam` is now at completeness 3: its four featured records (place/palermo, place/siqilliya, polity/emirate-of-sicily, question/what-were-the-crusades) are all at 3.

Checks: `npm run cite-check` 2 of 2 pass; `npm run validate` 0 errors, 7,295 warnings (unchanged); `npm run graph` and `npm run coverage` regenerated.

## Phase 3 (general queue), batch 1: started, trail not yet finished

First unfinished trail in `showcase-queue.md`: `exhibit/path-islam-in-30-minutes` (completeness 2, inbound 297). Its 12 featured records: 4 are at 3 (practice/zakat, practice/sawm-ramadan, practice/hajj, event/hijra); 8 are below 3 (concept/islam-din, concept/iman, concept/ihsan, concept/five-pillars, concept/shahada, practice/salah at 2; person/muhammad at 1; event/first-revelation at 2).

Batch 1 (this pass):
- `concept/ihsan`: the closing sentence of Bukhari hadith 50 ("that was Gabriel...") is not in the local scan (books/hadith/sahih-bukhari, scan p. 32), so it is removed from ar, en and ur. The gloss is at the local commentary (niyazaka edition, p. 36). The record stays at completeness 2: the summary's Ibn Rajab and Muslim 1955 sentences are not yet checked against the local harvest.
- `person/muhammad` and `event/first-revelation`: both failed the cite-check for a missing top-level provenance block. Added (source, generated_by, model, run). Their completeness is unchanged: neither record was re-verified in this pass.
- Verified in the local harvest and noted for the next batch: the Jibril hadith (Bukhari, scan p. 32, hadith 50: the definitions of iman, islam, ihsan); the five-pillars hadith (Ibn Khuzayma, scan p. 192 and p. 906, with Ibn Umar's chain; Bukhari's own body text for hadith 8 is not in the local OCR).

Checks: `npm run cite-check` 3 of 3 pass; `npm run validate` 0 errors, 7,295 warnings (unchanged); `npm run graph` and `npm run coverage` regenerated.

Still below 3 in the first trail: concept/islam-din, concept/iman, concept/ihsan, concept/five-pillars, concept/shahada, practice/salah, person/muhammad, event/first-revelation.

## Phase 3, batch 2: done (Islam in Thirty Minutes trail)

- `event/first-revelation` raised to completeness 3. Checked against al-Raheeq al-Makhtum p. 64: Monday, 21 Ramadan, 10 August 610 CE, age 40 lunar years, six months and twelve days. The alternative of Monday 11 Ramadan (p. 66) is covered by the record's debated date.
- **New source** `source/sahih-ibn-khuzayma` (local scan, file 61667, cited by scan page). Its label is distinct from the Wikidata work card `work/sahih-ibn-khuzayma`, which the validator flagged for a duplicate title.
- `concept/five-pillars`: the wording of the five pillars is witnessed at Ibn Khuzayma p. 192 (shahada, prayer, zakat, Ramadan, Hajj), and the Hajj-before-fast order at p. 906. Stays at completeness 2: Bukhari hadith 8 is not in the local Bukhari scan.
- `practice/salah`: the Najdi hadith's wording ("five prayers in the day and night"; "is there anything else?" "no, unless you volunteer") is witnessed at Ibn Khuzayma p. 529 (Talha's hadith). Stays at 2: the Quran passages and Bukhari 46/8 are not re-checked.
- Still below 3 in the trail: concept/islam-din, concept/iman, concept/ihsan, concept/five-pillars, concept/shahada, practice/salah, person/muhammad.

Checks: `npm run cite-check` 3 of 3 pass; `npm run validate` 0 errors, 7,295 warnings (unchanged); `npm run graph` and `npm run coverage` regenerated.

## Phase 3, batch 3 (Islam in Thirty Minutes trail): done, one record to 3

- `concept/shahada` raised to completeness 3: the order of the list is witnessed at Ibn Khuzayma p. 192; the Jibril quotation is trimmed to the words on Bukhari p. 32 ("أن تعبد الله ولا تشرك به"). Its Bukhari hadith 8 citation is replaced by Ibn Khuzayma.
- `concept/islam-din`: removes two sentences not in the local Bukhari scan ("that was Gabriel..." and "all of that is faith") in ar, en and ur, and replaces them with the chapter heading on p. 32, which is in the scan ("Gabriel came to teach you your religion, and made all of that religion"). Hadith 8 is witnessed at Ibn Khuzayma p. 192. Stays at completeness 2: the Najdi hadith's zakat and Ramadan clause (Bukhari 46) and the Sha'rawi paragraph (pp. 593-594) are not re-checked.

Still below 3 in the trail: concept/iman, concept/ihsan, concept/five-pillars, practice/salah, person/muhammad. The trail is not finished.

Checks: `npm run cite-check` 2 of 2 pass; `npm run validate` 0 errors, 7,295 warnings (unchanged); `npm run graph` and `npm run coverage` regenerated.

## Phase 3, batch 4 (Islam in Thirty Minutes trail): done, one record to 3

- `concept/ihsan` raised to completeness 3. The summary's Ibn Rajab sentences are checked in the local Jami' al-Ulum wal-Hikam (pp. 361-363: the wording of 'writing', its obligation, and "if you kill, do it well; if you slaughter, do it well" at p. 363). The Muslim 1955 citation is replaced by Ibn Rajab, which quotes it; the Muslim 8 citation is replaced by Bukhari 50 (p. 32), which is checked locally.
- Not raised: `concept/five-pillars` (its Bukhari hadith 8 claims are not in the local Bukhari body; they would need Ibn Khuzayma p. 192 throughout, plus a local check of the Muslim 16 note), `concept/iman` (long creed section, many books not re-checked), `practice/salah` (Quran passages and Bukhari 46/8), `person/muhammad` (biography not re-checked).

Still below 3 in the trail: concept/iman, concept/five-pillars, practice/salah, person/muhammad. The trail is not finished.

Checks: `npm run cite-check` 1 of 1 pass; `npm run validate` 0 errors, 7,295 warnings (unchanged).

## Phase 3, batch 5 (Islam in Thirty Minutes trail): partial

- `concept/five-pillars`: the list citations (the shahada, prayer, zakat, hajj and fasting bullets, and the summary quotation) now point to Ibn Khuzayma p. 192, and the hajj-before-fast order to p. 906. Quotations in ar, en and ur are aligned with the cited wording (Ibn Khuzayma's order). Stays at completeness 2: the section on the hadith's source still cites Bukhari hadith 8 for the editor's note on Muslim number 16 and for the commentary on "supports" (the niyazaka edition, p. 14, is the local witness, not yet cited).
- Not started: `concept/iman` (long creed section), `practice/salah` (Quran passages; Bukhari 46 and 8), `person/muhammad` (biography). The trail is not finished: four of its twelve featured records remain below 3 (iman, five-pillars, salah, muhammad).

Checks: `npm run cite-check` 1 of 1 pass; `npm run validate` 0 errors, 7,295 warnings (unchanged); `npm run graph` and `npm run coverage` regenerated.

## Phase 3, batch 6 (concept/iman audit): findings, no edits yet

`concept/iman` (completeness 2) cites many books. Checked against the local scans in this pass:

| Claim in the record | Local scan | Result |
|---|---|---|
| Jibril's definition of iman (Bukhari 50) | Bukhari p. 32 | Verified |
| "قول وفعل، ويزيد وينقص" as the Book of Iman's heading (Bukhari 8) | not found in the Bukhari body | Unverified |
| Wasitiyya: "الدين والإيمان قول وعمل" | aqida-wasitiyya p. 22 | Verified (record cites p. 22) |
| Lumat: "والإيمان قول باللسان وعمل بالأركان..." | lumat-itiqad p. 48 (printed 27) | Verified; the record's p. 27 is the printed number, not the scan page |
| Lumat: "بضع وسبعون شعبة" | lumat-itiqad p. 27 | Verified (record cites p. 27) |
| Maqalat: "وبكل ما ذكرنا من قولهم نقول" | maqalat-islamiyyin p. 350 | Verified (record cites p. 350); the record's p. 347 for the definition is not found |
| Sharh al-Tahawiyya: "اختلف الناس فيما يقع عليه اسم الإيمان" | sharh-tahawiyya-ibn-abi-al-izz p. 271 | Record cites p. 267; the local scan has it at p. 271 |
| Tahawi definition "الإقرار باللسان والتصديق بالجنان" | aqidat-tahawiyya p. 367 (commentary); sharh p. 271 | Record cites aqida-tahawiyya p. 21; not confirmed at that page |
| Sallabi: Ali's "لمظة بيضاء" and the four pillars | not yet searched | Pending |
| Quran 2:285 and 98:5 | Tanzil (frozen) | Pending |

Decision needed before editing: page conventions. Some sources in the record use printed page numbers (lumat) and some use scan pages (sharh). The record should use one convention, the scan page, and the Phase 3 pass must re-cite every sentence that moves. This is not done in this batch.

Status: `concept/iman` remains at completeness 2. Its next pass: fix the sharh page (p. 271), re-cite lumat by scan page (p. 48 for the definition, p. 27 for shu'ab), locate the tahawi definition, and search sallabi and the two Quran verses.

## Phase 3, batch 7 (concept/iman correction pass): done, completeness stays 2

- Page citations re-mapped to the local scans: the Tahawi definition to aqidat-tahawiyya p. 367 (the quotation is in the scan there); Lumat's definition to p. 48 (the printed 27 was a different page); Lumat's atom hadith to p. 29; Maqalat's definition and "pieces" sentences to p. 324; Sharh al-Tahawiyya's Maturidi and Karramiyya sentences to p. 271.
- Removed, because the local scans do not contain them: the Bukhari 8 quotation "وهو قول وفعل، ويزيد وينقص" and the chapter claims 1/14 and 1/11 (with their section); the Tahawi clauses on the wording of the 'waahid' sentence and the 'no exit from faith' clause; the Sharh's Jahm clause, "ظاهرا الفساد", and the four-fold classification paragraph; the whole Sallabi section (the Sallabi volume is not in the local harvest; the source stays defined and is no longer cited here).
- Remaining: the Quran cross-references (2:285 and 98:5) and the Bukhari 1/14 heading are not re-checked, so `concept/iman` stays at completeness 2.

Checks: `npm run cite-check` 1 of 1 pass; `npm run validate` 0 errors, 7,295 warnings (unchanged).

## Phase 3, batch 8 (concept/five-pillars): completeness 3

- The hadith-source section now cites the al-Bugha edition, which was not registered before. It is registered as `source/sahih-al-bukhari-bugha` from the scan's title page (Dar Tawq al-Najat, 1422 AH, ed. al-Nasir, commentary of al-Bugha). Hadith 8 is at volume 1, page 12 of that edition; the editor's note on scan page 14 gives Muslim's number 16 and the gloss on "supports".
- Removed, because their wording is not located in the local Bukhari scans: the Najdi-man prayer clause (Bukhari 46) and the Gabriel-hadith order clause (Bukhari 50).
- The five-pillars list and the hajj-before-fast order stay witnessed in Ibn Khuzayma pp. 192 and 906.
- Known issue, not fixed here: `sahih-al-bukhari` (Rahimiyya edition) is cited in other records for hadith numbers that were checked only in the al-Bugha text. Those edition labels need the same check in the next batch that touches them.

Checks: `npm run cite-check -- concept/five-pillars` PASS; `npm run validate` 0 errors, 7,295 warnings (unchanged).

## Phase 3, batch 9 (practice/salah): completeness 3

- The Bukhari 8, 46 and 50 citations are removed: their wording is not located in the local Bukhari scans. The Najdi-man quotation ("أفلح وأبيه إن صدق") is not cited either.
- The record now rests on Ibn Khuzayma: the pillar of prayer (p. 192); the chapter establishing prayer as part of Islam, with Umar's account of Gabriel's question about Islam (p. 191); and the five-prayers and voluntary-prayer wording of the Bedouin's hadith from Talha (p. 529).
- The three Qur'an references (2:43, 4:103, 17:78) are checked against the Tanzil passage records for the words the prose relies on.
- Source list: `source/sahih-al-bukhari` removed from the record.

Checks: `npm run cite-check -- practice/salah` PASS; `npm run validate` 0 errors, 7,295 warnings (unchanged).

## Phase 3, batch 10 (person/muhammad): completeness 3

- Every sentence of the biography is now checked against the readable local copy of al-Raheeq al-Makhtum: the 20210430 scan (460 pages; citations give its pages.json page numbers). The 344-page copy named in the source record has garbled OCR and cannot be read, so the source record should name the 460-page copy.
- Single source: the classical citations (Ibn Hisham, Muruj al-Dhahab, Zad al-Ma'ad, Talqih, Ibn Kathir, Muslim, Bukhari) were removed as cross-references the scan does not show; the record now rests on al-Raheeq alone, as one source is enough.
- Corrected: the Fijar war was in his twentieth year (not fifteen); the chest-opening was in his fourth year, on the verifiers' view; the shroud was three white Yemeni cloths (not two Sahari cloths and a hibra); the first revelation's fatra is the author's view of ten days.
- Removed as not witnessed: the first-day converts list, the "more than forty" count, the Dhubab hadith's authenticity dispute, the burial by Ali, the Quran 68:4 link, and the Umm Ma'bad direct quotation (the scan's OCR of the sound words disagrees).
- Trail status: the Islam in Thirty Minutes trail still has two records below 3, concept/iman (2) and concept/islam-din (2). The trail stays at completeness 2.

Checks: `npm run cite-check -- person/muhammad` PASS; `npm run validate` 0 errors, 7,295 warnings (unchanged).

## Phase 3, batch 11 (concept/islam-din): completeness 3

- Gabriel's hadith is witnessed in the local Ibn Khuzayma scan (p. 1070): the question on Islam, the five-part answer, and the Abu Hurayra narration. The definition is now quoted from that page.
- Correction: the record said Bukhari counted all of it as religion, and quoted a chapter heading "Gabriel came to teach you your religion". The al-Bugha edition (scan p. 36) shows Bukhari's own sentence "جعل ذلك كله من الإيمان" ("he made all of that part of faith"), and the heading quoted is not in the scan. Both are corrected in ar, en and ur.
- The Najdi-man hadith is re-cited as the Bedouin's hadith in Ibn Khuzayma (pp. 190, 529, 996). The commentary on Dimam ibn Tha'laba and the Muslim 16 citation are removed (not witnessed).
- The Sha'rawi paragraph is witnessed in the scan that the source record describes (pp. 593-594) for the face and the surrender of leadership. Note: the source record covers pp. 501-1000 of the file; the scan folder used is sharawi/out/tafsir-shaarawi-486.

Checks: `npm run cite-check -- concept/islam-din` PASS; `npm run validate` 0 errors, 7,295 warnings (unchanged).

## Phase 3, batch 12 (concept/iman): completeness 3

- Gabriel's hadith: the definition of iman is cited to Ibn Khuzayma p. 1070 (the wording with "وكتابه"); the questioner's identity (Gabriel in the form of a man) and Bukhari's own sentences are cited to the al-Bugha edition, pp. 13, 22 and 36. The order is corrected: iman is the first question, not the second.
- Tahawi: the definition is at the Tahawi text (1995 scan, p. 21). The record's p. 367 is a later commentary quoting it; corrected.
- Lum'at al-I'tiqad: the definition, the Bayyina verse and the seventy-odd branches are at p. 28 of the scan (printed 27, per the source note). The atom hadith (p. 29 before) is not in this scan and is removed.
- Maqalat al-Islamiyyin: the edition the source record describes (printed pp. 345-350) is the scan `MaghalatAlIslamyeen`; the definition, the Islam sentence and the "neither created nor uncreated" sentence are at p. 347, and the closing sentence at p. 350. The earlier p. 324 was from another edition and is corrected.
- Sharh al-Tahawiyya: pp. 271-272 of the scan (printed 267-268 per the source note); the "verbal dispute" line is at p. 272.
- Wasitiyya pp. 22-23 and the Ibn Rajab evidence pages (83-91, 121-122, 282-283) are checked. For Ibn Rajab only the key phrases are located on those pages; the long summary was not read sentence by sentence, so it is marked as located, not fully read.
- Note on the scan convention: citations give pages.json page numbers (for Lum'at and Sharh these are the PDF pages, not the printed ones).

Checks: `npm run cite-check -- concept/iman` PASS; `npm run validate` 0 errors, 7,295 warnings (unchanged).

## Phase 3, batch 13 (trail: exhibit/path-islam-in-30-minutes): completeness 3

- Every featured record is at completeness 3 (concept/islam-din, concept/iman, concept/ihsan, concept/five-pillars, concept/shahada, practice/salah, practice/zakat, practice/sawm-ramadan, practice/hajj, person/muhammad, event/first-revelation, event/hijra).
- Corrected step text: the iman room said "Islam is outward works and iman is inner assent", which the iman record does not support; it now says the hadith asks about iman, Islam and ihsan, and that the open question is whether deeds belong to iman. The ihsan room said the third rank "completes the ordering of the religion"; it now says "after Islam and iman". The shahada room said it is the pillar "by which a person enters Islam"; it now says it is first in the order of Ibn Umar's hadith.
- Trail sources now name the al-Bugha edition and Ibn Khuzayma in place of the Rahimiyya-labelled Bukhari.
- The zakat, fasting and Hijra room texts were checked against their records and kept.

Checks: `npm run validate` 0 errors, 7,295 warnings (unchanged).

## Phase 3, batch 14 (the Rahimiyya Bukhari label, and page-form citations to it)

- Scope: `source/sahih-al-bukhari` names the al-Maktaba al-Rahimiyya edition (Deoband). No copy is in the harvest, so the label cannot be checked against a scan. Citations use hadith numbers in the standard numbering, which the al-Bugha scan follows (for example 8, 50, 74, 3035, 3148, 3211, 3219, 3230).
- Scale left for later batches: about 612 number-form citations in 333 prose files, and 375 data files list `source/sahih-al-bukhari`. Each hadith's content is not yet checked against a scan.
- Page-form citations (`{cite:sahih-al-bukhari p.N}`), which depend on an edition and cannot be witnessed, are fixed in ar, en and ur:
  - person/adam: p.3326 → 3148 (the greeting of the angels); p.3207 → 3035 ("ابن ونبي").
  - person/ayyub: p.279 → 3211 (the gold locusts).
  - person/asiya: p.3411 → 3230 ("كمل من الرجال"); "who raised Musa" is removed (not in that hadith).
  - person/al-khidr: p.3401 → 3219 (the account of Musa and al-Khidr); the Ibn Abbas / Nawf commentary paragraph is removed (not witnessed at a located hadith).
  - person/al-bukhari and work/sahih-al-bukhari: the introduction's account (composition period, number of hadiths, the Sacred Mosque) is removed, as the local copies do not show it. The work record now cites the first page of the al-Bugha scan for title and author. The person record rests on al-Fihrist, with a provenance block added.
- Source record `source/sahih-al-bukhari`: its reliability note now says that the Rahimiyya edition is not checked, and that citations are hadith numbers only.

Checks: cite-check PASS for the six records; zero page-form citations to this source remain under content/ and data/.
Blocker: `npm run validate` reports 2 errors that are not from this batch: `data/person/ahmed-kuftaro.yaml` duplicates `person/ahmad-kaftaru` (the same Wikidata id and name), introduced by the modern-figures batch (PR #1524). The duplicate needs a merge decision by its owner before this batch can be merged.

## NEXT STEP:

Phase 3 (the general queue) is next. The Showcase queue (`docs/delegation/showcase-queue.md`) lists 1,240 featured records, of which the Egypt and Sicily sets are a small part. The Egypt drafts with Khitat passages are close to exhausted; the Mamluk and Ayyubid entries outside Egypt need another source family. The al-Nasiriyya madrasa stays skipped until a founder or date is found. Two decisions wait for the founder: D16 (merge `place/iskandariyya` into `place/alexandria`) and D15 (Archnet's terms, read in a visible session, or the founder supplies the posture). Also for the founder: the period-file alignment with D26, the Urdu drafts, the Adil place-name conflict, and D28 (two dates for Aybak's independence, both stated).
