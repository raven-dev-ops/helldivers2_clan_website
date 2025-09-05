'use client';
import base from '../../helldivers-2/HelldiversBase.module.css';
import styles from '../AcademyPage.module.css';
import { notFound } from 'next/navigation';

type ModuleDetail = {
  id: string;
  title: string;
  subtitle: string;
  img: string;
  imgAlt: string;
  description?: string;
  basics?: string[];
  advanced?: string[];
};

const MODULES: Record<string, ModuleDetail> = {
  tactics: {
    id: 'tactics',
    title: 'Tactics',
    subtitle: 'Positioning, awareness, communication',
    img: 'https://placehold.co/1200x500?text=Tactics',
    imgAlt: 'Tactics cover image',
    description:
      'Win fights before they start: control spacing, angles, and comms. Friendly fire is always on—plan crossfires and keep room for stratagems.',
    basics: [
      'Maintain 10–15m spacing to avoid chain wipes and allow safe throws.',
      'Use cardinal callouts (N/E/S/W) and “Clear comms” during high intensity.',
      'Create funnels: fight from cover, use terrain, mines, and sentries.',
    ],
    advanced: [
      'Bait and reset detection; break line‑of‑sight to shed aggro.',
      'Time objectives around patrol cycles; pre‑stage reinforcements/extraction.',
      'Define roles: Lead, Anchor, Flex, Demo; rotate based on objective.',
    ],
  },
  loadouts: {
    id: 'loadouts',
    title: 'Loadouts',
    subtitle: 'Weapons, armor, perks',
    img: 'https://placehold.co/1200x500?text=Loadouts',
    imgAlt: 'Loadouts cover image',
    description:
      'Build for the mission and enemy. Cover anti‑armor, anti‑horde, and utility. Armor class affects stamina and survivability—balance speed and protection.',
    basics: [
      'Primary archetypes: AR‑23 Liberator (AR), SG‑225 Breaker (Shotgun), DMR‑8 Diligence (DMR).',
      'Energy/Plasma options: LAS‑16 Sickle, PLAS‑1 Scorcher for horde clearing.',
      'Armor classes: Light = mobility, Heavy = survivability; Medium balances both.',
    ],
    advanced: [
      'Ensure two sources of anti‑armor (Recoilless, Autocannon, Railgun, Quasar Cannon).',
      'Match grenades to faction: Stun/Incendiary vs. bugs; EMP/Impact vs. bots.',
      'Synergize backpacks (Ammo/Shield) with squad weapons and stratagem plans.',
    ],
  },
  stratagems: {
    id: 'stratagems',
    title: 'Stratagems',
    subtitle: 'Usage, risks, combos',
    img: 'https://placehold.co/1200x500?text=Stratagems',
    imgAlt: 'Stratagems cover image',
    description:
      'Offensive, Defensive, Support, and Utility tools called from orbit. All can kill teammates—announce throws and watch danger zones.',
    basics: [
      'Eagle airstrikes for fast precision; Orbitals for area denial and sieges.',
      'Sentries (Gatling/Mortar) cover lanes; place behind cover and mark arcs.',
      'Utility: Resupply, Shield Generator Pack, Guard Dog variants, Minefields.',
    ],
    advanced: [
      'Combo plays: Stuns → Orbital Laser; Smoke → Safe uplinks/extraction.',
      'Pre‑cast Eagle 110mm on extracts; chain barrages to hold objectives.',
      'Assign callout words and throw order; one caller at a time under pressure.',
    ],
  },
  enemies: {
    id: 'enemies',
    title: 'Enemies',
    subtitle: 'Types, weaknesses, behaviors',
    img: 'https://placehold.co/1200x500?text=Enemies',
    imgAlt: 'Enemies cover image',
    description:
      'Know the faction, identify threats, and target weak points. Current adversaries are the Terminids and Automatons.',
    basics: [
      'Terminids: Chargers (leg joints), Bile Titan (head/back sacs), spawner focus.',
      'Automatons: Devastators/Hulks (vents/power units), Tanks/Walkers (rear).',
      'Prioritize spawners, artillery, and commanders to reduce pressure.',
    ],
    advanced: [
      'Counterplay: AT vs. Chargers/Tanks; EMP/Impact vs. bots; fire vs. bugs.',
      'Counter‑battery orbitals vs. artillery; smoke to cross sniper lanes.',
      'Swap roles as the fight evolves: crowd control vs. single‑target focus.',
    ],
  },
  missions: {
    id: 'missions',
    title: 'Missions',
    subtitle: 'Objectives, routes, execution',
    img: 'https://placehold.co/1200x500?text=Missions',
    imgAlt: 'Missions cover image',
    description:
      'Operations chain multiple objectives. Scout routes, clear patrols, complete primaries, then extract on your terms—call the Pelican early.',
    basics: [
      'Objective types: Eradicate, Uplink/Activate, Destroy targets, Retrieve data.',
      'Do secondaries opportunistically; samples are a bonus, not worth wipes.',
      'Mark safeholds and fallback lines; rotate when pressure spikes.',
    ],
    advanced: [
      'Time objectives around weather and patrol density; avoid storms if possible.',
      'Pre‑stage ammo, sentries, and orbitals before starting timers.',
      'Bounded fallback: leapfrog pairs covering each other to disengage cleanly.',
    ],
  },
  'squad-training': {
    id: 'squad-training',
    title: 'Squad Training',
    subtitle: 'Roles, synergy, drills',
    img: 'https://placehold.co/1200x500?text=Squad+Training',
    imgAlt: 'Squad Training cover image',
    description:
      'Practice comms, spacing, and role execution so tactics become automatic under stress.',
    basics: [
      'Stratagem cadence: one caller, numbered throws, confirm “Safe.”',
      'Revive and drag: secure before pickup; smoke/stun for safe medic work.',
      'Ammo economy: share resupplies; call last mag; rotate weapon roles.',
    ],
    advanced: [
      'Role definitions: Lead, Anchor, Flex, Demo; adapt per objective.',
      'Backpack management: Ammo/Shield alignment with weapons and stratagems.',
      'Team drills: breach, extract, and fallback under timed pressure.',
    ],
  },
};

export default function ModuleDetailPage({ params }: { params: { moduleId: string } }) {
  const moduleId = decodeURIComponent(params.moduleId);
  const moduleData = MODULES[moduleId];

  if (!moduleData) {
    notFound();
  }

  return (
    <div className={base.wrapper}>
      <div className={base.dividerLayer} />
      <div className={base.pageContainer}>
        <header className={styles.pageHeader}>
          <h2 className={styles.pageTitle}>{moduleData.title}</h2>
          <p className={styles.pageSubtitle}>{moduleData.subtitle}</p>
        </header>

        <section className={base.section} aria-labelledby="overview-title">
          <h3 id="overview-title" className={base.sectionTitle}>Overview</h3>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={moduleData.img} alt={moduleData.imgAlt} className={styles.image} />
          {moduleData.description && (
            <p className={base.paragraph}>{moduleData.description}</p>
          )}
        </section>

        {(moduleData.basics?.length || moduleData.advanced?.length) && (
          <section className={base.section} aria-labelledby="curriculum-title">
            <h3 id="curriculum-title" className={base.sectionTitle}>Curriculum</h3>
            <div className={styles.modulesGrid}>
              {moduleData.basics?.length ? (
                <div className={base.subsectionCard}>
                  <h4 className={base.subHeading}>Basic</h4>
                  <ul className={base.styledList}>
                    {moduleData.basics.map((item) => (
                      <li key={item} className={base.listItem}>{item}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
              {moduleData.advanced?.length ? (
                <div className={base.subsectionCard}>
                  <h4 className={base.subHeading}>Advanced</h4>
                  <ul className={base.styledList}>
                    {moduleData.advanced.map((item) => (
                      <li key={item} className={base.listItem}>{item}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

export function generateStaticParams() {
  return Object.keys(MODULES).map((id) => ({ moduleId: id }));
}

