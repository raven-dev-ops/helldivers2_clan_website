'use client';

import { useEffect, useState, useCallback } from 'react';
import styles from './Quiz.module.css';

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

  const closeModal = useCallback(() => setOpen(false), []);

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
  const hasSelection = selected[current] !== -1;

  // Esc to close
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, closeModal]);

  return (
    <>
      <button onClick={openModal} className={styles.quizButton}>
        {title}
      </button>

      {open && (
        <div className={styles.overlay}>
          <div className={styles.modal} role="dialog" aria-modal="true" aria-labelledby={`quiz-${title}-heading`}>
            <button
              onClick={closeModal}
              className={styles.closeButton}
              aria-label="Close quiz"
            >
              ×
            </button>

            <h3 id={`quiz-${title}-heading`} className={styles.subHeading}>
              {title}
            </h3>

            {!finished ? (
              <>
                <p className={styles.question}>
                  {current + 1}/{questions.length}. {questions[current].question}
                </p>

                <div role="group" aria-labelledby={`quiz-${title}-heading`}>
                  {questions[current].options.map((opt, oi) => {
                    const isCorrect = showAnswer && oi === questions[current].answer;
                    const isIncorrect =
                      showAnswer && selected[current] === oi && oi !== questions[current].answer;

                    return (
                      <label
                        key={oi}
                        className={`${styles.optionLabel} ${isCorrect ? styles.correct : ''} ${isIncorrect ? styles.incorrect : ''}`}
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
                </div>

                {/* Footer actions anchored to bottom via CSS */}
                <div className={styles.quizActions}>
                  {!showAnswer ? (
                    <button
                      onClick={handleSubmit}
                      className={styles.quizButton}
                      disabled={!hasSelection}
                    >
                      Submit
                    </button>
                  ) : (
                    <button onClick={handleNext} className={styles.quizButton}>
                      {current === questions.length - 1 ? 'Finish' : 'Next'}
                    </button>
                  )}

                  <button onClick={closeModal} className={styles.quizButton}>
                    Close
                  </button>
                </div>

                {/* Announce correctness for screen readers */}
                {showAnswer && (
                  <div aria-live="polite" style={{ position: 'absolute', left: -9999 }}>
                    {selected[current] === questions[current].answer ? 'Correct' : 'Incorrect'}
                  </div>
                )}
              </>
            ) : (
              <>
                <p>
                  Score: {score}/{questions.length}
                </p>
                <div className={styles.quizActions}>
                  <button onClick={closeModal} className={styles.quizButton}>
                    Close
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
