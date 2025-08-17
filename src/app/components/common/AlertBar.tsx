'use client';
import { useEffect, useRef, useState } from 'react';
import styles from './AlertBar.module.css';

interface LeaderboardRow {
  player_name: string;
  rank?: number;
}

export default function AlertBar() {
  const [messages, setMessages] = useState<string[]>([]);
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(false);
  const [closed, setClosed] = useState(false);
  const [durationSec, setDurationSec] = useState(60); // default slow

  const wrapperRef = useRef<HTMLDivElement>(null);
  const tickerRef = useRef<HTMLDivElement>(null);

  // Load alert messages once on mount
  useEffect(() => {
    async function load() {
      try {
        const [orderRes, lifetimeRes, monthRes, soloRes, meritRes] =
          await Promise.all([
            fetch('/api/war/major-orders', { cache: 'no-store' }),
            fetch('/api/helldivers/leaderboard?scope=lifetime&limit=50', {
              cache: 'no-store',
            }),
            fetch('/api/helldivers/leaderboard?scope=month&limit=50', {
              cache: 'no-store',
            }),
            fetch('/api/helldivers/leaderboard?scope=solo&limit=50', {
              cache: 'no-store',
            }),
            fetch('/api/merit/leaderboard?limit=50', { cache: 'no-store' }),
          ]);

        const orderData = orderRes.ok ? await orderRes.json() : null;
        const lifetimeData = lifetimeRes.ok ? await lifetimeRes.json() : null;
        const monthData = monthRes.ok ? await monthRes.json() : null;
        const soloData = soloRes.ok ? await soloRes.json() : null;
        const meritData = meritRes.ok ? await meritRes.json() : null;

        const order =
          orderData?.orders?.[0] || orderData?.data?.[0] || orderData?.[0];
        const orderTitle = order?.title || order?.text || '';
        const orderDesc = order?.description || order?.brief || '';
        const orderMsg = orderTitle
          ? `Major Order: ${orderTitle}${orderDesc ? ' - ' + orderDesc : ''}`
          : '';

        const stringifyTop = (
          d: { results?: LeaderboardRow[] } | null,
          label: string
        ) => {
          const rows: LeaderboardRow[] = Array.isArray(d?.results)
            ? d!.results
            : [];
          if (rows.length === 0) return '';
          const body = rows
            .slice(0, 50)
            .map((r, i) => `${r.rank ?? i + 1}. ${r.player_name}`)
            .join(', ');
          return `${label}: ${body}`;
        };

        const lifetimeMsg = stringifyTop(lifetimeData, 'Top 50 (Lifetime)');
        const monthMsg = stringifyTop(monthData, 'Top 50 (Monthly)');
        const soloMsg = stringifyTop(soloData, 'Top 50 (Solo)');
        const meritMsg = stringifyTop(meritData, 'Top 50 (Merit)');

        const parts: string[] = [];
        if (orderMsg) parts.push(orderMsg);
        if (lifetimeMsg) parts.push(lifetimeMsg);
        if (monthMsg) parts.push(monthMsg);
        if (soloMsg) parts.push(soloMsg);
        if (meritMsg) parts.push(meritMsg);

        setMessages(parts);
      } catch {
        // ignore errors
      }
    }

    load();
  }, []);

  // Show the bar every five minutes
  useEffect(() => {
    if (messages.length === 0 || closed) return;

    const startCycle = () => {
      setIndex(0);
      setVisible(true);
    };

    startCycle();
    const interval = setInterval(startCycle, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [messages, closed]);

  // Recompute duration for each message and on resize
  useEffect(() => {
    const compute = () => {
      const wrapperW = wrapperRef.current?.offsetWidth ?? 0;
      const contentW = tickerRef.current?.scrollWidth ?? 0;
      if (!wrapperW || !contentW) return;

      // Slower = smaller px/sec. Tweak if needed.
      const PX_PER_SEC = 35;
      const secs = Math.max(120, (wrapperW + contentW) / PX_PER_SEC); // min 40s for readability
      setDurationSec(secs);
    };

    // wait for DOM paint with the new keyed message
    const id = requestAnimationFrame(compute);
    window.addEventListener('resize', compute);
    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener('resize', compute);
    };
  }, [index, messages]);

  const handleAnimationEnd = () => {
    if (index < messages.length - 1) {
      setIndex((i) => i + 1);
    } else {
      setVisible(false);
    }
  };

  if (!visible || messages.length === 0 || closed) return null;

  const handleClose = () => {
    setVisible(false);
    setClosed(true);
  };

  return (
    <div
      className={styles.bar}
      role="status"
      style={{ ['--ticker-duration' as any]: `${durationSec}s` }} // consumed by CSS
    >
      <div className={styles.inner}>
        <div className={styles.tickerWrapper} ref={wrapperRef}>
          {/* Key forces animation restart each message */}
          <div
            key={index}
            className={styles.ticker}
            ref={tickerRef}
            onAnimationEnd={handleAnimationEnd}
          >
            {messages[index]}
          </div>
        </div>
        <button
          className={styles.close}
          onClick={handleClose}
          aria-label="Close alert"
        >
          ×
        </button>
      </div>
    </div>
  );
}
