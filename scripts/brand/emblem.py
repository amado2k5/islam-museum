#!/usr/bin/env python3
"""Cut the brand assets from the painted emblem (docs/design/emblem-source.jpg) into site/public/.

Finds the lapis disc by colour, cuts the medallion (disc + gold ring) with a transparent background, and writes:
  brand/emblem-full.webp, emblem-full-512.webp      the full square (foundation page, backgrounds)
  brand/mark-{128,512}.webp, mark-512.png           the medallion for light grounds
  brand/mark-dark-{128,512}.webp                    brightened, gold-haloed medallion for dark grounds
  brand/mark-mono-{ink,gold}-512.webp               single-colour marks; mark-watermark-{ink,gold}.webp pre-faded (26 %)
  favicon-{16,32,64}.png, favicon.ico (16, 32, 48), apple-touch-icon.png, brand/og-image.jpg
Run from the repository root: python3 scripts/brand/emblem.py
"""
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw, ImageEnhance, ImageFilter

ROOT = Path(__file__).resolve().parents[2]
SRC = ROOT / "docs/design/emblem-source.jpg"
PUB = ROOT / "site/public"
OUT = PUB / "brand"
OUT.mkdir(parents=True, exist_ok=True)

img = Image.open(SRC).convert("RGB")
a = np.asarray(img).astype(int)
# the lapis disc: dark teal pixels (low red, blue and green above red); its bounding box gives centre and radius, and the
# gold ring adds ~24 px. The box must be near-square, or the mask caught something else.
blue = (a[..., 0] < 140) & (a[..., 2] > a[..., 0] + 8) & (a[..., 1] > a[..., 0] + 4)
ys, xs = np.where(blue)
w, h = xs.max() - xs.min(), ys.max() - ys.min()
if abs(w - h) > 0.04 * max(w, h):
    raise SystemExit(f"disc mask is not round ({w}x{h}); adjust the colour thresholds")
cx, cy = int((xs.min() + xs.max()) / 2), int((ys.min() + ys.max()) / 2)
r = int(max(w, h) / 2) + 24
print(f"disc centre ({cx}, {cy}), medallion radius {r}")

img.save(OUT / "emblem-full.webp", quality=84, method=6)
img.resize((512, 512), Image.LANCZOS).save(OUT / "emblem-full-512.webp", quality=84, method=6)

S = 4
mask = Image.new("L", (img.width * S, img.height * S), 0)
ImageDraw.Draw(mask).ellipse([(cx - r) * S, (cy - r) * S, (cx + r) * S, (cy + r) * S], fill=255)
mask = mask.resize(img.size, Image.LANCZOS)
rgba = img.convert("RGBA")
rgba.putalpha(mask)
mark = rgba.crop((cx - r, cy - r, cx + r, cy + r))
D = mark.width


def save(im: Image.Image, name: str, sizes=(512,), png=False):
    for s in sizes:
        m = im.resize((s, s), Image.LANCZOS)
        m.save(OUT / f"{name}-{s}.webp", quality=88, method=6)
        if png:
            m.save(OUT / f"{name}-{s}.png", optimize=True)


save(mark, "mark", (512, 128), png=False)
mark.resize((512, 512), Image.LANCZOS).save(OUT / "mark-512.png", optimize=True)

bright = ImageEnhance.Contrast(ImageEnhance.Brightness(mark).enhance(1.22)).enhance(1.08)
halo = Image.new("RGBA", (D, D), (0, 0, 0, 0))
ImageDraw.Draw(halo).ellipse([6, 6, D - 6, D - 6], fill=(197, 160, 89, 110))
halo = halo.filter(ImageFilter.GaussianBlur(14))
dark = Image.alpha_composite(halo, bright)
save(dark, "mark-dark", (512, 128))

lum = np.asarray(mark.convert("L")).astype(float) / 255.0
alpha = np.asarray(mark.split()[3]).astype(float) / 255.0


def tinted(color):
    l = np.clip((lum - 0.15) / 0.7, 0, 1)
    arr = np.zeros((D, D, 4), dtype=np.uint8)
    arr[..., 0], arr[..., 1], arr[..., 2] = color
    arr[..., 3] = (l * alpha * 255).astype(np.uint8)
    return Image.fromarray(arr, "RGBA")


for name, color in [("gold", (197, 160, 89)), ("ink", (10, 37, 51))]:
    mono = tinted(color)
    save(mono, f"mark-mono-{name}", (512,))
    faded = np.asarray(mono.resize((512, 512), Image.LANCZOS)).copy()
    faded[..., 3] = (faded[..., 3].astype(float) * 0.26).astype(np.uint8)
    Image.fromarray(faded, "RGBA").save(OUT / f"mark-watermark-{name}.webp", quality=80, method=6)

for s in (16, 32, 64):
    mark.resize((s, s), Image.LANCZOS).save(PUB / f"favicon-{s}.png", optimize=True)
# /favicon.ico is what crawlers, feed readers and bookmark tools ask for when they ignore <link rel="icon">.
mark.save(PUB / "favicon.ico", sizes=[(16, 16), (32, 32), (48, 48)])
touch = Image.new("RGBA", (180, 180), (10, 37, 51, 255))
touch.alpha_composite(mark.resize((156, 156), Image.LANCZOS), (12, 12))
touch.convert("RGB").save(PUB / "apple-touch-icon.png", optimize=True)

og = Image.new("RGBA", (1200, 630), (10, 37, 51, 255))
glow = Image.new("RGBA", (1200, 630), (0, 0, 0, 0))
ImageDraw.Draw(glow).ellipse([330, 45, 870, 585], fill=(197, 160, 89, 70))
og = Image.alpha_composite(og, glow.filter(ImageFilter.GaussianBlur(60)))
og.alpha_composite(dark.resize((520, 520), Image.LANCZOS), (340, 55))
og.convert("RGB").save(OUT / "og-image.jpg", quality=86)
print("wrote", sorted(p.name for p in OUT.iterdir()))
