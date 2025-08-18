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
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number[]>([]);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);

  const openModal = () => {
    setSelected(Array(questions.length).fill(-1));
    setScore(0);
    setShowAnswer(false);
    setCurrent(0);
    setOpen(true);
  };

  const closeModal = () => setOpen(false);

  const handleSelect = (optionIndex: number) => {
    setSelected((prev) => {
      const next = [...prev];
      next[current] = optionIndex;
      return next;
    });
  };

  const handleSubmit = () => {
    if (selected[current] === questions[current].answer) {
      setScore((s) => s + 1);
    }
    setShowAnswer(true);
  };

  const handleNext = () => {
    setShowAnswer(false);
    setCurrent((c) => c + 1);
  };

  const finished = current >= questions.length;

  return (
    <>
      <button onClick={openModal} className={styles.quizButton}>
        {title}
      </button>
      {open && (
        <div className={styles.overlay}>
          <div className={styles.modal} role="dialog" aria-modal="true">
            <button
              onClick={closeModal}
              className={styles.closeButton}
              aria-label="Close quiz"
            >
              ×
            </button>
            <h3 className={styles.subHeading}>{title}</h3>
            {!finished ? (
              <>
                <p className={styles.question}>
                  {current + 1}. {questions[current].question}
                </p>
                {questions[current].options.map((opt, oi) => {
                  const isCorrect =
                    showAnswer && oi === questions[current].answer;
                  const isIncorrect =
                    showAnswer &&
                    selected[current] === oi &&
                    oi !== questions[current].answer;
                  return (
                    <label
                      key={oi}
                      className={`${styles.optionLabel} ${
                        isCorrect ? styles.correct : ''
                      } ${isIncorrect ? styles.incorrect : ''}`}
                    >
                      <input
                        type="radio"
                        name={`q-${title}-${current}`}
                        checked={selected[current] === oi}
                        onChange={() => handleSelect(oi)}
                        disabled={showAnswer}
                      />{' '}
                      {opt}
                    </label>
                  );
                })}
                {!showAnswer && (
                  <button onClick={handleSubmit} className={styles.quizButton}>
                    Submit
                  </button>
                )}
                {showAnswer && (
                  <button onClick={handleNext} className={styles.quizButton}>
                    {current === questions.length - 1 ? 'Finish' : 'Next'}
                  </button>
                )}
              </>
            ) : (
              <>
                <p>
                  Score: {score}/{questions.length}
                </p>
                <button onClick={closeModal} className={styles.quizButton}>
                  Close
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
