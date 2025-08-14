// src/app/(main)/helldivers-2/news/page.tsx
import dynamic from 'next/dynamic';

const NewsTicker = dynamic(() => import('@/app/(main)/helldivers-2/NewsTicker'));
const MajorOrders = dynamic(() => import('@/app/(main)/helldivers-2/MajorOrders'));
const WarMap = dynamic(() => import('@/app/(main)/helldivers-2/WarMap'));
const SuperStore = dynamic(() => import('@/app/(main)/helldivers-2/SuperStore'));

export default function NewsPage() {
  return (
    <div className="content-section">
      <h1 className="content-section-title with-border-bottom">Operations</h1>
      <section id="war-news" style={{ marginBottom: 24 }}>
        <NewsTicker />
      </section>
      <section id="major-orders" style={{ marginBottom: 24 }}>
        <MajorOrders />
      </section>
      <section id="galactic-map" style={{ marginBottom: 24 }}>
        <WarMap />
      </section>
      <section id="super-store" style={{ marginBottom: 24 }}>
        <h2 className="content-section-title with-border-bottom">Super Store</h2>
        <SuperStore />
      </section>
    </div>
  );
}