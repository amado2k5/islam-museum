# ADR 0002 · No AI and no compute at runtime

**Status:** accepted · 2026-10-11 (founder decision; `docs/plan/03-architecture.md` §13)

## Context
The first plan imagined an "AI docent" (a Cloudflare Worker with a vector index) and other server-side helpers. The museum's trust rests on every statement being sourced and reviewed; a model answering a visitor would put unreviewed text in front of readers at the moment they read it.

## Decision
AI is used only while building: drafting, extraction, verification, translation, illustration. The published site is static files. No visitor request is answered by a model, no page is generated on demand, and no Worker, function, database or vector store sits on the visitor path. Cloudflare provides DNS, TLS, caching, redirects and headers only.

## Consequences
- Everything a visitor can ask of the site is precomputed at build time: Pagefind indexes, **search synonyms and transliteration variants** (`scripts/search-variants.yaml` → `site/public/search-synonyms.json`), **related-entity lists** (`derive.ts`, shown on pages and in the API), snapshot years, on-this-day, ego graphs, share cards and the Questions pages.
- The Questions wing, strong static search and the wander/connections/path features replace a chatbot. Zero-result searches feed new Questions in the next build.
- Interactive features are client-side only and work on static files; bookmarks live in `localStorage`.
- Community input goes through GitHub (issue forms, discussions, pull requests), never through a service the site runs.
- A validator or CI check should fail the build if the site ever ships a runtime network call to a non-static endpoint (not yet implemented; see `docs/status.md`).
