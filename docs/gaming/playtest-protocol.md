# Playtests: how a person is asked to try a game, and what is written down

_Written 25 November 2026 for piece 12 of the corrective work ([`traceability.md`](traceability.md)). It puts into practice what the founder's specifications already ask ([`spec-v2/16-QUALITY-AND-PLAYTESTING.md`](spec-v2/16-QUALITY-AND-PLAYTESTING.md), [`spec-granada/09-QUALITY-AND-ROADMAP.md`](spec-granada/09-QUALITY-AND-ROADMAP.md)); where this page and they differ, they win. **No playtest has been held.** Every playthrough of every game so far is the author's script, and a script is not a player._

## What counts, and what does not

- **Counts:** a person who has not seen the game, playing it themselves, watched in silence, with what they did written down as it happened.
- **Does not count:** the author's scripts; the author's own play; a review by an AI (it is filed as an AI's review, under its own name, and never as a tester); a person who was told what to do.
- Gates R10, R14 and GRA25 are passed only on the first kind. The author never scores the games.

## What the founder asks for before production (26 November 2026)

[`spec-production/owner-decisions-2026-11-26.md`](spec-production/owner-decisions-2026-11-26.md), "Human playtesting requirement". An AI's play is valid as regression evidence and satisfies no gate of usability, enjoyment or return.

- **Early, formative:** at least 5 to 8 independent people for each game.
- **Beta:** at least 12 to 20 people across the three games, with each game meaningfully covered.
- **At least three readers of Arabic or Urdu**, who also read the language itself for mistakes.
- A mix of museum visitors, players of strategy games, and people who do not know such games; some by keyboard alone and with assistive technology; some long sessions, for pace, fatigue and understanding.
- **Measured:** the time to understand the first objective; the time to a first real success; where help was needed; whether the player can explain consequences and scoring; difficulty, and recovery from mistakes; where it became repetitive or dull; how long they chose to play, never how long they were made to wait; whether they want to play again, and why in their words; problems of performance and comfort.
- No claim that people play for hours is made without them, and nothing in a game is built to hold a person who wants to stop.

None of this has been held. Who finds and approves the testers is the founder's ([`traceability.md`](traceability.md), O4).

## Who, and how they are asked

- Five to eight people for each slice, the founder's to find and to approve. Where possible: some with no interest in history or in the museum, some new to strategy games, at least one who reads Arabic or Urdu, at least one who plays by keyboard alone.
- Each is told before they agree: this is an unfinished game; nothing about them is kept except what they did and said in the game; nothing is recorded on video or audio unless they offer it; they may stop at any moment without a reason.
- **No name, contact, face or voice goes into the repository.** A tester is `T1`, `T2` and so on in the notes. The list that says who `T1` is stays with the founder and is not written here.

## The session

About 25 minutes for one game. The address is the UAT one with `fresh=1`, in the tester's language, on their own machine if they have one that can show it.

1. **Say only this:** "This is an unfinished game. Please play it as you would if you had found it yourself, and say aloud what you are thinking if you can. I will not help, and I will not answer questions until the end. There is nothing you can do wrong."
2. **Watch in silence.** Start the clock when the page has loaded. Do not point, nod or explain. If they ask what to do, say "What would you try?" once, and write the question down.
3. **Stop** at 20 minutes, or when they say they would stop, or when they finish. Write down which, and their words if they stopped.
4. **Then ask, in these words, and write the answers as they are said:**
   - "What was the game asking you to do?"
   - "Tell me about one decision you made. What else could you have done?"
   - "Was there a moment you did not know what to do? What were you looking at?"
   - "Did anything go wrong? Could you get out of it?"
   - "What would you change first?"
   - "Would you open it again tomorrow? Why, or why not?"
   - "What did you make of how it looks?" (Say nothing about how it is meant to look.)
5. Never ask "Did you like it?" or "Was it clear?", and never defend the game.

## What is timed and counted

| Measure | How it is taken |
|---|---|
| Time to the first deliberate action | from page load to the first order that was not a stray click |
| Time until they can say the objective | when they say it aloud, or what they answer to the first question |
| Time to the first whole loop | Granada: water or harvest, then a sale or a store, then a building ordered. The Golden Age: a building placed that works, and a season ended. Atlas: one round guessed and revealed |
| Stalls | each time they stop for more than twenty seconds, with what was on screen |
| Faults | each thing that broke or misled, on the fault form below |
| Reached | how far they got, and how it ended: finished, lost, stopped, or out of time |
| Ran in | 3D, or the plan, or the drawn globe; the browser and the machine in their own words |

The specifications propose, as design targets and not as gates: eight in ten say the objective within thirty seconds, and seven in ten finish the first loop within five minutes. With five to eight people these are counts, not statistics, and are written as counts ("5 of 7").

## A fault

```
Game and address:
Release (from /_channel on that address):
Language, browser, machine:
What they did, step by step:
What they expected:
What happened:
How bad: stops play / misleads / annoys / looks wrong
Seen by: T3 (and T5)
```

A fault is then reproduced by the developer before it is fixed, and the fix is tried by a person who has not seen it where that can be had.

## What goes into the repository

One file for each round: `docs/gaming/evidence/playtests/<date>-<game>-<release>.json`, holding the release, the number of testers, each tester's measures under `T1`…, their answers in their own words (only if they agreed to that), and the faults. Then a paragraph in the game's state page saying what was found and what was changed because of it. If a round cannot be held, the gates stay as they are and the page says so.

## The scorecard

The specifications give a scorecard out of 100 (gameplay 20, visual direction 20, originality 10, controls 10, replayability 10, audio 5, interface 5, performance 5, historical integrity 5, extensibility 5, accessibility and languages 5), with a proposed mark of 90 overall and no category under eight in ten. It is filled in by reviewers who are not the author, from what they saw, and it never stands in for a hard gate. It has not been filled in for any game.
