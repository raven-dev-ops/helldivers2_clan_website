import styles from './TrainingPage.module.css';
import Quiz, { type Question } from './Quiz';
import hd2Questions from './hd2Questions';
import hd1Questions from './hd1Questions';
import base from '../../HelldiversBase.module.css';

const chunk = (arr: Question[], size: number) =>
  Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
    arr.slice(i * size, i * size + size)
  );

// Keyword buckets for auto-tagging
const BUCKETS: { label: string; keys: RegExp[] }[] = [
  {
    label: 'Stratagems',
    keys: [/stratagem/i, /orbital/i, /eagle/i, /resupply/i, /shield/i, /gatling/i, /rail/i, /emplacement/i, /jump\s?pack/i],
  },
  {
    label: 'Enemies',
    keys: [/terminid/i, /automaton/i, /illuminat/i, /cyborg/i, /charger/i, /bile/i, /hulk/i, /devastator/i, /shriek/i, /stalker/i, /tunnel/i],
  },
  {
    label: 'Weapons & Gear',
    keys: [/rifle/i, /weapon/i, /pistol/i, /liberator/i, /breaker/i, /sickle/i, /railgun/i, /machine\s?gun/i, /\bexo\b/i, /\bexo-?44/i],
  },
  {
    label: 'Tactics & Missions',
    keys: [/mission/i, /escort/i, /eradicate/i, /liberat/i, /defen[cs]e/i, /survival/i, /nest/i, /nuke|launch/i, /difficulty/i],
  },
  {
    label: 'Ship & Progression',
    keys: [/warbond/i, /research|module/i, /ship/i, /armory/i, /upgrade/i, /samples/i, /rank|promotion/i],
  },
  {
    label: 'Worlds & Hazards',
    keys: [/biome|hazard/i, /snow|mud|acid|volcanic/i, /planet|sector|meridia/i],
  },
  {
    label: 'Lore & Factions',
    keys: [/super\s?earth/i, /president/i, /managed\s+democracy/i, /slogan|salute/i],
  },
];

function scoreBuckets(qs: Question[]) {
  const scores = new Map<string, number>();
  const textBlob = qs.map((q) => q.question).join(' \n ');

  BUCKETS.forEach(({ label, keys }) => {
    const score = keys.reduce((acc, rx) => acc + (textBlob.match(rx)?.length ?? 0), 0);
    scores.set(label, score);
  });

  // Sort by descending score
  return [...scores.entries()]
    .sort((a, b) => b[1] - a[1])
    .filter(([, s]) => s > 0)
    .map(([label]) => label);
}

function metaForChunk(qs: Question[], base: 'Helldivers 2' | 'Helldivers 1', setIndex: number) {
  const tags = scoreBuckets(qs);
  const top1 = tags[0];
  const top2 = tags[1];

  const title =
    top1 && top2
      ? `${base} — ${top1} & ${top2} (Set ${setIndex + 1})`
      : top1
      ? `${base} — ${top1} (Set ${setIndex + 1})`
      : `${base} — Mixed Knowledge (Set ${setIndex + 1})`;

  const descParts = [
    top1 ? top1.toLowerCase() : 'core mechanics',
    top2 ? top2.toLowerCase() : 'general knowledge',
  ];

  const description =
    base === 'Helldivers 2'
      ? `10 questions on ${descParts[0]} and ${descParts[1]} from Helldivers 2—covering current meta, mission flow, and practical combat calls.`
      : `10 questions on ${descParts[0]} and ${descParts[1]} from the original Helldivers—historical tactics and classic enemy/faction knowledge.`;

  return { title, description };
}

export default function TrainingPage() {
  const hd2Quizzes = chunk(hd2Questions, 10);
  const hd1Quizzes = chunk(hd1Questions, 10);

  return (
    <div className={base.pageContainer}>
      <section className={base.section}>
        <h2 className={base.sectionTitle}>My Training</h2>
        <p className={base.paragraph}>
          Brush up on your Helldivers knowledge and tactics. Choose a quiz to
          test your memory and sharpen your strategies.
        </p>

        {/* Helldivers 2 */}
        <h3 className={styles.subheading}>Helldivers 2</h3>
        <div className={styles.quizGrid}>
          {hd2Quizzes.map((qs, i) => {
            const { title, description } = metaForChunk(qs, 'Helldivers 2', i);
            return (
              <div className={styles.quizCard} key={`hd2-${i}`}>
                <h4>{title}</h4>
                <p className={styles.quizDescription}>{description}</p>
                <div className={styles.quizActions}>
                  <Quiz title={title} questions={qs} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Helldivers 1 */}
        <h3 className={styles.subheading}>Helldivers 1 (Historical)</h3>
        <div className={styles.quizGrid}>
          {hd1Quizzes.map((qs, i) => {
            const { title, description } = metaForChunk(qs, 'Helldivers 1', i);
            return (
              <div className={styles.quizCard} key={`hd1-${i}`}>
                <h4>{title}</h4>
                <p className={styles.quizDescription}>{description}</p>
                <div className={styles.quizActions}>
                  <Quiz title={title} questions={qs} />
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
