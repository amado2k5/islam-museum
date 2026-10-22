# OCR status of the library PDFs on the harvest drive

Shared record for every agent and human. The drive is `/Volumes/exmicroSD/islam-museum-harvest` (it is not in git, and only the founder's machine has it mounted). Count by running:

```bash
python3 scripts/harvest/ocr_status.py --list /tmp/not-ocrd.txt
```

The script reads metadata and file names only. It opens no PDF and writes nothing except the `--list` file.

## Last count: 22 Oct 2026

| Bucket | PDFs |
|---|---|
| OCR complete (metadata says all pages done) | 776 |
| OCR complete, output in `books/<cat>/<book>/<id>/book.txt` | 11 |
| OCR complete, output in `ocr/<category>/<name>.txt` | 107 |
| Partly OCR'd (`ocr_pages` < `pages`) | 82 |
| Metadata says 0 OCR pages | 45 |
| No metadata and no OCR output | 100 |
| **Total PDFs in `raw/library/`** | **1,121** |

**Not OCR'd at all: 145** (45 + 100). **Partly OCR'd: 82.**

Earlier chat counts said 147 not OCR'd. The 2-file difference is two `ali-ibn-abi-talib` PDFs. The script counts them as OCR'd because their text sits in that category's `ocr/` folder under a similar but not identical name. Treat the script as authoritative.

## How the count works

- Every OCR'd book has `books/<cat>/<book>/<id>/meta.json` (`pdf`, `pages`, `ocr_pages`) and `book.txt`. Page PNGs are deleted after OCR, so an empty `pages-png` folder does not mean "not OCR'd".
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
