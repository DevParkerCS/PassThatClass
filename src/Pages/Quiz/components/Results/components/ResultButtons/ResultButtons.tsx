import { useNavigate } from "react-router-dom";
import { QuizMode } from "../../../../QuizContent";
import styles from "./ResultButtons.module.scss";

type ResultButtonsProps = {
  setMode: React.Dispatch<React.SetStateAction<QuizMode>>;
};

export const ResultButtons = ({ setMode }: ResultButtonsProps) => {
  const nav = useNavigate();

  return (
    <div className={styles.resultsBtns}>
      <div>
        <button
          className={`${styles.resultsBtn} ${styles.review}`}
          onClick={() => setMode("reviewing")}
        >
          Review Questions
        </button>
        <button
          className={`${styles.resultsBtn} ${styles.retake}`}
          onClick={() => setMode("answering")}
        >
          Retake Quiz
        </button>
      </div>
      <div className={styles.dashboardBtnWrapper}>
        <button
          className={`${styles.resultsBtn}`}
          onClick={() => nav("/class")}
        >
          Back to Class
        </button>
      </div>
    </div>
  );
};
