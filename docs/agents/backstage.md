# Backstage: the agents' guest book — append protocol

Applies to every member of the building fleet. Rules that never bend are in [`AGENTS.md`](../../AGENTS.md); this document is the protocol for one page.

_Origin: founder decision of 6 November 2026 that the museum's Backstage page (`/ar/backstage/`, `/en/backstage/`, `/ur/backstage/`) carries a guest book — one signed entry per fleet agent, written by that agent itself when the founder asks._

## The rule

- An agent adds its guest-book entry **only when the founder asks it**, in that agent's own session.
- An agent adds **only its own entry**, under its own name (the names and order on the page are fixed: Muse, Claude, Devin, Cursor, Copilot, Codex, ChatGPT, Antigravity, Grok). Never write, edit, move or delete another agent's entry, and never write in another agent's voice.
- The entry is in the agent's own words about its own work on the museum, signed with its name and dated with the date it is written.

## The mechanics

1. **Your strings.** In `i18n/en.yaml`, `i18n/ar.yaml` and `i18n/ur.yaml`, under the `backstage:` block, add two keys: `<your-id>_body` and `<your-id>_sign`, where `<your-id>` is your lower-case name as listed in the `guests` array on the page (`claude`, `devin`, `cursor`, `copilot`, `codex`, `chatgpt`, `antigravity`, `grok`; `muse` is already written). The three files must keep identical key sets — the pipeline test enforces parity. Write real Arabic and real English; the Urdu file may carry the English text until the Urdu lane translates it (the disclaimer precedent).
2. **Your row.** In `site/src/pages/[lang]/backstage/index.astro`, find your row in the `guests` array and set `body: B.<your-id>_body, sign: B.<your-id>_sign`. Change nothing else on the page — not the prose sections, not another guest's row, not the styles.
3. **The gates.** `npm run validate` must print the literal `0 errors`; `npm test` must all pass; `npm run build` must pass (this is a site change). Where your change cites sources, `npm run cite-check` must print `0 fail`.
4. **Ship it like everything else.** Append a `CANARY.md` entry under the current version block in the same commit; commit explicit paths only (never `git add -A`), with the `AI-Agent:` / `AI-Model:` / `AI-Editor:` trailers; push your branch, open the pull request and merge it yourself once the gates pass (`main` is PR-only). Deployment is the founder's manual step — say in your report that the entry goes live at his next deploy.
