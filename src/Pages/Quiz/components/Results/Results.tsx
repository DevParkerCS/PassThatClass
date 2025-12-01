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
    if (seconds > 60) {
      const timeMins = Math.floor(seconds / 60);
      const timeSecs = seconds % 60;

      return `${timeMins}m ${timeSecs}s`;
    } else {
      return `${seconds}s`;
    }
  };

  return (
    <div className={shared.contentWrapper} style={{ width: "fit-content" }}>
      <div>
        <h2 className={shared.quizTitle}>Quiz Results</h2>
        <p className={styles.resultTxt}>Nice Work, You Crushed This!</p>
      </div>

      <div className={styles.resultsWrapper}>
        <ResultsCircle numCorrect={numCorrect} length={quizLength} />

        <div className={styles.infoTxtWrapper}>
          <p className={styles.infoTitle}>Performance Summary</p>

          <p className={styles.infoTxt}>Time Taken: {formatTime(time)}</p>
          <p className={styles.infoTxt}>
            Avg Per Question: {formatTime(Math.ceil(time / quizLength))}
          </p>
        </div>

        <ResultButtons setMode={setMode} quizId={quizId} classId={classId} />
      </div>
    </div>
  );
};
