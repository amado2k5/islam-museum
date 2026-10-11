# geo/

GeoJSON referenced by map blocks and polity extents (docs/plan/16 §2.2, docs/plan/02 §6). Data is CC0.

```
geo/event/<slug>-<feature>.geojson     polygons and long paths referenced by event map features
geo/polity/<slug>-<year>.geojson       dated extents with a precision flag
geo/journey/<slug>.geojson             routes
geo/region/<id>.geojson                the 14 museum regions
```

Every geometry used by a map feature needs a `source`; positions that are reconstructions carry `precision: schematic`.
