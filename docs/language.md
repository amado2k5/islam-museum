# Language policy: Arabic first

**Decision (founder, 11 October 2026), amended (founder, 18 October 2026; founder, 18 November 2026: French joins the active set — proposal `docs/delegation/french-language-proposal.md`; founder, 18 November 2026: Spanish joins the active set — proposal `docs/delegation/spanish-language-proposal.md`).** Arabic is the museum's primary language. Arabic is written first for every entity: labels, summaries, prose, questions, exhibits, map labels, alt text, UI strings and search. Since 18 October 2026, every new piece of content, prose, UI string, menu or component also ships with an English and an Urdu translation in the same change; since 18 November 2026 it also ships with a French and a Spanish translation. Translations are drafts with a `provenance` block and follow the rules below. Other languages still come later, in the phasing table.

## What this means

- **The site's default locale is `ar`.** The root of islam.museum serves Arabic; since 19 November 2026 a visitor who arrives at the bare root `/` with JavaScript on is taken to the museum in the browser's default language when that language is English, Urdu, French or Spanish (`site/public/shell/shell.js`), and stays on Arabic for Arabic and for every other language; right-to-left is the default layout, and left-to-right is the exception added when a second language arrives. `/ar/...` remains the canonical URL form so that later languages can sit beside it without moving anything.
- **Required fields are Arabic.** `label.ar` and `summary.ar` are required on every entity; `label.en` and `summary.en` are optional until Phase 4. The validator enforces Arabic, not English.
- **Prose lives in `content/ar/` first.** English prose in `content/en/` and Urdu prose in `content/ur/` are translations from Arabic, with `translation_of: ar@<hash>`. No entity is written in English, Urdu, French or Spanish first. Since 18 October 2026, a change that adds new prose, UI strings, menus or components also adds their English and Urdu translations, and since 18 November 2026 their French translation in `content/fr/` and their Spanish translation in `content/es/` (see the bullet below).
- **Every new change ships English, Urdu, French and Spanish.** Any agent, from any vendor, that adds prose, a UI string, a menu item or a component adds the matching English, Urdu, French and Spanish translation in the same commit, as drafts with a `provenance` block (`status.review: draft`). Arabic is written first; if a translation cannot be made in the same change, the change says so in its commit message and in the progress file, and the missing translation is recorded as a gap.
- **French pivot.** French is translated from English (`source_lang: en`) for general content, and from Arabic (`source_lang: ar`) for sacred and fiqh classes (`passage`, `practice`, `question`, dua and hadith content); `translation_of` still names the Arabic original where the chain is ar → en → fr.
- **Spanish pivot.** Spanish follows the same policy: translated from English (`source_lang: en`) for general content, and from Arabic (`source_lang: ar`) for sacred and fiqh classes (`passage`, `practice`, `question`, dua and hadith content); `translation_of` still names the Arabic original where the chain is ar → en → es. Spanish is never translated from French.
- **IDs and URLs stay ASCII.** Slugs remain transliterated Latin (`person/ibn-sina`, `event/battle-of-badr`) for stability and tooling; the visible label is Arabic. Arabic-script URL aliases can be added later through redirects.
- **Sources follow the language.** Arabic primary and classical sources (sira, hadith, tabaqat, chronicles, and reliable modern Arabic works) are the first retrieval target; English scholarship is cited where it adds something, with the Arabic text quoted and the English summarised.
- **UI strings** are authored in `i18n/ar.yaml`; `i18n/en.yaml` is translated from it later. The prompts, templates and style guide give Arabic examples first.
- **Images and maps** carry Arabic alt text and Arabic labels; English versions are produced later from the same data.
- **Search** indexes Arabic with Arabic stemming and a synonyms file for spelling variants (hamza forms, ta marbuta, diacritics) and common transliterated names typed in Latin letters.

## Arabic style (summary; full rules in `docs/style-guide.md`)

- Modern Standard Arabic, clear and warm, in the docent voice of `docs/plan/05-editorial.md`; short sentences; no colloquialism.
- Full punctuation; correct hamza and ta marbuta; diacritics only where needed to prevent misreading, and always on Qur'anic text.
- Numbers and dates in Western Arabic digits (0–9) by default for consistency with the data, with a visitor setting for Eastern Arabic-Indic digits.
- Honorifics (ﷺ, عليه السلام, رضي الله عنه) are never typed into prose; the interface renders them from data, on by default in the Arabic interface and switchable.
- Transliteration tables for non-Arabic names (Persian, Turkish, Urdu, Malay, European) follow the forms used in the Arabic reference works cited, recorded once in `i18n/glossary.yaml`.

## Phasing

| Phase | Languages |
|---|---|
| 0–3 | Arabic only: all content, UI, images, maps, questions, exhibits, search |
| 4 | English translated from Arabic (UI first, then spine entities, then the rest); then Urdu, French and Spanish (French and Spanish approved 18 November 2026, en pivot / ar pivot for sacred classes); then Indonesian, Turkish |
| 5+ | Bengali, Persian, Swahili, Chinese, German, Malay, Hausa, Bosnian |

## Changes to existing scaffold (for the implementing session)

- `site/astro.config.mjs`: `defaultLocale: "ar"`, locales `["ar"]` for now; the root page serves Arabic directly.
- Validator: require `label.ar` and `summary.ar`; drop the English requirement.
- Templates and prompts: Arabic sections first; English steps marked "Phase 4".
- Existing English prose in `content/en/` is kept. Since 18 October 2026 it is extended: every Arabic prose file gets an English translation, and new Arabic prose gets English and Urdu translations in the same change. Arabic prose is still written for every entity that has only English.
