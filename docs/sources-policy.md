# Sources and copyright: the museum's rule

**Founder's standing instruction, 15 October 2026. It applies to every agent, model, tool, session and human working in this repository, whatever the vendor.** It replaces the earlier "licence wall" and every "never paraphrase into museum prose" sentence. Where an older document still says otherwise, this page wins; fix the older text when you meet it.

## The rule in one sentence

Any source may be read; what the museum publishes is written in its own words and cites the source.

## 1. Read anything

Every source is open to read, OCR, index, search and work from: classical texts, copyrighted modern books, the editors' apparatus of modern editions (tahqiq notes, indexes, margin rubrics), encyclopaedias including Wikipedia, journal articles, websites, databases, translations. No source is off-limits to read, and nobody asks whether a source may be used.

## 2. Rewrite in your own words

Read, understand, then write the museum's own text: the docent voice (`docs/agents/content-standards.md`), in Arabic, organised by museum entity (a person, an event, a place, a concept), with a citation to the source and page after every sentence that states a fact. This is allowed and expected for every source, including copyrighted ones, including whole sections and whole books: the museum's pages are built from what the books say.

"Your own words" means the museum's text, not the source's text with the words swapped. A translation, a sentence-by-sentence rewording, or a retelling that follows the source page by page is not the museum's text. The museum's structure is its own: an event page gathers what several sources say about that event; a book is a reading plan, never an outline.

## 3. Facts enter `data/` from any source

Facts belong to nobody: names, dates, places, numbers, chronology, relations, isnad heads, gradings attributed to the scholar who gave them, bibliographic details. They enter `data/` (CC0) from any source, with the source cited. The licence layers of `docs/plan/15-local-harvest.md` §3 (`cc0`, `by`, `by-sa`, `nc`, `pd`, `copyrighted-reference`, `link-only`, `own-research`) record where a thing came from; they no longer decide whether a fact may enter. The validator accepts any recorded layer and requires only that the entity cites its sources.

Reliability is a separate question and is unchanged: Wikipedia and Wikidata remain pointers, not sources (`AGENTS.md`); every dated fact needs two sources or a flag; every doubt marker the source prints is kept.

## 4. What stays out of the repository

- Verbatim text beyond a short quotation: at most 40 words per quotation, in quotation marks, with the page. Qur'an text is the standing exception: Tanzil's verbatim files only, never rewritten, never typed.
- The source files themselves: PDFs, scans, OCR text, page images, claims tables, dumps, corpora. They live in the harvest workspace (`~/islam-museum-harvest`).
- Media without a whitelisted licence (`schema/enums/licenses.yaml`); figurative depictions of prophets and Companions; AI-generated portraits.
- Bulk copies of a database (OpenStreetMap, IMDb, TMDB, closed directories): a record has no "own words". Take identifiers and use them as pointers; write the facts you establish from your own reading.

## 5. No sign-off

The founder has given standing permission for all of the above. No agent stops to ask whether a source may be read or rewritten, whether an entity may be written, or whether validated work may be committed and pushed. Flag doubts in the entity and the progress file and continue. Records enter as `status.review: published` with a provenance block once they meet the publication bar in `docs/agents/publication-standard.md`: citations to defined sources, provenance recorded. No review by anyone — founder, human or agent — is required for publication, and one source is enough for any fact.

## 6. Attribution

Every source gets a `source` entity (`data/source/<id>.yaml`) and is cited as `{cite:<id> p.N}`; bulk datasets are listed in `docs/attribution.md`. The museum's own text is CC BY-SA 4.0 and its data CC0 (`LICENSE-CONTENT.md`).

## 7. Where the old rule was written

Updated on 15 October 2026 to point here: `AGENTS.md`, `docs/agents/mining-sources.md` §2, `docs/agents/content-standards.md` §15, `docs/agents/lanes/raheeq.md`, `docs/agents/lanes/hisham.md`, `docs/attribution.md`, `docs/status.md`, `docs/editorial-policy.md`, `docs/plan/05-editorial.md` §6, `docs/plan/07-prompts.md`, `docs/plan/15-local-harvest.md` §3 and §11, `docs/plan/17-raheeq-makhtum.md` §1, `docs/plan/18-sira-ibn-hisham.md` §1, `docs/delegation/local-model-library-prompt.md`, `scripts/validate.ts` (the layer wall). Content the old rule held back is listed in `docs/delegation/held-back-content.md`, to be worked through lane by lane.
