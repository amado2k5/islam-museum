"""Shared helpers for the harvest scripts (docs/plan/15 §5): registry check, polite client, checkpoints, SHA-256."""
import hashlib, json, os, time
from pathlib import Path
import httpx, yaml

HARVEST = Path(os.environ.get("HARVEST", Path.home() / "islam-museum-harvest"))
REGISTRY = yaml.safe_load((HARVEST / "sources.yaml").read_text())
USER_AGENT = REGISTRY["user_agent"]


def require_source(key: str) -> dict:
    """Rule 1: registry first. Refuses to run for a source that is not registered and enabled."""
    src = REGISTRY["sources"].get(key)
    if not src:
        raise SystemExit(f"source '{key}' is not in sources.yaml; add its licence, layer, method and limits first")
    if src.get("status") not in ("enabled",):
        raise SystemExit(f"source '{key}' has status '{src.get('status')}'; set it to 'enabled' deliberately before fetching")
    return src


def client() -> httpx.Client:
    return httpx.Client(headers={"User-Agent": USER_AGENT}, timeout=90, follow_redirects=True)


def sha256(path: Path) -> str:
    h = hashlib.sha256()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(1 << 20), b""):
            h.update(chunk)
    return h.hexdigest()


def checkpoint(name: str) -> dict:
    f = HARVEST / "logs" / f"{name}.checkpoint.json"
    return json.loads(f.read_text()) if f.exists() else {}


def save_checkpoint(name: str, data: dict) -> None:
    (HARVEST / "logs" / f"{name}.checkpoint.json").write_text(json.dumps(data, indent=1))


def polite_sleep(seconds: float) -> None:
    time.sleep(seconds)
