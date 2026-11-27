# Hudhud: architecture, schemas and dependencies

_26 November 2026. Describes what is built for the golden scene and what the same shape must grow into. Decisions: [G-0013](../adr/G-0013-hudhud-2d-engine.md) (engine), [G-0014](../adr/G-0014-hudhud-narrative-and-content-format.md) (story and content)._

## The shape

```
gaming/games/hudhud/
  index.html            the page: one stylesheet, one script, no inline style or script
  i18n/<lang>.json      793 strings (26 November 2026, later still; 209 when this was first written), the same keys in the same order in ar, en, ur, fr, es, tr, id
  i18n-atlas/<lang>.json  the names of the ten worlds and the fifty subjects, a table of their own
  src/
    sim/                RULES. Pure, no Phaser, no DOM, no clock, no unseeded chance; run in Node
      light.ts            the beam on a grid: trace, turn a mirror, solve, generate from a seed
      chain.ts            a machine as a row of parts that hand a motion on: run, swap, solve, generate
      chainquest.ts       the rules of a quest made of a row (moves, the fewest possible, flags, the four goals, a saved place proved on restore), over chain.ts, for any list of flags; shared by the two quests below
      clock.ts            the elephant clock quest: its flags, over chainquest.ts
      paper.ts            the paper of Samarkand quest: its flags, over chainquest.ts
      route.ts            Ibn Battuta's thread: a stage (beads and a road), go, peek, the four goals, a saved place proved on restore; its own rules, not chainquest's
      couple.ts           al-Tusi's two circles: a small circle carried round inside a large one, the path of a point on it traced and classed by measurement (line, circle, oval, loops), the settings a way of playing offers, turn, the four goals, a saved place proved on restore; its own rules
      move.ts             the bird: a fixed-step integrator with coyote time, jump buffering, glide, perches
      scene.ts            the quest's state and its only reducer: (state, command) -> (state, what happened)
    narrative/dialogue.ts typed scripts and the machine that walks them; faults() checks a script set
    content/
      atlas.v1.json       80 pictures -> 50 subjects -> 10 worlds -> quests -> museum record ids
      workshop.ts         the golden scene as data: room, puzzle, things, scripts, records
    save/save.ts        the save's shape and rules: three slots, migrations, quarantine, merging
    save/durable.ts     the join to the platform's vault (IndexedDB): which copy leads, saving status, export, import
    input/input.ts      keyboard, on-screen buttons and gamepad -> one Intent
    input/pad.ts        the gamepad as plain numbers: what is held, what was just pressed, changing a button
    audio/cues.ts       the scene's own sounds, synthesised; three volume groups
    art/                PICTURES drawn by code onto canvases (a trial: see the art bible)
    scenes/workshop.ts  Phaser scene: builds the pictures, moves them from the state, measures itself
    game/boot.ts        starts and stops Phaser; sizes the canvas; counts draw calls when asked
    ui/app.ts, .css     the page: talk, goal, settings, pause, results, the scene in words, the test hook
    tests/*.gtest.ts    500 tests in eighteen files (26 November 2026, later still; 126 when this was first written)
gaming/tools/hudhud-play.ts     plays the scene in real Chrome and records everything
gaming/tools/hudhud-rebuild.ts  rebuilds the game repeatedly and reads memory
```

**One direction of dependence.** `ui/app.ts` owns the state. It calls `apply(state, command)`, receives the new state and a list of things that happened, plays sounds and captions from that list, hands the list to the scene to draw, and re-renders the page. The scene reads the state and the player's intent each frame and calls back only to say "the player touched this" or "the bird is near that". Nothing under `sim/`, `narrative/`, `save/` or `content/` imports Phaser or touches the page, and a test fails if one of them reads a clock or calls `Math.random`.

**The canvas and the page are two views of one state.** Every action exists twice: by flying to a thing and pressing a key or button, and as a button in "The scene in words" (turn this mirror; go to that thing). Both send the same command.

## Reused from the workspace, unchanged

| | |
|---|---|
| `@im/kernel/prng` | the seeded generator: puzzle generation, picture speckle, blink timing |
| `@im/kernel/framestats` | frame-time summary, the same arithmetic as the other games' benchmarks |
| `@im/audio` | the museum's suite, its player, its control and its seven string tables. Hudhud opens with "The First Light"; the choice of music on or off and its volume are shared with the other games (`im.play.audio.v1`) |
| `tools/serve.ts`, `playwright-core` | the browser tools' server and driver |
| `tools/build.ts`, `check-release.mjs`, `release-smoke.ts`, the games Worker | the release build and its checks: Hudhud is the registry's fourth entry and is built with no special case |

## Changed in the shared platform (the smallest that works)

| File | Change |
|---|---|
| `gaming/package.json`, `package-lock.json` | `phaser` 4.2.1; `hudhud:play`; Hudhud's string folder added to `strings` |
| `gaming/vite.config.ts`, `vitest.config.ts`, `tsconfig.json`, `tools/build.ts` | the alias `@im/hudhud` |
| `gaming/games/registry.json` | `hudhud`, `prototype`, last in the list; Granada still first |
| `docs/gaming/spec-production/release-status.json` | `hudhud`: `prototype`, approved by nobody |
| `gaming/games/prototype-labels.gtest.ts`, `review-mark.gtest.ts` | each learns of the fourth game: its label and its review mark are now enforced in seven languages |
| `gaming/tools/release-smoke.ts` | a branch for Hudhud: start, open the scene on WebGL under the host's policy, turn a mirror, see the label |
| `docs/gaming/historical-review/ledger.json` | thirty-four entries, HR-HH-01 to 34, all pending |

Not changed: any file of Granada, The Golden Age or Atlas; the games Worker; any workflow; anything under `site/`.

## Schemas

**Scene state** (`sim/scene.ts`), plain data, serialisable:

```ts
interface SceneState { v: 1; style: "story" | "explorer" | "challenge";
  puzzle: LightPuzzle; turns: number; par: number;   // par: the fewest turns from this style's start
  flags: string[];                                    // metScholar, askedMore, metCat, secret, feather
  talk: { script: string; node: string; line: number } | null;
  restored: boolean; dark: boolean; done: boolean }
type Command = { type: "touch"; id: string } | { type: "forward" } | { type: "back" }
             | { type: "choose"; index: number } | { type: "skip" }
```

**Light puzzle** (`sim/light.ts`): `{ cols, rows, source: {col,row,dir}, mirrors: [{id,col,row,lean: "/" | "\\"}], blocks, prisms, target }`. `trace()` returns the beam's segments, the mirrors met in order and how it ends (`target`, `block`, `wall`, `loop`).

**Script** (`narrative/dialogue.ts`): `{ start, nodes: { [id]: { lines: [{who,key,mood}], choices?: [{key,to,deeper?,needs?}], set?: string[] } } }`.

**Save** (`save/save.ts`), `localStorage["im.hudhud.save.v1"]`:

```ts
interface SaveFile { v: 1; slot: number; slots: (Slot | null)[] }          // three slots
interface Slot { settings: Settings; keeper: { kind, skin, outfit, hair }; // girl or boy and three indices, never a name
  quests: { [questId]: { done, bestTurns, curiosity, ingenuity, kindness, feather } } }
```

A file that cannot be parsed is copied whole to `im.hudhud.save.quarantine` and a fresh one is started. A file with a higher version is left as it is and nothing is written for that visit. Storage that is missing or throws lets the game play and says that progress is not being saved. There is one version, so the migration table is empty; a test requires an entry for every version below the current one.

**A quest in progress is saved** whenever the player has control: `slot.resume = { quest, snap }`, where `snap` is `snapshot(state)` (style, each mirror's lean, turns, flags, the ink, the curtain). On the way back `restore()` builds the room afresh and lays over it only what it can check; a file it cannot trust gives a fresh quest. A conversation is never restored. The slot also holds `settings.keys`, the keys for each action.

**The traceability table** (`content/atlas.v1.json`): `archive` (digests), `worlds[10]`, `subjects[50]` (`id`, `world`, `quest`, `kind`, `records[]`, `sources[]`, `titles`, `named`, `review`, `note?`), `sources[80]` (`file`, `lang`, `episode`, `story`, `named`, `bytes`, `sha256`, `width`, `height`, `subject`).

## The test hook

`window.__HH__`: `ready`, `error`, `state()`, `goals()`, `beam()`, `where()`, `info()`, `resetFrames()`, `touch(id)`, `goTo(id)`, `command(c)`, `restart(rebuild)`. It reads and sends the same commands a player does; it grants nothing a player cannot do. Address parameters: `lang`, `q` (low, medium, high), `style`, `motion=reduced`, `music=off`, `fresh=1` (no saving), `perf=1` (count draw calls), `autostart=1`.

## Performance and memory budgets

Proposed in [the art bible](art-bible.md#media-budget-proposed-to-be-set-by-measurement-before-production), with today's measurements beside them. Lifecycle today: the scene removes its 45 textures, kills its tweens and drops its listeners on shutdown; the page's input and sound objects live for the page.

## What the architecture does not have yet

A drawn hub (the Atlas is a page of words today: ten worlds, fifty named pages, one open); scenes other than one; loading a world on demand; atlases; remapping of gamepad buttons; a challenge archive; postcards; the "simple language" variant; background-tab behaviour beyond pausing when the page is hidden (seen once in the app's browser pane, not tested by a tool); any analytics, which are not authorised and will not be added.
