// src/app/academy/page.tsx
'use client';

import { useMemo, useRef, useState } from 'react';
import type { MouseEvent } from 'react';
import Image from 'next/image';
import base from '@/styles/Base.module.css';
import styles from '@/styles/AcademyPage.module.css';
import { MODULES, type AcademyModule } from '@/lib/academy';
import Modal from '@/components/common/Modal';

export default function AcademyPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const lastTriggerRef = useRef<HTMLButtonElement | null>(null);

  const selectedModule = useMemo<AcademyModule | null>(
    () => MODULES.find((m: AcademyModule) => m.id === selectedId) ?? null,
    [selectedId]
  );

  const openModal = (id: string, trigger: HTMLButtonElement | null) => {
    lastTriggerRef.current = trigger;
    setSelectedId(id);
  };

  const closeModal = () => {
    setSelectedId(null);
    lastTriggerRef.current?.focus();
  };

  return (
    <div className={base.wrapper}>
      <div className={base.dividerLayer} />

      <div className={`${base.pageContainer} ${styles.pageWrapper}`}>
        <header className={styles.pageHeader}>
          <h2 className={styles.pageTitle}>Academy</h2>
          <p className={styles.pageSubtitle}>
            Six training modules covering environments, equipment, tactics, leadership, and enemies.
          </p>
        </header>

        <section className={base.section} aria-labelledby="academy-title">
          <h3 id="academy-title" className={base.sectionTitle}>Training Modules</h3>

          {/* Horizontal rail */}
          <div className={styles.modulesRail} role="list" aria-label="Academy modules">
            {MODULES.map((module: AcademyModule) => {
              const { details: _omit, ...m } = module;
              return <ModuleCard key={m.id} data={m} onOpen={openModal} />;
            })}
          </div>
        </section>
      </div>

      {/* Modal */}
      <Modal
        open={!!selectedModule}
        onClose={closeModal}
        title={selectedModule?.title ?? ''}
        subtitle={selectedModule?.subtitle}
        hero={
          selectedModule
            ? { src: selectedModule.img, alt: selectedModule.imgAlt, width: 1200, height: 675 }
            : undefined
        }
        rightCta={
          selectedModule?.id === 'command' ? (
            <a href="/mod-team" className={styles.ctaButton} aria-label="Apply to Mod Team">
              Apply to Mod Team
            </a>
          ) : null
        }
      >
        {selectedModule && (
          <>
            <div
              id="academy-modal-desc"
              className={base.paragraph}
              style={{ marginBottom: '0.75rem' }}
            >
              {selectedModule.description}
            </div>

            {selectedModule.details.paragraphs.map((p: string) => (
              <p key={p.slice(0, 24)} className={base.paragraph}>{p}</p>
            ))}

            {(selectedModule.details.tips?.length || selectedModule.details.cautions?.length) ? (
              <div className={styles.modalRow}>
                {selectedModule.details.tips?.length ? (
                  <div className={styles.modalListCard}>
                    <div className={styles.modalListTitle}>Tips</div>
                    <ul className={`${base.styledList} ${styles.moduleSkillsList}`}>
                      {selectedModule.details.tips.map((t: string) => (
                        <li key={t} className={base.listItem}>{t}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                {selectedModule.details.cautions?.length ? (
                  <div className={styles.modalListCard}>
                    <div className={styles.modalListTitle}>Cautions</div>
                    <ul className={`${base.styledList} ${styles.moduleSkillsList}`}>
                      {selectedModule.details.cautions.map((c: string) => (
                        <li key={c} className={base.listItem}>{c}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
            ) : null}

            <div className={styles.modalRow} style={{ marginTop: '1.25rem' }}>
              <div className={styles.modalListCard}>
                <div className={styles.modalListTitle}>Basic</div>
                <ul className={`${base.styledList} ${styles.moduleSkillsList}`}>
                  {selectedModule.basic.map((item: string) => (
                    <li key={item} className={base.listItem}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className={styles.modalListCard}>
                <div className={styles.modalListTitle}>Advanced</div>
                <ul className={`${base.styledList} ${styles.moduleSkillsList}`}>
                  {selectedModule.advanced.map((item: string) => (
                    <li key={item} className={base.listItem}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div style={{ marginTop: '1.25rem', textAlign: 'right' }}>
              <button
                type="button"
                onClick={closeModal}
                className={styles.ctaButton}
                aria-label="Close module"
              >
                Close
              </button>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
}

/** Small card component kept inline for clarity */
function ModuleCard({
  data,
  onOpen,
}: {
  data: Omit<AcademyModule, 'details'>;
  onOpen: (id: string, trigger: HTMLButtonElement | null) => void;
}) {
  return (
    <article className={styles.moduleCard} role="listitem">
      {/* Card image */}
      <Image
        className={styles.moduleCardImg}
        src={data.img}
        alt={data.imgAlt}
        width={1200}
        height={675}
        loading="lazy"
      />
      <div className={styles.moduleCardBody}>
        <h4 className={styles.moduleCardTitle}>{data.title}</h4>
        <p className={styles.moduleCardSubtitle}>{data.subtitle}</p>
        <p className={styles.moduleCardDesc}>{data.description}</p>
        <button
          className={styles.ctaButton}
          onClick={(e: MouseEvent<HTMLButtonElement>) => onOpen(data.id, e.currentTarget)}
          aria-haspopup="dialog"
          aria-controls="academy-modal"
          aria-label={`Open ${data.title} module`}
        >
          Open
        </button>
      </div>
    </article>
  );
}
