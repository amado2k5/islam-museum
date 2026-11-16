# Wikipedia trusted-source leads (Sunni-filtered)

`datasets/wikipedia-trusted-leads-books.csv` and `datasets/wikipedia-trusted-leads-websites.csv`
list the books, works and websites most cited by in-scope Wikipedia articles — leads to real
sources for future harvesting, generated 16 November 2026.

## Origin

References (`{{cite book/journal/web/...}}`) extracted offline from the October 2026 Wikipedia
dumps by `scripts/harvest/wikipedia` (category walk from the Islam seed categories →
`extract.py` → `pages.jsonl`): 57,656 English and 98,061 Arabic pages, starting from the same
seed tree that contains Five Pillars of Islam. No Wikipedia API is used; everything runs on the
local dumps in `~/islam-museum-harvest/raw/wikipedia/`.

## Scope filter (Sunni only)

Shia/Twelver/Ismaili/Zaydi/Alawi/Alevi, Bahai, Ahmadiyya, Nation of Islam and Quranist works
are excluded — by author, publisher, journal, URL or a majority of cited titles — together with
the Shia canon (al-Kafi, Nahj al-Balagha, Bihar al-Anwar…), Shia scholars (Tabatabai, Khomeini,
al-Kulayni, al-Mufid…), non-Sunni domains (al-islam.org, wikishia, tebyan, alislam.org…) and the
project's blocked-media list, in English, Arabic and Persian scripts. A lone title-level match on
an otherwise clean work demotes it to a review file instead of excluding it, so encyclopedias
that share one ISBN across Shia and non-Shia entries are not lost. Filter script and full
outputs: `~/islam-museum-harvest/scripts-trusted/filter_trusted_refs.py` and
`~/islam-museum-harvest/candidates/sources/` (trusted / excluded / review TSVs for en and ar).

## Files and columns

- `datasets/wikipedia-trusted-leads-books.csv` — top 2,000 ranked works per language
  (rank, core_pages = citing pages within 2 category levels of a seed, pages, author, title,
  year, publisher, isbn, doi, url).
- `datasets/wikipedia-trusted-leads-websites.csv` — all cited domains whose hostname looks
  Islamic or scholarly (5,309 rows).
- `harvest_status`: `not_harvested` · `partial` (claimed/downloaded/ocr_done/mining in the
  harvest register) · `complete` (mined/ingested/complete/deleted) · `wanted-canon`
  (listed in `scripts/harvest/library/books.yaml`, the Sunni canon want-list, not yet fetched).
- `harvest_ref`: the register or books.yaml id the row matched. Matching is fuzzy
  (normalised title/author/domain); treat a `partial`/`complete` row as a strong hint and
  confirm against `docs/library/harvest-register.yaml` before relying on it.

## Status rule

These are leads, not registered sources: a candidate becomes a `data/source/` entity only after
a person finds the work in a catalogue, checks the details and registers it
(`docs/agents/source-families.md`, `scripts/harvest/sources.yaml`). Before harvesting any row,
look the item up in `docs/library/harvest-register.yaml`; when a lead is claimed or its state
changes, update its `harvest_status`/`harvest_ref` here in the same PR — the register stays the
record of what was actually done.
