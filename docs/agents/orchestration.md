# Agent orchestration — how the fleet builds the museum

How islam.museum is produced by a fleet of AI agents working in parallel under the founder's direction. The failure mode this design defends against — an agent that both *writes* content and *decides what is true* eventually validating its own inventions — is a state problem, not primarily a model problem. The defence is architectural, and it has four load-bearing parts:

1. **Git is the only shared memory.** No agent carries conversational context into the next task. Everything an agent may rely on — schema, enums, lane rules, progress, prior rulings — lives in the repo (`schema/`, `docs/agents/lanes/`, `docs/plan/`). An agent with a fresh context window reads the same files a human contributor reads. Context degradation is therefore bounded by file quality, not by window length.
2. **Work is decomposed into bounded "waves" with file-level briefs.** A brief names the exact records to build, the exact schema shape (with a checklist), the allowed sources, and hard limits: *files only in the named worktree; never commit, push, open or merge PRs; never start another wave.* Writers produce files; a separate coordinator verifies and merges. Generation and integration are different jobs done by different passes.
3. **Deterministic gates, not vibes.** Every batch must pass `npm run validate` with the literal result **"0 errors"** and a citation check with **"0 fail"** before a merge is even attempted. The gates are string-matched assertions in the merge procedure, never a grep over error output (a grep "succeeds" when it *finds* errors — a failure mode that was hit once and is now written into the operating rules).
4. **The human is the router and the court of appeal.** The founder fetches the latest `origin/main` before every push, diffs staged files against the remote, and 3-way merges whenever another agent touched the same file. Contested *judgements* (as opposed to facts) are escalated to the founder and recorded as written rulings in the lane docs, so no later agent re-litigates them.

One honest caveat, learned in production: delegation does not remove the need for verification of the *brief itself*. The most damaging errors in the project's history were wrong assumptions inside briefs (a wrong parentage, a wrong relation direction, an invented source revision ID) that writers faithfully executed. Briefs are now preflighted mechanically — identity, relation direction, enum values, source identifiers — before any writer starts.

## Wave brief template

```markdown
# WAVE BRIEF — <lane>/<wave-id>
## Scope (exhaustive)
Build exactly these records: <list of class/slug>. Nothing else. If a listed
identity cannot be verified from the allowed sources, build a minimal honest
record or report it — never invent a substitute.

## Schema shape (checklist — every record, no exceptions)
- File: data/<class>/<slug>.yaml, prose: content/<lang>/<class>/<slug>.md
- Required keys in order: id, class, label{ar,en}, summary, sources[], provenance
- sources[] entries are maps: {kind, title, ref} — never bare strings
- Enum values only from schema/enums/*.yaml — if a value is missing, STOP and
  report; do not coin one
- Relations: verify direction against the target record before writing an edge

## Evidence rules
- Every factual claim traces to a source in sources[] with a resolvable ref
- Contested attributes follow the lane's settlement doctrine (see lane doc);
  doubt resolves to `unknown` with the readings preserved in a note field

## HARD LIMITS
- Write files ONLY in <worktree path>. Never commit, push, open/merge PRs.
- Never edit queue/progress files. Never compose or start another wave.
- On any schema or identity doubt: stop that record, note it, continue others.

## Return
A manifest: records built, records skipped (with reason), sources used.
```

## Pipeline (per wave)

brief → preflight check of the brief → writers build files in isolated worktrees → coordinator runs validate ("0 errors") + cite-check ("0 fail") → fetch origin/main → 3-way merge of overlapping files → single commit per bounded batch (≤25 entities) with a CANARY.md entry in the same commit → PR → merge → founder deploys manually (merged ≠ live).
