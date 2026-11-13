# Audit of 13 November 2026, Part VI: decisions that are the founder's

Nothing in this file is implemented. Each item is an inventory, the evidence and costed options. Items 1 to 5 are the
brief's own; they were compiled by a read-only sweep of the repository (Claude Sonnet, 13 November 2026, no file
edited) and the figures the ledger relies on were re-derived from the graph afterwards: 40 Tour stops, 28 of them on
published records and 12 on drafts; 918 canon records, 271 cornerstones; 615 canon records in draft, 165 of them
cornerstones, 26 of those concepts; Ahmed III's death recorded as 1736. Items 6 to 13 are questions this run met and
did not settle. File and line references are to the tree the sweep read (the start of this run).

**Two corrections to the brief's own premises, found by the inventory:**

- The Grand Tour has **40 stops**, not about 80: the figure 80 is 40 stops in two languages.
- Ahmed III as "12th-century cornerstone" is **correct as labelled**: the century is the Hijri one (1101 to 1200 AH,
  about 1689 to 1786 CE) and he reigned 1703 to 1730. What is true is that he holds the place through the century
  floor, on the museum's own link count, and 44 of his 46 inbound links are `during_reign`.

Read-only inventory taken in the worktree `.../worktrees/islam-museum-audit-fixes-5e2a1a` (branch `audit/part-1-tafsir`, HEAD `faf3accebb`, graph `.cache/graph.json` generated 13 Nov 2026). Nothing in the repository was edited. Raw tables: `tour-stops.json`, `draft-cornerstones.json` (also `canon-split.json`, `q4-rows.json`, `q4-centuries.json`, and the scripts `tour.py`, `lead.py`, `q4.py`, `q5.py` used to produce them). Options are laid out with cost only; no recommendation is made.

---

## 1. Grand Tour stop narratives on `published` records

### What was asked
Inventory the Tour's stops, their records' review state, where the narrative lives, its size, its provenance, and whether the Tour run changed the record's prose. Quote the two founder decisions. Cost four options.

### What the repository shows

**The "about 80" is 40 stops x 2 languages.** `tour/grand-tour.yaml` lists 40 stops (one `- id:` line each; the file says it holds ids and nothing else). `docs/fable-run/VERIFICATION.md:~200` speaks of "all 80 leads" (40 stops x Arabic and English). The Qur'an stop was withdrawn in commit `3905338e7f` (PROPOSALS.md P-10). `CANARY.md:744` still says "42 stops", a stale number.

**Where the narrative lives.** Not in the tour file. `site/src/lib/grand-tour.ts:154`: `leadOf = stop.node.prose[lang]?.sections[0]`, the first `## ` section of the record's own prose file `content/<lang>/<class>/<slug>.md`. `site/src/pages/[lang]/grand-tour/[stop].astro:22-24,47` renders it with `set:html`. The Tour is built only for `ar` and `en` (`TOUR_LANGS`, grand-tour.ts:15); Urdu leads exist in the record files but are not part of the Tour and were not touched.

**Review state and the decisions.** All 40 stop records are `importance: 1`. **28 are `status.review: published`, 12 are `draft`.** The Tour run changed no review state: comparing the baseline commit `e1d721298a` with HEAD, 0 of 40 differ (P-4 in `docs/fable-run/PROPOSALS.md:33` says the run deliberately left them). The 28 published: five-pillars, salah, first-revelation, badr, conquest-of-mecca, Muhammad, Abu Bakr, Umar, Ali, Aisha, Dome of the Rock, Umar ibn Abd al-Aziz, al-Khwarizmi, al-Bukhari, al-Tabari, Cairo, al-Azhar, Ihya, Ibn Rushd, Baybars, Ibn Taymiyya, Ibn Battuta, Ibn Khaldun, Sulayman, Taj Mahal, Ahmed III, Mahmud II, Kiswa. The 12 drafts: Kaaba, Khadija, Hijra, Hajj, Baghdad, Malik, Ibn Sina, al-Ghazali, Sack of Baghdad 656, Conquest of Constantinople, Fall of Granada, Malcolm X.

**Provenance.** 39 of 40 data files carry `provenance.lead_deepened`: "Lead section deepened to 150-250 words, Arabic and English, only from sources this record already cited (Grand Tour mission, run grand-tour-2026-11-11; Claude Code, claude-fable-5-2). AI text awaiting a human read; sentence-by-sentence evidence in docs/fable-run/prose-evidence/." That note is data-only: nothing in `site/src` reads it (grep: no hit for `lead_deepened` or `provenance` in site code). `object/kiswa` has no such note, and `git log -S lead_deepened -- data/object/kiswa.yaml` finds no commit that added it, although its lead was rewritten by the Tour (so the Kiswa narrative has no AI-awaiting-read marker at all). The record-level `generated_by/model/run` fields describe the older prose (Devin SWE-2 variants, Claude Haiku/Sonnet/Opus 5.5, OCR-harvest workers), not the Tour lead; the Tour lead's author is only in the `lead_deepened` string, the commit trailers (`AI-Model: claude-fable-5-2`) and `docs/fable-run/prose-evidence/<class>--<slug>.md` (40 files for the stops, 356 sentence rows, 41,942 words).

**Tour commits touching the prose** (all on 11 Nov 2026, author amado2k5; the trailer `AI-Model: claude-fable-5-2` was seen on `9d3cab2ca2`, not checked on the other three): `0a1dbd751e` (stops 1-21 narratives), `6c4420f475` (stops 22-41), `3905338e7f` (prose verifier A fixes), `9d3cab2ca2` (verifiers B and C fixes). `lead.py` compared each file's lead before and after those commits: the Tour changed the lead in **40 of 40 stops in both Arabic and English**. After the Tour, canon commit `3ef9b96f52` (12 Nov, "finish forty-nine more cornerstone records") **replaced the lead of three stops**: Ibn Sina, Ibn Rushd, Baybars. For those three the Tour page no longer shows the verified Tour text but the canon batch's overview (Ibn Sina ar/en 236/295 words, Baybars 237/335, over the 150-250 band the Tour oracle checks).

**A defect found on the way.** `content/ar/person/ibn-rushd.md` now opens with `## موجز` (empty) followed by `## نظرة عامة`. `sections[0]` is the empty heading, so the Arabic stop 27 narrative renders as nothing (graph.json: `sections[0]` heading «موجز», 0 words). English is fine (291 words).

**Unread citations.** `docs/fable-run/VERIFICATION.md:206-208` says 17 of 42 evidence files name a citation carried over without being re-read. Re-grepping the 40 stop files for "unread / not re-read / could not be read|checked" gives **17 stops flagged** (grep-based, may include false positives): Kaaba, first-revelation, Khadija, badr, conquest-of-mecca, Muhammad, Abu Bakr, Umar, Aisha, Dome of the Rock, Baghdad, Ibn Sina, Ibn Taymiyya, Sulayman, Taj Mahal, Malcolm X, Kiswa.

**The two decision records** (`docs/decisions/records/`):
- `dec-20261108-152.yaml` (kind override, founder verdict, 2026-11-08, `reversible: true`, `expires_at: 2027-11-08`): decision: "AI-generated prose citing defined sources does NOT get marked status.review: published without human read — it stays draft until reviewed."
- `dec-20261108-161.yaml` (same dates): decision: "Machine-translated summaries require human review before publishing — unreviewed MT prose stays draft." This one is about machine translation of summaries; the Tour leads are AI-written originals in ar and en, so -152 is the one that applies, -161 would apply only to a translated lead.
- `AGENTS.md:38` restates it: AI output enters `draft` with a provenance block and "no agent may self-promote AI output". `docs/agents/publication-standard.md:25-26` defines `published` as "the state of museum content a human has read"; the same file's "No review" section (line ~17) says no review is required before publication, and line ~28 says old `draft` values are "written before this standard" and do not make a record unpublished. Those paragraphs sit in tension; which governs is the founder's reading (could not be settled from the repository).

**What `draft` does on the site (for options b and c).** Nothing a reader sees: `site/src/layouts/EntityLayout.astro:452-453` says the review state is not shown to readers, and no file under `site/src` reads `status.review` or `lead_deepened`. Where the flag is read: `scripts/export-api.ts:51,74,591,809,873,927` (`status` field in `/api/v1/` JSON), `scripts/wings.ts:32` (`featuredPool`: a record is "rich" if `published` OR `completeness >= 2`, and has prose; used by `site/src/components/Landing.astro:15,37` for the one random featured card per wing), `scripts/time-browser.ts:119` and `time-browser-media.ts:61,123,176,199,221` (draft flag and ordering, never shown), `scripts/build-graph.ts:266` (`byReview` tally), `scripts/fable/o04_reachability.py` ("every published record within three hops"), and the `Draft` column of `docs/canon.md`.

### The 40 stops
| # | record | class | review | lead words ar/en | whole prose ar/en/ur | unread-citation flag | Tour commits (en file) | lead status |
|---|---|---|---|---|---|---|---|---|
| 1 | building/kaaba | building | draft | 180/243 | 2557/3507/3883 | yes | 3905338e7f, 0a1dbd751e | Tour text |
| 2 | event/first-revelation | event | published | 175/252 | 2067/2915/3289 | yes | 9d3cab2ca2, 0a1dbd751e | Tour text |
| 3 | person/khadija | person | draft | 161/223 | 3028/4419/5023 | yes | 9d3cab2ca2, 0a1dbd751e | Tour text |
| 4 | event/hijra | event | draft | 170/234 | 1789/2398/2595 | no | 3905338e7f, 0a1dbd751e | Tour text |
| 5 | event/battle-of-badr | event | published | 187/257 | 2009/2862/3215 | yes | 9d3cab2ca2, 0a1dbd751e | Tour text |
| 6 | concept/five-pillars | concept | published | 177/256 | 907/1232/1350 | no | 9d3cab2ca2, 0a1dbd751e | Tour text |
| 7 | practice/salah | practice | published | 177/245 | 2803/4092/4545 | no | 3905338e7f, 0a1dbd751e | Tour text |
| 8 | event/conquest-of-mecca | event | published | 197/258 | 1786/2597/2842 | yes | 9d3cab2ca2, 0a1dbd751e | Tour text |
| 9 | practice/hajj | practice | draft | 174/257 | 2140/2981/3117 | no | 9d3cab2ca2, 0a1dbd751e | Tour text |
| 10 | person/muhammad | person | published | 188/257 | 3940/5521/6323 | yes | 3905338e7f, 0a1dbd751e | Tour text |
| 11 | person/abu-bakr | person | published | 213/258 | 2468/3452/3942 | yes | 9d3cab2ca2, 0a1dbd751e | Tour text |
| 12 | person/umar-ibn-al-khattab | person | published | 173/254 | 5551/7454/8814 | yes | 3905338e7f, 0a1dbd751e | Tour text |
| 13 | person/ali-ibn-abi-talib | person | published | 189/257 | 5459/6182/8788 | no | 9d3cab2ca2, 0a1dbd751e | Tour text |
| 14 | person/aisha | person | published | 182/259 | 1754/2478/2921 | yes | 9d3cab2ca2, 0a1dbd751e | Tour text |
| 15 | building/dome-of-the-rock | building | published | 181/247 | 1926/2544/2959 | yes | 0a1dbd751e | Tour text |
| 16 | person/umar-ibn-abd-al-aziz | person | published | 167/244 | 2887/3864/4370 | no | 0a1dbd751e | Tour text |
| 17 | place/baghdad | place | draft | 185/257 | 2475/3018/3521 | yes | 9d3cab2ca2, 0a1dbd751e | Tour text |
| 18 | person/malik-ibn-anas | person | draft | 173/244 | 2954/4075/4499 | no | 0a1dbd751e | Tour text |
| 19 | person/al-khwarizmi | person | published | 163/229 | 1652/2150/2374 | no | 0a1dbd751e | Tour text |
| 20 | person/al-bukhari | person | published | 180/257 | 1004/1267/1499 | no | 9d3cab2ca2, 0a1dbd751e | Tour text |
| 21 | person/al-tabari | person | published | 173/251 | 1324/1727/1962 | no | 6c4420f475 | Tour text |
| 22 | place/cairo | place | published | 174/260 | 2424/3191/3535 | no | 9d3cab2ca2, 6c4420f475 | Tour text |
| 23 | building/al-azhar | building | published | 182/243 | 1617/2172/2296 | no | 6c4420f475 | Tour text |
| 24 | person/ibn-sina | person | draft | 236/295 | 2809/3625/4282 | yes | 3905338e7f, 6c4420f475 | lead replaced by canon commit 3ef9b96f52 (not the verified Tour text) |
| 25 | person/al-ghazali-abu-hamid | person | draft | 168/245 | 2650/3555/4134 | no | 9d3cab2ca2, 6c4420f475 | Tour text |
| 26 | work/ihya-ulum-al-din | work | published | 167/252 | 2167/3145/3417 | no | 6c4420f475 | Tour text |
| 27 | person/ibn-rushd | person | published | 0/291 | 3022/4180/4752 | no | 3905338e7f, 6c4420f475 | lead replaced by canon commit 3ef9b96f52 (not the verified Tour text); Arabic lead section is EMPTY |
| 28 | event/sack-of-baghdad-656 | event | draft | 190/256 | 2408/3314/3725 | no | 9d3cab2ca2, 6c4420f475 | Tour text |
| 29 | person/baybars | person | published | 237/335 | 1945/2569/2850 | no | 6c4420f475 | lead replaced by canon commit 3ef9b96f52 (not the verified Tour text) |
| 30 | person/ibn-taymiyya | person | published | 177/256 | 1339/1866/2230 | yes | 6c4420f475 | Tour text |
| 31 | person/ibn-battuta-muhammad | person | published | 180/250 | 1421/1887/2025 | no | 9d3cab2ca2, 6c4420f475 | Tour text |
| 32 | person/ibn-khaldun | person | published | 167/246 | 2166/3054/3516 | no | 6c4420f475 | Tour text |
| 33 | event/conquest-constantinople-857 | event | draft | 189/254 | 3160/4321/4969 | no | 3905338e7f, 6c4420f475 | Tour text |
| 34 | event/fall-of-granada-897 | event | draft | 166/254 | 1427/1961/2263 | no | 9d3cab2ca2, 6c4420f475 | Tour text |
| 35 | person/sulayman-al-qanuni | person | published | 171/250 | 2815/3624/4194 | yes | 9d3cab2ca2, 6c4420f475 | Tour text |
| 36 | building/taj-mahal | building | published | 202/254 | 1379/1760/1976 | yes | 3905338e7f, 6c4420f475 | Tour text |
| 37 | person/ahmed-iii-uthmani | person | published | 179/257 | 1860/2390/2800 | no | 9d3cab2ca2, 6c4420f475 | Tour text |
| 38 | person/mahmud-ii-uthmani | person | published | 179/254 | 1557/1976/2325 | no | 6c4420f475 | Tour text |
| 39 | person/malcolm-x | person | draft | 175/242 | 950/1292/1521 | yes | 3905338e7f, 6c4420f475 | Tour text |
| 40 | object/kiswa | object | published | 166/241 | 1004/1415/1491 | yes | 9d3cab2ca2, 6c4420f475 | Tour text |

### Numbers (word counts strip `{cite:}` markers and `[[links]]`; whitespace words)

| scope | ar words | en words | at 200 wpm |
|---|---|---|---|
| Tour narratives (lead sections), all 40 | 7,070 | 10,174 | ar 35 min, en 51 min, both 86 min |
| leads of the 28 `published` stops | 4,903 | 7,170 | 60 min |
| leads of the 12 `draft` stops | 2,167 | 3,004 | 26 min |
| leads of the 17 flagged stops | 3,149 | 4,303 | 37 min |
| the 40 evidence files (sentence-by-sentence) | | 41,942 words | 3.5 h |
| whole prose files of the 40 records | 90,600 | 122,032 | ar 7.6 h, en 10.2 h, both 17.7 h (ur 140,132 words, 11.7 h, not part of the Tour) |

Arabic words run fewer than English words for the same content, so 200 wpm per language understates Arabic reading time if the founder's Arabic pace is slower than his English pace. The Ibn Rushd Arabic lead is 0 words as built (235 words if its real overview is read).

### Options with cost
- **(a) Founder reads everything.** Narratives only: 17,244 words = 86 min (Arabic 35, English 51); only the 28 published: 60 min; only the 17 flagged: 37 min. Add the evidence files (3.5 h) if he wants the sentence-level checks, or whole records (17.7 h) if "read" means the record, since the narrative sits on top of records whose other sections are older AI text. After the read, status stays or is promoted by him; no repository change is needed for `published` records he accepts. Three leads (Ibn Sina, Ibn Rushd, Baybars) should be re-read in their current form, and Ibn Rushd's empty Arabic lead needs a fix first. Cost: his time only.
- **(b) Demote the stop records to `draft`.** 28 data files, one-line edit each (`review: published` to `draft`); 12 already are. Then regenerate `docs/coverage.md` and `docs/canon.md` (draft column 615 to 643), add a CANARY entry, run validate and tests. Visible effect on pages: none (HTML is byte-identical because no template reads the field; not verified by a build, none was run). Effects elsewhere: the `status` field in 28 `/api/v1/` JSON files and the counts files built from `byReview`; 5 of the 28 (Abu Bakr, Ali, Ibn Taymiyya, Ibn Khaldun, Taj Mahal, all `completeness: 1`) would drop from the "rich" to the "plain" pool of the wing landing featured cards, the other 23 stay rich via `completeness >= 2`; time-browser draft flag and ordering; the reachability oracle's published count. Deploy cost is small (API files only, no shell file). Does not mark the three leads the canon batch replaced; and it demotes whole records whose older sections may have been read by a human (the flag cannot say which part was read).
- **(c) Mark only the narrative as unreviewed, record stays published.** The data marker already exists for 39 of 40 (`provenance.lead_deepened`, schema-legal because `provenance` has `additionalProperties: true`); the Kiswa needs the same note added (one line in `data/object/kiswa.yaml`). To make it mean something to readers, code is needed: `[stop].astro` reads `n.data.provenance.lead_deepened` and prints a short notice ("AI text awaiting a human read") plus three i18n strings (`grand_tour.*` in `i18n/ar.yaml`, `en.yaml`, `ur.yaml`, per the three-language rule) and a check in `scripts/check-site.ts` or a test that every stop with the note shows it. That touches only the 80 Tour stop pages (not a shell file, so no whole-site deploy, but confirm with `tools/deploy/shell-impact.mjs`). If the founder wants the marker on the record page too, `EntityLayout.astro` changes and that is a shell file (`tools/deploy/shell-paths.list`), which rewrites all ~164,000 pages. A new structured field instead (for example `status.lead_review`) needs a schema change: `schema/_base.schema.json` `status` has `additionalProperties: false` with only review, completeness, last_reviewed, reviewers, generated_by, so it is a schema/validator change under `docs/ai-change-gates.md`. Does not change what `published` means for the 28.
- **(d) Leave as is.** No cost; the standing conflict with `dec-20261108-152` and `AGENTS.md:38` that the run itself reported in P-4 stays open, and the narrative of 28 `published` records is AI text no human has read.

### Could not verify
- Whether any human read the older sections of the 28 published records (the repository records `published` but no reader, date or `reviewers` list on these 40; none carry `reviewers` or `last_reviewed`).
- That removing the review flag leaves page HTML unchanged: inferred from code reading, no build run.
- The 17-stop "unread citation" flag is a keyword grep over the evidence files.

---

## 2. Wing assignments: Al-Azhar to "today", the Kiswa to "made"

### What was asked
Identify the records, show their wings and the sentences each assignment rests on, check the Kiswa's cited source, lay out evidence for and against.

### What the repository shows
**Records meant.** `building/al-azhar` (data `wings: [objects, today]`, line 10; `importance: 1`; `review: published`) and `object/kiswa` (`wings: [objects, made]`, `data/object/kiswa.yaml:11`; `importance: 1`; `published`). Other candidates, not meant: `place/al-azhar` (draft, wings place; a second record of the same mosque), `event/azhar-founding-361`, `concept/kiswa` ("Clothing owed", a fiqh concept, wings ideas), x wings were added on 11 Nov 2026 by commit `1d5a49572f` through `scripts/fable/complete_wings.py:21-22` (the rows read: Al-Azhar "plan section 5 names Al-Azhar as a Today example; the record's own prose calls it one of Cairo's most important mosques today"; Kiswa "the record's own prose says it is made today in the Kiswa workshop in Mecca by two hundred craftsmen"). Proposal text: `docs/fable-run/PROPOSALS.md:19-25` (P-2, where the run itself says "Where this may be wrong"); `VERIFICATION.md:205` calls the two edits the basis for statement 2 (nine wings), and says that if either is declined the Tour spans eight wings. The stops are 23 (al-Azhar) and 40 (Kiswa).

**How wings are defined.** `docs/plan/01-vision.md:78-90`: Today = "Modern nations, institutions, demographics, contemporary figures and events, the future", examples "OIC · Al-Azhar · Muslim population data · 21st-century events". Made = "A directory of what Muslims create and own today: shops, brands, publishers, books, apps, studios, media, charities, schools", examples "A bookshop in Fez · a Qur'an app · a modest-fashion brand · a Muslim-run publisher". `i18n/en.yaml:141-146,155-156`: today "Nations, institutions, data and the people of the present", count line "Where the calendars meet"; made "What Muslims make and own today: bookshops, publishers, apps, studios, brands and charities", count line "Made by Muslims today". `docs/plan/02-content-model.md:77-80` and `docs/plan/11-made-directory.md` (line 3: "what Muslims make and own today and in the recent past") define Made through the `listing` class with `made{by_muslims, basis}`; Made also aggregates works, groups and screen titles when `made.by_muslims` is set. `scripts/wings.ts:3-4` calls today and made "uncounted wings" (they show a phrase, not a number).

**What sits in each wing now** (graph, non-stub): Today 302 records (work 118, listing 86, award 33, group 19, person 19, concept 16, event 5, building 3); the three buildings are al-Azhar, the Museum of Islamic Art Doha and the Sheikh Zayed Mosque; canon members in Today: al-Azhar (1), Suez Canal Company (2), contemporary-era (1). Made 275 (listing 171, concept 59, invention 14, work 14, practice 9, object 6, group 1, person 1); canon members in Made: Kiswa (1), Max Herz Bey (2, draft). The six objects in Made are historical pieces by their record ids (`batil-al-sihr-bowl-1080-bonyad`, `kaaba-key-nuhad-es-said-13th-century`, `kaaba-key-nuhad-es-said-740`, `baybars-al-jashankir-quran`, `dome-of-the-rock-mosque-lamp-956`) plus the Kiswa, and the nine `practice` records are crafts and techniques (bookbinding, glassmaking, tazhib, pigments and gold, pouncing, marbled drawings, the muraqqa album, siyah mashq, gold sprinkling), so the data already uses Made for "how Muslims made things", not only present-day businesses.

### Al-Azhar to Today: the sentence and the evidence
- Sentence: `content/en/building/al-azhar.md:26` "The mosque of al-Azhar is one of the principal mosques of present-day Cairo and was, from the eighteenth century, the principal religious university of the Islamic world." Arabic at `content/ar/building/al-azhar.md:26`: «جامع الأزهر من أهم مساجد القاهرة اليوم». Cite `{cite:encyclopaedia-of-islam-2 vol. 1 p. 862-863}`. `data/source/encyclopaedia-of-islam-2.yaml:11` gives `issued 1960`, so "present-day" is 1960's present. The record's latest facts are 1953-57 (30,000 students in 1953, budget to 1954, rectors to January 1954, the 1936 law "charter in the 1950s"; Yeomans 2006 cited for architecture only).
- For: the plan names Al-Azhar as a Today example by name (vision.md:89); Today holds institutions (OIC, AAOIFI, MUIS, JAKIM), and the record's own sentence is present-tense; `event/azhar-strategy-un-security-council-2016` shows the institution acting in 2016 (wings time, ideas; no graph edge connects it to `building/al-azhar`; the building's 12 edges, `related_to` excluded or not, point to events of AH 1213 and 1215 (1798 and 1800 CE), Cairo, the Fatimid caliphate, Ya'qub ibn Killis and a modern catalogue of its manuscripts).
- Against: the record is class `building`, wings objects; its content is a history from 970 to the 1950s; no post-1960 fact in the record or in an edge; Today's other two buildings are 21st-century; the museum has no `group` record for the institution, so the university-as-institution is not represented as such (the building record stands for it).
- Cannot verify from the repository: Al-Azhar's present state (no source here after 1960 other than the 2016 event record).

### Kiswa to Made: the sentence and the cited source
- Sentence: `content/en/object/kiswa.md:13` (section `## Impact`, line 12 heading): "Its traditions run from the pre-Islamic period to the modern Mecca workshop; it is made today at the Kiswa Factory in Umm al-Jud by two hundred craftsmen. {cite:wikidata}". Arabic at `content/ar/object/kiswa.md:13`: «تُصنع اليوم في دار كسوة الكعبة بأم الجود على أيدي مئتي صانع. {cite:wikidata}». It sits in the body, not in the Tour lead; the Tour lead (first section) says only "black, embroidered with gold, replaced each year in the hajj season {cite:wikidata Q1511204}".
- The cite marker `{cite:wikidata}` names source `source/wikidata` (`data/source/wikidata.yaml`: a general reference_data source, `URL: https://www.wikidata.org`, reliability note "a single Wikidata value is never enough for a dated fact"). It carries no item id, no property, no revision. The record's `external_ids.wikidata` is Q1511204, so the item can be inferred, but the sentence's cite does not say so.
- What the repository itself says about it: `docs/fable-run/prose-evidence/object--kiswa.md` (lines 24 and 28): the writer "could not re-read" the database citation; a local copy of item Q1511204 at revision 2550104714 (modified 2026-09-27) was read after verification (`~/islam-museum-harvest/layers/cc0/wikidata-v2/chunks/`, outside git): "the local copy of the item has neither" the factory nor the two hundred craftsmen. The item's Arabic description (annual replacement during the hajj season) supports only the yearly change. Verifier B (`docs/fable-run/verifier/prose-B.md:159`) gave the same finding for the lead's earlier sentence. `VERIFICATION.md:205` says outright that "a verifier found that the database entry cited for that sentence does not carry it". No entry for Q1511204 in `docs/authenticity-ledger/`, which the Wikidata rule (`docs/delegation/wikipedia-broad-rule-proposal.md`) requires for a Wikidata-sourced fact. The sentence dates from `fa2a1951c8` (17 Oct 2026, "object pages batch 4 (45, draft)", an English translation of an Arabic draft).
- Other cited sources in the record (`umari-masalik-1924`, EI2 vol. 4 p. 335, vol. 6 pp. 53-55, vol. 3 p. 43, vol. 5.2 p. 186) cover the history from pre-Islamic times to al-Umari's day (738 AH) and the Mamluk mahmal; none says anything about a present-day workshop. Two hundred craftsmen at the Umm al-Jud factory is the only present-tense production claim.
- For: the wing text says "what Muslims make and own today"; if the sentence is true, the covering is made today by Muslims in a named workshop; Made already holds historical objects and crafts; `kiswa` is the only object-class cornerstone that stands for a continuing annual making.
- Against: the sentence's only cite does not carry it (and nothing in the repository does); Made is defined as a directory of listings (businesses, brands, publishers), the Kiswa has no `made` block, no `kind: listing`, no maker field; the Kaaba covering is a state workshop product, not a listing. If the sentence is removed or marked unsupported, the wing assignment has no remaining support in the record. Without it the Tour reaches eight wings (VERIFICATION.md:205).
- Cannot verify from the repository: that the factory exists as described, its location, the headcount, who runs it (needs a source outside git).

### Options with cost
- **Keep both**: no cost; Kiswa assignment stays on an unsupported sentence.
- **Keep Al-Azhar, drop Made from the Kiswa**: one-line edit in `data/object/kiswa.yaml:11`; Tour covers 8 wings; `scripts/fable/o02_tour_coverage.py` fails its nine-wing check (the oracle says so; the check would have to be revised or a different Made stop found: the only other canon record in Made is `person/max-herz-bey`, importance 2, draft, not a cornerstone, so no cornerstone can stand in for it today); `complete_wings.py:22` also lists it, so the script must change or it will re-add it; regenerate `docs/canon.md`/coverage; CANARY entry; no shell-file impact.
- **Keep Made but fix the support**: remove or soften the "made today" sentence in `content/en|ar|ur/object/kiswa.md` or replace the cite with a real source (needs one outside the repository for the factory; sources the museum holds stop at 1960); record the Wikidata revision in `docs/authenticity-ledger/`. Founder's rule on removals is his decision (PROPOSALS P-7), so this is a proposal item.
- **Drop Al-Azhar from Today**: one-line edit (`data/building/al-azhar.yaml:10`) plus the same script row; same eight-wing consequence; the plan text would still list Al-Azhar as a Today example.
- **Re-read Made strictly or loosely**: amend `docs/plan/01-vision.md:89` / `i18n/en.yaml:144-146` wording (a founder-level text change; wing blurbs are in i18n, which the deploy shell check treats separately) so that the definition matches how 15 object/practice records already use it.

---

## 3. Canon reproducibility (489 of 824 need the Wikipedia count)

### What was asked
Locate the selection code and data, reproduce 489 and 824 from the repo, identify the cache, cost options to make the canon reproducible from the repository alone.

### What the repository shows
**Code.** `scripts/report/canon.py` (generator of `docs/canon.md`, which says "Do not hand-edit"). `QUOTA`/`TIER1` at lines 19-20; `INCLUDE` (71 editorial includes) at 23; `scan()` computes `g` (inbound ID mentions in data files plus inbound `[[links]]` in `content/ar`) and `paths` (pathways, courses, journeys, +3 for tour halls/exhibits/journeys); `sitelinks()` at line 94 fetches counts; `eligible()` at 188; `pick()` at 203; `century_floor()` at 155; `write_records()` at 219 writes only the `importance:` line. Oracle: `scripts/fable/o01_canon.py` evaluates `eligible()` twice, with `sl = 0` and `sl = 10**9`, and prints the 315/489 split; the register test `scripts/canon.test.ts` only checks counts and that the register names every marked record. The canon itself is stored in git as the `importance:` line in each `data/<class>/<slug>.yaml` (918 records at HEAD), so the marks are reproducible; the rule that produced them is not.

**The cache.** `canon.py --cache <dir>` reads and writes `<dir>/sitelinks.json`: a JSON object `{"Q123": <int>, ...}`, one number per Wikidata id found in the records' `external_ids.wikidata`, fetched in batches of 400 from `https://query.wikidata.org/sparql` (`SELECT ?i ?n WHERE { VALUES ?i {...} ?i wikibase:sitelinks ?n }`, 1.5 s sleep, 4 retries). The directory is whatever the runner passes: "outside git" by convention (docstring line 12: "must stay out of git"). It is not covered by a `.gitignore` pattern (`.gitignore` ignores `.cache/`, not a named sitelink file), and no `sitelinks.json` is tracked (`git ls-files | grep -i sitelink` is empty). I did not find the file on this machine (Spotlight search for `sitelinks.json`, search of home to depth 4). PROPOSALS P-3 (`docs/fable-run/PROPOSALS.md:27-31`) and VERIFICATION.md:204 state the same.
Documentation mismatch: `docs/canon.md` calls the signal "the number of Wikipedia language editions"; the query counts **all** sitelinks of the item (`wikibase:sitelinks`: Wikipedias plus Commons, Wikiquote, Wikisource, Wikivoyage, etc.).

### Numbers I could reproduce from repository files alone
- At the Tour baseline commit **`ca0886cd1d`** (extracted with `git archive` into the scratchpad, then `canon.scan()` and `canon.eligible()` run on it): **824 marked, 271 cornerstones; 315 eligible on structure alone (`sl=0`); 489 eligible only with the reach signal (`sl` at infinity); 20 editorial includes; 0 below the structural floor.** Exactly the numbers in `docs/fable-run/oracle-output/o01-canon.out`. So "489 of 824" is reproducible from the repo; what it means is: 489 records cannot pass `eligible()` unless their sitelink count is large enough (>= 20 in the person/event/concept rule, or the place/polity rule). It is an upper bound on dependency (they might all have had `sl >= 20`; they were selected, so they did).
- At **HEAD** the same computation gives: 918 marked, 271 cornerstones; 346 on structure alone; 497 need reach; 23 editorial includes; **52 below the structural floor and not in `INCLUDE`**. Those 52 are all `importance: 2` records added by hand on 12 Nov 2026 by `data(canon): ... missing records` batches 3, 4 and 5 (`9e2010143a` 14, `5da872574b` 23, `437c28b1ca` 15). Per the code, `o01_canon.py` would now fail its "no record is in on reach alone / below the floor" check (`below` is non-empty), and a full `canon.py --write` run would strip their `importance:` line because `write_records()` removes the field from any record not picked and not in `INCLUDE` (read from code, not executed). `canon.test.ts` still passes (it checks totals only).

### What I could not reproduce, and why
- **The selection itself (which 824 and which are cornerstones)** cannot be re-derived from git: it needs `sl` for roughly 18,756 records with a Wikidata id, and the cache is not in the repo.
- **Partial substitute found outside git:** a local Wikidata slice `~/islam-museum-harvest/layers/cc0/wikidata-v2/chunks/wd_sitelink.p1.0.ndjson` + `p2` (1,641,324 rows `{id, site, title}`, harvested 19 Oct 2026, 4.4 GB for the whole folder, outside git). Counting rows per id as `sl` (all sitelinks, same definition as the query) covers 13,575 of the 18,756 recorded ids (the rest read as 0). Running the script's own `pick()` on the baseline tree with those counts yields 820 records of which **808 are in the 824 marked** (98%); and 264 of the 271 marked cornerstones match. Counting Wikipedias only gives 815 picked / 792 overlap, which suggests the original used all sitelinks, consistent with the code. At HEAD the same exercise gives 867 picked / 839 overlap with the marked set (HEAD has hand additions). So the original numbers were near-reproducible but not exactly: the difference comes from items missing in the local slice and Wikidata drift between 19 Oct and the run date (unmeasurable here).

### Options with cost
1. **Commit a frozen snapshot of the counts** (`data/_canon/sitelinks.json` or beside the script, dated, with the query and the Wikidata revision date). Size: for every record with an id, 18,756 ids = **259 KB** of minified JSON; only ids that could pass `eligible()` (structurally possible at `sl` infinity: 1,295 ids at HEAD) = **17 KB**; only the 918 canon records = about 10 KB (a snapshot of just the canon's counts cannot re-run the selection, only audit it). Licence: Wikidata is CC0; counts are facts; the AGENTS.md rule on Wikipedia/Wikidata as a fact source (revision recorded in `docs/authenticity-ledger/`) would want one ledger entry for the snapshot. Work: write the snapshot with the existing fetch code (or from the local harvest slice, with its gap), add a `--snapshot` path to `canon.py` and `o01_canon.py`, a test that re-derives the 315/489 split, CANARY entry. Does not touch pages (no site code). It would re-fix the ranking at a date; the 52 hand additions still need an `INCLUDE` or a documented class.
2. **Store a per-record `reach` field** (or `external_ids.sitelinks`) in each record. Size: one line in ~18,756 `data/` files (a data-wide change: large diff, `docs/coverage.md` regeneration, schema change to `_base.schema.json` since `external_ids` properties are constrained, validator + export-api + API docs/openapi + llms.txt per the "every feature is graph, API and search" rule). `scripts/fable/o01_canon.py:63` currently asserts that no record stores a Wikipedia language-edition count ("the reach signal never writes"), so that oracle check would be reversed. Highest cost; the count goes stale per record, and it is the opposite of the run brief's "rank, never write".
3. **Drop the reach signal** (structure-only eligibility). `eligible()` would lose the `sl >= 20` branches; at baseline only 315 of 824 qualify on structure, at HEAD 346 of 918 (405 records are eligible on structure across the whole graph, vs 3,645 with unlimited reach), so the canon would shrink or be refilled by `INCLUDE`; the quotas (`QUOTA` totals 1,000) would not fill. A re-selection changes which records carry `importance`, hence the Tour's cornerstone rule (every stop must be importance 1; stops whose record falls out stop being legal), `docs/canon.md`, the century floor, wings, and the reading lists. This is P-13 in `PROPOSALS.md:91-97` (the run's question: "rank, never write" also meaning "never gate").
4. **Freeze the marks, retire the generator** (declare the committed `importance:` lines the canon, keep `canon.py --floor-only` for reports only): zero data change; reproducibility question disappears but the claim that the canon is rule-selected goes with it; 52 hand-marks become legitimate by definition. Cost: doc edits (`docs/canon.md` header, AGENTS/lane text), `o01` check rewrite.

### Could not verify
- The original cache's content, date and Wikidata revision (not on this machine).
- Whether the 1.5 s-sleep fetch would return today the same counts (network not used).

---

## 4. Ahmed III as "12th-century cornerstone"

### What was asked
Check whether "12th century" is Hijri and correct, find the signal, run a sensitivity analysis.

### What the repository shows
**The century is Hijri and it is correct.** Century numbering is Hijri everywhere in the canon code: `scripts/report/canon.py:132-149` (`anchor_century`: `0 if hy < 1 else (hy-1)//100 + 1`) and `site/src/lib/grand-tour.ts:25-29`. The 12th Hijri century is AH 1101-1200 = about 1689-1786 CE. Ahmed III's record: `data/person/ahmed-iii-uthmani.yaml` (`importance: 1` at line ~37, `review: published`), reign 1115-1143 AH / 1703-1730 CE in the summary and `story_roles`; the anchor field is `died: edtf 1736, derived: true` ("Date-enrichment pass; TDV Islam Ansiklopedisi"), which the converter turns into Hijri 1149 (`floor((1736-622)*33/32)+1`), century 12. Whole reign and death are inside 1689-1786. If a reader takes "12th century" as Gregorian (1101-1200 CE) it would be wrong, but the Tour, the canon register and the floor are all Hijri, and the Tour's text says "fourteen centuries" of the Hijri count (`i18n/en.yaml` grand_tour lede). The record's own date is a derived date with a note, so the anchor depends on a source marked "derived", but any plausible death date (1730 deposition, 1736 death) lands in century 12.

**How he became a cornerstone.** Not by fame. `docs/canon.md` (floor section): "The floor raised 1 record: `person/ahmed-iii-uthmani`." At baseline no cornerstone was dated to the 12th century. `century_floor()` (canon.py:155-165) raises, in each empty century 1-14, the importance-2 record anchored there with the highest `internal_weight = 0.8*log2(1+g) + 1.5*log2(1+paths)`: g = inbound ID mentions in data files plus inbound `[[links]]` in `content/ar`; paths = pathway appearances. Wikipedia counts play no part in the floor. Ahmed III: g = 52, paths = 0, weight 4.582, with 44 of his 46 written inbound edges of type `during_reign` (events placed in his reign). Runners-up in century 12: Mahmud I (g 48, weight 4.492; 45 `during_reign` edges), Mustafa III (47, 4.468; 44), Aurangzeb (24, 3.715; 5 edges), Mustafa II, Ahmad II, Nadir Shah, Shah Waliullah. The margin over second place is 0.09, i.e. 4 inbound mentions. The run said this itself in `PROPOSALS.md:11-17` (P-1: "50 inbound links, most of them `during_reign` edges"; undo = revert the floor commit; asks the founder to keep, drop or name the century's cornerstone by hand) and `VERIFICATION.md:210`. Century 12 has 10 canon records and 1 cornerstone at HEAD; Tour stop 37.

### Century by century (HEAD, from `q4-rows.json`; `canon.anchor_century` over all 918 canon records; top-1 = highest of the named signal among canon records of that century, ties alphabetical; the floor only acts on empty centuries, so this table shows what each signal would put first, not what is currently a cornerstone)
| century (AH) | canon records | cornerstones | top-1 current signal | (i) inbound edges excl. list/period/polity | (i-b) also excl. during_reign | (ii) sitelinks only | (iii) importance only (ties alphabetical) |
|---|---|---|---|---|---|---|---|
| 1 | 150 | 66 | muhammad | muhammad | muhammad | muhammad | dome-of-the-rock |
| 2 | 44 | 13 | baghdad | malik-ibn-anas | malik-ibn-anas | baghdad | abbasid-early |
| 3 | 44 | 14 | al-bukhari | al-bukhari | al-bukhari | al-khwarizmi | masjid-ibn-tulun |
| 4 | 28 | 6 | cairo | cairo | cairo | cairo | buyid-seljuk-fatimid-era |
| 5 | 38 | 8 | crusades-ayyubid-mamluk | qadi-abd-al-jabbar | qadi-abd-al-jabbar | ibn-sina | crusades-ayyubid-mamluk |
| 6 | 37 | 9 | salah-al-din-yusuf-ibn-ayyub | al-mustazhir-billah | almohad-caliphate | umar-khayyam | battle-of-hattin-583 |
| 7 | 49 | 10 | mongol-post-mongol | al-nasir-billah | ottoman-empire | ottoman-empire | ayn-jalut-658 |
| 8 | 29 | 6 | ibn-battuta-muhammad | ibn-taymiyya | ibn-taymiyya | ibn-battuta-muhammad | masjid-sultan-hasan |
| 9 | 19 | 6 | ibn-khaldun | conquest-constantinople-857 | conquest-constantinople-857 | ibn-khaldun | battle-ankara-804 |
| 10 | 33 | 11 | gunpowder-empires | sulayman-al-qanuni | humayun-tomb | sulayman-al-qanuni | humayun-tomb |
| 11 | 24 | 3 | al-qasim-ibn-muhammad | mehmed-iv-uthmani | al-qasim-ibn-muhammad | taj-mahal | taj-mahal |
| 12 | 10 | 1 | ahmed-iii-uthmani | ahmed-iii-uthmani | aurangzeb-mughal | aurangzeb-mughal | ahmed-iii-uthmani |
| 13 | 21 | 3 | colonial-era | mahmud-ii-uthmani | mahdist-war | napoleon-bonaparte | colonial-era |
| 14 | 22 | 7 | modern-era | abd-al-hamid-ii-uthmani | ibn-saud | malcolm-x | arab-revolt-1334 |

Century 0 (before the Hijra) holds 8 cornerstones of 26; century 15 holds 1 of 10; 334 canon records (99 cornerstones) have no own date. Counts of cornerstones per century: 1:66, 2:13, 3:14, 4:6, 5:8, 6:9, 7:10, 8:6, 9:6, 10:11, 11:3, 12:1, 13:3, 14:7.

Signals: **current** = canon.py's `internal_weight` (g + paths); **(i)** = written inbound graph edges, excluding `related_to` and edges whose source class is period, polity, exhibit, course, journey, dataset, listing, media, source, screen, question or award (not canon.py's `g`, which counts ID mentions, so it is a different count); **(i-b)** = (i) also excluding `during_reign` edges; **(ii)** = Wikidata sitelink count from the local 19 Oct 2026 slice (all sitelinks; 13,575 of 18,756 ids covered; records without an id count 0); **(iii)** = importance field only, so every record in the pool ties and the tie-break (the script's `k` string order) decides.

### Century 12 under each signal (all 10 canon records; the floor pool is the 9 importance-2 ones)
- Current signal: Ahmed III (4.58), Mahmud I (4.49), Mustafa III (4.47), Aurangzeb (3.72). Ahmed III rank 1.
- (i) edges excluding list/period/polity sources: Ahmed III 46, Mahmud I 46, Mustafa III 45, Mustafa II 18; rank 1 by tie-break at 46 each (Ahmed first alphabetically), the margin is zero.
- (i-b) also excluding `during_reign`: Aurangzeb 4, **Ahmed III 2**, Ahmad II 1, Mahmud I 1; Aurangzeb first, Ahmed III second. Floor pool winner: Aurangzeb.
- (ii) sitelinks only: Aurangzeb 96, Nadir Shah 79, **Ahmed III 72**, Mahmud I 69, Mustafa III 69; Ahmed III third. Floor pool winner: Aurangzeb.
- (iii) importance only: all nine importance-2 records tie; alphabetical first is `ahmad-ii-uthmani` (Ahmed III is already importance 1, so rank 1 only because the floor already raised him).
So the choice is robust to the exclusion of list/period/polity edges only through a tie, and it flips to Aurangzeb under any signal that does not count the `during_reign` edges (the 44 edges dominating Ahmed III's, Mahmud I's and Mustafa III's counts) or counts outside reach. The three Ottoman sultans are within 0.11 of each other on the current signal.
Other centuries, same table: the top-1 differs among the four signals other than (iii) in 12 of 14 centuries (only centuries 1 and 4 agree) (e.g. century 6: Salah al-Din vs al-Mustazhir vs Almohad caliphate vs Umar Khayyam), which shows how signal-dependent any single "cornerstone of the century" would be if the floor applied more widely; at present only century 12 is floor-raised, the other 13 centuries hold cornerstones chosen by the class quotas.

### Options with cost
- **Keep**: no cost; `PROPOSALS.md` P-1 already says "not a judgement that Ahmed III matters more".
- **Name the century's cornerstone by hand**: edit `importance:` on two records (lower Ahmed III to 2, raise the chosen one to 1, e.g. Aurangzeb or Shah Waliullah), but the next `canon.py` run re-applies the floor and would re-raise by weight unless the floor is made to respect a hand mark (script change) or the rule changes; stop 37 of the Tour must stay a cornerstone (`tour/grand-tour.yaml` rule, o02), so the Tour manifest changes too (one line) and the reading text for that stop (lead rewritten by the run) would need replacing for the new stop; regenerate `docs/canon.md`, CANARY.
- **Change the floor's signal** (e.g. exclude `during_reign` and related-only edges): one function in `canon.py`, register regeneration; Aurangzeb becomes the pick under (i-b) and (ii); Ahmed III reverts to importance 2 and the Tour needs a different 12th-century stop.
- **Drop the floor**: century 12 then has no cornerstone, o02's "every century 1-14" check fails.
- **Relabel only**: say "AH 12th century (1689-1786 CE)" in the stop's date line or wing blurb, no data change.

### Could not verify
- Ahmed III's actual death date (record says 1736, derived); the local sitelink slice is from 19 Oct and misses 5,181 ids.
- Which of the near-tied candidates "should" be the cornerstone (a judgment, not a repository fact).

---

## 5. Draft canon records: the reading queue

### What was asked
List every canon/cornerstone record with `status.review: draft`, with class, wings, prose words per language, inbound link counts, and site-wide linking records, as a reading queue ordered most-linked first. Never suggest promoting.

### What the repository shows
Canon records: 918 (271 cornerstones, 647 majors). **Draft: 615 canon records, of which 165 are cornerstones (importance 1) and 450 are importance 2.** Verified from both `scripts/report/canon.py` scan and `graph.json` (same set). `docs/canon.md` Draft column totals 615. Cornerstones draft by class: person 41, concept 26, place 23, event 14, period 13, building 12, work 10, polity 10, practice 9, group 4, object 3. Concepts: concept/jinn and concept/malaika are both draft cornerstones (and so are 24 other core concepts such as tawhid, sharia, fiqh, sabr, jannah, qibla, hijab, waqf, tawba, umma).

Columns in `draft-cornerstones.json` (615 rows, ordered most-linked first, then id): `importance`, `wings`, `words` (ar/en/ur, cites and link syntax stripped; `null` if no file), `written_inbound_edges` (distinct source records of written graph edges pointing to it, `related_to` excluded; inverses not double counted), `neighbours_any_direction`, `prose_linking_records_ar|en|ur|any` (distinct other records whose prose contains `[[this id]]`; the file counts per language and any), `linking_records_total` (union of edge sources and prose linkers: "how many records link to it site-wide"), `canon_g`/`canon_paths` (the canon script's own signals), `generated_by`, `model`, `completeness`.

Reading volume at 200 wpm: all 165 draft cornerstones: ar 249,269 words (20.8 h), en 336,947 (28.1 h), ur 379,032 (31.6 h). The 26 concept cornerstones: ar 49,232 (4.1 h), en 67,629 (5.6 h), ur 75,998 (6.3 h). All 615: ar 391,354 (32.6 h), en 534,708 (44.6 h), ur 597,188 (49.8 h). No draft cornerstone is without an Arabic file. Of the 165, 33 are linked from 100 or more records, 97 from 20 or more, 116 from 10 or more, 158 from at least one; 7 are linked from none. `concept/malaika` is 16th of the 165 (201 linking records); `concept/jinn` is 74th (35).

### The 26 draft cornerstone concepts, most-linked first
| record | class | wings | words ar/en/ur | written inbound edges | prose-linking records (any lang) | distinct linking records |
|---|---|---|---|---|---|---|
| concept/hadith-qudsi | concept | ideas | 712/997/1062 | 356 | 11 | 358 |
| concept/malaika | concept | ideas | 2926/4267/4692 | 194 | 10 | 201 |
| concept/asma-allah-al-husna | concept | ideas | 1829/2618/2934 | 106 | 5 | 106 |
| concept/tahara | concept | ideas | 697/1047/1086 | 69 | 60 | 71 |
| concept/jizya | concept | ideas | 2323/3065/3466 | 27 | 36 | 37 |
| concept/jinn | concept | ideas | 1595/2163/2481 | 32 | 6 | 35 |
| concept/tawba | concept | ideas | 2938/4168/4878 | 25 | 22 | 31 |
| concept/tawhid | concept | ideas | 1488/1810/2378 | 17 | 24 | 27 |
| concept/adab | concept | ideas | 1160/1604/1743 | 23 | 22 | 25 |
| concept/sabr | concept | ideas | 3342/4759/5419 | 21 | 22 | 25 |
| concept/tasawwuf | concept | ideas | 3204/4333/4662 | 16 | 11 | 21 |
| concept/zuhd | concept | ideas | 1504/2173/2343 | 19 | 15 | 21 |
| concept/akhira | concept | ideas | 583/877/833 | 14 | 17 | 19 |
| concept/fiqh | concept | ideas | 1833/2499/2781 | 10 | 4 | 14 |
| concept/hijab | concept | ideas | 3310/4578/5040 | 12 | 10 | 13 |
| concept/islamic-calligraphy | concept | objects | 1847/2246/2650 | 5 | 10 | 13 |
| concept/jannah | concept | ideas | 3847/5503/6212 | 9 | 11 | 12 |
| concept/taqwa | concept | ideas | 1792/2610/2917 | 9 | 12 | 12 |
| concept/qibla | concept | ideas | 1701/2213/2436 | 1 | 11 | 11 |
| concept/isnad | concept | ideas | 1510/2151/2351 | 4 | 8 | 10 |
| concept/waqf | concept | ideas,objects | 1825/2386/2771 | 6 | 6 | 10 |
| concept/al-hadith-al-nabawi | concept | ideas | 2324/2910/3380 | 0 | 9 | 9 |
| concept/imama | concept | ideas | 2059/2756/3190 | 3 | 2 | 5 |
| concept/masjid-umum | concept | ideas,objects | 144/178/183 | 2 | 0 | 2 |
| concept/umma | concept | ideas | 869/1157/1309 | 2 | 0 | 2 |
| concept/sharia | concept | ideas | 1870/2561/2801 | 1 | 0 | 1 |

### The top 50 draft cornerstones of every class, most-linked first
| record | class | wings | words ar/en/ur | written inbound edges | prose-linking records (any lang) | distinct linking records |
|---|---|---|---|---|---|---|
| work/muwatta-malik | work | words | 1275/1753/1911 | 36 | 2893 | 2893 |
| person/malik-ibn-anas | person | people | 3048/4213/4627 | 1642 | 1714 | 1719 |
| place/baghdad | place | place | 2626/3198/3711 | 982 | 104 | 1048 |
| place/medina | place | place | 2700/3474/3851 | 727 | 250 | 837 |
| place/mecca | place | place | 2683/3422/3755 | 655 | 238 | 726 |
| place/damascus | place | place | 2798/3569/4000 | 632 | 103 | 681 |
| place/istanbul | place | place | 1728/2120/2467 | 489 | 26 | 497 |
| place/basra | place | place | 1617/2089/2238 | 332 | 123 | 384 |
| practice/dua | practice | living | 2360/3377/3779 | 380 | 45 | 382 |
| place/misr | place | place | 2319/3099/3384 | 375 | 10 | 378 |
| concept/hadith-qudsi | concept | ideas | 712/997/1062 | 356 | 11 | 358 |
| person/abu-hurayra | person | people | 1120/1516/1689 | 290 | 352 | 354 |
| place/kufa | place | place | 1336/1807/1958 | 293 | 80 | 338 |
| work/sahih-muslim | work | words | 1122/1523/1667 | 12 | 246 | 251 |
| group/ansar | group | people | 1238/1724/1871 | 184 | 43 | 210 |
| concept/malaika | concept | ideas | 2926/4267/4692 | 194 | 10 | 201 |
| group/quraysh | group | people | 1409/1931/2088 | 147 | 71 | 195 |
| place/aleppo | place | place | 1739/2323/2516 | 177 | 27 | 189 |
| period/prophetic-era | period | time | 525/683/651 | 163 | 21 | 176 |
| work/quran | work | words | 2253/3038/3385 | 170 | 54 | 176 |
| place/nishapur | place | place | 1101/1529/1605 | 147 | 40 | 162 |
| person/heraclius | person | people | 1039/1407/1695 | 144 | 13 | 156 |
| place/mosul | place | place | 1781/2263/2569 | 138 | 26 | 151 |
| place/jerusalem | place | place | 2535/3290/3766 | 123 | 46 | 145 |
| practice/hajj | practice | living | 2219/3077/3214 | 124 | 138 | 145 |
| place/isfahan | place | place | 1475/1793/2103 | 117 | 24 | 131 |
| person/al-shafii | person | people | 2144/2866/3356 | 41 | 118 | 127 |
| place/al-andalus | place | place | 5365/6869/7550 | 116 | 25 | 122 |
| practice/zakat | practice | living | 2238/2909/3248 | 112 | 118 | 121 |
| place/tunis | place | place | 1621/2044/2364 | 107 | 14 | 115 |
| concept/asma-allah-al-husna | concept | ideas | 1829/2618/2934 | 106 | 5 | 106 |
| person/mehmed-iv-uthmani | person | people | 922/1213/1335 | 103 | 6 | 106 |
| practice/wudu | practice | living | 1038/1342/1466 | 90 | 94 | 100 |
| place/shiraz | place | place | 2175/2692/3032 | 87 | 10 | 93 |
| place/taif | place | place | 642/868/972 | 76 | 23 | 87 |
| place/samarqand | place | place | 2339/2949/3440 | 68 | 24 | 86 |
| work/sahih-al-bukhari | work | words | 1106/1543/1735 | 14 | 72 | 78 |
| person/al-ghazali-abu-hamid | person | people | 2708/3634/4212 | 13 | 69 | 75 |
| person/umm-salama | person | people | 901/1244/1475 | 49 | 62 | 74 |
| place/samarra | place | place | 1261/1644/1864 | 61 | 19 | 74 |
| practice/sawm-ramadan | practice | living | 1896/2817/3021 | 61 | 67 | 74 |
| person/al-hajjaj-ibn-yusuf | person | people | 1908/2602/3009 | 8 | 72 | 73 |
| place/tabriz | place | place | 1611/2077/2394 | 59 | 14 | 72 |
| concept/tahara | concept | ideas | 697/1047/1086 | 69 | 60 | 71 |
| person/saad-ibn-abi-waqqas | person | people | 2363/3434/3958 | 30 | 71 | 71 |
| person/abu-hanifa | person | people | 2284/3156/3514 | 19 | 67 | 69 |
| person/al-hasan-al-basri | person | people | 1738/2469/2877 | 23 | 64 | 66 |
| polity/abbasid-caliphate | polity | time | 1675/2202/2484 | 40 | 25 | 63 |
| event/hijra | event | time | 1858/2489/2688 | 46 | 27 | 62 |
| person/abd-al-rahman-ibn-awf | person | people | 1420/2101/2323 | 27 | 59 | 61 |

### The top 15 draft importance-2 records, for scale
| record | class | wings | words ar/en/ur | written inbound edges | prose-linking records (any lang) | distinct linking records |
|---|---|---|---|---|---|---|
| place/iraq | place | place | 87/130/131 | 281 | 16 | 293 |
| place/anatolia | place | place | 6020/7669/8532 | 266 | 4 | 266 |
| person/qadi-abd-al-jabbar | person | people | None/None/None | 195 | 3 | 198 |
| person/said-ibn-al-musayyab | person | people | 68/108/101 | 155 | 172 | 173 |
| place/yemen | place | place | 504/705/768 | 132 | 45 | 157 |
| place/iran | place | place | None/None/None | 155 | 0 | 155 |
| place/hijaz | place | place | 161/207/228 | 120 | 14 | 133 |
| place/cordoba | place | place | 261/347/362 | 103 | 56 | 127 |
| person/al-nasir-billah | person | people | 192/299/345 | 125 | 3 | 126 |
| place/maghreb | place | place | None/None/None | 125 | 1 | 126 |
| person/ibrahim | person | people | 2352/3400/3849 | 86 | 56 | 121 |
| place/merv | place | place | 79/65/77 | 104 | 8 | 108 |
| place/india | place | place | None/None/None | 104 | 0 | 104 |
| place/al-sham | place | place | 548/747/758 | 85 | 24 | 91 |
| event/return-of-abyssinian-emigrants | event | time | 955/1139/1212 | 85 | 7 | 90 |

The remaining rows are in `draft-cornerstones.json`.

### Options with cost
This item is an inventory; the queue above is the deliverable. Costs of the reading itself: the 26 concept cornerstones are 4.1 h in Arabic or 5.6 h in English at 200 wpm; the 33 most-linked draft cornerstones (100+ linking records) are the places a reader meets first. Cutting the queue by a threshold (for example cornerstones linked from 20 or more records: 97 records) is a filter on `linking_records_total` in the JSON. No status change is proposed.

### Could not verify
- Prose links are counted from `[[class/slug]]` syntax in `content/ar`, `content/en`, `content/ur` as files (a record linked in several languages counts once in `any`); links added by templates, relation cards or the site at build time are not prose links and appear only through graph edges.
- "Linked site-wide" does not include pathways/exhibit/tour-hall pages, which `canon_paths` partly captures.

---

## 6. The Signs door (S10)

**What was asked.** Any menu door the re-scoping of Signs would remove or rename is the founder's choice.

**What the run did.** No door was removed or renamed. The door "Signs of the Hour Browser" still opens `/signs/`, which now holds the 114 records about the signs; the full eschatology index it used to be is at `/signs/all/`, linked from all four hereafter landings.

**Options.** (a) Leave as is: no cost; recommended. (b) Give `/signs/all/` a door of its own ("Everything on the hereafter, by source"): one menu line in three languages and one more entry in a menu of fifty-three. (c) Retire `/signs/all/` once the three sister browsers hold everything it lists: 13 concept records carry no topic and appear only there today, so they would need a home first.

## 7. What kind of being a person-class record is (S6)

Jibril, Mika'il, Iblis, Harut, Marut and Bidukh are records of class `person` with no field that says angel, jinn or devil; angels otherwise exist as `concept` records of kind `angel` (16), jinn as kind `jinn` (1), and no record has kind `devil`. The Jinn & Devils Browser therefore lists these six under "Named figures in these accounts" beside prophets and Companions.

**Options.** (a) Leave them among the named figures: no cost; the heading says what the list is. (b) Add a `kind` to `person` (`human` by default; `angel`, `jinn`): a schema change, a validator rule, six records typed, each with a source. Harut and Marut need a ruling first: the verse calls them "the two angels", their own records say "the two beings", and the commentators differ. (c) Move the six to `concept` records of the right kind: six merges and their inbound links (Jibril alone has dozens).

## 8. The 3,790 dates no text can test (S8)

The date-enrichment pass of 9 November wrote dates onto 5,835 person records. Where a record's own text gives a year, the pass was wrong on 25.1% (497 of 1,984 death years) against 0.7% for the rest of the corpus. The 544 records it contradicts were cleaned. **3,790 records** carry a date from the same pass and no year in their own text; at the same error rate about 900 of them are wrong, and nothing in the repository says which.

**Options.** (a) Leave them: about 900 wrong dates stay on timelines and in the People hall; each is marked `derived: true` with the note "Date-enrichment pass; source: …". (b) Remove all 3,790: about 2,900 probably-right dates go too; the list to restore from is one search for that note. (c) Mark, do not remove: show these dates with a visible "unverified" mark wherever a date is printed; one renderer change and a string in three languages. (d) Verify them against their named sources: the pass names a source for each (Siyar A'lam al-Nubala, TDV İslâm Ansiklopedisi, and others), so a reader with the books can settle each one; 3,790 lookups.

## 9. What counts as a link (S12)

Published records within three links of a cornerstone: 38.3%. Two modelling choices would move it, sized by `scripts/audit/s12-what-if.py`: counting the `periods` field as a relation to the period record (43.3%, and four of the five isolated period cornerstones gain neighbours), and counting a citation as a relation to the source record (68.8%). The reachability oracle's own definition says a citation is not a relation.

**Options.** (a) Neither: the measure stays near 38% and the 60% target is unreachable, because 47% of published records are sources. (b) Restate the target over subject records only (74.3% today). (c) Make the era a relation: one predicate, tens of thousands of edges from an unsourced field that this run found wrong on at least one record (Abbas ibn Muhammad). (d) Make citations relations: changes what "connection" means on every page.

## 10. Which population a wing count means (S15)

The brief recommended one public wing count, "primary-wing published". The site has two populations and now names both: `wings` (records of the wing's own class, what the menu's "{n} people" counts) and `halls` (records tagged with the wing, what the hall lists). Neither is published-only: People is 11,583 by class, 12,012 by tag, and 5,777 persons are published.

**Options.** (a) Keep the two named populations: no cost. (b) Print published-only counts on the menu and homepage: People would read 5,777 where the hall lists 12,012; the hall's own headline would then need the same cut or a second sentence. (c) Print both everywhere a count appears ("12,012 entries, 5,777 of them read by an editor"): one string per surface in three languages.

## 11. The draft badge, and the passages that do not carry it (S13)

The audit of 5 November decided that pages show no review state; this brief asked for one honest presentation of drafts, and the run followed the later instruction: a badge and a sentence on every draft record except passages. A verse or a hadith page is a draft record too (12,851 passages), and the sentence "written with AI help" would be said of the source's own text, so it is not shown there; the commentary digests on verse pages are AI-written and carry no mark of their own.

**Options.** (a) As built. (b) A second sentence for passages ("the notes on this page were written with AI help and not yet read by an editor"): one string in three languages and a rule for where it appears. (c) Put the sentence inside the Tafsir section of the 1,715 verses that have a digest, and nowhere else on a passage.

## 12. Duplicates the run did not merge (S7, S17)

- 76 pairs of person records that are likely the same person but that the records alone cannot prove, and one pair the scan called provable that looks doubtful on reading (`person/ahmed-wafqi-efendi` and `person/ahmed-wefik-pasha`): `docs/audit/data/s7-candidates.json`.
- Six pairs of event records with the same title and year: `battle-of-bathys-ryax` / `battle-of-bathys-ryax-872`; `conquest-of-kirman` / `kirman-conquest`; `conquest-of-emesa-636` / `conquest-of-hims`; `death-of-qutayba-ibn-muslim` / `qutayba-death`; `ghazwat-banu-qaynuqa` / `siege-of-banu-qaynuqa`; `siege-of-acre-1831` / `siege-of-akka-1831`.

**Options.** (a) Leave them. (b) Merge on the founder's word, pair by pair, with `scripts/audit/merge-person.py` (persons) and by hand for events: each merge lowers the record count by one, which the submissions' claims register must follow.

## 13. Draft text now on published pages (S7)

Two merges carried draft-tier text onto a published record's page, word for word under its own heading, because the alternative was to delete it: the three Fihrist sections on `person/sulayman` (from `person/sulayman-ibn-dawud`) and one section on `person/ibn-tumart` (from `person/muhammad-ibn-tumart`). Both belong at the head of the founder's reading queue, or back out of the page if he prefers.
