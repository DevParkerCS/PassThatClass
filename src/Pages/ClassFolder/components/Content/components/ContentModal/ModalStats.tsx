import styles from "./ContentModal.module.scss";
import { QuizMeta } from "../../../../../../context/DataContext/types";

type ModalStatsProps = {
  info: QuizMeta;
};

export const ModalStats = ({ info }: ModalStatsProps) => {
  return (
    <div className={styles.statWrapper}>
      <p className={styles.statTitle}>Quiz Stats</p>

      <p className={styles.statTxt}>
        <span className={styles.statName}>Average Score</span>
        <span className={styles.statValue}>{info.average_score}</span>
      </p>

      <p className={styles.statTxt}>
        <span className={styles.statName}>Average Time</span>
        <span className={styles.statValue}>{info.average_time_seconds}</span>
      </p>

      <p className={styles.statTxt}>
        <span className={styles.statName}>Best Score</span>
        <span className={styles.statValue}>{info.highest_score}</span>
      </p>

      <p className={styles.statTxt}>
        <span className={styles.statName}>Attempts</span>
        <span className={styles.statValue}>{info.attempts_count}</span>
      </p>
    </div>
  );
};
