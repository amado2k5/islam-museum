# Hudhud and the museum's site: the Play pages and the menu — a plan, nothing built

_26 November 2026. **No file under `site/` or `i18n/` is changed by this work.** This is the proposal the change gates ask for before any such edit ([`docs/ai-change-gates.md`](../../ai-change-gates.md), section 1); it needs the founder's approval, and one part of it rewrites every page of the museum._

## What is there today

- No `/[lang]/play/` page exists, and no menu or footer entry points at the games. The games ledger says of the public site: "Nothing".
- The games are served from their own host by their own Worker (`uat-games.islam.museum`; production `games.islam.museum` is not deployed). The site never imports them ([G-0004](../adr/G-0004-hosting-and-release-model.md)), and two tests hold the two sides apart (`scripts/games-separation.test.ts`, `workers/games/test/separation.test.mjs`).
- The founder's instruction on Granada of 25 November 2026 already asked for a Play entry at the top of the landing page; it was not built.
- `site/src/layouts/BaseLayout.astro` and the components it always renders are baked into about 164,000 pages (`tools/deploy/shell-paths.list`).

## What is proposed

| Piece | Files | Rewrites every page? | Risk label |
|---|---|---|---|
| 1. `/[lang]/play/`: the games' landing page | `site/src/pages/[lang]/play/index.astro` (new); `i18n/*.yaml` (a `play` block in all seven) | no: new pages only | `submission-impacting` (a new public page and new links to another host; the privacy posture is unchanged because the page loads nothing from the games host) |
| 2. `/[lang]/play/hudhud/`: the game's own page | `site/src/pages/[lang]/play/hudhud.astro` (new); the same i18n block | no | as above |
| 3. A Play box on the home page | the home page component only | no: one page a language | `non-impacting` |
| 4. A Play entry in the header and footer | `BaseLayout.astro` or the header component; `i18n/*.yaml` shell blocks | **yes** | to be labelled `rewrites-all-pages` and held for the founder's weekly batch |

**Where the cards come from.** One small data file in the site, `site/src/data/games.json`, written by a script from `gaming/games/registry.json` and each game's state page: id, status, the seven names and blurbs, languages, controls, hardware, a poster's address. The site reads data, never code, so the separation tests still pass; a new test checks the file against the registry so the two cannot disagree. Granada stays first, as the founder ruled.

**What a card and the Hudhud page say, and only what is true on the day:** "Prototype" and "Working title"; one scene of a few minutes; seven languages, machine-drafted; keyboard, touch and (untested) gamepad; a computer or tablet with WebGL; nothing leaves the device; "The story is invented; the people were real or are marked as story tradition; historical review pending"; that the pictures are a code-drawn trial. The poster is a capture of the running game, not a concept image.

**Links.** On UAT the Play button opens `https://uat-games.islam.museum/hudhud/?lang=<lang>`. On production there is no games host yet, so the production build shows the card and the page with "not yet released" and **no link** until the founder deploys the games to production and says so. The build reads which it is from the deploy environment, as the existing workflows already distinguish UAT from production.

**No script, cookie, form or network call is added to the site.** The Play pages are static and readable without JavaScript.

## Order and checks

1. Pieces 1 to 3 in one pull request: `npm run validate`, `npm test`, `npm run build`; the claims register and the evidence map updated in the same commit if the founder confirms the `submission-impacting` label.
2. Piece 4 in its own pull request, labelled `rewrites-all-pages`, for the weekly batch.
3. Nothing goes live until the founder deploys the site; nothing links to production games until he deploys those.

## Decisions wanted from the founder

- Approve this proposal, or change it.
- Should the Play pages wait for an accepted look, or be built now against UAT with the "trial" wording?
- The title clash on the Play page between **Atlas** and **Hudhud: The Atlas of Wonders** ([design](design.md#the-title)).
