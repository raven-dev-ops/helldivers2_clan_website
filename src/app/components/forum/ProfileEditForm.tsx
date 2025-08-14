// src/app/components/forum/ProfileEditForm.tsx
"use client";

import { useEffect, useRef, useState } from 'react';
import ChangeAvatarModal from '@/app/components/profile/ChangeAvatarModal';

export default function ProfileEditForm() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [userData, setUserData] = useState<any>(null);

  // Delete button arming via countdown
  const [deleteArmed, setDeleteArmed] = useState(false);
  const [deleteHoverSecondsLeft, setDeleteHoverSecondsLeft] = useState<number>(30);
  const deleteHoverIntervalRef = useRef<number | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [modalArmed, setModalArmed] = useState(false);
  const [modalHoverSecondsLeft, setModalHoverSecondsLeft] = useState(30);
  const modalHoverIntervalRef = useRef<number | null>(null);
  const [modalError, setModalError] = useState<string | null>(null);

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
  const [callsign, setCallsign] = useState<string>('');
  const [rankTitle, setRankTitle] = useState<string>('');
  const [favoriteWeapon, setFavoriteWeapon] = useState<string>('');
  const [armor, setArmor] = useState<string>('');
  const [motto, setMotto] = useState<string>('');
  const [favoredEnemy, setFavoredEnemy] = useState<string>('');
  const [twitchUrl, setTwitchUrl] = useState<string>('');
  const [isChangeImageOpen, setIsChangeImageOpen] = useState<boolean>(false);
  // Saved! status and error message
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [saveError, setSaveError] = useState<string | null>(null);

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
        setTwitchUrl(data.twitchUrl || '');
        // Load preferred units if available
        if (data.preferredHeightUnit === 'cm' || data.preferredHeightUnit === 'in') setHeightUnit(data.preferredHeightUnit);
        if (data.preferredWeightUnit === 'kg' || data.preferredWeightUnit === 'lb') setWeightUnit(data.preferredWeightUnit);
      }
      setLoading(false);
    })();
  }, []);

  // Cleanup any running interval on unmount
  useEffect(() => {
    return () => {
      if (deleteHoverIntervalRef.current !== null) {
        window.clearInterval(deleteHoverIntervalRef.current);
        deleteHoverIntervalRef.current = null;
      }
      if (modalHoverIntervalRef.current !== null) {
        window.clearInterval(modalHoverIntervalRef.current);
        modalHoverIntervalRef.current = null;
      }
    };
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setSaveStatus('idle');
    setSaveError(null);
    try {
      const payload = {
        firstName: firstName || null,
        middleName: middleName || null,
        lastName: lastName || null,
        characterHeightCm: characterHeightCm ? Number(characterHeightCm) : null,
        characterWeightKg: characterWeightKg ? Number(characterWeightKg) : null,
        homeplanet: homeplanet || null,
        background: background || null,
        callsign: callsign || null,
        rankTitle: rankTitle || null,
        favoriteWeapon: favoriteWeapon || null,
        armor: armor || null,
        motto: motto || null,
        favoredEnemy: favoredEnemy || null,
        twitchUrl: twitchUrl || null,
        // Persist preferred units
        preferredHeightUnit: heightUnit,
        preferredWeightUnit: weightUnit,
      } as const;

      const res = await fetch('/api/users/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const data = await res.json();
        setUserData(data);
        setSaveStatus('success');
        setTimeout(() => setSaveStatus('idle'), 2500);
      } else {
        const j = await res.json().catch(() => ({}));
        setSaveError(j?.error || 'Failed to save profile');
        setSaveStatus('error');
      }
    } finally {
      setSaving(false);
    }
  };
  const handleDeleteHoverStart = () => {
    if (deleteHoverIntervalRef.current !== null || deleteArmed) return;
    setDeleteHoverSecondsLeft(30);
    deleteHoverIntervalRef.current = window.setInterval(() => {
      setDeleteHoverSecondsLeft((prev) => {
        if (prev <= 1) {
          if (deleteHoverIntervalRef.current !== null) {
            window.clearInterval(deleteHoverIntervalRef.current);
            deleteHoverIntervalRef.current = null;
          }
          setDeleteArmed(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleDeleteHoverEnd = () => {
    if (deleteArmed) return;
    if (deleteHoverIntervalRef.current !== null) {
      window.clearInterval(deleteHoverIntervalRef.current);
      deleteHoverIntervalRef.current = null;
    }
    setDeleteHoverSecondsLeft(30);
  };

  const openDeleteModal = () => {
    setShowDeleteModal(true);
    setConfirmText('');
    setModalArmed(false);
    setModalHoverSecondsLeft(30);
    setModalError(null);
  };

  const handleModalHoverStart = () => {
    if (modalHoverIntervalRef.current !== null || modalArmed) return;
    setModalHoverSecondsLeft(30);
    modalHoverIntervalRef.current = window.setInterval(() => {
      setModalHoverSecondsLeft((prev) => {
        if (prev <= 1) {
          if (modalHoverIntervalRef.current !== null) {
            window.clearInterval(modalHoverIntervalRef.current);
            modalHoverIntervalRef.current = null;
          }
          setModalArmed(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleModalHoverEnd = () => {
    if (modalArmed) return;
    if (modalHoverIntervalRef.current !== null) {
      window.clearInterval(modalHoverIntervalRef.current);
      modalHoverIntervalRef.current = null;
    }
    setModalHoverSecondsLeft(30);
  };

  const handleDeleteAccount = async () => {
    if (confirmText !== 'I renounce democracy') {
      setModalError('Incorrect confirmation text');
      return;
    }
    setDeleting(true);
    try {
      const res = await fetch('/api/users/me', { method: 'DELETE' });
      if (res.ok) {
        window.location.href = '/auth';
      } else {
        setModalError('Failed to delete account.');
      }
    } finally {
      setDeleting(false);
    }
  };

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

  const handleAvatarSaved = (dataUrl: string) => {
    setUserData((prev: any) => ({ ...(prev || {}), customAvatarDataUrl: dataUrl }));
    setIsChangeImageOpen(false);
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
          <label className="field field-sm">
            <strong className="label">First Name</strong>
            <input value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="First name" />
          </label>
          <label className="field field-sm">
            <strong className="label">Middle Name</strong>
            <input value={middleName} onChange={(e) => setMiddleName(e.target.value)} placeholder="Middle name" />
          </label>
          <label className="field field-sm">
            <strong className="label">Last Name</strong>
            <input value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Last name" />
          </label>

          {/* Unit preference selectors removed per requirements */}

          <label className="field field-sm">
            <strong className="label">Height <button type="button" className="link-button" onClick={() => setHeightUnit(heightUnit === 'cm' ? 'in' : 'cm')}>({heightUnit})</button></strong>
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
          <label className="field field-sm">
            <strong className="label">Weight <button type="button" className="link-button" onClick={() => setWeightUnit(weightUnit === 'kg' ? 'lb' : 'kg')}>({weightUnit})</button></strong>
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

          <label className="field field-sm">
            <strong className="label">Homeplanet</strong>
            <input value={homeplanet} onChange={(e) => setHomeplanet(e.target.value)} placeholder="e.g., Arrakis" />
          </label>
          
          <label className="field field-sm">
            <strong className="label">Callsign</strong>
            <input value={callsign} onChange={(e) => setCallsign(e.target.value)} placeholder="e.g., Eagle-1" />
          </label>
          <label className="field field-sm">
            <strong className="label">Rank</strong>
            <input value={rankTitle} onChange={(e) => setRankTitle(e.target.value)} placeholder="e.g., Captain" />
          </label>

          <label className="field field-sm">
            <strong className="label">Favorite Weapon</strong>
            <input value={favoriteWeapon} onChange={(e) => setFavoriteWeapon(e.target.value)} placeholder="e.g., Breaker" />
          </label>
          <label className="field field-sm">
            <strong className="label">Armor</strong>
            <input value={armor} onChange={(e) => setArmor(e.target.value)} placeholder="e.g., FS-23 Battle Master" />
          </label>

          <label className="field field-sm">
            <strong className="label">Twitch</strong>
            {twitchUrl ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <a href={twitchUrl} target="_blank" rel="noopener noreferrer" className="link-button">{twitchUrl}</a>
                <button type="button" className="btn btn-secondary" onClick={() => setTwitchUrl('')}>Unlink</button>
              </div>
            ) : (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  const url = window.prompt('Enter your Twitch channel URL');
                  if (url) setTwitchUrl(url);
                }}
              >
                Link Twitch Account
              </button>
            )}
          </label>

          <label className="field field-sm field-span-2">
            <strong className="label">Motto</strong>
            <input value={motto} onChange={(e) => setMotto(e.target.value)} placeholder="e.g., For Super Earth!" />
          </label>

          <label className="field field-sm field-span-2">
            <strong className="label">Favored Enemy</strong>
            <input value={favoredEnemy} onChange={(e) => setFavoredEnemy(e.target.value)} placeholder="e.g., Terminids" />
          </label>

          <label className="field field-sm field-span-2">
            <strong className="label">Background</strong>
            <textarea className="min-h" value={background} onChange={(e) => setBackground(e.target.value)} placeholder="RP character background" />
          </label>
        </div>
      </div>

      {/* Removed direct file input in favor of Change Image modal */}

      <div className="actions">
        <button type="button" onClick={handleSave} disabled={saving} className="btn btn-primary">
          {saving ? 'Saving…' : 'Save Profile'}
        </button>
        {saveStatus === 'success' && (
          <span className="save-status">Saved!</span>
        )}
        {saveStatus === 'error' && (
          <span className="save-status error">{saveError || 'Error saving.'}</span>
        )}
        <button
          type="button"
          onMouseEnter={handleDeleteHoverStart}
          onMouseLeave={handleDeleteHoverEnd}
          onClick={() => { if (deleteArmed) openDeleteModal(); }}
          disabled={deleting}
          className="btn btn-secondary danger"
          title={deleteArmed ? 'Click to permanently delete your account' : undefined}
        >
          {deleting ? 'Deleting…' : (deleteArmed ? 'Delete Account' : `Hold ${String(deleteHoverSecondsLeft).padStart(2, '0')}s`)}
        </button>
      </div>

      {isChangeImageOpen && (
        <ChangeAvatarModal
          initialImageUrl={userData?.customAvatarDataUrl || userData?.image || ''}
          onCancel={() => setIsChangeImageOpen(false)}
          onSaved={handleAvatarSaved}
        />
      )}
      {showDeleteModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#1f2937', padding: '1.5rem', borderRadius: 8, width: '90%', maxWidth: 420 }}>
            <p style={{ marginBottom: '1rem' }}>Type "I renounce democracy" to confirm account deletion.</p>
            <input
              type="text"
              value={confirmText}
              onChange={e => setConfirmText(e.target.value)}
              style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem', borderRadius: 4, border: '1px solid #374151', background: '#111827', color: '#f9fafb' }}
            />
            {modalError && <p style={{ color: '#dc2626', marginBottom: '1rem' }}>{modalError}</p>}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
              <button type="button" onClick={() => setShowDeleteModal(false)} style={{ padding: '0.5rem 1rem', background: '#16a34a', color: '#fff', borderRadius: 4 }}>Cancel</button>
              <button
                type="button"
                onClick={handleDeleteAccount}
                onMouseEnter={handleModalHoverStart}
                onMouseLeave={handleModalHoverEnd}
                disabled={!modalArmed || deleting}
                style={{ padding: '0.5rem 1rem', background: '#dc2626', color: '#fff', borderRadius: 4 }}
              >
                {deleting ? 'Deleting…' : (modalArmed ? 'Submit' : `Hold ${String(modalHoverSecondsLeft).padStart(2, '0')}s`)}
              </button>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}
