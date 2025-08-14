// src/app/(main)/helldivers-2/academy/apply/page.tsx
"use client";

import { useState, useEffect } from 'react';
import styles from '../../HelldiversPage.module.css';

export default function ApplyPage() {
  const [interest, setInterest] = useState('');
  const [about, setAbout] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const prompts = [
    'What does democracy mean to you in Helldivers 2?',
    'How would you handle disruptive players?',
    'Why do you want to become a moderator?',
    'Share a favorite Helldivers 2 tactic.',
  ];
  const [promptIndex, setPromptIndex] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setPromptIndex((p) => (p + 1) % prompts.length);
    }, 5000);
    return () => clearInterval(id);
  }, [prompts.length]);

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
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
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
          <div style={{ maxWidth: 560, flex: 1 }}>
            <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
              <iframe
                src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                title="Helldivers 2 Moderator Info"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
              />
            </div>
            <p className={styles.paragraph} style={{ marginTop: '0.5rem', minHeight: '3rem' }}>
              {prompts[promptIndex]}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
