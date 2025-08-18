import styles from '../../HelldiversPage.module.css';
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
        <h2 className={styles.sectionTitle}>Training</h2>
        <p className={styles.paragraph}>
          Brush up on your Helldivers knowledge and tactics.
        </p>
        {hd2Quizzes.map((qs, i) => (
          <Quiz
            key={`hd2-${i}`}
            title={`Helldivers 2 Knowledge Quiz ${i + 1}`}
            questions={qs}
          />
        ))}
        {hd1Quizzes.map((qs, i) => (
          <Quiz
            key={`hd1-${i}`}
            title={`Historical Quiz – Helldivers 1 ${i + 1}`}
            questions={qs}
          />
        ))}
      </section>
    </div>
  );
}
