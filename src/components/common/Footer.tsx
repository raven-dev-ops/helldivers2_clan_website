// src/components/common/Footer.tsx
import React from "react";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <p>© {new Date().getFullYear()} Galactic Phantom Division. All rights reserved.</p>
      </div>
    </footer>
  );
}
