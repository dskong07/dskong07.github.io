import { FieldCanvas } from '../components/FieldCanvas';
import { About } from '../components/sections/About';
import { Contact } from '../components/sections/Contact';
import { Hero } from '../components/sections/Hero';
import { IdentitySplit } from '../components/sections/IdentitySplit';
import { Skills } from '../components/sections/Skills';
import { Timeline } from '../components/sections/Timeline';
import { TrackDS } from '../components/sections/TrackDS';
import { TrackSWE } from '../components/sections/TrackSWE';
import { Work } from '../components/sections/Work';
import type { RetentionData } from '../lib/assetLoader';
import { useHomeScroll } from '../lib/useHomeScroll';

interface HomeProps {
  data: RetentionData | null;
  revealed: boolean;
}

export function Home({ data, revealed }: HomeProps) {
  useHomeScroll({ enabled: revealed, hasData: data !== null });

  return (
    <div className="home">
      <FieldCanvas active={revealed} data={data} />
      <Hero />
      <IdentitySplit />
      <TrackDS data={data} />
      <TrackSWE />
      <Timeline />
      <Work />
      <About />
      <Skills />
      <Contact />
    </div>
  );
}
