#!/usr/bin/env python3
"""Download lecture audio listed in a TSV manifest, politely and resumably.

Manifest (tab-separated, one header line):  series_slug<TAB>episode<TAB>title<TAB>duration<TAB>url
Files land in <out>/<series_slug>/epNN.mp3 (the extension follows the URL). Existing non-empty files are
skipped. Each new file's sha256 is appended to <out>/<series_slug>/SHA256SUMS. Two-second pause between
requests; identified User-Agent; three attempts with back-off. Raw downloads are never edited.

Usage: python download.py --out ~/islam-museum-harvest/raw/assabile/omar-abdelkafy --manifest manifest.tsv
"""
import argparse, csv, hashlib, sys, time, urllib.request
from pathlib import Path

USER_AGENT = "islam-museum-harvest/0.1 (https://islam.museum; ahamdy@gmail.com)"
PAUSE_SECONDS = 2


def fetch(url: str, dest: Path) -> int:
    for attempt in range(1, 4):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
            tmp = dest.with_suffix(dest.suffix + ".part")
            with urllib.request.urlopen(req, timeout=600) as r, tmp.open("wb") as f:
                size = 0
                for block in iter(lambda: r.read(1 << 20), b""):
                    f.write(block)
                    size += len(block)
            tmp.rename(dest)
            return size
        except Exception as exc:  # network errors: back off, then retry
            print(f"  attempt {attempt} failed: {exc}", file=sys.stderr)
            time.sleep(10 * attempt)
    raise RuntimeError(f"giving up on {url}")


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--out", required=True, type=Path)
    ap.add_argument("--manifest", required=True, type=Path)
    args = ap.parse_args()
    with args.manifest.open(encoding="utf-8") as f:
        rows = list(csv.DictReader(f, delimiter="\t"))
    for row in rows:
        series_dir = args.out / row["series_slug"]
        series_dir.mkdir(parents=True, exist_ok=True)
        ext = Path(row["url"].split("?")[0]).suffix or ".mp3"
        dest = series_dir / f"ep{int(row['episode']):02d}{ext}"
        if dest.exists() and dest.stat().st_size > 0:
            print(f"skip {dest.name}: present")
            continue
        size = fetch(row["url"], dest)
        digest = hashlib.sha256(dest.read_bytes()).hexdigest()
        with (series_dir / "SHA256SUMS").open("a", encoding="utf-8") as f:
            f.write(f"{digest}  {dest.name}\n")
        print(f"ok {series_dir.name}/{dest.name} {size} bytes  {row['duration']}")
        time.sleep(PAUSE_SECONDS)
    return 0


if __name__ == "__main__":
    sys.exit(main())
