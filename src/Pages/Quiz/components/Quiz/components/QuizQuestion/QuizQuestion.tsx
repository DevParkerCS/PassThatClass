import { useEffect, useState } from "react";
import styles from "./QuizQuestion.module.scss";
import { QuizMode } from "../../../../QuizContent";
import { QuizQuestionType } from "../../../../../../context/DataContext/types";

type QuizQuestionProps = {
  question: QuizQuestionType;
  index: number; // question index in the quiz
  qIndex: number; // currently active question index
  setCanGoNext: React.Dispatch<React.SetStateAction<boolean>>;
  mode: QuizMode;
  setNumCorrect: React.Dispatch<React.SetStateAction<number>>;
  setIncorrectIndexes: React.Dispatch<React.SetStateAction<number[]>>;
  guessedIndexes: number[]; // 👈 NEW: full guessed array
  setGuessedIndexes: React.Dispatch<React.SetStateAction<number[]>>;
};

export const QuizQuestion = ({
  question,
  index,
  qIndex,
  setCanGoNext,
  mode,
  setNumCorrect,
  setIncorrectIndexes,
  guessedIndexes,
  setGuessedIndexes,
}: QuizQuestionProps) => {
  const [isReviewing, setIsReviewing] = useState(mode === "reviewing");
  const correctAns = question.correct_index;
  const chosenAns = guessedIndexes[index] ?? -1;

  useEffect(() => {
    setIsReviewing(mode === "reviewing");
  }, [mode]);

  useEffect(() => {
    if (qIndex === index) {
      setCanGoNext(chosenAns !== -1);
    }
  }, [chosenAns, qIndex, index, setCanGoNext]);

  const handleClick = (i: number) => {
    if (isReviewing) return;

    const prevChosen = chosenAns;
    const newChosen = prevChosen === i ? -1 : i;

    // adjust num correct based on change
    if (prevChosen === correctAns) {
      setNumCorrect((prev) => prev - 1);
    }
    if (newChosen === correctAns) {
      setNumCorrect((prev) => prev + 1);
    }

    setIncorrectIndexes((prev) => {
      const withoutThis = prev.filter((idx) => idx !== index);

      if (newChosen === correctAns || newChosen === -1) {
        return withoutThis;
      }

      return [...withoutThis, index];
    });

    // update global guessedIndexes for this question index
    setGuessedIndexes((prev) => {
      const next = [...prev];
      next[index] = newChosen;
      return next;
    });
  };

  return (
    <div
      className={`${styles.questionWrapper} ${
        index !== qIndex ? styles.inactive : ""
      }`}
    >
      <div className={styles.questionTxtWrapper}>
        <p className={styles.questionTxt}>{question.question}</p>
      </div>

      <div className={styles.optionsWrapper}>
        {question.options.map((o, i) => {
          const isChosen = chosenAns === i;

          return (
            <div
              key={o.id}
              className={`${styles.optionWrapper} ${
                isChosen ? styles.chosen : ""
              } ${isReviewing ? styles.isReviewing : ""} ${
                isReviewing && i === correctAns ? styles.correctAns : ""
              } ${
                isReviewing && chosenAns !== correctAns && i === chosenAns
                  ? styles.incorrectAns
                  : ""
              }`}
              onClick={() => handleClick(i)}
            >
              <p className={`${styles.optionTxt} ${styles.optionID}`}>
                {String.fromCharCode(65 + i)}
              </p>
              <p className={`${styles.optionTxt} ${styles.optionAnswer}`}>
                {o.text}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
