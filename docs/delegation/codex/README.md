# Codex library pipeline: from a downloaded book to museum entities

Run on the founder's Mac. Everything heavy stays in `~/islam-museum-harvest` (external drive); git only receives entity files.

1. **Find and download** (running in tmux `fetch-books`): `scripts/harvest/library/fetch_books.py` reads `books.yaml` (about 200 prominent Sunni works: hadith, tafsir, seerah, sahaba, sahabiyat, aqeedah, tareekh, fiqh, usul…) and takes open PDFs from archive.org (never borrow-only). Log: `~/islam-museum-harvest/logs/fetch-books.log`; manifest: `~/islam-museum-harvest/library/manifest.jsonl` (item, title, sha256, source URL for each file). Matches are heuristic: a human reviewer should glance at `item_title` for books that matter; wrong editions are discarded by deleting the manifest line and file.
2. **Extract text per page**: `cd scripts/harvest/library && caffeinate -i uv run --quiet --with pymupdf --with ocrmac python ocr_all.py [--cat hadith] [--only ID]` (text layer when the PDF has one, Apple Vision OCR otherwise; output in `~/islam-museum-harvest/books/<cat>/<id>/<item>/`).
3. **Create draft source entities** (once): `python make_sources.py --write`, then `npm run validate`, then commit only those files (explicit paths).
4. **Make a work order and paste it into Codex**: `python make_work_order.py <book-id> --out /tmp/order.md` (or print it). `--list` shows which books have extracted text and which are in progress. One Codex session per book; run several books in parallel only across different categories (each session works in its own clone and branch `content/lib-<book-id>` and pushes to main often).
5. **Check**: `npm run validate && npm test && python scripts/harvest/library/verify_cites.py`.

Priority order suggested: (1) the sira/sahaba books that deepen the Prophetic spine (Ibn Sa'd, al-Isaba, al-Isti'ab, Usd al-Ghaba, Zad al-Ma'ad, al-Bidaya), (2) the six hadith collections' introductions and the passages that existing pages cite, (3) the major tafsirs' introductions and occasion-of-revelation links, (4) tareekh (al-Tabari, Ibn al-Athir) in annals order, (5) creed and fiqh (concepts and perspectives), (6) geography and biographical dictionaries.

Copyright and rights: facts, names, dates, attributed grades and short quotations only; PDFs and OCR text never enter git; the museum republishes nothing of the books.
Prompt files: `common.md` (all rules), `hadith.md`, `tafsir.md`, `seerah-tareekh.md`, `people.md`, `aqeedah-fiqh.md`.
