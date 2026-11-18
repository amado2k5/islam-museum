# Megaplan: add French as the fourth language of islam.museum

Bring the site to full four-language parity (ar, en, ur, fr): wire `fr` through every code path, translate the UI and all content/data/datasets via agent-driven packet batches (English pivot; Arabic pivot for sacred/fiqh classes), and extend deployment, search, and validation — under a founder-approved proposal.

## Context and decisions (confirmed with user)

- Founder approval granted; the change includes the required written proposal and amendments to `AGENTS.md` / `docs/language.md`.
- Scope = **full parity**: UI, `content/fr/**` (~35k files), `data/*.yaml` `label.fr`/`summary.fr` (~81k files), edu/kids/tour/cards datasets, search, sitemap, deploy.
- Translations produced by **agent-driven batches** through the existing packet pipeline (workers draft, lander writes to `main`, `check-packet.ts` gates).
- Pivot language: **English** for general content; **Arabic** for sacred/fiqh classes (`passage`, `practice`, `question`, `fatwa`-like content, `dua`, `hadith` passages).
- French is LTR, uses Western digits, needs no script/direction work. Schema `$defs/localized` already accepts any 2-letter key, so `fr` needs no schema change.
- Per dec-20261115-286, machine translations with a `provenance` block and cited sources may ship as `status.review: published`.

## Phase 0 — Proposal and rule amendments

1. Write the proposal doc per `docs/ai-change-gates.md` (e.g. `docs/delegation/french-language-proposal.md`) recording: scope, pivot policy, phased rollout, label submission-impacting if DPGA/UNESCO filings mention language counts (flag to founder).
2. Amend `AGENTS.md`: "Arabic first, English and Urdu always" → "Arabic first, English, Urdu and French always"; add `content/fr/` and `i18n/fr.yaml` to the rule text; record decision record id.
3. Amend `docs/language.md` phasing table: move French into the active set; state the pivot policy (fr from `en`, from `ar` for sacred/fiqh classes) and that new changes ship four translations.

## Phase 1 — Code infrastructure (this session, finite)

### Core language registry
- `site/src/lib/i18n.ts`: `LANGS`/`ALL_LANGS` → `["ar","en","ur","fr"]`; `Lang` type; `OG_LOCALE.fr = "fr_FR"`; `NUM_LOCALE.fr = "fr-FR"`; `ARABIC_SCRIPT` unchanged; `nextLang` cycle becomes ar→en→ur→fr; review `other()` semantics (still returns ar↔en — decide whether `other` should return `ar` for fr or be retired; keep behaviour, add comment).
- `site/astro.config.mjs`: `locales: ["ar","en","ur","fr"]` (both the i18n block and the sitemap filter regex `/^\/(ar|en|ur|fr)\/.../`).

### `i18n/fr.yaml` (new, ~7,200 lines)
- Translate from `i18n/en.yaml`; `dir: ltr`, `lang_name: Français`, French `tagline`, all nav/a11y/footer/edu/kids/class/theme keys. `ui()` already backfills missing keys from English, so the file can land complete or partial.
- Update `switch_to` semantics: the switcher in `BaseLayout.astro` iterates `LANGS` and needs no code change; verify `i18n/*.yaml` `switch_to`/`lang_name` strings still make sense (they label the site name, not the menu).
- `i18n/glossary.yaml`: add French transliteration/name forms where the file carries per-language entries.

### Worker / deploy plumbing (founder hosting split rule)
- `workers/site/src/route.js`: `LANGS` → `["ar","en","ur","fr"]`; add `"/fr"` to the bare-lang redirect special case; `notFoundKey` works automatically.
- `workers/site/wrangler.production.toml`: add `"/fr"`, `"/fr/*"`, `"/pagefind-fr/*"` to both `run_worker_first` lists.
- `workers/r2-sync/batch/publish.mjs`: add `{ dir: "pagefind-fr", … }` to TARGETS and `{ dir: "fr", prefix: "fr", … }` to HTML_TARGETS; update the step-keep-in-sync comment.
- `workers/r2-sync/src/index.js`: keep `ROOT_FILES`/`R2_DATA_DIRS` parity (add `pagefind-fr` wherever `pagefind-ur` appears).
- `site/package.json` build script: append `pagefind --site ../dist --glob "fr/**/*.html" --output-subdir pagefind-fr`.
- `.github/workflows/deploy-env.yml`: add `fr`/`pagefind-fr` to the assets-only step exclude list (per AGENTS.md hosting-split rule).
- `.github/workflows/validate.yml`: update the "three languages" wording/steps to four; axe route matrix include `/fr/`.

### Hardcoded language triples — replace with central `LANGS` or add `fr`
Files (from grep) to update, preferring `import { LANGS }`/shared consts over new literals:
- `site/src/lib/`: `courses.ts` (COURSE_LANGS), `detective.ts`, `dilemmas.ts`, `edu.ts` (parity throws — now require fr), `homework.ts`, `packs.ts`, `place-map.ts` (collator/DisplayNames: add `fr` → `"fr"`), `story-cards.ts`, `topics.ts`, `tour.ts` (LANGS3; note grand-tour comment — decide whether fr tour ships or stays ar/en-only, recommend publish fr too for parity), `where.ts`, `kids.ts` (honorific suffix for fr → "(peace be upon him)" French equivalent "(paix soit sur lui)"), `dates.ts` (French range phrasing "entre X et Y"), `modern.ts` (`lang === "fr"` in DisplayNames branch).
- `scripts/`: `a11y-books.ts`, `axe-scan.ts`, `check-site.ts`, `cite-check.ts`, `enrichment-queue.ts`, `export-api.ts` (inLanguage), `gen-schema.ts`, `lib.ts`, `prose-completion.ts`, `report/inventions-census.ts`, `report/prose-queue.ts`.
- `scripts/check-packet.ts`: the "ships in ar, en and ur" rule → require `ar, en, ur, fr` for **new** prose (forward-only; golden-set rule — existing triples stay valid).
- Tests: `check-packet.test.ts`, `edu.test.ts`, `tour.test.ts`, `pipeline.test.ts`, `paged-alternates.test.ts`, `place-map.test.ts`, `browser-slugs.test.ts`, `messengers-tree.test.ts`, `modern.test.ts`, `companions.test.ts` — extend fixtures/expectations to fr.
- `site/src/pages/[lang]/`: inline trilingual literals (e.g. `seerah/index.astro`, `cite/index.astro` `inLanguage`, `404.astro` alternates, lesson/course alternates) — add `fr` keys. `Record<Lang,…>` types make misses typecheck errors; run `tsc`/`astro check` to enumerate.

### Search
- Pagefind builds a `pagefind-fr` index (French stemming supported natively); search page picks index by `lang` — verify the selection code handles fr (likely `pagefind-${lang}` already).
- `search-synonyms.<lang>.json`: find the generator (scripts/derive.ts or site build) and add `search-synonyms.fr.json` (French synonym map; can start minimal).

## Phase 2 — Content pipeline (agent batches, ongoing after Phase 1)

New lane per `docs/agents/lanes.md` (e.g. `docs/agents/lanes/french.md`):

1. **Tooling**: a `scripts/fr-queue.ts` (mirroring `prose-completion.ts`/`prose-queue.ts`) that emits manifests of entities lacking `content/fr/<class>/<slug>.md` or `label.fr`, ordered: spine classes first (`person`, `event`, `place`, `work`, `concept`, `building`, `object`), then the rest.
2. **Prose packets**: workers translate `content/en/**` → `content/fr/**` (sacred/fiqh classes from `content/ar/**`), preserving wiki-links `[[id|label]]` (translate the label, keep the id), `{cite:…}` markers verbatim, code/HTML untouched; frontmatter: `lang: fr`, `source_lang: en|ar`, `translators: ["<agent>, draft translation"]`, `provenance` block. `check-packet.ts` gates each packet; lander merges; three-way merge before push.
3. **Data labels**: batch append `label.fr`/`summary.fr` to `data/*.yaml` (labels are short — large batches feasible); extend `names` arrays with French forms where they exist.
4. **Datasets**: add `fr` fields to every per-language record in `edu/*.yaml`, `kids/*.yaml`, `tour/*.yaml`, `cards/**`, `surah-maps`, `wt3` content where loaders enforce parity.
5. **Qur'an/French tafsir text**: passages stay `[[passage/quran-…]]` refs — verify the frozen translation set has a French tafsir registered in `scripts/harvest/quran/translations.py` (e.g. Hamidullah); if not, onboard it as a source.
6. Batch size ~300–500 files/packet; track progress in `docs/status.md` and a lane progress file; missing-fr is a recorded gap, never a silent skip.

## Phase 3 — Verification

- `npm run validate` (encoding, yaml, packet, extremism firewall — fr text scanned like the rest), `npm test` (vitest), `tsc`/`astro check`.
- `npm run build` (site): all `/fr/**` pages emit; `pagefind-fr` index built; sitemap includes `/fr/` URLs and hreflang alternates include `fr` + `x-default`.
- `node --test` worker route tests: `/fr` → redirect, `/fr/x/` → r2 key, `/fr/missing` → `fr/404/index.html`.
- R2 publish dry-run lists `fr` + `pagefind-fr` targets.
- `scripts/axe-scan.ts` over `/fr/` routes; Lighthouse on `/fr/index.html` vs the 0.90 gate.
- Deploy to UAT via `deploy-env.yml`, spot-check switcher, search, a sample of entity pages, then production.

## Risks / considerations

- **Build size/time**: +~50% pages and a 4th Pagefind index — expect longer builds and a larger R2 publish; monitor the first full build.
- **Missed triples**: gate = `astro check` (type errors) + a grep CI check for `"ar", "en", "ur"` literals outside the allowlist.
- **fillMissing fallback**: partial `fr` still renders (English fallback), so incremental landing is safe.
- **Honorifics/parentheses rules**: apply to fr prose (no typed honorifics; isolate rule is Arabic-script-only).
- **Public claims** (About, Press, README, counts): update only after fr pages actually ship — truth-in-claims rule.
- **check-packet forward-only**: existing ar/en/ur packets unaffected (golden set).
