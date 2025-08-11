// src/app/(main)/helldivers-2/map/page.tsx
import dynamic from 'next/dynamic';

const WarMap = dynamic(() => import('@/app/(main)/helldivers-2/WarMap'), { ssr: false });

export default function MapPage() {
  return (
    <div className="content-section">
      <h1 className="content-section-title with-border-bottom">Galactic War Map</h1>
      <WarMap />
    </div>
  );
}