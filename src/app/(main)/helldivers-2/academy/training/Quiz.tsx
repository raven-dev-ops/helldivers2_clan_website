"use client";

import { useState } from "react";
import styles from "../../HelldiversPage.module.css";

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
  const [selected, setSelected] = useState<number[]>(Array(questions.length).fill(-1));
  const [score, setScore] = useState<number | null>(null);

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
  };

  return (
    <div>
      <h3 className={styles.subHeading}>{title}</h3>
      <ol className={`${styles.styledList} ${styles.decimal}`}>
        {questions.map((q, qi) => (
          <li key={qi} className={styles.listItem}>
            <p>{q.question}</p>
            {q.options.map((opt, oi) => (
              <label key={oi} style={{ display: "block" }}>
                <input
                  type="radio"
                  name={`q-${title}-${qi}`}
                  checked={selected[qi] === oi}
                  onChange={() => handleSelect(qi, oi)}
                />{" "}
                {opt}
              </label>
            ))}
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
    </div>
  );
}

