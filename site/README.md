# dskong07.github.io

Personal site: React + TypeScript on Vite, GSAP ScrollTrigger for the scroll
narrative, and a Three.js point cloud built from real data.

## Commands

```bash
npm install
npm run dev        # regenerates the point cloud, then serves on :5173
npm run build      # typecheck + production build into dist/
npm run preview    # serve dist/
npm run data       # regenerate public/data/ only
npm run images     # re-derive public/img/ from the legacy assets/ folder
npm run og         # regenerate the social card
npm run shots      # visual QA: walks the site headless, writes shots/
```

`npm run shots` needs `npm run preview` running in another terminal. It reports
console errors, broken images, and horizontal overflow at desktop and mobile
widths, and leaves screenshots in `shots/` for eyeballing motion states.

## Layout

```
data-src/            committed source data (see data-src/README.md)
public/data/         generated point cloud, gitignored, rebuilt by prebuild
public/img/          committed WebP assets
scripts/             build-time data and image pipelines
src/content/         all copy and resume data as typed modules
src/components/      layout chrome plus one file per page section
src/lib/             capabilities probes, GSAP setup, scroll choreography
src/three/           particle field, shaders, and the shared field state
src/styles/          design tokens mirrored into CSS custom properties
```

## How the scroll narrative works

`src/three/fieldState.ts` holds one plain object of normalised values.
`src/lib/useHomeScroll.ts` tweens that object with ScrollTrigger, and
`ParticleField` reads it once per frame. The 3D layer never touches React state.

Stages, in order: one cloud, two track lobes, then a map of US grade-retention
data, then the field dims and the DOM layer takes over.

## Editing content

Everything readable on the site lives in `src/content/`. Adding a role means one
entry in `experience.ts`; adding a project means one entry in `projects.ts`,
which creates its own `/projects/<slug>` page.

## Degradation

| Condition | Behaviour |
| --- | --- |
| `prefers-reduced-motion` | No loader curtain, no smooth scroll, no pinning; the field renders one still frame of the formed map |
| No WebGL, under 4 GB RAM, or 2 cores | Canvas falls back to a CSS gradient; all content unchanged |
| Under 1024px | Nothing pins; the career timeline becomes a vertical list |
| Sustained slow frames | Point count halves and pixel ratio drops to 1, once |
| JavaScript off | `noscript` block with contact details |

## Deploy

`.github/workflows/deploy.yml` builds `site/` and publishes `site/dist` to
GitHub Pages on every push to `main`. Repo Settings > Pages > Source must be
set to **GitHub Actions**. `404.html` is a copy of `index.html` so client-routed
deep links survive a hard refresh.
