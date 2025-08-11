// src/app/components/forum/ProfileEditForm.tsx
"use client";

import { useEffect, useMemo, useState } from 'react';

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
      <div className="p-4 border rounded-lg bg-white dark:bg-slate-800 text-slate-500">Loading…</div>
    );
  }

  return (
    <form className="space-y-4 p-4 border rounded-lg bg-white dark:bg-slate-800">
      <div className="flex gap-4 items-center">
        <div className="w-28 h-28 rounded-full overflow-hidden border border-slate-600">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={userData?.customAvatarDataUrl || userData?.image || '/images/default-avatar.png'}
            alt="Avatar"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 grid gap-3">
          <label className="grid gap-1">
            <span className="text-sm text-slate-400">Profile Picture</span>
            <input type="file" accept="image/*" onChange={(e) => setAvatarFile(e.target.files?.[0] || null)} className="block text-slate-200" />
          </label>
          <label className="grid gap-1">
            <span className="text-sm text-slate-400">Name</span>
            <input className="bg-slate-900/70 border border-slate-600 rounded-md px-3 py-2 text-slate-100" value={name} onChange={(e) => setName(e.target.value)} placeholder="Character name" />
          </label>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <label className="grid gap-1">
          <span className="text-sm text-slate-400">Height (cm)</span>
          <input type="number" inputMode="numeric" pattern="[0-9]*" className="bg-slate-900/70 border border-slate-600 rounded-md px-3 py-2 text-slate-100" value={characterHeightCm} onChange={(e) => setCharacterHeightCm(e.target.value)} placeholder="e.g., 180" />
        </label>
        <label className="grid gap-1">
          <span className="text-sm text-slate-400">Weight (kg)</span>
          <input type="number" inputMode="numeric" pattern="[0-9]*" className="bg-slate-900/70 border border-slate-600 rounded-md px-3 py-2 text-slate-100" value={characterWeightKg} onChange={(e) => setCharacterWeightKg(e.target.value)} placeholder="e.g., 80" />
        </label>
      </div>

      <label className="grid gap-1">
        <span className="text-sm text-slate-400">Homeworld</span>
        <input className="bg-slate-900/70 border border-slate-600 rounded-md px-3 py-2 text-slate-100" value={homeplanet} onChange={(e) => setHomeplanet(e.target.value)} placeholder="e.g., Arrakis" />
      </label>

      <label className="grid gap-1">
        <span className="text-sm text-slate-400">Description / Background</span>
        <textarea className="bg-slate-900/70 border border-slate-600 rounded-md px-3 py-2 text-slate-100 min-h-[120px]" value={background} onChange={(e) => setBackground(e.target.value)} placeholder="RP character background" />
      </label>

      <div className="grid gap-2">
        <span className="text-sm text-slate-400">Discord Roles in GPT Fleet</span>
        {discordRoles.length === 0 ? (
          <div className="text-slate-500">None</div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {discordRoles.map((r) => (
              <span key={r.id} className="px-2 py-1 rounded-full bg-slate-700 text-slate-100 text-sm">{r.name}</span>
            ))}
          </div>
        )}
      </div>

             <div className="flex gap-3 pt-2">
        <button type="button" onClick={handleSave} disabled={saving} className="bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold px-4 py-2 rounded-md disabled:opacity-60">
          {saving ? 'Saving…' : 'Save Profile'}
        </button>
        <button type="button" onClick={handleDeleteAccount} disabled={deleting} className="bg-red-600 hover:bg-red-500 text-white font-bold px-4 py-2 rounded-md ml-auto disabled:opacity-60">
          {deleting ? 'Deleting…' : 'Delete Account'}
        </button>
      </div>
    </form>
  );
}
