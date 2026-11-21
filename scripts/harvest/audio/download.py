#!/usr/bin/env python3
"""Download lecture audio listed in a TSV manifest, politely and resumably.

Manifest (tab-separated, one header line):  series_slug<TAB>episode<TAB>title<TAB>duration<TAB>url
Files land in <out>/<series_slug>/epNN.mp3 (the extension follows the URL). Existing non-empty files are
skipped. Each new file's sha256 is appended to <out>/<series_slug>/SHA256SUMS. Two-second pause between
requests; identified User-Agent; three attempts with back-off. Raw downloads are never edited.

Usage: python download.py --out ~/islam-museum-harvest/raw/assabile/omar-abdelkafy --manifest manifest.tsv
"""
import argparse, csv, hashlib, os, re, shutil, subprocess, sys, time, urllib.request
from pathlib import Path

USER_AGENT = "islam-museum-harvest/0.1 (https://islam.museum" + (f"; {os.environ['HARVEST_CONTACT']}" if os.environ.get("HARVEST_CONTACT") else "") + ")"  # contact comes from HARVEST_CONTACT, never stored in the repo
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


YTDLP = shutil.which("yt-dlp") or "/opt/homebrew/Caskroom/miniconda/base/bin/yt-dlp"
REFUSED = re.compile(r"429|Too Many Requests|confirm you.re not a bot|Sign in to confirm", re.I)


def youtube_audio(video_id: str, dest: Path) -> None:
    """Audio stream only (never video), converted to mono 16 kHz 48 kbit/s MP3. ONLY for the channel @muftimenkofficial
    under the founder ruling of 21 Nov 2026 (docs/sources-policy.md). PermissionError if YouTube refuses: stop, never work around."""
    cmd = [YTDLP, "--no-update", "--no-playlist", "-f", "bestaudio/best", "-x", "--audio-format", "mp3",
           "--postprocessor-args", "ffmpeg:-ac 1 -ar 16000 -b:a 48k", "-o", str(dest.with_suffix(".%(ext)s")),
           f"https://www.youtube.com/watch?v={video_id}"]
    p = subprocess.run(cmd, capture_output=True, text=True)
    if p.returncode != 0:
        msg = (p.stderr.strip().splitlines() or ["no output"])[-1]
        if REFUSED.search(p.stderr):
            raise PermissionError(msg)
        raise RuntimeError(msg)


def main_youtube(args) -> int:
    """Manifest: tab-separated with a header; the first column `id` is the 11-character video id. Files: <out>/<id>.mp3."""
    with args.manifest.open(encoding="utf-8") as f:
        rows = list(csv.DictReader(f, delimiter="\t"))
    args.out.mkdir(parents=True, exist_ok=True)
    for row in rows:
        vid = row["id"]
        dest = args.out / f"{vid}.mp3"
        if dest.exists() and dest.stat().st_size > 0:
            print(f"skip {vid}: present")
            continue
        try:
            youtube_audio(vid, dest)
        except PermissionError as exc:
            print(f"YouTube is refusing requests ({exc}); stopping, not working around it.", file=sys.stderr)
            return 3
        except RuntimeError as exc:
            print(f"{vid}: failed: {exc}", file=sys.stderr)
            continue
        digest = hashlib.sha256(dest.read_bytes()).hexdigest()
        with (args.out / "SHA256SUMS").open("a", encoding="utf-8") as f:
            f.write(f"{digest}  {dest.name}\n")
        print(f"ok {vid} {dest.stat().st_size} bytes")
        time.sleep(args.pause)
    return 0


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--out", required=True, type=Path)
    ap.add_argument("--manifest", required=True, type=Path)
    ap.add_argument("--youtube", action="store_true", help="yt-dlp audio mode, channel @muftimenkofficial only (founder ruling 21 Nov 2026)")
    ap.add_argument("--pause", type=float, default=PAUSE_SECONDS)
    args = ap.parse_args()
    if args.youtube:
        return main_youtube(args)
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
