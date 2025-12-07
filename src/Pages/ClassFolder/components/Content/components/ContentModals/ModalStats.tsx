import styles from "./ContentModal.module.scss";
import { QuizMeta } from "../../../../../../context/DataContext/types";
import { formatTime } from "../../../../../Quiz/components/Results/Results";

type ModalStatsProps = {
  info: QuizMeta;
};

export const ModalStats = ({ info }: ModalStatsProps) => {
  return (
    <div className={styles.statWrapper}>
      <p className={styles.statTitle}>Quiz Stats</p>

      <p className={styles.statTxt}>
        <span className={styles.statName}>Average Percent</span>
        <span className={styles.statValue}>
          {Math.round((info.average_score / info.num_questions) * 100)}%
        </span>
      </p>

      <p className={styles.statTxt}>
        <span className={styles.statName}>Average Time</span>
        <span className={styles.statValue}>
          {formatTime(info.average_time_seconds)}
        </span>
      </p>

      <p className={styles.statTxt}>
        <span className={styles.statName}>Best Score</span>
        <span className={styles.statValue}>
          {info.highest_score}/{info.num_questions}
        </span>
      </p>

      <p className={styles.statTxt}>
        <span className={styles.statName}>Attempts</span>
        <span className={styles.statValue}>{info.attempts_count}</span>
      </p>
    </div>
  );
};
