"""Authenticity gate for the harvest (docs/delegation/authenticity-policy-proposal.md).

Reads scripts/harvest/library/authenticity.yaml, the register of decisions about whole items.
A book with decision `reject` is never fetched. `label` and `accept` books are fetched as before.
A book with no decision yet is fetched with a warning, unless the run uses --require-decision.

Gatekeeps identity and provenance only. It never looks at what a book says.
"""
import re
from pathlib import Path
import yaml

REGISTER = Path(__file__).with_name("authenticity.yaml")
DECISIONS = {"accept", "label", "reject"}


def load_decisions(path: Path = REGISTER) -> dict:
    """Map book id -> decision record. Missing file means no decisions (everything warns)."""
    if not path.exists():
        return {}
    reg = yaml.safe_load(path.read_text(encoding="utf-8")) or {}
    return {d["id"]: d for d in reg.get("decisions", []) if d.get("id")}


def gate(book_id: str, decisions: dict, require_decision: bool = False):
    """Return (allowed, decision, message). Pure function so it can be tested without the network."""
    d = decisions.get(book_id)
    if d is None:
        if require_decision:
            return False, None, f"{book_id}: no authenticity decision recorded; refused (--require-decision)"
        return True, None, f"{book_id}: no authenticity decision recorded yet; fetched with a warning"
    decision = d.get("decision")
    if decision not in DECISIONS:
        return False, decision, f"{book_id}: invalid decision {decision!r}; refused"
    if decision == "reject":
        return False, decision, f"{book_id}: rejected ({d.get('reason', 'no reason recorded')}); not fetched"
    if decision == "label":
        return True, decision, f"{book_id}: labelled ({d.get('school', 'school not recorded')}); fetched"
    if not d.get("named_edition"):
        return False, decision, f"{book_id}: accepted without a named edition; refused (the harvest needs a named edition to match)"
    return True, decision, f"{book_id}: accepted; only candidates matching the named edition are fetched"


def _norm(s) -> str:
    """Lower-case, no diacritics, unify alef and taa-marbuta, and treat apostrophes and hyphens as spaces."""
    s = re.sub(r"[ً-ٰٟـ]", "", str(s or "")).lower()
    s = re.sub(r"[ʻʼ’'`ʾ\-]", " ", s)
    for a, b in (("أ", "ا"), ("إ", "ا"), ("آ", "ا"), ("ى", "ي"), ("ة", "ه")):
        s = s.replace(a, b)
    return re.sub(r"\s+", " ", re.sub(r"[^\w\s]", " ", s)).strip()


def named_edition(book_id: str, decisions: dict):
    """The named-edition rule for an accepted work, or None."""
    d = decisions.get(book_id) or {}
    return d.get("named_edition") if d.get("decision") == "accept" else None


def edition_matches(md: dict, cfg: dict) -> bool:
    """True only if the candidate's metadata names one publisher term AND one editor term from the named edition."""
    parts = []
    for k in ("title", "creator", "publisher", "editor", "description", "date"):
        v = md.get(k, "")
        parts.append(" ".join(map(str, v)) if isinstance(v, list) else str(v))
    text = _norm(" ".join(parts))
    def hit(group):
        return any(_norm(t) and _norm(t) in text for t in (group or []))
    return hit(cfg.get("publisher_any")) and hit(cfg.get("editor_any"))


if __name__ == "__main__":
    import sys
    dec = load_decisions()
    for bid in sys.argv[1:]:
        print(gate(bid, dec)[2])
