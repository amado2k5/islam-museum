# Proposal: French as the museum's fourth language

Status: **approved by the founder on 18 November 2026 and applied to `AGENTS.md` and `docs/language.md`.**

## 1. What is proposed

French (`fr`) joins Arabic, English and Urdu as a language of the museum, at full parity:

- UI strings in `i18n/fr.yaml` (translated from `i18n/en.yaml`; the English backfill in `ui()` covers any key not yet translated).
- Prose in `content/fr/<class>/<slug>.md` for every entity that has prose.
- `label.fr` and `summary.fr` on every `data/` record.
- French fields in every per-language dataset (`edu/`, `kids/`, `tour/`, `cards/`).
- A `pagefind-fr` search index, `/fr/**` routes, sitemap and hreflang alternates, R2 publish targets and the site Worker's language routing.

## 2. Pivot policy

- General content is translated from **English** (`source_lang: en`), the highest-quality pivot for French.
- Sacred and fiqh classes (`passage`, `practice`, `question`, dua and hadith content) are translated from **Arabic** (`source_lang: ar`).
- `translation_of` still names the Arabic original where the chain is ar → en → fr, with `source_lang` recording the actual pivot.

## 3. Production method

Translations are produced by agent-driven packet batches through the standing pipeline (`docs/agents/pipeline.md`): workers draft and verify packets, `check-packet.ts` gates them, only the lander writes to `main`. A `french` lane document defines the batch order (spine classes first) and the queue script (`scripts/fr-queue.ts`) emits manifests of records lacking French.

## 4. Rules amended

- `AGENTS.md`: "Arabic first, English and Urdu always" becomes "Arabic first; English, Urdu and French always". New prose, UI strings, menus and components ship with `content/fr/` / `i18n/fr.yaml` alongside en and ur from this approval forward. Existing published content is not retroactively invalidated (golden set).
- `docs/language.md`: French moved from the phasing table into the active set; the pivot policy above is recorded.

## 5. Submission note

Any DPGA/UNESCO or public claim that lists the museum's languages must be re-read against the live site before it is reused (truth-in-claims rule): French pages count only once they are built and published.
