// src/app/academy/page.tsx
'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import base from '@/styles/Base.module.css';
import styles from '@/styles/AcademyPage.module.css';

type Module = {
  id: string;
  title: string;
  subtitle: string;
  img: string;
  imgAlt: string;
  description: string;
  basic: string[];
  advanced: string[];
  details: {
    paragraphs: string[];
    tips?: string[];
    cautions?: string[];
  };
};

const MODULES: Module[] = [
  {
    id: 'environmental',
    title: 'Environmental',
    subtitle: 'Planetary concerns / considerations',
    img: 'https://placehold.co/1200x675?text=Environmental',
    imgAlt: 'Environmental conditions affecting combat',
    description:
      'Understand how biomes, weather, and hazards change your plan of attack and extraction.',
    basic: [
      'Biomes: desert, arctic, forest, swamp — impacts visibility & mobility',
      'Weather: sandstorms, blizzards, fog/night ops — shorten engagement ranges',
      'Hazards: meteor/artillery zones, lightning, seismic shockwaves, acid pools',
    ],
    advanced: [
      'Route planning: pre-mark safeholds & fallback lines around hazard zones',
      'Adaptation: bring stuns/smokes for low-vis, sentries for lane control',
      'Timing: start objectives between weather waves; call Pelican early',
    ],
    details: {
      paragraphs: [
        'Environmental factors control tempo. Use storms and night ops to break line of sight, rotate squads, and reposition heavy weapons without drawing cross-map aggro.',
        'Meteor/artillery events can be weaponized: fight with your back to their impact lanes so incoming waves path through damage.',
      ],
      tips: [
        'In blizzards, marksmen swap to close-range secondaries; rely on sentry arcs.',
        'Lightning disables bots briefly—time pushes between strikes.',
      ],
      cautions: ['Acid pools destroy extract lanes—scan and plan alternates before uplinks.'],
    },
  },
  {
    id: 'weaponry',
    title: 'Weaponry',
    subtitle: 'Types, range, description',
    img: 'https://placehold.co/1200x675?text=Weaponry',
    imgAlt: 'Helldiver weapons on a rack',
    description:
      'Choose the right tool and range for the job; manage recoil, reloads, and penetration.',
    basic: [
      'Primaries: AR-23 Liberator (AR), SG-225 Breaker (Shotgun), DMR-8 Diligence (DMR)',
      'Energy/Plasma: LAS-16 Sickle (sustain), PLAS-1 Scorcher (splash)',
      'Support/AT: Railgun, Recoilless Rifle, Autocannon for armor threats',
    ],
    advanced: [
      'Armor breakpoints: Chargers legs; Hulks/Devs vents/power units',
      'Target priority: spawners, artillery, commanders before fodder',
      'Ammo economy: share resupplies; rotate roles as mags run low',
    ],
    details: {
      paragraphs: [
        'Think in roles: Anchor (lane denial), Demo (armor delete), Flex (revives/utility). Slot your primary to complement squad gaps.',
        'Penetration and stagger matter more than raw DPS when kiting armored waves.',
      ],
      tips: [
        'Railgun (safe mode off) deletes vents through soft cover.',
        'Autocannon + smoke = safe turreting in open fields.',
      ],
      cautions: ['Breaker friendly-fire cones are wide—announce pushes.'],
    },
  },
  {
    id: 'armory',
    title: 'Armory',
    subtitle: 'Types, range, description',
    img: 'https://placehold.co/1200x675?text=Armory',
    imgAlt: 'Helldiver armor sets on mannequins',
    description:
      'Balance protection and mobility; pick armor that matches your role and mission.',
    basic: [
      'Armor classes: Light (mobility), Medium (balanced), Heavy (survivability)',
      'Mobility & stamina: heavier armor slows sprints and recoveries',
      'Perk synergies: backpack choices (Ammo/Shield) and grenade types',
    ],
    advanced: [
      'Role gearing: Demo (AT focus), Anchor (line holding), Support (revives/backpacks)',
      'Damage mitigation: plan for friendly-fire and explosive radii',
      'Team comp: at least two anti-armor sources per squad',
    ],
    details: {
      paragraphs: [
        'Heavier kits shine in static objectives; light kits excel at map control and tag-and-drag.',
        'Armor choice dictates revive reliability; heavier anchors should carry utility grenades.',
      ],
      tips: ['Heavy + shield backpack = clutch extra life on extracts.'],
      cautions: ['Don’t over-stack heavy; squad mobility collapses under meteor spam.'],
    },
  },
  {
    id: 'stratagems',
    title: 'Stratagems',
    subtitle: 'Type, warnings, advantage',
    img: 'https://placehold.co/1200x675?text=Stratagems',
    imgAlt: 'Stratagem beacons being thrown',
    description:
      'Call down the right support at the right time while managing risk to your squad.',
    basic: [
      'Categories: Offensive (Eagle/Orbitals), Defensive (Sentries/Mines), Utility (Resupply/Shield)',
      'Timing & danger zones: announce throws; clear teammates before impact',
      'LOS & terrain: use ridges/walls to block blast & shrapnel',
    ],
    advanced: [
      'Combos: Stun → Railcannon; Smoke → Uplinks; Barrages to hold extracts',
      'Sentry placement: behind cover, overlapping arcs, avoid friendly lanes',
      'Cooldowns: pre-cast Eagles before timers; stagger orbitals',
    ],
    details: {
      paragraphs: [
        'Treat orbitals like terrain you place: shape enemy paths, then exploit with AT bursts.',
        'Pre-call Eagle runs on spawner pings to keep pressure low during objective inputs.',
      ],
      tips: ['Mortar sentry behind low wall = safe infinite suppression.'],
      cautions: ['Announce precision strikes—no surprise blue-on-blue.'],
    },
  },
  {
    id: 'xenology',
    title: 'Xenology',
    subtitle: 'Race, armor type, weakness, strengths',
    img: 'https://placehold.co/1200x675?text=Xenology',
    imgAlt: 'Enemy faction silhouettes',
    description:
      'Know your enemy: identify armor types, behaviors, and the counters that work.',
    basic: [
      'Factions: Terminids (melee swarms) and Automatons (ranged armor)',
      'Weak points: Charger legs, Bile Titan head/back; Bot vents/power units',
      'Spawners & commanders: eliminate to reduce pressure',
    ],
    advanced: [
      'Counters: AT vs Chargers/Tanks; EMP/Impact vs bots; fire vs bugs',
      'Threat triage: artillery, snipers, breeders before fodder',
      'CC vs single-target: swap roles as the fight evolves',
    ],
    details: {
      paragraphs: [
        'Terminids reward kiting funnels and fire DoTs; Automatons demand cover discipline and angle denial.',
        'Kill-chain: commanders → spawners → heavies → chaff; starve waves at the source.',
      ],
      tips: ['Impact grenades pop bot vents on flanks without exposing the squad.'],
      cautions: ['Don’t chase breeders into fog—bait them into sentry arcs.'],
    },
  },
  {
    id: 'command',
    title: 'Command',
    subtitle: 'Roles, duties, applications',
    img: 'https://placehold.co/1200x675?text=Command',
    imgAlt: 'Command roles and responsibilities',
    description:
      'Understand GPT Fleet leadership roles and how to step up: Fleet Commander (jr. mod), Democracy Officer (mod), Loyalty Officer (admin).',
    basic: [
      'Fleet Commander: squad/event ops, quick decisions, escalates issues',
      'Democracy Officer: moderation, culture enforcement, event leads',
      'Loyalty Officer: admin, policy, security, final arbitration',
    ],
    advanced: [
      'Playbooks: incident triage → de-escalation → resolution → report',
      'Signal: concise comms, standard callouts, delegate early',
      'Pipeline: apply at the Mod Team page; shadow, eval, promote',
    ],
    details: {
      paragraphs: [
        'Command roles keep games moving and the culture consistent. Use clear comms, set tempo, and delegate tasks to maintain momentum under pressure.',
        'Document incidents succinctly: what happened, who was impacted, what action you took, and follow-ups. Consistency builds trust.',
      ],
      tips: [
        'Use standard callouts (“Rotate north”, “Hold extract”, “AT on Charger legs”).',
        'Keep a ready roster for events; backfill before you burn out.',
      ],
      cautions: [
        'Avoid rules lawyering mid-match—stabilize first, debrief after.',
        'Promotions follow performance and culture fit—no fast-tracking.',
      ],
    },
  },
];

export default function AcademyPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const pageShellRef = useRef<HTMLDivElement | null>(null);
  const lastTriggerRef = useRef<HTMLButtonElement | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);

  const selectedModule = useMemo(
    () => MODULES.find((m) => m.id === selectedId) ?? null,
    [selectedId]
  );

  // Lock/unlock background scroll
  useEffect(() => {
    const { body } = document;
    if (selectedModule) {
      const prev = body.style.overflow;
      body.style.overflow = 'hidden';
      return () => {
        body.style.overflow = prev || '';
      };
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
      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
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

  // Inline modal styles kept local to avoid a new CSS file
  const modalStyles = {
    backdrop: {
      position: 'fixed' as const,
      inset: 0,
      background: 'rgba(0,0,0,0.55)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
    },
    dialog: {
      background: '#1f2937',
      color: '#e5e7eb',
      border: '1px solid #374151',
      borderRadius: '0.75rem',
      width: 'min(960px, 96vw)',
      maxHeight: '90vh',
      overflowY: 'auto' as const,
      boxShadow: '0 20px 40px rgba(0,0,0,0.35)',
      position: 'relative' as const,
      outline: 'none',
    },
    header: {
      padding: '1rem 1.25rem',
      borderBottom: '1px solid #374151',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '1rem',
    },
    body: { padding: '1rem 1.25rem 1.5rem' },
    hero: {
      width: '100%',
      aspectRatio: '16/9',
      objectFit: 'cover' as const,
      borderBottom: '1px solid #374151',
      display: 'block',
    },
    close: {
      background: 'transparent',
      color: '#e5e7eb',
      border: '1px solid #4b5563',
      borderRadius: '0.375rem',
      padding: '0.375rem 0.625rem',
      cursor: 'pointer',
    },
  };

  return (
    <div className={base.wrapper}>
      <div className={base.dividerLayer} />

      {/* Page shell gets aria-hidden when modal is open */}
      <div
        ref={pageShellRef}
        className={`${base.pageContainer} ${styles.pageWrapper}`}
        aria-hidden={selectedModule ? true : undefined}
      >
        <header className={styles.pageHeader}>
          <h2 className={styles.pageTitle}>Academy</h2>
          <p className={styles.pageSubtitle}>
            Six training modules covering environments, equipment, tactics, leadership, and enemies.
          </p>
        </header>

        <section className={base.section} aria-labelledby="academy-title">
          <h3 id="academy-title" className={base.sectionTitle}>
            Training Modules
          </h3>

          <div className={styles.modulesGrid} role="list">
            {MODULES.map((m) => (
              <article
                key={m.id}
                id={m.id}
                className={styles.moduleCard}
                role="listitem"
                aria-labelledby={`${m.id}-title`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={m.img}
                  alt={m.imgAlt}
                  className={styles.moduleImage}
                  loading="lazy"
                  decoding="async"
                />
                <div className={styles.moduleContent}>
                  {/* Keep heading hierarchy: h4 inside section */}
                  <h4 id={`${m.id}-title`} className={styles.moduleTitle}>
                    {m.title}
                  </h4>
                  <p className={styles.moduleSubtitle}>{m.subtitle}</p>
                  <p className={base.paragraph}>{m.description}</p>

                  <div className={styles.moduleSkills}>
                    <div>
                      <div className={styles.moduleSkillsSectionTitle}>Basic</div>
                      <ul className={`${base.styledList} ${styles.moduleSkillsList}`}>
                        {m.basic.map((item) => (
                          <li key={item} className={base.listItem}>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <div className={styles.moduleSkillsSectionTitle}>Advanced</div>
                      <ul className={`${base.styledList} ${styles.moduleSkillsList}`}>
                        {m.advanced.map((item) => (
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
                    aria-label={`Open ${m.title} module`}
                    onClick={(e) => openModal(m.id, e.currentTarget)}
                  >
                    Open module
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>

      {/* Modal */}
      {selectedModule && (
        <div
          style={modalStyles.backdrop}
          onClick={closeModal}
          aria-hidden={false}
          data-modal-open
        >
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
            {/* Hero image */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={selectedModule.img}
              alt={selectedModule.imgAlt}
              style={modalStyles.hero}
              loading="eager"
              decoding="sync"
            />

            <div style={modalStyles.header}>
              <div>
                <h3 id="academy-modal-title" className={base.sectionTitle} style={{ marginBottom: 4 }}>
                  {selectedModule.title}
                </h3>
                <p className={styles.moduleSubtitle} style={{ margin: 0 }}>
                  {selectedModule.subtitle}
                </p>
              </div>

              {/* Optional CTA for Command applications */}
              {selectedModule.id === 'command' && (
                <a href="/mod-team" className={styles.ctaButton} aria-label="Apply to Mod Team">
                  Apply to Mod Team
                </a>
              )}

              <button
                ref={closeBtnRef}
                type="button"
                onClick={closeModal}
                style={modalStyles.close}
                aria-label="Close module"
              >
                ✕
              </button>
            </div>

            <div style={modalStyles.body}>
              <div id="academy-modal-desc" className={base.paragraph} style={{ marginBottom: '0.75rem' }}>
                {selectedModule.description}
              </div>

              {/* Long description */}
              {selectedModule.details.paragraphs.map((p) => (
                <p key={p.slice(0, 24)} className={base.paragraph}>
                  {p}
                </p>
              ))}

              {/* Tips / Cautions (if any) */}
              {(selectedModule.details.tips?.length || selectedModule.details.cautions?.length) && (
                <div className={styles.modalRow}>
                  {selectedModule.details.tips?.length ? (
                    <div className={styles.modalListCard}>
                      <div className={styles.modalListTitle}>Tips</div>
                      <ul className={`${base.styledList} ${styles.moduleSkillsList}`}>
                        {selectedModule.details.tips.map((t) => (
                          <li key={t} className={base.listItem}>
                            {t}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}

                  {selectedModule.details.cautions?.length ? (
                    <div className={styles.modalListCard}>
                      <div className={styles.modalListTitle}>Cautions</div>
                      <ul className={`${base.styledList} ${styles.moduleSkillsList}`}>
                        {selectedModule.details.cautions.map((c) => (
                          <li key={c} className={base.listItem}>
                            {c}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </div>
              )}

              {/* Basic / Advanced quick reference */}
              <div className={styles.modalRow} style={{ marginTop: '1.25rem' }}>
                <div className={styles.modalListCard}>
                  <div className={styles.modalListTitle}>Basic</div>
                  <ul className={`${base.styledList} ${styles.moduleSkillsList}`}>
                    {selectedModule.basic.map((item) => (
                      <li key={item} className={base.listItem}>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className={styles.modalListCard}>
                  <div className={styles.modalListTitle}>Advanced</div>
                  <ul className={`${base.styledList} ${styles.moduleSkillsList}`}>
                    {selectedModule.advanced.map((item) => (
                      <li key={item} className={base.listItem}>
                        {item}
                      </li>
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
            </div>
          </div>
        </div>
      )}
    </div>
  );
}