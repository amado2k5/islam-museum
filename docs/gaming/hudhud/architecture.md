# Hudhud: architecture, schemas and dependencies

_26 November 2026. Describes what is built for the golden scene and what the same shape must grow into. Decisions: [G-0013](../adr/G-0013-hudhud-2d-engine.md) (engine), [G-0014](../adr/G-0014-hudhud-narrative-and-content-format.md) (story and content)._

## The shape

```
gaming/games/hudhud/
  index.html            the page: one stylesheet, one script, no inline style or script
  i18n/<lang>.json      1,123 strings (27 November 2026, UTC, with al-Jazari's room; 1,097 with the journey, 1,083 with Karima's copies; 1,017 with al-Razi's loose leaves, 945 with the Alhambra quest, 866 before it, 793 before the journey of coffee and 209 when this was first written), the same keys in the same order in ar, en, ur, fr, es, tr, id
  i18n-atlas/<lang>.json  the names of the ten worlds and the fifty subjects, a table of their own
  src/
    sim/                RULES. Pure, no Phaser, no DOM, no clock, no unseeded chance; run in Node
      light.ts            the beam on a grid: trace, turn a mirror, solve, generate from a seed
      chain.ts            a machine as a row of parts that hand a motion on: run, swap, solve, generate
      chainquest.ts       the rules of a quest made of a row (moves, the fewest possible, flags, the four goals, a saved place proved on restore), over chain.ts, for any list of flags; shared by the three quests below
      clock.ts            the elephant clock quest: its flags, over chainquest.ts
      paper.ts            the paper of Samarkand quest: its flags, over chainquest.ts
      leaves.ts           al-Razi's loose leaves quest: its flags, over chainquest.ts (the leaves and their order are in content/leaves.ts)
      collate.ts          Karima's copies: copies as rows of sign ids, the places where they differ, the slipped copy at each (the one that differs from the others; with two copies, the one that is not hers), mark, unmark, the four goals, a saved place proved on restore; its own rules
      route.ts            Ibn Battuta's thread: a stage (beads and a road), go, peek, the four goals, a saved place proved on restore; its own rules, not chainquest's
      couple.ts           al-Tusi's two circles: a small circle carried round inside a large one, the path of a point on it traced and classed by measurement (line, circle, oval, loops), the settings a way of playing offers, turn, the four goals, a saved place proved on restore; its own rules
      sort.ts             sorting cards into groups: place, show (a showing with a card unplaced is refused and not counted), the four goals, a saved place proved on restore; generic over the cards, the groups and the answer map, used for the animal cards and the shelves of coffee
      move.ts             the bird: a fixed-step integrator with coyote time, jump buffering, glide, perches
      scene.ts            the quest's state and its only reducer: (state, command) -> (state, what happened)
    narrative/dialogue.ts typed scripts and the machine that walks them; faults() checks a script set
    content/
      atlas.v1.json       80 pictures -> 50 subjects -> 10 worlds -> quests -> museum record ids
      workshop.ts         the golden scene as data: room, puzzle, things, scripts, records
      collate.ts          Karima's copies as data: the three puzzles, the twelve signs and the near-alike pairs, the wrong marks allowed, the record linked
      sort.ts, coffee.ts  the animal cards of al-Jahiz and the three shelves of coffee as data: cards, groups, the answer map, the failed showings allowed, the records linked
    save/save.ts        the save's shape and rules: three slots, migrations, quarantine, merging
    save/durable.ts     the join to the platform's vault (IndexedDB): which copy leads, saving status, export, import
    input/input.ts      keyboard, on-screen buttons and gamepad -> one Intent
    input/pad.ts        the gamepad as plain numbers: what is held, what was just pressed, changing a button
    audio/cues.ts       the scene's own sounds, synthesised; three volume groups
    art/                PICTURES drawn by code onto canvases (a trial: see the art bible)
    scenes/room.ts      THE ROOM ENGINE (27 November 2026): a Phaser scene for any walkable room (textures in columns of at most 2048 px per quality, layers, camera and parallax, the bird and the explorer, movement, touching the nearest thing, goTo, the lit door, sparks, measuring, letting go)
    scenes/workshop.ts  the first room: Ibn al-Haytham's workshop (its painting, the scholar and the cat, the mirrors and the beam, the curtain, the page)
    scenes/jazari.ts    the second room: al-Jazari's workshop (its painting, al-Jazari and the apprentice, the clock's parts where the rules put them or in the beak, the run lit place by place, the lever)
    content/jazari-room.ts, sim/jazariroom.ts, art/jazari.ts, ui/jazari.ts  the second room's data, its rules over the clock's (one put a placement, go for the lever), its painting, and its page (talk, objective, prompt, the list in words, the door panel)
    game/boot.ts        starts and stops Phaser; sizes the canvas; counts draw calls when asked
    ui/app.ts, .css     the page: talk, goal, settings, pause, results, the scene in words, the test hook; one registry of the quests played on a page, and one helper (`calm`) for the three signals of reduced motion
    ui/rowpage.ts       the page of a quest made of a row, shared by ui/paper.ts (the paper of Samarkand) and ui/leaves.ts (al-Razi's loose leaves), each a spec: its picture, row, rules, strings, questions and notes; art/leaves.ts uses the paper's row and hit-test (art/paper.ts)
    ui/collate.ts       Karima's copies: a table of real buttons in the picture's rows and columns, each labelled with its copy, place and sign and whether it is marked, a polite live region, the picture (art/collate.ts: signs drawn as plain shapes, never mirrored; only their places run from the right on a right to left page)
    ui/sortpage.ts      the page of a sorting quest, shared by ui/sort.ts (the animal cards) and ui/coffee.ts (the shelves of coffee), each a spec: its picture, cards, strings, questions and notes
    tests/*.gtest.ts    757 tests in twenty-four files (27 November 2026, UTC, with the room engine and al-Jazari's room; 721 in twenty-three with the journey, 705 in twenty-two with Karima's copies; 666 in twenty-one with al-Razi's loose leaves, 633 in twenty with the Alhambra quest, 543 in nineteen before it, 126 when this was first written)
gaming/tools/hudhud-play.ts     plays the scene in real Chrome and records everything
gaming/tools/hudhud-rebuild.ts  rebuilds the game repeatedly and reads memory
```

**One direction of dependence.** `ui/app.ts` owns the state. It calls `apply(state, command)`, receives the new state and a list of things that happened, plays sounds and captions from that list, hands the list to the scene to draw, and re-renders the page. The scene reads the state and the player's intent each frame and calls back only to say "the player touched this" or "the bird is near that". Nothing under `sim/`, `narrative/`, `save/` or `content/` imports Phaser or touches the page, and a test fails if one of them reads a clock or calls `Math.random`.

**The canvas and the page are two views of one state.** Every action exists twice: by flying to a thing and pressing a key or button, and as a button in "The scene in words" (turn this mirror; go to that thing). Both send the same command.

## The room engine (27 November 2026)

Asked for by the founder on 27 November 2026 (every scene a complete room with its own figure). `scenes/room.ts` is an abstract `RoomScene`, a base class because Phaser's scenes are classes with a life of their own (init, create, update, the shutdown event); a room is one of them and overrides a handful of hooks.

- **What the engine does for every room**: paints textures once and uploads them (a picture wider than 2048 pixels at the chosen quality goes up in columns that lap by one game pixel); makes the layers (far and middle, which move less than the camera, the room, and the foreground, which moves more) and moves them for the camera; builds and animates Hudhud and the player's explorer; moves the bird by `sim/move.ts` with the room's perches and the way of playing's assist; finds the nearest thing that can be touched and rings it; carries the bird to a thing (`goTo`, landing by `landing()` in `sim/door.ts`, unit-tested) or sets it down at once when movement is kept still; draws the door dark or lit and goes through it when reached; makes sparks; records frame times; reports `info()` (renderer, canvas, textures and their bytes, objects, tweens, frames); and lets every texture go when the room is left.
- **What a room supplies**: a `RoomLayout` (world size and floor, the room's bounds and perches for `sim/move.ts`, the door's place, where the bird and the explorer begin, the assist by way of playing, a seed for its cosmetic randomness), and hooks: `build` (its painting, its figures, and where the door, the ring, the cast and the sparks go in its drawing order), `things`, `lit` (the door is lit), `touchable`, `approach` (where the bird stands to touch a thing), `tap`, `ready`, `animateRoom` and `releaseRoom`. How a touch becomes a command is the room's host's business (`ui/app.ts` for the workshop, `ui/jazari.ts` for al-Jazari's room), so that the rules stay outside Phaser.
- **`game/boot.ts`** starts any room with `startRoom(parent, host, quality, options, key, Scene)`; `start()` is the workshop's, unchanged for its callers.
- **One state, two views, in the new room too**: `ui/jazari.ts` owns the room's state (`sim/jazariroom.ts`: the clock's state, what Hudhud carries, the talk) and the scene reads it each frame; every touch exists as a button in the list in words, and both send the same command.

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

A drawn hub (the Atlas is a page of words today: ten worlds, fifty named pages, thirteen open, at least one in every world, since 27 November 2026); scenes other than one; loading a world on demand; atlases; remapping of gamepad buttons; a challenge archive; postcards; the "simple language" variant; background-tab behaviour beyond pausing when the page is hidden (seen once in the app's browser pane, not tested by a tool); any analytics, which are not authorised and will not be added.
