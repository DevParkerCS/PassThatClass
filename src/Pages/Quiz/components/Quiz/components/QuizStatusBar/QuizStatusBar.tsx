import { QuizQuestionType } from "../../../../../../context/DataContext/types";
import styles from "./QuizStatusBar.module.scss";

type QuizStatusBarProps = {
  qIndex: number;
  questions: QuizQuestionType[];
};

export const QuizStatusBar = ({ qIndex, questions }: QuizStatusBarProps) => {
  const progress = ((qIndex + 1) / questions.length) * 100;

  return (
    <div className={styles.statusInfoWrapper}>
      <p className={styles.indexTxt}>
        Question {qIndex + 1} of {questions.length}
      </p>

      <div className={styles.statusBarWrapper}>
        <div
          style={{ left: `${progress}%` }}
          className={styles.statusBar}
        ></div>
      </div>
    </div>
  );
};
