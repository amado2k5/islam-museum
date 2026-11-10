#!/usr/bin/env python3
"""Compare two builds of the site and show what a deploy of the second one would upload.

    python3 tools/deploy/compare-builds.py OLD NEW [--list N] [--out changed.txt]

OLD and NEW are `dist` folders or the `dist` artifacts of two "Build islam.museum" runs (zip files, as
downloaded from the Actions page). Files are compared by content (the CRC-32 and size in a zip's central
directory, the SHA-256 of a folder's files), grouped like the deploy's churn report, so the result matches the
"R2 publish churn" table in the deploy summary. Nothing is extracted or written, except the optional --out list.

Why it exists: a deploy sends only files whose bytes changed, and a few files baked into every page (a stylesheet,
a layout, the footer) can make that all of them. This shows which files changed, so the cause can be named.
See docs/engineering/16-deploy-churn-proposal.md.
"""
import argparse
import collections
import hashlib
import os
import random
import sys
import zipfile


def index_zip(path):
    return {i.filename: (i.CRC, i.file_size) for i in zipfile.ZipFile(path).infolist() if not i.filename.endswith("/")}


def index_dir(root):
    out = {}
    for dirpath, _dirs, files in os.walk(root):
        for name in files:
            full = os.path.join(dirpath, name)
            digest = hashlib.sha256()
            with open(full, "rb") as handle:
                for chunk in iter(lambda: handle.read(1 << 20), b""):
                    digest.update(chunk)
            out[os.path.relpath(full, root).replace(os.sep, "/")] = (digest.hexdigest(), os.path.getsize(full))
    return out


def index(path):
    if os.path.isdir(path):
        return index_dir(path)
    if zipfile.is_zipfile(path):
        return index_zip(path)
    sys.exit(f"{path}: not a folder or a zip file")


def group(key):
    """The same groups as churnGroup() in workers/r2-sync/batch/publish.mjs."""
    parts = key.split("/")
    if len(parts) == 1:
        return "(root)"
    if parts[0] in ("ar", "en", "ur"):
        return f"{parts[0]} pages" if key.endswith("/index.html") and len(parts) > 2 else f"{parts[0]} other"
    if parts[0].startswith("pagefind-"):
        return f"{parts[0]}/{parts[1]}" if len(parts) > 2 else f"{parts[0]}/top"
    return parts[0]


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("old")
    ap.add_argument("new")
    ap.add_argument("--list", type=int, default=25, help="how many changed file names to print (default 25)")
    ap.add_argument("--out", help="write every changed, added and deleted key to this file")
    args = ap.parse_args()

    a, b = index(args.old), index(args.new)
    changed = sorted(k for k in b if k in a and a[k] != b[k])
    added = sorted(k for k in b if k not in a)
    deleted = sorted(k for k in a if k not in b)
    rows = collections.defaultdict(lambda: [0, 0, 0, 0])  # files in new, changed, added, deleted
    for k in b:
        rows[group(k)][0] += 1
    for lst, col in ((changed, 1), (added, 2), (deleted, 3)):
        for k in lst:
            rows[group(k)][col] += 1

    copies = len(changed) + len(added)
    print(f"{len(a)} files -> {len(b)} files: {copies} to copy ({len(changed)} changed, {len(added)} new), {len(deleted)} to delete")
    print(f"{'group':28} {'files':>8} {'changed':>8} {'new':>7} {'deleted':>8}")
    for name, r in sorted(rows.items(), key=lambda x: (-(x[1][1] + x[1][2]), x[0])):
        if r[1] or r[2] or r[3]:
            print(f"{name:28} {r[0]:8} {r[1]:8} {r[2]:7} {r[3]:8}")
    pages = [k for k in b if group(k).endswith(" pages")]
    moved = [k for k in changed + added if group(k).endswith(" pages")]
    if pages:
        print(f"HTML pages to upload: {len(moved)} of {len(pages)} ({100 * len(moved) / len(pages):.1f} %)")
    if changed and args.list:
        random.seed(1)
        print(f"-- {min(args.list, len(changed))} of {len(changed)} changed files (sample)")
        for k in random.sample(changed, min(args.list, len(changed))):
            print("  ", k)
    if args.out:
        with open(args.out, "w", encoding="utf-8") as handle:
            handle.write("\n".join(changed + added + deleted))


if __name__ == "__main__":
    main()
