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
| 1 موقع العرب وأقوامها | 15–22 | **in progress**: 1a pushed (`bcebba1f`: 17 new entities: concept/arab-peoples-before-islam, groups tayy/kinda/judham/ghatafan/bakr-ibn-wail, persons nabit/qaydar/mudad-ibn-amr/imran-ibn-amr/thalaba-ibn-amr/jafna-ibn-amr/sara, places ur/aja-and-salma, event/ibrahim-visits-ismail-in-mecca, question/who-are-qahtan-and-adnan); 1b (21 tribal groups re-written) next |
| 2 الحكم والإمارة في العرب | 23–34 | pending |
| 3 ديانات العرب / الحالة الدينية | 35–42 | pending |
| 4 صور من المجتمع الجاهلي | 43–47 | pending |
| 5 نسب النبي وأسرته | 48–53 | pending |
| 6 المولد وأربعون عاماً | 54–64 | pending |
| 7 في ظلال النبوة / الدعوة السرية | 65–77 | pending |
| 8 الدعوة جهاراً | 78–108 | pending |
| 9 المقاطعة / عام الحزن | 109–124 | pending |
| 10 خارج مكة / الإسراء | 125–142 | pending |
| 11 بيعتا العقبة / دار الندوة | 143–160 | pending |
| 12 الهجرة | 161–174 | pending |
| 13 الحياة في المدينة / السرايا قبل بدر | 175–203 | pending |
| 14 بدر | 204–233 | pending |
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
