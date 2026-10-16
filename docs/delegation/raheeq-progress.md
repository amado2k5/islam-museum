# Raheeq Mining Lane — Progress & Handoff Trail

**Lane:** raheeq  
**Book:** «الرحيق المختوم» by صفي الرحمن المباركفوري (1943–2006), 512 pp., PDF page = printed page  
**Last updated:** 15 Oct 2026

## Second pass with prose (from 15 Oct 2026, `docs/sources-policy.md`)

**Branch:** `content/raheeq-prose` (pushed straight to `main` after every validated sub-batch).  
**Why:** the first pass (below) was done under the old "facts only, never paraphrase" rule; 493 entities cite the book, 90 with no Arabic prose, most with a one-line summary, and pp. 15–124 and 300–399 are sparsely cited (`docs/delegation/held-back-content.md` item 1). This pass re-walks the book writing full Arabic prose per entity with `{cite:mubarakpuri-raheeq p.N}` after every factual sentence plus the classical source the footnote names.  
**Batch order:** book order, chapter by chapter (the task brief's "batch 1 = pp. 15–47"), i.e. the chapter map of `docs/plan/17-raheeq-makhtum.md` §3 rather than the Badr-first order of §6. 27 chapters, each split into sub-batches of at most 25 entities.  
**Conventions:** rewrite thin first-pass prose files wholesale (`## موجز` first, keeping their facts and their «للزوار الصغار» section); append a section to richer files from other lanes; add `source/mubarakpuri-raheeq` to the data file's `sources` of every entity touched; stubs whose entity is now written are removed from the stub lists; `completeness` left as is unless the entity is new.

| Chapter | Pages | State |
|---|---|---|
| 1 موقع العرب وأقوامها | 15–22 | **done**: 1a `bcebba1f` (17 new entities), 1b `9b15fd0e` (21 tribal groups), 1c `6f4975da` (lineage persons, Ibrahim-cycle events, Nabataean polity, 9 appended sections) |
| 2 الحكم والإمارة في العرب | 23–34 | **done**: 2a `d5147463` (polities, events, political condition), 2b `1cc845ca` (kings and chiefs), 2c (Mecca: Qusayy, Hulayl, Abu Ghubshan, Ya'mar, Hashim, al-Muttalib, Abd Manaf, Dar al-Nadwa, the expulsion of Jurhum, Qusayy's takeover; new concept/manasib-quraysh, polity/emirate-of-hijaz, event/partition-of-meccan-offices, groups sufa/adwan, persons amr-ibn-al-harith-al-jurhumi/bukhtanasar, a question; sections on Kaaba, Abd al-Muttalib, al-Abbas) |
| 3 ديانات العرب / الحالة الدينية | 35–42 | **done**: 3a (religions overview, idol-worship rites, Judaism, Christianity, Najran Christians, Jewish tribes, 8 belief concepts, a question), 3b (9 idols, Amr ibn Luhayy, Faymiyun rewritten; sections on Qudayd, Wadi Nakhla, Ta'if, Najran, Khaybar, Tayma, the cleansing of the Kaaba, Sa'id ibn al-Musayyab, Nadir/Qurayza/Qaynuqa/Khaybar Jews; revealed_about edges from 6:136, 6:138, 39:3, 10:18) |
| 4 صور من المجتمع الجاهلي | 43–47 | done 5cc11777 (4a: 13 entities) |
| 5 نسب النبي وأسرته | 48–53 | **done**: 5a `c9d79f7d` (nasab-al-nabi, Radman, Banu al-Najjar, Gaza; Hashim, al-Muttalib, Salma, Nawfal, Abu Sad; three Abd al-Muttalib events; sections on Muhammad, Adnan, Ibrahim, Abd al-Muttalib, Banu Hashim, Banu Abd Shams, the Elephant), 5b (Abdullah, Fatima bint Amr, Wahb; seven children of Abd al-Muttalib; event death-of-abdullah; sections on Amina, Umm Ayman, Abu Talib, Makhzum, Zuhra) |
| 6 المولد وأربعون عاماً | 54–64 | **done**: 6a `d3807837`, 6b `f2c4737e`, 6c `cb5e124b` (birth, nursing, Banu Sad, shaqq al-sadr, Amina, Abd al-Muttalib, istisqa; concept istirda-al-badiya, place bilad-banu-sad) (Bahira, Busra, Fijar, Qays Aylan, Hilf al-Fudul, Banu al-Muttalib, Abu Qubays, trade journey, marriage, Khadija, Maysara, Nafisa, Ahlaf clans), 6c (Kaaba rebuilt, Abu Umayya, Baqum, al-Walid, al-Abbas, concept al-amin, question, the seven children, Muhammad youth and character) |
| 7 في ظلال النبوة / الدعوة السرية | 65–77 | **done**: 7a `10ff236c` (revelation, pause, modes of revelation, second revelation, the call's stages), 7b (the three-year secret call, early Muslims, Maz'un brothers, concept al-salat-qabl-al-isra; sections on the early Muslims' companions) |
| 8 الدعوة جهاراً | 78–108 | **done**: 8a `a9955afe` (pp. 78–87), 8b `ee9a3948` (pp. 88–100), 8c (pp. 100–108: Hamza, Umar, Utba's offer, Abu Talib's gathering rewritten with page cites) |
| 9 المقاطعة / عام الحزن | 109–124 | **done**: 9a `5960d545` (pp. 109–115: covenant, siege, nullification, last delegation), 9b (pp. 115–124: deaths of Abu Talib and Khadija, Year of Sorrow, Ibn al-Dughunna, Sawda, sources of steadfastness appended to concept sabr) |
| 10 خارج مكة / الإسراء | 125–142 | **done**: 10a `96cb131c` (pp. 125–131: Ta'if, the jinn at Wadi Nakhla, offering Islam to the tribes), 10b (pp. 132–142: Tufayl, Abu Dhar, Dhimad, the six men of Yathrib, Aisha's marriage, the Night Journey rewritten with page cites) |
| 11 بيعتا العقبة / دار الندوة | 143–160 | **done**: 11a `6827efdc` (pp. 143–152: first and second pledges of al-Aqaba, Mus'ab's mission, the covenant clauses, the twelve chiefs), 11b (pp. 153–160: the emigrations and the stories of their hindrance, Abu Bakr waiting, the Dar al-Nadwa plot; new place dar-al-nadwa) |
| 12 الهجرة | 161–174 | **done**: 12a `fe1269ec` (pp. 161–166: the night escape, the cave of Thawr, the pursuit), 12b (pp. 167–174: the route, Umm Ma'bad, Suraqa, Quba, entry into Medina, the family's arrival) |
| 13 الحياة في المدينة / السرايا قبل بدر | 175–203 | **done**: 13a `101f5204` (pp. 175–182: three phases, three groups, Ibn Ubayy, the Jews), 13b `79c2b4d0` (pp. 183–189: the Mosque, brotherhood, Medina charter, ethics), 13c (pp. 190–203: the Jews' pact, Quraysh's letter to Ibn Ubayy, the permission to fight, the raids before Badr, the qibla change) |
| 14 بدر | 204–233 | **done**: 14a `896163c0` (pp. 204–211: the build-up), 14b `aaad03d2` (pp. 212–219: the battle's day), 14c (pp. 220–233: the death of Abu Jahl, the aftermath, the captives, Anfal, the first Eid) |
| 15 بين بدر وأحد | 233–247 | pending |
| 16 أحد | 248–289 | pending |
| 17 بين أحد والأحزاب | 290–300 | pending |
| 18 الأحزاب / بنو قريظة (Tier A) | 301–324 | pending |
| 19 بنو المصطلق / الإفك (Tier A) | 325–336 | pending |
| 20 الحديبية | 337–348 | pending |
| 21 مكاتبة الملوك | 349–361 | pending |
| 22 خيبر | 362–379 | pending |
| 23 السنة السابعة / مؤتة | 380–393 | pending |
| 24 فتح مكة | 394–411 | pending |
| 25 حنين والطائف | 412–423 | pending |
| 26 البعوث / تبوك / الوفود / حجة الوداع / الوفاة / البيت النبوي | 424–488 | pending (split by chapter when reached) |
| 27 ثبت المراجع | 489–494 | pending (check every cited classical source has a `source` entity) |

**Doubts flagged so far:** the nasab of the Aws, Khazraj and Ghassan (Qahtan vs Nabit ibn Ismail, p. 20) is recorded as a disagreement on the entities concerned; dates of the Yemeni kingdoms are the author's estimates (p. 25 note) and carry `status: tradition`.  
**Environment note:** this worktree needed `site/node_modules` linked from the main checkout for `npm test` (`scripts/hijri/dates.test.ts` resolves `site/tsconfig.json`); `npm run coverage` needs `npm run graph` first.

**Next step:** 1b: rewrite the prose of the 21 tribal groups pp. 15–22 (al-arab-al-baida, qahtan, kahlan, adnan, himyar, qudaa, al-azd, banu-lakhm, banu-hamdan, jurhum, rabia-ibn-nizar, mudar-ibn-nizar, iyad, anmar-ibn-nizar, banu-hanifa, banu-taghlib, banu-sulaym, madhhij, al-aws, al-khazraj, jadis), then 1c: persons and events of pp. 15–22 (ibrahim, ismail, hajar, adnan, maadd, nizar, ilyas, fihr, qusayy, settlement-of-hajar-and-ismail, sacrifice-of-ismail, building-of-the-kaaba, nabataean-kingdom) and appended sections on khuzaa, kinana, quraysh, banu-tamim, hudhayl, banu-asad-ibn-khuzayma, hawazin, thaqif, ghassan; then chapter 2 (pp. 23–34).

---

## Next step

Chapter 15 onward (chapter 15 starts at p. 234; read its pages and the existing entities first). Chapters 1–14 are on main.

## First pass (Oct 2026, old rules): batch log


## Batch Progress

- **Batches 1–8:** Done and merged on main prior to handover.
- **Batch 9 (الحياة في المدينة والغزوات قبل بدر pp. 175–203):** Completed and pushed to main (`0d567af`).
- **Batch 10 (بين بدر وأحد pp. 233–247):** Completed.
  - `event/conversion-of-umayr-ibn-wahb` (شوال 2هـ) + prose
  - `event/expedition-of-al-kudr` (شوال 2هـ) + prose
  - `event/siege-of-banu-qaynuqa` (شوال–ذو القعدة 2هـ) + prose (with perspectives block)
  - `event/expedition-of-al-sawiq` (ذو الحجة 2هـ) + prose
  - `event/expedition-of-dhu-amarr` (المحرم 3هـ) + prose
  - `event/killing-of-kab-ibn-al-ashraf` (ربيع الأول 3هـ) + prose (with perspectives block)
  - `event/expedition-of-buhran` (ربيع الآخر 3هـ) + prose
  - `event/expedition-of-al-qarada` (جمادى الآخرة 3هـ) + prose
  - Stubs recorded in `data/_stubs.d/raheeq.yaml`.

## Next Step
- **Batch 11:** غزوة أحد pp. 248–289 (map block + dataset; split into two batches 11a and 11b).

---

## Devin continuation (12 Oct 2026) — batches 15–27 complete

All merged to `main` through PRs (each validated 0 errors, 40/40 tests; the
only red check is the pre-existing Lighthouse performance budget on main):

- **B15** صلح الحديبية وبيعة الرضوان pp. 337–348 — PR #19
- **B16** مكاتبة الملوك والأمراء pp. 349–361 — PR #20
- **B17** غزوة خيبر وفدك pp. 362–379 — PR #21
- **B18** السنة السابعة ومؤتة pp. 380–393 — PR #22
- **B19** فتح مكة pp. 394–411 — PR #23
- **B20** حنين والطائف pp. 412–423 — PR #24 (Dhat Anwat event, the Ji'rana
  Ansar address, 4 new persons, 9:25–26 edges)
- **B21** البعوث وتبوك pp. 424–439 — PR #25 (12 events: sadaqa collectors,
  five saraya, the pass ambush, Negus funeral, 2 deaths, li'an, stoning)
- **B22** حج أبي بكر والوفود pp. 440–457 — PR #26 (~22 entities: Baraa
  proclamation, 16 delegations, Najran treaty, Banat Su'ad)
- **B23** حجة الوداع والوفاة pp. 458–472 — PR #27
- **B24** البيت النبوي والصفات pp. 473–488 — PR #29 (household: Ibrahim,
  al-Qasim, Abdullah; Zaynab marriage; the Choice; mothers-of-the-believers
  group; first Arabic prose for person/muhammad)
- **B25** العرب قبل الإسلام pp. 15–47 — three sub-PRs:
  - 25a peoples & Meccan authority — PR #30
  - 25b crowned kingdoms (Saba/Himyar/Lakhmids/Ghassanids/client empires,
    Ukhdud, Dhu Qar) — PR #31
  - 25c religion & society (Amr b. Luhayy, 9 idol objects, 11 jahili
    concepts, 16 passage edges) — PR #32
- **B26** النسب الشريف والأسرة النبوية pp. 48–53 — PR #33 (three-part nasab,
  child_of chain to Adnan, Zamzam digging, the vow & lot, arkah recovery)
- **B27** ثبت المراجع pp. 489–494 — PR #34 (35 bibliography source entities;
  fixed Mirqat al-Mafatih authorship → al-Mubarakfuri)

**Book fully mined.** Remaining known issues: ~199 non-blocking validation
warnings (missing prose in parallel-lane entities, duplicate titles) and the
Lighthouse performance budget (0.80–0.89 vs 0.95) which fails every PR.
