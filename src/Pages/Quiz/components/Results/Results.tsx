import { QuizMode } from "../../QuizContent";
import styles from "./Results.module.scss";
import shared from "../../Shared/styles.module.scss";
import { ResultsCircle } from "./components/ResultsCircle/ResultsCircle";
import { ResultButtons } from "./components/ResultButtons/ResultButtons";
import { Breadcrumb } from "../../../../components/Breadcrumb/Breadcrumb";
import { useEffect, useState } from "react";
import { useDataContext } from "../../../../context/DataContext/DataContext";

type ResultsProps = {
  setMode: React.Dispatch<React.SetStateAction<QuizMode>>;
  numCorrect: number;
  quizId: string;
  classId: string;
};

export const Results = ({
  setMode,
  numCorrect,
  classId,
  quizId,
}: ResultsProps) => {
  const data = useDataContext();
  const [questions, setQuestions] = useState(data.questionsById[quizId]);

  if (questions.length === 0) {
    return <div>Error Loading Results</div>;
  }

  return (
    <div className={shared.contentWrapper} style={{ width: "fit-content" }}>
      <div>
        <h2 className={shared.quizTitle}>Quiz Results</h2>
        <p className={styles.resultTxt}>Nice Work, You Crushed This!</p>
      </div>

      <Breadcrumb />

      <div className={styles.resultsWrapper}>
        <ResultsCircle numCorrect={numCorrect} length={questions.length} />

        <div className={styles.infoTxtWrapper}>
          <p className={styles.infoTitle}>Performance Summary</p>

          <p className={styles.infoTxt}>Time Taken: 4m 32s</p>
          <p className={styles.infoTxt}>Avg Per Question: 27s</p>
          <p className={styles.infoTxt}>Overall Avg Score: 75%</p>
        </div>

        <ResultButtons setMode={setMode} classId={classId} />
      </div>
    </div>
  );
};
