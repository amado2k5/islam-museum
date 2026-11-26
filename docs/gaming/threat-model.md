# Gaming platform threat model

_Baseline of 25 November 2026 (milestone M0). No mod, pack, third-party game or online service exists yet; this sets the boundaries they will be built inside. It is revised at M3 (first data pack), at M8 (creator tools), and before any programmable content is switched on._

## What is protected

1. **The museum.** Its pages, its records, its reputation for accuracy, and the origin `islam.museum` with everything a script on that origin can reach.
2. **The player.** Saved games and settings in the browser's storage; the device's CPU, GPU and memory; attention (no content a player did not choose).
3. **The record of history.** No creator content can present itself as a museum record or change what a museum record says.
4. **Fair comparison.** A score that is compared with other players' scores cannot be produced by altered rules.
5. **The repository and its deploy credentials.**

## Trust levels

| Level | What it is | Where it runs | Status |
|---|---|---|---|
| T0 | First-party game code and assets, reviewed in this repository, addressed by content hash in a release manifest | The museum origin | The only level that exists |
| T1 | Declarative content: scenarios, quests, skins, buildings, models, textures, data. Validated against a schema; never executed | Parsed on the museum origin by first-party code, inside limits | Designed; first pack at M3 |
| T2 | Programmable behaviour written by someone else | Never on the museum origin. A bounded interpreter with no network, clock, storage or DOM, with instruction and memory limits | **Off.** Stays off until an independent reviewer passes the attack fixtures (acceptance R13) |
| T3 | A whole third-party game | A sandboxed frame on a different origin, with a narrow message bridge | Not built. Needs a second hostname (G-0004) |

## What the current hosting gives and takes (checked in `site/public/_headers`)

- `script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval'`: no script from another origin can load. Inline script is allowed, so the policy does **not** stop injected markup from running: every string from a pack is inserted as text, never as HTML.
- `connect-src 'self' https://api.islam.museum …`: a page on the museum origin cannot fetch a manifest or a pack from GitHub or any other host. Importing a pack from a URL therefore needs a change to this header on the mod-manager route, which is a `submission-impacting` change (it adds a network call) and needs the founder. Until then, import is from a local file only. This is a useful default, not a nuisance: a local file cannot be swapped under the player after review.
- `worker-src 'self' blob:`, `img-src 'self' data: blob: …`, `media-src 'self'`, `object-src 'none'`, `base-uri 'self'`, `form-action 'self'`.
- No `Cross-Origin-Opener-Policy` or `Cross-Origin-Embedder-Policy`: pages are not cross-origin isolated, so there is no `SharedArrayBuffer`. No game depends on it.
- No `frame-ancestors`: museum pages may be framed by other sites (the embed pages rely on it). Play pages will need to decide this per route when portal builds exist.
- `scripts/check-static.ts` fails the build on `WebSocket`, `EventSource`, `XMLHttpRequest`, `sendBeacon`, a fetch to another origin, or a fetch of a non-static path in the site's own pages and scripts. Game runtime code will be held to the same rule by a gaming check, since the site check only scans `dist/*.html` and `dist/_astro`.

## Rules that follow

1. **No third-party code runs with first-party privileges.** A Web Worker shares the origin, its storage and its network rights; it is a thread, not a sandbox. `eval`, `new Function`, dynamic `import()` of a pack's file, pack-supplied shaders and pack-supplied HTML or SVG markup are all refused.
2. **A pack is data and is treated as hostile data.** Manifest parsed with a strict schema that rejects unknown critical fields and prototype keys (`__proto__`, `constructor`, `prototype`). Archive reader rejects path traversal, absolute paths, links, duplicate names, nested archives, and anything past a total size, a file count and a decompression ratio. Per-asset limits on bytes, texture size, vertex count, animation channels and parse time. glTF with external or remote buffers is refused. Decoding happens in a worker that is terminated on a time limit; the main thread only ever receives validated typed arrays.
3. **Every file is named in the manifest with its SHA-256**, and the digest is checked before use. A digest proves the file is the one the manifest names. It does not prove the pack is safe or who wrote it, and the interface never says it does.
4. **Namespaces.** Pack ids are `creator.pack:item`. A pack cannot define or override a museum record id. Text from a pack is shown as creator content, with its author, and never in the museum's voice.
5. **Separate saves and no ranked play with mods.** A game started with any pack writes to a modded save slot. Daily challenges and anything compared between players run with no packs loaded.
6. **The player decides, with the facts.** Before a pack is enabled: source, author as claimed, version, digest, size, licence, what it adds, and that it is unreviewed. Nothing updates itself. Safe mode starts every game with all packs off. Disable, remove and "clear everything" always work, including after a crash on load.
7. **No account, no upload, no public gallery** until moderation, reporting, takedown, privacy and child-safety rules exist and the founder approves the infrastructure. Sharing is a file the player sends.
8. **Content rules do not relax for creators.** The museum's content-safety block, its representation rules and its licence whitelist apply to anything the museum itself distributes or showcases.

## The games host (added 25 November 2026, when it was built; not yet deployed)

The museum's own games are served from their own address (`games.islam.museum`, UAT `uat-games.islam.museum`) by their own Worker (`workers/games`), from objects under `games/` in the environment's bucket.

- **A game's script cannot reach the museum's pages or storage**, because it runs on another origin. A defect in a game is a defect on the games' address.
- **The host decides the headers, not the release.** The Worker sets a content security policy under which a page loads scripts, styles, fonts and data only from its own address, with no inline script, no inline style and no eval; nothing uploaded can loosen it. Both games were opened in real Chrome under that policy without a violation (`evidence/release/`).
- **The Worker reads only under `games/`.** A path is refused unless it is made of letters, digits, dot, dash, underscore and slash, with no empty or hidden segment; the pointer file is ignored unless it is well formed, so a damaged pointer cannot name another part of the bucket. Tests ask for the museum's own pages through it and get a 404.
- **A release is verified three times** before it is live: after the build, after download in the deploy job, and after upload by reading it back from the bucket; each time every file is checked against the SHA-256 in the manifest. A release id in the bucket is never overwritten.
- **Known and accepted:** the buckets are public at `api.islam.museum` and `uat-api.islam.museum`, so the objects under `games/` can also be fetched there, without the Worker's headers. They are public static files. A game page opened from that address would run without the content security policy, on the API's origin, where there is nothing of a visitor's to reach; the address the museum links to is the games host.
- **The games' own models (added 25 November 2026).** A model is three kinds of file: a glTF description (JSON), a buffer of numbers, and JPEG textures. None of them is a program and the loader runs none of them; they are fetched from the games' own address, which is all the content security policy allows. Only files named in `gaming/art/manifest.json`, which is reviewed in git, can be uploaded as models, each byte for byte, under a path that can hold nothing but `.gltf`, `.bin` and `.jpg` below `games/media/models/`; a file already there with other contents is refused and not replaced. What is not defended against: a model that is simply too heavy for a weak machine (the manifest's test caps triangles and bytes for our own; a third party's would need its own limits), and whoever can write to the bucket outside this workflow.
- **Not covered by this:** third-party games, packs and any programmable mod. They are not served from the games host either until they have a sandboxed origin of their own and pass the fixtures below.

## Attack fixtures to build (acceptance R12)

Each has an expected refusal or recovery and a check that the museum's pages are untouched.

| Attack | Expected |
|---|---|
| Manifest with `__proto__` or `constructor` keys; deeply nested JSON; a 50 MB string | Rejected by the parser with a typed error; no object prototype changed |
| Archive entry `../../x`, an absolute path, a symlink, two entries with one name | Rejected before any file is read |
| A zip bomb (high ratio) and a nested archive | Rejected by ratio and by type |
| Asset whose bytes do not match its digest | Rejected; pack not enabled |
| SVG or HTML in a text field, `javascript:` and `data:` URLs in a link field | Shown as text; links limited to `https:` and to museum paths |
| glTF with a remote buffer URI, an out-of-range accessor, 50 million vertices, a 16k texture | Rejected by the validator or the limits |
| A pack that claims the id of a museum record | Rejected |
| Dependency cycle; a dependency at an incompatible version | Refused with the cycle or conflict named |
| A pack that makes its game crash on load | Game restarts in safe mode; save untouched |
| An update that asks for a new capability | Not applied until the player reviews it |
| Forged message to the T3 bridge (wrong origin, wrong nonce, oversized, out of sequence, flood) | Dropped; frame is closed after a limit |
| A modded save loaded into a ranked mode | Refused, with the reason |

## Supply chain

Dependencies are pinned to exact versions in `gaming/package-lock.json`. `npm --prefix gaming audit` reported 0 vulnerabilities on 25 November 2026, after the first choice of test runner (vitest 3.2.x) was replaced because two of its dependencies had open advisories. A dependency is added only with a reason in an ADR. The gaming workflow, when written, pins its actions and gets no production secret on pull requests.

## Not yet examined

Portal embedding (clickjacking and the frame rules for third-party game sites); the online services of specification 11, none of which is proposed; abuse of share links, which do not exist yet.
