#!/usr/bin/env python3
"""Serves the packaged games on this computer only, the way the games' own host serves them.

    python3 serve.py            then open http://localhost:8765/granada/?lang=en&fresh=1
    python3 serve.py 9000       another port

Python 3 and nothing else: no package is installed and nothing is fetched. It listens on 127.0.0.1, answers GET and
HEAD only, reads nothing outside the `site` folder beside it, and sends the same security headers the games' host
sends (they are in host-headers.json, recorded from that host when this package was made), so a page here is under
the same content security policy as there. Audio is answered in spans of bytes, as players ask for it.
"""
import json
import os
import re
import sys
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

HERE = os.path.dirname(os.path.abspath(__file__))
SITE = os.path.join(HERE, "site")
with open(os.path.join(HERE, "host-headers.json"), encoding="utf-8") as f:
    HOST = json.load(f)
TYPES = {
    ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".mjs": "text/javascript; charset=utf-8",
    ".css": "text/css; charset=utf-8", ".json": "application/json; charset=utf-8", ".svg": "image/svg+xml",
    ".txt": "text/plain; charset=utf-8", ".wasm": "application/wasm", ".woff2": "font/woff2", ".ico": "image/x-icon",
    ".webp": "image/webp", ".png": "image/png", ".jpg": "image/jpeg", ".gltf": "model/gltf+json",
    ".bin": "application/octet-stream", ".m4a": "audio/mp4", ".mp4": "video/mp4", ".webm": "video/webm",
}
SAFE = re.compile(r"^/[A-Za-z0-9._/-]*$")


class Handler(BaseHTTPRequestHandler):
    server_version = "im-games-qa"

    def log_message(self, fmt, *args):  # one line a request, to the terminal
        sys.stderr.write("%s %s\n" % (self.command, fmt % args))

    def _send(self, status, body=b"", content_type="text/plain; charset=utf-8", extra=None):
        self.send_response(status)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", str(len(body)))
        for name, value in HOST["security"].items():
            self.send_header(name, value)
        for name, value in (extra or {}).items():
            self.send_header(name, value)
        self.end_headers()
        if self.command != "HEAD":
            self.wfile.write(body)

    def do_HEAD(self):
        self.do_GET()

    def do_GET(self):
        path = self.path.split("?", 1)[0].split("#", 1)[0]
        if path == "/_channel":
            return self._send(200, json.dumps(HOST["channel"]).encode(), "application/json; charset=utf-8", {"Cache-Control": "no-store"})
        if not SAFE.match(path) or "/." in path or "//" in path:
            return self._send(400, b"bad path")
        if path.endswith("/"):
            path += "index.html"
        target = os.path.normpath(os.path.join(SITE, path.lstrip("/")))
        if not target.startswith(SITE + os.sep) or not os.path.isfile(target):
            missing = os.path.join(SITE, "404.html")
            body = open(missing, "rb").read() if os.path.isfile(missing) else b"not found"
            return self._send(404, body, "text/html; charset=utf-8")
        size = os.path.getsize(target)
        kind = TYPES.get(os.path.splitext(target)[1].lower(), "application/octet-stream")
        relative = os.path.relpath(target, SITE).replace(os.sep, "/")
        cache = "public, max-age=31536000, immutable" if relative.startswith("assets/") else "public, max-age=86400" if relative.startswith("media/") else "public, max-age=60"
        extra = {"Cache-Control": cache, "Accept-Ranges": "bytes"}
        span = re.match(r"^bytes=(\d*)-(\d*)$", self.headers.get("Range", "").strip())
        with open(target, "rb") as f:
            if span and (span.group(1) or span.group(2)):
                if span.group(1) == "":
                    length = min(size, int(span.group(2)))
                    start = size - length
                else:
                    start = int(span.group(1))
                    end = min(size - 1, int(span.group(2))) if span.group(2) else size - 1
                    length = end - start + 1
                if start >= size or length <= 0:
                    return self._send(416, b"", kind, {"Content-Range": "bytes */%d" % size})
                f.seek(start)
                extra["Content-Range"] = "bytes %d-%d/%d" % (start, start + length - 1, size)
                return self._send(206, f.read(length), kind, extra)
            return self._send(200, f.read(), kind, extra)


if __name__ == "__main__":
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8765
    server = ThreadingHTTPServer(("127.0.0.1", port), Handler)
    print("The games are at http://localhost:%d/  (release %s). Ctrl-C to stop." % (port, HOST["channel"].get("current", "?")))
    for game in ("granada", "golden-age", "atlas"):
        print("  http://localhost:%d/%s/?lang=en&fresh=1" % (port, game))
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
