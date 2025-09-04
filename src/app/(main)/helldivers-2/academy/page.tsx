// src/app/(main)/helldivers-2/academy/page.tsx
'use client';
import base from '../HelldiversBase.module.css';
import styles from './AcademyPage.module.css';

type Module = {
  id: string;
  title: string;
  subtitle: string;
  img: string;
  imgAlt: string;
  description: string;
  basic: string[];
  advanced: string[];
  cta: { label: string; href: string };
};

const MOD_TEAM_URL = '/mod-team';

const MODULES: Module[] = [
  {
    id: 'environmental',
    title: 'Environmental',
    subtitle: 'Planetary concerns / considerations',
    img: 'https://placehold.co/800x450?text=Environmental',
    imgAlt: 'Placeholder image for the Environmental module',
    description:
      'Understand how biomes, weather, and hazards change your plan of attack and extraction.',
    basic: [
      'Biomes & terrain: desert, arctic, forest, swamp',
      'Weather & visibility: storms, blizzards, night ops',
      'Traversal hazards: deep snow, swamps, cliffs',
    ],
    advanced: [
      'Hazard stacking & mitigation planning',
      'Loadout adaptation by biome and objective',
      'Route planning, exfil lanes, safe holds',
    ],
    cta: { label: 'Open module', href: '/academy/environmental' },
  },
  {
    id: 'weaponry',
    title: 'Weaponry',
    subtitle: 'Types, range, description',
    img: 'https://placehold.co/800x450?text=Weaponry',
    imgAlt: 'Placeholder image for the Weaponry module',
    description:
      'Choose the right tool and range for the job; manage recoil, reloads, and penetration.',
    basic: [
      'Classes & roles: AR, SMG, Shotgun, DMR, Sniper, Energy, Launcher',
      'Effective ranges & time-to-kill basics',
      'Recoil/handling, reload timing, optics',
    ],
    advanced: [
      'Armor penetration tiers & breakpoints',
      'Suppression, stagger, and weak-point targeting',
      'Ammo economy & target prioritization',
    ],
    cta: { label: 'Open module', href: '/academy/weaponry' },
  },
  {
    id: 'armory',
    title: 'Armory',
    subtitle: 'Types, range, description',
    img: 'https://placehold.co/800x450?text=Armory',
    imgAlt: 'Placeholder image for the Armory module',
    description:
      'Balance protection and mobility; pick armor that matches your role and mission.',
    basic: [
      'Armor classes: Light / Medium / Heavy',
      'Mobility & stamina impact by class',
      'Resistances: explosive, energy, melee',
    ],
    advanced: [
      'Damage thresholds & survivability tradeoffs',
      'Environmental protection (heat, cold, acid)',
      'Perk synergy & role-based gearing',
    ],
    cta: { label: 'Open module', href: '/academy/armory' },
  },
  {
    id: 'strategems',
    title: 'Strategems',
    subtitle: 'Type, warnings, advantage',
    img: 'https://placehold.co/800x450?text=Strategems',
    imgAlt: 'Placeholder image for the Strategems module',
    description:
      'Call down the right support at the right time while managing risk to your squad.',
    basic: [
      'Types: Offensive, Defensive, Support, Utility',
      'Call-in timing, danger radius, LOS/terrain',
      'Friendly-fire risks & clear comms',
    ],
    advanced: [
      'Objective timing & area denial plays',
      'Chaining combos under pressure',
      'Resource economy & cooldown stacking',
    ],
    cta: { label: 'Open module', href: '/academy/strategems' },
  },
  {
    id: 'xenology',
    title: 'Xenology',
    subtitle: 'Race, armor type, weakness, strengths',
    img: 'https://placehold.co/800x450?text=Xenology',
    imgAlt: 'Placeholder image for the Xenology module',
    description:
      'Know your enemy: identify armor types, behaviors, and the counters that work.',
    basic: [
      'Races overview: Terminids, Automatons (and others if present)',
      'Armor types: chitin, plating, shielding',
      'Attack patterns, tells, and aggro',
    ],
    advanced: [
      'Weak points & damage-type matchups',
      'Elite variants and counterplay',
      'Crowd control vs. single-target focus',
    ],
    cta: { label: 'Open module', href: '/academy/xenology' },
  },
  {
    id: 'command',
    title: 'Command',
    subtitle: 'Fleet Commander • Democracy Officer • Loyalty Officer',
    img: 'https://placehold.co/800x450?text=Command',
    imgAlt: 'Placeholder image for the Command module',
    description: 'How our leadership structure works and how to step up.',
    basic: [
      'Fleet Commander (junior mod): squad coordination & comms',
      'Democracy Officer (mod): events, culture, moderation',
      'Loyalty Officer (admin): systems, security, escalation',
    ],
    advanced: [
      'SOPs: moderation ladder & incident playbooks',
      'Event ops: briefing, debrief, AARs',
      'Cross-server coordination & chain of command',
    ],
    cta: { label: 'Apply at the Mod Team page', href: MOD_TEAM_URL },
  },
];

export default function AcademyPage() {
  return (
    <div className={base.wrapper}>
      <div className={base.dividerLayer} />
      <div className={base.pageContainer}>
        <section className={base.section} aria-labelledby="academy-title">
          <h2 id="academy-title" className={base.sectionTitle}>
            Academy
          </h2>
          <p className={base.paragraph}>
            Six training modules covering environments, equipment, tactics, enemies, and leadership.
          </p>

          <div className={styles.modulesGrid} role="list">
            {MODULES.map((m) => (
              <article
                key={m.id}
                id={m.id}
                className={styles.moduleCard}
                role="listitem"
                aria-labelledby={`${m.id}-title`}
              >
                {/* 16:9 image placeholder above the title */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={m.img} alt={m.imgAlt} className={styles.image} />
                <div className={styles.cardContent}>
                  <h3 id={`${m.id}-title`} className={styles.title}>
                    {m.title}
                  </h3>
                  <p className={styles.subtitle}>{m.subtitle}</p>
                  <p>{m.description}</p>

                  <div className={styles.lists}>
                    <div>
                      <h4>Basic</h4>
                      <ul className="styled-list disc">
                        {m.basic.map((item) => (
                          <li key={item} className="list-item">
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4>Advanced</h4>
                      <ul className="styled-list disc">
                        {m.advanced.map((item) => (
                          <li key={item} className="list-item">
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className={styles.ctaRow}>
                    <a href={m.cta.href} className="btn btn-secondary" aria-label={m.cta.label}>
                      {m.cta.label}
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
