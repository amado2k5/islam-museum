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
