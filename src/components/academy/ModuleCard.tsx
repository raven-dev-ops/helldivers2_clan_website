'use client';

import React from 'react';
import base from '@/app/(main)/helldivers-2/styles/HelldiversBase.module.css';
import styles from './ModuleCard.module.css';
import type { AcademyModule } from '@/components/academy/Modules';

type Props = {
  data: AcademyModule;
  onOpen: (id: string, trigger: HTMLButtonElement | null) => void;
};

export default function ModuleCard({ data, onOpen }: Props) {
  return (
    <article
      id={data.id}
      className={styles.moduleCard}
      role="listitem"
      aria-labelledby={`${data.id}-title`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={data.img}
        alt={data.imgAlt}
        className={styles.moduleImage}
        loading="lazy"
        decoding="async"
      />

      <div className={styles.moduleContent}>
        <h4 id={`${data.id}-title`} className={styles.moduleTitle}>
          {data.title}
        </h4>
        <p className={styles.moduleSubtitle}>{data.subtitle}</p>
        <p className={base.paragraph}>{data.description}</p>

        <div className={styles.moduleSkills}>
          <div>
            <div className={styles.moduleSkillsSectionTitle}>Basic</div>
            <ul className={`${base.styledList} ${styles.moduleSkillsList}`}>
              {data.basic.map((item) => (
                <li key={item} className={base.listItem}>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className={styles.moduleSkillsSectionTitle}>Advanced</div>
            <ul className={`${base.styledList} ${styles.moduleSkillsList}`}>
              {data.advanced.map((item) => (
                <li key={item} className={base.listItem}>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <button
          type="button"
          className={styles.ctaButton}
          aria-haspopup="dialog"
          aria-controls="academy-modal"
          aria-label={`Open ${data.title} module`}
          onClick={(e) => onOpen(data.id, e.currentTarget)}
        >
          Open module
        </button>
      </div>
    </article>
  );
}
