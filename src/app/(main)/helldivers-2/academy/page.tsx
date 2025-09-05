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
      'Biomes: desert, arctic, forest, swamp — affects visibility and mobility',
      'Weather: sandstorms, blizzards, fog/night ops — shorten engagement ranges',
      'Hazards: meteor/artillery zones, lightning, seismic shockwaves, acid pools',
    ],
    advanced: [
      'Route planning: pre‑mark safeholds and fallback lines around hazard zones',
      'Adaptation: bring stuns/smokes for low‑vis and sentries for lane control',
      'Timing: start objectives between weather waves; call Pelican early',
    ],
    cta: { label: 'Open module', href: '/academy#environmental' },
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
      'Primary archetypes: AR‑23 Liberator (AR), SG‑225 Breaker (Shotgun), DMR‑8 Diligence (DMR)',
      'Energy/Plasma: LAS‑16 Sickle (horde sustain), PLAS‑1 Scorcher (splash)',
      'Support/AT: Railgun, Recoilless Rifle, Autocannon for armor threats',
    ],
    advanced: [
      'Armor breakpoints: Chargers (leg joints), Hulks/Devs (vents/power units)',
      'Target priority: spawners, artillery, commanders before fodder',
      'Ammo economy: share resupplies; rotate roles as mags run low',
    ],
    cta: { label: 'Open module', href: '/academy#loadouts' },
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
      'Armor classes: Light (mobility), Medium (balanced), Heavy (survivability)',
      'Mobility & stamina: heavier armor slows sprints and recoveries',
      'Perk synergies: backpack choices (Ammo/Shield) and grenade types',
    ],
    advanced: [
      'Role gearing: Demo (AT focus), Anchor (line holding), Support (revives/backpacks)',
      'Damage mitigation: plan for friendly‑fire and explosive radii',
      'Team comp: at least two anti‑armor sources per squad',
    ],
    cta: { label: 'Open module', href: '/academy#loadouts' },
  },
  {
    id: 'stratagems',
    title: 'Stratagems',
    subtitle: 'Type, warnings, advantage',
    img: 'https://placehold.co/800x450?text=Stratagems',
    imgAlt: 'Placeholder image for the Stratagems module',
    description:
      'Call down the right support at the right time while managing risk to your squad.',
    basic: [
      'Categories: Offensive (Eagle/Orbitals), Defensive (Sentries/Mines), Utility (Resupply/Shield)',
      'Timing & danger zones: announce throws; clear teammates before impact',
      'Line‑of‑sight & terrain: use ridges/walls to block blast and shrapnel',
    ],
    advanced: [
      'Combos: Stun → Railcannon; Smoke → Uplinks; Barrages to hold extracts',
      'Sentry placement: behind cover, overlapping arcs, avoid friendly lanes',
      'Cooldown management: pre‑cast Eagles before timers; stagger orbitals',
    ],
    cta: { label: 'Open module', href: '/academy#stratagems' },
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
      'Factions: Terminids (melee swarms) and Automatons (ranged armor)',
      'Weak points: Charger legs, Bile Titan head/back; Bot vents/power units',
      'Spawners and commanders: eliminate to reduce pressure',
    ],
    advanced: [
      'Counterplay: AT for Chargers/Tanks; EMP/Impact vs. bots; fire vs. bugs',
      'Threat triage: artillery, snipers, and breeders before fodder',
      'Crowd control vs. single‑target: swap roles as the fight evolves',
    ],
    cta: { label: 'Open module', href: '/academy#enemies' },
  },
];

export default function AcademyPage() {
  return (
    <div className={base.wrapper}>
      <div className={base.dividerLayer} />
      <div className={base.pageContainer}>
        <header className={styles.pageHeader}>
          <h2 className={styles.pageTitle}>Academy</h2>
          <p className={styles.pageSubtitle}>
            Five training modules covering environments, equipment, tactics, and enemies.
          </p>
        </header>

        <section className={base.section} aria-labelledby="academy-title">
          <h3 id="academy-title" className={base.sectionTitle}>Training Modules</h3>

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
                <img src={m.img} alt={m.imgAlt} className={styles.moduleImage} />
                <div className={styles.moduleContent}>
                  <h3 id={`${m.id}-title`} className={styles.moduleTitle}>
                    {m.title}
                  </h3>
                  <p className={styles.moduleSubtitle}>{m.subtitle}</p>
                  <p className={base.paragraph}>{m.description}</p>

                  <div className={styles.moduleSkills}>
                    <div>
                      <h4>Basic</h4>
                      <ul className={base.styledList}>
                        {m.basic.map((item) => (
                          <li key={item} className={base.listItem}>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4>Advanced</h4>
                      <ul className={base.styledList}>
                        {m.advanced.map((item) => (
                          <li key={item} className={base.listItem}>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <a href={m.cta.href} className={styles.ctaButton} aria-label={m.cta.label}>
                    {m.cta.label}
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
