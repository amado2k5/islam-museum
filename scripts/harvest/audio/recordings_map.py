#!/usr/bin/env python3
"""Write site/src/data/recordings.json: for each recorded lesson, the archive page and the direct audio file.

Reads the download manifests (series_slug, episode, title, duration, url) that scripts/harvest/audio/download.py
used, so the site can link a citation such as {cite:assabile-omar-abdelkafy aadau-al-islam/ep02 00:12:34} to
the original recording. Only URLs of the archive's own files are written; no audio is copied.

Usage: python recordings_map.py MANIFEST.tsv [MANIFEST.tsv ...] --speaker omar-abdelkafy --out site/src/data/recordings.json
"""
import argparse, csv, json, sys
from pathlib import Path

PAGE = "https://www.assabile.com/{speaker}/lessons/{series}/episode-{ep:02d}"


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("manifests", nargs="+", type=Path)
    ap.add_argument("--speaker", required=True)
    ap.add_argument("--out", required=True, type=Path)
    args = ap.parse_args()
    out: dict = {}
    for m in args.manifests:
        with m.open(encoding="utf-8") as f:
            for row in csv.DictReader(f, delimiter="\t"):
                ep = int(row["episode"])
                series = row["series_slug"]
                out.setdefault(series, {})[str(ep)] = {
                    "page": PAGE.format(speaker=args.speaker, series=series, ep=ep),
                    "media": row["url"],
                }
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps(out, ensure_ascii=False, indent=1, sort_keys=True) + "\n", encoding="utf-8")
    print(f"wrote {sum(len(v) for v in out.values())} recordings in {len(out)} series -> {args.out}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
