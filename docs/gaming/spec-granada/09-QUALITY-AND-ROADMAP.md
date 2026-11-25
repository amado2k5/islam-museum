# Delivery roadmap, verification and release quality
## Dependency-aligned workstream
The existing V2 M0–M11 roadmap remains intact. Granada G0–G8 is a title-specific lane, not a replacement for platform milestones. Verify existing status, coordinate with owners and integrate through reviewed contracts. Make Granada the preferred flagship strategy demonstration where shared work can support it, but do not discard a completed Golden Age or Atlas slice. Do not declare all eleven games a prerequisite for staging a verified Granada candidate.

| Gate | Scope and dependency | Exit evidence |
|---|---|---|
| G0 Discover | V2 M0 or verified existing checkpoint; inspect code, GPU, data, CI, locales, rights, active PRs | Inventory, ownership, architecture ADRs, benchmark baseline, historical source gaps, scope mapping |
| G1 Art and renderer laboratory | V2 M1; reuse proven renderer or compare unresolved choices | Actual dense local style scene in browser, real asset pipeline, motion capture, physical GPU benchmark or explicit pending gate |
| G2 Playable village | V2 M2–M3; simulation, save and lifecycle contracts | Player repairs water, harvests, sells, builds, completes quest, saves/reloads; independent playthrough and balance feedback |
| G3 Regional economy | G2; transport, storage, recipes, market quotes, seasons | Two market destinations, shipment and contract delivery, overflow/shortage recovery; deterministic test evidence |
| G4 Construction and pressure | G2–G3; compatible modular geometry and diplomacy/defense | Castle blueprint, actual staged construction, abstract crisis and noncombat resolution, civic simulation |
| G5 Campaign and replay | G3–G4 | Full three-act campaign, sandbox, survival, daily/archive, scoring and real playtests; no disconnected UI |
| G6 SDK and creator | G2–G5; V2 M8 contracts | Independent T1 pack, import/export, compatibility and security tests, documented authoring workflow |
| G7 Integration | Begins G0; final gate after G5–G6; V2 M9 | 11-game registry, seven locales, routes/nav/home, docs, builds and staging rollback, museum regression evidence |
| G8 Release candidate | G1–G7 plus V2 M10–M11 | Actual graphics and gameplay captures, real GPU, human playtest, independent review, zero critical/high defects, verified portal eligibility where applicable; approval required before release |

If GPU or human testing is not available, continue implementation and mark the applicable hard gate pending. Don't call a software-only pass production-ready. Distinguish planning, prototype, vertical slice, alpha, candidate and released; only governance approves release. Record exact next task for interrupted sessions. Use Fable Extra for G0/G1 risky architecture and T2/security review, High for implementation, Medium/High for bounded docs; Max only selectively after evidence of need. Use local Claude Code, normal speed, worktree and scoped permissions. No uncontrolled parallel agents modifying shared state. Independent reviewers inspect evidence, not just author narrative.

## Evidence ledger template
Each row: requirement ID, dependency, scope, owner, status (not-tested / in-progress / pass / fail / pending-external / not-applicable with reason), commit, test command, fixture/seed, environment, evidence path, actual observed result, defect severity, approval status, next action. Store durable ledger in approved repo location; never overwrite failing proof. Test commands must reflect actual scripts. Keep failing regression cases and after-fix comparisons. New requirements do not waive V2 R01–R18. Mandatory release gates apply per scope; optional disabled features require clear UI absence/label and documented rationale.

## Test layers
| Layer | Representative cases |
|---|---|
| Pure unit | Price spread, raw vs oil valuation, inventory accounting, reserved cash, processing yield, construction state machine, quest rewards, water bounds |
| Property/fuzz | Random legal actions, extreme quantities, cancel/retry, malformed commands, deterministic replay, integer overflow, mod invalid data |
| Simulation | 1,000+ seeded campaign target across strategies, scarcity, weather, trade shock, migration, failure/recovery and no dominant exploit |
| Integration | Worker/host command validation, state snapshot, map marker/source ID, shipment arrival, save revision, device loss, mod profile |
| Browser E2E | First 5 minutes, three-act campaign, alternate strategy, daily archive, reload in transit, quest branching, construction cancellation, zoom/mode change, unsupported GPU |
| Visual | Eight production captures; compare actual style against V3/V1, no static screenshot; inspect motion, water, shadows, LOD seams, characters, camera transitions, scale |
| Security | V2 attack fixtures, remote manifest, ZIP traversal, XSS, oversized assets, mod disabled recovery, untrusted execution denied, no museum origin privilege |
| Localization/accessibility | All seven actual languages, RTL, keyboard, focus, text expansion, captions, zoom, mode transitions, no geography reversal |
| Release | Independent build, route collision, cache, asset hash, interruption, rollback, staging, existing museum validators and citations |

## Performance benchmark protocol
Use actual tested physical GPUs; report system CPU/GPU/RAM/driver/OS/browser build, power profile, display/render resolution, quality settings, content digest, seed, scenario, workload counts, warm-up, run length and measurement tools. At least three repeated runs per scenario after warmup; record p50/p95/p99 frame interval and stutter, CPU sim time, GPU timings if supported, loading bytes/time and memory observations. Don't confuse average FPS with frame pacing or native 4K with upscaled render. Test user interaction while fast-forwarding, camera zoom, scene transitions, shader compilation and memory pressure. Headless CI verifies function, not high-end visual performance. Device loss test saves state and recovers or provides readable fallback. Target 60-minute soak with bounded memory and no crash; compare before/after. Targets are not results.

| Benchmark | Scene and evidence |
|---|---|
| B1 first village | cold/warm playable load, first action latency, near assets, real controls |
| B2 mature Granada | V3-style busy district, actual buildings/agents/vegetation counted, 1440p High / 4K Ultra target |
| B3 regional map | zoom, route overlays, marker clustering, transition, asset streaming |
| B4 fortress construction | placement preview, snapping, shadow cost, worker movement, first-person entry |
| B5 winter/defense | weather, forecast, simulation accelerated, visual effects and UI response |
| B6 device recovery/soak | save during shipment, simulated device loss, reload, repeated district/mode changes |

Compare measured results to V2 high-end targets and disclose unmet targets. A device cannot be deemed supported solely because WebGPU is present. Preserve canonical art ambition; if needed optimize batching/streaming before reducing geometry detail. Publish supported versions only after test.

## Entertainment and independent review
Suggested formative rounds: 5–8 new users per major slice, with people not already invested in museum/history; later larger playtest if feasible. Obtain consent, minimize personal data, anonymize observations. No invented reviews or AI-generated feedback represented as human. Observe unassisted first minute, first loop, meaningful choice, confusion points, failure recovery, willingness to keep playing, desire to share. Ask what they would change and whether choices felt consequential. Record actual completion and median time; compare iterations rather than gaming metrics. Proposed targets: 80% find objective within 30s, 70% complete first loop within 5 minutes, most can explain why trading vs reserves matters. These are design targets, not universal benchmarks. Retention metrics need actual opt-in cohorts and time; no promises or fake numbers. Use V2 review framework: gameplay depth 20, visual art 20, originality 10, controls 10, replayability 10, audio 5, UI 5, performance 5, historical integrity 5, extensibility 5, accessibility/localization 5. Proposed ≥90/100 with each ≥8/10 plus all mandatory gates; independent reviewers must cite actual observations, not self-assign scores. Hard security, history, save and accessibility gates cannot be compensated by beauty.

## Final deliverables and release decision
Actual source and reproducible build; game data and source manifest; art source and optimized assets; tests and ledger; playable local and staging candidate; full campaign recording and eight distinct captures; benchmark report; independent review and human playtest report; developer SDK examples and docs; seven locale integration proof; build/deploy/rollback docs; press materials and portal compatibility matrix; reviewable PR(s) per repo. Any pending external gate explicitly labeled. No production merge/deploy or distribution submission without approval. Publish issue list and supported hardware honestly. A successful candidate is a real game with a sustained, tested loop, not a screenshot of its future promise.
