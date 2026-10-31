# 07 · Prompt library

Copy-paste prompts for building and populating the museum with Claude Code (or the Claude API). Prompt A becomes the repo's `CLAUDE.md`; the others are session or script prompts. Each is self-contained; adjust the counts and paths in brackets.

---

## A · Project context (save as `CLAUDE.md`)

```
# islam.museum — project context

You are working on islam.museum, an open, free, all-digital museum of Islam: the faith, civilization, peoples, places, ideas, objects, texts and living culture, from the world Islam was born into until today. Read docs/plan/ before architectural changes. Key documents: 01-vision (principles), 02-content-model (classes, predicates, dates), 03-architecture (stack, layout, pipeline), 04-experience (halls and pages), 05-editorial (voice, perspectives, licensing), 06-roadmap, 09-ai-content-pipeline, 12-screen-index, 13-figures, 14-themes-atlas, 15-local-harvest.

Non-negotiables
- Static site on GitHub Pages behind Cloudflare; no servers, no databases, no paid services. Astro + Svelte islands + Tailwind; TypeScript scripts; Pagefind search; MapLibre + PMTiles; Sigma.js graphs.
- Content is a knowledge graph in git: data/<class>/<slug>.yaml (language-neutral facts) + content/<lang>/<class>/<slug>.md (prose). IDs are "class/slug", immutable; renames via aliases.
- Dates: EDTF + Hijri string + calendar flag + precision; never invent a date; conversions marked derived.
- Relations use schema/predicates.yaml only; write the edge once; inverses are computed.
- Every entity cites sources; every dated fact needs two sources or a flag. Wikipedia is a pointer, not a source.
- Voice: a warm, precise, neutral docent. Describe, never prescribe. No honorifics typed into prose (the UI renders them). Scope: Sunni Islam is the default and main frame and research starts from Sunni sources (docs/scope.md); any other view may be mentioned and must be labelled before it is stated. Contested topics use the perspectives block with the Sunni position(s) first, then the academic view, then any other view, each cited and labelled.
- Licenses: prose CC BY-SA 4.0, data CC0, code MIT; third-party content keeps its own license, recorded per version; media only from the whitelist in schema/enums/licenses.yaml; no figurative depictions of prophets; no AI-generated portraits.
- Arabic is the primary language (docs/language.md): write every label, summary, prose section, question, alt text and UI string in Arabic first; English and other languages come in Phase 4 as translations. RTL is the default layout.
- Accessibility: WCAG 2.2 AA; alt text required; no JS needed to read a page; islands lazy-load.
- Run `npm run validate` before proposing any content change and `npm run build` before any site change. Fix what fails.
- AI-generated content enters as status.review: draft with a provenance block; never mark reviewed/verified yourself.
- Significance, not sympathy: opponents, critics and allies are included with time-scoped story_roles; describe the act, attribute the judgement; never write "enemy of Islam" or an equivalent in the museum's voice; a person's faith is recorded only with its basis and never inferred.
- Hard questions are written as tension cards with at least two cited voices and no verdict.
- Never write, complete or correct Qur'an text: it comes only from the frozen Tanzil files and is referenced by sura:ayah.
- Harvesting runs on the founder's Mac with local models (docs/plan/15). Sources (docs/sources-policy.md): any source may be read and rewritten in the museum's own words with a citation; facts enter data/ from any source; only verbatim text beyond a 40-word quotation and the raw files stay out.
- Commit and push validated work without waiting for sign-off; conventional commit messages; small PRs per cell batch (≤ 25 entities).
```

---

## B · Phase 0 scaffold

```
Scaffold the islam.museum repository exactly per docs/plan/03-architecture.md §3. Create:
1. Root files: LICENSE (MIT), LICENSE-CONTENT.md (CC BY-SA 4.0 for content/, CC0 for data/ geo/ datasets/), CONTRIBUTING.md, CODE_OF_CONDUCT.md (Contributor Covenant + the museum clause from docs/plan/05-editorial.md §7), GOVERNANCE.md, CLAUDE.md (from docs/plan/07-prompts.md Prompt A), docs/style-guide.md, docs/editorial-policy.md (condensed from 05), docs/adr/0001-static-git-knowledge-graph.md.
2. schema/: _base.schema.json and one JSON Schema per class in docs/plan/02-content-model.md §2 (person, group, polity, event, period, journey, place, building, object, media, work, passage, concept, language, practice, exhibit, question, source, dataset, listing, screen), predicates.yaml with inverses/domain/range/labels for every predicate in §4, enums/ (regions, traditions, roles, kinds per class, disciplines, materials, licenses, sensitivity, claim-status), external-id-patterns.yaml.
3. templates/<class>.yaml and templates/<class>.md with the conventional section headings.
4. scripts/ (TypeScript, run with tsx, tested with vitest): validate.ts (ajv + EDTF parse via `edtf` + Hijri sanity + link resolution against data/ and data/_stubs.yaml + license whitelist + alt text + slug rules + duplicate external IDs), build-graph.ts (graphology; inverse edges; date normalisation to earliest/latest; prose attach; contemporaries; coverage) → .cache/graph.json, derive.ts (timeline rows, GeoJSON layers, ego graphs, snapshot-year indexes, on-this-day indexes), export-api.ts (api/v1 per docs/plan/09 §6), hijri/convert.ts (tabular arithmetical converter + Umm al-Qura for ≥1300 AH; anchors.test.ts with: 1 Muharram 1 AH = 16 July 622 Julian; 12 Rabi' I 11 AH = 8 June 632; 1 Muharram 1447 = 26 June 2025), report/coverage.ts.
5. data/ with the example entities from docs/plan/02 §10 plus enough stubs/entities that validation passes (person/ibn-sina, place/medina, place/mecca, place/hamadan, place/bukhara, event/hijra, person/muhammad, person/abu-bakr, period/prophetic-era, source/gutas-2014, source/gohlman-1974 …) and content/en + content/ar prose for ibn-sina and hijra.
6. site/: Astro 5 project with Tailwind 4, Svelte, i18n routing (ar default and RTL; en added in Phase 4), a content loader reading .cache/graph.json, layouts/EntityLayout.astro implementing the page anatomy in docs/plan/04 §3 (header, at-a-glance, in-time strip placeholder, in-space mini map placeholder, body with depth dial, connections grouped by predicate, sources, cite, JSON-LD, edit link), pages for [lang]/[class]/[slug], hall index placeholders for the nine wings, the Screening Room (screen/) and Themes (themes/[slug]), wander, today, questions, exhibits, api export, sitemap, robots.txt, llms.txt, Pagefind integration, fonts self-hosted and subsetted (Noto Naskh Arabic, Amiri, Reem Kufi, Source Serif 4, Inter), design tokens from docs/plan/04 §6, dark mode, print stylesheet.
7. .github/workflows/validate.yml (PR: validate + build + link check + Lighthouse budget 95/100), deploy.yml (main: build site/ → upload-pages-artifact → deploy-pages → purge Cloudflare cache with secrets CF_ZONE_ID/CF_API_TOKEN), ISSUE_TEMPLATE forms (suggest-entity, report-error, request-translation, propose-exhibit), PULL_REQUEST_TEMPLATE.md, CODEOWNERS.
8. package.json scripts: validate, graph, derive, api, build, dev, test, coverage.
Move the current landing/ page into site/src/pages as the temporary home page in both languages. Keep every page readable without JavaScript. Verify in /ar/ that RTL mirrors correctly. Finish by running validate, test and build, and report results honestly.
```

---

## C · Schema and predicate review

```
Review schema/ against docs/plan/02-content-model.md. For each class, check that: required fields are minimal (id, class, label.en, summary.en, sources ≥ 1, status); dates use the shared date definition (edtf, hijri, calendar, precision, status, note, sources, derived); multilingual fields are objects keyed by BCP-47; enums reference schema/enums; relations validate type against predicates.yaml and target against the ID pattern ^(person|group|…)/[a-z0-9-]+$. Add JSON Schema $comment with an example per field. Then write schema/README.md documenting how to add a class, a predicate, an enum value and an external ID system without breaking existing data. Run validate on all data and fix the schema, not the data, where the schema is wrong.
```

---

## D · Entity authoring (universal, retrieval-grounded)

Use for one entity at a time or in a batch loop. Replace the bracketed parts.

```
Create the museum entity [class/slug] ([display name]) for islam.museum.

Procedure (do not skip steps):
1. RETRIEVE. Gather at least three sources, preferring in this order: primary texts (OpenITI, public-domain translations on archive.org), reference works (Encyclopaedia Iranica, Diyanet İslam Ansiklopedisi, EI citations), peer-reviewed or university sources, museum/library records. Use Wikipedia/Wikidata only to find sources and the QID. Record each source as data/source/<id>.yaml (CSL-JSON fields, kind, language, open_access, reliability_note) if not present.
2. EXTRACT. List every fact you will state as a JSON array of claims {claim, value, calendar (hijri/julian/gregorian), source_id, quote (≤ 40 words, verbatim), locator (page/section/url#)}. Dates must carry the calendar the source used. A fact without a quote is not a fact.
3. VERIFY. For each dated fact, find a second independent source or mark confidence: low. Where sources conflict, keep both as a debated claim. Check plausibility (lifespan, chronology of teachers/students, geography).
4. WRITE data/[class]/[slug].yaml per schema/[class].schema.json and templates/[class].yaml: id, class, label {ar required; en optional until Phase 4; + source language}, names[] with full ALA-LC and Arabic script, summary {en, ar}, dates (edtf + hijri + calendar + precision + status + sources), wings, periods, regions, roles/kinds, external_ids (wikidata, viaf, openiti, archnet, pleiades, accession), relations[] using only predicates from schema/predicates.yaml, each with sources and note where useful; for targets that do not exist, add them to data/_stubs.yaml with a label and class; perspectives[] if the topic is contested (the Sunni position(s) by school first, then the academic view, then any other view the topic needs, each cited and labelled; docs/scope.md); media.hero only from whitelisted licenses with alt text in en and ar; sensitivity; status {review: draft, completeness}; provenance {generated_by, model, run date, sources}.
5. WRITE content/ar/[class]/[slug].md (Arabic first, per docs/language.md) following templates/[class].md: "## Brief" (2–3 sentences a 12-year-old understands), then the class's conventional sections, each factual sentence ending with {cite:source-id locator}; link every mentioned entity with [[class/slug]]; define Arabic terms on first use; no honorifics; describe, never prescribe; add ":::perspectives" when the topic is contested; add "## For young visitors" for spine entities.
6. (Phase 4 only) WRITE content/en/[class]/[slug].md: translate from the Arabic with i18n/glossary.yaml forms, keep every {cite} and [[link]], set translation_of: ar@<hash>. Skip this step in Phases 0–3.
7. RUN npm run validate and fix every error. Report: the claims table, the sources used, anything you could not source, and any sensitivity concerns. Do not mark the entity reviewed.
```

Class-specific additions:
- `event`: give `date.start`/`date.end` separately; `participants[]` with roles; `caused_by`/`caused`; `occurred_at`; link the `passage`s traditionally connected (asbab al-nuzul) with `status: tradition`.
- `place`: `historical_names[]` with periods; `coordinates`; `part_of`; a "What was here" paragraph per major period, each cited; modern travel note only from official sources.
- `object`: holding institution, accession number, IIIF manifest or CC0 image URL, materials, dimensions, inscriptions with translation, provenance chain; `sensitivity: sacred` for relics; never figurative depictions of prophets.
- `work`: structure (chapters) as `has_part` to `passage`s where they exist; editions and translations with per-version license; OpenITI URI; commentaries.
- `concept`: `definitions[]` by tradition with citations; etymology; parent/child concepts; where it appears in scripture.
- `practice`: calendar rule (`when`), obligation level by tradition, regional variations with sources, scriptural basis as passages.
- `journey`: legs[] from the primary travelogue with dates and places (create place stubs), geometry as LineString; distance; sources per leg.
- `polity`: rulers as time-scoped `ruled_by` edges; capitals time-scoped; extent GeoJSON at 2–3 dates in geo/polity/<slug>-<year>.geojson (simplified; sourced from an atlas; note the atlas).
- `person` (living): only public facts from T2/T4 sources; no health or private-life details; Tier A review.

---

## E · Cell batch (coverage grid)

```
Plan and draft the content for the coverage cell [period: e.g. period/abbasid-early] × [region: e.g. persia-central-asia].
1. Build the cell manifest: query Wikidata (SPARQL) for people, events, places, buildings, works and polities associated with this period and region; score by sitelinks, inbound museum stubs (data/_stubs.yaml), presence in Iranica/DİA/OpenITI; subtract what already exists in data/. Output .cache/manifests/<period>/<region>.json with the top [25] candidates per class and a one-line reason each.
2. Show me the manifest and wait for my selection. [or: proceed with the top 10 per class]
3. For each selected candidate run Prompt D. Create stubs for referenced-but-missing nodes.
4. Open one PR titled "content(cell): <period> × <region> batch <n>" with a table of entities, status draft, judge flags, source tiers used, sensitivity notes and the review tier. Do not merge.
```

---

## F · Structured import (no prose)

```
Write scripts/import/wikidata.ts that imports [class] entities from Wikidata into data/[class]/ as status.review: imported, with provenance. Requirements: SPARQL with a descriptive User-Agent and backoff; paginate; map P-properties to our fields (labels in en/ar/fa/tr/ur/id, descriptions → summary only if ≤ 200 chars and neutral, P569/P570 → born/died as EDTF with precision and 'circa' qualifier → '~', P19/P20 → born_in/died_in to existing place IDs by QID match else stub, P1066/P802 → student_of/teacher_of, P800 → authored stubs, P625 → coordinates, P18 → candidate image with license check via Commons API, P214 VIAF, P1566 GeoNames, P1584 Pleiades); never overwrite a field edited by a human (track imported_fields[]); dedupe on QID; write a reconciliation report; dry-run flag. Add tests with recorded fixtures. Then run it for [the 150 spine people in docs/plan/06-roadmap.md] and show the report.
```

Analogous prompts: Met Open Access (department 14 Islamic Art, CC0 only, write `object` + `media`), Smithsonian (CC0 flag), Walters CSV, Pleiades/WHG places (Linked Places → `place`), OpenITI metadata (authors/works → `person`/`work` stubs with URIs), Tanzil (Qur'an → `work/quran` + 6,236 `passage`s), UNESCO (buildings), Pew (dataset).

---

## G · Fact judge

```
You are the verification judge for islam.museum. Input: a claims file (.cache/facts/<entity>.json) and the cached source texts. For each claim decide: supported (the quote entails the claim), partially-supported, unsupported, or contradicted, and explain in ≤ 20 words. Then run checks: (a) every dated fact has ≥ 2 independent sources; (b) chronology (death after birth, lifespan ≤ 110, students younger than teachers, events within lifetimes); (c) Hijri and Gregorian agree within ±2 years; (d) coordinates fall inside the stated modern country; (e) compare with Wikidata values and list differences; (f) sensitivity triggers (figurative-prophet media, violence, living person, contested list in schema/enums/contested.yaml); (g) license of every source and media item is whitelisted. Output JSON {claims:[…], flags:[…], review_tier: A|B|C, summary}. Be strict: when in doubt, unsupported.
```

---

## H · Translation

```
Translate content/[src-lang]/[class]/[slug].md into [target-lang] for islam.museum. Keep the frontmatter, add translation_of: [src-lang]@[hash], translators: [model id]. Preserve every {cite:…} and [[…]] exactly. Use i18n/glossary.yaml for names and terms (Arabic script forms and standard spellings); keep Qur'anic quotations in the standard [target-lang] rendering only if the glossary lists a permitted translation, otherwise keep Arabic with a brief gloss. Voice: a calm museum docent; describe, never prescribe; no honorifics; sentences short. For Arabic: full punctuation, no colloquialisms, hamza and ta marbuta correct, numbers in Western Arabic digits unless the UI setting says otherwise. Finish with a back-translation of the Brief section to [src-lang] so I can check meaning drift.
```

---

## I · Questions (newcomer door)

```
Write the museum question [question/slug] "[question text]" for a reader who knows nothing about Islam and may be nervous about asking. Structure: short_answer (≤ 60 words, plain, neutral), long_answer (3–5 short paragraphs: what it is, where it comes from with [[links]] and {cite}s to primary sources, how it varies across traditions and regions, a common misconception corrected gently), related (3–6 entities to explore next), related_questions (3). Multilingual en + ar. Never argue, never advise, never use "we" for Muslims; attribute beliefs to their holders. If the question touches a contested topic, include a perspectives block. Validate.
```

---

## J · Exhibit (curated narrative)

```
Curate the exhibit [exhibit/slug] "[title]" (kind: [exhibition|tour|lesson|trail], audience: [newcomer|kids|general|educator], duration [20] minutes) using ONLY entities already in data/ (list candidates first with a graph query over .cache/graph.json). Structure rooms[] (6–10): each with a title, 120–200 words of narrative in the docent voice, 2–4 featured entities, 1 media item with license and alt, and a "look closer" prompt. Open with a one-paragraph introduction and close with "where to go next" (3 links) and a sources list. Produce en and ar. For kids: shorter rooms, concrete objects, one question per room. For educators: add a printable handout section with 5 discussion questions and a glossary. Validate and preview the page in both languages.
```

---

## K · Timeline hall

```
Build the Time hall per docs/plan/04-experience.md §4. Implement site/src/islands/Timeline.svelte: zoomable dual-axis timeline (Hijri above, Gregorian below; EDTF uncertainty as soft-edged bars; lanes by region or class; virtualised rows; keyboard accessible; RTL-aware), fed by api/v1/derived/timeline/<period>.json loaded by visible range. Add /[lang]/time/ (eras overview), /[lang]/time/year/[ce] and /[lang]/time/hijri/[ah] snapshot pages (who was alive with ages, polities ruling, buildings standing, works written, events that year; ±10-year dial; "play"), and /[lang]/today (Hijri date, on-this-day in both calendars, current month explained, upcoming observances). Provide a no-JS list fallback. Performance budget: island ≤ 150 KB gzipped; Lighthouse ≥ 95. Test with the spine data in /en/ and /ar/.
```

Sibling prompts: **Map hall** (MapLibre + PMTiles from R2/media repo; time slider; layers; journeys playback; "What was here"; clustering; no-JS list), **People hall** (gallery facets; Sigma.js ego graphs from derived/ego; dynasty trees; path finder with graphology shortest path; "Women in the story" facet), **Words hall** (Qur'an browser from Tanzil `passage`s with permitted translations and per-version license display; hadith with isnad mini-graphs and sunnah.com deep links), **Living hall** (Hijri calendar island with ICS export; practices by kind; regional variation map), **Objects hall** (IIIF/OpenSeadragon viewer; masonry grid; collections map).

---

## L · Hijri date engine

```
Implement scripts/hijri/convert.ts: (1) arithmetical (tabular) Islamic calendar, both the 16-based and 15-based epoch variants, for historical dates; (2) Umm al-Qura via @umalqura/core for 1300–1500 AH; (3) EDTF ↔ Hijri conversion that preserves precision and uncertainty markers (a year-precision EDTF maps to a Hijri year range and vice versa); (4) a function that, given a stored Hijri date and a stored Gregorian/Julian date, reports whether they agree within tolerance by precision. Add tests with anchors: 1 Muharram 1 AH = 16 July 622 (Julian); death of the Prophet 12 Rabi' I 11 AH = 8 June 632; Battle of Badr 17 Ramadan 2 AH = 13 March 624; fall of Baghdad 4 Safar 656 AH = 10 February 1258; 1 Muharram 1447 AH = 26 June 2025; 1 Ramadan 1447 AH = 18 February 2026 (Umm al-Qura). Expose a CLI `npm run hijri -- --to-hijri 1037-06` and document the limits (±1–2 days for historical dates; sighting-based local variance).
```

---

## M · Deploy and Cloudflare

```
Set up production deployment: .github/workflows/deploy.yml builds site/ (node 22, npm ci, npm run build which runs validate → graph → derive → api → astro build → pagefind), uploads dist/ with actions/upload-pages-artifact and deploys with actions/deploy-pages; on success, purge Cloudflare cache for the zone using secrets CF_ZONE_ID and CF_API_TOKEN (scope: zone.cache_purge). Document in docs/ops.md the Cloudflare settings: proxied DNS to GitHub Pages, SSL Full (strict), HSTS, cache rules (HTML edge 1 h, assets 1 y, /api 1 d with stale-while-revalidate), redirect root → /en or /ar by Accept-Language with a cookie-free preference query param, CORS header on /api/*, security headers, Web Analytics token. Keep the deploy under 10 minutes; fail loudly on validation errors.
```

---

## N · Review session (human-in-the-loop)

```
Open PR [#n]. For each entity in the PR: show me the claims table with quotes side by side with the prose sentences that cite them; highlight judge flags; show the perspectives block if any; show media licenses. Ask me per entity: approve as reviewed, request changes (list), or reject. Apply my decisions by editing status.review, adding me to status.reviewers with today's date, and leave review comments on the PR for anything I rejected. Never change facts on your own during review; propose and wait.
```

---

## O · Coverage and wanted-list

```
Generate docs/coverage.md and api/v1/meta/coverage.json from .cache/graph.json: a 12-period × 14-region grid with counts per class, review-status mix, languages available, share of women among persons, sources per entity, and the top 50 wanted stubs by inbound references. Mark cells below thresholds. Propose the next three cell batches with reasons.
```

---

## P · Precomputed answers from visitor questions (Phase 5, build time only)

```
The published site has no runtime AI (docs/plan/03-architecture.md §13). Implement the build-time replacement for an "ask the museum" feature:
1. scripts/questions/harvest-queries.ts: read the exported zero-result and low-click search queries (Cloudflare Web Analytics export or the site's own anonymous query log file) and GitHub Discussions questions; normalise, cluster near-duplicates (transliteration variants, en/ar), rank by frequency; write .cache/questions/candidates.json.
2. For each candidate not already covered by a question/ entity, run Prompt I to draft a question entity with sources and links, status draft, for human review.
3. scripts/questions/synonyms.ts: generate search synonyms and transliteration variants (Avicenna → Ibn Sina, Koran → Qur'an, Mohammed → Muhammad) from names[] and label fields into site/public/search-synonyms.json, loaded by the client-side search.
4. Build-time "related questions" and "people also explored" lists from graph proximity and the query clusters, emitted into the entity JSON.
Everything runs in CI or locally and is published as static pages and JSON; nothing executes per visitor request.
```

---

## Q · Screen title (film, series, documentary, programme)

```
Create the museum entity screen/[slug] for "[original title]" ([year], [country]) per docs/plan/12-screen-index.md §4 and schema/screen.schema.json.
1. IDENTIFY. Find the Wikidata item and every identifier Wikidata holds (IMDb, TMDB, EIDR, elCinema, SinemaTürk, SourehCinema and the rest). Confirm existence, year, countries, original languages and format from two independent sources; a national film database may be one of them. Record conflicts; do not average them.
2. TITLES. Collect titles[] in the original script first, then transliteration, release, broadcast and dubbed titles, each with its language and kind. Dubs and retitled releases are versions[], never new entities.
3. RELEVANCE. Assign primary | substantial | setting with one evidence sentence. If it is below "setting", stop and add it to the wanted-list instead.
4. ABOUT. Add about and set_in relations to existing museum entities; create stubs for missing ones. An entry with no about or set_in edge is not finished.
5. DEPICTION. Fill depiction{} for prophets, Companions and Imams from sources, in words. If the Prophet is depicted in any form, set sensitivity: figurative-prophet.
6. RECEPTION. Add dated, sourced reception[] entries (approvals, objections, fatwas, bans, cuts, awards, protests). Where receptions conflict, add a perspectives block. Report; do not judge.
7. WATCH. Add watch[] only for official sources (rights holder, licensed service, the broadcaster's own channel, a public-domain archive file), each with kind, region and today's date. If none can be verified as official, leave it empty.
8. Copy nothing but the identifier from IMDb, TMDB or all-rights-reserved databases. No poster, no still.
9. Write content/en and content/ar prose: Brief, What it is about, How it was made, How it depicts sacred figures, How it was received, Versions. No rating, no review, no recommendation. Validate. Leave status.review: draft.
```

---

## R · Figure with story roles (any side)

```
Create or extend [person|group|polity]/[slug] per docs/plan/13-figures.md, using Prompt D for retrieval, extraction and verification, with these additions:
1. story_roles[]: list every documented role from schema/enums/story-roles.yaml with start and end dates, the entity it was toward, sources and claim status. Include opposition, protection, alliance and changes of side. If traditions disagree about a role, store each with its perspective.
2. faith[]: only with a basis (self-identified, documented, tradition, debated, unknown). For a living person only self-identified is allowed; otherwise unknown. Never infer from name, family or origin.
3. labelled[]: epithets and curses given by others, each with who gave it and a source. Never use them in prose.
4. Relations: for every conflict, debate, treaty or correspondence, link the event and the people on the other side (fought, debated_with, corresponded_with, allied_with, protected, persecuted, critic_of, responded_to).
5. Prose: describe acts and attribute judgements. State this person's own case as they or their sources state it, then the responses as their holders state them. No "enemy", "hero", "villain", "infidel" or equivalents in the museum's voice. Do not quote abuse at length; do not reproduce hate imagery.
6. If the person is a perpetrator of recent mass violence: minimal record only (name, date, act, court outcome), no image, and link to the event page centred on the victims.
7. Flag review tier A for living persons, sectarian conflicts and modern political figures. Validate. Leave status.review: draft.
```

---

## S · Theme hub and tension cards

```
Open the theme hub [theme slug] per docs/plan/14-themes-atlas.md.
1. From .cache/graph.json list every entity tagged with the theme, by class, period and region, and print the empty cells against the minimum set in §1.
2. Propose the entities that would fill the most important gaps (people from at least 3 traditions and 4 regions and from several role families; events; works; practices; datasets; screen titles) and add them to data/_stubs.yaml with one-line reasons.
3. Write exhibit/theme-[slug] (kind: theme-guide): 600–900 words in the docent voice, using only existing entities, covering what the texts say, what the schools hold, and what happened in practice, kept as three labelled layers.
4. Write ten starter questions (Prompt I).
5. List the theme's tensions. For each write a tension card: kind (textual | between-schools | ideal-and-history | tradition-and-modernity), the statement in the words of those who raise it with sources, the passages involved, and the responses of each tradition and of academic scholarship in their own terms with sources. At least two cited voices. No resolution, no verdict.
6. For practices under this theme, fill basis[] per tradition (scriptural, prophetic-practice, juristic, customary, contested) with citations and regions.
7. Validate, preview /en/themes/[slug] and /ar/themes/[slug], and report what the hub still lacks.
```

---

## T · Local harvest scripts (written once; the harvest itself runs without Claude)

```
Write the harvest scripts specified in docs/plan/15-local-harvest.md under scripts/harvest/ (Python 3.12, run with uv on macOS, no cloud services, no calls to any hosted model). Every script: reads its sources from the registry sources.yaml and refuses a source that is not registered; sends the harvest User-Agent; is resumable from a checkpoint; logs one line per item; writes only inside $HARVEST; records sha256 of every download; tags every output with its licence layer.
Scripts: wikidata/run_queries.py (paginated SPARQL from queries/*.rq, serial, with back-off) · wikidata/filter_dump.py (stream the JSON dump from stdin, keep seeds and one-hop neighbours, write Parquet) · wikipedia/select_pages.py (offline category walk in DuckDB from page.sql.gz and categorylinks.sql.gz with depth limit, stop-list and the two-signal rule) · wikipedia/extract.py (mwxml + mwparserfromhell: QID, titles, categories, infobox hints, references with ISBN/DOI, section text into SQLite FTS5) · quran/verify_quran.py (exists) · quran/compare_witness.py (report differences between two Qur'an text files, change nothing) · quran/generate_passages.py (work/quran, 114 suras, 6,236 passages, verbatim text, Tanzil attribution) · screen/candidates.py (the signals of docs/plan/12 §5) · directories/*.py (one per registered directory) · web/ (Scrapy project with ROBOTSTXT_OBEY = True and a one-second delay) · llm/ (Ollama client with JSON-schema outputs for relevance, claims, relations, reconciliation, judge, draft, translate; gold-set runner that blocks batches below the bar) · promote.py (candidates → data/ and content/ on a branch, with provenance.layer) · status.py.
Add tests with small fixtures for each script, including a fixture Qur'an file and a fixture category tree that leaks. Do not download anything while writing or testing. Report honestly what was not tested.
```

---

## Q · Ingest a new source book (for Devin or any autonomous agent)

Repeats the الرحيق المختوم pass (`17-raheeq-makhtum.md`) for another book: inspect, OCR with Apple Vision, analyse, write the plan document with a chapter-to-entity map, and finish by producing the drilling prompt for a later content session. Attach the PDF when running it.

```
You are ingesting a new source book for islam.museum, an open, Arabic-first, static digital museum of Islam whose content is a knowledge graph in git. The attached file is the book. Your job is to repeat, for this file, exactly what was done for «الرحيق المختوم», which is documented in docs/plan/17-raheeq-makhtum.md, and to end by producing a drilling prompt that a later session will use to mine the book into entities.

READ FIRST (in the repo ~/Documents/GitHub/islam-museum, branch main)
docs/plan/00-README.md, docs/scope.md, docs/language.md, CLAUDE.md, docs/plan/02-content-model.md, docs/plan/05-editorial.md, docs/plan/09-ai-content-pipeline.md, docs/plan/15-local-harvest.md §3 (licence layers) and docs/plan/17-raheeq-makhtum.md (your template: copy its structure, section by section).

ENVIRONMENT RULE
OCR must be done with Apple Vision (the macOS text-recognition framework) through the Python package `ocrmac`, because it produced clean Arabic on the previous book at under a second per page. Apple Vision exists only on macOS. Before anything else, run `uname -s`. If it prints "Darwin", do the OCR yourself as described below. If it does not, do NOT substitute another OCR engine: prepare the two scripts below in the harvest folder, print the exact commands the user must run on their Mac, stop, and ask the user to run them and upload the resulting pages.json, book.txt and the page images; then continue from step 3 with those files.

STEP 1 · INSPECT THE FILE (do not skip)
1. Record size, page count, PDF metadata (title, author, creator, producer, dates) with pymupdf: `uv run --quiet --with pymupdf python -c "import pymupdf,sys; d=pymupdf.open(sys.argv[1]); print(d.page_count, d.metadata)" "<ATTACHED_PDF>"`.
2. Test for a text layer: total extractable characters over all pages and the number of pages with fewer than 20 characters. If most pages have real text, keep that text as the primary layer and still OCR for comparison only if it is poor. If the file is image-only (as the previous book was), OCR is required.
3. Identify the book: title, author, edition, publisher, year, language, and whether it is a classical public-domain work, a modern copyrighted work, or a scan from a sharing site. Decide the licence layer per docs/plan/15 §3 (public domain → `pd`; modern copyrighted reference → `copyrighted-reference`: facts and citations only, quotes ≤ 40 words, text never in the repo).
4. Report these findings to the user in a short table before OCR.

STEP 2 · OCR WITH APPLE VISION (macOS only)
Create the harvest folder `~/islam-museum-harvest/raw/books/<book-slug>/` (ASCII slug from the title) and write this script there as `ocr_apple_vision.py`:

#!/usr/bin/env python3
"""OCR every page with Apple Vision (ocrmac). Writes pages.json, book.txt and page PNGs. Deterministic; resumable."""
import sys, json, time, pathlib, pymupdf
from ocrmac import ocrmac
src = sys.argv[1]; langs = sys.argv[2].split(",") if len(sys.argv) > 2 else ["ar-SA"]
out = pathlib.Path("."); (out/"pages-png").mkdir(exist_ok=True)
doc = pymupdf.open(src); t0 = time.time(); pages = []
for i in range(doc.page_count):
    pno = i + 1; png = out/"pages-png"/f"p{pno:03d}.png"
    if not png.exists(): doc[i].get_pixmap(dpi=200).save(str(png))
    res = ocrmac.OCR(str(png), language_preference=langs, recognition_level="accurate").recognize()
    lines = sorted(res, key=lambda r: (-r[2][1], -r[2][0]))      # top to bottom, right to left
    pages.append({"page": pno, "text": "\n".join(r[0] for r in lines), "boxes": len(res)})
    if pno % 25 == 0: print(f"{pno}/{doc.page_count} pages, {time.time()-t0:.0f}s", flush=True)
(out/"pages.json").write_text(json.dumps(pages, ensure_ascii=False))
(out/"book.txt").write_text("\n".join(f"\n\n===== [p{p['page']}] =====\n{p['text']}" for p in pages))
print("done", len(pages), "pages", f"{time.time()-t0:.0f}s")

Run it from inside that folder: `uv run --quiet --with pymupdf --with ocrmac python ocr_apple_vision.py "<ATTACHED_PDF>" ar-SA` (add other language codes, comma-separated, if the book mixes languages; use `en-US` for English books). Use `caffeinate -i` in front of the command for books over 300 pages. Expect under one second per page on Apple Silicon.
Then quality-check: print the text of three pages from the start, middle and end next to their PNGs; confirm Arabic shaping, line order and footnote capture; note systematic OCR errors (on the previous book the honorific ﷺ came out as علله / علا / عليل / عل / عليا) and record them in a `README.md` in the folder together with the licence layer and the command used. Copy the PDF into the folder under an ASCII name.

STEP 3 · FIND THE STRUCTURE
1. Determine whether PDF page numbers equal printed page numbers by reading the running footers (e.g. "- ٦٠ -") on several pages; record the offset.
2. Locate the table of contents (often the last pages in Arabic books, the first in others) by counting lines that end in a number; dump it to `toc.txt` with page markers. Locate the bibliography (`bib.txt`) and the front matter (`front.txt`).
3. Parse the table of contents into a list of {title, page_start, page_end, level}; save as `toc.json`. Verify ten random entries against the page text.

STEP 4 · ANALYSE THE BOOK FOR THE MUSEUM
Read the table of contents in full and sample at least one page per major section. Then decide, with reasons:
- what period(s), region(s) and wings of the museum the book serves, and which existing entities in data/ it will enrich (search data/ for overlapping IDs);
- which classes it yields and in what quantities (event, journey, place, building, person, group, polity, concept, practice, work, passage edges, object, dataset, question, exhibit, map blocks, source entities from its bibliography), following the table format of docs/plan/17 §2;
- a chapter map: every major section with its page range and what it becomes (docs/plan/17 §3 format);
- the book's sectarian position and reliability class per docs/scope.md and docs/plan/09 §2 (T1 primary, T2 reference, T3 pointer); which sections are contested and need a perspectives block and Tier A review;
- rights: what may be ingested, quoted (≤ 40 words) or only cited;
- a batch order of at most 25 entities per batch, richest and best-sourced sections first.

STEP 5 · WRITE THE PLAN DOCUMENT
Create docs/plan/<NN>-<book-slug>.md where NN is the next free number, with exactly these sections, modelled on docs/plan/17: title and one-paragraph description of the book and the copy; 1 Rights and how the book may be used; 2 What the book yields (by museum class); 3 The chapter map; 4 The pipeline for this book (OCR done, clean, segment, extract, judge, draft in Arabic, validate, PR); 5 Order of work; 6 The drilling prompt; 7 Acceptance tests. Add a row for it in docs/plan/00-README.md in numeric order and one sentence in docs/plan/06-roadmap.md pointing to it under the phase it serves.

STEP 6 · THE DRILLING PROMPT (section 6 of your document, and your final message)
Write a complete, self-contained prompt that a later content session (any capable model) can paste to mine the book, with the same skeleton as docs/plan/17 §6: INPUTS (the harvest folder paths, the page-offset rule, the repo), RULES (Arabic first; rights and the 40-word quotation limit; citations to the book page AND the primary source it cites; Sunni default frame with labelled other views; claim status; dates recorded exactly as the book gives them in the source calendar; the OCR error list to watch for; no figurative depiction of prophets; everything status draft with provenance), PROCEDURE per batch (load pages, claims table with page and ≤ 40-word quote, reuse-or-create entities by class with the fields each needs, Arabic prose in the docent voice with {cite:} and [[links]], stubs, validate, batch report, branch and pull request), BATCH ORDER (every section with page ranges and Tier A marks), QUALITY BAR, and the closing instruction to show the claims table for batch 1 before writing files. Tailor every list to this book: its sections, its contested topics, its OCR quirks, its citation style.

STEP 7 · DELIVER
- Nothing from the book's text goes into the repo; only the plan document and index/roadmap edits do.
- Run `npm run validate` if you touched anything under data/ (you should not have).
- Commit with a conventional message ("docs: plan NN — mining <book> into <what it serves>"), push to main (if main is protected, open a pull request and say so).
- Final message: the inspection table, the OCR statistics (pages, seconds, characters, error patterns), the harvest folder path, the entity-yield table, a link to the plan document, and the full drilling prompt in a code block.
```

## U · Fatwa Explorer: find, OCR and ingest Sunni fatwa books, and build the explorer (Claude Code on the Mac)

Added 31 October 2026 at the founder's request. A self-contained prompt for a Claude Code session on the founder's MacBook: it writes the fatwa-explorer proposal and stops for approval (schema, enum, predicate and site changes need it under `docs/ai-change-gates.md`), finds the major Sunni fatwa books with the Chrome browser (canon gate §1a), OCRs them with Apple Vision, models each fatwa as a `work` (asker, mufti, date, place, ruler, judge, evidence, the precedent chain, reception), lists today's Sunni fatwa websites as an index that links back to them (no bulk copying), and builds the Fatwa Explorer with a landing section explaining that a fatwa is one scholar's answer for its time, place and asker, not a ruling for the reader.

Run: `cd ~/Documents/GitHub/islam-museum`, start `claude --chrome` (or `/chrome` in a session), paste the block.

```

You are building **the Fatwa Explorer** for islam.museum: a body of Sunni fatwas from the Companions to today, mined from
the major Sunni fatwa books, modelled as a connected graph (who asked, who answered, when, under which ruler, on what
basis, which earlier fatwas it rests on and which later fatwas rest on it), and shown in an explorer as rich as the
Qur'an (surah) explorer. You work on this Mac. You use the Chrome browser to find the books, Apple Vision to OCR them,
and your own reading (this Claude session and its subagents) to turn them into museum entities.

The museum **records fatwas as history. It never issues a ruling and never tells the reader what to do.** Every page
says who said what, when, to whom and on what basis, and the reader is told to ask a qualified scholar for their own
case. Hold to this in every sentence you write.

## 0 · Read first, and check the machine

1. Run `uname -s`. It must print `Darwin`. If it does not, stop: Apple Vision exists only on macOS.
2. Repo: `~/Documents/GitHub/islam-museum`. `git fetch origin` and create your own worktree:
   `git worktree add ../islam-museum-fatwa -b claude/fatwa-explorer origin/main`, link `node_modules` from the main
   clone (never commit the link), and work only there. Harvest workspace (outside git): `~/islam-museum-harvest/`
   (`$HARVEST`); fatwa books go in `$HARVEST/raw/books/fatwa/<book-id>/` and `$HARVEST/books/fatwa/<book-id>/`.
3. Read, in this order, and follow them over anything in this prompt if they conflict:
   `AGENTS.md`; `docs/ai-change-gates.md` (all of it: proposal gate, §1a harvest canon gate, merge gate, quality gate,
   §8 no-go registry); `docs/agents/README.md`, `workflow.md`, `content-standards.md`, `publication-standard.md`,
   `mining-sources.md`, `categories/aqeedah-fiqh.md`, `categories/hadith.md`, `lanes.md`, `lanes/library.md`,
   `lanes/muwatta-prose.md` (a finished book lane to copy); `docs/scope.md`, `docs/language.md`,
   `docs/sources-policy.md`; `docs/plan/02-content-model.md`, `13-figures.md` (`condemned`, `responded_to`),
   `14-themes-atlas.md` (`work.kind: fatwa`, `event.kind: fatwa-event`, `issued`, `rules_on`), `15-local-harvest.md`,
   `20-opinions.md` (perspectives and opinions), `21-landing-and-explorers.md`, `07-prompts.md` section «Q · Ingest a new source book» (the book
   ingest template and the Apple Vision OCR script); `docs/site/README.md` (before any site change).
4. Look at what exists, and reuse it:
   - `schema/enums/kinds.yaml`, `schema/work.schema.json`, `schema/event.schema.json`, `schema/predicates.yaml`,
     `schema/enums/roles.yaml`, `scripts/gen-schema.ts`.
   - Fatwa books already in `data/work/` (all filed as `kind: book` today), for example
     `al-fatawa-al-kubra-ibn-taymiyya`, `fatawa-alamgiriyya`, `fatawa-qadikhan`, `fatawa-ibn-zarb-al-qurtubi`,
     `al-fatawa-al-kubra-al-fiqhiyya`, `mecmu-u-fetava`, `al-fatwa-al-hamawiyya`, `fatawa-ali-al-tantawi`,
     `al-fatwa-fi-al-islam`, `fatwa-on-terrorism`, `al-mudawwana-al-kubra`, `radd-al-muhtar`; `majmu-fatawa` in
     `scripts/harvest/library/books.yaml`; `question/what-is-fatwa`; `concept/al-fatwa-ala-al-fadaiyyat`;
     groups `council-of-muslim-elders` and `indonesian-ulama-council`; `concept/ijtihad`, `concept/fiqh`.
     Run `grep -rli "فتو\|fatw\|fetva\|نوازل\|nawazil\|مسائل" data/ content/` and list every hit before you design.
   - The surah explorer (`site/src/pages/[lang]/surah/`, `site/src/components/SurahMap.astro`,
     `ExplorerModule.astro`, `ExploreBar.astro`), the entity page (`site/src/pages/[lang]/[class]/[slug].astro`), the
     perspectives component from plan 20, `TimeStrip.astro`, the graph view (`/ar/graph/`), and the harvest tools in
     `scripts/harvest/library/` (`fetch_books.py`, `ocr_all.py`, `ocr_book.py`, `ocr_page.py`, `slice_pages.py`,
     `make_sources.py`, `make_work_order.py`, `verify_cites.py`, `claims_pipeline.py`, `authenticity_gate.py`).
     Extend these tools rather than writing parallel ones.

## 1 · Phase 0: the written proposal (stop here for approval)

The change gates allow no edit without an approved written proposal, and a schema, enum, predicate, i18n or new site page
change needs the founder's own approval. So your first deliverable is a proposal, nothing else:

Write `docs/plan/<NN>-fatwa-explorer.md` (NN = next free number) and show it in chat. It must contain:
- the data model of section 2 below, as you finally design it after reading the schema (every new field with its type,
  every new enum value, every new predicate with domain, range, inverse and Arabic/English labels, and why an existing
  one does not fit);
- the explorer design of section 5 (routes, components, the build-time JSON, where it lives under the R2 hosting rule);
- the book list from Phase 1 (or the method, if Phase 1 has not run yet);
- a new lane `fatwa` (scope, owner line for `docs/agents/lanes.md` and `docs/status.md`, its progress file
  `docs/agents/lanes/fatwa.md`, its stubs file `data/_stubs.d/fatwa.yaml`);
- every file the work touches, the intent of each diff, and the risk label for each part, chosen honestly per gate §3
  (enum and predicate additions, new site routes and i18n keys are proposals of their own; adding content in an
  approved lane is `non-impacting`; do not add a new entity class, since that changes the class list the
  submissions quote);
- the acceptance tests of section 7.

Commit the proposal alone (`docs: plan NN, fatwa explorer proposal`), open a pull request, and **stop and ask me to
approve it**. Do not touch schema, data, site or the canon before I say yes. Phase 1 (discovery, below) changes nothing
in the repo, so you may run it while you wait, and fold its results into the proposal.

## 2 · The data model: what a fatwa is in the museum

Design this properly before you ingest anything; the explorer is only as good as the data. Starting point, to be checked
against the schema and refined in the proposal:

**One fatwa = one `work` with `kind: fatwa`.** A fatwa book = a `work` with a new kind `fatwa-collection` (propose it;
`nawazil` and `masa'il` books, Ottoman fetva mecmuaları and council resolution volumes are collections too, with a
`collection_type` field). The single fatwa is `part_of` its collection, with the printed volume and page.
The famous *act* of issuing (when it changed events) also gets an `event` with `kind: fatwa-event`, linked to the work.

Fields a fatwa needs (names are suggestions; reuse existing schema fields wherever one fits):

| Group | Field | What it holds and how it shows |
|---|---|---|
| The question (istifta') | `question.summary` {ar,en,ur} | the question in the museum's words, attributed («سُئل … عن …»). Short verbatim quote of the question allowed, ≤ 40 words, with page. |
| | `asker` | link to `person` / `group` / `polity` when named. When the book says «سئل عن رجل…» the asker is **unnamed**: record `asker_description` («رجلٌ من أهل …», «جماعة من التجار») and never guess a name. |
| | `asker_role` | enum: ruler, qadi, official, scholar, student, merchant, community, commoner, institution, unnamed. Drives the explorer's "who was asking" filter. |
| | `asked_from` | place the question came from (often different from where it was answered, e.g. a letter from al-Andalus to Fez). |
| | `form` | oral, letter, written slip (ruq'a), court referral, Ottoman fetva form (with the "Zayd/Hind" placeholders noted), council resolution, broadcast, website. |
| The answer | `mufti` → predicate `issued` / `issued_by` | person or group (council, Dar al-Ifta). Their madhhab comes from the person/group entity, not retyped. |
| | `answer.summary` {ar,en,ur} | what the mufti answered, attributed («أجاب ابن رشد بأن …»), never in the museum's voice as a rule. ≤ 40-word quote allowed. |
| | `rules_on` | the `concept` / `practice` / `group` the fatwa is about (existing predicate). |
| | `fiqh_area` | enum tree: ibadat, mu'amalat, family, inheritance, crimes and penalties, judiciary, governance and siyasa, jihad and relations, food and dress, creed-related, medicine and science, new matters (nawazil). |
| When and where | `date` | the museum's date object: EDTF + Hijri string + calendar + precision; derived conversions marked. If only the mufti's lifetime is known, record the span with low precision, never a guessed year. |
| | `place` | where it was issued. |
| | `period` | link to `period/*` (derived from the date when not stated). |
| Power and court | `ruler_at_time` | the caliph, sultan, emir or state in power where it was issued, as a link; `ruler_role`: asker, addressee, subject of the fatwa, enforcer, opponent, merely contemporary. Only "merely contemporary" may be derived from dates and place; every other role needs the source to say it. |
| | `judge` | a qadi who referred the question, ruled on it, or applied it; and the court case (`event` kind `court-ruling`) if there is one. |
| The basis | `evidence[]` | each item typed: `quran` (link `[[passage/quran-S-A]]`, never typed text), `hadith` (link to a `passage` with collection ref and grade with grader), `ijma`, `qiyas`, `athar` of a Companion, `maslaha`, `urf`, `istihsan`, `sadd al-dhara'i`, an earlier scholar's opinion, an earlier fatwa. |
| | `method` | the usul method the book names, if it names one. |
| The chain (precedent) | `relies_on` / `relied_on_by` (new, work → work or passage) | an earlier fatwa or opinion this one cites or follows («وبه أفتى…», «كما في الخانية», «نقلاً عن…»). This is the fatwa equivalent of case precedent, and the heart of the explorer. |
| | `agrees_with` (symmetric) / `responded_to` (existing) | a parallel fatwa with the same answer; a counter-fatwa or refutation. |
| | `revised_by` / `revises` | the mufti's own later change of view (ruju'), or a later mufti in the same school replacing it as the relied-upon position (mu'tamad). |
| | `codified_in` | a later law, code or court practice that adopted it (e.g. Ottoman qanun, the Majalla, a modern statute). |
| Reception | `reception` | how it was received, each item cited: endorsed by, contested by, applied by a ruler, ignored, became the school's relied-upon position. Contested fatwas use a `perspectives` block (Sunni positions first, then academic, then other, each labelled and cited, no verdict) and, where it is a hard question, a tension card. |
| | `consequence` | an `event` the fatwa led to or legitimised (a campaign, a deposition, a waqf, a ban), only when the source says so. |
| Attribution | `attribution_status` | claim status: is this fatwa really his? (certain, attributed, disputed, weak). Some famous "fatwas" are later attributions: record who disputes them. |
| | `transmitted_by` | who recorded the fatwa (the student who wrote the answer down, the compiler of the collection). |
| | `sources[]` | the collection, volume, page (the PDF page and the printed page offset recorded once per book), and any second source. |
| Display aids | `headline` {ar,en,ur} | one line: «فتوى ابن رشد للمرابطين في …». |
| | `sensitivity` | existing enum: takfir, apostasy, jihad, rebellion, slavery, women and minorities get a sensitivity flag, a perspectives block and the context the book gives. |

Also propose, in the same proposal: `concept/fatwa` and `concept/ifta` (definition from the adab al-mufti books, each
school's definition in perspectives), the role `mufti` (and `shaykh-al-islam`, `qadi` if missing) in
`schema/enums/roles.yaml`, and whether `passage.kind` needs a `fatwa` unit or whether a fatwa quotation is simply the
`work` entity's ≤ 40-word quote (prefer the second; say why).

Anything else you find in the books that a visitor would value, add to the proposal: for example the fee or stipend of
the office, the formula of the answer («والله أعلم»), the seal of the Ottoman Shaykh al-Islam, the language of the
fatwa, whether the asker was a non-Muslim, cross-references between madhhabs on the same question.

## 3 · Phase 1: find the books (Chrome, read-only for the repo)

Goal: the major **Sunni** fatwa books from the first century to today, in the best open copy.

1. Use the Claude in Chrome tools to search, in Arabic and English, on: archive.org (also via the `ia` CLI),
   waqfeya.net, noor-book.com, al-maktaba.org, shamela.ws, the OpenITI corpus (GitHub / Zenodo releases, already
   machine-readable), the Qatar Digital Library, HathiTrust, and the official sites of fatwa bodies (Dar al-Ifta
   al-Misriyya, the Saudi Permanent Committee at alifta.gov.sa, the International Islamic Fiqh Academy of the OIC, the
   Muslim World League Fiqh Council, Majelis Ulama Indonesia, Dar al-Ulum Deoband). Open a new tab; do not use my
   logged-in tabs; never sign in, pay, accept terms on my behalf, or fill a form. Read each site's licence or terms page
   and record it.
2. Prefer, in this order: a clean text layer or an OpenITI / Shamela text file → a good scan with a text layer → an
   image-only scan (OCR). Prefer a critical edition (tahqiq) over a reprint; record edition, editor, publisher, year,
   volumes.
3. Coverage: every era and every school, plus the books *about* fatwa. A starting list to verify (each must be checked;
   it is neither complete nor proven):
   - **Companions and early generations**: fatwas gathered in the Musannafs of Abd al-Razzaq and Ibn Abi Shayba (in the
     canon already); Ibn al-Qayyim's I'lam al-muwaqqi'in (the muftis of the Companions and the ethics of fatwa); the
     Masa'il of Ahmad ibn Hanbal in his students' recensions (Salih, Abd Allah, Abu Dawud, Ishaq al-Kawsaj, Ibn Hani);
     al-Mudawwana (Malik's answers through Ibn al-Qasim).
   - **Hanafi**: al-Nawazil of Abu al-Layth al-Samarqandi; Fatawa Qadikhan; al-Fatawa al-Walwalijiyya;
     al-Fatawa al-Bazzaziyya; al-Fatawa al-Tatarkhaniyya; al-Fatawa al-Hindiyya; al-Fatawa al-Khayriyya; Ibn Abidin's
     al-Uqud al-Durriyya and Sharh Uqud Rasm al-Mufti; Ottoman: the fatwas of Ebussuud, Fetava-yi Ali Efendi,
     Behcetü'l-Fetava; South Asia: Fatawa Rizwiyya, Imdad al-Fatawa, Kifayat al-Mufti, Fatawa Dar al-Ulum Deoband,
     Fatawa Mahmudiyya.
   - **Maliki**: Fatawa Ibn Rushd al-Jadd; Ibn Sahl's al-Ahkam al-Kubra and Qadi Iyad's Madhahib al-Hukkam (court
     rulings, the closest thing to case precedent); Fatawa al-Shatibi; al-Wansharisi's al-Mi'yar al-Mu'rib (the largest
     nawazil corpus); al-Wazzani's al-Mi'yar al-Jadid; Fatawa Ibn Zarb (already a work).
   - **Shafi'i**: Fatawa Ibn al-Salah and his Adab al-Mufti wa al-Mustafti; Fatawa al-Izz ibn Abd al-Salam; Fatawa
     al-Nawawi and his Adab al-Fatwa; Fatawa al-Subki; al-Suyuti's al-Hawi lil-Fatawi; al-Haytami's al-Fatawa al-Kubra
     al-Fiqhiyya; Fatawa al-Ramli; Fatawa Zakariyya al-Ansari.
   - **Hanbali**: Ibn Taymiyya's Majmu' al-Fatawa and al-Fatawa al-Kubra; Ibn Hamdan's Sifat al-Fatwa; al-Durar
     al-Saniyya; Fatawa Muhammad ibn Ibrahim Al al-Shaykh; Majmu' Fatawa Ibn Baz; Majmu' Fatawa Ibn Uthaymin; Fatawa
     al-Lajna al-Da'ima.
   - **Usul of fatwa**: al-Qarafi's al-Ihkam fi Tamyiz al-Fatawa an al-Ahkam; Ibn al-Salah, al-Nawawi, Ibn Hamdan,
     Ibn al-Qayyim and Ibn Abidin above.
   - **Modern and institutional**: al-Fatawa al-Islamiyya min Dar al-Ifta al-Misriyya; Fatawa Muhammad Abduh and Rashid
     Rida (al-Manar); Fatawa Mahmud Shaltut; Fatawa Mustafa al-Zarqa; Yusuf al-Qaradawi's Fatawa Mu'asira; the
     resolutions of the OIC and MWL fiqh academies; the European Council for Fatwa and Research; MUI fatwas; Fatawa Ali
     al-Tantawi (already a work).
4. For every candidate: run the **§1a harvest canon gate** exactly: check whether it is already processed (data/,
   content/, docs/delegation/library/, `_stubs.d/lib-*`, `$HARVEST/books/`), verify the author is Sunni from a defined
   source (Wikipedia infobox and Wikidata, URL and date) and record it in `scripts/harvest/library/exclusions.yaml`;
   non-Sunni or unverified authors are not added. A madhhab alone is not proof.
5. Output: `$HARVEST/books/fatwa/catalogue.json` and a table in chat: id, title (ar/en), author, death AH, school,
   era, collection type, edition, best URL, format (text / text-layer PDF / scan), size, licence or terms, Sunni check
   result, already-processed result, priority (A: rich in askers, rulers and dated cases, or heavily cited by later
   books; B; C).
6. After approval, add the verified books to `scripts/harvest/library/books.yaml` under a new `cat: fatwa` (one commit,
   with the exclusions records), and make `fetch_books.py` accept that category if it does not already.

## 4 · Phase 2: download, OCR, structure (after approval)

1. Download into `$HARVEST/raw/books/fatwa/<book-id>/` (read-only once written), with
   `User-Agent: islam-museum-harvest/0.1 (https://islam.museum)`, two connections at most, polite delays, resumable
   (`aria2c` / `curl -C -` / `ia download`). Record a SHA-256 and the source URL in `meta.json`. Nothing from here ever
   enters git.
2. Text layer first: measure extractable characters per page with pymupdf. Keep a good text layer or the OpenITI file
   as the primary text.
3. Image-only or poor pages: OCR with **Apple Vision** through the existing tools (`ocr_all.py` / `ocr_book.py`, or the
   `ocr_apple_vision.py` script in `docs/plan/07-prompts.md` section «Q · Ingest a new source book»): `ar-SA` (add `en-US`, `tr-TR`, `ur-PK`,
   `fa-IR` for mixed books), `recognition_level="accurate"`, 200 dpi, resumable, two-column pages read right column
   first, under `caffeinate -i`, e.g.
   `caffeinate -i uv run --quiet --with pymupdf --with ocrmac python scripts/harvest/library/ocr_all.py --cat fatwa --only <book-id>`.
   Output per volume: `pages.json`, `book.txt` with `===== [pN] =====` markers, `pages-png/`, `README.md`
   (command, timing, licence layer, OCR error list).
4. Quality check every volume: start, middle and end pages beside their images; note systematic errors (honorific
   glyphs, الله as «االله», numbers, names); record the printed-page offset at several points.
5. Structure: find the table of contents and indexes; parse each collection into **one record per fatwa**:
   `fatwas.jsonl` with volume, PDF page range, printed pages, bab/kitab heading, the question's opening words, the
   mufti (for multi-mufti collections like the Mi'yar), any date, place, asker or ruler named, and every citation of an
   earlier authority or book (detect formulas such as «كما في …», «وبه أفتى …», «نقلاً عن …», «خلافاً لـ …»,
   «سُئل … فأجاب»). This file is the raw material for the precedent graph. It stays in `$HARVEST`.
6. Per book, write the plan document as section «Q · Ingest a new source book» of `docs/plan/07-prompts.md` does (rights, yield table, chapter
   map, batch order), plus a short entry in `docs/agents/lanes/fatwa.md`.

## 5 · Phase 3: ingest into the museum (batches)

Do not try to enter every fatwa of every book (Majmu' al-Fatawa alone holds thousands). Breadth comes from linking.
Per collection:
1. The collection: `source/*` (edition) and `work/*` (`kind: fatwa-collection`), the author as a full `person`
   (nasab, kunya, laqab, dates, teachers, students, offices: mufti of where, under whom), rich first pass.
2. **Individual fatwa entities** for, in this order: fatwas with a named asker, ruler or qadi; fatwas tied to a dated
   event; fatwas that later books cite (from the citation formulas in `fatwas.jsonl`, i.e. the precedent hubs);
   fatwas on topics that already have a `concept` / `practice` / `event` page; the famous fatwas every history of the
   subject mentions. Verify each candidate in the books themselves; examples worth checking (not facts until a source
   says so): al-Ghazali's answer to the Almoravid ruler on the taifa kings; Ibn Rushd al-Jadd's answers to the
   Almoravids; al-Izz ibn Abd al-Salam and the Mamluk emirs; the Mamluk-era coffee question in Mecca; Ebussuud on cash
   waqf; the Ottoman fatwa on the printing press (1727); al-Wansharisi's Asna al-Matajir on Muslims under Christian
   rule; Ibn Taymiyya's Mardin fatwa (contested: perspectives block); Muhammad Abduh's Transvaal fatwa; the Amman
   Message. Skip fatwas by non-Sunni authorities (they are outside this lane), though an existing entity such as
   the 1989 Rushdie fatwa stays where it is and may be linked as context.
3. The edges: `issued`, `rules_on`, `part_of`, `relies_on`, `responded_to`, `agrees_with`, `revised_by`,
   `codified_in`, asker and ruler links, evidence links to existing `passage` entities (Qur'an by Tanzil reference only,
   hadith by collection ref). Write each edge once; inverses are computed. Unknown targets become stubs in
   `data/_stubs.d/fatwa.yaml`.
4. Prose: Arabic first in `content/ar/work/<slug>.md`, with English and Urdu in the same commit, `status.review:
   published`, `provenance` block (`generated_by`, `model`, `run`, `source`), `{cite:…}` after every factual sentence,
   docent voice: describe, attribute, label. No honorifics typed. No Qur'an text typed. Quotes ≤ 40 words. Never «the
   correct view», never «you must». Contested fatwas: perspectives block and, where it fits, a tension card.
5. Batches of at most 25 entities. For batch 1 of each book, **show me the claims table first** (fatwa, page,
   ≤ 40-word quote, asker, mufti, date, ruler, relies_on) before you write files.
6. Every batch: `npm run validate` (0 errors) `&& npm test && npm run coverage`, then commit explicit paths (never
   `git add -A`), conventional message, trailers `AI-Agent: Claude Code`, `AI-Model: <the model this session reports>`,
   `AI-Editor: Claude Code CLI`, plus the repository's Co-Authored-By line. Merge gate before every push:
   `git fetch origin`, read `git log HEAD..origin/main --stat`, rebase or merge keeping both sides, never force-push.
   Push the branch, open a PR, merge it yourself when CI is green. Keep `docs/agents/lanes/fatwa.md` current after
   every batch (what is done, what is next, page reached in each book).

## 5b · Phase 3b: today's fatwa websites

Goal: record the most famous and widely used **Sunni** fatwa websites of today, map what they hold, and bring
their fatwas into the explorer **as an index that links back to them**. Do not copy their text.

Why not copy everything: their fatwas are copyrighted, and their terms usually forbid bulk copying. The museum's own
rules allow facts and ≤ 40-word cited quotations, and forbid a sentence-by-sentence rewording (`mining-sources.md`).
And `docs/plan/01-vision.md` says the museum is not a fatwa site. So the sites stay the place where a visitor reads the
full answer, and the museum adds context, connections and the link.

1. **Find them** with the browser: the official bodies (Dar al-Ifta al-Misriyya, Al-Azhar's fatwa centre, the Saudi
   Permanent Committee / alifta.gov.sa, the UAE General Authority of Islamic Affairs, the Jordanian Ifta Department,
   the OIC and MWL fiqh academies, Majelis Ulama Indonesia, JAKIM / Malaysian state muftis, Diyanet, Dar al-Ulum
   Deoband and Banuri Town in Pakistan, the European Council for Fatwa and Research) and the large independent Sunni
   sites (for example IslamQA, IslamWeb's fatwa centre, Darul Ifta Birmingham, SeekersGuidance answers, the official
   sites of Ibn Baz and Ibn Uthaymin). Rank them by verifiable reach: languages, number of fatwas the site states,
   years online, and independent sources that describe them. Check each one's Sunni orientation from a defined source
   (the §1a method); record its self-described orientation (`orientation.basis: self-described`) and school.
2. **Each site becomes a `work` (`kind: website`, `content_type: fatwa`)** with publisher (`group`), launch year, URL,
   languages, stated size, school or orientation, `archive_url` (Wayback snapshot), and a short description in
   ar/en/ur, marked "listed, not endorsed" (plan 14). This is the "Famous Islamic websites" theme of plan 14.
3. **Read each site's robots.txt, terms of use and copyright page, and record them in the lane file.** If robots or
   the terms forbid automated access, do not crawl the site: list it and stop there. Where a site offers an API, a
   sitemap or an open data export, use that instead of crawling pages. Where crawling is allowed: identified
   User-Agent, one request every few seconds at most, run in `$HARVEST`, resumable, raw pages kept out of git.
4. **What enters the museum from a site**, where its terms allow it:
   - an **index record per fatwa**, built from facts only: the fatwa's number and URL, title or question topic in
     our own words, the mufti or body, the date, the language, the site's category, mapped to our `fiqh_area` and
     `concept` / `practice` links. These facts feed the explorer's search and filters, and each record links out to the
     site for the full answer. Build it as a generated dataset (`dataset` entity plus a build-time JSON in R2), not as
     thousands of hand-written entities. Propose the shape in the plan before you build it.
   - **full fatwa entities** (section 2 model, rewritten summary, ≤ 40-word quote, citation and link) only for
     notable fatwas: ones that news, scholarship or later fatwas discuss, ones that answer a question the classical
     corpus also answers (so the explorer can show the same question across centuries), and official council
     resolutions.
   - aggregate facts for the website entity: counts by topic, by year, by language.
5. If a site's owners publish a licence that allows reuse (some government bodies do), record it and say what more it
   allows. If unclear, treat the site as copyrighted.
6. **Ask me before crawling more than a handful of pages from any one site.** Show the site list, each one's terms and
   robots result, and the planned volume first.

## 6 · Phase 4: the Fatwa Explorer (site)

Build it after the data model is approved and at least one pilot batch (15 to 25 fatwas across several eras and all
four schools) is in, so the design is tested on real data. Follow `docs/site/README.md`: Astro + Svelte islands +
Tailwind, works without JavaScript, WCAG 2.2 AA, Arabic first with English and Urdu, no runtime network calls, no AI
at runtime. Data JSON built at build time goes to R2 per the hosting rule (add the folder to `R2_DATA_DIRS` in
`workers/site/src/route.js`, `workers/r2-sync/batch/publish.mjs`, `run_worker_first` in
`workers/site/wrangler.production.toml` and the two removal lines in `deploy.yml`).

Pages and views (propose, then build):
- **`/[lang]/fatwa/`, the explorer landing**: a Hijri timeline strip of fatwas (reuse the timeline layout) with era
  bands; filters for school, mufti, asker role (ruler, qadi, community, commoner…), fiqh area, region, century,
  collection; a map of where questions came from and where they were answered (MapLibre, lines from `asked_from` to
  `place`); counts; a search box (Pagefind facets).
- **"What a fatwa is, and what it is not": the opening section of the landing page**, above the timeline, not
  hidden in a footer, in Arabic, English and Urdu, readable without JavaScript, and repeated in short form (one line and
  a link) on every fatwa page, mufti page and collection page. It must make sure no visitor reads a fatwa as a command
  they must follow. It says, in the museum's calm docent voice, with every claim attributed and cited:
  1. **Every fatwa is one scholar's answer.** Each fatwa here was given by a person or a body (an imam, a shaykh, a
     mufti, a qadi, a caliph, a council) and represents **that scholar's own ijtihad**: his reading of the sources for the
     question put to him. It can be right and it can be wrong. Do not state this as the museum's own verdict: attribute
     it to the scholars, who said it themselves. Find and cite the classical statements on this (for example the saying
     attributed to Malik that anyone's word may be taken or left except the Prophet's, or al-Shafi'i's saying "my view
     is right with the possibility of error"), each checked in a defined source with its page, and say when an
     attribution is disputed.
  2. **A fatwa is not binding on the reader the way a court judgment binds the parties**, and the classical books draw
     that line (fatwa as information, qada' as an enforced decision; al-Qarafi's al-Ihkam fi Tamyiz al-Fatawa an
     al-Ahkam treats exactly this). Explain the difference between fatwa, qada' (a judge's ruling) and a ruler's decree,
     with sources.
  3. **A fatwa answers one question, at one time, in one place, for one person or community.** It follows the
     situation, the generation, the place, the custom ('urf), the asker's circumstances, intention and need, and what
     was known at the time. The same question can receive a different answer elsewhere or later. Cite the classical
     basis, above all Ibn al-Qayyim's chapter in I'lam al-Muwaqqi'in on fatwas changing with times, places, conditions,
     intentions and customs, and al-Qarafi and Ibn Abidin (Nashr al-'Arf) on custom, and show it with two or three
     real examples from the data where one school's answer changed across centuries.
  4. **So a fatwa shown here may or may not apply today, where you live, or to you.** The museum shows fatwas as a
     record of how scholars answered their own times; it gives no ruling. For your own case, ask a qualified scholar
     who knows your time, place and situation. (This line is the fixed notice below, in full.)
  5. **Learn more**: 4 to 8 links to articles on what a fatwa is and how it should be read, from established Sunni
     institutions and scholars, in Arabic, English and Urdu where available. Find them with the browser and **open and
     read each one before you add it**: no link from memory, no guessed URL. Good places to look: Dar al-Ifta
     al-Misriyya (its pages on what a fatwa is and on the conditions of the mufti), Al-Azhar's fatwa centre, the
     International Islamic Fiqh Academy, Yaqeen Institute, SeekersGuidance, and well-known Sunni university or
     institute pages; Urdu from an established Sunni institution such as Dar al-Ulum Deoband or Jamia Binoria. Choose
     articles that explain fatwa, its non-binding nature and its dependence on context, not articles that issue
     rulings. Each link is stored as data (title in its language, publisher, URL, date read, an Internet Archive snapshot
     URL saved with the Wayback Machine), marked "external, listed not endorsed" like the plan-14 websites, opens
     normally (no tracking, no embed, no runtime fetch), and is checked by the existing link checks. Prefer adding each
     publisher as a `work` (`kind: website`) or `source` entity so the links live in the graph, not only in the page.
  Also expand `question/what-is-fatwa` and the new `concept/fatwa` with the same points and sources, and link both from
  this section. Text for this section goes in i18n / content files in all three languages in the same commit.
- **The fatwa page** (the entity page with a fatwa layout): headline; the question card (who asked, from where, in what
  form); the answer card (who answered, school, office, date, place, ruler at the time); the basis (Qur'an and hadith
  links, ijma, qiyas, earlier opinions); **the chain**: earlier fatwas it rests on above it, later fatwas that rest on
  it below it, counter-fatwas beside it, like an isnad turned into a family tree; reception and consequences;
  perspectives when contested; sources with page; the context of the answer stated plainly (the era, place, asker
  and circumstances it answered, so the reader sees why it may not fit another time or place); and a fixed notice,
  e.g. «هذه الفتوى اجتهادُ صاحبها في زمانه ومكانه وحال سائله، تُعرض سجلاً تاريخياً لا حكماً للقارئ؛ قد تصيب وقد
  تخطئ، وقد لا تنطبق على زمانٍ أو مكانٍ أو شخصٍ آخر. اسأل أهل العلم في حالتك.» with its English and Urdu, and a link
  to the landing-page section above.
- **Today's fatwa websites**: a directory of the listed sites (publisher, school, languages, size, link), and in the
  explorer's search and topic views the index records from section 5b, each with «اقرأ الفتوى كاملة على موقع …» linking
  out to the site, so a visitor can follow one question from the Companions to a 2026 fatwa site.
- **Precedent graph view**: the whole chain around a fatwa in the constellation view (`/ar/graph/?from=`), coloured by
  school, sized by how often it is cited.
- **Compare by question**: one question (a `concept`/`practice`), the answers of each school and era side by side,
  through the plan-20 opinions component, Sunni schools first, no verdict.
- **Mufti and collection pages**: a mufti's fatwas on a lifespan ribbon (`TimeStrip`), the rulers he answered, the
  muftis he cites and who cites him; a collection's table of contents with each fatwa linked.
- **Ruler and court lens**: on a ruler's or polity's page, «فتاوى في عهده / سُئل فيها» (fatwas asked by, about, or
  in the reign of).
- Landing-page explorer card and an entry in the explore bar, marked «قيد الإعداد» until it is ready (plan 21 rule).
- `npm run build` must pass, with `check-site`, `check-static`, the axe scan and the weight check.

## 7 · Acceptance tests (write them into the plan; make them pass)

- The validator accepts the new kinds, fields and predicates and rejects a fatwa with no source, no mufti, a typed
  honorific, typed Qur'an text, a quote over 40 words, or a ruler role other than "contemporary" without a citation.
- Every `relies_on` edge points to an existing work, passage or stub; no cycles of `revised_by`.
- Every individual fatwa has: mufti, collection and page, date object (even if a span), question and answer summaries
  in ar/en/ur, at least one source.
- The explorer pages render with JavaScript off; the timeline, filters and chain degrade to lists.
- The landing page opens with the "what a fatwa is, and what it is not" section in ar/en/ur; every fatwa, mufti and
  collection page carries the short notice and its link; every "learn more" link was opened and read, answers 200,
  and has an archive snapshot; every attributed saying in that section has a source and page.
- `npm run validate`, `npm test`, `npm run build` pass; `docs/coverage.md` regenerated.
- A spot check of 10 random fatwas against the page images, recorded in the lane file.

## 8 · Rules that never bend (summary; AGENTS.md wins)

Sunni frame first, other views labelled; describe, never prescribe; nothing from the books beyond ≤ 40-word cited
quotes enters git (no PDFs, OCR text, page images, `fatwas.jsonl`); never invent a date, page, asker, quote or
citation; an unnamed asker stays unnamed; dates in EDTF + Hijri + precision with conversions marked derived; no
honorifics typed; Qur'an only by Tanzil reference; Arabic, English and Urdu in the same commit; never run `deploy.yml`
(when something must go live, tell me the commits and I deploy); never revert or discard another agent's work.

## 9 · Report to me

At each stop point and at the end: what you read; the proposal link; the book catalogue table; OCR statistics per book
(pages, minutes, characters, error patterns); fatwas ingested (by school, era, collection), edges by predicate, the
biggest precedent hubs; PR links; what failed or was skipped and why; what should run next. Start now with section 0,
then write the proposal (section 1) and run discovery (section 3) while you wait for my approval.

```

## V · Khutab and Durus Explorer: Friday sermons, lessons, study circles and conferences from books, sites, audio and video (Claude Code on the Mac)

Added 31 October 2026 at the founder's request, the companion of section U. It writes the proposal and stops for approval, finds published Sunni sermons (khutab al-jumu'a and occasion sermons), lessons (durus), study circles (halaqat al-'ilm), lecture series and conferences in books, websites, audio archives, podcasts and YouTube (metadata and links only, never downloaded), harvests books with Apple Vision and recordings with the offline speech tools under `docs/agents/audio-video-harvest.md`, indexes everything with links back, writes full entities for what matters, and builds the explorer.

Run: `cd ~/Documents/GitHub/islam-museum`, start `claude --chrome` (or `/chrome` in a session), paste the block.

```
You are building **the Khutab and Durus Explorer** for islam.museum, the companion of the Fatwa Explorer
(`docs/plan/07-prompts.md` section U): a record of published Friday sermons (khutab al-jumu'a), Eid and occasion
sermons, lessons (durus), study circles (halaqat al-'ilm), lecture series, public lectures and scholarly
conferences by Sunni scholars, imams and preachers, from the sermons the books record from the first century to today's
recordings. Sources: books, websites, audio and video archives, podcasts and YouTube. You work on this Mac, with the
Chrome browser for discovery, Apple Vision for printed books, the repo's offline speech-to-text tools for recordings,
and your own reading (this Claude session and its subagents) to write museum entities.

The museum **records sermons and lessons as history and as a guide to who taught what, where and when. It never
preaches, and it repeats no exhortation in its own voice.** It describes what the speaker said, attributes it and
labels it.

## 0 · Read first, check the machine

1. `uname -s` must print `Darwin`. Repo `~/Documents/GitHub/islam-museum`: `git fetch origin`, then
   `git worktree add ../islam-museum-khutab -b claude/khutab-durus-explorer origin/main`, link `node_modules` from
   the main clone, and work only there. Harvest workspace outside git: `~/islam-museum-harvest/` (`$HARVEST`), under
   `raw/khutab/`, `raw/durus/`, `audio/`, `books/khutab/`.
2. Read, and follow them over this prompt where they conflict: `AGENTS.md`; `docs/ai-change-gates.md` (proposal gate,
   §1a canon gate, merge gate, quality gate, §8 no-go list); `docs/agents/audio-video-harvest.md` (**binding for every
   recording**: rights, the transcript-noise rule, the toolchain of §3, the "include everything and categorise it"
   rules, the per-recording report of §8); `docs/agents/source-families.md`; `publication-standard.md`;
   `content-standards.md`; `mining-sources.md`; `lanes.md`; the finished recording lanes `lanes/omar-abdelkafy.md`
   and `lanes/tareq-al-suwaidan.md` (copy their shape); `docs/scope.md`; `docs/language.md`;
   `docs/sources-policy.md`; `docs/plan/02-content-model.md`, `14-themes-atlas.md` (`work.kind: sermon`,
   `lecture-series`, `podcast`; websites; `event.kind: conference`, `gathering`), `15-local-harvest.md` (§5 rules of
   the road), `20-opinions.md`, `21-landing-and-explorers.md`; `docs/site/README.md`; and section U of
   `docs/plan/07-prompts.md` (the Fatwa Explorer prompt): reuse its structure, its proposal step and its explorer
   components wherever they fit, and link the two explorers.
3. See what exists: `grep -rli "خطب\|خطبة\|khutba\|sermon\|درس\|دروس\|halaqa\|حلقة\|محاضرة\|lecture\|مؤتمر\|conference" data/ content/`;
   the works with `kind: sermon`, `lecture-series` or `podcast`; `source/assabile-*`; `scripts/harvest/audio/`
   (`download.py`, `transcribe.py`); `scripts/harvest/library/` (book tools); the `group` entities for mosques,
   universities and councils; `building/*` mosques; `practice/*` for the Friday prayer and the khutba.

## 1 · Phase 0: the written proposal (stop for approval)

Write `docs/plan/<NN>-khutab-durus-explorer.md` and show it in chat: the data model (section 2), the explorer
(section 5), the source list or method (section 3), a new lane `khutab-durus` (scope, progress file, stubs file
`data/_stubs.d/khutab-durus.yaml`, rows for `docs/agents/lanes.md` and `docs/status.md`), every file touched with the
intent of the diff, an honest risk label per part (gate §3; no new entity class), and the acceptance tests (section 6).
Commit it alone, open a pull request and **stop and ask me to approve it**. Discovery (section 3) changes nothing in
the repo and may run while you wait.

## 2 · The data model

Reuse first. Starting point, to be checked against the schema and refined in the proposal:

- **One sermon or one lesson = one `work`**: `kind: sermon` for a khutba (with `sermon_type`: jumu'a, eid al-fitr,
  eid al-adha, istisqa', kusuf, hajj/'arafa, nikah, occasion, farewell; propose the enum); `kind: lecture` (propose)
  for a single dars, lecture or talk. **A series = `work` `kind: lecture-series`** (a halaqa that read a book over
  months, a Ramadan series, a televised programme), with the single lessons `part_of` it in order. A **conference**
  or seminar = `event` `kind: conference` / `gathering`, with its papers or talks as `work`s linked to it.
- Fields (names are suggestions; reuse schema fields wherever one fits):

| Group | Field | What it holds |
|---|---|---|
| Who | `speaker` (`delivered` / `delivered_by`, propose) | the khatib, teacher or lecturer, a `person`; co-speakers and the moderator. |
| | `host` | the mosque (`building`), institution (`group`), channel or programme. |
| | `audience` | e.g. the Friday congregation, students of a madrasa, women's circle, a broadcast audience, children, a conference. |
| When and where | `date` | the museum date object (EDTF + Hijri + calendar + precision; derived conversions marked). For an undated recording, the upload or broadcast date, labelled as such, never presented as the delivery date. |
| | `place` | city and mosque or hall; `period` derived from the date. |
| | `occasion` | an `event` the sermon answered (a battle, an epidemic, a disaster, a coronation, Ramadan, Hajj), only when the source says so. |
| | `ruler_at_time` | with role: patron, addressee, named in the du'a for the ruler, subject, opponent, merely contemporary. Only "contemporary" may be derived. The ruler named in the khutba is historically important (it marked allegiance): record it whenever a source says who was named. |
| What | `summary` {ar,en,ur} | what was said, in the museum's words, attributed, cited to page or timestamp. ≤ 40-word quote allowed. |
| | `topics` | links to `concept`, `practice`, `event`, `person`, `place`, and to a `work` when the lesson explains a book (e.g. a sharh of Sahih al-Bukhari, lesson 12, covering kitab al-iman). |
| | `book_studied` and `range` | for a dars that reads a text: the work and the chapters or hadith numbers covered. |
| | `evidence_cited` | Qur'an by `[[passage/quran-S-A]]` reference only, hadith by `passage` with collection ref, other scholars and books cited. |
| Relations | `responded_to`, `relies_on`, `part_of` | a sermon answering another, a lesson relying on a teacher's lesson; the teacher-student chain (`studied_under` if it exists) so the explorer can show who taught whom. |
| | `related_fatwa` | links to Fatwa Explorer entities on the same question. |
| Media | `media[]` | per format: text (book page or web URL), audio, video, transcript (only the museum's summary, never the transcript), with duration, language and dialect, the archive URL and an Internet Archive snapshot. |
| Reception | `reception`, `consequence` | a sermon that was famous, banned, led to the speaker's arrest or exile, or moved people to act; only as the sources say. |
| Display | `headline` {ar,en,ur}, `sensitivity` | one line; contested and polemical content flagged per the harvest rules, with a `perspectives` block. |

Also propose: roles `khatib`, `imam`, `preacher` (wa'iz), `teacher` exists; `concept/khutba` and `concept/dars` /
`halaqa` (what they are, their history, the khutba's conditions in each school, as perspectives, cited); and
whatever the sources show a visitor would value: the sermon's length, the language (Arabic, or a local language
after the Arabic part), whether a translation followed, the minbar and the mosque, women's circles, children's
lessons.

## 3 · Phase 1: find everything published (Chrome, read-only for the repo)

Cover four kinds of source, every era, all Sunni schools, and many countries and languages (Arabic first, then
English, Urdu, Turkish, Malay/Indonesian, French, Persian-speaking Sunni regions, Swahili, Hausa, Bengali):

1. **Books**: collections of sermons and lessons, and the sermons that history and hadith books record. Starting list
   to verify (each one must be checked; it is neither complete nor proven): the Prophet's sermons as transmitted in the
   hadith collections and sira (the Farewell Sermon; linked as `passage`s, never typed as scripture); collections of
   the Companions' and early sermons such as Jamharat Khutab al-Arab; Ibn Nubata's Diwan al-Khutab; Ibn al-Jawzi's
   sermon and wa'z books (al-Yaqut fi al-Khutab, al-Tabsira, Bustan al-Wa'izin); Ibn Rajab's Lata'if al-Ma'arif
   (lessons arranged by the seasons of the year); amali books (dictation sessions, e.g. the Amali of al-Shajari, al-Qali);
   Ottoman and Mamluk khutba collections; modern printed collections (e.g. the khutab of Ibn Uthaymin, Muhammad
   al-Ghazali, Ali al-Tantawi, Abd al-Hamid Kishk, the official khutba volumes of ministries of awqaf). Run every book
   through the §1a canon gate (Sunni check with Wikipedia infobox and Wikidata, processed check, records in
   `exclusions.yaml`), add verified ones to `books.yaml` under `cat: khutab` after approval, and OCR scans with Apple
   Vision exactly as in section U (`ocr_all.py --cat khutab`, `caffeinate -i`, `ar-SA`, 200 dpi, resumable).
2. **Websites**: official ministries of awqaf that publish the weekly unified khutba (Egypt, UAE, Kuwait, Qatar,
   Jordan, Morocco, Saudi Arabia, Malaysia's JAKIM, Turkey's Diyanet), the Haramain sermon archives, mosque and
   institute sites, and the large sermon and lesson sites (for example alukah.net, islamweb, khutabaa.com,
   the official sites of individual scholars). Each site becomes a `work` (`kind: website`) with publisher,
   orientation (self-described), languages, stated size and an archive snapshot, marked "listed, not endorsed".
3. **Audio archives and podcasts**: assabile.com (already authorised for its speakers, see `source-families.md`),
   islamway.net, the Haramain audio archives, official scholar archives, podcast feeds (RSS lists are metadata and are
   the preferred way to list a podcast). Downloads only through `scripts/harvest/audio/download.py` (identified
   User-Agent, pause between requests, checksums), only where robots.txt and the site's terms allow it, into `$HARVEST`.
   Transcribe offline with `scripts/harvest/audio/transcribe.py` (`mlx_whisper` large-v3, or the dialect engine for
   Egyptian and other dialects) under `tmux` and `caffeinate -dims`, as `audio-video-harvest.md` §3 describes.
4. **Video and YouTube**: the official channels of scholars, mosques (the Haramain, al-Azhar, major mosques),
   institutes and ministries. **YouTube is metadata and link only: never download from YouTube** (its terms forbid it,
   and the repository's rule in `audio-video-harvest.md` §2 and `15-local-harvest.md` §5 says so). Use the YouTube Data
   API only if I provide a key; otherwise read public channel and playlist pages in the browser. Record per video:
   title, channel, date, duration, language, URL, playlist; the video is cited as a pointer, and its content enters only
   when the same recording exists on an authorised archive or in a book, or when its published description or chapter
   list states the facts.

For every source: read and record robots.txt, terms and licence in the lane file; sites that forbid collection are
listed but not collected. Output `$HARVEST/khutab/catalogue.json` and a table in chat: source, kind (book / site /
audio / video / podcast), speaker(s), school, country, language, era, size (items, hours), format, rights result,
Sunni check, already-processed check, priority (A: famous, historically consequential, or covering a whole era or
country; B; C). **Ask me before any bulk download or transcription run**, with the planned volume in hours and disk.

## 4 · Phase 2 and 3: harvest and ingest (after approval)

- **Index everything, write entities for what matters.** Like the fatwa websites: every listed sermon or lesson
  gets an index record of facts only (speaker, date, place, title in our words, topics, duration, language, URL,
  source); these feed a generated dataset (`dataset` entity plus build-time JSON in R2) for the explorer's search and
  filters, each linking out. Full `work` entities, with summaries cited to page or timestamp, go to: famous and
  historically consequential sermons (the Farewell Sermon, sermons tied to dated events, sermons that named a new
  ruler, sermons that led to bans or arrests), whole lecture series that explain a book (by lesson, linked to the
  book's chapters), conferences with their programmes, and every lesson that explains a topic the museum already has.
- Recordings follow `audio-video-harvest.md` to the letter: claims table per recording (line, timestamp, engine,
  window) in `$HARVEST`; only lines that read clearly as Arabic and make sense are written; recitations and hadith
  matn are never written from a transcript; the speaker's dates and numbers are his statements; platform figures are
  dated; anchors `{cite:<source-id> <series>/<episode> <hh:mm:ss>}`; the §8 report per recording; every excluded item
  reported with its reason.
- Prose: Arabic first in `content/ar/`, English and Urdu in the same commit, `status.review: published`, `provenance`
  block, `{cite:…}` after every factual sentence, docent voice; no exhortation in the museum's voice; no honorifics
  typed; Qur'an only by Tanzil reference; quotes ≤ 40 words; contested matter in `perspectives`, polemical matter
  flagged and described, never quoted.
- Batches of at most 25 entities; show me the claims table for the first batch of each source before writing files.
  Every batch: `npm run validate` (0 errors) `&& npm test && npm run coverage`; explicit paths, never `git add -A`;
  conventional message; trailers `AI-Agent: Claude Code`, `AI-Model: <the model this session reports>`,
  `AI-Editor: Claude Code CLI`, plus the repository's Co-Authored-By line; merge gate before every push (fetch, read
  what arrived, rebase or merge keeping both sides, never force-push); branch, pull request, merge it yourself. Keep
  `docs/agents/lanes/khutab-durus.md` current after every batch.

## 5 · Phase 4: the Khutab and Durus Explorer (site)

After the model is approved and a pilot batch is in (15 to 25 items across eras, countries, formats and kinds).
Astro + Svelte islands + Tailwind; no JavaScript needed to read; WCAG 2.2 AA; Arabic, English, Urdu; no runtime
network calls and **no embedded players that call YouTube or another host on page load** (a plain link, or a
click-to-load player that says it opens an outside site, if the proposal justifies it); build-time JSON in R2 (add the
folder to `R2_DATA_DIRS`, `publish.mjs`, `run_worker_first` and the two removal lines in `deploy.yml`).

- **`/[lang]/khutab/`, the landing page**: opening section in three languages on what a khutba, a dars and a halaqa
  are, and that each one is **the speaker's own words for his audience, time and place**: it shows how scholars
  taught and preached, it is not a ruling, and what was said in one setting may not suit another; with 4 to 8
  "learn more" links to Sunni institutions' articles on the khutba and on seeking knowledge, each opened and read
  before it is added (no URL from memory), stored as data with an archive snapshot, marked "listed, not endorsed".
  Then: a Hijri timeline of sermons and lessons with era bands; a map (where they were delivered); filters for kind
  (jumu'a, eid, dars, halaqa, series, conference), speaker, school, country, language, era, topic, format (text, audio,
  video); search (Pagefind facets); "this Friday in history" (sermons delivered on this Hijri date).
- **The sermon or lesson page**: headline; speaker, place, date, occasion, ruler at the time, audience; the summary
  with citations; topics and the book studied; evidence links; the series it belongs to (previous / next lesson); the
  sources and media links (book page, site, audio archive, YouTube link), each labelled; related fatwas; the short
  notice linking to the landing section.
- **Series page**: a book read lesson by lesson, with the chapters covered and the progress across months.
- **Speaker page lens**: the speaker's sermons and lessons on the lifespan ribbon, where he preached, the books he
  taught, teachers and students (a chain view in the constellation graph), the rulers named in his khutab.
- **Mosque and institution lens**: on a mosque's page, «خطب ودروس أُلقيت فيه»; on an institution's page, its series and
  conferences.
- **Conferences**: an event page with the programme, speakers, papers and outcomes.
- **Topic lens**: on a concept or practice page, the sermons and lessons that explain it, beside its fatwas.
- An explorer card on the landing page and the explore bar, «قيد الإعداد» until ready (plan 21 rule). `npm run build`
  passes with `check-site`, `check-static`, the axe scan and the weight check.

## 6 · Acceptance tests

- The validator accepts the new kinds, fields and predicates and rejects: a sermon or lesson with no speaker or no
  source; typed honorifics; typed Qur'an text; quotes over 40 words; an upload date presented as the delivery date;
  a ruler role other than "contemporary" without a citation; a YouTube file in the media store.
- Every lesson with `part_of` has an order number; every series lists its lessons in order.
- Pages render with JavaScript off; no request leaves the site on page load.
- `npm run validate`, `npm test`, `npm run build` pass; `docs/coverage.md` regenerated.
- A spot check of 10 random items against the book page or the recording at its timestamp, recorded in the lane file.

## 7 · Rules that never bend (AGENTS.md wins)

Sunni frame first, other views labelled; describe and attribute, never preach; no audio, video, transcripts, PDFs, OCR
text or claims tables in git; never download from YouTube; respect every robots.txt and terms page; never invent a
date, place, quote, timestamp or citation; Arabic, English and Urdu in the same commit; never run `deploy.yml` (tell
me the commits and I deploy); never revert another agent's work.

## 8 · Report to me

At each stop and at the end: the proposal link; the catalogue table; hours downloaded and transcribed, OCR pages;
items indexed and entities written by kind, era, country, speaker and format; excluded items with reasons; PR links;
what failed or was skipped; what should run next. Start with section 0, write the proposal (section 1) and run
discovery (section 3) while you wait for my approval.
```
