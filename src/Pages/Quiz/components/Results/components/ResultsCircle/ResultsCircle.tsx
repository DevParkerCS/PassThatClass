import { MockQuiz } from "../../../../../../mock";
import styles from "./ResultsCircle.module.scss";

type ResultsCircleProps = {
  numCorrect: number;
};

export const ResultsCircle = ({ numCorrect }: ResultsCircleProps) => {
  const percent = Math.round((numCorrect / MockQuiz.length) * 100);

  return (
    <div>
      <div
        className={styles.outerCircle}
        style={{ "--progress": percent } as React.CSSProperties}
      >
        <div className={styles.innerCircle}>
          <p className={styles.scoreTxt}>
            {numCorrect}/{MockQuiz.length}
          </p>
          <p className={styles.scorePercent}>{percent}%</p>
        </div>
      </div>
    </div>
  );
};
