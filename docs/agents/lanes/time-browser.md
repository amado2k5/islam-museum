# Lane: Time Browser

The Time Browser is a static, no-AI way to move through the museum by date: a timeline strip, a detail panel, and search over prepared records only. Design: [`time-browser-plan/DESIGN.md`](../../../time-browser-plan/DESIGN.md). Prompts: [`time-browser-plan/PROMPT-CLAUDE.md`](../../../time-browser-plan/PROMPT-CLAUDE.md).

## Scope

This lane owns:

- `scripts/time-browser*.ts`
- `site/src/pages/[lang]/time-browser/`
- `site/src/scripts/time-browser*.ts`
- `site/src/components/time-browser/`
- `schema/time-browser*`
- `docs/agents/lanes/time-browser.md` (this file)
- the time-browser section of `docs/site/README.md`

It does not own `scripts/time-browser-media*` (Devin's image and map inventory) or the historynavigator repository (Devin, TB6).

## Phases

| Phase | Content | Status |
|---|---|---|
| TB0 | Lane doc, log path, file counts, Pages vs R2 question | in progress (docs only) |
| TB1 | `scripts/time-browser.ts` builds records and per-topic JSON from `.cache/graph.json`; schema; tests; no UI | not started |
| TB2 | Wire Devin's media index; build fails on a missing media id; no image creation here | not started |
| TB3 | Static pages, no-JS list version, Pagefind limited to time-browser records, i18n ar/en/ur, axe and lychee | not started |
| TB4 | Vanilla TypeScript timeline, keyboard, search, JS ≤ 20 KB gzipped | not started |
| TB5 | Entry points: landing button, "time-browse this" on entity pages, "what we offer" page | not started |

Each phase is one PR, deployable alone, merged by the agent once Validate is green.

## TB0 measurements (2026-10-27, origin/main `06231354de`)

Prose files under `content/<lang>/<class>/` and data files under `data/<class>/`:

| Class | ar prose | en prose | ur prose | data YAML |
|---|---:|---:|---:|---:|
| event | 2,004 | 1,946 | 1,946 | 4,352 |
| person | 7,107 | 7,085 | 7,085 | 10,238 |
| place | 1,782 | 1,763 | 1,763 | 1,788 |
| polity | 106 | 106 | 106 | 180 |
| period | 13 | 13 | 13 | 13 |
| theme | 0 | 0 | 0 | 0 |
| work | 321 | 320 | 320 | 1,467 |
| concept | 2,005 | 1,873 | 1,862 | 2,019 |
| practice | 67 | 66 | 66 | 67 |

Notes:

- **Themes have no records yet.** The launch batch of 50 themes needs preparation before TB1 can ship them; the build must treat an empty type as empty, not as an error.
- **The launch batch is small.** 50 records per type across 9 types is 450 records; with three languages and one JSON file per topic, the output is on the order of 30 to 40 files for launch.
- The counts are file counts, not record counts after the draft and review filters, which TB1 will apply.

## Pages or R2 for the JSON (open decision)

The Pages file limit is far above the launch size, so Pages can hold the launch JSON. DESIGN.md §2 says the choice is made in TB0 and §8 says the founder's answer is recorded there, but §8 has no answer yet. **This decision is open and waits for the founder.** Until it is recorded, TB1 writes JSON to the Pages output path, and moving it to R2 later is a config change because all data URLs come from one constant (`TIME_BROWSER_BASE`).

## Progress

Append one line per merged PR, newest last:

- 2026-10-27 TB0 started: design confirmed on origin/main; counts measured; Pages vs R2 open for the founder.
- 2026-10-27 TB0 merged (PR #2382): lane doc with prose counts; DESIGN §9 notes for Devin. Next: TB1, blocked on Pages vs R2 (DESIGN §8).

## Comparison with TimelineThis (observed 27 Oct 2026)

Observed in Chrome on timelinethis.ai.studio (pre-loaded Ancient Egypt, all seven stops, Kids switch on). Our plan keeps the layout and drops the runtime AI.

**Keep**
- A strip of stops with a next arrow, a card with title, date and one line, and a side panel with key people, wars and cultural topics.
- A "Read Details" pop-up for the longer text.
- A Kids switch.

**Change**
- Detail prose is generic on TimelineThis ("historical shifts took place…"). Ours is written and cited at design time, with sources on every record.
- The detail picture is a dark gradient with the label "HISTORICAL ARCHIVES". Ours is a licensed image, a generated card, or no image. Never a placeholder.
- Stops are unlabelled dots. Ours show the date under each stop, and the stop order follows the dates.
- Tutankhamun (1323 BCE) comes after Kadesh (1274 BCE) on their strip. Ours sorts by date and checks the order in tests.
- Kids mode changed only the switch, not the card text. Ours needs its own simpler prose, checked against the same record.

**Leave out**
- "Ask AI" and anything that calls a model in the browser.
- Search for new topics. Only prepared records are searchable; anything else shows "not in the Time Browser yet".

**Observed failures**
- Searching "Al Ghazali" shows: a valid Gemini API key should be set in deployment settings. Ours has no runtime search of that kind.
- "View on Map" for Cleopatra VII showed "Could not load the details. Please try again."

**Actions**
1. Keep the stop strip, card, detail pop-up and Kids switch in TB4.
2. Date every stop on the strip, and fail the build when the order breaks.
3. Prepare detail prose and cited sources at design time, and mark the picture source for each record.
4. Map views come from prepared SVG maps, not from a request at view time.
5. Test Kids mode with its own prepared prose, not the same text.
