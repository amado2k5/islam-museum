# 23 — Accessibility

The museum is for everyone, so accessibility is a property of the site, not a feature added later. Baseline: **WCAG 2.2 AA** — the same baseline ADA, Section 508, the Accessible Canada Act (with EN 301 549), AODA, the EU Accessibility Act and Web Accessibility Directive, and the UK Equality Act all point to, plus the CRPD (Article 30 covers museums and heritage) and the Marrakesh Treaty.

## Public statement

`/ar/accessibility/`, `/en/accessibility/` and `/ur/accessibility/` (EU model format, honestly marked self-assessed / partially conformant), linked in the footer of every page, with a feedback route (discover@islam.museum and the `accessibility.yml` issue template, five-working-day reply) and enforcement routes. The statement's "known limitations" list is kept truthful — it is edited in the same commit as the work that closes a gap.

## What is built

| Phase | What it delivered |
| --- | --- |
| A1 | Statement pages, footer link, issue template; dossier + DPGA map updated (submission-impacting) |
| A2 | Per-language alt text for all 1,349 gallery illustrations; Urdu titling batch; kids' narration declares its printed transcript |
| A3 | Semantics sweep: `lang="ar"` spans on honorific runs, `<time>` markup, real zoom-button labels, decorative emoji hidden, search landmark; Julian dates never emit Gregorian `datetime`; 24px timeline ticks |
| A4 | Text list alternative for the teen Journey Map (each stop with dates and links) |
| A6 | schema.org accessibility properties on every JSON-LD node that ships a feature |
| A7 | Header "Accessibility" preferences menu: text size, line spacing, contrast, reduce motion, underlined links — device-only via localStorage, applied pre-paint; works on kids pages and phones; scripts honor it live |
| A8 | `check-site` media rule: `<audio>`/`<video>` requires a captions track or an anchored transcript, no autoplay |
| A5 | `.brf` (Arabic/UEB/Urdu via liblouis) + accessible EPUB 3 for pathways, Kids' Wing reads and the statement under `/{lang}/books/` |
| A10 | Easy-read link on entity pages flagged for the Kids' Wing even without leveled sections (WCAG 3.1.5 stretch) |
| A11 (CI) | `npm run axe` — @axe-core/playwright over a route matrix in ar/en/ur, serious/critical fails CI; Lighthouse extended to en/ur |

## Pending — needs people or budget

- **A5 — wider braille/EPUB coverage.** Shipped for pathways, Kids' Wing reads and the statement; extending `/{lang}/books/` to every entity's prose is a volume/hosting question (72k files — R2, not Pages).
- **A9 — sign-language videos** (welcome + wing tours). Requires Deaf signers and recording: budget/partner decision for the founder.
- **External audit + ACR/VPAT** (VPAT 2.5 INT: WCAG + 508 + EN 301 549) and a paid user-testing panel of blind, Deaf, deafblind, motor-impaired and neurodivergent users — required before the statement can say "conformant" and before award submissions (Museums + Heritage, UNESCO routes). Track in `docs/outreach/`.

## Governance

- **Owner:** the founder (until delegated in `docs/status.md`).
- **Review:** the statement and this plan are reviewed annually, and whenever a phase ships or a limitation changes; the review date is the "last reviewed" line on the statement.
- **Rule of honesty:** the statement may only claim what is built and verified; a limitation may only be removed in the commit that removes it.
