// src/app/components/forum/ProfileEditForm.tsx
"use client";

import { useEffect, useState } from 'react';

export default function ProfileEditForm() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [userData, setUserData] = useState<any>(null);

  const [name, setName] = useState<string>('');
  const [characterHeightCm, setCharacterHeightCm] = useState<string>('');
  const [characterWeightKg, setCharacterWeightKg] = useState<string>('');
  const [homeplanet, setHomeplanet] = useState<string>('');
  const [background, setBackground] = useState<string>('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [discordRoles, setDiscordRoles] = useState<Array<{ id: string; name: string }>>([]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const res = await fetch('/api/users/me');
      if (res.ok) {
        const data = await res.json();
        setUserData(data);
        setName(data.name || '');
        setCharacterHeightCm(data.characterHeightCm ? String(data.characterHeightCm) : '');
        setCharacterWeightKg(data.characterWeightKg ? String(data.characterWeightKg) : '');
        setHomeplanet(data.homeplanet || '');
        setBackground(data.background || '');
      }
      // Fetch Discord roles (non-fatal)
      try {
        const r = await fetch('/api/discord/roles', { cache: 'no-store' });
        if (r.ok) {
          const json = await r.json();
          setDiscordRoles(Array.isArray(json.roles) ? json.roles : []);
        }
      } catch {}
      setLoading(false);
    })();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const form = new FormData();
      if (name) form.append('name', name);
      if (characterHeightCm) form.append('characterHeightCm', characterHeightCm);
      if (characterWeightKg) form.append('characterWeightKg', characterWeightKg);
      if (homeplanet) form.append('homeplanet', homeplanet);
      if (background) form.append('background', background);
      if (avatarFile) form.append('avatar', avatarFile);
      const res = await fetch('/api/users/me', { method: 'PUT', body: form });
      if (res.ok) {
        const data = await res.json();
        setUserData(data);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm('Are you sure you want to permanently delete your account and data?')) return;
    setDeleting(true);
    try {
      const res = await fetch('/api/users/me', { method: 'DELETE' });
      if (res.ok) {
        // Redirect to sign-in after deletion
        window.location.href = '/auth';
      } else {
        alert('Failed to delete account.');
      }
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="card muted">Loading…</div>
    );
  }

  return (
    <form className="card form-grid">
      <div className="avatar-row">
        <div className="avatar">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={userData?.customAvatarDataUrl || userData?.image || '/images/avatar-default.png'}
            alt="Avatar"
          />
        </div>
        <div className="avatar-fields">
          <label className="field">
            <span className="label">Profile Picture</span>
            <input type="file" accept="image/*" onChange={(e) => setAvatarFile(e.target.files?.[0] || null)} />
          </label>
          <label className="field">
            <span className="label">Name</span>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Character name" />
          </label>
        </div>
      </div>

      <div className="two-col">
        <label className="field">
          <span className="label">Height (cm)</span>
          <input type="number" inputMode="numeric" pattern="[0-9]*" value={characterHeightCm} onChange={(e) => setCharacterHeightCm(e.target.value)} placeholder="e.g., 180" />
        </label>
        <label className="field">
          <span className="label">Weight (kg)</span>
          <input type="number" inputMode="numeric" pattern="[0-9]*" value={characterWeightKg} onChange={(e) => setCharacterWeightKg(e.target.value)} placeholder="e.g., 80" />
        </label>
      </div>

      <label className="field">
        <span className="label">Homeworld</span>
        <input value={homeplanet} onChange={(e) => setHomeplanet(e.target.value)} placeholder="e.g., Arrakis" />
      </label>

      <label className="field">
        <span className="label">Description / Background</span>
        <textarea className="min-h" value={background} onChange={(e) => setBackground(e.target.value)} placeholder="RP character background" />
      </label>

      <div className="roles">
        <span className="label">Discord Roles in GPT Fleet</span>
        {discordRoles.length === 0 ? (
          <div className="muted">None</div>
        ) : (
          <div className="role-chips">
            {discordRoles.map((r) => (
              <span key={r.id} className="chip">{r.name}</span>
            ))}
          </div>
        )}
      </div>

      <div className="actions">
        <button type="button" onClick={handleSave} disabled={saving} className="btn btn-primary">
          {saving ? 'Saving…' : 'Save Profile'}
        </button>
        <button type="button" onClick={handleDeleteAccount} disabled={deleting} className="btn btn-secondary danger">
          {deleting ? 'Deleting…' : 'Delete Account'}
        </button>
      </div>
    </form>
  );
}
