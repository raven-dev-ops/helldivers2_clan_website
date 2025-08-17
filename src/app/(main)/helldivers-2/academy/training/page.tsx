// src/app/(main)/helldivers-2/academy/training/page.tsx
'use client';

import styles from '../../HelldiversPage.module.css';
import Quiz, { Question } from './Quiz';

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

const hd2Questions: Question[] = [
  {
    question: 'What is the slogan of Super Earth?',
    options: [
      'Freedom or Death',
      'Managed Democracy',
      'For the Federation',
      'Protect the Galaxy',
    ],
    answer: 1,
  },
  {
    question: 'Who leads the Helldivers?',
    options: ['The President', 'The High Command', 'The Admiral', 'The Senate'],
    answer: 0,
  },
  {
    question: 'What resource powers stratagems?',
    options: ['Credits', 'Requisition', 'Energy Cells', 'Warbond'],
    answer: 1,
  },
  {
    question: 'How many players make up a Helldivers squad?',
    options: ['2', '3', '4', '5'],
    answer: 2,
  },
  {
    question: 'Name an example of a defensive stratagem.',
    options: [
      'Orbital Laser',
      'Shield Generator',
      'Eagle Strafing Run',
      'Orbital Precision Strike',
    ],
    answer: 1,
  },
];

const hd1Questions: Question[] = [
  {
    question: 'In which year was Helldivers released?',
    options: ['2015', '2012', '2017', '2019'],
    answer: 0,
  },
  {
    question: 'Which faction in Helldivers 1 was composed of cyborgs?',
    options: ['Illuminate', 'Cyborgs', 'Terminids', 'Automatons'],
    answer: 1,
  },
  {
    question: 'What mission type required capturing outposts?',
    options: ['Elimination', 'Capture', 'Bug Hunt', 'Eradicate'],
    answer: 1,
  },
  {
    question: 'Name the top-tier difficulty in Helldivers 1.',
    options: ['Suicide Mission', 'Hell Dive', 'Impossible', 'Overkill'],
    answer: 1,
  },
  {
    question: 'Which enemy type tunneled underground?',
    options: ['Impaler', 'Cyborg Commando', 'Scout Strider', 'Tank'],
    answer: 0,
  },
  {
    question: 'What was the original game engine for Helldivers 1?',
    options: ['Bitsquid', 'Unity', 'Unreal', 'Frostbite'],
    answer: 0,
  },
  {
    question: 'Which stratagem dropped a nuclear bomb?',
    options: ['Resupply', 'Thunderer Barrage', 'Nuclear Strike', 'EMS Strike'],
    answer: 2,
  },
  {
    question: 'How many planets were in the Helldivers 1 galaxy?',
    options: ['10', '20', '50', '100'],
    answer: 1,
  },
  {
    question: 'What was the maximum player level in Helldivers 1?',
    options: ['30', '40', '50', '60'],
    answer: 2,
  },
  {
    question: 'What famous quote encouraged spreading democracy?',
    options: [
      'Democracy never sleeps',
      'Freedom for all',
      "Democracy won't spread itself",
      'One nation under God',
    ],
    answer: 2,
  },
];

export default function TrainingPage() {
  return (
    <div className={styles.pageContainer}>
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Training</h2>
        <p className={styles.paragraph}>
          Brush up on your Helldivers knowledge and tactics.
        </p>
        <h3 className={styles.subHeading}>Training Videos (Coming Soon)</h3>
        <ul className={styles.trainingTopics}>
          {trainingTopics.map((t, i) => (
            <li key={i} className={styles.listItem}>
              {t}
            </li>
          ))}
        </ul>
        <Quiz title="Helldivers 2 Knowledge Quiz" questions={hd2Questions} />
        <Quiz title="Historical Quiz – Helldivers 1" questions={hd1Questions} />
      </section>
    </div>
  );
}
