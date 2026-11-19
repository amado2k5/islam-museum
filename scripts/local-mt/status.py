#!/usr/bin/env python3
"""Progress of the local translation threads, from their logs.   python3 scripts/local-mt/status.py [minutes]"""
import datetime, json, os, subprocess, sys

HOME = os.environ.get("LOCAL_MT_HOME", "/Volumes/exmicroSD/islam-museum-local-mt")
WINDOW = int(sys.argv[1]) if len(sys.argv) > 1 else 10
now = datetime.datetime.now()
if not os.path.isdir(HOME + "/logs"):
    print(f"NOT MOUNTED: {HOME} is missing (is the microSD connected?)"); sys.exit(1)
print(f"{now:%Y-%m-%d %H:%M}  window: last {WINDOW} min")
print("lang  ok_total  failed  crash | ok_win  failed_win  words_win  words/s | last record")
for lang in ("es", "fr"):
    rows = []
    for line in open(f"{HOME}/logs/{lang}.log", encoding="utf-8"):
        try: rows.append(json.loads(line))
        except ValueError: pass
    cut = now - datetime.timedelta(minutes=WINDOW)
    win = [r for r in rows if datetime.datetime.fromisoformat(r["t"]) >= cut]
    ok = [r for r in rows if r["event"] == "ok"]; okw = [r for r in win if r["event"] == "ok"]
    words = sum(r.get("words", 0) for r in okw)
    last = ok[-1] if ok else {}
    age = int((now - datetime.datetime.fromisoformat(last["t"])).total_seconds()) if last else -1
    print(f"{lang}    {len(ok):>7}  {sum(r['event'] == 'failed' for r in rows):>6}  {sum(r['event'] == 'crash' for r in rows):>5} | "
          f"{len(okw):>6}  {sum(r['event'] == 'failed' for r in win):>10}  {words:>9}  {words / (WINDOW * 60):>7.1f} | {last.get('id', '-')} ({age}s ago)")
ps = subprocess.run(["ps", "-Ao", "command"], capture_output=True, text=True).stdout
alive = {"supervisor es": "local-mt/run.sh es" in ps, "supervisor fr": "local-mt/run.sh fr" in ps, "model server": "mlx_server.py" in ps,
         "auto-ship": "local-mt/autoship.sh" in ps, "translator es": "translate.py --lang es" in ps, "translator fr": "translate.py --lang fr" in ps}
print("processes: " + ", ".join(f"{k} {'up' if v else 'DOWN'}" for k, v in alive.items()))
for lang in ("es", "fr"):
    n = len([f for _, _, fs in os.walk(f"content/{lang}") for f in fs if f.endswith(".md")]) if os.path.isdir(f"content/{lang}") else 0
    print(f"content/{lang}: {n} files", end="   ")
ship = open(f"{HOME}/logs/ship.log", encoding="utf-8").read().strip().split("\n") if os.path.exists(f"{HOME}/logs/ship.log") else ["-"]
print("\nlast ship: " + ship[-1][:120])
