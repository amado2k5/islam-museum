# Prompt: process the downloaded library on the founder's Mac with local models

Paste everything under the line into any coding agent (Claude Code, Devin, Codex, Kiro, Cursor) that runs on the founder's Mac with shell access. It is vendor-neutral and self-contained: it installs what it needs, uses local open-weight models through Ollama for the heavy reading, and writes draft entities into the repository. Nothing here sends book text to a cloud model; the agent that runs the prompt may itself be a cloud model, but it must do the bulk reading with the local models (that is the point: no credits burned on 22 GB of text, and the book text never leaves the Mac).

Where it fits: `docs/plan/15-local-harvest.md` §7 (the local model passes), `docs/agents/lanes/library.md` (the library lane), `docs/agents/mining-sources.md` (the batch procedure).

---

You are an agent working on **islam.museum**, a free, static, Arabic-first digital museum of Islam built as a knowledge graph in git (`data/<class>/<slug>.yaml` facts plus `content/ar/<class>/<slug>.md` prose). You run on the founder's Mac (Apple M4 Max, 128 GB unified memory, macOS, Homebrew and `uv` installed). Your job: **process the downloaded library of Sunni books into draft museum entities, using local models on this Mac for the reading, and following the repository's rules.**

## 0. Read first (15 minutes, do not skip)

In the repository (`~/Documents/GitHub/islam-museum`, or your own clone or worktree of it):
1. `AGENTS.md` (the rules that never bend), then `docs/agents/README.md`.
2. `docs/agents/workflow.md` (own worktree, explicit-path commits, fetch and merge before every push, trailers, never revert others' work).
3. `docs/agents/content-standards.md` and `docs/agents/mining-sources.md` (what an entity looks like, rights per `docs/sources-policy.md`: read everything, rewrite in the museum's own words with the page cited, quotes of at most 40 words, no page images or OCR text in git).
4. `docs/agents/categories/*.md` for the category of the book you take (hadith, tafsir, seerah-tareekh, people, aqeedah-fiqh).
5. `docs/agents/lanes/library.md`, `docs/plan/15-local-harvest.md` §7 and §6.3, `docs/status.md`.

If anything below conflicts with those files, the repository files win.

## 1. Where things are

- Harvest workspace (outside git): `~/islam-museum-harvest/` (a symlink to the external drive `/Volumes/exmicroSD/islam-museum-harvest`; **it must be mounted**: check with `ls ~/islam-museum-harvest/raw/library | head` and stop with a clear message if it is not).
- Downloaded PDFs: `raw/library/<category>/<book-id>/*.pdf`; manifest `library/manifest.jsonl`; list of books `scripts/harvest/library/books.yaml` (about 200 books).
- Extracted pages: `books/<category>/<book-id>/<item>/` with `pages.json`, `book.txt` (markers `===== [pN] =====`), `meta.json`. Column-aware re-reads of single pages are cached in `books/colocr/<item>/pNNNN.txt`.
- Tools already in the repo (`scripts/harvest/library/`): `fetch_books.py`, `ocr_book.py` and `ocr_all.py` (extract text: text layer or Apple Vision OCR), `ocr_page.py` (column-aware single-page OCR), `slice_pages.py` (print a page range), `dict_entry.py` (find and read one entry in a dictionary), `make_sources.py` (draft `source` entities), `make_work_order.py <book-id>` (a ready order for one book), `verify_cites.py` (every `{cite:...}` resolves, no page out of range), `idmap.py`.
- Background jobs may already be running in tmux (`tmux ls`): `fetch-books`, `ocr-core`, `col-isaba` and others. **Do not kill or restart them.** Check what is left with `python scripts/harvest/status.py` and `docs/status.md`.

## 2. Install what you need (idempotent: check first, install only what is missing)

Run these in a tmux session (`tmux new -d -s localbooks`) or with `run_in_background`, never as a foreground command that can time out. Do not use `sleep` in the foreground; poll with an until-loop.

```bash
cd ~/Documents/GitHub/islam-museum
# Python environment for the harvest tools (the repo uses uv)
[ -d .venv-harvest ] || uv venv --python 3.12 .venv-harvest
uv pip install --python .venv-harvest/bin/python mwxml mwparserfromhell trafilatura httpx orjson duckdb pyyaml tqdm rapidfuzz internetarchive ollama pymupdf ocrmac pyarrow pydantic
# the local model runner (serves http://localhost:11434)
command -v ollama >/dev/null || brew install ollama
pgrep -x ollama >/dev/null || (brew services start ollama 2>/dev/null || (nohup ollama serve >/tmp/ollama.log 2>&1 &))
# node dependencies for the validator (only if node_modules is missing or dangling)
[ -e node_modules/.bin/tsx ] || npm ci
```

Models (check `ollama list` first; several are already there). Pull what is missing, one at a time, in the background, and record the **exact tag and digest** (`ollama show <tag>`) in the run's provenance:

| Role | Preferred | Already on this Mac? | Notes |
|---|---|---|---|
| Extractor (Arabic reading, claims) | `qwen3:32b` (or the newest Apache-2.0 multilingual Qwen tag Ollama lists that fits in about 40 GB) | maybe not | read the licence on the model page before use |
| Judge (a different family) | `gemma4:26b` | yes | check its licence terms; if unsure, use `gpt-oss:20b` (Apache-2.0) |
| Third opinion for Arabic (optional) | an Arabic-specialised model if one is available in Ollama | no | only for disputed claims |
| Embeddings (optional, for entity matching) | `bge-m3` | no | |

Test every model on a 10-line Arabic sentence before use (it must answer in valid JSON when given a schema in the `format` field). If a model is too slow (under about 5 tokens per second) or fails the JSON test, replace it and note why in the progress file. Keep at most two large models loaded at once.

## 3. Choose the work (one book at a time, resumable)

1. Run `python scripts/harvest/status.py` and list the books that have extracted text: `ls ~/islam-museum-harvest/books/*/*/`.
2. Priority order is in `docs/agents/lanes/library.md`: sira and Companions books that deepen the Prophetic spine; the introductions and cited passages of the six hadith collections; tafsir introductions and occasion-of-revelation links; history in annals order; creed and fiqh; geography and biographical dictionaries.
3. Take the first book in that order that has text and no entry in `docs/delegation/library/<book-id>.md`. Create that progress file at the start (edition and item used, page offset between PDF page and printed page, sections done, next step), and a branch `content/lib-<book-id>` from the latest `origin/main`.
4. If extraction is missing for a book you need, run `ocr_all.py --only <book-id>` in tmux and meanwhile work on another book. If a copy is an obvious wrong match (the title in `meta.json` is a different book), say so in the progress file and use another copy.
5. Dictionaries of people (al-Isaba, al-Isti'ab, Usd al-Ghaba, Tabaqat, Siyar): do not go entry by entry; follow the "Dictionaries of people" section of `docs/agents/lanes/library.md`.

## 4. The local pipeline for one section (build the scripts if they do not exist)

If the scripts below are missing, write them under `scripts/harvest/library/` (small, typed, resumable, with a docstring on the first line, no secrets, no network except `localhost:11434`) and commit them in their own commit before the content that depends on them. All intermediate files go in `~/islam-museum-harvest/work/<book-id>/` and never in git.

1. **Section.** Split the extracted pages into coherent sections (a chapter, a hadith group, a tafsir passage, a year in a chronicle) of at most about 6 pages. Record the section list in `work/<book-id>/sections.json` (page range, printed page range, heading).
2. **Claims pass (extractor model).** For each section, send the page text (Arabic, in the original) and a JSON schema; ask for a list of claims with these fields: `claim` (one factual sentence in Arabic), `kind` (person, event, place, date, relation, attribution, hadith_ref, quran_ref, opinion), `entities` (names exactly as printed), `value`, `date_text` (exactly as the book words it), `quote` (verbatim from the page, at most 40 words), `page` (printed page), `isnad_head` (as printed, if any), `doubt_marker` (such as «قيل», «يقال», «زعموا», a weak-chain remark), `attributed_to` (who the book says said it). **No quote, no claim.** Temperature 0, a fixed seed, `num_ctx` large enough for the section. Store the raw answers and the prompt hash.
3. **Quote check (code, not a model).** Normalise Arabic on both sides (remove diacritics, unify hamza and ya/alif-maqsura forms, collapse spaces; the text layer often writes الله as «االله»: normalise it too) and keep a claim only if its `quote` is a substring of the section text. Drop and log the rest. For scans, if the page is two-column or garbled, re-read it with `ocr_page.py` before dropping anything.
4. **Judge pass (a different model family).** For each surviving claim give the judge only the claim and its quote and ask: `supported`, `partly`, `unsupported` or `contradicted`. Keep `supported` only; send `partly` and disputed ones to a review list (`work/<book-id>/review.tsv`) and do not write them as facts.
5. **Rules (code).** Chronology (a person acting after their stated death is flagged), calendar agreement, no Qur'an text (only `sura:ayah` references), no honorifics in anything you write, dates exactly as the book words them (never invent a day), every dated fact needs this book plus a second source or `confidence: low` with `needs_source`.
6. **Reconcile with the graph.** Before creating anything, search `data/` for each entity in Arabic and ASCII (`rg`), and `data/_stubs.yaml` and `data/_stubs.d/*.yaml`. Reuse and extend existing entities; a second book's page becomes an extra source and extra claims on the existing entity; a different date or number becomes a second dated claim with its own source and `status: debated`, never an overwrite. Duplicates become `aliases`. Check `rg` for each new slug.
7. **Draft (extractor model, then your own check).** Write `data/<class>/<slug>.yaml` and `content/ar/<class>/<slug>.md` only from the verified claims, in the house voice (`docs/agents/content-standards.md`): warm, precise, neutral docent; describe, never prescribe; attribute every judgement; Sunni position first on contested points inside a `perspectives` block with the opposing views labelled; citations as `{cite:<source-id> p.N}`; `status.review: draft` with a provenance block (`layer: own-research`, the book, the pages, `generated_by` naming the local model tags and digests, `machine: local`). Never mark anything `reviewed` or `verified`. Never type Qur'an text.
8. **Verify and commit.** `npm run validate && npm test` must be clean and `python scripts/harvest/library/verify_cites.py` must say ok. Then follow `docs/agents/workflow.md` §4 exactly: explicit paths, trailers (`AI-Agent`, `AI-Model`, `AI-Editor`), `git fetch` and merge new `origin/main` first, `&&` (never `;`) before `git push origin HEAD:main`, at most 25 entities per commit, commit prefix `content(lib-<book-id>)`. Push after every batch, so that credits or power running out loses nothing.

## 5. Gold set before volume (do this for the first book, and again whenever a model or prompt changes)

Before the first batch, take 30 sections at random, run steps 2 to 4, and write `work/<book-id>/gold-report.md` with: how many claims were proposed, how many survived the quote check, how many the judge supported, 20 randomly chosen supported claims with their quotes and page numbers for the founder to spot-check, and the model tags and digests. **Stop after this report for the first book and say so**, unless the founder's instructions in the task say to continue; from the second book on, continue as long as the previous report showed no systematic error (for example, claims whose quotes are present but misread: wrong names, swapped numbers).

## 6. What you must never do

- Never send book text to any cloud service, and do not use a cloud model to read the books (reading is the local models' job; you orchestrate, check, and write).
- Never put PDFs, page images, OCR text, claims tables or model outputs in git. Never commit anything under `~/islam-museum-harvest`.
- Never quote more than 40 words from a book and never republish a page; everything else the book says may be rewritten in the museum's own words on the entity pages with the page cited (`docs/sources-policy.md`), but never as a page-by-page retelling.
- Never write, complete or "correct" Qur'an text. Never invent a date, a name, a number or a source. Never infer a person's faith.
- Never overwrite, delete or revert anything you did not create; never `git add -A`; never edit `schema/`, `scripts/validate.ts`, `site/`, or the validator tests (write `docs/requests/lib-<topic>.md` if you need a change). Never kill other tmux sessions.
- Never mark content `reviewed` or `verified`; contested topics are flagged in the progress file for a Tier A reviewer.
- If a rule here does not fit the situation, flag the uncertainty in the entity and the progress file and continue; do not stop to ask unless the harvest drive is missing, disk space is under 50 GB, or main is broken by someone else's commit and you cannot repair it safely.

## 7. Reporting

At the end of each batch add to `docs/delegation/library/<book-id>.md`: sections done, entities created or updated, claims proposed, kept after the quote check and the judge, items in the review list, doubt markers captured, contested points flagged, the model tags and digests, and the next section. In your final message to the founder: what you installed, which books you processed, the numbers above, the commits pushed, what is blocked, and what you recommend next. Do not claim anything is reviewed.
