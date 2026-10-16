# Muwatta prose lane: progress and hand-over

**Lane:** `muwatta-prose` (`docs/agents/lanes/muwatta-prose.md`) · **Branch:** `content/muwatta-prose` · **Started:** 15 Oct 2026 (Claude Code, claude-fable-5-1, Claude desktop app)

## Edition and files
- Ma'ruf 1997, Noor-Book PDFs, OCR'd on 15 Oct 2026 into `~/islam-museum-harvest/books/hadith/muwatta-malik/noor-maruf-1997-v1/` (664 pp.) and `noor-maruf-1997-v2/` (720 pp.). Volume 1: printed page = PDF page in the body (checked on pp. 33–47). Citations are PDF pages, as in every existing Muwatta record.
- The four other items under `books/hadith/muwatta-malik/` are not this edition (two older prints of the Muwatta, a Sahih/Da'if al-Muwatta, and Ibn Khalfun's «أسماء شيوخ مالك»).
- Tools kept outside git (session scratchpad): a batch-apply script that rewrites a record from a JSON batch and checks honorifics, the 40-word cap on `text` and on every «…» quotation, and that every relation target exists.

## State
- Kitab done: 1 (الصلاة, hadith 1–590, PDF pp. 33–303; 24 batches; chapter page written; records 546 and 547, skipped by the old lane, created); 2 (الجنائز, hadith 591–651, PDF pp. 305–332; 3 batches; chapter page written; record 617 created); 3 (الزكاة, hadith 652–780, PDF pp. 333–384; 6 batches; chapter page written).
- Kitab 4 done: الصيام (hadith 781–865, PDF pp. 385–417; 4 batches; chapter page written).
- Kitab 5 done: الاعتكاف (hadith 866–897, PDF pp. 419–431; 2 batches; chapter page written). Hadith 877 onward are heard by Yahya through Ziyad ibn Abd al-Rahman (Shabtun), per the editor's note at 878.
- Kitab 6 done: الحج (hadith 898–1282, PDF pp. 433–570; 83 babs; 385 records; 17 batches in this lane's last session; chapter record and page written). Hadith 932 is absent from the printed text; 1136, 1165 and 1206 had no record file and were created.
- Kitab 7 done: الجهاد (hadith 1283–1350, PDF pp. 571–604; 21 babs; 68 records; chapter record and page written).
- Kitab 8 done: النذور والأيمان (hadith 1351–1386, PDF pp. 605–618; 9 babs; 36 records; chapter record and page written).
- Kitab 9 done: الضحايا (hadith 1387–1402, PDF pp. 619–627; 6 babs; 16 records; chapter record and page written).
- Kitab 10 done: الذبائح (hadith 1403–1413, PDF pp. 629–633; 4 babs; 11 records; chapter record and page written).
- Kitab 11 done: الصيد (hadith 1414–1440, PDF pp. 635–644; 7 babs; 27 records; chapter record and page written).
- Kitab 12 done: العقيقة (hadith 1441–1448, PDF pp. 645–647; 2 babs; 8 records; chapter record and page written). Volume 1 (kitab 1–12) is complete.
- Kitab 13 done: الفرائض (hadith 1449–1488, PDF pp. 5–26 of volume 2; 15 babs; 40 records; chapter record and page written).
- Kitab 14 done: النكاح (hadith 1489–1580, vol. 2 PDF pp. 27–58; 22 babs; 92 records; chapter record and page written).
- Kitab 15 done: الطلاق (hadith 1581–1761, vol. 2 PDF pp. 59–117; 35 babs; 181 records; chapter record and page written). The kitab was first logged as complete at 1713; the book runs on to 1761.
- Kitab 16 done: الرضاع (hadith 1762–1780, vol. 2 PDF pp. 119–128; 3 babs; 19 records; chapter record and page written). Hadith 1780 was an unnumbered record in the old lane; created now.
- Kitab 17 done: البيوع (hadith 1781–2006, vol. 2 PDF pp. 129–220; 46 babs; 226 records; chapter record and page written). Hadith 1948 has a cut isnad in the OCR, flagged for checking.
- Kitab 18 done: القراض (hadith 2007–2048, vol. 2 PDF pp. 221–237; 15 babs; 42 records; chapter record and page written).
- Kitab 19 done: المساقاة (hadith 2049–2072, vol. 2 PDF pp. 239–247; 2 babs; 24 records; chapter record and page written).
- Kitab 20 done: كراء الأرض (hadith 2073–2078, vol. 2 PDF pp. 249–250; 1 bab; 6 records; chapter record and page written).
- Kitab 21 done: الشفعة (hadith 2079–2102, vol. 2 PDF pp. 251–258; 2 babs; 24 records; chapter record and page written).
- Kitab 22 in progress: الأقضية (hadith 2103 onward, vol. 2 PDF p. 259). Records 2103–2122 done (babs 1–4 so far).
- Record reached: 2122. Next: kitab 22 from hadith 2123 (vol. 2, PDF p. 267, bab 5 continues onto p. 268).
- REVIEW flags remaining: none in kitab 1–6; kitab 7–31 still carry theirs.
- Record `ref` convention differs by kitab in the old data (kitab 1: "1.NNN"; kitab 2 onward: "NNN"); records created by this lane follow the kitab they belong to.
- Branch note: work is committed on `content/muwatta-prose` and pushed to `main` after each rebase on `origin/main`; the lane branch itself is not pushed after rebases.

## Doubts and flags
- Kitab 1 records with a doubt note in `status.flag`: 46 and 447 (Abu Qatada identification), 66 and 584 (Yahya names the Sunabihi «عبد الله»), 153, 159, 476 (Yahya's «Mahmud ibn Labid»), 520 (Yahya omits «عن أبيه»), 538 (Dawud ibn al-Husayn's timing, per Ibn Abd al-Barr), 544 (mursal vs musnad), 550 (Yahya omits Abu Hurayra), 575 (idtirab in the isnad).
- Duplicate stub `place/al-baqi` was folded into the existing `place/al-baqia` (data/_stubs.yaml). Duplicate stub `person/al-qasim-ibn-muhammad-ibn-abi-bakr` was folded into the existing `person/al-qasim-ibn-muhammad` (15 Oct 2026). `person/abd-al-rahman-ibn-al-qasim` in data is Malik's Egyptian student, not al-Qasim's son; do not link him for the Medinan.
- Qur'an passages are linked from Muwatta records with `related_to` (the only predicate whose range admits `passage`); the sura or aya is named in the summary with a `[[passage/quran-S-A|label]]` link and never quoted.
- Existing `summary.en` lines (Devin, 12 Oct 2026) predate the rewrite; they remain as short glosses and are not updated here (English is Phase 4).
- The old summaries carried the ﷺ glyph in 381 records (the validator exempts passages); the rewrite removes it.

## Next step
Kitab 22 (الأقضية) from hadith 2123 (vol. 2, PDF p. 267), then kitab 23 onward. Same cycle per 25 records: apply, commit explicit paths, rebase, coverage, validate, verify cites, push. Chapter record and page at the end of each kitab.

## Notes (Haiku session)
- Commits from the Haiku 5.5 session carry `claude-haiku-5-5` in the AI-Model trailer; earlier commits carry `claude-fable-5-1` and stay as they are.
- Local branch `content/muwatta-prose` holds a copy of the kitab 3 coverage commit (479f1ad1) that differs from the pushed one only in its message; the next rebase onto origin/main drops it.