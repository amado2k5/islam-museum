# Harvest files kept on the drive (keep-or-delete list)

Location: `/Volumes/exmicroSD/islam-museum-harvest/`. Everything below is **kept**. Nothing in this list has been deleted. Founder's rule (12 Oct 2026): no dump is deleted until the founder decides to keep or delete it, so this list is the record for that decision.

Total on the drive: about 272 GiB (raw 235 GiB, books 26 GiB, db 5.5 GiB, layers 4.1 GiB).

## Raw downloads (cannot be rebuilt without re-downloading)

| Path | Size | Used for | Keep or delete? |
|---|---|---|---|
| `raw/wikidata/latest-all.json.bz2` | 96 GiB | Wikidata subset (already built); needed for any rebuild with new seeds | Open. Needed if the rebuild (queries q06–q08) goes ahead; otherwise deletable. |
| `raw/wikipedia/en/enwiki-latest-pages-articles-multistream.xml.bz2` | 25 GiB | English text (extraction not yet run) | Open |
| `raw/wikipedia/fr/frwiki-…pages-articles…bz2` | 6.8 GiB | French text, not yet parsed | Open |
| `raw/wikipedia/ru/ruwiki-…` | 5.8 GiB | Russian text, not yet parsed | Open |
| `raw/wikipedia/de/dewiki-…` | 7.7 GiB | German text, not yet parsed | Open |
| `raw/wikipedia/es/eswiki-…` | 5.0 GiB | Spanish text | Open |
| `raw/wikipedia/ja/jawiki-…` | 4.5 GiB | Japanese text | Open |
| `raw/wikipedia/it/itwiki-…` | 4.2 GiB | Italian text | Open |
| `raw/wikipedia/zh/zhwiki-…` | 3.4 GiB | Chinese text | Open |
| `raw/wikipedia/pt/ptwiki-…` | 2.7 GiB | Portuguese text | Open |
| `raw/wikipedia/ar/arwiki-latest-pages-articles-multistream.xml.bz2` | 2.0 GiB | Arabic text, parsed into `db/wikipedia-ar.duckdb` | Open; parsing done |
| `raw/wikipedia/en/enwiki-latest-{page,categorylinks,linktarget}.sql.gz` | 2.3 + 2.4 + 1.3 GiB | English category walk tables in `db/wikipedia.duckdb` | Open; loaded |
| `raw/wikipedia/ar/arwiki-latest-linktarget.sql.gz` | 515 MiB | Arabic link targets | Open |
| `raw/wikipedia/fr/frwiki-latest-categorylinks.sql.gz` | 656 MiB | French category links | Open |
| Other Wikipedia dumps (bn, fa, id, ko, nl, th, tr, ur) | 0.5–2 GiB each, about 7 GiB total | Not parsed yet | Open |
| `raw/openiti/OpenITI-Makhzan_Data_2026-1-2.zip` | 5.7 GiB | Makhzan corpus (non-commercial layer) | Open; md5 checked |
| `raw/openiti/corpus/OpenITI_data_2025-1-9.zip` | 5.5 GiB | OpenITI corpus (non-commercial layer) | Open; md5 checked |
| `raw/library/**/*.pdf` (library books) | about 20 GiB | Source PDFs for the library lane (Ibn Sa'd copy in use: `tabaqat/tabaqat-ibn-saad/AAlexandrina-144131.pdf`) | Keep (needed for citations and page checks) |
| `raw/library/tafsir/tafsir-baghawi/MS.ARA.97.pdf`, `…98.pdf` | 1.2 + 1.4 GiB | Tafsir al-Baghawi scans | Keep |

## Derived data (rebuildable from the raw files)

| Path | Size | Notes |
|---|---|---|
| `layers/cc0/wikidata/` (Parquet tables, `wikidata-subset.duckdb`, `kept.txt`, `needed.txt`, seed JSON) | about 1 GiB | The built Wikidata subset. Rebuildable with the dump. |
| `db/harvest.duckdb` | 2.4 GiB | Main working database |
| `db/wikipedia.duckdb` | 2.3 GiB | English category walk tables |
| `db/wikipedia-ar.duckdb` | 536 MiB | Arabic tables |
| `db/wikipedia-ms.duckdb`, `wikipedia-ur.duckdb` | about 240 MiB | Partial tables |
| `layers/by-sa/wikipedia/{ar,en}/pages.jsonl` | 778 + 621 MiB | Wikipedia page text (by-sa layer, pointers only) |
| `layers/by/geonames/allCountries.txt`, `alternateNamesV2.txt` | 1.7 + 0.75 GiB | GeoNames (CC BY) |
| `basemaps/ETOPO1_Ice_g_gmt4.grd` | 890 MiB | Elevation for maps |
| `books/**` (extracted book text, OCR) | 26 GiB | Never in git. Needed to continue the library lane. |

## Notes for the decision

- The Wikidata dump is the only way to rebuild the subset with new seed queries. If the founder decides not to rebuild, the 96 GiB file can go without losing the current tables.
- The Wikipedia dumps are needed for any further parsing (`select_pages.py`, `extract.py`). Each language's pages can be deleted once its tables are loaded and verified.
- `books/` and the library PDFs support citations and page checks, so they should be kept while the library lane runs.
- Sizes are from `du` on 12 Oct 2026.
