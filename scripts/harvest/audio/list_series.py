#!/usr/bin/env python3
"""List the lesson series of one or more speakers on the archive, politely.

Fetches https://www.assabile.com/<speaker> (the speaker page lists every series as /<speaker>/lessons/<slug>) and
prints one line per series: speaker<TAB>series_slug. robots.txt is read first; two-second pause between pages;
identified User-Agent. Reads public pages only. The output feeds harvest_speakers.sh and discover_series.py.

Usage: python list_series.py mustafa-hosny abu-ishaq-alheweny ... > series.tsv
"""
import re, sys, time, urllib.request, urllib.robotparser

USER_AGENT = "islam-museum-harvest/0.1 (https://islam.museum; ahamdy@gmail.com)"
BASE = "https://www.assabile.com"


def fetch(url: str) -> str:
    req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    with urllib.request.urlopen(req, timeout=60) as r:
        return r.read().decode("utf-8", "replace")


def main() -> int:
    speakers = sys.argv[1:]
    if not speakers:
        print(__doc__, file=sys.stderr)
        return 2
    rp = urllib.robotparser.RobotFileParser()
    rp.parse(fetch(f"{BASE}/robots.txt").splitlines())
    for speaker in speakers:
        page = f"{BASE}/{speaker}"
        if not rp.can_fetch(USER_AGENT, page):
            print(f"skip {speaker}: robots.txt disallows it", file=sys.stderr)
            continue
        html = fetch(page)
        time.sleep(2)
        slugs = list(dict.fromkeys(re.findall(rf'href="/{re.escape(speaker)}/lessons/([a-z0-9-]+)"', html)))
        for slug in slugs:
            print(f"{speaker}\t{slug}", flush=True)
        print(f"{speaker}: {len(slugs)} series", file=sys.stderr)
    return 0


if __name__ == "__main__":
    sys.exit(main())
