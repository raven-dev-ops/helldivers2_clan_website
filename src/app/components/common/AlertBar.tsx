"use client";
import { useEffect, useState } from "react";
import styles from "./AlertBar.module.css";

interface LeaderboardRow {
  player_name: string;
}

export default function AlertBar() {
  const [message, setMessage] = useState("");

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

        const namesFrom = (d: any) => (d?.results || []).slice(0, 3).map((r: LeaderboardRow) => r.player_name).join(', ');
        const lifetimeMsg = namesFrom(lifetimeData);
        const monthMsg = namesFrom(monthData);
        const soloMsg = namesFrom(soloData);
        const meritMsg = namesFrom(meritData);

        const parts = [] as string[];
        if (orderMsg) parts.push(orderMsg);
        if (lifetimeMsg) parts.push(`Lifetime: ${lifetimeMsg}`);
        if (monthMsg) parts.push(`Monthly: ${monthMsg}`);
        if (soloMsg) parts.push(`Solo: ${soloMsg}`);
        if (meritMsg) parts.push(`Merit: ${meritMsg}`);

        setMessage(parts.join(' | '));
      } catch {
        // ignore errors
      }
    }

    load();
  }, []);

  return (
    <div className={styles.bar} role="status">
      <div className={styles.ticker}>{message}</div>
    </div>
  );
}

