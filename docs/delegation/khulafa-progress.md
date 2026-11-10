# Progress: khulafa lane (plan 30)

## 9 November 2026

- Proposal `docs/plan/30-khulafa-browser.md` + index row + CANARY committed (founder-approved the megaplan in chat).
- Phase 1 committed: `during_reign`/`reign_saw` in `schema/predicates.yaml`; validator rule (reign toward a caliphate polity ⇒ `roles: [caliph]`; `polity/ottoman-empire` counts); `scripts/khulafa.test.ts`; `person/hasan-ibn-ali` gained `caliph`.
- Phase 2 committed: `datasets/khulafa-roster.csv` (~160 rows); all existing roster records patched (`roles`, `story_roles`, `ruled_over`, `successor_of`); 30 new person records; 4 new polities (`zubayrid`, `hammudid`, `abbasid-caliphate-cairo`, `sharifian`); `npm run validate` 0 errors.
- Phase 3 committed: `site/src/lib/khulafa.ts`, `/[lang]/khulafa/` landing + `[slug]` caliph pages, filter script, `khulafa:` i18n ar/en/ur + explore cards, nav entry, `/api/v1/khulafa.json` + `/api/v1/khulafa/chains.json`, docs rows (data README, openapi, llms.txt), register rows.

## Next

- `during_reign` edges in waves; `geo/polity/` extents; prose waves; deploy when the founder says.
