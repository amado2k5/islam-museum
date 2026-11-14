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

## D. Pages read: the drive measured (14 November 2026, 01:00)

A read-only script on the founder's Mac opened every `pages.json` under `islam-museum-harvest/books` (the OCR output of each scan) and counted pages per book. It changed nothing on the drive. The page numbers a record cites (its `provenance.source` note, such as "ص 138", and each passage's `ref`) were then matched against those counts.

- **537 books are OCR'd on the drive**: about 487,000 pages counting the largest scan of each book, about 998,000 counting every edition.
- **285 of the 299 canon books are on the drive**. The ledger lists only 227 as harvested, so the ledger lags the drive by about 58 books (`python3 scripts/harvest/library/authenticity_ledger.py` would bring it up to date).

Pages touched, per canon book on the drive (285 books, about 385,000 OCR'd pages, about 30,500 touched, roughly 8%):

| Share of the book's pages touched | Books |
|---|---|
| No graph record found | 30 |
| Under 1% | 68 |
| 1–10% | 130 |
| 10–50% | 47 |
| 50% or more | 10 |

The ten at 50% or more, by share (OCR pages in brackets): al-Nawawi's Forty Hadith (70), Jami' al-Ulum wal-Hikam (956), the Muwatta (884) and al-Suyuti's Tarikh al-Khulafa (864) at or near 100%; al-Raheeq al-Makhtum 76% (472); Muruj al-Dhahab 74% (804); a scan of the Kuwaiti fiqh encyclopedia 73% (468); Shadharat al-Dhahab 58% (912); Futuh al-Buldan 54% (784); al-Khwarizmi's algebra 52% (130).

These are **lower bounds, and rough**. Many records carry no page number, and printed page numbers differ from scan pages, which is why the Muwatta and the Forty Hadith come out at or above 100% (shares are capped at 100% here). The 252 non-canon books on the drive are left out of the table: they could only be matched by name, so their "no record found" figure is unreliable. The raw per-book table was not committed; it stays on the Mac at `~/devin-harvest/page-counts-2026-11-14.tsv`.

## Method and limits

1. Every record under `data/` was read; a record "cites" a book when the book's work or source id appears in its `sources`, in a relation's `sources`, or as a passage's `work`.
2. Canon books were tied to the graph through their progress file, the id map in `scripts/harvest/library/idmap.py` and the slug; the "best effort" column adds an Arabic title plus author match.
3. A "light" count can be a single mention. A "deep" count can be one subject mined thoroughly (Futuh al-Buldan's 1,483 records are mostly people, places and events), so depth is not page coverage.
4. Sections A–C use graph citations only. Section D adds page counts from the drive; it is the closest the repo has to a coverage percentage, but the pages-touched side depends on records citing page numbers. A firm measure needs each mining lane to record pages read against pages total.
5. The ledger covers 259 of the 299 canon books and lists 227 with files; section D shows the drive holds 285, so the "harvested" figures in section A are an undercount.
6. Section A's "harvested" is the ledger's claim; section D checked the files on the drive.
