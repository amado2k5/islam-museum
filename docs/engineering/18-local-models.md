# 18 — The local model layer (founder's Mac)

Status: operational on the founder's Mac (M4 Max, 128 GB unified memory,
macOS). Everything in this document is **build-time only** — no model here
runs on the published site, per visitor, or at runtime. The division of labour
is a founder ruling (8 November 2026): **Devin sessions orchestrate and keep
progress; the Mac supplies local compute.**

## 1. Machine roles

| On the Mac (local, free, private) | On Devin (cloud agent) |
|---|---|
| Decision-engine judge + embedding models (Ollama) | Translation — all `content/en`/`ur` prose and i18n |
| Image generation | Entity and prose authoring in `data/` + `content/ar/` |
| Apple Vision OCR (borrow-only books, page verification) | Repository edits, validation, commits, pushes |
| The shared browser (archive.org borrowing, source checks) | Orchestration — sequencing work, dispatching Mac tasks |
| File conversion, video/audio splitting | Progress state — lanes, stubs, decision records |
| Large downloads (harvest fetches, `ollama pull`) | Decision-ledger routing for every judgment call |

Authority is unchanged by the split: the deterministic rule engine decides,
the judge only recommends (`status: recommended`), and founder-only surfaces
(deploy, delete, spend, outreach, safety blocks, Qur'an text, licences) dock
regardless of which machine asked.

## 2. Model inventory and assignments

Ollama serves everything at `http://localhost:11434` (OpenAI-compatible at
`/v1`). Models live in `~/.ollama` on the internal disk — **112 GB free as of
8 Nov 2026**, so large pulls should prefer the microSD redirect
(`OLLAMA_MODELS=/Volumes/exmicroSD/ollama/models`, ~151 GB free there) before
the disk tightens.

| Component | Model | Size | Role | Status |
|---|---|---|---|---|
| Decision judge | `qwen2.5:32b` | ~19 GB | Bidirectional BPE recommendations on held questions — advisory only | pulling 8 Nov |
| Judge fallback | `qwen3:32b` | ~20 GB | Same role, already installed; also the original judge before the qwen2.5 approval | installed |
| Judge fallback (fast) | `llama3.1:8b` | ~4.9 GB | Low-latency pass for triage | installed |
| Precedent embeddings | `qwen3-embedding:0.6b` | ~0.6 GB | Hybrid retrieval over precedents + ledger (default `DECIDE_EMBED_MODEL`) | installed |
| Precedent embeddings (upgrade) | `qwen3-embedding:8b` | ~4.7 GB | MTEB-multilingual #1 (70.58 vs 0.6b's 64.33) — better paraphrase/Arabic matching; set `DECIDE_EMBED_MODEL=qwen3-embedding:8b`, cache is per-model so no collision | pulling 8 Nov |
| OCR | Apple Vision (`VNRecognizeTextRequest`) | — | Page-image → text for scans and borrow-only books; not an Ollama model | system |
| Image generation | founder's local tools | — | Illustrations lane | system |
| Code/agent helpers | `qwen2.5-coder:{1.5b,7b,14b,32b}` | 1–19 GB | Optional local coding assistance | installed |

## 3. How the pieces connect

```
held question (safe-default, needs_precedent)
  │  decide.ts maybeJudge()
  ├─ DECIDE_JUDGE_URL → Ollama /v1/chat/completions  (qwen2.5:32b)
  │    two passes: affirmative + adversarial framing, parallel
  │    think:false · json_object · temperature 0.3
  ├─ BPE uncertainty → confidence, judge_dissent on coin-flips
  └─ record lands status:recommended — engine hold stands underneath

precedent retrieval (every question)
  ├─ BM25 lexical path (always on)
  └─ hybrid path: query embedded via DECIDE_EMBED_URL /api/embeddings
       corpus cached per-model in docs/decisions/.embeddings-<model>.json
       dual-path gate: lexical OR (cosine≥0.68 ∧ titleOverlap≥0.25 ∧ hybrid≥0.52)
```

Env vars (all optional; without them the engine is deterministic-only):

```bash
export DECIDE_JUDGE_URL=http://localhost:11434/v1/chat/completions
export DECIDE_JUDGE_MODEL=qwen2.5:32b
export DECIDE_EMBED_URL=http://localhost:11434
export DECIDE_EMBED_MODEL=qwen3-embedding:8b   # after quality check
export DECIDE_HYBRID=0                          # BM25-only fallback
```

## 4. Model selection rationale (researched 8 Nov 2026)

- **Judge = qwen2.5:32b (founder-approved).** Strongest local reasoning-per-GB
  for doctrine questions; 32B Q4 runs ~2–4 min per held question on this Mac
  (two passes in parallel). Qwen's multilingual coverage handles the
  Arabic-first corpus.
- **Embeddings upgrade to 8B.** Qwen3-Embedding-8B is the MTEB multilingual
  leaderboard #1 (70.58 vs 64.33 for 0.6B); the gap shows most on
  paraphrase and cross-lingual matching — exactly what precedent retrieval
  needs. At ~5 GB it is free on 128 GB. Per-model cache files mean the
  switch is clean; validate retrieval on the benchmark before adopting.
- **Newest generation evaluated, not adopted yet.** `qwen3.5` (0.8b–122b,
  256K context, 201 languages, hybrid GDN+MoE) is the current Ollama
  flagship family; `qwen3.5:27b` is the natural next judge candidate for
  A/B evaluation against qwen2.5:32b once the jury harness
  (`jury-ab.ts`, roadmap) exists. `gemma3:27b` and `llama3.3:70b` remain
  the documented proposer/escalation jurors for model-family diversity —
  a single-family judge shares its blind spots.
- **Arabic specialists noted, not adopted.** Jais 30B (Core42/G42, Apache
  2.0) leads Arabic quality benchmarks; Falcon-H1-Arabic 7B is the
  consumer-hardware option; ALLaM and Fanar 2.0 are regional sovereign
  models. None beats a general-reasoning 32B on the judge's actual task
  (evaluating evidence and doctrine, mostly in English/meta-language), but
  they are the fallback if Arabic-heavy judging shows weakness.
- **`autotrust-jev` (new in Ollama v0.40.15, 3 Nov 2026)** returns
  choices/yes-no probabilities/ratings — a purpose-built decision model
  (9b/35b/27b-vl). Interesting for a future calibrated-verdict tier, but it
  does not emit the free-text `recommendation`/`confidence` JSON the judge
  contract expects; would need an adapter, not a drop-in.

## 5 Optimization notes

- Keep `num_ctx` modest for judge calls — questions are short; long context
  only wastes KV-cache memory and latency.
- `think:false` is already sent for Qwen3-class models; Qwen3.5 thinking
  variants should get the same flag (verify the API honours it).
- Run the two BPE passes in parallel (already the default); on a 128 GB Mac
  a 32B model leaves room for the embedding model resident simultaneously.
- For bulk held-question triage, `llama3.1:8b` via `DECIDE_JUDGE_MODEL`
  trades quality for ~10× speed — use `triage.ts` for the first pass and
  reserve 32B for contested items.
- Model pulls are Mac tasks: kick `ollama pull` off and let it run; Devin
  sessions should not block on download progress.
