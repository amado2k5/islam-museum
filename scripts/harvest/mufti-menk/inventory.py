#!/usr/bin/env python3
"""Metadata inventory of the YouTube channel @muftimenkofficial (lane mufti-menk). Metadata only: no media is downloaded.

Founder ruling 21 Nov 2026 (docs/sources-policy.md). The ledger lives in the harvest workspace, never in git:
  $HARVEST/mufti-menk/ledger.sqlite   (default HARVEST=~/islam-museum-harvest)

Stages (each resumable; a row is never deleted, a fetch error becomes the row's status):
  list      flat-list the Videos, Shorts and Live tabs and every playlist -> one row per video, tab, playlists, positions
  detail    per-video metadata (title, description, upload date, duration, language, chapters, views + date read)
  classify  order index (1 = newest), class, parent links, from title/description/duration/tab
  report    totals by class, hours, estimated transcription time and disk

Usage: python3 inventory.py list|detail|classify|report [--limit N] [--pause SECONDS]
"""
import argparse, json, os, re, sqlite3, subprocess, sys, time
from pathlib import Path

CHANNEL = "https://www.youtube.com/@muftimenkofficial"
YTDLP = "/opt/homebrew/Caskroom/miniconda/base/bin/yt-dlp"
HARVEST = Path(os.environ.get("HARVEST", Path.home() / "islam-museum-harvest"))
DB = HARVEST / "mufti-menk" / "ledger.sqlite"
COMMON = ["--no-update", "--ignore-no-formats-error"]

SCHEMA = """
CREATE TABLE IF NOT EXISTS videos (
  id TEXT PRIMARY KEY, url TEXT, title TEXT, description TEXT, upload_date TEXT, duration INTEGER,
  language TEXT, tabs TEXT, playlists TEXT, chapters TEXT, view_count INTEGER, views_read_at TEXT,
  order_idx INTEGER, class TEXT, parent_id TEXT, label TEXT, label_reason TEXT,
  status TEXT NOT NULL DEFAULT 'listed', error TEXT, transcript_path TEXT, updated_at TEXT
);
CREATE TABLE IF NOT EXISTS playlists (
  id TEXT PRIMARY KEY, title TEXT, url TEXT, n_videos INTEGER, video_ids TEXT, read_at TEXT
);
"""


def db():
    DB.parent.mkdir(parents=True, exist_ok=True)
    con = sqlite3.connect(DB)
    con.executescript(SCHEMA)
    return con


def ytdlp(args, timeout=600):
    p = subprocess.run([YTDLP, *COMMON, *args], capture_output=True, text=True, timeout=timeout)
    return p.returncode, p.stdout, p.stderr


def flat(url):
    rc, out, err = ytdlp(["--flat-playlist", "--dump-single-json", url])
    if not out.strip():
        raise RuntimeError(err.strip()[-300:] or f"rc={rc}")
    return json.loads(out)


def now():
    return time.strftime("%Y-%m-%dT%H:%M:%S%z")


def stage_list(con):
    seen = {}
    for tab in ("videos", "shorts", "streams"):
        try:
            d = flat(f"{CHANNEL}/{tab}")
        except Exception as e:  # a tab can be absent
            print(f"tab {tab}: {e}")
            continue
        for e in d.get("entries") or []:
            if e.get("id"):
                seen.setdefault(e["id"], {"tabs": set(), "title": e.get("title"), "duration": e.get("duration"), "views": e.get("view_count")})["tabs"].add(tab)
        print(f"tab {tab}: {len(d.get('entries') or [])}")
    pl_index = {}
    try:
        pls = flat(f"{CHANNEL}/playlists")
    except Exception as e:
        print(f"playlists tab: {e}")
        pls = {"entries": []}
    for pl in pls.get("entries") or []:
        pid = pl.get("id")
        if not pid:
            continue
        try:
            d = flat(f"https://www.youtube.com/playlist?list={pid}")
        except Exception as e:
            print(f"playlist {pid}: {e}")
            con.execute("INSERT OR REPLACE INTO playlists VALUES (?,?,?,?,?,?)", (pid, pl.get("title"), pl.get("url"), None, "[]", now()))
            continue
        ids = [x["id"] for x in d.get("entries") or [] if x.get("id")]
        con.execute("INSERT OR REPLACE INTO playlists VALUES (?,?,?,?,?,?)", (pid, d.get("title") or pl.get("title"), f"https://www.youtube.com/playlist?list={pid}", len(ids), json.dumps(ids), now()))
        for pos, vid in enumerate(ids, 1):
            pl_index.setdefault(vid, []).append({"playlist": pid, "title": d.get("title"), "position": pos})
            seen.setdefault(vid, {"tabs": set(), "title": None, "duration": None, "views": None})
        print(f"playlist {pid} {d.get('title')!r}: {len(ids)}")
        time.sleep(1)
    for vid, v in seen.items():
        con.execute(
            "INSERT INTO videos (id,url,title,duration,tabs,playlists,view_count,views_read_at,status,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?) "
            "ON CONFLICT(id) DO UPDATE SET tabs=excluded.tabs, playlists=excluded.playlists, updated_at=excluded.updated_at",
            (vid, f"https://www.youtube.com/watch?v={vid}", v["title"], v["duration"], json.dumps(sorted(v["tabs"])), json.dumps(pl_index.get(vid, [])), v["views"], now(), "listed", now()))
    con.commit()
    print("rows:", con.execute("SELECT COUNT(*) FROM videos").fetchone()[0])


def stage_detail(con, limit, pause):
    rows = con.execute("SELECT id FROM videos WHERE status IN ('listed','detail_error') ORDER BY rowid").fetchall()
    n = 0
    for (vid,) in rows[: limit or None]:
        rc, out, err = ytdlp(["--skip-download", "--dump-json", f"https://www.youtube.com/watch?v={vid}"], timeout=180)
        if rc != 0 or not out.strip():
            msg = (err.strip().splitlines() or ["no output"])[-1][:300]
            con.execute("UPDATE videos SET status='detail_error', error=?, updated_at=? WHERE id=?", (msg, now(), vid))
            con.commit()
            print(f"{vid}: ERROR {msg}")
            if re.search(r"429|Too Many|confirm you.re not a bot|Sign in to confirm", msg, re.I):
                print("YouTube is refusing requests: stopping; not working around it.")
                return 3
            time.sleep(pause)
            continue
        d = json.loads(out.splitlines()[0])
        con.execute(
            "UPDATE videos SET title=?, description=?, upload_date=?, duration=?, language=?, chapters=?, view_count=?, views_read_at=?, status='detailed', error=NULL, updated_at=? WHERE id=?",
            (d.get("title"), d.get("description"), d.get("upload_date"), d.get("duration"), d.get("language"), json.dumps(d.get("chapters") or []), d.get("view_count"), now(), now(), vid))
        con.commit()
        n += 1
        if n % 25 == 0:
            print(f"detailed {n}/{len(rows)}")
        time.sleep(pause)
    return 0


# classification: conservative keyword rules on title/description; anything unsure stays 'other' for a person to see
RULES = [
    ("not by this speaker", r"\b(interview with|podcast with)\b.*\b(not mufti)\b"),
    ("Eid sermon", r"\beid\b.*\b(khutba|khutbah|sermon)\b|\b(khutba|khutbah|sermon)\b.*\beid\b"),
    ("Friday sermon", r"\b(jumu'?ah|jumuah|friday)\b.*\b(khutba|khutbah|sermon|lecture|talk)\b|\b(khutba|khutbah)\b"),
    ("recitation", r"\b(recitation|recites|quran recitation|tilawat)\b"),
    ("Q&A", r"\bq\s*&\s*a\b|\bquestions? (and|&) answers?\b|\bask the mufti\b"),
    ("announcement or promotional", r"\b(tour|tickets?|announcement|trailer|promo|appeal|donate|book launch|app\b)"),
    ("series episode", r"\b(episode|ep\.?|part|day)\s*\d+|#\d+|\bseries\b|\bramadan (series|reminder)\b"),
]


def classify_one(r):
    title = (r["title"] or "")
    text = f"{title}\n{(r['description'] or '')[:600]}"
    tabs = json.loads(r["tabs"] or "[]")
    dur = r["duration"] or 0
    if "streams" in tabs:
        return "livestream"
    if "shorts" in tabs or (0 < dur <= 61 and "videos" not in tabs):
        return "short clip or Short"
    for label, rx in RULES:
        if re.search(rx, text, re.I):
            return label
    if dur and dur < 420:
        return "short clip or Short"
    if dur >= 1500:
        return "full lecture"
    return "other"


def stage_classify(con):
    con.row_factory = sqlite3.Row
    rows = con.execute("SELECT * FROM videos").fetchall()
    rows = sorted(rows, key=lambda r: (r["upload_date"] or "", r["id"]), reverse=True)
    for i, r in enumerate(rows, 1):
        c = classify_one(r)
        parent = None
        m = re.search(r"(?:full|original)[^\n]{0,40}(?:youtu\.be/|v=)([\w-]{11})", r["description"] or "", re.I)
        if m and m.group(1) != r["id"]:
            parent = m.group(1)
        con.execute("UPDATE videos SET order_idx=?, class=?, parent_id=? WHERE id=?", (i, c, parent, r["id"]))
    con.commit()
    print("classified", len(rows))


def stage_report(con):
    con.row_factory = sqlite3.Row
    print("status:", dict(con.execute("SELECT status, COUNT(*) FROM videos GROUP BY status").fetchall()))
    tot = con.execute("SELECT COUNT(*), COALESCE(SUM(duration),0) FROM videos").fetchone()
    print(f"videos: {tot[0]}, total hours: {tot[1]/3600:.1f}")
    print(f"{'class':32}{'n':>7}{'hours':>9}")
    for r in con.execute("SELECT COALESCE(class,'(unclassified)') c, COUNT(*) n, COALESCE(SUM(duration),0) s FROM videos GROUP BY c ORDER BY n DESC"):
        print(f"{r['c']:32}{r['n']:>7}{r['s']/3600:>9.1f}")
    skip = ("short clip or Short", "recitation", "announcement or promotional", "not by this speaker", "livestream")
    q = ",".join("?" * len(skip))
    s = con.execute(f"SELECT COUNT(*), COALESCE(SUM(duration),0) FROM videos WHERE COALESCE(class,'other') NOT IN ({q}) AND duration IS NOT NULL", skip).fetchone()
    hrs = s[1] / 3600
    print(f"to transcribe (lecture-class, livestreams excluded pending a decision): {s[0]} videos, {hrs:.1f} h of audio")
    print(f"estimate at 13x realtime (large-v3, Arabic benchmark; English speed to be measured): {hrs/13:.1f} h; audio at 32 kbit/s mono: {hrs*3600*4000/1e9:.1f} GB peak if kept, transcripts about {s[0]*0.1:.0f} MB")
    print("playlists:", con.execute("SELECT COUNT(*) FROM playlists").fetchone()[0])


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("stage", choices=["list", "detail", "classify", "report"])
    ap.add_argument("--limit", type=int, default=0)
    ap.add_argument("--pause", type=float, default=2.0)
    a = ap.parse_args()
    con = db()
    if a.stage == "list":
        stage_list(con)
    elif a.stage == "detail":
        return stage_detail(con, a.limit, a.pause)
    elif a.stage == "classify":
        stage_classify(con)
    else:
        stage_report(con)
    return 0


if __name__ == "__main__":
    sys.exit(main())
