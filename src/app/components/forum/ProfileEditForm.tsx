'use client';
/* eslint-disable @next/next/no-img-element */

import { useEffect, useState } from 'react';
import ChangeAvatarModal from '@/app/components/profile/ChangeAvatarModal';
import s from './ProfileEditForm.module.css';

type UnitHeight = 'cm' | 'in';
type UnitWeight = 'kg' | 'lb';

interface UserMe {
  firstName?: string | null;
  middleName?: string | null;
  lastName?: string | null;
  sesName?: string | null;
  characterHeightCm?: number | null;
  characterWeightKg?: number | null;
  homeplanet?: string | null;
  background?: string | null;
  callsign?: string | null;
  rankTitle?: string | null;
  favoriteWeapon?: string | null;
  armor?: string | null;
  motto?: string | null;
  favoredEnemy?: string | null;
  twitchUrl?: string | null;
  preferredHeightUnit?: UnitHeight;
  preferredWeightUnit?: UnitWeight;
  image?: string | null;
  customAvatarDataUrl?: string | null;
}

export default function ProfileEditForm() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userData, setUserData] = useState<UserMe | null>(null);
  const [isChangeImageOpen, setIsChangeImageOpen] = useState(false);

  // Fields
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [sesName, setSesName] = useState('');
  const [characterHeightCm, setCharacterHeightCm] = useState('');
  const [characterWeightKg, setCharacterWeightKg] = useState('');
  const [heightUnit, setHeightUnit] = useState<UnitHeight>('cm');
  const [weightUnit, setWeightUnit] = useState<UnitWeight>('kg');
  const [homeplanet, setHomeplanet] = useState('');
  const [background, setBackground] = useState('');
  const [callsign, setCallsign] = useState('');
  const [rankTitle, setRankTitle] = useState('');
  const [favoriteWeapon, setFavoriteWeapon] = useState('');
  const [armor, setArmor] = useState('');
  const [motto, setMotto] = useState('');
  const [favoredEnemy, setFavoredEnemy] = useState('');

  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [saveError, setSaveError] = useState<string | null>(null);

  const cmToIn = (cmStr: string) => {
    const cm = parseFloat(cmStr);
    return isNaN(cm) ? '' : Math.round(cm / 2.54).toString();
  };
  const inToCm = (inStr: string) => {
    const inches = parseFloat(inStr);
    return isNaN(inches) ? '' : Math.round(inches * 2.54).toString();
  };
  const kgToLb = (kgStr: string) => {
    const kg = parseFloat(kgStr);
    return isNaN(kg) ? '' : Math.round(kg * 2.2046226218).toString();
  };
  const lbToKg = (lbStr: string) => {
    const lb = parseFloat(lbStr);
    return isNaN(lb) ? '' : Math.round(lb / 2.2046226218).toString();
  };

  useEffect(() => {
    const ac = new AbortController();
    (async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/users/me?include=avatar', { signal: ac.signal });
        if (!res.ok) throw new Error(`Failed to load profile (${res.status})`);
        const data = (await res.json()) as UserMe;

        setUserData(data);
        setFirstName(data.firstName ?? '');
        setMiddleName(data.middleName ?? '');
        setLastName(data.lastName ?? '');
        setSesName(data.sesName ?? '');
        setCharacterHeightCm(typeof data.characterHeightCm === 'number' ? String(data.characterHeightCm) : '');
        setCharacterWeightKg(typeof data.characterWeightKg === 'number' ? String(data.characterWeightKg) : '');
        setHomeplanet(data.homeplanet ?? '');
        setBackground(data.background ?? '');
        setCallsign(data.callsign ?? '');
        setRankTitle(data.rankTitle ?? '');
        setFavoriteWeapon(data.favoriteWeapon ?? '');
        setArmor(data.armor ?? '');
        setMotto(data.motto ?? '');
        setFavoredEnemy(data.favoredEnemy ?? '');
        if (data.preferredHeightUnit) setHeightUnit(data.preferredHeightUnit);
        if (data.preferredWeightUnit) setWeightUnit(data.preferredWeightUnit);
      } finally {
        if (!ac.signal.aborted) setLoading(false);
      }
    })();
    return () => ac.abort();
  }, []);

  const buildPayload = (): UserMe => {
    const h = characterHeightCm.trim() ? parseFloat(characterHeightCm) : NaN;
    const w = characterWeightKg.trim() ? parseFloat(characterWeightKg) : NaN;
    return {
      firstName: firstName || null,
      middleName: middleName || null,
      lastName: lastName || null,
      sesName: sesName || null,
      characterHeightCm: isNaN(h) ? null : h,
      characterWeightKg: isNaN(w) ? null : w,
      homeplanet: homeplanet || null,
      background: background || null,
      callsign: callsign || null,
      rankTitle: rankTitle || null,
      favoriteWeapon: favoriteWeapon || null,
      armor: armor || null,
      motto: motto || null,
      favoredEnemy: favoredEnemy || null,
      preferredHeightUnit: heightUnit,
      preferredWeightUnit: weightUnit,
    };
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveStatus('idle');
    setSaveError(null);
    try {
      const res = await fetch('/api/users/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(buildPayload()),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j?.error || `Failed to save profile (${res.status})`);
      }
      const data = (await res.json()) as UserMe;
      setUserData(data);
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 2500);
    } catch (e: unknown) {
      setSaveError(e instanceof Error ? e.message : 'Failed to save profile');
      setSaveStatus('error');
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarSaved = (dataUrl: string) => {
    setUserData((prev) => ({ ...(prev || {}), customAvatarDataUrl: dataUrl }));
    setIsChangeImageOpen(false);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <form className={s.formContainer} onSubmit={(e) => e.preventDefault()}>
        <div className={s.avatarSection}>
            <div className={s.avatar}>
                <img
                    src={userData?.customAvatarDataUrl || userData?.image || '/images/avatar-default.png'}
                    alt="Avatar"
                    loading="lazy"
                />
            </div>
            <button type="button" className={s.button} onClick={() => setIsChangeImageOpen(true)}>
                Change Avatar
            </button>
        </div>

      <div className={s.formSection}>
        <h3 className={s.sectionTitle}>Identity</h3>
        <div className={s.grid}>
          <label className={s.field}>
            <strong className={s.label}>First Name</strong>
            <input className={s.input} value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="First name" />
          </label>
          <label className={s.field}>
            <strong className={s.label}>Middle Name</strong>
            <input className={s.input} value={middleName} onChange={(e) => setMiddleName(e.target.value)} placeholder="Middle name" />
          </label>
          <label className={s.field}>
            <strong className={s.label}>Last Name</strong>
            <input className={s.input} value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Last name" />
          </label>
          <label className={s.field}>
            <strong className={s.label}>Callsign</strong>
            <input className={s.input} value={callsign} onChange={(e) => setCallsign(e.target.value)} placeholder="e.g., Eagle-1" />
          </label>
          <label className={s.field}>
            <strong className={s.label}>Rank</strong>
            <input className={s.input} value={rankTitle} onChange={(e) => setRankTitle(e.target.value)} placeholder="e.g., Captain" />
          </label>
          <label className={s.field}>
            <strong className={s.label}>Homeplanet</strong>
            <input className={s.input} value={homeplanet} onChange={(e) => setHomeplanet(e.target.value)} placeholder="e.g., Arrakis" />
          </label>
          <label className={s.field}>
            <strong className={s.label}>S.E.S. (Destroyer) Name</strong>
            <input className={s.input} value={sesName} onChange={(e) => setSesName(e.target.value)} placeholder="e.g., Super Earth Vengeance" />
          </label>
        </div>
      </div>

      <div className={s.formSection}>
        <h3 className={s.sectionTitle}>Character Stats</h3>
        <div className={s.grid}>
          <label className={s.field}>
            <strong className={s.label}>Height ({heightUnit})</strong>
            <input
              className={s.input}
              type="number"
              value={heightUnit === 'cm' ? characterHeightCm : cmToIn(characterHeightCm)}
              onChange={(e) => {
                const val = e.target.value;
                setCharacterHeightCm(heightUnit === 'cm' ? val : inToCm(val));
              }}
              placeholder={heightUnit === 'cm' ? '180' : '71'}
            />
          </label>
          <label className={s.field}>
            <strong className={s.label}>Weight ({weightUnit})</strong>
            <input
              className={s.input}
              type="number"
              value={weightUnit === 'kg' ? characterWeightKg : kgToLb(characterWeightKg)}
              onChange={(e) => {
                const val = e.target.value;
                setCharacterWeightKg(weightUnit === 'kg' ? val : lbToKg(val));
              }}
              placeholder={weightUnit === 'kg' ? '80' : '176'}
            />
          </label>
          <label className={s.field}>
            <strong className={s.label}>Favored Enemy</strong>
            <input className={s.input} value={favoredEnemy} onChange={(e) => setFavoredEnemy(e.target.value)} placeholder="e.g., Terminids" />
          </label>
        </div>
      </div>

      <div className={s.formSection}>
        <h3 className={s.sectionTitle}>Loadout & Preferences</h3>
        <div className={s.grid}>
            <label className={s.field}>
                <strong className={s.label}>Favorite Weapon</strong>
                <input className={s.input} value={favoriteWeapon} onChange={(e) => setFavoriteWeapon(e.target.value)} placeholder="e.g., Breaker" />
            </label>
            <label className={s.field}>
                <strong className={s.label}>Armor</strong>
                <input className={s.input} value={armor} onChange={(e) => setArmor(e.target.value)} placeholder="e.g., FS-23 Battle Master" />
            </label>
            <label className={s.field}>
                <strong className={s.label}>Motto</strong>
                <input className={s.input} value={motto} onChange={(e) => setMotto(e.target.value)} placeholder="e.g., For Super Earth!" />
            </label>
        </div>
      </div>

      <div className={s.formSection}>
        <h3 className={s.sectionTitle}>Roleplay Bio</h3>
        <div className={s.grid}>
          <label className={s.field}>
            <strong className={s.label}>Background</strong>
            <textarea className={s.textarea} value={background} onChange={(e) => setBackground(e.target.value)} placeholder="RP character background" />
          </label>
        </div>
      </div>

      <div className={s.actions}>
        <button type="button" onClick={handleSave} disabled={saving} className={s.button}>
          {saving ? 'Saving…' : 'Save Profile'}
        </button>
        <span className={`${s.statusMessage} ${saveStatus === 'success' ? s.success : s.error}`}>
          {saveStatus === 'success' && 'Saved!'}
          {saveStatus === 'error' && (saveError || 'Error saving.')}
        </span>
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
