# Hudhud: The Atlas of Wonders

_A 2D story game for the museum's gaming platform. Working title. **Prototype: one scene of a few minutes.** Started 26 November 2026 on the founder's instruction, which is filed here unedited and governs: [`owner-instruction-2026-11-26.md`](owner-instruction-2026-11-26.md) (SHA-256 `5942fd78824a788cadc656dba755730498b7d1749fb280a476df231006f20b66`; taken from the session it was pasted into, as that message's pasted text)._

## The first decision package (the instruction's section 14)

| # | Asked for | Where | In one line |
|---|---|---|---|
| 1 | Repository discovery; files and flows to reuse or change | [architecture](architecture.md) | the games workspace, its release build, Worker, string check and shared music are reused as they are; thirteen shared files changed by small edits; nothing under `site/` |
| 2 | Checksums and the 80-to-50 table | [traceability](traceability.md), `gaming/games/hudhud/src/content/atlas.v1.json` | the founder's count is exact: 50 subjects, 30 in both languages, 10 English only, 10 Arabic only; every subject joined to museum records that exist |
| 3 | Engine decision with measurements and the pinned version | [G-0013](../adr/G-0013-hudhud-2d-engine.md) | Phaser 4.2.1; 311 KB compressed for the whole page; runs under the games host's security policy; rules kept outside the engine |
| 4 | Title options and search status | [design](design.md#the-title) | four options; the working title clashes with the platform's game "Atlas"; **the search was not run** |
| 5 | Loop, world map, quest and mechanic matrix, estimate | [design](design.md) | twelve systems for fifty quests, three built; about a year from an accepted look, and no date without one |
| 6 | Golden-scene brief, sprite list, UI wireframe, media budget | [art bible](art-bible.md) | the scene is built with code-drawn pictures that are **not** at the level of the supplied art; four routes to real art, and one question for the founder |
| 7 | Architecture, schemas, dependencies | [architecture](architecture.md), [G-0014](../adr/G-0014-hudhud-narrative-and-content-format.md) | one new dependency |
| 8 | Website Play and navigation plan | [website plan](website-plan.md) | a proposal only; a header entry rewrites every page and is held for the weekly batch |
| 9 | Accessibility, child safety, languages, history, assets | [accessibility and the rest](accessibility.md), [the review ledger](../historical-review/ledger.md) | much is built; nothing is audited, read by a native speaker, reviewed by a historian or played by a child |
| 10 | The golden scene, running, with captures and tests | `gaming/games/hudhud/`, [test plan](test-plan.md), [evidence](../evidence/hudhud/golden-scene/) | plays start to finish in Chrome in seven languages; 109 tests of its own |

Also: [**what remains before it is a whole game**](remaining.md); [the state of the game](../games/hudhud.md); [the player's explorers](explorers.md) (a girl or a boy, built; a roster by region and century, proposed); [the pause of the other games](pause-of-other-games.md).

## What the founder is asked to decide

1. **The look.** Compare [the sheet](../evidence/hudhud/golden-scene/comparison-founder-pictures-and-running-scene.webp), or play the scene (below). Accept it, or reject it and choose a route for real art ([art bible](art-bible.md#how-the-art-can-actually-be-made)). No art is made in number before his word.
2. **How were the 80 thumbnails made, and may that process make game art?** The answer chooses between an illustrator and that process.
3. **The prism.** Keep it as labelled invention, or remove it until a reviewer rules (ledger HR-HH-03).
4. **Reviewers.** None is named. One in the history of science would unblock world 3.
5. **The title**, and a go-ahead for a proper search.
6. **The website plan**: approve, change, or hold until the look is accepted.
7. **UAT.** Released to UAT on 26 November 2026 at his word, as release `20261126-63e2fd9dc25`: `https://uat-games.islam.museum/hudhud/?lang=ar`. Each further UAT release needs his word again; production is his alone.

## Found in passing in the museum's records, and not changed

While looking for names to show in the Atlas, the museum's own labels were read for the fifty subjects (26 November 2026). They were not used, and nothing in `data/` was touched; this is reported for whoever owns those records:

- 39 of the 50 first records, all of them `person` records, have no Turkish and no Indonesian `label`.
- Five have an Arabic `label` only: `person/nasir-al-din-al-tusi`, `person/ibn-al-shatir`, `person/ibn-al-baytar`, `person/wallada-bint-al-mustakfi`, `person/usama-ibn-munqidh`.
- Some Turkish labels read as mistranslations: `concept/pigeon-post` is «Mesaj Banyosu (kartlar)», which says "message bath"; `work/alf-layla-wa-layla` is «Bin Bir Gece (Efsanelerinin Hazarı)». Seen earlier the same day, outside the fifty: `work/kitab-al-manazir` (the Book of Optics) is «Tartışmalar Kitabı» in Turkish and «Buku Perdebatan» in Indonesian, both of which say "book of debates".

## To play it on this machine

```bash
npm --prefix gaming run dev
```

Then open `http://127.0.0.1:4330/games/hudhud/index.html?lang=ar` (or `en`, `ur`, `fr`, `es`, `tr`, `id`). Add `&q=high`, `&style=story` or `&motion=reduced` to try a preset. The music control appears only where the museum's tracks have been imported (`npm --prefix gaming run music:import`).

```bash
npm --prefix gaming run hudhud:play -- media/hudhud/captures/mine en high 1920 1080
```

plays it in real Chrome and writes pictures and a report.

## What is not done (do not read this as a finished phase)

Phase 0's documents are written and Phase 1's scene runs, but **Phase 1 is not complete until the founder accepts the look in words**. Not done in Phase 0 and 1: the title search; a recording (there are stills, no video); measurements on either reference machine; a screen-reader pass; any playtest; a story bible beyond the frame and the world table. Phases 2 to 4 are not started.
