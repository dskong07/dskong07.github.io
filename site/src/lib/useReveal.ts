import { useEffect } from 'react';
import { prefersReducedMotion } from './capabilities';
import { gsap, ScrollTrigger } from './gsap';

/** Batch reveal for routes that do not need the full home-page choreography. */
export function useReveal(key: string): void {
  useEffect(() => {
    if (prefersReducedMotion()) {
      document.documentElement.classList.add('is-static');
      return;
    }

    const context = gsap.context(() => {
      ScrollTrigger.batch('.reveal', {
        start: 'top 90%',
        once: true,
        onEnter: (elements) =>
          gsap.to(elements, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            stagger: 0.06,
            overwrite: true,
          }),
      });
    });

    ScrollTrigger.refresh();
    return () => context.revert();
  }, [key]);
}
