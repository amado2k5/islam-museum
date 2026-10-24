# Showcase Tier prose: progress (lane `showcase-prose`)

_Opened 24 October 2026. Lane document: [`../agents/lanes/showcase-prose.md`](../agents/lanes/showcase-prose.md). Queue: [`showcase-queue.md`](showcase-queue.md). Branch `content/showcase-prose`. Stubs `data/_stubs.d/showcase-prose.yaml`._

## Phase plan

| Phase | Scope | Budget | State |
|---|---|---|---|
| Setup | Repo, branch, dependencies, harvest workspace | 45 min | Done (see day log) |
| 0 | Register the lane; queue file | 30 min | Done (this commit) |
| 1 | Sicily pilot: `exhibit/path-sicily-islam` and its 10 featured records and journey | ~2.5 h | In progress |
| 2 | Egypt showcase set (after Archnet registration) | ~2.5 h | Not started |
| 3 | General Showcase queue | remainder | Not started |

## 0.0 Compliance checklist (instructions of 24 October 2026)

| Line | Checked against | Verified |
|---|---|---|
| Publication standard: no review; one source enough; records enter `status.review: published` | `docs/agents/publication-standard.md` on `origin/main` at `fe34884ea` | Yes |
| Source families catalogue is the shelf; registration before first use | `docs/agents/source-families.md` on `origin/main` at `fe34884ea` | Yes |
| Tests and CI deferred: per batch only `npm run cite-check`; `npm test` not run; no waiting on CI before merge | Founder instruction 0.2 | Yes (see deferral note below) |
| Evidence gathered on this Mac into the local harvest workspace; writing from local files only | `~/islam-museum-harvest/` (books, OCR, claims) | Yes |
| Starting point of this branch | `origin/main` at `615949d2a` | Yes |

**Deferral note (instruction 0.2):** the full test suite (`npm test`) and CI are deferred to the founder and are not run in this lane. `npm run validate` is run only at phase checkpoints if it finishes quickly; its result is recorded in the batch entries below.

## Decisions taken without the founder (day log)

| # | Question | Options | Choice | Why |
|---|---|---|---|---|
| D1 | Branch name | Use the run's `content/showcase-prose` vs the worktree's `claude/islam-museum-enrichment-224ce4` | `content/showcase-prose`, created from `origin/main` in this worktree | The run instruction names the branch; the worktree is the isolated copy the session was given |
| D2 | Clone or worktree | Clone to `~/islam-museum` vs use this worktree | This worktree | The session runs in a git worktree; a second clone would split the work. The repo already exists on this Mac |
| D3 | Local model (Ollama) | Pull a model for first passes vs Claude-only | Claude-only, no model drafts | Every line must be checked against the local source anyway; the day's output must not depend on Ollama (instruction 1.4). A drafted line still needs the same check, so no time is saved on the claims that matter |
| D4 | Brew installs (tesseract, ocrmypdf, poppler, ripgrep, jq, pandoc) | Install vs skip | Skip. `tesseract`, `pdftotext`, `rg` and `jq` are already present; the OCR of the books needed for Phase 1 is already in the workspace | Setup must not eat the day (instruction 1.1–1.3) |
| D5 | Slug drift in the Sicily brief | Use the brief's slug vs the live slug | Live slugs: `event/aghabid-conquests-sicily` (brief said `aghlabid`), `polity/emirate-of-sicily`, `place/siqilliya`, `place/palermo`, `building/palermo-mosque-1591`, `event/first-raid-on-sicily`, `person/asad-ibn-al-furat`, `person/al-idrisi-muhammad-ibn-abd-allah`, `person/ibn-jubayr-muhammad`, `journey/sicily-to-granada-jubayr` | Instruction 1: use the real slug and note it |
| D6 | Sicily source for the Futuh al-Buldan | Cite the Mu'assasat al-Ma'arif 1407 scan (`source/futuh-buldan-maarif-1407`) | Same. The maarif scan is `books/tareekh/futuh-buldan/20230703_20230703_1444/` (pages.json). The Sicily passage is at scan page 329, the anchor the existing records already use. The other Futuh copies in the workspace are a different edition and are not cited for this lane | `source/futuh-buldan-maarif-1407` names this scan in its reliability note |
| D7 | Dates that two sources give differently | One date vs both | Both, as a second dated claim with `status: debated`, when the Ibn Khaldun and the al-Baladhuri/Ibn al-Athir dates differ | Publication standard: a second source strengthens a record; a conflict is shown, not resolved |

## Decisions, continued (Phase 1)

| # | Question | Choice | Why |
|---|---|---|---|
| D8 | Asad ibn al-Furat: death at Syracuse and burial at Palermo (cited to Wafayat al-A'yan) | Not written. The phrase "سرقوسة" does not occur in any Wafayat volume in the local workspace; the record stays at completeness 1 | Instruction: a claim the sources in reach cannot support is skipped. What is verifiable here is his leadership of the Sicily expedition (Ibar scan p. 1026) |
| D9 | Ibn Jubayr person record: origin and death place (cited to Nafh al-Tib p. 491, Shadharat p. 60) | Not written. The entries in the local Nafh OCR do not show p. 491's text; the record stays at completeness 1 | Same rule as D8. The Rihla itself is verified (see batch 1) and carries the journey record |
| D10 | Palermo's dates 831 and 1072, and Sicily's 827 and 1091 (in the earlier drafts, from GeoNames and Wikidata) | Removed from Palermo. For the emirate: 212 AH from Ibn Khaldun (scan p. 1026) and 1091 derived from Idrisi's "thirty years" from 453 AH (scan p. 589), both marked derived | No local source gives 831 or 1072. A pointer (Wikidata, GeoNames) is not a source for a date |
| D11 | Reading "سنة اثنتي عشرة" in Ibn Khaldun (scan p. 1026) as 212 AH | Taken, flagged in the prose: the year is read from the context of an OCR text in two interleaved columns | The Mazara landing is clear; the number is the reader's reading, so the record says so |
| D12 | Which Nuzhat al-Mushtaq to cite | `source/nuzhat-al-mushtaq-2002` (its scan `1-2_20240914`, two volumes), not the Rome 1592 scan | The local scan has two volumes, matching the 2002 Cairo entity; the 1592 copy is not used in this batch |
| D13 | Idrisi birth and death years (Mawsu'at A'lam pp. 408–410) | Kept in the data, unchanged, with their source. They are not in the local workspace and were not re-checked; the prose makes no claim that depends on them | Flagged for the founder's later check rather than removed |
| D14 | Exhibit completeness | Rooms rewritten to the 5.4 standard in ar, en and ur. The trail stays at completeness 2: room 4 features `question/what-were-the-crusades`, which is at completeness 1 | The 5.4 rule says a trail is finished only when every featured record is at 3. That record is outside this batch |

## Batches

### Batch 1 (Phase 1, Sicily): 7 records done, 2 skipped, 1 trail partly done

Done (completeness 3, `status.review: published`, ar + en + ur prose in the same commit; `cite-check` 8 of 8 pass):

- `event/first-raid-on-sicily`: the existing three-section prose kept; the "one more source is needed" sentence on the date removed, the date stated as derived from Mu'awiya's reign. Checked: Futuh scan p. 329.
- `event/aghabid-conquests-sicily`: rewritten. Checked: Futuh scan p. 329 (the heading "فتح جزائر في البحر", "نيفاً وعشرين مدينة", "قصر يانة وحصن غليانة").
- `place/siqilliya`: rewritten. Checked: Futuh scan p. 329; Nuzhat scan pp. 588–589.
- `polity/emirate-of-sicily`: rewritten; start and end years are derived and marked (D10, D11).
- `place/palermo`: rewritten; the 831 and 1072 dates removed (D10). Checked: Ibar scan p. 1026 ("حاصروا بليرم", "فتح المسلمون مدينة بليرم", no year in the read lines); Rihla scan pp. 92–93.
- `person/al-idrisi-muhammad-ibn-abd-allah`: prose rewritten from the Nuzhat preface (scan pp. 4, 7) and p. 588; the "Ceuta" claim and the map claim dropped from the summary (not in the local text). Birth and death years kept, flagged (D13).
- `journey/sicily-to-granada-jubayr`: the existing legs kept; this pass spot-checked the Rihla scan at pp. 76–79, 88, 90, 93, 96, 97, 101. Pages 80, 92, 94, 95 and 98 were not re-read.

Trail (partly done): `exhibit/path-sicily-islam`: the four rooms rewritten in ar, en and ur to 3–5 cited sentences each. The English bodies no longer contain Arabic. Summary rewritten to remove the unverified "النورمان يرثون الصناعة". Completeness 2 (D14).

Skipped: `building/palermo-mosque-1591` (no source in the local workspace; a Wikidata candidate whose identity is not checked; the brief's facts do not apply to it). `person/asad-ibn-al-furat` and `person/ibn-jubayr-muhammad` (D8, D9).

Slugs confirmed against the live tree (D5 in the brief): the event slug is `event/aghabid-conquests-sicily`; `event/aghlabid-conquests-sicily` does not exist. The Aghlabid dynasty is `polity/aghlabid-emirate`.

Checks run: `npm run cite-check` (8 of 8 pass); `npm run graph` and `npm run coverage` (`docs/coverage.md` regenerated); `npm run validate` (0 errors, 7,295 warnings, none from the lane's new text except the existing "sides" warnings that every raid and conquest record carries). `npm test` not run (instruction 0.2).

Urdu for founder review: every ur file in this batch is a draft translation by Claude Haiku 5.5, marked as such in its frontmatter.

## NEXT STEP:

Phase 1, batch 2: the remaining Sicily records not yet verified are `person/asad-ibn-al-furat` and `person/ibn-jubayr-muhammad` (both skipped in this batch: see D8, D9). Before writing either, find their passages in the local workspace (Ibn Khallikan's Sahnun entry for Asad; the Nafh al-Tib entry for Ibn Jubayr). Then the trail: raise `question/what-were-the-crusades` (outside the Sicily set, for the exhibit's 5.4 finish) or ask the founder whether room 4 should keep that feature. Then Phase 2 (Egypt): register Archnet first (source-families 5.3).
