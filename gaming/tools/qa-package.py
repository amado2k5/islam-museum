#!/usr/bin/env python3
"""Makes an offline copy of a games release for an outside tester: the release exactly as built, the media it
fetches, a launcher that needs only Python, a guide, a check script, and checksums of everything.

Two steps, because between them the folder is opened in a browser and checked:

    python3 tools/qa-package.py assemble --release <release folder> --dir <package folder> [--build-run <id>] [--host https://uat-games.islam.museum]
    python3 tools/qa-package.py seal --dir <package folder> --verified <qa-check report.json> --out <package.zip>

`assemble` refuses a release that is not what its own manifest records, music or models that are not what theirs
record, a host that is serving some other release, and anything that looks like a credential. It changes no game file.
`seal` writes the check's result and the checksums, and zips the folder the same way every time.
"""
import argparse
import datetime
import hashlib
import json
import pathlib
import re
import shutil
import sys
import urllib.request
import zipfile

GAMING = pathlib.Path(__file__).resolve().parents[1]
QA = GAMING / "tools" / "qa"
REFERENCE = ["granada-play.ts", "golden-age-play.ts", "atlas-play.ts", "uat-check.ts", "release-smoke.ts"]
SECURITY = ["content-security-policy", "permissions-policy", "referrer-policy", "x-content-type-options", "x-robots-tag"]
SECRETS = [
    re.compile(rb"AKIA[0-9A-Z]{16}"),
    re.compile(rb"-----BEGIN [A-Z ]*PRIVATE KEY-----"),
    re.compile(rb"gh[pousr]_[A-Za-z0-9]{30,}"),
    re.compile(rb"xox[baprs]-[A-Za-z0-9-]{20,}"),
    re.compile(rb"(?i)(api[_-]?key|secret[_-]?access[_-]?key|api[_-]?token|password)\s*[:=]\s*['\"][A-Za-z0-9/+_=-]{20,}['\"]"),
]


def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def fail(message):
    sys.exit(f"qa-package: {message}")


def copy_checked(source, target, bytes_, sha256, what):
    if not source.is_file():
        fail(f"{what}: {source} is not on this machine")
    if source.stat().st_size != bytes_ or sha(source) != sha256:
        fail(f"{what}: {source.name} is not the file its manifest records")
    target.parent.mkdir(parents=True, exist_ok=True)
    shutil.copyfile(source, target)


def assemble(args):
    release = pathlib.Path(args.release).resolve()
    out = pathlib.Path(args.dir).resolve()
    if out.exists() and any(out.iterdir()):
        fail(f"{out} is not empty")
    manifest = json.loads((release / "release.json").read_text())
    if manifest.get("dirty"):
        fail("the release was built from uncommitted changes")
    site = out / "site"
    # 1. The release, file for file as its own manifest records it.
    for f in manifest["files"]:
        copy_checked(release / f["path"], site / f["path"], f["bytes"], f["sha256"], "release")
    shutil.copyfile(release / "release.json", site / "release.json")
    extra = sorted(str(p.relative_to(release)) for p in release.rglob("*") if p.is_file() and str(p.relative_to(release)) not in {f["path"] for f in manifest["files"]} | {"release.json"})
    if extra:
        fail(f"the release folder holds files its manifest does not name: {extra[:5]}")
    # 2. The media the release asks for beside itself: the music and the models, each against its own manifest.
    music = json.loads((GAMING / "packages" / "audio" / "music.json").read_text())
    if manifest.get("musicBase") == "../media/music/":
        for t in music["tracks"]:
            copy_checked(GAMING / "media" / "music" / t["file"], site / "media" / "music" / t["file"], t["bytes"], t["sha256"], "music")
    art = json.loads((GAMING / "art" / "manifest.json").read_text())
    if manifest.get("modelsBase") == "../media/models/":
        seen = set()
        for asset in art["assets"]:
            for f in asset["files"]:
                if f["path"] in seen:
                    continue
                seen.add(f["path"])
                copy_checked(GAMING / "media" / "models" / f["path"], site / "media" / "models" / f["path"], f["bytes"], f["sha256"], "models")
    # 3. What the host itself sends, so that the launcher can send the same.
    release_id = None
    host = {"recordedFrom": args.host, "security": {}, "channel": {}}
    if args.host:
        with urllib.request.urlopen(urllib.request.Request(f"{args.host}/_channel", headers={"User-Agent": "im-games-qa-package"}), timeout=30) as r:
            host["channel"] = json.loads(r.read())
        if host["channel"].get("commit") != manifest["commit"]:
            fail(f"{args.host} is serving {host['channel'].get('current')}, not the release being packaged ({manifest['commit'][:11]})")
        release_id = host["channel"]["current"]
        with urllib.request.urlopen(urllib.request.Request(f"{args.host}/granada/", headers={"User-Agent": "im-games-qa-package"}), timeout=30) as r:
            for name in SECURITY:
                if r.headers.get(name):
                    host["security"]["-".join(w.capitalize() for w in name.split("-"))] = r.headers[name]
        with urllib.request.urlopen(urllib.request.Request(f"{args.host}/release.json", headers={"User-Agent": "im-games-qa-package"}), timeout=30) as r:
            if hashlib.sha256(r.read()).hexdigest() != sha(release / "release.json"):
                fail("the host's release.json is not this release's")
    if not host["security"].get("Content-Security-Policy"):
        fail("no content security policy was recorded: give --host")
    (out / "host-headers.json").write_text(json.dumps(host, indent=1) + "\n")
    # 4. The launcher, the guide, the checks.
    shutil.copyfile(QA / "serve.py", out / "serve.py")
    shutil.copyfile(QA / "EXPECTED.md", out / "EXPECTED.md")
    (out / "tests" / "reference").mkdir(parents=True)
    shutil.copyfile(QA / "qa-check.mjs", out / "tests" / "qa-check.mjs")
    for name in REFERENCE:
        shutil.copyfile(GAMING / "tools" / name, out / "tests" / "reference" / name)
    files = [p for p in out.rglob("*") if p.is_file()]
    made = datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%d %H:%M UTC")
    readme = (QA / "README.md.tmpl").read_text()
    for key, value in {"RELEASE": release_id or manifest["commit"][:11], "COMMIT": manifest["commit"], "COMMIT_DATE": manifest.get("commitDate", "?"), "BUILD_RUN": args.build_run or "not given", "MADE": made, "FILES": f"{len(files) + 4:,}", "BYTES": f"{sum(p.stat().st_size for p in files):,}"}.items():
        readme = readme.replace(f"@{key}@", str(value))
    (out / "README.md").write_text(readme)
    (out / "MANIFEST.json").write_text(json.dumps({
        "format": "im.play.qa-package", "version": 1, "release": release_id, "commit": manifest["commit"], "commitDate": manifest.get("commitDate"),
        "buildRun": args.build_run, "host": args.host, "made": made,
        "games": [g["id"] for g in manifest.get("games", [])],
        "sources": {"release.json": sha(release / "release.json"), "packages/audio/music.json": sha(GAMING / "packages" / "audio" / "music.json"), "art/manifest.json": sha(GAMING / "art" / "manifest.json")},
        "music": manifest.get("musicBase"), "models": manifest.get("modelsBase"),
        "changedForThisPackage": "nothing in site/; serve.py, the guide and tests/ are added beside it",
    }, indent=1) + "\n")
    # 5. Nothing that looks like a credential leaves this machine.
    for p in out.rglob("*"):
        if p.is_file() and p.suffix not in {".m4a", ".jpg", ".bin", ".png", ".webp"}:
            data = p.read_bytes()
            for pattern in SECRETS:
                if pattern.search(data):
                    fail(f"{p.relative_to(out)} holds something that looks like a credential ({pattern.pattern[:30]!r}); nothing is packaged")
    print(f"assembled {out}: release {release_id}, {len(list(out.rglob('*')))} entries")


def seal(args):
    out = pathlib.Path(args.dir).resolve()
    verified = json.loads(pathlib.Path(args.verified).read_text())
    if verified.get("problems") or verified.get("asked_elsewhere"):
        fail("the check found problems: the package is not sealed")
    (out / "VERIFIED.json").write_text(json.dumps(verified, indent=1, ensure_ascii=False) + "\n")
    files = sorted(p for p in out.rglob("*") if p.is_file() and p.name != "SHA256SUMS")
    (out / "SHA256SUMS").write_text("".join(f"{sha(p)}  {p.relative_to(out).as_posix()}\n" for p in files))
    target = pathlib.Path(args.out).resolve()
    target.parent.mkdir(parents=True, exist_ok=True)
    top = target.stem
    with zipfile.ZipFile(target, "w", zipfile.ZIP_DEFLATED, compresslevel=9) as z:
        for p in sorted(q for q in out.rglob("*") if q.is_file()):
            info = zipfile.ZipInfo(f"{top}/{p.relative_to(out).as_posix()}", date_time=(2026, 1, 1, 0, 0, 0))
            info.external_attr = (0o755 if p.name == "serve.py" else 0o644) << 16
            info.compress_type = zipfile.ZIP_STORED if p.suffix in {".m4a", ".jpg"} else zipfile.ZIP_DEFLATED
            z.writestr(info, p.read_bytes())
    print(f"{target}: {target.stat().st_size:,} bytes, {len(files) + 1} files, SHA-256 {sha(target)}")


parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
sub = parser.add_subparsers(dest="step", required=True)
a = sub.add_parser("assemble")
a.add_argument("--release", required=True)
a.add_argument("--dir", required=True)
a.add_argument("--build-run")
a.add_argument("--host")
s = sub.add_parser("seal")
s.add_argument("--dir", required=True)
s.add_argument("--verified", required=True)
s.add_argument("--out", required=True)
parsed = parser.parse_args()
(assemble if parsed.step == "assemble" else seal)(parsed)
