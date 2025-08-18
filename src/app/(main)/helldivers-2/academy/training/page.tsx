import styles from './TrainingPage.module.css';
import Quiz, { type Question } from './Quiz';
import hd2Questions from './hd2Questions';
import hd1Questions from './hd1Questions';

const chunk = (arr: Question[], size: number) =>
  Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
    arr.slice(i * size, i * size + size)
  );

export default function TrainingPage() {
  const hd2Quizzes = chunk(hd2Questions, 10);
  const hd1Quizzes = chunk(hd1Questions, 10);

  return (
    <div className={styles.pageContainer}>
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>My Training</h2>
        <p className={styles.paragraph}>
          Brush up on your Helldivers knowledge and tactics. Choose a quiz to
          test your memory and sharpen your strategies.
        </p>

        {/* Helldivers 2 */}
        <h3 className={styles.subheading}>Helldivers 2</h3>
        <div className={styles.quizGrid}>
          {hd2Quizzes.map((qs, i) => (
            <div className={styles.quizCard} key={`hd2-${i}`}>
              <h4>{`Knowledge Quiz ${i + 1}`}</h4>
              <p className={styles.quizDescription}>
                Covers Helldivers 2 lore, tactics, weapons, and mission
                scenarios.
              </p>
              <div className={styles.quizActions}>
                <Quiz
                  title={`Helldivers 2 Knowledge Quiz ${i + 1}`}
                  questions={qs}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Helldivers 1 */}
        <h3 className={styles.subheading}>Helldivers 1 (Historical)</h3>
        <div className={styles.quizGrid}>
          {hd1Quizzes.map((qs, i) => (
            <div className={styles.quizCard} key={`hd1-${i}`}>
              <h4>{`Historical Quiz ${i + 1}`}</h4>
              <p className={styles.quizDescription}>
                Tests your knowledge of the original Helldivers, its enemies,
                and historical missions.
              </p>
              <div className={styles.quizActions}>
                <Quiz
                  title={`Historical Quiz – Helldivers 1 ${i + 1}`}
                  questions={qs}
                />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
