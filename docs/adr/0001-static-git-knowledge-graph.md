# ADR 0001 · A static, git-based knowledge graph

**Status:** accepted · 2026-10-11

## Context
The museum must be free to run, durable for decades, reviewable by scholars, forkable, and fast worldwide. Budget is zero.

## Decision
Content is plain text in git: language-neutral YAML facts (`data/`) and Markdown prose per language (`content/`). A build compiles them into a graph, validates it (JSON Schema, EDTF, links, licences), and an Astro static site is published to GitHub Pages behind Cloudflare. No servers or databases; interactive features are client-side islands over static JSON.

## Consequences
+ Zero hosting cost; git history is provenance; PRs are the editorial workflow; any static host can mirror it.
− No runtime personalisation or write paths. Interactivity is client-side over prebuilt static indexes; there is no runtime AI, server code or database (see ADR 0002 and `docs/plan/03-architecture.md` §13).
