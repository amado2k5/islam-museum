# Language policy: Arabic first

**Decision (founder, 11 October 2026).** Arabic is the museum's primary language. Phase 1 is built entirely in Arabic: every entity's labels, summaries, prose, questions, exhibits, map labels, alt text, UI strings and search. English and other languages come later as translations of a finished Arabic museum, not in parallel with it.

## What this means

- **The site's default locale is `ar`.** The root of islam.museum serves Arabic; right-to-left is the default layout, and left-to-right is the exception added when a second language arrives. `/ar/...` remains the canonical URL form so that later languages can sit beside it without moving anything.
- **Required fields are Arabic.** `label.ar` and `summary.ar` are required on every entity; `label.en` and `summary.en` are optional until Phase 4. The validator enforces Arabic, not English.
- **Prose lives in `content/ar/` first.** `content/en/` is created only in Phase 4 by translation from Arabic, with `translation_of: ar@<hash>`. No entity is written in English first.
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
| 4 | English translated from Arabic (UI first, then spine entities, then the rest); then Urdu, Indonesian, Turkish, French |
| 5+ | Spanish, Bengali, Persian, Swahili, Chinese, German, Malay, Hausa, Bosnian |

## Changes to existing scaffold (for the implementing session)

- `site/astro.config.mjs`: `defaultLocale: "ar"`, locales `["ar"]` for now; the root page serves Arabic directly.
- Validator: require `label.ar` and `summary.ar`; drop the English requirement.
- Templates and prompts: Arabic sections first; English steps marked "Phase 4".
- Existing English prose in `content/en/` is kept but is not extended; Arabic prose is written for every entity that has only English.
