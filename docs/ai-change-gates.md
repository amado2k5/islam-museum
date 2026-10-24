# Change gates for every agent

Binding on every AI agent, model, tool or human collaborator that touches this repository (Muse, Claude, Devin, background content workers, anyone added later). `AGENTS.md` points here; the rules there still apply and nothing here weakens them. The founder (Ahmed Abdelaal, @amado2k5) owns this document; agents append to section 8 only as instructed.

Why this exists: several agents push to `main` at the same time, and two formal submissions quote this repository's exact state. The Digital Public Goods Alliance application (GID0094424, filed 17 October 2026) and the dossier sent to the Canadian Commission for UNESCO the same day both make claims about record counts, licences, ownership, privacy and architecture (`docs/outreach/unesco-nomination-dossier.md` A.5, `docs/outreach/dpga-evidence-map.md`). A change that silently alters one of those claims turns a true submission into a false one.

## 1. Proposal gate

No agent edits code, site, schema, validator, i18n, policy documents, shared files or content without an approved written proposal. A proposal states: the files it touches, the exact intent of the diff, why, and a risk rating (`non-impacting` or `submission-impacting`, section 3). Drive-by edits are forbidden: if you notice something wrong outside your task, write it down (an issue, a note in your progress file, or a proposal) and leave the file alone.

A proposal is approved when:

- the founder approves it in writing (chat, issue, commit message he asked for), or
- it is a content batch inside a lane that `docs/status.md` or `docs/agents/lanes.md` already lists with an owner and a scope: that listing is the standing approved proposal for that lane and nothing else (the founder's standing permission, `docs/sources-policy.md` §5, continues to cover it).

Everything else needs its own approval first, including a "small" code fix, a new site page, a new i18n key, a schema or enum change, and content outside a listed lane.

## 2. Scope gate

Stay inside the approved task. Do not widen it, do not fix neighbouring things, do not refactor what you pass through, do not start work the founder has reserved for himself or for a named agent (section 8). If the task cannot be finished without touching something outside its scope, stop and say so; do not touch it.

## 3. Submission-freeze awareness

While a submission is under review, every proposal carries one of two labels, and the agent writing the proposal chooses it honestly:

- **`submission-impacting`**: the change could alter anything a filed submission asserts: record counts or class counts, which languages are published, a licence (`LICENSE`, `LICENSE-CONTENT.md`, `schema/enums/licenses.yaml`, any `license:` field), ownership or governance (`GOVERNANCE.md`, `.github/CODEOWNERS`), the privacy posture (anything that adds a cookie, a form, a script, a network call or analytics: `scripts/check-static.ts`, `site/src/layouts/BaseLayout.astro`, the privacy page), the architecture (`docs/adr/`, hosting, runtime), the data-extraction routes (`/api/v1/`, `docs/data/README.md`), or the documentation the submissions link to. These need the founder's explicit sign-off with that label, and the agent updates the claims register (`docs/outreach/unesco-nomination-dossier.md` A.5) and the evidence map (`docs/outreach/dpga-evidence-map.md`) in the same commit so the outreach files never lag the repository.
- **`non-impacting`**: cosmetic, invisible or internal: wording, meta tags, page weight, heading levels, punctuation, test additions, refactors with no behaviour change. Still needs proposal approval (section 1), but no outreach file changes.

Adding content inside an approved lane is `non-impacting` by default: the submissions state the counts "as of 17 October 2026" and say they grow. Removing or merging records, or changing a class list, is `submission-impacting`.

Current submissions under review and their claims: the two files named above.

## 4. Merge gate

Before every push, every time:

1. `git fetch origin` and read what arrived: `git log HEAD..origin/main --stat`, and the diff of every file you also touch.
2. Rebase or merge onto `origin/main`. On a conflict, do a three-way merge with your start point as the base: keep both sides' intent. A mechanical change prepared against an older `main` (a regex over hundreds of files, a generated file) is re-run on the fresh `main`, not patched in.
3. Never force-push. Never `git checkout -- <file>`, `git reset --hard`, `git clean`, `git stash drop` or revert anything you did not create. Never commit a wholesale replacement of a shared file (`data/_stubs.yaml`, `data/_stubs.d/*`, `docs/status.md`, enums, i18n files): those are append-only or key-level merges.
4. If a conflict cannot be resolved while keeping the other side's intent, stop and ask the founder. Do not guess.
5. Push with `git push origin HEAD:main` (or your branch if `main` is blocked for your tool), then your branch. Small commits, one logical change per commit, at most 25 entities per content batch.

The full procedure, including the coverage regeneration, is `docs/agents/workflow.md` sections 2 and 4.

## 5. Quality gate

Before anything is pushed: `npm run validate` reports 0 errors, `npm test` passes, and for any change under `site/`, to a date rule, to i18n or to the schema, `npm run build` passes locally. `npm run coverage` is regenerated in the same commit as any change to entities, stubs or edges. Chain the checks and the push with `&&`, never `;`. Fix what fails; never lower a rule, skip a test, widen a timeout to hide a failure, or add a crash guard to hide bad data. A `main` already broken by someone else is fixed first, in its own small commit that says so.

## 6. Content gates

The charter in `AGENTS.md` is non-negotiable and is restated here only so that no agent can claim this document replaced it:

- AI output enters as `status.review: draft` with a `provenance` block; promotion to `reviewed` or `verified` is performed by agents only under the protocol in `docs/agents/review-and-promotion.md` (independent reviewer, attestation in provenance, standing audit with automatic demotion). No agent promotes its own work.
- Qur'an text is never typed, completed or corrected; it comes only from the frozen Tanzil files and is referenced as `[[passage/quran-<sura>-<aya>|label]]`.
- No honorifics typed anywhere; the UI renders them.
- Arabic first: `label.ar` and `summary.ar` required; new prose goes in `content/ar/` first; English and Urdu are translations.
- Every page readable without JavaScript; WCAG 2.2 AA; alt text in every published language.
- Sunni Islam is the default frame and is labelled; any other view is labelled before it is stated; contested topics use the `perspectives` block, cited, with no verdict; never "enemy of Islam" or an equivalent in the museum's voice.
- Every entity cites sources; every dated fact has two sources or a flag; never invent a date, quote, page number, ISBN or citation.
- Media only from the whitelist in `schema/enums/licenses.yaml`; no figurative depictions of prophets or Companions; no AI-generated portraits.

## 7. Attribution gate

Every commit ends with the trailers `AI-Agent:`, `AI-Model:` and `AI-Editor:` (truthful; `unknown` if you cannot tell), so the founder can always see which agent changed what. A commit made on an agent's behalf by a tool still names the agent. The same facts go in each entity's `provenance` block. Attribution never substitutes for approval: a correctly attributed drive-by edit is still a violation of section 1.

## 8. No-go registry

Areas reserved or frozen. An agent adds a row only when the founder says so, and removes one only when the founder declares the work done. Check this table before every proposal.

| Area | Reserved by | Since | Until | Notes |
|---|---|---|---|---|
| Submission claims: `docs/outreach/unesco-nomination-dossier.md`, `docs/outreach/dpga-evidence-map.md`, `docs/outreach/media-licence-audit.md` | Founder | 17 October 2026 | Both reviews conclude | Edited only with a `submission-impacting` sign-off (section 3). |

## 9. What happens on a violation

A commit that breaks a gate is not reverted blindly (section 4 forbids that too). The agent that finds it reports it to the founder with the commit hash and the gate broken; the founder decides whether it stays, is amended or is reverted, and by whom.
