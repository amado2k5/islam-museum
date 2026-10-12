# Raheeq Mining Lane — Progress & Handoff Trail

**Lane:** raheeq  
**Branch:** content/raheeq-continue  
**Book:** «الرحيق المختوم» by صفي الرحمن المباركفوري (1943–2006)  
**Last updated:** 11 Oct 2026

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
