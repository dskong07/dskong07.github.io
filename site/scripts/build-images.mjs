/**
 * One-off image pipeline: takes the reusable screenshots from the previous
 * version of the site, resizes them to what the layout actually displays, and
 * writes WebP into public/img (which is committed, since the originals get
 * deleted at cutover).
 *
 * Run with `npm run images`. Missing sources are reported, not fatal.
 *
 * `public/img/ledger/cover.webp` is not listed here: it was captured from the
 * live app in demo mode, so refresh it by taking a new screenshot rather than
 * rerunning this script.
 */
import { copyFileSync, existsSync, mkdirSync, statSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const here = dirname(fileURLToPath(import.meta.url));
const siteRoot = resolve(here, '..');
const legacy = resolve(siteRoot, '..');
const outRoot = resolve(siteRoot, 'public/img');

/** [source relative to repo root, output relative to public/img, max width] */
const conversions = [
  ['assets/img/profile-long.png', 'profile.webp', 900],

  ['assets/img/flare portfolio/FLARE_logo.png', 'flare/logo.webp', 1200],
  ['assets/img/flare portfolio/double_seg.png', 'flare/segmentation.webp', 1600],
  ['assets/img/flare portfolio/model_examples.png', 'flare/model-examples.webp', 1600],
  ['assets/img/flare portfolio/labeling.png', 'flare/labeling.webp', 1600],
  ['assets/img/flare portfolio/scoring.png', 'flare/scoring.webp', 1600],
  ['assets/img/flare portfolio/flare_group.jpg', 'flare/team.webp', 1600],

  ['assets/img/education-portfolio/mainsite.png', 'retention/main.webp', 1600],
  ['assets/img/education-portfolio/sample_map_male_aa.png', 'retention/sample-male-aa.webp', 1600],
  [
    'assets/img/education-portfolio/sample_map_fem_hisp_middle.png',
    'retention/sample-fem-hisp-middle.webp',
    1600,
  ],

  ['assets/img/washington-portfolio/main.png', 'washington/main.webp', 1600],
  ['assets/img/washington-portfolio/heatmaps.png', 'washington/heatmaps.webp', 1600],
  ['assets/img/washington-portfolio/literacy.png', 'washington/literacy.webp', 1600],
];

/** Icons stay in their original format. */
const copies = [
  ['assets/img/favicon.png', 'favicon.png'],
  ['assets/img/apple-touch-icon.png', 'apple-touch-icon.png'],
];

const missing = [];
let writtenBytes = 0;
let sourceBytes = 0;

for (const [from, to] of copies) {
  const source = resolve(legacy, from);
  if (!existsSync(source)) {
    missing.push(from);
    continue;
  }
  const target = resolve(outRoot, to);
  mkdirSync(dirname(target), { recursive: true });
  copyFileSync(source, target);
}

for (const [from, to, width] of conversions) {
  const source = resolve(legacy, from);
  if (!existsSync(source)) {
    missing.push(from);
    continue;
  }

  const target = resolve(outRoot, to);
  mkdirSync(dirname(target), { recursive: true });

  await sharp(source)
    .resize({ width, withoutEnlargement: true })
    .webp({ quality: 82, effort: 5 })
    .toFile(target);

  sourceBytes += statSync(source).size;
  writtenBytes += statSync(target).size;
  console.log(`${to}  ${(statSync(target).size / 1024).toFixed(0)} KB`);
}

console.log(
  `\n${(sourceBytes / 1024 / 1024).toFixed(1)} MB source -> ${(writtenBytes / 1024).toFixed(0)} KB webp`,
);
if (missing.length > 0) {
  console.log(`missing sources (skipped):\n  ${missing.join('\n  ')}`);
}
