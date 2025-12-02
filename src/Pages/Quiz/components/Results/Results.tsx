import { QuizMode } from "../../QuizContent";
import styles from "./Results.module.scss";
import shared from "../../Shared/styles.module.scss";
import { ResultsCircle } from "./components/ResultsCircle/ResultsCircle";
import { ResultButtons } from "./components/ResultButtons/ResultButtons";

type ResultsProps = {
  setMode: React.Dispatch<React.SetStateAction<QuizMode>>;
  numCorrect: number;
  quizId: string;
  classId: string;
  time: number;
  quizLength: number;
};

export const Results = ({
  setMode,
  numCorrect,
  classId,
  quizId,
  time,
  quizLength,
}: ResultsProps) => {
  const formatTime = (seconds: number) => {
    const timeMins = Math.floor(seconds / 60);
    const timeSecs = seconds % 60;

    return `${timeMins}:${timeSecs < 10 ? `0${timeSecs}` : timeSecs}`;
  };

  return (
    <div className={shared.contentWrapper} style={{ width: "fit-content" }}>
      <div>
        <h2 className={shared.quizTitle}>Quiz Results</h2>
        <p className={styles.resultTxt}>Nice Work, You Crushed This!</p>
      </div>

      <div className={styles.contentWrapper}>
        <div className={styles.resultsWrapper}>
          <ResultsCircle numCorrect={numCorrect} length={quizLength} />

          <div>
            <p className={styles.infoTitle}>Performance Summary</p>

            <div className={styles.infoTxtsWrapper}>
              <div className={styles.infoTxtWrapper}>
                <p className={styles.infoTxt}>Time</p>
                <p className={`${styles.infoTxt} ${styles.infoValue}`}>
                  {formatTime(time)}
                </p>
              </div>
              <div className={styles.infoTxtWrapper}>
                <p className={styles.infoTxt}>Avg / Question</p>
                <p className={`${styles.infoTxt} ${styles.infoValue}`}>
                  {formatTime(Math.ceil(time / quizLength))}
                </p>
              </div>
            </div>
          </div>
        </div>

        <ResultButtons setMode={setMode} quizId={quizId} classId={classId} />
      </div>
    </div>
  );
};
