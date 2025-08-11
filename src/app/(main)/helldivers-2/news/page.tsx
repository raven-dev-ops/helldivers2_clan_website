// src/app/(main)/helldivers-2/news/page.tsx
import dynamic from 'next/dynamic';

const NewsTicker = dynamic(() => import('@/app/(main)/helldivers-2/NewsTicker'));
const MajorOrders = dynamic(() => import('@/app/(main)/helldivers-2/MajorOrders'));
const WarMap = dynamic(() => import('@/app/(main)/helldivers-2/WarMap'));
const AcquisitionCenter = dynamic(() => import('@/app/(main)/helldivers-2/AcquisitionCenter'));

export default function NewsPage() {
  return (
    <div className="content-section">
      <h1 className="content-section-title with-border-bottom">News & Operations</h1>
      <section style={{ marginBottom: 24 }}>
        <NewsTicker />
      </section>
      <section style={{ marginBottom: 24 }}>
        <MajorOrders />
      </section>
      <section style={{ marginBottom: 24 }}>
        <WarMap />
      </section>
      <section style={{ marginBottom: 24 }}>
        <AcquisitionCenter />
      </section>
    </div>
  );
}