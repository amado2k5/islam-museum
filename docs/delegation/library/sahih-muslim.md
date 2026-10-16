# Library lane: Sahih Muslim — crown-passage extraction

**Book:** صحيح مسلم — الإمام مسلم بن الحجاج النيسابوري (ت 261هـ), the second of the two Sahihs.
**Book id:** `work/sahih-muslim` · `source/sahih-muslim` · category `hadith` · lane `hadith-muslim-passages` (Devin, SWE-2 High).

**Scans used (outside git, on `/Volumes/exmicroSD/islam-museum-harvest/books/hadith/sahih-muslim/`):**
- `20260227_20260227_2223` — Dar al-Taaseel print, cleanest OCR, **its own bracketed numbering** [٢٧٢٨ etc.] plus a back-of-book matn→number index. Primary search copy → `/tmp/muslim-norm.txt` (diacritics stripped).
- `sa71mir_gmail_20160501` — margin-numbered print (٦٢٣٢ etc. in the fada'il region). Normalized → `/tmp/muslim-sa71-norm.txt`.
- `anouaroc_hotmail_20160726_1141` — Fu'ad Abd al-Baqi edition; OCR is rough, used for cross-checks only.
- `20211117_20211117_0406` — rough OCR, with embedded commentary.

**Numbering convention (important):** the scans carry three different schemes. `ref` always cites the **standard Abd al-Baqi number** (the one sunnah.com prints); each passage's provenance records the Dar al-Taaseel print number verified in-scan. Mapping examples: print 2354–2356 = 2282–2284, print 2726–2728 = 2637–2639, print 3085 = 2965, print 1053 = 1042, print 6232–6236 = 2344–2347. Verify each number against sunnah.com or a published index before minting — earlier seal-hadith mints were off by one region and were corrected in commit 58746221 (Jabir = 2344, al-Sa'ib = 2345, Ibn Sarjis = 2346).

**Record shape:** `data/passage/muslim-NNNN.yaml` with `unit: hadith`, `work: work/sahih-muslim`, matn excerpt ≤40 words (no honorifics — the renderer supplies them), own-words `summary.ar`, `mentions`/`basis_for` edges to people/concepts, draft status, provenance run `hadith-muslim-passages-N`.

**Done (215 files on main as of f51a93ef):**
- `muslim-muqaddima-isnad` + iman foundations: 8, 16, 20, 22, 28–29, 34–37, 40, 42–45, 47, 49, 50, 54, 55, 57–59, 82, 83, 89–91, 96, 98, 102, 105–107, 118, 140, 142, 145, 162, 179, 184, 186, 199, 202, 218, 221
- Worship/zakat: 223, 246, 249, 384, 408, 482, 532–533, 591, 633, 637, 650–651, 667, 725, 779, 783, 797–798, 854, 944–945, 1014–1016, 1031, 1033, 1035, 1042, 1048, 1079, 1162, 1164, 1218, 1337, 1349, 1354, 1365, 1381, 1390, 1400, 1553, 1631, 1650, 1742, 1820–1821, 1829, 1864, 1904, 1955, 2162, 2230
- Ramadan/tawba: 760, 1079, 2759–2760
- The Prophet's person / shama'il: 2276, 2278–2279, 2307–2309, 2311, 2321, 2330, 2355, seal bab 2344–2347
- Companions/Ahl al-Bayt: 2381–2382, 2396, 2401, 2405, 2408–2409, 2411, 2419, 2421, 2424, 2430, 2432, 2449, 2458, 2466, 2477, 2479, 2486, 2533, 2770
- Birr/ethics: 2540–2541, 2552–2560, 2563–2565 (incl. 2564a), 2577–2578, 2580–2584, 2585–2590, 2592–2593, 2599, 2608–2609, 2626, 2637–2639, 2643, 2646, 2664, 2669, 2673–2674, 2676–2677, 2683, 2693–2695, 2699, 2707–2709, 2740, 2742, 2785–2786, 2816, 2820, 2888, 2946, 2956, 2965, 2982–2983, 2999
- **Numbering correction**: the Abu Shurayh «إن مكة حرمها الله» report is Abd al-Baqi **1354**, not 1353 (fixed in f584932e; verified against published numbering — same off-by-one region as the seal cluster).
- Entity enrichments riding on these: umar, ali, aisha, fatima, hasan, husayn, zayd-ibn-arqam, jabir, sahl-ibn-sad, ghadir-khumm, incident-of-the-slander, farewell-pilgrimage, ahl-al-bayt, ihsan, tahara, ukhuwwa, ilm, sadaqa, hadith-qudsi, zulm, isnad, ridda-wars, shama'il, khatm-al-nubuwwa; `person/jibril` promoted from stub.
- Trail `path-hadith` room «نماذج من الصحيح» features 3 Muslim + 6 Bukhari passages.

**Open:** crown coverage is now deep; remaining material is mostly fiqh runs (buyu', ahkam), medicine (tibb), and repeated isnad variants — lower museum value. Natural next book: **Sunan al-Tirmidhi** (Shama'il + manaqib complement this corpus) — no scan located in the harvest yet; check `books/hadith/` before starting. Other candidates: Sahih al-Bukhari residuals (35 `passage/bukhari-*` exist), Sunan Ibn Majah.
