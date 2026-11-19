#!/usr/bin/env python3
"""A small batching server for the local translation threads: one copy of the model (MLX build of TranslateGemma),
several requests decoded together. On the founder's M4 Max, four paragraphs at once run at about 46 tokens/s against
about 23 one at a time, so both languages together go about twice as fast as through Ollama.

    python3 scripts/local-mt/mlx_server.py --model /Volumes/exmicroSD/islam-museum-local-mt/mlx-models/translategemma-27b-it-4bit

It speaks the one Ollama call the translator uses (POST /api/chat, non-streaming) and GET /api/version, so
scripts/local-mt/translate.py needs only --host http://127.0.0.1:11501.
"""
import argparse, json, queue, threading, time
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

from mlx_lm import load
from mlx_lm.generate import BatchGenerator
from mlx_lm.sample_utils import make_sampler

ap = argparse.ArgumentParser()
ap.add_argument("--model", required=True)
ap.add_argument("--port", type=int, default=11501)
ap.add_argument("--batch", type=int, default=4, help="requests decoded together")
args = ap.parse_args()

model, tok = load(args.model)
try:
    tok.add_eos_token("<end_of_turn>")
except Exception:
    pass
jobs: "queue.Queue[dict]" = queue.Queue()


def worker():
    """Continuous batching: a finished request leaves at once and its slot is refilled from the queue."""
    gen = BatchGenerator(model, stop_tokens=[[t] for t in tok.eos_token_ids])
    active = {}

    def admit(job):
        ids = tok.encode(f"<bos><start_of_turn>user\n{job['prompt']}<end_of_turn>\n<start_of_turn>model\n", add_special_tokens=False)
        uid = gen.insert([ids], [job["max_tokens"]], samplers=[make_sampler(temp=job["temperature"])])[0]
        job["tokens"], job["t0"] = [], time.time()
        active[uid] = job

    def fail_all(e):
        for j in list(active.values()):
            j["result"] = {"error": repr(e)[:300]}; j["done"].set()
        active.clear()

    while True:
        try:
            if not active:
                admit(jobs.get())  # idle: wait for work
            while len(active) < args.batch:
                try:
                    admit(jobs.get_nowait())
                except queue.Empty:
                    break
            for r in gen.next_generated() or []:
                j = active.get(r.uid)
                if j is None: continue
                if r.finish_reason != "stop": j["tokens"].append(r.token)
                if r.finish_reason is not None:
                    text = tok.decode(j["tokens"])
                    j["result"] = {"message": {"role": "assistant", "content": text.strip()}, "eval_count": len(j["tokens"]),
                                   "eval_duration": int((time.time() - j["t0"]) * 1e9), "batch": len(active)}
                    del active[r.uid]; j["done"].set()
        except Exception as e:  # report to every caller and start a fresh generator; the translator retries or its supervisor restarts it
            fail_all(e)
            try: gen.close()
            except Exception: pass
            gen = BatchGenerator(model, stop_tokens=[[t] for t in tok.eos_token_ids])


class H(BaseHTTPRequestHandler):
    def log_message(self, *a):
        pass

    def _send(self, code, obj):
        body = json.dumps(obj, ensure_ascii=False).encode()
        self.send_response(code); self.send_header("Content-Type", "application/json"); self.send_header("Content-Length", str(len(body))); self.end_headers(); self.wfile.write(body)

    def do_GET(self):
        self._send(200, {"version": "mlx-batch-1", "queued": jobs.qsize()})

    def do_POST(self):
        d = json.loads(self.rfile.read(int(self.headers.get("Content-Length", 0))))
        opt = d.get("options", {})
        job = {"prompt": d["messages"][-1]["content"], "temperature": float(opt.get("temperature", 0.0)),
               "max_tokens": int(opt.get("num_predict", 4096)), "done": threading.Event()}
        jobs.put(job); job["done"].wait()
        self._send(500 if "error" in job["result"] else 200, job["result"])


threading.Thread(target=worker, daemon=True).start()
print(f"mlx batching server ready on 127.0.0.1:{args.port} (batch {args.batch})", flush=True)
ThreadingHTTPServer(("127.0.0.1", args.port), H).serve_forever()
