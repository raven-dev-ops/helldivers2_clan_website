'use client';
import { useEffect, useRef, useState } from 'react';
import styles from './AlertBar.module.css';
import type { Alert } from '@/_types/alerts';

export default function AlertBar() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
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
        setAlerts(Array.isArray(data?.alerts) ? data.alerts : []);
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
  const barVariant = current.variant ?? 'purple';

  return (
    <div
      className={`${styles.bar} ${styles[`alertBar--${barVariant}`]}`}
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
            {current.message}
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
