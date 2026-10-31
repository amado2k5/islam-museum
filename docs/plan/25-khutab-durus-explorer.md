# 25 — The Khutab and Durus Explorer: sermons, lessons, study circles and conferences (proposal)

Companion of the Fatwa Explorer (plan `07-prompts.md` §U; the khutab prompt is §V). Written for approval under `docs/ai-change-gates.md` §1: **nothing in this document is built until the founder approves it.** Discovery (section 3 below) touches no repository file and may run while this waits.

The museum records sermons and lessons as history and as a guide to who taught what, where and when. It never preaches, and it repeats no exhortation in its own voice: every page describes what the speaker said, attributes it, and labels it. The landing page and every sermon page say so, in Arabic, English and Urdu.

## 1 · What already exists (checked 31 Oct 2026)

- `work.kind` enum already contains `sermon`, `lecture-series`, `podcast`, `website` (`schema/enums/kinds.yaml`, added for plan 14). `event.kind` contains `conference`, `gathering`, `council`, `congress`.
- `data/work/farewell-sermon.yaml` already uses `kind: sermon`. Stubs: `work/majmuat-khutab`, `work/khutbat-al-ajra` (khutba collections filed as `kind: book`), `work/dars-e-tirmidhi`. `concept/khutba-fiqh` exists (the fiqh of the khutba, from the fiqh encyclopedia lane).
- Registered recording sources: `source/assabile-omar-abdelkafy`, `source/assabile-tareq-al-suwaidan` — the citation-anchor method `{cite:<source> <series>/<ep> <hh:mm:ss>}` of `docs/agents/audio-video-harvest.md` §5 applies to sermons and lessons unchanged.
- Predicates that already fit: `part_of`/`has_part` (lesson in a series; a talk in a conference programme), `responded_to`, `about`, `authored`, `issued` (an official ministry khutba issued by a group), `student_of` (person → person, the teacher chain), `convened`/`attended` (conferences), `publishes`, `occurred_at` (event → place).
- Roles enum has `scholar`, `teacher`; missing `khatib`, `imam`, `preacher`.
- Explorer machinery to reuse: the surah explorer (`site/src/pages/[lang]/surah/`, `ExplorerModule.astro`, `ExploreBar.astro`), `HijriTimeline.astro` + `timeline.ts`/`timeline-layout.ts`, `TimeStrip.astro`, the constellation graph (`/ar/graph/?from=`, `export-api.ts`), Pagefind facets, the plan-20 opinions/perspectives component, `scripts/harvest/audio/{download.py,transcribe.py}`, `scripts/harvest/library/` (fetch, `ocr_all.py` with `--cat`).

## 2 · The data model

**One sermon or one lesson = one `work`.** A series (a halaqa that read a book over months, a Ramadan series, a televised programme) = `work kind: lecture-series`, with the single lessons `part_of` it carrying `order`. A conference or seminar = `event kind: conference` (or `gathering` when it is not a formal conference), with its papers and talks as `work`s `part_of` it.

### Schema additions proposed

| Where | Addition | Type / values | Why an existing field does not fit |
|---|---|---|---|
| `schema/enums/kinds.yaml` | `work.kind` gains `lecture` | one value | a single dars, lecture or talk is not a `sermon` (no ritual frame) and not a `book` |
| new `schema/enums/sermon-type.yaml` | `sermon-type` | `jumu'a`, `eid-al-fitr`, `eid-al-adha`, `istisqa`, `kusuf`, `hajj-arafa`, `nikah`, `occasion`, `farewell`, `other` | the kind of khutba drives the explorer's filters; `kind: sermon` alone cannot say which |
| `schema/work.schema.json` (via `scripts/gen-schema.ts`) | `sermon_type` | one `sermon-type` value, only when `kind: sermon` | — |
| same | `delivered` object | `{ by: person/group ref, co_speakers: [refs], moderator: ref }` | `authored` says who wrote a text; a sermon or lesson is delivered, often by someone other than the writer (the official ministry khutba is written by the ministry, delivered by the local khatib) |
| same | `host` | ref to `building` / `group` / `work` (programme) | where or under whose roof it was delivered |
| same | `audience` | short string per language + optional refs | "the Friday congregation", "students of X", "a broadcast audience" |
| same | `occasion` | ref to `event` | the event the sermon answered; only when the source says so |
| same | `ruler_at_time` | list of `{ who: person/polity ref, role: enum, sources }`; `role` ∈ `patron`, `addressee`, `named-in-dua`, `subject`, `opponent`, `contemporary` | who was named in the khutba's du'a marked allegiance; every role but `contemporary` needs a citation; `contemporary` alone may be derived from date and place |
| same | `book_studied` | `{ work: ref, range: string }` | a dars that reads a text: the book plus the chapters or hadith numbers covered |
| same | `order` | integer | position of a lesson inside its series (parallel to the fatwa collection's volume/page) |
| same | `duration` | minutes | recordings and broadcast slots |
| same | `delivery_date_status` | `delivered` / `uploaded` / `broadcast` | an upload or broadcast date is never shown as the delivery date; when only the upload date is known the record says so |
| same | `reception`, `consequence` | prose/notes with sources (reuse existing fields where they fit) | famous, banned or consequential sermons, only as sources say |
| `schema/enums/roles.yaml` | `khatib`, `imam`, `preacher` | three values | `teacher` exists; the khatib and the wa'iz are distinct documented roles |
| `schema/predicates.yaml` | `delivered` / inverse `delivered_by` | domain `[person,group]`, range `[work]`; ar «ألقى» / «أُلقي» | the khatib/teacher edge the whole explorer hangs on; `authored` is the wrong claim |
| same | `relies_on` / inverse `relied_on_by` | domain `[work]`, range `[work,passage]`; ar «استند إلى» | a lesson relying on a teacher's lesson or on a sharh; also needed by the Fatwa Explorer — coordinate so the predicate is added once, whoever lands first |

### Reused, not new

- `summary` {ar,en,ur} — what was said, in the museum's words, attributed, cited to page or timestamp; ≤ 40-word quote.
- `about` edges to `concept`, `practice`, `event`, `person`, `place`, `work` — the topics list, and the book a dars explains.
- `evidence`: Qur'an only by `[[passage/quran-S-A]]` reference; hadith by `passage` link with collection ref; scholars and books cited as `about`/`mentions` edges.
- `related_fatwa`: `about`/`responded_to` edges to Fatwa Explorer `work`s on the same question (no new predicate; the explorer page renders the pair by query).
- `media[]` (base schema) per format: text (book page or web URL), audio, video, with duration and language; each carries the archive URL and an Internet Archive snapshot. **No transcript media item**: the museum publishes only its own summary, never the transcript; transcripts stay in `$HARVEST`.
- `headline` {ar,en,ur} one line; `sensitivity` flag and `perspectives` block for contested/polemical matter per `audio-video-harvest.md`.
- `date`: the museum date object (EDTF + Hijri + calendar + precision; derived conversions marked).
- New `concept` entities: `concept/khutba` (what it is, its history, its conditions per school as cited perspectives — the existing `concept/khutba-fiqh` covers the fiqh detail and stays the fiqh entity), `concept/dars`, `concept/halaqa`, `concept/minbar` if missing.

## 3 · Sources and method (Phase 1 discovery; read-only for the repo)

Four kinds, every era, all Sunni schools, many countries and languages (Arabic first, then English, Urdu, Turkish, Malay/Indonesian, French, Persian, Swahili, Hausa, Bengali):

1. **Books** — sermon and lesson collections and the sermons history books record: the Prophet's sermons in the hadith collections and sira (the Farewell Sermon already exists; linked as `passage`s, never typed); Jamharat Khutab al-'Arab; Ibn Nubata's Diwan al-Khutab; Ibn al-Jawzi's al-Yaqut fi al-Khutab, al-Tabsira, Bustan al-Wa'izin; Ibn Rajab's Lata'if al-Ma'arif; amali books (al-Shajari, al-Qali); Mamluk/Ottoman collections; modern printed collections (Ibn Uthaymin, Muhammad al-Ghazali, Ali al-Tantawi, Abd al-Hamid Kishk, ministry awqaf volumes). Every book runs the §1a canon gate (already-processed check; Sunni check from Wikipedia infobox + Wikidata; record in `exclusions.yaml`); verified books join `scripts/harvest/library/books.yaml` under `cat: khutab`; image-only scans go through `ocr_all.py --cat khutab` under `caffeinate -i`, `ar-SA`, 200 dpi, resumable.
2. **Websites** — ministries publishing the weekly unified khutba (Egypt, UAE, Kuwait, Qatar, Jordan, Morocco, Saudi Arabia, Malaysia JAKIM, Turkey Diyanet), the Haramain archives, mosque and institute sites, the large sermon sites (alukah.net, islamweb, khutabaa.com, scholars' own sites). Each becomes `work kind: website` with publisher, self-described orientation, languages, stated size and an archive snapshot — "listed, not endorsed" (plan 14).
3. **Audio and podcasts** — assabile.com (already authorised for its two registered speakers; new speakers need their own `source/` entities and registry entries), islamway.net, Haramain audio, official scholar archives, podcast RSS feeds (the feed is metadata — the preferred way to list a podcast). Downloads only through `scripts/harvest/audio/download.py` where robots.txt and terms allow, into `$HARVEST`; transcription offline with `transcribe.py` (mlx_whisper large-v3, or the Qwen3-ASR dialect engine) under `tmux` + `caffeinate -dims`, exactly as `audio-video-harvest.md` §3.
4. **Video and YouTube** — metadata and links only. **Never download from YouTube** (terms forbid it; `audio-video-harvest.md` §2, `15-local-harvest.md` §5). YouTube Data API only if the founder provides a key; otherwise public channel and playlist pages read in the browser. Per video: title, channel, date, duration, language, URL, playlist; cited as a pointer; content enters only when the same recording exists on an authorised archive or in a book, or when the published description/chapter list states the facts.

Per source: robots.txt, terms and licence read and recorded in the lane file; sites that forbid collection are listed, not collected. Output: `$HARVEST/khutab/catalogue.json` plus the table in chat (source, kind, speaker(s), school, country, language, era, size, format, rights result, Sunni check, processed check, priority A/B/C). **The founder is asked before any bulk download or transcription run**, with planned hours and disk.

## 4 · Harvest and ingest (after approval)

- **Index everything, write entities for what matters.** Every listed sermon/lesson gets an index record of facts only (speaker, date, place, title in our words, topics, duration, language, URL, source) feeding a generated dataset (`dataset` entity + build-time JSON in R2) for search and filters, each linking out. Full `work` entities with cited summaries go to: famous and consequential sermons (the Farewell Sermon, sermons tied to dated events, sermons that named a new ruler, sermons that led to bans or arrests), whole book-explaining series (by lesson, linked to the book's chapters), conferences with programmes, and lessons that explain topics the museum already has.
- Recordings follow `audio-video-harvest.md` to the letter: claims table per recording in `$HARVEST`; only clearly-reading Arabic lines are written; recitations and hadith matn never from a transcript; the speaker's dates and numbers are his statements; platform figures dated; anchors `{cite:<source> <series>/<ep> <hh:mm:ss>}`; the §8 report per recording; every excluded item reported with its reason.
- Prose: Arabic first in `content/ar/`, English and Urdu in the same commit, `status.review: published`, `provenance` block, `{cite:…}` after every factual sentence, docent voice; no honorifics; Qur'an by Tanzil reference only; quotes ≤ 40 words; contested matter in `perspectives`, polemical flagged and described, never quoted.
- Batches ≤ 25 entities; the claims table of each source's first batch is shown to the founder before files are written. Every batch: `npm run validate` (0 errors) && `npm test` && `npm run coverage`; explicit paths; conventional message; trailers `AI-Agent: Devin`, `AI-Model: SWE-2 Medium`, `AI-Editor: Devin CLI`, plus the repo's Co-Authored-By line; merge gate before every push; branch, PR, self-merge. Lane file kept current.

## 5 · The explorer (site, after the pilot batch of 15–25 items)

Astro + Svelte islands + Tailwind; readable without JavaScript; WCAG 2.2 AA; ar/en/ur; no runtime network calls and **no embedded players that call YouTube or another host on page load** (plain labelled links; a click-to-load player that says it opens an outside site may be proposed separately). Build-time JSON in R2: the new folder is added to `R2_DATA_DIRS` (`workers/site/src/route.js`), `workers/r2-sync/batch/publish.mjs`, `run_worker_first` (`workers/site/wrangler.production.toml`) and the two removal lines in `deploy.yml`, per the hosting split rule.

- **`/[lang]/khutab/`** — the landing page. Opening section in three languages: what a khutba, a dars and a halaqa are, and that each is **the speaker's own words for his audience, time and place** — it shows how scholars taught and preached, it is not a ruling, and what was said in one setting may not suit another. 4–8 "learn more" links to Sunni institutions' articles on the khutba and on seeking knowledge, each opened and read before adding (no URL from memory), stored as data with an archive snapshot, "listed, not endorsed". Then: Hijri timeline of sermons and lessons with era bands; map of delivery places; filters (kind: jumu'a, eid, dars, halaqa, series, conference · speaker · school · country · language · era · topic · format); Pagefind search; "this Friday in history" (sermons on this Hijri date, same mechanism as `today.ts`).
- **Sermon/lesson page**: headline; speaker, place, date (with `delivery_date_status` label), occasion, ruler at the time, audience; cited summary; topics and the book studied; evidence links; series previous/next; labelled source and media links; related fatwas; the one-line notice linking to the landing section.
- **Series page**: a book read lesson by lesson, chapters covered, progress across months.
- **Speaker lens**: sermons and lessons on the lifespan ribbon; where he preached (map); books taught; teachers and students (a chain view in the constellation graph); rulers named in his khutab.
- **Mosque and institution lens**: «خطب ودروس أُلقيت فيه» on a mosque page; a group's series and conferences.
- **Conference page**: event with programme, speakers, papers, outcomes.
- **Topic lens**: on a concept/practice page, sermons and lessons that explain it, beside its fatwas.
- Explorer card on the landing page and the explore bar, «قيد الإعداد» until ready (plan 21 rule). `npm run build` must pass `check-site`, `check-static`, the axe scan and the weight check.
- The Fatwa Explorer is linked both ways: the khutab landing links to it, and `related_fatwa` pairs are rendered on sermon pages.

## 6 · The lane

| Field | Value |
|---|---|
| Lane | `khutab-durus` |
| Scope | published Sunni khutab, durus, halaqat, lecture series and conferences: books, websites, audio archives, podcasts, YouTube (metadata only); index everything, entities for what matters; the explorer |
| Lane document | `docs/agents/lanes/khutab-durus.md` (written in the first content commit, shaped on `lanes/omar-abdelkafy.md`) |
| Progress file | `docs/delegation/khutab-durus-progress.md` |
| Stubs file | `data/_stubs.d/khutab-durus.yaml` (created with the first stub) |
| Branch pattern | `khutab-*` (this session: `claude/khutab-durus-explorer`) |
| Registry rows | `docs/agents/lanes.md` registry table; `docs/status.md` "Parallel work" table |
| Overlap | `omar-abdelkafy` / `tareq-al-suwaidan` lanes enrich the speakers and topics from the same archives; this lane adds the `work` records of the sermons/lessons themselves — additive edges, never edits that drop their facts. Sira lanes may hold the same early sermons (`work/farewell-sermon`): reuse, add sources, no duplicates. |

## 7 · Files touched and risk labels

| File(s) | Intent | Risk label |
|---|---|---|
| `docs/plan/25-khutab-durus-explorer.md` | this document | non-impacting (docs only) |
| `schema/enums/kinds.yaml` | `work.kind` += `lecture` | non-impacting (enum grows; no class-list change) |
| `schema/enums/sermon-type.yaml`, `schema/enums/roles.yaml` | new enum; `khatib`, `imam`, `preacher` | non-impacting |
| `schema/predicates.yaml` | `delivered`, `relies_on` (+ inverses) | non-impacting (additive edges) |
| `scripts/gen-schema.ts`, `schema/work.schema.json` | new fields of section 2 | non-impacting |
| `scripts/validate.ts` and tests | acceptance rules of section 8 | non-impacting |
| `data/`, `content/{ar,en,ur}/` | lane content, ≤ 25 entities per batch | non-impacting (content in an approved lane) |
| `scripts/harvest/library/books.yaml`, `exclusions.yaml` | `cat: khutab` + §1a records | non-impacting (the gate's own process) |
| `scripts/harvest/sources.yaml`, `data/source/*`, `docs/attribution.md` | new source registrations (sites, archives, podcasts) | non-impacting |
| `site/src/pages/[lang]/khutab/**`, components, `site/src/lib/nav.ts`, i18n | the explorer | non-impacting (new routes; no change to asserted claims) |
| `workers/site/src/route.js`, `workers/r2-sync/batch/publish.mjs`, `workers/site/wrangler.production.toml`, `deploy.yml` | R2 data dir for explorer JSON | **submission-impacting? — labelled honestly: the hosting-split architecture is already asserted (data to R2, code to Pages); adding one data dir follows the asserted design and changes no claim, but the files sit inside the deployed architecture, so the founder's explicit sign-off is requested here rather than assumed** |
| `docs/agents/lanes.md`, `docs/status.md`, `docs/agents/lanes/khutab-durus.md`, `docs/delegation/khutab-durus-progress.md`, `data/_stubs.d/khutab-durus.yaml` | lane bookkeeping | non-impacting |

No new entity class is proposed — the class list the submissions quote is unchanged.

## 8 · Acceptance tests

- The validator accepts the new kind, fields, enum and predicates, and rejects: a sermon/lesson with no speaker or no source; typed honorifics; typed Qur'an text; a quote over 40 words; an upload date presented as the delivery date (`delivery_date_status: uploaded` rendered as delivery); a `ruler_at_time` role other than `contemporary` without a citation; a YouTube file (or any audio/video/transcript file) in the media store.
- Every lesson with `part_of` a series has `order`; every series lists its lessons in order.
- Pages render with JavaScript off; no request leaves the site on page load (no embedded external players).
- `npm run validate`, `npm test`, `npm run build` pass; `docs/coverage.md` regenerated in every content commit.
- A spot check of 10 random items against the book page or the recording at its timestamp, recorded in the lane file.

## 9 · Rules that never bend (restated)

Sunni frame first, other views labelled; describe and attribute, never preach; no audio, video, transcripts, PDFs, OCR text or claims tables in git; never download from YouTube; respect every robots.txt and terms page; never invent a date, place, quote, timestamp or citation; Arabic, English and Urdu in the same commit; never run `deploy.yml` (the founder deploys); never revert another agent's work.
