#!/usr/bin/env python3
"""Collect Wikipedia lead titles with the exact current revisions, without article text.

The script maps the English seed pages/categories through Wikipedia langlinks, then
stores a namespaced JSONL inventory outside Git. It does not update shared harvest
databases, decide inclusion, or treat Wikipedia as support for invention claims.
"""
import argparse
import json
import os
import sys
import time
from datetime import datetime, timezone
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.parse import urlencode
from urllib.request import Request, urlopen

import yaml

LANGUAGES = ("en", "ar", "fa", "tr", "ur", "fr", "de", "id", "ms", "bn")
HARVEST = Path(os.environ.get("HARVEST", Path.home() / "islam-museum-harvest"))
SEEDS = Path(__file__).with_name("seed-pages.yaml")
USER_AGENT = "islam.museum invention research (https://github.com/amado2k5/islam-museum)"
TRANSIENT_HTTP = {429, 500, 502, 503, 504}


def api_get(lang, params, delay):
    query = {
        "action": "query",
        "format": "json",
        "formatversion": "2",
        "maxlag": "5",
        **params,
    }
    request = Request(
        f"https://{lang}.wikipedia.org/w/api.php?{urlencode(query)}",
        headers={"User-Agent": USER_AGENT},
    )
    for attempt in range(5):
        try:
            with urlopen(request, timeout=60) as response:
                data = json.load(response)
            error = data.get("error")
            if error and error.get("code") == "maxlag":
                wait = delay * (attempt + 2)
                print(
                    f"{lang}: API maxlag; retrying after {wait:.1f}s",
                    file=sys.stderr,
                    flush=True,
                )
                time.sleep(wait)
                continue
            if error:
                raise RuntimeError(f"{lang} Wikipedia API: {error}")
            time.sleep(delay)
            return data
        except HTTPError as error:
            if error.code not in TRANSIENT_HTTP or attempt == 4:
                raise
            retry_after = error.headers.get("Retry-After")
            try:
                wait = float(retry_after) if retry_after else delay * (attempt + 2)
            except ValueError:
                wait = delay * (attempt + 2)
            print(
                f"{lang}: HTTP {error.code}; retrying after {wait:.1f}s "
                f"(attempt {attempt + 1}/5)",
                file=sys.stderr,
                flush=True,
            )
            time.sleep(wait)
        except URLError:
            if attempt == 4:
                raise
            wait = delay * (attempt + 2)
            print(
                f"{lang}: network error; retrying after {wait:.1f}s "
                f"(attempt {attempt + 1}/5)",
                file=sys.stderr,
                flush=True,
            )
            time.sleep(wait)
    raise RuntimeError(f"{lang} Wikipedia API remained unavailable after retries")


def query_all(lang, params, delay):
    continuation = {}
    while True:
        data = api_get(lang, {**params, **continuation}, delay)
        yield data
        continuation = data.get("continue")
        if not continuation:
            break


def page_revision(page):
    revisions = page.get("revisions", [])
    if not revisions:
        return None
    revision = revisions[0]
    return {
        "page_id": page.get("pageid"),
        "title": page["title"],
        "revision_id": revision["revid"],
        "revision_timestamp": revision["timestamp"],
    }


def revision_url(lang, revision_id):
    return f"https://{lang}.wikipedia.org/w/index.php?oldid={revision_id}"


def localized_seed(lang, title, delay):
    if lang == "en":
        return title
    data = api_get(
        "en",
        {
            "prop": "langlinks",
            "lllang": lang,
            "lllimit": "1",
            "titles": title,
        },
        delay,
    )
    pages = data.get("query", {}).get("pages", [])
    if not pages or pages[0].get("missing"):
        return None
    links = pages[0].get("langlinks", [])
    return links[0]["title"] if links else None


def seed_revision(lang, title, delay):
    data = api_get(
        lang,
        {
            "prop": "revisions",
            "rvprop": "ids|timestamp",
            "rvlimit": "1",
            "titles": title,
        },
        delay,
    )
    pages = data.get("query", {}).get("pages", [])
    return page_revision(pages[0]) if pages and not pages[0].get("missing") else None


def page_links(lang, title, delay):
    links = set()
    revision = None
    for data in query_all(
        lang,
        {
            "prop": "links|revisions",
            "plnamespace": "0",
            "pllimit": "max",
            "rvprop": "ids|timestamp",
            "rvlimit": "1",
            "titles": title,
        },
        delay,
    ):
        pages = data.get("query", {}).get("pages", [])
        if not pages or pages[0].get("missing"):
            return None, set()
        page = pages[0]
        revision = revision or page_revision(page)
        links.update(item["title"] for item in page.get("links", []))
    return revision, links


def category_members(lang, title, delay):
    for data in query_all(
        lang,
        {
            "list": "categorymembers",
            "cmtitle": title,
            "cmtype": "page|subcat",
            "cmnamespace": "0|14",
            "cmlimit": "max",
        },
        delay,
    ):
        yield from data.get("query", {}).get("categorymembers", [])


def category_depth(
    lang, title, root, depth, stop_categories, seen, max_depth, limit, delay
):
    key = (root, title)
    if key in seen or title in stop_categories or depth > max_depth:
        return [], []
    seen.add(key)
    pages, subcats = [], []
    for member in category_members(lang, title, delay):
        if member.get("ns") == 0:
            pages.append((member["title"], member["pageid"], root, title, depth))
            if len(pages) >= limit:
                break
        elif member.get("ns") == 14 and depth < max_depth:
            subcats.append((member["title"], root, depth + 1))
    return pages, subcats


def fetch_revisions(lang, titles, delay):
    by_title = {}
    for start in range(0, len(titles), 50):
        chunk = titles[start : start + 50]
        data = api_get(
            lang,
            {
                "prop": "revisions",
                "rvprop": "ids|timestamp",
                "rvlimit": "1",
                "redirects": "1",
                "titles": "|".join(chunk),
            },
            delay,
        )
        redirects = {
            entry["from"]: entry["to"]
            for entry in data.get("query", {}).get("redirects", [])
        }
        for page in data.get("query", {}).get("pages", []):
            revision = page_revision(page) if not page.get("missing") else None
            if revision:
                by_title[page["title"]] = revision
                for alias, target in redirects.items():
                    if target == page["title"]:
                        by_title[alias] = revision
    return by_title


def add_source(candidate, source):
    candidate["lead_sources"].append(source)


def run_language(lang, config, args):
    candidates = {}
    missing_seeds = []
    seed_pages = []
    seed_categories = []

    for seed_index, english_title in enumerate(config["pages"], start=1):
        print(
            f"{lang}: reading seed page {seed_index}/{len(config['pages'])}: "
            f"{english_title}",
            file=sys.stderr,
            flush=True,
        )
        title = localized_seed(lang, english_title, args.delay)
        if not title:
            missing_seeds.append(f"page: {english_title}")
            continue
        revision, links = page_links(lang, title, args.delay)
        if not revision:
            missing_seeds.append(f"page unavailable: {title}")
            continue
        seed_pages.append(revision)
        source = {
            "kind": "list-page",
            "title": revision["title"],
            "revision_id": revision["revision_id"],
            "url": revision_url(lang, revision["revision_id"]),
        }
        for linked_title in links:
            candidate = candidates.setdefault(
                linked_title, {"title": linked_title, "lead_sources": []}
            )
            add_source(candidate, source)

    for seed_index, english_title in enumerate(config["categories"], start=1):
        print(
            f"{lang}: reading seed category {seed_index}/{len(config['categories'])}: "
            f"{english_title}",
            file=sys.stderr,
            flush=True,
        )
        title = localized_seed(lang, english_title, args.delay)
        if not title:
            missing_seeds.append(f"category: {english_title}")
            continue
        revision = seed_revision(lang, title, args.delay)
        if not revision:
            missing_seeds.append(f"category unavailable: {title}")
            continue
        seed_categories.append((title, revision, title, 0))

    stop_categories = set()
    for english_title in config.get("stop_categories", []):
        title = localized_seed(lang, english_title, args.delay)
        if title:
            stop_categories.add(title)

    seen_categories = set()
    frontier = seed_categories
    while frontier:
        next_frontier = []
        for title, root_revision, root, depth in frontier:
            remaining = args.max_candidates - len(candidates)
            if remaining <= 0:
                break
            pages, subcats = category_depth(
                lang,
                title,
                root,
                depth,
                stop_categories,
                seen_categories,
                args.max_depth,
                remaining,
                args.delay,
            )
            source = {
                "kind": "category",
                "title": root_revision["title"],
                "revision_id": root_revision["revision_id"],
                "url": revision_url(lang, root_revision["revision_id"]),
                "depth": depth,
            }
            for page_title, page_id, _, category, _ in pages:
                candidate = candidates.setdefault(
                    page_title, {"title": page_title, "lead_sources": []}
                )
                candidate["page_id"] = page_id
                add_source(candidate, {**source, "category": category})
            next_frontier.extend(
                (child, root_revision, root, child_depth)
                for child, root, child_depth in subcats
            )
            if len(candidates) >= args.max_candidates:
                break
        if len(candidates) >= args.max_candidates:
            break
        frontier = next_frontier

    titles = sorted(candidates)
    if len(titles) > args.max_candidates:
        titles = titles[: args.max_candidates]
    revisions = fetch_revisions(lang, titles, args.delay)
    run_time = datetime.now(timezone.utc)
    output = args.output or (
        HARVEST
        / "inventions"
        / "wikipedia"
        / run_time.strftime("%Y%m%d")
        / f"{run_time.strftime('%H%M%S')}-{lang}-leads.jsonl"
    )
    output.parent.mkdir(parents=True, exist_ok=True)
    if output.exists():
        raise FileExistsError(f"refusing to overwrite existing harvest output: {output}")

    written = missing_revisions = 0
    with output.open("x", encoding="utf-8") as handle:
        for title in titles:
            candidate = candidates[title]
            revision = revisions.get(title)
            if not revision:
                missing_revisions += 1
                print(f"{lang}: no current revision for candidate page: {title}", file=sys.stderr)
                continue
            row = {
                "language": lang,
                **revision,
                "revision_url": revision_url(lang, revision["revision_id"]),
                "lead_sources": sorted(
                    candidate["lead_sources"],
                    key=lambda item: (item["kind"], item["title"], item["revision_id"]),
                ),
            }
            handle.write(json.dumps(row, ensure_ascii=False, sort_keys=True) + "\n")
            written += 1

    print(
        f"{lang}: {written} leads; {len(seed_pages)} list pages, "
        f"{len(seed_categories)} category seeds; {missing_revisions} pages without revisions; "
        f"output={output}"
    )
    for missing in missing_seeds:
        print(f"{lang}: seed not mapped or unavailable: {missing}", file=sys.stderr)
    return written


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--lang", choices=(*LANGUAGES, "all"), required=True)
    parser.add_argument("--seeds", type=Path, default=SEEDS)
    parser.add_argument("--max-depth", type=int, default=2)
    parser.add_argument("--max-candidates", type=int, default=5000)
    parser.add_argument(
        "--delay",
        type=float,
        default=1.0,
        help="seconds between API requests (default: 1.0; server Retry-After is always honored)",
    )
    parser.add_argument("--output", type=Path)
    args = parser.parse_args()
    if args.max_depth < 0 or args.max_candidates < 1 or args.delay < 0:
        parser.error("--max-depth and --delay must be non-negative; --max-candidates must be positive")
    if args.lang == "all" and args.output:
        parser.error("--output is available only when --lang names one language")
    config = yaml.safe_load(args.seeds.read_text(encoding="utf-8"))
    if config.get("version") != 1 or not config.get("pages") or not config.get("categories"):
        parser.error(f"{args.seeds} must define version 1, pages, and categories")
    if args.lang == "all":
        for lang in LANGUAGES:
            run_language(lang, config, args)
    else:
        run_language(args.lang, config, args)


if __name__ == "__main__":
    main()
