#!/usr/bin/env python3
"""Fetch one Ontario course from the Ministry of Education's own curriculum service and archive it.

The Ministry's curriculum site (https://www.dcp.edu.gov.on.ca) is a JavaScript application: its pages hold no curriculum
text. The text is served by the Ministry's public content service, which the site itself loads. This script reads that
service, so the source is the issuing authority's own publication and nothing else.

  python3 scripts/courses/fetch_ontario.py --list [pattern]              # the Ministry's course names, to find yours
  python3 scripts/courses/fetch_ontario.py "SSHG - Grade 4" ontario-sshg-2023-g4
      # <Ministry course name>  <archive slug>

Writes (the raw files stay OUT of git, under .cache/, which is ignored):
  .cache/curricula/<slug>/courses.json     the Ministry's list of courses, as served
  .cache/curricula/<slug>/course.json      the course with its strands and expectations, as served (depth 6)
  .cache/curricula/<slug>/official.json    the extraction every later step reads:
        {"course": ..., "grade": ..., "strands": [{"letter", "title", "overall": [{"code", "title", "text", "specific": [{"code", "text"}]}]}]}
and one small file that IS committed:
  docs/courses/curricula/<slug>.json       the manifest: what was fetched, from which addresses, when, the sha256 of each
                                           raw file, and the count of strands and expectations

Extraction is mechanical: HTML tags removed, entities decoded, runs of whitespace collapsed. No word is added or changed.
"""
import datetime, hashlib, html, json, os, re, subprocess, sys

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
API = "https://ws.api.dcp.edu.gov.on.ca/content/api/items"
Q = "language=en-CA&system.language[eq]=en-CA"


def get(url, dest):
    # curl, not urllib: the system Python on macOS lacks the CA bundle; -g keeps the square brackets literal
    r = subprocess.run(["curl", "-g", "-sL", "-m", "120", "-o", dest, "-w", "%{http_code}", url], capture_output=True, text=True)
    if r.stdout.strip() != "200":
        raise SystemExit(f"FETCH FAILED ({r.stdout.strip()}): {url}\nDo not fill the gap from memory or a third-party copy. Stop and report.")
    return json.load(open(dest, encoding="utf-8"))


def text(s):
    s = re.sub(r"<[^>]+>", "", s or "")
    return re.sub(r"\s+", " ", html.unescape(s).replace(" ", " ")).strip()


def main():
    args = sys.argv[1:]
    if not args:
        raise SystemExit(__doc__)
    if args[0] == "--list":
        tmp = os.path.join(ROOT, ".cache", "curricula", "_list")
        os.makedirs(tmp, exist_ok=True)
        d = get(f"{API}?system.type=l2___course&{Q}&depth=0", os.path.join(tmp, "courses.json"))
        pat = args[1].lower() if len(args) > 1 else ""
        for n in sorted(it["system"]["name"] for it in d["items"]):
            if pat in n.lower():
                print(n)
        return
    name, slug = args[0], args[1]
    out = os.path.join(ROOT, ".cache", "curricula", slug)
    os.makedirs(out, exist_ok=True)
    list_url = f"{API}?system.type=l2___course&{Q}&depth=0"
    courses = get(list_url, os.path.join(out, "courses.json"))
    hit = [it for it in courses["items"] if it["system"]["name"] == name]
    if len(hit) != 1:
        raise SystemExit(f"no single Ministry course named exactly {name!r}; run --list to see the names")
    cid = hit[0]["system"]["id"]
    course_url = f"{API}?system.id={cid}&{Q}&depth=6"
    raw = get(course_url, os.path.join(out, "course.json"))
    mc, course = raw["modular_content"], raw["items"][0]
    el = lambda cn, k: mc[cn]["elements"].get(k, {}).get("value")
    strands = []
    for sec in course["elements"]["sections"]["value"]:
        for scn in (el(sec, "sections") or []):
            if mc.get(scn, {}).get("system", {}).get("type") != "l3___strand":
                continue
            st = {"letter": text(el(scn, "title_index")), "title": text(el(scn, "title")), "overall": []}
            for ocn in el(scn, "overall_expectations") or []:
                ov = {"code": text(el(ocn, "title_index")), "title": text(el(ocn, "title")), "text": text(el(ocn, "content")), "specific": []}
                for pcn in el(ocn, "specific_expectations") or []:
                    ov["specific"].append({"code": text(el(pcn, "title_index")), "text": text(el(pcn, "content"))})
                st["overall"].append(ov)
            strands.append(st)
    grade = [g["name"] for g in course["elements"].get("site___grade", {}).get("value", [])]
    official = {"course": text(course["elements"]["name"]["value"]), "ministry_name": name, "grade": grade, "last_modified": course["system"].get("last_modified"), "strands": strands}
    json.dump(official, open(os.path.join(out, "official.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    sha = lambda f: hashlib.sha256(open(os.path.join(out, f), "rb").read()).hexdigest()
    n_spec = sum(len(o["specific"]) for s in strands for o in s["overall"])
    manifest = {
        "slug": slug, "authority": "Ontario Ministry of Education", "ministry_course_name": name, "course": official["course"], "grade": grade,
        "retrieved_utc": datetime.datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ"),
        "addresses": {"courses.json": list_url, "course.json": course_url},
        "human_page": "https://www.dcp.edu.gov.on.ca/en/curriculum",
        "ministry_last_modified": official["last_modified"],
        "sha256": {f: sha(f) for f in ("courses.json", "course.json", "official.json")},
        "counts": {"strands": len(strands), "overall_expectations": sum(len(s["overall"]) for s in strands), "specific_expectations": n_spec},
        "note": "Raw files are archived under .cache/curricula/<slug>/ and are not committed (docs/sources-policy.md). Re-run this script to fetch them again; official.json's hash changes only if the Ministry's text changes.",
    }
    os.makedirs(os.path.join(ROOT, "docs", "courses", "curricula"), exist_ok=True)
    json.dump(manifest, open(os.path.join(ROOT, "docs", "courses", "curricula", slug + ".json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print(f"fetched {name!r} -> .cache/curricula/{slug}/ ; manifest docs/courses/curricula/{slug}.json")
    for s in strands:
        print(f"  strand {s['letter']}: {s['title']}  ({len(s['overall'])} overall, {sum(len(o['specific']) for o in s['overall'])} specific)")
    if not n_spec:
        raise SystemExit("EXTRACTION FAILED: no specific expectation found. The Ministry may publish this course as a PDF only. Stop and report; do not invent expectations.")


if __name__ == "__main__":
    main()
