# spanish lane — progress

Proposal: `docs/delegation/spanish-language-proposal.md` (approved 18 Nov 2026). Lane: `docs/agents/lanes/spanish.md`.
Branch: `release/spanish` (cut from `main` at 3fb57fcf90, then `release/french` merged in by pull request #7411). Nothing here is on `main` and nothing is deployed.

## 2026-11-18 — infrastructure and interface landed (session 1)

Done:
- `AGENTS.md`: five-language rule (Arabic first; English, Urdu, French and Spanish always for new content).
- `docs/language.md`: Spanish active; pivot policy (en → es general, ar → es sacred/fiqh, never from French); Spanish removed from the "5+" row of the phasing table.
- Registry: `site/src/lib/i18n.ts` (`LANGS`, `ALL_LANGS`, `Lang`, `OG_LOCALE.es = "es_ES"`, `NUM_LOCALE.es = "es-ES"`, cycle ar → en → ur → fr → es → ar; `ARABIC_SCRIPT` unchanged), `site/astro.config.mjs` (locales, sitemap language map, noindex pattern).
- Worker and deploy: `workers/site/src/route.js` (`LANGS`, bare `/es` redirect, the Spanish 404 key through `notFoundKey`, `pagefind-es` in `R2_DATA_DIRS`), `workers/site/wrangler.production.toml` (`/es`, `/es/*`, `/pagefind-es/*` in both `run_worker_first` lists), `workers/r2-sync/batch/publish.mjs` (`pagefind-es` and `es` targets), `site/package.json` (the `pagefind-es` step), `.github/workflows/deploy-env.yml` (assets exclude list and the smoke-test paths).
- `site/src/lib/*`, components and pages: every place French was handled as an optional language handles Spanish the same way, with an `en` → `ar` fallback (`labelOf`, `traditionLabel`, `themeLabel`, `factText`, `Landing.astro` `FALLBACK`, `tour.ts`, `where.ts`, `homework.ts`, `kids.ts`, the seerah page, the course pages' alternates, the 404 alternates).
- Dates: Spanish month names, Hijri month names, era labels (`d. C.`, `a. C.`, `H`, `a. H.`) and the "entre … y …" interval in `site/src/lib/dates.ts`.
- Honorific rendering (`site/src/lib/markdown.ts`): the Spanish pattern for the Prophet, the Spanish Companion formula, the Spanish list of other prophets and the Spanish name boundary. The UI renders these; nothing is typed in content.
- Search: `pagefind-es` build added; Spanish uses the English synonym map (`synLang`, `scripts/search-canon.ts`, `scripts/export-api.ts`). No Spanish synonym file exists, by design.
- `scripts/lib.ts`: `LANGS` has `es`. **`PUBLISHED_LANGS` is unchanged (`["ar","en","ur"]`).** `scripts/gen-schema.ts`: `es` is an allowed property of the localized objects and is in no `required:` list.
- `i18n/es.yaml`: the whole of `i18n/en.yaml` translated — 152 of 152 top-level sections, 6,421 values. Produced by AI agents (Claude Sonnet, eight parallel chunks, each translating directly, no machine-translation service), assembled and checked by the lead agent. **No human has read it.**
- `docs/agents/lanes/spanish.md`, `scripts/es-queue.ts` (`prose|labels|i18n|stats`), lane registered in `docs/agents/lanes.md`.
- Fixture tests: `paged-alternates.test.ts` (fixture map and expected alternates), `check-packet.test.ts`, `messengers-tree.test.ts`, `place-map.test.ts`, `browser-slugs.test.ts` include `es`. Corpus assertions were left at the published set.

Checks run on 18 Nov 2026, on the feature branch:
- `i18n/es.yaml` parses with the site's YAML parser; its key paths equal `i18n/en.yaml`'s in the same order; every `{placeholder}` and HTML-like tag matches the English value; no honorific or Qur'an marker was introduced. Two values are identical to English on purpose (`cite.citation_text`, a transliteration in `hudud.viz.terms`).
- `npm run validate`: exit 0 — "validated 81027 entities, 104688 prose files: 0 errors, 5343 warnings".
- `npx vitest run` on `edu.test.ts`, `place-map.test.ts`, `paged-alternates.test.ts`, `check-packet.test.ts`, `messengers-tree.test.ts`, `browser-slugs.test.ts`: all pass.
- `node --test workers/site/test/*.mjs`: 16 of 16 pass.
- `npx tsx scripts/es-queue.ts stats`: `prose: 0/34836 es files · i18n sections: 152/152`.
- Dev server: `/es/` renders with `lang="es"`, `dir="ltr"`, `og:locale` `es_ES`, the Spanish menu, the switcher `AR | EN | UR | FR | ES` and an `es` hreflang alternate; `/es/search/` renders in Spanish.

Checks that failed, and why:
- `scripts/pipeline.test.ts` (1 test) and `scripts/tour.test.ts` (3 tests) fail on **French** assertions that came with `release/french`: they expect French prose for `person/ibn-sina` and French fields in the tour datasets, which do not exist yet. These two files were not edited here and Spanish was not added to them. They are the French lane's to settle.
- `npx tsc --noEmit` in `site/` is not clean on this branch (125 errors outside the duplicate-declaration noise). The ones on lines this change touches are of the kind already present for French (`Record<Lang, …>` tables that lack `fr`, optional-language indexing). No baseline run was made on `release/french`, so the count is not attributed.

Checks not run:
- The full `npm test`, `astro check`, `npm run build` (and therefore the real `pagefind-es` index, the sitemap and the link check) were not run in this session.
- No UAT or production deploy; `/es/` is not served anywhere public.

## Explicit gaps

- `content/es/`: no files (the directory does not exist). Entity pages under `/es/` show Spanish chrome around English, then Arabic, prose.
- `data/*.yaml`: no `label.es` / `summary.es`.
- Datasets (`edu/`, `kids/`, `tour/`, `cards/`): no `es` fields; the strict loaders still require only ar, en and ur.
- Spanish Qur'an translation for passage pages: no source chosen or registered (`scripts/harvest/quran/translations.py` takes English and Urdu only). The translation and its licence are pending the founder's confirmation.
- `i18n/es.yaml` term choices that a Spanish-speaking reader should review: `Compañeros`, `aleya`/`sura`, `fetua`, `Hégira`/`hijri`, `chií`, `jariyíes`, `Ala infantil` for the Kids' Wing, the school-grade wording (`{g}.º curso`, `Primaria`/`Secundaria`) in the education strings, and the first-person agent entries of the Backstage section. Transliterated names were normalised to the English forms (`Jibril`, `Khaybar`, `Yathrib`, `Thamud`, `Thawr`, `Hajj`, `juz`, `jinn`).
- `courses.lang_names` has no `es` key in any language file (it is keyed by the course's language of instruction); a Spanish-language course would show the code `es`.
- Public numbers: `site/src/lib/numbers.ts` counts record pages as records × `LANGS.length`, so the page figure printed on the site rises by one language's worth when this is built, as it did for French. Those pages exist, but they carry English prose inside the Spanish frame. No text that states a language count was changed.
- Outreach files (`docs/outreach/unesco-nomination-dossier.md`, `docs/outreach/dpga-evidence-map.md`) and `docs/status.md`: untouched, by the approved proposal (section 7). They are updated when `/es/` actually serves.

## Findings outside this lane's scope (reported, not fixed)

- `scripts/fr-queue.ts` does not run: it imports `repoPath` from `scripts/lib.ts`, which exports no such name. `scripts/es-queue.ts` was written with its own helper; the French file was left alone.
- `site/src/lib/markdown.ts`: `OTHER_PROPHETS` and `NAME_END` have no `fr` entry, so `OTHER_AFTER.fr` is undefined and `notMuhammad("fr", …)` would throw on a French page whose prose matches the French pattern for the Prophet. Spanish has its own entries; the French ones were not added here.
- `CANARY.md` has no entry for the French change; the Spanish entry opens v2.24.0.

## Outstanding (next batches)

- Batch 1–3: dataset `es` fields; `content/es/` corpus (34,836 English prose files to translate, by `es-queue.ts stats`); `label.es` / `summary.es` on `data/`.
- Spanish Qur'an translation source.
- Batch 4: `PUBLISHED_LANGS`, schema requirement, strict loaders; status, site copy and outreach claims to five languages.
- Verification still owed: full `npm test`, `astro check`, build with `pagefind-es`, UAT.
- Keep merging `release/french` into `release/spanish` as French lands batches.
