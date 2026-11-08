# Local judge model — setup for the decision approver's GenAI tier

> **Model layer doc:** `docs/engineering/18-local-models.md` — the full
> inventory, machine-roles split (Mac computes, Devin orchestrates), per-
> component assignments, selection rationale and optimization notes.

The judge tier (`decide.ts` `maybeJudge`) is **build-time only** — it runs on
the machine building the repo, never on the published site, never per visitor.
It exists so held questions (safe-default, `needs_precedent`) get an evidence-
backed recommendation instead of sitting idle. The deterministic engine stays
the sole authority; the model only ever produces `status: recommended`.

## This Mac (M4 Max, 128 GB)

Ollama is installed and serving the OpenAI-compatible API at
`http://localhost:11434/v1`. Models present: `qwen3:32b`, `llama3.1:8b`,
`qwen2.5-coder:{1.5b,7b,14b,32b}`, `qwen3-embedding:0.6b`, `nomic-embed-text`.

**Recommended judge: `qwen2.5:32b`** (founder-approved 8 Nov 2026, ~20 GB —
`ollama pull qwen2.5:32b` if absent) — strongest local reasoning for
doctrine-heavy questions. `qwen3:32b` (already installed) and `llama3.1:8b`
(fast fallback) also work — set `DECIDE_JUDGE_MODEL` to whichever is pulled.
Models live in `~/.ollama` on the internal disk; the microSD
(`/Volumes/exmicroSD`) has 151 GB free if the internal disk ever gets tight —
set `OLLAMA_MODELS=/Volumes/exmicroSD/ollama/models` before first pull to
redirect storage.

## Machine roles (founder ruling, 8 Nov 2026)

The founder's Mac is the local-compute node; Devin sessions orchestrate and do
the repository work. Division of labour:

- **On the Mac (local, free, private):** the decision-engine judge and
  embedding models (Ollama), image generation, Apple Vision OCR, browsing and
  the shared browser, file conversion, video/audio splitting, and large
  downloads (harvest fetches, model pulls).
- **On Devin (cloud agent):** translation (all `content/en|ur` prose), entity
  and prose authoring, repository edits, validation, commits — and
  **orchestration**: Devin keeps progress state, sequences the work, and
  dispatches Mac-side tasks (OCR a page range, pull a model, borrow-and-read a
  book) rather than doing them inline.

Nothing in this split changes authority: the deterministic engine still decides,
the judge still only recommends, and founder-only surfaces still dock.

## Usage

```bash
# Point the engine at the local endpoint (Ollama OpenAI-compat):
export DECIDE_JUDGE_URL=http://localhost:11434/v1/chat/completions
export DECIDE_JUDGE_MODEL=qwen2.5:32b        # or llama3.1:8b for speed

# Single question:
echo '{"question":"...","lane":"..."}' | npx tsx scripts/decisions/decide.ts --json

# Hybrid precedent retrieval (embeddings, on by default):
export DECIDE_EMBED_URL=http://localhost:11434
export DECIDE_EMBED_MODEL=qwen3-embedding:0.6b   # fallback: nomic-embed-text
ollama pull qwen3-embedding:0.6b
export DECIDE_HYBRID=0                            # disable → BM25 only

# Whole inbox (held questions get recommendations):
npx tsx scripts/decisions/decide.ts --batch docs/decisions/inbox --write

# Any OpenAI-compatible server works the same way (LM Studio, llama-server):
export DECIDE_JUDGE_URL=http://localhost:1234/v1/chat/completions
export DECIDE_JUDGE_MODEL=<model-id>

# Or any shell command that reads JSON on stdin and prints JSON on stdout:
export DECIDE_JUDGE_CMD="ollama run qwen2.5:32b"
```

## Bidirectional evaluation (default)

Each held question is judged **twice**: once affirmative ("recommend the most
conservative reversible answer") and once adversarial ("assume the obvious answer
is a false conflation / single-source copy / legend and try to falsify it").
Because verdicts are free text, agreement is measured by token similarity; each
pass contributes support = its clipped confidence (0.05–0.95) toward the picked
verdict, or `1 − confidence` when it confidently reached a different one. The
composite uncertainty is `s(x) = min(1, H(p̄) + 0.5·Δflip)` (binary Shannon
entropy of mean support plus half the support gap — the SCOPE formulation), and
the recorded confidence is `1 − s(x)`.

If `s(x) > 0.5` or two confident passes reach different verdicts, the engine's
safe-default hold stands and the record carries `judge_dissent: true` with both
recommendations for audit — the model can never talk the engine out of its hold
on a coin-flip. `DECIDE_JUDGE_SINGLE=1` reverts to one pass.

Calls send `think: false` (Qwen3-class models return the JSON verdict, not a
reasoning trace), `response_format: json_object` and `temperature: 0.3`. Give a
32B model ~2–4 min per held question on an M4 Max; the two passes run in
parallel. Full math and roadmap: `docs/engineering/17-decision-approver.md` §5.

## What the judge may and may not do

- MAY: recommend an answer with confidence + evidence for a held question;
  the record lands as `status: recommended` for async audit.
- MAY NOT: produce `decided`, override a gate/rule/precedent, touch deploys,
  deletions, spend, outreach, licences, review-status, or content-safety
  topics — the engine intercepts those before the judge ever sees them.
- Judge output is untrusted input: `parseJudgeJson` extracts the first JSON
  object and validates it has a `recommendation` string; anything else is
  ignored and the safe-default hold stands.

## For other builders/agents

Any machine can run the same setup: `brew install ollama && ollama serve &&
ollama pull qwen2.5:32b` (or any instruct model ≥14B), then set the two env vars.
No repository code changes are needed — the judge is pure configuration.
Without the env vars the engine behaves exactly as before (deterministic only).
