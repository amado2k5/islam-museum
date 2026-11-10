# Lane `maintainer`: schema, scripts, site, harvest, core concepts

Scope: `schema/` (classes, predicates, enums), `scripts/` (validator, graph builder, derive, export, coverage, harvest tools), `site/`, `i18n/`, periods, maps and the map pipeline, the Qur'an records (frozen), the local harvest (`docs/plan/15`; downloads, Wikipedia, Wikidata, OpenITI, the library), the first concepts and practices (`concept/`, `practice/`), and `docs/`.

Other lanes must not edit these areas. If a lane needs a field, enum value, predicate or script change, it writes `docs/requests/<lane>-<topic>.md` and works around it with a note field until the maintainer adds it. The maintainer reviews requests, keeps main green (validate, tests, `npm run build`), repairs breakage in place (`workflow.md` §6), and keeps `docs/status.md` current (live harvest state, next steps, rules to remember).

Standing responsibilities: the validator enforces what it can (honorifics, typed ayat, files in the wrong folder, schema shapes) and each new failure mode seen in the wild is added as a rule or a test; extraction and download jobs run in tmux sessions on the founder's Mac and record their state in `docs/status.md`; every change to schema or scripts is validated, tested and built before it is pushed.
