// src/components/common/Footer.tsx
import React from "react";
import styles from "./Footer.module.css";
import { FaDiscord, FaTwitch, FaYoutube } from 'react-icons/fa';
import { FaTiktok, FaXTwitter } from 'react-icons/fa6';

export default function Footer() {
  const discordUrl = process.env.SOCIAL_DISCORD_URL;
  const youtubeUrl = process.env.SOCIAL_YOUTUBE_URL;
  const twitchUrl = process.env.SOCIAL_TWITCH_URL;
  const tiktokUrl = process.env.SOCIAL_TIKTOK_URL;
  const xUrl = process.env.SOCIAL_X_URL;

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.socialLinks} aria-label="Social links">
          {discordUrl && (
            <a href={discordUrl} target="_blank" rel="noopener noreferrer" aria-label="Discord" title="Discord" className={styles.socialIconLink}>
              <FaDiscord className={styles.socialIcon} />
            </a>
          )}
          {youtubeUrl && (
            <a href={youtubeUrl} target="_blank" rel="noopener noreferrer" aria-label="YouTube" title="YouTube" className={styles.socialIconLink}>
              <FaYoutube className={styles.socialIcon} />
            </a>
          )}
          {twitchUrl && (
            <a href={twitchUrl} target="_blank" rel="noopener noreferrer" aria-label="Twitch" title="Twitch" className={styles.socialIconLink}>
              <FaTwitch className={styles.socialIcon} />
            </a>
          )}
          {tiktokUrl && (
            <a href={tiktokUrl} target="_blank" rel="noopener noreferrer" aria-label="TikTok" title="TikTok" className={styles.socialIconLink}>
              <FaTiktok className={styles.socialIcon} />
            </a>
          )}
          {xUrl && (
            <a href={xUrl} target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)" title="X (Twitter)" className={styles.socialIconLink}>
              <FaXTwitter className={styles.socialIcon} />
            </a>
          )}
        </div>
        <p>© {new Date().getFullYear()} Galactic Phantom Division. All rights reserved.</p>
      </div>
    </footer>
  );
}
