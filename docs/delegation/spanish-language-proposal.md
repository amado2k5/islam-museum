# Proposal: Spanish as the museum's fifth language

Status: **approved by the founder on 18 November 2026 (in chat), including the request in section 7 to leave the outreach claim files untouched until `/es/` serves.**

Risk rating: **`submission-impacting`** (`docs/ai-change-gates.md` section 3): it changes which languages the site builds and serves. See section 7.

Branch: all work lands on `release/spanish` (founder instruction for this session), which already carries the French work from `release/french`. Nothing in this proposal is raised against or merged into `main`.

## 1. What is proposed

Spanish (`es`) joins Arabic, English, Urdu and French as a language of the museum, on the same staged path as French (`docs/delegation/french-language-proposal.md`):

- UI strings in `i18n/es.yaml`, translated from `i18n/en.yaml` with keys and structure preserved (the English backfill in `ui()` covers any key not yet translated).
- Prose in `content/es/<class>/<slug>.md` for every entity that has prose.
- `label.es` and `summary.es` on every `data/` record.
- Spanish fields in every per-language dataset (`edu/`, `kids/`, `tour/`, `cards/`).
- A `pagefind-es` search index, `/es/**` routes, sitemap and hreflang alternates, R2 publish targets and the site Worker's language routing.

The language cycle in the switcher becomes ar → en → ur → fr → es → ar.

## 2. Pivot policy

- General content is translated from **English** (`source_lang: en`).
- Sacred and fiqh classes (`passage`, `practice`, `question`, dua and hadith content) are translated from **Arabic** (`source_lang: ar`).
- `translation_of` still names the Arabic original where the chain is ar → en → es, with `source_lang` recording the actual pivot.

## 3. Phased rollout

**Phase A — infrastructure (this session).**

- The language registry, routing, search index, publish targets and workflows listed in section 5.
- `i18n/es.yaml`, translated in the order the site needs it: header scalars, `nav`, `a11y`, `landing`, `wings`, `hall`, `entity`, `depth`, `status`, `map` (including the whole `map.viewer` block), then `figure`, `licenses`, `ids`, `learn`, `explore`, `search`, `not_found`, `footer`, the `kids`, `edu` and `tour` sections, and the rest. Whatever is not reached is listed as a gap in the progress file.
- The lane document, the queue script and the progress file.

**Phase B — corpus (the `spanish` lane, through the packet pipeline).** Dataset `es` fields; `content/es/` for the spine classes, then the rest; `label.es` and `summary.es` on `data/`.

**Phase C — strict parity.** Only when the Spanish corpus has landed: `es` is added to the parity requirements, the dataset loaders are flipped to require it, and `docs/status.md` and the site's own copy may then state five languages.

Two safeguards hold until Phase C:

- `PUBLISHED_LANGS` in `scripts/lib.ts` stays `["ar","en","ur"]`. It drives the parity requirements in `scripts/validate.ts`; only `LANGS` (languages that have an `i18n/<lang>.yaml`) gains `es`.
- Dataset loaders treat `es` as optional with an `en` → `ar` fallback, as they do for `fr`. `es` is not added to `required:` in `scripts/gen-schema.ts`.

## 4. Production method

Phase A is done directly on the feature branch of this session and merged into `release/spanish` by pull request. Phase B follows the standing pipeline (`docs/agents/pipeline.md`): workers draft and verify packets, `check-packet.ts` gates them, only the lander merges. `scripts/es-queue.ts` emits the manifests of records that still lack Spanish.

## 4a. Working in parallel with the French translation

The French translation of the whole site is still in progress on `release/french` and continues while Spanish is built. The Spanish work is arranged so the two never overwrite each other:

- **French files are never edited here.** `i18n/fr.yaml`, `content/fr/`, `docs/agents/lanes/french.md`, `docs/delegation/french-progress.md` and `scripts/fr-queue.ts` belong to the French lane. Spanish reads them as a template and writes only its own files (`i18n/es.yaml`, `content/es/`, the Spanish lane documents, `scripts/es-queue.ts`).
- **Spanish translates from English and Arabic, never from French**, so it does not wait on any French batch.
- **`release/french` flows one way into `release/spanish`.** Before each Spanish pull request, and whenever French lands a batch, `release/french` is merged into `release/spanish` by pull request, with a three-way merge. Nothing from Spanish is merged into `release/french`.
- **Shared lines are kept additive.** Where a file lists the languages, `es` is appended after `fr` and nothing else on the line is changed, so a later French edit to the same file merges cleanly or conflicts in an obvious, one-line way.
- **Shared data records.** When both lanes add a label to the same `data/` record (`label.fr` and `label.es`), each adds its own key only; a conflict is resolved by keeping both keys.
- **The French staged steps are not anticipated.** Spanish does not flip any loader, schema requirement or public claim on behalf of French; French batch 4 and Spanish Phase C are separate steps.
- **Order to `main`.** `release/spanish` contains the French work, so it reaches `main` after, or together with, `release/french`, never before it.

## 5. Files touched in Phase A

New files:

- `i18n/es.yaml`
- `docs/agents/lanes/spanish.md`
- `docs/delegation/spanish-progress.md`
- `scripts/es-queue.ts`
- `content/es/…` only if a test genuinely requires Spanish fixture files (none is expected).

Edited files — every file the French change edited to add `fr` gains `es` in the same place:

- Site registry and build: `site/src/lib/i18n.ts` (`LANGS`, `ALL_LANGS`, `Lang`, `OG_LOCALE.es = "es_ES"`, `NUM_LOCALE.es = "es-ES"`, `dir: ltr`, the cycle), `site/astro.config.mjs` (locales, sitemap language map, noindex pattern), `site/package.json` (the `pagefind-es` build step).
- Site libraries, components and pages that handle `fr` as an optional language (`site/src/lib/*`, `site/src/components/Landing.astro`, pages under `site/src/pages/[lang]/`), including the search page, where Spanish uses the English synonym map. No Spanish synonym file is created.
- Workers and deploy: `workers/site/src/route.js` (`LANGS`, bare `/es` redirect, the Spanish 404 key), `workers/site/wrangler.production.toml` (`/es`, `/es/*`, `pagefind-es/*` in `run_worker_first`), `workers/r2-sync/batch/publish.mjs` (the `pagefind-es` target and the `es` HTML), and the assets exclude list in `.github/workflows/deploy-env.yml` (and `validate.yml` where it lists languages).
- Scripts and tests: `scripts/lib.ts` (`LANGS` only), the scripts that list the languages, and the fixture-style tests (`paged-alternates.test.ts` gains `es` in its fixture map and its expected alternates). Corpus assertions stay at the published set.
- Rules and registers: `AGENTS.md` (the language rule becomes "Arabic first; English, Urdu, French and Spanish always" for new content), `docs/language.md` (Spanish active, pivot policy), `docs/agents/lanes.md` (a `spanish` lane row), and the documents the French change edited to name the language set.
- `CANARY.md` (the release note, in the same commit).

Not touched: `docs/status.md`, the site's About, Method, Press and Support copy, every public language count, and the reserved outreach files (`docs/outreach/unesco-nomination-dossier.md`, `docs/outreach/dpga-evidence-map.md`).

## 6. Rules amended

- `AGENTS.md`: new prose, UI strings, menus and components ship with `content/es/` and `i18n/es.yaml` alongside en, ur and fr from the approval forward. Existing published content is not retroactively invalidated (golden set).
- `docs/language.md`: Spanish moves from the "5+" row of the phasing table into the active set, with the pivot policy of section 2.

Both amendments live on `release/spanish` and bind other agents only once that branch reaches `main`.

## 7. Submission note

The DPGA application and the UNESCO dossier state which languages are published. This change makes the site build `/es/` pages, so it is `submission-impacting`. Section 3 of the change gates asks for the claims register and the evidence map to be updated in the same commit; this proposal asks instead that they stay untouched for now, because no Spanish page is served until `release/spanish` is merged and deployed, and a claim of Spanish before then would be untrue. They are updated when `/es/` actually serves. Until then no document, site text or public claim counts Spanish.

## 8. Known gaps at approval

- A Spanish translation of the Qur'an for passage pages: no source is chosen or registered. The choice of translation and its licence is pending the founder's confirmation (French has the same open item).
- `content/es/`, `label.es`/`summary.es` and the dataset `es` fields do not exist yet; pages fall back es → en → ar.
- The full `npm run validate`, `astro check` and the complete build may be left to the lane's verification step; the progress file will say exactly which checks ran.
