# Lane: prose-enrichment-100

**Scope.** Enrich non-passage Arabic prose under 20 words (body, frontmatter and markup stripped) to at least 100 words. English (`content/en/`) and Urdu (`content/ur/`) files for the same slug ship in the same commit.

**Owners.** Split by slug, so no two agents edit the same entity:
- Devin: slugs starting a–m.
- Claude: slugs starting n–z.

**Excluded.** `content/*/passage/` (passages are not enriched in this lane).

**Rules.**
- Prose is written from sources actually read, cited with `{cite:<source-id> <anchor>}`. Never invent a date, quote, page or citation.
- A thin entity with too few sources is recorded as a lead with its reason. Do not pad it to reach 100 words.
- Batches of at most 25 entities per commit.
- Each commit runs `npm run cite-check`, `npm run validate` (0 errors), `npm test` and `npm run coverage`.
- Shared files (`docs/coverage.md`, `data/_stubs.yaml`, `data/_stubs.d/*`, `docs/status.md`) are append-only. On a merge conflict in `docs/coverage.md`, run `npm run coverage` again on the fresh `main`.

**Progress.** Log each batch in `docs/delegation/prose-enrichment-100-progress.md`.
