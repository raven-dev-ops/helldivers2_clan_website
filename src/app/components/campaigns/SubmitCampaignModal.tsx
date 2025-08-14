"use client";

import { useState, type CSSProperties } from "react";

export default function SubmitCampaignModal({
  isOpen,
  onClose,
  onSubmitted,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmitted: (message: string) => void;
}) {
  const [documentLink, setDocumentLink] = useState<string>("");
  const [about, setAbout] = useState<string>("");
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
    if (!documentLink.trim()) return;
    setSaving(true);
    try {
      const res = await fetch("/api/user-applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "campaign", interest: documentLink, about }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to submit");
      onSubmitted(data.message || "Campaign submitted");
      setDocumentLink("");
      setAbout("");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to submit";
      onSubmitted(message);
    } finally {
      setSaving(false);
      onClose();
    }
  };

  return (
    <div style={modalStyle} role="dialog" aria-modal="true" aria-label="Submit Campaign">
      <div style={cardStyle}>
        <h3 style={{ marginTop: 0, marginBottom: 12, fontWeight: 700 }}>Submit Campaign</h3>
        <div style={{ display: "grid", gap: 12 }}>
          <label className="field">
            <span className="label">Document Link</span>
            <input
              value={documentLink}
              onChange={(e) => setDocumentLink(e.target.value)}
              placeholder="https://..."
            />
          </label>
          <label className="field">
            <span className="label">Additional Info (optional)</span>
            <textarea
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              rows={3}
            />
          </label>
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <button className="btn btn-secondary" type="button" onClick={onClose} disabled={saving}>
              Cancel
            </button>
            <button
              className="btn btn-primary"
              type="button"
              onClick={handleSubmit}
              disabled={saving || !documentLink.trim()}
            >
              {saving ? "Submitting…" : "Submit"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

