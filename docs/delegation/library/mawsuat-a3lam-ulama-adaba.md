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
- (12 Oct 2026) Batch 1b (vol. 1, pp. 116–238): 13 Tier 2 entries: al-Amidi, Ibn al-Abbar, Aban al-Lahiqi, Abkarius, al-Abhari (Athir al-Din), al-Abhari (Abu Bakr), al-Abbi, Abd al-Hadi Naja al-Abyari, Ali al-Abyari, Abu al-Abbas al-Abyani, Ibn al-Abrash, al-Abraqawhi, al-Ibshitay. Printed date pairs conflicting in the source (Aban al-Lahiqi, al-Abbi's birth range) are recorded as approximate CE years only.
- (12 Oct 2026) Batch 1c (vol. 1, pp. 116–504): 12 Tier 2 entries, including Ibn al-Ajdabi, al-Khalil al-Farahidi, Ibn al-Ahmar, al-Idrisi, Zaki al-Arsuzi and Hammad ibn Zayd. Tier 1 enrichment for the existing Ibn al-Athir entries is still pending.
- (12 Oct 2026) Batch 1d (vol. 1, pp. 531–681): 9 Tier 2 entries: al-Azhari, Ibn Abi Usama, al-Astarabadhi, al-Isfara'ini, Abu Awana, al-Ansari al-Harawi, al-Isma'ili, al-Asmandi, al-Isnawi.
- OCR complete (12 Oct 2026): all seven volumes OCR'd; the page counts match the PDFs. Volume 6 is absent from the set.
- Entry indexes and tiers built (harvest workspace, not committed): v01 251 entries, v02 231, v03 277, v04 324, v05 220, v07 153, v08 241. Indexes are first-pass and still need the undated-opening pass.

**Flags:**
- Volume 6 (m-a-3-o-06.pdf) is absent from the founder's folder — its letter range will be missing entirely.

**Next:** when OCR finishes, map each volume's letter range, then batch-mine starting with authors of existing `work/*` entities.
