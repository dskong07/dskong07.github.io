/**
 * Single source of truth for the palette. CSS consumes the mirrored custom
 * properties in `global.css`; the WebGL layer consumes these numbers directly.
 */
export const tokens = {
  base: '#08090A',
  surface: '#101214',
  surfaceAlt: '#17191C',
  hairline: 'hsl(220 6% 22%)',
  text: '#E9E9E7',
  textMuted: 'hsl(220 5% 62%)',
  accent: '#E4572E',
  trackDS: '#3DDC97',
  /** Neutral the particle field sits at before the tracks separate. */
  fieldIdle: '#9BA2AC',
} as const;

export type TrackId = 'ds' | 'swe' | 'both';

export const trackColor: Record<Exclude<TrackId, 'both'>, string> = {
  ds: tokens.trackDS,
  swe: tokens.accent,
};

/** `#RRGGBB` to linear-ish [r, g, b] in 0..1, for shader uniforms. */
export function hexToRgb(hex: string): [number, number, number] {
  const int = Number.parseInt(hex.replace('#', ''), 16);
  return [((int >> 16) & 255) / 255, ((int >> 8) & 255) / 255, (int & 255) / 255];
}
