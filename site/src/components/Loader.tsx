import { useEffect, useRef, useState } from 'react';
import { prefersReducedMotion } from '../lib/capabilities';
import { gsap } from '../lib/gsap';

interface LoaderProps {
  /** Real fraction of bytes loaded, 0..1. */
  progress: number;
  ready: boolean;
  onDone: () => void;
}

const PANEL_COUNT = 4;

export function Loader({ progress, ready, onDone }: LoaderProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(() => !prefersReducedMotion());
  const displayedRef = useRef(0);
  const [displayed, setDisplayed] = useState(0);
  const doneRef = useRef(false);

  // Reduced motion skips the whole curtain.
  useEffect(() => {
    if (prefersReducedMotion() && !doneRef.current) {
      doneRef.current = true;
      setShown(false);
      onDone();
    }
  }, [onDone]);

  // Ease the counter toward the real value; it never runs ahead of the bytes.
  useEffect(() => {
    if (!shown) return;
    let frame = 0;
    const tick = () => {
      const target = progress * 100;
      const next = displayedRef.current + (target - displayedRef.current) * 0.12;
      displayedRef.current = Math.abs(target - next) < 0.4 ? target : next;
      setDisplayed(displayedRef.current);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [progress, shown]);

  // Single boolean gate: the exit effect must not re-run while the counter is
  // still ticking, or its cleanup would kill the curtain mid-animation.
  const canExit = shown && ready && displayed >= 99.4;

  useEffect(() => {
    if (!canExit || doneRef.current) return;

    doneRef.current = true;
    const root = rootRef.current;
    if (!root) {
      setShown(false);
      onDone();
      return;
    }

    const panels = root.querySelectorAll<HTMLElement>('[data-panel]');
    const timeline = gsap.timeline({
      onComplete: () => {
        setShown(false);
        onDone();
      },
    });

    timeline
      .to(root.querySelector('[data-loader-meta]'), { opacity: 0, duration: 0.3 })
      .to(panels, { yPercent: -100, duration: 0.85, ease: 'expo.inOut', stagger: 0.06 }, 0.15)
      .set(root, { pointerEvents: 'none' }, 0.15);
  }, [canExit, onDone]);

  if (!shown) return null;

  return (
    <div className="loader" ref={rootRef} role="status" aria-live="polite">
      <div className="loader-panels" aria-hidden="true">
        {Array.from({ length: PANEL_COUNT }, (_, index) => (
          <span className="loader-panel" data-panel key={index} />
        ))}
      </div>
      <div className="loader-meta" data-loader-meta>
        <span className="mono muted">Daniel Kong</span>
        <span className="loader-count">{String(Math.round(displayed)).padStart(3, '0')}</span>
        <span className="mono muted">
          {progress < 1 || displayed < 99 ? 'loading retention point cloud' : 'compiling shaders'}
        </span>
        <span className="loader-bar">
          <span className="loader-bar-fill" style={{ transform: `scaleX(${progress})` }} />
        </span>
      </div>
    </div>
  );
}
