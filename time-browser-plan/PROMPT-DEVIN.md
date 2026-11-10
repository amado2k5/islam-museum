# Prompt for Devin (two repos). DRAFT: use only after the founder approves DESIGN.md.

You build the image and map media for the Islam Museum Time Browser (islam-museum repo), then upgrade historynavigator into a clean, AI-free client (amado2k5/historynavigator). Work in your own clone or worktree. Never in a shared folder.

## Read first
1. islam-museum: `AGENTS.md`, `docs/ai-change-gates.md`, `docs/agents/workflow.md`, `docs/agents/lanes.md`, `docs/sources-policy.md`, `schema/enums/licenses.yaml`, and `time-browser-plan/DESIGN.md`.
2. historynavigator: `README.md`, `types.ts`, `components/`, `services/`.

## Hard rules (islam-museum)
- No AI image generation for portraits, prophets or Companions (no figurative depiction). No AI portraits anywhere. Media only from the whitelist in `schema/enums/licenses.yaml`.
- Reuse before creating: match existing images in `architecture` and `art` first; create SVG cards or maps only where nothing matches.
- Commit explicit paths only. Trailers: `AI-Agent: Devin`, `AI-Model: unknown`, `AI-Editor: Devin`.
- Rebase on `origin/main` before every push. Run `npm run validate` and `npm test`. Open a PR and merge it once green. Roughly every 15 minutes of work: push, PR, merge.
- After each merge, append one progress line to `docs/agents/lanes/time-browser-media.md` and comment on the PR.

## Hard rules (historynavigator)
- The upgraded client has no AI at runtime: remove Gemini, voice, video, telemetry, the AI prompt modal and AI image calls. Do not keep them behind a flag.
- Upgrade to the latest React and Vite and TypeScript that build cleanly, current lint and test setup, no deprecated APIs. Do not just port the old code.
- Data comes only from `https://islam.museum/time-browser-data/<lang>/…` (final URL per DESIGN.md §2). Types follow the record in DESIGN.md §3.
- Commit with the same trailers. Open a PR and merge it once `npm run build` and tests pass.

## Phases
- **Media phase M1 (islam-museum, `scripts/time-browser-media*.ts`):** build an inventory of existing images and whitelisted media in `architecture` and `art`, with their tags, places, periods and date ranges. Write `data/time-browser-media-index.json` (or the agreed location) with an id per image and the list of stops it can cover. Report the match rate: how many stops get a real image, and how many get a generated SVG card. Do not render any map yet.
- **Media phase M2:** render small SVG maps at build time from `basemap-world.json` and `basemap-mena.json` plus coordinates; one map per place cluster, reused across stops. Store them as static SVG files. Report counts and size.
- **Media phase M3:** generate SVG cards (period colour, title, place name) for stops with no image, reusing one card per period and place where the stops are adjacent. No AI.
- **Client phase H1 (historynavigator):** new React and Vite and TypeScript project structure; a data service reading the JSON; the timeline strip and sidebar kept from the original design; the AI code removed.
- **Client phase H2:** the same layout as the Time Browser (DESIGN.md §2 and §4): full viewport, no page scroll, phone and desktop. Keyboard support. Test with the sample JSON.
- **Client phase H3:** wire to the real JSON once TB1 is merged on islam-museum. Do not change the schema; if the data disagrees with the schema, report it in the lane file.

## Scope and batches
- Media covers every record type. Launch batch: 50 records per type. When the founder says "add 50 more" or "add 50 more of <type>", run one more media batch for those types, with its own PR.
- Urdu UI name: ٹائم براؤزر (needs a native reviewer). Arabic: متصفح الزمن.

## Logging (required)
- Append one line per step to `.time-browser-logs/devin.log` (git-ignored in both repos): `ISO-time | phase | action | result | next`.
- When the founder asks for status, tail the last 50 lines, then report the latest completed step, what is in progress, and what remains per phase.

## Report
Each PR: a comment with the phase, the PR number, what merged, the match rate or the counts, and what is next. Stop and ask the founder if a decision in DESIGN.md §8 is still open.
