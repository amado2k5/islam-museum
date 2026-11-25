# Public SDK, extension API and third-party games
Design API-first with public TypeScript types plus JSON Schema and documented semantic versions. Example interfaces below are proposed; implement and lock via ADR after proving Golden Age and Atlas consumers. Public SDK never exposes raw internal state, credential, DOM or unrestricted network. Use command/query interfaces and events, typed errors, quotas, capabilities and stable IDs. Document compatibility, deprecation period, migration and examples. Publish source and license only after founder/repository approval; choose licenses for code, data and assets independently.

```ts
interface GameHostV1 {
 readonly gameId: string;
 readonly apiVersion: string;
 content: { get(id:string): Promise<PublicRecord|null>; search(q:ContentQuery):Promise<PublicRecord[]> };
 assets: { resolve(id:string):Promise<AssetHandle> };
 input: { subscribe(action:string, cb:(e:InputEventDTO)=>void):Unsubscribe };
 saves: { load(slot:string):Promise<SaveEnvelope|null>; commit(slot:string, data:SaveEnvelope):Promise<void> };
 events: { emit(event:GameEvent):void; subscribe(type:string, cb:(e:GameEvent)=>void):Unsubscribe };
 ui: { registerPanel(panel:PanelDescriptor):Unsubscribe };
}
interface GameModuleV1 { manifest:GameManifest; mount(host:GameHostV1):Promise<GameSession>; }
interface GameSession { start():Promise<void>; pause():void; resume():void; dispose():Promise<void>; }
```
First-party trusted adapters may expose richer rendering handles; untrusted mods get only serialized capability-checked messages, never these internal functions or actual DOM. Namespacing `creator.pack:item`, no override of canonical record IDs; overlay overrides explicit and local. Registry resolves game ID, compatible API range, capabilities, localization keys, assets, checksums, dependencies and content packs. Use typed discriminated unions; reject unknown critical fields. Document version constraints and exact pinned versions in lockfile, dependency cycles, conflict choices and revocation.

## Developer workflow
Developer mode in portal settings and each game's menu. Add GitHub release URL, immutable HTTPS manifest, or local ZIP. Parse URL as data; no executing repo install scripts, no arbitrary cloning in browser. Prefer release asset or explicitly published manifest with CORS; GitHub repo URL resolves through documented public release/manifest mechanism when possible; on failure show direct manifest and ZIP instructions, not a privileged proxy. Display author, version, digest, provenance, license, compatibility, permissions and size before enable. Preview isolated. Profile toggle, disable, pin, update review, rollback, safe-mode reset, export lock. No automatic update of executable content without approval. Support offline local import; initial curated registry static reviewed PRs; new games submit manifest, build, license, controls, test evidence and moderation review. Independently hosted third-party games can be linked or isolated iframe with minimal bridge, never arbitrary first-party navigation execution.

## Deliverables
Document quickstart, sample starter game, skin, character, building, scenario, scripted rules example, migration example, API reference generated from types, CLI `init/validate/pack/test`, local preview/hot reload, compatibility CI, debugging overlay and troubleshooting. Prove a separate example repo or test fixture can create a skin and a location, load them in a real game, save and reopen, disable and recover without core edits. Prove third-party game onboarding. Use fixtures with malformed manifests and version conflicts. Use [Factorio mod API](https://lua-api.factorio.com/latest/), [Minecraft manifests](https://learn.microsoft.com/minecraft/creator/reference/content/addonsreference/examples/addonmanifest), [mod.io docs](https://docs.mod.io/) as patterns, not code sources. See security module before adding behavior execution.
