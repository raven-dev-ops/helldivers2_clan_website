// src/app/(main)/helldivers-2/news/super-store/page.tsx
import dynamic from 'next/dynamic';

const SuperStore = dynamic(
  () => import('@/app/(main)/helldivers-2/news/super-store/SuperStore')
);

export default function SuperStorePage() {
  return (
    <div className="content-section">
      <h1 className="content-section-title with-border-bottom">Super Store</h1>
      <section>
        <SuperStore />
      </section>
    </div>
  );
}
