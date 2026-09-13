/** Device and user-preference probes. All are safe to call during render. */

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

export function prefersReducedMotion(): boolean {
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

export function onReducedMotionChange(handler: (reduced: boolean) => void): () => void {
  const mql = window.matchMedia(REDUCED_MOTION_QUERY);
  const listener = (event: MediaQueryListEvent) => handler(event.matches);
  mql.addEventListener('change', listener);
  return () => mql.removeEventListener('change', listener);
}

let webglSupport: boolean | null = null;

export function supportsWebgl(): boolean {
  if (webglSupport !== null) return webglSupport;
  try {
    const canvas = document.createElement('canvas');
    const gl =
      canvas.getContext('webgl2') ??
      canvas.getContext('webgl') ??
      canvas.getContext('experimental-webgl');
    webglSupport = gl !== null;
    if (gl && 'getExtension' in gl) {
      (gl as WebGLRenderingContext).getExtension('WEBGL_lose_context')?.loseContext();
    }
  } catch {
    webglSupport = false;
  }
  return webglSupport;
}

interface DeviceNavigator extends Navigator {
  deviceMemory?: number;
}

/** Coarse tiers: anything below `full` gets fewer particles or no canvas at all. */
export type RenderTier = 'none' | 'low' | 'mid' | 'full';

export function renderTier(): RenderTier {
  if (!supportsWebgl()) return 'none';

  const nav = navigator as DeviceNavigator;
  const memory = nav.deviceMemory ?? 8;
  const cores = nav.hardwareConcurrency ?? 8;
  const width = window.innerWidth;

  if (memory < 4 || cores <= 2) return 'none';
  if (width < 768) return 'low';
  if (width < 1200 || memory < 8) return 'mid';
  return 'full';
}

export function particleCount(tier: RenderTier): number {
  switch (tier) {
    case 'full':
      return 150_000;
    case 'mid':
      return 90_000;
    case 'low':
      return 40_000;
    default:
      return 0;
  }
}

export const DESKTOP_QUERY = '(min-width: 1024px)';

export function isDesktopViewport(): boolean {
  return window.matchMedia(DESKTOP_QUERY).matches;
}
