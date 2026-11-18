# Lane: french — French as the fourth language

**Status:** open, approved by the founder 18 November 2026 (proposal `docs/delegation/french-language-proposal.md`).
**Progress file:** `docs/delegation/french-progress.md`.
**Queue:** `npx tsx scripts/fr-queue.ts` emits manifests of records lacking French.

## What this lane does

Brings French (`fr`) to full parity with Arabic, English and Urdu: `i18n/fr.yaml`, `content/fr/<class>/<slug>.md`, `label.fr`/`summary.fr` in `data/`, and `fr` fields in the per-language datasets (`edu/`, `kids/`, `tour/`, `cards/`).

## Pivot policy (from the proposal)

- General content: translate from **English** (`source_lang: en`).
- Sacred and fiqh classes (`passage`, `practice`, `question`, dua and hadith content): translate from **Arabic** (`source_lang: ar`).
- `translation_of` still names the Arabic original where the chain is ar → en → fr.

## Rules that apply

- `AGENTS.md`, `docs/language.md`, `docs/agents/pipeline.md` (workers draft, `check-packet.ts` gates, only the lander writes to `main`, three-way merge before every push).
- Frontmatter: `lang: fr`, `source_lang: en|ar`, `translators: ["<agent>, draft translation"]`, `provenance` block (`generated_by`, `model`, `run`, `source`); `status.review: published` is allowed once sources are cited (dec-20261115-286).
- Preserve `[[id|label]]` wiki-links (translate the label, never the id), `{cite:…}` markers verbatim, `(needs_source…)` markers verbatim, code and HTML untouched. No typed honorifics. The Arabic-parenthesis isolate rule does not apply to French text.
- French style: warm, precise, neutral docent — the same voice as English. `Coran` for Qur'an, `La Mecque`/`Médine` with the article where French requires it.

## Batch order

0. `i18n/fr.yaml` — finish translating the remaining sections of `i18n/en.yaml` (the core chrome is already translated; `ui()` backfills the rest from English meanwhile). Sections done: header scalars, `nav`, `a11y`, `landing`, `wings`, `hall`, `entity`, `depth`, `status`, `claim` (start). Every top-level block after `claim:` still needs translation.
1. Per-language datasets: `edu/*.yaml`, `kids/*.yaml`, `tour/*.yaml`, `cards/**` — add `fr` fields to every record (loaders currently treat `fr` as optional with `en` fallback).
2. Spine classes in `content/`: `person`, `event`, `place`, `work`, `concept`, `building`, `object` — packets of ≤ 500 files, translated from `content/en/` (from `content/ar/` for the sacred/fiqh classes).
3. Remaining classes in `content/`; `data/*.yaml` `label.fr`/`summary.fr` in large batches (labels are short).
4. When `label.fr`/`summary.fr` coverage is complete: tighten `localized3` in `scripts/gen-schema.ts` to require `fr`, flip the strict dataset loaders (`edu.ts`, `where.ts`, `homework.ts`, `packs.ts`, `topics.ts`, `courses.ts`, `detective.ts`, `dilemmas.ts`, `story-cards.ts`, `tour.ts`) to require `fr`, and update `docs/status.md`.

## Gaps recorded at lane opening

- `i18n/fr.yaml`: ~268 of ~7,200 lines translated (the visible chrome); the remainder backfills from English until batch 0 lands.
- `content/fr/`: three records (`event/hijra`, `person/ibrahim`, `building/bayt-al-hikma`) created for the edu fixture test.
- `data/*.yaml`: no `label.fr`/`summary.fr` yet; `labelOf` falls back fr → en → ar.
- French Qur'an translation (e.g. Hamidullah): not yet registered in `scripts/harvest/quran/translations.py`; needed before passage pages show a French tafsir.
