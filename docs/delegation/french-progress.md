# french lane — progress

Proposal: `docs/delegation/french-language-proposal.md` (approved 18 Nov 2026). Lane: `docs/agents/lanes/french.md`.

## 2026-11-18 — infrastructure landed (session 1)

Done:
- `AGENTS.md`: four-language rule (Arabic first, English + Urdu + French always for new content).
- `docs/language.md`: French active; new content ships in all four; fr pivot policy (en→fr general, ar→fr sacred/fiqh).
- Registry: `site/src/lib/i18n.ts` (`LANGS`, `ALL_LANGS`, `Lang`, `OG_LOCALE.fr`, `NUM_LOCALE.fr`, cycle), `site/astro.config.mjs` (locales, sitemap, noindex).
- Worker/deploy: `workers/site/src/route.js` (`/fr` redirect, detection, fr 404), `workers/site/wrangler.production.toml`, `workers/r2-sync/batch/publish.mjs`, `site/package.json` (pagefind-fr), deploy workflows.
- `site/src/lib/*` + pages + scripts: hardcoded triples normalized; dataset loaders keep `fr` optional with en→ar fallback until data lands (strict re-check in batch 4).
- `i18n/fr.yaml`: created — header, `nav`, `a11y`, `landing`, `wings`, `hall`, `entity`, `depth`, `status` translated; remaining sections backfill from `en` (batch 0).
- `content/fr/`: `event/hijra`, `person/ibrahim`, `building/bayt-al-hikma` (translated from English; needed by the edu fixture test).
- Search: `pagefind-fr` build added; synonym lang selection includes fr (uses `en` synonym map — Latin script).
- `docs/agents/lanes/french.md`, `scripts/fr-queue.ts` (`prose|labels|i18n|stats`), lane registered in `lanes.md`.

Outstanding (next batches):
- Batch 0: finish `i18n/fr.yaml` (~6,900 lines remaining) — `npx tsx scripts/fr-queue.ts i18n`.
- Batch 1–3: dataset `fr` fields; `content/fr/` corpus (~35k files); `label.fr`/`summary.fr` on `data/`.
- French Qur'an translation source (Hamidullah) for passage pages.
- Batch 4: tighten `localized3` + strict loaders; update status/site claims to four languages.
- Verify: `npm run validate`, `npm test`, `astro check`, build + pagefind-fr, worker route tests, UAT.

## 2026-11-18 — batch 2

- Merged PRs #7412, #7413 into `release/french`: fr.yaml sections `claim`→`entrances` and `themes`→`foundation`.
- Branch rule for this session: PRs target `release/french` only; `main` untouched.
