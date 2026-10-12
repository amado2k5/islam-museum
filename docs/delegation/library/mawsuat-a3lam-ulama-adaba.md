# Library lane: موسوعة أعلام العلماء والأدباء العرب والمسلمين (ALECSO/Dar al-Jil 2004–2005)

**Book:** موسوعة أعلام العلماء والأدباء العرب والمسلمين — المنظمة العربية للتربية والثقافة والعلوم (أليكسو)، بترخيص لدار الجيل للطباعة والنشر والتوزيع، بيروت، الطبعة الأولى 1425–1426هـ / 2004–2005م. ثمانية مجلدات على ترتيب حروف المعجم.
**Book id:** `mawsuat-a3lam-ulama-adaba` · category `rijal` · branch `content/lib-mawsuat-a3lam` · stubs `data/_stubs.d/lib-mawsuat-a3lam.yaml`.

**Edition and items used:** founder's local PDFs `~/Downloads/m-a-3-o-04/m-a-3-o-{01,02,03,04,05,07,08}.pdf` (kitabweb-2013.forumaroc.net scans). **Volume 6 is missing from the set.** OCR'd with Apple Vision into `books/rijal/mawsuat-a3lam-ulama-adaba/v01..v08/` (pages.json + meta.json per volume; page numbers are PDF page indices, printed-page offset to be established per volume).

**Volume letter ranges (from running heads):**
| File | PDF pages | Letter range |
|---|---|---|
| m-a-3-o-01 | 702 | الأبري – الأسير |
| m-a-3-o-02 | 640 | (to be recorded) |
| m-a-3-o-03 | 760 | (to be recorded) |
| m-a-3-o-04 | 864 | (to be recorded) |
| m-a-3-o-05 | 631 | (to be recorded) |
| m-a-3-o-07 | 438 | (to be recorded) |
| m-a-3-o-08 | 687 | (to be recorded) |

**Plan:** the encyclopedia lists thousands of scholars and writers. Per `mining-sources.md`, existing museum persons (especially authors of registered works and prophetic-era/early figures) get corroborating `source/mawsuat-a3lam-ulama-adaba` citations with volume+page; missing notable scholars (e.g. authors of works already in the library, madhhab imams, famous historians/muhaddithin) get new draft entities. Priorities: (1) authors of existing `work/*` entities, (2) persons the museum already covers, (3) high-notability scholars absent from the graph. Claims `status: tradition`; the encyclopedia's uncertainty markers preserved. Entries are never republished as prose.

**Done:**
- (12 Oct 2026) Lane opened. `source/mawsuat-a3lam-ulama-adaba`, `work/mawsuat-a3lam-ulama-adaba`, stubs file, this progress file. Vision OCR of all 7 volumes running into the harvest workspace.
- (12 Oct 2026) Batch 1a (vol. 1, pp. 273–277): Ibn al-Athir al-Jazari, Diya al-Din, Imad al-Din, Izz al-Din, Najm al-Din. Six works declared as stubs. Imad al-Din's birth year is printed inconsistently in the source (652 AH / 1245 CE); recorded as an uncertain CE year only.
- OCR status (12 Oct 2026): v01 complete (702 pages); v02 at page 506 of 640; v03, v04, v05, v07 and v08 not yet started. Phases 1–3 (index, tiering, batch mining) are blocked on v02 completion and the remaining volumes.

**Flags:**
- Volume 6 (m-a-3-o-06.pdf) is absent from the founder's folder — its letter range will be missing entirely.

**Next:** when OCR finishes, map each volume's letter range, then batch-mine starting with authors of existing `work/*` entities.
