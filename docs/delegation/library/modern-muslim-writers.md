# Lane `lib-exp-modern-muslim-writers`

- **Owner:** library-expansion (Claude)
- **Opened:** 18 Oct 2026, workstream prompt of the founder (see `docs/agents/lanes.md`, "Library expansion lanes")
- **Scope and book list:** see `docs/agents/lanes.md`, section "Library expansion lanes"
- **Branch / stubs:** `content/lib-exp-modern-muslim-writers`; `data/_stubs.d/lib-exp-modern-muslim-writers.yaml`

## Status

| Stage | State |
|---|---|
| 1. Books located (`books.yaml` entries) | Iqbal, *The Reconstruction of Religious Thought in Islam*: located on the harvest drive (174 PDF pages, OCR text present). Not yet in `books.yaml`. |
| 2. Downloaded (filename, source URL, size recorded below) | Found on the drive; no new download made. |
| 3. OCR (local, drive only) | Existing OCR read for pp. 3 to 19 (preface and Lecture I). |
| 4. Distilled into draft entities | First batch drafted: 5 entities (listed below), branch `content/lib-exp-modern-muslim-writers-iqbal`, review `draft`. |
| 5. Verified (`verify_cites.py`) | Not run. Edition not verified; each page citation is to the printed page number in the OCR text. |
| 6. Published in batches of at most 25 | Not published; awaiting merge by the founder or the lane owner. |

## Batch 1 (Iqbal, pp. 3 to 19)

Entities drafted (all `status.review: draft`, with provenance):

- `work/reconstruction-religious-thought-islam` (author `person/muhammad-iqbal`, existing record)
- `source/iqbal-reconstruction-religious-thought` (edition not verified; the reliability note says so)
- `concept/religious-experience` (new; no existing record found by grep)
- `concept/fuad-heart-as-insight` (new)
- `concept/tests-of-religious-experience` (new)

Pages covered: preface (p. 3) and Lecture I (pp. 4 to 19). Lecture II onward (from p. 20) is not covered.

Reused existing records: `person/muhammad-iqbal`, `person/muhammad`, `person/al-ghazali-abu-hamid`, `person/ibn-rushd`, `person/ibn-khaldun`, `concept/ilm`, `concept/tasawwuf` (the last two as `mentions` edges only).

## Duplicates found and skipped

- `concept/ilm` already exists with a different sense (the hadith on seeking knowledge); Iqbal's "knowledge" discussion is cited through it, not duplicated.
- No `perspectives` block was written on the three concepts: the validator requires a Sunni lead entry, and no sourced Sunni position for these notions has been read yet. Iqbal's views are labelled as his in the summaries.

## Downloads

None.

## Open items before review

- Verify the edition, publisher and year (the source record is `reliability_note`-flagged).
- Add a Sunni-frame perspective, from a Sunni source, to each concept where Iqbal's reading differs from the mainstream (Ghazali and kalam in particular).
- Read Lecture II onward (pp. 20 to 170 of the OCR).
- No Qur'an text is typed; Qur'an verses quoted by Iqbal are not linked yet (no passage record was checked for them).

## Next step

Founder or lane owner: review batch 1 and decide whether to merge. Then the next Iqbal batch is Lecture II (pp. 20 to 40) and a Sunni-frame perspective per concept. Also add this lane's entries to `scripts/harvest/library/books.yaml` in the lane's own commit, then run `fetch_books.py` for the lane after the workstream commit is on `origin/main`.
