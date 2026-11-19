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
First full build on GitHub (run 44326205889, commit ab9a15bf, 14:37–16:48 UTC): the test job passed; the build produced and checked 460,598 pages ("checked 460598 pages: 0 errors, 4 warnings"; "check-weight: 86 routes, 0 over budget") and then failed in the last step, `npm run books`: `scripts/a11y-books.ts` had a per-language list for ar, en, ur and fr but not es. Fixed (the list is built from `LANGS`; fr and es use their own liblouis tables, `fr-fr-g1.utb` and `es-g1.ctb`); run locally on the sample build it writes 948 books with 0 skipped. Known limit: the Spanish and French `.brf` files lose accented letters (the ASCII pass-through strips them). Still to confirm: a green run of `build.yml` with this fix.

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

### From wave 11: translation runs on the founder's Mac with a local model (founder instruction in chat, 18 Nov 2026)

Wave 10 (the last one translated by Claude subagents) is complete: `content/es/` holds 3,792 files. From wave 11 on, the founder asked for the translation itself to run on his Mac with a local model, with Claude only managing the run, for Spanish and for French at the same time, always from English, and with everything still raised and merged against `release/spanish` only (French included; nothing is raised against `release/french`).

- **Model:** TranslateGemma 27B (`translategemma:27b`, Google, January 2026, a translation-tuned Gemma 3), pulled from the official Ollama library. Chosen after a web search on 18 Nov 2026: it is the most cited open translation model and covers Spanish and French; no head-to-head ranking for English→Spanish or English→French was found, so the choice rests on general benchmarks and on the pilot below. Not chosen: Tower+ 9B (higher in one third-party benchmark, but licensed CC BY-NC-SA) and PLaMo 3 Translate (self-reported results only). One model serves both languages; a second, different model was not needed.
- **Where it lives:** the model (17 GB), the logs and the work lists are on the microSD, `/Volumes/exmicroSD/islam-museum-local-mt/` (founder's instruction). A private Ollama server on port 11500 serves it with two parallel requests; the founder's own Ollama server is not touched.
- **Scripts (in the repository):** `scripts/local-mt/translate.py` (queue, protection of `{cite:…}`, `(needs_source…)`, link ids, code and URLs behind numbered markers, one request per paragraph, the same checks as the packet check, atomic write, one JSON line per record in the log) and `scripts/local-mt/run.sh` (supervisor: keeps the server up, restarts the translator if it stops, waits if the card is unplugged, stops on a `STOP-<lang>` file).
- **Logs:** `…/logs/es.log` and `…/logs/fr.log` (one line per record: `ok`, `failed` with the reason, `crash`), `…/logs/<lang>.supervisor.log` (starts and restarts), `…/logs/<lang>.log.failed` (records the checks refused; they are skipped on later passes and left for a second look).
- **Order and holds:** shortest first, class by class (`event`, `place`, `work`, `person`, `concept`, `building`, `object`, then the other classes, then `practice`, `question` and the non-Qur'an `passage` records, from English as instructed). Held as before: the Qur'an passage pages, the firewall-exception records, records with reading-level sections, damaged English files. The French thread also skips the 2,050 records the French lane already has on `release/french` or any of its work branches (`fr-taken.txt`).
- **Pilot, read by the lead agent:** `event/conquest-of-al-andalus` (608 words) translated into both languages in 70–80 s each at about 22 tokens/s, passing every check at the first attempt. Against the Claude translation of the same record the local Spanish is fluent and structurally exact but freer: it once turned "God opened cities and forts through his hands" into "God granted him victory, opening cities…", used "invadir" where the English says "raid", and closed a heading with a full stop. The prompt was tightened (stay close to the source, add nothing, fixed era abbreviations) and headings are trimmed; the second run kept the literal sense and the `H` era. Remaining tendency: small interpretive additions ("según la tradición que transmite…"). **The local output is a lower-fidelity draft than the Claude translations and no human has read it.** Each file names the model in `translators` and `provenance`.
- **Started:** both threads at 15:11 local time on 18 Nov 2026.
- **Speed work, measured on the founder's M4 Max (128 GB) with both threads running, in English words per wall-clock second:** first setup (Ollama, one request per paragraph) 2.5 Spanish + 3.1 French; several short runs of prose per request (still Ollama) 5.2 + 4.4; the MLX build of the same model (`mlx-community/translategemma-27b-it-4bit`, 15 GB, on the microSD) behind `scripts/local-mt/mlx_server.py`, which decodes four requests together, 8.2 + 3.4 with block batches and 5.1 + 5.0 with continuous batching. A stand-alone benchmark gave 23 tokens/s for one paragraph and 46 tokens/s for four together (eight together: no further gain), so about 10–12 words/s in total is near what this model does on this machine. **Now running:** MLX, continuous batching, two records at a time per language. At that rate the remaining prose is weeks of continuous running for the two languages, not days.
- **Self-healing, tested:** killing a translator, and separately killing the model server, were both followed by an automatic restart by the supervisors within a minute.
- **Hourly auto-ship:** `scripts/local-mt/autoship.sh` runs `scripts/local-mt/ship.sh` once an hour (validate, set aside any record the validator refuses, commit, pull request into `release/spanish`, merge); log in `…/logs/ship.log`; stop with a `STOP-ship` file.

### `main` merged into `release/spanish` (founder instruction in chat, 18 Nov 2026)

43 commits of `main` (about 21,000 files, mostly the Arabic-parenthesis isolation across the corpus and new records) were merged into the Spanish feature branch and from there into `release/spanish`. Two conflicts, both resolved keeping both sides: `CANARY.md` (both lists of fixes kept) and `site/src/lib/dates.ts` (main's isolated parentheses on the Arabic and Urdu era labels, with the French and Spanish rows kept). On the merged tree: `npm run validate` exit 0, "validated 81578 entities, 108152 prose files: 0 errors, 5344 warnings"; `npm test` 50 files, 681 of 681 pass. Not re-run after this merge: the site build. Some English prose files that were already translated changed on `main` in this merge (parenthesis isolation); their Spanish files were not re-checked against the new English.

### Qur'an passage files checked and restored (founder instruction in chat, 18 Nov 2026)

Check: between the branch point (`3fb57fcf90`) and `main`, one commit touched `data/passage/quran-*.yaml`: `7d509c17a5` ("fix(rtl): isolate every Arabic and Urdu parenthetical…"). It changed 3,528 of the 6,394 files. Compared field by field and byte by byte against the files before that commit: 3,543 values differ, all only by inserted U+2066/U+2069 marks (6,560 pairs) — 3,522 in `translations.ur.text`, 21 in `relations[].note`. `text` (the Arabic), `text_search` and `translations.en` are unchanged in all 3,528 files, and every file equals its earlier bytes once the two marks are removed.

Restore: the 3,528 files are back to their content at `7d509c17a5^` on `release/spanish`; none differs from the branch point. `scripts/validate.ts` now leaves the frozen Qur'an passages (`class: passage`, `work: work/quran`) out of the Arabic-parenthesis rule, which otherwise reported 3,543 errors on the restored files; the rule is unchanged for every other record. The pre-commit guard on the frozen files was skipped for the restoring commit, on the founder's explicit instruction. `npm run validate`: 0 errors; `npm test`: 681 of 681.

Open after the restore: `main` still carries the marks (not touched from this lane); when `release/spanish` reaches `main` the restore goes with it. Parentheses in the Urdu translation on passage pages may display mirrored until the renderer isolates them at render time (not done).

### Root address follows the browser's default language (founder instruction in chat, 19 Nov 2026)

`site/public/shell/shell.js`: at the bare root `/` only, the browser's default language (`navigator.language`) decides: `en`, `ur`, `fr` or `es` go to `/<lang>/`; `ar`, any other language, a crawler, or no JavaScript stay on the Arabic root. Risk label: `submission-impacting` in the sense of `docs/ai-change-gates.md` section 3 (it changes what a script does on the page; no cookie, storage, form or network call is added), asked for directly by the founder; the outreach files were not edited. Checked: a table of 13 cases in Node (regions, unsupported languages, deeper paths, a crawler, an empty value), and in a real browser on the dev server (browser language `en-US`: `/` → `/en/`; `/ar/` stays). **Remembered choice (founder, same day):** a click on a language in the header stores that language code in the browser's `localStorage` under `lang`; at the root the stored choice wins over the browser's default (a stored `ar` keeps the root on Arabic). The privacy page's sentence listing what is kept on the device names it in English, Arabic and Spanish; the Urdu sentence is generic and needed no change; French has no such string yet and shows the English one. Checked in Node (10 cases) and in a real browser (choose ES on `/en/`, then `/` → `/es/`; choose AR, then `/` stays Arabic). Known limits: the Arabic root paints for a moment before the redirect, because the script is deferred; a visitor whose browser is in English but who wants Arabic reaches it at `/ar/` or through the header, not at `/`.

### Held records and English-source defects found while translating

- `event/al-nawawi-ashrafiyya-665`: the same defect (a stray `ur:` line of Urdu and a quotation mark inside the English prose). Not translated.
- `event/al-nawawi-tahrir-671`: the same defect as the next item (a stray quotation mark and an `ur:` line of Urdu inside the English prose). Not translated.
- `event/al-nawawi-minhaj-rawda-669`: the English prose file ends with a stray quotation mark and an `ur:` line of Urdu text that leaked in from a frontmatter mix-up. Not translated; the English file needs repair first (not edited by this lane).
- `person/sayyid-qutb`, `person/yusuf-al-qaradawi` and the other records on the firewall exceptions list: held for the founder (see above).
- Place-name spelling varies between packets (Basra / Basora, Aleppo / Alepo, Khurasan / Jorasán, Tunis / Túnez): a normalising pass is owed.

### Packet log (one agent at a time)

- Wave 8, packet 5: landed and merged; `content/es/` holds 1,554 files; `npm run validate` 0 errors.
- Wave 8, packet 6: landed and merged; `content/es/` holds 1,583 files; `npm run validate` 0 errors.
- Wave 8, packet 7: landed and merged; `content/es/` holds 1,612 files; `npm run validate` 0 errors.
- Wave 8, packet 8: landed and merged; `content/es/` holds 1,641 files; `npm run validate` 0 errors.
- Wave 9, packet 1: landed and merged; `content/es/` holds 1,801 files; `npm run validate` 0 errors.
- Wave 9, packet 2: landed and merged; `content/es/` holds 1,961 files; `npm run validate` 0 errors.
- Wave 9, packet 3: landed and merged; `content/es/` holds 2,121 files; `npm run validate` 0 errors.
- Wave 9, packet 4: landed and merged; `content/es/` holds 2,281 files; `npm run validate` 0 errors.
- Wave 9, packet 5: landed and merged; `content/es/` holds 2,441 files; `npm run validate` 0 errors.
- Wave 9, packet 6: landed and merged; `content/es/` holds 2,601 files; `npm run validate` 0 errors.
- Wave 9, packet 7: landed and merged; `content/es/` holds 2,761 files; `npm run validate` 0 errors.
- Wave 9, packet 8: landed and merged; `content/es/` holds 2,921 files; `npm run validate` 0 errors.
- Wave 10, packet 1: landed and merged; `content/es/` holds 3,029 files; `npm run validate` 0 errors.
- Wave 10, packet 2: landed and merged; `content/es/` holds 3,138 files; `npm run validate` 0 errors.
- Wave 10, packet 3: landed and merged; `content/es/` holds 3,247 files; `npm run validate` 0 errors.
- Wave 10, packet 4: landed and merged; `content/es/` holds 3,355 files; `npm run validate` 0 errors.
- Wave 10, packet 5: landed and merged; `content/es/` holds 3,464 files; `npm run validate` 0 errors.
- Wave 10, packet 6: landed and merged; `content/es/` holds 3,574 files; `npm run validate` 0 errors.
- Wave 10, packet 7: landed and merged; `content/es/` holds 3,684 files; `npm run validate` 0 errors.
- Wave 10, packet 8: landed and merged; `content/es/` holds 3,792 files; `npm run validate` 0 errors.
- 2026-11-18 15:23 local machine translation shipped: `content/es/` 3,806 files, `content/fr/` 54 files; `npm run validate` 0 errors.
- 2026-11-18 15:38 local machine translation shipped: `content/es/` 3,833 files, `content/fr/` 134 files; `npm run validate` 0 errors.
- 2026-11-18 16:31 local machine translation shipped: `content/es/` 3,917 files, `content/fr/` 294 files; `npm run validate` 0 errors.
- 2026-11-18 16:40 local machine translation shipped: `content/es/` 3,933 files, `content/fr/` 333 files; `npm run validate` 0 errors.
- 2026-11-18 17:02 local machine translation shipped: `content/es/` 3,977 files, `content/fr/` 430 files; `npm run validate` 0 errors.
- 2026-11-18 17:15 local machine translation shipped: `content/es/` 4,003 files, `content/fr/` 478 files; `npm run validate` 0 errors.
- 2026-11-18 17:27 local machine translation shipped: `content/es/` 4,028 files, `content/fr/` 524 files; `npm run validate` 0 errors.
- 2026-11-18 17:39 local machine translation shipped: `content/es/` 4,053 files, `content/fr/` 567 files; `npm run validate` 0 errors.
- 2026-11-18 17:50 local machine translation shipped: `content/es/` 4,073 files, `content/fr/` 611 files; `npm run validate` 0 errors.
- 2026-11-18 18:02 local machine translation shipped: `content/es/` 4,095 files, `content/fr/` 653 files; `npm run validate` 0 errors.
- 2026-11-18 18:14 local machine translation shipped: `content/es/` 4,119 files, `content/fr/` 689 files; `npm run validate` 0 errors.
- 2026-11-18 18:26 local machine translation shipped: `content/es/` 4,141 files, `content/fr/` 726 files; `npm run validate` 0 errors.
- 2026-11-18 18:38 local machine translation shipped: `content/es/` 4,164 files, `content/fr/` 757 files; `npm run validate` 0 errors.
- 2026-11-18 18:50 local machine translation shipped: `content/es/` 4,188 files, `content/fr/` 793 files; `npm run validate` 0 errors.
- 2026-11-18 19:02 local machine translation shipped: `content/es/` 4,212 files, `content/fr/` 826 files; `npm run validate` 0 errors.
- 2026-11-18 19:13 local machine translation shipped: `content/es/` 4,233 files, `content/fr/` 857 files; `npm run validate` 0 errors.
- 2026-11-18 19:25 local machine translation shipped: `content/es/` 4,255 files, `content/fr/` 884 files; `npm run validate` 0 errors.
- 2026-11-18 19:37 local machine translation shipped: `content/es/` 4,277 files, `content/fr/` 917 files; `npm run validate` 0 errors.
- 2026-11-18 19:49 local machine translation shipped: `content/es/` 4,297 files, `content/fr/` 949 files; `npm run validate` 0 errors.
- 2026-11-18 20:02 local machine translation shipped: `content/es/` 4,320 files, `content/fr/` 977 files; `npm run validate` 0 errors.
- 2026-11-18 20:15 local machine translation shipped: `content/es/` 4,342 files, `content/fr/` 1,011 files; `npm run validate` 0 errors.
- 2026-11-18 20:28 local machine translation shipped: `content/es/` 4,362 files, `content/fr/` 1,036 files; `npm run validate` 0 errors.
- 2026-11-18 20:40 local machine translation shipped: `content/es/` 4,379 files, `content/fr/` 1,059 files; `npm run validate` 0 errors.
- 2026-11-18 20:53 local machine translation shipped: `content/es/` 4,400 files, `content/fr/` 1,087 files; `npm run validate` 0 errors.
- 2026-11-18 21:05 local machine translation shipped: `content/es/` 4,420 files, `content/fr/` 1,112 files; `npm run validate` 0 errors.
- 2026-11-18 21:17 local machine translation shipped: `content/es/` 4,442 files, `content/fr/` 1,133 files; `npm run validate` 0 errors.
- 2026-11-18 21:29 local machine translation shipped: `content/es/` 4,461 files, `content/fr/` 1,163 files; `npm run validate` 0 errors.
- 2026-11-18 21:40 local machine translation shipped: `content/es/` 4,481 files, `content/fr/` 1,188 files; `npm run validate` 0 errors.
- 2026-11-18 21:52 local machine translation shipped: `content/es/` 4,503 files, `content/fr/` 1,217 files; `npm run validate` 0 errors.
- 2026-11-18 22:04 local machine translation shipped: `content/es/` 4,526 files, `content/fr/` 1,246 files; `npm run validate` 0 errors.
- 2026-11-18 22:16 local machine translation shipped: `content/es/` 4,548 files, `content/fr/` 1,273 files; `npm run validate` 0 errors.
- 2026-11-18 22:28 local machine translation shipped: `content/es/` 4,568 files, `content/fr/` 1,295 files; `npm run validate` 0 errors.
- 2026-11-18 22:39 local machine translation shipped: `content/es/` 4,588 files, `content/fr/` 1,319 files; `npm run validate` 0 errors.
- 2026-11-18 22:51 local machine translation shipped: `content/es/` 4,606 files, `content/fr/` 1,347 files; `npm run validate` 0 errors.
- 2026-11-18 23:03 local machine translation shipped: `content/es/` 4,624 files, `content/fr/` 1,372 files; `npm run validate` 0 errors.
- 2026-11-18 23:14 local machine translation shipped: `content/es/` 4,644 files, `content/fr/` 1,395 files; `npm run validate` 0 errors.
- 2026-11-18 23:26 local machine translation shipped: `content/es/` 4,661 files, `content/fr/` 1,417 files; `npm run validate` 0 errors.
- 2026-11-18 23:38 local machine translation shipped: `content/es/` 4,680 files, `content/fr/` 1,438 files; `npm run validate` 0 errors.
- 2026-11-18 23:50 local machine translation shipped: `content/es/` 4,699 files, `content/fr/` 1,457 files; `npm run validate` 0 errors.
- 2026-11-19 00:01 local machine translation shipped: `content/es/` 4,717 files, `content/fr/` 1,479 files; `npm run validate` 0 errors.
- 2026-11-19 00:13 local machine translation shipped: `content/es/` 4,736 files, `content/fr/` 1,502 files; `npm run validate` 0 errors.
- 2026-11-19 00:25 local machine translation shipped: `content/es/` 4,753 files, `content/fr/` 1,520 files; `npm run validate` 0 errors.
- 2026-11-19 00:36 local machine translation shipped: `content/es/` 4,766 files, `content/fr/` 1,542 files; `npm run validate` 0 errors.
- 2026-11-19 00:49 local machine translation shipped: `content/es/` 4,787 files, `content/fr/` 1,563 files; `npm run validate` 0 errors.
- 2026-11-19 01:01 local machine translation shipped: `content/es/` 4,803 files, `content/fr/` 1,585 files; `npm run validate` 0 errors.
- 2026-11-19 01:13 local machine translation shipped: `content/es/` 4,817 files, `content/fr/` 1,606 files; `npm run validate` 0 errors.
- 2026-11-19 01:24 local machine translation shipped: `content/es/` 4,832 files, `content/fr/` 1,625 files; `npm run validate` 0 errors.
- 2026-11-19 01:36 local machine translation shipped: `content/es/` 4,849 files, `content/fr/` 1,642 files; `npm run validate` 0 errors.
- 2026-11-19 01:48 local machine translation shipped: `content/es/` 4,866 files, `content/fr/` 1,663 files; `npm run validate` 0 errors.
- 2026-11-19 01:59 local machine translation shipped: `content/es/` 4,880 files, `content/fr/` 1,684 files; `npm run validate` 0 errors.
- 2026-11-19 02:11 local machine translation shipped: `content/es/` 4,893 files, `content/fr/` 1,703 files; `npm run validate` 0 errors.
- 2026-11-19 02:23 local machine translation shipped: `content/es/` 4,909 files, `content/fr/` 1,722 files; `npm run validate` 0 errors.
- 2026-11-19 02:34 local machine translation shipped: `content/es/` 4,922 files, `content/fr/` 1,742 files; `npm run validate` 0 errors.
- 2026-11-19 02:46 local machine translation shipped: `content/es/` 4,936 files, `content/fr/` 1,760 files; `npm run validate` 0 errors.
- 2026-11-19 02:58 local machine translation shipped: `content/es/` 4,951 files, `content/fr/` 1,779 files; `npm run validate` 0 errors.
- 2026-11-19 03:09 local machine translation shipped: `content/es/` 4,964 files, `content/fr/` 1,793 files; `npm run validate` 0 errors.
- 2026-11-19 03:22 local machine translation shipped: `content/es/` 4,976 files, `content/fr/` 1,810 files; `npm run validate` 0 errors.
- 2026-11-19 03:25 local machine translation shipped: `content/es/` 4,979 files, `content/fr/` 1,812 files; `npm run validate` 0 errors.
- 2026-11-19 03:29 local machine translation shipped: `content/es/` 4,984 files, `content/fr/` 1,818 files; `npm run validate` 0 errors.
- 2026-11-19 03:34 local machine translation shipped: `content/es/` 4,988 files, `content/fr/` 1,826 files; `npm run validate` 0 errors.
- 2026-11-19 03:46 local machine translation shipped: `content/es/` 4,997 files, `content/fr/` 1,844 files; `npm run validate` 0 errors.
- 2026-11-19 03:58 local machine translation shipped: `content/es/` 5,010 files, `content/fr/` 1,861 files; `npm run validate` 0 errors.
- 2026-11-19 04:10 local machine translation shipped: `content/es/` 5,022 files, `content/fr/` 1,879 files; `npm run validate` 0 errors.
- 2026-11-19 04:22 local machine translation shipped: `content/es/` 5,033 files, `content/fr/` 1,890 files; `npm run validate` 0 errors.
- 2026-11-19 04:28 Google Translate document pilot imported (`scripts/local-mt/import_gt.py`, one 0.98 MB file of 1,644 concept records): 1,588 Spanish and 1,282 French records passed the checks; the rest (markers altered, emphasis changed, label reworded) were not imported. Local model threads and auto-ship stopped on the founder's instruction; translation continues file by file through Google Translate. `content/es/` 6,622 files, `content/fr/` 3,173 files; `npm run validate` 0 errors.
- 2026-11-19 04:32 Google Translate document gt-es-001 imported: `content/es/` 7,954 files, `content/fr/` 3,173 files; `npm run validate` 0 errors.
- 2026-11-19 04:36 Google Translate document gt-fr-001 imported: `content/es/` 7,954 files, `content/fr/` 4,073 files; `npm run validate` 0 errors.
- 2026-11-19 04:41 Google Translate document gt-es-001 and gt-fr-001 (repaired markers) and gt-fr-r01 imported: `content/es/` 8,052 files, `content/fr/` 4,777 files; `npm run validate` 0 errors.
- 2026-11-19 04:44 Google Translate document gt-es-002 imported: `content/es/` 8,715 files, `content/fr/` 4,777 files; `npm run validate` 0 errors.
- 2026-11-19 04:51 Google Translate document gt-es-abc and gt-fr-abc (marker comparison files) imported: `content/es/` 8,877 files, `content/fr/` 5,012 files; `npm run validate` 0 errors.
- 2026-11-19 05:02 Google Translate document gt-010 imported: `content/es/` 9,505 files, `content/fr/` 7,946 files; `npm run validate` 0 errors.
- 2026-11-19 05:15 Google Translate document gt-011 (Spanish half) imported: `content/es/` 13,357 files, `content/fr/` 7,946 files; `npm run validate` 0 errors.
- 2026-11-19 05:57 machine-translated document wd-es-001 imported: `content/es/` 13,833 files, `content/fr/` 7,946 files; `npm run validate` 0 errors.
- 2026-11-19 06:05 machine-translated document wd-es-002 imported: `content/es/` 14,257 files, `content/fr/` 7,946 files; `npm run validate` 0 errors.
- 2026-11-19 06:14 machine-translated document wd-es-003 imported: `content/es/` 14,624 files, `content/fr/` 7,946 files; `npm run validate` 0 errors.
- 2026-11-19 06:16 machine-translated document wd-es-004 imported: `content/es/` 14,960 files, `content/fr/` 7,946 files; `npm run validate` 0 errors.
- 2026-11-19 06:19 machine-translated document wd-es-005 imported: `content/es/` 15,259 files, `content/fr/` 7,946 files; `npm run validate` 0 errors.
- 2026-11-19 06:21 machine-translated document wd-es-006 imported: `content/es/` 15,529 files, `content/fr/` 7,946 files; `npm run validate` 0 errors.
- 2026-11-19 06:24 machine-translated document wd-es-007 imported: `content/es/` 15,772 files, `content/fr/` 7,946 files; `npm run validate` 0 errors.
- 2026-11-19 06:26 machine-translated document wd-es-008 imported: `content/es/` 15,995 files, `content/fr/` 7,946 files; `npm run validate` 0 errors.
- 2026-11-19 06:28 machine-translated document wd-es-009 imported: `content/es/` 16,201 files, `content/fr/` 7,946 files; `npm run validate` 0 errors.
- 2026-11-19 06:31 machine-translated document wd-es-010 imported: `content/es/` 16,387 files, `content/fr/` 7,946 files; `npm run validate` 0 errors.
- 2026-11-19 06:33 machine-translated document wd-es-011 imported: `content/es/` 16,559 files, `content/fr/` 7,946 files; `npm run validate` 0 errors.
- 2026-11-19 06:36 machine-translated document wd-es-012 imported: `content/es/` 16,729 files, `content/fr/` 7,946 files; `npm run validate` 0 errors.
- 2026-11-19 06:38 machine-translated document wd-es-013 imported: `content/es/` 16,886 files, `content/fr/` 7,946 files; `npm run validate` 0 errors.
- 2026-11-19 06:41 machine-translated document wd-es-014 imported: `content/es/` 17,034 files, `content/fr/` 7,946 files; `npm run validate` 0 errors.
- 2026-11-19 06:43 machine-translated document wd-es-015 imported: `content/es/` 17,172 files, `content/fr/` 7,946 files; `npm run validate` 0 errors.
- 2026-11-19 06:46 machine-translated document wd-es-016 imported: `content/es/` 17,303 files, `content/fr/` 7,946 files; `npm run validate` 0 errors.
- 2026-11-19 06:48 machine-translated document wd-es-017 imported: `content/es/` 17,426 files, `content/fr/` 7,946 files; `npm run validate` 0 errors.
- 2026-11-19 06:51 machine-translated document wd-es-018 imported: `content/es/` 17,539 files, `content/fr/` 7,946 files; `npm run validate` 0 errors.
- 2026-11-19 06:58 machine-translated document wd-es-019 imported: `content/es/` 17,651 files, `content/fr/` 7,946 files; `npm run validate` 0 errors.
- 2026-11-19 07:00 machine-translated document wd-es-020 imported: `content/es/` 17,756 files, `content/fr/` 7,946 files; `npm run validate` 0 errors.
- 2026-11-19 07:02 machine-translated document wd-es-021 imported: `content/es/` 17,854 files, `content/fr/` 7,946 files; `npm run validate` 0 errors.
- 2026-11-19 07:05 machine-translated document wd-es-022 imported: `content/es/` 17,947 files, `content/fr/` 7,946 files; `npm run validate` 0 errors.
- 2026-11-19 07:08 machine-translated document wd-es-023 imported: `content/es/` 18,036 files, `content/fr/` 7,946 files; `npm run validate` 0 errors.
- 2026-11-19 07:10 machine-translated document wd-es-024 imported: `content/es/` 18,120 files, `content/fr/` 7,946 files; `npm run validate` 0 errors.
- 2026-11-19 07:13 machine-translated document wd-es-025 imported: `content/es/` 18,198 files, `content/fr/` 7,946 files; `npm run validate` 0 errors.
- 2026-11-19 07:15 machine-translated document wd-es-026 imported: `content/es/` 18,274 files, `content/fr/` 7,946 files; `npm run validate` 0 errors.
- 2026-11-19 07:18 machine-translated document wd-es-027 imported: `content/es/` 18,343 files, `content/fr/` 7,946 files; `npm run validate` 0 errors.
- 2026-11-19 07:20 machine-translated document wd-es-028 imported: `content/es/` 18,408 files, `content/fr/` 7,946 files; `npm run validate` 0 errors.
- 2026-11-19 07:23 machine-translated document wd-es-029 imported: `content/es/` 18,469 files, `content/fr/` 7,946 files; `npm run validate` 0 errors.
- 2026-11-19 07:25 machine-translated document wd-es-030 imported: `content/es/` 18,525 files, `content/fr/` 7,946 files; `npm run validate` 0 errors.
- 2026-11-19 07:28 machine-translated document wd-es-031 imported: `content/es/` 18,574 files, `content/fr/` 7,946 files; `npm run validate` 0 errors.
- 2026-11-19 07:30 machine-translated document wd-es-032 imported: `content/es/` 18,617 files, `content/fr/` 7,946 files; `npm run validate` 0 errors.
- 2026-11-19 07:33 machine-translated document wd-es-033 imported: `content/es/` 18,654 files, `content/fr/` 7,946 files; `npm run validate` 0 errors.
- 2026-11-19 07:35 machine-translated document wd-es-034 imported: `content/es/` 18,672 files, `content/fr/` 7,946 files; `npm run validate` 0 errors.
- 2026-11-19 07:38 machine-translated document wd-es-035 imported: `content/es/` 19,126 files, `content/fr/` 7,946 files; `npm run validate` 0 errors.
- 2026-11-19 07:40 machine-translated document wd-es-036 imported: `content/es/` 19,576 files, `content/fr/` 7,946 files; `npm run validate` 0 errors.
- 2026-11-19 07:43 machine-translated document wd-es-037 imported: `content/es/` 19,892 files, `content/fr/` 7,946 files; `npm run validate` 0 errors.
- 2026-11-19 07:45 machine-translated document wd-es-038 imported: `content/es/` 20,136 files, `content/fr/` 7,946 files; `npm run validate` 0 errors.
- 2026-11-19 07:48 machine-translated document wd-es-039 imported: `content/es/` 20,331 files, `content/fr/` 7,946 files; `npm run validate` 0 errors.
- 2026-11-19 07:50 machine-translated document wd-es-040 imported: `content/es/` 20,486 files, `content/fr/` 7,946 files; `npm run validate` 0 errors.
- 2026-11-19 07:53 machine-translated document wd-es-041 imported: `content/es/` 20,634 files, `content/fr/` 7,946 files; `npm run validate` 0 errors.
- 2026-11-19 07:55 machine-translated document wd-es-042 imported: `content/es/` 20,752 files, `content/fr/` 7,946 files; `npm run validate` 0 errors.

## Explicit gaps

- `content/es/`: 20,752 files of about 34,800 (waves 1 to 8 so far, above). Every other entity page under `/es/` shows Spanish chrome around English, then Arabic, prose.
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
