# Ibn Hisham Lane — Progress

**Lane:** hisham  
**Branch:** content/ibn-hisham-continue  
**Book:** السيرة النبوية لابن هشام — الجزء الرابع (السقا والأبياري وشلبي، 1936)  
**Session agent:** kiro (KiroCrew dashboard), 2026-10-11  

## Status

Batches 1–3 are on main (done by Devin).

### Batch 4 — غزوة مؤتة pp. 15–30 ✅ COMPLETE
- **Commit:** d0d7da7 (on content/ibn-hisham-continue, needs merge to main)
- **Pages covered:** printed 15–30 (PDF 19–34)
- **Entities created/extended:**
  - Extended: `event/battle-of-mutah` (sides, 8 has_part relations, Zuhri variant note)
  - New events (8): `mutah-dispatch-of-army`, `mutah-halt-at-maan`, `mutah-martyrdom-of-zayd`, `mutah-martyrdom-of-jafar`, `mutah-martyrdom-of-ibn-rawaha`, `mutah-khalid-command-withdrawal`, `mutah-prophets-grief-and-condolence`, `mutah-return-to-medina`
  - New persons (10): `abd-allah-ibn-rawaha`, `asma-bint-umays`, `thabit-ibn-aqram`, `qutba-ibn-qatada`, `malik-ibn-zaflah`, `masud-ibn-al-aswad-mutah`, `wahb-ibn-sad-ibn-abi-sarh`, `abbad-ibn-qays-mutah`, `al-harith-ibn-al-numan-mutah`, `suraqa-ibn-amr-mutah`
  - New places (2): `maan`, `masharif`
  - New works (2): `hassan-elegy-mutah-commanders`, `kab-ibn-malik-elegy-mutah`
  - New stubs file: `data/_stubs.d/ibn-hisham.yaml` (17 targets)
  - New prose: `content/ar/event/battle-of-mutah.md`
- **Claims:** 64 (53 factual + 11 martyr list)
- **Ibn Hisham flags captured:** 11
- **OCR corrections:** 6 × جمفر → جعفر (confirmed on page images)
- **Validate:** 0 errors, 32 tests pass after rebase

## Next step

**Batch 5 — مهاجرة الحبشة pp. 3–11** (three sub-batches by clan):
- 5a: هاشم / عبد شمس / أسد
- 5b: تيم / جمح / سهم / عدي / عامر / الحارث
- 5c: بقية القبائل والمهاجرات

Then batch 6 (تبوك pp. 159–172) and batch 7 (مسجد الضرار pp. 173–181).

## Open questions / flagged items

- Push to `main` blocked by KiroCrew safety policy (protects main branch). Commit `d0d7da7` is on `content/ibn-hisham-continue` — founder must merge or grant push permission.
- `place/al-balqa` referenced in prose but not yet created — founder may want to add or stub it.
- Stub targets in `data/_stubs.d/ibn-hisham.yaml`: Hassan ibn Thabit, Ka'b ibn Malik, Zayd ibn Arqam, Qays ibn al-Musakhkhar, Abd Allah ibn Ja'far, Salama ibn Hisham, 4 secondary martyrs (per Ibn Shihab), place/Maab, place/al-Balqa, groups Lakhm/Judham/Banu Udhra.
