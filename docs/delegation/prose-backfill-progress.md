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

## Batch 022 — verified-summary sweep VI (court, conspiracy & class)
25 person records. Ibn Dawwas (al-Hakim/Sitt al-Mulk affair), Arslan Arghun (murdered at Damghan 490), Ibn al-Waththab (imposter-caliph in Gilan), al-Tha'labi (the great tafsir), al-Sulami (Tabaqat al-sufiyya, d.412), al-Zahir Qansuh (last Mamluk-era sultan, left the citadel 905), Ja'far b. Fallah (Fatimid commander), Uzun Hasan, Ibrahim b. Shah Rukh, Ibrahim b. Hilal al-Sabi (the Sabian epistolographer), Godfrey of Bouillon (killed at Acre 494 per Islamic chroniclers), 'Ubaydallah al-Khatibi (Isfahan chief qadi, killed by Batiniyya 502), al-Hasan al-A'sam the Qarmatian, Ahmad b. Shah Rukh, Ibn al-Khashshab (died mid-recitation), Ibn al-Bahlul, 'Abd al-Wahhab al-Anmati (hafiz of Baghdad, d.538), Abu Khazim b. Abi Ya'la, Wajih al-Din al-Qazwini (rival preacher to Ibn al-Jawzi), al-Mujir al-Wasiti, Ibn al-Farid (Sultan of the Lovers), Nasr b. 'Abd al-Razzaq b. 'Abd al-Qadir (the incorruptible qadi), 'Abdallah b. Hamuwayh, Shihab al-Din Ibn Taymiyya (father of Taqi al-Din), 'Abd al-Mughith al-Harbi. One fix: Qur'an verse replaced by passage ref in ibn-al-khashab. Validation 0 errors. Lane total: 341.

## Batch 023 — verified-summary sweep VII (saints & scholars)
25 person records. Abu 'Ali al-Farimi (the abdal who spoke to none for 40 years), Abu Talib Ibn Ghaylan (last to hear Abu Bakr al-Shafi'i), al-Shihab al-Tusi ("king of scholars" procession), Fakhr al-Din b. Sadr al-Din al-Juwayni (fell at Mansura), Ibn Abi'l-Hijr of Harran, Sultan Mahmud b. Muhammad (Mughith al-Din, last Seljuk of Iraq), Taj al-Din al-Firkah (above al-Nawawi per Ibn Qadi Shuhba), Abu'l-Waqt al-Sijzi (d.553 at 95, last words Ya-Sin ref), Ibn Fasatanjas (the ewer-witted vizier), al-Ra'sani (Rumuz al-kunuz), Jamal al-Din Ibn Matruh, Isma'il Ibn al-Jawaliqi, al-Sakhawi (teacher of all Damascus's readers), Kamal al-Din Ibn Yunus (the polymath of Mosul), 'Umar al-Suhrawardi ('Awarif al-ma'arif), al-Khunaji (the finger-in-ewer qadi), Jarkas al-Salahi (the Cairo Qaysariyya), Jakir the Kurd, 'Ali b. al-Sallar (Fatimid vizier, killed 549), al-Dalji al-'Uthmani, al-Fakhr Ibn al-Bukhari (musnad al-dunya), Ibn al-Fa'us (the cobbler-preacher), 'Abd al-Ghani Ibn Nuqa, Ibn Safi "King of Grammarians", Muzaffar al-'Iylani (blind 'arudi poet). One Qur'an quote → passage ref (quran-36-26). Validation 0 errors. Lane total: 366.

## Batch 024 — verified-summary sweep VIII
25 person records, all summaries carrying inline Shadharat/Muntazam cites. Ibrahim Khatib al-Jabal (ascetic of Qasyun), al-Sarifini (Hanbali hafiz, Dar al-Hadith of Aleppo), al-Mundhiri al-Nabulsi (the great traveller), Ibn al-Razzaz Sa'id (Shafi'i head, Nizamiyya), 'Imad al-Din al-Nayhi, al-Shihab al-Qusi (agent of the Bayt al-Mal), Kamal al-Din Ibn Talha (the fleeing vizier), al-Khasruwshahi (Fakhr al-Razi's kalam pupil), al-Kamil of Mayyafariqin (martyred by Hulagu), As'ad b. al-Matran (the physician convert), al-Samadi al-Qadiri, Abu'l-Hajjaj al-Biyasi (Andalusi memoriser), al-Fakhr al-Balabakki (Ibn al-Salah's memoriser), al-Hasan b. 'Isa b. al-Muqtadir (caliphate renouncer, d.440), Sayf al-Din Ibn Qudama, Hibat Allah Ibn Makula (vizier strangled 429), Nasr b. al-'Attar al-Harrani, al-Ghazzi Ibrahim (poet of the age), Sharaf al-Din al-Manawi (last verifying Shafi'i, d.871), al-Qadi al-Rashid al-Aswani (crucified by Shawar), al-Khidr b. Shibl (khatib of Damascus), al-Bukhari Makki Ahmad (d. at Jeddah), 'Ilm al-Din al-Bulqini, Ibn Sana' al-Dawla, al-Khuyi Ahmad. Validation 0 errors. Lane total: 391.

## Batch 025 — verified-summary sweep IX
25 person records (early-'abd cohort). 'Abbad b. al-Walid al-Ghudhwi, 'Abd al-A'la al-Sadafi (father of Yunus), 'Abd al-'Azim al-Mundhiri (Kitab al-takmila), 'Abd al-'Aziz Ibn al-Majishun (al-Mahdi prayed over him), 'Abd al-'Aziz b. Mu'awiya al-Umawi, 'Abd al-Baqi al-Haddad (Idah fi'l-fara'id), 'Abd al-Hakim Ibn al-'Iraqi (khatib of Egypt's mosque), 'Abd al-Halim al-Manzilawi, 'Abd al-Haqq II al-Marini, 'Abd al-Malik b. Siraj (Andalus's philologist), 'Abd al-Mun'im b. Ghulbun (muqri' of Aleppo), 'Abd al-Mun'im Ibn Muflih, 'Abd al-Qadir al-Sabki (the boatman majdhub), 'Abd al-Qadir Ibn Shaykh 'Aydarus (al-Nur al-safir), 'Abd al-Wahid al-Makhlu' the Almohad, 'Abd al-Wahid Ibn Shita (muqri' of Iraq), 'Abd al-Wahid II the Almohad (strangled 621), 'Abdallah al-Majdhub (Shaykh al-Hashasha), 'Abdallah al-Irmawi (the robbers' bread tale), 'Abdallah b. al-Munir (Qazwin to Amid), 'Abdallah b. Ghaniya (last Sanhaji king of Majorca), 'Abdallah b. Yahya al-Yafa'i, 'Abdallah b. Yusuf al-Juwayni (father of Imam al-Haramayn), Sharaf al-Din 'Abdallah Ibn Muflih, Abu'l-'Abbas al-Qurti al-Shahid. Validation 0 errors. Lane total: 416.

## Batch 026 — verified-summary sweep X
25 person records (Abu-'Ali/Abu'l-Hasan cohort). Ibn Wasil (tax-farmer who ruled Basra, killed at Wasit 397), Ibn Zuhr Abu'l-'Ala' (physician of al-Andalus), Abu'l-'Ayna' (the blind wit of Basra — "you built the world in your house"), Sa'd b. Sharif (last Sayf al-Dawla), Abu'l-Faraj al-Shirazi al-Hanbali (shaykh of Syria, spread Ahmad's madhhab), 'Abdus of Hamadhan, Abu'l-Fath al-Haddad of Tus (peer of al-Ghazali in debate), Ibn Jamil (highwayman turned shaykh of Yemen's shaykhs), al-Damaghani the Hanafi chief qadi, Ibn Abi'l-Shawarib (house of 24 judges), Abu'l-Husayn al-Basri (al-Mu'tamad → Razi's Mahsul), al-Maqdisi the ascetic, Abu'l-Khayr al-'Ala'i (musnid of Jerusalem), al-Makaram al-Misri, al-Marhaf al-Namiri (blind poet), al-Mawahib al-Tunisi (Shadhili of al-Azhar), Abu'l-Salt al-Andalusi (astrolabe works written in confinement), Abu'l-Su'ud al-Harimi (20 years with broken ribs), al-Daqqaq (Qushayri's shaykh), Abu 'Ali al-Farisi (grammar's imam, 'Adud al-Dawla's "servant-boy"), al-Hijri of Ceuta, al-Shalubini, Abu 'Ali al-Tusi, Ibn al-Ikhwa, Ibn Duwayra (shaykh of Basra's Hanbalis). Validation 0 errors. Lane total: 441.

## Batch 027 — verified-summary sweep XI
25 person records. Ibn Ustadh Hurmuz ('Amid al-Juyush, regent who quieted Baghdad's fitnas 392-401), Abu 'Amir al-Azdi (Tirmidhi's transmitter, d.487), Abu 'Ata' al-Sindi (the lisped poet), al-Dinawari the Hanbali, al-Khwarazmi al-Tabarkhazi (al-Tabari's nephew, the Ibn 'Abbad twenty-thousand-verse joke), al-Mutawwi'i (31,000 ikhlas daily), Abu Bakr al-Shashi (Nizamiyya of Herat), al-Yafa'i the qadi ("manliness has died"), Ibn Mansur al-Sam'ani (father of Abu Sa'd), Abu Bakr b. Salim Ba 'Alawi (the 'Aynat saint), Ibn Zaydun Abu Bakr (killed at Cordoba), Abu Dabbus (last Banu 'Abd al-Mu'min king), Abu Dalama (the court wit), Abu Dawud Ibn Najah (muqri' of al-Andalus), Abu Ghalib the vizier (killed at Ahwaz), Abu Hamid al-Barawi (poisoned-sweets tale), Abu Hashim al-Jubba'i, Abu Hatim al-Razi (walked 1,000 farsakhs for hadith), al-Khayyat the muqri' (taught 70,000 blind), Ibn Qanna (19,000-volume endowed library), Abu Mas'ud al-Dimashqi (atraf pioneer), Abu Musa al-Madini, Abu Rafi' Ibn Hazm (saved the uncle, died at al-Zallaqa), al-Mutawalli (Nizamiyya chair), Abu Sa'd al-Naysaburi (martyred by the Ghuzz). Validation 0 errors. Lane total: 466.

## Batch 028 — verified-summary sweep XII
25 person records. Ibn Yunus al-Sadafi (Egypt's two histories), Ibn Qasas (al-Amir's confiscator, crucified at the bridge), al-Khujandi (40 yrs at Medina), Abu Talib al-Karkhi (lute-player → calligrapher → Shafi'i shaykh), Abu Talib al-Makki (Qut al-qulub), al-Ghafiqi (first to preach the 'Abbasid da'wa in Egypt, Saladin's reader), Yusuf al-Hamadhani (Marw's sufi shaykh), al-Qarrah (1,200+ shaykhs), al-Qazwini (300-vol tafsir), al-Dabusi (founder of khilaf science), Abu Zur'a the Younger, 'Afif al-Din al-Tilimsani ("since I knew Him I have not feared Him"), Ibn Mazru' (50 yrs at Medina, 40 hajjs), al-Asyuti, al-Barqi (killed by a beast in the market), Ahmad Ibn 'Aydarus of Tarim, Rasul Nafsihi (jarh), Ibn 'Arus (Tunis's rooftop saint), Ibn Badil (betrayed in old age), Ahmad b. Harun al-Rashid (the Saturday-working prince), Ibn Kamil (al-Tabari's pupil), Ibn Muhsin, Ibn Sa'd al-Zuhri (Ahmad b. Hanbal rose for him), Ibn Sawada (the ten-thousand-dirham test), al-Susi (died mid-sajda on the hajj). Validation 0 errors. Lane total: 491.

## Batch 029 — verified-summary sweep XIII (24 records)
'Ajiba bint al-Baqdari (last living licensee of samā'), 'Abd al-Qadir al-'Abadi (Mecca's grammarian — Suyuti's "had Sibawayh seen him"), al-Tartushi (never seen smiling), al-Abiwardi (the alfiyya), al-Ablah (the soldier-dressed wit), al-'Adil b. Ya'qub (Almohad claimant), al-Alusi (poet blinded in the matmura), al-Amjad Bahram Shah (killed playing chess by the mamluk who stole his gold penbox), al-As'ad b. Mammati (Saladin's Christian-born diwan inspector), al-Awhi, al-Ayki (Abu Hayyan's ilhad charge, flagged), al-Sayrafi al-Azhari, al-'Aziz 'Uthman (Baybars's amir seized entering Egypt), al-'Aziz of Aleppo, al-'Aziz Yusuf b. Barsbay (deposed at 3 months), al-Badi' al-Asturlabi (astrolabe-maker poet), al-Badra'i (built the Badra'iyya), al-Bahrani Muwaffaq al-Din (Euclid-solving poet), Sa'id al-Bakharzi (Najm al-Din al-Kubra's companion), al-Bakharzi (Dumyat al-qasr, killed in al-Andalus), al-Balansi (Valencian trader who reached China, al-Ghazali's pupil), al-Batruji (Andalus's peerless Maliki), al-Baydawi (Manar cite, unidentified), al-Bayyadi Mas'ud. Validation 0 errors. Lane total: 515.

## Batch 030 — verified-summary sweep XIV (25 records)
al-Buqa'i (the boy-historian's three sword-wounds), al-Dawlabi (histories of scholars' births/deaths), al-Dula'i (the funeral crowd that crushed), al-Faradi (Abu Hamid walked barefoot to meet him), al-Farawi ("a thousand transmitters"), Aqsunqur al-Fariqani (Baybars's tutor strangled), al-Fariqi, Ibn Shahuya, al-Faruthi, al-Fasihi al-Istrabadhi (king of grammarians' teacher), Abu'l-Fath al-Razi (drowned off Jeddah), Arghwan (freed slave who founded the Hafiziyya), 'Isa al-Hajari (stabbed at noon, wrote his complaint dying), al-Hakam al-Judh'ami (musnid of al-Andalus), al-Hakim al-Nisaburi (Mustadrak, 2,000-shaykh mu'jam), al-Harfush (30 yrs by the Haram), Abu Mansur al-Harimi (Mustansiriyya dar al-hadith), al-'Alawi al-Husayni (heard at age 5), al-Zaydi naqib (first niqaba+salat), Ibn Abi'l-Rabi', last Zirid al-Hasan (fled Mahdiyya to Roger), al-'Abbasi (caliphs' annals), Ibn Makhlad (one-day vizier), Ibn Makula (vizier killed by his mamluk), Ibn Abi'l-Shawarib. Validation 0 errors. Lane total: 540.

## Batch 031 — verified-summary sweep XV (25 records)
al-Jubba'i (head of Mu'tazili kalam — al-Ash'ari's teacher's pupil), al-Hatimi (the Risala exposing al-Mutanabbi's plagiarisms), al-Jajarmi (Kifaya fi'l-fiqh), al-Kalwadhani ('Abd al-Qadir al-Jili read fiqh on him; buried beside Imam Ahmad), al-Izniki (Mulla al-Fanari's pupil, sharh Miftah al-ghayb), al-Hawfi (I'rab al-Qur'an, 10 vols), al-Haskafi (Hisn Kayfa's khatib — "era's wonder in prose and verse"), al-Hazimi (Nasikh wa'l-mansukh), al-Hawfazan (the spear-nudged ancestor), al-Husri (blind muqri' the taifa kings fought over — "ya layl al-sabb"), al-'Iraqi (Egyptian named for Baghdad), al-Karajiki (al-Murtada's physician), al-Karukhi (endowed his Tirmidhi copy), al-Kawashi (refused the sultan's gifts), the four al-Kamals: al-Darir (al-Shatibi's son-in-law, head of iqra'), al-Fuwayra (98, top of isnad), al-Mahalli (blind reader of Cairo), Ishaq (al-Nawawi heard Muslim + Musnad on him); al-Kamal Salar (Ibn al-Salah's companion — fatwa of Syria turned on him); al-Hujja (Zangid princess, Qasyun madrasa); al-Husayn al-Jall (Mu'tazili shaykh buried by al-Karkhi); last Maghribi vizier; Ibn Fadl Sahlan (Karbala's Ha'ir wall); Husayn b. Sa'id (first Hamdanid of Aleppo); al-Kalabadhi. Validation 0 errors. Lane total: 565.

## Batch 032 — verified-summary sweep XVI (25 records + 1 dedup)
Dedup: person/al-muayyad-al-ulumbi merged into person/al-alusi-abu-said-al-muayyad (same Alus-born poet, vizier Ibn Hubayra's client, blinded in the matmura) — alias recorded, born/died fields and the Mas'ud b. Malikshah service carried over.
New prose: al-Khalil al-Qadi (shaykh of ahl al-ra'y), al-Khujandi (preacher of Isfahan's Nizamiyya), al-Khwarizmi Ibn al-'Abbas ("twenty thousand verses — men's or women's?"), al-Kurani (court reader of three Almohad kings), al-Kutubi, al-Lalaka'i (Sharh al-sunna), al-Layth al-Saffar (paraded on the elephant — end of the Saffarids), al-Ma'afiri (Ibn Bashkuwal's "seal of al-Andalus's scholars"), al-Makari ("not shaykh OF Islam — a shaykh IN Islam"), Salamish b. Baybars (exiled to Istanbul), Amjad Hasan b. Nasir Dawud (ascetic prince of Karak), Awhad Ayyub (shedder of amirs' blood, Akhlat), 'Aziz 'Uthman (built al-Subayba), Mansur Hajji (deposed as "mad" at 15), Mansur of Hama (the historian-king), Mansur b. Shirkuh (died mid-march on Damascus), al-Manazi (his endowed libraries, met al-Ma'arri), al-Mas'udi, al-Maydani (the Amthal — peerless in its field), al-Maziri (Maliki of Sicily), Ibn al-Haddus (Mosul's Shafi'i), Ibn Zakariya ("when Abu'l-Faraj attends, all the sciences attend"), Radi al-Din al-Mu'ayyad (highest isnad of his generation), Turanshah the Elder (senior Ayyubid, surrendered Aleppo), Mughith 'Umar (Baybars's sworn prisoner of Karak). Validation 0 errors. Lane total: 590.

## Batch 033 — verified-summary sweep XVII (24 records + 1 dedup)
Dedup: person/al-qadi-al-asad-ibn-abi-qudama merged into person/al-asad-ibn-mammati (same chancery-head who versified Salah al-Din's sira + Kalila wa-Dimna, d.606 Aleppo) — alias recorded, Shadharat source added.
New prose: al-Muhsin b. Salah al-Din (ascetic prince, Ibn al-Busiri's transmitter), al-Mu'tadid Yahya (Almohad caliph of days, knifed by the mamluk with a blood-feud), al-Mukharrimi (a library "the like of which was never gathered," buried at Ahmad's feet), the two Mursis (Lawraqi of the readings; the wanderer to furthest Khurasan), al-Musabbihi (13,000-folio Tarikh of Egypt under al-Hakim), the Mustajir claimant (Armenia, 349), al-Mustansir & al-Mu'tadid (Almohad succession), al-Mutaman al-Saji, al-Mutarriz (Tha'lab's mawla — 30,000 folios of lugha, poor in livelihood), al-Mu'tasim Ibn Sumadih (last Tujibid of Almeria, al-Mu'tamid's rebel-ally), al-Muwaffaq al-Iskafi (Baha' al-Dawla's vizier — "the eye of al-Muwaffaq"), al-Najirmi (the ten-dinar hand), al-Nami (Sayf al-Dawla's panegyrist second to al-Mutanabbi), al-Naqqash (three mu'jams; Barqani's jarh), al-Quda'i (Khitat Misr), al-Qadi al-Nu'man (Da'a'im al-Islam, al-Mu'izz's da'i), al-Qadisi the Blind (the Hanbali tarawih defiance), al-Qaffal al-Marwazi (the locksmith who made a four-grain lock then turned to fiqh at 30), al-Qahl b. 'Iyash (Yazid b. al-Muhallab's slayer), al-Qa'id Fadl (Minyat al-qa'id Fadl's namesake, killed in his cell), Abu'l-Qasim b. al-Qadir (the twenty silent drums), al-Qastallani (the rain prayer for the weak). Validation 0 errors. Lane total: 614.

## Batch 034 — verified-summary sweep XVIII (25 records + 1 dedup)
Dedup: person/al-qudai merged into person/al-qadai-muhammad-ibn-salama (same Shafi'i qadi of Egypt, Shihab + Khitat Misr, d.454) — alias recorded, Shadharat death-variant (Dhu'l-Hijja, Mansura) and the Khatib al-Baghdadi hearing carried into notes/summary.
New prose: al-Sayyida Nafisa (al-Shafi'i heard hadith on her; Cairo's answered-prayer grave), al-Shahrastani (Milal wa'l-nihal, Ash'ari kalam), al-Quduri (the Mukhtasar — Hanafi headship ended with him), al-Sabuni (preached at ten; al-Bayhaqi's "shaykh al-Islam truly"), al-Sakkaki (Miftah al-'ulum), al-Sarakhsi (would not eat rice — the grower's injustice), al-Qazzaz (the 1,000-folio particle book for 'Aziz), al-Qati'i (Durrat al-iklil — last transmitter of Abu'l-Waqt's Bukhari), al-Qudaydi, al-Qurtubi, al-Rafi'i al-Jili (the corrupt chief qadi of Damascus — cave on Mt. Lebanon), al-Rammadi (Cordoba's foremost poet), al-Rashid Ibn al-Zubayr (killed unjustly 559; Ibn Khallikan's "unique of his age"), al-Sa'di Shihab (qadi al-qudat buried at al-Ma'la), al-Sadid (the 30,000-dinar physician), al-Sa'id the Almohad, al-Salami (Khalid b. al-Walid's grand-nephew's line — "most poetic of Iraq"), al-Salih Isma'il b. Lu'lu' (Mosul's fall to the Tatars — nine days of the sword), al-Salih of 'Ayntab (passed over for his slave-born mother), al-Sanbati (seventy years at al-Azhar), al-Saymari (the malik al-muluk fatwa, 429), al-Sayyid Ahmad al-Shirazi, al-Sayyid the genealogist (past 100), al-Shahrazuri al-Qasim (father of the judges' house), al-Shantarini of Seville. Validation 0 errors. Lane total: 639.

## Batch 035 — verified-summary sweep XIX (23 records)
New prose: al-Sharishi (the Maqamat commentary), al-Shashi al-Mustazhiri (al-Hilya + 20-vol al-Shafi; "the Junayd" of the students), al-Shibli (Junayd's companion, ex-governor), al-Shihab al-Hijazi (orwhad of his age in adab, d.875), al-Sinaki (the framed mint-supervisor — "I am but musk"), al-Sukraji (Fusul fi'l-i'tiqad), al-Tajibi al-Mughami (muqri' of al-Andalus), al-Talamanke ("a drawn sword on the people of bid'a"), al-Tanukhi Ibrahim (the five-year judgeship verses), al-Taqi al-Bayyi' (the merchant-vizier of five kings — the 60k interest-free loan), al-Tarithithi Qutb al-Din (Nizamiyya of Nishapur in al-Juwayni's stead), al-Tartushi (Siraj al-muluk; made al-Afdal weep), al-Tughrai (Lamiyyat al-'ajam, beheaded before Mahmud 514), al-Udhri (8 years muqim at the Haram), al-Urjani ("most poetic of jurists"), al-Wahrani (abandoned earnest for jest — the Manam), al-Yazidi the grammarian (tutor of al-Muqtadir's sons), al-Zafir the qadi (first of the Banu 'Abbad — Seville's notables crowned him), al-Zahi (the perfumer-poet of Qati'at al-Rabi'), al-Zahir Dawud of al-Bira (11th son of Saladin), al-Zahir the Rasulid (Yemen's ruin, d.842), al-Zaki al-Barzali (the travelling hafiz, died on the road at Hama), al-Zarakani Alb Arslan (lived 139 years). 5 thin stubs skipped. Validation 0 errors. Lane total: 662.

## Batch 036 — verified-summary sweep XX (25 records)
New prose: al-Zawzani (shaykh of Baghdad's Sufis, "a thousand shaykhs"), al-Zayn al-Hafizi (the physician-envoy turned Tatar — killed by his own master), al-Zubaydi (Cordoba's unmatched grammarian, tutor of Hisham al-Mu'ayyad), 'Ali al-Fahhad (the amir who left the open treasury for God), 'Ali al-Harawi the Wayfarer (his handwriting on every wall, Etna witnessed), 'Ali al-Muttaqi al-Hindi, al-Qifti the Generous Qadi (books but no house, no wife), Qitali-zade (killed by sorcery at Antioch), 'Ali b. al-Hasan al-Dirabjirdi (the tax-officer's smoke), Ibn al-Muhsin al-Tanukhi, Ibn Abi'l-Shawarib (the 183 reversion ruling), 'Ali b. Muslim al-Sulami (al-Ghazali took him up — muqri' of the Umayyad), Ibn Tirad al-Zaynabi (the one-day bay'a of al-Muqtafi), 'Ali b. Yahya al-Zayri (the swift succession at Ifriqiya), Ibn Yunus the astronomer (the Hakimi Zij, 4 vols), 'Amid al-Dawla Ibn Jahir, Amin al-Dawla al-Samiri (the converted vizier — struck and burned), Anushirwan b. Khalid (al-Hariri's "pointing"), Asad b. al-Furat (the Asadiyya, died at Syracuse 213), Ash'ab the Greedy (al-Asma'i's uncle, the Medina tales), 'Ata' Allah (tutor of Sultan Selim), 'Ata Malik al-Juwayni (died in hiding 683), Awhad al-Zaman (the viper cure — cured of leprosy, gone blind), 'Ayn al-Qudat al-Hamadhani (crucified 525), Badal al-Tabrizi (fled Tatar Irbil, died at Aleppo). 5 thin stubs skipped. Validation 0 errors. Lane total: 687.

## Batch 037 — verified-summary sweep XXI (25 records)
New prose: Badis b. al-Mansur (the Zirid who died the night of his review), Badr al-Kalastani (the Turkish letter — secretariat of Egypt), Badr al-Sinjari (the vizier-qadi), Badr al-Habashi (abolished the pilgrim toll himself), Badr al-Jamali (the winter crossing — the state stood at his coming), Baha' al-Qifti (Isna's qadi under threat), Baha' Ibn Hanna (gift only from the poor), Baha' Zuhayr (Ibn Khallikan's licensed diwan), Baldwin I (embalmed for the road), Bardawil (the Sarkha of the sands — Farama burned), Barjawan (the ustadh of the quarter, a thousand trousers), Carra de Vaux (the orientalist entry), Bulus al-Habis (the monk of Helwan's treasure — tortured to death silent), Burhan al-Abnasi (hid from the judgeship; the prison verse), Burhan al-Balkhi (abolished "hayya 'ala khayr al-'amal" at Aleppo), Burhan al-Sinjari (deposed three times, died "poisoned"), Burhan the naqib (the iron collar released by Qaytbay), Buri b. Ayyub (Salah al-Din's youngest brother, knee-thrust at Aleppo), Da'laj (the gate-poor's paymaster), Dhakhirat al-Din (al-Qa'im's heir — the mourning pavilion), Dik al-Jinn (cock-of-the-jinn poet of Homs), Dirgham (the Lakhmi rival — head on a lance at Nafisa's shrine), Diya' al-Maqdisi (500 shaykhs, 90 parts of Mukhtara), Diya' al-Muradi (al-Nawawi's shaykh — "my eyes never saw his like"), Diya' al-Qasim (the uncle's bequest, then the request to be relieved). 5 thin stubs skipped. Validation 0 errors. Lane total: 712.

## Batch 038 — verified-summary sweep XXII (25 records)
New prose: Faris al-Din Aqtay (the 700-mamluk amir — poisoned at the Citadel), Fatima bt. al-Qadir (the forty-mourner funeral, Baghdad emptied), Aftakin (rope at his neck — freed by al-'Aziz), Fayd al-Awlasi (the pomegranate conversion), Frederick II (the emperor who recovered Jerusalem), Ghalib b. Sa'sa'a (al-Farazdaq's father — hundred camels in the munafara), Ghanim b. 'Asakir (seven years under the Rock), al-Hajjaj b. Hurmuzqana (d.400 at 105), Hajji Khalifa 'Abdallah (Ibn Bakhshi's successor), Hamid Afandi (the throne's mufti), Hammad al-Dabbas (shaykh of 'Abd al-Qadir, ate only dream-gifts), Hammad b. Abi Hanifa (weighed out the deposits), Harun b. al-Munajjim (Kitab al-Bari' — "a man's selection is a piece of his knowledge"), al-Hasan b. al-Hafiz (the forty-amir night, poisoned by his father), Hayat b. Qays (one of the four "acting in their graves"), Hibat Allah b. Salama (the blind mufassir of the Mansur mosque), Husam al-Din al-Hadhabani (al-Salih's intimate, epilepsy), Ibn Abi'l-Dam (the Muzaffari historian), Ibn Abi'l-Hadid (the Nahj al-balagha commentator + the rebuttal of Ibn al-Athir), Ibn Abi'l-Wafa, Ibn Abi 'Asrun (Nur al-Din's madrasa-builder), the two Ibn al-Abbars (the Seville poet; the Tunis katib killed unjustly at 63), Ibn al-Adami (the Hamawi preacher — Bukhari in Ramadan, died mid-circuit past 80), Dermenghem (the orientalist — Haykal's source). 5 thin stubs skipped. Validation 0 errors. Lane total: 737.

## Batch 039 — verified-summary sweep XXIII (25 records)
New prose: Ibn al-Bawwab (peerless of the pen — Ibn Muqla's way perfected), Ibn al-Baqqal (the Hanbali's caliphate-tent speech at the diwan), Ibn al-Dabithi (Diya' al-Din's "last of the abundant hafizes"), Ibn al-Dabbagh (died of grief when Seville's adhan fell silent), Ibn al-Hajj al-Tujibi (killed at Friday prayer, age 71), Ibn al-Battar (the herbalist — plant-knowledge ended with him), the two Ibn al-Dahans (the 16-vol Gharib; the 43-vol Idah commentary), Ibn al-Dubaythi (the Wasit dhayl), Ibn al-Khadiba ("none recited hadith better"), Ibn al-Maghribi (al-Hakim's refugee — vizier at Mayyafariqin), Ibn al-Khatib al-Rumi (the sultan's own teacher), Ibn al-Kiyal (the merchant turned muhaddith), Ibn al-Faris (the Turk-dressed adib), Ibn al-Anbari (45,000-sheet Gharib), Ibn al-Anmati (the matchless Egyptian), Ibn al-'Assar (Mutanabbi's scholar, prized script), Ibn al-Husayri (Hanafi headship ended with him), Ibn al-Qa'im al-Hayyim, Ibn al-Mallah, Ibn al-Khayr, Ibn al-Khazin, Ibn al-Latti (last 'uluww transmitter of al-Baghawi), Ibn al-Marabit (Almeria's Maliki head), Ibn al-Ardakhal. 5 thin stubs skipped. Validation 0 errors. Lane total: 762.

## Batch 040 — verified-summary sweep XXIV (25 records)
New prose: Ibn al-Najjar (the Mustansiriyya dar al-hadith), Ibn al-Qalanisi (Tarikh Dimashq to 555), Ibn al-Sabbagh (the twenty days at the usurped Nizamiyya — Nizam al-Mulk's outcry), Ibn al-Qaysarani the traveller (Atraf al-kutub al-sitta) and his namesake the poet-astronomer of Acre/Aleppo, Ibn al-Qatta' the Sicilian (fled the Frankish conquest, finer Af'al), Ibn al-Qutiyya (who opened the verb-conjugation door), Ibn al-Sarraj (the Usul — resort when transmission is disturbed), Ibn al-Sa'adat al-Muhadhdhabi (the 5-vol Maqamat commentary none matched), Ibn al-Sa'ati (the Nile quatrains), Ibn al-Hajj lineage continues: Ibn al-Raffa' (shaykh of shaykhs), Ibn al-Battar's colleague Ibn al-Naqib (the 'Ashuriyya mufassir), Ibn al-Ni'ma (seal of eastern Andalus's scholars), Ibn al-Mu'allim (sung in the Rifa'i sama'), Ibn al-Nabih (the Ashraf's one-line wonder), Ibn al-Qarsali (the well that bought his scholarship), Ibn al-Saffar (Cordoba's qadi-khatib-vizier), Ibn al-Sa'igh (Harran's mufti — teacher of Fakhr al-Din Ibn Taymiyya), Ibn al-Sammak (the accused preacher), Ibn al-Sawwadi, Ibn al-Sawwaf (shaykh of Iraq's Malikis, d.490 at 90), Ibn al-Shihna, Ibn al-Shirzaji (Ibn Khallikan's ijaza 567), Ibn al-Tabban (Qadi 'Iyad's camel-flanks), Ibn al-Taj (the Muqri' of Baghdad). 5 thin stubs skipped. Validation 0 errors. Lane total: 787.

## Batch 041 — verified-summary sweep XXV (25 records)
New prose: Ibn al-'Umayd (Rukn al-Dawla's katib — al-Sahib's negligent-letter regret), Ibn al-Ustadh of Aleppo (the 10-vol Wasit commentary lost in the Tatar sack), Ibn al-Zahiri (700 shaykhs), Ibn 'Alawiyya (Sayf al-Dawla's grammarian), Ibn Aqbaras (the awqaf dynasty), Ibn Arfa' Ras (Shudhur al-Dhahab), Ibn 'Awf (the day al-Suhayli died), Ibn Babak ("I am Ibn Babak"), Ibn Babashadh (the insha' examiner turned ascetic), Ibn Baqi (musnid of the Maghreb), Ibn Baqiyya (thrown to the lions), Ibn Batish, Ibn Bint al-A'azz, Ibn Bukayr (the matn/isnad memory game), Ibn Dawud al-Zahiri (the Zahira), Ibn Dihya, Ibn Dust (17 years dictating from memory), Ibn Furak (poisoned on the road), Ibn Hajib (40 years for two caliphs), Ibn Hamdun (the Tadhkira that jailed him), Ibn Hani' (killed at Barqa), Ibn Hanzaba, Ibn Hayyus, Ibn Jama'a, Ibn Jazla (the Christian-convert physician). 5 thin stubs skipped. Validation 0 errors. Lane total: 812.

## Batch 042 — verified-summary sweep XXVI (25 records)
New prose: Ibn Khafif (shaykh of shaykhs who mended rags from the middens), Ibn Manda, Ibn Manjuwayh (Shaykh al-Islam's most retentive), Ibn Mardawayh, Ibn Masdi (murdered at Mecca), Ibn Munir (the tongue Tughtakin nearly cut), Ibn Muti' (the Alfiyya), Ibn Nabbata (khatib of khatibs), Ibn Naqiya, Ibn Naqta, Ibn Qatral (Frankish captive turned qadi of Fez), Ibn Quri'a (the instant wit), Ibn Qurqul (died mid-sajda after Friday), Ibn Ra'iq (amir al-umara' and the severed hand), Ibn Rashiq (Qayrawan's fall to Sicily), Ibn Rushd the Elder, Ibn Sakra (the 50,000-verse diwan), Ibn Salam (dead at 21), Ibn Sam'un, Ibn Shahid, Ibn Shas (the Jawahir), Ibn Shayth, Ibn Shihab the warraq (Mutanabbi in three nights), Ibn Sida (blind son of a blind father — the Muhkam), Ibn Sura the book-broker. 5 thin stubs skipped. Validation 0 errors. Lane total: 837.

## Batch 043 — verified-summary sweep XXVII (25 records)
New prose: 'Imad al-Din al-Isfahani (Salah al-Din's katib — Barq al-Shami, Fath al-Qussi, Kharida), Ibn 'Unayn (exiled for the Muqrad al-A'rad, returned on the ra'iyya), Ibn Zafar the Sicilian (Sulwan al-Muta'), Ibn Wasil (the philosopher-qadi of Hama), Ibn Tabarzad (83-shaykh mashyakha, lived till the age was emptied), Ibn Tabataba (the Talibid naqib), Ibn Suwar (the Mustanir), Ibn Wahra (Abu Ishaq al-Shirazi's pupil turned ascetic), Ibn Waki' (the Mutanabbi-plagiarism book), Ibn Zubada (the chancery's last word), Ibn Zubraj (the coveted script), Ibn Zuhra (Aleppo's Shi'a head), Ibn Zurayq, Ibn Thabit the Zamzami, Ibrahim al-Sarayi, Ibrahim al-Zayyat the majdhub, Ibrahim Ibn Abi'l-Wafa', Ibrahim al-Qati'i, Ibrahim Ibn Qurra, Idris al-Ma'mun the Almohad, Ilyas al-Qarmani (the fee-less physician), 'Imad al-Din Ibn al-Shaykh (killed by al-'Adil's envoy), 'Isa al-Yunini, Ishaq al-Ilthi (who faced the caliph), Ishaq al-Saffar. 5 thin stubs skipped. Validation 0 errors. Lane total: 862.

## Batch 044 — verified-summary sweep XXVIII (25 records)
New prose: Isma'il al-Hadrami (the pottery-shard letter to the sultan), Isma'il al-Khatbi (the year-by-year history), Isma'il al-Taymi, 'Ismat al-Din Khatun (wife of Nur al-Din then Salah al-Din — madrasa, khanqah, turbah), Iyas b. Mu'awiya (the byword for wit), 'Izz al-Din 'Abd al-Hadi (the mace that felled horse and rider), 'Izz al-Din al-Maqdisi, 'Izz al-Din Aybak of Sarkhad, 'Izz al-Din Ibn al-Sa'igh (the 100,000-dinar trial — died mid-tahlil), 'Izz al-Din Ibn 'Awad, Ja'far lord of Sicily (the two-moons verses), al-Faryabi (met with banners at Bab al-Kufa), Ibn Hinzaba (the vizier who enriched anyone with a Baghawi majlis), Ja'far al-Duri, Ja'far al-Sa'igh, Jalal al-Din of Alamut (who restored the adhan), Ibn Matruh (al-Salih's vizier for Damascus), Ibn Fadlan (shaykh of Baghdad's Shafi'is), Janada the philologist, Jurd Bak (Shawar's killer, "cavalier of Islam"), the two Karimas — Bint al-Haqbaq (musnida of Syria) and Umm al-Kiram (never married, reached 100), Katila al-Harbi (the Muhimm), Kaykawus I of Rum, Khalid Ibn Khudash. 5 thin stubs skipped. Validation 0 errors. Lane total: 887.

## Batch 045 — verified-summary sweep XXIX (25 records + 2 dedup merges)
Dedup: mahiyar-al-daylami merged into mihyar-al-daylami (same poet, conversion-date variants preserved: 394 wafayat vs 294→394 muntazam tradition); mawdud-ibn-masud-ghaznawi merged into mawdud-ibn-masud (death-date variants kept: Rajab 441 shadharat vs 442 muntazam). Fixed unquoted hijri '0428' crashing the validator. New prose: Mihyar, Khusrawshah, Khwaharzada (the Hidaya's nephew's nephew), Khalid b. Yazid (the Samarra ode — 350 dinars), Mahraz (shelterer of the last Zirid, killed at Setif), the Majd al-Dins: Barmawi, Kinani (al-Maqrizi's friend), Ibn Daqiq (shaykh of the Sa'id), Kulathi (one of Suhrawardi's condemners), the two Makki muqri's (blind Masirjisi; Ibn Abi Talib of Cordoba), Mankubars, Mansur b. Nuh (al-Razi's Mansuri + the thousand-dinar alchemy book), Marwan al-Asghar (the Al Abi Hafsa poets), Matta b. Yunus (al-Farabi's logic teacher), Mawdud, Mulla Bistan, Mu'arrij (learned qiyas in Abu Zayd's circle), Mu'ayyid al-Mulk b. Nizam al-Mulk, three modern Azharis (al-Bahi, Farid Wajdi, Ghallab), Muhammad b. 'Abbad (founder of the 'Abbadids), Muhammad b. 'Abd al-Hadi (last to transmit from Shahda — martyred by the Tatars at 90+), Muhammad b. 'Abd al-Rahman b. Abi Bakr ("I am the son of 'Atiq"). Validation 0 errors. Lane total: 912.

## Batch 046 — verified-summary sweep XXX (25 records)
New prose: Muhammad b. al-Yunini (Asad al-Sham's heir at Baalbek), Muhammad b. Buri (ten-month emir of Damascus), Muhammad b. Dawud al-Asbahani (the Zahira — "thorn-sparrow"), Muhammad b. Musa al-Wasiti (Junayd's companion — "an age without Islam's manners"), Muhammad b. Shaddad al-Judh'u'i (the qadi who took the document to the throne), Muhibb al-Din al-Tabari (shaykh of the Haram — Riyad al-Nadira), Muhyi al-Din Ibn Fadlan (first professor of the finished Mustansiriyya), Mu'in al-Din Ibn Bundar (the madhhab written by his blessing), Musa b. 'Abd al-Malik (head of the kharaj — the vanished singing-girl), Mutarrif (San'a''s disputed qadi), Muwaffaq al-Din Ibn Abi'l-Hadid (brother of the Nahj commentator), Najib al-Din 'Abd al-Latif (the Kafiya), Najib b. al-'Awd (the slapped mutakallim of Aleppo), Najm al-Din al-Nahri (fled Ibn Taymiyya's khatib), Najm al-Din Ibn al-Habbaz (Ibn Khallikan's Wajiz teacher), Ilghazi the Artuqid (lord of Mardin and Aleppo), Najm al-Din Khidr (Baybars's son — lost al-Karak to Qalawun), al-Qaymuri (who handed Damascus to al-Nasir), Nasir al-Din Ja'far (rebuilt Mosul's walls against the caliph), al-Mutarrizi (the Mughrib — Hanafis' Azhari), al-Khubzaruzzi (the illiterate rice-bread poet of Basra), Nasr Allah al-Azhari (Aden's twice-showered panegyrist), Nasr Allah b. Qalaqis (drowned off Dahlak), Shahanshah b. Ayyub (Salah al-Din's eldest brother, killed at Damascus's gate), Nusayb (the bought-out slave-poet who outdid al-Farazdaq). 5 thin stubs skipped. Validation 0 errors. Lane total: 937.

## Batch 047 — verified-summary sweep XXXI (25 records)
New prose: Paul Casanova (Ghallab's presentation of his end-of-world thesis), Qassam al-Harithi (the shepherd who mastered Damascus's youth-gangs), Qutb al-Din al-Qastallani (Ibn Sab'in's Meccan censor — the Hallaj-to-Tilimsani book), Qutb al-Din Muhammad b. Zangi (the Hanbali who built a Hanafi madrasa out of anti-Shafi'i spite), Qutrub (Sibawayh's early-rising pupil, first mithlath), Rabi'a Khatun (Salah al-Din's sister — fifty royal relatives), Radi al-Din Abu Dawud al-Jili (the 15-vol fiqh the offices couldn't buy), Radi al-Din al-Irbili (Baktakin's teacher at Mosul), Razin (Tajrid al-Sihah), Rizq Allah al-Tamimi (Ibn 'Aqil's boldest-pen shaykh), Sa'd al-Dawla Sharif (the dying "my right left me no right"), Sa'd al-Nili (the extreme Shi'i tutor), Sa'd al-Din Ibn Hamuwayh (the Mansura captives), Sa'd al-Malik Ibn Makula (the Ikmal — killed by his own Turks), Salih al-Marri (the straining preacher), Sulyan al-Nahrawani (the 10-vol Qanun), Sayf al-Din al-Mashtub ("the Great Emir" — Salah al-Din's embrace at Jerusalem), Sayf al-Din al-Qaymari (his retinue seized the Frankish king at Mansura), Shabib b. Shayba (Khalid b. Safwan's rival), Shahda the copyist (Fakhr al-Nisa', the lofty isnad), Shamim al-Hilli (the Lamisa against the Hamasa — who smelled nothing), Shams al-Din al-Asfahani (Abhari's pupil, qadi of Qus), Shams al-Din al-Kalabadhi (the faridi who endowed his parts, died at Mardin), Shams al-Muluk Isma'il (killed in the citadel by his mother's dukhans), Shaqiq al-Balkhi (Ibrahim b. Adham's master — the idol-worshipper's rizq argument). 5 thin stubs skipped. Validation 0 errors. Lane total: 962.

## Batch 048 — verified-summary sweep XXXII (25 records + 1 dedup merge)
Dedup: shuhda-fakhr-al-nisa merged into shahda-al-katiba (same copyist; shadharat's musnida-of-Iraq/age-90+ detail kept in issue note; bare-slug alias fixed to person/ form). New prose: Sharaf al-Din al-Maqdisi (the Jawziyya Hanbali), Sharaf al-Din Ibn Mana (Ibn Khallikan's boyhood teacher — "none delivered lessons like him"), Sharaf Ibn Ni'ma (Damascus's khatib-mufti — the noria riddle), Shihab al-'Abir (Nablus's dream-interpreter — al-Badr al-Munir), Shihab al-Din al-'Abbadi (the Qayiji son-in-law), Shihab al-Din al-Kuni (the 20,000-verse Aleppine with the slit turban — praised Salah al-Din for love, not wages), Shihab al-Din al-Milkawi (Damascus's most learned qadi — died of Timur's shock), Shihab al-Turki (whole mushaf nightly in two rak'as), Shu'ayb b. Harb (one of Sari's four halal-morsel men — "I don't call you by your name"), Sitt al-Qudat (Salah al-Din's forty-hadith compilation), Sitt al-Sham (Zumurrud Khatun's two madrasas), Suhaym (the 300-camel counter to al-Farazdaq's father), Sultan al-Ba'labakki (thirteen Mecca-nights; the Kurdish groom), Sunqur al-Ashqar (al-Malik al-Kamil at Acre), Tahir b. Muhammad (the last Saffarid), Taj al-Din al-Sam'i (the tailor-ascetic "holding Baghdad fast"), Taj al-Din Ibn Hamuwayh (shaykh of the Sumaysatiyya), Taj al-Din Yahya (the Kharida qadi of Damascus), Tala'i' b. Ruzzik (vizier on the 19th, killed on the 19th), Taqi al-Din al-Futuhi (the Muntaqa Ibn Hajar supplemented), Taqi al-Din Ibn Abi'l-Yusr (the Baghdad elegy — "the cross rose over her pulpits"), Taqi al-Din Ibn al-Wasiti (pole of the age — the Zahiriyya), Taqi al-Din Ibn Razin (fatwa at 18; al-Nawawi's transmitter), Tekuder Ahmad (Hulagu's Muslim son — mosques for Baghdad at 20-something), Thamal al-Mirdasi (Artah's victory over the Byzantine king). 5 thin stubs skipped. Validation 0 errors. Lane total: 987.

## Batch 049 — verified-summary sweep XXXIII (25 records)
New prose: Thiqat al-Dawla Ibn al-Anbari (al-Muqtafi's intimate — the Tigris-bank madrasa), Timurbugha (the bow-making sultan — two months less a day), Tughril (al-'Aziz's atabeg), Ibn Ma'ruf ('Adud al-Dawla's arrested qadi), 'Umar al-Fayyumi (killed at Khan Ghabaghib), 'Umar b. Hamuwayh (Nur al-Din's shaykh of shaykhs), al-Khiraqi (the Mukhtasar — buried at Ahmad's grave), Umm al-Wahid (who issued fatwas beside Abu 'Ali), William I of Sicily (Ibn Qalaqis's patron, 563), Yahya b. 'Ali al-Munajjim (the Mu'tazili nadim — al-Bahir finished by his son), Yahya b. Manda (Tarikh Isfahan — "his house produced a house"), Yahya b. Muslim al-'Abid (Bishr's greeting answered by hand), Yahya b. Tamim (the Zirid — "al-Malik al-Maghdur"), Yahya al-Zami (al-Bukhari's shaykh of Rayy), Yahya al-Shirwani (the Khalwatiyya's founder — ten thousand fukara), Yalbay (two months less four days), Ya'qub b. Shayba (the forty quilts for the copyists — 10,000 dinars into the Musnad), Yazid b. al-Tathriyya ("muwaddiq" among the women — the Aghani's diwan), Yusuf al-Findalawi ("we sold and He bought — I shall not let Him go"), Yusuf b. Haydara (Salah al-Din's physician — al-Dakhwar's teacher), Zafir al-Haddad (the Alexandrian diwan), Zahir al-Shahhami (1,000 dictation sessions), Za'im al-Din (the arsenal vizier), Zayd al-Yafa'i (Yemen's small-bodied imam), Zayn al-Din Ali b. Kuchuk (the hundred-year lord of Irbil). 5 thin stubs skipped. Validation 0 errors. Lane total: 1,012 — the lane has crossed one thousand trilingual records.

## Batch 050 — verified-summary sweep XXXIV (25 records)
End-of-alphabet pass complete; now clearing the strongest of the previously-deferred cited pool. New prose: Abu'l-Wafa' al-Maraghi (the Academy's assistant secretary — Qadaya al-'amal), al-Kazaruni (Medina's head of learning), al-Malik al-Mushammar (Salah al-Din's rolled-sleeved son), al-Qadi al-Muhadhdhab (the more poetic Ibn al-Zubayr), Ibn al-Witar (the Mas'uda preacher), Ibn Bisal (twenty years at the dictation sessions), Ibn Hammawayh (the Hanafi-turned-Hanbali mujtahid qadi), Ibn Khatib Sarmin (the A'ma's ode at Mecca), Ibn Kulayb (musnid of Iraq — senses intact at the end), Ibn Rawaha (born in Sicilian captivity), Ibn Shufayn (the 'Abbasi musnid at 91), Ibn 'Utba al-Judh'ami (Cordoba's mufti — Ibn 'Abbad's funeral walk), Iqbal al-Shirabi (the 'Arafa spring for the pilgrims), Ja'far b. 'Abd al-Wahid (three-day qadi of Egypt), Isma'il al-Tanukhi (Yemen-genealogy hafiz), Malik al-Muhaddithin of Gujarat (the Mahdawi martyr), Muhammad al-Khidr Husayn (Zaytuna's Azhar shaykh — al-Sa'ada al-'Uzma), Muhammad 'Ali al-Sayis (Nash'at al-fiqh al-ijtihadi), Mu'in al-Din Ibn Juwayni (took Damascus for Egypt's lord), Muqallad b. Nasr (the Banu Munqidh patriarch), Nasir al-Din Muhammad b. Shirkuh (the poisoned lord of Homs), Salih b. Muhammad al-Shirazi (four thousand khatmas), Sanjar Shah (killed by his own son — the Jazira throne), Sayf al-Din Aqtay (Baybars's ustadh-dar), 'Ubayd Allah b. Jarir ("what is not to be will never be"). Validation 0 errors. Lane total: 1,037.
