"use client";

import { useEffect, useState, type CSSProperties } from "react";
import styles from "../helldivers-2/HelldiversPage.module.css";
import ProfileEditForm from "@/app/components/forum/ProfileEditForm";

const videoStyle: CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  objectFit: "cover",
  zIndex: -2,
  filter: "brightness(0.6)",
};
const overlayStyle: CSSProperties = {
  position: "fixed",
  inset: 0,
  backgroundColor: "rgba(16, 20, 31, 0.35)",
  zIndex: -1,
};

const STORAGE_KEY = "gpd:bg:motion"; // 'on' or 'off'

export default function SettingsPage() {
  const [bgEnabled, setBgEnabled] = useState(true);

  // Initialize from localStorage or prefers-reduced-motion
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === "on" || saved === "off") {
        setBgEnabled(saved === "on");
      } else {
        const prefersReduced =
          typeof window !== "undefined" &&
          window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
        setBgEnabled(!prefersReduced);
      }
    } catch {
      // ignore
    }
  }, []);

  // Persist choice
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, bgEnabled ? "on" : "off");
    } catch {
      // ignore
    }
  }, [bgEnabled]);

  return (
    <div
      className={styles.pageContainer}
      style={{
        position: "relative",
        zIndex: 0,
        // When bg is off, make sure we have a solid page bg
        backgroundColor: bgEnabled ? "transparent" : "var(--color-background, #111827)",
      }}
    >
      {bgEnabled && (
        <>
          <video autoPlay loop muted playsInline style={videoStyle} key="bg-video-settings">
            <source src="/videos/gpd_background.mp4" type="video/mp4" />
          </video>
          <div style={overlayStyle} />
        </>
      )}

      <section className="content-section" style={{ position: "relative", zIndex: 1 }}>
        <h2 className="content-section-title with-border-bottom">Settings</h2>

        {/* Background preferences */}
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>Background</h3>
          <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            <label style={{ display: "inline-flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={!bgEnabled}
                onChange={(e) => setBgEnabled(!e.target.checked)}
              />
              Disable animated background
            </label>
            <span style={{ opacity: 0.8, fontSize: ".9rem" }}>
              Saved on this device. Defaults to off if your OS prefers reduced motion.
            </span>
          </div>
        </section>

        {/* Character sheet */}
        <ProfileEditForm />
      </section>
    </div>
  );
}
