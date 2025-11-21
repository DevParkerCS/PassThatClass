import { MockQuiz } from "../../../../../../mock";
import { QuizMode } from "../../../../QuizContent";
import styles from "./QuizButtons.module.scss";

type QuizButtonsProps = {
  qIndex: number;
  setQIndex: React.Dispatch<React.SetStateAction<number>>;
  canGoNext: boolean;
  setCanGoNext: React.Dispatch<React.SetStateAction<boolean>>;
  setMode: React.Dispatch<React.SetStateAction<QuizMode>>;
  mode: QuizMode;
};

export const QuizButtons = ({
  qIndex,
  setQIndex,
  canGoNext,
  setCanGoNext,
  setMode,
  mode,
}: QuizButtonsProps) => {
  const handleNextClick = () => {
    if (mode !== "reviewing" && !canGoNext) return;

    if (qIndex !== MockQuiz.length - 1) {
      setQIndex(qIndex + 1);
      setCanGoNext(false);
    } else if (qIndex === MockQuiz.length - 1) {
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
        {qIndex + 1 !== MockQuiz.length
          ? "Next"
          : mode === "reviewing"
          ? "Finish"
          : "Submit"}
      </button>
    </div>
  );
};
