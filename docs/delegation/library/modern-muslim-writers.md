# Lane `lib-exp-modern-muslim-writers`

- **Owner:** library-expansion (Claude)
- **Opened:** 18 Oct 2026, workstream prompt of the founder (see `docs/agents/lanes.md`, "Library expansion lanes")
- **Scope and book list:** see `docs/agents/lanes.md`, section "Library expansion lanes"
- **Branch / stubs:** `content/lib-exp-modern-muslim-writers`; `data/_stubs.d/lib-exp-modern-muslim-writers.yaml`

## Status

| Stage | State |
|---|---|
| 1. Books located (`books.yaml` entries) | not started |
| 2. Downloaded (filename, source URL, size recorded below) | not started |
| 3. OCR (local, drive only) | not started |
| 4. Distilled into draft entities | not started |
| 5. Verified (`verify_cites.py`) | not started |
| 6. Published in batches of at most 25 | not started |

## Duplicates found and skipped

None recorded yet. Pre-check counts (18 Oct 2026, `grep -ril` over `data/`) are in the lane document.

## Downloads

None yet.

## Next step

Add this lane's entries to `scripts/harvest/library/books.yaml` in the lane's own commit, then run `fetch_books.py` for the lane after the workstream commit is on `origin/main`.

## Tafsir al-Manar, volumes 7 to 12 (first batch, drafted by a sub-agent)

- **Branch:** `worktree-agent-a01d71126811eb10d` (new branch, not pushed to main, not merged). Lane: tafsir (`docs/agents/categories/tafsir.md`).
- **Pages covered:** vol. 7, pp. 1–11 of the OCR (title page; Ma'ida 82 to 85 commentary, the opening discussion of Christians and Jews). Pages 12 onward and volumes 8 to 12 are not yet read.
- **Entities created (all `status.review: draft`):**
  - `source/tafsir-manar-v07` (primary, book; reliability note says the edition is not verified)
  - `concept/al-adawa-wal-mawadda` (term; Rida's definitions of enmity and affection, against the majority reading; labelled as his own)
  - `concept/qissisun-wal-ruhban` (term; Rida's glosses of priests and monks, and the two transmitted readings of who is meant)
- **Reused, not created:** `person/rashid-rida`, `passage/quran-5-82` to `quran-5-85` (cited in prose only), `person/negus-of-aksum` (not linked yet).
- **Skipped / blocked:**
  - `work/tafsir-al-manar` is not on `origin/main` and was not created here; the other agent (volumes 1 to 6) owns it. No `commentary_on` or `authored` edge was written for the source.
  - The schema has no edge from a concept to a passage (`revealed_about` runs passage to concept only), so the verse links are in prose, not in `relations`.
  - No question or tension card written yet for the Crusades passage (Rida's answer on p. 9–10 is recorded only in the concept prose).
- **Next step:** read vol. 7 from p. 12 on (Ma'ida 86 onward, then An'am), add a `person` record for the Negus only if it is needed for an edge, and once the other agent's `work/tafsir-al-manar` is on main, link the source to it. Then volumes 8 to 12, one source record each.
