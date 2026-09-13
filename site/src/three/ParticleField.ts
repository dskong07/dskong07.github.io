import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Color,
  PerspectiveCamera,
  Points,
  Scene,
  ShaderMaterial,
  Vector2,
  WebGLRenderer,
} from 'three';
import type { RetentionData } from '../lib/assetLoader';
import { tokens } from '../styles/tokens';
import { fieldState } from './fieldState';
import { particleFragmentShader, particleVertexShader } from './shaders/particles';

export interface ParticleFieldOptions {
  canvas: HTMLCanvasElement;
  count: number;
  /** True runs divergence-free curl noise; false runs the cheap 3-tap variant. */
  curl: boolean;
  data: RetentionData | null;
}

const MAP_SPREAD = 2.05;
const MAX_PIXEL_RATIO = 2;
const SLOW_FRAME_MS = 26;
const SLOW_FRAME_WINDOW = 150;

function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4_294_967_296;
  };
}

export class ParticleField {
  private readonly renderer: WebGLRenderer;
  private readonly scene = new Scene();
  private readonly camera: PerspectiveCamera;
  private readonly geometry = new BufferGeometry();
  private readonly material: ShaderMaterial;
  private readonly points: Points;
  private readonly canvas: HTMLCanvasElement;
  private readonly count: number;

  private frame = 0;
  private running = false;
  private visible = true;
  private lastTime = 0;
  private elapsed = 0;
  private readonly pointer = new Vector2(0, 0);
  private slowFrames = 0;
  private sampledFrames = 0;
  private degraded = false;
  private resizeObserver: ResizeObserver | null = null;
  private intersectionObserver: IntersectionObserver | null = null;

  constructor({ canvas, count, curl, data }: ParticleFieldOptions) {
    this.canvas = canvas;
    this.count = count;

    this.renderer = new WebGLRenderer({
      canvas,
      antialias: false,
      alpha: true,
      powerPreference: 'high-performance',
    });
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, MAX_PIXEL_RATIO));

    this.camera = new PerspectiveCamera(45, 1, 0.1, 100);
    this.camera.position.set(0, 0, fieldState.cameraZ);

    this.buildGeometry(data);

    this.material = new ShaderMaterial({
      vertexShader: particleVertexShader,
      fragmentShader: particleFragmentShader,
      defines: curl ? { FLOW_CURL: '' } : {},
      uniforms: {
        uTime: { value: 0 },
        uSplit: { value: 0 },
        uForm: { value: 0 },
        uFlow: { value: 1 },
        uDim: { value: 1 },
        uSize: { value: 18 },
        uPixelRatio: { value: this.renderer.getPixelRatio() },
        uPointer: { value: new Vector2(0, 0) },
        uColorIdle: { value: new Color(tokens.fieldIdle) },
        uColorDS: { value: new Color(tokens.trackDS) },
        uColorSWE: { value: new Color(tokens.accent) },
      },
      transparent: true,
      depthTest: false,
      depthWrite: false,
      blending: AdditiveBlending,
    });

    this.points = new Points(this.geometry, this.material);
    this.points.frustumCulled = false;
    this.scene.add(this.points);

    this.observe();
    this.resize();
  }

  private buildGeometry(data: RetentionData | null): void {
    const count = this.count;
    const random = mulberry32(0x5eed01);

    const home = new Float32Array(count * 3);
    const split = new Float32Array(count * 3);
    const map = new Float32Array(count * 3);
    const track = new Float32Array(count);
    const value = new Float32Array(count);
    const seed = new Float32Array(count);

    const dataCount = data ? data.manifest.count : 0;

    for (let i = 0; i < count; i += 1) {
      const i3 = i * 3;

      // Home: a dense elliptical disc, centre-weighted so it reads as one mass.
      const radius = random() ** 0.62;
      const theta = random() * Math.PI * 2;
      home[i3] = Math.cos(theta) * radius * 2.7;
      home[i3 + 1] = Math.sin(theta) * radius * 1.05;
      home[i3 + 2] = (random() * 2 - 1) * 0.95 * (1 - radius * 0.45);

      // Split: two lobes, one per track, equal size and mirrored.
      const isSWE = i % 2 === 1;
      track[i] = isSWE ? 1 : 0;
      const lobeRadius = random() ** (1 / 3);
      const u = random() * 2 - 1;
      const phi = random() * Math.PI * 2;
      const planar = Math.sqrt(Math.max(0, 1 - u * u));
      split[i3] = (isSWE ? 1.55 : -1.55) + Math.cos(phi) * planar * lobeRadius * 0.92;
      split[i3 + 1] = u * lobeRadius * 0.92;
      split[i3 + 2] = Math.sin(phi) * planar * lobeRadius * 0.7;

      // Map: real Albers-projected state coordinates, z lifted by data value.
      if (dataCount > 0 && data) {
        const source = (i % dataCount) * 3;
        const v = data.points[source + 2];
        map[i3] = data.points[source] * MAP_SPREAD + (random() - 0.5) * 0.012;
        map[i3 + 1] = data.points[source + 1] * MAP_SPREAD + (random() - 0.5) * 0.012;
        map[i3 + 2] = v * 0.34 - 0.17 + (random() - 0.5) * 0.02;
        value[i] = v;
      } else {
        // No dataset: the form morph becomes a no-op rather than a glitch.
        map[i3] = split[i3];
        map[i3 + 1] = split[i3 + 1];
        map[i3 + 2] = split[i3 + 2];
        value[i] = random();
      }

      seed[i] = random();
    }

    this.geometry.setAttribute('position', new BufferAttribute(home, 3));
    this.geometry.setAttribute('aSplit', new BufferAttribute(split, 3));
    this.geometry.setAttribute('aMap', new BufferAttribute(map, 3));
    this.geometry.setAttribute('aTrack', new BufferAttribute(track, 1));
    this.geometry.setAttribute('aValue', new BufferAttribute(value, 1));
    this.geometry.setAttribute('aSeed', new BufferAttribute(seed, 1));
  }

  private observe(): void {
    if (typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver(() => this.resize());
      this.resizeObserver.observe(this.canvas);
    } else {
      window.addEventListener('resize', this.onWindowResize);
    }

    if (typeof IntersectionObserver !== 'undefined') {
      this.intersectionObserver = new IntersectionObserver(
        (entries) => {
          this.visible = entries.some((entry) => entry.isIntersecting);
          if (this.visible && this.running) this.schedule();
        },
        { threshold: 0 },
      );
      this.intersectionObserver.observe(this.canvas);
    }

    document.addEventListener('visibilitychange', this.onVisibilityChange);
  }

  private onWindowResize = () => this.resize();

  private onVisibilityChange = () => {
    if (document.hidden) return;
    if (this.running) this.schedule();
  };

  resize(): void {
    const width = this.canvas.clientWidth || window.innerWidth;
    const height = this.canvas.clientHeight || window.innerHeight;
    this.renderer.setSize(width, height, false);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    const sizeScale = width < 700 ? 8 : width < 1100 ? 10 : 12;
    this.material.uniforms.uSize.value = sizeScale;
    this.material.uniforms.uPixelRatio.value = this.renderer.getPixelRatio();
    this.render();
  }

  setPointer(x: number, y: number): void {
    fieldState.pointerX = x;
    fieldState.pointerY = y;
  }

  start(): void {
    if (this.running) return;
    this.running = true;
    this.lastTime = performance.now();
    this.schedule();
  }

  stop(): void {
    this.running = false;
    if (this.frame) cancelAnimationFrame(this.frame);
    this.frame = 0;
  }

  private schedule(): void {
    if (this.frame) return;
    this.frame = requestAnimationFrame(this.tick);
  }

  private tick = (now: number) => {
    this.frame = 0;
    if (!this.running) return;

    const delta = Math.min(0.05, (now - this.lastTime) / 1000);
    this.lastTime = now;

    if (document.hidden || !this.visible) {
      // Idle: no rendering, but keep a slow heartbeat so we notice the return.
      window.setTimeout(() => this.schedule(), 250);
      return;
    }

    this.elapsed += delta;
    this.trackPerformance(delta);

    const uniforms = this.material.uniforms;
    uniforms.uTime.value = this.elapsed;
    uniforms.uSplit.value = fieldState.split;
    uniforms.uForm.value = fieldState.form;
    uniforms.uFlow.value = fieldState.flow;
    uniforms.uDim.value = fieldState.dim;

    this.pointer.x += (fieldState.pointerX - this.pointer.x) * 0.05;
    this.pointer.y += (fieldState.pointerY - this.pointer.y) * 0.05;
    (uniforms.uPointer.value as Vector2).set(this.pointer.x, this.pointer.y);

    this.camera.position.z += (fieldState.cameraZ - this.camera.position.z) * 0.08;
    this.points.rotation.z += (fieldState.roll - this.points.rotation.z) * 0.06;

    this.render();
    this.schedule();
  };

  /** One-shot degrade if the device cannot hold frame rate at this budget. */
  private trackPerformance(delta: number): void {
    if (this.degraded || this.sampledFrames > SLOW_FRAME_WINDOW * 2) return;
    this.sampledFrames += 1;
    if (delta * 1000 > SLOW_FRAME_MS) this.slowFrames += 1;
    if (this.sampledFrames < SLOW_FRAME_WINDOW) return;

    if (this.slowFrames > SLOW_FRAME_WINDOW * 0.4) {
      this.degraded = true;
      this.geometry.setDrawRange(0, Math.floor(this.count * 0.5));
      this.renderer.setPixelRatio(1);
      this.material.uniforms.uPixelRatio.value = 1;
      this.material.uniforms.uSize.value *= 1.25;
    }
  }

  render(): void {
    this.renderer.render(this.scene, this.camera);
  }

  dispose(): void {
    this.stop();
    this.resizeObserver?.disconnect();
    this.intersectionObserver?.disconnect();
    window.removeEventListener('resize', this.onWindowResize);
    document.removeEventListener('visibilitychange', this.onVisibilityChange);
    this.geometry.dispose();
    this.material.dispose();
    this.renderer.dispose();
  }
}
