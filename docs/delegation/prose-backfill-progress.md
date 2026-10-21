# `prose-backfill` lane progress

Lane doc: `docs/agents/lanes/prose-backfill.md`. Ranked work list: `docs/delegation/empty-records-priority.md` (regenerated 21 Oct 2026, 33,522 entities on main).

## Baseline (21 Oct 2026)

- Missing Arabic prose: 13,986 entities (13,466 excluding meta-classes `source/ media/ listing/ dataset/ language/ passage/quran-*`).
- Thin (<800 bytes) Arabic prose: 13,203 files (6,551 excluding meta-classes).
- Missing by class: building 5,469 · person 4,194 · event 2,402 · work 1,168 · group 104 · concept 22 · place 16 · object 4 · (passage/journey/polity/practice/question/screen: small tails, see report).
- Thin by class: person 2,051 · place 1,477 · object 490 · event 322 · work 195 · group 73 · concept 56 · building 55.
- The 13 empty `period/*` pages from the October report are all written — tier closed.

## Position

Top of `empty-records-priority.md`, class `building` missing list is rank-sorted by links; the linked-head of the whole report is `person/nafi-mawla-ibn-umar` (560 inbound), `person/hisham-ibn-urwa` (489), `person/zayd-ibn-aslam` (340) — these sit under `person`, not `building`, so the true start is the person missing-list.

## Batches

### 001 — 21 Oct 2026 (commit in this push)

Trilingual prose (ar+en+ur) for 13 `person` entities at the linked-head of the report. Sources read on the page in the harvest OCR library:

- `person/nafi-mawla-ibn-umar` (560 inbound) — wafayat-ayan, ihsan-abbas v5 tarjama (unpaged OCR → bare cite)
- `person/hisham-ibn-urwa` (489) — wafayat-ayan v6 tarjama (bare cite)
- `person/zayd-ibn-khalid-al-juhani` (32) — ibn-hajar-isaba p.515
- `person/muhammad-ibn-al-munkadir` — deferred: entry not yet located on the page
- `person/abu-bakr-ibn-abd-al-rahman-ibn-al-harith`, `person/amr-ibn-shuayb`, `person/malik-ibn-abi-amir-al-asbahi` — deferred to next batch
- `person/abu-umama-ibn-sahl-ibn-hunayf` (24) — ibn-hajar-isaba p.1620-1
- `person/sahl-ibn-hunayf` (14) — usd-al-ghaba p.364-5
- `person/abu-qatada-al-ansari` (12) — ibn-hajar-isaba p.1747
- `person/abu-waqid-al-laythi` (12) — ibn-hajar-isaba p.268
- `person/amir-ibn-rabia` — deferred: his isti-ab/usd-ghaba entry not yet pulled
- `person/abdallah-ibn-abdallah-ibn-umar` (8) — ibn-hajar-isaba p.908
- `person/abd-al-rahman-ibn-kab-ibn-malik` (8) — ibn-hajar-isaba p.823
- `person/suhayl-ibn-bayda` (7) — ibn-hajar-isaba p.629
- `person/umm-kulthum-bint-abi-bakr` (5) — ibn-hajar-isaba p.2030-1
- `person/asim-ibn-umar` (4) — ibn-hajar-isaba p.746
- `person/abu-humayd-al-saidi` (4) — ibn-hajar-isaba p.1653

Validation: 0 errors; tests pass; coverage regenerated. Urdu translations shipped in the same commit per AGENTS.md.

### 002 — 21 Oct 2026

Trilingual prose (ar+en+ur) for 11 `person` entities, sources read on the page:

- `person/zayd-ibn-aslam` (340 inbound) — siyar-alam-nubala-ideas-house p.1737 (tarjama 2147: faqih of Medina, majlis of forty fuqaha, Ali ibn al-Husayn, tafsir via his son, ma'din Bani Sulaym, d. 136)
- `person/abu-bakr-ibn-abd-al-rahman-ibn-al-harith` (29) — siyar-alam-nubala-ideas-house p.1227 (tarjama 1220: one of the Seven Fuqaha, rahib Quraysh, blind, d. 94 "year of the fuqaha")
- `person/amr-ibn-shuayb` (28) — siyar-alam-nubala-ideas-house p.550-551 (the ilal discussion: tawthiq debate, wijada issue, d. 118)
- `person/abd-al-rahman-ibn-abi-layla` — wafayat-ayan v3 tarjama (unpaged OCR → bare cite)
- `person/makhul-al-dimashqi` — wafayat-ayan v5 tarjama (bare cite)
- `person/amir-ibn-rabia` — ibn-hajar-isaba p.750-751 (tarjama 4442: early convert, Abyssinia, first emigrants to Medina, Badr, al-Jabiya, Uthman's deputy at Medina)
- `person/abu-burda-ibn-niyar` — ibn-hajar-isaba p.1628-1629 (khal al-Bara', name dispute, Badr)
- `person/silkan-ibn-salama` — ibn-hajar-isaba p.1778 (Abu Na'ila al-Ashhali, Ka'b ibn al-Ashraf affair, Uhud, archer-poet)
- `person/kabsha-bint-kab-ibn-malik` — ibn-hajar-isaba p.1950-1951 (Companion per Ibn Hibban/al-Mustaghfiri; cat's-water hadith in the Muwatta and Sunans)
- `person/jalal-al-dawla` — shadharat-dhahab p.204 + muntazam-ibn-al-jawzi j.8 (Buyid amir, 416-435 AH Baghdad turmoil, d. Sha'ban 435)
- `person/abu-kalijar` — shadharat-dhahab p.204,263 + muntazam-ibn-al-jawzi j.8 (Buyid amir, b. 399, entered Baghdad 436, d. Ramadan 440)

Deferred again this batch:
- `person/muhammad-ibn-al-munkadir`, `person/muhammad-ibn-yahya-ibn-habban` — tarjama located only in tahdhib-kamal index; the harvest's scanned tahdhib volumes (1, 6) and siyar do not carry their entries.
- `person/musab-ibn-sad-ibn-abi-waqqas`, `person/mabad-ibn-kab-ibn-malik` — no standalone tarjama in the scanned isaba/tabaqat/thiqat volumes (musab has an index row in Ibn Hibban's al-Thiqat).
- `person/malik-ibn-abi-amir-al-asbahi` — distinct person from Imam Malik ibn Anas (crusades-era, Q138380911); entry still unlocated.

Validation: 0 errors; 101 tests pass; coverage regenerated.

### 003 — 21 Oct 2026

Trilingual prose (ar+en+ur) enriching 11 thin `person` records, all read on the page:

- `person/yahya-ibn-said-al-ansari` — siyar-alam-nubala-ideas-house p.4169-4170 (Seven-Fuqaha pupil, judge of Medina under al-Mansur, the "actions are by intentions" hadith, d. 143 via Ibn Sa'd/Waqidi)
- `person/nafi-al-madani` — wafayat-ayan v5 tarjama (Seven Readers; Isfahani origin, Quba' zawiya; bare cite, unpaged OCR)
- `person/sulayman-ibn-yasar` — tazkirat-al-huffaz j.1 p.89 (Seven Fuqaha, mawla of Maymuna, d. 104/107)
- `person/abd-al-rahman-ibn-hormoz-al-araj` — siyar p.2248-2249 (Medinan reader, first to set Arabic orthography, codex copyist, d. Alexandria 117)
- `person/abd-al-rahman-ibn-al-qasim` — siyar p.2215-2216 (Malik's companion, mufti of Egypt, "pouch filled with musk", d. 191)
- `person/ubaydallah-ibn-abdallah-ibn-utba` — wafayat-ayan v3 tarjama (Seven Fuqaha; al-Zuhri's "four", Umar b. Abd al-Aziz's thousand dinars; d. 98/99/102)
- `person/habib-ibn-maslama` — ibn-hajar-isaba p.291-292 ("Habib al-Rum", arbitration anecdote)
- `person/al-saib-ibn-yazid` — siyar p.1757-1758 (boy Companion, the ungreyed forelock, d. 91/94)
- `person/zaynab-bint-abi-salama` — siyar p.1754-1755 (Umm Salama's daughter born in Abyssinia, ahl-al-bayt hadith, d. ~74)
- `person/humayd-al-tawil` — tahdhib-tahdhib j.3 p.38-40 (Basran, the Anas-via-Thabit question, d. 142/143)
- `person/abd-allah-ibn-amir` — ibn-hajar-isaba p.901 (Basra governor 29 AH, conquest of Khurasan/Fars, Arafa waterworks, d. ~85)

New source records created: `source/tazkirat-al-huffaz`, `source/tahdhib-tahdhib` (local scans; publisher unmarked, noted in reliability_note).

Deferred: `person/muhammad-ibn-ali-al-baqir` (tabaqat-huffaz index located, readable tarjama not yet extracted); `person/muslim-ibn-al-hajjaj` (search incomplete); prior batch-002 deferrals stand.

Validation: 0 errors; 101 tests pass; coverage regenerated.

### 004 — 21 Oct 2026

Trilingual prose (ar+en+ur) for 6 `person` records — two thin enrichments, four new — all read on the page in Tadhkirat al-huffaz:

- `person/muhammad-al-baqir` (enriched) — tazkirat-al-huffaz j.1 p.121-122 (b. 56, sayyid Banu Hashim, "baqar al-'ilm", 150 rak'as, d. 114/117)
- `person/muslim-ibn-al-hajjaj` (enriched) — tazkirat j.2 p.526-528 (b. ~204, first sama' 218, Sahih from 300,000 hadiths over 15 years/~4,000 hadiths, the Muhammad ibn Yahya walkout, works list, d. Rajab 261 at Nasrabad)
- `person/muhammad-ibn-al-munkadir` (new) — tazkirat j.1 p.123-124 (Taymi Medinan, "mines of truthfulness", 40 years striving, d. 130 via Waqidi)
- `person/yahya-ibn-abi-kathir` (new) — tazkirat j.1 p.124-125 (Yamami imam, Umayyad-era flogging, d. 129)
- `person/thabit-al-bunani` (new) — tazkirat j.1 p.122 ("most worshipful of his age", perpetual fast, d. 123/127)
- `person/abd-allah-ibn-dinar` (new) — tazkirat j.1 p.122-123 (mawla of Ibn Umar, d. 127 at 86)

Un-deferred: Ibn al-Munkadir and al-Baqir both found in the same Tadhkirat scan that yielded batch 003 (AAlexandrina-224163, juz 1-2). Muslim ibn al-Hajjaj completed.

Still deferred: musab-ibn-sad-ibn-abi-waqqas, mabad-ibn-kab-ibn-malik, malik-ibn-abi-amir-al-asbahi, muhammad-ibn-yahya-ibn-habban.

Validation: 0 errors; 101 tests pass; coverage regenerated.

### 005 — 21 Oct 2026

Largest batch so far: trilingual prose (ar+en+ur) for 20 `person` records, all from tazkirat-al-huffaz juz 1-2 (AAlexandrina-224163), entries read on the page:

- `person/kathir-ibn-murra` — e31 p.53 (faqih of Homs, met 70 Badris)
- `person/mutarrif-ibn-al-shikhkhir` — e54 p.64-65 (Basri, escaped Ibn al-Ash'ath fitna, d. 95)
- `person/amr-ibn-maymun` — e55 p.65 (Yamani Kufan, 100 hajj/umra, d. 74/75)
- `person/abu-uthman-al-nahdi` — e56 p.65-66 (14 at Qadisiyya, lived 130 years, d. 95)
- `person/malik-ibn-aws` — e61 p.67 (mukhadram Nasri, witnessed Jerusalem conquest)
- `person/jabir-ibn-zayd` — e67 p.71-72 (Abu al-Sha'tha', Ibn Abbas's companion)
- `person/ibrahim-al-nakhai` — e70 p.73-74 (faqih of Iraq, d. 95/96)
- `person/salim-ibn-abd-allah-ibn-umar` — e78 p.86-87 (Ibn Umar's son, d. 106)
- `person/tawus-ibn-kaysan` — e79 p.87-88 (40 hajjs, "like Ibn Sirin in Basra")
- `person/ata-ibn-yasar` — e80 p.88 (Maymuna's mawla, d. 87/103)
- `person/amr-ibn-dinar` — p.110-111 (scholar of the Haram, d. 126, one of Ibn al-Mufaddal's four)
- `person/qatada-ibn-diama` — p.118-120 (best memoriser of Basra, d. Wasit plague 117/118)
- `person/mansur-ibn-zadhan` — e39 p.137-138 (sunrise-to-sunset worshipper, d. 131)
- `person/mansur-ibn-al-mutamir` — e40 p.138-139 (40 years fasting, forced judgeship, d. 132)
- `person/muammar-ibn-rashid` — p.182-183 (scholar of Yemen, "put him before anyone and he is above")
- `person/zaida-ibn-qudama` — e47 p.204 (Shu'ba's peer in exactitude, d. 161)
- `person/hushaim-ibn-bashir` — p.233-234 (11,000 hadiths, b. 104, Ahmad's 4-year companion)
- `person/hajjaj-ibn-muhammad` — p.319 (al-Missisi, "asleep more reliable than Abd al-Razzaq awake", d. 206)
- `person/hisham-ibn-yusuf-al-sanani` — p.320 (qadi/mufti of Sanaa, soundest book, d. 197)
- `person/sulayman-ibn-harb` — p.359-360 (qadi of Mecca, summoned by al-Ma'mun, d. 224)
- `person/muslim-ibn-ibrahim` — e80 p.360-361 (Farahidi musnad-master, "100 shaykhs before the bridge", d. Safar 222)

Deferred list unchanged. Validation: 0 errors; coverage regenerated.

### 006 — 21 Oct 2026

15 `person` records, trilingual, all entries read on the page in tazkirat-al-huffaz (AAlexandrina-224163):

- `person/imran-ibn-husayn` — p.32 (Companion, qadi of Basra, d. 52)
- `person/qays-ibn-abi-hazim` — p.61-62 (mukhadram, Yamama veteran, d. ~97)
- `person/yunus-ibn-ubayd` — p.141-142 (the honest cloth-merchant, d. 139)
- `person/musa-ibn-uqba` — p.143-144 (author of the Maghazi, d. 141)
- `person/ibn-jurayj` — p.164-166 (faqih of the Haram, first compiler, d. 150)
- `person/israil-ibn-yunus` — p.203-204 (Abu Yusuf al-Sabi'i, d. 161/162)
- `person/hammad-ibn-zayd` — p.215-216 (one of Ibn Mahdi's four imams, blind, d. 179)
- `person/mutamir-ibn-sulayman` — p.249-250 (al-Taymi of Basra, b. 106, d. Safar 187)
- `person/hafs-ibn-ghiyath` — p.278 (qadi of Baghdad then Kufa, d. 184)
- `person/yahya-al-qattan` — p.278-279 (sayyid al-huffaz, b. 120)
- `person/nadr-ibn-shumayl` — p.292-293 (philologist of Marw, d. 203)
- `person/abd-al-rahman-ibn-mahdi` — p.305-307 (the great critic, d. 198)
- `person/abu-dawud-al-tayalisi` — p.324-325 (40,000 hadiths by memory, d. 204)
- `person/abu-asim-al-nabil` — p.337-338 (never narrated but from memory, d. 212)
- `person/qutayba-ibn-said` — p.406-407 (hadith-master of Khurasan, d. 240)

Likely duplicate flagged: `person/mutarrif-ibn-abdallah` (muruj-al-dhahab letter to Umar II) vs `person/mutarrif-ibn-al-shikhkhir` — same man; needs dedup decision.
Still deferred: hammad-ibn-salama, bishr-al-hafi, maruf-al-karkhi, malik-ibn-dinar-al-khattat, waki-ibn-al-jarrah, shuba-ibn-al-hajjaj (entries not in this scan's OCR or garbled); plus previous deferrals.
Validation: 0 errors; coverage regenerated.

## Batch 007 — siyar + tadhkirat sweep (8 records)

- Enriched thin files: shuba-ibn-al-hajjaj, bishr-al-hafi, maruf-al-karkhi, malik-ibn-dinar-al-khattat, hammad-ibn-salama — all from siyar-alam-nubala (Ideas House scan), entries 2460/1188/6193/4668/1826.
- New prose: simak-ibn-harb (siyar #2391, p.1936), muawiya-ibn-salih (siyar #6176, p.3893), hammad-ibn-usama (tazkirat-al-huffaz j.2 p.299).
- Still deferred: waki-ibn-al-jarrah, nafi-ibn-umar-al-jumahi (tarjama bodies not located in the scanned volumes), plus prior deferrals.
- Lane total: 76 records with trilingual prose (69 after batch 006).

## Batch 008 — waki', ibn-ulayyah, jurayri, kalbi, ibn-ma'in (5 records)

- New prose: waki-ibn-al-jarrah (siyar #6558, p.4121-4123), ibn-ulayyah (siyar p.1092-1093), said-ibn-iyas-al-jariri (siyar #2230, p.1793-1794).
- Enriched: muhammad-ibn-al-saib-al-kalbi (siyar #5212, p.3432), yahya-ibn-main (siyar #6694, p.4202-4204).
- Deferred this round: hisham-ibn-al-kalbi, yahya-ibn-muadh-al-razi, ubaydallah-ibn-jarir, fudayl-ibn-iyad, ibrahim-ibn-adham, nafi-ibn-umar-al-jumahi (tarjama bodies not located in scanned volumes).
- Lane total: 81 records.

## Batch 009 — farqad, abd-al-wahhab al-thaqafi, al-darimi, al-fadl ibn dukayn, al-zubayr ibn bakkar, muslim ibn yasar (6 records)

- New source record: `source/tahdhib-al-kamal-mizzi` (Tahdhib al-Kamal fi Asma' al-Rijal, al-Mizzi, registered for the farqad + muslim ibn yasar cites).
- New prose: farqad-al-sabakhi (tahdhib-al-kamal j.6 p.24), abd-al-wahhab-al-thaqafi (tadhkirat j.2 p.313-314).
- Enriched: al-darimi (tadhkirat j.2 p.481-482 + tarikh-khulafa p.559), al-fadl-ibn-dukayn (tadhkirat j.2 p.342-343 + muruj p.442), al-zubayr-ibn-bakkar (tadhkirat j.2 p.475), muslim-ibn-yasar (tabaqat-fuqaha p.47 + tahdhib refs).
- Stub summaries corrected to sourced facts: farqad (removed unsourced d.729, replaced with critics' consensus), abd-al-wahhab (810 → late 204 AH per tadhkirat).
- Lane total: 87 records.
- Validation: 0 errors; coverage regenerated.

## Batch 010 — siyar enrichments: awza'i, zuhri, ibn al-mubarak, yazid ibn harun, ibn adham, fudayl, tayalisi, yahya ibn yahya (8 records)

- Enriched thin/short person files with sections read on the page in the full Siyar scan (20250923_20250923_0238 = siyar-alam-nubala-ideas-house): al-awzai-abd-al-rahman (p.2202), muhammad-ibn-shihab-al-zuhri (p.3700), abd-allah-ibn-al-mubarak (p.2468), yazid-ibn-harun-al-wasiti (p.4233), ibn-adham-ibrahim (p.646), al-fudayl-ibn-iyad (p.3045), abu-dawud-al-tayalisi (p.1913), yahya-ibn-yahya-al-laythi (p.4215).
- Deferred: layth-ibn-sad (entry exists but body unlocated in scan), yahya-ibn-adam + muhammad-ibn-yusuf-al-firyabi + amr-ibn-awn (no data records — new-entity candidates, out of this lane's scope), nafi-ibn-umar-al-jumahi, said-ibn-abi-maryam, adam-ibn-abi-iyas, yahya-ibn-muadh-al-razi, hisham-ibn-al-kalbi, harmala-ibn-yahya, ubaydallah-ibn-jarir-al-utaki (tarjama bodies not located).
- Lane total: 95 records.
- Validation: 0 errors; coverage regenerated.

## Batch 011 — siyar sweep via header index (9 records)

- New prose (missing): salim-ibn-ayyub-al-razi (p.1889, Shafi'i murabit, d.447), asbagh-ibn-al-faraj (p.1144, scholar of Egypt, d.225), muslim-ibn-khalid-al-zanji (p.3840-3841, faqih of Mecca, al-Shafi'i's teacher, d.180), abu-bakr-ibn-qawam (p.1236, ascetic of Balis/Aleppo region, d.658), al-zubayr-ibn-abd-al-wahid-al-asadabadi (p.1711, hafiz traveller, d.347), abd-al-aziz-ibn-al-walid (p.2296, son of al-Walid I, the succession affair).
- Enriched: ibrahim-ibn-al-ashtar (p.652), umar-ibn-abi-salama (p.2902), ashhab-ibn-abd-al-aziz (p.1143, mufti of Egypt, d.204, "Egypt produced no one more versed in fiqh than Ashhab").
- Rejected false matches: al-rabi-ibn-ziyad-al-bakri (matched al-Rabi' b. Anas the exegete), yusuf-ibn-abd-al-rahman-al-fihri (matched a later Murcia ruler), adi-ibn-zayd-al-ibadi (quote only, no tarjama), sharhabil-ibn-hasana (matched a descendant).
- Lane total: 104 records.
- Validation: 0 errors; coverage regenerated.

## Batch 012 — siyar header-index sweep II (10 records)

- New prose: yusuf-ibn-adi (p.4275-4276, Kufan hafiz in Egypt, d.230+), shabath-ibn-ribi (p.1966, Tamimi sayyid at Siffin), ali-ibn-mabad-ibn-shaddad (p.2860, hafiz of Egypt, d.218).
- Enriched: aban-ibn-uthman (p.640, governor of Medina 7 yrs, d.105), kab-ibn-suwar (p.3116, qadi of Basra, killed at the Camel), marthad-ibn-abd-allah-al-yazani (p.3812, mufti of Egypt, d.90), mukhallad-ibn-yazid (p.3809, Harrani thiqa, d.193), al-zubayr-ibn-ahmad-al-basri (p.1710, blind Shafi'i shaykh, author of al-Kafi, d.320), ahmad-ibn-al-tayyib-al-sarakhsi (p.805, al-Kindi's pupil executed by al-Mu'tadid, d.286), amr-ibn-al-layth (p.2970-2971, Saffarid ruler captured at Balkh, d.289).
- Rejected false matches: hasan-al-utrush (body was Hasan b. Arafa), nasr-ibn-ahmad (a Harawi, not the Samanid), umar-ibn-hafs-hazarmard, fatima-bint-abbas-al-baghdadiyya, fatima-bint-sad-al-azdiyya, ali-ibn-al-jad-al-shufni, adi-ibn-zayd-al-ibadi (index hits only).
- Lane total: 114 records.
- Validation: 0 errors; coverage regenerated.

## Batch 013 — siyar header-index sweep III (22 records + dedup)

- New prose: qutlumush-ibn-arslan-israil (p.3086, Seljuk, d.456), bakr-ibn-abd-allah-al-muzani (p.1228, d.108), ismail-ibn-ubayd-allah (p.1114, tutor of Abd al-Malik's sons, d.132), yaqub-ibn-ahmad-ibn-al-sabuni (p.4240, Aleppo, d.719), shuayb-ibn-harb (p.1988, mujawir of Mecca, d.196/7), uthman-ibn-said-al-darimi (p.2651, author of the Musnad, d.280), isa-ibn-muhanna (p.2995, Malik al-Arab, d.683), hajjaj-ibn-yusuf-al-thaqafi (p.1371, Ibn al-Sha'ir the muhaddith, d.259).
- Enriched: said-ibn-makhlad (p.2010, vizier, d.276), zufar-ibn-al-hudhayl (p.1720, Abu Hanifa's successor, d.158), shahr-ibn-hawshab (p.1996-7), hisham-al-kalbi (p.4095, d.204/6), jafar-ibn-harb (p.1297, Mu'tazili, d.236), qatari-ibn-al-fujaa (p.3098, Khariji amir, d.79), yazid-ibn-al-asamm (p.4219, d.103), sakina-bint-al-husayn (p.1860, d.117), musa-ibn-talha (p.3982, d.103), mansur-ibn-ammar (p.3948, the preacher, d.~200), tughril-shah-iii (p.2061, last Malikshahid, d.590), abd-al-ghani-ibn-said-al-azdi (p.2300, author of al-Mu'talif, d.409), yahya-ibn-watthab (p.4212), ahmad-ibn-nasr-al-khuzai (p.1026, executed in the Mihna).
- Dedup: merged qutam-ibn-al-abbas into qutham-ibn-al-abbas (alias + richer summary/sources); prose rewritten under canonical id.
- Rejected/deferred: al-harith-al-muhasibi, al-hakam-ibn-utayba, al-rabi-ibn-sabih, surayj-ibn-yunus, razin-ibn-muawiya, mahmud-ibn-ghaylan, salih-ibn-ahmad-ibn-hanbal, yazid-ibn-mazyad (index hits or wrong-person bodies).
- Lane total: 136 records. Validation: 0 errors; coverage regenerated.

## Batch 014 — siyar header-index sweep IV (15 records)

- New prose: aqil-ibn-abi-talib (p.2701), al-qasim-ibn-muhammad-ibn-abi-bakr (p.3072, Seven Fuqaha), tamim-ibn-al-muizz-badis (p.1264, Zirid sultan, d.501), amr-ibn-hurayth-al-makhzumi (p.2944, late Companion in Kufa), awana-ibn-al-hakam (p.2979, historian, d.147), abu-awana-al-yashkuri (p.4119-4120, d.176), zurara-ibn-awfa (p.1718, qadi of Basra, d.93), hammad-ibn-ishaq-al-basri (p.1551), sad-ibn-ibrahim-al-zuhri (p.1771, d.201), hatim-ibn-ismail (p.1345, d.187), ibrahim-ibn-uyayna (p.686, d.199), yusuf-ibn-musa-al-qattan (p.4286, b.269), yaeish-bin-sadaqa-al-furati (p.4255, d.593), auf-ibn-al-harith (p.2979, Badri martyr).
- Enriched: aisha-bint-talha (p.2077).
- Deferred: al-kumayt, al-hasan-ibn-sahl, anas-ibn-iyad, ismail-ibn-hammad-al-qadi, amr-ibn-al-harith (index or interleaved bodies).
- Lane total: 151 records. Validation: 0 errors; coverage regenerated.

## Batch 015 — siyar header-index sweep V (16 records)

- New/enriched prose: kharija-ibn-zayd-ibn-thabit (p.1590, Seven Fuqaha, d.99/100), hajjaj-ibn-artah (p.1366, mufti of Kufa, d.149), maqil-ibn-yasar (p.3905, Companion), rawh-ibn-hatim (p.1700, Muhallabid amir, d.174), bishr-ibn-marwan (p.1209, d.75), salih-ibn-kaysan (p.2016, tutor of Umar II's sons), humran-ibn-aban (p.1566, Uthman's mawla, d.89), makhrama-ibn-nawfal (p.3808, Companion, d.54), hammad-ibn-abi-sulayman (p.1558, Abu Hanifa's teacher, d.119), ata-ibn-yasar (p.2692, d.103), musab-ibn-sad-ibn-abi-waqqas (p.3859, d.103 — earlier deferral resolved), ibrahim-ibn-sad-al-zuhri (p.661, d.183), sulayman-ibn-qutta (p.1922, muqri' poet), malik-ibn-abdallah-al-khathami (p.3169, Malik al-Sawa'if), ishaq-ibn-al-furat (p.1072, qadi of Egypt, d.204), ali-ibn-rabah-al-lakhmi (p.2779, d.114).
- Lane total: 167 records. Validation: 0 errors; coverage regenerated.

## Batch 016 — siyar header-index sweep VI (25 records)

- Persons: dhikwan-ibn-abd-qays (Abu Salih al-Samman, d.101), abdullah-ibn-busr (Companion, d.88), surayj-ibn-yunus (d.235), said-ibn-mansur (Sunan author, d.227), asim-ibn-abi-al-najud (the Reader, d.128), awn-ibn-abd-allah-ibn-utba (d.230), imran-ibn-talha, muadh-ibn-al-harith (Badri), muawwaz-ibn-amr-ibn-al-jamuh (Badri), yala-ibn-umayya (mufti of Mecca, d.60), khawat-ibn-jubayr (d.40), al-harith-ibn-nawfal (gov of Mecca), sulayman-ibn-al-mughira (d.165), ibrahim-ibn-issa-al-muradi (d.667), ahmad-ibn-baqi (d.244), ummat-al-wahid (faqiha Sutayta, d.377), hatim-ibn-al-layth (d.262), hajib-ibn-malik-al-farghani (d.306), amrah-bint-abd-al-rahman (faqiha, pupil of A'isha, d.98/106), fatima-bint-abbas-al-baghdadiyya (muftiya of Damascus, d.704), muhammad-ibn-mahran (d.239), musa-ibn-al-hasan-al-jalajil (muqri', d.287), yazid-ibn-mufarrigh (poet, d.69), yahya-ibn-ayyub-al-maqabiri (d.234), ali-ibn-harb (d.265).
- All from siyar-alam-nubala-ideas-house, bodies read on the page; page-level cites. Lane total: 192. Validation: 0 errors.
- Deferred (mismatched/identity-uncertain): al-abbas-ibn-abd-al-azim, ahmad-ibn-sad-al-zuhri, muhammad-ibn-dawud-al-asbahani, muhammad-ibn-masud-al-ayyashi, khalid-ibn-yazid-al-katib, muhammad-ibn-jarir-al-tabari-imami, al-khalil-ibn-ahmad-al-qadi, abd-al-salam-ibn-mashish, zaynab-bint-makki, fatima-bint-sad-al-azdiyya, hisham-ibn-amr-al-fuwati, umar-ibn-husayn-al-khiraqi, anas-ibn-iyad, razin-ibn-muawiya, mahmud-ibn-ghaylan (index-only in scanned siyar volumes).

## Batch 017 — person-class verified-summary sweep
First non-Siyar batch: 25 person records whose data summaries were already verified and carry inline `{cite:}` markers (Shadharat, Muntazam, Wafayat reads by earlier agents). Prose restructures the cited summaries into sections; no new unsourced claims. Sabuktigin, al-Silafi, Ibn al-Mustawfi, Sibt Ibn al-Jawzi, al-Khuyuqi, al-Shaykh al-Imad, Musannifak, Fakhr al-Din ibn Taymiyya, Muhammad ibn Ali al-Suri, Abu Umar al-Maqdisi, Ahmad ibn Kulayb, Ali ibn Muhammad al-Sulayhi, al-Jubba'i Abdallah, Fakhr al-Mulk ibn Khalaf, Ibn al-Hurastani, Abd al-Salam ibn Abd al-Qadir, Ibn Qindas, Ali ibn Umar al-Qazwini, Abu Bakr ibn Abd al-Baqi, Arslan Khatun, Ibn Kamil al-Mansuri, Khayr al-Din al-Talsami, Sayf al-Din al-Baktmari, Taj al-Din al-Hamadani, Nasr ibn Mansur al-Muqri. Validation 0 errors. Lane total: 217.

## Batch 018 — verified-summary sweep II
25 person records from the same pool (data summaries already carry inline cites from earlier page-level reads). Abu'l-Najib al-Suhrawardi, al-Salmasi, Abu Musa al-Maqdisi, al-Rafi'i, Ibn al-Sam'ani 'Abd al-Rahim, Muhammad al-Yunini, 'Abd al-Latif al-Baghdadi, Mahmud al-Na'al, Salah al-Din al-Irbili, al-Mubarak ibn Kamil, al-Shams al-Bukhari (al-Maqdisi), Sayf al-Din al-Amidi, Hilal ibn al-Muhassin al-Sabi', Ibn al-Ma'ni (Nasih al-Islam), al-Samiri Ibn Sinina, 'Abdallah al-Yunini (Asad al-Sham), al-Ja'fari Badr, Abu Hamid al-Isfara'ini, Isma'il al-Taymi, al-Shatibi, al-Damaghani, Ibn al-Jinbali, Qarwash ibn al-Muqallad, al-Sharmaqani, al-'Ulaymi Shams. Validation 0 errors. Lane total: 242.

## Batch 019 — verified-summary sweep III + one dedup
24 new person records + one merge. Ibn Sana' al-Mulk, al-'Izz ibn 'Abd al-Ghani, Ahmad al-Rifa'i, Ibrahim ibn 'Abd Rabbih, Ibn al-Akhdar, Qara Ughli (Ottoman qadi of Damascus), Ibn Nasir al-Sulami, al-Zafar al-Asadi, Ibn al-Hallawi, Ibn Ni'ma (musnid of Syria, copied 2,000 volumes), 'Abd al-Razzaq ibn 'Abd al-Qadir al-Jilani, Abu'l-Fath Ibn al-Ta'awidhi (merged with person/ibn-al-taawidhi — same blind poet; 584 vs 553 death noted), Majd al-Din ibn Taymiyya (the grandfather), 'Abd al-Wahhab al-Shirazi, Shihab al-Din al-Suhrawardi (the slain philosopher), Sayf al-Din Ghazi II, al-Kindi Abu'l-Yumn, 'Abd al-Qadir al-Ruhawi, al-Ilyusi (Valencia), al-Hasan al-Rakji, al-Dakhwar (physician), Ibn al-Tilmidh (Christian physician of Baghdad), Ibn al-Zaghuni, Ibn al-Habbariyya. Validation 0 errors. Lane total: 266.

## Batch 020 — verified-summary sweep IV
25 person records. Sultan al-Dawla (last Buyid of Iraq), al-Tabarani (the three Mu'jams), Musharrif al-Dawla, Ibn al-Raffa' the Reader, al-Salih Isma'il b. al-'Adil (surrendered Beaufort), Ibn Makula (Baghdad's chief qadi, d.447), al-Afdal Shahanshah (Fatimid vizier), Nizar b. al-Mustansir (immured 495), Barkiyaruq, Ahmad b. 'Attash (Isfahan fortress, d.500), Wasif b. Sawartakin (beat Zikrawayh at Khaffan, 294), Raghib mawla al-Muwaffaq (naval raid 285), Warqa b. Nawfal, Shams al-Din Ibn Abi 'Umar (the Hanbali colossus, d.682), 'Abd al-Wahhab b. 'Abd al-Qadir al-Jilani, Sibt al-Khiyat (shaykh of Iraq's readers), 'Abd al-Ghafir al-Farisi (Tarikh Nishapur), As'ad al-Mayhani, Ibrahim b. Muflih (Timur fitna debates), Abu Madyan (shaykh of the Maghrib, d.590), Sayf al-Din Ibn Taymiyya (khatib of Harran), Abu'l-Mahasin al-Ruyani (martyred at Amol 502), al-'Adil II (last Ayyubid of Egypt), Nur al-Din Muhammad b. Jaqmaq, al-Malik al-Sa'id Hasan (fought at Ayn Jalut on the Tatar side). Validation 0 errors. Lane total: 291.

## Batch 021 — verified-summary sweep V (rulers & scholars)
25 person records. Qizil Arslan (Atabeg of Azerbaijan, murdered 587), al-Malik al-Sa'id Baraka (Baybars's son, deposed to Karak), Najm al-Din Ibn Shabib (Hanbali usuli of Cairo), Asad al-Din Shirkuh II of Homs, Shams al-A'imma al-Kurdari (Hanafi, d. Bukhara), Siraj al-Din al-Fayyumi (murdered at Khan Ghabaghib), al-Malik al-Mansur II of Hama, Abu Rakwa (the Umayyad pretender executed by al-Hakim), Isma'il Samani (built the ribats of the marches), Yusuf al-Khwarizmi (killed Alp Arslan 465), Kitbugha (killed at Ayn Jalut), Tughtigin Atabeg of Damascus, Abu'l-Muzaffar al-Sam'ani (Hanafi→Shafi'i of Marw), Ibn al-Salus, al-Malik al-Nasir Dawud, al-Malik al-Qahir Mas'ud of Mosul, 'Abd al-Wahid b. Idris the Almohad (drowned 630), al-Malik al-Muzaffar Ghazi, al-Mu'tadid 'Abbad of Seville, Sadr al-Din al-Hamuwi (at whose hand Ghazan converted), Kukhan Qara-Khitai (Sanjar's victor 536), Nur al-Din Arslan Shah of Mosul, Arghun Khan, al-Malik al-Mas'ud of Amid, Abagha Khan. Validation 0 errors. Lane total: 316.
