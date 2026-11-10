# Prompt: poetry passages and a poetry browser

Paste this to the executing agent. Read the plan first: `docs/delegation/poetry-passages-plan.md`.

---

You are working in `/home/user/islam-museum` (islam.museum), branch `claude/islamic-poetry-passages-5nct16`. Read `AGENTS.md`, then `docs/ai-change-gates.md`, `docs/sources-policy.md` (§3, §4, §5), `docs/agents/publication-standard.md`, `docs/agents/content-standards.md`, `docs/agents/passage*` if present, `docs/site/README.md` before any change under `site/`, and `docs/delegation/poetry-passages-plan.md`.

**Goal.** Add poetry from Islamic history as `passage` records (unit `poem-line`), linked to the existing `work/` poem records, and give the poetry section a browser for them.

**Do first.** Confirm the plan's §2 decision with the founder: strict excerpts (≤40 words per passage, museum's own translation) is the default. If you cannot confirm it, do Phase 1 only and stop at the first gate with a note in `docs/delegation/poetry-passages-progress.md`.

**Phase 1: schema.**
- Add optional `metre` and `rhyme` to `schema/passage.schema.json`; create `schema/enums/metres.yaml`.
- Confirm `npm run validate` is at 0 errors on the current tree.

**Phase 2: pilot (3 poems).** `work/hassan-poem-kunna-muluk-al-nas`, `work/labid-elegies-for-arbad`, `work/qasidat-banat-suad`. For each:
- Find the poem's text in the local source. Check `data/work/<slug>.yaml` for the source and page, and `data/source/` for the edition. Do not copy the source file into git.
- Write 6 to 12 passages `passage/poem-<work-slug>-<nn>`, one bayt (or a run of at most 40 words) each. `text` is the Arabic. `ref` is the bayt number in the cited edition.
- Write `label` (Arabic first, then English), `summary` (museum's own words, Arabic first, `{cite:<source> p.N}` after each fact) and `translations.en` and `translations.ur` (the museum's own renderings, written from the Arabic, not from a translator's text).
- Add `provenance` (layer `own-research`, `generated_by`, `model`, `run`) and `status: { review: published, completeness: 2 }`.
- Every passage cites a source. Attribution doubts go in the summary, not hidden.
- Honorifics: never type ﷺ or «رضي الله عنه»; the UI renders them. Qur'an in a poem: link as `[[passage/quran-<sura>-<aya>|label]]`, never type it.
- Do not put more than 40 consecutive words of any source in a passage.
- Check the pilot against the plan and stop for review before Phase 3.

**Phase 3: browser (after the pilot is accepted).** Extend `site/src/pages/[lang]/words/poetry/index.astro` with a verses view listing `poem-line` passages (Arabic bayt, translation, poem, poet), sorted by poet death date then poem. Add filters (poet, poem, metre, rhyme, genre) as plain links first. Pagefind must index the Arabic and the translation. Each poem page lists its bayts in order; poet pages link to their verses. Arabic text uses `lang="ar" dir="rtl"`. Follow `docs/site/README.md` for i18n: every new UI string goes in `i18n/en.yaml`, `i18n/ar.yaml` and `i18n/ur.yaml` in the same commit.

**Checks before each push.**
- `npm run validate` (0 errors), `npm test` (all pass), `npm run build` for site changes.
- `npm run coverage` and commit `docs/coverage.md` when entities or edges change.
- Fix what fails; do not lower a rule, skip a test or add a guard that hides bad data.

**Git.** Commit explicit paths only (never `git add -A`). Conventional commit messages. End each commit with the attribution trailers `AI-Agent:`, `AI-Model:`, `AI-Editor:` from `docs/agents/workflow.md`, and do not name the model in the message body. Push to `claude/islamic-poetry-passages-5nct16`. Do not open a pull request unless asked. Do not deploy; the founder deploys.

**Report back.** Which poems and how many passages; what was checked; anything you could not verify (edition page numbers, attributions, translations); the open decisions in plan §7.
