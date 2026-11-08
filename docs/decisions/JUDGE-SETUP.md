# Local judge model — setup for the decision approver's GenAI tier

The judge tier (`decide.ts` `maybeJudge`) is **build-time only** — it runs on
the machine building the repo, never on the published site, never per visitor.
It exists so held questions (safe-default, `needs_precedent`) get an evidence-
backed recommendation instead of sitting idle. The deterministic engine stays
the sole authority; the model only ever produces `status: recommended`.

## This Mac (M4 Max, 128 GB)

Ollama is installed and serving the OpenAI-compatible API at
`http://localhost:11434/v1`. Models already present: `llama3.1:8b`,
`qwen2.5-coder:{1.5b,7b,14b,32b}`, `nomic-embed-text`.

**Recommended judge: `qwen3:32b`** (~20 GB, pulled 8 Nov 2026) — strongest
local reasoning for doctrine-heavy questions. `llama3.1:8b` works as a fast
fallback. Models live in `~/.ollama` on the internal disk; the microSD
(`/Volumes/exmicroSD`) has 151 GB free if the internal disk ever gets tight —
set `OLLAMA_MODELS=/Volumes/exmicroSD/ollama/models` before first pull to
redirect storage.

## Usage

```bash
# Point the engine at the local endpoint (Ollama OpenAI-compat):
export DECIDE_JUDGE_URL=http://localhost:11434/v1/chat/completions
export DECIDE_JUDGE_MODEL=qwen3:32b        # or llama3.1:8b for speed

# Single question:
echo '{"question":"...","lane":"..."}' | npx tsx scripts/decisions/decide.ts --json

# Whole inbox (held questions get recommendations):
npx tsx scripts/decisions/decide.ts --batch docs/decisions/inbox --write

# Any OpenAI-compatible server works the same way (LM Studio, llama-server):
export DECIDE_JUDGE_URL=http://localhost:1234/v1/chat/completions
export DECIDE_JUDGE_MODEL=<model-id>

# Or any shell command that reads JSON on stdin and prints JSON on stdout:
export DECIDE_JUDGE_CMD="ollama run qwen3:32b"
```

## Bidirectional evaluation (default)

Each held question is judged **twice**: once affirmative ("recommend the most
conservative reversible answer") and once adversarial ("assume the obvious answer
is a false conflation / single-source copy / legend and try to falsify it"). The
two confidences are order-averaged and penalised by their disagreement; if they
materially dissent (`|Δconf| > 0.3` or adjusted confidence < 0.45) the engine's
safe-default hold stands and the record carries `judge_dissent: true` with both
recommendations for audit — the model can never talk the engine out of its hold
on a coin-flip. `DECIDE_JUDGE_SINGLE=1` reverts to one pass.

Qwen3-class thinking models: the engine sends `"think": false` automatically so
the reply is the JSON verdict, not a reasoning trace. Give a 32B model ~2–4 min
per held question on an M4 Max; the two passes run in parallel.

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
ollama pull qwen3:32b` (or any instruct model ≥14B), then set the two env vars.
No repository code changes are needed — the judge is pure configuration.
Without the env vars the engine behaves exactly as before (deterministic only).
