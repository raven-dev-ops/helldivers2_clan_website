// src/app/profile/me/_client/LinkedAccountsClient.tsx
'use client';

import { FaTwitch } from 'react-icons/fa';
import s from '@/styles/ProfileEditForm.module.css';

export default function LinkedAccountsClient({ twitchUrl }: { twitchUrl?: string }) {
  return (
    <section className={s.section}>
      <h3 className={s.sectionTitle}>Linked</h3>
      {twitchUrl ? (
        <a
          href={twitchUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}
        >
          <FaTwitch size={20} color="#a970ff" /> Twitch
        </a>
      ) : (
        <p className="text-paragraph">No accounts linked.</p>
      )}
    </section>
  );
}
