# Harvest register

`docs/library/harvest-register.yaml` is the single record of every book, audio series, website and
dataset that any agent has downloaded, harvested, OCRed, mined or ingested. It lives in git so the
microSD copy of a finished item can be deleted without losing the knowledge of what was done.
Founder instruction, 14 November 2026 (decision record dec-20261114-282).

## The rule
Before any download, OCR, harvest, mining or ingestion, look the item up in the register. If it is
there and its completion is not `deleted`, use its state and never redo finished work. When a state
changes, update the entry in the same PR. If the item is not there, add it when you claim it.

## Sections and fields
`books`, `audio_series` and `video_series` (Assabile and any lecture, audio or video source: main site URL, lecturer page, series page, and one compact line per episode with number, title, page URL, file and format, duration, bytes, download source and date, transcript pass and model, mining state, PRs), `websites` (the main site URL plus every page, endpoint, dump or dataset URL actually processed, with what was taken, date, lane, state, licence) (source families and
sites), `datasets` (dumps, CSVs, clones, API pulls). Each item has: `id` (unique), title, author,
editor_translator, edition, publisher, place, year {hijri, ce}, volumes, language, category,
`acquisition` (source, date, by, file_name, bytes, sha256, sha256_status), `physical` (pages, offset,
missing_or_duplicate), `ocr`, `ocr_archive`, `mining`, `ingestion`, `work_registry`, `completion`,
`deletion`, `unverified` (field names you could not check), `notes`. The example entry in the file
is the shape to copy. Audio series and websites reuse the same keys where they apply and add
`episodes {total, audio, transcript}` or `pulls`; keep entries compact.

Rules: use null or "unknown" honestly, never invent a value, page count, hash or URL. Compute sha256
only for files under 200 MB or for books that are complete; otherwise `sha256_status: pending`. Paths
are relative to the harvest root (`books/...`, `audio/...`), never absolute, no usernames or emails.
No OCR text, claims tables or page images in git.

## States
completion: `claimed` -> `downloaded` -> `ocr_done` -> `mining` -> `mined` -> `ingested` -> `complete`
-> `deleted`. ocr.state: none, partial, complete. mining.state: none, in_progress, mined. ingestion.state:
none, partial, ingested.

## OCR archive (founder, 14 November 2026: "OCR text can be compressed in zip on microsd")
Each book's OCR text is kept as one zip on the microSD, not in git, at
`ocr-archive/<category>/<book-id>.zip`. Today OCR text sits unzipped in `ocr/<slug>/` at the harvest
root or inside `books/<category>/<slug>/`; record that in `ocr.unzipped_location`. `ocr_archive`
holds path, bytes, sha256, pages_covered, zipped (date) and state: none, partial, complete, verified.
A later job zips the books marked ocr done but archive none; record those as needing zipping.

## Deletion gate
A book's PDF and working files may be deleted from the microSD only when all hold:
1. completion is `complete` (mined and ingested, PRs recorded);
2. the OCR zip exists, passes `unzip -t`, covers the book's page count, and its sha256 and
   `ocr_archive.state: verified` are recorded;
3. `acquisition.sha256` and a restore URL are recorded;
4. the entry is updated in a PR first; then completion becomes `deleted` with a `deletion` block
   (date, deleted, `kept: ["ocr_archive"]`, restore {url, sha256}).
Deletion is a separate step by the founder's instruction; the register task itself deletes nothing.

## Looking up and adding
Search by id, title or author: `grep -n -i "<word>" docs/library/harvest-register.yaml`. Add entries
inside your segment's `BEGIN`/`END` block. Check: `npm run check:harvest-register`.

## Open questions
Items the repository and drive cannot settle go in as `unverified` and as a line starting `GEMINI:`
below, for the founder to send in a batch.

## Wrap-up queue
(Maintained from the register: every partly mined or nearly complete book, ranked by share of pages
mined, highest first, with what remains: pages left, held pages, OCR gaps, zip needed, and whether a
founder-held item blocks it. Filled after the book segment merges. Founder rule, 14 November 2026:
finish and clean up partly done books before starting new ones.)
