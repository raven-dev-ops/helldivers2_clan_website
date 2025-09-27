import NewsTicker from '@/app/news/war-news/NewsTicker';

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
