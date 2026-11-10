# Job Browser: master plan

Status: **Phase 0, planning only.** No data, schema, site or i18n change is made under this plan until the founder answers section 9. Owner: the founder. Drafted 1 November 2026 by Claude Code (claude-fable-5-1) from the founder's operative prompt of the same day and a census of `origin/main` at `cc4ec8eeec`; amended the same day on the founder's instruction that the jobs include the crafts and trades (الحِرَف والصنائع) within them (section 3a).

Companion files in this folder:

| File | What it holds |
|---|---|
| [`taxonomy.yaml`](taxonomy.yaml) | The job list (184 jobs, 14 domains, 53 of them crafts), the roles merge map, the descriptor and review lists. The source of truth for Phase 1 and 2 data. |
| [`taxonomy.md`](taxonomy.md) | The same list as a table with holder counts and prose leads from the census. Generated, never hand-edited. |
| [`schema.md`](schema.md) | The `job` entity, the person `occupations:` block, the `jobs:` block on things, the validator rules, the derived edges. |
| [`site.md`](site.md) | The browser home, the job page, the career strip, discovery, API and the progressive-visibility rule, mapped to the files they touch. |
| [`research.md`](research.md) | How a job's history is researched before it is written, and which source entities already exist for it. |
| [`phases.md`](phases.md) | Phases 1 to 5 with sizes, gates, queue mechanics and what each phase report must say. |
| [`progress.md`](progress.md) | The running log. One dated entry per merged batch. |

Lane registration: `docs/agents/lanes.md` (lane `jobs`), `docs/status.md`. The companion design spec kept at Muse's side (`islam-museum-job-browser-feature-spec-2026-11-01.md`) is not in this repository; this plan is the operative document.

## 1. Mission, in two halves

**A. A rich entity for every job** of Islamic history and of Muslims, the crafts and trades among them (the weaver, the potter, the coppersmith and the water carrier beside the qadi and the vizier): `data/job/<slug>.yaml` plus a full trilingual article in `content/{ar,en,ur}/job/<slug>.md`, Arabic first, answering the seventeen questions of the founder's brief (origins, famous names, evolution, politics and economy, geography, lifespan, workplace, tools, output, names by era, organisation, training, secrets and traditions, gatherings, travel, references, image).

**B. A total sweep of the museum**: every person record gets an `occupations:` block, and objects, buildings, works, groups, events, places and journeys get a `jobs:` block, so that every job page lists everyone and everything connected to it and every person page shows a working life.

The browser ships with the first ten jobs and is labelled as growing. It is never held back for completeness.

## 2. Phase 0: what was measured

Measured on 1 November 2026 against the data files. The census method: parse every `data/person/*.yaml`, count each `roles:` string; then map every string through [`taxonomy.yaml`](taxonomy.yaml) and count holders per job; then, for persons not already holders of a job, look for the job's Arabic stems in `summary.ar` and `content/ar/person/<slug>.md`. The script is kept out of the repository until Phase 1 adds it as `scripts/report/jobs-census.ts`; the three tables it produced are in [`taxonomy.md`](taxonomy.md).

### 2.1 The roles census

| Measure | Count |
|---|---:|
| Person records | 10,725 |
| With a `roles:` list | 8,357 |
| Without one | 2,368 |
| Distinct role strings | 227 |
| Of which in `schema/enums/roles.yaml` (38 values) | 38 |
| Outside the vocabulary | 189 |
| `ruler` (outside the vocabulary) | 824 |
| `scholar` | 3,063 |
| `writer` | 1,272 |

The vocabulary is not enforced: the person schema accepts any string (`scripts/gen-schema.ts`, `roles: strs`), and no script reads `schema/enums/roles.yaml`. The i18n `roles:` block has 68 labels, 19 of them for the 38 enum values; the 19 enum values without a label include qadi, mufti, sultan, emir, calligrapher and teacher. Synonym clusters confirmed: `qadi` 77 and `judge` 47; `jurist` 761, `faqih` 38, `usuli` 2, `mujtahid` 1; `general` 117, `commander` 47, `military-commander` 40, `military-leader` 39, `military leader` 1, and the bare `military` 209; `muhaddith` 221, `hadith-scholar` 10, `hadith scholar` 8, `transmitter` 14, `narrator` 1; `grand-vizier` 14 and `grand vizier` 2; `reciter` 40, `quran-reciter` 3, `qari` 2, `muqri` 8, `hafiz` 1. One Arabic string (`الخليفة العباسي`) and fifteen sport strings with spaces (`basketball player`, `squash player`) drifted in from the modern-figures and Wikidata lanes.

### 2.2 The merge map, applied

| Outcome | Persons |
|---|---:|
| At least one role mapped to a job (bootstrap holders) | 7,555 |
| Only descriptor roles (companion, prophet, martyr, royal family): nothing to bootstrap | 587 |
| Only review roles (scientist, artist, scribe, military, official, craftsman, mystic, sufi, ascetic, academic, leader): the sweep decides | 215 |
| No roles at all | 2,368 |
| Of the role-less, with at least one Arabic prose lead | 1,410 |

Every one of the 227 strings is covered: 191 map to a job, 25 are descriptors, 11 are review. No string maps to two jobs (the census asserts it).

### 2.3 The first ten

| Job | Holders from roles | Prose leads | Reading |
|---|---:|---:|---|
| qadi | 124 | 674 | deep; the leads are mostly biographical-dictionary records that mention a judgeship |
| vizier | 135 | 268 | deep, Seljuk to Ottoman |
| muhaddith | 252 | 851 | the deepest; the rijal and Shadharat lanes feed it |
| physician | 99 | 660 | deep; 53 holders have no period yet |
| astronomer | 35 | 92 | adequate |
| calligrapher | 109 | 13 | deep in the Ottoman centuries, thin before |
| merchant | 52 | 107 | adequate; Prophetic-era Meccan merchants lead |
| architect | 11 | 23 | **thin**: eleven holders, six of them Ottoman |
| copyist (warraq / nasikh) | 0 | 74 | **no holder from roles**; the 74 leads (بخطه, الوراق, الناسخ) must be read and tagged before the page has a holder. **Swapped out by the founder, 1 November 2026**; it opens Phase 2's first Arts & Letters wave |
| faqih (jurist) | 800 | 216 | **swapped in by the founder, 1 November 2026**: the deepest holder base after muhaddith, the tabaqat literature, and it carries the Twelver ranks (marja, mujtahid) under the record's own tradition label |
| teacher (mudarris) | 332 | 638 | deep, but 215 holders have no period, so the timeline band will be sparse until Phase 3 dates them |

The brief invites a swap if the census argues for one. It argued against two: copyist had no holder and architect has eleven. **Founder's decision, 1 November 2026: faqih replaces copyist.** The Phase 1 ten are qadi, vizier, muhaddith, physician, astronomer, calligrapher, merchant, architect, faqih and teacher: 1,965 bootstrap holders and about 3,556 prose leads. Architect stays, with its 23 leads read first. Copyist is the first job of Phase 2's Arts & Letters wave.

### 2.4 What else exists for the sweep

| Class | Records | What the census found |
|---|---:|---|
| group | 373 | kinds: tribe 127, family 50, clan 49, people 44, sect 38, order 25; **guild 1** (`group/akhi-associations`), professional-association 0, council 2, certifier 1. The guild layer is nearly empty; Phase 2 writes the bodies as it writes the jobs. |
| object | 517 | kinds: folio 88, ceramic 74, manuscript 52, metalwork 45, tile 33, textile 29; astrolabe 4, instrument 6, coin 1. Tools of the trades are thin; the tools section of each job will link what exists and record the rest as leads. |
| building | 5,664 | mosque 2,359, tomb 2,311, madrasa 339, palace 337, fort 104, bazaar 15, khan 8, bimaristan 7, library 4, hammam 3, observatory 1. Workplaces exist in bulk; staffing them is Phase 4. |
| work | 1,588 | `work/maalim-al-qurba-fi-ahkam-al-hisba`, `work/al-muqaddima`, `work/al-fihrist`, eleven `tabaqat-*` works already exist. |
| crafts layer | 1 practice, 1 guild | `practice/attar-druggist` is the museum's only `practice` of kind `craft` (of 67 practices); `group/akhi-associations` its only guild; `schema/enums/materials.yaml` (paper, parchment, ink, gold, silver, brass, bronze, copper, glass, ceramic, stone, marble, brick, wood, ivory, textile, wool, silk, cotton, leather) and the `made` / `made_in` predicates already describe what objects are made of and by whom; the Made wing (`docs/plan/11-made-directory.md`) lists crafts as a listing category but holds no craft listing yet. The crafts shelf of section 3a is built on these. |
| person relations | 2,818 records with relations | `student_of` 267, `teacher_of` 17, `member_of` 689, `ruler_of` 133, `patron_of` 12, `authored` 154. The teacher–student signal is present but thin: under 3% of persons carry it. |
| periods | 7,662 records with a period | 3,063 persons have none, which is why the first-ten timeline bands show a "none" column. |
| prose | 7,619 Arabic, 7,597 English, 7,597 Urdu | about 3,100 persons have no prose to sweep; their occupations come from `summary.ar` and the sources alone. |

Sources already defined that the research method (Part D) names: `source/encyclopaedia-of-islam-2` (EI2, PDF-page anchors), 18 `source/tdv-*` DİA articles, 21 `source/iranica-*`, `source/muqaddima-ibn-khaldun`, `source/tarikh-ibn-khaldun-ibar`, 4,183 `wikipedia-*` and 1,579 `wikidata-*` per-record sources. No source entity exists yet for al-Shayzari's *Nihayat al-Rutba*, Ibn al-Ukhuwwa's *Ma'alim al-Qurba* (the work exists, the source does not), Ibn Taymiyya's *al-Hisba*, the Ikhwan al-Safa epistles, the *Fihrist* as a source, or any museum collection catalogue; Phase 1 creates them as it cites them.

### 2.5 Corrections to the brief

1. The brief says about 8,400 records carry roles and about 2,300 do not: measured 8,357 and 2,368. It says `ruler` appears 818 times: measured 824. It says 100+ strings: measured 227.
2. The person schema does not check `roles:` against the enum at all, so "normalise through a merge map" is also the first time the vocabulary is enforced. The validator agreement check (schema.md section 5) is where that enforcement lands.
3. The brief's `from`/`to` on an occupation entry is written here as `start`/`end` date blocks, the shape every other dated block in the schema uses (`faith`, `story_roles`, `relations`), so the date rules of `docs/site/README.md` apply unchanged.
4. Adding a class is listed in `docs/ai-change-gates.md` section 3 as **`submission-impacting`** ("changing a class list"), and so is a change to the data-extraction routes (`/api/v1/`). Phase 1 therefore needs the founder's sign-off under that label, and its first commit updates the claims register and the evidence map in the same commit, as the gate requires.
5. Thirteen domains have no home for the farmer, the herder, the gardener, the qanat-digger, the fisherman, the falconer or the camel driver. A fourteenth domain, **Land & Water**, is proposed (decision 1).
6. Three of the brief's role strings are not jobs but standings (`companion`, `prophet`, `martyr`); the plan keeps them as descriptors (decision 3) instead of turning them into occupations.
7. The brief's visibility rule (a job page goes live with ≥1 tagged holder) conflicts with its Phase 2 rule (jobs with few holders still get full prose: an encyclopaedia, not an index). Decision 5 asks which wins; the plan recommends the entity alone.

## 3. The taxonomy, in one view

184 jobs across 14 domains, 53 of them crafts (section 3a), each with a `kind` (office, craft, scholarly, religious, commercial, military, medical, artistic, service, administrative, modern-profession). Full table: [`taxonomy.md`](taxonomy.md).

| Domain | Jobs | Of them crafts | Holders from roles |
|---|---:|---:|---:|
| Governance & Law | 23 | 0 | 2,856 |
| Court & Administration | 10 | 0 | 183 |
| Scholarship & Teaching | 15 | 0 | 4,079 |
| Faith & Preaching | 10 | 0 | 265 |
| Medicine & Care | 10 | 1 | 102 |
| Sciences & Numbers | 11 | 1 | 131 |
| Arts & Letters | 14 | 8 | 2,066 |
| Crafts, Building & Making | 39 | 38 | 11 |
| Trade, Travel & the Sea | 16 | 5 | 75 |
| War & Command | 7 | 0 | 260 |
| Media & Performance | 12 | 0 | 340 |
| Sport | 6 | 0 | 238 |
| Patronage & Public Life | 4 | 0 | 210 |
| Land & Water (proposed) | 7 | 0 | 1 |

Hierarchy: a job may name a `broader` job (caliph, sultan, emir, king, khan and shah under ruler; qadi al-qudat and kazasker under qadi; surgeon and oculist under physician; grand vizier under vizier; stonecutter, plasterer and mosaicist under builder; cobbler and saddler under tanner; embroiderer and felt-maker under weaver). The browser shows the family; counts never double.

The census-missed classical professions the brief names are all in: copyist, muhtasib, muezzin, imam (with the mosque as `place`), astrologer, translator, ship captain, caravan leader, money-changer, librarian, waqf administrator. Added from the hisba and craft literature: sahib al-shurta, hajib, treasurer, amil, sahib al-barid, notary witness, hakam, qass, sadin, muwaqqit, kahhal, hajjam, midwife, baytar, rawi, illuminator, bookbinder, papermaker, instrument maker, the market crafts (baker, butcher, cook, weaver, dyer, tanner, potter, glassmaker, goldsmith, coppersmith, blacksmith, carpenter, builder, armourer), attar, dallal, nakhkhas, mutawwif, pearl diver, porter, ghazi, mamluk, janissary, hakawati, jester, wrestler, archer, horseman, waqif. The taxonomy is append-only after approval; Phase 2 adds what the sources surface, each addition recorded in `progress.md`.

### 3a. The crafts and trades (الحِرَف والصنائع) within the jobs

Founder's instruction, 1 November 2026: the jobs include the crafts. The plan makes the craft a first-class layer of the browser rather than a separate list:

- **A cross-cutting flag.** Every hand craft or trade carries `hirfa: true` in the taxonomy and on its entity, whatever its domain: the calligrapher, copyist, illuminator, painter, engraver, inkmaker, bookbinder and papermaker in Arts & Letters; the 38 making crafts; the perfumer, grocer, cloth merchant, shipwright and pearl diver in Trade; the cupper in Medicine; the cartographer in Sciences. 53 jobs today. The browser home gets a crafts shelf (`/[lang]/jobs/#crafts`), and every craft page says it is one.
- **The making domain is renamed** Crafts, Building & Making (الحِرَف والصنائع والبناء) and grows from 17 to 39 jobs: the hisba manuals' market crafts (baker, miller, confectioner, butcher, cook, oil presser, grocer, cloth merchant, perfumer), the textile chain (weaver, embroiderer and tiraz worker, felt-maker, dyer, tailor, launderer), leather (tanner, cobbler, saddler), metal (blacksmith, coppersmith, goldsmith, armourer, bowyer, mint worker), building (builder, stonecutter, stucco worker, mosaicist, zellij maker, carpenter), fire crafts (potter and tilemaker, glassmaker), fibre (rope-maker, mat and basket maker), household (soap-maker, candle-maker), service trades (barber, bath keeper, water carrier) and instrument making (astrolabes; musical instruments).
- **A craft block on the job entity** (`schema.md` section 1a): materials from `schema/enums/materials.yaml`, techniques, the guild (ta'ifa / sinf / esnaf) and its shaykh, the apprenticeship grades (mubtadi', sani', mu'allim; shagird, kalfa, usta), the shadd initiation and the futuwwa oath, the craft's pir or patron figure as the guild named him, makers' marks and workshop signatures, the living status with the UNESCO intangible-heritage file where one exists, and a link to the craft as a cultural practice (`practice/` of kind `craft`, written when missing) and to the Made wing's listings for the living trade.
- **Census.** The crafts have 113 holders from roles (109 of them calligraphers) and 959 prose leads across 885 persons: engraver 75, carpenter 68, mat-maker 63, builder 56, coppersmith 46, painter 45, saddler 38, blacksmith 32, stonecutter 31, tailor 30. Many of these leads are nisbas (الحدّاد, النجّار, الصائغ) that became family names, which is why they are leads and not holders; the sweep reads each record. The crafts shelf is therefore built from the sources and the things (517 objects with a `kind` and a material; the `made` edges) more than from the roles.
- **Sources** (`research.md` section 2a): Ibn Khaldun's chapters on the crafts, the two hisba manuals, Ibn al-Mi'mar's *Kitab al-Futuwwa*, Evliya Çelebi's procession of the Istanbul guilds, Elias Qudsi's 1885 notice on the Damascus guilds, the EI2 articles *Ṣinf*, *Futuwwa* and *Ḥisba*, Baer, Raymond and Faroqhi on the guilds, the UNESCO files, and the collection catalogues for the tools and the output.
- **Sweep.** Phase 2 writes the crafts in two dedicated waves with their guild bodies; Phase 4 tags the objects to their crafts through `made-by` and `used-by` ties, using the object's `kind` and material to open the lead and the object's sources to settle it.

## 4. The merge map, headlines

The full map is the `roles:` field of each job in [`taxonomy.yaml`](taxonomy.yaml). Headlines:

- **Offices**: `ruler` (824) maps to the umbrella `job/ruler`, to be refined per holder to caliph, sultan, emir, king, khan or shah in Phase 3 from the record's `ruler_of` polity and its sources, never from the polity alone. `caliph` and `الخليفة العباسي` to `job/caliph`; `emir` and `amir` to `job/emir`; `king` and `queen` to `job/king`; `governor` to `job/wali`; `grand-vizier` and `grand vizier` to `job/grand-vizier`.
- **Law**: `qadi` and `judge` to `job/qadi`; `kazasker` to `job/kazasker`; `jurist`, `faqih`, `usuli`, `mujtahid`, `marja`, `faraid scholar` to `job/faqih` (the Twelver ranks keep the record's own tradition label; the job is the same craft).
- **Scholarship**: `scholar` (3,063) to the generic `job/alim`, the one mapping the plan flags as coarse (decision 3); `muhaddith`, `hadith-scholar`, `hadith scholar`, `transmitter`, `narrator` to `job/muhaddith`; `theologian` and `mutakallim` to `job/mutakallim`; `grammarian`, `linguist`, `philologist` to `job/grammarian`; `teacher` and `educator` to `job/teacher`; `professor`, `researcher` to `job/professor`.
- **War**: `general`, `commander`, `military-commander`, `military-leader`, `military leader` to `job/commander`; `admiral`, `naval-commander` to `job/admiral`; `warrior` to `job/soldier`; the bare `military` (209) is review.
- **Faith**: `reciter`, `quran-reciter`, `qari`, `muqri`, `hafiz` to `job/qari`; `preacher`, `religious-leader`, `religious leader` to `job/preacher`; `dai`, `Nizari da'i`, `missionary`, `agent` to `job/dai`; `sufi master` to `job/sufi-shaykh`, while `mystic` (161), `sufi` (85) and `ascetic` (11) are review: they name a path, not an office, and become `job/sufi-shaykh` only where `member_of` an order, a khanqah or a student chain is read.
- **Letters**: `writer`, `author`, `novelist`, `playwright`, `dramatist` to `job/writer`; `poet`, `poet-scholar` to `job/poet`; `adib`, `man of letters`, `literary-critic` to `job/adib`; `katib`, `secretary` to `job/katib` (the chancery; the copyist is a different job); `scribe` (7) is review because it hides both.
- **Modern**: `politician`, `statesman`, `political leader`, `minister` to `job/politician`; the twenty sport strings to `job/athlete`, with `wrestler` and `archer` as their own historical jobs; `film-director`, `director`, `filmmaker` to `job/film-director`; `journalist`, `editor` to `job/journalist`; `presenter`, `streamer` to `job/presenter`.
- **Descriptors, never occupations**: prophet, companion, successor, ancestor, tribal-ancestor, martyr, notable, figure, prophetic-family, family-of-the-prophet, companion-family, prophet-household, royal, royal-consort, princess, prince, umayyad-prince, noble, royalty, other, host, founder, reformer, rebel, convert, saint.

The bootstrap rule (decision 4): a mapped role becomes one `occupations:` entry with `kind: primary` when it is the record's only mapped role and `secondary` otherwise, `status: historical`, `sources:` copied from the record's own `sources:` (the role was written from them), and `note: "bootstrap from roles, 1 Nov 2026 merge map; dates, places and kind to be read in the Phase 3 sweep"`. Nothing else is inferred: no dates, no place, no `under`, no training. A record whose `sources:` list is empty gets no bootstrap entry and is logged.

## 5. The schema, in one view

Detail and the validator rules: [`schema.md`](schema.md).

- New class `job` (21 classes become 22): `CLASSES` in `scripts/lib.ts`, `scripts/gen-schema.ts` and `site/src/pages/api/v1/meta/index.json.ts`; `kinds.yaml` gains `job:`; a new enum `schema/enums/job-domains.yaml`; the generated `schema/job.schema.json`.
- Job entity fields: `label`, `names`, `summary`, `domain`, `kind`, `hirfa`, `broader`, `craft` (section 3a), `era` (`origins`, `first_attested` as a date block, `status_today`, `successor_jobs`), `places` (dated peak places), `regions`, `organization` (`organized`, `bodies`), `training` (`mode`, `certification`, `duration`), `tools`, `workplaces`, `outputs`, `media`, `sources`, `provenance`, `status`.
- Person `occupations:` entries: `job`, `kind`, `start`, `end`, `place`, `polity`, `under`, `trained_under`, `certification`, `family_business`, `status`, `note`, `sources` (required).
- `jobs:` entries on object, building, work, group, event, place and journey: `job`, `relation` (made-by, used-by, built-by, staffed-by, reference-for, body-of, gathering-of, produced-by, workplace-of, route-of), `status`, `note`, `sources` (required).
- Derived edges, written by `scripts/build-graph.ts` and never by hand: `practised` (person to job, inverse `practised_by`) and `tied_to` (thing to job, inverse `things_of`), registered in `schema/predicates.yaml` with `derived: true` so the graph page can label them.
- Validator: every `job` resolves; every entry cites a known source; `place`, `polity`, `under`, `trained_under` resolve and are class-checked; `kind`, `status`, `relation` are enumerated; a record with `occupations:` may keep only descriptor values in `roles:` (the agreement check); `successor_jobs` and `broader` resolve to jobs; a job's `bodies` are groups; a job entity needs a holder or a `status.review` of `published` to be built (decision 5).
- `roles:` becomes, after a record's sweep, a hand-maintained list of descriptors only; the page merges them with chips derived from `occupations:`. The enum file is split accordingly (`roles.yaml` keeps the descriptors; the job values move to the taxonomy).

## 6. The site, in one view

Detail and the files it touches: [`site.md`](site.md). Everything static, Arabic first, three editions, no runtime AI, readable without JavaScript.

- `/[lang]/jobs/`: domains, a crafts shelf, A to Z, a filter box that narrows the list client-side (the trails index pattern), per-job holder counts, the "in the making" badge and status panel in the trails index's exact markup and tokens, a "newest" strip ordered by git date.
- `/[lang]/job/<slug>/`: the standard entity page (`[class]/[slug].astro` builds it with no allowlist) with job sections: prose; image; the holders rail grouped by period with filters (period, region, kind, held more than once); a timeline band of holders (a static SVG in the `TimeStrip` manner); the things, workplaces, bodies and references of the job; related jobs with predecessor and successor first.
- Person pages: a `CareerStrip` component above the Connections section, overlapping bars per occupation (job, place, years, kind), falling back to today's roles line when a record has no `occupations:`.
- Discovery: `jobs` in the Explore row and the Explore menu (`nav.ts`, `Landing.astro`, `BaseLayout.astro`), `class.job` and `explore.pages.jobs` i18n keys in all three files in the same commit; the Timeline Explorer filter and the shared-job graph view are Phase 5.
- API and AI surface: `/api/v1/job/index.json` and `/api/v1/job/<slug>.json` come free from the `CLASSES` loop; a one-off `/api/v1/jobs.json` dump adds holder ids per job; `llms.txt` gains a line on jobs and the holder question.
- Per-job counts live in the job's own page and in the one index page, never in a shared layout (`docs/site/README.md` rule 4). New routes get weight budgets in `scripts/check-weight.ts`.

## 7. Research method

[`research.md`](research.md) restates the brief's six steps against what the museum already holds, names the source entities to create in Phase 1, and sets the provenance string every job records. One source is enough for any fact; Wikidata P106 is a lead, never the support for a published claim; the founder's classification discipline (attestation of the person himself; family, office of a relative, structured-data fields never settle a claim) applies to jobs exactly as the modern-figures rulings apply it to faith.

## 8. Phases

[`phases.md`](phases.md) has the sizes and gates. In one line each:

| # | Phase | Scope | Size (derivation) | Gate |
|---|---|---|---|---|
| 0 | Plan and taxonomy | This folder | done in this PR | founder's go (section 9) |
| 1 | The first ten, end to end | 10 job entities and articles, their sources, bootstrap and targeted holders, `/jobs/`, `/job/`, career strip, API | about 10 jobs × 3 languages × 17 sections; 1,965 bootstrap holders; about 3,556 leads to read for the ten; the site change | `submission-impacting` sign-off; validate "0 errors"; cite-check "0 fail"; build; live check after the founder deploys |
| 2 | All job entities | 174 remaining jobs in domain waves of about 10, the crafts in two waves with their guild bodies | 18 waves at the Phase 1 pace per job | validate and cite-check per wave |
| 3 | The person sweep | `occupations:` on 10,725 persons: a mechanical bootstrap (7,555 records) in chunks, then the prose sweep in waves of 25, office jobs first | 429 batches at 25; the bootstrap is 16 chunks of about 500 files | validate, cite-check, and the agreement check per batch |
| 4 | Things, buildings, works, groups, events | `jobs:` on attested records; kind-level links (a mosque's imam) are display-only, never written as attestation | sized by the Phase 1 pilot on the ten jobs' things | same gates |
| 5 | Discovery layer | Modern crosswalk as a labelled analogy page; job trails; Explorer filter; shared-job graph view | one site change and about 6 trails | same gates plus build |

Each phase report says what merged, what the validate and cite-check lines were, and that **merged is not live**: the founder deploys, and a page is called live only after a live check of its URL.

## 9. Founder decision points

**Founder's answer, 1 November 2026 (chat):** faqih replaces copyist in the first ten (decision 2). **Only that is decided.** The other ten decisions are open: the plan's recommended defaults are proposed, not adopted. Phase 1 does not start until the founder confirms them, and in particular the `submission-impacting` sign-off for the class and API change (decision 7), which no agent may assume.

1. **Approve the taxonomy and domains** (blocks everything): 184 jobs, 14 domains including the proposed Land & Water and the renamed Crafts, Building & Making, the `broader` hierarchy, the descriptor list and the review list.
2. **The first ten**: **decided 1 November 2026: faqih replaces copyist; copyist moves to Phase 2.**
3. **`scholar` and `roles:`**: accept `scholar` (3,063) mapping to the generic `job/alim` with Phase 3 refinement, and accept that `roles:` survives only for descriptors, with the enum split.
4. **The bootstrap rule**: one occupation per mapped role, the record's own sources, `status: historical`, the bootstrap note, applied by script in chunks of about 500 files per pull request rather than 25 (a mechanical normalisation re-run on fresh `main`, as the merge gate describes for generated changes).
5. **Visibility threshold**: a job page is built when its entity is published (recommended: the encyclopaedia reading of Phase 2), or only when it also has at least one tagged holder (the brief's Part C wording).
6. **Schema naming**: `start`/`end` instead of `from`/`to`; derived predicates `practised`/`practised_by` and `tied_to`/`things_of`; `job` records carry `wings: [people]` and are not counted in any wing total.
7. **Submission-impacting sign-off** for Phase 1's class and API change, with the claims register and evidence map updated in the same commit (`docs/ai-change-gates.md` section 3).
8. **Images**: reuse existing `media` entities first; a new illustration enters only through the illustrations lane's automated gates and whitelist (`docs/agents/lanes/illustrations.md`), never a portrait, never a prophet or Companion; confirm that no job page waits for an image.
9. **Lane registration**: one lane `jobs` (branch `jobs/<phase>-<agent>`, stubs `data/_stubs.d/jobs.yaml`, progress `docs/jobs/progress.md`), added to `docs/agents/lanes.md` and `docs/status.md` in this PR as planning-only rows.
10. **The crafts layer** (section 3a): the `hirfa` flag and crafts shelf, the craft block with the materials enum, the grades, the shadd and the pir; a `practice/` record of kind `craft` written for every living craft that lacks one; the Made wing link for the living trade.
11. **Phase 3 parallelism**: the person sweep rides the modern-figures wave machinery (two writers, 5+5, coordinator merge). Confirm the writers may touch `data/person/` records that other live lanes (ei2, prose-backfill-2, wikidata-import) also edit, with the append-only rule: a sweep batch adds `occupations:` and touches nothing else in the file.

## 10. Risks

| Risk | Likelihood | Mitigation |
|---|---|---|
| Bootstrap turns a loose role into a published occupation | medium | the bootstrap note names the method; `kind` is never `primary` on a multi-role record; the sweep rewrites every entry it reads |
| Two lanes editing the same person file | high | sweep batches add one block and nothing else; rebase before every push; conflicts combine both sides |
| A job page with zero holders looks empty | certain on day one for copyist | the holders rail says so in words; the article carries the page |
| The index page changes on every holder commit | certain | one page; acceptable under the site's byte-stability rule, which forbids site-wide numbers only in shared layouts |
| Arabic stems match surnames (الحداد, الصائغ, الوراق) | certain | leads are never holders; the sweep reads the record |
| The class change alters a filed submission claim | certain | label it `submission-impacting`; update the two outreach files in the same commit; founder signs |
| Weight budgets fail on the job page with hundreds of holders | medium | holders rail paginates by period at build; budgets set in Phase 1 from the muhaddith page |
| Urdu labels drafted by the writer, not a native reviewer | certain | the same practice the Timeline Explorer records as an open item; flagged in the phase report |

## 11. Done means

Phase 0 is done when this pull request is merged, `progress.md` has its first entry, `docs/agents/lanes.md` and `docs/status.md` list the lane as planning-only, and the founder has answered section 9. No data, schema, site or i18n change happens before that answer.
