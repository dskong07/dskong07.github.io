/**
 * The single bag of normalised values that the scroll layer writes and the
 * WebGL layer reads once per frame. GSAP tweens this object directly, which
 * keeps scroll-driven 3D motion out of React's render path entirely.
 */
export interface FieldState {
  /** 0 = one cloud, 1 = two separated track lobes. */
  split: number;
  /** 0 = lobes, 1 = US retention map formation. */
  form: number;
  /** Flow-field amplitude. Drops as the formation locks in. */
  flow: number;
  /** Global opacity multiplier, raised when the DOM layer takes over. */
  dim: number;
  /** Camera distance in world units. */
  cameraZ: number;
  /** Extra roll applied to the whole field, radians. */
  roll: number;
  /** Pointer position in -1..1 clip space, smoothed in the renderer. */
  pointerX: number;
  pointerY: number;
}

export const fieldDefaults: FieldState = {
  split: 0,
  form: 0,
  flow: 1,
  dim: 1,
  cameraZ: 6.5,
  roll: 0,
  pointerX: 0,
  pointerY: 0,
};

export const fieldState: FieldState = { ...fieldDefaults };

export function resetFieldState(): void {
  Object.assign(fieldState, fieldDefaults);
}
