import { QuizQuestionType } from "../../../../../../context/DataContext/types";
import { QuizMode } from "../../../../QuizContent";
import styles from "./QuizButtons.module.scss";

type QuizButtonsProps = {
  qIndex: number;
  setQIndex: React.Dispatch<React.SetStateAction<number>>;
  canGoNext: boolean;
  setCanGoNext: React.Dispatch<React.SetStateAction<boolean>>;
  setMode: React.Dispatch<React.SetStateAction<QuizMode>>;
  mode: QuizMode;
  questions: QuizQuestionType[];
};

export const QuizButtons = ({
  qIndex,
  setQIndex,
  canGoNext,
  setCanGoNext,
  setMode,
  mode,
  questions,
}: QuizButtonsProps) => {
  const handleNextClick = () => {
    if (mode !== "reviewing" && !canGoNext) return;

    if (qIndex !== questions.length - 1) {
      setQIndex(qIndex + 1);
      setCanGoNext(false);
    } else if (qIndex === questions.length - 1) {
      setMode("results");
      setQIndex(0);
    }
  };

  const handlePrevClick = () => {
    if (qIndex !== 0) {
      setQIndex(qIndex - 1);
      setCanGoNext(true);
    }
  };

  return (
    <div className={`${styles.btnsWrapper}`}>
      <button
        className={`${styles.quizBtn} ${qIndex === 0 && styles.inactive}`}
        onClick={handlePrevClick}
      >
        Prev
      </button>

      <button
        className={`${styles.quizBtn} ${
          !canGoNext && mode !== "reviewing" && styles.inactive
        }`}
        onClick={handleNextClick}
      >
        {qIndex + 1 !== questions.length
          ? "Next"
          : mode === "reviewing"
          ? "Finish"
          : "Submit"}
      </button>
    </div>
  );
};
