#!/usr/bin/env python3
"""Discover the episodes and media links of a speaker's series on the archive, politely, and write manifests.

For each series slug: fetch the series page, collect the episode numbers and the media URLs (mp3, mp4 or m4a) that the
page itself lists, and write one manifest TSV per series in the layout download.py reads:
series_slug, episode, title, duration, url. Two-second pause between requests; identified User-Agent; robots.txt is
read first and any path it disallows is not fetched. Reads the public pages only; no media is downloaded here.

Usage: python discover_series.py --speaker omar-abdelkafy --series ajaeb-al-kulub alwaad-alhaq ... --out DIR
"""
import argparse, re, sys, time, urllib.request, urllib.robotparser
from pathlib import Path

USER_AGENT = "islam-museum-harvest/0.1 (https://islam.museum; ahamdy@gmail.com)"
BASE = "https://www.assabile.com"
MEDIA = re.compile(r'https://media\.assabile\.com[^"\s<>\\]+\.(?:mp3|mp4|m4a)')


def fetch(url: str) -> str:
    req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    with urllib.request.urlopen(req, timeout=60) as r:
        return r.read().decode("utf-8", "replace").replace("&quot;", '"').replace("\\/", "/")


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--speaker", required=True)
    ap.add_argument("--series", nargs="+", required=True)
    ap.add_argument("--out", required=True, type=Path)
    args = ap.parse_args()
    # fetch robots.txt with our own User-Agent: the default urllib agent is refused, and a refused robots.txt
    # would otherwise read as "disallow everything"
    rp = urllib.robotparser.RobotFileParser()
    rp.parse(fetch(f"{BASE}/robots.txt").splitlines())
    args.out.mkdir(parents=True, exist_ok=True)
    for slug in args.series:
        page = f"{BASE}/{args.speaker}/lessons/{slug}"
        if not rp.can_fetch(USER_AGENT, page):
            print(f"skip {slug}: robots.txt disallows it", flush=True)
            continue
        html = fetch(page)
        time.sleep(2)
        urls = list(dict.fromkeys(MEDIA.findall(html)))
        # episode numbers the page links to (episode-01 ...); media URLs are listed in the same order
        eps = sorted({int(n) for n in re.findall(rf'/{re.escape(args.speaker)}/lessons/{re.escape(slug)}/episode-(\d+)', html)})
        if not urls:
            # video series: the series page lists no media; each episode page carries its own file (mp4)
            for ep in eps:
                ep_html = fetch(f"{BASE}/{args.speaker}/lessons/{slug}/episode-{ep:02d}")
                time.sleep(2)
                found = MEDIA.findall(ep_html)
                urls.append(found[0] if found else "")
        manifest = args.out / f"{slug}.manifest.tsv"
        with manifest.open("w", encoding="utf-8") as f:
            f.write("series_slug\tepisode\ttitle\tduration\turl\n")
            for i, u in enumerate(urls, 1):
                if u:
                    f.write(f"{slug}\t{i}\tEpisode {i:02d}\t\t{u}\n")
        urls = [u for u in urls if u]
        ext = Path(urls[0]).suffix if urls else "-"
        print(f"{slug}: {len(urls)} media links, {len(eps)} episode pages, format {ext}, manifest {manifest.name}", flush=True)
    return 0


if __name__ == "__main__":
    sys.exit(main())
