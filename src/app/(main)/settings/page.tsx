"use client";

import type { CSSProperties } from "react";
import styles from "../helldivers-2/HelldiversBase.module.css";
import ProfileEditForm from "@/app/components/forum/ProfileEditForm";

const overlayStyle: CSSProperties = {
  position: "fixed",
  inset: 0,
  backgroundColor: "rgba(16, 20, 31, 0.35)",
  zIndex: -1,
};

export default function SettingsPage() {
  return (
    <div className={styles.wrapper}>
      <div style={overlayStyle} />
      <div className={styles.dividerLayer} />
      <div className={styles.pageContainer}>
        <section className="content-section" style={{ position: "relative", zIndex: 1 }}>
          <h2 className="content-section-title with-border-bottom">Settings</h2>

          {/* Character sheet */}
          <ProfileEditForm />
        </section>
      </div>
    </div>
  );
}
