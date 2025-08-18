'use client';

import { useState } from 'react';
import styles from '../../HelldiversPage.module.css';

export interface Question {
  question: string;
  options: string[];
  answer: number;
}

interface QuizProps {
  title: string;
  questions: Question[];
}

export default function Quiz({ title, questions }: QuizProps) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<number[]>([]);
  const [score, setScore] = useState<number | null>(null);
  const [showAnswers, setShowAnswers] = useState(false);

  const openModal = () => {
    setSelected(Array(questions.length).fill(-1));
    setScore(null);
    setShowAnswers(false);
    setOpen(true);
  };

  const closeModal = () => setOpen(false);

  const handleSelect = (qIndex: number, optionIndex: number) => {
    setSelected((prev) => {
      const next = [...prev];
      next[qIndex] = optionIndex;
      return next;
    });
  };

  const handleSubmit = () => {
    let s = 0;
    selected.forEach((sel, i) => {
      if (sel === questions[i].answer) s++;
    });
    setScore(s);
    setShowAnswers(true);
  };

  return (
    <>
      <button onClick={openModal} className={styles.quizButton}>
        {title}
      </button>
      {open && (
        <div className={styles.overlay}>
          <div className={styles.modal} role="dialog" aria-modal="true">
            <h3 className={styles.subHeading}>{title}</h3>
            <ol className={`${styles.styledList} ${styles.decimal}`}>
              {questions.map((q, qi) => (
                <li key={qi} className={styles.listItem}>
                  <p>{q.question}</p>
                  {q.options.map((opt, oi) => {
                    const isCorrect = showAnswers && oi === q.answer;
                    const isIncorrect =
                      showAnswers && selected[qi] === oi && oi !== q.answer;
                    return (
                      <label
                        key={oi}
                        className={`${isCorrect ? styles.correct : ''} ${
                          isIncorrect ? styles.incorrect : ''
                        }`}
                        style={{ display: 'block' }}
                      >
                        <input
                          type="radio"
                          name={`q-${title}-${qi}`}
                          checked={selected[qi] === oi}
                          onChange={() => handleSelect(qi, oi)}
                          disabled={showAnswers}
                        />{' '}
                        {opt}
                      </label>
                    );
                  })}
                </li>
              ))}
            </ol>
            <button onClick={handleSubmit} className={styles.quizButton}>
              Submit
            </button>
            {score !== null && (
              <p>
                Score: {score}/{questions.length}
              </p>
            )}
            <button onClick={closeModal} className={styles.quizButton}>
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
