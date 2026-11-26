# The corrective mandate of 25 November 2026

`corrective-mandate-2026-11-25.md` is copied here byte for byte from the file the founder gave in chat on 25 November 2026 with the words "process this after what you are doing now" (SHA-256 `911de3cafdd74daaf8ddcf9f93c579bbd6809a4b65fe9f8149a444cf451bd26f`). It is never edited.

**What it is.** An outside reviewer's audit of the gaming platform against the founder's own specifications ([`../spec-v2/`](../spec-v2/), [`../spec-granada/`](../spec-granada/)), written as a prompt for the developer: fourteen pieces of work, numbered 0 to 13, each tied to the gates R01 to R18 and GRA01 to GRA26.

**What it is not.** A play report. The reviewer says so itself: its browser could not reach the UAT host, it played for zero minutes and saw no screen. Every finding in it is taken from the repository's own documents at `7c31b7631c6`, so each was checked again against the repository before being acted on.

**How it is used.**

- It adds no gate and changes none. The gates stay in [`../acceptance.json`](../acceptance.json) and [`../granada/acceptance.json`](../granada/acceptance.json), and the founder's specifications stay the standard.
- [`plan.json`](plan.json) holds, for each of the fourteen pieces: the gates it bears on, what the repository showed when it was checked, what has moved since the mandate's baseline, where it stands, the exact next action, and any decision that is the founder's.
- [`../traceability.md`](../traceability.md) is generated from `plan.json` and the two gate files by `npm --prefix gaming run traceability`, so it cannot disagree with them. `npm --prefix gaming run traceability -- --check` fails if it is stale.
- Each piece of work lands as its own pull request with its evidence, as the mandate asks, and moves its line in `plan.json` in the same change.

The rules that stand above it are unchanged: the repository's governance (`AGENTS.md`), the founder's words in chat, then the specifications. Where the mandate proposes a number of its own (a win-rate target, a rubric score), it is recorded as the reviewer's proposal and not as a gate.
