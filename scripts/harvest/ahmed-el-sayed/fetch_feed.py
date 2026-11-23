#!/usr/bin/env python3
"""Fetch every page of Ahmed El-Sayed's public SoundCloud podcast feed into a local folder (metadata only, no audio).

The feed is paginated: each page carries <atom:link rel="next"> to the next 500 items. This follows the chain with a
polite pause and an identified User-Agent, and writes page-1.xml, page-2.xml ... into the folder given as argument.
Standard library only. Nothing here downloads audio; the feed's owner contact address is never read or stored.
"""
import re, sys, time, urllib.request
from pathlib import Path

FEED = "https://feeds.soundcloud.com/users/soundcloud:users:72673970/sounds.rss"
UA = "islam.museum-harvest/1.0 (+https://islam.museum; podcast metadata inventory)"

def get(url):
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=60) as r:
        return r.read().decode("utf8")

def main(out):
    out = Path(out); out.mkdir(parents=True, exist_ok=True)
    url, n = FEED, 0
    while url:
        n += 1
        xml = get(url)
        (out / f"page-{n}.xml").write_text(xml, encoding="utf8")
        items = xml.count("<item>")
        m = re.search(r'<atom:link href="([^"]+)" rel="next"', xml)
        print(f"page {n}: {items} items", flush=True)
        url = m.group(1).replace("&amp;", "&") if m and items else None
        if url: time.sleep(2)
    print(f"{n} pages")

if __name__ == "__main__":
    main(sys.argv[1] if len(sys.argv) > 1 else "feed-pages")
