# Proposal: Turkish and Indonesian as the museum's sixth and seventh languages

Status: **approved by the founder on 22 November 2026 (in chat, "megaplan" instruction) and applied to `AGENTS.md` and `docs/language.md`.**

Risk rating: **`submission-impacting`** (`docs/ai-change-gates.md` section 3): it changes which languages the site builds and serves. Any outreach claim that lists the museum's languages is re-read against the live site before reuse, and no claim states seven languages until `/tr/` and `/id/` actually serve (truth-in-claims rule).

Branch: all work lands on `release/turki-indo` (founder instruction for this session). Pull requests from the session's feature branch are opened and merged into `release/turki-indo` at each checkpoint; nothing is raised against `main`.

## 1. What is proposed

Turkish (`tr`) and Indonesian (`id`) join Arabic, English, Urdu, French and Spanish as languages of the museum, on the same staged path as French and Spanish (`docs/delegation/spanish-language-proposal.md`):

- UI strings in `i18n/tr.yaml` and `i18n/id.yaml` (the English backfill in `ui()` covers any key not yet translated).
- Prose in `content/tr/<class>/<slug>.md` and `content/id/<class>/<slug>.md` for every entity that has prose.
- `label.tr`/`summary.tr` and `label.id`/`summary.id` on every `data/` record.
- Turkish and Indonesian fields in every per-language dataset (`edu/`, `kids/`, `tour/`, `cards/`).
- `pagefind-tr` and `pagefind-id` search indexes, `/tr/**` and `/id/**` routes, sitemap and hreflang alternates, R2 publish targets, the site Worker's language routing, and the root-page browser-language redirect in `site/public/shell/shell.js`.

The language cycle in the switcher becomes ar → en → ur → fr → es → tr → id → ar.

## 2. Pivot policy

By founder instruction (22 November 2026) both languages are translated **from Arabic** (`source_lang: ar`), every class — the museum's canonical text, matching the sacred/fiqh pivot rule already used for French and Spanish. `translation_of` names the Arabic original.

## 3. Production method

Bulk translation runs through **Azure AI Document Translation** (REST API `2026-03-01`, asynchronous batch, S1 pay-as-you-go), founder-approved and founder-funded; the secrets stay outside the repository as environment variables and are never committed.

- Word files are built by the existing `scripts/local-mt/` machinery — the same plain-text docx format used for the Spanish and French Google rounds (`docs/engineering/63-translation-by-document-files.md`): a `#### n ####` marker paragraph per record, protected spans hidden behind numeric markers, and `[[id|label]]` links carried as Word hyperlinks whose anchors hold the record ids. This marker scheme is used instead of any new one because its survival through a document translator is already measured (96–99% intact).
- Instead of a browser, `scripts/local-mt/azure_round.py` uploads each docx to Azure Blob Storage, submits an async batch job (Arabic → `tr` and Arabic → `id` in one batch, ≤1,000 files / ≤250 MB / ≤40 MB per file per the service limits), polls, downloads the translated files and deletes the cloud copies.
- Import reuses `import_gt.py`'s split-and-check pipeline, extended to `tr`/`id`: every record must pass the same checks as the local translator before it is written (`translators: ["azure-document-translation, machine translation"]`, `provenance.model: azure-ai-translator-nmt`, `run: <batch-id>`); a record that fails is left untranslated and logged, never written broken.
- `data_strings.py` (extended to `--src ar` and `tr`/`id`) fills `label`/`summary` and other language blocks in `data/` and the per-language datasets, including `i18n/*.yaml` leaf strings.
- A first pilot file (~100 records) runs end-to-end before any bulk submission; the estimated spend (~160–180M characters at S1 document-translation rates) is reported to the founder before the mass run.

## 4. Rules amended

- `AGENTS.md`: "English, Urdu, French and Spanish always" becomes "English, Urdu, French, Spanish, Turkish and Indonesian always". New prose, UI strings, menus, components, data language blocks, datasets and vocabulary files ship seven languages together from this approval forward; existing published content is not retroactively invalidated (golden set).
- `docs/language.md`: Turkish and Indonesian move from the phasing table into the active set; the ar-source pivot is recorded; the phasing table's "then Indonesian, Turkish" is removed.

## 5. Phased rollout

- **Phase A — infrastructure:** language registry, routing, search indexes, publish targets, workflows, `shell.js`, queue/importer tooling, `i18n/tr.yaml` and `i18n/id.yaml`.
- **Phase B — corpus:** the Azure pipeline translates prose, then `data/` language blocks, then dataset fields and `i18n/` leaf strings.
- **Phase C — strict parity:** only once the corpus has landed are `tr`/`id` added to parity requirements (`PUBLISHED_LANGS`, `scripts/gen-schema.ts` `required:` lists, strict dataset loaders) and public claims updated to seven languages.

Two safeguards hold until Phase C, same as the Spanish rollout: `PUBLISHED_LANGS` is unchanged, and dataset loaders treat `tr`/`id` as optional with `en` → `ar` fallback.

## 6. Cost

Rough estimate before the mass run: ~80–90M Arabic source characters × 2 targets ≈ 160–180M characters at S1 pay-as-you-go document-translation rates — reported to the founder in the session before bulk submission, and the pilot run measures real billing units first.
