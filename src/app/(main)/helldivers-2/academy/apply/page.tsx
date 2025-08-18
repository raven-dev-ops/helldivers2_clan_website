// src/app/(main)/helldivers-2/academy/apply/page.tsx
'use client';

import { useEffect, useMemo, useState } from 'react';
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
  }, []);

  const INTEREST_MAX = 600;
  const ABOUT_MAX = 600;

  const interestCount = useMemo(() => interest.length, [interest]);
  const aboutCount = useMemo(() => about.length, [about]);

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
        body: JSON.stringify({
          type: 'discord-moderator',
          interest,
          about,
          interviewAvailability,
        }),
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
        <div className={styles.applyHero}>
          <div className={styles.applyCopy}>
            <h2 className={styles.sectionTitle}>Join Now!</h2>
            <p className={styles.paragraph}>
              Help us keep comms clear, morale high, and missions efficient.
              Moderators set the tone for Managed Democracy—on and off the field.
            </p>

            <div className={styles.badgeRow}>
              <span className={styles.badge}>Clear Comms</span>
              <span className={styles.badge}>Team First</span>
              <span className={styles.badge}>Calm Under Fire</span>
              <span className={styles.badge}>Fair & Consistent</span>
            </div>

            <ul className={styles.tipsList}>
              <li>Model good conduct and de-escalate conflicts quickly.</li>
              <li>Support new recruits and keep events running smoothly.</li>
              <li>Document incidents and follow server guidelines.</li>
            </ul>
          </div>

          {/* RIGHT: centered video + prompt */}
          <div className={styles.videoSection}>
            <div className={styles.videoWrapper}>
              <iframe
                src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                title="Helldivers 2 Moderator Info"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className={styles.videoFrame}
              />
            </div>

            <div className={styles.promptPanel}>
              <div className={styles.promptHeading}>Think on this</div>
              <p className={styles.promptText} aria-live="polite">
                {prompts[promptIndex]}
              </p>
              <p className={styles.promptHint}>
                Interviews are scheduled in your local time. Bring examples!
              </p>
            </div>
          </div>
        </div>

        <div className={styles.applyLayout}>
          <form onSubmit={handleSubmit} className={styles.applicationForm} aria-describedby="apply-help">
            <p id="apply-help" className={styles.formHelper}>
              Short, specific answers beat long essays. You can elaborate during the interview.
            </p>

            <label className={styles.fieldLabel}>
              Why are you interested in becoming a moderator?
              <textarea
                value={interest}
                onChange={(e) => setInterest(e.target.value.slice(0, INTEREST_MAX))}
                required
                className={styles.input}
                rows={4}
                aria-describedby="interest-count"
                placeholder="What motivates you? What strengths do you bring to the team?"
              />
              <span id="interest-count" className={styles.charCount}>
                {interestCount}/{INTEREST_MAX}
              </span>
            </label>

            <label className={styles.fieldLabel}>
              Tell us about yourself
              <textarea
                value={about}
                onChange={(e) => setAbout(e.target.value.slice(0, ABOUT_MAX))}
                required
                className={styles.input}
                rows={4}
                aria-describedby="about-count"
                placeholder="Brief background, moderation or leadership experience, availability."
              />
              <span id="about-count" className={styles.charCount}>
                {aboutCount}/{ABOUT_MAX}
              </span>
            </label>

            <div className={styles.row2}>
              <label className={styles.fieldLabel}>
                Interview Date
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  className={styles.input}
                />
              </label>

              <label className={styles.fieldLabel}>
                Interview Time
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  required
                  className={styles.input}
                />
              </label>
            </div>

            {error && (
              <p className={styles.formError} role="alert">
                {error}
              </p>
            )}
            {message && (
              <p className={styles.formSuccess} role="status" aria-live="polite">
                {message}
              </p>
            )}

            <div className={styles.ctaRow}>
              <button type="submit" disabled={submitting} className={styles.applyButton}>
                {submitting ? 'Submitting…' : 'Submit Application'}
              </button>
              <button
                type="button"
                className={styles.secondaryButton}
                onClick={() => {
                  setInterest('');
                  setAbout('');
                  setDate('');
                  setTime('');
                }}
              >
                Clear Form
              </button>
            </div>

            <p className={styles.privacyNote}>
              We only use this information to evaluate your application and schedule an interview.
            </p>
          </form>
        </div>
      </section>
    </div>
  );
}
