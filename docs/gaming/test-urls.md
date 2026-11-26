# Where to try the games

_Written 25 November 2026. Three games exist, all prototypes: **Granada** (first in every list), **The Golden Age** and **Atlas**. Nothing is on the public site and nothing is deployed to production._

| Game | What you get |
|---|---|
| Granada | the first scenario, "Water for the Valley"; panels, a drawn plan and a 3D valley (where the browser has WebGPU) |
| The Golden Age | three chapters; 3D where the browser offers WebGPU, a plan view otherwise |
| Atlas | a daily five-round geography game from museum records, on a globe lit in 3D where the browser has WebGPU (`&no3d=1` for the drawn globe) |

## 1. On this Mac (the development build, with the music)

Needs the development server running (`npm --prefix gaming run dev`, or the launch configuration `gaming-dev-lan`). The Golden Age is in 3D here.

| Game | Arabic | English | Urdu | French | Spanish | Turkish | Indonesian |
|---|---|---|---|---|---|---|---|
| **Granada** | [ar](http://localhost:4330/games/granada/index.html?lang=ar) | [en](http://localhost:4330/games/granada/index.html?lang=en) | [ur](http://localhost:4330/games/granada/index.html?lang=ur) | [fr](http://localhost:4330/games/granada/index.html?lang=fr) | [es](http://localhost:4330/games/granada/index.html?lang=es) | [tr](http://localhost:4330/games/granada/index.html?lang=tr) | [id](http://localhost:4330/games/granada/index.html?lang=id) |
| **The Golden Age** | [ar](http://localhost:4330/games/golden-age/index.html?lang=ar) | [en](http://localhost:4330/games/golden-age/index.html?lang=en) | [ur](http://localhost:4330/games/golden-age/index.html?lang=ur) | [fr](http://localhost:4330/games/golden-age/index.html?lang=fr) | [es](http://localhost:4330/games/golden-age/index.html?lang=es) | [tr](http://localhost:4330/games/golden-age/index.html?lang=tr) | [id](http://localhost:4330/games/golden-age/index.html?lang=id) |
| **Atlas** | [ar](http://localhost:4330/games/atlas/index.html?lang=ar) | [en](http://localhost:4330/games/atlas/index.html?lang=en) | [ur](http://localhost:4330/games/atlas/index.html?lang=ur) | [fr](http://localhost:4330/games/atlas/index.html?lang=fr) | [es](http://localhost:4330/games/atlas/index.html?lang=es) | [tr](http://localhost:4330/games/atlas/index.html?lang=tr) | [id](http://localhost:4330/games/atlas/index.html?lang=id) |

Also: [the graphics lab](http://localhost:4330/labs/graphics/district.html) (the reference city in two engines; an English-only developer page).

## 2. From a phone or another computer on the same network

The development server is listening on this Mac's network address while the launch configuration `gaming-dev-lan` is running. Find this Mac’s address with `ipconfig getifaddr en0`, and put it in place of `<this-mac>` below.

| Game | Arabic | English | Urdu | French | Spanish | Turkish | Indonesian |
|---|---|---|---|---|---|---|---|
| **Granada** | [ar](http://<this-mac>:4330/games/granada/index.html?lang=ar) | [en](http://<this-mac>:4330/games/granada/index.html?lang=en) | [ur](http://<this-mac>:4330/games/granada/index.html?lang=ur) | [fr](http://<this-mac>:4330/games/granada/index.html?lang=fr) | [es](http://<this-mac>:4330/games/granada/index.html?lang=es) | [tr](http://<this-mac>:4330/games/granada/index.html?lang=tr) | [id](http://<this-mac>:4330/games/granada/index.html?lang=id) |
| **The Golden Age** | [ar](http://<this-mac>:4330/games/golden-age/index.html?lang=ar) | [en](http://<this-mac>:4330/games/golden-age/index.html?lang=en) | [ur](http://<this-mac>:4330/games/golden-age/index.html?lang=ur) | [fr](http://<this-mac>:4330/games/golden-age/index.html?lang=fr) | [es](http://<this-mac>:4330/games/golden-age/index.html?lang=es) | [tr](http://<this-mac>:4330/games/golden-age/index.html?lang=tr) | [id](http://<this-mac>:4330/games/golden-age/index.html?lang=id) |
| **Atlas** | [ar](http://<this-mac>:4330/games/atlas/index.html?lang=ar) | [en](http://<this-mac>:4330/games/atlas/index.html?lang=en) | [ur](http://<this-mac>:4330/games/atlas/index.html?lang=ur) | [fr](http://<this-mac>:4330/games/atlas/index.html?lang=fr) | [es](http://<this-mac>:4330/games/atlas/index.html?lang=es) | [tr](http://<this-mac>:4330/games/atlas/index.html?lang=tr) | [id](http://<this-mac>:4330/games/atlas/index.html?lang=id) |

Browsers offer WebGPU only on `https` or on `localhost`. So at these addresses **The Golden Age shows its plan view instead of 3D**; Granada and Atlas are unaffected. The device must be on the same network as the Mac.

## 3. On the test copy (UAT), from anywhere

The release build, served by the games' own Worker, deployed on 25 November 2026. It is `https`, so The Golden Age is in 3D where the browser supports WebGPU. The music plays after your first click or key press. Search engines are told to ignore it.

| Game | Arabic | English | Urdu | French | Spanish | Turkish | Indonesian |
|---|---|---|---|---|---|---|---|
| **Granada** | [ar](https://uat-games.islam.museum/granada/?lang=ar) | [en](https://uat-games.islam.museum/granada/?lang=en) | [ur](https://uat-games.islam.museum/granada/?lang=ur) | [fr](https://uat-games.islam.museum/granada/?lang=fr) | [es](https://uat-games.islam.museum/granada/?lang=es) | [tr](https://uat-games.islam.museum/granada/?lang=tr) | [id](https://uat-games.islam.museum/granada/?lang=id) |
| **The Golden Age** | [ar](https://uat-games.islam.museum/golden-age/?lang=ar) | [en](https://uat-games.islam.museum/golden-age/?lang=en) | [ur](https://uat-games.islam.museum/golden-age/?lang=ur) | [fr](https://uat-games.islam.museum/golden-age/?lang=fr) | [es](https://uat-games.islam.museum/golden-age/?lang=es) | [tr](https://uat-games.islam.museum/golden-age/?lang=tr) | [id](https://uat-games.islam.museum/golden-age/?lang=id) |
| **Atlas** | [ar](https://uat-games.islam.museum/atlas/?lang=ar) | [en](https://uat-games.islam.museum/atlas/?lang=en) | [ur](https://uat-games.islam.museum/atlas/?lang=ur) | [fr](https://uat-games.islam.museum/atlas/?lang=fr) | [es](https://uat-games.islam.museum/atlas/?lang=es) | [tr](https://uat-games.islam.museum/atlas/?lang=tr) | [id](https://uat-games.islam.museum/atlas/?lang=id) |

Also: [which release is live](https://uat-games.islam.museum/_channel) and [its manifest](https://uat-games.islam.museum/release.json).

## Useful additions to an address

Add them after the `?lang=…`, joined with `&`.

| Addition | What it does | Games |
|---|---|---|
| `fresh=1` | Starts a new game instead of resuming the saved one | Granada, The Golden Age |
| `seed=7` | A particular game: the same seed gives the same weather (Granada) or the same district (The Golden Age) | Granada, The Golden Age |
| `music=off` | No music | all |
| `scenario=house-of-books` or `scenario=what-endures` (with `fresh=1`) | Opens chapter 2 or chapter 3 | The Golden Age |
| `no3d=1` | The plan view only | The Golden Age |
| `q=low` | No post-processing | The Golden Age |
| `date=2026-12-01` | The daily game of that date | Atlas |

Examples: [Granada, a new game in Arabic](http://localhost:4330/games/granada/index.html?lang=ar&fresh=1) · [The Golden Age, chapter 3 in English](http://localhost:4330/games/golden-age/index.html?lang=en&scenario=what-endures&fresh=1) · [Granada on UAT, a new game in Arabic](https://uat-games.islam.museum/granada/?lang=ar&fresh=1)

## What to expect

- **Granada** opens on its plan and, a moment later, shows a 3D valley where the browser has WebGPU (which browsers offer only over `https` or on `localhost`; over a plain network address the plan stays). The valley is generated from code: simple shapes under good light, not yet the painted kingdom of the concept image. Add `&no3d=1` for the plan alone, `&view=plan` to start on the plan, `&q=low` for a lighter picture. In the valley: drag to move, right-drag or Shift-drag to turn, the wheel to come closer, `O` for the whole valley, `Home` to go back. It is on UAT since the release `20261125-7c31b7631c6`.
- A saved game belongs to the address it was played at: a game begun on `localhost` is not on UAT, and the other way round.
- Keys in Granada: `1` to `5` for the tabs, `P` to pause or go on, `N` for one day, `H` for help.
- Production (`games.islam.museum`) does not exist yet.
