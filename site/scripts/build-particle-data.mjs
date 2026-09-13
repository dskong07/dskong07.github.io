/**
 * Turns real state-level retention data plus US state geometry into a compact
 * point cloud the hero canvas morphs into.
 *
 * Output (both in public/data/, gitignored build artifacts):
 *   us-retention.bin   Int16 interleaved [x, y, value] * count, 1/32767 scale
 *   us-retention.json  manifest: count, normalisation, per-state stats
 *
 * Deterministic: seeded PRNG, so rebuilds produce identical bytes.
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { feature } from 'topojson-client';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');

const TARGET_POINTS = 48_000;
/** Area exponent < 1 keeps small states legible instead of nearly empty. */
const AREA_EXPONENT = 0.8;
const INT16_MAX = 32_767;

const topo = JSON.parse(
  readFileSync(resolve(root, 'node_modules/us-atlas/states-albers-10m.json'), 'utf8'),
);
const retention = JSON.parse(
  readFileSync(resolve(root, 'data-src/retention-allgrades-by-state.json'), 'utf8'),
);

const states = feature(topo, topo.objects.states).features;

function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4_294_967_296;
  };
}

const random = mulberry32(20250913);

function ringArea(ring) {
  let sum = 0;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    sum += ring[j][0] * ring[i][1] - ring[i][0] * ring[j][1];
  }
  return Math.abs(sum) / 2;
}

/** Even-odd test across every ring, so holes punch out correctly. */
function insidePolygon(rings, x, y) {
  let inside = false;
  for (const ring of rings) {
    for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
      const [xi, yi] = ring[i];
      const [xj, yj] = ring[j];
      if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) {
        inside = !inside;
      }
    }
  }
  return inside;
}

function bounds(rings) {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const ring of rings) {
    for (const [x, y] of ring) {
      if (x < minX) minX = x;
      if (y < minY) minY = y;
      if (x > maxX) maxX = x;
      if (y > maxY) maxY = y;
    }
  }
  return { minX, minY, maxX, maxY };
}

/** Polygon and MultiPolygon both reduce to a list of ring-groups. */
function toPolygons(geometry) {
  if (!geometry) return [];
  if (geometry.type === 'Polygon') return [geometry.coordinates];
  if (geometry.type === 'MultiPolygon') return geometry.coordinates;
  return [];
}

const entries = [];
let worldMinX = Infinity;
let worldMinY = Infinity;
let worldMaxX = -Infinity;
let worldMaxY = -Infinity;
let missingData = [];

for (const state of states) {
  const name = state.properties?.name;
  const record = retention[name];
  if (!record) {
    missingData.push(name ?? state.id);
    continue;
  }
  const polygons = toPolygons(state.geometry);
  if (polygons.length === 0) continue;

  const area = polygons.reduce((sum, rings) => sum + ringArea(rings[0]), 0);
  for (const rings of polygons) {
    const box = bounds(rings);
    worldMinX = Math.min(worldMinX, box.minX);
    worldMinY = Math.min(worldMinY, box.minY);
    worldMaxX = Math.max(worldMaxX, box.maxX);
    worldMaxY = Math.max(worldMaxY, box.maxY);
  }

  entries.push({ name, total: record.total, area, polygons, weight: area ** AREA_EXPONENT });
}

if (entries.length === 0) throw new Error('no states matched the retention dataset');

const totalWeight = entries.reduce((sum, entry) => sum + entry.weight, 0);
const totals = entries.map((entry) => entry.total);
const logMin = Math.log10(Math.max(1, Math.min(...totals)));
const logMax = Math.log10(Math.max(...totals));

const spanX = worldMaxX - worldMinX;
const spanY = worldMaxY - worldMinY;
const span = Math.max(spanX, spanY);
const centerX = (worldMinX + worldMaxX) / 2;
const centerY = (worldMinY + worldMaxY) / 2;

/** Albers screen space to a centred [-1, 1] box, y flipped for WebGL. */
function normalise(x, y) {
  return [((x - centerX) / span) * 2, -(((y - centerY) / span) * 2)];
}

const coords = [];

for (const entry of entries) {
  const quota = Math.max(24, Math.round((entry.weight / totalWeight) * TARGET_POINTS));
  const value = (Math.log10(Math.max(1, entry.total)) - logMin) / (logMax - logMin);

  // Spread the quota over a state's polygons by area, then reject-sample each.
  const polyAreas = entry.polygons.map((rings) => ringArea(rings[0]));
  const polySum = polyAreas.reduce((sum, a) => sum + a, 0) || 1;

  entry.polygons.forEach((rings, index) => {
    const polyQuota = Math.round((polyAreas[index] / polySum) * quota);
    if (polyQuota <= 0) return;
    const box = bounds(rings);
    let placed = 0;
    let attempts = 0;
    const maxAttempts = polyQuota * 220 + 4000;
    while (placed < polyQuota && attempts < maxAttempts) {
      attempts += 1;
      const x = box.minX + random() * (box.maxX - box.minX);
      const y = box.minY + random() * (box.maxY - box.minY);
      if (!insidePolygon(rings, x, y)) continue;
      const [nx, ny] = normalise(x, y);
      coords.push(nx, ny, value);
      placed += 1;
    }
  });
}

const count = coords.length / 3;
const buffer = new Int16Array(count * 3);
for (let i = 0; i < count; i += 1) {
  buffer[i * 3] = Math.round(Math.max(-1, Math.min(1, coords[i * 3])) * INT16_MAX);
  buffer[i * 3 + 1] = Math.round(Math.max(-1, Math.min(1, coords[i * 3 + 1])) * INT16_MAX);
  buffer[i * 3 + 2] = Math.round(Math.max(0, Math.min(1, coords[i * 3 + 2])) * INT16_MAX);
}

const ranked = [...entries].sort((a, b) => b.total - a.total);
const manifest = {
  generatedBy: 'scripts/build-particle-data.mjs',
  source: 'NCES retention in grade, all grades (via dskong07/dsc106-US-education)',
  geometry: 'us-atlas states-albers-10m',
  count,
  stride: 3,
  encoding: 'int16',
  scale: INT16_MAX,
  aspect: spanX / spanY,
  totalRetained: retention['50 states, District of Columbia, and Puerto Rico']?.total ?? null,
  regionsPlotted: entries.length,
  valueScale: { kind: 'log10', min: logMin, max: logMax },
  top: ranked.slice(0, 5).map((entry) => ({ name: entry.name, total: entry.total })),
};

const outDir = resolve(root, 'public/data');
mkdirSync(outDir, { recursive: true });
writeFileSync(resolve(outDir, 'us-retention.bin'), Buffer.from(buffer.buffer));
writeFileSync(resolve(outDir, 'us-retention.json'), `${JSON.stringify(manifest, null, 2)}\n`);

const kb = (buffer.byteLength / 1024).toFixed(0);
console.log(`us-retention: ${count} points across ${entries.length} regions, ${kb} KB`);
if (missingData.length > 0) {
  console.log(`  no retention record for: ${missingData.join(', ')}`);
}
