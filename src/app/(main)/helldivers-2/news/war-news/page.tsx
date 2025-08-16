import dynamic from 'next/dynamic';

const NewsTicker = dynamic(() => import('@/app/(main)/helldivers-2/NewsTicker'), {
  ssr: false,
});

export default function WarNewsPage() {
  return (
    <div className="content-section">
      <h1 className="content-section-title with-border-bottom">War News</h1>
      <section>
        <NewsTicker />
      </section>
    </div>
  );
}
