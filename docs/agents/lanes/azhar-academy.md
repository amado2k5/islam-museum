# Lane: lib-azhar-academy

**Scope.** Mine the Scientific Series (السلسلة العلمية) of مجمع البحوث الإسلامية (Al-Azhar Islamic Research Academy), as published free on azhar.eg. About 100 titles; the local copies are PDFs with Vision OCR text kept outside git on the founder's microSD.

**Where the text lives (outside git).**
- PDFs: `/Volumes/exmicroSD/islam-museum-harvest/raw/library/al-azhar-magmaa/` (103 of 104 files saved; two returned 404 and are pending).
- OCR text, one file per PDF, `===== [pN] =====` page markers: `/Volumes/exmicroSD/islam-museum-harvest/ocr/al-azhar-magmaa/`.
- Claims tables and working notes: `/Volumes/exmicroSD/islam-museum-harvest/claims/azhar-academy/`.

**Rights.** Read any title and rewrite in the museum's own words, with a page citation after every sentence that states a fact (`docs/sources-policy.md`). Quotations are verbatim, at most 40 words, with the page. The PDFs, OCR text and claims tables never enter git.

**Batch order (first pass).**
1. `الأزهر في ألف عام` (Ahmad Muhammad Awf, supervised by the Academy's Secretary-General): institutional history. Pilot batch.
2. `منهج القرآن في بناء المجتمع` (Shaltut's text as printed in the series).
3. `الإسلام عقيدة وشريعة`.

**Rules specific to this lane.**
- Every dated fact needs this book's page plus a second source, or `confidence: low` with `needs_source`. Where a date differs from an existing entity (for example the foundation date of al-Azhar), record it as a second dated claim with `status: debated`; never overwrite.
- Entities already in `data/` are reused and extended, not duplicated (for example `place/al-azhar`, `event/azhar-founding-361`).
- Every entity: `label.ar`, `summary.ar`, at least one source, a provenance block, `status.review: draft`. No honorifics typed, no Qur'an text typed.
- AI output is draft. Nothing is marked reviewed or verified.

**Attribution.** Each commit carries `AI-Agent`, `AI-Model` and `AI-Editor` trailers (`docs/agents/workflow.md` §7).

**Progress.** `docs/delegation/azhar-academy-progress.md`.
