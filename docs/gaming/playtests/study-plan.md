# People who play: recruitment and study plan

_Written 26 November 2026 at the founder's request ([`../spec-production/owner-decisions-2026-11-26-b.md`](../spec-production/owner-decisions-2026-11-26-b.md), O4). **No tester has been recruited and no session has been held.** The founder recruits, or appoints a coordinator who does. Until people have played, no gate of enjoyment, difficulty, understanding or "hours of engagement" passes. The session itself is run by [`../playtest-protocol.md`](../playtest-protocol.md); this page adds who, how they are asked, what they are given and what is kept._

## Who is needed

| Round | People | When |
|---|---|---|
| Formative | 5 to 8 for each game, who have not seen it | as soon as a game has something new to learn from; Granada first |
| Beta | 12 to 20 across the three games, every game meaningfully covered | before a production candidate |

Across both rounds: at least three native readers of Arabic or Urdu; players of strategy games and people who never play them; people who visit museums; people who have never heard of islam.museum; where possible, people who play by keyboard alone or with assistive technology; some long sessions.

**Not eligible:** anyone who has worked on these games, has read their design, or already knows the intended solution. An AI is not a tester.

## The screener

Asked before a person is invited. Nothing here is kept in the repository except the answers marked ★, under `T1`, `T2` and so on.

1. Have you worked on, or read the design of, any islam.museum game? (If yes: thank them; not eligible.)
2. ★ How often do you play strategy or city-building games: often, sometimes, never?
3. ★ Had you heard of islam.museum before this?
4. ★ How often do you visit museums or their websites: often, sometimes, never?
5. ★ Which languages do you read as a native reader?
6. ★ Do you use a keyboard without a mouse, a screen reader, magnification, or another aid?
7. ★ What computer and browser would you use? (Desktop or laptop only for now; phones and tablets are not supported yet.)
8. Are you 18 or over? (Under 18: only with a parent or guardian's consent and presence, the founder's decision.)

## What a person is told, and agrees to

Read aloud or sent before the session; agreement is recorded as a yes, with the date, against `T1`.

> This is an unfinished game from islam.museum, a free museum on the web. We would like to watch you try it for about half an hour and ask you some questions afterwards. We are testing the game, not you: nothing you do is wrong.
>
> We will write down what you did in the game and what you said about it. We will not record your face or your voice unless you offer that yourself. Your name and contact details are not written in our notes or published anywhere; in our notes you are a number.
>
> You can stop at any moment without giving a reason, and you can ask for your notes to be deleted afterwards.
>
> May we use what you said, in your words, without your name? (yes / no)

Whether testers are thanked with anything of value is the founder's decision; nothing is promised here.

## The build they play

- The games' test address, on a named release, with `fresh=1` so that nobody's saved game is touched; or, with no internet, the offline package of that same release (`gaming/tools/qa-package.py`).
- The release id is read from `/_channel` and written in the evidence. A session on a release that then changed is still valid for the release it was played on.
- In the tester's own language where it is one of the seven.

## The facilitator's guide

The facilitator is not a developer of the games where that can be had. They follow [`../playtest-protocol.md`](../playtest-protocol.md) exactly: the opening words, silence, "What would you try?" once, the seven closing questions, the fault form. In addition:

- Write down the device, the browser, the language, whether the game drew in 3D, and what the tester already knew.
- Mark every time help was asked for, and whether any was given. A session where the facilitator explained the game is recorded as assisted and is not counted toward clarity.
- For a long session (60 minutes or more, agreed beforehand), note where attention drops and what the tester says about pace; stop when they wish to stop.
- For a native reader of Arabic or Urdu, add ten minutes at the end to go through the screens and mark wording that is wrong, stiff or unclear.

## The tasks

None is given for the first twenty minutes: the tester plays as they would have alone. After that, only if time remains and they have not met it themselves:

| Game | Then ask them to try |
|---|---|
| Granada | "Find out why the olive terrace is thirsty, and do something about it." "Sell something, and tell me whether it was worth it." "Build something, and tell me what the ring on the ground was telling you." "Take the port's contract, and tell me by when the oil has to leave." "The village downstream has asked for water: tell me what each answer would cost you before you choose." |
| The Golden Age | "Bring water to a house that has none." "Tell me what next season will do to your treasury, before you end this one." |
| Atlas | "Play today's five rounds." "Use a hint once, and tell me what it cost you." |

## The questionnaire

Filled in by the tester afterwards, alone, on paper or a form the founder chooses (a form service would be an outside service: his choice). Each on a scale of 1 to 5, with a line for a reason:

1. I understood what the game wanted me to do.
2. I could tell why things happened.
3. When something went wrong, I could recover.
4. The game was too easy (1) … too hard (5).
5. I knew how I was being scored.
6. There were stretches where I was only repeating myself.
7. I would choose to play this again.
8. It ran smoothly on my computer.
9. The words on screen were clear and natural in my language.

And three open lines: the best moment; the worst moment; one thing you would tell a friend about it.

## What is kept

One file for each round in `docs/gaming/evidence/playtests/`, in the form of [`evidence.template.json`](evidence.template.json): the release, each tester's answers to the starred screener questions, the measures, the closing answers (in their words only if they agreed), the questionnaire, the faults. Counts are written as counts ("5 of 7"), never as percentages of a handful.

## What this plan does not do

It names nobody. "Testers" and "coordinator" stay open in [`../spec-production/owner-register.md`](../spec-production/owner-register.md) until real people are named.
