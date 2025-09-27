// src/app/challenges/page.tsx

'use client';

import { useMemo, useState, type CSSProperties } from 'react';

type ChallengeLevelLite = {
  id: string;           // e.g., "level-1"
  levelTitle: string;   // e.g., "JH1 Sabotage Proficiency"
};

type SubmitChallengeModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmitted: (msg: string) => void;   // match campaign modal signature
  levels: ChallengeLevelLite[];         // ← add levels prop (what your page passes)
};

function parseLevelNumber(id: string): number | null {
  const parts = id.split('-');
  const n = Number(parts[1]);
  return Number.isFinite(n) ? n : null;
}

export default function SubmitChallengeModal({
  isOpen,
  onClose,
  onSubmitted,
  levels,
}: SubmitChallengeModalProps) {
  // Only JH1–JH7 are selectable (exclude JH0)
  const selectable = useMemo(
    () =>
      levels
        .map((l) => ({ ...l, num: parseLevelNumber(l.id) }))
        .filter((l): l is ChallengeLevelLite & { num: number } => l.num !== null && l.num >= 1 && l.num <= 7)
        .sort((a, b) => a.num - b.num),
    [levels]
  );

  // Default to level 1 if available
  const [levelNum, setLevelNum] = useState<number>(() => selectable[0]?.num ?? 1);
  const [youtubeUrl, setYoutubeUrl] = useState<string>('');
  const [saving, setSaving] = useState<boolean>(false);

  if (!isOpen) return null;

  const modalStyle: CSSProperties = {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 50,
  };
  const cardStyle: CSSProperties = {
    background: '#0b1220',
    color: '#fff',
    width: 'min(92vw, 640px)',
    borderRadius: 12,
    border: '1px solid #334155',
    padding: 16,
  };

  const handleSubmit = async () => {
    if (!youtubeUrl.trim()) {
      onSubmitted('Please provide a YouTube link.');
      return;
    }

    setSaving(true);
    try {
      const res = await fetch('/api/users/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          challengeSubmission: { level: levelNum, youtubeUrl },
        }),
      });

      if (res.ok) {
        let msg = 'Challenge submitted!';
        try {
          const json = (await res.json()) as { message?: string };
          if (json?.message) msg = json.message;
        } catch {
          /* ignore parse error; keep default msg */
        }
        onSubmitted(msg);
      } else {
        const text = await res.text().catch(() => '');
        onSubmitted(
          `Submission failed (${res.status} ${res.statusText})${text ? `: ${text}` : ''}`
        );
      }
    } catch {
      onSubmitted('Network error while submitting challenge.');
    } finally {
      setSaving(false);
      onClose();
    }
  };

  return (
    <div
      style={modalStyle}
      role="dialog"
      aria-modal="true"
      aria-label="Submit Challenge"
    >
      <div style={cardStyle}>
        <h3 style={{ marginTop: 0, marginBottom: 12, fontWeight: 700 }}>
          Submit Challenge
        </h3>

        <div style={{ display: 'grid', gap: 12 }}>
          <label className="field">
            <span className="label">Challenge</span>
            <select
              value={String(levelNum)}
              onChange={(e) => setLevelNum(Number(e.target.value))}
            >
              {selectable.map((l) => (
                <option key={l.id} value={l.num}>
                  {l.levelTitle} (Level {l.num})
                </option>
              ))}
            </select>
          </label>

          <label className="field">
            <span className="label">YouTube Link</span>

            <input
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              placeholder="https://youtube.com/..."
            />
          </label>

          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <button
              className="btn btn-secondary"
              type="button"
              onClick={onClose}
              disabled={saving}
            >
              Cancel
            </button>
            <button
              className="btn btn-primary"
              type="button"
              onClick={handleSubmit}
              disabled={saving}
            >
              {saving ? 'Submitting…' : 'Submit'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
