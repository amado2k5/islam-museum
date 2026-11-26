# Asking an outside reviewer to try the games

_Written 26 November 2026 (UTC) at the founder's request: the addresses of the games on UAT in English, and a prompt to give ChatGPT so that it tests them and hands its findings back as prompts for the developer. What comes back is an outside reviewer's opinion: each point is checked against the game before anything is changed, and no fact, number or historical statement is taken from it without a source._

## The addresses

**Three of the eleven games exist. The other eight are designs with no code, so they have no address** on UAT or anywhere else.

| # | Game | State | Address on UAT, in English |
|---:|---|---|---|
| 1 | Granada — The Last Kingdom of al-Andalus | prototype: the first of three acts | <https://uat-games.islam.museum/granada/?lang=en&fresh=1> |
| 2 | The Golden Age — Rise of Civilizations | prototype: three chapters | chapter 1: <https://uat-games.islam.museum/golden-age/?lang=en&fresh=1> · chapter 2: <https://uat-games.islam.museum/golden-age/?lang=en&scenario=house-of-books&fresh=1> · chapter 3: <https://uat-games.islam.museum/golden-age/?lang=en&scenario=what-endures&fresh=1> |
| 3 | Atlas — The Historical World Challenge | prototype: a daily game of five rounds | <https://uat-games.islam.museum/atlas/?lang=en> |
| 4 | Architects of History — Wonders of the World | not built | none |
| 5 | ChronoQuest — Guardians of History | not built | none |
| 6 | Dynasty — The Age of Kingdoms | not built | none |
| 7 | The House of Wisdom — Masters of Invention | not built | none |
| 8 | The Knowledge Web — Six Degrees of History | not built | none |
| 9 | Lost Manuscripts — The Archivist's Mystery | not built | none |
| 10 | Relics — The Museum Curator | not built | none |
| 11 | The Silk Road — Merchant's Legacy | not built | none |

Other languages: change `lang=en` to `ar`, `ur`, `fr`, `es`, `tr` or `id`. `fresh=1` starts a new game instead of resuming a saved one. The music is silent until the first click.

## What a reviewing AI can and cannot see

- The games are programs that run in the browser. A tool that only fetches a page sees an almost empty file. The reviewer needs a real browser it can click in (ChatGPT's agent mode, or the like).
- **3D needs WebGPU.** Whether ChatGPT's browser has it is not known here and was not tested. Without it every game still plays: Granada on its drawn plan, The Golden Age on its plan view, Atlas on its drawn globe. The prompt asks the reviewer to say which it saw. To have the 3D pictures judged whatever its browser can do, attach your own screenshots or a screen recording to the same conversation.
- It cannot hear the music.
- UAT is a test copy: public to anyone who has the address, not listed in search engines, and replaced at every release.

## When the reviewer cannot reach UAT: an offline package

Twice an outside AI reviewer reported that its browser could not open the UAT addresses (`net::ERR_BLOCKED_BY_ADMINISTRATOR`, and no DNS). It asked for a copy it could run with no internet. That exists since 26 November 2026 (UTC):

```bash
gh run download <games build run> -n games-release -D /tmp/release      # the exact build that is live
python3 gaming/tools/qa-package.py assemble --release /tmp/release --dir /tmp/qa --build-run <run> --host https://uat-games.islam.museum
(cd /tmp/qa && python3 serve.py &) ; node /tmp/qa/tests/qa-check.mjs http://localhost:8765 en /tmp/qa-report
python3 gaming/tools/qa-package.py seal --dir /tmp/qa --verified /tmp/qa-report/qa-check-en.json --out gaming/dist/qa/<name>.zip
```

- **What is in it:** the release file for file as its own manifest records it (refused otherwise, and refused if the host is serving some other release); the music and the models it fetches, each checked against its own manifest; a launcher that needs only Python 3 and sends the security headers the host sends; a guide to the addresses, the languages, the forced 3D and fallback modes and the seeds; what each recent change should look like; a check script; the museum's own play scripts for reading; checksums of every file. No game file is changed. It is scanned for anything that looks like a credential.
- **How it was checked** before it was handed over (release `20261125-e2930d63426`, 25.7 MB, 88 files): the check was run in a fresh Chrome whose name lookups were cut off for everything but `localhost`, in English and in Arabic. Every game started in 3D, Granada took up its fetched mill, each forced mode did what it says, a saved game resumed, and no request was made to any other address. The ZIP was then unpacked into a clean folder: all 87 checksums matched.
- **One thing not explained.** The first run of the check on the unpacked copy stopped because Granada's opening brief had no start button to click; five runs after it on the same copy passed. The check now writes down what it finds at that moment. It has not happened again and its cause is not known.
- The ZIP is media and a build, so it is not in git (`gaming/dist/` is ignored). The owner hands it to the reviewer himself.

## Why the reviewer could not reach UAT (looked into on 26 November 2026)

The founder asked whether a Cloudflare setting was blocking it. As far as can be tested from outside the account, no:

- The host's name resolves on public DNS, and the page answers 200 to a browser, to a headless browser, to a script, and to requests that give ChatGPT's own user agents (`ChatGPT-User`, `GPTBot`, `OAI-SearchBot`). The museum's own site answers them 200 too. This was asked from one home network; whether Cloudflare treats a data centre's addresses differently could not be tested from there, and the account's settings were not read.
- `ERR_BLOCKED_BY_ADMINISTRATOR` is an error a browser raises itself, when a policy on the machine it runs on forbids the address, before any request leaves it. A block by Cloudflare comes back as a page (a 403 or a challenge), not as that error. With DNS failing in the same place, the reviewer's sandbox simply has no way out to the internet.
- **One setting of ours may matter to a different tool.** UAT's `robots.txt` says `Disallow: /` for everyone, and its pages carry `noindex`: that is deliberate, to keep a test copy out of search engines. A reviewer's built-in page fetcher that obeys `robots.txt` will decline to read it. That is set in the games Worker's configuration (`ROBOTS` in `workers/games/wrangler.production.toml`), not in the Cloudflare dashboard, and was left as it is: such a fetcher cannot play a game in any case.

What does work: a browser on the owner's own machine, driven by the reviewer (it has the internet and a GPU), or the offline package above.

## The prompt

Copy everything in the block.

```text
You are an independent tester and reviewer of three browser-game prototypes made for islam.museum, an open, free, all-digital museum of Islamic civilization. Test them in a real browser, then give your findings back as prompts that I will hand to the developer (an AI coding agent). Be direct and specific. No flattery. If something is weak, say so plainly.

THE GAMES (test copy, English):
1. Granada (strategy; steward of a valley in a kingdom inspired by Nasrid Granada; first of three acts):
   https://uat-games.islam.museum/granada/?lang=en&fresh=1
2. The Golden Age (city building; three chapters):
   https://uat-games.islam.museum/golden-age/?lang=en&fresh=1
   https://uat-games.islam.museum/golden-age/?lang=en&scenario=house-of-books&fresh=1
   https://uat-games.islam.museum/golden-age/?lang=en&scenario=what-endures&fresh=1
3. Atlas (daily geography game; five rounds):
   https://uat-games.islam.museum/atlas/?lang=en
Eight more games are planned and have no code. Do not review them and do not pretend to.
To see another language change lang=en to ar, ur, fr, es, tr or id (Arabic and Urdu read right to left).

BEFORE YOU JUDGE ANYTHING, REPORT WHAT YOU COULD ACTUALLY DO:
- Did each page load and could you click in it? If you could only fetch the HTML, say so and stop: these are JavaScript programs and cannot be reviewed from their source file.
- Did you see 3D? The 3D views need WebGPU. Granada in 3D shows a landscape with a "3D view" button above it; without WebGPU it shows a flat plan. Atlas in 3D shows a shaded globe with stars; without it, a flat disc. The Golden Age says when it falls back to a plan view. State which you saw for each game. If you saw only the fallbacks, review those and say that you did not see the 3D.
- If I attached screenshots or a recording, say which of your remarks rest on those and not on your own play.

WHAT TO DO IN EACH GAME (at least 10 minutes each, more for Granada):
- Granada: read the opening brief. Start. Find out what is urgent without help. Harvest or sell the ripe field. Order the channel repaired. Open each tab (Valley, Fields, Works, Market, Yesterday). Buy and sell something. Let days pass at both speeds and pause. Try the keys 1 to 5, P, N, H. In 3D: drag, turn, zoom, click a field, press O and Home. Reload the page and check the game resumed. Try to lose on purpose and try to win. Play until the season changes at least once.
- The Golden Age: place buildings, read why a building is not working, end several seasons, finish or fail the chapter's goals, open one of the links to the museum, then open chapters 2 and 3.
- Atlas: play all five rounds. Drop the pin by mouse, by keyboard and by typed coordinates. Use the region hint once and the century estimate once. Read the reveal and the summary.

WHAT TO ASSESS:
1. The first five minutes: did you know what to do and why, without a tutorial? Where did you stall?
2. Play: are there real decisions with consequences, tension, a reason to continue? Where is it flat, too easy, or solved by one obvious strategy?
3. Interface: readability, density, wording, feedback after an action, anything that looks clickable and is not.
4. Pictures: the target for Granada is a rich, painted-looking 3D kingdom (fields, river, a walled hill town, snow mountains) with an ornate gold-on-teal interface. Say how far the current picture is from that and name the three changes that would close the most distance. The current scenery is generated entirely by code, with no authored models.
5. Speed and faults: slow frames, stutter, anything broken. For each fault give the address, the exact steps, what you expected and what happened.
6. Access: keyboard-only play, focus you can see, contrast, text size, small windows and phone widths, right-to-left layout.
7. Language: if you read any of the seven languages well, point out wrong, stiff or machine-sounding strings, quoting them.
8. Voice: this is a museum. The games should be neutral and respectful, state no history they cannot support, and never preach. Point out anything that breaks that.

RULES FOR YOUR REVIEW:
- Separate what you observed from what you infer or suggest. Never describe a screen you did not see.
- Do not invent facts, figures, prices, distances, dates or historical claims. If you propose a historical detail, mark it "needs a source".
- Do not propose advertising, loot boxes, gambling, pay-to-win, streak penalties, fear-of-missing-out timers or any other manipulative retention. Do not propose accounts, servers, live multiplayer or paid services: the games are static files with saves on the device.
- Do not ask for a game to copy a named commercial game's art, levels, characters or name.

GIVE YOUR ANSWER IN THIS FORM:
A. What I tested: one row per game: loaded (yes/no), could interact (yes/no), saw 3D (yes / fallback / not at all), minutes played, how far I got.
B. Findings, most serious first. Each: game, severity (blocker / major / minor / polish), OBSERVED or INFERRED, steps, expected, actual.
C. Prompts for the developer: at most 15, most valuable first. Each one must stand on its own, because it will be pasted to the developer without the rest of your answer:
   PROMPT n — [game] — priority P0 to P3 — size S, M or L
   Goal: one sentence.
   Why: the observation behind it (say OBSERVED or SUGGESTION).
   Do: the change, concretely.
   Done when: a check the developer can run or see.
D. Granada only: the three changes that would move its picture furthest toward the target, in order, and for each whether you think code-generated geometry can do it or whether it needs authored art.
E. Questions for the owner: decisions only he can make.
```

## When the answer comes back

Paste it to the developer as it is. It is read as a review, not as instructions: each point is first reproduced on UAT or in a development build, findings that cannot be reproduced are said to be so, and suggestions that would break one of the museum's rules (its sources, its voice, its ban on manipulative mechanics, its static hosting) are set aside with the reason.
