# Prompt for Devin: parallel work on Hudhud that does not touch Claude's files

_Written by Claude on 26 November 2026 at the founder's request ("give me a detailed prompt for devin to do the work you need it to do for you on this same game"). Paste everything below the line to Devin. The split is by file: Devin works only in new files and folders named here, so the two agents cannot overwrite each other._

---

Devin,

You are helping build **Hudhud: The Atlas of Wonders**, a 2D story game for islam.museum, in the repository `github.com/amado2k5/islam-museum`. A second agent, Claude, is building the game's code at the same time. Your job is the work listed below, which Claude needs and is not doing. Work only in the files and folders this prompt gives you.

## Read first, in this order

1. `AGENTS.md` at the repository root, completely. It binds you: pull requests to `main` only, a `CANARY.md` entry with every change, truthful claims, the terrorist-organisation content block, commit trailers (`AI-Agent`, `AI-Model`, `AI-Editor`), no media in git, explicit paths in `git add`, no force-push.
2. `docs/gaming/hudhud/README.md`, then `owner-instruction-2026-11-26.md` and `owner-directive-2026-11-26-production-completion.md` in the same folder. The directive is the founder's and governs.
3. `docs/gaming/hudhud/remaining.md`, `design.md`, `art-bible.md`, `architecture.md`, `accessibility.md`, `test-plan.md`, `explorers.md`.
4. `gaming/games/hudhud/src/content/atlas.v1.json`: the 50 subjects, their ten worlds and their museum record ids.
5. The shared board: `/Users/ahmedabdelaal/Documents/GitHub/islam-museum-coordination/hudhud/`. Write your status in `devin-status.md` there after every unit of work; read `claude-status.md` before each one.

The game is on UAT at `https://uat-games.islam.museum/hudhud/?lang=en`. It is a prototype: one playable quest, trial art, unread machine translations, unreviewed history.

## Hard limits

- **Do not edit any of these.** They are Claude's, or shared and changing under Claude's hands: `gaming/games/hudhud/**`, `gaming/packages/**`, `gaming/package.json`, `gaming/package-lock.json`, `gaming/tsconfig.json`, `gaming/vite.config.ts`, `gaming/vitest.config.ts`, `gaming/tools/build.ts`, `gaming/tools/release-smoke.ts`, `gaming/tools/hudhud-*.ts` that already exist, `gaming/games/registry.json`, `gaming/games/*.gtest.ts`, `docs/gaming/historical-review/ledger.json`, `docs/gaming/spec-production/release-status.json`, and the existing pages under `docs/gaming/hudhud/`. If you need a script entry in `package.json`, name it in your pull request and Claude adds it.
- **Do not touch** Granada, The Golden Age or Atlas, or anything under `site/`, `data/`, `content/`, `i18n/`, `schema/`.
- **Draft pull requests only. Do not merge.** One pull request per task, branch `gaming/hudhud-<task>-devin`, from current `origin/main`. Each adds exactly one line to `CANARY.md`, at the end of the "Added" list of the top version block. If `main` moved, merge it into your branch and keep both sides of `CANARY.md`, `main`'s lines first.
- **No deployment** to UAT or production. No purchase, no contact with any vendor, artist, reviewer or tester. No download of any asset to ship; reference pages may be read.
- **No historical claim of your own.** You gather what the museum's records and their cited sources already say. An AI does not approve history. Everything you write about a person or place carries "historical review pending".
- **Never fabricate** a measurement, a source, a page number, a quotation, a test run or a screenshot. What you did not run, you list as not run.
- Media you generate (captures, renders, atlases) stays out of git, in the ignored `gaming/media/hudhud/`. Evidence pictures go to `docs/gaming/evidence/hudhud/<task>/` as WebP, small, as the other games do.
- Run commands that take more than two minutes in the background, and write in the board's `../granada/machine.md` before any heavy render or browser run, as you did for Granada.

## The tasks, in priority order

### Task 1. Quest dossiers for the fifty subjects (the largest and most useful)

Claude cannot write forty-nine quests without knowing what the museum actually holds on each subject. Build that.

For each subject in `atlas.v1.json`, write `docs/gaming/hudhud/dossiers/<subject-id>.md`. Start with world 2 (al-Jazari, al-Khwarizmi, al-Kindi, the Banu Musa, al-Shatranj), then world 3, then world 6, then the rest in world order. Each dossier contains, from the museum's own records only (`data/<class>/<slug>.yaml`, `content/en/...` and `content/ar/...`, and the `source` records they cite):

- The record ids read, with the git commit of `data/` you read them at.
- **Who, where, when**: names in Arabic and English as the record gives them; places with their museum record ids and coordinates; dates exactly as the record states them, with the record's own uncertainty; never a date the record does not give.
- **What the records say they did**, as a list of separate claims. Each claim: one sentence in your words, the record and section it comes from, the `{cite:...}` the record gives for it, and a flag: `stated`, `stated as uncertain`, `contested`, or `only in a summary, not in the prose`.
- **What the founder's thumbnails show that no record supports** (look at the pictures in `gaming/media/hudhud/source/` if present on the machine; otherwise use the titles in `atlas.v1.json`). The prism in Ibn al-Haytham's pictures is the model case.
- **The setting**: city, region, landscape, climate, what the records say stood there at the time (buildings, institutions, routes). Mark what would be invention.
- **Related museum records** a quest could link to: works, inventions, places, events, other people.
- **Three candidate quest premises**, each two or three sentences: a local problem a child could help with, which of the twelve systems in `design.md` it would use, and which claims above it would rest on. These are proposals for Claude and the founder, not content.
- **Sensitivities**: anything about war, illness, death, slavery, sect, or a living dispute that a children's game must handle with care or leave out; anything the content-safety block touches.
- **Gaps**: what the museum does not hold and a quest would need (and which reviewer specialty would have to supply it).

Also write `docs/gaming/hudhud/dossiers/README.md` (an index table: subject, records, number of claims, number contested, gaps) and `docs/gaming/hudhud/dossiers/ledger-drafts.json`: draft entries in the shape of `docs/gaming/historical-review/ledger.json` (`id` left as `HR-HH-draft-<subject>-<n>`, `decision: "historical review pending"`, `reviewer: null`). Do not edit the real ledger; Claude moves entries in when a quest is written.

Three joins need particular care and an honest answer: the Sailor of Sohar (no person is named; only `place/sohar` exists), Sindbad (joined to `work/alf-layla-wa-layla`, not to `work/kitab-al-sindbad`), and the palace story (`building/alhambra`; the game must not present a reconstruction).

Pull requests: one per world (five dossiers each), so they can be read.

### Task 2. Title and name search

The working title clashes with the platform's own game "Atlas", and no search has been run. Using your browser, search for existing games, apps, books, films and registered trademarks named, or close to: "Hudhud", "Hudhud: The Atlas of Wonders", "Atlas of Wonders", "Hudhud and the Scattered Atlas", "Hudhud: Keeper of Stories", "Hudhud's Book of Wonders", and the Arabic «هدهد» and «أطلس العجائب». Check at least: Steam, itch.io, the Apple App Store, Google Play, Nintendo eShop, WIPO Global Brand Database, USPTO, EUIPO, CIPO, and a general web search. Write `docs/gaming/hudhud/title-search.md`: for each name and each place searched, the date, the exact query, what was found with its address, and a plain reading of the risk. Propose up to five further names that avoid the word "Atlas". You are not a lawyer and the page must say so; it is a first search, not clearance. Decide nothing: the founder chooses.

### Task 3. Art-reference analysis and an artist's brief

Eight reference pictures and eighty thumbnails define the look the founder wants, and the code-drawn trial is far below it. Claude needs the look written down precisely enough to brief an artist or to judge a picture against.

From the files in `/Users/ahmedabdelaal/Downloads/Claude-Fable-5.2-Hudhud-production-package.zip` (read only; verify the SHA-256 of each picture against the table in the directive, section 2) write `docs/gaming/hudhud/art-reference-analysis.md`:

- Per picture: composition (foreground, midground, background, where the eye goes), palette as measured hex values with their share of the picture (measure it; say how), light direction and warm/cool split, material rendering, how faces and hands are drawn, how Hudhud is drawn (crest, beak, wing bars, proportions against a child), atmosphere and depth cues.
- A consolidated style sheet: palette, line, light, texture, figure proportions, Hudhud's anatomy as drawn across all pictures and where the pictures disagree with each other.
- **A defect list per picture** of what must not be carried into the game: invented or mixed script, architecture of several regions and centuries fused into one skyline, instruments that could not work, hands with the wrong number of fingers, repeated faces, text baked into the picture. Be specific with positions.
- What each picture implies for gameplay staging that a side-on 2D game can and cannot do.

Then write `docs/gaming/hudhud/artist-brief-hudhud.md`, on the pattern of `docs/gaming/spec-production/artist-brief-granada.md` if it is on `main` by then: the role wanted, the golden scene as a paid test (Hudhud with the animation list in the directive's section 6, the two Storykeepers, one historical figure, one animal, one layered room), deliverables (layered source files, cut-out parts with pivots, sprite sheets, 2048 atlases, WebP, a provenance manifest, rights), sizes taken from the sprite list in `art-bible.md`, review rounds, and acceptance in the running game. Planning estimates must be labelled as estimates, not quotes. Send it to nobody.

### Task 4. A texture and atlas pipeline that does not depend on who draws

Whoever makes the art, the game needs layered pictures turned into atlases with a manifest. Build it under `gaming/art/hudhud/` (a new folder):

- A tool, in Python or TypeScript using only what the workspace already has (ask in your pull request if you need a new dependency; do not add one), that takes a folder of PNG parts and writes 2048×2048 WebP atlases with a JSON frame map Phaser 4 reads, never a 4096 one without printing why.
- A manifest per atlas on the pattern of `gaming/art/manifest.json`: for every part its source file, SHA-256, dimensions, pivot, decoded size in bytes, and a provenance field (maker or tool, licence or "founder-provided", transformations).
- A check that fails when a source changes without the manifest being renewed, and tests named `*.gtest.ts` beside the tool.
- A README with the commands. Prove it on synthetic parts you generate in the test (coloured rectangles are enough); do not use the founder's pictures as game art.

### Task 5. Checks in other browsers and for accessibility

Claude's browser tools run Chrome only. Without editing them, write new tools beside them:

- `gaming/tools/hudhud-browsers.ts`: runs the Atlas-to-finished-quest path on a games host in Firefox and WebKit through `playwright-core` (already a dependency; if the browser binaries are not installed, say so and stop rather than download without the founder's word). Report console errors, failed requests, whether WebGL started, and a capture per browser.
- `gaming/tools/hudhud-a11y.ts`, on the pattern of `gaming/tools/granada-a11y.ts`: the Atlas, a talk, the settings sheet, the pause sheet and the results sheet, in English and Arabic; report roles, names, focus order, focus traps, contrast of text against its background as measured from the page, target sizes under 44 px.
- `gaming/tools/hudhud-soak.ts`, on the pattern of `gaming/tools/granada-soak.ts`: plays the quest and returns to the Atlas in a loop for a set time (10 minutes by default; 60 minutes and 4 hours when asked), sampling heap, textures, DOM nodes, listeners and frame times, and says plainly whether they level off.

Run each against UAT once and commit the reports under `docs/gaming/evidence/hudhud/`. A pass on the founder's Mac is not a pass on the two reference machines; say so in each report.

### Task 6. Packs for the people the game is waiting on

Documents only, sent to nobody:

- `docs/gaming/hudhud/reviewer-briefs.md`: for each specialty the directive names (science and medicine; architecture, material culture and dress; geography and travel; literature; cities and politics), what a reviewer is asked to rule on, the form of a ruling, and the subjects that fall to them, from the dossiers.
- `docs/gaming/hudhud/playtest-pack.md`: the protocol for ages 6 to 9, 10 to 13 and 14 to 17 and for parents, on the pattern of `docs/gaming/playtest-protocol.md`: tasks, what to watch for, questions, a consent text for guardians, and a results sheet that records no name, age beyond the band, or other identifying detail.
- `docs/gaming/hudhud/native-reading-pack.md`: for each of the seven languages, the strings to read (point to `gaming/games/hudhud/i18n/` and `i18n-atlas/`), what to check, and the doubts the translating agent already raised (listed in `accessibility.md`).

## How to hand over

For every pull request: say what is complete, what is not, the exact commands run and their results, what was not run, and what you were unsure of. Post its number and head commit on the board. If something in this prompt conflicts with `AGENTS.md` or the founder's directive, those win: stop and write the conflict on the board instead of choosing.
