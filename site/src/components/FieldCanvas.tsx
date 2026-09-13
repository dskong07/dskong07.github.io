import { useEffect, useRef } from 'react';
import type { RetentionData } from '../lib/assetLoader';
import { particleCount, prefersReducedMotion, renderTier } from '../lib/capabilities';
import type { ParticleField } from '../three/ParticleField';
import { fieldState } from '../three/fieldState';

interface FieldCanvasProps {
  data: RetentionData | null;
  /** Held false until the loader curtain is gone, so nothing renders behind it. */
  active: boolean;
}

/**
 * Fixed full-viewport canvas beneath the DOM layer. Three states: animated
 * (default), one static formed frame (reduced motion), and a CSS-only gradient
 * (no usable WebGL). Three.js is imported lazily so it stays out of the
 * first-paint bundle.
 */
export function FieldCanvas({ data, active }: FieldCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const tier = renderTier();
    if (tier === 'none') {
      canvas.dataset.fallback = 'css';
      return;
    }

    let disposed = false;
    let field: ParticleField | null = null;
    let onPointerMove: ((event: PointerEvent) => void) | null = null;

    const setup = async () => {
      const reduced = prefersReducedMotion();

      try {
        const { ParticleField: Field } = await import('../three/ParticleField');
        if (disposed) return;

        field = new Field({
          canvas,
          count: particleCount(tier),
          curl: tier === 'full' && !reduced,
          data,
        });
      } catch (error) {
        console.warn('WebGL field unavailable, using CSS gradient', error);
        canvas.dataset.fallback = 'css';
        return;
      }

      if (reduced) {
        // Show the end state of the narrative as a single still frame.
        fieldState.split = 1;
        fieldState.form = data ? 1 : 0;
        fieldState.flow = 0.04;
        fieldState.cameraZ = 4.2;
        field.render();
        return;
      }

      field.start();

      const activeField = field;
      onPointerMove = (event: PointerEvent) => {
        activeField.setPointer(
          (event.clientX / window.innerWidth) * 2 - 1,
          -((event.clientY / window.innerHeight) * 2 - 1),
        );
      };
      window.addEventListener('pointermove', onPointerMove, { passive: true });
    };

    void setup();

    return () => {
      disposed = true;
      if (onPointerMove) window.removeEventListener('pointermove', onPointerMove);
      field?.dispose();
      field = null;
    };
  }, [active, data]);

  return (
    <div className="field" aria-hidden="true">
      <canvas className="field-canvas" ref={canvasRef} />
      <div className="field-vignette" />
    </div>
  );
}
