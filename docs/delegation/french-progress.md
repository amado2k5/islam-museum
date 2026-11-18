# french lane — progress

Proposal: `docs/delegation/french-language-proposal.md` (approved 18 Nov 2026). Lane: `docs/agents/lanes/french.md`.

## 2026-11-18 — batch 1, kids group

- Added French to all 232 localized mappings in the ten `kids/*.yaml` files, including lesson objectives, timed teaching plans, worksheets, pilot checklists and retelling prompts. Existing locale values, IDs, statuses, provenance and non-language fields remain unchanged.
- Coverage: `kids: 10 data files, 232 localized mappings, 0 missing fr`. Focused education/kids/tour/cards tests: 4 files, 160 tests passed. Standalone card validators: lists 12, explainers 13, stories 8 decks OK.
- `edu/levels.yaml` is reserved for another PR and excluded from this batch's coverage expectations. Where other datasets mention the French levels, use `Pour les Petits`, `Pour les Explorateurs`, `Pour les Chercheurs` verbatim. No RTL/page-direction code or `scripts/fr-queue.ts` edits belong to this batch.
- Next: cards, then the remaining education datasets in the agreed order; final repository validation, tests and citation check remain outstanding.

## 2026-11-18 — batch 1, cards translation policy

- Explicitly approved for this batch: where an existing localized field quotes a verse, French uses a brief explanatory paraphrase, marked by wording such as « Le verset évoque… » or « Le passage évoque… », never a literal translation presented as Qur’an text. Existing verse references, verification notes and all other locale values remain unchanged. This is also a PR review note for the dataset rollout.
- French word-map titles originate in `cards/wordmap/seeds.yaml`; `npm run wordmap` regenerated the three JSON files and passed corpus identity. The generator drops the existing `kids: true` flag on `wa-bashshir.json`; restored that pre-existing flag after generation, without changing generator code or widening the opt-in.
- Coverage: `cards: 39 data files, 698 localized mappings, 0 missing fr`. Parsed-data comparison, after removing French, confirms all existing card data unchanged. The focused run passed 159/160 tests; its only failure was the regenerated missing kids flag. After restoring the flag, the kids suite passed all 29 tests. The other three focused suites had passed unchanged; standalone validators report lists 12, explainers 13 and stories 8 decks OK.

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

## Handover (2026-11-18, Devin → Richard)

This lane is transferred to a different agent that only sees GitHub. Read `docs/delegation/french-plan.md` (full megaplan), `docs/delegation/french-language-proposal.md` and `docs/agents/lanes/french.md` first. Branch rule for this work: all PRs target `release/french`; `main` is never touched.

### Done — merged French PRs

| PR | What it translated / changed |
|---|---|
| #7410 | Infrastructure: `fr` in `site/src/lib/i18n.ts` registry (LANGS, OG_LOCALE fr_FR, NUM_LOCALE fr-FR, switcher cycle — renders `AR\|EN\|UR\|FR` automatically, `BaseLayout.astro:154`), `astro.config.mjs` locales+sitemap+noindex, `workers/site/src/route.js` (`/fr`→`/fr/`, fr 404), `workers/site/wrangler.production.toml`, `workers/r2-sync/batch/publish.mjs` (pagefind-fr), `site/package.json` (pagefind-fr build cmd), deploy workflows. `i18n/fr.yaml` created with header scalars + `nav`, `a11y`, `landing`, `wings`, `hall`, `entity`, `depth`, `status`, `map` (full `map.viewer` — `place-map.test.ts` reads yaml directly). 3 `content/fr/` fixtures: `event/hijra`, `person/ibrahim`, `building/bayt-al-hikma`. Lane doc, `scripts/fr-queue.ts`, proposal. `AGENTS.md` + `docs/language.md` amended to four languages. All ar/en/ur triples in site libs/pages/scripts normalized; loaders keep `fr` optional (en→ar fallback). |
| #7412 | fr.yaml slice 2 (`claim`→`entrances`): claim, class, modernSections/modernFields/modernGenres/modernSports, full `modern` browser (labels, formulas, kinds, metrics, section ledes), pressKinds, inventionDomains, search, wander, timeline, journey, graph, revelation, surahmap, reader, poetry, hadith, cards, today, questions, exhibits, coverage, not_found, footer, roles, faith, basis, entrances. |
| #7413 | fr.yaml slice 3 (`themes`→`foundation`): themes, screen (incl. `viz` reel block), story, tension, conflict, passage, figure, licenses, ids, learn, pathway, calendar, mytour, foundation (full About page strings). |
| #7414 | fr.yaml slice 4: `explore` (groups + all ~70 `pages.*` browser cards — the largest prose block), `by_values`, `references`. |
| #7415 | This handover PR: fixes `ALLOWED_PREFIXES` in `workers/r2-sync/wrangler.toml` + `wrangler.production.toml` (now include `fr/` and `pagefind-fr/`), adds `docs/delegation/french-plan.md`, this section. |

`i18n/fr.yaml` is ~2,000 of ~7,211 lines translated; everything missing backfills from English via `ui()` fillMissing — the site is never broken by gaps.

### Open PRs / branches

None open — all four slices merged. `feature/french-language`, `feature/french-i18n-2`, `feature/french-i18n-3`, `feature/french-i18n-4` are merged-and-done branches; `feature/french-handover` is this one.

- Devin Review finding on #7410 (R2 `ALLOWED_PREFIXES` missing `fr/`/`pagefind-fr/`): **real, now fixed in #7415** — both wrangler files updated.

### Remaining work, in planned order

1. **`i18n/fr.yaml` batch 0 (rest of file, ~5,200 lines)**, in this order:
   - `kids` (~174 lines), `tour` (~99), `authenticity` (~29), `method` (~29), `privacy` (~99), `backstage` (~64), `accessibility` (~53), `volunteer` (~23), `why` (~51), `network` (~8), `developers` (~89), `cite` (~19), `changelog` (~11), `support` (~33), `art` (~45), `browse` (~5).
   - `edu` (~322 lines), `shabab` (~58), `storycards` (~11), `time_browser` (~88), `featured_pages` (~35), `future` (~113), `world` (~81).
   - The ~50 thematic collection sections `fatwa`→`heroes` (~3,700 lines, lines 3503–7211 of en.yaml): `fatwa`, `khutab`, `ghayb`, `nature`, `angels`, `dreams`, `dua`, `janna`, `qiyama`, `tibb`, `bunuwwa`, `usra`, `ubuwwa`, `ukhuwwa`, `umuma`, `nar`, `islamic_economy`, `trade`, `ibadat`, `sayyiat`, `arkan`, `hudud`, `halal`, `hasanat`, `mukatabat`, `munazarat`, `magic`, `nubuwat`, `places`, `signs`, `messengers`, `miracles`, `qurun`, `madhahib`, `bayt`, `cosmos`, `ulama`, `wasaya`, `qiraat`, `qudsi`, `companions`, `jobs`, `career`, `battles`, `asma`, `khulafa`, `inventions`, `tafsir`, `qurandoor`, `decisions`, `seerah`, `syllabus`, `hisab`, `akhlaq`, `ansab`, `grand_tour`, `courses`, `paged`, `journeys`, `sport`, `umam`, `heroes`. Many share the en.yaml browser-page pattern — fast to translate once `explore` is your reference.
   - `i18n/glossary.yaml` — add French name forms where they differ from English (La Mecque, Médine, Aïcha, etc.).
2. **Dataset `fr` fields (batch 1)**: `edu/*.yaml`, `kids/*.yaml`, `tour/*.yaml`, `cards/**` — loaders already tolerate missing `fr`.
3. **`content/fr/` corpus (batch 2–3)**: ~35,000 files. Spine classes first (`person`, `event`, `place`, `work`, `concept`, `building`, `object`) via packets; en→fr pivot, ar→fr for `passage`/`practice`/`question` and dua/hadith content. `label.fr`/`summary.fr` on `data/*.yaml` in large batches.
4. **French Qur'an translation** (e.g. Hamidullah): register in `scripts/harvest/quran/translations.py` before passage pages can show French; currently a recorded gap.
5. **Tighten (batch 4)**: add `fr` to `localized3` required in `scripts/gen-schema.ts`, `PUBLISHED_LANGS` in `scripts/lib.ts`, strict `fr` in the dataset loaders (`edu.ts`, `where.ts`, `homework.ts`, `packs.ts`, `topics.ts`, `courses.ts`, `detective.ts`, `dilemmas.ts`, `story-cards.ts`, `tour.ts`), revert test literal lists to include `fr`, update `docs/status.md` and public language counts. Only when the corpus is actually there.

### How to work

- Slices: translate top-level `en.yaml` sections in order, append to `fr.yaml` preserving exact key structure; ~300–500 en lines per commit. Parse-check after every append:
  `node -e "require('yaml').parse(require('fs').readFileSync('i18n/fr.yaml','utf8'))"`
- Queue manifests: `npx tsx scripts/fr-queue.ts stats | i18n | prose [--class person] [--limit 500] | labels` — `i18n` lists en top-level sections still missing from fr.yaml.
- Per-slice checks used: `npx vitest run scripts/edu.test.ts scripts/place-map.test.ts scripts/paged-alternates.test.ts scripts/check-packet.test.ts scripts/messengers-tree.test.ts` (edu.test is slow, ~85s).
- One PR per slice into `release/french`.

### Unfinished checks

`npm run validate`, `npm test` full suite, `astro check`, `npx tsc --noEmit` in `site/`, full Astro build emitting `/fr/**` + `pagefind-fr`, worker route checks (`/fr`→`/fr/`, `/fr/x/`→`fr/x/index.html`, missing→`fr/404/index.html`), R2 publish dry-run, axe-scan on `/fr/`, Lighthouse ≥0.90 on fr homepage, UAT deploy. None of these full checks ran yet — only the vitest subsets above.

### Conventions

- Pivot: general content en→fr; sacred/fiqh ar→fr. `source_lang` frontmatter records it.
- Transliteration: use French academic forms — `La Mecque`, `Médine` (with article where French requires), `Coran`, `Mouharram`, `Ramadan`, `hégirien`, `ap. J.-C.` (CE), `av. J.-C.` (BCE), `H` (AH). Keep `hadith`, `sira/sira`, `sunna`, `sharia`→`charia` acceptable; preserve proper transliterations of names as in English unless a standard French form exists.
- Tone: same warm, precise, neutral docent as English. `« … »` for quotations; `"` inside prose text fine.
- YAML: single-quoted strings escape `'` as `''`; prefer double quotes or unquoted where safe. Preserve `{n}`, `{url}`, `{title}`, `{cite:…}` placeholders verbatim — tests diff them across languages.
- Never translate `[[id|label]]` ids, never type honorifics, never type Qur'an text (frozen `[[passage/quran-…]]` refs only).
- Ahmed's decisions this session: agent-driven batch translation (not a machine pass), en pivot default, full parity end-state, four-language rule now applies to all new content, PRs against `release/french` only.

### Known problems / would-do-differently

- The bulk sed pass in session 1 over-added `fr`: it hit `PUBLISHED_LANGS` (reverted), `ALL_LANGS` got a duplicated `"fr"` (fixed), and `edu.test.ts` literals (reverted — tests should assert the *published-required* set, not all locales). Any future bulk-edit should whitelist files, not regex the repo.
- `Fact` type in `site/src/lib/facts.ts` and `L3` in `seerah/index.astro` still carry transitional shapes; `entity.ts` `traditionLabel` has a special-cased fr fallback to simplify once `data/` has `label.fr`.
- `scripts/derive.ts` still generates synonyms only for ar/en — that is intentional: `synLang` in the search page maps `fr`→`en` (Latin script). No fr synonym file needed; reconsider only if French stems need their own map.
- en.yaml line estimate in the plan said ~7,200 — actual 7,211; fr.yaml progress should be measured by `fr-queue.ts i18n` (missing top-level sections), not line counts.
- `content/fr/event/hijra.md` etc. are fixtures translated from English for the edu test — mark `source_lang: en` honestly; they are drafts like all AI translation.
