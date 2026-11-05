# Coverage expansion programme: master plan

Status: **approved and running**. The founder approved the programme on 31 October 2026 (Phase 2, canon, opened that day) and gave the go for the whole programme on 5 November 2026, with the AI-resource moves as its first phase (founder amendment, 1 November 2026; section 2.11). Owner: the founder. Drafted 31 October 2026 from a Phase 0 audit of the live repository and of the external corpora named below; renumbered 5 November 2026 when the AI-resource phase was folded in as Phase 1 (every later phase moved up one number; file names follow the new numbers).

Companion files: `phase-01-ai-resource-moves.md` … `phase-15-render-qa-sweep.md`, and `progress.md` (the running log). Lane registration: `docs/agents/lanes.md`, `docs/status.md`.

## 1. Non-goals (not re-litigated here)

- No UI, layout, JavaScript or feature work. No build, deploy, workflow, R2 or Pages changes. Deployment stays manual and the founder's.
- No change to the running century-additions lane (`docs/delegation/century-additions-queue.md`) or its progress file. This programme runs beside it, with its own queue and progress file.
- Nothing in any plan document refers to any other project of the founder's. The museum stands alone in its own repository.
- No claim that the museum is UNESCO-nominated, DPGA-listed or catalogued in Wikidata. The accurate statements are: DPGA, "application submitted, under review"; UNESCO, "seeking a nomination via UNESCO partner organisations". The Wikidata item was deleted in October 2026 and its claim is not to be restored. The submission files are reserved (`docs/ai-change-gates.md` section 8).
- Prophets are never depicted, and no figurative imagery of prophets or Companions appears in any phase's media plan.
- Gates that bind every phase: `AGENTS.md`, `docs/ai-change-gates.md`, `docs/agents/publication-standard.md`, `docs/agents/content-standards.md`, `docs/sources-policy.md`.

## 2. Phase 0: what was measured and what was corrected

Measured on 31 October 2026 on `claude/islam-museum-expansion-plan-316042`. Counts are from the repository files unless marked otherwise. Commands are reproducible: `npx tsx scripts/check-authenticity.ts`, a filename count of `data/<class>/`, and a textual-reference census of `data/` and `content/ar/`.

### 2.1 Entity counts by class (data files)

| Class | Entities | Note |
|---|---|---|
| person | 10,481 | 538 with `gender: female` (5.1%) |
| passage | 9,548 | Qur'an passage pages (frozen Tanzil text) |
| source | 6,079 | source entities; the citation layer |
| building | 5,664 | |
| event | 4,447 | |
| concept | 2,023 | |
| place | 1,801 | |
| work | 1,511 | |
| object | 517 | |
| media | 471 | |
| group | 373 | |
| screen | 315 | |
| exhibit | 313 | |
| question | 220 | |
| polity | 180 | |
| other classes | under 120 each | listing, practice, journey, dataset, language, period |

Total: **44,220** data entities. This matches the validator count. The generated `docs/coverage.md` reports 44,164 entities and 34,988 edges, and the live homepage shows 42,969 entries. The three figures are not the same measure. Phase 0 uses 44,220.

Wing counts quoted in the brief (People about 10,239, Places 1,798, Ideas 2,019, Objects 6,178, Words 9,546) differ from the file counts above. They are not used as baselines here. The baseline is the file count, and the wing mapping should be reconciled in Phase 15 or on the next coverage regeneration.

### 2.2 Canon (gap 10)

- `scripts/harvest/library/books.yaml` lists **289** canon books. Confirmed.
- `docs/authenticity-ledger/books/` holds **259** ledger records. Of these, **256** have `decision.work: undecided`, **2** are `label`, and **1** is `accept`.
- The validator's warning reads "286 of 289 canon books have no decision record yet". Confirmed. The register `scripts/harvest/library/authenticity.yaml` holds three decisions: `tahrir-majisti-tusi` (label), `tafsir-zamakhshari` (label), `sunan-abi-dawud` (accept).
- The ledger README says a decision is recorded **only by the founder**. So Phase 2 is bounded by founder review time, not by agent throughput. This is a correction to the brief, which treated Phase 2 as agent work.

### 2.3 Women and muhaddithat (gap 2)

- Nadwi's *Al-Muhaddithat* / *Al-Wafa bi-Asma' al-Nisa'* has **43 volumes**, not 57 as the brief says. Publisher: Dar al-Minhaj, Jeddah, 2021 (per Wikipedia and the Al-Salam Institute).
- Entry count is contested in the sources found. The Al-Salam Institute says about **10,000** entries. A Wikipedia citation to an Aga Khan Library listing gives **9,328** female scholars. Phase 3 uses 9,328 as the working target and treats 10,000 as an upper bound, to be settled by the pilot.
- Existing museum coverage: 538 female persons. The overlap with Nadwi's list has not been measured. That needs the Arabic text, which is not readable in this session (see section 5).

### 2.4 Rijal (gap 1)

- Canon contains the rijal books the brief names: `tahdhib-kamal` (al-Mizzi), `tahdhib-tahdhib` and `taqrib-tahdhib` (Ibn Hajar), `mizan-itidal` (al-Dhahabi), plus `siyar-alam-nubala` and `isaba`.
- Name-matching the museum's person records against these texts was **not run**. The harvested files sit on the founder's microSD and are not reachable from this session. The narrator count is therefore **not measured**. Phase 4 sizes itself from a bounded pilot.

### 2.5 Thin regions and institutions (gaps 3, 5, 6)

Text-term file counts over `data/` (substring matches, not curated; they show presence and absence, not quality):

| Term | Files | Reading |
|---|---|---|
| indonesia | 242 | present, thin for a population this size (not measured against people) |
| malaysia | 117 | present |
| brunei | 38 | present |
| patani | 4 | very thin |
| timbuktu | 37 | present |
| harar | 46 | present |
| sokoto | 33 | present |
| swahili | 11 | thin |
| hui | 37 | substring-inflated; not a usable count |
| Ma Zhu / Liu Zhi | 0 | absent |
| Ayuba (Suleiman Diallo) | 0 | absent |
| Omar ibn Said | 6 | thin |
| Sulaymaniye | 0 | absent |
| codex / manuscript | 28 / 153 | present, mostly as mentions |
| waqf | 88 | present |
| coin | 92 | present, not yet a coinage system |
| guild / souq | 7 / 6 | nearly absent (gap 4 confirmed) |
| darb (routes) | 42 | present as mentions; Hajj-caravan entity count 2 |
| maqam / hammam / coffee | 40 / 37 / 15 | present, thin as practice entities |

### 2.6 Graph health and orphans (gap 11)

Census: an entity is counted as **referenced** if its id appears in any other `data/` file or in an Arabic `content/ar/` file. Edges are written once and inverses are computed, so an entity's own outgoing edges show up in its own file, not in others'. This is therefore a **proxy** for inbound links.

- **32,007 of 44,220 (72%)** have no textual inbound reference.
- By class: passage 93%, building 98%, media 99%, work 87%, event 84%, concept 82%, person 75%, screen 72%, place 69%, group 52%, object 6%, source 1%.
- The proxy likely overstates orphans for passages and media, which some content references through other fields. A true census needs the built graph (`.cache/graph.json`), which Phase 14 will use.

### 2.7 Render-QA (gap 12): a correction to the method

- `{cite:…}` appears in **24,999** Arabic prose files, and `needs_source` in 320, with the bracketed `(needs_source)` form in 231. In the source, `{cite:…}` is the citation markup, used by design.
- A leak can only be seen in the **rendered HTML**. A sweep that greps source would flag almost every article and find nothing new. Phase 15 therefore crawls built output and must not be scoped as a source grep. The sweep method is defined in phase 15.

### 2.8 Wikidata second-source debt (gap 9)

- 5,604 person files contain the text "wikidata" in some field.
- The brief's flagged figure of about 4,199 is **not measured**. The flag field needs a dedicated count before Phase 13 is sized. Phase 13's size is therefore given as a range until then.

### 2.9 Source corpora (gap 8)

- **TDV İslâm Ansiklopedisi (DİA):** the homepage was opened and read in the browser in this session, so it is reachable. Thirteen data files cite the islamansiklopedisi.org.tr domain. The article count the brief gives (about 16,800) is **not verified**.
- **Encyclopaedia of Islam, 2nd ed.:** the brief says PR #1599 "closed unmerged". GitHub records PR #1599 as **MERGED** on 25 October 2026 (title: "content(ei2): batch ei2-b003 part 3e, vol. 1 pp. 143-144"). Its body says it was held until main validated. The discrepancy must be read on `main` before Phase 6 is written. More importantly, **the EI2 lane is already approved and registered** (`docs/agents/lanes/ei2.md`, approved 24 October 2026, scope B, 13 volumes, English-first). Phase 6 is therefore a re-scoping of a live lane, not a re-issue.
- **Classical dictionaries:** al-Zirikli's *al-A'lam* (`alam-zirikli`) is in canon. Brockelmann's GAL and Sezgin's GAS were not checked in canon in this session.

### 2.10 Corrections to the gap map, in one list

1. Nadwi: 43 volumes, not 57. Entry count 9,328 (Aga Khan citation) to about 10,000 (Al-Salam), to be settled by pilot.
2. EI2: PR #1599 is recorded as merged, not closed; the EI2 lane already exists and runs at scope B. Phase 6 is re-scoping, not re-issue.
3. Canon: confirmed. 286 of 289 undecided. Decisions are founder-only, which makes Phase 2 founder-bound.
4. Render-QA: the `{cite:}` pattern is valid source markup. The sweep must run on built HTML.
5. Wikidata debt: 5,604 files mention Wikidata. The flagged count of about 4,199 is unmeasured.
6. Entity totals: 44,220 (validator, used here); 44,164 (coverage.md); 42,969 (homepage). Three measures, one baseline.
7. Century queue: 469 entries are marked `[ ]` and 1,407 `[x]`. The brief's figure of 474 is close and is not used.
8. Women: 5.1% of person files are female by the `gender` field. `docs/coverage.md` reports 5.6% of persons with a recorded gender. Same data, different denominator.
9. Orphans: the census is a proxy (section 2.6). The figure is 72%, with a range pending the built-graph census.
10. AI extractability (gap 13, added by the founder amendment of 1 November 2026): re-measured 5 November 2026 — the gap is real but one part of the audit is already closed: per-entity JSON-LD with `sameAs` exists in the site library (`site/src/lib/entity.ts`, `jsonLd()`); what is missing is the relational fields (spouse, children, memberOf). Full re-measurement in section 2.11.

### 2.11 AI extractability (gap 13): re-measured 5 November 2026

Measured on `origin/main` of 5 November 2026 (49,418 data files; 11,214 persons; validator total 49,318 at the last full run before this count). The 2026-11-01 audit's numbers were re-derived, not copied:

- **Muhammad's record still carries exactly 6 relations** (two parents, born/died/buried places, Hijra participation). Unchanged.
- **Inbound typed relations to `person/muhammad` from person records: 61 edges from 60 records** — `converted_under` 29, `spouse_of` 14, `child_of` 7, `corresponded_with` 4, `opposed` 2, `protected` 2, `persecuted` 2, `student_of` 1. Identical to the audit. There is **no `successor_of` edge to Muhammad from anyone**, and **Ali has no typed relation to Muhammad in either direction** (his kinship sits in `story_roles` only). Both confirmed.
- **Companion-role records: 474** (audit: 448), of which 206 are `published` and 268 `draft`. **Zero** carry a `member_of` edge to `group/sahaba`. `group/sahaba` is still a draft stub (completeness 1, sourced to al-Isaba). `group/muhajirun` has 6 member edges and `group/ansar` 80; both groups are also draft.
- **Badr:** the main event record is `event/battle-of-badr` (Badr is modelled as a family of sub-events). Event-side person references: 23. Person-side `participated_in` edges to it: 47. The two rosters still disagree; the classical roster is ~313.
- **Hadith passages:** about 3,100 hadith passage files (Muwatta, Muslim, Arba'un, Bukhari) among 10,079 passage files. **No narrator field exists** on passage records and **no narration predicate exists** in `schema/predicates.yaml`; narrators appear only as flat `mentions` edges. Confirmed.
- **The researched rosters exist** as `datasets/*.csv` (`prophetic-battles`, `tabuk-participants-and-absentees`, `abyssinia-muhajirun-roster`, `hunayn-martyrs`, `taif-martyrs`, `prophets-wives-ibn-hisham`, and others) and are not yet converted to edges. Confirmed.
- **JSON-LD:** `jsonLd()` in `site/src/lib/entity.ts` already emits per-entity schema.org markup with `sameAs` from `external_ids`, birth/death dates and places, event dates and place geo. **Correction to the audit:** the "no per-entity JSON-LD" finding is closed. What remains is the relational layer (spouse, children, parent, memberOf) — small, and it makes Phase 1's new edges visible to answer engines.
- **robots.txt:** `site/public/robots.txt` still sends `Content-Signal: ai-train=no, search=yes, ai-input=no`. The flip is a founder-gated item (section 7, decision 10) and has **not** been made.
- **Predicates:** `member_of` (person/group → group) and `successor_of` (person → person) are both registered in `schema/predicates.yaml`. Phase 1 needs **no new predicate**; narrator marking is a `role` on the existing `mentions` edge.

## 3. The phase table

Sizes are estimates with a stated derivation (section 4). "Founder-bound" means the phase cannot progress faster than founder decisions or founder-supplied access.

| # | Phase | Scope in one line | Size (estimate and basis) | Depends on | Parallel with | Contends for | Founder-bound? |
|---|---|---|---|---|---|---|---|
| 0 | Audit and measurement | This plan (done in this PR) | n/a | none | none | none | no |
| 1 | AI-resource moves | The five moves of the 2026-11-01 audit, on records that already exist | 474 `member_of` edges + the `group/sahaba` record (move 1, counted 2026-11-05); ~15–25 edges (move 2); ~500–1,500 edges (move 3, audit estimate); ~1,000–3,000 annotations (move 4, audit estimate); one template change (move 5) | 0 (gap 13 re-measured, section 2.11) | 2, 13, 15 | `person/`, `group/`, the site entity template | only its two gated items (decisions 10–11) |
| 2 | Canon decisions | 286 undecided canon books get a decision record | 286 records; each needs a founder decision | 0 | 13, 15 | the authenticity register | **yes** |
| 3 | The muhaddithat | Women hadith scholars, pilot then waves | target 9,328 less matches; at 25 per batch, at least 374 batches | 2 for citation ledger; 0 for prose | 4 (after pilot), 13, 15 | `person/` writes; the century queue's files | corpus access |
| 4 | The rijal graph | Narrator entities and teacher–student edges | unsized; pilot sets it | 3 (shared person pattern), 2 (for graded facts); Phase 1 move 4 (narrator markings) | 13, 15 | `person/`, edge predicates | corpus access, edge schema |
| 5 | DİA as a programme | Systematic pass over the İslâm Ansiklopedisi | unsized until an index crawl; brief figure about 16,800 unverified | 2 | 3, 6, 7 | `source/` | access terms |
| 6 | EI2 re-scope | The live `ei2` lane; reconcile PR #1599 and schema | 13 volumes, all entries; lane already running | 0 | 5, 7, 8 | `content/ei2`, `ei2.yaml` | scope already approved |
| 7 | Southeast Asia sweep | Kingdoms, scholars, pondok traditions, Malay-Indonesian poets and patrons | unsized; presence counts in section 2.5 | 2 (citation ledger) | 5, 8, 9 | `place/`, `polity/`, `person/` | language sources |
| 8 | Africa sweep | Timbuktu families, Harar, Sokoto, Swahili coast | unsized | 2 | 7, 9 | `place/`, `person/` | manuscript access |
| 9 | Manuscripts and libraries | Codices, collections, copyists, illuminators | unsized; codex 28 files, manuscript 153 | 2 | 8, 10 | `object/`, `place/` (institutions) | access to catalogues |
| 10 | The working civilization | Routes, coinage, waqf, guilds, markets, courts | unsized; guild 7, souq 6 files | 2 | 9, 11 | `concept/`, `place/`, `event/` | none |
| 11 | Everyday Islam | Foodways, dress, music, gardens, hammams, coffee, festivals | unsized; hammam 37, coffee 15 files | 2 | 10, 12 | `concept/`, `practice/`, `object/` | none |
| 12 | China, the Americas, print era | Han Kitab authors, Muslims of the Americas, 19th-century print | unsized; Ma Zhu/Liu Zhi 0, Ayuba 0 | 2 | 11, 13 | `person/`, `event/` | language sources |
| 13 | Wikidata second-source debt | Verify or honestly mark flagged dated facts; no new entities | range; see section 2.8 | none | everything | `person/` (existing records only) | none |
| 14 | Graph health loop | Orphan adoption, thin-edge thickening, wing bridges | standing; cadence in phase file | 0 (census), then runs with others | all | all, lightly | none |
| 15 | Render-QA sweep | Crawl built HTML for leaks; file a fix queue | one crawl; size by page count (96,000 pages per the homepage, 2026-11-05) | none | everything | none (analysis only) | build access |

## 4. Estimation method

Every size is computed as **corpus count × expected yield, sample-checked on one bounded slice**. The rules:

1. **Corpus count** is taken from the source, with its own citation. If the count cannot be read here, the phase is sized as "unsized", and the pilot sets it.
2. **Expected yield** is the share of corpus entries that pass the lane's inclusion rule (for example, the Sunni harvest rule for transmitters), measured on a random sample of at least 30 entries drawn from the source.
3. **Overlap** with existing records is measured by name-matching the same sample against the museum's data, with a documented normaliser for Arabic names (diacritics, al-/ibn/bint variants).
4. **Throughput** is set by the modern-figures lane's wave machinery: 10 per wave (5+5 across two writers), at most 25 entities per batch. Batch count is a hard lower bound on lane time.
5. A phase is sized in **batches**, and the batch count is multiplied by the observed batch time from its pilot, not from a guess.

Where a phase is "unsized", the pilot is its first deliverable. No phase is given a bare number.

## 5. Access: what can and cannot be read from this environment

| Corpus | Status from this environment | What would unlock it |
|---|---|---|
| Nadwi, *Al-Muhaddithat* (43 vols, Arabic) | Entry count known from a citation and an institute statement. Text **not verified as readable** | Founder-supplied scans or the Dar al-Minhaj edition; a checked sample |
| Tahdhib al-Kamal, Tahdhib al-Tahdhib, Taqrib, Mizan, Siyar (canon) | Canon records exist. Files are on the founder's microSD and **not reachable in this session** | Founder runs the name-match on the Mac (per the harvest memory) and returns counts |
| DİA (islamansiklopedisi.org.tr) | Homepage **readable** in the browser. Full article access and article count **not verified** | An index crawl under the site's terms; founder confirms terms |
| EI2 (Brill) | Lane running from founder-supplied PDFs (13 volumes, OCR in progress per the lane) | Continued founder-supplied volumes |
| al-Zirikli, al-A'lam | Canon record; text access **not checked** | Founder confirms which edition is held |
| GAL, GAS (Brockelmann, Sezgin) | **Not checked**; not verified in canon in this session | Founder confirms holdings |
| Malay, Indonesian, Dutch sources (SEA) | **Not checked** | Founder-supplied or open sources, to be listed in phase 7 |
| Timbuktu manuscript catalogues | **Not checked** | Institutional catalogues, to be listed in phase 8 |

The honest outcome: the Arabic rijal and Nadwi corpora cannot be sized from here. That is a planning fact, not a failure. Phases 3 and 4 open with a founder-run pilot.

## 6. Sequencing logic

- **AI-resource moves first** (Phase 1; founder amendment, 1 November 2026; go given 5 November 2026). Small, finite, existing records only: it raises the machine-readable value of everything the later phases add, and its narrator markings are Phase 4's seed. Its two gated items (section 7, decisions 10–11) are planned, never executed, without the founder's explicit word.
- **Canon second** (Phase 2). Every later phase cites against the ledger. Phase 2 has no content dependency and is founder-bound; it opened on 31 October 2026 and progresses at the founder's decision pace (section 7, decision 2).
- **One pilot-proven lane next.** Phase 3 (muhaddithat) is the pilot-proven lane because the brief's own stated pattern is a bounded slice before the harvest. Phase 3's pilot also proves the person-entity pattern that Phase 4 reuses.
- **Big harvests after mechanics are proven** (Phases 7–12), in regions, as the century-additions queue did.
- **Phase 4 depends on Phase 3's pattern and Phase 2's ledger.** It is what makes the Isnad Explorer buildable, and its edge discipline is designed for that consumer: narrator entities with `studied_under` and transmitted-to edges as `schema/predicates.yaml` allows. Edges are written once; inverses are computed. The schema check is part of the Phase 4 entry criteria.
- **Phase 13 runs in parallel with everything** because it adds no entities.
- **Phase 14 never finishes.** Its cadence (section 8) is set by the programme, not by a finish line.
- **Phase 15 runs once early** (a crawl and a fix queue) and again after each large wave, since new content can add leaks.

### 6.1 Which phases can run in parallel lanes, and which contend

- **Can run together:** 2 with 13 and 15; 3 with 5 and 6 (different files); 7, 8 and 12 (different regions, shared `person/` writes only by id); 10 with 11; 13 with any; 1 with any phase that does not write the same `person/` records in the same batch window.
- **Contend for the same files:** 3 and 4 (`person/`, and the rijal edge predicates); 7 and 8 (shared `place/` and `polity/` entities; check before creating, per the place pre-check); 9 and 8 (institutions in `place/`); 5 and 6 (sources: `source/` and `data/source`); 1 and 3 (both write `person/`; never the same records in the same batch).
- **Contend for the same review gate:** 2 (founder), and 3 and 4 (the same schema-shape checklist). Phase 4's edge schema review cannot be run in parallel with Phase 3 writes that set the same edges.

## 7. Founder decision points

One place for all of them. Each is listed with the phase it blocks.

1. **Approve the programme and its phase order** — **ANSWERED: approved 31 October 2026; the whole programme given the go on 5 November 2026, with the AI-resource moves folded in as Phase 1 (amendment of 1 November 2026).** Including the re-scope of Phase 6 to the live EI2 lane.
2. **Canon decision process** (blocks Phase 2). Decisions are founder-only. Options: the founder decides each of 286 books; or the founder approves batches of decision records prepared by an agent from the ledger's checks. Either way the founder records the decision.
3. **Muhaddithat scope and faith configuration** (blocks Phase 3). Nadwi's list includes women from several traditions. Sunni is the default frame, and any other view is labelled. Decide: include the full list with labels, or Sunni-only with the rest in `docs/delegation/held-back-content.md`.
4. **Rijal inclusion rule** (blocks Phase 4). The Sunni harvest inclusion rule applies. Tahdhib al-Kamal includes narrators from non-Sunni traditions. Decide: include them with labels (following the Shia-mapping ruling already in the modern-figures progress), or exclude explicit non-Sunni narrators as the harvest rule does for persons.
5. **Corpus access** (blocks Phases 3, 4, 5, 7, 8). The founder runs the rijal name-match and returns counts. For Nadwi and DİA, decide whether to purchase, scan or use the free index. Any purchase or subscription is the founder's alone.
6. **Edge schema for rijal** (blocks Phase 4). Confirm `studied_under` and transmitted-to predicates, or propose new ones through `schema/predicates.yaml`.
7. **Wikidata debt measurement** (blocks Phase 13's size). Confirm the flag field, so the 4,199 figure can be checked against the 5,604 files.
8. **Render-QA crawl** (blocks Phase 15). Authorise a read-only crawl of the built HTML, run locally. Building the site locally is a check, not a deploy, so no deploy approval is needed.
9. **Lane registration** of the programme's phases as sub-lanes, or one programme lane with phase queues. The plan proposes the second.
10. **Content-Signal flip** (gates one item of Phase 1 only; nothing else waits on it). Recommended configuration: `Content-Signal: search=yes, ai-input=yes, ai-train=no`. The data is already CC0, so the flip grants nothing the licence does not; it only stops asking answer engines not to use the content at question time. One line in `site/public/robots.txt`, reversible. Planned, never executed, without the founder's explicit word.
11. **The Sahaba lane** (a dependency Phase 1 registers, not a phase). A separate harvest commission on the modern-figures machinery (al-Isaba / Usd al-Ghaba, same two-source discipline), sequenced AFTER Phase 1 so new records land in a graph that can already hold them. Commissioned only on the founder's explicit word.

## 8. Standing machinery (inherited, not re-invented)

Every phase inherits the modern-figures lane's machinery wholesale:

- **Waves of 10** (5+5 across two writers), at most 25 entities per batch.
- **Schema-shape checklist** in every brief.
- **Cite-check gated on the literal "0 fail".**
- **Validate gated on the literal "0 errors"**, as a separate, asserted step.
- **Queue files** with `[ ]` / `[x]` / `[~]` states, one per phase.
- **STOPs logged, not guessed.** A stop is recorded in the phase's progress with the reason.
- **Founder flags at one line each.**
- **No-skip rule** within a phase's defined scope.
- **Place-entity pre-check** in every wave brief (the modern-figures lane's hardest lesson).
- **Faith discipline:** a faith is recorded only on two independent sources; a faith on one source is `unknown`, with a note.

**Phase 14 cadence:** one graph-health batch after every three waves of other phases. The census reruns at the same cadence.

## 9. Risks

| Risk | Likelihood | Mitigation |
|---|---|---|
| Founder decisions are the bottleneck (Phase 2) | high | Batch the 286 by era or by harvest folder; the founder approves batches. |
| Corpus text unreadable in this environment | certain for rijal and Nadwi | Founder-run pilots; sizes stay "unsized" until then. |
| Rijal and muhaddithat overlap with existing persons, creating duplicates | high | Name-matching with a documented Arabic normaliser; duplicates become aliases. |
| Faith mis-recorded for transmitters | medium | Two-source rule; labels; no verdicts. |
| Render-QA sweep finds leaks in source-as-rendered | certain if run on source | Crawl built HTML, not source (section 2.7). |
| Schema drift between phases | medium | One schema-shape checklist; one edge-schema review (decision 6). |
| Two lanes writing `person/` in the same wave | medium | Queue ownership per phase; separate progress files. |
| A submission-impacting edit slips in | low | The reserved files are untouched; the gate in `docs/ai-change-gates.md` section 3 applies. |
| Claims in outreach drift | low | No outreach text in this programme. |

## 10. Done means

The plan stage closed on 31 October 2026 (plan merged, progress log opened, `docs/agents/lanes.md` and `docs/status.md` list the programme). The founder's go for the whole programme came on 5 November 2026; Phase 1 opened the same day. Decisions 2–9 are answered phase by phase as each phase's entry criteria are reached; decisions 10–11 gate only their own items.
