# Mining a source into entities

For any agent turning a book, a dictionary, a chronicle or a text collection into museum entities (the sira books, the library of prominent Sunni works, and later sources). The rules that never bend are in [`AGENTS.md`](../../AGENTS.md); how to commit is in [`workflow.md`](workflow.md); what a good entity looks like is in [`content-standards.md`](content-standards.md). Category guidance (what to extract from hadith, tafsir, history, biography, creed and fiqh books) is in [`categories/`](categories/). Per-book plans: `docs/plan/17-raheeq-makhtum.md`, `docs/plan/18-sira-ibn-hisham.md`; per-lane state: [`lanes.md`](lanes.md).

You work from the book's extracted text, never from memory. Retrieve, then write.

## 1. Where the text lives (outside git, on the founder's Mac)

- Original scans and downloads: `~/islam-museum-harvest/raw/` (a symlink to the external drive, which must be mounted). Library PDFs from archive.org: `raw/library/<category>/<book-id>/`; manifest of what was found: `library/manifest.jsonl`.
- Extracted pages: `~/islam-museum-harvest/books/<category>/<book-id>/<item>/` with `pages.json`, `book.txt` (markers `===== [pN] =====`), `pages-png/` (images of scanned pages; use them to verify any doubtful word, name or number) and `meta.json`. Sira books extracted earlier keep their own folder under `raw/books/`.
- Tools (`scripts/harvest/library/`): `ocr_book.py`/`ocr_all.py` (extract text; two-column pages are read right column first), `ocr_page.py` (re-read single pages, cached in `books/colocr/`), `slice_pages.py <cat>/<book-id>/<item> START END` (print a range), `make_sources.py` (draft `source` entities), `verify_cites.py` (every `{cite:...}` resolves and no page is out of range), `make_work_order.py <book-id>` (a ready order for one book).
- Several copies of a book may exist (different scans and editions). Pick the clearest, say which item and edition you used in the claim's note, and cross-check a doubtful reading in a second copy.
- PDF page is not always the printed page. Find the offset on the images, record it once in the lane's progress file, and cite the page the reader will find.
- Text-layer extractions fold Arabic presentation forms to plain letters, but الله often appears as «االله» (a PDF artefact): read it as الله and never copy the artefact. Scans are OCR'd and misread names and numbers: verify those on the page image. Dictionaries in two columns: if the text looks interleaved, re-read the pages with `ocr_page.py`.

**Recordings.** For a lecture, podcast or video, the book rules apply with two changes: the anchor is the recording's series, episode and timestamp (not a page), and transcripts and audio stay in the harvest workspace. Follow [`audio-video-harvest.md`](audio-video-harvest.md) for discovery, download, transcription and the checks by listening.

## 2. Rights: what you may take (`docs/sources-policy.md`)

Everything the book says, rewritten. Read the book, copyrighted or not, including a modern edition's apparatus (tahqiq notes, indexes, margin rubrics), and write what it says in the museum's own words, organised by entity, with the page cited after every sentence that states a fact. Facts, chronology, names with nasab, places, numbers, grades attributed to a named scholar, isnad heads and citations all enter `data/`. Quotations are verbatim, at most 40 words, in quotation marks, with the page. What stays out of git: the book's text beyond those quotations (a page-by-page retelling or a sentence-by-sentence rewording is not the museum's text), and the source files themselves (OCR text, page images, claims tables).

## 3. One batch at a time (a batch is one coherent section; at most 25 entities)

1. Read the section's pages (and the images where the text is doubtful).
2. Build a claims table in the harvest workspace, not git: claim, value, printed page, quote ≤ 40 words, isnad head or attribution as printed, any doubt marker, target entity.
3. Search `data/` for each entity (Arabic and ASCII). Reuse and extend; create only what is absent. A second book's page becomes an extra source and extra claims on the existing entity; a different date or number becomes a second dated claim with its own source and `status: debated`, never an overwrite.
4. Write the entities and the Arabic prose in your own words from what you read (`content-standards.md`); the claims table is how every sentence stays traceable to a page, not a limit on what you may say.
5. Run the 60-second check, `npm run validate && npm test`, and `python scripts/harvest/library/verify_cites.py`.
6. Commit and push (`workflow.md` §4), update the progress file, start the next batch. Do not stop to ask: use the rules, flag uncertainty in the entity and the progress file, continue.

## 4. Rules specific to mining

- **Status of claims:** `tradition` by default for the tradition's own narrative; `historical` or `debated` only where an academic source says so; the book's own opinions are recorded as that author's view with the page.
- **Dates** exactly as the book words them (`«جمادى الأولى سنة ثمان»` becomes hijri `0008-05`, precision month); Gregorian only if a source gives it, `calendar: julian`; never a day the source does not give. One source is enough for a dated fact; add a second when it is cheap, and use `confidence: low` with `needs_source` only when the source itself is doubtful — neither ever blocks publication.
- **Isnads and attributions:** record the first transmitters the book prints in the claim's note. Report grades only as attributed to a named grader.
- **Hadith matn:** do not bulk-import. Create a `passage` only for a report the museum cites: `ref`, a matn excerpt of at most 40 words, the isnad head as printed, the grade attributed to its grader.
- **Qur'an:** reference `passage/quran-<sura>-<aya>` and add edges with sources; quote the book's words about the occasion, never the ayah.
- **Contested sections** (Saqifa, the Companions' disputes, the conquest executions, Banu Qurayza, hadith grading, creed and madhhab differences) carry `perspectives` with the Sunni position(s) first and need Tier A review: note them in the progress file.
- **Sources and stubs:** each classical work the book names that you cite becomes a `source` entity (check it does not exist first); unknown targets go in your lane's `data/_stubs.d/<lane>.yaml`.
- **Scope of the museum, not of the book:** where the book is polemical, record its position as its own, attributed and labelled, never in the museum's voice.

## 5. Quality bar for every batch

Every dated fact: cited to this book's page (a second source when cheap, never required). Every claim traceable to a page a reader can open and verify in under a minute. Every doubt marker captured. Every entity: `label.ar`, `summary.ar`, at least one source, a provenance block, `status.review: published`. No sentence stating a fact without a citation; no quotation over 40 words; no honorific; no Qur'an text; no English prose. End each batch with a short report (entities created or updated, claims count, sources used, doubt markers captured, contested points flagged, passages verified on the image) in the commit body or progress file.
