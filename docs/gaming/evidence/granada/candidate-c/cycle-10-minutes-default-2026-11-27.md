# Ten-minute repeated-state check, default palace (27 November 2026)

Raw measurement: [`cycle-10-minutes-default-2026-11-27.json`](cycle-10-minutes-default-2026-11-27.json).

- Target: `default`, so no art flag was used and the game's own `granada/p1` palace was measured. Medium, 1920 by 1080, camera movement and one field selection each round, with reloads as the tool arranges them.
- Measured tree: `2fb7476dc94d8c7e55b6595af1183d94f33f2ce6` (`origin/main` when the run began). The game code being served was that tree; only documentation/CANARY edits for this evaluation update were uncommitted in the working directory and do not affect the game.
- Machine load: not quiet. At 03:51Z the one-minute load average was 17.45, with Spotlight, WindowServer, media analysis and Chrome busy; at the end `uptime` reported `23:00  up 2 days, 16:12, 2 users, load averages: 11.63 14.33 14.81`. Frame times in the JSON are therefore recorded but are not performance evidence and pass no gate.
- Result: 28 rounds over 10 page loads; geometries stayed at 149, textures at 59, draw calls at 318, triangles at 3,656,109, intervals at 1, workers at 0, arrived models at 4 and model failures at 0. Heap ranged 182.8–234.8 MB (first 196.9, last 213; quarter means 199.1, 208.3, 196.5, 206.4). Listeners ranged 47–99 (first 47, last 72). Console errors: 0.

This is a ten-minute repeated-state measurement only. It is not the one-hour repeated-action profile, not the four-hour soak, and not a minimum-machine measurement.
