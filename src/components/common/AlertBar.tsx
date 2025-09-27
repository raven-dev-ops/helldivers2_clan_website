// src/components/common/AlertBar.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import styles from '@/styles/AlertBar.module.css';
import type { Alert } from '@/models/Alerts';

// Allow either `kind` (from our shared type) or legacy `variant`
type AlertLike = Alert & { variant?: string };

export default function AlertBar() {
  const [alerts, setAlerts] = useState<AlertLike[]>([]);
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
        const res = await fetch('/api/alerts', { cache: 'no-store' });
        const data = res.ok ? await res.json() : null;
        const list = Array.isArray(data?.alerts) ? (data.alerts as AlertLike[]) : [];
        setAlerts(list);
      } catch {
        // ignore errors
      }
    }

    load();
  }, []);

  // Show the bar every five minutes
  useEffect(() => {
    if (alerts.length === 0 || closed) return;

    const startCycle = () => {
      setIndex(0);
      setVisible(true);
    };

    startCycle();
    const interval = setInterval(startCycle, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [alerts, closed]);

  // Recompute duration for each message and on resize
  useEffect(() => {
    const compute = () => {
      const wrapperW = wrapperRef.current?.offsetWidth ?? 0;
      const contentW = tickerRef.current?.scrollWidth ?? 0;
      if (!wrapperW || !contentW) return;

      // Slower = smaller px/sec. Tweak if needed.
      const PX_PER_SEC = 35;
      const secs = Math.max(120, (wrapperW + contentW) / PX_PER_SEC); // min 120s for readability
      setDurationSec(secs);
    };

    // wait for DOM paint with the new keyed message
    const id = requestAnimationFrame(compute);
    window.addEventListener('resize', compute);
    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener('resize', compute);
    };
  }, [index, alerts]);

  const handleAnimationEnd = () => {
    if (index < alerts.length - 1) {
      setIndex((i) => i + 1);
    } else {
      setVisible(false);
    }
  };

  if (!visible || alerts.length === 0 || closed) return null;

  const handleClose = () => {
    setVisible(false);
    setClosed(true);
  };

  const current = alerts[index];
  // Prefer `variant`, fall back to `kind`, then a safe default
  const barVariant = current.variant ?? current.kind ?? 'purple';

  return (
    <div
      className={`${styles.bar} ${styles[`alertBar--${barVariant}`]}`}
      role="status"
      aria-live="polite"
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
            {/* If an href is provided, make the alert clickable */}
            {current.href ? (
              <a href={current.href} className={styles.link}>
                {current.message}
              </a>
            ) : (
              current.message
            )}
          </div>
        </div>
        {current.dismissible !== false && (
          <button
            className={styles.close}
            onClick={handleClose}
            aria-label="Close alert"
            type="button"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
}
