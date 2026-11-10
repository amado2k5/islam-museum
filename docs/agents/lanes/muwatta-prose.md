# Lane `muwatta-prose`: the Muwatta of Malik, own-words accounts of every report

**Scope.** The 2,864 `passage` records of the Muwatta (Yahya ibn Yahya al-Laythi's recension, ed. Bashar Awwad Ma'ruf, Dar al-Gharb al-Islami, 2nd ed. 1997; `source/muwatta-maruf-1997`, `work/muwatta-malik`): 2,833 hadith records `passage/muwatta-<kitab>-<n>` (n is the edition's running number) and 31 kitab records `passage/muwatta-kitab-NN-<name>`. Under the old rights rule each hadith record got a one-line summary with no matn and 1,982 carry a `REVIEW` flag. Item 15 of `docs/delegation/held-back-content.md` and the founder's rule of 15 October 2026 (`docs/sources-policy.md`) open the edition fully: the museum reads each report and its editor's apparatus and writes its own account.

**Source and where it lives.** The two Noor-Book PDFs of the edition, OCR'd with Apple Vision into `~/islam-museum-harvest/books/hadith/muwatta-malik/noor-maruf-1997-v1/` (664 PDF pages, kitab 1–12) and `noor-maruf-1997-v2/` (720 PDF pages, kitab 13–31), with `pages-png/` for checking a doubtful word. In volume 1 the printed page number equals the PDF page number from the body onward; citations use the PDF page, as every existing Muwatta record does. The editor's footnotes give the other transmitters from Malik, the takhrij in the canonical collections and Ibn Abd al-Barr's remarks from al-Tamhid: all of this may be read and restated with attribution.

**What each hadith record gets.**
- `label.ar`: «الموطأ N — <short title>».
- `summary.ar`: the museum's own account in Arabic: who narrates it as printed (the isnad head after Yahya and Malik), what the report says, the chapter heading Malik places it under, the editor's takhrij where legible («وخرّجه المحقق عند البخاري…») and any remark of Ibn Abd al-Barr or another named scholar, attributed; a page citation `{cite:muwatta-maruf-1997 p.N}` after the facts. No honorifics, no Qur'an text (an ayah quoted inside a matn is linked as `[[passage/quran-S-A|…]]` in prose and named, never typed).
- `text`: a verbatim matn excerpt of at most 40 words, where one fits (a saying of the Prophet, a Companion's words); the honorific glyph is dropped, never typed. Legal opinions of Malik («قال مالك») get no `text` unless a short sentence of his is the point.
- `relations`: `part_of` the kitab record; `mentions` the Companions, narrators, places and groups that exist in `data/` (or in `data/_stubs.d/muwatta-prose.yaml`); `basis_for` the practice or concept the report grounds when such an entity exists.
- `status`: `draft`, completeness 2, `generated_by` naming the model and the page; the REVIEW flag goes once the record is written from the page. Doubts stay as a `doubt:` note in `generated_by` and in the progress file.
- `provenance`: PDF page, kitab, bab, run id.
- `content/ar/passage/<slug>.md` only where a report needs more than the summary (long narratives, contested reports with perspectives). Every kitab record gets a prose page describing the kitab's chapters and its best-known reports.

**Grades.** Never in the museum's voice. The edition prints Ibn Abd al-Barr's and other scholars' judgements («مرسل»، «موقوف»، «متصل مسند صحيح»، «منقطع»): each is recorded with its author's name.

**Batches.** 25 records per commit, kitab by kitab from kitab 1 (الصلاة, hadith 1–581, PDF pp. 33–303) to kitab 31 (الجامع). After each 25 and at the end of each kitab: `npm run validate`, `npm test`, `python scripts/harvest/library/verify_cites.py`, `npm run coverage`, commit explicit paths with the attribution trailers, rebase on `origin/main`, push to `main`.

**Branch / stubs / progress.** `content/muwatta-prose`; `data/_stubs.d/muwatta-prose.yaml`; `docs/delegation/muwatta-prose-progress.md`. Commit prefix `content(muwatta-prose)`.

**Tier A.** Reports touching the Companions' disputes, the caliphate, hudud and the status of other communities are flagged in the progress file for editorial review.
