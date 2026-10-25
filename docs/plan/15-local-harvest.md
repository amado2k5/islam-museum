# 15 · The local harvest — drilling every source on your Mac, with no Claude in the loop

This is the operating plan for pulling the raw material of the whole museum (Wikidata, every relevant Wikipedia, the Qur'an text, classical texts, open collections, the Screen index, directories and the open web) **on your own Mac**. Nothing in this document calls Claude or any other cloud model. The network is used only to download sources. Parsing, filtering, extraction, classification, translation drafts and verification all run on the machine, with local scripts and open-weight models.

It is the local executor for the stages of `09-ai-content-pipeline.md`, and it feeds `12-screen-index.md`, `13-figures.md` and `14-themes-atlas.md`. The quality gates do not change: retrieved text before any claim, two sources for dated facts, quote spans, a judge, human review, pull requests.

> The commands below were written from each tool's documentation in October 2026 and have **not been run on your machine**. Sizes and limits marked "check" could not be confirmed from the source's own page. Run each step once by hand before putting it in a batch.

## 1. What runs where

| Step | Where | Uses |
|---|---|---|
| Download dumps, datasets and pages | Your Mac | `aria2c`, `curl`, `ia`, polite crawler |
| Parse, filter, index | Your Mac | Python, DuckDB, SQLite FTS5, `lbzip2` |
| Classify, extract claims, propose links, draft, translate | Your Mac | Ollama or MLX with open-weight models |
| Judge and rule checks | Your Mac | A second local model of a different family, plus rules |
| Validate, commit, open pull requests | Your Mac | `npm run validate`, `git`, `gh` |
| Review | You and other reviewers | GitHub |
| Claude | Not in this path | Optional elsewhere: writing the scripts once (Prompt T in `07-prompts.md`), or a second opinion on contested drafts if you ever choose to ask |

## 2. The machine and the disk

Your Mac (Apple M4 Max, 128 GB unified memory, macOS 26; Homebrew and uv installed, as in `10-image-generation.md`) is enough for everything here, including two 30B-class models loaded at once.

Disk is the constraint. Keep the harvest **outside the git repository and outside iCloud**, ideally on an external SSD.

| Item | Compressed size | Keep? |
|---|---|---|
| Nine core Wikipedias, `pages-articles-multistream` (en 25.1, fr 6.7, ar 2.0, fa 1.5, id 1.2, tr 1.1, bn 0.5, ur 0.5, ms 0.4 GiB) | about 39 GiB | Yes |
| Their `categorylinks` and `page` SQL dumps | about 6 GiB | Yes |
| Second ring of Wikipedias (de, es, ru, zh, hi, and the smaller languages of §6.2) | check on the dump index; plan 30 GiB | Yes |
| Wikidata `latest-all.json.bz2` | 96 GiB | **Stream once, then delete**; keep only the subset (a few GB) |
| OpenITI 2025.1.9 | 5.9 GB | Yes, in the non-commercial layer |
| GeoNames, Pleiades, Hathifiles, Met and Smithsonian tables | about 5 GB | Yes |
| Two local language models and an embedding model | about 45 GB | Yes |
| Parsed text, indexes, embeddings, caches | plan 100 GB | Yes |
| **Working total** | **about 250–300 GB**, plus 100 GB free while the Wikidata dump is streaming | |

**Do not download:** the OpenAlex snapshot (about 1.5 TB), the Crossref public data file (208 GB), the Commons media-info dump (57 GiB), the English Kiwix file with pictures (119 GB), OpenStreetMap continent extracts, or Common Crawl archives. Use their APIs.

**Optional, if you add a 2 TB external SSD:** a full local Wikidata query service with QLever (its documentation asks for at least 32 GB of RAM, better 64 GB, and about 2 TB of disk; its Homebrew package is built for Apple silicon). That gives unlimited SPARQL with no rate limits. It is a convenience, not a requirement.

## 3. Workspace and the licence layers

```
/Volumes/Harvest/islam-museum-harvest/        (or ~/islam-museum-harvest if internal)
  sources.yaml            the registry: every source, its licence, method, limits, last fetch, checksum
  raw/                    downloads exactly as received (never edited)
    wikidata/  wikipedia/<lang>/  quran/  openiti/  collections/  directories/  web/
  layers/                 parsed data, separated by what the licence allows
    cc0/                  Wikidata, Met, Smithsonian, Europeana and DPLA metadata, our own research
    by/                   Tanzil (verbatim), Pleiades, GeoNames, Curlie, ACNC
    by-sa/                Wikipedia text, TVmaze            → pointers and context only; never merged into cc0
    odbl/                 OpenStreetMap extracts            → separate layer, share-alike
    nc/                   OpenITI, Smarthistory             → read and rewritten with citations; text never republished
    pd/                   public-domain classical texts (Ibn Hisham, al-Tabari…) as scanned or extracted
    copyrighted-reference/ modern books and editions (الرحيق المختوم, tahqiq apparatus) → read and rewritten with citations
    link-only/            IDs and URLs for IMDb, TMDB, national film databases, closed directories
    unverified/           anything whose licence is not yet confirmed; record it and cite it when used
  db/                     harvest.duckdb, text.sqlite (FTS5), vectors
  candidates/             proposed entities as YAML, waiting for validation
  logs/  reports/
```

**The layers are a record, not a wall** (founder's rule of 15 October 2026, `docs/sources-policy.md`): any layer may be read and rewritten in the museum's own words with a citation, and its facts enter `data/` (CC0) with the source cited. `provenance.layer` says where a thing came from; the validator records it and no longer rejects a layer. What never enters git is the same for every layer: verbatim text beyond a 40-word quotation, the raw files, and bulk copies of a database (`odbl`, `link-only`: identifiers as pointers only).

## 4. Setup

```bash
# download and stream tools: resumable downloads, parallel bzip2, a local analytical database, JSON and search utilities
brew install aria2 lbzip2 duckdb sqlite jq ripgrep tmux gh
```

```bash
# the harvest workspace with its layer folders (change the path if you are not using an external drive)
export HARVEST=/Volumes/Harvest/islam-museum-harvest && mkdir -p $HARVEST/{raw/{wikidata,wikipedia,quran,openiti,collections,directories,web},layers/{cc0,by,by-sa,odbl,nc,link-only,unverified},db,candidates,logs,reports}
```

```bash
# an isolated Python 3.12 environment for the harvest scripts
cd ~/Documents/GitHub/islam-museum && uv venv --python 3.12 .venv-harvest && source .venv-harvest/bin/activate && uv pip install mwxml mwparserfromhell libzim trafilatura scrapy httpx orjson duckdb pyyaml tqdm rapidfuzz internetarchive ollama
```

```bash
# the local model runner; it serves an API on http://localhost:11434
brew install ollama && brew services start ollama
```

```bash
# an extractor, a judge from a different model family, and a multilingual embedding model (check the Ollama library for the newest tags that fit; these names are examples)
ollama pull qwen3:32b && ollama pull gemma3:27b && ollama pull bge-m3
```

```bash
# keep the Mac awake for long runs, inside a detached session you can re-attach with: tmux attach -t harvest
tmux new -s harvest 'caffeinate -dims zsh'
```

Models: for extraction across Arabic, Persian, Turkish, Urdu, Indonesian and the rest, use the newest Apache-2.0 multilingual model of about 27–35B that Ollama lists (the Qwen 3.x family at the time of writing), and a different family as judge (Gemma 4 is reported as Apache 2.0; Gemma 3 has its own terms of use, so read the licence of whichever tag you pull). The Arabic-specialised models (Jais, ALLaM, Fanar) cover Arabic and English only and are useful as a third opinion on Arabic sources. Record the exact tag and digest of every model in each run's provenance.

## 5. Rules of the road

1. **Registry first.** No source is fetched unless it has an entry in `sources.yaml` with its licence, layer, method and limits. A source with an unknown licence may be fetched only into `unverified/`.
2. **Dumps before APIs, APIs before pages.** A dump costs the provider one download; a crawl costs them thousands of requests.
3. **Identify yourself.** Every request carries `User-Agent: islam-museum-harvest/0.1 (https://islam.museum; <your contact email>)`. Wikimedia requires a descriptive User-Agent, including for dump downloads, and gives identified clients much higher limits than anonymous ones.
4. **Be slow on purpose.** At most 2 connections to Wikimedia dump servers. API calls in series with a pause, `maxlag=5` on the Wikimedia Action API, back off on HTTP 429. Crawlers obey `robots.txt` and wait at least one second between requests to a host.
5. **Never touch a source that forbids it.** Off-limits for harvesting: the Quran Foundation API (no storage beyond a week, no redistribution, no build-time bundles), Zabihah, Mawaqit, YouTube API data, and any site whose terms prohibit automated collection.
6. **Raw files are read-only.** Record a SHA-256 for every download. All transformation happens in `layers/`.
7. **Everything resumable.** Each script keeps a checkpoint; a run that is interrupted continues where it stopped.

## 6. The drills

### 6.1 Wikidata: the skeleton

Purpose: identifiers, labels in every language, dates, coordinates and relations for people, places, events, polities, works, organisations, screen titles and theme entities. CC0.

**Step 1, seed sets by query** (small, fast, repeatable). Scripts in `scripts/harvest/wikidata/queries/` hold one SPARQL file per class and signal, paginated, run in series against `query.wikidata.org`:

- everything whose `main subject`, `religion or worldview`, `field of work`, `depicts`, `genre` or `part of` points into the Islam subtree
- humans with relevant occupations and positions (the lists of `09` §4), and everyone who `participated in` or commanded in a seed conflict, **on every side** (`13-figures.md` §4)
- conflicts, treaties, councils, conferences and schisms linked to seed polities and groups; organisations by type; mosques, madrasas and shrines
- audiovisual works found by the signals of `12-screen-index.md` §5
- members of the Wikipedia categories of §6.2, through their sitelinks

**Step 2, one pass over the dump for closure.** Stream the full dump once, keep every seed entity and every entity one hop away from a seed in either direction, write the subset as Parquet, then delete the dump.

```bash
# download the full Wikidata JSON dump (96 GiB; two connections only; resumable)
aria2c -x2 -s2 -c --user-agent="islam-museum-harvest/0.1 (https://islam.museum; you@example.org)" -d $HARVEST/raw/wikidata https://dumps.wikimedia.org/wikidatawiki/entities/latest-all.json.bz2
```

```bash
# stream it through the subset filter without ever decompressing to disk; seeds.txt holds one QID per line from step 1
lbzip2 -dc $HARVEST/raw/wikidata/latest-all.json.bz2 | python scripts/harvest/wikidata/filter_dump.py --seeds $HARVEST/db/seeds.txt --hops 1 --out $HARVEST/layers/cc0/wikidata/
```

The filter reads one entity per line (the dump's format), so it needs little memory; it is the slowest single job in the harvest, so start it in the evening and time the first run. Refresh quarterly; between refreshes, a weekly query job picks up changes to entities we already hold.

Output tables in `harvest.duckdb`: `wd_entity`, `wd_label`, `wd_claim`, `wd_sitelink`, `wd_external_id`. The existing import scripts (`07-prompts.md` Prompt F) read from these tables instead of the live service.

### 6.2 Wikipedia, in every language that matters

Purpose: discovery and context. Wikipedia tells us **what exists, how it is categorised, and which books and articles it cites**. It is never the cited source (`05-editorial.md` §4), and its prose is never copied: it lives in the `by-sa` layer.

**Languages.** First ring: en, ar, fa, tr, ur, id, ms, bn, fr. Second ring: de, es, ru, zh, hi, ha, sw, so, bs, sq, az, uz, kk, tt, ku, ps, pa, sd, ta, ml, th, ja, ko, it, nl, pt. Then any language where the coverage page shows a gap.

```bash
# for each language: the article dump, its index, the page table and the category links (repeat with the other language codes)
for f in pages-articles-multistream.xml.bz2 pages-articles-multistream-index.txt.bz2 page.sql.gz categorylinks.sql.gz; do aria2c -x2 -s2 -c --user-agent="islam-museum-harvest/0.1 (https://islam.museum; you@example.org)" -d $HARVEST/raw/wikipedia/ar https://dumps.wikimedia.org/arwiki/latest/arwiki-latest-$f; done
```

**Selecting the pages.** A page is in scope when at least one strong signal or two weak ones hold:

| Signal | Strength |
|---|---|
| Its Wikidata item is in the subset of §6.1 | Strong |
| It sits within 3 levels of a seed category (Islam, History of Islam, Muslims, Islamic studies, Films about Islam, Islamic websites, Islamic organisations, and their equivalents in each language, mapped through Wikidata) | Strong |
| It sits 4–6 levels below a seed category | Weak (category trees leak: "Islam" reaches "Muslim-majority countries" and from there everything) |
| Its title or first paragraph matches the per-language term list | Weak |
| At least five in-scope pages link to it | Weak |

The category walk runs offline from the `categorylinks` and `page` dumps loaded into DuckDB, with a stop-list of categories that leak. Every selected page keeps the signals that selected it.

**What is taken from each page:**

- the Wikidata QID, all interlanguage titles, redirects and alternative names (for search and reconciliation)
- categories (as theme signals for `14-themes-atlas.md`)
- infobox fields, as **unconfirmed hints** for the extraction stage
- **the references**: every cited book, article and URL, with ISBN and DOI where present. These are the leads to real sources and the most valuable thing Wikipedia gives us. They become `source` candidates, ranked by how many in-scope pages cite them
- section text, stored in `text.sqlite` with full-text search and embeddings, as local context for the models
- red links and "wanted" names, which feed the stub list

```bash
# parse one language: select in-scope pages, then write text, infobox hints, references and links to the by-sa layer
python scripts/harvest/wikipedia/select_pages.py --lang ar --seeds scripts/harvest/wikipedia/seed-categories.yaml --max-depth 6 && python scripts/harvest/wikipedia/extract.py --lang ar --dump $HARVEST/raw/wikipedia/ar --out $HARVEST/layers/by-sa/wikipedia/ar
```

Dumps are produced monthly; refresh the first ring each quarter. For the occasional single page, the Wikimedia API is fine within the rules of §5. Kiwix files (English without pictures about 49 GB, Arabic about 8 GB) are an alternative if rendered HTML is ever needed; the XML dumps are enough for this plan.

### 6.3 The Qur'an text

The Qur'an is the one text where a single wrong character is unacceptable, so this drill is short, manual at the critical step, and verified three ways.

**Source:** the Tanzil project's verified text, version 1.1. Its licence allows copying and distributing **verbatim** copies; the text may not be changed; the source must be indicated with a link to tanzil.net; and the copyright notice must stay in every copy.

1. **Download by hand** from https://tanzil.net/download/: the **Uthmani** text and the **Simple Clean** text, each as "Text (with aya numbers)". Save them as `raw/quran/tanzil-uthmani-v1.1.txt` and `raw/quran/tanzil-simple-clean-v1.1.txt`. Do this once, in a browser, and read the licence page while you are there.
2. **Record the checksum and verify the structure** with the script below: 114 suras, 6,236 ayat, every sura's ayah count against the standard table, no gaps, and the Tanzil notice present.
3. **Second witness.** Download the King Fahd Complex's Hafs text (Madinah Mushaf) from its developer pages by hand and compare ayah by ayah. Differences will be orthographic conventions; the script reports them and **changes nothing**. Any difference in a word is investigated by a person against a printed mushaf.
4. **Generate the museum files**: `work/quran`, 114 sura records and 6,236 `passage` records (`passage/quran-2-255` and so on), each carrying the Uthmani text exactly as in the file, the Tanzil attribution and link, and `text_search` from Tanzil's own Simple Clean file. The museum never produces its own "normalised" Qur'an text.
5. **Freeze.** The generated files are committed once with their source checksum. The validator re-checks on every build that the ayah text still matches the raw file byte for byte, so no later edit, script or model can alter it.

```bash
# verify the downloaded Qur'an text: checksum, 114 suras, 6,236 ayat, per-sura counts, licence notice (reads only; exits non-zero on any problem)
python scripts/harvest/quran/verify_quran.py $HARVEST/raw/quran/tanzil-uthmani-v1.1.txt
```

`scripts/harvest/quran/verify_quran.py`:

```python
#!/usr/bin/env python3
"""Verify a Tanzil Qur'an text file (format: "text with aya numbers", sura|aya|text). Reads only; never rewrites the file."""
import hashlib, sys

AYAT = [7,286,200,176,120,165,206,75,129,109,123,111,43,52,99,128,111,110,98,135,112,78,118,64,77,227,93,88,69,60,
        34,30,73,54,45,83,182,88,75,85,54,53,89,59,37,35,38,29,18,45,60,49,62,55,78,96,29,22,24,13,14,11,11,18,12,12,
        30,52,52,44,28,28,20,56,40,31,50,40,46,42,29,19,36,25,22,17,19,26,30,20,15,21,11,8,8,19,5,8,8,11,11,8,3,9,5,4,7,3,6,3,5,4,5,6]
assert len(AYAT) == 114 and sum(AYAT) == 6236

path = sys.argv[1]
raw = open(path, "rb").read()
print("sha256", hashlib.sha256(raw).hexdigest())
counts, last, errors, notice = {}, {}, [], False
for n, line in enumerate(raw.decode("utf-8").splitlines(), 1):
    if not line.strip():
        continue
    if line.startswith("#"):
        notice = notice or "tanzil" in line.lower()
        continue
    parts = line.split("|", 2)
    if len(parts) != 3 or not parts[2].strip():
        errors.append(f"line {n}: not sura|aya|text"); continue
    sura, aya = int(parts[0]), int(parts[1])
    if aya != last.get(sura, 0) + 1:
        errors.append(f"line {n}: sura {sura} aya {aya} out of sequence")
    last[sura] = aya
    counts[sura] = counts.get(sura, 0) + 1
for s, expected in enumerate(AYAT, 1):
    if counts.get(s) != expected:
        errors.append(f"sura {s}: {counts.get(s)} ayat, expected {expected}")
if not notice:
    errors.append("Tanzil copyright notice missing: the licence requires it to stay in every copy")
print("suras", len(counts), "ayat", sum(counts.values()))
print("\n".join(errors) if errors else "OK: 114 suras, 6,236 ayat, notice present")
sys.exit(1 if errors else 0)
```

The script's logic was tested on synthetic files (a complete one passes; one with a missing ayah and no notice fails). It has not yet been run on the real Tanzil file, whose exact layout you should confirm on first download.

**Translations** are a separate, slower matter, because each has its own rights:

| Translation | Status | Action |
|---|---|---|
| George Sale (1734) · J. M. Rodwell (1861) · E. H. Palmer (1880) | Public domain by age | Ingest from a clean scan-based edition, with the edition recorded |
| Marmaduke Pickthall (1930) | In the US public domain since 1 January 2026 (1930 publications); the translator died in 1936 | Ingest **the 1930 text only**, not later revised editions; confirm the edition before use |
| Abdullah Yusuf Ali (1934–1938) | Status in the United States unclear | Do not ingest; link out |
| Translations distributed by Tanzil, QUL, and the many GitHub collections | Each belongs to its translator or publisher, whatever licence the repository states | Use only those whose rights holder clearly permits redistribution; record the permission per version; otherwise link out |
| Quran.com (Quran Foundation API) | Storage and redistribution not permitted | Never harvested; deep links only |

Tarteel's QUL library offers scripts, layouts, word-by-word data and translations as SQLite and JSON files with per-resource rights; it is useful later for the Words hall, resource by resource, each checked. Audio is out of scope for this harvest.

### 6.4 Hadith and the classical library

- **OpenITI** release 2025.1.9 from Zenodo (5.9 GB, CC BY-NC-SA) into the `nc` layer: the biographical dictionaries, chronicles, maghazi and heresiographies that supply Hijri dates, teacher–student links, both sides of every conflict (`13`) and the history of sects (`14`). The models read it locally; only short quotations with locators leave the layer.
- **Hadith collections:** the classical Arabic text is public domain, but the available datasets have unclear licences and mixed numbering. They go to `unverified/` until each is checked; the site deep-links to sunnah.com meanwhile.
- **Public-domain translations and older scholarship** from the Internet Archive with the `ia` tool, item by item, rights checked per item.

### 6.5 Open collections, gazetteers and scholarship

| Source | How | Layer |
|---|---|---|
| Met Open Access · Smithsonian Open Access | Their published tables and bucket; filter to Islamic-world objects | `cc0` |
| Pleiades · GeoNames | Dumps | `by` |
| Atlas of Islamic History tables · Early Islamic Mosques Database | Zenodo and Open Context downloads (confirm licence text first) | `by` |
| Europeana · DPLA | APIs with a free key | `cc0` |
| Hathifiles | Monthly file, to find public-domain scans | `cc0` |
| OpenAlex | API with a free key (daily credit limit), queries by topic and by the references found in §6.2 | `cc0` |
| Library of Congress | API, 20 requests a minute | per collection |
| Encyclopaedia Iranica · Diyanet İslam Ansiklopedisi · Encyclopaedia of Islam | Read and cite one article at a time; no bulk copying | cite only |

### 6.6 The Screen index

Runs the discovery of `12-screen-index.md` §5 from what is already on disk: graph-driven queries against the local Wikidata subset, the category trees of each Wikipedia, and the keyword sweep. National film databases are consulted by a person or by a crawler that records only title, year and identifier into `link-only/`. IMDb's non-commercial files may be held locally to check a year or an alternative title and are never copied out. Output: `candidates/screen/*.yaml` and a file of proposed additions for Wikidata.

### 6.7 Directories

Directories supply candidates for the Made wing (`11`), for organisations, charities, websites and conferences (`14`). A directory entry is a lead, never a fact about anyone's religion: the basis rules of `11-made-directory.md` still decide what is published.

| Directory | Access | Use |
|---|---|---|
| Charity Commission for England and Wales | Daily full download and an API, Open Government Licence | Filter by classification and stated purposes; verify each by hand |
| ACNC register (Australia) | Weekly download, CC BY | Same |
| IRS exempt-organisations file (United States) · Canada's list of charities | Downloads or by request | Same |
| OpenStreetMap places of worship tagged Muslim | Query in small regions through Overpass, or regional extracts | `odbl` layer only: counts and maps, never merged into the CC0 data |
| Curlie (the successor of DMOZ), Islam categories | Data dump, CC BY 3.0 | Seed list for "famous Islamic websites"; each checked and archived |
| Wikipedia "Islamic websites", "Islamic organisations", "Islamic conferences" categories | From §6.2 | Pointers |
| OIC and its organs · ICESCO · AAOIFI members · national councils | Wikidata first; official pages read politely | Organisations |
| Halal certifiers and standards bodies | Wikidata and official pages; certifier look-up pages used by hand | Record the body and link to its register; never copy a register |
| Mosque directories run by communities (for example MuslimsInBritain.org) | Ask permission; acknowledge | With consent only |
| Zabihah · Mawaqit · closed commercial directories | Not harvested | None |

### 6.8 The open web

For official pages of institutions, texts of declarations, conference records and press archives: a Scrapy crawler with `ROBOTSTXT_OBEY = True`, a one-second delay, an HTTP cache and the harvest User-Agent, started from a hand-approved list of hosts in `sources.yaml`. `trafilatura` extracts the main text. Full text stays in the local cache; the repository receives quotations with URLs and an Internet Archive snapshot link.

### 6.9 Audio and video lectures

Purpose: a speaker's own recorded lessons as primary sources for what he teaches and says. Full method, rights and checks: [`docs/agents/audio-video-harvest.md`](../agents/audio-video-harvest.md). Summary: discover the episode media links in the browser pane; download politely with `scripts/harvest/audio/download.py` (identified User-Agent, two-second pause, SHA-256 per file); convert and probe with `ffmpeg`; transcribe offline with `scripts/harvest/audio/transcribe.py`, which calls `mlx-whisper` with `mlx-community/whisper-large-v3-mlx` (the large model: the turbo model was faster but measurably weaker on Arabic lectures); a transcript line is used only under the verification rule of `audio-video-harvest.md` §2 (clear line, second pass agreement for names, numbers and dates, or a person's listening at the anchor). Layer: `copyrighted-reference` (read and rewritten; audio and transcripts never leave the harvest workspace). YouTube-hosted lectures are never downloaded (§5 rule 5). First speaker: Omar Abdelkafy (`lanes/omar-abdelkafy.md`).

## 7. The local model passes

All through Ollama's API with a JSON schema in the `format` field, so every answer is machine-checkable.

| Pass | Model | Input → output |
|---|---|---|
| Relevance | Extractor | A page or record → in scope or not, which themes, with the sentence that shows it |
| Claims | Extractor | A source text → claims `{claim, value, calendar, quote, locator}`; no quote, no claim |
| Relations and roles | Extractor | Claims → proposed edges and `story_roles` with dates, on every side of a conflict |
| Reconciliation | Extractor plus rules | Two records → same entity or not, using IDs, dates, places and name forms |
| Judge | A different model family | Each claim against its quote → supported, partly, unsupported, contradicted |
| Rules | Code | Chronology, calendar agreement, geography, domain and range, licence layer |
| Draft | Extractor | Verified claims → YAML and prose in the house voice, `status: draft` |
| Translation | Extractor | English ↔ Arabic with the glossary enforced and a back-translation check |

Discipline that makes local models trustworthy enough to be worth reviewing:

- **A gold set first.** Before any batch, 200 hand-checked examples per pass. A model and prompt go into production only when they meet the bar (for claims: at least 95 % supported on review). Re-run the gold set whenever the model or prompt changes.
- **Arabic, Persian and Turkish sources are read in the original**, not through translation.
- **The Qur'an text is never generated, completed or "corrected" by a model.** Models may point to a passage by reference (2:255); the text always comes from the frozen files of §6.3.
- **Two different models must agree, or a person decides.**
- **Provenance on every candidate:** scripts and versions, model tags and digests, prompts by hash, sources, layer, date, `machine: local`.

## 8. From harvest to museum

```
candidates/<class>/<slug>.yaml  →  npm run validate (schema, dates, links, licence layer, lints)
                                →  copied to data/ and content/ on a branch, status: imported or draft
                                →  gh pr create, one batch of at most 25 entities, with the judge's flags
                                →  human review (tiers of 09)  →  merge  →  build
```

```bash
# validate a batch of candidates and open a pull request for review (nothing merges without a person)
python scripts/harvest/promote.py --batch $HARVEST/candidates/screen --limit 25 && npm run validate && git checkout -b harvest/screen-batch-001 && git add data content && git commit -m "content(harvest): screen batch 001" && gh pr create --fill
```

## 9. Running it unattended

```bash
# one command that reports where every drill stands: downloads, parsed pages, candidates, failures, disk left
python scripts/harvest/status.py
```

```bash
# follow the log of the running drill
tail -f $HARVEST/logs/harvest.log
```

- Long jobs run inside the `tmux` session of §4 with `caffeinate`.
- A weekly `launchd` job (Sunday night) refreshes the Wikidata changes, checks links and writes `reports/weekly.md`; a quarterly one refreshes the dumps. Each job checks free disk space first and stops cleanly below 50 GB.
- Every script is restartable from its checkpoint and writes one line per item to the log with a status.

## 10. Order of work

| Day | Drill | Result |
|---|---|---|
| 1 | Setup (§4); `sources.yaml`; Qur'an download and verification (§6.3) | The Qur'an text frozen and checked; the registry in place |
| 1–2 | Wikidata seed queries; start the dump stream overnight | Seed sets; subset tables |
| 2–3 | First-ring Wikipedia dumps; category walk; page extraction | In-scope pages, references ranked, stubs |
| 4 | Gold sets for relevance and claims; choose models | Measured accuracy per pass |
| 5–6 | Spine entities: both sides of the Prophetic-era events (`13`); first Screen index batch (`12`) | First pull requests |
| 7–8 | OpenITI; open collections; directories | Objects, places, organisations, website candidates |
| 9–10 | Theme tagging (`14`); coverage report; second-ring Wikipedias downloading | The first honest coverage grid |
| Then | Cell by cell and theme by theme, per the coverage report | Weekly batches |

## 11. The legal walls in one table

Superseded on 15 October 2026 by `docs/sources-policy.md`: every row may be read and rewritten in the museum's own words with a citation, and its facts enter the CC0 data. The table now records only what may be republished verbatim.

| Source | May we store it locally? | May its facts enter the CC0 data? | May we republish its text? |
|---|---|---|---|
| Wikidata, Met, Smithsonian, Europeana and DPLA metadata | Yes | Yes | Yes |
| Tanzil Qur'an text | Yes | As a verbatim text with attribution, in its own files | Verbatim only, with notice and link |
| Pleiades, GeoNames, Curlie, ACNC | Yes | Yes, with attribution | With attribution |
| Wikipedia | Yes | Yes, rewritten and cited to the underlying sources (Wikipedia itself stays a pointer, for reliability) | Only as CC BY-SA, which we do not mix in |
| OpenStreetMap | Yes | Facts from our own reading, yes; a bulk copy of the database, no | Only as ODbL, kept separate |
| OpenITI | Yes | Yes, rewritten and cited | Short quotations only |
| IMDb files, TMDB, national film databases | IMDb locally yes; others as look-ups | Facts from our own reading, yes; a bulk copy, no; identifiers as pointers | No |
| Quran Foundation API, Zabihah, Mawaqit, YouTube API data | No | Facts from our own reading, yes; their data, no | No |
| Recorded lectures on an open archive (Assabile, for Omar Abdelkafy) | Audio and transcripts in the harvest workspace only | Yes, rewritten and cited by series, episode and timestamp | No |

## 12. Risks

| Risk | Mitigation |
|---|---|
| A local model invents facts | Quote-span rule; second-family judge; rules; gold sets; human review; draft label |
| An error in the Qur'an text | Verbatim Tanzil file; checksum; structural check; second witness; byte-for-byte build check; models never write scripture |
| Verbatim third-party text leaks into the museum's text | Everything is rewritten in the museum's own words; quotations at most 40 words; `provenance.layer` records the origin (`docs/sources-policy.md`) |
| Getting blocked by a source | Dumps first; identified User-Agent; low rates; back-off |
| Disk fills mid-run | Budget of §2; free-space guard; delete the Wikidata dump after filtering |
| The Mac sleeps or reboots | `tmux`, `caffeinate`, checkpoints |
| Category trees drag in the whole encyclopaedia | Depth limits, stop-list, two-signal rule, sampling |
| Directory entries treated as facts about belief | Leads only; the basis rules of `11` and the faith rules of `13` |
| Stale harvest | Weekly and quarterly jobs; dates on everything |

## 13. Acceptance tests

1. With the network cable out, every pass of §7 still runs on already-downloaded material.
2. A network log of a full harvest day shows requests only to hosts listed in `sources.yaml`, and none to any model provider.
3. `verify_quran.py` passes on the Uthmani file; changing one character in a generated `passage` file fails the build.
4. A candidate whose only support is Wikipedia text is rejected by the validator.
5. A candidate carrying `provenance.layer: nc` text beyond a short quotation is rejected.
6. The category walk for Arabic returns the members of تصنيف:أفلام عن الإسلام and does not return every city in a Muslim-majority country.
7. Killing a drill mid-run and restarting it produces the same output as an uninterrupted run.
8. The gold-set report shows the measured accuracy of each pass for the models in use, and the run refuses to start a batch below the bar.
