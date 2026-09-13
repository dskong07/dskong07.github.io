import { useCallback, useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { Footer } from './components/Footer';
import { Loader } from './components/Loader';
import { Nav } from './components/Nav';
import { fontsReady, loadRetentionData, type RetentionData } from './lib/assetLoader';
import { prefersReducedMotion } from './lib/capabilities';
import { ScrollTrigger } from './lib/gsap';
import { useSmoothScroll } from './lib/useSmoothScroll';
import { Home } from './pages/Home';
import { NotFound } from './pages/NotFound';
import { ProjectPage } from './pages/ProjectPage';

function RouteEffects() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) return;
    window.scrollTo({ top: 0, behavior: 'auto' });
    ScrollTrigger.refresh();
  }, [pathname, hash]);

  return null;
}

export function App() {
  const [data, setData] = useState<RetentionData | null>(null);
  const [progress, setProgress] = useState(0);
  const [assetsSettled, setAssetsSettled] = useState(false);
  const [revealed, setRevealed] = useState(() => prefersReducedMotion());

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      const [result] = await Promise.all([
        loadRetentionData((fraction) => {
          if (!cancelled) setProgress(fraction);
        }).catch((error: unknown) => {
          console.warn('point cloud unavailable, falling back to procedural field', error);
          return null;
        }),
        fontsReady(),
      ]);

      if (cancelled) return;
      setData(result);
      setProgress(1);
      setAssetsSettled(true);
    };

    void run();
    return () => {
      cancelled = true;
    };
  }, []);

  const onLoaderDone = useCallback(() => setRevealed(true), []);
  useSmoothScroll(revealed);

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Loader progress={progress} ready={assetsSettled} onDone={onLoaderDone} />
      <RouteEffects />
      <Nav />
      <main id="main">
        <Routes>
          <Route path="/" element={<Home data={data} revealed={revealed} />} />
          <Route path="/projects/:slug" element={<ProjectPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}
