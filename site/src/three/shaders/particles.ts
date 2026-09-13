import { simplexNoise } from './noise';

export const particleVertexShader = /* glsl */ `
precision highp float;

attribute vec3 aSplit;
attribute vec3 aMap;
attribute float aTrack;
attribute float aValue;
attribute float aSeed;

uniform float uTime;
uniform float uSplit;
uniform float uForm;
uniform float uFlow;
uniform float uDim;
uniform float uSize;
uniform float uPixelRatio;
uniform vec2 uPointer;

varying float vTrack;
varying float vValue;
varying float vAlpha;
varying float vSeed;

${simplexNoise}

void main() {
  // Two sequential morphs: one cloud -> two track lobes -> data formation.
  vec3 p = mix(position, aSplit, uSplit);
  p = mix(p, aMap, uForm);

  // Flow advection. Amplitude collapses as a formation locks in so the data
  // stays readable, and each particle keeps its own scale for depth.
  float drift = uTime * 0.05;
  // Do not name this "sample": reserved word in GLSL ES 3.0.
  vec3 noiseAt = p * 0.6 + vec3(drift, drift * 0.7, drift * 1.3);
  vec3 flow = flowField(noiseAt);
  p += flow * uFlow * (0.16 + aSeed * 0.18);

  // Pointer parallax, weaker once the map is formed.
  p.xy += uPointer * (0.05 + aSeed * 0.06) * (1.0 - uForm * 0.65);

  vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mvPosition;

  float perspective = 1.0 / max(0.35, -mvPosition.z);
  gl_PointSize = uSize * uPixelRatio * perspective * (0.55 + aSeed * 0.9);

  vTrack = aTrack;
  vValue = aValue;
  vSeed = aSeed;

  // Additive blending over 150k points blows out fast, so per-point alpha
  // stays low and legibility is bought back with uDim per section.
  float idleAlpha = 0.06 + aSeed * 0.16;
  float dataAlpha = 0.10 + aValue * 0.30;
  vAlpha = uDim * mix(idleAlpha, dataAlpha, uForm);
}
`;

export const particleFragmentShader = /* glsl */ `
precision highp float;

uniform vec3 uColorIdle;
uniform vec3 uColorDS;
uniform vec3 uColorSWE;
uniform float uSplit;
uniform float uForm;

varying float vTrack;
varying float vValue;
varying float vAlpha;
varying float vSeed;

void main() {
  vec2 offset = gl_PointCoord - 0.5;
  float radius = dot(offset, offset) * 4.0;
  float falloff = exp(-radius * 2.6);
  if (falloff < 0.02) discard;

  vec3 trackColor = mix(uColorDS, uColorSWE, vTrack);
  // Data ramp reuses the two track hues: cool at the low end, hot at the high.
  vec3 dataColor = mix(uColorDS, uColorSWE, smoothstep(0.15, 0.95, vValue));

  vec3 color = mix(uColorIdle, trackColor, uSplit * 0.85);
  color = mix(color, dataColor, uForm);
  color += vSeed * 0.06;

  gl_FragColor = vec4(color, falloff * vAlpha);
}
`;
