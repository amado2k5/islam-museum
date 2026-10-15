# Muwatta prose lane: progress and hand-over

**Lane:** `muwatta-prose` (`docs/agents/lanes/muwatta-prose.md`) · **Branch:** `content/muwatta-prose` · **Started:** 15 Oct 2026 (Claude Code, claude-fable-5-1, Claude desktop app)

## Edition and files
- Ma'ruf 1997, Noor-Book PDFs, OCR'd on 15 Oct 2026 into `~/islam-museum-harvest/books/hadith/muwatta-malik/noor-maruf-1997-v1/` (664 pp.) and `noor-maruf-1997-v2/` (720 pp.). Volume 1: printed page = PDF page in the body (checked on pp. 33–47). Citations are PDF pages, as in every existing Muwatta record.
- The four other items under `books/hadith/muwatta-malik/` are not this edition (two older prints of the Muwatta, a Sahih/Da'if al-Muwatta, and Ibn Khalfun's «أسماء شيوخ مالك»).
- Tools kept outside git (session scratchpad): a batch-apply script that rewrites a record from a JSON batch and checks honorifics, the 40-word cap on `text` and on every «…» quotation, and that every relation target exists.

## State
- Kitab done: 1 (الصلاة, hadith 1–590, PDF pp. 33–303; 24 batches; `content/ar/passage/muwatta-kitab-01-salat.md` written; records 546 and 547, skipped by the old lane, created).
- Kitab in progress: 2 (الجنائز, hadith 591–651, PDF pp. 305 ff.).
- Record reached: 590 (kitab 1 complete).
- REVIEW flags remaining: none in kitab 1; kitab 2–31 still carry theirs.
- Branch note: work is committed on `content/muwatta-prose` and pushed to `main` after each rebase on `origin/main`; the lane branch itself is not pushed after rebases.

## Doubts and flags
- Kitab 1 records with a doubt note in `status.flag`: 46 and 447 (Abu Qatada identification), 66 and 584 (Yahya names the Sunabihi «عبد الله»), 153, 159, 476 (Yahya's «Mahmud ibn Labid»), 520 (Yahya omits «عن أبيه»), 538 (Dawud ibn al-Husayn's timing, per Ibn Abd al-Barr), 544 (mursal vs musnad), 550 (Yahya omits Abu Hurayra), 575 (idtirab in the isnad).
- Duplicate stub `person/al-qasim-ibn-muhammad-ibn-abi-bakr` was folded into the existing `person/al-qasim-ibn-muhammad` (15 Oct 2026). `person/abd-al-rahman-ibn-al-qasim` in data is Malik's Egyptian student, not al-Qasim's son; do not link him for the Medinan.
- Qur'an passages are linked from Muwatta records with `related_to` (the only predicate whose range admits `passage`); the sura or aya is named in the summary with a `[[passage/quran-S-A|label]]` link and never quoted.
- Existing `summary.en` lines (Devin, 12 Oct 2026) predate the rewrite; they remain as short glosses and are not updated here (English is Phase 4).
- The old summaries carried the ﷺ glyph in 381 records (the validator exempts passages); the rewrite removes it.

## Next step
Kitab 2 (الجنائز): dump PDF pp. 305–330 of volume 1, write batch 1 (hadith 591–615) and batch 2 (616–640) and batch 3 (641–651), then the kitab prose `content/ar/passage/muwatta-kitab-02-janaza.md`. Same cycle: apply, commit explicit paths, rebase, coverage, validate, test, push.
