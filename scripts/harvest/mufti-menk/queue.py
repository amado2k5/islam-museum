#!/usr/bin/env python3
"""Sequential, resumable, newest-first queue for lane mufti-menk (founder approval 21 Nov 2026, channel @muftimenkofficial only).

For each lecture-class video in the ledger, newest first (order_idx ascending), one at a time:
  1. download audio only with scripts/harvest/audio/download.py --youtube (pause between requests; stops if YouTube refuses),
  2. transcribe with scripts/harvest/audio/transcribe.py (English, large-v3, segment timestamps kept),
  3. check the transcript (non-empty, last segment within 10% of the ledger duration),
  4. delete the audio file, keep the transcript, mark the ledger row 'transcribed'. Failures are written to the row's status
     ('download_error' / 'transcribe_error' / 'check_error') with the reason and retried on the next run.
Recitation, shorts, announcements, livestreams and 'other' classes are not queued.

Usage: python3 queue.py [--limit N] [--pause 5]
"""
import argparse, json, os, sqlite3, subprocess, sys, time
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
HARVEST = Path(os.environ.get("HARVEST", Path.home() / "islam-museum-harvest"))
WORK = HARVEST / "mufti-menk"
CLASSES = ("full lecture", "Friday sermon", "Eid sermon", "series episode", "Q&A")
PROMPT = "A lecture by Mufti Menk. Bismillah. Allah, Quran, hadith, Prophet, Sahaba, taqwa, dua, salah, sabr."
now = lambda: time.strftime("%Y-%m-%dT%H:%M:%S%z")


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--limit", type=int, default=0)
    ap.add_argument("--pause", type=float, default=5)
    a = ap.parse_args()
    con = sqlite3.connect(WORK / "ledger.sqlite")
    q = ",".join("?" * len(CLASSES))
    rows = con.execute(
        f"SELECT id, duration FROM videos WHERE class IN ({q}) AND status IN ('detailed','download_error','transcribe_error','check_error') ORDER BY order_idx",
        CLASSES).fetchall()
    (WORK / "audio").mkdir(exist_ok=True)
    (WORK / "transcripts").mkdir(exist_ok=True)
    for n, (vid, dur) in enumerate(rows[: a.limit or None], 1):
        mp3, tj = WORK / "audio" / f"{vid}.mp3", WORK / "transcripts" / f"{vid}.json"
        if not tj.exists():
            if not mp3.exists():
                man = WORK / "one.tsv"
                man.write_text(f"id\n{vid}\n")
                p = subprocess.run([sys.executable, "-I", str(ROOT / "scripts/harvest/audio/download.py"), "--youtube", "--out", str(WORK / "audio"), "--manifest", str(man), "--pause", str(a.pause)], capture_output=True, text=True)
                if p.returncode == 3:
                    print("YouTube is refusing requests: stopping.")
                    return 3
                if not mp3.exists():
                    con.execute("UPDATE videos SET status='download_error', error=?, updated_at=? WHERE id=?", ((p.stderr.strip().splitlines() or ["no file"])[-1][:300], now(), vid))
                    con.commit()
                    continue
            p = subprocess.run([sys.executable, "-I", str(ROOT / "scripts/harvest/audio/transcribe.py"), "--out", str(WORK / "transcripts"), "--lang", "en", "--prompt", PROMPT, str(mp3)], capture_output=True, text=True)
            if not tj.exists():
                con.execute("UPDATE videos SET status='transcribe_error', error=?, updated_at=? WHERE id=?", ((p.stderr.strip().splitlines() or ["no output"])[-1][:300], now(), vid))
                con.commit()
                continue
        segs = json.loads(tj.read_text()).get("segments", [])
        last = segs[-1]["end"] if segs else 0
        if not segs or (dur and abs(last - dur) > 0.10 * dur):
            con.execute("UPDATE videos SET status='check_error', error=?, updated_at=? WHERE id=?", (f"transcript ends at {last:.0f}s, ledger duration {dur}s", now(), vid))
            con.commit()
            continue
        mp3.unlink(missing_ok=True)
        con.execute("UPDATE videos SET status='transcribed', transcript_path=?, error=NULL, updated_at=? WHERE id=?", (str(WORK / "transcripts" / f"{vid}.txt"), now(), vid))
        con.commit()
        print(f"{n}/{len(rows)} {vid} transcribed", flush=True)
    return 0


if __name__ == "__main__":
    sys.exit(main())
