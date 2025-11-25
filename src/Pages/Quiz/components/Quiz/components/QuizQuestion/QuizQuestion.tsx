import { useEffect, useState } from "react";
import styles from "./QuizQuestion.module.scss";
import { QuizMode } from "../../../../QuizContent";
import { QuizQuestionType } from "../../../../../../context/DataContext/types";

type QuizQuestionProps = {
  question: QuizQuestionType;
  index: number;
  qIndex: number;
  setCanGoNext: React.Dispatch<React.SetStateAction<boolean>>;
  chosenAnswer?: number;
  mode: QuizMode;
  setNumCorrect: React.Dispatch<React.SetStateAction<number>>;
};

export const QuizQuestion = ({
  question,
  index,
  qIndex,
  setCanGoNext,
  chosenAnswer,
  mode,
  setNumCorrect,
}: QuizQuestionProps) => {
  const [chosenAns, setChosenAns] = useState(chosenAnswer || -1);
  const [isReviewing, setIsReviewing] = useState(mode === "reviewing");
  const correctAns = question.correct_index;

  useEffect(() => {
    setIsReviewing(mode === "reviewing");

    if (mode === "answering") {
      setChosenAns(-1);
    }
  }, [mode]);

  useEffect(() => {
    if (qIndex === index) {
      setCanGoNext(chosenAns !== -1);
    }
  }, [chosenAns, qIndex]);

  const handleClick = (i: number) => {
    if (isReviewing) return;

    // remove effect of previous answer if it was correct
    if (chosenAns === correctAns) {
      setNumCorrect((prev) => prev - 1);
    }

    // compute new selection (toggle if same)
    const newChosen = chosenAns === i ? -1 : i;

    // add effect of new answer if it is correct
    if (newChosen === correctAns) {
      setNumCorrect((prev) => prev + 1);
    }

    setChosenAns(newChosen);
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
          return (
            <div
              key={o.id}
              className={`${styles.optionWrapper} ${
                chosenAns === i && styles.chosen
              } ${isReviewing && styles.isReviewing} ${
                isReviewing && i === correctAns && styles.correctAns
              } ${
                isReviewing &&
                chosenAns !== correctAns &&
                i === chosenAns &&
                styles.incorrectAns
              }`}
              onClick={() => handleClick(i)}
            >
              <p className={`${styles.optionTxt} ${styles.optionID}`}>{o.id}</p>{" "}
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
