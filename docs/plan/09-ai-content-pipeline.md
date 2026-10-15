# 09 · AI content pipeline — discovering, pulling, verifying and storing the whole story

This is the operating plan for using AI to populate the museum from the origins of Islam to the present, without sacrificing authenticity. The short version: **structured open data builds the skeleton, retrieval-grounded AI drafts the flesh, automated checks and tiered human review keep it honest, and everything lands as static files in git that the site compiles to JSON.**

## 1. Rules the AI works under

1. **Retrieve, then write.** The model never writes a fact from memory. Every run begins by fetching sources; the draft is produced *from* the fetched text, and every fact carries a pointer to the exact passage that supports it.
2. **Two independent sources for every dated fact** (birth, death, battle, foundation). One source → `confidence: low` and a `needs_source` flag.
3. **Provenance on everything.** Each generated file carries a `provenance` block: generator script and version, model, date, source list, and the reviewer who later signed off.
4. **Nothing goes live as `verified` without a human.** AI output enters as `imported` or `draft`. The site shows the badge.
5. **Unknown stays unknown.** If sources disagree, the model writes `debated` with both positions. If a date is missing, the field is omitted, never invented. Hijri dates come from sources (Arabic biographical dictionaries give Hijri first); conversions are marked `derived`.
6. **No invented quotes, no invented images, no rulings, no polemics.** A lint rejects first-person religious instruction, sectarian slurs, and unsourced superlatives ("the greatest…").
7. **Risk-tiered review.** Contested, sacred, living-person and modern-political topics get two reviewers; ordinary historical entities get one; CC0 structured imports get sampling.
8. **Attribution and license travel with the content.** The pipeline refuses sources whose license is unknown and keeps non-commercial material in its own labelled files.
9. **The harvest runs locally.** Discovery, download, parsing, extraction, classification and judging run on the founder's Mac with local scripts and open-weight models, with no cloud model in the path (`15-local-harvest.md`). The rules above apply to local models exactly as written.
10. **Scripture is never generated.** No model writes, completes or corrects Qur'an text; it comes only from the verified, frozen source files.
11. **Every side is retrieved.** For conflicts, debates and schisms the pipeline fetches sources from each party and from outside scholarship, and records participants on all sides (`13-figures.md`).

## 2. Where the content comes from (source map)

Tiering drives both retrieval order and citation weight.

| Tier | Sources | Use |
|---|---|---|
| **T0 structured, open** | Wikidata (CC0, SPARQL), Pleiades (CC BY), World Historical Gazetteer / Linked Places, al-Thurayya gazetteer (verify license), Met Open Access, Smithsonian Open Access (CC0 filter), Walters CSV + OPenn, Rijksmuseum, Cleveland, Wikimedia Commons (per-file license), UNESCO World Heritage list, OpenITI metadata (authors, works, dates, URIs), Tanzil Qur'an text (CC BY), open hadith datasets (classical Arabic text; check translation licenses), Pew / UN / World Bank demographic datasets, GeoNames, Natural Earth, **Atlas of Islamic History (islamicatlas.org) CSV tables (CC BY 4.0; confirm BY vs BY-SA)** for dynasties, rulers, scholars, teacher–student edges and Yaqut places, **Early Islamic Mosques Database** (CC BY, GeoJSON), OpenHistoricalMap / historical-basemaps polygons (public domain, coarse) | Build the skeleton: IDs, labels in many languages, Gregorian dates, coordinates, images, work lists, population tables |
| **T1 primary texts** | Qur'an; hadith collections; sira (Ibn Ishaq/Ibn Hisham), tabaqat and biographical dictionaries (Ibn Sa'd, Ibn Khallikan, al-Dhahabi, al-Safadi, Ibn Hajar), chronicles (al-Tabari, Ibn al-Athir, al-Maqrizi), travelogues (Ibn Battuta, Ibn Jubayr, Ibn Fadlan, Evliya Çelebi), through **OpenITI** (CC BY-NC-SA) and public-domain translations on Internet Archive / HathiTrust (pre-1930 editions) | Hijri dates, teacher–student links, places, events as the tradition records them; quotes with location |
| **T2 reference and scholarship** | Encyclopaedia Iranica (open access), Diyanet İslam Ansiklopedisi (free, Turkish), Encyclopaedia of Islam (cite only; paywalled), Cambridge/Oxford histories (cite), open-access journals via OpenAlex, Semantic Scholar, CORE, DOAJ, JSTOR open content, university repositories, Smarthistory (CC BY-NC-SA), Archnet (link), museum catalogue essays | Historical consensus, debates, context, bibliography |
| **T3 pointers** | Wikipedia in en/ar/fa/tr/ur/id (CC BY-SA; use its references, not its claims), Muslim Heritage, World History Encyclopedia, podcasts | Discovery of entities and of T1/T2 sources; never the cited source |
| **T4 contemporary** | Reputable news archives, official institutional pages, OIC/UNESCO/ISESCO/IRCICA publications, Pew, academic reports | *Today* wing; living-person policy applies; always dated |
| **Screen** | Wikidata film and television items (CC0), Europeana and DPLA metadata (CC0); national and global film databases as identifiers and pointers only | The Screen index (`12-screen-index.md` §3) |
| **Directories** | Open charity registers, Curlie, official member lists; OpenStreetMap in a separate ODbL layer | Candidates for organisations, charities, websites and the Made wing; leads, never facts about belief (`15-local-harvest.md` §6.7) |

Legal gates (from the licensing survey): Quran Foundation API content is called client-side only, never stored; OpenITI and Smarthistory text stays non-commercial-labelled; Aga Khan Museum images CC BY-NC; QDL via IIIF with per-item rights; Brill/Oxford cited not copied; GPL corpora isolated.

## 3. Coverage strategy: inception to now

Islam's story is organised as a **grid of periods × regions** (12 periods × 14 regions = 168 cells, see `06-roadmap.md` and `schema/enums`). The pipeline works cell by cell and class by class so that no century or region is forgotten and the modern era gets the same machinery as the classical one.

For each cell the AI produces a **cell manifest**: the top-N candidates per class (people, events, places, buildings, objects, works, concepts, practices, groups, polities) ranked by an **importance score** computed from signals, not opinion:

- Wikidata sitelink count and inbound links (fame across languages)
- presence in EI3 / Iranica / DİA / OpenITI (scholarly weight)
- number of times already referenced as a stub by existing museum entities (graph demand)
- zero-result search queries on the live site (visitor demand)
- editor-assigned priority tags (curatorial judgement)

A third dimension, **theme** (about 125 themes, `14-themes-atlas.md`), is tracked on the same grid, and a cell counts as covered for people only when it holds figures from at least four role families, including opposition and outside observers (`13-figures.md` §4).

Fill priority = importance × (1 − current coverage of the cell). The public **coverage page** renders the grid so visitors and contributors see what is thin. The modern period (1800–today) is split into Colonial, Modern (1900–1990) and Contemporary (1990–today) cells with their own sources (T4), a living-person policy and a slower cadence.

Expected scale: Phase 1 spine ≈ 1,000 entities; by year 2 ≈ 10,000; the long tail (every scholar in the biographical dictionaries, every mosque in Archnet) can reach 100,000+ *imported* nodes with thin pages that still link correctly, while the curated core stays deep.

## 4. The pipeline (stages)

```
PLAN     plan-cell          → .cache/manifests/<period>/<region>.json   (candidates + importance + existing coverage)
IMPORT   import-structured  → data/<class>/<slug>.yaml (status: imported) from Wikidata/Pleiades/Met/… ; reconcile & dedupe
FETCH    fetch-sources      → .cache/sources/<entity>/<n>.json  (url, license, text, fetched_at)  [T1/T2/T3; cached, rate-limited]
EXTRACT  extract-facts      → .cache/facts/<entity>.json  (claims with quote spans, dates in source calendar, relations, perspectives)
JUDGE    verify-facts       → flags: unsupported, single-source, conflict, implausible, license-unknown, sensitive
DRAFT    draft-entity       → data/<class>/<slug>.yaml + content/<lang>/<class>/<slug>.md (status: draft) with {cite:} and [[links]]
LINK     propose-relations  → edges to existing IDs; unknown targets to data/_stubs.yaml (feeds next PLAN)
TRANS    translate          → content/<other-lang>/… with glossary enforcement + back-translation check
VALIDATE npm run validate   → schema, dates, links, licenses, lint (same gate humans pass)
PR       open-pr            → one PR per cell batch (≤ 25 entities) with a reviewer checklist and the judge's flags
REVIEW   human              → Tier A/B/C; status → reviewed / verified
BUILD    build → api/v1/*.json, pages, indexes
```

Each stage is a small TypeScript script in `scripts/ai/` that can run locally through Claude Code or on a schedule in GitHub Actions. Stages are idempotent and cache-aware; re-running a stage on an entity only touches what changed.

### Stage notes

- **import-structured**: SPARQL queries per class (e.g. humans with occupation in {Islamic scholar, muhaddith, faqih, Sufi, caliph, …} or with "religion: Islam" and a notable work; cities with historic names; dynasties). Reconciliation: match on Wikidata QID → VIAF → normalised name + dates; never create a duplicate for an existing `external_ids.wikidata`. Keeps a `wikidata_snapshot` so weekly diffs can propose updates.
- **fetch-sources**: polite crawler with a User-Agent, per-domain rate limits, caching, robots.txt respect; prefers open-access full text; for OpenITI fetches the mARkdown file and slices the relevant biography by the entity's name forms; stores only what the license allows (full text in cache, *quotes* in the repo).
- **extract-facts** (LLM): structured JSON output, one claim per line with `{ claim, value, calendar, source_id, quote, locator }`. Arabic sources are read in Arabic; Hijri dates captured verbatim. Teacher–student, birth/death place, works, travels and patronage relations are extracted with the same discipline.
- **verify-facts** (LLM-as-judge + rules): a second model, with a different prompt, is asked whether each claim is entailed by its quote; rules check date plausibility (death > birth; lifespan ≤ 110; Hijri↔Gregorian within ±2 years), geography (coordinates in the stated country), relation domain/range, time-consistency of `student_of` (student younger), and agreement with Wikidata (differences become `debated` or flagged).
- **draft-entity** (LLM): writes Brief/Standard/Deep sections in the house voice from the verified claims only, with `{cite:}` after every sentence that carries a fact, `[[links]]` to existing IDs, a `perspectives` block when the judge flagged a conflict or the topic is in the contested list, and `## For young visitors` for spine entities.
- **translate** (LLM): en→ar or ar→en with the glossary (`i18n/glossary.yaml`) enforced for terms and names; back-translation similarity check; the translator field records `model` and the content hash of the source text.
- **open-pr**: PR body lists entities, the judge's flags, source tiers used, a sensitivity summary and the review tier; CODEOWNERS routes it.

## 5. Verification and authenticity in depth

| Threat | Control |
|---|---|
| Hallucinated facts | Retrieval-grounded extraction; quote spans; entailment judge; unsupported claims cannot enter `data/` |
| Wrong dates | Dual-source rule; calendar flags; plausibility rules; Hijri stored as in source; conversions marked derived; anchor tests for the converter |
| Sectarian bias or polemic | Scope rule (`docs/scope.md`): Sunni frame first and main, every other view labelled before it is stated; contested-topic list triggers mandatory perspectives; validator requires a Sunni first entry and a label on every entry; prose lint for unlabelled non-Sunni statements; neutral-language lint; two reviewers from different backgrounds for Tier A |
| Over-claiming ("Muslims invented X") | Sources must be T1/T2; superlative lint; phrasing "is credited by…" with cite |
| Copyright | Every source is rewritten in the museum's own words with a citation (`docs/sources-policy.md`); quotes limited to 40 words; raw files stay out of git; media from the licence whitelist with attribution |
| Fabricated sources | `source` entities must resolve (DOI/ISBN/URL check); the citation checker fails the build if a `{cite:}` has no source file |
| Duplicates and identity confusion (many "Ibn Muhammad") | Reconciliation by external IDs, dates and places; name-forms table; judge asked to confirm identity across sources |
| Stale content | Wikidata diff job; link-health job; `last_reviewed` ages shown; translations flagged stale by hash |
| Living persons | Only public, sourced facts; no health/private life; removal channel; Tier A review |
| Model drift | Prompts, model IDs and versions pinned per run and recorded in `provenance` |

Status ladder and what each means on the page:
`imported` (facts from open structured data, no prose) → `draft` (AI prose, unreviewed; shown with a visible "draft" label and no featured placement) → `reviewed` (one human verified claims against sources) → `verified` (two reviewers or editorial board; eligible for exhibits and front page).

## 6. Storage: static JSON

Source of truth is **YAML + Markdown** in git because humans edit it and comments help; YAML is a superset of JSON, so any tool can read or write it as JSON, and the import scripts may write `.json` directly if preferred (the validator accepts both). The build compiles everything into static JSON the site and third parties consume:

```
api/v1/
  <class>/<slug>.json          full entity: data + resolved labels + inverse edges + prose (per lang) + provenance
  <class>/index.json           compact rows: id, label{}, summary{}, dates{earliest,latest,hijri}, coords, wings, status
  graph/nodes.ndjson           one node per line (compact)
  graph/edges.ndjson           { s, p, o, start, end, confidence, sources[] }
  derived/timeline/<period>.json      rows for the timeline island
  derived/map/<layer>.geojson         places, buildings, events, journeys, polity extents by date
  derived/ego/<class>/<slug>.json     2-hop neighbourhood for the network island
  derived/snapshot/<year>.json        who/what/where in a given year (CE and AH indexes)
  derived/onthisday/<mm-dd>.json      and <hijri-mm-dd>.json
  derived/search/…                    Pagefind chunks
  meta/coverage.json  meta/release.json  meta/licenses.json
```

Compiled entity example (abridged):

```json
{
  "id": "person/ibn-sina",
  "class": "person",
  "label": { "en": "Ibn Sina (Avicenna)", "ar": "ابن سينا" },
  "summary": { "en": "Persian polymath (c. 980–1037) …" },
  "born": { "edtf": "0980~", "hijri": "0370~", "earliest": 975, "latest": 985, "calendar": "julian", "status": "historical" },
  "died": { "edtf": "1037-06", "hijri": "0428-09", "earliest": 1037.4, "latest": 1037.5 },
  "relations": [
    { "type": "student_of", "target": "person/abu-abdallah-al-natili", "targetLabel": { "en": "al-Natili" }, "sources": ["source/gohlman-1974"] },
    { "type": "teacher_of", "target": "person/bahmanyar", "inverse": true }
  ],
  "prose": { "en": { "brief": "<p>…</p>", "sections": [ { "id": "life", "html": "…" } ] } },
  "provenance": { "generated_by": "scripts/ai/draft-entity@0.3", "model": "claude-sonnet-5-5", "run": "2026-11-02", "sources": ["source/gohlman-1974", "source/gutas-2014"], "reviewed_by": ["ahmed"] },
  "status": { "review": "reviewed", "completeness": 3 },
  "links": { "html": { "en": "/en/person/ibn-sina", "ar": "/ar/person/ibn-sina" }, "wikidata": "https://www.wikidata.org/wiki/Q8011" }
}
```

## 7. How the UI uses it

- Entity pages are **prerendered HTML** from the compiled graph (no fetch needed to read).
- Islands fetch only what they need: the timeline loads `derived/timeline/<period>.json` for the visible range; the map loads one GeoJSON layer at a time; the network island loads `derived/ego/<id>.json` and expands on click; search loads Pagefind chunks; "Wander" and "On this day" read small indexes; Compare loads two entity JSONs.
- Because every island reads the same JSON the API publishes, **anything a visitor can see, a researcher can download**, and the build-time question pipeline (07 Prompt P) reads the same files. No model runs at request time.

### 7a. The pathway pass (planning phase)

Alongside entity drafting the pipeline runs a **pathway pass** (`19-tour-learn.md` §4): from the Questions list, the Arabic gap lists and the themes atlas it proposes the **top 300 guided pathways** (goal stated as an outcome, audience, level, minutes, ordered step references, prerequisites, onward paths), scores each for demand and for readiness (how many steps already exist and are reviewed), and lists the missing entities, which go into the harvest and writing queues. It runs on the Mac with local models and a second family as judge; the output is a reviewed catalogue (`docs/pathways/catalogue.yaml`, `status: proposed`). It never runs at request time: the Tour / Learn tab only serves the precomputed, reviewed pathways.

## 8. Running it: cadence, cost, models

- **Local harvest (default for everything up to and including drafts):** all stages from PLAN to DRAFT can run on the Mac with open-weight models through Ollama, a second model family as judge, and gold sets that gate each pass (`15-local-harvest.md` §7). No tokens, no uploads.
- **Claude sessions** (optional, Claude Code) for the spine: run `plan-cell` → review manifest → `draft` batches of 10–25 → review PRs. Humans spend their time reviewing, not typing.
- **Scheduled GitHub Actions** (weekly): Wikidata diff; link health; new CC0 objects from museum APIs; stale translation report; coverage report. Monthly: a cell batch for the long tail, opened as PRs for review.
- **Models**: a fast model (claude-sonnet-5-5) for extraction, drafting and translation at volume; a stronger model (claude-opus-5-5 or claude-fable-5-1) for the judge, contested topics and exhibit writing. Prompt caching for the fixed context (schema, style guide, glossary, enums). Pin model IDs in `provenance`.
- **Cost**: per entity, retrieval plus extraction plus drafting plus judging is a few tens of thousands of input tokens and a few thousand output tokens; measure on the first 100 entities and budget from current pricing before scaling. Structured imports cost nothing.
- **Human time**: reviewing a Tier B entity with quote spans takes 5–10 minutes; that is the real bottleneck, so the judge's flags and quote spans exist to make review fast.

## 9. Acceptance tests for the pipeline

1. Run the pipeline on 20 spine people and 20 events; a reviewer finds ≥ 95 % of claims supported by the cited quote; every date has two sources or a flag.
2. Insert a deliberately false claim into a cached source; the judge marks it `single-source`/`conflict` against Wikidata.
3. Remove a source file; the build fails on the dangling `{cite:}`.
4. Feed an NC-licensed source; the output is isolated and labelled, and the validator rejects any attempt to merge it into CC BY-SA prose.
5. A contested entity (Saqifa, Ghadir Khumm) produces a perspectives block with the Sunni entry first, then the academic entry, then the labelled Twelver Shia entry, each cited; a block whose first entry is not Sunni, or an entry without a tradition label, fails validation.
6. (Phase 4) Translating `content/ar/person/ibn-sina.md` to English preserves every `{cite:}` and `[[link]]` and uses glossary forms.
