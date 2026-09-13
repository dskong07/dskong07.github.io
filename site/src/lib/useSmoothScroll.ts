import Lenis from 'lenis';
import { useEffect, useRef } from 'react';
import { prefersReducedMotion } from './capabilities';
import { gsap, ScrollTrigger } from './gsap';

/**
 * Drives Lenis from the GSAP ticker so smooth scroll and ScrollTrigger share
 * one clock. Disabled outright under prefers-reduced-motion.
 */
export function useSmoothScroll(enabled: boolean): void {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (!enabled || prefersReducedMotion()) return;

    const lenis = new Lenis({
      duration: 1.05,
      wheelMultiplier: 1,
      touchMultiplier: 1.6,
      smoothWheel: true,
    });
    lenisRef.current = lenis;

    const onScroll = () => ScrollTrigger.update();
    lenis.on('scroll', onScroll);

    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      gsap.ticker.lagSmoothing(500, 33);
      lenis.off('scroll', onScroll);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [enabled]);
}
