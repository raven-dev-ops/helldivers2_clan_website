import styles from '@/styles/TrainingPage.module.css';
import Quiz, { type Question } from './Quiz';
import hd2Questions from './hd2Questions';
import hd1Questions from './hd1Questions';
import base from '@/styles/Base.module.css';

const chunk = (arr: Question[], size: number) =>
  Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
    arr.slice(i * size, i * size + size)
  );

const hd2Meta = [
  {
    title: 'Weapons, Gear, Lore & Factions',
    description:
      '10 questions • Core kit basics, when to use what, who we’re fighting, and why it matters.',
  },
  {
    title: 'Stratagems & Enemies',
    description:
      '10 questions • Call-in timing, safe throws, and enemy behaviors you must recognize.',
  },
  {
    title: 'Stratagems, Ship & Progression',
    description:
      '10 questions • Ship upgrades, unlock paths, and which stratagems to bring as you advance.',
  },
  {
    title: 'Stratagems, Weapons & Gear',
    description:
      '10 questions • Loadout building, synergizing stratagems with your weapons and armor.',
  },
  {
    title: 'Stratagems, Tactics & Missions',
    description:
      '10 questions • Objective flow, team roles, and practical callouts under pressure.',
  },
];

const hd1Meta = [
  {
    title: 'Enemies, Tactics & Missions',
    description:
      '10 questions • Classic foes and the fundamentals that still teach good habits.',
  },
  {
    title: 'Stratagems, Weapons & Gear',
    description:
      '10 questions • Old-school combos and kit choices that shaped the series.',
  },
  {
    title: 'Stratagems, Tactics & Missions',
    description:
      '10 questions • Mission pacing and squad coordination from the original playbook.',
  },
  {
    title: 'Tactics, Missions & Stratagems',
    description:
      '10 questions • Applying the right tool at the right time, then extracting alive.',
  },
  {
    title: 'Ship, Progression & Stratagems',
    description:
      '10 questions • Upgrade priorities and role specialization over a campaign.',
  },
];

export default function TrainingPage() {
  const hd2Quizzes = chunk(hd2Questions, 10);
  const hd1Quizzes = chunk(hd1Questions, 10);

  return (
    <div className={base.wrapper}>
      <div className={base.dividerLayer} />
      <div className={base.pageContainer}>
        <section className={base.section}>
          <h2 className={base.sectionTitle}>My Training</h2>
          <p className={base.paragraph}>
            Level up fast. Pick a quiz, answer 10 questions, and learn the
            essentials.
          </p>

          <h3 className={base.subHeading}>How it works</h3>
          <ol className={base.ruleList}>
            <li className={base.ruleListItem}>Choose a set</li>
            <li className={base.ruleListItem}>Answer 10 questions</li>
            <li className={base.ruleListItem}>See your score + tips</li>
          </ol>

          <h3 className={base.subHeading}>Helldivers 2</h3>
          <div className={styles.quizGrid}>
            {hd2Quizzes.map((qs, i) => {
              const meta = hd2Meta[i];
              return (
                <div className={styles.quizCard} key={`hd2-${i}`}>
                  <h4>{meta.title}</h4>
                  <p className={styles.quizDescription}>{meta.description}</p>
                  <div className={styles.quizActions}>
                    <Quiz title={meta.title} questions={qs} />
                  </div>
                </div>
              );
            })}
          </div>
          <p className={base.paragraph}>New to Helldivers? Start here.</p>

          <h3 className={base.subHeading}>Helldivers 1 (Historical)</h3>
          <div className={styles.quizGrid}>
            {hd1Quizzes.map((qs, i) => {
              const meta = hd1Meta[i];
              return (
                <div className={styles.quizCard} key={`hd1-${i}`}>
                  <h4>{meta.title}</h4>
                  <p className={styles.quizDescription}>{meta.description}</p>
                  <div className={styles.quizActions}>
                    <Quiz title={meta.title} questions={qs} />
                  </div>
                </div>
              );
            })}
          </div>

          <p className={base.paragraph}>
            <span className={base.strongText}>Tip:</span> Don’t
            memorize—visualize. Think about when and why you’d use each tool,
            not just what it does.
          </p>
        </section>
      </div>
    </div>
  );
}
