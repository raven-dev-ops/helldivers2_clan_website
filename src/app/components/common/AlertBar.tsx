"use client";
import { useEffect, useState } from "react";
import styles from "./AlertBar.module.css";

interface LeaderboardRow {
  player_name: string;
  rank?: number;
}

export default function AlertBar() {
  const [messages, setMessages] = useState<string[]>([]);
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(false);
  const [closed, setClosed] = useState(false);

  // Load alert messages once on mount
  useEffect(() => {
    async function load() {
      try {
        const [orderRes, lifetimeRes, monthRes, soloRes, meritRes] = await Promise.all([
          fetch('/api/war/major-orders', { cache: 'no-store' }),
          fetch('/api/helldivers/leaderboard?scope=lifetime&limit=3', { cache: 'no-store' }),
          fetch('/api/helldivers/leaderboard?scope=month&limit=3', { cache: 'no-store' }),
          fetch('/api/helldivers/leaderboard?scope=solo&limit=3', { cache: 'no-store' }),
          fetch('/api/merit/leaderboard', { cache: 'no-store' })
        ]);

        const orderData = orderRes.ok ? await orderRes.json() : null;
        const lifetimeData = lifetimeRes.ok ? await lifetimeRes.json() : null;
        const monthData = monthRes.ok ? await monthRes.json() : null;
        const soloData = soloRes.ok ? await soloRes.json() : null;
        const meritData = meritRes.ok ? await meritRes.json() : null;

        const order = orderData?.orders?.[0] || orderData?.data?.[0] || orderData?.[0];
        const orderTitle = order?.title || order?.text || "";
        const orderDesc = order?.description || order?.brief || "";
        const orderMsg = orderTitle ? `Major Order: ${orderTitle}${orderDesc ? ' - ' + orderDesc : ''}` : '';

        const namesFrom = (d: { results?: LeaderboardRow[] } | null) =>
          (d?.results ?? [])
            .slice(0, 3)
            .map((r: LeaderboardRow, i: number) => `${r.rank ?? i + 1}. ${r.player_name}`)
            .join(', ');
        const lifetimeMsg = namesFrom(lifetimeData);
        const monthMsg = namesFrom(monthData);
        const soloMsg = namesFrom(soloData);
        const meritMsg = namesFrom(meritData);

        const parts: string[] = [];
        if (orderMsg) parts.push(orderMsg);
        if (lifetimeMsg) parts.push(`Lifetime: ${lifetimeMsg}`);
        if (monthMsg) parts.push(`Monthly: ${monthMsg}`);
        if (soloMsg) parts.push(`Solo: ${soloMsg}`);
        if (meritMsg) parts.push(`Merit: ${meritMsg}`);

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
    <div className={styles.bar} role="status">
      <div className={styles.inner}>
        <div className={styles.tickerWrapper}>
          <div key={index} className={styles.ticker} onAnimationEnd={handleAnimationEnd}>
            {messages[index]}
          </div>
        </div>
        <button className={styles.close} onClick={handleClose} aria-label="Close alert">
          ×
        </button>
      </div>
    </div>
  );
}

