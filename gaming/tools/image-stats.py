# Mean and percentile luminance of PNG captures, used to check that two renderers put the same light on a scene.
# Usage: python3 -I tools/image-stats.py a.png b.png ...   (needs Pillow)
import sys
from PIL import Image

for path in sys.argv[1:]:
    im = Image.open(path).convert("RGB").resize((480, 270))
    px = list(im.getdata())
    lum = sorted(0.2126 * r + 0.7152 * g + 0.0722 * b for r, g, b in px)
    n = len(lum)
    mean = sum(lum) / n
    avg = [sum(c[i] for c in px) / n for i in range(3)]
    print(f"{path.split('/')[-1]}: mean {mean:.1f}  p10 {lum[n // 10]:.0f}  p50 {lum[n // 2]:.0f}  p90 {lum[9 * n // 10]:.0f}  rgb {avg[0]:.0f},{avg[1]:.0f},{avg[2]:.0f}")
