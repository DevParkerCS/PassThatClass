import { useNavigate } from "react-router-dom";
import { QuizMode } from "../../../../QuizContent";
import styles from "./ResultButtons.module.scss";
import { useDataContext } from "../../../../../../context/DataContext/DataContext";

type ResultButtonsProps = {
  setMode: React.Dispatch<React.SetStateAction<QuizMode>>;
  classId: string;
  quizId: string;
};

export const ResultButtons = ({
  setMode,
  classId,
  quizId,
}: ResultButtonsProps) => {
  const nav = useNavigate();
  const data = useDataContext();

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
          onClick={() =>
            nav(
              `/class/${data.classesById[classId].name}/${classId}?quizId=${quizId}`
            )
          }
        >
          Back to Class
        </button>
      </div>
    </div>
  );
};
