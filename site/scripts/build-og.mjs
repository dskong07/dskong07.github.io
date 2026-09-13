/**
 * Renders the 1200x630 social card into public/img/og.png. Committed output,
 * so this only needs rerunning when the headline changes.
 */
import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const here = dirname(fileURLToPath(import.meta.url));
const target = resolve(here, '../public/img/og.png');

const base = '#08090A';
const text = '#E9E9E7';
const muted = '#9BA2AC';
const accent = '#E4572E';
const trackDS = '#3DDC97';

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <radialGradient id="ds" cx="30%" cy="42%" r="38%">
      <stop offset="0%" stop-color="${trackDS}" stop-opacity="0.45" />
      <stop offset="100%" stop-color="${trackDS}" stop-opacity="0" />
    </radialGradient>
    <radialGradient id="swe" cx="70%" cy="58%" r="38%">
      <stop offset="0%" stop-color="${accent}" stop-opacity="0.5" />
      <stop offset="100%" stop-color="${accent}" stop-opacity="0" />
    </radialGradient>
  </defs>

  <rect width="1200" height="630" fill="${base}" />
  <rect width="1200" height="630" fill="url(#ds)" />
  <rect width="1200" height="630" fill="url(#swe)" />

  <text x="80" y="120" fill="${muted}" font-family="monospace" font-size="22" letter-spacing="3">
    DANIEL KONG — SAN DIEGO, CA
  </text>

  <text x="80" y="290" fill="${text}" font-family="sans-serif" font-size="88" font-weight="600">
    Data science
  </text>
  <text x="80" y="380" fill="${text}" font-family="sans-serif" font-size="88" font-weight="600">
    and the software
  </text>
  <text x="80" y="470" fill="${accent}" font-family="sans-serif" font-size="88" font-weight="600">
    it ships inside.
  </text>

  <text x="80" y="560" fill="${muted}" font-family="monospace" font-size="24" letter-spacing="2">
    dskong07.github.io
  </text>
</svg>`;

mkdirSync(dirname(target), { recursive: true });
const info = await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(target);
console.log(`og.png ${info.width}x${info.height}, ${Math.round(info.size / 1024)} KB`);
