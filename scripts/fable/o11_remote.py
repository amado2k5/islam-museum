#!/usr/bin/env python3
"""Statement 11: the work exists on the remote. Every phase's pull request is live on the repository host.

Reads docs/fable-run/phases.json and asks the host (GitHub's API through `gh`), never local git, for each phase:
  - the pull request exists, is open or merged, and its head is the phase's branch;
  - the remote branch exists;
  - the phase's final commit is contained in that remote branch (the host's own compare of commit and branch).

  python3 scripts/fable/o11_remote.py
"""
import json, os, subprocess
from fable import Oracle, ROOT

o = Oracle("11", "every phase's work is on the remote, proven by the host (statement 11)", needs_graph=False)
cfg = json.load(open(os.path.join(ROOT, "docs/fable-run/phases.json")))
repo = cfg["repo"]


def api(path):
    r = subprocess.run(["gh", "api", f"repos/{repo}/{path}"], capture_output=True, text=True)
    return json.loads(r.stdout) if r.returncode == 0 and r.stdout.strip() else None


o.note(f"host: github.com/{repo} (queried with `gh api`)")
for ph in cfg["phases"]:
    pr = api(f"pulls/{ph['pr']}")
    br = api(f"branches/{ph['branch'].replace('/', '%2F')}")
    cmp_ = api(f"compare/{ph['final_commit']}...{ph['branch'].replace('/', '%2F')}")
    o.note()
    o.note(f"Phase {ph['n']}: {ph['title']}")
    o.note(f"  final commit {ph['final_commit']}; remote branch {ph['branch']}; pull request #{ph['pr']}")
    o.note(f"  deliverables: {'; '.join(ph['deliverables'])}")
    state = (("merged" if pr.get("merged") else pr.get("state")) if pr else "missing")
    o.check(f"phase {ph['n']}: the pull request is live on the host and its head is the phase branch", bool(pr) and state in ("open", "merged") and pr["head"]["ref"] == ph["branch"], f"#{ph['pr']} is {state}; head {pr['head']['ref'] if pr else '?'} at {pr['head']['sha'][:10] if pr else '?'}; base {pr['base']['ref'] if pr else '?'}")
    o.check(f"phase {ph['n']}: the remote branch exists", bool(br), f"{ph['branch']} at {br['commit']['sha'][:10] if br else 'missing'}")
    contained = bool(cmp_) and cmp_.get("status") in ("ahead", "identical")
    o.check(f"phase {ph['n']}: the final commit is contained in the remote branch", contained, f"host compare: branch is {cmp_.get('status') if cmp_ else 'unknown'} relative to the commit ({cmp_.get('ahead_by', '?') if cmp_ else '?'} ahead)")
o.finish()
