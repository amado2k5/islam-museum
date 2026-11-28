# The painted skies' first look, 28 November 2026

Five equirectangular skies painted by ChatGPT Codex to the museum's brief (draft, pending the founder's look),
scaled down on this machine to 4096x2048 webp — spring morning, summer midday, autumn afternoon, winter
overcast, and a golden evening for the light preview. Each season's painting stands on a camera-following dome
inside the physical sky's reach; while a painting is had the physical sky is hidden with its clouds (the painting
carries the clouds itself), and the physical sky still made the environment map at startup. A painting that
cannot be had is named in the game and the physical sky stays.

- `spring.png`, `summer.png`, `autumn.png`, `winter.png`: the valley from the fields looking west at the lowest
  camera tilt, so the band of sky above the horizon is the painting. Each season shows its own sky; winter and the
  rainy day (`rain-summer.png`, which asks for the overcast painting) read greyer, the evening preview
  (`evening-golden.png`) reads warm and low.
- The camera never looks far above the horizon, so the paintings' deep-zenith blues sit above the frame; what the
  player sees is each painting's horizon haze and cloud deck, which is where the art does its work anyway.

Two snags found on the way: a flip of the dome's v coordinate was tried and reverted — the captures showed the
painting's hazy foot on top until it came off, so the dome keeps the sphere's own coordinates; and the first test
pose looked down, not up, so the "sky" being judged was the Sierra strip — the tool now uses a low tilt that keeps
the horizon in frame.

Measured on the sky test page on this machine after the change: 592 draw calls, 4,870,417 triangles, 71 textures,
173 geometries (the five skies are five of the textures), heap 204 MB, no model failures. Draw calls are up from
the sierra run's 563 because the pose and season differ, not because of the dome — the dome is one mesh and its
texture replaces nothing; the physical sky is hidden, not removed.

Not yet checked: either strip of u-mirroring against the sun's painted position (the equirect's left-right
convention was taken as delivered); the skies on production, where the media path serves them like the Sierra's
webp; frame times, as the machine was not quiet.
