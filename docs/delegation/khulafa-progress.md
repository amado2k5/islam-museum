# Progress: khulafa lane (plan 30)

## 9 November 2026

- Proposal `docs/plan/30-khulafa-browser.md` + index row + CANARY committed (founder-approved the megaplan in chat).
- Phase 1 committed: `during_reign`/`reign_saw` in `schema/predicates.yaml`; validator rule (reign toward a caliphate polity ⇒ `roles: [caliph]`; `polity/ottoman-empire` counts); `scripts/khulafa.test.ts`; `person/hasan-ibn-ali` gained `caliph`.
- Phase 2 committed: `datasets/khulafa-roster.csv` (~160 rows); all existing roster records patched (`roles`, `story_roles`, `ruled_over`, `successor_of`); 30 new person records; 4 new polities (`zubayrid`, `hammudid`, `abbasid-caliphate-cairo`, `sharifian`); `npm run validate` 0 errors.
- Phase 3 committed: `site/src/lib/khulafa.ts`, `/[lang]/khulafa/` landing + `[slug]` caliph pages, filter script, `khulafa:` i18n ar/en/ur + explore cards, nav entry, `/api/v1/khulafa.json` + `/api/v1/khulafa/chains.json`, docs rows (data README, openapi, llms.txt), register rows.

## Next

- `during_reign` edges in waves; `geo/polity/` extents; prose waves; deploy when the founder says.

## Follow-up: residual anachronistic participant edges

A repo-wide audit (born/died vs event dates on every `had_participant` edge) found **182** impossible participations — mostly "dossier" events aggregating later decrees (later acts filed on the dated original event), plus wrong birth/death years and namesake mix-ups (e.g. `al-mustakfi-billah` b.1285 on a 946 event). The 10 edges failing the `time-browser-explorer` gate were fixed in `36b217df96` (re-typed to `related_to` or corrected dates). The rest need a dedicated data-cleanliness wave: re-type later-act edges to `related_to`, split dossier events, or fix dates — list reproducible from the audit script in this session's notes.

## during_reign wave (landed)

- 2,996 event records carry `during_reign` edges (date span ∩ roster reign; `regions` disambiguate overlap eras: andalus-europe→Cordoba, egypt-nile→Fatimid/Cairo, west-africa-sahel→Sokoto); 1,109 region-less ambiguous events deferred. Commit log on main; caliph pages now show reign events.
- **Incident + fix:** an early write-verify-less version of the wave script truncated ~650 records (`open(path,"w")` before the write check); all were restored from pre-wave HEAD and re-patched with a verify-first writer; five inline `relations: []` merges cleaned up after.
- Remaining: `geo/polity/` extents, prose waves, the 182-edge cleanliness pass.

## Geo + first prose (landed via PR 5820 + pending)

- 12 schematic extent geojson under geo/polity/ (9 caliphates + 3 claims).
- 90 draft prose stubs (30 records × ar/en/ur); remaining: full prose waves for all 160 caliphs, the 182-edge cleanliness pass, deploy.
