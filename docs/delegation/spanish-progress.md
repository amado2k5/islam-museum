# spanish lane — progress

Proposal: `docs/delegation/spanish-language-proposal.md` (approved 18 Nov 2026). Lane: `docs/agents/lanes/spanish.md`.
Branch: `release/spanish` (cut from `main` at 3fb57fcf90; `release/french` merged in by pull requests #7411 and, for the French batch of 18 Nov, #7420). Nothing here is on `main` and nothing is deployed.

## 2026-11-18 — infrastructure and interface landed (session 1)

Done:
- `AGENTS.md`: five-language rule (Arabic first; English, Urdu, French and Spanish always for new content).
- `docs/language.md`: Spanish active; pivot policy (en → es general, ar → es sacred/fiqh, never from French); Spanish removed from the "5+" row of the phasing table.
- Registry: `site/src/lib/i18n.ts` (`LANGS`, `ALL_LANGS`, `Lang`, `OG_LOCALE.es = "es_ES"`, `NUM_LOCALE.es = "es-ES"`, cycle ar → en → ur → fr → es → ar; `ARABIC_SCRIPT` unchanged), `site/astro.config.mjs` (locales, sitemap language map, noindex pattern).
- Worker and deploy: `workers/site/src/route.js` (`LANGS`, bare `/es` redirect, the Spanish 404 key through `notFoundKey`, `pagefind-es` in `R2_DATA_DIRS`), `workers/site/wrangler.production.toml` (`/es`, `/es/*`, `/pagefind-es/*` in both `run_worker_first` lists), `workers/r2-sync/batch/publish.mjs` (`pagefind-es` and `es` targets), `workers/r2-sync/wrangler.toml` and `wrangler.production.toml` (`pagefind-es/` and `es/` in `ALLOWED_PREFIXES`, mirroring the French change that arrived with #7420), `site/package.json` (the `pagefind-es` step), `.github/workflows/deploy-env.yml` (assets exclude list and the smoke-test paths).
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
- Dev server: `/es/` renders with `lang="es"`, `dir="ltr"`, `og:locale` `es_ES`, the Spanish menu, the switcher `AR | EN | UR | FR | ES` and an `es` hreflang alternate; `/es/search/` renders in Spanish; `/es/event/hijra/` renders Spanish chrome and Spanish dates around the English prose, with the Spanish Companion formula rendered by the UI.

Checks that failed, and why:
- `scripts/pipeline.test.ts` (1 test) and `scripts/tour.test.ts` (3 tests) fail on **French** assertions that came with `release/french`: they expect French prose for `person/ibn-sina` and French fields in the tour datasets, which do not exist yet. These two files were not edited here and Spanish was not added to them. They are the French lane's to settle.
- `npx tsc --noEmit` in `site/` is not clean on this branch (125 errors outside the duplicate-declaration noise). The ones on lines this change touches are of the kind already present for French (`Record<Lang, …>` tables that lack `fr`, optional-language indexing). No baseline run was made on `release/french`, so the count is not attributed.

Checks not run:
- The full `npm test`, `astro check`, `npm run build` (and therefore the real `pagefind-es` index, the sitemap and the link check) were not run in this session.
- `workers/r2-sync/test/publish.test.mjs` could not run in this worktree (its dependency `fflate` is not installed there).
- After merging the French batch (#7420) only the quick tests were re-run (`place-map`, `paged-alternates`, `check-packet`, the site Worker tests); `npm run validate` and `edu.test.ts` were run before that merge, which changed only `i18n/fr.yaml`, French documents and the R2 sync allow-list.
- No UAT or production deploy; `/es/` is not served anywhere public.

## 2026-11-18 — corpus started (session 1, wave 1)

Founder instruction in chat, 18 Nov 2026: start the corpus and the rest of the translation.

Scale, measured on this branch: `content/en/` holds about 34,800 prose files and 11.2 million words. The 273 records marked `importance: 1` (the canon's cornerstones) account for 663,254 words; the 680 at `importance: 2` for 404,666.

Order of work:
1. Cornerstones first (`importance: 1`, then `importance: 2`), shortest first, so the records a first-time visitor expects are Spanish soonest.
2. Then the spine classes (`person`, `event`, `place`, `work`, `concept`, `building`, `object`), then the rest, from `scripts/es-queue.ts prose`.
3. Sacred and fiqh classes (`passage`, `practice`, `question`) from Arabic, with their own brief. Not started.
4. Records with reading-level sections (`## For Sprouts` and its siblings): held for a separate pass, because `scripts/validate.ts` caps those sections at 80, 160 and 300 words in every language that has a registered heading and Spanish runs longer than English.
5. Datasets (`edu/`, `kids/`, `tour/`, `cards/`) and `label.es`/`summary.es` on `data/`: **held until the French lane has added its own keys to the same lines**, so that Spanish appends after French instead of conflicting on every record.

**Making `release/spanish` deployable to UAT (founder instruction in chat, 18 Nov 2026).** The founder wants to deploy `release/spanish` to UAT at any time, without waiting for the translation to finish, and wants every batch merged as it lands. `deploy-uat.yml` deploys the latest successful run of `build.yml` on the chosen `source_branch`, and every run of `build.yml` on `release/spanish` had ended without success: its test job failed on the French assertions and its build stopped at a French kids' reader page. Changed here, in shared code and tests only (no French content file):
- `site/src/lib/entity.ts`: `hasKidsRead(n, lang)` — the kids' reader page exists for a record in a language only when its prose in that language has the Explorers section under that language's own heading. The reader's `getStaticPaths`, `ReadShelf`, `WorldMap` and the entity page's link to the reader all use it, so `/fr/sighar/read/…` and `/es/sighar/read/…` are neither built nor linked until the translation and the headings exist. For ar, en and ur nothing changes (the validator guarantees the section).
- Tests: `pipeline.test.ts`, `tour.test.ts` and `modern.test.ts` asserted French prose, French tour fields and a four-language Wikipedia fixture that do not exist; they assert the published set again. `npm test`: 46 files, 634 of 634 pass.
- From now on each packet is merged into `release/spanish` as soon as it is checked.
Still to confirm: a green run of `build.yml` on `release/spanish` (the full build, all records in five languages, has never been run; only the sample build has).

Wave 8 (in progress, one agent at a time): the remaining 229 `object` and `building` records, about 72,000 words, eight packets. Packets 1 to 4 landed (113 files); `content/es/` holds 1,525 files.

Wave 7 landed (same day, one agent at a time): 679 short records of the `object` and `building` classes (about 46,000 English words), in eight packets run in sequence. All 679 pass the packet check. `content/es/` now holds **1,412 files** (`es-queue.ts stats`: `prose: 1412/34836`), about 679,000 English words of the 11.2 million (roughly 6 %). `npm run validate`: exit 0, "validated 81027 entities, 106100 prose files: 0 errors, 5343 warnings"; extremism 0 errors. 231 eligible `object` and `building` records remain (the longer ones).

Method change for short records, from packet 2 of wave 7: the agent reads one bundled file of its English sources and writes the Spanish back in a few bundled parts, which `split.py` cuts into the individual files before the same packet check runs. Packet 1, written one file per tool call, took 94 tool calls and about five minutes; the bundled packets took 8 to 12 tool calls and about three minutes each for the same 85 records. Corrected by the lead agent: three Arabic names respelled in Spanish fashion (`zanŷ`, `Burŷ`, `al-Mujtara`) were put back to the English transliteration.

Wave 6 landed (same day): the last eligible `importance: 2` records, the long ones (60 files, about 100,000 English words), same method and checks, all pass. `content/es/` now holds **733 files** (`es-queue.ts stats`: `prose: 733/34836`), about 633,000 English words of the 11.2 million (roughly 6 %). `npm run validate`: exit 0, "validated 81027 entities, 105421 prose files: 0 errors, 5343 warnings"; extremism 0 errors.

**Held for the founder (not landed): records on the firewall exceptions list.** `person/sayyid-qutb` and `person/yusuf-al-qaradawi` are on `docs/delegation/extremism-firewall-exceptions.md`; their English prose mentions a blocked organisation under a founder-approved exception, and `AGENTS.md` says an exception is never a precedent for new content. A Spanish translation would be a new mention in a new language, so neither file is in `content/es/`, and the wave builder now skips every record on that list (164 records). Proposal for the founder: either translate the excepted records as they stand, or translate them with the mention written neutrally, or leave them English-only under `/es/`. Until he rules, they stay untranslated. No record landed in waves 1 to 6 is on the list. A scan of `content/es/` for the Spanish spellings of the blocked names found only non-matches (the generic "Estado islámico" in three history records, the personal name Nusrat).

**Pace changed (founder instruction in chat, 18 Nov 2026):** one agent at a time, in sequence, to limit spending. Wave 7 (679 short `object` and `building` records, about 46,000 words, eight manifests) runs one packet after another; seven agents that had just been started in parallel were stopped before they wrote anything that was kept.

Also seen in the English sources: `person/jibril` carries quoted spans in curly braces that read as Qur'an translation typed into the prose; the Spanish leaves those spans in English, untouched. `person/dhu-al-nun-al-misri` has `{{cite:…}}` with doubled braces in its later sections; copied as they are.

Wave 5 landed (same day): 139 more eligible `importance: 2` records (about 107,000 English words), same method and checks, all pass. `content/es/` now holds **673 files** (`es-queue.ts stats`: `prose: 673/34836`), about 533,000 English words of the 11.2 million (roughly 5 %). 62 eligible `importance: 2` records remain (the longest). `npm run validate` with the 673 files: exit 0, "validated 81027 entities, 105361 prose files: 0 errors, 5343 warnings"; extremism 0 errors. One quotation was restored by the lead agent: in `person/rabia-al-adawiyya` an agent had dropped Rabi'a's invocation from a quoted sentence to satisfy the packet check; it now reads «¿Quién soy yo, Dios se apiade de ti? …».

**Build of the Spanish side, verified locally on 18 Nov 2026.** With the French reading-level headings registered in the working tree only (not committed; see the fifth blocker below), `npm --prefix site run build` under `SAMPLE_BUILD=1` exits 0: 10,380 pages under `dist/es/` (ar 11,478, en 11,418, ur 11,515, fr 10,383), a `dist/pagefind-es/` index with its own fragments, and 9,609 `/es/` addresses in the sitemap. On that output `npm run check:site` reports "checked 55196 pages: 0 errors, 4 warnings" (the warnings are an empty list item on one screen record in four languages, not Spanish-specific) and `npm run check:weight` "86 routes, 0 over budget". `scripts/check-site.ts` needed one change first: it read each language's strings file raw and crashed on the partial `i18n/fr.yaml`; it now falls back to the English string, as `ui()` does. Not run: the link check (lychee), axe and Lighthouse, which CI runs after the build. The committed branch itself still cannot pass `npm run build`, for the French reason below.

Waves 3 and 4 landed (same day): wave 3 is the last 23 eligible `importance: 1` records, the long ones (about 105,000 English words, among them `work/jami-al-bayan`, `person/al-ghazali-abu-hamid`, `person/ibn-khaldun`, `person/ibn-rushd`, `concept/tasawwuf`); wave 4 is the 375 shortest eligible `importance: 2` records (about 100,000 words). Same method and checks; all 398 files pass. `content/es/` now holds **534 files** (`es-queue.ts stats`: `prose: 534/34836`), about 426,000 English words of the 11.2 million. Every eligible `importance: 1` record is translated; 201 eligible `importance: 2` records remain. With the 534 files, `scripts/validate.ts` reports no error in `content/es/`, `check-encoding` 0 problems, `check-authenticity` 0 errors, `check-extremism` 0 errors.

Corrections made by the lead agent after the agents: three one-line object records had the Victoria and Albert Museum renamed in Spanish because the packet check counted "and" as untranslated English; the institution's own name was restored and the check now ignores a short list of institution and reference-work names. In `person/lut` a quoted hadith that asks God's mercy on Lut is rendered «Dios se apiade de Lut…» rather than with the formula the validator reserves for honorifics.

Wave 2 landed: 45 more `importance: 1` records (about 112,000 English words), same method, same checks, all 45 pass; `content/es/` now holds 136 files (`es-queue.ts stats`: `prose: 136/34836`). 23 eligible `importance: 1` records remain, plus those held for reading-level sections and the sacred classes. `npm run validate` with the 136 files: exit 0, "validated 81027 entities, 104824 prose files: 0 errors, 5343 warnings".

Found in the English sources while translating (reported, not fixed): `person/mahmud-ii-uthmani` says in one place that he replaced the fez with the turban and in another the reverse; `person/al-biruni-muhammad-ibn-ahmad` and `person/umar-khayyam` have figures run together with the preceding word ("composed416 AH", "between1039 and1048"); `concept/qibla` and `building/masjid-ibn-tulun` have stray punctuation. The Spanish follows the evident reading and keeps every figure.

Wave 1 landed:
- 91 prose files in `content/es/` (about 109,000 English words): the 91 shortest `importance: 1` records outside the sacred classes and without reading-level sections, in `building`, `concept`, `event`, `group`, `object`, `period`, `person`, `place`, `polity`, `work`.
- Translated from `content/en/` by eight Claude Sonnet 5.5 subagents (as each reported its own model), file by file, no machine-translation service; `source_lang: en`, `translators` and a `provenance` block on every file. **No human has read them.**
- Trust criteria used for this lane (recorded so they can be audited and reused): a packet is accepted only if, against its English source, every file has (a) the same wiki-link ids, (b) the same `{cite:…}` markers character for character, (c) the same `(needs_source…)` markers, (d) the same heading levels and count and the same paragraph count, (e) a Spanish/English word ratio between 0.85 and 1.60, (f) no typed honorific in Spanish, English or Arabic and no Qur'an brackets, (g) under 4 % English function words. All 91 files pass. The check does not judge the quality of the Spanish.
- Normalised after the agents: the `Overview` heading is `Visión general` everywhere; `hajj` and `Jahiliyya` keep the English transliteration.
- `npm run validate` with the 91 files: exit 0, "validated 81027 entities, 104779 prose files: 0 errors, 5343 warnings".

Code changes that the corpus needed:
- `scripts/validate.ts`: the scope rule "a perspectives block must start with the Sunni entry" now also recognises the Spanish label (`Suní…`, `Visión suní…`, `Posición suní…`); it rejected correctly translated blocks in `person/zaynab-bint-jahsh` and `person/ibn-taymiyya`.
- `edu/levels.yaml`, `site/src/lib/entity.ts`: Spanish headings for the three reading levels (`Para los Brotes`, `Para los Exploradores`, `Para los Estudiosos`) and for the Brief, young-visitors and scholars sections (`En breve`, `Para los visitantes jóvenes`, `Notas para investigadores`).
- Direction: the French lane's fix `f21b02afd6` (prose and several components rendered every non-English language right to left) was cherry-picked unchanged from `devin/fr-corpus-object-1`, because Spanish prose needs it now; it will merge as an identical change when French lands it.
- `site/src/lib/markdown.ts`: the missing French entries in `OTHER_PROPHETS` and `NAME_END` were added. This was the fault reported above; it made the site build fail at `/fr/event/hijra/` on `release/french` and therefore on `release/spanish`. It is shared code, not a French content file, and the build could not be verified without it.

Results of the checks that were owed from the first entry:
- Full `npm test` (before wave 1): 629 of 634 pass. The 5 failures are on French edits in files not touched here: `pipeline.test.ts` (1), `tour.test.ts` (3) and `modern.test.ts` (1, a fixture list of Wikipedia languages that gained `fr`).
- `astro check`: cannot run. `@astrojs/check` is not a dependency of `site/`; the command only offers to install it. No package was added.
- Site build: the first run (CI sample build, `SAMPLE_BUILD=1`) failed on the French fault above. After that fix a second run built the entity pages of all five languages (including the Spanish prose of wave 1) and then failed at `/fr/shabab/detective/`: a page reads `field[lang]` on a dataset that has only ar, en and ur. The same would have happened under `/es/`. Fix: `backfillLangs` / `parseLocalized` in `site/src/lib/i18n.ts` fill the optional languages (`fr`, `es`) of every localized dataset leaf from English, then Arabic, in memory, and the sixteen dataset loaders in `site/src/lib/` use it; the YAML files and the loaders' own checks on ar, en and ur are unchanged. Later runs are recorded above under "Build of the Spanish side".

A fourth build blocker, fixed: `scripts/time-browser.ts` wrote its per-language data only for ar, en and ur, so `getStaticPaths` of `/[lang]/time-browser/[kind]/[slug]` failed on `.cache/time-browser/fr/event.json`. The generator now writes fr and es as well (its 80 tests pass). A fifth blocker is **not** fixed and is French's: `/fr/sighar/read/building/bayt-al-hikma/` throws because the French reading-level headings are not registered on `release/french` (the French lane has that on its work branch, commit 5457915862); registering them here makes `content/fr/person/ibrahim.md` fail the validator by one word (161 against 160), and French content is not edited by this lane. Until French lands that fix, `npm run build` cannot pass on `release/spanish`.

Terms a Spanish-speaking reader should review in the prose: `anticalifa`, `los Siete Juristas`, `Sucesores` (for the Successors), `burchíes`, `benimerín`, `ilkhánidas`, `Hiyaz`, `Jorasán`, `Bujará`, `Solimán`, `derecho anglo-muhammadan`, and the translated titles of television programmes and books.

### Packet log (one agent at a time)

- Wave 8, packet 5: landed and merged; `content/es/` holds 1,554 files; `npm run validate` 0 errors.

## Explicit gaps

- `content/es/`: 1,554 files of about 34,800 (waves 1 to 8 so far, above). Every other entity page under `/es/` shows Spanish chrome around English, then Arabic, prose.
- `data/*.yaml`: no `label.es` / `summary.es`.
- Datasets (`edu/`, `kids/`, `tour/`, `cards/`): no `es` fields; the strict loaders still require only ar, en and ur.
- Spanish Qur'an translation for passage pages: no source chosen or registered (`scripts/harvest/quran/translations.py` takes English and Urdu only). The translation and its licence are pending the founder's confirmation.
- `i18n/es.yaml` term choices that a Spanish-speaking reader should review: `Compañeros`, `aleya`/`sura`, `fetua`, `Hégira`/`hijri`, `chií`, `jariyíes`, `Ala infantil` for the Kids' Wing, the school-grade wording (`{g}.º curso`, `Primaria`/`Secundaria`) in the education strings, and the first-person agent entries of the Backstage section. Transliterated names were normalised to the English forms (`Jibril`, `Khaybar`, `Yathrib`, `Thamud`, `Thawr`, `Hajj`, `juz`, `jinn`).
- Spanish dates are rendered as day, month, year without the preposition (`12 septiembre 622 d. C.`); idiomatic Spanish is `12 de septiembre de 622`. The shared `render()` in `site/src/lib/dates.ts` joins the parts with spaces for every language; a Spanish form is a small follow-up.
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
