import styles from '../../HelldiversPage.module.css';
import Quiz from './Quiz';
import hd2Questions from './hd2Questions';
import hd1Questions from './hd1Questions';

export default function TrainingPage() {
  return (
    <div className={styles.pageContainer}>
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Training</h2>
        <p className={styles.paragraph}>
          Brush up on your Helldivers knowledge and tactics.
        </p>
        <Quiz title="Helldivers 2 Knowledge Quiz" questions={hd2Questions} />
        <Quiz title="Historical Quiz – Helldivers 1" questions={hd1Questions} />
      </section>
    </div>
  );
}
