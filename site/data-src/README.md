# Data sources

## `retention-allgrades-by-state.json`

Students retained in grade, all grade levels combined, by state and by
race/ethnicity. This is the same aggregate that backs the 2024 interactive
retention map project (`dskong07/dsc106-US-education`), derived there from the
NCES "Retention in Grade" tables.

Counts are absolute students retained, not rates. The site uses only the
`total` field, log-normalised, to color the particle formation.

## State geometry

Not stored here. `scripts/build-particle-data.mjs` reads
`node_modules/us-atlas/states-albers-10m.json` (`us-atlas`, public domain,
derived from US Census Bureau cartographic boundary files). It is already
projected in Albers USA screen space, so Alaska and Hawaii appear as insets and
no runtime projection is needed.

## Generated output

`npm run data` writes `public/data/us-retention.bin` and
`public/data/us-retention.json`. Both are build artifacts and are gitignored;
the build regenerates them via `prebuild`.
