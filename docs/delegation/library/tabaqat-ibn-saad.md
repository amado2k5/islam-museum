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

## Status (12 Oct 2026, 09:57)
- Re-split into 2-page sections (21 sections). The earlier 6-page results are kept in `raw/AAlexandrina-144131-6p/`.
- Done: 0000 (pp. 1–3): 7 candidates; 0001 (pp. 4–5): 27; 0002 (pp. 6–7): 6. Section 0003 restarted at 09:55 after a stall (no output for 14 min; Ollama in "Stopping..."). Watchdog stall window lowered to 12 min.
- Not yet done: quote check, judge, gold report.
- Sections: 7 (6 pages each, 42 non-empty pages). **The gold set of 30 sections cannot be drawn from this item**; the gold run uses all 7 and this is stated in the gold report.
- Extraction (`qwen3:32b`, temperature 0, seed 42): section 0000 done (16 candidate claims before the quote check); sections 0001–0006 in progress. Raw answers stay in `~/islam-museum-harvest/work/`, not in git.
- Gold set: pending extraction, quote check and judge.

## Doubts flagged
- OCR of this scan contains misreadings (for example «رصول اللّٰه» for «رسول الله»). The quote check runs on normalised text; claims whose quotes fail because of OCR are dropped and logged, not corrected.

## Next step
Run `claims_pipeline.py extract` and `judge` on the 7 sections, write `work/tabaqat-ibn-saad/gold-report.md`, then stop for founder review (per prompt §5).
