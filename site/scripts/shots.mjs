/**
 * Visual QA pass. Walks the site in a headless browser at desktop and mobile
 * widths, writing screenshots to shots/ and reporting console errors plus any
 * horizontal overflow.
 *
 *   npm run preview        # in one terminal
 *   npm run shots          # in another
 *
 * Override the target with SHOTS_URL and the browser with CHROME_PATH.
 */
import { existsSync, mkdirSync, rmSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';

const here = dirname(fileURLToPath(import.meta.url));
const outDir = resolve(here, '../shots');
const baseUrl = process.env.SHOTS_URL ?? 'http://localhost:4173';

const candidates = [
  process.env.CHROME_PATH,
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
].filter(Boolean);

const executablePath = candidates.find((path) => existsSync(path));
if (!executablePath) throw new Error('no Chrome or Edge binary found; set CHROME_PATH');

rmSync(outDir, { recursive: true, force: true });
mkdirSync(outDir, { recursive: true });

const problems = [];
const wait = (ms) => new Promise((done) => setTimeout(done, ms));

const browser = await puppeteer.launch({
  executablePath,
  headless: 'new',
  args: ['--no-sandbox', '--force-device-scale-factor=1'],
});

const page = await browser.newPage();
page.on('console', (message) => {
  if (message.type() === 'error') problems.push(`console: ${message.text()}`);
});
page.on('pageerror', (error) => problems.push(`pageerror: ${error.message}`));

async function shot(name) {
  await page.screenshot({ path: resolve(outDir, `${name}.png`) });
}

async function checkOverflow(label) {
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - window.innerWidth,
  );
  if (overflow > 1) problems.push(`${label}: ${overflow}px horizontal overflow`);
}

/** Steps down the page in viewport-height increments, pausing for scrubs. */
async function walk(prefix, steps) {
  for (let i = 0; i < steps; i += 1) {
    await page.evaluate((index) => {
      window.scrollTo({ top: window.innerHeight * index * 0.85, behavior: 'instant' });
    }, i + 1);
    await wait(900);
    await shot(`${prefix}-${String(i + 1).padStart(2, '0')}`);
  }
}

// --- desktop -------------------------------------------------------------
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
await page.goto(`${baseUrl}/`, { waitUntil: 'networkidle2' });
await wait(600);
await shot('desktop-00-loader');
await wait(3200);
await shot('desktop-01-hero');
await checkOverflow('desktop home');

const canvasCount = await page.evaluate(() => document.querySelectorAll('canvas').length);
if (canvasCount !== 1) problems.push(`expected 1 canvas, found ${canvasCount}`);

const loaderGone = await page.evaluate(() => document.querySelector('.loader') === null);
if (!loaderGone) problems.push('loader curtain never unmounted');

await walk('desktop', 14);

// --- project detail ------------------------------------------------------
await page.goto(`${baseUrl}/projects/flare`, { waitUntil: 'networkidle2' });
await wait(1200);
await shot('detail-01-top');
await checkOverflow('project detail');

const brokenImages = await page.evaluate(() =>
  [...document.images].filter((img) => img.complete && img.naturalWidth === 0).map((img) => img.src),
);
if (brokenImages.length > 0) problems.push(`broken images: ${brokenImages.join(', ')}`);

await page.evaluate(() => window.scrollTo({ top: 2200, behavior: 'instant' }));
await wait(900);
await shot('detail-02-gallery');

// --- 404 -----------------------------------------------------------------
await page.goto(`${baseUrl}/projects/does-not-exist`, { waitUntil: 'networkidle2' });
await wait(800);
await shot('detail-03-missing');
const has404 = await page.evaluate(() => document.body.innerText.includes('does not exist'));
if (!has404) problems.push('404 route did not render the missing-page copy');

// --- mobile --------------------------------------------------------------
await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true });
await page.goto(`${baseUrl}/`, { waitUntil: 'networkidle2' });
await wait(3600);
await shot('mobile-01-hero');
await checkOverflow('mobile home');
await walk('mobile', 10);

await browser.close();

console.log(`screenshots written to ${outDir}`);
if (problems.length === 0) {
  console.log('no problems detected');
} else {
  console.log(`\n${problems.length} problem(s):`);
  for (const problem of problems) console.log(`  - ${problem}`);
}
