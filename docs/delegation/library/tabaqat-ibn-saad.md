# Progress: lib-tabaqat-ibn-saad (Ibn Sa'd, al-Tabaqat al-Kubra)

Branch: `content/lib-tabaqat-ibn-saad`. Stubs: `data/_stubs.d/lib-tabaqat-ibn-saad.yaml`. Work files: `~/islam-museum-harvest/work/tabaqat-ibn-saad/` (not in git).

## Edition and item used
- Item `AAlexandrina-144131` (archive.org), title «الطبقات الكبرى», Volume 2 (الجزء الثاني) per the book's own title page. Covers the Prophet's campaigns from Khaybar (غزوة خيبر, p. 3 of the scan).
- Other copies in the workspace: `AAlexandrina-144157` (Volume 5, Medina tabi'un and Companions in Mecca, Ta'if, Yemen, Yamama, Bahrayn) and `AAlexandrina-144171` (Volume 4). Not used yet.
- Printed-page offset: **not yet established** (the scan's printed numbers are not reliable in the OCR). Claims cite PDF page until the offset is recorded here.

## Scripts
- `scripts/harvest/library/claims_pipeline.py`: sections, extract (extractor model, schema-constrained, temperature 0, seed 42), quote check (code), judge (second family), report.

## Models
- Extractor: `qwen3:32b` (Apache-2.0 per the Qwen3 release; tag and digest recorded below once pulled).
- Judge: `gemma4:26b` (Apache-2.0, checked with `ollama show --license`). JSON test passed on a 1-line Arabic sentence.

## Status (12 Oct 2026, 11:22; paused by the founder)
- Re-split into 2-page sections (21 sections). The earlier 6-page results are kept in `raw/AAlexandrina-144131-6p/`.
- Recorded: 0000 (pp. 1–3) 7 candidates; 0001 (pp. 4–5) 27; 0002 (pp. 6–7) 6; 0003 (pp. 8–9) FAILED (invalid JSON); 0004 (pp. 10–11) 5; 0005 (pp. 12–13) 8; 0006 (pp. 14–15) 10; 0007 (pp. 16–17) 19; 0008 (pp. 18–19) 7; 0009 (pp. 20–21) recorded; 0010 (pp. 22–23) FAILED (invalid JSON); 0011 (pp. 24–25) 13; 0012 (pp. 26–27) recorded.
- Paused at 12 of 21 recorded sections. Extraction and watchdog are stopped; saved outputs remain in the harvest workspace.
- Stall handling: the watchdog restarts after 12 minutes without output; a timed-out call is recorded as TIMEOUT and the run continues; output is capped at 4,096 tokens per section.
- Not yet done: retry of 0003 and 0010, sections 0013–0020, quote check, judge, gold report.

## Doubts flagged
- OCR of this scan contains misreadings (for example «رصول اللّٰه» for «رسول الله»). The quote check runs on normalised text; claims whose quotes fail because of OCR are dropped and logged, not corrected.

## Next step
Run `claims_pipeline.py extract` and `judge` on the 7 sections, write `work/tabaqat-ibn-saad/gold-report.md`, then stop for founder review (per prompt §5).
