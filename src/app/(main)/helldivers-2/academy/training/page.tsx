// src/app/(main)/helldivers-2/academy/training/page.tsx
"use client";

import styles from '../../HelldiversPage.module.css';

// Placeholder video topics
const trainingTopics = [
  'Automaton Guide',
  'Terminid Guide',
  'Squid Guide',
  'Objectives & Side Objectives',
  'Warbond Yapping',
  'Outpost Tactics',
  'Stratagem Mechanics',
  'Coming Soon',
  'Coming Soon',
  'Coming Soon',
  'Coming Soon',
  'Coming Soon',
];

// Generate 100 Helldivers 2 lore questions
const buildHd2Questions = () => {
  const questions: string[] = [];
  const ministries = ['Defense', 'Science', 'Truth', 'Unity', 'Prosperity', 'Offense', 'Logistics', 'Tranquility', 'Energy', 'Education'];
  ministries.forEach(m => questions.push(`Which duties fall under the Ministry of ${m}?`));
  const armors = ['FS-23 Battle Master', 'SC-15 Drone Master', 'EX-03 Prototype X', 'CM-09 Bonesnapper', 'DP-53 Savior of the Free', 'B-01 Tactical', 'DP-11 Champion of the People', 'SC-34 Infiltrator', 'FS-05 Marksman', 'PH-9 Predator'];
  armors.forEach(a => questions.push(`What unique benefit does the ${a} armor provide?`));
  const enemies = ['Bile Titan', 'Charger', 'Stalker', 'Hive Guard', 'Devastator', 'Hulk', 'Scout Strider', 'Tank', 'Tyrant', 'Brood Commander', 'Automaton Raider', 'Gunship', 'Rocket Devastator', 'Shredder Tank', 'Behemoth', 'Spewer', 'Bug Hole', 'Nesting Specialist', 'Obliterator', 'Shrieker'];
  enemies.forEach(e => questions.push(`What is a weakness of the ${e}?`));
  const weapons = ['Breaker', 'Dominator', 'Railgun', 'Autocannon', 'Eagle Strike', 'Orbital Laser', 'Stalwart', 'Quasar Cannon', 'Arc Thrower', 'Flamethrower'];
  weapons.forEach(w => questions.push(`When is the ${w} most effective?`));
  const stratagems = ['Reinforce', 'Resupply', 'Eagle Strafing Run', 'Eagle Cluster Bomb', 'Orbital Precision Strike', 'Orbital Gas Strike', 'Shield Generator', 'Turret', 'Seismic Probe', 'HMG Emplacement'];
  stratagems.forEach(s => questions.push(`What does the ${s} stratagem do?`));
  const planets = ['Super Earth', 'Malevelon Creek', 'Erata Prime', 'Choohe', 'Tibit', 'Vandalon IV', 'Meridian', 'Morgo 6', 'Crimsica', 'Pollux 4'];
  planets.forEach(p => questions.push(`What threat is prominent on ${p}?`));
  const general = [
    'What is the slogan of Super Earth?',
    'Who leads the Helldivers?',
    'What is the prime directive of the Helldivers?',
    'What resource powers stratagems?',
    'How many players make up a Helldivers squad?',
    'What is the standard Helldivers salute?',
    'What is the capital of Super Earth?',
    'State the Helldivers motto.',
    'Name an example of a defensive stratagem.',
    'Which faction threatens liberty the most?',
  ];
  general.forEach(q => questions.push(q));
  while (questions.length < 100) {
    questions.push(`Helldivers 2 lore question ${questions.length + 1}?`);
  }
  return questions;
};

const hd2Questions = buildHd2Questions();

const hd1Questions = [
  'In which year was Helldivers released?',
  'Which faction in Helldivers 1 was composed of cyborgs?',
  'What mission type required capturing outposts?',
  'Name the top-tier difficulty in Helldivers 1.',
  'Which enemy type tunneled underground?',
  'What was the original game engine for Helldivers 1?',
  'Which stratagem dropped a nuclear bomb?',
  'How many planets were in the Helldivers 1 galaxy?',
  'What was the maximum player level in Helldivers 1?',
  'What famous quote encouraged spreading democracy?',
];

export default function TrainingPage() {
  return (
    <div className={styles.pageContainer}>
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Training</h2>
        <p className={styles.paragraph}>Brush up on your Helldivers knowledge and tactics.</p>
        <h3 className={styles.subHeading}>Training Videos (Coming Soon)</h3>
        <ul className={styles.styledList} style={{ paddingLeft: 18 }}>
          {trainingTopics.map((t, i) => (
            <li key={i} className={styles.listItem}>{t}</li>
          ))}
        </ul>
        <h3 className={styles.subHeading}>Helldivers 2 Knowledge Quiz</h3>
        <ol className={styles.styledList} style={{ paddingLeft: 18, maxHeight: 300, overflow: 'auto' }}>
          {hd2Questions.map((q, i) => (
            <li key={i} className={styles.listItem}>{q}</li>
          ))}
        </ol>
        <h3 className={styles.subHeading}>Historical Quiz – Helldivers 1</h3>
        <ol className={styles.styledList} style={{ paddingLeft: 18 }}>
          {hd1Questions.map((q, i) => (
            <li key={i} className={styles.listItem}>{q}</li>
          ))}
        </ol>
      </section>
    </div>
  );
}
