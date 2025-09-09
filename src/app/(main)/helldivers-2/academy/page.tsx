/* eslint-disable @next/next/no-img-element */
'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import base from '../HelldiversBase.module.css';
import page from './AcademyPage.module.css';
import ModuleCard from '@/components/academy/ModuleCard';
import { MODULES, type ModuleWithDetails } from '@/components/academy/Modules';

export default function AcademyPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const lastTriggerRef = useRef<HTMLButtonElement | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);

  const selectedModule = useMemo<ModuleWithDetails | null>(
    () => MODULES.find((m) => m.id === selectedId) ?? null,
    [selectedId]
  );

  // Lock/unlock background scroll when modal opens/closes
  useEffect(() => {
    const { body } = document;
    if (selectedModule) {
      const prev = body.style.overflow;
      body.style.overflow = 'hidden';
      return () => void (body.style.overflow = prev || '');
    }
  }, [selectedModule]);

  // ESC to close + focus to close button on open
  useEffect(() => {
    if (!selectedModule) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        setSelectedId(null);
      }
    };
    window.addEventListener('keydown', onKey);
    closeBtnRef.current?.focus();
    return () => window.removeEventListener('keydown', onKey);
  }, [selectedModule]);

  // Trap focus inside the modal
  useEffect(() => {
    if (!selectedModule || !modalRef.current) return;
    const modalEl = modalRef.current;
    const getFocusable = () =>
      Array.from(
        modalEl.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
      ).filter((el) => !el.hasAttribute('disabled') && !el.getAttribute('aria-hidden'));
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      const focusables = getFocusable();
      if (focusables.length === 0) return;
      const first = focusables[0], last = focusables[focusables.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus(); }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    modalEl.addEventListener('keydown', onKeyDown as any);
    return () => modalEl.removeEventListener('keydown', onKeyDown as any);
  }, [selectedModule]);

  const openModal = (id: string, trigger: HTMLButtonElement | null) => {
    lastTriggerRef.current = trigger;
    setSelectedId(id);
  };
  const closeModal = () => {
    setSelectedId(null);
    lastTriggerRef.current?.focus();
  };

  // Inline modal styles (kept local)
  const modalStyles = {
    backdrop: {
      position: 'fixed' as const, inset: 0, background: 'rgba(0,0,0,0.55)',
      zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem',
    },
    dialog: {
      background: '#1f2937', color: '#e5e7eb', border: '1px solid #374151', borderRadius: '0.75rem',
      width: 'min(960px, 96vw)', maxHeight: '90vh', overflowY: 'auto' as const, boxShadow: '0 20px 40px rgba(0,0,0,0.35)',
      position: 'relative' as const, outline: 'none',
    },
    header: {
      padding: '1rem 1.25rem', borderBottom: '1px solid #374151',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem',
    },
    body: { padding: '1rem 1.25rem 1.5rem' },
    hero: {
      width: '100%', aspectRatio: '16/9', objectFit: 'cover' as const, borderBottom: '1px solid #374151', display: 'block',
    },
    close: {
      background: 'transparent', color: '#e5e7eb', border: '1px solid #4b5563', borderRadius: '0.375rem', padding: '0.375rem 0.625rem', cursor: 'pointer',
    },
  };

  return (
    <div className={base.wrapper}>
      <div className={base.dividerLayer} />

      <div className={`${base.pageContainer} ${page.pageWrapper}`}>
        <header className={page.pageHeader}>
          <h2 className={page.pageTitle}>Academy</h2>
          <p className={page.pageSubtitle}>
            Six training modules covering environments, equipment, tactics, leadership, and enemies.
          </p>
        </header>

        <section className={base.section} aria-labelledby="academy-title">
          <h3 id="academy-title" className={base.sectionTitle}>Training Modules</h3>

          {/* Horizontal rail */}
          <div className={page.modulesRail} role="list" aria-label="Academy modules">
            {MODULES.map(({ details, ...m }) => (
              <ModuleCard key={m.id} data={m} onOpen={openModal} />
            ))}
          </div>
        </section>
      </div>

      {/* Modal */}
      {selectedModule && (
        <div style={modalStyles.backdrop} onClick={closeModal} data-modal-open>
          <div
            id="academy-modal"
            ref={modalRef}
            style={modalStyles.dialog}
            role="dialog"
            aria-modal="true"
            aria-labelledby="academy-modal-title"
            aria-describedby="academy-modal-desc"
            tabIndex={-1}
            onClick={(e) => e.stopPropagation()}
          >
            <img src={selectedModule.img} alt={selectedModule.imgAlt} style={modalStyles.hero} loading="eager" decoding="sync" />

            <div style={modalStyles.header}>
              <div>
                <h3 id="academy-modal-title" className={base.sectionTitle} style={{ marginBottom: 4 }}>
                  {selectedModule.title}
                </h3>
                <p className={page.moduleSubtitle} style={{ margin: 0 }}>
                  {selectedModule.subtitle}
                </p>
              </div>

              {selectedModule.id === 'command' && (
                <a href="/mod-team" className={page.ctaButton} aria-label="Apply to Mod Team">Apply to Mod Team</a>
              )}

              <button ref={closeBtnRef} type="button" onClick={closeModal} style={modalStyles.close} aria-label="Close module">✕</button>
            </div>

            <div style={modalStyles.body}>
              <div id="academy-modal-desc" className={base.paragraph} style={{ marginBottom: '0.75rem' }}>
                {selectedModule.description}
              </div>

              {selectedModule.details.paragraphs.map((p) => (
                <p key={p.slice(0, 24)} className={base.paragraph}>{p}</p>
              ))}

              {(selectedModule.details.tips?.length || selectedModule.details.cautions?.length) && (
                <div className={page.modalRow}>
                  {selectedModule.details.tips?.length ? (
                    <div className={page.modalListCard}>
                      <div className={page.modalListTitle}>Tips</div>
                      <ul className={`${base.styledList} ${page.moduleSkillsList}`}>
                        {selectedModule.details.tips.map((t) => (
                          <li key={t} className={base.listItem}>{t}</li>
                        ))}
                      </ul>
                    </div>
                  ) : null}

                  {selectedModule.details.cautions?.length ? (
                    <div className={page.modalListCard}>
                      <div className={page.modalListTitle}>Cautions</div>
                      <ul className={`${base.styledList} ${page.moduleSkillsList}`}>
                        {selectedModule.details.cautions.map((c) => (
                          <li key={c} className={base.listItem}>{c}</li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </div>
              )}

              <div className={page.modalRow} style={{ marginTop: '1.25rem' }}>
                <div className={page.modalListCard}>
                  <div className={page.modalListTitle}>Basic</div>
                  <ul className={`${base.styledList} ${page.moduleSkillsList}`}>
                    {selectedModule.basic.map((item) => (
                      <li key={item} className={base.listItem}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div className={page.modalListCard}>
                  <div className={page.modalListTitle}>Advanced</div>
                  <ul className={`${base.styledList} ${page.moduleSkillsList}`}>
                    {selectedModule.advanced.map((item) => (
                      <li key={item} className={base.listItem}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div style={{ marginTop: '1.25rem', textAlign: 'right' }}>
                <button type="button" onClick={closeModal} className={page.ctaButton} aria-label="Close module">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
