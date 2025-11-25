import styles from "./ResultsCircle.module.scss";

type ResultsCircleProps = {
  numCorrect: number;
  length: number;
};

export const ResultsCircle = ({ numCorrect, length }: ResultsCircleProps) => {
  const percent = Math.round((numCorrect / length) * 100);

  return (
    <div>
      <div
        className={styles.outerCircle}
        style={{ "--progress": percent } as React.CSSProperties}
      >
        <div className={styles.innerCircle}>
          <p className={styles.scoreTxt}>
            {numCorrect}/{length}
          </p>
          <p className={styles.scorePercent}>{percent}%</p>
        </div>
      </div>
    </div>
  );
};
