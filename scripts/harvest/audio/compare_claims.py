#!/usr/bin/env python3
"""Compare a local claims table with the citations Claude wrote for the same episode.

For one series and one episode, reads every {cite:assabile-omar-abdelkafy <series>/epNN hh:mm:ss} in
content/ar and the local <stem>.claims.jsonl, then reports:

  - how many of the cited windows the local table also covers (within --window seconds);
  - how many local claims fall next to a cited window, and how many do not (the local table may
    find points the written records skipped, so these are listed for reading, not counted as errors);
  - the refused counts from the local run.

Usage: python compare_claims.py --repo REPO --series al-naba-al-safi --episode 1 --claims DIR [--window 60]
"""
import argparse, json, re
from pathlib import Path

CITE = re.compile(r"\{cite:assabile-omar-abdelkafy ([a-z0-9-]+)/ep(\d+) (\d{2}:\d{2}:\d{2})\}")


def seconds(hms: str) -> int:
    h, m, s = (int(x) for x in hms.split(":"))
    return h * 3600 + m * 60 + s


def cited_windows(repo: Path, series: str, episode: int) -> dict:
    """Map each cited window to the set of files (entity ids) that cite it."""
    found: dict = {}
    for md in (repo / "content" / "ar").rglob("*.md"):
        entity = f"{md.parent.name}/{md.stem}"
        for m in CITE.finditer(md.read_text(encoding="utf-8")):
            if m.group(1) == series and int(m.group(2)) == episode:
                found.setdefault(seconds(m.group(3)), set()).add(entity)
    return found


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--repo", type=Path, required=True)
    ap.add_argument("--series", required=True)
    ap.add_argument("--episode", type=int, required=True)
    ap.add_argument("--claims", type=Path, required=True, help="the local output folder")
    ap.add_argument("--window", type=int, default=60)
    args = ap.parse_args()

    stem = f"ep{args.episode:02d}"
    cited = cited_windows(args.repo, args.series, args.episode)
    local = [json.loads(l) for l in (args.claims / f"{stem}.claims.jsonl").read_text(encoding="utf-8").splitlines() if l.strip()]
    rejects_path = args.claims / f"{stem}.rejects.jsonl"
    rejects = [json.loads(l) for l in rejects_path.read_text(encoding="utf-8").splitlines() if l.strip()] if rejects_path.exists() else []
    local_secs = sorted({seconds(c["time"]) for c in local})

    covered = [c for c in cited if any(abs(c - l) <= args.window for l in local_secs)]
    uncovered = sorted(set(cited) - set(covered))
    near = [l for l in local_secs if any(abs(l - c) <= args.window for c in cited)]
    far = [l for l in local_secs if l not in near]

    print(f"{args.series} {stem}")
    print(f"  Claude-cited windows: {len(cited)}")
    print(f"  local claims kept: {len(local)} in {len(local_secs)} windows; refused: {len(rejects)}")
    if cited:
        print(f"  cited windows also covered locally: {len(covered)}/{len(cited)} ({100 * len(covered) // len(cited)}%)")
    print(f"  local windows near a cited window: {len(near)}; not near one: {len(far)}")
    if uncovered:
        print("  cited but not covered locally:", ", ".join(
            f"{s // 3600:02d}:{(s % 3600) // 60:02d}:{s % 60:02d}" for s in uncovered))
    reasons: dict = {}
    for r in rejects:
        reasons[r.get("reason", "?")] = reasons.get(r.get("reason", "?"), 0) + 1
    for reason, n in sorted(reasons.items(), key=lambda kv: -kv[1]):
        print(f"  refused ({n}): {reason}")


if __name__ == "__main__":
    main()
