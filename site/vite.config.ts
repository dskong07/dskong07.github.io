import { copyFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig, type Plugin } from 'vite';
import { projects } from './src/content/projects';

const SITE_URL = 'https://dskong07.github.io';

/**
 * GitHub Pages serves 404.html for unknown paths, so shipping a copy of
 * index.html lets the client router handle /projects/* deep links on a hard
 * refresh. The sitemap is generated from the same project list the site
 * renders, so the two cannot drift.
 */
function staticExtras(): Plugin {
  return {
    name: 'static-extras',
    apply: 'build',

    // The loader curtain waits on document.fonts.ready, so the two woff2 files
    // sit on the critical path. Preload them instead of discovering them after
    // the stylesheet parses.
    transformIndexHtml: {
      order: 'post',
      handler(html, ctx) {
        // Only the latin subsets are ever requested; the rest are emitted with
        // a unicode-range that keeps the browser from fetching them.
        const fonts = Object.keys(ctx.bundle ?? {}).filter((name) =>
          /latin-wght-normal-[^/]*\.woff2$/.test(name),
        );
        if (fonts.length !== 2) {
          throw new Error(`expected 2 latin fonts to preload, found ${fonts.length}`);
        }
        if (fonts.length === 0) return html;
        const tags = fonts
          .map(
            (name) =>
              `    <link rel="preload" href="/${name}" as="font" type="font/woff2" crossorigin />`,
          )
          .join('\n');
        return html.replace('</head>', `${tags}\n  </head>`);
      },
    },

    closeBundle() {
      const dist = resolve(import.meta.dirname, 'dist');
      copyFileSync(resolve(dist, 'index.html'), resolve(dist, '404.html'));

      const routes = ['/', ...projects.map((project) => `/projects/${project.slug}`)];
      const urls = routes
        .map((route) => `  <url><loc>${SITE_URL}${route}</loc></url>`)
        .join('\n');
      writeFileSync(
        resolve(dist, 'sitemap.xml'),
        `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
      );
    },
  };
}

export default defineConfig({
  base: '/',
  plugins: [react(), staticExtras()],
  build: {
    target: 'es2020',
    assetsInlineLimit: 2048,
    // three is reached through a dynamic import in FieldCanvas, so Rollup
    // splits it out on its own; only gsap needs a manual chunk.
    rollupOptions: {
      output: {
        manualChunks: {
          gsap: ['gsap'],
        },
      },
    },
  },
});
