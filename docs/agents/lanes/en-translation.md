# Lane: en-translation — English publication and translation

**Scope:** publish the site bilingually (Arabic canonical, English progressive) and translate rendered content into English.

**Progress file:** `docs/delegation/en-translation-progress.md`
**Branch pattern:** `i18n/en-<agent>`
**Stubs file:** none (this lane adds no stubs; it only translates what exists)

## What is on main already

- English is a published locale: `LANGS = ["ar","en"]` in `site/src/lib/i18n.ts`, `PUBLISHED_LANGS = ["ar","en"]` in `scripts/lib.ts`, `locales: ["ar","en"]` in `site/astro.config.mjs`, sitemap `en` → `en`.
- Per-language Pagefind indexes (`pagefind-ar`, `pagefind-en` via `--glob "<lang>/**/*.html"`) and per-language synonyms `search-synonyms.<lang>.json` built by `scripts/derive.ts`.
- `i18n/en.yaml` has key parity with `i18n/ar.yaml` (enforced by test).
- `llms.txt` lists entries bilingually.
- `EntityLayout` falls back en→ar prose with a "not yet available in English" notice.
- `label.en` and `summary.en` filled for every data entity; exhibit room titles/bodies, `perspectives[].summary`, stub labels and `map.note` are bilingual.

## What remains

- `content/en/` prose: translate `content/ar/<class>/<slug>.md` files that have no `content/en/` twin (~788 at lane start). Order: exhibits (done), events, people, groups, concepts, places, polities, works, practices, objects, buildings, journeys, sources.
- Batch size: at most 25 files per commit batch, per AGENTS.md.

## Rules for the translation

- Frontmatter: keep `id`; set `lang: en`, `source_lang: ar`, and `translators: ["<agent> (<model>), draft translation"]`.
- Preserve every `[[class/slug|label]]` link (translate only the label after `|`), every `{cite:id locator}` (keep the cite id verbatim; locators may be localised, e.g. `ص` → `p.`), every `:::perspectives` block and the Sunni-first ordering, and every `###`/`##` heading structure.
- Docent voice: warm, precise, neutral; attribute judgements; never add facts or dates; no honorifics; never type Qur'an text — keep `[[passage/quran-…]]` links.
- Translate rendered text only: prose, labels, summaries, room titles/bodies, perspective summaries. Backend-only Arabic fields (relation notes, provenance strings, isnaads inside data not rendered) stay as they are.
- Qur'an passage pages stay Arabic; do not add English scripture text.
- Validation: `npm run validate && npm test && npm run build` must stay green; the untranslated-prose notice is acceptable for files not yet done.

## Overlap

Do not edit `data/` facts — translation only. If an Arabic source file changes upstream, update the English twin. Do not touch other lanes' Arabic content; add English alongside.
