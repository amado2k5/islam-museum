# Lane: spanish — Spanish as the fifth language

**Status:** open, approved by the founder 18 November 2026 (proposal `docs/delegation/spanish-language-proposal.md`).
**Progress file:** `docs/delegation/spanish-progress.md`.
**Queue:** `npx tsx scripts/es-queue.ts` emits manifests of records lacking Spanish.
**Branch:** the lane works on `release/spanish` until the founder merges it to `main`; it runs in parallel with the `french` lane (`docs/agents/lanes/french.md`).

## What this lane does

Brings Spanish (`es`) to full parity with Arabic, English, Urdu and French: `i18n/es.yaml`, `content/es/<class>/<slug>.md`, `label.es`/`summary.es` in `data/`, and `es` fields in the per-language datasets (`edu/`, `kids/`, `tour/`, `cards/`).

## Pivot policy (from the proposal)

- General content: translate from **English** (`source_lang: en`).
- Sacred and fiqh classes (`passage`, `practice`, `question`, dua and hadith content): translate from **Arabic** (`source_lang: ar`).
- `translation_of` still names the Arabic original where the chain is ar → en → es.
- Spanish is never translated from French.

## Working beside the French lane

- Never edit a French file: `i18n/fr.yaml`, `content/fr/`, `docs/agents/lanes/french.md`, `docs/delegation/french-progress.md`, `scripts/fr-queue.ts`.
- `release/french` is merged into `release/spanish` (one way, by pull request) before each Spanish pull request and whenever French lands a batch.
- Where a line lists the languages, `es` is appended after `fr` and nothing else on the line changes.
- On a shared `data/` record each lane adds only its own key (`label.fr`, `label.es`); a conflict is resolved by keeping both.

## Rules that apply

- `AGENTS.md`, `docs/language.md`, `docs/agents/pipeline.md` (workers draft, `check-packet.ts` gates, only the lander merges, three-way merge before every push).
- Frontmatter: `lang: es`, `source_lang: en|ar`, `translators: ["<agent>, draft translation"]`, `provenance` block (`generated_by`, `model`, `run`, `source`); `status.review: published` is allowed once sources are cited (dec-20261115-286).
- Preserve `[[id|label]]` wiki-links (translate the label, never the id), `{cite:…}` markers verbatim, `(needs_source…)` markers verbatim, code and HTML untouched. No typed honorifics. Qur'an text is never typed: `[[passage/quran-…]]` references stay as they are. The Arabic-parenthesis isolate rule does not apply to Spanish text.
- Spanish style: warm, precise, neutral docent — the same voice as English, in neutral international Spanish. `Corán` for Qur'an, `La Meca`, `Medina`, `el Profeta`, `hadiz`/`hadices`, `sura`, `aleya`, `Compañeros` for the Companions.
- YAML: Spanish has no apostrophe problem, but a value with `: ` or a leading special character still needs quotes, and `{n}`/`{url}`/`{title}` placeholders stay verbatim.

## Batch order

0. `i18n/es.yaml` — the whole of `i18n/en.yaml` was translated at lane opening (see the progress file for the check that was run). Batch 0 from now on is upkeep: `npx tsx scripts/es-queue.ts i18n` lists any top-level section added to `i18n/en.yaml` since; `ui()` backfills a missing key from English meanwhile.
1. Per-language datasets: `edu/*.yaml`, `kids/*.yaml`, `tour/*.yaml`, `cards/**` — add `es` fields to every record (loaders treat `es` as optional with an `en` → `ar` fallback).
2. Spine classes in `content/`: `person`, `event`, `place`, `work`, `concept`, `building`, `object` — packets of ≤ 500 files, translated from `content/en/` (from `content/ar/` for the sacred/fiqh classes).
3. Remaining classes in `content/`; `data/*.yaml` `label.es`/`summary.es` in large batches (labels are short).
4. When `label.es`/`summary.es` coverage is complete: add `es` to `PUBLISHED_LANGS` in `scripts/lib.ts`, tighten the localized schema in `scripts/gen-schema.ts` to require `es`, flip the strict dataset loaders (`edu.ts`, `where.ts`, `homework.ts`, `packs.ts`, `topics.ts`, `courses.ts`, `detective.ts`, `dilemmas.ts`, `story-cards.ts`, `tour.ts`) to require `es`, and update `docs/status.md` and the outreach claim files. Not before.

## What stays loose until batch 4

- `PUBLISHED_LANGS` in `scripts/lib.ts` stays `["ar","en","ur"]`: it drives the parity requirements of `scripts/validate.ts` (leveled sections, quizzes, worksheets, alt text). Only `LANGS` has `es`.
- `es` is not in any `required:` list of `scripts/gen-schema.ts`.
- Corpus assertions in the tests stay at the published set; only fixture-style tests include `es`.

## Gaps recorded at lane opening

- `content/es/`: no files. Entity pages under `/es/` show the Spanish chrome with English (then Arabic) prose.
- `data/*.yaml`: no `label.es`/`summary.es`; `labelOf` falls back es → en → ar.
- Datasets (`edu/`, `kids/`, `tour/`, `cards/`): no `es` fields.
- Spanish Qur'an translation for passage pages: no source chosen or registered in `scripts/harvest/quran/translations.py`. The choice of translation and its licence is pending the founder's confirmation.
- No Spanish search-synonym file: Spanish search uses the English synonym map (Latin script), by design.
