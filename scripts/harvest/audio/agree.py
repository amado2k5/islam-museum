#!/usr/bin/env python3
"""Agreement report between two transcription passes of the same episode (verification step, method §2).

Reads two mlx-whisper JSON outputs, compares the two passes in fixed time windows (default 60 s) and scores the Arabic word overlap
(Jaccard on normalised words). Windows scoring at least --threshold are 'agreed'; the rest are 'disputed'
and must not feed claims without a second engine or a person listening at their timestamp. Writes a TSV to --out. Nothing is written to the repository.

Usage: python agree.py A.json B.json --out report.tsv [--threshold 0.6]
"""
import argparse, csv, json, re, sys
from pathlib import Path

DIACRITICS = re.compile(r"[ؐ-ًؚ-ٰٟۖ-ۭ]")


def norm_words(text: str) -> set:
    t = DIACRITICS.sub("", text)
    t = t.replace("أ", "ا").replace("إ", "ا").replace("آ", "ا").replace("ى", "ي").replace("ة", "ه")
    return {w for w in re.split(r"[^\w]+", t) if len(w) > 1}


def hms(seconds: float) -> str:
    s = int(seconds)
    return f"{s // 3600:02d}:{(s % 3600) // 60:02d}:{s % 60:02d}"


def window_text(segments: list, start: float, end: float) -> str:
    """Text of every segment whose midpoint falls inside [start, end)."""
    return " ".join(s["text"].strip() for s in segments if start <= (s["start"] + s["end"]) / 2 < end)


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("a", type=Path)
    ap.add_argument("b", type=Path)
    ap.add_argument("--out", required=True, type=Path)
    ap.add_argument("--window", type=float, default=60.0, help="seconds per comparison window")
    ap.add_argument("--threshold", type=float, default=0.6)
    args = ap.parse_args()
    a = json.loads(args.a.read_text(encoding="utf-8"))["segments"]
    b = json.loads(args.b.read_text(encoding="utf-8"))["segments"]
    end = max(s["end"] for s in a + b)
    agreed = disputed = 0
    with args.out.open("w", encoding="utf-8", newline="") as f:
        w = csv.writer(f, delimiter="\t")
        w.writerow(["start", "end", "score", "status", "text_a", "text_b"])
        t = 0.0
        while t < end:
            ta = window_text(a, t, t + args.window)
            tb = window_text(b, t, t + args.window)
            wa, wb = norm_words(ta), norm_words(tb)
            score = len(wa & wb) / len(wa | wb) if (wa | wb) else 1.0
            status = "agreed" if score >= args.threshold else "disputed"
            agreed += status == "agreed"
            disputed += status == "disputed"
            w.writerow([hms(t), hms(min(t + args.window, end)), f"{score:.2f}", status, ta, tb])
            t += args.window
    total = agreed + disputed
    print(f"{args.a.name} vs {args.b.name}: {agreed} of {total} windows agreed "
          f"({(100 * agreed / total if total else 0):.0f}%) -> {args.out}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
