#!/usr/bin/env python3
"""Automated approval of illustrations (docs/plan/22 §5 step 6). Replaces the contact sheet and the human review.
Reads <media-root>/review/<batch>/screen.json (one record per seed with OCR, face and human counts, written by screen.py),
the prompt files media/prompts/<class>/<slug>.json, and scripts/media/accuracy.yaml. Approves at most one seed per entity,
and only when every gate passes. Writes <media-root>/review/<batch>/auto-approved.json: every approval and every rejection
with seed, gate results, report hash and timestamp. Revert an approval by deleting its record from that file and re-running
ingest.py (which ingests only the records present); do not re-run approve.py for that batch, or it approves the entity again.
Run in .venv-media: python scripts/media/illustrate/approve.py <batch> [--vlm gemma4:26b]"""
import argparse, datetime, json, os, sys
from pathlib import Path

import yaml

sys.path.insert(0, str(Path(__file__).parent))
from gates import architecture_gate, face_gate, figure_gate, forbidden_terms, gate_report, ocr_gate, prompt_lint

REPO = Path(__file__).resolve().parents[3]
MEDIA = Path(os.environ.get("ILLUS_MEDIA", Path.home() / "islam-museum-media"))
ACCURACY = REPO / "scripts" / "media" / "accuracy.yaml"
PROMPTS = REPO / "media" / "prompts"


def vlm_hits(png, terms, model):
    """Ask a local vision-language model (Ollama) which forbidden terms are visible. Returns the subset found."""
    import base64, urllib.request
    if not terms:
        return []
    question = ("Look at this image. Which of these architectural or object terms are clearly visible? "
                f"Terms: {', '.join(terms)}. Answer with a JSON list of the visible terms only, [] if none.")
    body = json.dumps({"model": model, "stream": False, "messages": [{
        "role": "user", "content": question, "images": [base64.b64encode(Path(png).read_bytes()).decode()]}]}).encode()
    req = urllib.request.Request("http://localhost:11434/api/chat", data=body, headers={"Content-Type": "application/json"})
    answer = json.loads(urllib.request.urlopen(req, timeout=600).read())["message"]["content"]
    start, end = answer.find("["), answer.rfind("]")
    found = json.loads(answer[start:end + 1]) if start >= 0 else []
    return [t for t in found if t in terms]


def evaluate(record, prompt, accuracy_rows, vlm):
    """Gates for one seed. record: screen.json entry; prompt: prompt file; vlm: callable(png, terms) -> hits."""
    policy = prompt["figure_policy"]
    terms = forbidden_terms(accuracy_rows, prompt["period"], prompt["region"])
    gates = [
        ocr_gate(record["ocr_letters"]),
        face_gate(record["faces"]),
        architecture_gate(vlm(record["png"], terms)),
        prompt_lint(prompt["prompt"], policy),
        figure_gate(policy, record["humans"], record["faces"]),
    ]
    return gate_report(gates)


def approve_batch(batch_dir, prompts_dir, accuracy_rows, vlm, now=None):
    """Returns the audit document. Entities already approved in an existing audit file are left as they are."""
    now = now or datetime.datetime.now(datetime.timezone.utc).isoformat(timespec="seconds")
    screen = json.loads((batch_dir / "screen.json").read_text())
    audit_path = batch_dir / "auto-approved.json"
    audit = json.loads(audit_path.read_text()) if audit_path.exists() else {"batch": batch_dir.name, "approvals": [], "rejections": []}
    done = {f"{a['class']}/{a['slug']}" for a in audit["approvals"]}  # at most one seed per entity
    for record in screen:
        if f"{record['class']}/{record['slug']}" in done:
            continue
        prompt = json.loads((prompts_dir / record["class"] / f"{record['slug']}.json").read_text())
        report = evaluate(record, prompt, accuracy_rows, vlm)
        row = {"media_id": record["media_id"], "class": record["class"], "slug": record["slug"], "seed": record["seed"],
               "timestamp": now, "gate_report": report}
        if report["passed"]:
            audit["approvals"].append({**row, "status": {"review": "draft", "approved_by": "pipeline"}})
            done.add(f"{record['class']}/{record['slug']}")
        else:
            audit["rejections"].append(row)
    audit_path.write_text(json.dumps(audit, ensure_ascii=False, indent=2) + "\n")
    return audit


def read_approvals(batch_dir):
    """What ingest.py reads: the approvals present in the audit file."""
    path = batch_dir / "auto-approved.json"
    return json.loads(path.read_text())["approvals"] if path.exists() else []


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("batch")
    ap.add_argument("--vlm", default=os.environ.get("ILLUS_VLM", "gemma4:26b"))
    args = ap.parse_args()
    rows = yaml.safe_load(ACCURACY.read_text()) or []
    batch = MEDIA / "review" / args.batch
    audit = approve_batch(batch, PROMPTS, rows, lambda png, terms: vlm_hits(png, terms, args.vlm))
    print(f"{len(audit['approvals'])} approved, {len(audit['rejections'])} rejected -> {batch / 'auto-approved.json'}")


if __name__ == "__main__":
    main()
