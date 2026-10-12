# COMMON BLOCK: library mining for islam.museum (paste at the top of every Codex session; `make_work_order.py` does it for you)

You are mining one prominent Sunni book into islam.museum, an open, free, static, Arabic-first digital museum of Islam built as a knowledge graph in git. Your output is entity files (YAML facts + Arabic prose) that pass the repo's validator. You work from the book's extracted text (outside git), never from memory.

## 0. Your own copy, branch, and checks
- Work in your own clone, never in the shared folder: `git clone https://github.com/amado2k5/islam-museum.git ~/islam-museum-codex-<book-id> && cd ~/islam-museum-codex-<book-id> && npm ci && git checkout -b content/lib-<book-id> origin/main`.
- Before you start and before every push: `npm run validate` (0 errors) and `npm test` (all pass).
- Read first: docs/content-quality.md (the quality bar: the validator enforces part of it, reviewers the rest), CLAUDE.md, docs/collaboration.md, docs/status.md, docs/scope.md, docs/language.md, docs/style-guide.md, docs/plan/02-content-model.md, docs/plan/05-editorial.md, docs/plan/09-ai-content-pipeline.md §1, schema/predicates.yaml (the only allowed relation types). Then open 3 existing entities of each class you will write (data/ + content/ar/) and copy their exact shape: field names, citation style, prose voice. Consistency with main beats your preferences.

## 1. The book text (outside git, on the founder's Mac)
- Extracted pages: `~/islam-museum-harvest/books/<cat>/<book-id>/<item>/` (a symlink to the external drive; it must be mounted): `pages.json`, `book.txt` (markers `===== [pN] =====`, N = PDF page), `pages-png/` (page images of scanned pages: use them to check any doubtful word, name or number), `meta.json`.
- Print a range: `python scripts/harvest/library/slice_pages.py <cat>/<book-id>/<item> START END`.
- Several copies (items) may exist for one book; they are different scans/editions. Pick the clearest, state which item and edition you used in every claim's note, and use a second copy to cross-check a doubtful reading.
- PDF page is not always the printed page. Find the offset on the images, record it once in `docs/delegation/library/<book-id>.md`, and cite the printed page the reader will find.
- Text-layer extractions fold Arabic presentation forms to plain letters, but the word الله often appears as «االله» (a PDF artefact): read it as الله and never copy the artefact into entities. Scanned pages are OCR'd and may misread names and numbers: verify those on the page image.
- Never copy page text, page images or claims tables into the repo; never paraphrase pages into museum prose. The book is a copyrighted-reference layer: facts, chronology, names with nasab, places, numbers, grades attributed to named scholars, and citations only. Quotations: verbatim, at most 40 words, in quotation marks, with the page. Classical texts are public domain but the edition's apparatus (tahqiq notes, indexes) is not: never use the editor's notes verbatim.

## 2. Rules that never break (full list in CLAUDE.md)
- Arabic first: `label.ar` and `summary.ar` required; prose only in `content/ar/<class>/<slug>.md`; no English prose.
- Voice: warm, precise, neutral docent; describe, never prescribe; short sentences; define terms on first use; `[[links]]` on every entity mention; `{cite:<source-id> p.N}` after every sentence that states a fact. No honorifics typed into prose (strip them from anything you extract). No rulings (fatwa), no sermon voice, no first-person religious instruction.
- Scope: Sunni Islam is the default frame and the book is a Sunni source. Contested or internally disputed matters (hadith grading disagreements, creed differences between Athari/Ash'ari/Maturidi, madhhab differences, the Companions' disputes, non-Sunni views) go in a `perspectives` block: the Sunni position(s) first, each labelled by school or scholar, then the academic view, then any other view, each cited, no verdict. Never write "enemy of Islam" or the like in the museum's voice: describe the act, attribute the judgement.
- Qur'an: never write, quote, complete or correct ayah text. Reference `passage/quran-<sura>-<aya>` and add edges with sources. Hadith text: do not bulk-import matn; create a `passage` only for a report the museum cites, with `ref`, a matn excerpt of at most 40 words, the isnad head as the book prints it, and the grade attributed to its grader (never grade a hadith yourself).
- Dates: exactly as the book words them (Hijri string, precision), never invented; every dated fact needs this book plus a second source, or `confidence: low` with `needs_source`.
- Every entity: `label.ar`, `summary.ar`, at least one source, a `provenance` block (layer: own-research, source, generated_by: "Codex", model, run), `status.review: draft`. NEVER set reviewed or verified.
- Reuse before create: search `data/` (Arabic label and ASCII slug) for an existing entity, add your claims and your source to it, never make a duplicate (a duplicate becomes an alias). IDs are `class/slug`, ASCII, immutable. Unknown targets go in `data/_stubs.d/lib-<book-id>.yaml` with an Arabic label and class.
- Relations use only `schema/predicates.yaml`; write each edge once (inverses are computed). If you need a field, enum value or predicate that does not exist, do not edit `schema/` or `scripts/`: write `docs/requests/lib-<topic>.md` describing it and work around it with a note.
- No figurative images of prophets or Companions. Coordinates only from docs/plan/16 §6 or Wikidata (say which).
- Each book becomes (or reuses) a `source` entity, `data/source/<source-id>.yaml`; `python scripts/harvest/library/make_sources.py` shows which are missing. Cite as `{cite:<source-id> p.N}` or `{cite:<source-id> V/N}` for volume/page.

## 3. One batch at a time (a batch = one coherent section of the book, at most 25 entities)
a. Read the section's pages (and look at the images where the text is doubtful).
b. Write a claims table in `~/islam-museum-harvest/books/<cat>/<book-id>/claims/<batch>.md` (outside git): claim, value, printed page, quote ≤ 40 words, isnad head or attribution as printed, any doubt marker in the book («ويقال»، «قيل»، «يروى»، «ضعيف»…), target entity.
c. Create or extend entities and write the Arabic prose from the claims table only.
d. `npm run validate` and `npm test`, then `python scripts/harvest/library/verify_cites.py` (every cited source exists and no page is out of range).
e. Commit and push (section 4). Then the next batch. Do not stop to ask questions: use the rules, flag uncertainty in the entity and in the progress file, and continue.

## 4. Commit and push to main often (credits can end at any moment; unpushed work is lost)
After every ~10 entities and at the end of every batch:
```
git fetch origin
git add <explicit paths of your own files>          # never git add -A or .
git commit -m "content(lib-<book-id>): <section> pp. N-M (draft)"
git pull --rebase origin main                       # review what arrived; combine, never drop other sessions' work
npm run validate && npm test
git push origin HEAD:main
git push origin HEAD:content/lib-<book-id>
```
If main moved, repeat. Never force-push. Never commit PDFs, OCR text, page images, or datasets larger than a small CSV. If a file of someone else breaks validation, do not edit or delete it: fix your side, note it in docs/status.md, and push your clean files.

## 5. Hand-off trail
After each push update `docs/delegation/library/<book-id>.md` (create it; keep it short): edition and item used, page offset, sections done with page ranges, the section in progress, flagged items and doubts, the exact next step. Commit it with the batch, and update the book's row in docs/status.md when a book finishes.

## 6. Batch report (in the commit body or the progress file)
Entities created/updated, claims count, classical sources named by the book and whether each has a source entity, doubt markers captured, contested points flagged, passages verified on the image.
