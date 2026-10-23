# Engineering documentation — islam.museum

This directory is the **engineering view** of the project: what the system
must do, how it is built, tested, deployed and paid for, and how to extend it.
It complements — and never restates — the product plan in
[`docs/plan/`](../plan/00-README.md), which remains the source of truth for
vision, content model, editorial policy and roadmap.

| Doc | Contents | Audience |
|---|---|---|
| [01 · Business requirements](01-business-requirements.md) | Vision, stakeholders, functional and non-functional requirements, scope, success metrics | Everyone |
| [02 · Architecture](02-architecture.md) | System context, containers, hosting, the graph-in-git pattern, key decisions | Developers, reviewers |
| [03 · Design](03-design.md) | Content model, pipeline design, site design, i18n/RTL, licensing | Developers, content authors |
| [04 · Implementation](04-implementation.md) | High-level module map, detailed flows (validate → graph → derive → build → deploy), conventions | Developers |
| [05 · Testing](05-testing.md) | Validator, vitest suites, Lighthouse CI, review gates, per-change commands | Developers, reviewers |
| [06 · Deployment](06-deployment.md) | CI/CD to Cloudflare Pages + R2, secrets, rollback, checklist | Maintainers, ops |
| [07 · Performance](07-performance.md) | Budgets, lazy islands, Pagefind chunks, media strategy | Developers |
| [08 · Security](08-security.md) | Threat model, supply chain, secrets, licensing enforcement, privacy, content integrity | Maintainers, reviewers |
| [09 · Cost analysis](09-cost-analysis.md) | Free-tier inventory, harvest-side costs, scale scenarios, $0/month runtime | Founder, funders |
| [10 · Extensibility](10-extensibility.md) | Adding classes, languages, islands, predicates, harvest lanes; the delegation model | Contributors |
| [11 · Assessment](11-assessment.md) | Scorecard vs world-class knowledge projects: ratings, justifications, gaps, priorities | Founder, reviewers, funders |
| [12 · AI ecosystem](12-ai-ecosystem.md) | The agent workforce: who the agents are, governance framework, executable guardrails, the image pipeline, remaining gaps | Everyone — the project's signature document |
| [13 · Clone as template](13-clone-as-template.md) | Reusing the repo for any knowledge-graph museum: what transfers, what to replace, clone procedure, ready-to-paste master prompt | Founders of new projects |
| [14 · Local development](14-local-development.md) | Run the whole museum offline on a laptop — no Cloudflare, R2, accounts or secrets; commands, offline feature table, troubleshooting | Developers |
| [Diagrams](diagrams.md) | All Mermaid diagrams in one place | Everyone |
| [Executive deck](../presentation/executive-deck.md) | Marp slide deck for developers | New joiners |

## Reading order

- **New developer:** executive deck → 01 → 02 → 04 → 05 → 10.
- **Reviewer / maintainer:** 02 → 05 → 06 → 08.
- **Funder / stakeholder:** 01 → 09 → roadmap in `docs/plan/06-roadmap.md`.

## Canonical sources

When this set and the plan disagree, the plan wins — file an issue or fix
this set. Facts here were taken from `docs/plan/*`, `docs/status.md`,
`docs/scope.md`, `docs/language.md`, `docs/ai-change-gates.md`,
`docs/adr/*`, `package.json`, `.github/workflows/*` and the `data/` tree at
the time of writing; live counts are always in `docs/coverage.md` and
`api/v1/meta/coverage.json`.
