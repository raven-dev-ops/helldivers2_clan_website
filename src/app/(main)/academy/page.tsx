'use client';
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
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={m.img} alt={m.imgAlt} className={styles.image} />
                <div className={styles.cardContent}>
                  <h3 className={styles.title}>{m.title}</h3>
                  <p className={styles.subtitle}>{m.subtitle}</p>
                  <div className={styles.ctaRow}>
                    <a className="btn btn-secondary" href={`#${m.id}`}>
                      Open module
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Detail Sections */}
        <section id="tactics" className={base.section} aria-labelledby="tactics-title">
          <h3 id="tactics-title" className={base.sectionTitle}>Tactics</h3>
          <p className={base.paragraph}>
            Win fights before they start: control spacing, angles, and comms. Friendly fire is
            always on—plan crossfires and keep room for stratagems.
          </p>
          <div className={base.subsectionCard}>
            <h4 className={base.subHeading}>Basics</h4>
            <ul className={base.styledList}>
              <li className={base.listItem}>Maintain 10–15m spacing to avoid chain wipes and allow safe throws.</li>
              <li className={base.listItem}>Use cardinal callouts (N/E/S/W) and “Clear comms” during high intensity.</li>
              <li className={base.listItem}>Create funnels: fight from cover, use terrain, mines, and sentries.</li>
            </ul>
          </div>
          <div className={base.subsectionCard}>
            <h4 className={base.subHeading}>Advanced</h4>
            <ul className={base.styledList}>
              <li className={base.listItem}>Bait and reset detection; break line‑of‑sight to shed aggro.</li>
              <li className={base.listItem}>Time objectives around patrol cycles; pre‑stage reinforcements/extraction.</li>
              <li className={base.listItem}>Define roles: Lead, Anchor, Flex, Demo; rotate based on objective.</li>
            </ul>
          </div>
        </section>

        <section id="loadouts" className={base.section} aria-labelledby="loadouts-title">
          <h3 id="loadouts-title" className={base.sectionTitle}>Loadouts</h3>
          <p className={base.paragraph}>
            Build for the mission and enemy. Cover anti‑armor, anti‑horde, and utility. Armor
            class affects stamina and survivability—balance speed and protection.
          </p>
          <div className={base.subsectionCard}>
            <h4 className={base.subHeading}>Basics</h4>
            <ul className={base.styledList}>
              <li className={base.listItem}>Primary archetypes: AR‑23 Liberator (AR), SG‑225 Breaker (Shotgun), DMR‑8 Diligence (DMR).</li>
              <li className={base.listItem}>Energy/Plasma options: LAS‑16 Sickle, PLAS‑1 Scorcher for horde clearing.</li>
              <li className={base.listItem}>Armor classes: Light = mobility, Heavy = survivability; Medium balances both.</li>
            </ul>
          </div>
          <div className={base.subsectionCard}>
            <h4 className={base.subHeading}>Advanced</h4>
            <ul className={base.styledList}>
              <li className={base.listItem}>Ensure two sources of anti‑armor (Recoilless, Autocannon, Railgun, Quasar Cannon).</li>
              <li className={base.listItem}>Match grenades to faction: Stun/Incendiary vs. bugs; EMP/Impact vs. bots.</li>
              <li className={base.listItem}>Synergize backpacks (Ammo/Shield) with squad weapons and stratagem plans.</li>
            </ul>
          </div>
        </section>

        <section id="stratagems" className={base.section} aria-labelledby="stratagems-title">
          <h3 id="stratagems-title" className={base.sectionTitle}>Stratagems</h3>
          <p className={base.paragraph}>
            Offensive, Defensive, Support, and Utility tools called from orbit. All can kill
            teammates—announce throws and watch danger zones.
          </p>
          <div className={base.subsectionCard}>
            <h4 className={base.subHeading}>Basics</h4>
            <ul className={base.styledList}>
              <li className={base.listItem}>Eagle airstrikes for fast precision; Orbitals for area denial and sieges.</li>
              <li className={base.listItem}>Sentries (Gatling/Mortar) cover lanes; place behind cover and mark arcs.</li>
              <li className={base.listItem}>Utility: Resupply, Shield Generator Pack, Guard Dog variants, Minefields.</li>
            </ul>
          </div>
          <div className={base.subsectionCard}>
            <h4 className={base.subHeading}>Advanced</h4>
            <ul className={base.styledList}>
              <li className={base.listItem}>Combo plays: Stuns → Orbital Laser; Smoke → Safe uplinks/extraction.</li>
              <li className={base.listItem}>Pre‑cast Eagle 110mm on extracts; chain barrages to hold objectives.</li>
              <li className={base.listItem}>Assign callout words and throw order; one caller at a time under pressure.</li>
            </ul>
          </div>
        </section>

        <section id="enemies" className={base.section} aria-labelledby="enemies-title">
          <h3 id="enemies-title" className={base.sectionTitle}>Enemies</h3>
          <p className={base.paragraph}>
            Know the faction, identify threats, and target weak points. Current adversaries are the
            Terminids and Automatons.
          </p>
          <div className={base.subsectionCard}>
            <h4 className={base.subHeading}>Terminids</h4>
            <ul className={base.styledList}>
              <li className={base.listItem}>Charger: target leg joints; mines, Recoilless, and Railcannon excel.</li>
              <li className={base.listItem}>Bile Titan: head/back sacs; heavy orbitals, Railcannon, AT weapons.</li>
              <li className={base.listItem}>Brood Commander/Stalker: prioritize to stop endless spawns.</li>
            </ul>
          </div>
          <div className={base.subsectionCard}>
            <h4 className={base.subHeading}>Automatons</h4>
            <ul className={base.styledList}>
              <li className={base.listItem}>Devastators/Hulks: hit back vents and power units; EMP and Railgun help.</li>
              <li className={base.listItem}>Tanks/Walkers: flank for rear shots; Eagle 500kg and Recoilless pairs.</li>
              <li className={base.listItem}>Sniper/Artillery units: counter‑battery with Orbitals; smoke to cross.</li>
            </ul>
          </div>
        </section>

        <section id="missions" className={base.section} aria-labelledby="missions-title">
          <h3 id="missions-title" className={base.sectionTitle}>Missions</h3>
          <p className={base.paragraph}>
            Operations chain multiple objectives. Scout routes, clear patrols, complete primaries,
            then extract on your terms—call the Pelican early.
          </p>
          <div className={base.subsectionCard}>
            <h4 className={base.subHeading}>Basics</h4>
            <ul className={base.styledList}>
              <li className={base.listItem}>Objective types: Eradicate, Uplink/Activate, Destroy targets, Retrieve data.</li>
              <li className={base.listItem}>Do secondaries opportunistically; samples are a bonus, not worth wipes.</li>
              <li className={base.listItem}>Mark safeholds and fallback lines; rotate when pressure spikes.</li>
            </ul>
          </div>
          <div className={base.subsectionCard}>
            <h4 className={base.subHeading}>Advanced</h4>
            <ul className={base.styledList}>
              <li className={base.listItem}>Time objectives around weather and patrol density; avoid storms if possible.</li>
              <li className={base.listItem}>Pre‑stage ammo, sentries, and orbitals before starting timers.</li>
              <li className={base.listItem}>Bounded fallback: leapfrog pairs covering each other to disengage cleanly.</li>
            </ul>
          </div>
        </section>

        <section id="squad-training" className={base.section} aria-labelledby="squad-title">
          <h3 id="squad-title" className={base.sectionTitle}>Squad Training</h3>
          <p className={base.paragraph}>
            Practice comms, spacing, and role execution so tactics become automatic under stress.
          </p>
          <div className={base.subsectionCard}>
            <h4 className={base.subHeading}>Drills</h4>
            <ul className={base.styledList}>
              <li className={base.listItem}>Stratagem cadence: one caller, numbered throws, confirm “Safe.”</li>
              <li className={base.listItem}>Revive and drag: secure before pickup; smoke/stun for safe medic work.</li>
              <li className={base.listItem}>Ammo economy: share resupplies; call last mag; rotate weapon roles.</li>
            </ul>
          </div>
          <div className={base.subsectionCard}>
            <h4 className={base.subHeading}>Roles</h4>
            <ul className={base.styledList}>
              <li className={base.listItem}>Lead: sets route and pace; Anchor: holds line; Flex: plugs gaps.</li>
              <li className={base.listItem}>Demo: focuses armor control with AT tools and stun/slow utilities.</li>
              <li className={base.listItem}>Support: backpack management (Ammo/Shield) and revive priority.</li>
            </ul>
          </div>
        </section>

        <section id="environmental" className={base.section} aria-labelledby="env-title">
          <h3 id="env-title" className={base.sectionTitle}>Environmental</h3>
          <p className={base.paragraph}>
            Biomes and weather change visibility, mobility, and combat tempo. Adapt loadouts and
            routes accordingly.
          </p>
          <div className={base.subsectionCard}>
            <h4 className={base.subHeading}>Biomes & Weather</h4>
            <ul className={base.styledList}>
              <li className={base.listItem}>Desert/Sandstorm: vision and accuracy penalties—close distance to fight.</li>
              <li className={base.listItem}>Arctic/Blizzard: reduced visibility and stamina; plan shorter sprints.</li>
              <li className={base.listItem}>Forest/Swamp: uneven ground and slow zones; clear lanes for extract.</li>
            </ul>
          </div>
          <div className={base.subsectionCard}>
            <h4 className={base.subHeading}>Hazards</h4>
            <ul className={base.styledList}>
              <li className={base.listItem}>Meteor showers and artillery: eyes up; avoid open ground and ridge lines.</li>
              <li className={base.listItem}>Lightning/Storms: avoid metal emplacements; watch for stun/EMP effects.</li>
              <li className={base.listItem}>Seismic/Acid: brace for knockdowns and DoTs; time objectives between waves.</li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
