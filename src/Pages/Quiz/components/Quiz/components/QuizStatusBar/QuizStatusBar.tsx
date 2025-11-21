import { MockQuiz } from "../../../../../../mock";
import styles from "./QuizStatusBar.module.scss";

type QuizStatusBarProps = {
  qIndex: number;
};

export const QuizStatusBar = ({ qIndex }: QuizStatusBarProps) => {
  const progress = ((qIndex + 1) / MockQuiz.length) * 100;

  return (
    <div className={styles.statusInfoWrapper}>
      <p className={styles.indexTxt}>
        {qIndex + 1} of {MockQuiz.length}
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
