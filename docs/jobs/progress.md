# Job Browser: progress

Plan home: [`README.md`](README.md). One dated entry per merged batch. Flags are one line each. Phase queues and their states (`[ ]` / `[x]` / `[~]`) are added here when a phase starts.

## Log

- **1 November 2026 — Phase 0 (planning).** Census of `origin/main` at `cc4ec8eeec`; taxonomy of 157 jobs in 14 domains with the roles merge map (184 after the crafts amendment below) (`taxonomy.yaml`, `taxonomy.md`); schema, site, research and phase documents written. No data, schema, site or i18n change. Awaiting the founder's answers to README section 9.
  - FLAG: `roles:` is not checked against its enum anywhere (`roles: strs` in `scripts/gen-schema.ts`); 227 distinct strings, 189 outside the 38-value vocabulary, `ruler` 824 (README 2.1).
  - FLAG: `job/copyist` has 0 holders from roles and 74 prose leads; `job/architect` has 11 holders. Keep or swap is decision 2 (README 2.3).
  - FLAG: adding a class and an API route is `submission-impacting` by `docs/ai-change-gates.md` section 3; Phase 1 needs that sign-off and updates the two outreach files in its first commit (README 2.5).
  - FLAG: the brief's visibility rule (≥1 holder) conflicts with its encyclopaedia rule (full prose for jobs with few holders); decision 5 (README 2.5).
  - FLAG: thirteen domains have no home for agriculture and water; Land & Water proposed as a fourteenth (README 2.5).
  - FLAG: the guild layer is one record (`group/akhi-associations`); Phase 2 writes bodies with the jobs (README 2.4).
  - FLAG: 3,063 persons have no `periods:` value, so timeline bands show a "none" column until Phase 3 dates them (README 2.4).
  - Next step: founder's go on section 9; then Phase 1, starting with the `submission-impacting` schema commit.
- **1 November 2026 — Phase 0 amended: the crafts.** Founder's instruction that the jobs include the crafts and trades (الحِرَف). Taxonomy grows from 157 to 184 jobs; 53 carry `hirfa: true`; the making domain is renamed Crafts, Building & Making (39 jobs); a craft block is added to the job entity (README 3a, schema.md 1a); a crafts shelf and panel to the site (site.md); craft sources to the research method (research.md 2a); two craft waves to Phase 2 and the objects-to-crafts rule to Phase 4. Census rerun: crafts have 113 holders from roles and 959 prose leads across 885 persons.
  - FLAG: the crafts layer in the museum is one practice (`practice/attar-druggist`) and one guild (`group/akhi-associations`); the shelf is built from the sources and the 517 objects, not from the roles.
  - FLAG: craft nisbas (الحدّاد, النجّار, الصائغ, الزجّاج) are family names in most records; the leads for those crafts are inflated and are read, never bootstrapped.
- **1 November 2026 — Phase 0 merged (PR #3031); first-ten swap decided.** Founder's answer by chat: faqih replaces copyist in the first ten; copyist moves to Phase 2's Arts & Letters wave. First ten: qadi, vizier, muhaddith, physician, astronomer, calligrapher, merchant, architect, faqih, teacher: 1,965 bootstrap holders, about 3,556 prose leads. The other decisions of README section 9 are open; the recommended defaults are proposed only.
  - FLAG: an earlier draft of this entry recorded the other defaults as adopted. That was not the founder's answer and is corrected here.
  - Next step: the founder confirms or changes the open decisions in README section 9, above all decision 7 (the `submission-impacting` sign-off). Phase 1 step 1 waits for it.
- **1 November 2026 — Phase 1 step 1: the schema (founder's confirmation of the defaults, the submission-impacting sign-off included).** `job` added to the classes (`scripts/lib.ts`, `scripts/gen-schema.ts`, the API meta list); `schema/job.schema.json` generated; `occupations` on person; `jobs` ties on object, building, work, group, event, place and journey; `schema/enums/job-domains.yaml` and job kinds in `kinds.yaml`; validator rules for job sources, target classes and the craft block (probed on a temporary bad record, which both rules rejected, then removed); `scripts/jobs.test.ts`. Outreach: a dated row in the claims register and a note in the evidence map. No job records yet, so no count in any filed claim changes.
  - FLAG: regenerating the schemas picked up `AI-GENERATED` in the licence enum, already in `schema/enums/licenses.yaml` on `main` but missing from the generated schemas there; the regenerated media and dataset schemas carry it.
  - FLAG: the agreement check (`roles:` against `occupations:`) is not in this step; it lands with the bootstrap in step 2.
  - Next step: step 2, the source entities and the first job record (`job/qadi`), then the bootstrap in chunks.
