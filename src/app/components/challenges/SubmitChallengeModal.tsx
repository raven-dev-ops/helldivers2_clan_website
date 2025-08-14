"use client";

import { useState, type CSSProperties } from "react";

// Challenge names (levels 1-7) as in Challenges menu
const CHALLENGE_LEVEL_LABELS: string[] = [
  "Sabotage Proficiency",
  "Resource Denial",
  "ICBM Control",
  "Flawless ICBM",
  "Perfect Survey",
  "Eagle Ace",
  "The Purist",
];

export default function SubmitChallengeModal({
  isOpen,
  onClose,
  onSubmitted,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmitted: () => void;
}) {
  const [level, setLevel] = useState<number>(1);
  const [youtubeUrl, setYoutubeUrl] = useState<string>("");
  const [saving, setSaving] = useState<boolean>(false);

  if (!isOpen) return null;

  const modalStyle: CSSProperties = {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.6)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 50,
  };
  const cardStyle: CSSProperties = {
    background: "#0b1220",
    color: "#fff",
    width: "min(92vw, 640px)",
    borderRadius: 12,
    border: "1px solid #334155",
    padding: 16,
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/users/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          challengeSubmission: { level, youtubeUrl },
        }),
      });
      if (res.ok) onSubmitted();
    } finally {
      setSaving(false);
      onClose();
    }
  };

  return (
    <div style={modalStyle} role="dialog" aria-modal="true" aria-label="Submit Challenge">
      <div style={cardStyle}>
        <h3 style={{ marginTop: 0, marginBottom: 12, fontWeight: 700 }}>Submit Challenge</h3>
        <div style={{ display: "grid", gap: 12 }}>
          <label className="field">
            <span className="label">Challenge</span>
            <select value={level} onChange={(e) => setLevel(Number(e.target.value))}>
              {CHALLENGE_LEVEL_LABELS.map((label, idx) => (
                <option key={idx + 1} value={idx + 1}>
                  {label} (Level {idx + 1})
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
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <button className="btn btn-secondary" type="button" onClick={onClose} disabled={saving}>
              Cancel
            </button>
            <button className="btn btn-primary" type="button" onClick={handleSubmit} disabled={saving}>
              {saving ? "Submitting…" : "Submit"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}