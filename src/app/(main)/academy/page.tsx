'use client';
import { useState } from 'react';
import base from '../helldivers-2/HelldiversBase.module.css';
import styles from './AcademyPage.module.css';

type Module = {
  id: string;
  title: string;
  subtitle: string;
  img: string;
  imgAlt: string;
};

const MODULES: Module[] = [
  {
    id: 'tactics',
    title: 'Tactics',
    subtitle: 'Positioning, awareness, communication',
    img: 'https://placehold.co/800x450?text=Tactics',
    imgAlt: 'Placeholder image for the Tactics module',
  },
  {
    id: 'loadouts',
    title: 'Loadouts',
    subtitle: 'Weapons, armor, perks',
    img: 'https://placehold.co/800x450?text=Loadouts',
    imgAlt: 'Placeholder image for the Loadouts module',
  },
  {
    id: 'stratagems',
    title: 'Stratagems',
    subtitle: 'Usage, risks, combos',
    img: 'https://placehold.co/800x450?text=Stratagems',
    imgAlt: 'Placeholder image for the Stratagems module',
  },
  {
    id: 'enemies',
    title: 'Enemies',
    subtitle: 'Types, weaknesses, behaviors',
    img: 'https://placehold.co/800x450?text=Enemies',
    imgAlt: 'Placeholder image for the Enemies module',
  },
  {
    id: 'missions',
    title: 'Missions',
    subtitle: 'Objectives, routes, execution',
    img: 'https://placehold.co/800x450?text=Missions',
    imgAlt: 'Placeholder image for the Missions module',
  },
  {
    id: 'squad-training',
    title: 'Squad Training',
    subtitle: 'Roles, synergy, drills',
    img: 'https://placehold.co/800x450?text=Squad+Training',
    imgAlt: 'Placeholder image for the Squad Training module',
  },
];

export default function AcademyPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTitle, setSelectedTitle] = useState<string | null>(null);

  const openModal = (title: string) => {
    setSelectedTitle(title);
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTitle(null);
  };

  return (
    <div className={base.wrapper}>
      <div className={base.dividerLayer} />
      <div className={styles.centerOverlay}>
        <header className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>GPT Fleet Academy</h1>
          <p className={styles.pageSubtitle}>
            Advanced training for the elite Helldivers of the Galactic Phantom Division.
          </p>
        </header>

        <section className={base.section} aria-labelledby="academy-modules">
          <h2 id="academy-modules" className={base.sectionTitle}>
            Training Modules
          </h2>
          <div className={styles.modulesGrid} role="list">
            {MODULES.map((m) => (
              <article
                key={m.id}
                className={styles.moduleCard}
                role="listitem"
                aria-label={`${m.title} module`}
                tabIndex={0}
                onClick={() => openModal(m.title)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') openModal(m.title);
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={m.img} alt={m.imgAlt} className={styles.image} />
                <div className={styles.cardContent}>
                  <h3 className={styles.title}>{m.title}</h3>
                  <p className={styles.subtitle}>{m.subtitle}</p>
                  <div className={styles.ctaRow}>
                    <button className="btn btn-secondary" type="button">
                      Open module
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>

      {isModalOpen && (
        <div className={styles.modalBackdrop} role="dialog" aria-modal="true" aria-label="Under construction">
          <div className={styles.modalCard}>
            <h3 style={{ marginTop: 0, marginBottom: 12, fontWeight: 700 }}>Under Construction</h3>
            <p style={{ marginBottom: 16 }}>
              {selectedTitle ? `${selectedTitle} module` : 'This module'} is currently under construction.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <button className="btn btn-primary" type="button" onClick={closeModal}>
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
