// src/app/components/forum/ProfileEditForm.tsx
"use client";

import { useEffect, useState } from 'react';
import ChangeAvatarModal from '@/app/components/profile/ChangeAvatarModal';

export default function ProfileEditForm() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [userData, setUserData] = useState<any>(null);

  const [firstName, setFirstName] = useState<string>('');
  const [middleName, setMiddleName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [characterHeightCm, setCharacterHeightCm] = useState<string>('');
  const [characterWeightKg, setCharacterWeightKg] = useState<string>('');
  const [heightUnit, setHeightUnit] = useState<'cm' | 'in'>('cm');
  const [weightUnit, setWeightUnit] = useState<'kg' | 'lb'>('kg');
  const [homeplanet, setHomeplanet] = useState<string>('');
  const [background, setBackground] = useState<string>('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [discordRoles, setDiscordRoles] = useState<Array<{ id: string; name: string }>>([]);
  const [callsign, setCallsign] = useState<string>('');
  const [rankTitle, setRankTitle] = useState<string>('');
  const [favoriteWeapon, setFavoriteWeapon] = useState<string>('');
  const [armor, setArmor] = useState<string>('');
  const [motto, setMotto] = useState<string>('');
  const [favoredEnemy, setFavoredEnemy] = useState<string>('');
  const [isChangeImageOpen, setIsChangeImageOpen] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const res = await fetch('/api/users/me');
      if (res.ok) {
        const data = await res.json();
        setUserData(data);
        setFirstName(data.firstName || '');
        setMiddleName(data.middleName || '');
        setLastName(data.lastName || '');
        setCharacterHeightCm(data.characterHeightCm ? String(data.characterHeightCm) : '');
        setCharacterWeightKg(data.characterWeightKg ? String(data.characterWeightKg) : '');
        setHomeplanet(data.homeplanet || '');
        setBackground(data.background || '');
        setCallsign(data.callsign || '');
        setRankTitle(data.rankTitle || '');
        setFavoriteWeapon(data.favoriteWeapon || '');
        setArmor(data.armor || '');
        setMotto(data.motto || '');
        setFavoredEnemy(data.favoredEnemy || '');
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
      if (firstName) form.append('firstName', firstName);
      if (middleName) form.append('middleName', middleName);
      if (lastName) form.append('lastName', lastName);
      if (characterHeightCm) form.append('characterHeightCm', characterHeightCm);
      if (characterWeightKg) form.append('characterWeightKg', characterWeightKg);
      if (homeplanet) form.append('homeplanet', homeplanet);
      if (background) form.append('background', background);
      if (callsign) form.append('callsign', callsign);
      if (rankTitle) form.append('rankTitle', rankTitle);
      if (favoriteWeapon) form.append('favoriteWeapon', favoriteWeapon);
      if (armor) form.append('armor', armor);
      if (motto) form.append('motto', motto);
      if (favoredEnemy) form.append('favoredEnemy', favoredEnemy);
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

  const handleAvatarSaved = (dataUrl: string) => {
    setUserData((prev: any) => ({ ...(prev || {}), customAvatarDataUrl: dataUrl }));
    setIsChangeImageOpen(false);
  };

  if (loading) {
    return (
      <div className="card muted">Loading…</div>
    );
  }

  // Helpers for unit conversion and controlled inputs
  const cmToIn = (cmStr: string) => {
    const cm = parseFloat(cmStr);
    if (isNaN(cm)) return '';
    return (cm / 2.54).toFixed(0);
  };
  const inToCm = (inStr: string) => {
    const inches = parseFloat(inStr);
    if (isNaN(inches)) return '';
    return (inches * 2.54).toFixed(0);
  };
  const kgToLb = (kgStr: string) => {
    const kg = parseFloat(kgStr);
    if (isNaN(kg)) return '';
    return (kg * 2.2046226218).toFixed(0);
  };
  const lbToKg = (lbStr: string) => {
    const lb = parseFloat(lbStr);
    if (isNaN(lb)) return '';
    return (lb / 2.2046226218).toFixed(0);
  };

  return (
    <form className="card form-grid profile-form">
      <div className="avatar-row">
        <div className="avatar-col">
          <div className="avatar">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={userData?.customAvatarDataUrl || userData?.image || '/images/avatar-default.png'}
              alt="Avatar"
            />
          </div>
          <button type="button" className="link-button" onClick={() => setIsChangeImageOpen(true)}>
            Change image
          </button>
        </div>
        <div className="avatar-fields">
          <div className="two-col">
            <label className="field">
              <span className="label">First Name</span>
              <input value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="First name" />
            </label>
            <label className="field">
              <span className="label">Middle Name</span>
              <input value={middleName} onChange={(e) => setMiddleName(e.target.value)} placeholder="Middle name" />
            </label>
          </div>
          <label className="field field-sm">
            <span className="label">Last Name</span>
            <input value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Last name" />
          </label>
        </div>
      </div>

      <div className="two-col">
        <label className="field">
          <span className="label">Height <button type="button" className="link-button" onClick={() => setHeightUnit(heightUnit === 'cm' ? 'in' : 'cm')}>({heightUnit})</button></span>
          <input
            type="number"
            inputMode="numeric"
            pattern="[0-9]*"
            value={heightUnit === 'cm' ? characterHeightCm : cmToIn(characterHeightCm)}
            onChange={(e) => {
              const val = e.target.value;
              if (heightUnit === 'cm') setCharacterHeightCm(val);
              else setCharacterHeightCm(inToCm(val));
            }}
            placeholder={heightUnit === 'cm' ? '180' : '71'}
          />
        </label>
        <label className="field">
          <span className="label">Weight <button type="button" className="link-button" onClick={() => setWeightUnit(weightUnit === 'kg' ? 'lb' : 'kg')}>({weightUnit})</button></span>
          <input
            type="number"
            inputMode="numeric"
            pattern="[0-9]*"
            value={weightUnit === 'kg' ? characterWeightKg : kgToLb(characterWeightKg)}
            onChange={(e) => {
              const val = e.target.value;
              if (weightUnit === 'kg') setCharacterWeightKg(val);
              else setCharacterWeightKg(lbToKg(val));
            }}
            placeholder={weightUnit === 'kg' ? '80' : '176'}
          />
        </label>
      </div>

      <label className="field field-sm">
        <span className="label">Homeworld</span>
        <input value={homeplanet} onChange={(e) => setHomeplanet(e.target.value)} placeholder="e.g., Arrakis" />
      </label>

      <div className="two-col">
        <label className="field">
          <span className="label">Callsign</span>
          <input value={callsign} onChange={(e) => setCallsign(e.target.value)} placeholder="e.g., Eagle-1" />
        </label>
        <label className="field">
          <span className="label">Rank</span>
          <input value={rankTitle} onChange={(e) => setRankTitle(e.target.value)} placeholder="e.g., Captain" />
        </label>
      </div>

      <div className="two-col">
        <label className="field">
          <span className="label">Favorite Weapon</span>
          <input value={favoriteWeapon} onChange={(e) => setFavoriteWeapon(e.target.value)} placeholder="e.g., Breaker" />
        </label>
        <label className="field">
          <span className="label">Armor</span>
          <input value={armor} onChange={(e) => setArmor(e.target.value)} placeholder="e.g., FS-23 Battle Master" />
        </label>
      </div>

      <label className="field field-sm">
        <span className="label">Favored Enemy</span>
        <input value={favoredEnemy} onChange={(e) => setFavoredEnemy(e.target.value)} placeholder="e.g., Terminids" />
      </label>

      <label className="field">
        <span className="label">Description / Background</span>
        <textarea className="min-h" value={background} onChange={(e) => setBackground(e.target.value)} placeholder="RP character background" />
      </label>

      <label className="field field-sm">
        <span className="label">Motto</span>
        <input value={motto} onChange={(e) => setMotto(e.target.value)} placeholder="e.g., For Super Earth!" />
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

      {/* Removed direct file input in favor of Change Image modal */}

      <div className="actions">
        <button type="button" onClick={handleSave} disabled={saving} className="btn btn-primary">
          {saving ? 'Saving…' : 'Save Profile'}
        </button>
        <button type="button" onClick={handleDeleteAccount} disabled={deleting} className="btn btn-secondary danger">
          {deleting ? 'Deleting…' : 'Delete Account'}
        </button>
      </div>

      {isChangeImageOpen && (
        <ChangeAvatarModal
          initialImageUrl={userData?.customAvatarDataUrl || userData?.image || ''}
          onCancel={() => setIsChangeImageOpen(false)}
          onSaved={handleAvatarSaved}
        />
      )}
    </form>
  );
}
