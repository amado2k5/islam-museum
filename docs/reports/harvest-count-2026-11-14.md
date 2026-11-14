# How many books are harvested? A measured count (14 November 2026)

Measured on `main` at `a0ba89cf3` (58,073 records, the same total as `docs/coverage.md`). It replaces nothing in the Charter yet: Article 4's "1–1.5% of the first thousand books" is still the founder's estimate, and this count is a proxy that should be read beside it. No record or page was changed to make it.

## Two different things the repo calls "harvest"

- **Harvested** means the book exists as extracted text on the founder's Mac (a harvest folder, recorded in `docs/authenticity-ledger/books/<id>.yaml` as `harvest.files`).
- **Mined** means the book's contents have become records in the graph (passages, people, events, places and so on that cite it).

A book can be harvested and not mined. The repo has no flag that says a book is "fully" either; it has only the Charter's estimate, `status.completeness` (a 0–5 score of how rich a record is, not how much of the book was read), and the prose notes in `docs/delegation/library/<book>.md`.

## A. The canon list: 299 prominent books (`scripts/harvest/library/books.yaml`)

The canon is the museum's own list of books to locate and mine. Three of its entries duplicate another (the Kuwaiti fiqh encyclopedia appears three times, Ahsan al-Taqasim twice), so treat 299 as about 295 distinct books.

| | Books |
|---|---|
| Harvested as text (ledger record with files) | **227** |
| Not harvested (no harvest folder, or none with files) | **72** |

Mining depth, by the number of graph records that cite the book. "Strict" uses only records tied to the book through its id or its progress file; "best effort" also matches by Arabic title and author. The truth lies between them, because a title match can attach the wrong record.

| Mining depth | Strict (all 299) | Best effort (all 299) | Best effort, of the 227 harvested |
|---|---|---|---|
| None | 96 | 41 | 20 |
| Light (1–9 records) | 77 | 91 | 61 |
| Moderate (10–99) | 99 | 129 | 113 |
| Deep (100 or more) | 27 | 38 | 33 |

So: about **20 of 227** harvested canon books show no mining at all; **33** are mined deeply.

## B. All 1,754 book-like works in the graph

Works of kind book, treatise, tafsir or tafsir-volume, counted by the records that cite the work or its own specific sources (sources shared by more than one work are ignored).

| | Works | Share |
|---|---|---|
| No citing record | 1,404 | 80% |
| 1–9 records | 172 | 10% |
| 10–99 | 150 | 9% |
| 100 or more | 28 | 1.6% |

237 of the 1,754 have passage extracts. A further 265 book-type source records are not tied to any work; 243 of them are cited by something.

## C. "Fully" mined: what the repo can actually vouch for

Only four books carry an explicit statement that they are complete:

- **The Qur'an**: all 6,236 verses (`docs/status.md`, Phase 3).
- **Jami' al-Ulum wal-Hikam**: all 50 hadiths, "Complete 12 Oct 2026" (`docs/status.md`, `docs/delegation/library/jami-ulum-hikam.md`).
- **Tarikh al-Khulafa (al-Suyuti)**: "BOOK COMPLETE", 864 pages OCR'd and mined pp. 93–801 (`docs/delegation/library/tarikh-khulafa.md`).
- **al-Kamil fi al-Tarikh (Ibn al-Athir)**: one scan "essentially complete" (`docs/delegation/library/kamil-ibn-al-athir.md`); the rest of the book is not claimed.

Others with very high record counts (the Muwatta, al-Bukhari, Futuh al-Buldan, the Kuwaiti fiqh encyclopedia, al-Raheeq al-Makhtum) are deep but not stated to be finished. Sahih Muslim has 434 passages and Sahih al-Bukhari 318: slices, not the whole.

## Method and limits

1. Every record under `data/` was read; a record "cites" a book when the book's work or source id appears in its `sources`, in a relation's `sources`, or as a passage's `work`.
2. Canon books were tied to the graph through their progress file, the id map in `scripts/harvest/library/idmap.py` and the slug; the "best effort" column adds an Arabic title plus author match.
3. A "light" count can be a single mention. A "deep" count can be one subject mined thoroughly (Futuh al-Buldan's 1,483 records are mostly people, places and events), so depth is not page coverage.
4. Nothing in the repo records a book's total page count against pages read, so no true percentage can be given. A real measure needs each mining lane to record pages read against pages total.
5. The ledger covers 259 of the 299 canon books; 40 have no ledger record and are counted as not harvested.
6. Harvest folders live on the founder's Mac, outside git, so "harvested" here is the ledger's claim, not a check of the files.
