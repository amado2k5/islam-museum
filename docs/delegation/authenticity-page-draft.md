# Draft: public authenticity page, footer link and submission wording

Status: **draft, not applied.** Every item here changes something a filed submission can read, so it needs the founder's written sign-off labelled `submission-impacting` under `docs/ai-change-gates.md` section 3, and the claims register (A.5) and the DPGA evidence map must change in the same commit.

Internal code is already applied (see section 5). Nothing on the public site has changed yet.

## 1. Files this would touch when approved

- `site/src/pages/[lang]/authenticity/index.astro` (new page, English, Arabic and Urdu)
- `site/src/layouts/BaseLayout.astro` (footer link; this file is listed in gates section 3 as privacy-relevant, so the change is labelled and reviewed)
- `i18n/en.yaml`, `i18n/ar.yaml`, `i18n/ur.yaml` (new keys, in the same commit, as `AGENTS.md` requires)
- `docs/outreach/unesco-nomination-dossier.md` (A.5 claims register) and `docs/outreach/dpga-evidence-map.md`

Arabic and Urdu text must be translated in the same commit. Until then the page is not linked.

## 2. Public page: what it says

Title: **How islam.museum decides what it shows** (translations to follow).

1. **What we admit.** The museum admits only material that is genuine to its title, author, source and claimed identity. Each book, article, image or artefact is admitted, labelled or refused as a whole.
2. **What the gate checks.** Who wrote it and whether the author's school is verified. Whether the copy is a real, identified edition or a catalogued institutional copy. Where it came from, and whether that place is on a known spam or phishing list.
3. **What the gate does not check.** It does not check whether each statement in a work is true, and it does not change what a work says. Summaries are written with AI and are labelled as such. They are not checked line by line.
4. **Three decisions.** *Accept*: a verified Sunni author and a validated copy. *Label*: a copy that is genuine, shown with its school (or "school not verified"). *Reject*: a copy that cannot be validated, or that comes from a blocked source.
5. **Sources we rely on.** A short table of registered sources with their tier and status, from `scripts/harvest/library/authenticity.yaml`.
6. **Corrections.** Report a problem through the issue form. Each report and its outcome is logged.
7. **Where the rules live.** The rules are in the repository (`docs/delegation/authenticity-policy-proposal.md`, `scripts/harvest/library/authenticity_gate.py`, `scripts/check-authenticity.ts`), so anyone can read and check them.

## 3. Footer

Add one link, "How we decide what to show" (*Authenticity*), to the footer of every page, in the three languages. No script, no cookie, no tracking.

## 4. Proposed submission wording (replacing the current sentence)

Current sentence in `docs/outreach/dpga-evidence-map.md`: "the museum does not review its records and does not claim to".

Proposed replacement (to be checked against the filed claims, then labelled):

> The museum does not check whether the statements inside each record are true. It does gatekeep the material it admits: each book, article, image or artefact is admitted, labelled or refused as a whole, on the basis of its author's school and the authenticity of its edition or institutional copy. The gate is written down, checked by a script, and published on the site.

Equivalent wording for the UNESCO dossier (A.5, and the "human review" paragraph): the corpus has no record-by-record human review. A gate on whole items is in place, its rules are published, and a human decides each new book's gate decision.

The claim "none has yet been marked reviewed by a person" stays true as filed, and the new wording must not imply that any record has been reviewed.

## 5. What is already applied (internal only)

- `scripts/harvest/library/authenticity.yaml`: the register of decisions (two label decisions: Tusi and Zamakhshari, both recorded by the founder) and the three sites with tiers and statuses.
- `scripts/check-authenticity.ts`: enforces the rules (accept needs a verified Sunni author with two sources and a validated copy; label needs a reason; reject needs a reason; sources need a tier and a status; blocklisted sites must be marked blocked). Wired into `npm run validate`. Undecided canon books only warn: currently 273 of 275.
- `scripts/harvest/library/authenticity_gate.py`: the harvester checks the register before each book. Rejected books are never fetched. Undecided books are fetched with a warning, unless `--require-decision` is given.
- Tested: the validator catches 8 planted violations; `npm run validate` gives 0 errors; the gate refuses a planted reject and an invalid decision.

## 6. Decisions for the founder

1. Sign-off, labelled `submission-impacting`, to apply sections 1 to 4.
2. Confirm that future books are decided by hand, as you asked, and that the `--require-decision` flag is used for new additions only.
3. Confirm the blocklist source (PhishTank, URLhaus, Google Safe Browsing, checked by hand).
