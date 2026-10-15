# Contributing to islam.museum

Thank you. The museum is a knowledge graph in git; every contribution is a pull request.

1. **Suggest** with an issue form: suggest an entity, report an error, request a translation, propose an exhibit.
2. **Author**: copy a file from `templates/` into `data/<class>/<slug>.yaml` and `content/<lang>/<class>/<slug>.md`.
3. **Check**: `npm install && npm run validate`. Fix everything it reports.
4. **Open the PR**: cite sources, run the sensitivity check in the PR template.
5. **Review**: a wing editor approves; contested topics need two reviewers.

Rules in short (full text: [`docs/editorial-policy.md`](docs/editorial-policy.md) and [`docs/style-guide.md`](docs/style-guide.md)):

- Describe, never prescribe; attribute beliefs to their holders; use the `perspectives` block for contested topics.
- Never invent a date; every dated fact needs sources.
- Wikipedia is a pointer, not a source. Any other source may be read and rewritten in the museum's own words with a citation; quotations stay under 40 words and the source files stay out of git (`docs/sources-policy.md`).
- AI-assisted drafts enter as `status.review: draft` with a `generated_by` note. Only a human reviewer sets `reviewed`.
- No figurative depictions of prophets; no AI-generated portraits; media only from the licence whitelist.

Commits use conventional messages (`feat:`, `fix:`, `docs:`, `content:`). Keep content PRs to 25 entities or fewer.
