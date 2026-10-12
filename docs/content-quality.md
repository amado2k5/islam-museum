# Content quality: what every session and agent must get right

Written 11 Oct 2026 after a review of Raheeq batch 11 part 1 (`02b6636`) found problems that the validator did not catch. Read this before writing any entity, whichever tool or model you are. The validator now enforces the first three items; the rest are reviewed by humans and by the next session, and fixing them is everyone's job.

## The gold example: copy its shape

`data/event/expedition-of-al-sawiq.yaml` and `content/ar/event/expedition-of-al-sawiq.md`. Before you create an entity of any class, open two existing ones of that class from different sessions and copy their fields, citation style and voice. If your output looks different from what is on main, yours is wrong.

## Hard rules, enforced by `npm run validate`

1. **No honorifics typed anywhere.** Not ﷺ, not «صلى الله عليه وسلم», «عليه السلام», «رضي الله عنه», «رحمه الله», in prose, labels, summaries or notes. The UI renders them. Write «النبي», «إبراهيم», «أبو بكر». (A line like «النبي ﷺ» in a `summary` is an error.)
2. **No Qur'an text in prose or data.** Never type an ayah, not even in ﴿ ﴾. Link it: `[[passage/quran-2-144|البقرة 144]]`. The only source of ayah text is the frozen Tanzil files; a typed ayah may carry a slip nobody can see.
3. **Prose lives only in `content/ar/<class>/<slug>.md`** (markdown with front matter). Data lives only in `data/<class>/<slug>.yaml`. A `.yaml` file under `content/` is never rendered.

## Rules the validator cannot see (reviewers check them)

4. **Cite where the museum looks.** Every entity has a top-level `sources: [source/...]` list. A citation inside `provenance` alone does not count as a source. Dated facts need a second source or a `needs_source` flag.
5. **Typed relations, not `related_to`.** Use `part_of`, `has_part`, `caused`/`caused_by`, `occurred_at`, `had_participant` (with `role`), `member_of`, `child_of`, `spouse_of`, and so on from `schema/predicates.yaml`. `related_to` means you did not decide; each one shows as a warning. An event inside a battle's campaign is `part_of` the battle.
6. **Complete the entity.** Events: `wings`, `periods: [period/prophetic-era]` (or the right period), `regions`, `date` with `calendar` and `status`, `sides` with commanders when it is a fight, `occurred_at` a place. Places: `kind`, `part_of`, coordinates only from docs/plan/16 §6 or Wikidata. People: `names[]` with nasab, `gender`, `roles`, `traditions`.
7. **Dates must agree.** A Hijri month and an EDTF month must be the same time. Shawwal 3 AH is March 625, not June. Convert with `scripts/hijri/` and mark conversions `derived`; the book's words go in `note`. Use the same date as the parent event when you are describing a part of it.
8. **Honest provenance.** `provenance: { layer: own-research, source: "<book> p.N", generated_by: "<tool/model that really wrote it>", run: "<batch id>" }` and `status.review: draft`. Never `reviewed` or `verified`. A page number you did not read on the page is a flagged guess, not a citation.
9. **Reuse before you create, and never invent an ID for someone who exists.** Search `data/` by Arabic name and by ASCII slug. If a stub or ID you need duplicates an existing entity (for example `person/abd-allah-ibn-ubayy` when `person/abdullah-ibn-ubayy` exists), use the existing ID and, only if your spelling is already referenced elsewhere, add it to the existing entity's `aliases`. Do not add a stub for something that exists. Before adding to `data/_stubs.d/*.yaml`, grep `data/person`, `data/place`, `data/group`.
10. **Link entities in prose.** `[[class/slug|الاسم]]` for the first mention of each person, place, group, event; `{cite:<source-id> p.N}` after every sentence that states a fact. Start with `## موجز`, then the class's sections.

## Voice: describe, attribute, label

11. **No judgement in the museum's voice.** Not «تمرد», «أعداء الله», «محاولة يائسة», «رأس المنافقين», «طغاة», «خيانة» as our own words. Write what happened («انسحب بنحو ثلث الجيش») and give the judgement to someone: «ويرى صاحب الرحيق المختوم أنه أراد بذلك…», «ويصفه ابن إسحاق بأنه…». Sunni sources do use terms such as «المنافقين»: quote or attribute them, with the page, and say who uses them. A motive is never stated as fact unless the source states it as fact; then it is attributed.
12. **Contested matters get a `perspectives` block**: Sunni position(s) first, each labelled, then the academic view, then any other view, each cited. No verdict.
13. **Quotations ≤ 40 words**, verbatim, in quotation marks, with page. No paraphrasing a book chapter into prose: write from the claims table, not from the page.

## Before you commit: the 60-second check

```
npm run validate && npm test
grep -rnE "ﷺ|صلى الله عليه|عليه السلام|رضي الله ع|﴿" <your files>   # expect nothing
grep -n "related_to" <your data files>                              # expect nothing, or a reason
grep -L "^sources:" <your data files>                               # expect nothing
git diff --stat origin/main                                         # only your paths
```
Then follow `docs/collaboration.md`: fetch, review what is new on main, rebase, re-validate, push. If you find a problem in someone else's batch, fix it in place with a clear commit message (merge, do not delete) and add a line to `docs/status.md`; do not leave it for the original author, who may be out of credits.
