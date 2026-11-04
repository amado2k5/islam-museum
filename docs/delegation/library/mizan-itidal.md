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

- **Batch 3** (printed pp. 198–199, 345, 561–563, 577–579): `person/muhammad-ibn-said-al-maslub` (new: the crucified Damascene forger, 100+ disguised names; Ibn Ma'in denies the crucifixion — both kept), enriched `person/umar-ibn-sad` (al-Dhahabi: not suspect in himself but fought al-Husayn; killed 65), `person/muhammad-ibn-shuja-al-thalji` (death Dhu al-Hijja 266 added), `person/farazdaq` (Ibn Hibban's weakening).

## Flags / doubts
- `person/ibn-ishaq` has `child_of person/yasar-mawla-qays` from an earlier lane; by the nasab (محمد بن إسحاق بن يسار) Yasar is his **grandfather**. Not changed (another lane's edge); flagged here.
- `person/ata-ibn-al-saib` (al-Khashl, Balkh, from Futuh al-Buldan) and `person/ata-ibn-saib` (the Kufan traditionist) are two different men, not duplicates; the Kufan one was enriched and the prose says so.
- Ibn Abd al-Salam's word on Ibn Arabi reads «شيعى سوء» in the OCR; read as «شيخ سوء» (agrees with the Shadharat record already in the museum).
- Contested entries carry `sensitivity: contested` and Sunni-critic perspectives (all critics are Sunni; academic views not yet sourced).

## Next
Other long entries of part 3: عثمان بن أبي شيبة (35–), عطاء الخراساني (73–), ابن أبي ليلى (613), قيس بن الربيع (393), علي بن زيد بن جدعان (127), محمد بن عجلان (644), عكرمة بن عمار (90), عين القضاة (not found in part 3's OCR under that heading).

## Second pass (worker F, run 2)
- **Fixed** the flagged edge: `person/ibn-ishaq` now has `child_of person/ishaq-ibn-yasar` (new data record), and `person/ishaq-ibn-yasar` has `child_of person/yasar-mawla-qays`; prose trio and summary of Ibn Ishaq now call Yasar his grandfather (Mizan printed p. 468 nasab + Futuh al-Buldan p. 345).
- **Batch D** (Bijawi part 3, printed = PDF − 2; pp. 35–38, 127–129, 228–229, 270, 319–320, 393–396, 613–616, 644–647): new trios `person/ali-ibn-zayd-ibn-judan` (5844), `person/muhammad-ibn-ajlan` (7938), `person/qays-ibn-al-rabi` (6911), `person/abu-jafar-al-razi` (Isa ibn Mahan, 6595), `person/umar-ibn-harun-al-balkhi` (6237), and `person/abu-ishaq-al-sabii` (6393, committed with the Tadrib batch); Mizan sections appended to `person/uthman-ibn-abi-shayba` (5518; Qur'an misreadings described, no verse text typed) and `person/muhammad-ibn-abd-al-rahman-ibn-abi-layla` (7825; confirms d. 148 — the earlier record asked for a second source). All verdicts attributed, critics' disagreement as Sunni perspectives.
- OCR heading misses (not found by heading search, try body search next time): Ikrima ibn Ammar, Ubayd Allah ibn Musa, Ata al-Khurasani, Muhammad ibn al-Sa'ib al-Kalbi, Abd al-Malik ibn Umayr, Asim ibn Bahdala.

## Third pass (worker F, run 3)
- Lithograph vol. 2 (scan AAlexandrina-155538), PDF pp. 42–43, entry of Abd Allah ibn Sulayman ibn al-Ash'ath (Ibn Abi Dawud), read line by line despite the garbled OCR: `person/abd-allah-ibn-abi-dawud-al-sijistani` rewritten (data + first prose trio): born 230, al-Daraqutni/Ibn Adi vs Abu Dawud/Ibn Sa'id/Ibrahim al-Isbahani as Sunni perspectives, the Isfahan incident, Ibn al-Furat's banishment, the vizier scene, the campaign against Ibn Jarir. **Duplicate merged**: `person/abu-bakr-ibn-abi-dawud` (Devin draft, Fihrist + Tarikh al-Khulafa) folded in and aliased; its files removed. The kept id had the incoming links (group/tabiun, question/afdal-al-tabiin) and the Wikidata id. Its Fihrist line naming him "Sulayman ibn al-Ash'ath … Abu Bakr" was a misreading of the nasab; the record now gives Abd Allah ibn Sulayman.
- Isfahan figure (the number of hadiths he narrated from memory and how many errors were found) is illegible; left as "tens of thousands".
- Mizan vol. 1 lithograph (Khalaf ibn Khalifa, Zuhayr ibn Mu'awiya) checked: OCR too garbled for the entries to be read; not used.
