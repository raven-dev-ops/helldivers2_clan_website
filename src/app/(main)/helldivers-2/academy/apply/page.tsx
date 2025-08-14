// src/app/(main)/helldivers-2/academy/apply/page.tsx
"use client";

import { useState } from 'react';
import styles from '../../HelldiversPage.module.css';

export default function ApplyPage() {
  const [interest, setInterest] = useState('');
  const [about, setAbout] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);
    setError(null);
    try {
      const interviewAvailability = new Date(`${date}T${time}`);
      const res = await fetch('/api/user-applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'discord-moderator', interest, about, interviewAvailability }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to submit');
      setMessage(data.message || 'Application submitted');
      setInterest('');
      setAbout('');
      setDate('');
      setTime('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.pageContainer}>
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Join Now!</h2>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem', maxWidth: 400 }}>
          <label className={styles.paragraph} style={{ display: 'grid', gap: 4 }}>
            Why are you interested in becoming a moderator?
            <textarea value={interest} onChange={e => setInterest(e.target.value)} required className={styles.input} rows={3} />
          </label>
          <label className={styles.paragraph} style={{ display: 'grid', gap: 4 }}>
            Tell us about yourself
            <textarea value={about} onChange={e => setAbout(e.target.value)} required className={styles.input} rows={3} />
          </label>
          <label className={styles.paragraph} style={{ display: 'grid', gap: 4 }}>
            Interview Date
            <input type="date" value={date} onChange={e => setDate(e.target.value)} required className={styles.input} />
          </label>
          <label className={styles.paragraph} style={{ display: 'grid', gap: 4 }}>
            Interview Time
            <input type="time" value={time} onChange={e => setTime(e.target.value)} required className={styles.input} />
          </label>
          {error && <p className={styles.paragraph} style={{ color: '#dc2626' }}>{error}</p>}
          {message && <p className={styles.paragraph} style={{ color: '#16a34a' }}>{message}</p>}
          <button type="submit" disabled={submitting} style={{ padding: '0.5rem 1rem', background: '#facc15', color: '#000', borderRadius: 4 }}>
            {submitting ? 'Submitting...' : 'Submit Application'}
          </button>
        </form>
      </section>
    </div>
  );
}
