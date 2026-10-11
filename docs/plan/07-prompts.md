# 07 · Prompt library

Copy-paste prompts for building and populating the museum with Claude Code (or the Claude API). Prompt A becomes the repo's `CLAUDE.md`; the others are session or script prompts. Each is self-contained; adjust the counts and paths in brackets.

---

## A · Project context (save as `CLAUDE.md`)

```
# islam.museum — project context

You are working on islam.museum, an open, free, all-digital museum of Islam: the faith, civilization, peoples, places, ideas, objects, texts and living culture, from the world Islam was born into until today. Read docs/plan/ before architectural changes. Key documents: 01-vision (principles), 02-content-model (classes, predicates, dates), 03-architecture (stack, layout, pipeline), 04-experience (halls and pages), 05-editorial (voice, perspectives, licensing), 06-roadmap, 09-ai-content-pipeline.

Non-negotiables
- Static site on GitHub Pages behind Cloudflare; no servers, no databases, no paid services. Astro + Svelte islands + Tailwind; TypeScript scripts; Pagefind search; MapLibre + PMTiles; Sigma.js graphs.
- Content is a knowledge graph in git: data/<class>/<slug>.yaml (language-neutral facts) + content/<lang>/<class>/<slug>.md (prose). IDs are "class/slug", immutable; renames via aliases.
- Dates: EDTF + Hijri string + calendar flag + precision; never invent a date; conversions marked derived.
- Relations use schema/predicates.yaml only; write the edge once; inverses are computed.
- Every entity cites sources; every dated fact needs two sources or a flag. Wikipedia is a pointer, not a source.
- Voice: a warm, precise, neutral docent. Describe, never prescribe. No honorifics typed into prose (the UI renders them). Contested topics use the perspectives block with Sunni, Shia and academic views, each cited.
- Licenses: prose CC BY-SA 4.0, data CC0, code MIT; third-party content keeps its own license, recorded per version; media only from the whitelist in schema/enums/licenses.yaml; no figurative depictions of prophets; no AI-generated portraits.
- Arabic and RTL are first-class: test every UI change in /ar/.
- Accessibility: WCAG 2.2 AA; alt text required; no JS needed to read a page; islands lazy-load.
- Run `npm run validate` before proposing any content change and `npm run build` before any site change. Fix what fails.
- AI-generated content enters as status.review: draft with a provenance block; never mark reviewed/verified yourself.
- Commit only when asked; conventional commit messages; small PRs per cell batch (≤ 25 entities).
```

---

## B · Phase 0 scaffold

```
Scaffold the islam.museum repository exactly per docs/plan/03-architecture.md §3. Create:
1. Root files: LICENSE (MIT), LICENSE-CONTENT.md (CC BY-SA 4.0 for content/, CC0 for data/ geo/ datasets/), CONTRIBUTING.md, CODE_OF_CONDUCT.md (Contributor Covenant + the museum clause from docs/plan/05-editorial.md §7), GOVERNANCE.md, CLAUDE.md (from docs/plan/07-prompts.md Prompt A), docs/style-guide.md, docs/editorial-policy.md (condensed from 05), docs/adr/0001-static-git-knowledge-graph.md.
2. schema/: _base.schema.json and one JSON Schema per class in docs/plan/02-content-model.md §2 (person, group, polity, event, period, journey, place, building, object, media, work, passage, concept, language, practice, exhibit, question, source, dataset), predicates.yaml with inverses/domain/range/labels for every predicate in §4, enums/ (regions, traditions, roles, kinds per class, disciplines, materials, licenses, sensitivity, claim-status), external-id-patterns.yaml.
3. templates/<class>.yaml and templates/<class>.md with the conventional section headings.
4. scripts/ (TypeScript, run with tsx, tested with vitest): validate.ts (ajv + EDTF parse via `edtf` + Hijri sanity + link resolution against data/ and data/_stubs.yaml + license whitelist + alt text + slug rules + duplicate external IDs), build-graph.ts (graphology; inverse edges; date normalisation to earliest/latest; prose attach; contemporaries; coverage) → .cache/graph.json, derive.ts (timeline rows, GeoJSON layers, ego graphs, snapshot-year indexes, on-this-day indexes), export-api.ts (api/v1 per docs/plan/09 §6), hijri/convert.ts (tabular arithmetical converter + Umm al-Qura for ≥1300 AH; anchors.test.ts with: 1 Muharram 1 AH = 16 July 622 Julian; 12 Rabi' I 11 AH = 8 June 632; 1 Muharram 1447 = 26 June 2025), report/coverage.ts.
5. data/ with the example entities from docs/plan/02 §10 plus enough stubs/entities that validation passes (person/ibn-sina, place/medina, place/mecca, place/hamadan, place/bukhara, event/hijra, person/muhammad, person/abu-bakr, period/prophetic-era, source/gutas-2014, source/gohlman-1974 …) and content/en + content/ar prose for ibn-sina and hijra.
6. site/: Astro 5 project with Tailwind 4, Svelte, i18n routing (en default, ar RTL), a content loader reading .cache/graph.json, layouts/EntityLayout.astro implementing the page anatomy in docs/plan/04 §3 (header, at-a-glance, in-time strip placeholder, in-space mini map placeholder, body with depth dial, connections grouped by predicate, sources, cite, JSON-LD, edit link), pages for [lang]/[class]/[slug], hall index placeholders for the eight wings, wander, today, questions, exhibits, api export, sitemap, robots.txt, llms.txt, Pagefind integration, fonts self-hosted and subsetted (Noto Naskh Arabic, Amiri, Reem Kufi, Source Serif 4, Inter), design tokens from docs/plan/04 §6, dark mode, print stylesheet.
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
4. WRITE data/[class]/[slug].yaml per schema/[class].schema.json and templates/[class].yaml: id, class, label {en, ar, + source language}, names[] with full ALA-LC and Arabic script, summary {en, ar}, dates (edtf + hijri + calendar + precision + status + sources), wings, periods, regions, roles/kinds, external_ids (wikidata, viaf, openiti, archnet, pleiades, accession), relations[] using only predicates from schema/predicates.yaml, each with sources and note where useful; for targets that do not exist, add them to data/_stubs.yaml with a label and class; perspectives[] if the topic is contested (sunni, shia-twelver, academic at minimum, each cited); media.hero only from whitelisted licenses with alt text in en and ar; sensitivity; status {review: draft, completeness}; provenance {generated_by, model, run date, sources}.
5. WRITE content/en/[class]/[slug].md following templates/[class].md: "## Brief" (2–3 sentences a 12-year-old understands), then the class's conventional sections, each factual sentence ending with {cite:source-id locator}; link every mentioned entity with [[class/slug]]; define Arabic terms on first use; no honorifics; describe, never prescribe; add ":::perspectives" when the topic is contested; add "## For young visitors" for spine entities.
6. WRITE content/ar/[class]/[slug].md: translate with i18n/glossary.yaml forms, keep every {cite} and [[link]], set translation_of: en@<hash>.
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

## P · AI docent (Phase 5, Cloudflare Worker)

```
Design and implement /ask: a Cloudflare Worker using Workers AI + Vectorize over the museum's own api/v1 JSON (chunks: summary, sections, perspectives, with id and lang). Behaviour: answer only from retrieved museum content; always cite entity URLs; show perspectives when the topic is contested; refuse rulings and personal religious guidance with a gentle pointer to the Ideas wing; support en and ar; rate-limit per IP within the free tier; log nothing personal. Provide a static fallback (search results) when the Worker is unavailable. Include an evaluation set of 50 questions with expected citations and a script to run it.
```
