// src/app/(main)/helldivers-2/news/major-orders/page.tsx
import dynamic from 'next/dynamic';

const MajorOrders = dynamic(
  () => import('@/app/(main)/helldivers-2/news/major-orders/MajorOrders')
);

export default function MajorOrdersPage() {
  return (
    <div className="content-section">
      <h1 className="content-section-title with-border-bottom">Major Orders</h1>
      <section>
        <MajorOrders />
      </section>
    </div>
  );
}
