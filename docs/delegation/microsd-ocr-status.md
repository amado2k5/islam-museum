# OCR status of the library PDFs on the harvest drive

Shared record for every agent and human. The drive is `/Volumes/exmicroSD/islam-museum-harvest` (it is not in git, and only the founder's machine has it mounted). Count by running:

```bash
python3 scripts/harvest/ocr_status.py --list /tmp/not-ocrd.txt
```

The script reads metadata and file names only. It opens no PDF and writes nothing except the `--list` file.

## Last count: 23 Oct 2026

| Bucket | PDFs |
|---|---|
| Complete: `pages.json` covers every PDF page | 1,045 |
| Complete, output in `books/<cat>/<book>/<id>/book.txt` | 11 |
| Complete, output in `ocr/<category>/<name>.txt` | 107 |
| **Total PDFs in `raw/library/`** | **1,163** |

**Not OCR'd at all: 0. Partly OCR'd: 0.**

Of the complete books, 800 have one or more blank pages (scanned blank pages, kept as empty entries). They are reported separately and do not count as missing.

What changed in this run (22–23 Oct 2026): 227 books were OCR'd with Apple Vision (`scripts/harvest/library/ocr_book.py`), then 15 more PDFs that had been added to the drive after the first list was built, then one more PDF. Before the run, 145 were not OCR'd and 82 were partly OCR'd. The partly OCR'd count was partly a metric error: `ocr_pages` counts only pages Apple Vision read, so pages with an embedded text layer were counted as missing.

## How the count works

- A book is complete when its `books/<cat>/<book>/<id>/pages.json` has one entry per PDF page. `ocr_pages` in `meta.json` is not a completeness test: pages with a text layer are taken from the layer, not Apple Vision.
- Every OCR'd book also has `meta.json` (`pdf`, `pages`, `ocr_pages`) and `book.txt`. Page PNGs are deleted after OCR, so an empty `pages-png` folder does not mean "not OCR'd".
- Match each `raw/library/<cat>/<book>/<id>.pdf` to its metadata by basename, then by mirror path. Some `pdf` values in `meta.json` are truncated at spaces, so exact-path matching undercounts.
- Compare Arabic names in Unicode NFC. Without it, about 100 matches fail.
- Do not run recursive globs over `books/`. It holds about 595k PNGs and times out.

## Keeping this current

Anyone who changes the library on the drive updates this file in the same pull request:

- **Adds PDFs to `raw/library/`**, or **OCRs a book**: run the script on the drive's machine and replace the table above with the new numbers and the date.
- **Cannot reach the drive** (a cloud agent such as Devin, or a session elsewhere): do not guess. Add a dated line to the "Changes" list below saying which books were added or OCR'd, and ask the founder to run the script.
- Record every run in the "Changes" list, even when the numbers do not move.

## Changes

- 22 Oct 2026: first shared count, via `scripts/harvest/ocr_status.py`.
- 23 Oct 2026: full OCR run (227 books, then 15 late-added PDFs, then 1 more). Result: 0 not OCR'd, 0 partly. Counting rule changed to `pages.json` coverage in `scripts/harvest/ocr_status.py`.
