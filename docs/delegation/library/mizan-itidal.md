# Library lane: Mizan al-I'tidal — al-Dhahabi (rijal)

**Book:** ميزان الاعتدال في نقد الرجال — شمس الدين الذهبي (ت 748هـ). Book id `mizan-itidal`, category `rijal`. Worker: Claude Code (OCR-harvest worker F), run `ocr-harvest-2026-11-04`. Stubs: `data/_stubs.d/claude-ocr-harvest-f.yaml`.

## Items and editions
| item | what it is | md5 | used as |
|---|---|---|---|
| AAlexandrina-139972 | Bijawi ed., Dar Ihya' al-Kutub al-Arabiyya (Isa al-Babi al-Halabi), **part 3** (entries 5337–8044, عبيد الله → محمد بن غزوان), 688 PDF pp., clean OCR | 07d5d40d… | `source/mizan-itidal-bijawi-v3` (main source) |
| AAlexandrina-166463 | Indian lithograph by order of Muhammad Khadim Husayn al-Azimabadi, **vol. 1** (alif → za'), 436 PDF pp., garbled OCR | 48905abb… | `source/mizan-itidal-azimabadi-v1` (introduction only) |
| AAlexandrina-128227 | second scan of the same lithograph vol. 1, 411 PDF pp. (not byte-identical) | 61607833… | cross-check of the introduction (its PDF pp. 6–7 = 166463 pp. 5–6) |
| AAlexandrina-155538 | same lithograph, **vol. 2** ('ayn → end, unnamed women), 689 PDF pp., garbled OCR | 71f48033… | `source/mizan-itidal-azimabadi-v2` (extent + publisher's note p. 689) |

**Page offset (Bijawi part 3):** printed = PDF − 2 (checked PDF 5/471/684 = printed 3/469/682). All Bijawi citations are printed pages. Lithograph citations are PDF pages of scan 166463 / 155538. No year on the Bijawi title page; lithograph press/year illegible — not recorded.

## Done
- **Batch 1** (introduction lithograph v1 PDF pp. 5–8; Bijawi part 3 printed pp. 3, 93–97, 468–475, 498–499, 506–508, 659–666, 681–683): sources ×3; `work/mizan-al-itidal` (new, full trio); `question/riwayat-ahl-al-bida` (new, Sunni perspectives Ibn Sirin / al-Dhahabi; academic + other still to add); `person/muhammad-ibn-jarir-ibn-rustam` (new); `person/ibn-hibban` (data rewritten from draft; first prose trio); enriched with Mizan sections + perspectives: `person/ibn-ishaq`, `person/al-waqidi` (father's name Umar vs Amr; death 207 vs 209 both kept), `person/al-tabari`, `person/ibn-arabi-muhyi-al-din`, `person/ikrima-mawla-ibn-abbas` (death 105/106/107), `person/al-dhahabi`, `concept/jarh-wa-tadil`.

- **Batch 2** (Bijawi part 3 printed pp. 70–73, 138–141, 186–189, 263–268, 273–280, 420–423): enriched with Mizan sections + Sunni-critic perspectives: `person/amr-ibn-ubayd` (Mu'tazila origins; al-Dhahabi rejects the Dahri charge; Mu'tazili view still to source), `person/ali-ibn-al-madini` (Mihna; al-Dhahabi's rebuttal of al-Uqayli and his rule on solitary reports), `person/amr-ibn-shuayb` (the «عن أبيه عن جده» chain debate; death 118 at Ta'if added), `person/ata-ibn-saib` (first prose; the Kufan mukhtalit, death c. 136), `person/layth-ibn-abi-sulaym` (death 143 «قيل» vs al-Mas'udi 158, both kept), `person/ibn-dihya` (lineage, Ibn Wasil/Ibn Nuqta tests; birth 542-or-after vs ~546 kept).

## Flags / doubts
- `person/ibn-ishaq` has `child_of person/yasar-mawla-qays` from an earlier lane; by the nasab (محمد بن إسحاق بن يسار) Yasar is his **grandfather**. Not changed (another lane's edge); flagged here.
- `person/ata-ibn-al-saib` (al-Khashl, Balkh, from Futuh al-Buldan) and `person/ata-ibn-saib` (the Kufan traditionist) are two different men, not duplicates; the Kufan one was enriched and the prose says so.
- Ibn Abd al-Salam's word on Ibn Arabi reads «شيعى سوء» in the OCR; read as «شيخ سوء» (agrees with the Shadharat record already in the museum).
- Contested entries carry `sensitivity: contested` and Sunni-critic perspectives (all critics are Sunni; academic views not yet sourced).

## Next
Other long entries of part 3: عثمان بن أبي شيبة (35–), عطاء الخراساني (73–), ابن أبي ليلى (613), قيس بن الربيع (393), علي بن زيد بن جدعان (127), محمد بن عجلان (644), ابن الثلجي (577), محمد بن سعيد المصلوب (561), عكرمة بن عمار (90), عمر بن سعد, الفرزدق (343), عين القضاة.
