// src/app/components/forum/ProfileEditForm.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import ChangeAvatarModal from "@/app/components/profile/ChangeAvatarModal";

type UnitHeight = "cm" | "in";
type UnitWeight = "kg" | "lb";

interface UserMe {
  firstName?: string | null;
  middleName?: string | null;
  lastName?: string | null;
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
  const [deleting, setDeleting] = useState(false);
  const [userData, setUserData] = useState<UserMe | null>(null);

  // Delete button arming via countdown
  const [deleteArmed, setDeleteArmed] = useState(false);
  const [deleteHoverSecondsLeft, setDeleteHoverSecondsLeft] = useState<number>(30);
  const deleteHoverIntervalRef = useRef<number | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [modalError, setModalError] = useState<string | null>(null);

  const [firstName, setFirstName] = useState<string>("");
  const [middleName, setMiddleName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [characterHeightCm, setCharacterHeightCm] = useState<string>("");
  const [characterWeightKg, setCharacterWeightKg] = useState<string>("");
  const [heightUnit, setHeightUnit] = useState<UnitHeight>("cm");
  const [weightUnit, setWeightUnit] = useState<UnitWeight>("kg");
  const [homeplanet, setHomeplanet] = useState<string>("");
  const [background, setBackground] = useState<string>("");
  const [callsign, setCallsign] = useState<string>("");
  const [rankTitle, setRankTitle] = useState<string>("");
  const [favoriteWeapon, setFavoriteWeapon] = useState<string>("");
  const [armor, setArmor] = useState<string>("");
  const [motto, setMotto] = useState<string>("");
  const [favoredEnemy, setFavoredEnemy] = useState<string>("");
  const [twitchUrl, setTwitchUrl] = useState<string>("");
  const [isChangeImageOpen, setIsChangeImageOpen] = useState<boolean>(false);

  // Saved! status and error message
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");
  const [saveError, setSaveError] = useState<string | null>(null);

  // ------- utils
  const clampNum = (n: number, min: number, max: number) => (isNaN(n) ? NaN : Math.min(max, Math.max(min, n)));

  const cmToIn = (cmStr: string) => {
    const cm = parseFloat(cmStr);
    if (isNaN(cm)) return "";
    return Math.round(cm / 2.54).toString();
  };
  const inToCm = (inStr: string) => {
    const inches = parseFloat(inStr);
    if (isNaN(inches)) return "";
    return Math.round(inches * 2.54).toString();
  };
  const kgToLb = (kgStr: string) => {
    const kg = parseFloat(kgStr);
    if (isNaN(kg)) return "";
    return Math.round(kg * 2.2046226218).toString();
  };
  const lbToKg = (lbStr: string) => {
    const lb = parseFloat(lbStr);
    if (isNaN(lb)) return "";
    return Math.round(lb / 2.2046226218).toString();
  };

  // ------- load user
  useEffect(() => {
    const ac = new AbortController();
    (async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/users/me", { signal: ac.signal, cache: "no-store" });
        if (!res.ok) throw new Error(`Failed to load profile (${res.status})`);
        const data = (await res.json()) as UserMe;

        setUserData(data);
        setFirstName(data.firstName ?? "");
        setMiddleName(data.middleName ?? "");
        setLastName(data.lastName ?? "");
        setCharacterHeightCm(
          typeof data.characterHeightCm === "number" ? String(data.characterHeightCm) : ""
        );
        setCharacterWeightKg(
          typeof data.characterWeightKg === "number" ? String(data.characterWeightKg) : ""
        );
        setHomeplanet(data.homeplanet ?? "");
        setBackground(data.background ?? "");
        setCallsign(data.callsign ?? "");
        setRankTitle(data.rankTitle ?? "");
        setFavoriteWeapon(data.favoriteWeapon ?? "");
        setArmor(data.armor ?? "");
        setMotto(data.motto ?? "");
        setFavoredEnemy(data.favoredEnemy ?? "");
        setTwitchUrl(data.twitchUrl ?? "");
        if (data.preferredHeightUnit === "cm" || data.preferredHeightUnit === "in")
          setHeightUnit(data.preferredHeightUnit);
        if (data.preferredWeightUnit === "kg" || data.preferredWeightUnit === "lb")
          setWeightUnit(data.preferredWeightUnit);
      } catch (e) {
        // no-op; could toast/log
      } finally {
        if (!ac.signal.aborted) setLoading(false);
      }
    })();
    return () => ac.abort();
  }, []);

  // Cleanup any running interval on unmount
  useEffect(() => {
    return () => {
      if (deleteHoverIntervalRef.current !== null) {
        window.clearInterval(deleteHoverIntervalRef.current);
        deleteHoverIntervalRef.current = null;
      }
    };
  }, []);

  const buildPayload = (): UserMe => {
    const h = characterHeightCm.trim() ? clampNum(parseFloat(characterHeightCm), 0, 300) : NaN;
    const w = characterWeightKg.trim() ? clampNum(parseFloat(characterWeightKg), 0, 600) : NaN;
    return {
      firstName: firstName || null,
      middleName: middleName || null,
      lastName: lastName || null,
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
      twitchUrl: twitchUrl || null,
      preferredHeightUnit: heightUnit,
      preferredWeightUnit: weightUnit,
    };
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveStatus("idle");
    setSaveError(null);
    try {
      const res = await fetch("/api/users/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildPayload()),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j?.error || `Failed to save profile (${res.status})`);
      }
      const data = (await res.json()) as UserMe;
      setUserData(data);
      setSaveStatus("success");
      // auto-hide success after 2.5s
      setTimeout(() => setSaveStatus("idle"), 2500);
    } catch (e: unknown) {
      setSaveError(e instanceof Error ? e.message : "Failed to save profile");
      setSaveStatus("error");
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
    if (deleteArmed) return; // keep armed once reached
    if (deleteHoverIntervalRef.current !== null) {
      window.clearInterval(deleteHoverIntervalRef.current);
      deleteHoverIntervalRef.current = null;
    }
    setDeleteHoverSecondsLeft(30);
  };

  const openDeleteModal = () => {
    setShowDeleteModal(true);
    setConfirmText("");
    setModalError(null);
  };

  const handleDeleteAccount = async () => {
    if (confirmText !== "I renounce democracy") {
      setModalError("Incorrect confirmation text");
      return;
    }
    setDeleting(true);
    try {
      const res = await fetch("/api/users/me", { method: "DELETE" });
      if (res.ok) {
        window.location.href = "/auth";
      } else {
        setModalError("Failed to delete account.");
      }
    } finally {
      setDeleting(false);
    }
  };

  const handleAvatarSaved = (dataUrl: string) => {
    setUserData((prev) => ({ ...(prev || {}), customAvatarDataUrl: dataUrl }));
    setIsChangeImageOpen(false);
  };

  if (loading) {
    return <div className="card" style={{ padding: "1rem" }}>Loading profile…</div>;
  }

  return (
    <form className="card form-grid profile-form" onSubmit={(e) => e.preventDefault()}>
      <div className="avatar-row">
        <div className="avatar-col">
          <div className="avatar">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={userData?.customAvatarDataUrl || userData?.image || "/images/avatar-default.png"}
              alt="Avatar"
              loading="lazy"
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

          <label className="field field-sm">
            <strong className="label">
              Height{" "}
              <button
                type="button"
                className="link-button"
                onClick={() => setHeightUnit((u) => (u === "cm" ? "in" : "cm"))}
                aria-label={`Toggle height unit (current: ${heightUnit})`}
              >
                ({heightUnit})
              </button>
            </strong>
            <input
              type="number"
              inputMode="numeric"
              pattern="[0-9]*"
              value={heightUnit === "cm" ? characterHeightCm : cmToIn(characterHeightCm)}
              onChange={(e) => {
                const val = e.target.value;
                if (heightUnit === "cm") setCharacterHeightCm(val);
                else setCharacterHeightCm(inToCm(val));
              }}
              placeholder={heightUnit === "cm" ? "180" : "71"}
              min={0}
              max={heightUnit === "cm" ? 300 : 120}
            />
          </label>

          <label className="field field-sm">
            <strong className="label">
              Weight{" "}
              <button
                type="button"
                className="link-button"
                onClick={() => setWeightUnit((u) => (u === "kg" ? "lb" : "kg"))}
                aria-label={`Toggle weight unit (current: ${weightUnit})`}
              >
                ({weightUnit})
              </button>
            </strong>
            <input
              type="number"
              inputMode="numeric"
              pattern="[0-9]*"
              value={weightUnit === "kg" ? characterWeightKg : kgToLb(characterWeightKg)}
              onChange={(e) => {
                const val = e.target.value;
                if (weightUnit === "kg") setCharacterWeightKg(val);
                else setCharacterWeightKg(lbToKg(val));
              }}
              placeholder={weightUnit === "kg" ? "80" : "176"}
              min={0}
              max={weightUnit === "kg" ? 600 : 1300}
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
            <textarea
              className="min-h"
              value={background}
              onChange={(e) => setBackground(e.target.value)}
              placeholder="RP character background"
            />
          </label>
        </div>
      </div>

      <div className="actions" style={{ gap: ".5rem", display: "flex", alignItems: "center" }}>
        <button type="button" onClick={handleSave} disabled={saving} className="btn btn-primary" aria-live="polite">
          {saving ? "Saving…" : "Save Profile"}
        </button>
        <span aria-live="polite" className={`save-status${saveStatus === "error" ? " error" : ""}`}>
          {saveStatus === "success" ? "Saved!" : saveStatus === "error" ? (saveError || "Error saving.") : ""}
        </span>

        <button
          type="button"
          onMouseEnter={handleDeleteHoverStart}
          onMouseLeave={handleDeleteHoverEnd}
          onClick={() => {
            if (deleteArmed) openDeleteModal();
          }}
          disabled={deleting}
          className="btn btn-secondary danger"
          title={deleteArmed ? "Click to permanently delete your account" : undefined}
          aria-label={deleteArmed ? "Delete account" : `Hold ${String(deleteHoverSecondsLeft).padStart(2, "0")} seconds to arm delete`}
        >
          {deleting ? "Deleting…" : deleteArmed ? "Delete Account" : `Hold ${String(deleteHoverSecondsLeft).padStart(2, "0")}s`}
        </button>
      </div>

      <div style={{ marginTop: "1rem" }}>
        {twitchUrl ? (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <a href={twitchUrl} target="_blank" rel="noopener noreferrer" className="link-button">
              {twitchUrl}
            </a>
            <button type="button" className="btn btn-secondary" onClick={() => setTwitchUrl("")}>
              Unlink
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => {
              const url = window.prompt("Enter your Twitch channel URL");
              if (url) setTwitchUrl(url.trim());
            }}
            style={{ backgroundColor: "#9146FF", color: "#fff", padding: "0.5rem 1rem", borderRadius: 4 }}
          >
            Link Twitch Account
          </button>
        )}
      </div>

      {isChangeImageOpen && (
        <ChangeAvatarModal
          initialImageUrl={userData?.customAvatarDataUrl || userData?.image || ""}
          onCancel={() => setIsChangeImageOpen(false)}
          onSaved={handleAvatarSaved}
        />
      )}

      {showDeleteModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-title"
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div style={{ background: "#1f2937", padding: "1.5rem", borderRadius: 8, width: "90%", maxWidth: 420 }}>
            <h2 id="delete-title" style={{ marginTop: 0, marginBottom: "0.75rem" }}>
              Confirm Account Deletion
            </h2>
            <p style={{ marginBottom: "1rem" }}>Type "I renounce democracy" to confirm account deletion.</p>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              style={{
                width: "100%",
                padding: "0.5rem",
                marginBottom: "1rem",
                borderRadius: 4,
                border: "1px solid #374151",
                background: "#111827",
                color: "#f9fafb",
              }}
              aria-label='Type "I renounce democracy" to confirm'
            />
            {modalError && <p style={{ color: "#dc2626", marginBottom: "1rem" }}>{modalError}</p>}
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem" }}>
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                style={{ padding: "0.5rem 1rem", background: "#6b7280", color: "#fff", borderRadius: 4 }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteAccount}
                disabled={deleting || confirmText !== "I renounce democracy"}
                style={{ padding: "0.5rem 1rem", background: "#dc2626", color: "#fff", borderRadius: 4 }}
              >
                {deleting ? "Deleting…" : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}
