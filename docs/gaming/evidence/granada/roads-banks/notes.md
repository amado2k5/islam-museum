# Roads and riverbanks get their own tiles, 28 November 2026

The honest limit recorded with the ground atlas (#8436): the dirt-road and riverbank tiles were in the atlas but
nothing told the land shader where a road or a bank was. Now it does. `surfaceMask()` in valley.ts bakes one
256x128 table over the valley — red for distance to the roads' centrelines, green for distance to the river's and
the pool's banks — and the land shader reads it only where the land is not worked plain: there the atlas's own
slots answer, slot 7's cart ruts on the roads and slot 6's mud-and-pebbles on the banks, tinted by the land's own
colour so a green bank stays green and the stronger cover wins where they meet. The worked plots keep their own
slots, and the road ribbons themselves are unchanged — this paints the ground around and under them.

- `bank-close.png`, `riverbank.png`: the strip along the river's south bank in the mud-and-pebbles tile.
- `road-close.png`, `road.png`: the lane north over the fields in the cart-ruts tile, its edges fading into the
  grass.

Measured as a paired capture on this machine, the same poses with the mask code stashed and restored: the close
views change 13–17% of pixels significantly (the tiles' detail up close), the wide views 2–5% (the bands are thin
at distance), everything else identical — draw calls 388, triangles 4,597,387, 70 textures (the mask is one), heap
about 190 MB, no model failures either way.

Not yet checked: the mask table's texel size (~5 m) against the roads' real width at grazing angles; the tiles on
production; frame times, as the machine was not quiet.
