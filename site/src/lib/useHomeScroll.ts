import { useEffect } from 'react';
import { fieldState } from '../three/fieldState';
import { prefersReducedMotion } from './capabilities';
import { gsap, ScrollTrigger } from './gsap';

interface HomeScrollOptions {
  /** Held until the loader curtain is gone. */
  enabled: boolean;
  /** Without the point cloud there is no map formation to morph into. */
  hasData: boolean;
}

const DESKTOP = '(min-width: 1024px)';
const MOBILE = '(max-width: 1023.98px)';

/**
 * Every scroll-driven animation on the home route. The 3D layer is driven
 * exclusively by tweening `fieldState`, never by React state.
 */
export function useHomeScroll({ enabled, hasData }: HomeScrollOptions): void {
  useEffect(() => {
    if (!enabled) return;

    // Reduced motion: FieldCanvas already rendered the formed still frame and
    // CSS shows every .reveal element, so there is nothing to animate.
    if (prefersReducedMotion()) {
      document.documentElement.classList.add('is-static');
      return () => document.documentElement.classList.remove('is-static');
    }

    const formTarget = hasData ? 1 : 0;

    const context = gsap.context(() => {
      // Hero entrance.
      const intro = gsap.timeline({ delay: 0.1 });
      intro
        .from('[data-hero-line]', {
          yPercent: 115,
          duration: 1.15,
          ease: 'expo.out',
          stagger: 0.075,
        })
        .from(
          '[data-hero-item]',
          { y: 20, opacity: 0, duration: 0.8, stagger: 0.09, ease: 'power3.out' },
          0.35,
        );

      // Hero copy drifts up and out as the field takes over.
      gsap.to('.hero-inner', {
        yPercent: -12,
        opacity: 0.1,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero',
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });

      // One cloud becomes the US retention formation. Starting at 70% keeps the
      // morph inside the data section rather than under the split headings.
      gsap.timeline({
        scrollTrigger: {
          trigger: '#track-ds',
          start: 'top 70%',
          end: 'top 15%',
          scrub: 1,
        },
      }).to(
        fieldState,
        { form: formTarget, flow: 0.12, dim: 0.85, cameraZ: 5.1, roll: 0.04, ease: 'none' },
        0,
      );

      // The DOM layer takes over for the engineering track onward.
      gsap.timeline({
        scrollTrigger: {
          trigger: '#track-swe',
          start: 'top 85%',
          end: 'top 25%',
          scrub: 1,
        },
      }).to(fieldState, { dim: 0.12, cameraZ: 6.1, roll: -0.03, ease: 'none' }, 0);

      // Generic reveals.
      ScrollTrigger.batch('.reveal', {
        start: 'top 88%',
        once: true,
        onEnter: (elements) =>
          gsap.to(elements, {
            opacity: 1,
            y: 0,
            duration: 0.85,
            ease: 'power3.out',
            stagger: 0.07,
            overwrite: true,
          }),
      });

      const media = gsap.matchMedia();

      media.add(DESKTOP, () => {
        // Pinned identity split: the single mass separates into two lobes.
        const split = gsap.timeline({
          scrollTrigger: {
            trigger: '.identity',
            start: 'top top',
            end: '+=140%',
            pin: '.identity-pin',
            anticipatePin: 1,
            scrub: 1,
          },
        });

        split
          .to(fieldState, { split: 1, flow: 0.6, cameraZ: 5.3, ease: 'none' }, 0)
          .from('[data-identity-card="ds"]', { xPercent: 34, opacity: 0, ease: 'none' }, 0)
          .from('[data-identity-card="swe"]', { xPercent: -34, opacity: 0, ease: 'none' }, 0)
          .fromTo('[data-identity-divider]', { scaleY: 0 }, { scaleY: 1, ease: 'none' }, 0)
          .to('[data-identity-caption]', { opacity: 0.3, ease: 'none' }, 0.55);

        // Pinned horizontal history.
        const track = document.querySelector<HTMLElement>('[data-timeline-track]');
        if (!track) return;

        const distance = () => Math.max(0, track.scrollWidth - window.innerWidth * 0.82);

        const history = gsap.timeline({
          scrollTrigger: {
            trigger: '.timeline',
            start: 'top top',
            end: () => `+=${distance() + window.innerHeight * 0.4}`,
            pin: '.timeline-pin',
            anticipatePin: 1,
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });

        history
          .to(track, { x: () => -distance(), ease: 'none' }, 0)
          .fromTo('[data-timeline-bar]', { scaleX: 0 }, { scaleX: 1, ease: 'none' }, 0);
      });

      media.add(MOBILE, () => {
        // No pinning on small screens: the split is a plain scrub, the history
        // section is a vertical list (CSS), and the field stays cheaper.
        gsap.timeline({
          scrollTrigger: {
            trigger: '.identity',
            start: 'top 80%',
            end: 'bottom 40%',
            scrub: 1,
          },
        }).to(fieldState, { split: 1, flow: 0.6, cameraZ: 5.6, ease: 'none' }, 0);
      });

      return () => media.revert();
    });

    ScrollTrigger.refresh();

    return () => context.revert();
  }, [enabled, hasData]);
}
