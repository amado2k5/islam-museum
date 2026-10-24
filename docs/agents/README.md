# Agent documents (vendor-neutral)

These documents apply to every agent, whichever vendor, product or model it is, and to human contributors. They replace the earlier per-vendor prompts. Start at [`AGENTS.md`](../../AGENTS.md).

| Document | Read it when |
|---|---|
| [`AGENTS.md`](../../AGENTS.md) | Always, first: the rules that never bend. |
| [`../sources-policy.md`](../sources-policy.md) | Before you use any source: what may be read (everything), how it is rewritten and cited, what stays out of git. |
| [`workflow.md`](workflow.md) | You are about to set up, edit, commit, push, merge or hand off. |
| [`content-standards.md`](content-standards.md) | You write or change any entity (data or prose). |
| [`review-and-promotion.md`](review-and-promotion.md) | You review a record, promote its `status.review`, run the audit, or demote. |
| [`mining-sources.md`](mining-sources.md) and [`categories/`](categories/) | You turn a book, a dictionary or a text collection into entities. |
| [`lanes.md`](lanes.md) and [`lanes/`](lanes/) | You are assigned a lane, or you start a new one; the registry of who works on what. |
| [`../status.md`](../status.md) | You need the live state of the project and the harvest. |
| [`../delegation/microsd-ocr-status.md`](../delegation/microsd-ocr-status.md) | You are asked how many library books are OCR'd, or you add or OCR books on the drive. |
| [`../site/README.md`](../site/README.md) | You change the site (`site/`), the UI strings, a date or timeline, a map, or a build check. |

Why one set of files: earlier instructions lived in `CLAUDE.md`, `AGENTS.md`, `docs/collaboration.md`, `docs/content-quality.md` and a prompt per vendor (Devin, Kiro, Antigravity, Codex). They drifted apart and agents repeated each other's mistakes. Now the rules live here once; vendor files (`CLAUDE.md`, `GEMINI.md`, `.kiro/steering/`, `.github/copilot-instructions.md`, `.cursor/rules/`) are one-line pointers.

## Giving a task to an agent

Paste this, replacing the lane name (the lane document does the rest):

```
You are an agent working on islam.museum. Read AGENTS.md, then docs/agents/workflow.md, docs/agents/content-standards.md and, for your lane, docs/agents/lanes/<lane>.md (and docs/agents/mining-sources.md if it mines a book). Follow them exactly. Start with the lane's progress file and resume at its "next step". Push small validated commits to main often and keep the progress file current.
```

For a library book, `python scripts/harvest/library/make_work_order.py <book-id>` composes a complete order from these documents.
