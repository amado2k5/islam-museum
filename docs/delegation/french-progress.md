# french lane — progress

## 2026-11-18 — building corpus packet 8 (Devin)

- Run `fr-corpus-building-8`: 25 English-to-French prose translations, `imam-ali-shrine` → `kahf-jibril-qasyun` (including `kaaba`), with French labels and summaries; YAML layout preserved.
- `check-packet: PASS (25 entities, 50 files, 0 error(s), 22 warning(s), 0.2s)`. Inherited status/provenance warnings only. Targeted queue/packet tests: 15 passed. Citation sequences, wiki-link IDs, needs_source markers, section counts and heading distinctions checked; removing French fields restores original parsed data.
- Inherited-defect fixes: none. Left out: `building/bibi-maryam-complex-narayanganj` — inherited missing Urdu page. Frozen-hook blocked list: empty. No Urdu edits.
- Retained total: 199. Next record: `building/kalan-masjid-delhi`. Label-only work not started. Commit 2 of 4 since last plain push; base updates by merge only.

## 2026-11-18 — building corpus packet 7 (Devin)

- Run `fr-corpus-building-7`: original records 151–175, `great-mosque-of-kufa` → `ibrahim-pasha-palace`; 25 English-to-French prose translations and French labels/summaries, preserving YAML layout.
- `check-packet: PASS (25 entities, 50 files, 0 error(s), 13 warning(s), 0.1s)`. Warnings are inherited status/provenance fields. Targeted queue/packet tests: 15 passed. Citation sequences, wiki-link IDs, needs_source markers, section counts and heading distinctions checked; removing French fields restores original parsed data.
- Inherited-defect fixes: none. Source discrepancies in dates and attributions remain attributed, not silently reconciled. Left out: `building/bibi-maryam-complex-narayanganj` — inherited missing Urdu page. Frozen-hook blocked list: empty. No Urdu edits.
- Retained total: 174. Next unattempted record: `building/ibrahim-rauzah-bijapur`. Label-only work not started. Commit 1 of 4 since last plain push; future base updates by merge only, never rebase or force-push.

## 2026-11-18 — building corpus packet 6 (Devin)

- Run `fr-corpus-building-6`: original queue records 126–150, `eski-mosque-edirne` → `great-mosque-of-diyarbakir`; 25 English-to-French prose translations and corresponding French labels/summaries without YAML re-dumping.
- Scoped packet check: PASS, 25 entities, 50 files, 0 errors, 16 inherited provenance/status warnings. Citation sequences, wiki-link IDs, needs_source markers and section counts match English; original data unchanged apart from French fields.
- Informal notes use `Pour les jeunes visiteurs`; actual levels use `Pour les Petits`, `Pour les Explorateurs`, `Pour les Chercheurs`. Qur’an objects and inscriptions described, no sacred text typed.
- Inherited-defect fixes: none needed. Left-out list: `building/bibi-maryam-complex-narayanganj` — inherited missing Urdu page, required by the packet four-language gate. No Urdu edits in this batch. Frozen-hook blocked list: empty.
- Targeted tests: 15 passed (queue and packet). Retained total: 149 prose records. Next unattempted record: `building/great-mosque-of-kufa`. Plain push after this fourth new commit (including the two requested corrections), no gate bypass. Label-only work not started.

## 2026-11-18 — distinguish visitor notes from audience levels (Devin)

- In every French building page whose English pivot has `For young visitors`, use `Pour les jeunes visiteurs`. This is an informal note, not the Sprouts level.
- Reserve `Pour les Petits`, `Pour les Explorateurs`, `Pour les Chercheurs` for actual `For Sprouts`, `For Explorers`, `For Scholars` level headings. Apply this distinction to all future batches.
- Heading-only correction; prose, citation markers, provenance and data unchanged. Earlier packet notes about exact level forms do not classify informal visitor notes as levels.

## 2026-11-18 — building corpus packet 5 (Devin)

- Run `fr-corpus-building-5`: original queue records 101–125, `dar-al-raml-fustat` → `eski-cami-thessaloniki-acropolis`; 25 English-to-French prose translations and French labels/summaries without YAML re-dumping.
- Scoped packet check: PASS, 25 entities, 50 files, 0 errors, 21 inherited provenance/status warnings. Citation sequences, wiki-link IDs, needs_source markers and section counts match English; removing French data fields leaves original data unchanged. Targeted tests: 15 passed.
- Inherited-defect fixes: none needed. Left-out list remains `building/bibi-maryam-complex-narayanganj` (inherited missing Urdu page; packet four-language gate). Frozen-hook blocked list: empty.
- No Qur’an text typed; inscriptions described only. Source date discrepancy in `davut-pasha-mosque` remains explicitly attributed, not silently repaired.
- Retained total: 124 prose records; next unattempted record: `building/eski-mosque-edirne`. Label-only work not started. Plain push due after four new commits, with no gate bypass.

## 2026-11-18 — founder-lane boundary correction (Devin)

- Removed `content/ur/building/bibi-maryam-complex-narayanganj.md`: Urdu belongs to the founder’s lane; no further Urdu edits are authorized.
- Rechecking packet 3 without that companion failed: `no ur file: new prose ships in ar, en, ur and fr together` (25 entities, 50 files, 1 error, 25 warnings).
- Left out: `building/bibi-maryam-complex-narayanganj` — inherited missing Urdu page. Removed its French prose and `label.fr`/`summary.fr` rather than modifying the founder’s lane. Packet 3 now contains 24 retained French entities; the original 25-record range is unchanged.
- Any future record requiring a missing Urdu companion is left out and listed here, never repaired under `content/ur/`. This left-out record remains visible in the raw queue and must not be retried until the founder supplies its Urdu page.
- Current retained total: 99 French prose records. Previous packet-3 Urdu defect repair is withdrawn; frozen-hook blocked list remains empty.
- Rechecked packet 3: PASS, 24 entities, 48 files, 0 errors, 25 inherited provenance/status warnings.
- Push permission restored: plain `git push` after four new commits; stop and report any pre-push gate block. Label-only work remains out of scope until prose is finished.

## 2026-11-18 — building corpus packet 4 (Devin)

- Run `fr-corpus-building-4`: records 76–100, `bir-zamzam` → `dar-al-nadwa`; full English-to-French prose, labels and summaries, preserving existing YAML formatting.
- Scoped packet check: PASS, 25 entities, 50 files, 0 errors, 22 inherited provenance/status warnings. Citation sequences, wiki-link IDs, needs_source markers and section counts match English; removing French data fields leaves original data unchanged. Targeted tests: 15 passed.
- Audience headings use exactly `Pour les Petits`, `Pour les Explorateurs`, `Pour les Chercheurs` where present. No Qur’an text typed.
- Inherited-defect fixes: none needed. Frozen-hook exclusions: none.
- Non-impacting translation-only content; no new entities or submission claims. Next prose record: `building/dar-al-raml-fustat`.
- Latest instruction supersedes the earlier push cadence: no more pushes until explicitly authorized; never bypass the pre-push gate. Batches remain committed locally pending a later requested rebase.

## 2026-11-18 — building corpus packet 3 (Devin)

- Run `fr-corpus-building-3`: records 51–75, `bab-al-nasr` → `bir-yusuf-cairo`; full French prose, labels and summaries. Audience headings use the required French forms.
- Scoped packet check: PASS, 25 entities, 51 files, 0 errors, 25 inherited provenance/status warnings. French citation sequences, wiki-link IDs, needs_source markers and section counts match English; removing French data fields leaves original data unchanged.
- Inherited-defect fix: added the missing `content/ur/building/bibi-maryam-complex-narayanganj.md` translation after the packet checker rejected the missing Urdu page; English pivot and provenance recorded, no source facts changed. Frozen-hook exclusions: none.
- Sacred-text handling: the inscriptions in `baba-adams-mosque` and `begumpur-mosque` are described rather than transcribed in French; no Qur’an text typed.
- Non-impacting translation-only content; no new entities or submission claims. Next prose record: `building/bir-zamzam`. Push remains due after packet 5 (four continuation commits).

## 2026-11-18 — building corpus packet 2 (Devin)

- Run `fr-corpus-building-2`: records 26–50, `al-madrasa-al-nizamiyya-baghdad` → `bab-al-futuh`; full English-to-French prose and French labels/summaries, preserving existing YAML formatting.
- Scoped packet check: PASS, 25 entities, 50 files, 0 errors, 17 inherited provenance/status warnings. Citation sequences, wiki-link IDs, needs_source markers and section counts match English; removing French data fields leaves the original data unchanged. Targeted tests: 15 passed.
- Audience-level headings use exactly `Pour les Petits`, `Pour les Explorateurs`, `Pour les Chercheurs`; the three infrastructure issues reserved for #7416 remain untouched.
- Inherited-defect fixes: none needed. Frozen-hook exclusions: none.
- Non-impacting translation-only content; no new entities or submission claims. Next prose record: `building/bab-al-nasr`. Push cadence: after four continuation commits (packets 2–5).

## 2026-11-18 — building corpus packet 1 (Devin)

- Branch: `devin/fr-corpus-building`, based on `origin/release/french`; no main changes.
- Run `fr-corpus-building-1`: first 25 queued building records, `abdurrahman-abdi-pasha-memorial-buda` → `al-madrasa-al-bayhaqiyya`; full English-to-French prose plus `label.fr`/`summary.fr`, inserted without re-dumping YAML.
- Queue: same `p as repoPath` import fix as #7416; labels mode now honours `--class`, with regression tests.
- Scoped packet check: PASS, 25 entities, 50 files, 0 errors, 18 inherited provenance/status warnings. Citation sequences, wiki-link IDs, needs_source markers and section counts match English. Targeted tests: 15 passed.
- Inherited-defect fixes: none needed; frozen-hook exclusions: none. No audience-level sections occur in this packet.
- Non-impacting translation-only content; no new entities or submission claims. Full validation and coverage remain train-level work. Not pushed in this handoff.
- Next prose record: `building/al-madrasa-al-nizamiyya-baghdad`. Building label-only shards remain separate work.

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
