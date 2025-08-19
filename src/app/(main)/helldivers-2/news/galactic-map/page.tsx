// src/app/(main)/helldivers-2/news/galactic-map/page.tsx
import dynamic from 'next/dynamic';

const WarMap = dynamic(() => import('@/app/(main)/helldivers-2/news/galactic-map/WarMap'));

export default function GalacticMapPage() {
  return (
    <div className="content-section">
      <h1 className="content-section-title with-border-bottom">Galactic Map</h1>
      <section>
        <WarMap />
      </section>
    </div>
  );
}
