# Lane `lib-<book-id>`: the library of prominent Sunni works

**Idea.** About 200 prominent Sunni books (hadith, tafsir, Qur'an sciences, sira, shamail, sahaba, sahabiyat, tabaqat, rijal, creed, history, geography, fiqh, usul, adab) are located as reference copies, extracted to page text, and mined one book per lane into the knowledge graph. The list is `scripts/harvest/library/books.yaml` (id, title, author, death year, category).

**How a book becomes text** (on the founder's Mac, outside git; see `docs/status.md` for the live state of downloads and extraction):
1. `scripts/harvest/library/fetch_books.py` finds open archive.org PDFs (never borrow-only) and records them in `~/islam-museum-harvest/library/manifest.jsonl`. Matches are heuristic: check the item title for books that matter.
2. `ocr_all.py [--cat <category>] [--only <book-id>]` extracts page text (text layer, or Apple Vision OCR for scans; two-column pages are read right column first) into `~/islam-museum-harvest/books/<category>/<book-id>/<item>/`.
3. `make_sources.py --write` creates draft `source` entities; check the edition details against a physical copy before the source is marked reviewed.
4. `make_work_order.py <book-id>` prints the order for a lane: the book's facts, its extracted copies, the category guidance, and the progress state.

**Rules.** [`../mining-sources.md`](../mining-sources.md), the category guidance in [`../categories/`](../categories/) (`hadith`, `tafsir`, `seerah-tareekh`, `people`, `aqeedah-fiqh`), [`../content-standards.md`](../content-standards.md), [`../workflow.md`](../workflow.md).
**Branch / stubs / progress:** `content/lib-<book-id>`; `data/_stubs.d/lib-<book-id>.yaml`; `docs/delegation/library/<book-id>.md` (edition and item used, page offset, sections done, next step). Commit prefix `content(lib-<book-id>)`.

## Priority order

1. Sira and Companions books that deepen the Prophetic spine (Ibn Sa'd, al-Isaba, al-Isti'ab, Usd al-Ghaba, Zad al-Ma'ad, al-Bidaya).
2. The introductions of the six hadith collections and the passages that existing pages cite.
3. The introductions of the major tafsirs and their occasion-of-revelation links.
4. History (al-Tabari, Ibn al-Athir) in annals order.
5. Creed and fiqh (concepts and perspectives).
6. Geography and the biographical dictionaries.

Gap lists from Arabic Wikipedia (discovery only; titles are pointers, never sources) are in `docs/delegation/gap-batches.md`: `~/islam-museum-harvest/candidates/batches/<lane>-NN.tsv`.

## Dictionaries of people (al-Isaba, Usd al-Ghaba, al-Isti'ab, Tabaqat, Siyar)

Do not process a dictionary entry by entry. Work from the museum's priority list: first the people already referenced by existing entities (unresolved person targets in `data/_stubs*.yaml`), then the Prophet's family and wives, the Companions around him, the narrators with the most hadith, then the rest by tabaqa. Locate an entry by its printed running number with `scripts/harvest/library/dict_entry.py` (builds a heading index from the extracted pages, re-reads the pages with column-aware OCR, prints one entry). Read the entry, take names with nasab, kunya, relatives, conversion and emigration as the book reports them, the campaigns, narrations attributed to named transmitters, death date and place with every variant the entry gives, and Ibn Hajar's (or the author's) own verdicts and corrections, each attributed. Entries that are only cross-references («تقدم في…» «يأتي في…») are skipped: go to the main entry. The same person appears in several dictionaries: reuse the id, add the second source, never duplicate.

## Done so far (from `git log`; the progress files hold the detail)

The `lib-isaba` stream wrote about 80 people from al-Isaba on the Prophet's family, wives, aunts and early women, and about 40 Companions (the Ansar, the Meccan converts, the delegations and the later conquests), in batches of 11 to 24; `source/ibn-hajar-isaba` records the edition used (the one-volume al-Maktaba al-Asriyya print; printed page = PDF page). Still open in al-Isaba: more Companions by letter (many entries are brief), the kunya section, and the women whose headings were only cross-references.
