# Gap batches: what the museum still lacks, from Arabic Wikipedia (discovery only)

Generated 11 Oct 2026 by `scripts/harvest/wikipedia/gap_report.py` then `plan_batches.py`. Wikipedia is a pointer: a title here means "an Arabic encyclopaedia thinks this exists and is in scope", never a source. Write each entity from real sources (the books in the library lane, OpenITI, Ibn Sa'd, al-Isaba, Tahdhib al-Kamal…), cite those, and follow `docs/agents/content-standards.md`.

Files (outside git, on the drive): `~/islam-museum-harvest/candidates/entities/wikipedia-ar-gaps.tsv` (top 5,000 of 51,709 gaps) and `~/islam-museum-harvest/candidates/batches/<lane>-NN.tsv` (25 titles each, first 20 batches per lane). Re-run both scripts after each merge to main so finished entities drop out.

| Lane | Candidates | Batches planned | Fits which work | Notes |
|---|---|---|---|---|
| sahabiyat | 23 | 1 | Ibn Sa'd (women's volume), al-Isaba, Siyar | Prophet's daughters and aunts, Umm Hani', Maria al-Qibtiyya. Start here. |
| sahaba | 134 | 6 | al-Isti'ab, Usd al-Ghaba, al-Isaba | The list is category-driven and includes names that are not Companions (for example Abdullah ibn Ubayy). Never infer faith from a category: record it only with its basis. |
| tabiun-narrators | 437 | 18 | Tahdhib al-Kamal, Siyar, Tahdhib al-Tahdhib | Muhammad ibn al-Hanafiyya, Urwa ibn al-Zubayr, al-Hasan al-Basri, Nafi'. |
| scholars-imams | 1,207 | 20 | Siyar, Tarikh Baghdad, Tabaqat | Mixes classical and modern scholars; put the classical ones first. |
| rulers-caliphs | 687 | 20 | al-Tabari, Ibn al-Athir, al-Bidaya | Many Ottoman and modern rulers: sort by period; skip living figures for now. |
| battles-events | 221 | 9 | al-Tabari, Ibn al-Athir | Yarmuk, the fitna after Uthman's killing, Ankara; includes Crusader-era and later events. |
| mosques-places | 271 | 11 | Mu'jam al-Buldan, Rihla, al-Muqaddasi | Prophet's Mosque, Ibn Tulun, Hagia Sophia, Great Mosque of Sanaa. Coordinates from Wikidata only after the filter finishes. |
| works-books | 165 | 7 | the library canon itself | Sunan Ibn Majah, al-Tabaqat, Riyad al-Salihin, al-Kamil, al-Raheeq: create `work` + `source` entities with `make_sources.py`. |
| groups-dynasties | 413 | 17 | chronicles | Contains modern organisations: review before writing; no sectarian labels in the museum's voice. |
| people-other | 535 | 20 | mixed | Al-Khansa', al-Ahnaf ibn Qays, Umar al-Mukhtar. |
| pages-review | 893 | 20 | n/a | General topics (Islamic philosophy, calligraphy, Taj Mahal): turn into `concept` or exhibit ideas, not entities. |

Known limits: the match against existing entities uses normalised Arabic names, so spelling variants slip through (for example «ابن سلول» vs «بن أبي»): grep `data/` before creating anything. English titles are empty because the extractor did not capture interlanguage links; use Wikidata after the filter finishes. Scores favour pages with many links, which skews toward famous modern topics.
