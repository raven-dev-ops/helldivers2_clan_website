"use client";
import { useEffect, useState } from "react";
import styles from "./AlertBar.module.css";

const MESSAGES = [
  "For Super Earth!",
  "Report to duty and earn merit!",
];

export default function AlertBar() {
  const [index, setIndex] = useState(0);
  const [isAlert, setIsAlert] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex(i => (i + 1) % MESSAGES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const poll = setInterval(async () => {
      try {
        const res = await fetch('/api/alerts', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          setIsAlert(Boolean(data.alert));
        }
      } catch {
        // ignore
      }
    }, 10000);
    return () => clearInterval(poll);
  }, []);

  return (
    <div className={`${styles.bar} ${isAlert ? styles.alert : ''}`} role="status">
      {MESSAGES[index]}
    </div>
  );
}
