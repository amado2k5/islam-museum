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

GEMINI: ibn-haytham-manazir / hilyat-awliya: held printed pages 532, 546 and 666; the founder's held list names Kitab al-Manazir, the hilyat-awliya ledger (docs/delegation/library/hilyat-awliya.md) lists the same page numbers for Hilyat al-Awliya; which book holds them? I recorded them as held in both entries.
GEMINI: books segment, entries with an archive.org identifier as title (unverified: title): author, title and edition could not be read from the manifest or ledgers; the scan's title page would settle them.
GEMINI: raw/library/tafsir-app and the fatwa catalogue JSON files: not books; left for the websites and datasets segments (tafsir.app harvest tree, dar-alifta catalogue).
GEMINI: web-hadithunlocked: licence of hadithunlocked.com and which of the 17 failed hadith files were retried; what the manifest and drive show: 44 ok, 17 failed, no licence page recorded; the site's own terms page would settle it.
GEMINI: web-princeton-geniza: the Zenodo record URL of the metadata zip pgp-metadata-v1.2.zip; what the drive shows: folder name pgp-zenodo-22663982 only; the Zenodo record page would settle it.

GEMINI: durus-fatawa-haramayn: title, author and publisher were read from garbled Apple Vision OCR of the title page (al-'Uthaymin, Mu'assasat al-Shaykh al-'Uthaymin al-Khayriyya); the printed title page or the archive.org item FP171023 metadata would settle them.
GEMINI: permanent-committee-fatwas: compiler read from garbled OCR as Ahmad ibn Abd al-Razzaq al-Duwaish, edition and publisher unknown; archive.org item FP124536 metadata would settle them.
GEMINI: taqrib-fatawa-ibn-taymiyya: editor (Muhammad ibn Nasir al-Tayyar) and publisher (Dar Ibn al-Jawzi, 1440 AH) read from OCR of the title page; archive.org item tfrsitFP metadata would settle them.
GEMINI: vhmml-listing-data and papyri-idp-hgv-sparse-clone (datasets): the web-sources ledger says the vHMML CSV (raw/vhmml/) and the idp.data sparse clone (raw/papyri-idp/) were saved under the harvest root on 14 Nov 2026, but neither folder exists on the drive. Were they saved in another worker's clone, or deleted?
GEMINI: hadith-json-v1-2-0 (datasets): the exact GitHub URL and licence of the v1.2.0 release are not recorded anywhere; the inventory names AhmedBaset/hadith-json only.
GEMINI: princeton-geniza-pgp-metadata-v1-2 (datasets): the Zenodo record URL for deposit 22663982 and its licence line are not recorded in a ledger.

## Wrap-up queue
Founder rule, 14 November 2026: finish and clean up partly done books before starting new ones.
Ranked by share mined, highest first (first pass from the books segment, 14 November 2026; refresh
from the register). "Active" means another worker is mining it: skip until they finish. Every book
below also needs its OCR zip verified before any deletion.

| # | Book id | Share mined | Remaining | Blocked or active |
|---|---|---|---|---|
| 1 | futuh-buldan | text 100 percent (pp. 1-665 of 768, rest is the index) | OCR zip | no |
| 2 | muruj-dhahab, shadharat-dhahab, tarikh-khulafa, jami-ulum-hikam, nisa-hawl-rasul | about 100 percent per ledgers | OCR zip; nisa-hawl-rasul has no PR recorded | no |
| 3 | kamil-tarikh | essentially complete per ledger | OCR zip; no source id or PR found | no |
| 4 | sira-hadi-ila-al-haqq | about 62 percent (printed pp. 1-285 of 461) | pp. 286 to end | ACTIVE; tax-ruling concepts held |
| 5 | ibn-haytham-manazir | about 66 percent | scan pp. 372-533 | founder-held pp. 532, 546, 666 |
| 6 | canon-ibn-sina-print-v1 (v2, v3) | about 41 percent | Book II onward, v2, v3 | ACTIVE |
| 7 | zij-sabi-harrani | unknown | revision pass | ACTIVE |
| 8 | tabaqat-fuqaha | about 10 percent | PDF p. 64 onward | no |
| 9 | fiqh-mawsua-kuwaitiyya | about 8 percent | the rest | no |
| 10 | hilyat-awliya | volume 10 to printed p. 689 | ruling on queue vs next volume | held pp. 532, 546, 666 |
| 11 | tafsir-tabari-shakir | volume 1 complete | later volumes | no |


## Wrap-up resume point (14 November 2026)
Pilot deletions done: futuh-buldan (810,710,973 bytes), muruj-dhahab (818,525,591), shadharat-dhahab (1,072,868,085); OCR zips kept under ocr-archive/tareekh/. Next on the queue: tarikh-khulafa, jami-ulum-hikam, nisa-hawl-rasul, kamil-tarikh, then tabaqat-fuqaha. Skip sira-hadi-ila-al-haqq, canon-ibn-sina and zij-sabi while active. The queue table above is not yet ticked for the three finished books.
