import { QuizMode } from "../../QuizContent";
import styles from "./Results.module.scss";
import shared from "../../Shared/styles.module.scss";
import { MockQuiz } from "../../../../mock";
import { ResultsCircle } from "./components/ResultsCircle/ResultsCircle";
import { ResultButtons } from "./components/ResultButtons/ResultButtons";

type ResultsProps = {
  setMode: React.Dispatch<React.SetStateAction<QuizMode>>;
  numCorrect: number;
};

export const Results = ({ setMode, numCorrect }: ResultsProps) => {
  return (
    <div className={shared.contentWrapper}>
      <div>
        <h2 className={shared.quizTitle}>Quiz Results</h2>
        <p className={styles.resultTxt}>Nice Work, You Crushed This!</p>
      </div>

      <div className={styles.resultsWrapper}>
        <ResultsCircle numCorrect={numCorrect} />

        <div className={styles.infoTxtWrapper}>
          <p className={styles.infoTitle}>Performance Summary</p>

          <p className={styles.infoTxt}>Time Taken: 4m 32s</p>
          <p className={styles.infoTxt}>Avg Per Question: 27s</p>
          <p className={styles.infoTxt}>Overall Avg Score: 75%</p>
        </div>

        <ResultButtons setMode={setMode} />
      </div>
    </div>
  );
};
