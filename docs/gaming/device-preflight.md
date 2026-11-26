# The games' device check, and the page a refused device sees

_26 November 2026. Asked for by the founder's directive of that day ([`hudhud/owner-directive-2026-11-26-production-completion.md`](hudhud/owner-directive-2026-11-26-production-completion.md), section 9) for every game. Code: `gaming/packages/platform/`. **All four games stand behind it since 26 November 2026** (Hudhud first; Granada, The Golden Age and Atlas the same day)._

## What it does

Before a game fetches its engine or any large file, a small first script reads the device, judges it, and either lets the game load or shows a plain page, in the visitor's language, that says the game is not supported here, each reason why, what would work, and how to put it right where that is possible. The page is a heading, a list, a button and links: no canvas, no spinner, no reload loop.

Measured on Hudhud's release build: the first script is **9,258 bytes**; the game itself (1,501,176 bytes, the engine included) is fetched only after the check passes. An emulated phone fetched none of it.

## What is refused, and how it is told

| Reason | How it is decided |
|---|---|
| A phone | the browser says "mobile"; or the name of a phone; or a finger-first device whose screen's shorter side is under 600 CSS pixels. A phone that claims a wide page or asks for the "desktop site" is still a phone |
| A tablet | a tablet's name, an iPad saying it is a Mac (a Mac has no touch screen), or any finger-first device that is not a phone. **All are refused today**, because none has been tested on a real device; a game that has tested one can allow them |
| Screen too small | the screen's longer side under 1280 or its shorter side under 800 CSS pixels |
| Window too small | the screen is large enough but the page's own area is under 1280 by 800. The page says to enlarge the window or go full screen, and the game starts by itself when it is large enough |
| Browser too old | Chrome or Edge before 120, Firefox before 121, Safari before 17 |
| Browser unknown | not Chrome, Edge, Firefox or Safari, or a page opened inside another app |
| No WebGL 2 | the browser cannot make a WebGL 2 context |
| No hardware acceleration | WebGL 2 is drawn by software (the renderer names SwiftShader, llvmpipe or similar) |
| Largest picture too small | the graphics card's largest texture is under 4096 |
| No storage | only for a game that cannot be played without saving; none asks for this yet |

Every reason is given at once. `deviceMemory` and the number of processors are not used: the directive says not to refuse on them.

**The override for testing** is `?preflight=off`, honoured only on a developer's machine (`localhost`, `127.0.0.1`) or a host whose name begins with `uat-`. On `games.islam.museum` it does nothing; a test holds that.

## What was run

- `gaming/packages/platform/test/preflight.gtest.ts`: nine tests of the rules.
- `gaming/tools/hudhud-checks.ts`, in real Chrome: an emulated phone in all seven languages is told it is not supported, with the right reading direction, a way back to the museum, a summary of the game, and none of the game fetched; a window of 1000 by 700 on a large screen is told so and the game starts by itself when the window is made 1300 by 850; a browser with WebGL refused is told why before the engine is fetched, and "Try again" does not loop.

## What follows from the rule, which the founder should see

1. **Laptops with a 1366 by 768 screen are refused.** That is one of the commonest laptop screens in the world. The directive sets 1280 by 800 as the least; this is the consequence.
2. **The M1 MacBook Air, one of the two reference machines, is refused in an ordinary window at its default setting.** Its screen is 1440 by 900 points, and a browser's own bars leave the page under 800 tall. It passes in full screen. The page tells the player to do that; a first-time visitor still meets a refusal before the game.
3. **Hudhud can no longer be played "in words" on a device without WebGL 2.** The list under the picture still plays the whole quest if the graphics fail after the door, and for a player who does not use the picture; a device that fails the door never reaches it.
4. **The browser versions are floors of features, chosen by the agent, not a tested list.** The tested list (`gaming/packages/platform/support.json`) holds Chrome 158 on one Mac. Edge, Firefox and Safari pass the door on their features and have not been run.
5. **No real phone or tablet was used.** The refusals were checked with Chrome emulating one.

## Added after review, 26 November 2026

- With scripts off, or in a browser that cannot run them, the page is no longer blank: it says in all seven languages that the game needs JavaScript and a current browser, with the way back to the museum.
- On the refusal page the skip link now has somewhere to land.
- The review also observed that Edge, Firefox and Safari pass the door without being on the tested list. That is the choice described in point 4 above, left as it is for the founder to rule on: refusing every untested browser would today leave Chrome on one Mac.

## The other three games

Granada, The Golden Age and Atlas each have a first script of a dozen lines (`games/<id>/src/ui/gate.ts`, through `packages/platform/src/behind.ts`) and one changed line in their page: the script it loads. Nothing of their own code was touched. `gaming/tools/platform-gate.ts` checks every game in the registry in real Chrome: an emulated phone, in Arabic and English, is told it is not supported, the game's own markup is out of sight, and none of its engine is fetched; a desktop gets the game. Eight checks, all passing. Their own play-through tools were run afterwards: Granada's and Atlas's pass; The Golden Age's plays through and ends on one console error, a 404, in a worktree that has no music files, which its music step asks for (inferred from where it failed and from the release smoke, which loads the same page with no failed request; not confirmed by running the tool on the commit before).

## Not done

- The check after the game has started: a window made smaller in play, a display unplugged, a browser updated. The directive asks for these to be tested.
- A readable accessibility summary on the refusal page beyond the game's own note.
- Combinations of zoom and device pixel ratio.
