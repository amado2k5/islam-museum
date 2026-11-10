# Modern Islam Browser: the session prompt (Phase 3 onward)

_Paste everything below the line to a new agent session on the founder's Mac. It is the hand-off from the session that built Phases 1 and 2 (6 November 2026). It is self-contained but does not replace `AGENTS.md`, `docs/ai-change-gates.md` or `docs/modern-islam/prompt.md`; where they differ, those win and you record the difference in the progress file._

---

You are continuing the **Modern Islam Browser** of islam.museum: the museum's entrance to the last fifty years of Islam and Muslims, from 1 Muharram 1396 (3 January 1976) to today and into the upcoming, in Arabic, English and Urdu. Your job in this session is **enrichment**: finish the pilot records that are still thin, then work section by section through the seed programme, writing complete, sourced records with their three prose files, and **pushing merged work every 50 to 100 completed items**. You work unattended, decide by the rules below, write every decision and every excluded item in the progress file, and never deploy.

## 1. Where things stand (6 November 2026)

- **Phase 1 (schema, validator, API) is merged**: PR #4412. The class `award`, the blocks `honours[]`, `footprint`, `reach[]`, `horizon`, `sports[]` (person), `tracks[]` (work), `scope`/`countries` (group), the new kinds and roles, the predicates `performed`, `composed`, `produced_work`, `played_for`, `represented`, `owns`, `organized`, `hosted` and the derived `awarded` all exist. A record's section is **derived** by `scripts/modern/sections.ts` from class, kind and dates; you never type a section.
- **Phase 2 (browser pages, landing card, first pilot batch)** is on the branch `claude/modern-islam-browser-plan-301fbd` and is being merged as this prompt is written. Before you start, run `git log origin/main --oneline | grep -m1 "feat(modern): Phase 2"`. If it is there, start from `main`. If not, wait; do not branch from the feature branch.
- **Nothing is live until the founder deploys.** Merged is not live. Every report you write says which PRs merged and that the founder deploys them.
- **Pilot records already written** (copy their shape): `data/work/thank-you-allah-maher-zain.yaml` (album with tracks, certifications, nomination, dated reach), `data/event/canadian-islamic-history-month.yaml` (heritage month), `data/event/international-day-to-combat-islamophobia.yaml` (declaration, rights), `data/event/fifa-world-cup-2034.yaml` (upcoming, `horizon`, `perspectives`), `data/building/museum-of-islamic-art-doha.yaml`, `data/award/king-faisal-prize.yaml`, `data/award/nobel-prize.yaml`, `data/award/african-footballer-of-the-year.yaml`, `data/award/platinum-album-certification.yaml`, `data/award/anugerah-industri-muzik.yaml`, plus honours on `data/person/mahathir-mohamad.yaml`, `data/person/ahmed-zewail.yaml`, `data/person/mohamed-salah.yaml`. Their prose is under `content/{ar,en,ur}/{work,event,award,building}/`. Their sources are `data/source/wikipedia-*-en.yaml`, `data/source/wikipedia-*-ar.yaml`, `data/source/wikidata-thank-you-allah.yaml`, `data/source/un-observances-anti-islamophobia-day.yaml`, `data/source/canada-ca-combatting-islamophobia-commemorations.yaml`. Stubs for the awarding bodies are in `data/_stubs.d/modern-awards.yaml`.
- **Browser pages exist** at `/<lang>/modern/` (home), `/<lang>/modern/<section>/` (nineteen sections), `/<lang>/modern/year/<y>/`, `/<lang>/modern/country/<cc>/`, `/<lang>/modern/language/<code>/`, `/<lang>/modern/new/`, `/<lang>/modern/top/<list>/`; the strip on every entity page in the window is `site/src/components/ModernStrips.astro`. You do not need to touch `site/` for content work. If you do touch it, see §7.
- **Open follow-ups recorded for later, not yours unless the founder asks:** a map island on the browser home; facet routes per kind; `since` dates on `award/nobel-prize`, `award/platinum-album-certification` and `award/anugerah-industri-muzik` so their own pages enter the window.

## 2. Read first, in this order

1. `AGENTS.md`, then `docs/ai-change-gates.md`.
2. `docs/modern-islam/prompt.md` whole (the operative prompt; you are **Role C** for waves and **Role D** for discovery, one section at a time), `docs/modern-islam/README.md`, `docs/modern-islam/progress.md` (decisions D-000 to D-003, the status entries, the excluded-items table), `docs/modern-islam/seeds.md` (§0 pilot table with its done marks, §0.1 targets and section order, the generators G1–G6, the per-section leads), `docs/modern-islam/taxonomy.yaml` (every kind, award kind, honour result, certification level, horizon stage, reach platform and metric, press kind, genre, sport, firsts tag, reach weights, inclusion rule), `docs/modern-islam/coverage.md`.
3. `docs/plan/26-modern-islam-browser.md` (the plan; §3 data model, §8 editorial, §12 decisions).
4. `docs/agents/workflow.md`, `docs/agents/content-standards.md`, `docs/agents/publication-standard.md`, `docs/sources-policy.md`, `docs/agents/lanes/modern-islam.md`, `docs/agents/lanes/modern-figures.md` (its faith rulings 1 to 6 are the law for every person).
5. `docs/site/browsers.md` (every feature is graph, API and search).
6. The pilot records named in §1 and, for each class you will write, two older records from different authors: `data/person/amr-khaled.yaml` (modern person), `data/event/bishwa-ijtema.yaml` and `data/event/dubai-quran-award.yaml` (recurring events), two `data/screen/*.yaml`, two `data/listing/*.yaml`, two `data/group/*.yaml`, two `data/work/*.yaml` with `kind: website`.

## 3. Set up the session

```bash
cd /Users/ahmedabdelaal/Documents/GitHub/islam-museum
git fetch origin && git worktree add .claude/worktrees/modern-<section>-<date> -b content/modern-<section>-<date> origin/main
```

- Work only inside your worktree. The main checkout's `node_modules` and `site/node_modules` can be symlinked into it (`ln -s ../../../node_modules node_modules; ln -s ../../../../site/node_modules site/node_modules`); if `npm test` complains about a missing package, run `npm install` and `npm --prefix site install` in the worktree instead.
- Check free disk space before any build: `df -h /`. A full `npm run build` writes about 15 GB to `dist/` and takes about 30 minutes; run it in the background and only when §7 says you must. If space runs out, stop and tell the founder; delete nothing on your own.
- `npm run validate` takes a few minutes (about 50,000 entities); `npm test` about 80 seconds (23 files, 353 tests at hand-off). `npm run modern:census` regenerates `docs/modern-islam/coverage.md`; `npm run coverage` regenerates `docs/coverage.md` (after `npm run graph`).
- Dev preview when you want to see a page: the `.claude/launch.json` config `site-dev` serves the worktree's site at `http://localhost:4322`; restart it after any i18n edit.

## 4. Research on the Mac: the browser first, APIs last

Founder's standing instruction (D-002): **use the Mac browser and any tool on the Mac that helps you go online, search, discover and gather; fewer APIs, more browser.**

- **Google Chrome, through the `claude-in-chrome` tools** (load them once with ToolSearch: `tabs_context_mcp, navigate, get_page_text, read_page, find, computer`). Use **one tab** and work **sequentially**: one navigation, read the page text, then the next. On any site where the founder is signed in: one action at a time, pauses between actions, never post, like, follow, comment, download or change a setting. Never solve a CAPTCHA; record the URL in the progress file and move on. The built-in browser (`Claude_Browser` tools) is the fallback for sites that do not need the founder's sign-ins.
- **Wikipedia, in every language that has the article.** Take facts only where the article cites a source for them. Record the article as `data/source/wikipedia-<slug>-<lang>.yaml` (kind `reference_data`) with the URL, the date you read it and the revision: the last-edited date is in the page footer; the revision id is in the "Permanent link" entry of the Tools menu, or on the history page. The Wikidata item id (Q-number) is in the href of "Edit interlanguage links" / the Wikidata item link in the sidebar.
- **Wikidata item pages** in the browser: read the statements and their references; record the item as `data/source/wikidata-<slug>.yaml`. Put the Q-number in `external_ids.wikidata` and the languages of Wikipedia articles with the date checked in `footprint`.
- **Award sites, chart and certification pages, federation databases, broadcasters, publishers, app stores, podcast directories, the Wayback Machine, press archives**: as listed in `prompt.md` §4. Each page you take a fact from becomes a `data/source/<slug>.yaml` record (kind `secondary`, with `issued`, `publisher`, URL, the date checked and a `reliability_note`). Reuse an existing one first: `grep -ril "<domain>" data/source/`.
- **Platform figures** (YouTube, Spotify, Instagram, TikTok, app-store installs, circulation): read them on the page, record them in `reach[]` with platform, metric, value, the date read and the source record. No platform API, no stored API data.
- **Web search** (the `WebSearch` tool) is for finding the page to open, not a source in itself; cite the page you then read in the browser.
- **Apple Vision OCR** for scanned programmes, posters, press clippings and PDF pages: the Mac already has `ocrmac` and `pymupdf` installed for Python; `scripts/harvest/library/ocr_page.py` shows the call (`ocrmac.OCR(png, language_preference=["ar-SA"], recognition_level="accurate").recognize()`; use `["en-US"]`, `["ur-PK"]` or several as the page needs). OCR text is a reading aid: facts from it enter `data/` with the document cited; the OCR text itself never enters git.
- **Install any tool that helps and name it in the progress file**: Homebrew packages, `uv`/`pip`, `npm`, Playwright for repeatable reads of sites that allow it, DuckDB or SQLite for your candidate queue, `yt-dlp` only for the metadata of a page you curated, Ollama or MLX with open-weight models for local Arabic/English/Urdu drafts (name the model in `provenance.model`, review every line, restate only what the sources say). No paid service, no cloud model call from a script.
- **Downloads go only to the microSD** (D-003): `/Volumes/exmicroSD/islam-museum-harvest/modern/<section>/<source-slug>/`. Create the folder. Before any download, claim the item in `/Volumes/exmicroSD/islam-museum-harvest/WORK-REGISTRY.md`. If `/Volumes/exmicroSD` is not mounted, do not download anywhere else; say so in the progress file and keep working from the browser. If you find anything you downloaded on the Mac's main drive, move it to the microSD, delete it from the Mac, and record the move.
- **What enters git**: facts in `data/`, the museum's own prose, citations, dated figures, at most a 40-word cited quotation. **What never enters git**: page dumps, articles, lyrics, posters, videos, OCR text, PDFs, media outside the licence whitelist.

## 5. What you write, and in what order

**A. Finish the pilot (seeds §0; 10 records still thin).** In this order, one or two per batch, enrich without duplicating:

1. `work/islamqa` (web): `url`, `launched` 1997, `languages`, `publisher`, earliest archived capture, `footprint`, `reach`.
2. `screen/al-risala-1976` (film): honours (festivals, awards), reception, `footprint`, `watch[]` official only.
3. `screen/omar-2012` (tv; check `data/screen/` and the existing `data/source/*omar-2012*`): episodes, broadcaster, Ramadan season, reception, honours, `footprint`.
4. `event/bishwa-ijtema` (conferences): `editions[]` with attendance and its status, `footprint`.
5. `work/raheeq` (books): the 1979 Muslim World League prize as an honour (write the `award/` record), editions, translations, `footprint`.
6. `group/islamic-relief` (organizations): `scope`, `countries`, honours, `footprint`, `reach`.
7. `listing/iqraa-tv` (media; new): launch 1998, owner, languages, `footprint`, `reach`.
8. `person/mohamed-salah`: `footprint` and `reach` still to add.
9. `event/dubai-quran-award` (awards): enrich; link to an `award/` record if the prize itself is written.
10. `group/kuwait-finance-house` (enterprise; new), `building/shaykh-zayid-mosque` (built; enrich, and make `building/sheikh-zayed-al-nahyan-mosque` an alias of it), `group/international-islamic-university-malaysia` (learning; new).

Two leads are **held for the founder** and must not be written without his written override: the Islamic Arts Biennale (no Wikipedia article; override would be the Diriyah Biennale Foundation site and press) and the 2007 instrument that created Canadian Islamic History Month (Hansard). They are in the excluded-items table of `progress.md`.

**B. Then the waves (Role C), one section at a time, in the order of seeds §0.1.** For each section: open `docs/modern-islam/progress/<section>.md` (create it from the lane template if missing), run the generators G1–G6 of seeds §0.2 in the browser to build a candidate queue (SQLite or a plain YAML list on the microSD), then write records in batches of at most 25 entities, each complete on the first pass (§5 of `prompt.md` gives the shape per section). Famous and well-documented first; every subject passes the inclusion rule (`prompt.md` §3). Discovery (Role D) runs alongside: as you read, add every new lead you meet to the queue with its source URL, never to `data/` until it is written to standard.

**C. Every record is complete the first time** (`prompt.md` §5): `label` and `summary` in ar, en and ur; its class fields; `relations` written once; `external_ids`; `footprint`; `honours[]` where any award, certification, chart or ranking is sourced; `reach[]` where you read a dated figure; `horizon` where upcoming; `sources`; `provenance` (`layer`, `source`, `generated_by`, `model`, `run: modern-<section>-b<nn>`); `status: { review: published, completeness: 3 }`; dates as date objects (EDTF, Hijri, calendar, precision; conversions `derived`); and three prose files written Arabic first, full and detailed, in the docent's voice.

## 6. Validator lessons from the pilot (save yourself the round trips)

- `names` is not allowed on `event`, `building` or `work`; use `label`, `aliases` and the class's own title fields.
- `dimensions` is a string; `duration` is a number of seconds (an album: `3396`).
- A `perspectives` block's first entry must be the Sunni view and its label must start with the Sunni marker in every language: Arabic «أهل السنة (…)», Urdu «سني (اہلِ سنت) …», English "Sunni (…)". Then the academic view, then any other.
- Prose links use the exact slug: check `ls data/<class>/ | grep <word>` before writing `[[class/slug|label]]` (the pilot had `building/ibn-tulun-mosque`, which is `building/masjid-ibn-tulun`).
- Modern persons (born 1900 or later, or living): `faith.value` naming a school or order needs two independent sources or the validator errors; `unknown` with the attestations in the note is the honest default.
- `made.by_muslims: true` with `basis: unverified` is an error inside the window; use `self-identified` or `documented` with the source, or leave it out.
- An honour needs a real `award/` record, a year or date and a source; `position` only when the award is ranked; `level` only when certified. A `reach` figure needs its date. A `horizon` needs a source and an expected or announced date. A `press` item needs a defined source. `awarded` is derived; never hand-write it.
- A song's or album's prose may not carry a lyric block; the lint rejects it.
- No typed honorific anywhere (the UI renders them); no typed Qur'an text (`[[passage/quran-<sura>-<aya>|label]]` only).
- Shared files are append-only: your stubs go in `data/_stubs.d/modern-<section>.yaml`; never replace `data/_stubs.yaml`, `docs/status.md`, an enum or an i18n file wholesale.

## 7. The cadence: commit per batch, merge every 50 to 100 items

An **item** is a file you completed: a record, a source record, a prose file, an alias change. A **batch** is at most 25 entities with their sources and prose (about 40 to 90 files). The founder's rule for this lane: **a pull request merged every 50 to 100 completed items**, which is every two to four batches, and in any case before you stop, before any long build, and at least every few hours of work. Finished work is never left uncommitted, unpushed or in an open PR.

For every batch:

```bash
npm run validate && npm test && npm run graph && npm run coverage && npm run modern:census
```

Then append the batch to `CANARY.md` under the current version block (grouped by kind, written for readers: which section, how many records, what is notable, "content only, no deployment"), update `docs/modern-islam/progress.md` or your section's progress file (what was written, what was excluded and why, tools installed, CAPTCHAs met, anything moved to the microSD), and commit **explicit paths only**:

```bash
git add data/... content/... docs/... CANARY.md docs/coverage.md docs/modern-islam/coverage.md
git commit -m "content(modern): <section> batch <nn> — <what>" -m "AI-Agent: <tool>" -m "AI-Model: <model>" -m "AI-Editor: Ahmed Abdelaal" -m "Co-Authored-By: <the co-author line your harness gives>"
```

For every push (every 50 to 100 items):

```bash
git fetch origin && git merge origin/main
```

Resolve conflicts keeping both sides (`CANARY.md`: keep both entries; `docs/coverage.md` and `docs/modern-islam/coverage.md`: regenerate, never hand-merge), re-run `npm run validate && npm test`, then:

```bash
git push -u origin HEAD && gh pr create --fill --base main && gh pr merge --merge
```

Merge your own PR at once; no review is required and the founder does not want to be asked. `main` takes pull requests only. Never force-push; never `git add -A`; never `git reset --hard`, `git checkout -- <file>` or `git stash` (the stash is shared across worktrees); never revert another agent's work.

**When a build is required:** only when you changed anything under `site/`, an `i18n/*.yaml`, `schema/`, or a script that the build runs. Then `npm run build` in the background (about 30 minutes, 15 GB) and confirm `checked … pages: 0 errors` and `check-weight: … 0 over budget` before pushing. Content-only batches need validate, test, coverage and census, not the build; the Validate workflow builds every PR anyway.

**Report after every merge**, in chat and in the progress file: the PR numbers, the sections and counts, what was excluded and why (with the gate and the override the founder can use), what failed and the output, and the line "merged, not live: the founder deploys; no Worker or workflow file changed" (or name the file if one did).

## 8. What is next after the pilot

The section order and targets are in seeds §0.1 (≈14,000 records in the first programme, ≈65,000 in reach). Work the sections in that order unless the founder names one. Within a section, start with the leads already listed in `seeds.md` for it, then the generators. When a section's listed leads are exhausted, record the section's state in its progress file and move to the next; the browser never waits for a section to be complete. Keep `docs/modern-islam/seeds.md` current: mark leads done, add leads found in discovery, never delete a lead (move a dropped one to the excluded-items table with its reason).

## 9. Things you never do

Type an honorific. Type, complete or correct Qur'an text. Reproduce lyrics or an article. Embed a player. Infer anyone's religion. Rank by taste. Write "enemy of Islam" or its equivalent in the museum's voice. Reject a source on your own (verify, record the doubt and the override, let the founder decide). Harvest a platform's API. Act on a signed-in account beyond reading. Solve a CAPTCHA. Download to the Mac's main drive. Widen your section. Touch `docs/outreach/*` outside a `submission-impacting` commit. Run `deploy.yml` or `deploy-uat.yml`. Deploy.
