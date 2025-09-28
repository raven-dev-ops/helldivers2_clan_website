// src/app/leaderboard/page.tsx
import LeaderboardServer from '@/components/leaderboard/LeaderboardServer';
import base from '@/styles/Base.module.css';
import styles from '@/styles/LeaderboardPage.module.css';

export default function LeaderboardPage() {
  return (
    <div className={base.wrapper}>
      <div className={base.dividerLayer} />

      <main className={base.pageContainer} role="main" aria-label="Leaderboard">
        {/* Centered header */}
        <header className={styles.header} style={{ justifyContent: 'center', textAlign: 'center' }}>
          <div>
            <h1 className={styles.pageTitle}>Leaderboard</h1>
            <p className={styles.pageSubtitle}>Updated every 60s</p>
          </div>
        </header>

        {/* Centered controls (tabs + toolbar) */}
        <section className={styles.container} aria-label="Controls">
          <div
            className={styles.controls}
            style={{ justifyContent: 'center', width: '100%' }}
            aria-label="Leaderboard filters"
          >
            <div className={styles.tabs} role="tablist" aria-label="Scope">
              <button
                type="button"
                role="tab"
                aria-selected="true"
                className={`${styles.tab} ${styles.tabActive}`}
              >
                Month
              </button>
              <button type="button" role="tab" aria-selected="false" className={styles.tab}>
                Week
              </button>
              <button type="button" role="tab" aria-selected="false" className={styles.tab}>
                Day
              </button>
              <button type="button" role="tab" aria-selected="false" className={styles.tab}>
                Lifetime
              </button>
              <button type="button" role="tab" aria-selected="false" className={styles.tab}>
                Solo
              </button>
              <button type="button" role="tab" aria-selected="false" className={styles.tab}>
                Squad
              </button>
            </div>
          </div>

          {/* Card wrapper with centered toolbar */}
          <div className={styles.card} aria-label="Leaderboard results">
            <div
              className={styles.toolbar}
              style={{ justifyContent: 'center', gap: 12 }}
              role="group"
              aria-label="Search and sorting"
            >
              <input
                className={styles.search}
                placeholder="Search players…"
                aria-label="Search players"
              />
              <button
                type="button"
                className={styles.sortBtn}
                aria-pressed="true"
                aria-label="Sort by Kills descending"
              >
                Kills <i className={`${styles.sortIcon} ${styles.sortIconDesc}`} />
              </button>
              <button type="button" className={styles.sortBtn} aria-label="Sort by K/D">
                K/D
              </button>
              <button type="button" className={styles.sortBtn} aria-label="Sort by Missions">
                Missions
              </button>
            </div>

            {/* Table area */}
            <div className={styles.tableWrap}>
              <LeaderboardServer />
            </div>

            {/* Footer pager centered */}
            <footer className={styles.footer} style={{ justifyContent: 'center' }}>
              <nav className={styles.pager} aria-label="Pagination">
                <button type="button" className={styles.pageBtn} disabled>
                  Prev
                </button>
                <button type="button" className={styles.pageBtn}>
                  Next
                </button>
              </nav>
            </footer>
          </div>
        </section>
      </main>
    </div>
  );
}
