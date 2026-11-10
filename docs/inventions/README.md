# Muslim Inventions Browser (متصفح اختراعات المسلمين)

**Current content checkpoint,7 November2026:** invention97's PR#5060 is verified merged. Invention98 adds Karaji's bounded coefficient recurrence and al-Samawal's transmitted witness, not another general polynomial-arithmetic record or a first-triangle claim. The generated census now has98 records,294 invention-language articles and563 unchanged candidate identities (524active/39excluded); individual entries below remain dated historical checkpoints. Local tests/build remain not run under the founder's instruction; merged content requires the founder's manual deployment, and this batch changes no Worker/workflow/site code.

**Status: Phase 2 — discovery and queue screening (5 November 2026).** Phase 1 merged in PR #3757 as `0a1470ccb2`; Phase 2 is on `inventions/p2-copilot`. The refreshed census finds 263 scientist/person leads and 213 prose-hit files across 182 entities; the queue has 506 entries in five chronological batches, with 467 active and 39 cited exclusions. Sixteen scholarly reference entries have been read across three discovery passes, with separate preliminary screens of early institutions, architecture and engineering claims. The bimaristan screen distinguishes leads about Rufayda's medical tent, al-Walid's Damascus institution and Harun al-Rashid's Baghdad hospital; TDV calls Rufayda's tent the first Islamic bimaristan, but the citation chain and the distinction from later permanent-hospital claims remain unresolved. A bounded engineering screen added Ibn Khalaf al-Muradi's intermittent gearing as an unverified lead, while leaving its attribution and Sunni-inclusion eligibility unresolved; the saqiya and Sistan windmill claims also remain open. The Fakhri sextant screen now includes a visually checked 1908 scan of al-Khujandi's treatise and al-Biruni's account; the candidate remains a lead because al-Khujandi's Sunni basis and the instrument's exact scale claim are unresolved. The al-Farghani astronomy, qibla and chess screens leave originality and maker attribution unresolved; two concept screens excluded twelve non-invention signals, generic Ibn Taymiyya, Kamal Khujandi and Ulubatlı Hasan census signals and the Alpujarras Rebellion event hit were closed as unrelated, and the general chess-transmission candidate was closed for lack of a discrete Muslim act, while khalwa and Nasta'liq remain cultural leads. An inherited-practice screen excluded generic kohl, miswak and turban leads with registered source records. The post-CANARY build passed: 163,370 pages checked with 0 errors and 2 empty-list warnings, 0 over-budget routes across 41 routes, and 897 books with none skipped; it began before the inherited-practice and bimaristan source records were registered. FTS rows 1-40 (front matter, introduction and Home chapter) of the *1001 Inventions* EPUB have been read as leads; their keys are not printed-page citations, and section anchors have been corrected against the printed contents page. The low-accuracy row 41 remains a lead requiring a better readable witness. No invention records or browser pages exist yet, and nothing is live until the founder deploys.

The source of truth is the museum graph: records live in `data/invention/<slug>.yaml`, prose in `content/{ar,en,ur}/invention/<slug>.md`, and source files stay outside Git. The plan follows the Job Browser's companion-document shape in [`../jobs/README.md`](../jobs/README.md), but uses the invention-specific inclusion and attribution rules in [`taxonomy.yaml`](./taxonomy.yaml).

## 1. Mission and boundaries

The browser follows a sourced chain from a maker's work to its predecessors, later uses and living descendants. It distinguishes an original invention from an improvement, transmission, discovery, contested attribution or popular legend. It does not rank civilizations or claim that a modern device was "invented" by a person merely because they worked in a Muslim-majority place.

Inclusion is limited to work made, first described or decisively improved by a Muslim whose Sunni identity has a cited basis. Where sources attest no contrary tradition for a Muslim of a Sunni milieu, apply and explicitly record the museum's default frame. A disputed tradition requires a sourced, Sunni-first perspectives block; an attested non-Sunni or non-Muslim maker is not included as a maker. Their documented work remains in the history as a precursor, transmitter, translator or other sourced role. See [`taxonomy.yaml`](./taxonomy.yaml) and [`decisions.md`](./decisions.md).

An item without an identity basis stays a queue lead; a product without a cited technical novelty is not an invention. Every popular claim must be checked against the reference literature, primary texts, museum catalogues or patents. AI-assisted prose is published under the repository publication standard once it has defined sources and provenance; no human review gate is added.

## 2. Census on the fetched base

Measured on the fetched `origin/main` snapshot `0a1470ccb2`, after Phase 1 merged and before Phase 2 queue changes. The repeatable implementation is [`scripts/report/inventions-census.ts`](../../scripts/report/inventions-census.ts), run as `npm run inventions:census`. It scans the museum's current records and English/Arabic prose; it does not turn a signal into an invention claim. `coverage.md` is generated by the same command.

The operative prompt's comparison figures were measured at the earlier `30208d26ad` snapshot. This census uses the subsequently fetched base; its exact counts therefore replace those comparison figures for this run.

| Inventory signal | Count on the measured base | How it is used |
|---|---:|---|
| Person records with any relevant recorded science role | 263 unique people (of 11,205) | Read their sourced prose for a documented making, method or instrument. Roles include `roles:` and `story_roles:`. |
| Relevant persons by role | physician 112; scientist 62; astronomer 42; mathematician 39; engineer 35; geographer 23; physicist 4; chemist 3; inventor 1; cartographer 1; biochemist 1; astrophysicist 1 | Counts may overlap; the pool total is de-duplicated. |
| Scientific concepts | 53 | Leads to create an invention record or link as its underlying concept. |
| Discovery-kind events | 4 | Include only discoveries that changed what people could make; label as discoveries. |
| Astrolabe, instrument and globe objects | 10 | Surviving examples that may be linked with `example_of`. |
| Treatise-kind works | 31 | All subjects; review for relevance. The separate scientific-work signal returns 51 records linked to scientific people/concepts or tagged as a zij. |
| English and Arabic prose files matching `invent|اختر|ابتكر` | 212 files across 182 unique entity IDs | Every matching file is read as a lead, not treated as proof. |
| Defined source families | EI2 1; TDV 62; Iranica 25; Wikipedia 4,662; Wikidata 1,754 | Reuse existing source entities; Wikipedia/Wikidata use follows the authenticity-ledger rule. |

The work signal is deliberately a lead filter, not an assertion that all 51 works describe inventions. The generated JSON contains the full IDs. Existing science-related records include `work/kitab-al-manazir`, `work/al-zij-al-sabi`, `work/nuzhat-al-tullab-fi-ilm-al-asturlab`, `work/kitab-al-hisab-al-khwarizmi`, and `work/zij-al-sindhind-khwarizmi`. A baseline exact-title search on `b526655edb` found no work records for the al-Jazari mechanical-device book, the Banu Musa *Kitab al-Hiyal*, Taqi al-Din's *al-Turuq al-saniyya*, al-Zahrawi's *al-Tasrif*, or Ibn Majid's *al-Fawa'id*; recheck the refreshed tree and verify titles, editions and identifiers before making stubs.

These are reproducible inventory counts, not counts of inventions. The generated `coverage.md` separately reports the queue size, invention records by domain and era, attribution status, prose by language, image/diagram/map presence and image-provenance step. The initial queue is a seed slate only. Phase 2 must build it to **at least 400 sourced leads before the first writing batch**.

## 3. Domain taxonomy

The machine-readable 19-domain taxonomy, invention kinds, eras, attribution values and inclusion rules are in [`taxonomy.yaml`](./taxonomy.yaml). The Phase 1 enum and all three locale labels are generated from that list; do not make a parallel list. Existing discipline and theme enums are reused.

## 4. Schema in one view

The `invention` record keeps the identity, domain, kind, era, origin, dated makers, attribution and perspectives, precursors, dependents, spread, impacts, surviving examples, source works, sites, concepts, present-day form, external identifiers, media and trilingual prose/metadata together. Every relation is sourced and written once; inverse edges are computed. The generated schema and validator implement the shapes in [`schema.md`](./schema.md).

## 5. Site in one view

After at least 30 sourced invention records exist, Phase 4 builds `/[lang]/inventions/` and `/[lang]/invention/<slug>/`, then adds person/object/work/place/event strips and discovery links. Arabic, English and Urdu ship together. Pages remain readable without JavaScript; all heroes have an existing open-licensed image, found image or gated illustration, and diagrams/maps are generated or sourced at build time. API routes are static exports. The implementation map and byte/weight checks are in [`site.md`](./site.md).

## 6. Research method

Research starts inside the museum, then uses the approved founder-supplied leads, reference literature, primary texts, collections and patent/first-publication records. Popular sources identify claims but never support them alone. Before a source is cited, create or reuse its `data/source/` entity; record revision IDs for Wikipedia/Wikidata and all harvest files outside Git. The full order, exact starting URLs and source registry checklist are in [`research.md`](./research.md).

## 7. Phases

| Phase | Scope | Gate |
|---|---|---|
| 0 — census and plan | Reproducible census, taxonomy, decisions, queue seed slate, lane, logs and companion plans | Validate, tests, canary entry, PR and merge |
| 1 — schema and API | `invention` class, enums, predicates, validator, tests and static API; submission-impacting outreach updates | D-000 sign-off recorded, outreach updated in same commit, validate/test/build, PR and merge |
| 2 — discovery | Read internal leads and source families; grow queue to ≥400, verify exclusions and sort chronologically | Every lead has a domain, batch, lead source and disposition; at least five independent reference sources opened before writing |
| 3 — content waves | Ten inventions per branch/PR, ten batches per 100; Arabic, English and Urdu prose plus data and media | Validate, cite-check, tests, build when applicable, both coverage reports and progress updated |
| 4 — browser | Begin after the first 30 inventions; home, record page, strips, discovery and static API | Build, static/weight/accessibility checks and browser checks |
| 5 — continued discovery and enrichment | Continue waves of 100 until the prompt's stop condition | Two further discovery passes with at least five new sources add no eligible candidate, a blocking flag applies, or the machine cannot continue after one retry |

Queue states are `[ ]` not started, `[~]` lead or research in progress, `[x]` published/closed as supported, and `[-]` excluded with an `exclusion.reason` and cited `exclusion.sources`. Coverage reports total, active and excluded candidates separately. Batches contain ten inventions, at most 25 content entities per PR. No batch is skipped; a duplicate becomes an alias of the richer record. Details and report fields are in [`phases.md`](./phases.md).

## 8. Decisions

Standing authorization and the initial lane decisions are recorded in [`decisions.md`](./decisions.md). Decisions that affect an existing record, source policy, submission claim or reserved area are not inferred from this plan; apply the repository's change gates.

## 9. Risks and open flags

- **Faith and tradition evidence:** especially modern makers and figures whose affiliation is disputed. No identity inference from names, nationality or a Muslim-majority setting.
- **Attribution inflation:** popular lists often collapse invention, transmission, improvement and discovery. Keep the claim and scholarly view distinct.
- **Missing primary works and pages:** do not invent page numbers, dates or citations; leave a visible queue flag.
- **Media:** each eventual record needs a hero image. Use only whitelisted sources/licences, no figurative depiction of prophets or Companions, and no AI portraits. No record is counted complete if its required image or diagram is absent.
- **Overlapping lanes:** reuse existing person, work, object, concept and source IDs; touch shared records only with additive, sourced blocks and preserve concurrent work.
- **Harvest storage:** all downloads and OCR stay in `/Volumes/exmicroSD/islam-museum-harvest/inventions/`, outside Git. An openly served EPUB of *1001 Inventions* and its search index, and the registered CC BY 4.0 Mahgoub et al. paper, are stored there; the EPUB's publication year is not established, and the separate IA item labeled 2007 was unavailable to borrow. CNN, National Geographic and History Hit access outcomes are recorded in [`research.md`](./research.md); no source files or OCR are in Git.
- **Borrow-only books:** a restricted Internet Archive or Open Library book is borrowed and read in the browser, one request at a time, never through the archive.org API; the founder signs in or solves a CAPTCHA when asked, and the pages are OCR'd from screenshots on the Mac (Apple Vision) into the harvest folder above. Full rules: [`docs/agents/mining-sources.md`](../agents/mining-sources.md) section 1b.
- **Deployment:** never deploy. Every merged phase report states that merged is not live and whether a Worker/workflow file changed.

## 10. Done means

The run stops only under the conditions in section 12 of the operative brief, restated in [`phases.md`](./phases.md). Each 100-item wave is complete only when each record has sourced trilingual prose, a cited faith basis for every maker, its graph ties, hero image, diagram, a map when spread exists, and passing validation, citation, tests and build gates. The home/API are built and coverage is regenerated; the founder is told exactly what to deploy. No deployment is performed by this lane.
