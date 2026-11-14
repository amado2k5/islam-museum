# Orchestration files (snapshot, 14 November 2026)

Working files of the three-lane orchestration, kept here so they are not lost if the
microSD or a temporary folder is cleared. Live copies: the lane rules in the
orchestrator's scratchpad; the pipeline brief, the lander brief and the board at the
harvest root (`<harvest-root>/packets/`, `<harvest-root>/BOARD.md`). Paths are written
with placeholders (`<harvest-root>`, `<main-checkout>`).

- `lane-rules.md`: the shared rules every lane worker reads.
- `packet-pipeline.md`: producing is separated from landing (founder approval, 14 November 2026, changes 1 to 4). The full rule text for AGENTS.md follows in its own pull request.
- `lander-brief.md`: the one agent that writes lane content to main.
- `board-snapshot-2026-11-14.md`: the single control file, as it stood.
- `../../delegation/gemini/`: prompts sent to Gemini through the founder and the answers received (claims to verify, never applied unchecked).
